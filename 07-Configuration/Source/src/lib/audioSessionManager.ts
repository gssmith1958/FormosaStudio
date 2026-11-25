/**
 * FormosaStudio (FORM) — Unified iPad mini 6 Safari & Linux Chrome Audio Session Manager (DSP-2 / FORM-DEC-005)
 * Resolves iPadOS audio stalls & WebM playback failures across Stage 0 Tone Lab & Speaking Pitch Studio:
 *   1. Synchronous AudioContext unlock inside user tap BEFORE await getUserMedia()
 *   2. 2x anti-aliased YIN (detectPitchYinDownsampled2x) on 2048-sample buffers every 90 ms (~8x less CPU)
 *   3. MediaRecorder.isTypeSupported MIME selection (audio/mp4 on iPad Safari vs audio/webm on Chromium)
 *   4. Clean stream track teardown inside MediaRecorder.onstop (+ 600 ms fallback) + 180 ms speaker handoff settle
 *   5. Cached voiceschanged zh-TW voice selection + guarded speechSynthesis.cancel() (~50 ms tick guard)
 */

import {
  PitchFrameResult,
  detectPitchYinDownsampled2x,
  generateReferenceToneWaveform,
  getReferenceChaoContour,
  MandarinToneId,
} from './pitchContourEngine.ts';

let sharedAudioCtx: AudioContext | null = null;
let cachedVoices: SpeechSynthesisVoice[] = [];
let voicesListenerBound = false;
let speakSeqId = 0;

function ensureVoicesCached(): SpeechSynthesisVoice[] {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return [];
  if (!voicesListenerBound) {
    voicesListenerBound = true;
    const refresh = () => {
      try {
        cachedVoices = window.speechSynthesis.getVoices() || [];
      } catch {
        cachedVoices = [];
      }
    };
    refresh();
    if (typeof window.speechSynthesis.addEventListener === 'function') {
      window.speechSynthesis.addEventListener('voiceschanged', refresh);
    } else {
      window.speechSynthesis.onvoiceschanged = refresh;
    }
  }
  if (cachedVoices.length === 0) {
    try {
      cachedVoices = window.speechSynthesis.getVoices() || [];
    } catch {
      cachedVoices = [];
    }
  }
  return cachedVoices;
}

/**
 * Must be called synchronously inside a user click/tap handler before any await.
 */
export function unlockSharedAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  const Ctx =
    window.AudioContext ||
    (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!Ctx) return null;
  if (!sharedAudioCtx) {
    sharedAudioCtx = new Ctx();
  }
  if (sharedAudioCtx.state === 'suspended') {
    void sharedAudioCtx.resume().catch(() => {});
  }
  return sharedAudioCtx;
}

export function getTaiwanVoicesInfo(): {
  hasTaiwanVoice: boolean;
  preferredVoiceName: string | null;
  allZhVoices: string[];
  isLikelyIosSafari: boolean;
} {
  const voices = ensureVoicesCached();
  const twVoice =
    voices.find((v) => /zh[-_]TW/i.test(v.lang) && /meijia|taiwan|國語/i.test(v.name)) ||
    voices.find((v) => /zh[-_]TW/i.test(v.lang)) ||
    voices.find((v) => /zh[-_]Hant/i.test(v.lang));
  const allZhVoices = voices.filter((v) => /^zh/i.test(v.lang)).map((v) => `${v.name} (${v.lang})`);
  const ua = typeof navigator !== 'undefined' ? navigator.userAgent : '';
  const isLikelyIosSafari = /iPad|iPhone|iPod/i.test(ua) || (ua.includes('Macintosh') && typeof document !== 'undefined' && 'ontouchend' in document);
  return {
    hasTaiwanVoice: Boolean(twVoice),
    preferredVoiceName: twVoice ? `${twVoice.name} (${twVoice.lang})` : null,
    allZhVoices,
    isLikelyIosSafari,
  };
}

/**
 * Guarded zh-TW TTS playback safe on iPadOS Safari (avoids same-tick cancel+speak drop bug).
 */
