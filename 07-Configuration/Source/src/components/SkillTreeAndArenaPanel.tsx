/**
 * FormosaStudio (FORM) — Independently Shuffled 3-Stage Match Arena + Course Syllabus Checkpoint Bridge
 * Retires the redundant standalone 5-World Skill Tree (consolidated into Course Syllabus Stages 0–5 Checkpoints).
 * Traces to: FORM-ECR-001, FORM-DEC-005, UX-3
 */

import React, { useMemo, useState } from 'react';
import { MATCH_ARENA_PAIRS } from '../data/daqianAndDojoData.ts';
import { VocabularyEntry } from '../data/vocabularyCatalog.ts';
import { UserProgressState } from '../lib/progressStore.ts';
import { setActiveStudio } from '../lib/studioContextBus.ts';
import { StylusButton } from './uiPrimitives.tsx';

function shuffleCopy<T>(items: T[]): T[] {
  const arr = [...items];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export interface SkillTreeAndArenaPanelProps {
  catalog: VocabularyEntry[];
  progress: UserProgressState;
  onUpdateProgress: (next: UserProgressState) => void;
  onSpeak?: (text: string, rate?: number) => void;
}

export const SkillTreeAndArenaPanel: React.FC<SkillTreeAndArenaPanelProps> = ({
  progress,
  onUpdateProgress,
  onSpeak,
}) => {
  const [arenaStage, setArenaStage] = useState<1 | 2 | 3>(1);
  const [shuffleSeed, setShuffleSeed] = useState<number>(0);
  const [selectedLeftId, setSelectedLeftId] = useState<string | null>(null);
  const [matchedPairIds, setMatchedPairIds] = useState<string[]>([]);
  const [arenaMissNote, setArenaMissNote] = useState<string | null>(null);

  const stageArenaPairs = useMemo(
    () => MATCH_ARENA_PAIRS.filter((p) => p.stage === arenaStage),
    [arenaStage]
  );

  const shuffledRightPairs = useMemo(() => {
    const base = shuffleCopy(stageArenaPairs);
    if (base.length > 1 && base.every((p, i) => p.id === stageArenaPairs[i].id)) {
      [base[0], base[1]] = [base[1], base[0]];
    }
    return base;
  }, [stageArenaPairs, shuffleSeed]);

  const passedCheckpointsCount = Object.values(progress.completedStageCheckpoints || {}).filter(
    (c) => c.bestAccuracy >= 80
  ).length;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
      {/* Shuffled 3-Stage Match Arena */}
      <div className="lg:col-span-8 fs-card p-5 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider" style={{ color: 'var(--fs-accent-text)' }}>
              3-Stage Match Arena (配對競技場 · Independently Shuffled)
            </h2>
            <p className="text-xs" style={{ color: 'var(--fs-text-secondary)' }}>
              High Score: <strong>{progress.matchHighScore}</strong> · Select a prompt on the left, then tap its Taiwan match on the right.
            </p>
          </div>
          <div className="flex gap-1.5">
            {([1, 2, 3] as const).map((st) => (
              <StylusButton
                key={st}
                variant={arenaStage === st ? 'primary' : 'secondary'}
                onClick={() => {
                  setArenaStage(st);
                  setSelectedLeftId(null);
                  setMatchedPairIds([]);
                  setArenaMissNote(null);
                  setShuffleSeed((s) => s + 1);
                }}
              >
                <span>Stage {st}</span>
              </StylusButton>
            ))}
          </div>
        </div>

        {arenaMissNote && (
          <div className="fs-subtle-box px-3 py-2 text-xs font-semibold" style={{ color: 'var(--fs-warm)' }}>
            {arenaMissNote}
          </div>
        )}

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            {stageArenaPairs.map((p) => {
              const matched = matchedPairIds.includes(p.id);
              return (
                <StylusButton
                  key={p.id}
                  variant={matched ? 'primary' : selectedLeftId === p.id ? 'amber' : 'secondary'}
                  onClick={() => {
                    if (!matched) {
                      setSelectedLeftId(p.id);
                      setArenaMissNote(null);
                    }
                  }}
                  className="w-full justify-center"
                >
                  <span>{p.leftPrompt}</span>
                </StylusButton>
              );
            })}
          </div>
          <div className="space-y-2">
            {shuffledRightPairs.map((p) => {
              const matched = matchedPairIds.includes(p.id);
              return (
                <StylusButton
                  key={p.id}
                  variant={matched ? 'primary' : 'secondary'}
                  onClick={() => {
                    if (matched || !selectedLeftId) return;
                    if (selectedLeftId === p.id) {
                      setMatchedPairIds((prev) => [...prev, p.id]);
                      setSelectedLeftId(null);
                      setArenaMissNote(null);
                      onSpeak?.(p.leftPrompt, 0.88);
                      onUpdateProgress({
                        ...progress,
                        xp: progress.xp + 8,
                        matchHighScore: progress.matchHighScore + 100,
                      });
                    } else {
                      setArenaMissNote('Not a match — check the Zhuyin/meaning and try again.');
                    }
                  }}
                  className="w-full justify-center"
                >
                  <span>{p.rightMatch}</span>
                </StylusButton>
              );
            })}
          </div>
        </div>
      </div>

      {/* Consolidated Syllabus Checkpoints Bridge */}
      <div className="lg:col-span-4 fs-card p-5 space-y-3 flex flex-col justify-between">
        <div className="space-y-2">
          <div className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--fs-accent-text)' }}>
            Progression Checkpoints Moved
          </div>
          <h3 className="text-base font-bold" style={{ color: 'var(--fs-text)' }}>
            Stage 0–5 Mastery Checkpoints
          </h3>
          <p className="text-sm" style={{ color: 'var(--fs-text-secondary)' }}>
            The legacy 5-World Skill Tree has been unified directly into <strong>Course Syllabus (Stages 0–5)</strong> so every stage ends with a clear 5-question verification quiz (≥ 80% pass).
          </p>
          <div className="fs-subtle-box p-3 text-xs font-semibold" style={{ color: 'var(--fs-text)' }}>
            Stage Checkpoints Passed: {passedCheckpointsCount} / 5
          </div>
        </div>
        <StylusButton variant="primary" onClick={() => setActiveStudio('syllabus')}>
          <span>Open Course Syllabus →</span>
        </StylusButton>
      </div>
    </div>
  );
};
