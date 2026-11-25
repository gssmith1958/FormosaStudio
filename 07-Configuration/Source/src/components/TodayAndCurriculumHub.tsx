/**
 * FormosaStudio (FORM) — Today's Syllabus-Adaptive 10-Minute Session (v2.1.0 Crisp Neutral Studio)
 * Single primary CTA above the fold (UX-C3), de-boxed calm layout, Lucide icons, and genuine Step 2/3 verification (PED-4).
 * Traces to: FORM-ECR-001, FORM-DEC-005, FORM-WF-003
 */

import React, { useMemo, useState } from 'react';
import { ArrowRight, Check, Eye, Mic, PenTool, Sparkles, Volume2 } from 'lucide-react';
import { getFullVocabularyCatalog } from '../data/vocabularyCatalog.ts';
import { MOE_STROKE_CHARACTER_BANK } from '../data/moeStrokeAndPhoneticData.ts';
import { zhuyinToDaqianKeySequence } from '../data/daqianAndDojoData.ts';
import {
  FsrsRating,
  UserProgressState,
  getOverallPathwaySummary,
  getTodayProgressSummary,
  markDailyStepComplete,
  recordCharacterPractice,
  recordWordPractice,
} from '../lib/progressStore.ts';
import { StageNumber, buildAdaptiveDailySession, getEntryStageNumber } from '../lib/syllabusModel.ts';
import { dispatchStudioHandoff } from '../lib/studioContextBus.ts';
import { StylusButton } from './uiPrimitives.tsx';
import { RubyText } from './RubyText.tsx';

export interface TodayAndCurriculumHubProps {
  progress: UserProgressState;
  onUpdateProgress: (next: UserProgressState) => void;
  onOpenAdminModal?: () => void;
  onOpenSyllabusStage?: (stage: StageNumber) => void;
  onSpeak?: (text: string, rate?: number) => void;
  adminRevision?: number;
}

