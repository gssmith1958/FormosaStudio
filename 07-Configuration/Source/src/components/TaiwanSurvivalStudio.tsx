/**
 * FormosaStudio (FORM) — Studio 2: "Taiwan in 10 Minutes a Day" Survival Studio (臺灣生存)
 * Integrates:
 * 1. 6 Visual Survival Sticky-Label Modules & Printable Sheet Mode (FORM-REQ-0009)
 * 2. 12 "Swiss-Army-Knife" Survival Sentence Frames (FORM-REQ-0009)
 * 3. Laminated Paper Tick-Menu (點菜單) & Taiwanese Pragmatics (語助詞 & 臺語) (FORM-REQ-0010)
 * 4. 5-Category Taiwan Functional Listening Gym (NT$ Prices, 打折, 民國 Dates, 09XX/發票, Addresses) (FORM-REQ-0011)
 * Built on Phase 1 Shared UI Primitives, Vertical RubyText, and StudioContextBus (FORM-REQ-0021).
 */

import React, { useMemo, useState } from 'react';
import {
  CrossStudioActionPills,
  StudioHeaderBanner,
  StudioModeSwitcher,
  StylusButton,
} from './uiPrimitives.tsx';
import { RubyText } from './RubyText.tsx';
import {
  SURVIVAL_MODULES,
  SWISS_ARMY_FRAMES,
  StickyLabelItem,
} from '../data/taiwanSurvivalData.ts';
import {
  LISTENING_GYM_CATEGORIES,
  ListeningGymCategory,
  evaluateListeningAnswer,
  getListeningDrillsByCategory,
} from '../lib/listeningGymEngine.ts';
import { TickMenuAndPragmatics } from './TickMenuAndPragmatics.tsx';
import {
  UserProgressState,
  recordWordPractice,
} from '../lib/progressStore.ts';

export interface TaiwanSurvivalStudioProps {
  progress: UserProgressState;
  onUpdateProgress: (next: UserProgressState) => void;
  onSpeakText?: (text: string, rate?: number) => void;
}

type SurvivalSubMode =
  | 'sticky_labels'
  | 'swiss_army_frames'
  | 'tick_menu'
  | 'pragmatics'
  | 'listening_gym';

