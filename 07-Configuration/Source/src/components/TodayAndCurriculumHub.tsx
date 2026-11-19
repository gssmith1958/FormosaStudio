/**
 * FormosaStudio (FORM) — Studio 1: Home, Daily 10-Min Guided Plan & Overall Learning Pathway
 * Presents clear daily progress (minutes + 3-step checklist), a 6-stage Taiwanese Mandarin
 * Learning Pathway (Completed -> Current -> Up Next), and delegates Pimsleur/NTNU/TOCFL
 * explorers to CurriculumExplorers.tsx per Pattern 12 (<= 600 LOC).
 * Traces to: FORM-REQ-0003, FORM-REQ-0018, FORM-REQ-0020, FORM-REQ-0021, FORM-REQ-0022
 */

import React, { useMemo, useState } from 'react';
import { PIMSLEUR_UNITS } from '../data/pimsleurUnitsB.ts';
import { CONTEMPORARY_VOLUMES } from '../data/contemporaryVols3to6.ts';
import { getFullVocabularyCatalog } from '../data/vocabularyCatalog.ts';
import { MOE_STROKE_CHARACTER_BANK } from '../data/moeStrokeAndPhoneticData.ts';
import { zhuyinToDaqianKeySequence } from '../data/daqianAndDojoData.ts';
import {
  getCustomPimsleurUnits,
  mergeCustomContemporaryVolumes,
} from '../lib/curriculumAdminStore.ts';
import {
  FsrsRating,
  UserProgressState,
  getDueSrsWords,
  getOverallPathwaySummary,
  getTodayProgressSummary,
  markDailyStepComplete,
  recordCharacterPractice,
  recordWordPractice,
} from '../lib/progressStore.ts';
import { dispatchStudioHandoff } from '../lib/studioContextBus.ts';
import { StudioModeOption, StudioModeSwitcher, StylusButton } from './uiPrimitives.tsx';
import { RubyText } from './RubyText.tsx';
import {
  NtnuExplorerView,
  PimsleurExplorerView,
  TocflReadinessView,
} from './CurriculumExplorers.tsx';
import { Stage0BeginnerLaunchpad } from './Stage0BeginnerLaunchpad.tsx';

type Studio1SubTab = 'stage0' | 'pathway' | 'pimsleur' | 'contemporary' | 'tocfl_readiness';

export interface TodayAndCurriculumHubProps {
  progress: UserProgressState;
  onUpdateProgress: (next: UserProgressState) => void;
  onOpenAdminModal: () => void;
  onSpeak?: (text: string, rate?: number) => void;
  adminRevision?: number;
}

