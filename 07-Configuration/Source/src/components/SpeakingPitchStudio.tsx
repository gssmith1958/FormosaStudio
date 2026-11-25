/**
 * FormosaStudio (FORM) — Speaking & Pitch Lab (Offline YIN F0, Tone Sandhi & Minimal-Pair Coach)
 * Powered by shared audioSessionManager.ts (DSP-1/DSP-2 iPad mini 6 Safari optimization) & Warm Paper tokens (UX-3).
 * Traces to: FORM-REQ-0015, FORM-REQ-0016, FORM-REQ-0021, FORM-ECR-001
 */

import React, { useEffect, useRef, useState } from 'react';
import {
  MandarinToneId,
  RETROFLEX_MINIMAL_PAIRS,
  TONE_SANDHI_DRILL_PHRASES,
  ToneContourMatchReport,
  ToneSandhiDrillPhrase,
  computeToneContourMatchScore,
  detectPitchYinDownsampled2x,
  generateReferenceToneWaveform,
  getReferenceChaoContour,
} from '../lib/pitchContourEngine.ts';
import {
  ActiveMicHandle,
  MicCaptureResult,
  playRecordedThenNative,
  playToneReferenceHum,
  startMicToneSession,
} from '../lib/audioSessionManager.ts';
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
  { id: 'sandhi_coach', labelZh: '臺灣連讀變調教練', labelEn: 'Tone Sandhi Coach', badge: '8 Phrases' },
  { id: 'minimal_pairs', labelZh: '捲舌 vs 平舌對比', labelEn: 'ㄓㄔㄕㄖ vs ㄗㄘㄙ', badge: '10 Pairs' },
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
  { id: '3_taiwan_half', badgeTone: 3, labelZh: '臺灣半上 [21]', labelEn: 'Taiwan Tone 3 Low-Dip', exampleChar: '馬', exampleZhuyin: 'ㄇㄚˇ', exampleEnglish: 'horse (natural spoken)' },
  { id: 3, badgeTone: 3, labelZh: '三聲單字 [214]', labelEn: 'Tone 3 Full Citation', exampleChar: '馬', exampleZhuyin: 'ㄇㄚˇ', exampleEnglish: 'horse (citation)' },
  { id: 4, badgeTone: 4, labelZh: '四聲 [51]', labelEn: 'Tone 4 Sharp Drop', exampleChar: '罵', exampleZhuyin: 'ㄇㄚˋ', exampleEnglish: 'to scold' },
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
  const [speakerRange, setSpeakerRange] = useState<{ floorHz: number; ceilingHz: number }>(() =>
    progress.voicePreset === 'low'
      ? { floorHz: 95, ceilingHz: 220 }
      : progress.voicePreset === 'high'
      ? { floorHz: 145, ceilingHz: 330 }
      : { floorHz: 110, ceilingHz: 270 }
  );
  const [userChaoCurve, setUserChaoCurve] = useState<number[] | null>(null);
  const [liveHzReadout, setLiveHzReadout] = useState<number | null>(null);
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [micStatus, setMicStatus] = useState<string>('Ready — tap Record, speak clearly, then tap Stop.');
  const [micLevelPct, setMicLevelPct] = useState<number>(0);
  const [recordedCapture, setRecordedCapture] = useState<MicCaptureResult | null>(null);
  const [selectedPairIdx, setSelectedPairIdx] = useState<number>(0);
  const [listeningTargetIsRetroflex, setListeningTargetIsRetroflex] = useState<boolean>(true);
  const [pairPromptActive, setPairPromptActive] = useState<boolean>(false);
  const [pairScore, setPairScore] = useState<{ ok: number; total: number }>({ ok: 0, total: 0 });
  const [listeningQuizResult, setListeningQuizResult] = useState<string | null>(null);

  const micHandleRef = useRef<ActiveMicHandle | null>(null);

  useEffect(() => () => {
    void micHandleRef.current?.stop();
    micHandleRef.current = null;
  }, []);

  const activePreset = SINGLE_TONE_PRESETS.find((p) => p.id === selectedTonePreset) || SINGLE_TONE_PRESETS[0];
  const activeSandhi: ToneSandhiDrillPhrase =
    TONE_SANDHI_DRILL_PHRASES.find((s) => s.id === selectedSandhiId) || TONE_SANDHI_DRILL_PHRASES[0];
  const targetCurve =
    subTab === 'sandhi_coach'
      ? activeSandhi.targetChaoCurve
      : getReferenceChaoContour(selectedTonePreset, 20);
  const matchReport: ToneContourMatchReport | null = userChaoCurve
    ? computeToneContourMatchScore(targetCurve, userChaoCurve)
    : null;

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
      text: focusText,
      zhuyin: focusZhuyin,
      english: focusEn,
      sourceStudio: 'speaking',
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
      chaoContour: simulatedContour,
      durationSec: 0.5,
      sampleRate: 48000,
      speakerFloorHz: speakerRange.floorHz,
      speakerCeilingHz: speakerRange.ceilingHz,
    });
    const windowSize = 2048;
    const step = Math.floor((wave.length - windowSize) / 19);
    const extractedChao: number[] = [];
    let lastValidHz: number | null = null;
    for (let w = 0; w < 20; w++) {
      const start = Math.max(0, w * step);
      const res = detectPitchYinDownsampled2x(wave.subarray(start, start + windowSize), 48000, speakerRange.floorHz, speakerRange.ceilingHz);
      if (res.chaoLevel !== null) {
        extractedChao.push(res.chaoLevel);
        lastValidHz = res.f0Hz;
      } else {
        extractedChao.push(simulatedContour[w]);
      }
    }
    if (lastValidHz !== null) setLiveHzReadout(lastValidHz);
    setUserChaoCurve(extractedChao);
    const previewReport = computeToneContourMatchScore(targetCurve, extractedChao);
    setMicStatus(`Preview only (${quality === 'excellent' ? 'native match' : 'monotone error'} · ${previewReport.matchScore}%). Record your own voice for FSRS credit.`);
  };

  const applyCaptureResult = (res: MicCaptureResult) => {
    setIsRecording(false);
    setMicLevelPct(0);
    setRecordedCapture(res);
    if (res.chaoFrames.length >= 2) {
      const report = commitCapturedContour(res.chaoFrames);
      setMicStatus(`Captured ${res.chaoFrames.length} voiced frames (${res.avgYinMs.toFixed(1)} ms/frame) — Tone Match: ${report.matchScore}%.`);
    } else {
      setMicStatus('Mic was silent or too quiet — speak clearly near your microphone and try again.');
    }
  };

  const stopLiveMicCapture = async () => {
    const handle = micHandleRef.current;
    micHandleRef.current = null;
    if (!handle) {
      setIsRecording(false);
      setMicLevelPct(0);
      return;
    }
    const res = await handle.stop();
    applyCaptureResult(res);
  };

  const handleToggleLiveMic = async () => {
    if (isRecording) {
      await stopLiveMicCapture();
      return;
    }
    try {
      const handle = await startMicToneSession({
        floorHz: speakerRange.floorHz,
        ceilingHz: speakerRange.ceilingHz,
        maxDurationMs: 4200,
        onFrame: (f, totalVoiced, levelPct) => {
          setMicLevelPct(levelPct);
          if (f.f0Hz !== null) setLiveHzReadout(f.f0Hz);
          if (totalVoiced >= 2) {
            setMicStatus(`Listening… ${totalVoiced} voiced frames${f.f0Hz ? ` (${f.f0Hz} Hz)` : ''}`);
          }
        },
        onAutoStop: (res) => {
          micHandleRef.current = null;
          applyCaptureResult(res);
        },
      });
      micHandleRef.current = handle;
      setIsRecording(true);
      setMicStatus('Listening… speak the character or phrase now, then tap Stop.');
    } catch (err) {
      setMicStatus(`Microphone unavailable or permission denied (${err instanceof Error ? err.message : 'check permissions'}).`);
    }
  };

  const handleReplayComparison = () => {
    const text = subTab === 'sandhi_coach' ? activeSandhi.hanzi : activePreset.exampleChar;
    if (recordedCapture && (recordedCapture.audioBlob || recordedCapture.audioUrl)) {
      setMicStatus('Playing your recorded voice → followed by native Taiwanese reference…');
      void playRecordedThenNative(recordedCapture.audioBlob, recordedCapture.audioUrl, text, 0.85);
      return;
    }
    playToneReferenceHum(activePreset.badgeTone, speakerRange.floorHz, speakerRange.ceilingHz);
    window.setTimeout(() => onSpeak?.(text), 560);
  };

  const activePair = RETROFLEX_MINIMAL_PAIRS[selectedPairIdx] || RETROFLEX_MINIMAL_PAIRS[0];
  const svgW = 560;
  const svgH = 210;
  const padX = 44;
  const padY = 22;
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
        subtitle="Record your voice offline (iPad Safari & Desktop optimized) to compare your spoken tone contour against the native Taiwanese melody, practice tone sandhi, and train ㄓㄔㄕㄖ vs. ㄗㄘㄙ."
        rightSlot={
          <div className="flex flex-wrap items-center gap-2">
            <StylusButton variant={speakerRange.floorHz === 95 ? 'primary' : 'secondary'} onClick={() => setSpeakerRange({ floorHz: 95, ceilingHz: 220 })}>
              <span>Low (95–220 Hz)</span>
            </StylusButton>
            <StylusButton variant={speakerRange.floorHz === 110 ? 'primary' : 'secondary'} onClick={() => setSpeakerRange({ floorHz: 110, ceilingHz: 270 })}>
              <span>Mid (110–270 Hz)</span>
            </StylusButton>
            <StylusButton variant={speakerRange.floorHz === 145 ? 'primary' : 'secondary'} onClick={() => setSpeakerRange({ floorHz: 145, ceilingHz: 330 })}>
              <span>High (145–330 Hz)</span>
            </StylusButton>
          </div>
        }
      />

      <StudioModeSwitcher modes={SUB_TABS} activeMode={subTab} onSelect={setSubTab} />

      {subTab !== 'minimal_pairs' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          <div className="lg:col-span-5 fs-card p-5 space-y-4">
            {subTab === 'pitch_lab' ? (
              <>
                <h2 className="text-xs font-extrabold uppercase tracking-wider" style={{ color: 'var(--fs-accent-text)' }}>
                  Chao 5-Level Tone Reference Curves (五度標調法 1–5)
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
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
                <div className="fs-subtle-box p-4 flex items-center justify-between gap-3">
                  <RubyText text={activePreset.exampleChar} zhuyin={activePreset.exampleZhuyin} showPinyinHint={progress.showPinyinHint} size="xl" zhuyinDisplayMode="always" />
                  <div className="text-right space-y-1">
                    <ToneBadge tone={activePreset.badgeTone} />
                    <div className="text-sm font-bold" style={{ color: 'var(--fs-text)' }}>{activePreset.labelEn}</div>
                    <div className="text-xs" style={{ color: 'var(--fs-text-secondary)' }}>{activePreset.exampleEnglish}</div>
                  </div>
                </div>
              </>
            ) : (
              <>
                <h2 className="text-xs font-extrabold uppercase tracking-wider" style={{ color: 'var(--fs-accent-text)' }}>
                  臺灣自然口語連讀變調 · 8 Spoken Sandhi Drills
                </h2>
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
                      <span className="font-bold">{s.hanzi}</span>
                      <span className="text-[11px] opacity-80">{s.ruleCategory}</span>
                    </StylusButton>
                  ))}
                </div>
                <div className="fs-subtle-box p-4 space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <RubyText text={activeSandhi.hanzi} zhuyin={activeSandhi.spokenSandhiZhuyin} pinyin={activeSandhi.pinyin} showPinyinHint={progress.showPinyinHint} size="lg" zhuyinDisplayMode="always" />
                    <span className="px-2.5 py-1 rounded-full text-xs font-bold" style={{ backgroundColor: 'var(--fs-warm-soft)', color: 'var(--fs-warm)' }}>
                      {activeSandhi.ruleCategory}
                    </span>
                  </div>
                  <div className="text-xs" style={{ color: 'var(--fs-text-secondary)' }}>
                    Citation: {activeSandhi.citationZhuyin} → Spoken Taiwan Sandhi: <strong style={{ color: 'var(--fs-accent-text)' }}>{activeSandhi.spokenSandhiZhuyin}</strong>
                  </div>
                  <p className="text-xs font-medium" style={{ color: 'var(--fs-warm)' }}>{activeSandhi.coachingTipEn}</p>
                </div>
              </>
            )}
          </div>

          <div className="lg:col-span-7 fs-card p-5 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <h2 className="text-base font-bold" style={{ color: 'var(--fs-text)' }}>Dual-Curve Chao 1–5 Pitch-Contour Visualizer</h2>
                <p className="text-xs" style={{ color: 'var(--fs-text-secondary)' }}>Green = Native Reference · Amber Dashed = Your Normalized YIN F0 Curve</p>
              </div>
              <div className="fs-subtle-box px-3 py-1.5 text-xs font-bold" style={{ color: 'var(--fs-text)' }}>
                F0: {liveHzReadout ? `${liveHzReadout} Hz` : 'Ready'} · Match:{' '}
                <strong style={{ color: 'var(--fs-accent-text)' }}>{matchReport ? `${matchReport.matchScore}%` : '—'}</strong>
              </div>
            </div>

            <div className="fs-subtle-box p-3 overflow-x-auto">
              <svg viewBox={`0 0 ${svgW} ${svgH}`} className="w-full h-48">
                {[5, 4, 3, 2, 1].map((lvl) => {
                  const y = padY + ((5 - lvl) / 4) * plotH;
                  return (
                    <g key={lvl}>
                      <line x1={padX} y1={y} x2={svgW - padX} y2={y} stroke="var(--fs-border-strong)" strokeDasharray="4 4" />
                      <text x={10} y={y + 4} fill="var(--fs-text-muted)" fontSize="11" fontWeight="bold">Chao {lvl}</text>
                    </g>
                  );
                })}
                <polyline fill="none" stroke="var(--fs-accent)" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" points={toSvgPoints(targetCurve)} />
                {matchReport && (
                  <polyline fill="none" stroke="#D97706" strokeWidth="3.5" strokeDasharray="6 4" strokeLinecap="round" strokeLinejoin="round" points={toSvgPoints(matchReport.resampledUser)} />
                )}
              </svg>
            </div>

            <div className="fs-subtle-box p-3.5 text-xs sm:text-sm space-y-1.5">
              <div style={{ color: matchReport ? (matchReport.passed ? 'var(--fs-accent-text)' : 'var(--fs-danger)') : 'var(--fs-text)' }}>
                {matchReport ? (
                  <><strong>Tone Match Score: {matchReport.matchScore}%</strong> — {matchReport.diagnosticFeedbackEn}</>
                ) : (
                  <strong>Tap Record &amp; Speak to compare your live voice contour against the reference curve.</strong>
                )}
              </div>
              <div className="flex items-center justify-between gap-3 text-xs" style={{ color: 'var(--fs-text-secondary)' }}>
                <span>{micStatus}</span>
                {isRecording && (
                  <div className="w-28 h-2 rounded-full overflow-hidden shrink-0" style={{ backgroundColor: 'var(--fs-surface)' }}>
                    <div className="h-full transition-all duration-75" style={{ width: `${micLevelPct}%`, backgroundColor: 'var(--fs-accent)' }} />
                  </div>
                )}
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <StylusButton variant={isRecording ? 'danger' : 'primary'} onClick={() => void handleToggleLiveMic()}>
                <span>{isRecording ? 'Stop Mic Capture' : 'Record My Voice (Offline YIN)'}</span>
              </StylusButton>
              <StylusButton variant="amber" onClick={handleReplayComparison}>
                <span>Replay My Voice vs. Native</span>
              </StylusButton>
              <StylusButton variant="secondary" onClick={() => handleSimulateCapture('excellent')}>
                <span>Simulate Match</span>
              </StylusButton>
              <StylusButton variant="ghost" onClick={() => handleSimulateCapture('flat_error')}>
                <span>Simulate Flat</span>
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
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          <div className="lg:col-span-5 fs-card p-5 space-y-3">
            <h2 className="text-xs font-extrabold uppercase tracking-wider" style={{ color: 'var(--fs-accent-text)' }}>
              10 Taiwanese Retroflex (ㄓㄔㄕㄖ) vs. Flat (ㄗㄘㄙ) Pairs
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

          <div className="lg:col-span-7 fs-card p-5 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div className="fs-subtle-box p-4 space-y-2">
                <div className="text-xs font-bold uppercase" style={{ color: 'var(--fs-warm)' }}>Retroflex (捲舌音 · {activePair.retroflexInitial})</div>
                <RubyText text={activePair.retroflexWord} zhuyin={activePair.retroflexZhuyin} pinyin={activePair.retroflexPinyin} showPinyinHint={progress.showPinyinHint} size="lg" zhuyinDisplayMode="always" />
                <div className="text-sm font-bold" style={{ color: 'var(--fs-text)' }}>{activePair.retroflexMeaningEn}</div>
                <StylusButton variant="secondary" onClick={() => onSpeak?.(activePair.retroflexWord)}>
                  <span>Hear 「{activePair.retroflexWord}」</span>
                </StylusButton>
              </div>
              <div className="fs-subtle-box p-4 space-y-2">
                <div className="text-xs font-bold uppercase" style={{ color: 'var(--fs-accent-text)' }}>Flat Sibilant (平舌音 · {activePair.flatInitial})</div>
                <RubyText text={activePair.flatWord} zhuyin={activePair.flatZhuyin} pinyin={activePair.flatPinyin} showPinyinHint={progress.showPinyinHint} size="lg" zhuyinDisplayMode="always" />
                <div className="text-sm font-bold" style={{ color: 'var(--fs-text)' }}>{activePair.flatMeaningEn}</div>
                <StylusButton variant="secondary" onClick={() => onSpeak?.(activePair.flatWord)}>
                  <span>Hear 「{activePair.flatWord}」</span>
                </StylusButton>
              </div>
            </div>

            <div className="fs-subtle-box p-4 space-y-2 text-xs sm:text-sm">
              <div className="font-bold" style={{ color: 'var(--fs-accent-text)' }}>Articulatory Tongue-Placement Tip:</div>
              <p style={{ color: 'var(--fs-text)' }}>{activePair.articulatoryTipEn}</p>
              <div className="font-bold pt-1" style={{ color: 'var(--fs-warm)' }}>Taiwan Sociolinguistic Note:</div>
              <p style={{ color: 'var(--fs-text-secondary)' }}>{activePair.taiwanSociolinguisticNote}</p>
            </div>

            <div className="fs-subtle-box p-4 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-xs sm:text-sm font-bold" style={{ color: 'var(--fs-text)' }}>
                  Blind Ear Check (Score: {pairScore.ok}/{pairScore.total}) — Which word did you hear?
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
                    <span>Play Random Prompt</span>
                  </StylusButton>
                  <StylusButton variant={isRecording ? 'danger' : 'secondary'} onClick={() => void handleToggleLiveMic()}>
                    <span>{isRecording ? 'Stop Mic' : 'Say & Compare'}</span>
                  </StylusButton>
                  {recordedCapture && (recordedCapture.audioBlob || recordedCapture.audioUrl) && (
                    <StylusButton
                      variant="ghost"
                      onClick={() => void playRecordedThenNative(recordedCapture.audioBlob, recordedCapture.audioUrl, activePair.retroflexWord, 0.85)}
                    >
                      <span>Replay My Voice</span>
                    </StylusButton>
                  )}
                </div>
              </div>
              <div className="flex flex-wrap gap-2.5">
                <StylusButton
                  variant="secondary"
                  disabled={!pairPromptActive}
                  onClick={() => {
                    setPairPromptActive(false);
                    setPairScore((s) => ({ ok: s.ok + (listeningTargetIsRetroflex ? 1 : 0), total: s.total + 1 }));
                    setListeningQuizResult(
                      listeningTargetIsRetroflex
                        ? `✓ Correct! Retroflex 「${activePair.retroflexWord}」 (${activePair.retroflexZhuyin}).`
                        : `Missed — that was flat 「${activePair.flatWord}」 (${activePair.flatZhuyin}).`
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
                        ? `✓ Correct! Flat 「${activePair.flatWord}」 (${activePair.flatZhuyin}).`
                        : `Missed — that was retroflex 「${activePair.retroflexWord}」 (${activePair.retroflexZhuyin}).`
                    );
                  }}
                >
                  <span>Option B: {activePair.flatWord} ({activePair.flatInitial})</span>
                </StylusButton>
              </div>
              {listeningQuizResult && <div className="text-xs sm:text-sm font-bold" style={{ color: 'var(--fs-accent-text)' }}>{listeningQuizResult}</div>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