export const TaiwanSurvivalStudio: React.FC<TaiwanSurvivalStudioProps> = ({
  progress,
  onUpdateProgress,
  onSpeakText,
}) => {
  const [subMode, setSubMode] = useState<SurvivalSubMode>('sticky_labels');
  const [selectedModuleId, setSelectedModuleId] = useState<string>(SURVIVAL_MODULES[0].id);
  const [printableSheetMode, setPrintableSheetMode] = useState<boolean>(false);
  const [activeLabel, setActiveLabel] = useState<StickyLabelItem | null>(
    SURVIVAL_MODULES[0].labels[0]
  );

  // Listening Gym State (FORM-REQ-0011)
  const [gymCategory, setGymCategory] = useState<ListeningGymCategory>('nt_prices');
  const [drillIdx, setDrillIdx] = useState<number>(0);
  const [userGymInput, setUserGymInput] = useState<string>('');
  const [showTranscript, setShowTranscript] = useState<boolean>(false);
  const [gymSubmitted, setGymSubmitted] = useState<boolean>(false);

  const activeModule = useMemo(
    () => SURVIVAL_MODULES.find((m) => m.id === selectedModuleId) || SURVIVAL_MODULES[0],
    [selectedModuleId]
  );

  const activeCategoryDrills = useMemo(
    () => getListeningDrillsByCategory(gymCategory),
    [gymCategory]
  );
  const activeDrill = activeCategoryDrills[drillIdx % activeCategoryDrills.length];

  const gymEval = useMemo(
    () => evaluateListeningAnswer(activeDrill, userGymInput),
    [activeDrill, userGymInput]
  );

  return (
    <div className="space-y-5">
      <StudioHeaderBanner
        studioId="survival"
        titleZh="臺灣十分鐘生存工作室"
        titleEn="Taiwan in 10 Minutes a Day — Sticky Labels, 點菜單 Tick-Menu & Functional Listening Gym"
        subtitle="Bite-sized visual sticky labels for your home/AC/trash, 12 Swiss-Army-Knife sentence frames, interactive paper 點菜單 simulator, and rapid NT$/民國/address listening reflex drills."
        rightSlot={
          <StudioModeSwitcher
            activeMode={subMode}
            onSelect={(m) => setSubMode(m as SurvivalSubMode)}
            modes={[
              { id: 'sticky_labels', labelZh: '情境便利貼', labelEn: 'Sticky Labels', badge: '6' },
              { id: 'swiss_army_frames', labelZh: '萬用句型', labelEn: '12 Frames', badge: '12' },
              { id: 'tick_menu', labelZh: '點菜單模擬', labelEn: '點菜單 Menu' },
              { id: 'pragmatics', labelZh: '語助詞與臺語', labelEn: '語助詞 & 臺語' },
              { id: 'listening_gym', labelZh: '聽力反射訓練', labelEn: 'Listening Gym', badge: '5' },
            ]}
          />
        }
      />

      {/* SUB-MODE 1: 6 VISUAL SURVIVAL STICKY-LABEL MODULES & PRINTABLE SHEET MODE (FORM-REQ-0009) */}
      {subMode === 'sticky_labels' && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-slate-900/90 border border-slate-800 p-4">
            <div className="flex flex-wrap gap-2">
              {SURVIVAL_MODULES.map((mod) => (
                <StylusButton
                  key={mod.id}
                  variant={mod.id === activeModule.id ? 'primary' : 'secondary'}
                  onClick={() => {
                    setSelectedModuleId(mod.id);
                    setActiveLabel(mod.labels[0]);
                  }}
                >
                  <span>{mod.moduleNumber}. {mod.titleTraditional}</span>
                </StylusButton>
              ))}
            </div>
            <StylusButton
              variant={printableSheetMode ? 'amber' : 'secondary'}
              onClick={() => setPrintableSheetMode((v) => !v)}
            >
              {printableSheetMode ? '✓ Printable Sticky-Label Sheet Active' : '🖨️ Printable Sticky-Label Sheet Mode'}
            </StylusButton>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
              <div>
                <span className="text-xs font-bold text-teal-400">
                  10-Minute Survival Module {activeModule.moduleNumber}
                </span>
                <h3 className="text-xl font-extrabold text-white">
                  {activeModule.titleTraditional} — {activeModule.titleEnglish}
                </h3>
                <p className="text-xs text-slate-300 mt-0.5">{activeModule.keyTakeaway}</p>
              </div>
            </div>

            {/* Sticky-Label Card Grid (Large Cut-Out Sheet Mode vs Interactive Mode) */}
            <div
              className={`grid gap-4 ${
                printableSheetMode
                  ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
                  : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
              }`}
            >
              {activeModule.labels.map((lbl) => {
                const isSelected = activeLabel?.id === lbl.id;
                return (
                  <div
                    key={lbl.id}
                    onClick={() => setActiveLabel(lbl)}
                    className={`cursor-pointer rounded-2xl border-2 p-4 transition-all space-y-3 ${
                      printableSheetMode
                        ? 'border-dashed border-amber-400/80 bg-slate-950 shadow-lg'
                        : isSelected
                        ? 'border-teal-400 bg-teal-950/30 shadow-md'
                        : 'border-slate-800 bg-slate-950/70 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-amber-950/80 text-amber-200 border border-amber-400/50">
                        📌 {lbl.placementHint}
                      </span>
                      {onSpeakText && (
                        <StylusButton
                          variant="ghost"
                          onClick={(e) => {
                            e.stopPropagation();
                            onSpeakText(lbl.traditional, 0.88);
                          }}
                        >
                          🔊
                        </StylusButton>
                      )}
                    </div>

                    <div className="py-1">
                      <RubyText
                        text={lbl.traditional}
                        zhuyin={lbl.zhuyin}
                        zhuyinDisplayMode="always"
                        showPinyinHint={progress.showPinyinHint}
                        size={printableSheetMode ? 'xl' : 'lg'}
                      />
                    </div>

                    <div className="border-t border-slate-800/80 pt-2">
                      <div className="font-bold text-white text-sm">{lbl.english}</div>
                      <div className="text-xs text-slate-400 mt-0.5">{lbl.usageTip}</div>
                    </div>
                  </div>
                );
              })}
            </div>

            {activeLabel && (
              <div className="rounded-xl bg-slate-950/90 border border-teal-500/40 p-4 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <div className="text-sm font-bold text-white">
                    Active Sticky Label: <span className="text-teal-300">{activeLabel.traditional}</span> ({activeLabel.english})
                  </div>
                  <div className="text-xs text-slate-400">{activeLabel.usageTip}</div>
                </div>
                <CrossStudioActionPills
                  sourceStudio="survival"
                  sourceLabel={`Module ${activeModule.moduleNumber} Sticky Label`}
                  targetText={activeLabel.traditional}
                  targetZhuyin={activeLabel.zhuyin}
                  targetEnglish={activeLabel.english}
                  onBoostSrs={() =>
                    onUpdateProgress(
                      recordWordPractice(
                        progress,
                        {
                          word: activeLabel.traditional,
                          zhuyin: activeLabel.zhuyin,
                          english: activeLabel.english,
                        },
                        true,
                        4
                      )
                    )
                  }
                />
              </div>
            )}
          </div>
        </div>
      )}

      {/* SUB-MODE 2: 12 SWISS-ARMY-KNIFE SURVIVAL SENTENCE FRAMES (FORM-REQ-0009) */}
      {subMode === 'swiss_army_frames' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {SWISS_ARMY_FRAMES.map((frame) => (
            <div
              key={frame.id}
              className="rounded-2xl border border-slate-800 bg-slate-900/90 p-4 space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-teal-950 text-teal-300 border border-teal-500/50">
                  Frame #{frame.frameNumber} · {frame.scenarioTag}
                </span>
                {onSpeakText && (
                  <StylusButton
                    variant="secondary"
                    onClick={() => onSpeakText(frame.exampleTraditional, 0.9)}
                  >
                    🔊 Speak Frame
                  </StylusButton>
                )}
              </div>
              <div className="text-base font-extrabold text-amber-300">
                {frame.patternTraditional}
              </div>
              <div className="text-xs text-slate-300">{frame.englishTemplate}</div>
              <div className="rounded-xl bg-slate-950/80 border border-slate-800 p-3 space-y-1.5">
                <RubyText
                  text={frame.exampleTraditional}
                  zhuyin={frame.exampleZhuyin}
                  zhuyinDisplayMode="always"
                  size="md"
                />
                <div className="text-xs text-slate-300">{frame.exampleEnglish}</div>
              </div>
              <CrossStudioActionPills
                sourceStudio="survival"
                sourceLabel={`Frame #${frame.frameNumber}`}
                targetText={frame.exampleTraditional}
                targetZhuyin={frame.exampleZhuyin}
                targetEnglish={frame.exampleEnglish}
              />
            </div>
          ))}
        </div>
      )}

      {/* SUB-MODE 3 & 4: TICK-MENU (點菜單) & TAIWANESE PRAGMATICS (FORM-REQ-0010) */}
      {(subMode === 'tick_menu' || subMode === 'pragmatics') && (
        <TickMenuAndPragmatics
          activeTab={subMode}
          progress={progress}
          onSpeakText={onSpeakText}
        />
      )}

      {/* SUB-MODE 5: 5-CATEGORY TAIWAN FUNCTIONAL LISTENING GYM (FORM-REQ-0011) */}
      {subMode === 'listening_gym' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          <div className="lg:col-span-4 space-y-2.5">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400 px-1">
              5 Taiwan Functional Listening Tracks
            </div>
            {LISTENING_GYM_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => {
                  setGymCategory(cat.id);
                  setDrillIdx(0);
                  setUserGymInput('');
                  setGymSubmitted(false);
                  setShowTranscript(false);
                }}
                style={{ minHeight: '54px', touchAction: 'manipulation' }}
                className={`w-full text-left p-3.5 rounded-xl border transition-all ${
                  gymCategory === cat.id
                    ? 'bg-teal-950/60 border-teal-400 text-white'
                    : 'bg-slate-900/80 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                <div className="font-bold text-sm text-white">{cat.labelZh}</div>
                <div className="text-xs text-teal-300">{cat.labelEn}</div>
                <div className="text-[11px] text-slate-400 mt-1">{cat.ruleSummary}</div>
              </button>
            ))}
          </div>

          <div className="lg:col-span-8 rounded-2xl border border-slate-800 bg-slate-900/90 p-5 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
              <div>
                <span className="text-xs font-bold text-teal-400">{activeDrill.categoryLabel}</span>
                <h3 className="text-lg font-extrabold text-white">
                  Rapid Auditory Comprehension Drill #{drillIdx + 1}
                </h3>
              </div>
              <div className="flex items-center gap-2">
                {onSpeakText && (
                  <StylusButton
                    variant="primary"
                    onClick={() => onSpeakText(activeDrill.spokenTranscriptTraditional, 0.92)}
                  >
                    🔊 Play Audio Prompt (zh-TW)
                  </StylusButton>
                )}
                <StylusButton
                  variant="secondary"
                  onClick={() => setShowTranscript((v) => !v)}
                >
                  {showTranscript ? 'Hide Transcript' : 'Peek Transcript'}
                </StylusButton>
                <StylusButton
                  variant="secondary"
                  onClick={() => {
                    setDrillIdx((i) => i + 1);
                    setUserGymInput('');
                    setGymSubmitted(false);
                    setShowTranscript(false);
                  }}
                >
                  Next Drill →
                </StylusButton>
              </div>
            </div>

            {showTranscript && (
              <div className="rounded-xl bg-slate-950 border border-slate-800 p-4">
                <RubyText
                  text={activeDrill.spokenTranscriptTraditional}
                  zhuyin={activeDrill.spokenTranscriptZhuyin}
                  zhuyinDisplayMode="always"
                  size="lg"
                />
              </div>
            )}

            <div className="space-y-3">
              <label className="block text-sm font-bold text-slate-200">
                {activeDrill.questionPrompt}
              </label>
              <div className="flex flex-wrap items-center gap-2">
                <input
                  type="text"
                  value={userGymInput}
                  onChange={(e) => {
                    setUserGymInput(e.target.value);
                    setGymSubmitted(false);
                  }}
                  placeholder={activeDrill.inputPlaceholder}
                  className="flex-1 min-w-[200px] rounded-xl bg-slate-950 border border-slate-700 px-3.5 py-2.5 text-base font-bold text-white focus:border-teal-400 focus:outline-none"
                />
                <StylusButton
                  variant="primary"
                  onClick={() => setGymSubmitted(true)}
                >
                  Check Answer
                </StylusButton>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
                {activeDrill.multipleChoiceOptions.map((opt) => (
                  <StylusButton
                    key={opt}
                    variant={userGymInput === opt ? 'amber' : 'secondary'}
                    onClick={() => {
                      setUserGymInput(opt);
                      setGymSubmitted(true);
                    }}
                  >
                    {opt}
                  </StylusButton>
                ))}
              </div>
            </div>

            {gymSubmitted && (
              <div
                className={`rounded-xl border p-4 space-y-1.5 ${
                  gymEval.isCorrect
                    ? 'bg-emerald-950/50 border-emerald-400/70 text-emerald-200'
                    : 'bg-rose-950/50 border-rose-400/70 text-rose-200'
                }`}
              >
                <div className="font-extrabold text-sm">
                  {gymEval.isCorrect
                    ? `✓ Correct! (${gymEval.expectedAnswer})`
                    : `✗ Expected "${gymEval.expectedAnswer}", got "${gymEval.normalizedUserAnswer}".`}
                </div>
                <div className="text-xs">{gymEval.explanation}</div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
