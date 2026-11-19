/**
 * FormosaStudio (FORM) — Stage 0 Module 0.1: Unified Tone Hearing, Speaking & Blind Differentiation Lab
 * Resolves the perception-vs-production split (DEP-01 / DEP-03):
 *   1. Hear -> Imitate -> See Your Voice (per-tone voice + pure-pitch hum + live mic ribbon + Hear Myself vs Native)
 *   2. True Blind Tone Differentiation Check (zero leaked hints, shuffled diverse syllables + confusable minimal pairs)
 *   3. Verified Mastery Gate (Ear Check >= 80% across all 4 tones + 4/4 Voice Check >= 65%, with Quiet-Room No-Mic mode)
 */

import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  STAGE0_BLIND_TONE_POOL,
  STAGE0_TONE_CARDS,
  ToneQuizItem,
} from '../data/stage0BeginnerData.ts';
import {
  computeToneContourMatchScore,
  detectPitchYinOffline,
  generateReferenceToneWaveform,
  getReferenceChaoContour,
} from '../lib/pitchContourEngine.ts';
import { RubyText } from './RubyText.tsx';
import { StylusButton } from './uiPrimitives.tsx';

type VoicePresetKey = 'low' | 'mid' | 'high';
const VOICE_PRESETS: Record<VoicePresetKey, { label: string; floor: number; ceiling: number }> = {
  low: { label: 'Low Voice', floor: 85, ceiling: 210 },
  mid: { label: 'Medium Voice', floor: 115, ceiling: 270 },
  high: { label: 'High Voice', floor: 165, ceiling: 360 },
};

