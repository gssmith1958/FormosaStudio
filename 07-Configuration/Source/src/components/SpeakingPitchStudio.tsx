/**
 * FormosaStudio (FORM) — Studio 5: Offline Pitch-Contour (F0) Visualizer, Tone Sandhi & Minimal-Pair Coach
 * Traces to: FORM-REQ-0015, FORM-REQ-0016, FORM-REQ-0021, FORM-DEP-UX-001
 */
import React, { useEffect, useRef, useState } from 'react';
import {
  MandarinToneId,
  RETROFLEX_MINIMAL_PAIRS,
  TONE_SANDHI_DRILL_PHRASES,
  ToneContourMatchReport,
  ToneSandhiDrillPhrase,
  computeToneContourMatchScore,
  detectPitchYinOffline,
  generateReferenceToneWaveform,
  getReferenceChaoContour,
  playFloat32Waveform,
} from '../lib/pitchContourEngine.ts';
import { UserProgressState, recordWordPractice } from '../lib/progressStore.ts';
import {
  getStudioBusState,
  setFocusedContextItem,
  subscribeStudioBus,
} from '../lib/studioContextBus.ts';
import {
  CrossStudioActionPills,
  StudioHeaderBanner,
  StudioModeOption,
  StudioModeSwitcher,
  StylusButton,
  ToneBadge,
} from './uiPrimitives.tsx';
import { RubyText } from './RubyText.tsx';
type Studio5SubTab = 'pitch_lab' | 'sandhi_coach' | 'minimal_pairs';
const SUB_TABS: StudioModeOption<Studio5SubTab>[] = [
  { id: 'pitch_lab', labelZh: '雙曲線 F0 聲調實驗室', labelEn: 'Dual-Curve F0 Pitch Lab', badge: '75–450 Hz' },
  { id: 'sandhi_coach', labelZh: '臺灣連讀變調教練', labelEn: 'Tone Sandhi Phrase Coach', badge: '8 組變調' },
  { id: 'minimal_pairs', labelZh: '捲舌 vs 平舌最小對比', labelEn: 'ㄓㄔㄕㄖ vs ㄗㄘㄙ Coach', badge: '10 組對比' },
];
const SINGLE_TONE_PRESETS: {
  id: MandarinToneId;
  badgeTone: 1 | 2 | 3 | 4 | 5;
  labelZh: string;
  labelEn: string;
  exampleChar: string;
  exampleZhuyin: string;
  exampleEnglish: string;
}[] = [
  { id: 1, badgeTone: 1, labelZh: '一聲 [55]', labelEn: 'Tone 1 High Flat', exampleChar: '媽', exampleZhuyin: 'ㄇㄚ', exampleEnglish: 'mother' },
  { id: 2, badgeTone: 2, labelZh: '二聲 [35]', labelEn: 'Tone 2 Rising', exampleChar: '麻', exampleZhuyin: 'ㄇㄚˊ', exampleEnglish: 'hemp / numb' },
  { id: '3_taiwan_half', badgeTone: 3, labelZh: '臺灣半上 [21]', labelEn: 'Taiwan Tone 3 Low-Dipping', exampleChar: '馬', exampleZhuyin: 'ㄇㄚˇ', exampleEnglish: 'horse (natural spoken)' },
  { id: 3, badgeTone: 3, labelZh: '三聲單字 [214]', labelEn: 'Tone 3 Full Citation', exampleChar: '馬', exampleZhuyin: 'ㄇㄚˇ', exampleEnglish: 'horse (citation)' },
  { id: 4, badgeTone: 4, labelZh: '四聲 [51]', labelEn: 'Tone 4 Sharp Falling', exampleChar: '罵', exampleZhuyin: 'ㄇㄚˋ', exampleEnglish: 'to scold' },
  { id: 5, badgeTone: 5, labelZh: '輕聲 [·]', labelEn: 'Neutral Tone', exampleChar: '嗎', exampleZhuyin: '˙ㄇㄚ', exampleEnglish: 'question particle' },
];
export interface SpeakingPitchStudioProps {
  progress: UserProgressState;
  onUpdateProgress: (next: UserProgressState) => void;
  onSpeak?: (text: string) => void;
}
export const SpeakingPitchStudio: React.FC<SpeakingPitchStudioProps> = ({
  progress,
  onUpdateProgress,
  onSpeak,
}) => {
  const [subTab, setSubTab] = useState<Studio5SubTab>('pitch_lab');
  const [selectedTonePreset, setSelectedTonePreset] = useState<MandarinToneId>('3_taiwan_half');
  const [selectedSandhiId, setSelectedSandhiId] = useState<string>(TONE_SANDHI_DRILL_PHRASES[0].id);
  const [speakerRange, setSpeakerRange] = useState<{ floorHz: number; ceilingHz: number }>({
    floorHz: 100, ceilingHz: 260,
  });
  const [userChaoCurve, setUserChaoCurve] = useState<number[] | null>(null);
  const [liveHzReadout, setLiveHzReadout] = useState<number | null>(null);
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [micStatus, setMicStatus] = useState<string>('Ready — click Record, speak the phrase, then click Stop.');
  const [micLevelPct, setMicLevelPct] = useState<number>(0);
  const [lastRecordedBuffer, setLastRecordedBuffer] = useState<Float32Array | null>(null);
  const [recordedAudioUrl, setRecordedAudioUrl] = useState<string | null>(null);
  const [selectedPairIdx, setSelectedPairIdx] = useState<number>(0);
  const [listeningTargetIsRetroflex, setListeningTargetIsRetroflex] = useState<boolean>(true);
  const [pairPromptActive, setPairPromptActive] = useState<boolean>(false);
  const [pairScore, setPairScore] = useState<{ ok: number; total: number }>({ ok: 0, total: 0 });
  const [listeningQuizResult, setListeningQuizResult] = useState<string | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const intervalRef = useRef<number | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);
  const capturedChaoRef = useRef<number[]>([]);
  useEffect(() => () => {
    if (intervalRef.current !== null) window.clearInterval(intervalRef.current);
    if (mediaRecorderRef.current?.state === 'recording') mediaRecorderRef.current.stop();
    streamRef.current?.getTracks().forEach((t) => t.stop());
  }, []);
  const activePreset =
    SINGLE_TONE_PRESETS.find((p) => p.id === selectedTonePreset) || SINGLE_TONE_PRESETS[0];
  const activeSandhi: ToneSandhiDrillPhrase =
    TONE_SANDHI_DRILL_PHRASES.find((s) => s.id === selectedSandhiId) || TONE_SANDHI_DRILL_PHRASES[0];
  const targetCurve =
    subTab === 'sandhi_coach'
      ? activeSandhi.targetChaoCurve
      : getReferenceChaoContour(selectedTonePreset, 20);
  const matchReport: ToneContourMatchReport | null = userChaoCurve
    ? computeToneContourMatchScore(targetCurve, userChaoCurve)
    : null;
  // Sync with Cross-Studio Handoff Bus
  useEffect(() => {
    const syncBus = () => {
      const bus = getStudioBusState();
      const targetText = bus.activeHandoff?.targetText;
      if (targetText) {
        const sandhiMatch = TONE_SANDHI_DRILL_PHRASES.find((s) => s.hanzi === targetText);
        if (sandhiMatch) {
          setSelectedSandhiId(sandhiMatch.id);
          setSubTab('sandhi_coach');
          setUserChaoCurve(null);
        }
      }
    };
    syncBus();
    return subscribeStudioBus(syncBus);
  }, []);
  useEffect(() => {
    const focusText = subTab === 'sandhi_coach' ? activeSandhi.hanzi : activePreset.exampleChar;
    const focusZhuyin = subTab === 'sandhi_coach' ? activeSandhi.spokenSandhiZhuyin : activePreset.exampleZhuyin;
    const focusEn = subTab === 'sandhi_coach' ? activeSandhi.english : activePreset.exampleEnglish;
    setFocusedContextItem({
      text: focusText, zhuyin: focusZhuyin, english: focusEn, sourceStudio: 'speaking',
      sourceLabel: 'Speaking & Pitch Lab',
    });
  }, [subTab, selectedTonePreset, selectedSandhiId]);
  const commitCapturedContour = (contour: number[]) => {
    setUserChaoCurve(contour);
    const report = computeToneContourMatchScore(targetCurve, contour);
    const itemWord = subTab === 'sandhi_coach' ? activeSandhi.hanzi : activePreset.exampleChar;
    const itemZhuyin = subTab === 'sandhi_coach' ? activeSandhi.spokenSandhiZhuyin : activePreset.exampleZhuyin;
    const itemEn = subTab === 'sandhi_coach' ? activeSandhi.english : activePreset.exampleEnglish;
    onUpdateProgress(
      recordWordPractice(
        progress,
        { word: itemWord, zhuyin: itemZhuyin, english: itemEn },
        report.passed,
        report.matchScore >= 88 ? 4 : report.matchScore >= 72 ? 3 : 2
      )
    );
    return report;
  };
  const handleSimulateCapture = (quality: 'excellent' | 'flat_error') => {
    const simulatedContour =
      quality === 'excellent'
        ? targetCurve.map((v, i) => Number(Math.max(1, Math.min(5, v + Math.sin(i) * 0.14)).toFixed(2)))
        : new Array(20).fill(3.1);
    const wave = generateReferenceToneWaveform({
      chaoContour: simulatedContour, durationSec: 0.5, sampleRate: 44100, speakerFloorHz: speakerRange.floorHz,
      speakerCeilingHz: speakerRange.ceilingHz,
    });
    if (recordedAudioUrl) URL.revokeObjectURL(recordedAudioUrl);
    setRecordedAudioUrl(null);
    setLastRecordedBuffer(wave);
    const windowSize = 1800;
    const step = Math.floor((wave.length - windowSize) / 19);
    const extractedChao: number[] = [];
    let lastValidHz: number | null = null;
    for (let w = 0; w < 20; w++) {
      const start = Math.max(0, w * step);
      const res = detectPitchYinOffline(wave.subarray(start, start + windowSize), 44100, speakerRange.floorHz, speakerRange.ceilingHz);
      if (res.chaoLevel !== null) {
        extractedChao.push(res.chaoLevel);
        lastValidHz = res.f0Hz;
      } else {
        extractedChao.push(simulatedContour[w]);
      }
    }
    if (lastValidHz !== null) setLiveHzReadout(lastValidHz);
    // Preview only — simulated captures never write real FSRS mastery credit
    setUserChaoCurve(extractedChao);
    const previewReport = computeToneContourMatchScore(targetCurve, extractedChao);
    setMicStatus(`Preview only (${quality === 'excellent' ? 'native match' : 'monotone error'} · ${previewReport.matchScore}%). Record your own voice for FSRS credit.`);
  };
  const stopLiveMicCapture = () => {
    if (intervalRef.current !== null) { window.clearInterval(intervalRef.current); intervalRef.current = null; }
    if (mediaRecorderRef.current?.state === 'recording') mediaRecorderRef.current.stop();
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    setIsRecording(false);
    setMicLevelPct(0);
    const frames = capturedChaoRef.current;
    if (frames.length >= 2) {
      const report = commitCapturedContour([...frames]);
      setMicStatus(`Captured ${frames.length} voiced frames — Tone Match: ${report.matchScore}%. Click Replay to hear your voice.`);
    } else {
      setMicStatus('Mic was silent or too quiet — speak clearly near your microphone and try again.');
    }
  };
  const handleToggleLiveMic = async () => {
    if (isRecording) { stopLiveMicCapture(); return; }
    if (typeof navigator === 'undefined' || !navigator.mediaDevices?.getUserMedia) {
      setMicStatus('Browser microphone API unavailable (requires localhost/HTTPS). Use Simulate buttons to test.');
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: false, noiseSuppression: true, autoGainControl: true } });
      streamRef.current = stream;
      capturedChaoRef.current = [];
      recordedChunksRef.current = [];
      if (typeof MediaRecorder !== 'undefined') {
        const rec = new MediaRecorder(stream);
        rec.ondataavailable = (ev) => { if (ev.data.size > 0) recordedChunksRef.current.push(ev.data); };
        rec.onstop = () => {
          if (recordedChunksRef.current.length > 0) {
            const nextUrl = URL.createObjectURL(new Blob(recordedChunksRef.current, { type: rec.mimeType || 'audio/webm' }));
            setRecordedAudioUrl((prev) => { if (prev) URL.revokeObjectURL(prev); return nextUrl; });
          }
        };
        rec.start();
        mediaRecorderRef.current = rec;
      }
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = audioCtxRef.current || new AudioCtx();
      audioCtxRef.current = ctx;
      if (ctx.state === 'suspended') await ctx.resume();
      const source = ctx.createMediaStreamSource(stream);
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 2048;
      source.connect(analyser);
      const tempBuf = new Float32Array(analyser.fftSize);
      const startedAt = Date.now();
      setIsRecording(true);
      setMicStatus('Listening… speak the character or phrase now, then click Stop.');
      intervalRef.current = window.setInterval(() => {
        analyser.getFloatTimeDomainData(tempBuf);
        const frame = detectPitchYinOffline(tempBuf, ctx.sampleRate, speakerRange.floorHz, speakerRange.ceilingHz, 0.004, 0.22);
        setMicLevelPct(Math.min(100, Math.round(frame.rms * 650)));
        if (frame.f0Hz !== null && frame.chaoLevel !== null) {
          setLiveHzReadout(frame.f0Hz);
          capturedChaoRef.current.push(frame.chaoLevel);
          if (capturedChaoRef.current.length >= 2) setUserChaoCurve([...capturedChaoRef.current]);
          setMicStatus(`Capturing voice… ${capturedChaoRef.current.length} voiced frames (${frame.f0Hz} Hz)`);
        }
        if (capturedChaoRef.current.length >= 40 || Date.now() - startedAt > 4500) stopLiveMicCapture();
      }, 45);
    } catch (err) {
      setMicStatus(`Microphone unavailable or permission denied (${err instanceof Error ? err.message : 'check browser permissions'}).`);
    }
  };
  const handleReplayComparison = () => {
    const text = subTab === 'sandhi_coach' ? activeSandhi.hanzi : activePreset.exampleChar;
    const playNative = () => {
      if (onSpeak) { onSpeak(text); return; }
      const nativeWave = generateReferenceToneWaveform({ chaoContour: targetCurve, durationSec: 0.45, speakerFloorHz: speakerRange.floorHz, speakerCeilingHz: speakerRange.ceilingHz });
      void playFloat32Waveform(nativeWave, 44100, audioCtxRef.current).then((c) => { audioCtxRef.current = c; });
    };
    if (recordedAudioUrl) {
      const audio = new Audio(recordedAudioUrl);
      audio.onended = () => window.setTimeout(playNative, 260);
      audio.onerror = () => playNative();
      audio.play().catch(() => playNative());
      setMicStatus('Playing your recorded voice → followed by native Taiwanese reference…');
      return;
    }
    const userWave = lastRecordedBuffer || generateReferenceToneWaveform({ chaoContour: userChaoCurve || targetCurve, durationSec: 0.45, speakerFloorHz: speakerRange.floorHz, speakerCeilingHz: speakerRange.ceilingHz });
    void playFloat32Waveform(userWave, 44100, audioCtxRef.current).then((c) => { audioCtxRef.current = c; });
    window.setTimeout(playNative, 560);
  };
  const activePair = RETROFLEX_MINIMAL_PAIRS[selectedPairIdx] || RETROFLEX_MINIMAL_PAIRS[0];
  // Build SVG polyline strings for Dual-Curve Chao 1..5 Visualizer
  const svgW = 560;
  const svgH = 220;
  const padX = 44;
  const padY = 24;
  const plotW = svgW - padX * 2;
  const plotH = svgH - padY * 2;
  const toSvgPoints = (curve: number[]) =>
    curve
      .map((chao, idx) => {
        const x = padX + (idx / Math.max(1, curve.length - 1)) * plotW;
        const y = padY + ((5.0 - chao) / 4.0) * plotH;
        return `${x.toFixed(1)},${y.toFixed(1)}`;
      })
      .join(' ');
  return (
    <div className="space-y-5">
      <StudioHeaderBanner
        studioId="speaking"
        titleZh="發音聲調教練"
        titleEn="Live Tone Pitch Coach & Listening Lab"
        subtitle="Record your voice offline to compare your spoken tone contour (blue) against the native Taiwanese melody (green), practice spoken tone shifts, and train curled (ㄓㄔㄕㄖ) vs. flat (ㄗㄘㄙ) tongue sounds."
        rightSlot={
          <div className="flex flex-wrap items-center gap-2">
            <StylusButton
              variant={speakerRange.floorHz === 95 ? 'primary' : 'secondary'}
              onClick={() => setSpeakerRange({ floorHz: 95, ceilingHz: 220 })}
            >
              <span>🎙️ Low Voice (95–220 Hz)</span>
            </StylusButton>
            <StylusButton
              variant={speakerRange.floorHz === 145 ? 'primary' : 'secondary'}
              onClick={() => setSpeakerRange({ floorHz: 145, ceilingHz: 330 })}
            >
              <span>🎙️ High Voice (145–330 Hz)</span>
            </StylusButton>
          </div>
        }
      />
      <StudioModeSwitcher modes={SUB_TABS} activeMode={subTab} onSelect={setSubTab} />
      {subTab !== 'minimal_pairs' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Left Selector Column: Either Single Tone Presets or Spoken Sandhi Phrases */}
          <div className="lg:col-span-5 bg-slate-900/90 border border-slate-800 rounded-3xl p-5 space-y-4">
            {subTab === 'pitch_lab' ? (
              <>
                <h2 className="text-sm font-extrabold text-emerald-300 uppercase tracking-wider">
                  Chao 5-Level Tone Reference Curves (五度標調法 1–5)
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {SINGLE_TONE_PRESETS.map((p) => (
                    <StylusButton
                      key={String(p.id)}
                      variant={selectedTonePreset === p.id ? 'primary' : 'secondary'}
                      onClick={() => {
                        setSelectedTonePreset(p.id);
                        setUserChaoCurve(null);
                        setLiveHzReadout(null);
                      }}
                      className="justify-between"
                    >
                      <span>{p.labelZh}</span>
                      <span className="text-xs opacity-85">「{p.exampleChar}」</span>
                    </StylusButton>
                  ))}
                </div>
                <div className="bg-slate-950/90 border border-slate-800 rounded-2xl p-4 flex items-center justify-between">
                  <RubyText
                    text={activePreset.exampleChar}
                    zhuyin={activePreset.exampleZhuyin}
                    showPinyinHint={progress.showPinyinHint}
                    size="xl"
                    zhuyinDisplayMode="always"
                  />
                  <div className="text-right space-y-1">
                    <ToneBadge tone={activePreset.badgeTone} />
                    <div className="text-sm font-bold text-white">{activePreset.labelEn}</div>
                    <div className="text-xs text-slate-400">Meaning: {activePreset.exampleEnglish}</div>
                  </div>
                </div>
              </>
            ) : (
              <>
                <h2 className="text-sm font-extrabold text-emerald-300 uppercase tracking-wider">臺灣自然口語連讀變調 · 8 Spoken Sandhi Drills</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {TONE_SANDHI_DRILL_PHRASES.map((s) => (
                    <StylusButton
                      key={s.id}
                      variant={selectedSandhiId === s.id ? 'primary' : 'secondary'}
                      onClick={() => {
                        setSelectedSandhiId(s.id);
                        setUserChaoCurve(null);
                        setLiveHzReadout(null);
                      }}
                      className="justify-between"
                    >
                      <span className="font-extrabold">{s.hanzi}</span>
                      <span className="text-[11px] opacity-80">{s.ruleCategory}</span>
                    </StylusButton>
                  ))}
                </div>
                <div className="bg-slate-950/90 border border-slate-800 rounded-2xl p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <RubyText
                      text={activeSandhi.hanzi}
                      zhuyin={activeSandhi.spokenSandhiZhuyin}
                      pinyin={activeSandhi.pinyin}
                      showPinyinHint={progress.showPinyinHint}
                      size="lg"
                      zhuyinDisplayMode="always"
                    />
                    <span className="px-2.5 py-1 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 text-xs font-bold">{activeSandhi.ruleCategory}</span>
                  </div>
                  <div className="text-xs text-slate-300">
                    Citation: <span className="text-slate-400">{activeSandhi.citationZhuyin}</span> → Spoken Taiwan Sandhi:{' '}
                    <strong className="text-emerald-300">{activeSandhi.spokenSandhiZhuyin}</strong>
                  </div>
                  <p className="text-xs text-amber-200">{activeSandhi.coachingTipEn}</p>
                </div>
              </>
            )}
          </div>
          {/* Right Dual-Curve SVG Visualizer & Self-Monitoring Loop */}
          <div className="lg:col-span-7 bg-slate-900/90 border border-slate-800 rounded-3xl p-5 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <h2 className="text-base font-extrabold text-white">Dual-Curve Chao 1–5 Pitch-Contour Visualizer</h2>
                <p className="text-xs text-slate-400">Emerald = Native Reference Contour · Sky Blue = Your Normalized YIN F0 Trajectory</p>
              </div>
              <div className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-bold text-sky-300">
                Detected F0: {liveHzReadout ? `${liveHzReadout} Hz` : 'Waiting for mic'} · Match:{' '}
                <strong className="text-emerald-300">{matchReport ? `${matchReport.matchScore}%` : '—'}</strong>
              </div>
            </div>
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-3 overflow-x-auto">
              <svg viewBox={`0 0 ${svgW} ${svgH}`} className="w-full h-52">
                {[5, 4, 3, 2, 1].map((lvl) => {
                  const y = padY + ((5 - lvl) / 4) * plotH;
                  return (
                    <g key={lvl}>
                      <line x1={padX} y1={y} x2={svgW - padX} y2={y} stroke="rgba(148, 163, 184, 0.2)" strokeDasharray="4 4" />
                      <text x={12} y={y + 4} fill="#94A3B8" fontSize="11" fontWeight="bold">Chao {lvl}</text>
                    </g>
                  );
                })}
                <polyline fill="none" stroke="#34D399" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" points={toSvgPoints(targetCurve)} />
                {matchReport && (
                  <polyline fill="none" stroke="#38BDF8" strokeWidth="3.5" strokeDasharray="6 4" strokeLinecap="round" strokeLinejoin="round" points={toSvgPoints(matchReport.resampledUser)} />
                )}
              </svg>
            </div>
            <div
              className={`rounded-2xl p-3.5 text-xs sm:text-sm border space-y-2 ${
                !matchReport
                  ? 'bg-slate-950/70 border-slate-800 text-slate-200'
                  : matchReport.passed
                  ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-100'
                  : 'bg-rose-950/60 border-rose-500/50 text-rose-100'
              }`}
            >
              <div>
                {matchReport ? (
                  <><strong>Tone Match Score: {matchReport.matchScore}%</strong> — {matchReport.diagnosticFeedbackEn}</>
                ) : (
                  <strong>Press Record &amp; Speak to compare your live voice contour against the emerald target curve.</strong>
                )}
              </div>
              <div className="flex items-center justify-between gap-3 text-xs opacity-90">
                <span>{micStatus}</span>
                {isRecording && (
                  <div className="w-28 h-2 rounded-full overflow-hidden shrink-0" style={{ backgroundColor: 'var(--fs-surface)' }}>
                    <div className="h-full transition-all duration-75" style={{ width: `${micLevelPct}%`, backgroundColor: 'var(--fs-accent)' }} />
                  </div>
                )}
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <StylusButton variant={isRecording ? 'danger' : 'primary'} onClick={handleToggleLiveMic} >
                <span>{isRecording ? '⏹️ Stop Mic Capture' : '🎤 Record My Voice (Offline YIN F0)'}</span>
              </StylusButton>
              <StylusButton
                variant="amber"
                onClick={handleReplayComparison}
                title="Play your recorded voice immediately followed by the native reference contour"
              >
                <span>🔁 Replay My Voice vs. Native Speaker</span>
              </StylusButton>
              <StylusButton variant="secondary" onClick={() => handleSimulateCapture('excellent')} >
                <span>✨ Simulate Native Match</span>
              </StylusButton>
              <StylusButton variant="ghost" onClick={() => handleSimulateCapture('flat_error')} >
                <span>📉 Simulate Monotone Error</span>
              </StylusButton>
            </div>
            <CrossStudioActionPills
              targetText={subTab === 'sandhi_coach' ? activeSandhi.hanzi : activePreset.exampleChar}
              targetZhuyin={subTab === 'sandhi_coach' ? activeSandhi.spokenSandhiZhuyin : activePreset.exampleZhuyin}
              targetEnglish={subTab === 'sandhi_coach' ? activeSandhi.english : activePreset.exampleEnglish}
              sourceStudio="speaking"
              sourceLabel="Speaking & Pitch Lab"
            />
          </div>
        </div>
      ) : (
        /* Retroflex (ㄓㄔㄕㄖ) vs. Flat Sibilant (ㄗㄘㄙ) Minimal-Pair Coach (FORM-REQ-0016) */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          <div className="lg:col-span-5 bg-slate-900/90 border border-slate-800 rounded-3xl p-5 space-y-3">
            <h2 className="text-sm font-extrabold text-emerald-300 uppercase tracking-wider">
              10 Taiwanese Retroflex (ㄓㄔㄕㄖ) vs. Flat Sibilant (ㄗㄘㄙ) Pairs
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {RETROFLEX_MINIMAL_PAIRS.map((pair, idx) => (
                <StylusButton
                  key={pair.id}
                  variant={selectedPairIdx === idx ? 'primary' : 'secondary'}
                  onClick={() => {
                    setSelectedPairIdx(idx);
                    setListeningQuizResult(null);
                  }}
                  className="justify-between"
                >
                  <span>{pair.retroflexWord} vs. {pair.flatWord}</span>
                  <span className="text-xs opacity-80">{pair.retroflexInitial}/{pair.flatInitial}</span>
                </StylusButton>
              ))}
            </div>
          </div>
          <div className="lg:col-span-7 bg-slate-900/90 border border-slate-800 rounded-3xl p-5 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-slate-950/90 border border-amber-500/40 rounded-2xl p-4 space-y-2">
                <div className="text-xs font-extrabold text-amber-300 uppercase">Retroflex (捲舌音 · {activePair.retroflexInitial})</div>
                <RubyText
                  text={activePair.retroflexWord}
                  zhuyin={activePair.retroflexZhuyin}
                  pinyin={activePair.retroflexPinyin}
                  size="lg"
                  zhuyinDisplayMode="always"
                />
                <div className="text-sm font-bold text-white">{activePair.retroflexMeaningEn}</div>
                <StylusButton variant="secondary" onClick={() => onSpeak?.(activePair.retroflexWord)} >
                  <span>🔊 Hear 「{activePair.retroflexWord}」</span>
                </StylusButton>
              </div>
              <div className="bg-slate-950/90 border border-sky-500/40 rounded-2xl p-4 space-y-2">
                <div className="text-xs font-extrabold text-sky-300 uppercase">Flat Sibilant (平舌音 · {activePair.flatInitial})</div>
                <RubyText
                  text={activePair.flatWord}
                  zhuyin={activePair.flatZhuyin}
                  pinyin={activePair.flatPinyin}
                  size="lg"
                  zhuyinDisplayMode="always"
                />
                <div className="text-sm font-bold text-white">{activePair.flatMeaningEn}</div>
                <StylusButton variant="secondary" onClick={() => onSpeak?.(activePair.flatWord)} >
                  <span>🔊 Hear 「{activePair.flatWord}」</span>
                </StylusButton>
              </div>
            </div>
            <div className="bg-slate-950/90 border border-slate-800 rounded-2xl p-4 space-y-2 text-xs sm:text-sm">
              <div className="text-emerald-300 font-extrabold">👅 Articulatory Tongue-Placement Tip:</div>
              <p className="text-slate-200">{activePair.articulatoryTipEn}</p>
              <div className="text-amber-300 font-extrabold pt-1">🇹🇼 Taiwan Sociolinguistic Note:</div>
              <p className="text-slate-300">{activePair.taiwanSociolinguisticNote}</p>
            </div>
            {/* Randomized A/B Auditory Discrimination Quiz + Mic Compare */}
            <div className="bg-slate-950/90 border border-slate-800 rounded-2xl p-4 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-xs sm:text-sm font-extrabold text-white">
                  🎧 Blind Ear Check (Score: {pairScore.ok}/{pairScore.total}) — Which word did you hear?
                </span>
                <div className="flex flex-wrap gap-2">
                  <StylusButton
                    variant="amber"
                    onClick={() => {
                      const nextTarget = Math.random() < 0.5;
                      setListeningTargetIsRetroflex(nextTarget);
                      setPairPromptActive(true);
                      setListeningQuizResult(null);
                      onSpeak?.(nextTarget ? activePair.retroflexWord : activePair.flatWord);
                    }}
                  >
                    <span>🔊 Play Random Prompt</span>
                  </StylusButton>
                  <StylusButton variant={isRecording ? 'danger' : 'secondary'} onClick={handleToggleLiveMic}>
                    <span>{isRecording ? '⏹ Stop Mic' : '🎤 Say & Hear Myself'}</span>
                  </StylusButton>
                  {recordedAudioUrl && (
                    <StylusButton variant="ghost" onClick={() => { void new Audio(recordedAudioUrl).play(); }}>
                      <span>▶ Replay My Voice</span>
                    </StylusButton>
                  )}
                </div>
              </div>
              <div className="flex flex-wrap gap-3">
                <StylusButton
                  variant="secondary"
                  disabled={!pairPromptActive}
                  onClick={() => {
                    setPairPromptActive(false);
                    setPairScore((s) => ({ ok: s.ok + (listeningTargetIsRetroflex ? 1 : 0), total: s.total + 1 }));
                    setListeningQuizResult(
                      listeningTargetIsRetroflex
                        ? `✅ Correct! That was retroflex 「${activePair.retroflexWord}」 (${activePair.retroflexZhuyin}).`
                        : `❌ Not quite — the prompt was flat sibilant 「${activePair.flatWord}」 (${activePair.flatZhuyin}).`
                    );
                  }}
                >
                  <span>Option A: {activePair.retroflexWord} ({activePair.retroflexInitial})</span>
                </StylusButton>
                <StylusButton
                  variant="secondary"
                  disabled={!pairPromptActive}
                  onClick={() => {
                    setPairPromptActive(false);
                    setPairScore((s) => ({ ok: s.ok + (!listeningTargetIsRetroflex ? 1 : 0), total: s.total + 1 }));
                    setListeningQuizResult(
                      !listeningTargetIsRetroflex
                        ? `✅ Correct! That was flat sibilant 「${activePair.flatWord}」 (${activePair.flatZhuyin}).`
                        : `❌ Not quite — the prompt was retroflex 「${activePair.retroflexWord}」 (${activePair.retroflexZhuyin}).`
                    );
                  }}
                >
                  <span>Option B: {activePair.flatWord} ({activePair.flatInitial})</span>
                </StylusButton>
              </div>
              {listeningQuizResult && (
                <div className="text-xs sm:text-sm font-bold text-emerald-300">{listeningQuizResult}</div>)}</div>
          </div>
        </div>
      )}
    </div>
  );
};