export const TodayAndCurriculumHub: React.FC<TodayAndCurriculumHubProps> = ({
  progress,
  onUpdateProgress,
  onOpenSyllabusStage,
  onSpeak,
  adminRevision = 0,
}) => {
  const [activeStep, setActiveStep] = useState<1 | 2 | 3>(() => getTodayProgressSummary(progress).nextStep || 1);
  const [peekStage, setPeekStage] = useState<StageNumber | null>(null);
  const [warmupIdx, setWarmupIdx] = useState<number>(0);
  const [warmupRevealed, setWarmupRevealed] = useState<boolean>(false);

  const [step2HeardAudio, setStep2HeardAudio] = useState<boolean>(false);
  const [step2Revealed, setStep2Revealed] = useState<boolean>(false);
  const [step3Input, setStep3Input] = useState<string>('');
  const [step3Verified, setStep3Verified] = useState<boolean>(false);

  const catalog = useMemo(() => getFullVocabularyCatalog(), [adminRevision, progress.xp]);
  const today = useMemo(() => getTodayProgressSummary(progress), [progress]);
  const pathway = useMemo(() => getOverallPathwaySummary(progress), [progress]);
  const plan = useMemo(
    () => buildAdaptiveDailySession(progress, catalog, peekStage),
    [progress, catalog, peekStage]
  );

  const queueItems = plan.queueItems;
  const activeWord = queueItems[warmupIdx % Math.max(1, queueItems.length)];
  const activeWordIsSpiral = activeWord ? getEntryStageNumber(activeWord) < plan.sessionStageNumber : false;

  const step2Item = queueItems[1] || queueItems[0];
  const step2Sentence = step2Item?.examples[0] || {
    traditional: step2Item?.traditional || '請問，你會說中文嗎？',
    zhuyin: step2Item?.zhuyin || 'ㄑㄧㄥˇ ㄨㄣˋ ㄋㄧˇ ㄏㄨㄟˋ ㄕㄨㄛ ㄓㄨㄥ ㄨㄣˊ ˙ㄇㄚ',
    english: step2Item?.english || 'Excuse me, can you speak Mandarin?',
  };

  const dailyMoeChar = useMemo(() => {
    const stageChars = plan.stageDef.recommendedStrokeChars;
    const match = MOE_STROKE_CHARACTER_BANK.find((c) => stageChars.includes(c.char));
    return match || MOE_STROKE_CHARACTER_BANK[(progress.streak - 1) % MOE_STROKE_CHARACTER_BANK.length];
  }, [plan.stageDef, progress.streak]);

  const expectedDaqian = zhuyinToDaqianKeySequence(dailyMoeChar.zhuyin).trim().toLowerCase();
  const daqianMatched = step3Verified || (expectedDaqian.length > 0 && step3Input.trim().toLowerCase() === expectedDaqian);

  const handleRateStep1 = (rating: FsrsRating) => {
    if (!activeWord) return;
    let next = recordWordPractice(
      { ...progress, xp: progress.xp + 10 },
      { word: activeWord.traditional, zhuyin: activeWord.zhuyin, english: activeWord.english },
      rating >= 2,
      rating
    );
    setWarmupRevealed(false);
    if (warmupIdx + 1 >= Math.min(4, queueItems.length)) {
      next = markDailyStepComplete(next, 1);
      setWarmupIdx(0);
      setActiveStep(2);
    } else {
      setWarmupIdx((i) => i + 1);
    }
    onUpdateProgress(next);
  };

  const handleCompleteStep2 = () => {
    let next = step2Item
      ? recordWordPractice(
          { ...progress, xp: progress.xp + 12 },
          { word: step2Item.traditional, zhuyin: step2Item.zhuyin, english: step2Item.english },
          true,
          3
        )
      : { ...progress, xp: progress.xp + 12 };
    next = markDailyStepComplete(next, 2);
    onUpdateProgress(next);
    setActiveStep(3);
  };

  const handleCompleteStep3 = () => {
    let next = recordCharacterPractice(
      { ...progress, xp: progress.xp + 15 },
      [{ char: dailyMoeChar.char, zhuyin: dailyMoeChar.zhuyin }],
      true,
      3
    );
    next = markDailyStepComplete(next, 3);
    onUpdateProgress(next);
  };

  const ringRadius = 36;
  const ringCircumference = 2 * Math.PI * ringRadius;
  const ringOffset = ringCircumference * (1 - today.percentComplete / 100);
  const canPeekNext = plan.activeStageNumber < 5;
  const nextPeekStage = Math.min(5, plan.activeStageNumber + 1) as StageNumber;

  const presetMatches =
    progress.showPinyinHint === plan.recommendedPreset.showPinyinHint &&
    progress.zhuyinDisplayMode === plan.recommendedPreset.zhuyinDisplayMode;

  return (
    <div className="space-y-5">
      {/* Contextual Peek-Ahead Strip */}
      {plan.isPeekAhead && (
        <div
          className="rounded-xl px-4 py-2.5 border flex flex-wrap items-center justify-between gap-2 text-xs sm:text-sm"
          style={{ backgroundColor: 'var(--fs-warm-soft)', borderColor: 'var(--fs-warm-border)', color: 'var(--fs-warm)' }}
        >
          <span>
            <strong>Peeking Ahead:</strong> Previewing Stage {plan.sessionStageNumber} ({plan.stageDef.titleEn}) with your current scaffolding preserved.
          </span>
          <StylusButton variant="secondary" onClick={() => { setPeekStage(null); setWarmupIdx(0); }}>
            <span>Return to Stage {plan.activeStageNumber}</span>
          </StylusButton>
        </div>
      )}

      {/* Clean Hero Header — Strictly ONE Primary CTA Above the Fold (UX-C3) */}
      <div className="pb-5 border-b fs-divider flex flex-col lg:flex-row lg:items-center justify-between gap-5">
        <div className="flex items-center gap-4">
          <div className="relative w-20 h-20 shrink-0">
            <svg viewBox="0 0 88 88" className="w-20 h-20 -rotate-90">
              <circle cx="44" cy="44" r={ringRadius} fill="none" stroke="var(--fs-hover)" strokeWidth="7" />
              <circle
                cx="44"
                cy="44"
                r={ringRadius}
                fill="none"
                stroke="var(--fs-accent)"
                strokeWidth="7"
                strokeLinecap="round"
                strokeDasharray={ringCircumference}
                strokeDashoffset={ringOffset}
                className="transition-all duration-500"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-lg font-semibold" style={{ color: 'var(--fs-text)' }}>{today.minutesCompleted}m</span>
              <span className="text-[11px]" style={{ color: 'var(--fs-text-muted)' }}>of {today.goalMinutes}m</span>
            </div>
          </div>

          <div className="space-y-1">
            <div className="text-xs font-medium" style={{ color: 'var(--fs-accent-text)' }}>
              Stage {plan.sessionStageNumber} · {plan.stageDef.tocflDualLabel}
              {plan.activeStageNumber === 0 && ` (${pathway.stage0.completedCount}/5 Foundations)`}
            </div>
            <h1 className="text-xl sm:text-2xl font-semibold tracking-tight" style={{ color: 'var(--fs-text)' }}>
              {today.nextStep === null ? 'Daily 10-minute goal complete' : plan.stepTitles[today.nextStep - 1]}
            </h1>
            <p className="text-xs sm:text-sm" style={{ color: 'var(--fs-text-secondary)' }}>
              {plan.currentStageCount} current-stage + {plan.spiralReviewCount} spiral review · {pathway.masteredWordsCount} words mastered
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <StylusButton variant="primary" onClick={() => onOpenSyllabusStage?.(plan.activeStageNumber)}>
            <span>{plan.activeStageNumber === 0 ? 'Continue Stage 0 Foundations' : `Open Stage ${plan.activeStageNumber} Syllabus`}</span>
            <ArrowRight className="w-4 h-4" />
          </StylusButton>
          {canPeekNext && !plan.isPeekAhead && (
            <StylusButton variant="secondary" onClick={() => { setPeekStage(nextPeekStage); setWarmupIdx(0); }}>
              <Sparkles className="w-4 h-4 opacity-75" />
              <span>Peek Stage {nextPeekStage}</span>
            </StylusButton>
          )}
        </div>
      </div>

      {/* Subtle Non-Destructive Preset Hint */}
      {!presetMatches && (
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs px-1" style={{ color: 'var(--fs-text-muted)' }}>
          <span>Stage {plan.sessionStageNumber} suggestion: <strong style={{ color: 'var(--fs-text-secondary)' }}>{plan.recommendedPreset.label}</strong></span>
          <button
            type="button"
            onClick={() =>
              onUpdateProgress({
                ...progress,
                showPinyinHint: plan.recommendedPreset.showPinyinHint,
                zhuyinDisplayMode: plan.recommendedPreset.zhuyinDisplayMode,
              })
            }
            className="underline font-medium min-h-[36px] px-1"
            style={{ color: 'var(--fs-accent-text)' }}
          >
            Apply preset
          </button>
        </div>
      )}

      {/* Clean 3-Step Segmented Selector */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
        {([1, 2, 3] as const).map((stepNum) => {
          const isDone = today.stepsCompleted.includes(stepNum);
          const isActive = activeStep === stepNum;
          return (
            <button
              key={stepNum}
              type="button"
              onClick={() => setActiveStep(stepNum)}
              style={{
                minHeight: '64px',
                backgroundColor: isActive ? 'var(--fs-surface)' : 'var(--fs-subtle)',
                borderColor: isActive ? 'var(--fs-accent-border)' : 'var(--fs-border)',
                boxShadow: isActive ? 'var(--fs-shadow)' : 'none',
              }}
              className="px-4 py-3 rounded-xl border text-left transition flex items-center gap-3"
            >
              <span
                className="w-6 h-6 rounded-full inline-flex items-center justify-center text-xs font-semibold shrink-0"
                style={{
                  backgroundColor: isDone ? 'var(--fs-accent)' : 'var(--fs-surface)',
                  color: isDone ? 'var(--fs-on-accent)' : 'var(--fs-text-secondary)',
                  border: isDone ? 'none' : '1px solid var(--fs-border-strong)',
                }}
              >
                {isDone ? <Check className="w-3.5 h-3.5" /> : stepNum}
              </span>
              <div className="min-w-0">
                <div className="text-[11.5px]" style={{ color: isActive ? 'var(--fs-accent-text)' : 'var(--fs-text-muted)' }}>
                  {stepNum === 2 ? '4 min' : '3 min'}
                </div>
                <div className="text-[13.5px] font-semibold truncate" style={{ color: 'var(--fs-text)' }}>
                  {plan.stepTitles[stepNum - 1].replace(/^Step \d:\s*/, '')}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Single Calm Focus Practice Card (Zero Nested Card-in-Card Stacking) */}
      <section className="fs-card p-5 sm:p-7 space-y-5">
        {activeStep === 1 && activeWord && (
          <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b fs-divider">
              <div>
                <div className="flex items-center gap-2 text-xs font-medium" style={{ color: 'var(--fs-accent-text)' }}>
                  <span>Card {warmupIdx + 1} of {Math.min(4, queueItems.length)}</span>
                  <span className="px-2 py-0.5 rounded-md" style={{ backgroundColor: 'var(--fs-subtle)', color: 'var(--fs-text-secondary)' }}>
                    {activeWordIsSpiral ? 'Spiral Review' : `Stage ${plan.sessionStageNumber}`}
                  </span>
                </div>
                <div className="text-sm mt-0.5" style={{ color: 'var(--fs-text-secondary)' }}>{plan.stepDescriptions[0]}</div>
              </div>
              <div className="flex gap-1.5">
                <StylusButton variant="secondary" onClick={() => onSpeak?.(activeWord.traditional, 0.9)}>
                  <Volume2 className="w-4 h-4" />
                  <span>Normal</span>
                </StylusButton>
                <StylusButton variant="ghost" onClick={() => onSpeak?.(activeWord.traditional, 0.65)}>
                  <span>Slow</span>
                </StylusButton>
              </div>
            </div>

            <div className="py-4 flex flex-col items-center text-center gap-5">
              <RubyText
                text={activeWord.traditional}
                zhuyin={activeWord.zhuyin}
                pinyin={activeWord.pinyin}
                showPinyinHint={progress.showPinyinHint}
                size="xl"
                zhuyinDisplayMode={warmupRevealed ? 'always' : progress.zhuyinDisplayMode}
                charMastery={progress.charMastery}
              />
              {warmupRevealed ? (
                <div className="space-y-4 w-full max-w-lg">
                  <div className="text-lg font-semibold" style={{ color: 'var(--fs-text)' }}>{activeWord.english}</div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    <StylusButton variant="danger" onClick={() => handleRateStep1(1)}><span>1 · Again</span></StylusButton>
                    <StylusButton variant="amber" onClick={() => handleRateStep1(2)}><span>2 · Hard</span></StylusButton>
                    <StylusButton variant="secondary" onClick={() => handleRateStep1(3)}><span>3 · Good</span></StylusButton>
                    <StylusButton variant="primary" onClick={() => handleRateStep1(4)}><span>4 · Easy</span></StylusButton>
                  </div>
                </div>
              ) : (
                <StylusButton variant="primary" onClick={() => setWarmupRevealed(true)}>
                  <Eye className="w-4 h-4" />
                  <span>Reveal Meaning &amp; Rate Recall</span>
                </StylusButton>
              )}
            </div>
          </div>
        )}

        {activeStep === 2 && (
          <div className="space-y-5">
            <div className="pb-3 border-b fs-divider">
              <div className="text-xs font-medium" style={{ color: 'var(--fs-accent-text)' }}>
                Step 2 · Audio-First Listening &amp; Active Recall
              </div>
              <div className="text-sm mt-0.5" style={{ color: 'var(--fs-text-secondary)' }}>{plan.stepDescriptions[1]}</div>
            </div>

            <div className="flex flex-wrap gap-2">
              <StylusButton
                variant="primary"
                onClick={() => {
                  setStep2HeardAudio(true);
                  onSpeak?.(step2Sentence.traditional, 0.9);
                }}
              >
                <Volume2 className="w-4 h-4" />
                <span>Play Native Audio</span>
              </StylusButton>
              <StylusButton
                variant="secondary"
                onClick={() => {
                  setStep2HeardAudio(true);
                  onSpeak?.(step2Sentence.traditional, 0.65);
                }}
              >
                <span>Slow (0.65×)</span>
              </StylusButton>
              <StylusButton variant="ghost" onClick={() => setStep2Revealed((v) => !v)}>
                <Eye className="w-4 h-4" />
                <span>{step2Revealed ? 'Hide Script' : 'Reveal Script'}</span>
              </StylusButton>
            </div>

            {step2Revealed ? (
              <div className="fs-subtle-box p-4 space-y-2">
                <RubyText
                  text={step2Sentence.traditional}
                  zhuyin={step2Sentence.zhuyin}
                  showPinyinHint={progress.showPinyinHint}
                  size="lg"
                  zhuyinDisplayMode={progress.zhuyinDisplayMode}
                  charMastery={progress.charMastery}
                />
                <p className="text-sm" style={{ color: 'var(--fs-text-secondary)' }}>{step2Sentence.english}</p>
              </div>
            ) : (
              <p className="text-sm" style={{ color: 'var(--fs-text-muted)' }}>
                Listen first and repeat aloud in natural Taiwan cadence, then tap Reveal Script to verify.
              </p>
            )}

            <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t fs-divider">
              <StylusButton
                variant="secondary"
                onClick={() =>
                  dispatchStudioHandoff({
                    fromStudio: 'hub',
                    fromLabel: 'Today’s Session',
                    toStudio: 'speaking',
                    targetText: step2Sentence.traditional,
                    targetZhuyin: step2Sentence.zhuyin,
                    targetEnglish: step2Sentence.english,
                  })
                }
              >
                <Mic className="w-4 h-4" />
                <span>Check Pitch</span>
              </StylusButton>
              <StylusButton variant="primary" disabled={!step2HeardAudio && !step2Revealed} onClick={handleCompleteStep2}>
                <span>{step2HeardAudio || step2Revealed ? 'Complete Step 2' : 'Play Audio or Reveal First'}</span>
                <ArrowRight className="w-4 h-4" />
              </StylusButton>
            </div>
          </div>
        )}

        {activeStep === 3 && (
          <div className="space-y-5">
            <div className="pb-3 border-b fs-divider">
              <div className="text-xs font-medium" style={{ color: 'var(--fs-accent-text)' }}>
                Step 3 · Taiwan MOE Character &amp; DaQian Reflex
              </div>
              <div className="text-sm mt-0.5" style={{ color: 'var(--fs-text-secondary)' }}>{plan.stepDescriptions[2]}</div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <RubyText
                  text={dailyMoeChar.char}
                  zhuyin={dailyMoeChar.zhuyin}
                  pinyin={dailyMoeChar.pinyin}
                  showPinyinHint={progress.showPinyinHint}
                  size="xl"
                  zhuyinDisplayMode="always"
                />
                <div className="space-y-1">
                  <div className="text-base font-semibold" style={{ color: 'var(--fs-text)' }}>
                    {dailyMoeChar.english} · {dailyMoeChar.totalStrokes} strokes
                  </div>
                  <div className="text-xs" style={{ color: 'var(--fs-text-secondary)' }}>
                    {dailyMoeChar.taiwanMoeOrthographyNote}
                  </div>
                  <div className="text-xs font-mono font-semibold" style={{ color: 'var(--fs-accent-text)' }}>
                    DaQian: {Array.from(zhuyinToDaqianKeySequence(dailyMoeChar.zhuyin)).map((k) => (k === ' ' ? '[Space]' : k.toUpperCase())).join(' → ')}
                  </div>
                </div>
              </div>
              <StylusButton
                variant="secondary"
                onClick={() => {
                  setStep3Verified(true);
                  dispatchStudioHandoff({
                    fromStudio: 'hub',
                    fromLabel: 'Today’s Session',
                    toStudio: 'calligraphy',
                    targetText: dailyMoeChar.char,
                    targetZhuyin: dailyMoeChar.zhuyin,
                    targetEnglish: dailyMoeChar.english,
                  });
                }}
              >
                <PenTool className="w-4 h-4" />
                <span>Write on Canvas</span>
              </StylusButton>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 pt-3 border-t fs-divider">
              <input
                type="text"
                value={step3Input}
                onChange={(e) => setStep3Input(e.target.value)}
                placeholder={`Type DaQian keys (${expectedDaqian.toUpperCase() || 'keys'}) to verify…`}
                className="fs-input flex-1 font-mono"
              />
              <StylusButton variant="primary" disabled={!daqianMatched} onClick={handleCompleteStep3}>
                <Check className="w-4 h-4" />
                <span>{daqianMatched ? 'Complete Today’s Goal' : 'Type Keys or Write'}</span>
              </StylusButton>
            </div>
          </div>
        )}
      </section>
    </div>
  );
};
