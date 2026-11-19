/**
 * FormosaStudio (FORM) — 5-World Skill Tree (Real 5-Question Verification Quiz) & Independently Shuffled 3-Stage Match Arena
 * Replaces 1-click fake mastery & unshuffled matching columns with genuine verification (DEP-01 / DEP-03).
 */

import React, { useMemo, useState } from 'react';
import {
  FIVE_WORLD_SKILL_TREE,
  MATCH_ARENA_PAIRS,
  SkillTreeNode,
} from '../data/daqianAndDojoData.ts';
import { VocabularyEntry } from '../data/vocabularyCatalog.ts';
import { UserProgressState, recordWordPractice } from '../lib/progressStore.ts';
import { StylusButton } from './uiPrimitives.tsx';

function shuffleCopy<T>(items: T[]): T[] {
  const arr = [...items];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

interface NodeQuizQuestion {
  target: VocabularyEntry;
  options: VocabularyEntry[];
}

export interface SkillTreeAndArenaPanelProps {
  catalog: VocabularyEntry[];
  progress: UserProgressState;
  onUpdateProgress: (next: UserProgressState) => void;
  onSpeak?: (text: string, rate?: number) => void;
}

export const SkillTreeAndArenaPanel: React.FC<SkillTreeAndArenaPanelProps> = ({
  catalog,
  progress,
  onUpdateProgress,
  onSpeak,
}) => {
  // Real 5-question Skill Tree node verification quiz
  const [activeNode, setActiveNode] = useState<SkillTreeNode | null>(null);
  const [nodeQuestions, setNodeQuestions] = useState<NodeQuizQuestion[]>([]);
  const [nodeQIdx, setNodeQIdx] = useState<number>(0);
  const [nodePicked, setNodePicked] = useState<string | null>(null);
  const [nodeCorrect, setNodeCorrect] = useState<number>(0);
  const [nodeFeedback, setNodeFeedback] = useState<string | null>(null);

  // Independently shuffled 3-Stage Match Arena
  const [arenaStage, setArenaStage] = useState<1 | 2 | 3>(1);
  const [shuffleSeed, setShuffleSeed] = useState<number>(0);
  const [selectedLeftId, setSelectedLeftId] = useState<string | null>(null);
  const [matchedPairIds, setMatchedPairIds] = useState<string[]>([]);
  const [arenaMissNote, setArenaMissNote] = useState<string | null>(null);

  const stageArenaPairs = useMemo(
    () => MATCH_ARENA_PAIRS.filter((p) => p.stage === arenaStage),
    [arenaStage]
  );

  // Independently shuffle the right column so row order never mirrors left column
  const shuffledRightPairs = useMemo(() => {
    const base = shuffleCopy(stageArenaPairs);
    // Guarantee at least one position differs from left column
    if (base.length > 1 && base.every((p, i) => p.id === stageArenaPairs[i].id)) {
      [base[0], base[1]] = [base[1], base[0]];
    }
    return base;
  }, [stageArenaPairs, shuffleSeed]);

  const startNodeChallenge = (node: SkillTreeNode) => {
    const bandMatches = catalog.filter((w) => w.tocflBand === node.tocflBand || w.category.toLowerCase().includes(node.titleEn.split(' ')[0].toLowerCase()));
    const pool = bandMatches.length >= 6 ? bandMatches : catalog;
    const pickedTargets = shuffleCopy(pool).slice(0, 5);
    const questions: NodeQuizQuestion[] = pickedTargets.map((target) => {
      const distractors = shuffleCopy(catalog.filter((w) => w.traditional !== target.traditional)).slice(0, 3);
      return { target, options: shuffleCopy([target, ...distractors]) };
    });
    setActiveNode(node);
    setNodeQuestions(questions);
    setNodeQIdx(0);
    setNodePicked(null);
    setNodeCorrect(0);
    setNodeFeedback(null);
    if (pickedTargets[0]) onSpeak?.(pickedTargets[0].traditional, 0.88);
  };

  const handleAnswerNodeQ = (choiceTrad: string) => {
    const q = nodeQuestions[nodeQIdx];
    if (!q || nodePicked !== null) return;
    const isRight = choiceTrad === q.target.traditional;
    const nextCorrect = nodeCorrect + (isRight ? 1 : 0);
    setNodePicked(choiceTrad);
    setNodeCorrect(nextCorrect);
    onSpeak?.(q.target.traditional, 0.85);

    let updated = recordWordPractice(
      progress,
      { word: q.target.traditional, zhuyin: q.target.zhuyin, english: q.target.english },
      isRight,
      isRight ? 4 : 1
    );

    if (nodeQIdx + 1 >= nodeQuestions.length && activeNode) {
      const acc = Math.round((nextCorrect / nodeQuestions.length) * 100);
      if (acc >= 80) {
        updated = {
          ...updated,
          xp: updated.xp + 20,
          completedNodes: {
            ...updated.completedNodes,
            [activeNode.id]: {
              nodeId: activeNode.id,
              crowns: (updated.completedNodes[activeNode.id]?.crowns || 0) + 1,
              bestAccuracy: Math.max(updated.completedNodes[activeNode.id]?.bestAccuracy || 0, acc),
              lastCompletedAt: new Date().toISOString(),
            },
          },
        };
        setNodeFeedback(`✓ Crown Earned! Passed "${activeNode.titleEn}" with ${nextCorrect}/${nodeQuestions.length} (${acc}%).`);
      } else {
        setNodeFeedback(`Scored ${nextCorrect}/${nodeQuestions.length} (${acc}%) — need ≥4/5 (80%) to earn a crown on "${activeNode.titleEn}".`);
      }
    }
    onUpdateProgress(updated);
  };

  const activeQ = nodeQuestions[nodeQIdx];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
      {/* 5-World Progressive Skill Tree + Inline 5-Question Verification Challenge */}
      <div className="lg:col-span-7 bg-slate-900/90 border border-slate-800 rounded-3xl p-5 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-sm font-extrabold text-emerald-300 uppercase tracking-wider">
            5-World Progressive Taiwan Skill Tree (20 Nodes · Verified ≥80% to Earn Crown)
          </h2>
        </div>

        {activeNode && activeQ && (
          <div className="bg-slate-950 border border-amber-500/50 rounded-2xl p-4 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="text-xs font-bold text-amber-300 uppercase">
                Node Challenge: {activeNode.titleEn} · Q{nodeQIdx + 1}/{nodeQuestions.length} (Score: {nodeCorrect})
              </div>
              <StylusButton variant="ghost" onClick={() => setActiveNode(null)}><span>Close Quiz</span></StylusButton>
            </div>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <div className="text-xs text-slate-400">Listen &amp; pick the English meaning of:</div>
                <div className="text-2xl font-black text-white">{activeQ.target.traditional} <span className="text-sm font-normal text-emerald-300">({activeQ.target.zhuyin})</span></div>
              </div>
              <StylusButton variant="secondary" onClick={() => onSpeak?.(activeQ.target.traditional, 0.85)}><span>🔊 Play Audio</span></StylusButton>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {activeQ.options.map((opt) => {
                const isRight = opt.traditional === activeQ.target.traditional;
                return (
                  <StylusButton
                    key={opt.traditional}
                    variant={nodePicked === opt.traditional ? (isRight ? 'primary' : 'danger') : 'secondary'}
                    onClick={() => handleAnswerNodeQ(opt.traditional)}
                  >
                    <span>{opt.english}</span>
                  </StylusButton>
                );
              })}
            </div>
            {nodePicked !== null && nodeQIdx + 1 < nodeQuestions.length && (
              <div className="flex justify-end">
                <StylusButton
                  variant="primary"
                  onClick={() => {
                    const nextI = nodeQIdx + 1;
                    setNodeQIdx(nextI);
                    setNodePicked(null);
                    if (nodeQuestions[nextI]) onSpeak?.(nodeQuestions[nextI].target.traditional, 0.88);
                  }}
                >
                  <span>Next Question →</span>
                </StylusButton>
              </div>
            )}
            {nodeFeedback && (
              <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                <span className="text-xs font-bold text-emerald-300">{nodeFeedback}</span>
                <StylusButton variant="secondary" onClick={() => startNodeChallenge(activeNode)}><span>Retry Challenge</span></StylusButton>
              </div>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {FIVE_WORLD_SKILL_TREE.map((node) => {
            const rec = progress.completedNodes[node.id];
            const done = Boolean(rec);
            return (
              <div
                key={node.id}
                className={`rounded-2xl p-3.5 border flex items-center justify-between gap-2 ${
                  done ? 'bg-emerald-950/50 border-emerald-500/50' : 'bg-slate-950/80 border-slate-800'
                }`}
              >
                <div>
                  <div className="text-[11px] font-bold text-amber-300">
                    World {node.worldNumber}.{node.nodeOrder} · {node.tocflBand} {done ? `· ${rec.bestAccuracy}%` : ''}
                  </div>
                  <div className="text-sm font-extrabold text-white">{node.titleZh} · {node.titleEn}</div>
                </div>
                <StylusButton variant={done ? 'primary' : 'secondary'} onClick={() => startNodeChallenge(node)}>
                  <span>{done ? `👑 ×${rec.crowns}` : 'Start Quiz'}</span>
                </StylusButton>
              </div>
            );
          })}
        </div>
      </div>

      {/* Independently Shuffled 3-Stage Match Arena */}
      <div className="lg:col-span-5 bg-slate-900/90 border border-slate-800 rounded-3xl p-5 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-sm font-extrabold text-amber-300 uppercase tracking-wider">3-Stage Match Arena (配對競技場)</h2>
          <div className="flex gap-1.5">
            {([1, 2, 3] as const).map((st) => (
              <StylusButton
                key={st}
                variant={arenaStage === st ? 'amber' : 'secondary'}
                onClick={() => {
                  setArenaStage(st);
                  setSelectedLeftId(null);
                  setMatchedPairIds([]);
                  setArenaMissNote(null);
                  setShuffleSeed((s) => s + 1);
                }}
              >
                <span>S{st}</span>
              </StylusButton>
            ))}
          </div>
        </div>
        {arenaMissNote && <div className="text-xs font-semibold text-amber-300">{arenaMissNote}</div>}
        <div className="grid grid-cols-2 gap-2.5">
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
                      setArenaMissNote('Not a match — listen or check the Zhuyin/meaning and try again.');
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
    </div>
  );
};