export function speakTaiwaneseSafe(text: string, rate: number = 0.92, onEnd?: () => void): void {
  if (typeof window === 'undefined' || !('speechSynthesis' in window) || !text.trim()) {
    onEnd?.();
    return;
  }
  const myId = ++speakSeqId;
  const voices = ensureVoicesCached();
  const synth = window.speechSynthesis;

  const fire = () => {
    if (myId !== speakSeqId) return;
    try {
      const utter = new SpeechSynthesisUtterance(text);
      utter.lang = 'zh-TW';
      utter.rate = rate;
      const twVoice =
        voices.find((v) => /zh[-_]TW/i.test(v.lang) && /meijia|taiwan|國語/i.test(v.name)) ||
        voices.find((v) => /zh[-_]TW/i.test(v.lang)) ||
        voices.find((v) => /zh[-_]Hant/i.test(v.lang));
      if (twVoice) utter.voice = twVoice;
      if (onEnd) {
        utter.onend = onEnd;
        utter.onerror = onEnd;
      }
      synth.speak(utter);
    } catch {
      onEnd?.();
    }
  };

  try {
    if (synth.speaking || synth.pending) {
      synth.cancel();
      window.setTimeout(fire, 55);
    } else {
      fire();
    }
  } catch {
    onEnd?.();
  }
}

export function stopTaiwaneseSpeech(): void {
  speakSeqId++;
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    try {
      if (window.speechSynthesis.speaking || window.speechSynthesis.pending) {
        window.speechSynthesis.cancel();
      }
    } catch {
      // ignore
    }
  }
}

/**
 * Feature-detects the cleanest MediaRecorder MIME type (Safari MP4/AAC vs Chromium WebM/Opus).
 */
export function selectSupportedRecorderMimeType(): string {
  if (typeof MediaRecorder === 'undefined' || typeof MediaRecorder.isTypeSupported !== 'function') {
    return '';
  }
  const ua = typeof navigator !== 'undefined' ? navigator.userAgent : '';
  const isSafari = /Safari/i.test(ua) && !/Chrome|Chromium|Edg/i.test(ua);
  const order = isSafari
    ? ['audio/mp4;codecs=mp4a.40.2', 'audio/mp4', 'audio/webm;codecs=opus', 'audio/webm']
    : ['audio/webm;codecs=opus', 'audio/webm', 'audio/mp4;codecs=mp4a.40.2', 'audio/mp4'];
  for (const mime of order) {
    try {
      if (MediaRecorder.isTypeSupported(mime)) return mime;
    } catch {
      // continue
    }
  }
  return '';
}

export function playToneReferenceHum(
  tone: MandarinToneId,
  floorHz: number = 115,
  ceilingHz: number = 270,
  durationSec: number = 0.5
): void {
  const ctx = unlockSharedAudioContext();
  if (!ctx) return;
  try {
    const samples = generateReferenceToneWaveform({
      chaoContour: getReferenceChaoContour(tone),
      durationSec,
      sampleRate: ctx.sampleRate,
      speakerFloorHz: floorHz,
      speakerCeilingHz: ceilingHz,
    });
    const buf = ctx.createBuffer(1, samples.length, ctx.sampleRate);
    buf.getChannelData(0).set(samples);
    const src = ctx.createBufferSource();
    src.buffer = buf;
    src.connect(ctx.destination);
    src.start();
  } catch {
    // ignore in headless browsers
  }
}

export interface MicCaptureResult {
  chaoFrames: number[];
  lastHz: number | null;
  audioBlob: Blob | null;
  audioUrl: string | null;
  mimeType: string;
  avgYinMs: number;
}

export interface ActiveMicHandle {
  stop: () => Promise<MicCaptureResult>;
}

/**
 * Starts a clean iPad-safe live mic pitch + MediaRecorder capture session.
 * Unlocks AudioContext synchronously, keeps fftSize=2048 before 2x anti-aliased YIN at 90 ms cadence,
 * and tears down tracks cleanly inside MediaRecorder.onstop (+ 180 ms settle for iOS speaker recovery).
 */
