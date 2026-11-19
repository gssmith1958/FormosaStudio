/**
 * FormosaStudio (FORM) — Studio 1: Today's Study Hub, Inline 10-Min Daily Flow Runner & Full Curriculum Explorer
 * Integrates:
 * 1. Inline 10-Minute Daily Flow Runner (FSRS Warmup -> Pimsleur/Survival Dialogue -> MOE Stroke & DaQian Reflex)
 * 2. Pimsleur Taiwanese Mandarin Units 1–19 (+ Custom Admin Units) Interactive Explorer
 * 3. NTNU A Course in Contemporary Chinese (當代中文課程) Volumes 1–6 (61 Lessons + Custom Admin Lessons)
 * 4. TOCFL Novice 1 – Band B2 Live Readiness Dashboard
 * Traces to: FORM-REQ-0003, FORM-REQ-0018, FORM-REQ-0020, FORM-REQ-0021, FORM-REQ-0022, FORM-DEP-UX-001
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
  recordCharacterPractice,
  recordWordPractice,
} from '../lib/progressStore.ts';
import {
  dispatchStudioHandoff,
  setFocusedContextItem,
} from '../lib/studioContextBus.ts';
import {
  CrossStudioActionPills,
  StudioHeaderBanner,
  StudioModeOption,
  StudioModeSwitcher,
  StylusButton,
} from './uiPrimitives.tsx';
import { RubyText } from './RubyText.tsx';

type Studio1SubTab = 'daily_flow' | 'pimsleur' | 'contemporary' | 'tocfl_readiness';

const SUB_TABS: StudioModeOption<Studio1SubTab>[] = [
  { id: 'daily_flow', labelZh: '今日十分鐘引導流', labelEn: 'Inline 10-Min Daily Flow', badge: '3 步驟' },
  { id: 'pimsleur', labelZh: 'Pimsleur 聽說單元', labelEn: 'Pimsleur Units 1–19+', badge: '19+ 單元' },
  { id: 'contemporary', labelZh: '臺師大當代中文課程', labelEn: 'NTNU Vols. 1–6', badge: '6 冊 · 61+ 課' },
  { id: 'tocfl_readiness', labelZh: '華語文能力測驗進度', labelEn: 'TOCFL Readiness', badge: 'Novice 1–B2' },
];

export interface TodayAndCurriculumHubProps {
  progress: UserProgressState;
  onUpdateProgress: (next: UserProgressState) => void;
  onOpenAdminModal: () => void;
  onSpeak?: (text: string) => void;
  adminRevision?: number;
}

export const TodayAndCurriculumHub: React.FC<TodayAndCurriculumHubProps> = ({
  progress,
  onUpdateProgress,
  onOpenAdminModal,
  onSpeak,
  adminRevision = 0,
}) => {
  const [subTab, setSubTab] = useState<Studio1SubTab>('daily_flow');
  const [flowStep, setFlowStep] = useState<1 | 2 | 3>(1);
  const [flowWarmupRevealed, setFlowWarmupRevealed] = useState<boolean>(false);
  const [flowStepsDone, setFlowStepsDone] = useState<Record<1 | 2 | 3, boolean>>({ 1: false, 2: false, 3: false });

  // Pimsleur explorer state
  const [selectedPimsleurUnit, setSelectedPimsleurUnit] = useState<number>(1);
  // Contemporary Chinese explorer state
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

  const activeUnit =
    allPimsleurUnits.find((u) => u.unit === selectedPimsleurUnit) || allPimsleurUnits[0];
  const activeVolume =
    allContemporaryVolumes.find((v) => v.volume === selectedVolumeNum) || allContemporaryVolumes[0];
  const activeLesson =
    activeVolume.lessons.find((l) => l.lesson === selectedLessonNum) || activeVolume.lessons[0];

  // Daily Flow Step 1 Card, Step 2 Dialogue, Step 3 MOE Character
  const dailyWarmupWord = dueWords[0] || {
    word: catalog[0]?.traditional || '請問',
    zhuyin: catalog[0]?.zhuyin || 'ㄑㄧㄥˇ ㄨㄣˋ',
    english: catalog[0]?.english || 'Excuse me / May I ask',
    stability: 1.0,
    difficulty: 5.0,
  };
  const dailyDialogue = activeUnit.dialogues[0] || {
    traditional: '請問，捷運站在哪裡？',
    zhuyin: 'ㄑㄧㄥˇ ㄨㄣˋ ， ㄐㄧㄝˊ ㄩㄣˋ ㄓㄢˋ ㄗㄞˋ ㄋㄚˇ ㄌㄧˇ ？',
    english: 'Excuse me, where is the MRT station?',
  };
  const dailyMoeChar = MOE_STROKE_CHARACTER_BANK[progress.streak % MOE_STROKE_CHARACTER_BANK.length] || MOE_STROKE_CHARACTER_BANK[0];
  const dailyDaqianKeys = zhuyinToDaqianKeySequence(dailyMoeChar.zhuyin);

  const handleGradeDailyWarmup = (rating: FsrsRating) => {
    const next = recordWordPractice(
      { ...progress, xp: progress.xp + 10 },
      { word: dailyWarmupWord.word, zhuyin: dailyWarmupWord.zhuyin, english: dailyWarmupWord.english },
      rating >= 2,
      rating
    );
    onUpdateProgress(next);
    setFlowWarmupRevealed(false);
    setFlowStepsDone((s) => ({ ...s, 1: true }));
    setFlowStep(2);
  };

  const handleCompleteDialogueStep = () => {
    const targetVocab = activeUnit.vocab[0];
    const next = targetVocab
      ? recordWordPractice(
          { ...progress, xp: progress.xp + 12 },
          { word: targetVocab.traditional, zhuyin: targetVocab.zhuyin, english: targetVocab.english },
          true,
          4
        )
      : { ...progress, xp: progress.xp + 12 };
    onUpdateProgress(next);
    onSpeak?.(dailyDialogue.traditional);
    setFlowStepsDone((s) => ({ ...s, 2: true }));
    setFlowStep(3);
  };

  const handleCompleteStrokeReflexStep = () => {
    const next = recordCharacterPractice(
      { ...progress, xp: progress.xp + 15 },
      [{ char: dailyMoeChar.char, zhuyin: dailyMoeChar.zhuyin }],
      true,
      3
    );
    onUpdateProgress(next);
    setFlowStepsDone((s) => ({ ...s, 3: true }));
  };

  const tocflBandStats = useMemo(() => {
    const bands = [
      'Novice 1 (準備一級)',
      'Novice 2 (準備二級)',
      'Band A · Level 1 (入門級)',
      'Band A · Level 2 (基礎級)',
      'Band B · Level 1 (進階級)',
      'Band B · Level 2 (高階級)',
    ];
    return bands.map((band) => {
      const items = catalog.filter((c) => c.tocflBand === band);
      const mastered = items.filter((c) => (progress.wordMastery[c.traditional]?.level || 0) >= 2).length;
      const familiar = items.filter((c) => (progress.wordMastery[c.traditional]?.level || 0) === 1).length;
      const pct = items.length > 0 ? Math.round(((mastered + familiar * 0.5) / items.length) * 100) : 0;
      return { band, total: items.length, mastered, familiar, pct, sampleItems: items.slice(0, 6) };
    });
  }, [catalog, progress.wordMastery]);

  return (
    <div className="space-y-5">
      <StudioHeaderBanner
        studioId="hub"
        titleZh="今日學習與當代華語課程總覽"
        titleEn="Today's 10-Min Flow, Pimsleur 1–19+ & NTNU Contemporary Vols. 1–6"
        subtitle="Start with the inline 10-Minute Daily Flow Runner (zero modal popups), explore Pimsleur Taiwanese Mandarin Units 1–19 and all 61 NTNU Contemporary Chinese lessons, or import new curriculum packs."
        rightSlot={
          <div className="flex flex-wrap items-center gap-2">
            <StylusButton variant="amber" onClick={onOpenAdminModal}>
              <span>➕ Add Pimsleur / NTNU Resource Pack</span>
            </StylusButton>
          </div>
        }
      />

      <StudioModeSwitcher modes={SUB_TABS} activeMode={subTab} onSelect={setSubTab} />

      {subTab === 'daily_flow' && (
        <div className="space-y-5">
          {/* Inline 3-Step Daily Flow Stepper (Replaces Chinese2's blocking modal wizard) */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 space-y-5 shadow-xl">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
              <div>
                <h2 className="text-base sm:text-lg font-extrabold text-white">
                  ⚡ Inline 10-Minute Daily Flow Runner (今日十分鐘三階段引導)
                </h2>
                <p className="text-xs text-slate-300">
                  Complete all 3 focused micro-blocks inline or jump directly into any specialized studio.
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                {([1, 2, 3] as const).map((stepNum) => (
                  <StylusButton
                    key={stepNum}
                    variant={flowStep === stepNum ? 'primary' : flowStepsDone[stepNum] ? 'amber' : 'secondary'}
                    onClick={() => setFlowStep(stepNum)}
                  >
                    <span>
                      {flowStepsDone[stepNum] ? '✅ ' : ''}Step {stepNum}:{' '}
                      {stepNum === 1
                        ? '3-Min FSRS Warmup'
                        : stepNum === 2
                        ? '4-Min Taiwan Dialogue'
                        : '3-Min MOE Stroke & DaQian'}
                    </span>
                  </StylusButton>
                ))}
              </div>
            </div>

            {flowStep === 1 && (
              <div className="bg-slate-950/90 border border-slate-800 rounded-2xl p-5 space-y-4">
                <div className="flex items-center justify-between text-xs text-emerald-300 font-bold">
                  <span>STEP 1 OF 3 · FSRS-LITE & POLYPHONE WARMUP (0:00 – 3:00)</span>
                  <span>Due Queue: {dueWords.length} cards</span>
                </div>
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-900/80 border border-slate-800 rounded-2xl p-5">
                  <RubyText
                    text={dailyWarmupWord.word}
                    zhuyin={flowWarmupRevealed ? dailyWarmupWord.zhuyin : undefined}
                    size="xl"
                    zhuyinDisplayMode={flowWarmupRevealed ? 'always' : 'hover_only'}
                  />
                  {flowWarmupRevealed ? (
                    <div className="space-y-3 text-right">
                      <div className="text-lg font-extrabold text-emerald-300">{dailyWarmupWord.english}</div>
                      <div className="flex flex-wrap gap-2 justify-end">
                        <StylusButton variant="danger" onClick={() => handleGradeDailyWarmup(1)}>
                          <span>1 · Again</span>
                        </StylusButton>
                        <StylusButton variant="secondary" onClick={() => handleGradeDailyWarmup(2)}>
                          <span>2 · Hard</span>
                        </StylusButton>
                        <StylusButton variant="primary" onClick={() => handleGradeDailyWarmup(3)}>
                          <span>3 · Good (+10 XP)</span>
                        </StylusButton>
                        <StylusButton variant="amber" onClick={() => handleGradeDailyWarmup(4)}>
                          <span>4 · Easy (+10 XP)</span>
                        </StylusButton>
                      </div>
                    </div>
                  ) : (
                    <StylusButton variant="primary" onClick={() => setFlowWarmupRevealed(true)}>
                      <span>👁️ Reveal Taiwan MOE Zhuyin & Meaning</span>
                    </StylusButton>
                  )}
                </div>
              </div>
            )}

            {flowStep === 2 && (
              <div className="bg-slate-950/90 border border-slate-800 rounded-2xl p-5 space-y-4">
                <div className="flex items-center justify-between text-xs text-amber-300 font-bold">
                  <span>STEP 2 OF 3 · PIMSLEUR & TAIWAN SURVIVAL DIALOGUE SHADOWING (3:00 – 7:00)</span>
                  <span>From {activeUnit.title}</span>
                </div>
                <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-3">
                  <RubyText
                    text={dailyDialogue.traditional}
                    zhuyin={dailyDialogue.zhuyin}
                    size="lg"
                    zhuyinDisplayMode="always"
                  />
                  <div className="text-base font-bold text-white">{dailyDialogue.english}</div>
                  <div className="flex flex-wrap items-center gap-2 pt-2">
                    <StylusButton variant="secondary" onClick={() => onSpeak?.(dailyDialogue.traditional)}>
                      <span>🔊 Listen Native TTS</span>
                    </StylusButton>
                    <StylusButton variant="primary" onClick={handleCompleteDialogueStep}>
                      <span>✅ Shadowed Aloud (+12 XP → Next Step)</span>
                    </StylusButton>
                    <StylusButton
                      variant="ghost"
                      onClick={() =>
                        dispatchStudioHandoff({
                          fromStudio: 'hub',
                          fromLabel: 'Daily Flow Step 2',
                          toStudio: 'speaking',
                          targetText: dailyDialogue.traditional,
                          targetZhuyin: dailyDialogue.zhuyin,
                          targetEnglish: dailyDialogue.english,
                        })
                      }
                    >
                      <span>🎤 Open in F0 Pitch Lab</span>
                    </StylusButton>
                  </div>
                </div>
              </div>
            )}

            {flowStep === 3 && (
              <div className="bg-slate-950/90 border border-slate-800 rounded-2xl p-5 space-y-4">
                <div className="flex items-center justify-between text-xs text-sky-300 font-bold">
                  <span>STEP 3 OF 3 · TAIWAN MOE STROKE & DAQIAN KEY REFLEX (7:00 – 10:00)</span>
                  <span>{dailyMoeChar.totalStrokes} Strokes · 部首 {dailyMoeChar.radical}</span>
                </div>
                <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <RubyText
                      text={dailyMoeChar.char}
                      zhuyin={dailyMoeChar.zhuyin}
                      pinyin={dailyMoeChar.pinyin}
                      size="xl"
                      zhuyinDisplayMode="always"
                    />
                    <div className="space-y-1 text-right">
                      <div className="text-base font-extrabold text-white">{dailyMoeChar.english}</div>
                      <div className="text-xs font-mono text-emerald-300">
                        DaQian Keys: {Array.from(dailyDaqianKeys).map((k) => (k === ' ' ? '[Space]' : k.toUpperCase())).join(' → ')}
                      </div>
                    </div>
                  </div>
                  <p className="text-xs text-amber-200">{dailyMoeChar.taiwanMoeOrthographyNote}</p>
                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    <StylusButton variant="primary" onClick={handleCompleteStrokeReflexStep}>
                      <span>✅ Complete 10-Min Daily Flow (+15 XP)</span>
                    </StylusButton>
                    <StylusButton
                      variant="secondary"
                      onClick={() =>
                        dispatchStudioHandoff({
                          fromStudio: 'hub',
                          fromLabel: 'Daily Flow Step 3',
                          toStudio: 'calligraphy',
                          targetText: dailyMoeChar.char,
                          targetZhuyin: dailyMoeChar.zhuyin,
                          targetEnglish: dailyMoeChar.english,
                        })
                      }
                    >
                      <span>✒️ Trace 「{dailyMoeChar.char}」 on Wacom Canvas</span>
                    </StylusButton>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {subTab === 'pimsleur' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          <div className="lg:col-span-4 bg-slate-900/90 border border-slate-800 rounded-3xl p-4 space-y-2 max-h-[540px] overflow-y-auto">
            <div className="text-xs font-extrabold text-emerald-300 uppercase tracking-wider px-2 pb-1">
              Pimsleur Taiwanese Mandarin ({allPimsleurUnits.length} Units)
            </div>
            {allPimsleurUnits.map((u) => (
              <StylusButton
                key={u.unit}
                variant={selectedPimsleurUnit === u.unit ? 'primary' : 'secondary'}
                onClick={() => setSelectedPimsleurUnit(u.unit)}
                className="w-full justify-between text-left"
              >
                <span className="truncate">{u.title}</span>
                <span className="text-[11px] opacity-80">{u.vocab.length} 詞</span>
              </StylusButton>
            ))}
          </div>

          <div className="lg:col-span-8 bg-slate-900/90 border border-slate-800 rounded-3xl p-5 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
              <div>
                <h2 className="text-lg font-extrabold text-white">{activeUnit.title}</h2>
                <p className="text-xs text-slate-300">{activeUnit.subtitle}</p>
              </div>
              <StylusButton variant="amber" onClick={onOpenAdminModal}>
                <span>➕ Import Unit 20+ (.docx/.txt/.csv)</span>
              </StylusButton>
            </div>

            <div className="space-y-2">
              <h3 className="text-xs font-extrabold text-emerald-300 uppercase">Unit Vocabulary ({activeUnit.vocab.length})</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {activeUnit.vocab.map((v, i) => (
                  <div
                    key={i}
                    onClick={() =>
                      setFocusedContextItem({
                        text: v.traditional,
                        zhuyin: v.zhuyin,
                        english: v.english,
                        sourceStudio: 'hub',
                        sourceLabel: `Pimsleur Unit ${activeUnit.unit}`,
                      })
                    }
                    className="bg-slate-950/90 hover:bg-slate-900 border border-slate-800 rounded-2xl p-3.5 cursor-pointer flex items-center justify-between gap-2"
                  >
                    <RubyText text={v.traditional} zhuyin={v.zhuyin} pinyin={v.pinyin} size="md" zhuyinDisplayMode="always" />
                    <div className="text-right space-y-1">
                      <div className="text-xs font-bold text-white">{v.english}</div>
                      <StylusButton
                        variant="ghost"
                        onClick={(e) => {
                          e.stopPropagation();
                          onSpeak?.(v.traditional);
                          onUpdateProgress(
                            recordWordPractice(progress, { word: v.traditional, zhuyin: v.zhuyin, english: v.english }, true, 3)
                          );
                        }}
                      >
                        <span>🔊 Practice</span>
                      </StylusButton>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <h3 className="text-xs font-extrabold text-amber-300 uppercase">Unit Dialogues ({activeUnit.dialogues.length})</h3>
              <div className="space-y-2.5">
                {activeUnit.dialogues.map((d, i) => (
                  <div key={i} className="bg-slate-950/90 border border-slate-800 rounded-2xl p-4 space-y-2">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <RubyText text={d.traditional} zhuyin={d.zhuyin} pinyin={d.pinyin} size="md" zhuyinDisplayMode="always" />
                      <StylusButton variant="secondary" onClick={() => onSpeak?.(d.traditional)}>
                        <span>🔊 Speak</span>
                      </StylusButton>
                    </div>
                    <div className="text-xs text-slate-300">{d.english}</div>
                    <CrossStudioActionPills
                      targetText={d.traditional}
                      targetZhuyin={d.zhuyin}
                      targetEnglish={d.english}
                      sourceStudio="hub"
                      sourceLabel={`Pimsleur U${activeUnit.unit}`}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {subTab === 'contemporary' && (
        <div className="space-y-4">
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-4 flex flex-wrap items-center justify-between gap-2">
            <div className="flex flex-wrap gap-2">
              {allContemporaryVolumes.map((vol) => (
                <StylusButton
                  key={vol.volume}
                  variant={selectedVolumeNum === vol.volume ? 'primary' : 'secondary'}
                  onClick={() => {
                    setSelectedVolumeNum(vol.volume);
                    setSelectedLessonNum(vol.lessons[0]?.lesson || 1);
                  }}
                >
                  <span>Vol. {vol.volume} ({vol.lessons.length} 課)</span>
                </StylusButton>
              ))}
            </div>
            <span className="text-xs font-bold text-amber-300">
              {activeVolume.tocflBand} · {activeVolume.cefrRange}
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            <div className="lg:col-span-4 bg-slate-900/90 border border-slate-800 rounded-3xl p-4 space-y-2 max-h-[520px] overflow-y-auto">
              {activeVolume.lessons.map((les) => (
                <StylusButton
                  key={les.lesson}
                  variant={selectedLessonNum === les.lesson ? 'primary' : 'secondary'}
                  onClick={() => setSelectedLessonNum(les.lesson)}
                  className="w-full justify-between text-left"
                >
                  <span className="truncate">{les.titleTraditional}</span>
                  <span className="text-[11px] opacity-80">L{les.lesson}</span>
                </StylusButton>
              ))}
            </div>

            <div className="lg:col-span-8 bg-slate-900/90 border border-slate-800 rounded-3xl p-5 space-y-4">
              <div className="border-b border-slate-800 pb-3 space-y-1">
                <RubyText
                  text={activeLesson.titleTraditional}
                  zhuyin={activeLesson.titleZhuyin}
                  size="lg"
                  zhuyinDisplayMode="always"
                />
                <div className="text-base font-extrabold text-emerald-300">{activeLesson.titleEnglish}</div>
                <div className="text-xs text-slate-400">Topic: {activeLesson.topic}</div>
              </div>

              <div className="space-y-1.5">
                <div className="text-xs font-extrabold text-amber-300 uppercase">Core Grammar Patterns (語法重點)</div>
                <div className="flex flex-wrap gap-2">
                  {activeLesson.grammarPoints.map((gp, i) => (
                    <span
                      key={i}
                      className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-bold text-slate-200"
                    >
                      {gp}
                    </span>
                  ))}
                </div>
              </div>

              <div className="bg-slate-950/90 border border-slate-800 rounded-2xl p-4 space-y-2">
                <div className="text-xs font-extrabold text-emerald-300 uppercase">Anchor Dialogue Sentence</div>
                <RubyText
                  text={activeLesson.sampleSentence.traditional}
                  zhuyin={activeLesson.sampleSentence.zhuyin}
                  size="md"
                  zhuyinDisplayMode="always"
                />
                <div className="text-xs sm:text-sm text-slate-200">{activeLesson.sampleSentence.english}</div>
                <CrossStudioActionPills
                  targetText={activeLesson.sampleSentence.traditional}
                  targetZhuyin={activeLesson.sampleSentence.zhuyin}
                  targetEnglish={activeLesson.sampleSentence.english}
                  sourceStudio="hub"
                  sourceLabel={`NTNU Vol.${activeVolume.volume} L${activeLesson.lesson}`}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {subTab === 'tocfl_readiness' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {tocflBandStats.map((st) => (
            <div key={st.band} className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-extrabold text-white">{st.band}</span>
                <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-black">
                  {st.pct}% Ready
                </span>
              </div>
              <div className="w-full h-2.5 rounded-full bg-slate-950 overflow-hidden">
                <div className="h-full bg-emerald-500 transition-all" style={{ width: `${Math.max(6, st.pct)}%` }} />
              </div>
              <div className="text-xs text-slate-400 flex justify-between">
                <span>Mastered (Lv.2+): {st.mastered}</span>
                <span>Familiar (Lv.1): {st.familiar}</span>
                <span>Total: {st.total}</span>
              </div>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {st.sampleItems.map((item) => (
                  <StylusButton
                    key={item.id}
                    variant="secondary"
                    onClick={() =>
                      dispatchStudioHandoff({
                        fromStudio: 'hub',
                        fromLabel: st.band,
                        toStudio: 'dojo',
                        targetText: item.traditional,
                        targetZhuyin: item.zhuyin,
                        targetEnglish: item.english,
                        modeHint: 'wordbank',
                      })
                    }
                  >
                    <span>{item.traditional}</span>
                  </StylusButton>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
