/**
 * FormosaStudio (FORM) — Stage 0.5 Five Real-Life Taiwan Arrival Scenarios Interactive Component
 * Audio-first, shuffled options, 1 cultural cue per scenario, >= 3/5 unlock gate (5/5 Taipei Arrival Ready badge).
 * Traces to: FORM-ECR-001, FORM-WF-004, PED-3
 */

import React, { useMemo, useState } from 'react';
import { STAGE0_ARRIVAL_SCENARIOS } from '../data/stage0ArrivalScenariosData.ts';
import { STAGE0_FIRST_10_PHRASES } from '../data/stage0BeginnerData.ts';
import { UserProgressState, markArrivalScenarioComplete } from '../lib/progressStore.ts';
import { RubyText } from './RubyText.tsx';
import { StylusButton } from './uiPrimitives.tsx';

export interface Stage0ArrivalScenariosProps {
  progress: UserProgressState;
  onUpdateProgress: (next: UserProgressState) => void;
  onSpeak?: (text: string, rate?: number) => void;
  onCompleteModule: () => void;
}

export const Stage0ArrivalScenarios: React.FC<Stage0ArrivalScenariosProps> = ({
  progress,
  onUpdateProgress,
  onSpeak,
  onCompleteModule,
}) => {
  const [selectedId, setSelectedId] = useState<string>(STAGE0_ARRIVAL_SCENARIOS[0].id);
  const [showPhrasesRef, setShowPhrasesRef] = useState<boolean>(false);
  const [showEnglish, setShowEnglish] = useState<boolean>(false);
  const [answersByScenario, setAnswersByScenario] = useState<Record<string, Record<number, number>>>({});

  const completedIds = progress.completedArrivalScenarios || [];
  const activeScenario = useMemo(
    () => STAGE0_ARRIVAL_SCENARIOS.find((s) => s.id === selectedId) || STAGE0_ARRIVAL_SCENARIOS[0],
    [selectedId]
  );

  const activeAnswers = answersByScenario[activeScenario.id] || {};
  const activeCorrectCount = activeScenario.turns.filter((t, idx) => activeAnswers[idx] === t.correctIdx).length;
  const activePassed = activeCorrectCount >= activeScenario.turns.length;

  const completedCount = completedIds.length;
  const unlockedStage1 = completedCount >= 3;
  const allMastered = completedCount >= STAGE0_ARRIVAL_SCENARIOS.length;

  const handlePickOption = (turnIdx: number, optionIdx: number, spokenText: string) => {
    const nextForScenario = { ...activeAnswers, [turnIdx]: optionIdx };
    setAnswersByScenario((prev) => ({ ...prev, [activeScenario.id]: nextForScenario }));
    onSpeak?.(spokenText, 0.88);

    const allRight = activeScenario.turns.every((t, i) => nextForScenario[i] === t.correctIdx);
    if (allRight && !completedIds.includes(activeScenario.id)) {
      onUpdateProgress(markArrivalScenarioComplete(progress, activeScenario.id));
    }
  };

  return (
    <section className="fs-card p-5 sm:p-6 space-y-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--fs-accent-text)' }}>
              0.5 Real-Life Taiwan Arrival Scenarios ({completedCount} / 5 Complete)
            </span>
            {allMastered && (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold" style={{ backgroundColor: 'var(--fs-accent-soft)', color: 'var(--fs-accent-text)' }}>
                ★ Taipei Arrival Ready (5/5)
              </span>
            )}
          </div>
          <h2 className="text-xl font-bold" style={{ color: 'var(--fs-text)' }}>
            Practice 5 Everyday Taiwan Situations by Ear
          </h2>
          <p className="text-sm" style={{ color: 'var(--fs-text-secondary)' }}>
            Complete any <strong>3 of 5</strong> real-life scenarios to unlock Stage 1 (or finish all 5 for the Taipei Arrival Ready badge). Listen first before revealing English!
          </p>
        </div>
        <StylusButton variant="ghost" onClick={() => setShowPhrasesRef((v) => !v)}>
          <span>{showPhrasesRef ? 'Hide First 10 Phrases' : 'First 10 Phrases Cheat-Sheet'}</span>
        </StylusButton>
      </div>

      {/* Collapsible First 10 Taipei Survival Phrases Reference */}
      {showPhrasesRef && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
          {STAGE0_FIRST_10_PHRASES.map((p) => (
            <div key={p.trad} className="fs-subtle-box p-3.5 flex items-center justify-between gap-3">
              <div className="space-y-0.5">
                <RubyText text={p.trad} zhuyin={p.zhuyin} pinyin={p.pinyin} showPinyinHint={progress.showPinyinHint} size="md" zhuyinDisplayMode="always" />
                <div className="text-xs font-bold" style={{ color: 'var(--fs-text)' }}>{p.english}</div>
                <div className="text-[11px]" style={{ color: 'var(--fs-text-muted)' }}>Literal: {p.gloss}</div>
              </div>
              <div className="flex flex-col gap-1 shrink-0">
                <StylusButton variant="secondary" onClick={() => onSpeak?.(p.trad, 0.9)}><span>Normal</span></StylusButton>
                <StylusButton variant="ghost" onClick={() => onSpeak?.(p.trad, 0.65)}><span>Slow</span></StylusButton>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 5-Scenario Selector Cards (2-col on iPad mini 6 portrait, 5-col on wide) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5">
        {STAGE0_ARRIVAL_SCENARIOS.map((sc) => {
          const isDone = completedIds.includes(sc.id);
          const isSelected = sc.id === activeScenario.id;
          return (
            <button
              key={sc.id}
              type="button"
              onClick={() => setSelectedId(sc.id)}
              style={{
                minHeight: '78px',
                backgroundColor: isSelected ? 'var(--fs-accent-soft)' : 'var(--fs-subtle)',
                borderColor: isSelected ? 'var(--fs-accent-border)' : 'var(--fs-border)',
              }}
              className="p-3 rounded-2xl border text-left transition space-y-1"
            >
              <div className="flex items-center justify-between text-xs font-bold">
                <span style={{ color: isDone ? 'var(--fs-accent-text)' : 'var(--fs-text-muted)' }}>
                  {isDone ? `✓ #${sc.order}` : `Scenario ${sc.order}`}
                </span>
                <span className="text-[11px]" style={{ color: 'var(--fs-text-muted)' }}>{sc.settingTag}</span>
              </div>
              <div className="text-sm font-bold leading-snug" style={{ color: 'var(--fs-text)' }}>{sc.titleEn}</div>
              <div className="text-xs" style={{ color: 'var(--fs-text-secondary)' }}>{sc.titleZh}</div>
            </button>
          );
        })}
      </div>

      {/* Cultural Cue Banner */}
      <div className="fs-subtle-box p-4 space-y-1">
        <div className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--fs-accent-text)' }}>
          Taiwan Cultural Cue · {activeScenario.titleEn}
        </div>
        <p className="text-sm" style={{ color: 'var(--fs-text-secondary)' }}>{activeScenario.culturalCue}</p>
      </div>

      {/* Audio-First 3-Turn Dialogue Player */}
      <div className="fs-subtle-box p-4 sm:p-5 space-y-3.5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="text-sm font-bold" style={{ color: 'var(--fs-text)' }}>
            {activeScenario.titleZh} · {activeScenario.titleEn} ({activeCorrectCount}/{activeScenario.turns.length} turns)
          </div>
          <div className="flex flex-wrap gap-2">
            <StylusButton variant="ghost" onClick={() => setShowEnglish((v) => !v)}>
              <span>{showEnglish ? 'Hide English Hints' : 'Show English Hints'}</span>
            </StylusButton>
            <StylusButton
              variant="ghost"
              onClick={() => setAnswersByScenario((prev) => ({ ...prev, [activeScenario.id]: {} }))}
            >
              <span>Reset Scenario</span>
            </StylusButton>
          </div>
        </div>

        <div className="space-y-3">
          {activeScenario.turns.map((turn, idx) => {
            const picked = activeAnswers[idx];
            const answered = picked !== undefined;
            return (
              <div key={`${activeScenario.id}-${idx}`} className="fs-card p-4 space-y-3">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="text-xs font-bold uppercase" style={{ color: 'var(--fs-text-muted)' }}>
                      Turn {idx + 1} · {turn.speakerRole}
                    </div>
                    {showEnglish || answered ? (
                      <div className="space-y-1">
                        <RubyText
                          text={turn.clerkZh}
                          zhuyin={turn.clerkZhuyin}
                          pinyin={turn.clerkPinyin}
                          showPinyinHint={progress.showPinyinHint}
                          size="md"
                          zhuyinDisplayMode="always"
                        />
                        <div className="text-xs" style={{ color: 'var(--fs-text-secondary)' }}>
                          “{turn.clerkEn}”
                        </div>
                      </div>
                    ) : (
                      <div className="text-sm font-semibold" style={{ color: 'var(--fs-text)' }}>
                        Listen to the speaker first, then pick your natural Taiwan reply:
                      </div>
                    )}
                  </div>
                  <div className="flex gap-1.5 shrink-0">
                    <StylusButton variant="primary" onClick={() => onSpeak?.(turn.clerkZh, 0.88)}>
                      <span>Hear Normal</span>
                    </StylusButton>
                    <StylusButton variant="secondary" onClick={() => onSpeak?.(turn.clerkZh, 0.65)}>
                      <span>Slow 0.65×</span>
                    </StylusButton>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {turn.options.map((opt, oIdx) => (
                    <StylusButton
                      key={opt.text}
                      variant={picked === oIdx ? (oIdx === turn.correctIdx ? 'primary' : 'danger') : 'secondary'}
                      className="text-left justify-start"
                      onClick={() => handlePickOption(idx, oIdx, opt.text)}
                    >
                      <span className="text-left leading-snug">
                        <strong>{opt.text}</strong>
                        {(showEnglish || answered) && (
                          <span className="block text-xs opacity-85 mt-0.5">{opt.en}</span>
                        )}
                      </span>
                    </StylusButton>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {activePassed && (
          <div className="fs-card p-3.5 flex flex-wrap items-center justify-between gap-2">
            <span className="text-sm font-bold" style={{ color: 'var(--fs-accent-text)' }}>
              ✓ Scenario Completed: {activeScenario.titleEn}!
            </span>
            {activeScenario.order < STAGE0_ARRIVAL_SCENARIOS.length && (
              <StylusButton
                variant="secondary"
                onClick={() => setSelectedId(STAGE0_ARRIVAL_SCENARIOS[activeScenario.order].id)}
              >
                <span>Next Scenario (#{activeScenario.order + 1}) →</span>
              </StylusButton>
            )}
          </div>
        )}
      </div>

      {/* Unlock Gate Footer */}
      <div className="fs-subtle-box p-4 flex flex-wrap items-center justify-between gap-3">
        <span className="text-xs font-semibold" style={{ color: unlockedStage1 ? 'var(--fs-accent-text)' : 'var(--fs-text-secondary)' }}>
          {unlockedStage1
            ? `✓ ${completedCount}/5 Arrival Scenarios Passed — Stage 1 Unlocked!`
            : `○ Complete ≥ 3 of 5 Scenarios to Unlock Stage 1 (${completedCount}/3 so far)`}
        </span>
        <div className="flex items-center gap-2">
          <StylusButton variant="primary" disabled={!unlockedStage1} onClick={onCompleteModule}>
            <span>{unlockedStage1 ? 'Finish Stage 0 & Start Stage 1 →' : 'Pass 3 Scenarios to Unlock'}</span>
          </StylusButton>
          {!unlockedStage1 && (
            <button type="button" onClick={onCompleteModule} className="text-xs underline px-2 py-1" style={{ color: 'var(--fs-text-muted)' }}>
              Override
            </button>
          )}
        </div>
      </div>
    </section>
  );
};