export async function startMicToneSession(options: {
  floorHz: number;
  ceilingHz: number;
  maxDurationMs?: number;
  onFrame?: (frame: PitchFrameResult, totalVoiced: number, micLevelPct: number) => void;
  onAutoStop?: (result: MicCaptureResult) => void;
}): Promise<ActiveMicHandle> {
  // 1. Synchronously unlock AudioContext & cancel any active TTS BEFORE awaiting getUserMedia
  const ctx = unlockSharedAudioContext();
  stopTaiwaneseSpeech();

  if (!ctx || typeof navigator === 'undefined' || !navigator.mediaDevices?.getUserMedia) {
    throw new Error('Microphone API unavailable (requires HTTPS or localhost).');
  }

  // Brief settle if TTS just stopped on iOS Safari
  await new Promise((r) => window.setTimeout(r, 90));

  const stream = await navigator.mediaDevices.getUserMedia({
    audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true },
  });
  if (ctx.state === 'suspended') await ctx.resume();

  const source = ctx.createMediaStreamSource(stream);
  const analyser = ctx.createAnalyser();
  analyser.fftSize = 2048; // Kept at 2048 so 2x downsampling yields 1024 samples (>= 2 periods at 75 Hz)
  source.connect(analyser);

  const chunks: Blob[] = [];
  const preferredMime = selectSupportedRecorderMimeType();
  let recorder: MediaRecorder | null = null;
  let actualMime = preferredMime;
  if (typeof MediaRecorder !== 'undefined') {
    try {
      recorder = preferredMime ? new MediaRecorder(stream, { mimeType: preferredMime }) : new MediaRecorder(stream);
      actualMime = recorder.mimeType || preferredMime || 'audio/mp4';
      recorder.ondataavailable = (ev) => {
        if (ev.data && ev.data.size > 0) chunks.push(ev.data);
      };
      recorder.start();
    } catch {
      recorder = null;
    }
  }

  const pcmBuf = new Float32Array(analyser.fftSize);
  const chaoFrames: number[] = [];
  let lastHz: number | null = null;
  let yinTotalMs = 0;
  let yinCalls = 0;
  let stopped = false;
  let stopPromise: Promise<MicCaptureResult> | null = null;

  const maxMs = options.maxDurationMs ?? 3200;
  const startedAt = Date.now();

  const stop = (): Promise<MicCaptureResult> => {
    if (stopPromise) return stopPromise;
    stopped = true;
    window.clearInterval(timerId);
    try {
      source.disconnect();
    } catch {
      // ignore
    }

    stopPromise = new Promise<MicCaptureResult>((resolve) => {
      let settled = false;
      const finalize = (blob: Blob | null) => {
        if (settled) return;
        settled = true;
        // Stop mic tracks ONLY after MediaRecorder.onstop has flushed data (prevents 0-byte Safari MP4)
        stream.getTracks().forEach((t) => t.stop());
        const audioUrl = blob && blob.size > 0 ? URL.createObjectURL(blob) : null;
        const avgYinMs = yinCalls > 0 ? Number((yinTotalMs / yinCalls).toFixed(2)) : 0;
        // Brief 180 ms settle so iOS exits PlayAndRecord earpiece mode cleanly before TTS replay
        window.setTimeout(() => {
          resolve({
            chaoFrames: [...chaoFrames],
            lastHz,
            audioBlob: blob,
            audioUrl,
            mimeType: actualMime,
            avgYinMs,
          });
        }, 180);
      };

      if (recorder && recorder.state !== 'inactive') {
        const safetyTimer = window.setTimeout(() => {
          const fallbackBlob = chunks.length > 0 ? new Blob(chunks, { type: actualMime || 'audio/mp4' }) : null;
          finalize(fallbackBlob);
        }, 600);
        recorder.onstop = () => {
          window.clearTimeout(safetyTimer);
          const blob = chunks.length > 0 ? new Blob(chunks, { type: recorder?.mimeType || actualMime || 'audio/mp4' }) : null;
          finalize(blob);
        };
        try {
          recorder.stop();
        } catch {
          window.clearTimeout(safetyTimer);
          finalize(null);
        }
      } else {
        finalize(null);
      }
    });

    return stopPromise;
  };

  const timerId = window.setInterval(() => {
    if (stopped) return;
    analyser.getFloatTimeDomainData(pcmBuf);
    const t0 = performance.now();
    const frame = detectPitchYinDownsampled2x(pcmBuf, ctx.sampleRate, options.floorHz, options.ceilingHz, 0.004, 0.24);
    yinTotalMs += performance.now() - t0;
    yinCalls += 1;

    const micLevelPct = Math.min(100, Math.round(frame.rms * 650));
    if (frame.f0Hz !== null && frame.chaoLevel !== null) {
      lastHz = frame.f0Hz;
      chaoFrames.push(frame.chaoLevel);
    }
    options.onFrame?.(frame, chaoFrames.length, micLevelPct);

    if (chaoFrames.length >= 36 || Date.now() - startedAt >= maxMs) {
      void stop().then((res) => options.onAutoStop?.(res));
    }
  }, 90);

  return { stop };
}