export const TodayAndCurriculumHub: React.FC<TodayAndCurriculumHubProps> = ({
  progress,
  onUpdateProgress,
  onOpenAdminModal,
  onSpeak,
  adminRevision = 0,
}) => {
  const [subTab, setSubTab] = useState<Studio1SubTab>('pathway');
  const [activeStep, setActiveStep] = useState<1 | 2 | 3>(() => getTodayProgressSummary(progress).nextStep || 1);
  const [warmupIdx, setWarmupIdx] = useState<number>(0);
  const [warmupRevealed, setWarmupRevealed] = useState<boolean>(false);
  const [selectedPimsleurUnit, setSelectedPimsleurUnit] = useState<number>(1);
  const [selectedVolumeNum, setSelectedVolumeNum] = useState<number>(1);
  const [selectedLessonNum, setSelectedLessonNum] = useState<number>(1);

  const allPimsleurUnits = useMemo(() => {
    const custom = getCustomPimsleurUnits();
    const map = new Map<number, (typeof PIMSLEUR_UNITS)[number]>();
    for (const u of PIMSLEUR_UNITS) map.set(u.unit, u);
    for (const cu of custom) map.set(cu.unit, cu);
    return Array.from(map.values()).sort((a, b) => a.unit - b.unit);
  }, [adminRevision, progress.xp]);

  const allContemporaryVolumes = useMemo(
    () => mergeCustomContemporaryVolumes(CONTEMPORARY_VOLUMES),
    [adminRevision, progress.xp]
  );

  const catalog = useMemo(() => getFullVocabularyCatalog(), [adminRevision, progress.xp]);
  const dueWords = useMemo(() => getDueSrsWords(progress), [progress]);
  const today = useMemo(() => getTodayProgressSummary(progress), [progress]);
  const pathway = useMemo(() => getOverallPathwaySummary(progress), [progress]);

  const subTabs: StudioModeOption<Studio1SubTab>[] = [
    { id: 'pathway', labelEn: 'Today & Path', labelZh: '今日路徑' },
    { id: 'stage0', labelEn: 'Start From Zero', labelZh: '零基礎入門', badge: `${pathway.stage0.completedCount}/5` },
    { id: 'pimsleur', labelEn: 'Pimsleur', labelZh: '聽說單元', badge: '19+' },
    { id: 'contemporary', labelEn: 'NTNU Textbook', labelZh: '當代中文', badge: '6 Vols' },
    { id: 'tocfl_readiness', labelEn: 'TOCFL', labelZh: '能力指標' },
  ];

  const warmupBatch = useMemo(() => {
    const base = dueWords.length >= 3
      ? dueWords.slice(0, 3)
      : [
          ...dueWords,
          ...catalog.slice(0, 5).map((c) => ({
            word: c.traditional,
            zhuyin: c.zhuyin,
            pinyin: c.pinyin,
            english: c.english,
            stability: 1.0,
            difficulty: 5.0,
          })),
        ].slice(0, 3);
    return base;
  }, [dueWords, catalog]);

  const dailyWarmupWord = warmupBatch[warmupIdx % warmupBatch.length] || {
    word: '你好',
    zhuyin: 'ㄋㄧˇ ㄏㄠˇ',
    pinyin: 'nǐ hǎo',
    english: 'Hello',
  };
  const nextUnitObj =
    allPimsleurUnits.find((u) => u.unit === (pathway.currentStage.nextPimsleurUnit || 1)) ||
    allPimsleurUnits[0];
  const dailyDialogue = nextUnitObj.dialogues[0] || {
    traditional: '請問，你會說中文嗎？',
    zhuyin: 'ㄑㄧㄥˇ ㄨㄣˋ ㄋㄧˇ ㄏㄨㄟˋ ㄕㄨㄛ ㄓㄨㄥ ㄨㄣˊ ˙ㄇㄚ',
    pinyin: 'Qǐngwèn, nǐ huì shuō Zhōngwén ma?',
    english: 'Excuse me, can you speak Mandarin?',
  };
  // Pick an easy-first 2–5 stroke character while in Stage 0/1, progressing to full bank in Stage 2+
  const stageCharPool =
    pathway.currentStage.stageNumber <= 1 ? MOE_STROKE_CHARACTER_BANK.slice(0, 8) : MOE_STROKE_CHARACTER_BANK;
  const dailyMoeChar = stageCharPool[(progress.streak - 1) % stageCharPool.length] || stageCharPool[0];
  const dailyDaqianKeys = zhuyinToDaqianKeySequence(dailyMoeChar.zhuyin);

  const handleCompleteStep1 = (rating: FsrsRating) => {
    let next = recordWordPractice(
      { ...progress, xp: progress.xp + 10 },
      { word: dailyWarmupWord.word, zhuyin: dailyWarmupWord.zhuyin, english: dailyWarmupWord.english },
      rating >= 2,
      rating
    );
    setWarmupRevealed(false);
    if (warmupIdx + 1 >= warmupBatch.length) {
      next = markDailyStepComplete(next, 1);
      setWarmupIdx(0);
      setActiveStep(2);
    } else {
      setWarmupIdx((i) => i + 1);
    }
    onUpdateProgress(next);
  };

  const handleCompleteStep2 = () => {
    const targetVocab = nextUnitObj.vocab[0];
    let next = targetVocab
      ? recordWordPractice(
          { ...progress, xp: progress.xp + 12 },
          { word: targetVocab.traditional, zhuyin: targetVocab.zhuyin, english: targetVocab.english },
          true,
          4
        )
      : { ...progress, xp: progress.xp + 12 };
    next = markDailyStepComplete(next, 2);
    onUpdateProgress(next);
    onSpeak?.(dailyDialogue.traditional);
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

  const ringRadius = 42;
  const ringCircumference = 2 * Math.PI * ringRadius;
  const ringOffset = ringCircumference * (1 - today.percentComplete / 100);

  const dailyStepItems: { id: 1 | 2 | 3; title: string; mins: string; detail: string }[] = [
    { id: 1, title: 'Vocabulary Warmup', mins: '3 min', detail: `Review「${dailyWarmupWord.word}」with FSRS` },
    { id: 2, title: 'Listening & Shadowing', mins: '4 min', detail: `Pimsleur Unit ${nextUnitObj.unit} dialogue` },
    { id: 3, title: 'Stroke & Keystroke Reflex', mins: '3 min', detail: `Taiwan MOE character「${dailyMoeChar.char}」` },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <StudioModeSwitcher modes={subTabs} activeMode={subTab} onSelect={setSubTab} />
        <StylusButton variant="secondary" onClick={onOpenAdminModal}>
          <span>+ Add Pack</span>
        </StylusButton>
      </div>

      {subTab === 'stage0' && (
        <Stage0BeginnerLaunchpad
          progress={progress}
          onUpdateProgress={onUpdateProgress}
          onSpeak={onSpeak}
          onFinishedStage0={() => setSubTab('pathway')}
        />
      )}

      {subTab === 'pathway' && (
        <div className="space-y-6">
          {/* STAGE 0 LAUNCHPAD CALLOUT FOR NEW / DAY-1 LEARNERS */}
          {!pathway.stage0.isCompleteOrSkipped && (
            <section
              className="rounded-2xl p-5 sm:p-6 border flex flex-col lg:flex-row lg:items-center justify-between gap-4"
              style={{ backgroundColor: 'var(--fs-accent-soft)', borderColor: 'var(--fs-accent-border)' }}
            >
              <div className="space-y-1.5">
                <div className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--fs-accent-text)' }}>
                  Recommended Starting Point · Stage 0 ({pathway.stage0.completedCount} of 5 Complete)
                </div>
                <h2 className="text-xl font-bold" style={{ color: 'var(--fs-text)' }}>
                  New to Taiwanese Mandarin, Tones, or Zhuyin (ㄅㄆㄇㄈ)? Start Here First
                </h2>
                <p className="text-sm max-w-3xl" style={{ color: 'var(--fs-text-secondary)' }}>
                  5 bite-sized beginner lessons designed for native English speakers: Tone Ear Boot Camp, Zhuyin Sound Map, English→Mandarin Grammar Rules, 8 Basic Strokes, and your First 10 Taipei Phrases.
                </p>
              </div>
              <div className="flex flex-wrap gap-2 shrink-0">
                <StylusButton variant="primary" onClick={() => setSubTab('stage0')}>
                  <span>Start Stage 0 ({pathway.stage0.nextModuleId || '0.1'}) →</span>
                </StylusButton>
              </div>
            </section>
          )}

          {/* HERO: TODAY'S GUIDED SESSION & DAILY PROGRESS */}
          <section className="fs-card p-6 sm:p-7 space-y-6">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="flex items-center gap-5">
                <div className="relative w-24 h-24 shrink-0">
                  <svg viewBox="0 0 100 100" className="w-24 h-24 -rotate-90">
                    <circle cx="50" cy="50" r={ringRadius} fill="none" stroke="var(--fs-subtle)" strokeWidth="9" />
                    <circle
                      cx="50"
                      cy="50"
                      r={ringRadius}
                      fill="none"
                      stroke="var(--fs-accent)"
                      strokeWidth="9"
                      strokeLinecap="round"
                      strokeDasharray={ringCircumference}
                      strokeDashoffset={ringOffset}
                      className="transition-all duration-500"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-xl font-bold" style={{ color: 'var(--fs-text)' }}>
                      {today.minutesCompleted}m
                    </span>
                    <span className="text-xs" style={{ color: 'var(--fs-text-muted)' }}>
                      of {today.goalMinutes}m
                    </span>
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--fs-accent-text)' }}>
                    Today’s Guided Session · {today.dateIso}
                  </div>
                  <h1 className="text-2xl sm:text-[28px] font-bold tracking-tight" style={{ color: 'var(--fs-text)' }}>
                    {today.nextStep === null
                      ? 'Daily 10-minute goal complete'
                      : `Step ${today.nextStep} of 3: ${dailyStepItems[today.nextStep - 1].title}`}
                  </h1>
                  <p className="text-sm sm:text-[15px]" style={{ color: 'var(--fs-text-secondary)' }}>
                    Stage {pathway.currentStage.stageNumber} ({pathway.currentStage.tocflTarget}) ·{' '}
                    {pathway.completedLessonsTotal} of {pathway.totalCurriculumLessons} lessons complete ({pathway.overallPercent}%) ·{' '}
                    {pathway.masteredWordsCount} words mastered
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2.5 shrink-0">
                <StylusButton variant="primary" onClick={() => setActiveStep(today.nextStep || 1)}>
                  <span>
                    {today.nextStep === null ? 'Review Steps Again' : `Continue Step ${today.nextStep} →`}
                  </span>
                </StylusButton>
                <StylusButton
                  variant="secondary"
                  onClick={() => {
                    setSelectedVolumeNum(pathway.currentStage.nextNtnuVolume);
                    setSelectedLessonNum(pathway.currentStage.nextNtnuLesson);
                    setSubTab('contemporary');
                  }}
                >
                  <span>
                    Open NTNU V{pathway.currentStage.nextNtnuVolume} L{pathway.currentStage.nextNtnuLesson}
                  </span>
                </StylusButton>
              </div>
            </div>

            {/* 3-Step Daily Checklist */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {dailyStepItems.map((step) => {
                const isDone = today.stepsCompleted.includes(step.id);
                const isActive = activeStep === step.id;
                return (
                  <button
                    key={step.id}
                    type="button"
                    onClick={() => setActiveStep(step.id)}
                    style={{
                      minHeight: '76px',
                      backgroundColor: isActive ? 'var(--fs-accent-soft)' : 'var(--fs-subtle)',
                      borderColor: isActive ? 'var(--fs-accent-border)' : 'var(--fs-border)',
                    }}
                    className="p-4 rounded-2xl border text-left transition flex items-start justify-between gap-3"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-xs font-semibold">
                        <span
                          className="w-6 h-6 rounded-full inline-flex items-center justify-center text-xs font-bold"
                          style={{
                            backgroundColor: isDone ? 'var(--fs-accent)' : 'var(--fs-surface)',
                            color: isDone ? '#ffffff' : 'var(--fs-text)',
                            border: isDone ? 'none' : '1px solid var(--fs-border-strong)',
                          }}
                        >
                          {isDone ? '✓' : step.id}
                        </span>
                        <span style={{ color: isActive ? 'var(--fs-accent-text)' : 'var(--fs-text-secondary)' }}>
                          {step.mins}
                        </span>
                      </div>
                      <div className="text-[15px] font-bold" style={{ color: 'var(--fs-text)' }}>
                        {step.title}
                      </div>
                      <div className="text-xs" style={{ color: 'var(--fs-text-secondary)' }}>
                        {step.detail}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Active Daily Practice Panel */}
            <div className="fs-subtle-box p-6 space-y-5">
              {activeStep === 1 && (
                <div className="space-y-5">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <div className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--fs-accent-text)' }}>
                        Step 1 of 3 · Spaced-Repetition Warmup (Card {warmupIdx + 1} of {warmupBatch.length})
                      </div>
                      <div className="text-lg font-bold" style={{ color: 'var(--fs-text)' }}>
                        Recall the pronunciation &amp; meaning, then rate how easily it came back
                      </div>
                    </div>
                    <div className="flex gap-1.5">
                      <StylusButton variant="secondary" onClick={() => onSpeak?.(dailyWarmupWord.word, 0.92)}><span>Normal</span></StylusButton>
                      <StylusButton variant="ghost" onClick={() => onSpeak?.(dailyWarmupWord.word, 0.65)}><span>Slow</span></StylusButton>
                    </div>
                  </div>

                  <div className="fs-card p-6 flex flex-col items-center text-center gap-3">
                    <RubyText
                      text={dailyWarmupWord.word}
                      zhuyin={dailyWarmupWord.zhuyin}
                      pinyin={'pinyin' in dailyWarmupWord ? (dailyWarmupWord as { pinyin?: string }).pinyin : undefined}
                      showPinyinHint={progress.showPinyinHint}
                      size="xl"
                      zhuyinDisplayMode={warmupRevealed ? 'always' : progress.zhuyinDisplayMode}
                      charMastery={progress.charMastery}
                    />
                    {warmupRevealed ? (
                      <div className="space-y-4 w-full max-w-xl">
                        <div className="text-xl font-semibold" style={{ color: 'var(--fs-text)' }}>{dailyWarmupWord.english}</div>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                          <StylusButton variant="danger" onClick={() => handleCompleteStep1(1)}><span>1 · Again</span></StylusButton>
                          <StylusButton variant="amber" onClick={() => handleCompleteStep1(2)}><span>2 · Hard</span></StylusButton>
                          <StylusButton variant="secondary" onClick={() => handleCompleteStep1(3)}><span>3 · Good</span></StylusButton>
                          <StylusButton variant="primary" onClick={() => handleCompleteStep1(4)}><span>4 · Easy</span></StylusButton>
                        </div>
                      </div>
                    ) : (
                      <StylusButton variant="primary" onClick={() => setWarmupRevealed(true)}><span>Reveal Meaning &amp; Zhuyin</span></StylusButton>
                    )}
                  </div>
                </div>
              )}

              {activeStep === 2 && (
                <div className="space-y-5">
                  <div>
                    <div className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--fs-accent-text)' }}>
                      Step 2 of 3 · Listening &amp; Shadowing (Pimsleur Unit {nextUnitObj.unit})
                    </div>
                    <div className="text-lg font-bold" style={{ color: 'var(--fs-text)' }}>
                      Listen to the Taiwanese phrasing, speak it aloud, then check your tone contour
                    </div>
                  </div>
                  <div className="fs-card p-6 space-y-4">
                    <RubyText
                      text={dailyDialogue.traditional}
                      zhuyin={dailyDialogue.zhuyin}
                      pinyin={dailyDialogue.pinyin}
                      showPinyinHint={progress.showPinyinHint}
                      size="lg"
                      zhuyinDisplayMode={progress.zhuyinDisplayMode}
                      charMastery={progress.charMastery}
                    />
                    <p className="text-base" style={{ color: 'var(--fs-text-secondary)' }}>{dailyDialogue.english}</p>
                    <div className="flex flex-wrap gap-2.5 pt-1">
                      <StylusButton variant="secondary" onClick={() => onSpeak?.(dailyDialogue.traditional, 0.92)}><span>Play Normal</span></StylusButton>
                      <StylusButton variant="ghost" onClick={() => onSpeak?.(dailyDialogue.traditional, 0.65)}><span>Play Slow (0.65x)</span></StylusButton>
                      <StylusButton
                        variant="secondary"
                        onClick={() => dispatchStudioHandoff({ fromStudio: 'hub', fromLabel: 'Today’s Session', toStudio: 'speaking', targetText: dailyDialogue.traditional, targetZhuyin: dailyDialogue.zhuyin, targetEnglish: dailyDialogue.english })}
                      >
                        <span>Check Pitch in Speaking Lab</span>
                      </StylusButton>
                      <StylusButton variant="primary" onClick={handleCompleteStep2}><span>Mark Step 2 Done →</span></StylusButton>
                    </div>
                  </div>
                </div>
              )}

              {activeStep === 3 && (
                <div className="space-y-5">
                  <div>
                    <div className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--fs-accent-text)' }}>
                      Step 3 of 3 · Taiwan MOE Character &amp; DaQian Reflex
                    </div>
                    <div className="text-lg font-bold" style={{ color: 'var(--fs-text)' }}>
                      Practice stroke order on your Wacom canvas or review its DaQian keystrokes
                    </div>
                  </div>
                  <div className="fs-card p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-5">
                    <div className="flex items-center gap-5">
                      <RubyText text={dailyMoeChar.char} zhuyin={dailyMoeChar.zhuyin} pinyin={dailyMoeChar.pinyin} showPinyinHint={progress.showPinyinHint} size="xl" zhuyinDisplayMode="always" />
                      <div className="space-y-1.5">
                        <div className="text-lg font-bold" style={{ color: 'var(--fs-text)' }}>{dailyMoeChar.english} · {dailyMoeChar.totalStrokes} strokes</div>
                        <div className="text-sm" style={{ color: 'var(--fs-text-secondary)' }}>{dailyMoeChar.taiwanMoeOrthographyNote}</div>
                        <div className="text-sm font-mono font-semibold" style={{ color: 'var(--fs-accent-text)' }}>
                          DaQian Keys: {Array.from(dailyDaqianKeys).map((k) => (k === ' ' ? '[Space]' : k.toUpperCase())).join(' → ')}
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2.5 shrink-0">
                      <StylusButton
                        variant="secondary"
                        onClick={() => dispatchStudioHandoff({ fromStudio: 'hub', fromLabel: 'Today’s Session', toStudio: 'calligraphy', targetText: dailyMoeChar.char, targetZhuyin: dailyMoeChar.zhuyin, targetEnglish: dailyMoeChar.english })}
                      >
                        <span>Write on Wacom Canvas</span>
                      </StylusButton>
                      <StylusButton variant="primary" onClick={handleCompleteStep3}><span>Complete Today’s Goal ✓</span></StylusButton>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* OVERALL 6-STAGE LEARNING PATHWAY */}
          <section className="fs-card p-6 sm:p-7 space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div className="space-y-1">
                <div className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--fs-accent-text)' }}>
                  Overall Curriculum Pathway · Zero to TOCFL Band B2
                </div>
                <h2 className="text-xl sm:text-2xl font-bold" style={{ color: 'var(--fs-text)' }}>
                  Your Structured Lesson Plan ({pathway.completedLessonsTotal} / {pathway.totalCurriculumLessons} Lessons)
                </h2>
                <p className="text-sm" style={{ color: 'var(--fs-text-secondary)' }}>
                  Follow the 6 stages below. Mark Pimsleur units and NTNU lessons complete to track your overall progress.
                </p>
              </div>
              <div className="w-full sm:w-56 space-y-1.5">
                <div className="flex justify-between text-xs font-semibold">
                  <span style={{ color: 'var(--fs-text-secondary)' }}>Overall Progress</span>
                  <span style={{ color: 'var(--fs-accent-text)' }}>{pathway.overallPercent}%</span>
                </div>
                <div className="w-full h-2.5 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--fs-subtle)' }}>
                  <div
                    className="h-full rounded-full transition-all duration-300"
                    style={{ width: `${pathway.overallPercent}%`, backgroundColor: 'var(--fs-accent)' }}
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {pathway.stages.map((st) => {
                const isCurrent = st.status === 'current';
                const isDone = st.status === 'completed';
                return (
                  <div
                    key={st.id}
                    className="rounded-2xl p-5 border flex flex-col justify-between gap-4 transition"
                    style={{
                      backgroundColor: isCurrent ? 'var(--fs-accent-soft)' : 'var(--fs-subtle)',
                      borderColor: isCurrent ? 'var(--fs-accent-border)' : 'var(--fs-border)',
                    }}
                  >
                    <div className="space-y-2.5">
                      <div className="flex items-center justify-between gap-2">
                        <span
                          className="px-2.5 py-0.5 rounded-full text-xs font-semibold"
                          style={{
                            backgroundColor: isDone || isCurrent ? 'var(--fs-accent)' : 'var(--fs-surface)',
                            color: isDone || isCurrent ? '#ffffff' : 'var(--fs-text-secondary)',
                          }}
                        >
                          {isDone ? '✓ Completed' : isCurrent ? '● Current Stage' : `Stage ${st.stageNumber}`}
                        </span>
                        <span className="text-xs font-semibold" style={{ color: 'var(--fs-text-muted)' }}>
                          {st.tocflTarget}
                        </span>
                      </div>
                      <div>
                        <div className="text-base font-bold" style={{ color: 'var(--fs-text)' }}>
                          {st.titleEn}
                        </div>
                        <div className="text-xs font-medium" style={{ color: 'var(--fs-text-secondary)' }}>
                          {st.titleZh} · {st.description}
                        </div>
                      </div>
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs font-medium" style={{ color: 'var(--fs-text-secondary)' }}>
                          <span>{st.completedUnits} of {st.totalUnits} lessons</span>
                          <span>{st.percent}%</span>
                        </div>
                        <div className="w-full h-2 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--fs-surface)' }}>
                          <div className="h-full rounded-full" style={{ width: `${st.percent}%`, backgroundColor: 'var(--fs-accent)' }} />
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {st.nextPimsleurUnit !== undefined && (
                        <StylusButton
                          variant={isCurrent ? 'primary' : 'secondary'}
                          onClick={() => {
                            setSelectedPimsleurUnit(st.nextPimsleurUnit!);
                            setSubTab('pimsleur');
                          }}
                        >
                          <span>Pimsleur U{st.nextPimsleurUnit}</span>
                        </StylusButton>
                      )}
                      <StylusButton
                        variant={isCurrent && st.nextPimsleurUnit === undefined ? 'primary' : 'secondary'}
                        onClick={() => {
                          setSelectedVolumeNum(st.nextNtnuVolume);
                          setSelectedLessonNum(st.nextNtnuLesson);
                          setSubTab('contemporary');
                        }}
                      >
                        <span>NTNU V{st.nextNtnuVolume} L{st.nextNtnuLesson}</span>
                      </StylusButton>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        </div>
      )}

      {subTab === 'pimsleur' && (
        <PimsleurExplorerView
          units={allPimsleurUnits}
          selectedUnit={selectedPimsleurUnit}
          onSelectUnit={setSelectedPimsleurUnit}
          progress={progress}
          onUpdateProgress={onUpdateProgress}
          onSpeak={onSpeak}
        />
      )}

      {subTab === 'contemporary' && (
        <NtnuExplorerView
          volumes={allContemporaryVolumes}
          selectedVolume={selectedVolumeNum}
          selectedLesson={selectedLessonNum}
          onSelectVolume={(vol, firstL) => {
            setSelectedVolumeNum(vol);
            setSelectedLessonNum(firstL);
          }}
          onSelectLesson={setSelectedLessonNum}
          progress={progress}
          onUpdateProgress={onUpdateProgress}
          onSpeak={onSpeak}
        />
      )}

      {subTab === 'tocfl_readiness' && <TocflReadinessView catalog={catalog} progress={progress} />}
    </div>
  );
};