function shuffleArray<T>(items: T[]): T[] {
  const arr = [...items];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function buildBlindRound(quietMode: boolean, focusTones?: (1 | 2 | 3 | 4)[]): ToneQuizItem[] {
  const singles = STAGE0_BLIND_TONE_POOL.filter((i) => i.kind === 'single');
  const pairs = STAGE0_BLIND_TONE_POOL.filter((i) => i.kind === 'pair_choice');
  const combos = STAGE0_BLIND_TONE_POOL.filter((i) => i.kind === 'two_syllable');

  if (focusTones && focusTones.length > 0) {
    const filtered = STAGE0_BLIND_TONE_POOL.filter((i) => i.targetTones.some((t) => focusTones.includes(t)));
    return shuffleArray(filtered).slice(0, quietMode ? 10 : 8);
  }

  // Guarantee at least 1 single-syllable item from each of Tones 1..4
  const guaranteed = ([1, 2, 3, 4] as const).map((t) => {
    const pool = shuffleArray(singles.filter((s) => s.answerTone === t));
    return pool[0];
  });
  const usedIds = new Set(guaranteed.map((g) => g.id));
  const extraSingles = shuffleArray(singles.filter((s) => !usedIds.has(s.id))).slice(0, 2);
  const pickedPairs = shuffleArray(pairs).slice(0, 4);
  const pickedCombos = quietMode ? shuffleArray(combos).slice(0, 2) : [];
  return shuffleArray([...guaranteed, ...extraSingles, ...pickedPairs, ...pickedCombos]);
}

function contourToSvgPath(points: number[], w: number, h: number): string {
  if (!points.length) return '';
  return points
    .map((val, idx) => {
      const x = (idx / Math.max(1, points.length - 1)) * (w - 20) + 10;
      const y = h - 10 - ((val - 1) / 4) * (h - 20);
      return `${idx === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`;
    })
    .join(' ');
}

export interface Stage0ToneLabProps {
  onSpeak?: (text: string, rate?: number) => void;
  onComplete: () => void;
}

export const Stage0ToneLab: React.FC<Stage0ToneLabProps> = ({ onSpeak, onComplete }) => {
  const [voicePreset, setVoicePreset] = useState<VoicePresetKey>('mid');
  const [quietMode, setQuietMode] = useState<boolean>(false);

  // Step 1: Per-tone voice practice state
  const [activePracticeTone, setActivePracticeTone] = useState<1 | 2 | 3 | 4 | 5>(1);
  const [recordingTone, setRecordingTone] = useState<number | null>(null);
  const [micLevel, setMicLevel] = useState<number>(0);
  const [micError, setMicError] = useState<string | null>(null);
  const [voiceScores, setVoiceScores] = useState<Record<number, { score: number; curve: number[]; passed: boolean; tip: string; audioUrl?: string }>>({});

  const audioCtxRef = useRef<AudioContext | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const intervalRef = useRef<number | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const framesRef = useRef<number[]>([]);

  // Step 2: True blind tone differentiation state
  const [roundItems, setRoundItems] = useState<ToneQuizItem[]>(() => buildBlindRound(false));
  const [qIdx, setQIdx] = useState<number>(0);
  const [selectedChoice, setSelectedChoice] = useState<number | null>(null);
  const [hasPlayedClip, setHasPlayedClip] = useState<boolean>(false);
  const [roundResults, setRoundResults] = useState<{ item: ToneQuizItem; correct: boolean }[]>([]);

  const activeItem = roundItems[qIdx];
  const roundFinished = roundResults.length >= roundItems.length;

  useEffect(() => {
    return () => {
      if (intervalRef.current !== null) window.clearInterval(intervalRef.current);
      streamRef.current?.getTracks().forEach((t) => t.stop());
      Object.values(voiceScores).forEach((v) => {
        if (v.audioUrl) URL.revokeObjectURL(v.audioUrl);
      });
    };
  }, []);

  const playPitchHum = (tone: 1 | 2 | 3 | 4 | 5) => {
    try {
      const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!audioCtxRef.current) audioCtxRef.current = new Ctx();
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') void ctx.resume();
      const preset = VOICE_PRESETS[voicePreset];
      const samples = generateReferenceToneWaveform({
        chaoContour: getReferenceChaoContour(tone === 3 ? '3_taiwan_half' : tone),
        durationSec: 0.52,
        sampleRate: ctx.sampleRate,
        speakerFloorHz: preset.floor,
        speakerCeilingHz: preset.ceiling,
      });
      const buf = ctx.createBuffer(1, samples.length, ctx.sampleRate);
      buf.getChannelData(0).set(samples);
      const src = ctx.createBufferSource();
      src.buffer = buf;
      src.connect(ctx.destination);
      src.start();
    } catch {
      // Ignore WebAudio failures in headless browsers
    }
  };

  const stopMicCapture = (tone: 1 | 2 | 3 | 4 | 5) => {
    if (intervalRef.current !== null) {
      window.clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    const captured = [...framesRef.current];
    const finishScore = (audioUrl?: string) => {
      streamRef.current?.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
      setRecordingTone(null);
      setMicLevel(0);

      if (captured.length < 2) {
        setMicError('No clear voice detected — speak steadily for ~0.5–1 second closer to the mic, or switch to Quiet Room mode below.');
        return;
      }

      let best = computeToneContourMatchScore(getReferenceChaoContour(tone), captured);
      // DEP-01 Taiwan Rule: Accept BOTH natural Taiwanese Half-3 [21] and citation Full-3 [214]
      if (tone === 3) {
        const half3 = computeToneContourMatchScore(getReferenceChaoContour('3_taiwan_half'), captured);
        if (half3.matchScore > best.matchScore) best = half3;
      }
      const curve = best.resampledUser;
      const passed = best.matchScore >= 65;
      const tip = passed
        ? `✓ Great match (${best.matchScore}%)! Your pitch followed Tone ${tone} cleanly.`
        : tone === 1
        ? `Got ${best.matchScore}% — keep your voice high and steady without dropping at the end.`
        : tone === 2
        ? `Got ${best.matchScore}% — start mid-voice and glide clearly upward like asking "Huh?".`
        : tone === 3
        ? `Got ${best.matchScore}% — drop low and relaxed into the bottom of your voice.`
        : `Got ${best.matchScore}% — start high and drop sharply like a firm "No!".`;

      setVoiceScores((prev) => {
        if (prev[tone]?.audioUrl) URL.revokeObjectURL(prev[tone].audioUrl!);
        return { ...prev, [tone]: { score: best.matchScore, curve, passed, tip, audioUrl } };
      });
    };

    const rec = mediaRecorderRef.current;
    if (rec && rec.state !== 'inactive') {
      rec.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: rec.mimeType || 'audio/webm' });
        finishScore(blob.size > 0 ? URL.createObjectURL(blob) : undefined);
      };
      rec.stop();
    } else {
      finishScore(undefined);
    }
  };

  const startMicCapture = async (tone: 1 | 2 | 3 | 4 | 5) => {
    setMicError(null);
    setActivePracticeTone(tone);
    if (recordingTone !== null) {
      stopMicCapture(recordingTone as 1 | 2 | 3 | 4 | 5);
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: true, noiseSuppression: true } });
      streamRef.current = stream;
      const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!audioCtxRef.current) audioCtxRef.current = new Ctx();
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') await ctx.resume();

      const source = ctx.createMediaStreamSource(stream);
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 2048;
      source.connect(analyser);

      framesRef.current = [];
      chunksRef.current = [];
      if (typeof MediaRecorder !== 'undefined') {
        const rec = new MediaRecorder(stream);
        rec.ondataavailable = (e) => { if (e.data.size > 0) chunksRef.current.push(e.data); };
        mediaRecorderRef.current = rec;
        rec.start();
      }

      const buf = new Float32Array(analyser.fftSize);
      const preset = VOICE_PRESETS[voicePreset];
      setRecordingTone(tone);
      const startedAt = Date.now();
      intervalRef.current = window.setInterval(() => {
        analyser.getFloatTimeDomainData(buf);
        const res = detectPitchYinOffline(buf, ctx.sampleRate, preset.floor, preset.ceiling, 0.004, 0.25);
        setMicLevel(Math.min(100, Math.round(res.rms * 700)));
        if (res.chaoLevel !== null) framesRef.current.push(res.chaoLevel);
        if (Date.now() - startedAt > 2400) stopMicCapture(tone);
      }, 45);
    } catch {
      setMicError('Microphone unavailable or permission denied. Switch to "Quiet Room / No-Mic Mode" below to verify by ear.');
    }
  };

  const startNewRound = (nextQuiet: boolean, focusTones?: (1 | 2 | 3 | 4)[]) => {
    setRoundItems(buildBlindRound(nextQuiet, focusTones));
    setQIdx(0);
    setSelectedChoice(null);
    setHasPlayedClip(false);
    setRoundResults([]);
  };

  const handleAnswerBlind = (choiceIdx: number) => {
    if (selectedChoice !== null || !activeItem) return;
    const isCorrect =
      activeItem.kind === 'single'
        ? choiceIdx === activeItem.answerTone
        : choiceIdx === activeItem.correctOptionIdx;
    setSelectedChoice(choiceIdx);
    setRoundResults((prev) => [...prev, { item: activeItem, correct: isCorrect }]);
  };

  // Compute Ear Check & Voice Check verification gates
  const earStats = useMemo(() => {
    const total = roundResults.length;
    const correct = roundResults.filter((r) => r.correct).length;
    const pct = total > 0 ? Math.round((correct / total) * 100) : 0;
    const byTone: Record<1 | 2 | 3 | 4, { ok: number; total: number }> = {
      1: { ok: 0, total: 0 },
      2: { ok: 0, total: 0 },
      3: { ok: 0, total: 0 },
      4: { ok: 0, total: 0 },
    };
    for (const r of roundResults) {
      for (const t of r.item.targetTones) {
        byTone[t].total += 1;
        if (r.correct) byTone[t].ok += 1;
      }
    }
    const allFourHit = ([1, 2, 3, 4] as const).every((t) => byTone[t].ok >= 1);
    const missedTones = ([1, 2, 3, 4] as const).filter((t) => byTone[t].total > 0 && byTone[t].ok < byTone[t].total);
    const threshold = quietMode ? 85 : 80;
    const earPassed = roundFinished && pct >= threshold && allFourHit;
    return { total, correct, pct, byTone, missedTones, earPassed, threshold };
  }, [roundResults, roundFinished, quietMode]);

  const passedVoiceCount = ([1, 2, 3, 4] as const).filter((t) => voiceScores[t]?.passed).length;
  const voicePassed = quietMode ? earStats.earPassed : passedVoiceCount >= 4;
  const moduleVerified = earStats.earPassed && voicePassed;
  const activeVoiceResult = voiceScores[activePracticeTone];
  const activeCard = STAGE0_TONE_CARDS.find((c) => c.tone === activePracticeTone) || STAGE0_TONE_CARDS[0];
  const targetRibbonCurve = getReferenceChaoContour(activePracticeTone === 3 ? '3_taiwan_half' : activePracticeTone);

  return (
    <section className="fs-card p-6 space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="space-y-1">
          <h2 className="text-xl font-bold" style={{ color: 'var(--fs-text)' }}>
            0.1 Tone Ear &amp; Voice Boot Camp · Hear, Imitate &amp; Prove You Can Tell Them Apart
          </h2>
          <p className="text-sm" style={{ color: 'var(--fs-text-secondary)' }}>
            Mandarin tones live in both your ear and your voice. Practice saying each tone aloud with live visual feedback, then pass the blind ear test.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-1.5">
          {(['low', 'mid', 'high'] as VoicePresetKey[]).map((k) => (
            <StylusButton key={k} variant={voicePreset === k ? 'primary' : 'secondary'} onClick={() => setVoicePreset(k)}>
              <span>{VOICE_PRESETS[k].label}</span>
            </StylusButton>
          ))}
        </div>
      </div>

      {/* STEP 1: UNIFIED HEAR -> SPEAK -> VISUAL PITCH RIBBON */}
      <div className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="text-sm font-bold" style={{ color: 'var(--fs-text)' }}>
            Step 1 · Hear &amp; Say Each Tone ({passedVoiceCount} / 4 lexical tones verified with mic)
          </div>
          <StylusButton
            variant={quietMode ? 'amber' : 'ghost'}
            onClick={() => {
              const next = !quietMode;
              setQuietMode(next);
              startNewRound(next);
            }}
          >
            <span>{quietMode ? 'Quiet Room Mode: ON (12-Item Ear Gate)' : 'No Mic / Quiet Room Mode'}</span>
          </StylusButton>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
          {STAGE0_TONE_CARDS.map((card) => {
            const vr = voiceScores[card.tone];
            const isRec = recordingTone === card.tone;
            return (
              <div
                key={card.tone}
                onClick={() => setActivePracticeTone(card.tone)}
                className="fs-subtle-box p-4 flex flex-col justify-between gap-3 cursor-pointer transition"
                style={{ borderColor: activePracticeTone === card.tone ? 'var(--fs-accent-border)' : undefined }}
              >
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between gap-1">
                    <span className="text-xs font-bold" style={{ color: `var(--fs-tone-${card.tone})` }}>{card.nameEn}</span>
                    {vr?.passed && <span className="text-xs font-bold" style={{ color: 'var(--fs-accent-text)' }}>✓</span>}
                  </div>
                  <RubyText text={card.exampleChar} zhuyin={card.exampleZhuyin} pinyin={card.examplePinyin} showPinyinHint size="lg" zhuyinDisplayMode="always" nonInteractive />
                  <div className="text-sm font-bold" style={{ color: 'var(--fs-text)' }}>{card.meaningEn}</div>
                  <p className="text-xs" style={{ color: 'var(--fs-text-secondary)' }}>{card.englishAnalogy}</p>
                </div>
                <div className="space-y-1.5">
                  <p className="text-[11px] italic" style={{ color: 'var(--fs-text-muted)' }}>{card.taiwanTip}</p>
                  <div className="grid grid-cols-2 gap-1.5">
                    <StylusButton variant="secondary" onClick={(e) => { e.stopPropagation(); setActivePracticeTone(card.tone); onSpeak?.(card.exampleChar, 0.8); }}>
                      <span>Listen</span>
                    </StylusButton>
                    <StylusButton variant="ghost" onClick={(e) => { e.stopPropagation(); setActivePracticeTone(card.tone); playPitchHum(card.tone); }}>
                      <span>Hum</span>
                    </StylusButton>
                  </div>
                  {card.tone <= 4 && !quietMode && (
                    <StylusButton
                      variant={isRec ? 'danger' : vr?.passed ? 'primary' : 'amber'}
                      className="w-full"
                      onClick={(e) => { e.stopPropagation(); void startMicCapture(card.tone); }}
                    >
                      <span>{isRec ? 'Stop & Score' : vr ? `Retry (${vr.score}%)` : 'Say It (Mic)'}</span>
                    </StylusButton>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Live Pitch Ribbon + Hear Myself vs Native */}
        <div className="fs-subtle-box p-4 grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
          <div className="md:col-span-5">
            <svg viewBox="0 0 260 100" className="w-full h-24 rounded-xl border" style={{ backgroundColor: 'var(--fs-surface)', borderColor: 'var(--fs-border)' }}>
              <text x="8" y="18" fontSize="9" fill="var(--fs-text-muted)">High</text>
              <text x="8" y="54" fontSize="9" fill="var(--fs-text-muted)">Mid</text>
              <text x="8" y="92" fontSize="9" fill="var(--fs-text-muted)">Low</text>
              <line x1="34" y1="15" x2="250" y2="15" stroke="var(--fs-border)" strokeDasharray="3 3" />
              <line x1="34" y1="50" x2="250" y2="50" stroke="var(--fs-border)" strokeDasharray="3 3" />
              <line x1="34" y1="85" x2="250" y2="85" stroke="var(--fs-border)" strokeDasharray="3 3" />
              <path d={contourToSvgPath(targetRibbonCurve, 250, 96)} fill="none" stroke="var(--fs-accent)" strokeWidth="4" strokeLinecap="round" strokeDasharray="6 4" />
              {activeVoiceResult && (
                <path d={contourToSvgPath(activeVoiceResult.curve, 250, 96)} fill="none" stroke="#D97706" strokeWidth="4" strokeLinecap="round" />
              )}
            </svg>
          </div>
          <div className="md:col-span-7 space-y-2">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="text-sm font-bold" style={{ color: 'var(--fs-text)' }}>
                Active Voice Practice: {activeCard.nameEn} — 「{activeCard.exampleChar}」 ({activeCard.examplePinyin})
              </div>
              {recordingTone !== null && (
                <span className="text-xs font-bold" style={{ color: 'var(--fs-danger)' }}>● Recording… Mic Level {micLevel}%</span>
              )}
            </div>
            {micError && <div className="text-xs font-semibold" style={{ color: 'var(--fs-warm)' }}>{micError}</div>}
            <p className="text-xs" style={{ color: activeVoiceResult?.passed ? 'var(--fs-accent-text)' : 'var(--fs-text-secondary)' }}>
              {activeVoiceResult
                ? activeVoiceResult.tip
                : 'Dashed green line = target pitch shape. Solid amber line = your voice after clicking "Say It (Mic)".'}
            </p>
            {activeVoiceResult?.audioUrl && (
              <div className="flex flex-wrap gap-2">
                <StylusButton
                  variant="secondary"
                  onClick={() => {
                    const a = new Audio(activeVoiceResult.audioUrl);
                    a.onended = () => onSpeak?.(activeCard.exampleChar, 0.82);
                    void a.play();
                  }}
                >
                  <span>Hear Myself vs. Native</span>
                </StylusButton>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 2 Day-1 Sandhi Rules */}
      <div className="fs-subtle-box p-4 space-y-1 text-sm">
        <div className="font-bold" style={{ color: 'var(--fs-accent-text)' }}>The Only 2 Spoken Tone-Shift Rules You Need on Day 1:</div>
        <p style={{ color: 'var(--fs-text-secondary)' }}>
          1. <strong>Two 3rd tones in a row:</strong> First rises to Tone 2 — <strong>你好 (nǐ hǎo)</strong> is spoken <strong>ní hǎo</strong>.
          {' '}2. <strong>不 (bù) before Tone 4:</strong> Shifts to Tone 2 (<strong>bú</strong>) — <strong>不是 / 不會</strong> sound like <strong>bú shì / bú huì</strong>.
        </p>
      </div>

      {/* STEP 2: TRUE BLIND TONE DIFFERENTIATION CHECK (ZERO LEAKED HINTS) */}
      <div className="fs-subtle-box p-5 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <div className="text-xs font-bold uppercase" style={{ color: 'var(--fs-accent-text)' }}>
              Step 2 · Blind Tone Differentiation Check ({Math.min(qIdx + 1, roundItems.length)} / {roundItems.length} · Score: {earStats.correct}/{earStats.total})
            </div>
            <div className="text-base font-bold" style={{ color: 'var(--fs-text)' }}>
              {roundFinished
                ? `Round Complete: ${earStats.correct} / ${earStats.total} (${earStats.pct}%)`
                : 'No text hints shown until you answer! Press Play and identify what you hear:'}
            </div>
          </div>
          <StylusButton variant="ghost" onClick={() => startNewRound(quietMode)}><span>New Shuffled Round</span></StylusButton>
        </div>

        {!roundFinished && activeItem ? (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <StylusButton variant="primary" onClick={() => { setHasPlayedClip(true); onSpeak?.(activeItem.promptAudio, 0.9); }}>
                <span>Play Audio (Normal)</span>
              </StylusButton>
              <StylusButton variant="secondary" onClick={() => { setHasPlayedClip(true); onSpeak?.(activeItem.promptAudio, 0.65); }}>
                <span>Play Slow (0.65×)</span>
              </StylusButton>
              {activeItem.kind === 'single' && activeItem.answerTone && (
                <StylusButton variant="ghost" onClick={() => { setHasPlayedClip(true); playPitchHum(activeItem.answerTone!); }}>
                  <span>Pure Pitch Hum</span>
                </StylusButton>
              )}
              {!hasPlayedClip && (
                <span className="text-xs font-medium" style={{ color: 'var(--fs-text-muted)' }}>← Press Play first to hear the blind clip</span>
              )}
            </div>

            {activeItem.kind === 'single' ? (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {([1, 2, 3, 4] as const).map((t) => (
                  <StylusButton
                    key={t}
                    variant={selectedChoice === t ? (t === activeItem.answerTone ? 'primary' : 'danger') : 'secondary'}
                    onClick={() => handleAnswerBlind(t)}
                  >
                    <span>Tone {t} ({t === 1 ? 'High' : t === 2 ? 'Rising' : t === 3 ? 'Low' : 'Drop'})</span>
                  </StylusButton>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {(activeItem.options || []).map((opt, idx) => (
                  <StylusButton
                    key={opt}
                    variant={selectedChoice === idx ? (idx === activeItem.correctOptionIdx ? 'primary' : 'danger') : 'secondary'}
                    onClick={() => handleAnswerBlind(idx)}
                  >
                    <span>{opt}</span>
                  </StylusButton>
                ))}
              </div>
            )}

            {selectedChoice !== null && (
              <div className="fs-card p-4 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <RubyText text={activeItem.revealChar} zhuyin={activeItem.revealZhuyin} pinyin={activeItem.revealPinyin} showPinyinHint size="md" zhuyinDisplayMode="always" />
                  <div className="text-sm font-semibold" style={{ color: roundResults[roundResults.length - 1]?.correct ? 'var(--fs-accent-text)' : 'var(--fs-danger)' }}>
                    {roundResults[roundResults.length - 1]?.correct ? '✓ Correct! ' : 'Missed — '}
                    {activeItem.revealEnglish}
                  </div>
                </div>
                <StylusButton
                  variant="primary"
                  onClick={() => {
                    setSelectedChoice(null);
                    setHasPlayedClip(false);
                    setQIdx((i) => i + 1);
                  }}
                >
                  <span>{qIdx + 1 >= roundItems.length ? 'See Diagnostic Breakdown →' : 'Next Blind Clip →'}</span>
                </StylusButton>
              </div>
            )}
          </div>
        ) : (
          <div className="fs-card p-4 space-y-3">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              {([1, 2, 3, 4] as const).map((t) => {
                const st = earStats.byTone[t];
                const p = st.total > 0 ? Math.round((st.ok / st.total) * 100) : 0;
                return (
                  <div key={t} className="fs-subtle-box p-2.5">
                    <div className="font-bold" style={{ color: `var(--fs-tone-${t})` }}>Tone {t}</div>
                    <div className="font-semibold" style={{ color: 'var(--fs-text)' }}>{st.ok}/{st.total} ({p}%)</div>
                  </div>
                );
              })}
            </div>
            <div className="flex flex-wrap gap-2">
              {earStats.missedTones.length > 0 && (
                <StylusButton variant="amber" onClick={() => startNewRound(quietMode, earStats.missedTones)}>
                  <span>Retry Missed Tones (Tone {earStats.missedTones.join(', ')})</span>
                </StylusButton>
              )}
              <StylusButton variant="secondary" onClick={() => startNewRound(quietMode)}><span>Take Fresh Shuffled Test</span></StylusButton>
            </div>
          </div>
        )}
      </div>

      {/* STEP 3: VERIFIED MASTERY GATE */}
      <div className="fs-subtle-box p-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3 text-xs font-semibold">
          <span style={{ color: earStats.earPassed ? 'var(--fs-accent-text)' : 'var(--fs-text-secondary)' }}>
            {earStats.earPassed ? '✓' : '○'} Blind Ear Check ({earStats.pct}% / need ≥{earStats.threshold}% across Tones 1–4)
          </span>
          <span style={{ color: voicePassed ? 'var(--fs-accent-text)' : 'var(--fs-text-secondary)' }}>
            {voicePassed ? '✓' : '○'} {quietMode ? 'Quiet-Room Mode Active' : `Spoken Voice Check (${passedVoiceCount}/4 tones ≥65%)`}
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <StylusButton variant="primary" disabled={!moduleVerified} onClick={onComplete}>
            <span>{moduleVerified ? 'Complete Module 0.1 & Continue to Zhuyin →' : 'Pass Ear & Voice Checks to Unlock'}</span>
          </StylusButton>
          {!moduleVerified && (
            <button type="button" onClick={onComplete} className="text-xs underline px-2 py-1" style={{ color: 'var(--fs-text-muted)' }}>
              Override &amp; continue anyway
            </button>
          )}
        </div>
      </div>
    </section>
  );
};