/**
 * Plays a recorded audio Blob via WebAudio decodeAudioData (best on iPadOS Safari) with HTMLAudio fallback,
 * then smoothly triggers the native zh-TW comparison voice.
 */
export async function playRecordedThenNative(
  audioBlob: Blob | null,
  audioUrl: string | null,
  nativeText: string,
  nativeRate: number = 0.85
): Promise<void> {
  const ctx = unlockSharedAudioContext();
  const playNative = () => window.setTimeout(() => speakTaiwaneseSafe(nativeText, nativeRate), 200);

  if (audioBlob && ctx) {
    try {
      const arrayBuf = await audioBlob.arrayBuffer();
      const decoded = await ctx.decodeAudioData(arrayBuf.slice(0));
      const src = ctx.createBufferSource();
      src.buffer = decoded;
      src.connect(ctx.destination);
      src.onended = playNative;
      src.start();
      return;
    } catch {
      // Fall through to HTMLAudioElement playback
    }
  }

  if (audioUrl) {
    try {
      const el = new Audio(audioUrl);
      el.onended = playNative;
      el.onerror = playNative;
      await el.play();
      return;
    } catch {
      // Fall through to native voice
    }
  }
  playNative();
}

export interface AudioSelfTestReport {
  sampleRateHz: number;
  yinFrameMs: number;
  yinErrorHz: number;
  detectedVoice: string | null;
  hasTaiwanVoice: boolean;
  recorderMime: string;
  isLikelyIosSafari: boolean;
  ipadTip: string;
}

/**
 * Runs a fast 1-click diagnostic benchmark of YIN DSP speed, zh-TW TTS availability, and Safari MIME support.
 */
export function runAudioDiagnostics(): AudioSelfTestReport {
  const ctx = unlockSharedAudioContext();
  const sr = ctx?.sampleRate || 48000;
  const synthetic = generateReferenceToneWaveform({ constantF0Hz: 200, durationSec: 0.06, sampleRate: sr });
  const slice = synthetic.length >= 2048 ? synthetic.subarray(0, 2048) : synthetic;
  const t0 = performance.now();
  const res = detectPitchYinDownsampled2x(slice, sr, 100, 300, 0.002, 0.15);
  const yinFrameMs = Number((performance.now() - t0).toFixed(2));
  const yinErrorHz = res.f0Hz !== null ? Number(Math.abs(res.f0Hz - 200).toFixed(2)) : 999;

  const voiceInfo = getTaiwanVoicesInfo();
  const recorderMime = selectSupportedRecorderMimeType() || 'browser-default';
  const ipadTip = voiceInfo.hasTaiwanVoice
    ? `Taiwanese voice ready (${voiceInfo.preferredVoiceName}).`
    : 'On iPadOS, enable an offline Taiwanese voice in Settings → Accessibility → Spoken Content → Voices → Chinese → Meijia (Taiwan).';

  return {
    sampleRateHz: sr,
    yinFrameMs,
    yinErrorHz,
    detectedVoice: voiceInfo.preferredVoiceName,
    hasTaiwanVoice: voiceInfo.hasTaiwanVoice,
    recorderMime,
    isLikelyIosSafari: voiceInfo.isLikelyIosSafari,
    ipadTip,
  };
}
