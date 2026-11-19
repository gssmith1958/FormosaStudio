/**
 * FormosaStudio (FORM) — Stage 0: Start From Zero Interactive Beginner Launchpad
 * Guides true Day-1 native English speakers through 5 verified interactive micro-modules:
 *   0.1 Unified Tone Ear & Voice Lab (Stage0ToneLab)
 *   0.2 Zhuyin Sound Map + Family Syllable Blender + Blind Audio->Zhuyin Check
 *   0.3 Grammar Survival Map + Verified Tap-the-Tiles Sentence Builder (3/4 gate)
 *   0.4 Interactive 8-Stroke Practice Pad (6/8 gate) + Unseen-Character Radical Logic Check (3/4 gate)
 *   0.5 First 10 Taipei Phrases + Audio-First Shuffled Café Roleplay (3/3 gate)
 */

import React, { useMemo, useState } from 'react';
import {
  STAGE0_CAFE_ROLEPLAY, STAGE0_FIRST_10_PHRASES, STAGE0_GRAMMAR_RULES, STAGE0_MODULES,
  STAGE0_RADICAL_LEGEND, STAGE0_RADICAL_QUIZ, STAGE0_SENTENCE_PUZZLES, STAGE0_STROKE_RULES,
  STAGE0_ZHUYIN_FAMILIES, STAGE0_ZHUYIN_QUIZ_POOL, ZhuyinBlindQuizItem,
} from '../data/stage0BeginnerData.ts';
import { Stage0ModuleId, UserProgressState, getStage0Summary, markStage0ModuleComplete, setStage0Skipped } from '../lib/progressStore.ts';
import { dispatchStudioHandoff } from '../lib/studioContextBus.ts';
import { StylusButton } from './uiPrimitives.tsx';
import { RubyText } from './RubyText.tsx';
import { BasicStrokePracticePad } from './BasicStrokePracticePad.tsx';
import { Stage0ToneLab } from './Stage0ToneLab.tsx';

function shuffleList<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

const ModuleGateBar: React.FC<{
  verified: boolean;
  statusText: string;
  unlockLabel: string;
  lockedLabel: string;
  onComplete: () => void;
}> = ({ verified, statusText, unlockLabel, lockedLabel, onComplete }) => (
  <div className="flex flex-wrap items-center justify-between gap-3">
    <span className="text-xs font-semibold" style={{ color: verified ? 'var(--fs-accent-text)' : 'var(--fs-text-secondary)' }}>
      {statusText}
    </span>
    <div className="flex items-center gap-2">
      <StylusButton variant="primary" disabled={!verified} onClick={onComplete}>
        <span>{verified ? unlockLabel : lockedLabel}</span>
      </StylusButton>
      {!verified && (
        <button type="button" onClick={onComplete} className="text-xs underline px-2 py-1" style={{ color: 'var(--fs-text-muted)' }}>
          Override
        </button>
      )}
    </div>
  </div>
);

export interface Stage0BeginnerLaunchpadProps {
  progress: UserProgressState;
  onUpdateProgress: (next: UserProgressState) => void;
  onSpeak?: (text: string, rate?: number) => void;
  onFinishedStage0?: () => void;
}

export const Stage0BeginnerLaunchpad: React.FC<Stage0BeginnerLaunchpadProps> = ({
  progress,
  onUpdateProgress,
  onSpeak,
  onFinishedStage0,
}) => {
  const summary = getStage0Summary(progress);
  const [activeMod, setActiveMod] = useState<Stage0ModuleId>(summary.nextModuleId || '0.1');

  // 0.2 Zhuyin family, blender & blind audio->Zhuyin check state
  const [familyIdx, setFamilyIdx] = useState<number>(0);
  const [blendIdx, setBlendIdx] = useState<number>(0);
  const [zhuyinQuiz, setZhuyinQuiz] = useState<ZhuyinBlindQuizItem[]>(() =>
    shuffleList(STAGE0_ZHUYIN_QUIZ_POOL).slice(0, 8).map((q) => ({ ...q, options: shuffleList(q.options) }))
  );
  const [zhuyinQIdx, setZhuyinQIdx] = useState<number>(0);
  const [zhuyinPicked, setZhuyinPicked] = useState<string | null>(null);
  const [zhuyinScore, setZhuyinScore] = useState<number>(0);
  const [zhuyinAnswered, setZhuyinAnswered] = useState<number>(0);

  // 0.3 Sentence builder verified progress state
  const [puzzleIdx, setPuzzleIdx] = useState<number>(0);
  const [chosenTiles, setChosenTiles] = useState<string[]>([]);
  const [puzzleFeedback, setPuzzleFeedback] = useState<string | null>(null);
  const [solvedPuzzleIds, setSolvedPuzzleIds] = useState<string[]>([]);

  // 0.4 Strokes practiced + Unseen-character Radical quiz state
  const [strokesPracticedCount, setStrokesPracticedCount] = useState<number>(0);
  const [radicalAnswers, setRadicalAnswers] = useState<Record<string, number>>({});

  // 0.5 Audio-first Café roleplay state
  const [roleplayShowEnglish, setRoleplayShowEnglish] = useState<boolean>(false);
  const [roleplayAnswers, setRoleplayAnswers] = useState<Record<number, number>>({});

  const completeModule = (id: Stage0ModuleId) => {
    const next = markStage0ModuleComplete(progress, id);
    onUpdateProgress(next);
    const nextIdx = STAGE0_MODULES.findIndex((m) => m.id === id) + 1;
    if (nextIdx < STAGE0_MODULES.length) {
      setActiveMod(STAGE0_MODULES[nextIdx].id);
    } else if (onFinishedStage0) {
      onFinishedStage0();
    }
  };

  const activeFamily = STAGE0_ZHUYIN_FAMILIES[familyIdx] || STAGE0_ZHUYIN_FAMILIES[0];
  const activeBlend = activeFamily.blends[blendIdx] || activeFamily.blends[0];
  const activePuzzle = STAGE0_SENTENCE_PUZZLES[puzzleIdx] || STAGE0_SENTENCE_PUZZLES[0];
  const activeZhuyinQ = zhuyinQuiz[zhuyinQIdx];
  const zhuyinRoundDone = zhuyinAnswered >= zhuyinQuiz.length;

  const mod02Verified = zhuyinRoundDone && zhuyinScore >= 6;
  const mod03Verified = solvedPuzzleIds.length >= 3;
  const radicalCorrectCount = useMemo(
    () => STAGE0_RADICAL_QUIZ.filter((q) => radicalAnswers[q.id] === q.correctIdx).length,
    [radicalAnswers]
  );
  const mod04Verified = strokesPracticedCount >= 6 && radicalCorrectCount >= 3;
  const roleplayCorrectCount = useMemo(
    () => STAGE0_CAFE_ROLEPLAY.filter((t, i) => roleplayAnswers[i] === t.correctIdx).length,
    [roleplayAnswers]
  );
  const mod05Verified = roleplayCorrectCount >= STAGE0_CAFE_ROLEPLAY.length;

  const resetZhuyinQuiz = () => {
    setZhuyinQuiz(shuffleList(STAGE0_ZHUYIN_QUIZ_POOL).slice(0, 8).map((q) => ({ ...q, options: shuffleList(q.options) })));
    setZhuyinQIdx(0);
    setZhuyinPicked(null);
    setZhuyinScore(0);
    setZhuyinAnswered(0);
  };

  return (
    <div className="space-y-6">
      {/* Stage 0 Orientation Header */}
      <section className="fs-card p-6 space-y-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--fs-accent-text)' }}>
              Stage 0 · Absolute Beginner Launchpad ({summary.completedCount} / {summary.totalCount} Complete)
            </div>
            <h1 className="text-2xl font-bold tracking-tight" style={{ color: 'var(--fs-text)' }}>
              Start From Zero: Taiwanese Mandarin for English Speakers
            </h1>
            <p className="text-sm sm:text-[15px]" style={{ color: 'var(--fs-text-secondary)' }}>
              Each module verifies that you can genuinely hear, speak, or build what you learned before unlocking the next step.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <StylusButton
              variant="ghost"
              onClick={() => {
                onUpdateProgress(setStage0Skipped(progress, !progress.stage0Skipped));
                if (!progress.stage0Skipped && onFinishedStage0) onFinishedStage0();
              }}
            >
              <span>{progress.stage0Skipped ? 'Resume Stage 0' : 'Skip — I already know Zhuyin & Tones'}</span>
            </StylusButton>
          </div>
        </div>

        {/* 5-Module Horizontal Stepper */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5">
          {STAGE0_MODULES.map((m) => {
            const done = summary.completedIds.includes(m.id);
            const selected = activeMod === m.id;
            return (
              <button
                key={m.id}
                type="button"
                onClick={() => setActiveMod(m.id)}
                style={{
                  minHeight: '76px',
                  backgroundColor: selected ? 'var(--fs-accent-soft)' : 'var(--fs-subtle)',
                  borderColor: selected ? 'var(--fs-accent-border)' : 'var(--fs-border)',
                }}
                className="p-3.5 rounded-2xl border text-left transition space-y-1"
              >
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span style={{ color: selected ? 'var(--fs-accent-text)' : 'var(--fs-text-muted)' }}>
                    {done ? `✓ ${m.numberLabel}` : `Module ${m.numberLabel}`}
                  </span>
                  <span style={{ color: 'var(--fs-text-muted)' }}>{m.estMinutes}m</span>
                </div>
                <div className="text-sm font-bold leading-snug" style={{ color: 'var(--fs-text)' }}>{m.titleEn}</div>
                <div className="text-xs" style={{ color: 'var(--fs-text-secondary)' }}>{m.titleZh}</div>
              </button>
            );
          })}
        </div>
      </section>

      {/* MODULE 0.1: UNIFIED TONE EAR & VOICE BOOT CAMP */}
      {activeMod === '0.1' && <Stage0ToneLab onSpeak={onSpeak} onComplete={() => completeModule('0.1')} />}

      {/* MODULE 0.2: ZHUYIN SOUND MAP, FAMILY SYLLABLE BLENDER & BLIND AUDIO->ZHUYIN CHECK */}
      {activeMod === '0.2' && (
        <section className="fs-card p-6 space-y-6">
          <div className="space-y-1">
            <h2 className="text-xl font-bold" style={{ color: 'var(--fs-text)' }}>0.2 Zhuyin (ㄅㄆㄇㄈ) Sound Map · All 37 Taiwanese Phonetic Symbols</h2>
            <p className="text-sm" style={{ color: 'var(--fs-text-secondary)' }}>
              Explore all 6 Zhuyin families with tap-to-hear audio, practice blending each family into real words, then pass the blind ear-to-symbol check.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {STAGE0_ZHUYIN_FAMILIES.map((fam, idx) => (
              <StylusButton key={fam.id} variant={familyIdx === idx ? 'primary' : 'secondary'} onClick={() => { setFamilyIdx(idx); setBlendIdx(0); }}>
                <span>{fam.titleEn}</span>
              </StylusButton>
            ))}
          </div>

          <div className="fs-subtle-box p-4 text-sm font-medium" style={{ color: 'var(--fs-accent-text)' }}>{activeFamily.keyInsight}</div>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
            {activeFamily.symbols.map((sym) => (
              <button
                key={sym.symbol}
                type="button"
                onClick={() => onSpeak?.(sym.speakSample, 0.8)}
                className="fs-subtle-box p-4 text-left transition hover:opacity-95 flex flex-col justify-start items-stretch gap-1.5"
              >
                <div className="flex items-center justify-between gap-1.5">
                  <span className="text-3xl font-bold shrink-0" style={{ color: 'var(--fs-accent-text)' }}>{sym.symbol}</span>
                  <span className="px-2 py-0.5 rounded-full text-[11px] font-mono font-bold whitespace-nowrap shrink-0" style={{ backgroundColor: 'var(--fs-surface)', color: 'var(--fs-text)' }}>
                    {sym.pinyin}
                  </span>
                </div>
                <div className="text-sm font-bold" style={{ color: 'var(--fs-text)' }}>{sym.englishCue}</div>
                <div className="text-xs" style={{ color: 'var(--fs-text-secondary)' }}>{sym.mouthTip}</div>
              </button>
            ))}
          </div>

          {/* Family-Specific Syllable Blender */}
          <div className="fs-subtle-box p-5 space-y-3">
            <div className="text-sm font-bold" style={{ color: 'var(--fs-text)' }}>
              Syllable Blender · Practice {activeFamily.titleEn} in Real Words:
            </div>
            <div className="flex flex-wrap gap-2">
              {activeFamily.blends.map((b, i) => (
                <StylusButton key={`${activeFamily.id}-${b.zhuyin}-${b.sampleChar}`} variant={blendIdx === i ? 'primary' : 'secondary'} onClick={() => { setBlendIdx(i); onSpeak?.(b.sampleChar, 0.85); }}>
                  <span>{b.partsLabel} → {b.sampleChar}</span>
                </StylusButton>
              ))}
            </div>
            <div className="fs-card p-4 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <span className="text-xl font-bold" style={{ color: 'var(--fs-accent-text)' }}>{activeBlend.partsLabel} = {activeBlend.zhuyin}</span>
                <RubyText text={activeBlend.sampleChar} zhuyin={activeBlend.zhuyin} pinyin={activeBlend.pinyin} showPinyinHint size="lg" zhuyinDisplayMode="always" />
                <span className="text-base font-semibold" style={{ color: 'var(--fs-text)' }}>"{activeBlend.meaningEn}"</span>
              </div>
              <StylusButton variant="secondary" onClick={() => onSpeak?.(activeBlend.sampleChar, 0.8)}><span>Hear Blend</span></StylusButton>
            </div>
          </div>

          {/* Blind Audio -> Zhuyin Symbol Differentiation Check */}
          <div className="fs-subtle-box p-5 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <div className="text-xs font-bold uppercase" style={{ color: 'var(--fs-accent-text)' }}>
                  Blind Audio → Zhuyin Check ({Math.min(zhuyinQIdx + 1, zhuyinQuiz.length)} / {zhuyinQuiz.length} · Score: {zhuyinScore}/{zhuyinAnswered})
                </div>
                <div className="text-base font-bold" style={{ color: 'var(--fs-text)' }}>
                  {zhuyinRoundDone
                    ? `Finished: ${zhuyinScore} / ${zhuyinQuiz.length} (${zhuyinScore >= 6 ? '✓ Passed!' : 'Need ≥6/8 to unlock'})`
                    : 'Listen to the syllable and pick the matching Zhuyin symbol (confusable pairs tested!):'}
                </div>
              </div>
              <StylusButton variant="ghost" onClick={resetZhuyinQuiz}><span>New Shuffled Check</span></StylusButton>
            </div>

            {!zhuyinRoundDone && activeZhuyinQ && (
              <div className="space-y-3">
                <div className="flex flex-wrap gap-2">
                  <StylusButton variant="primary" onClick={() => onSpeak?.(activeZhuyinQ.speakSample, 0.85)}><span>Play Sound (Normal)</span></StylusButton>
                  <StylusButton variant="secondary" onClick={() => onSpeak?.(activeZhuyinQ.speakSample, 0.65)}><span>Play Slow</span></StylusButton>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {activeZhuyinQ.options.map((sym) => (
                    <StylusButton
                      key={sym}
                      variant={zhuyinPicked === sym ? (sym === activeZhuyinQ.correctSymbol ? 'primary' : 'danger') : 'secondary'}
                      onClick={() => {
                        if (zhuyinPicked !== null) return;
                        setZhuyinPicked(sym);
                        setZhuyinAnswered((n) => n + 1);
                        if (sym === activeZhuyinQ.correctSymbol) setZhuyinScore((s) => s + 1);
                      }}
                    >
                      <span className="text-2xl font-bold">{sym}</span>
                    </StylusButton>
                  ))}
                </div>
                {zhuyinPicked !== null && (
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                    <div className="text-sm font-semibold" style={{ color: zhuyinPicked === activeZhuyinQ.correctSymbol ? 'var(--fs-accent-text)' : 'var(--fs-danger)' }}>
                      {zhuyinPicked === activeZhuyinQ.correctSymbol ? '✓ Correct! ' : 'Answer: '}
                      {activeZhuyinQ.correctSymbol} (Pinyin: {activeZhuyinQ.pinyin}) — as in {activeZhuyinQ.wordHint}
                    </div>
                    <StylusButton variant="primary" onClick={() => { setZhuyinPicked(null); setZhuyinQIdx((i) => i + 1); }}>
                      <span>{zhuyinQIdx + 1 >= zhuyinQuiz.length ? 'Finish Check' : 'Next Sound →'}</span>
                    </StylusButton>
                  </div>
                )}
              </div>
            )}
          </div>

          <ModuleGateBar
            verified={mod02Verified}
            statusText={mod02Verified ? '✓ Blind Zhuyin Check Passed' : `○ Pass Blind Zhuyin Check (${zhuyinScore}/8 · need ≥6/8)`}
            unlockLabel="Complete Module 0.2 & Continue to Grammar →"
            lockedLabel="Pass Blind Check to Unlock"
            onComplete={() => completeModule('0.2')}
          />
        </section>
      )}

      {/* MODULE 0.3: ENGLISH -> MANDARIN GRAMMAR SURVIVAL MAP */}
      {activeMod === '0.3' && (
        <section className="fs-card p-6 space-y-6">
          <div className="space-y-1">
            <h2 className="text-xl font-bold" style={{ color: 'var(--fs-text)' }}>0.3 English → Mandarin Grammar Survival Map</h2>
            <p className="text-sm" style={{ color: 'var(--fs-text-secondary)' }}>
              Master these 5 word-order rules, then build at least 3 Mandarin sentences below to unlock Module 0.4.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {STAGE0_GRAMMAR_RULES.map((rule) => (
              <div key={rule.id} className="fs-subtle-box p-5 space-y-2.5">
                <div className="text-base font-bold" style={{ color: 'var(--fs-text)' }}>{rule.titleEn}</div>
                <p className="text-sm" style={{ color: 'var(--fs-text-secondary)' }}>{rule.ruleSummary}</p>
                <div className="text-xs font-mono font-semibold px-3 py-1.5 rounded-lg" style={{ backgroundColor: 'var(--fs-surface)', color: 'var(--fs-accent-text)' }}>{rule.formula}</div>
                <div className="fs-card p-3 space-y-1">
                  <div className="flex items-center justify-between gap-2">
                    <RubyText text={rule.exampleTrad} zhuyin={rule.exampleZhuyin} pinyin={rule.examplePinyin} showPinyinHint size="md" zhuyinDisplayMode="always" />
                    <StylusButton variant="ghost" onClick={() => onSpeak?.(rule.exampleTrad, 0.85)}><span>Listen</span></StylusButton>
                  </div>
                  <div className="text-xs" style={{ color: 'var(--fs-text-muted)' }}>Literal: {rule.literalGloss}</div>
                  <div className="text-sm font-medium" style={{ color: 'var(--fs-text)' }}>{rule.naturalEnglish}</div>
                </div>
                <div className="text-xs font-semibold" style={{ color: 'var(--fs-warm)' }}>Watch out: {rule.watchOutEn}</div>
              </div>
            ))}
          </div>

          {/* Interactive Tap-the-Tiles Sentence Builder */}
          <div className="fs-subtle-box p-5 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <div className="text-xs font-bold uppercase" style={{ color: 'var(--fs-accent-text)' }}>
                  Sentence Builder ({puzzleIdx + 1} / {STAGE0_SENTENCE_PUZZLES.length} · Solved: {solvedPuzzleIds.length}/{STAGE0_SENTENCE_PUZZLES.length})
                </div>
                <div className="text-base font-bold" style={{ color: 'var(--fs-text)' }}>Build in Mandarin: "{activePuzzle.englishPrompt}"</div>
              </div>
              <StylusButton variant="ghost" onClick={() => { setChosenTiles([]); setPuzzleFeedback(null); }}><span>Reset Tiles</span></StylusButton>
            </div>

            <div className="fs-card p-4 min-h-[60px] flex flex-wrap items-center gap-2">
              {chosenTiles.length === 0 ? (
                <span className="text-sm" style={{ color: 'var(--fs-text-muted)' }}>Tap the word tiles below in Mandarin order…</span>
              ) : (
                chosenTiles.map((t, i) => (
                  <span key={i} className="px-3 py-1.5 rounded-xl text-base font-bold" style={{ backgroundColor: 'var(--fs-accent-soft)', color: 'var(--fs-accent-text)' }}>{t}</span>
                ))
              )}
            </div>

            <div className="flex flex-wrap gap-2">
              {activePuzzle.tiles.map((tile) => {
                const used = chosenTiles.includes(tile.text);
                return (
                  <StylusButton
                    key={tile.text}
                    variant={used ? 'ghost' : 'secondary'}
                    disabled={used}
                    onClick={() => {
                      const next = [...chosenTiles, tile.text];
                      setChosenTiles(next);
                      if (next.length === activePuzzle.correctOrder.length) {
                        const ok = next.every((v, idx) => v === activePuzzle.correctOrder[idx]);
                        setPuzzleFeedback(ok ? `✓ Correct! ${activePuzzle.explanationEn}` : `Try again — ${activePuzzle.explanationEn}`);
                        if (ok) {
                          onSpeak?.(next.join(''), 0.85);
                          setSolvedPuzzleIds((prev) => (prev.includes(activePuzzle.id) ? prev : [...prev, activePuzzle.id]));
                        }
                      }
                    }}
                  >
                    <span className="font-bold text-base">{tile.text}</span>
                    <span className="text-xs opacity-75">{tile.gloss}</span>
                  </StylusButton>
                );
              })}
            </div>

            {puzzleFeedback && (
              <div className="flex flex-wrap items-center justify-between gap-3">
                <span className="text-sm font-semibold" style={{ color: puzzleFeedback.startsWith('✓') ? 'var(--fs-accent-text)' : 'var(--fs-warm)' }}>{puzzleFeedback}</span>
                <StylusButton variant="secondary" onClick={() => { setPuzzleIdx((i) => (i + 1) % STAGE0_SENTENCE_PUZZLES.length); setChosenTiles([]); setPuzzleFeedback(null); }}>
                  <span>Next Puzzle →</span>
                </StylusButton>
              </div>
            )}
          </div>

          <ModuleGateBar
            verified={mod03Verified}
            statusText={mod03Verified ? `✓ ${solvedPuzzleIds.length}/4 Puzzles Solved` : `○ Solve ≥3 Sentence Puzzles (${solvedPuzzleIds.length}/4)`}
            unlockLabel="Complete Module 0.3 & Continue to Strokes →"
            lockedLabel="Solve 3 Puzzles to Unlock"
            onComplete={() => completeModule('0.3')}
          />
        </section>
      )}

      {/* MODULE 0.4: BASIC STROKES & CHARACTER LOGIC 101 */}
      {activeMod === '0.4' && (
        <section className="fs-card p-6 space-y-6">
          <div className="space-y-1">
            <h2 className="text-xl font-bold" style={{ color: 'var(--fs-text)' }}>0.4 Basic Strokes &amp; Character Logic 101</h2>
            <p className="text-sm" style={{ color: 'var(--fs-text-secondary)' }}>
              Practice at least 6 of the 8 basic strokes on the pad below, then deduce the meaning of 4 unseen characters from their radical building blocks.
            </p>
          </div>

          <BasicStrokePracticePad onPracticedCountChange={setStrokesPracticedCount} />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="fs-subtle-box p-5 space-y-2">
              <div className="text-sm font-bold" style={{ color: 'var(--fs-text)' }}>The 6 Universal Stroke-Order Rules</div>
              {STAGE0_STROKE_RULES.map((r) => (
                <div key={r} className="text-sm" style={{ color: 'var(--fs-text-secondary)' }}>{r}</div>
              ))}
            </div>
            <div className="fs-subtle-box p-5 space-y-3">
              <div className="text-sm font-bold" style={{ color: 'var(--fs-text)' }}>Trace Your First 5 Full Characters (2–4 Strokes)</div>
              <p className="text-sm" style={{ color: 'var(--fs-text-secondary)' }}>
                Tap any starter character to open it directly on the rice-paper Wacom Calligraphy Studio:
              </p>
              <div className="flex flex-wrap gap-2">
                {(['人', '大', '日', '中', '水'] as const).map((ch) => (
                  <StylusButton
                    key={ch}
                    variant="secondary"
                    onClick={() => dispatchStudioHandoff({ fromStudio: 'hub', fromLabel: 'Stage 0 Strokes 101', toStudio: 'calligraphy', targetText: ch })}
                  >
                    <span className="text-lg font-bold">{ch}</span>
                    <span className="text-xs">Trace →</span>
                  </StylusButton>
                ))}
              </div>
            </div>
          </div>

          {/* Instructive Radical Building-Block Legend + Unseen Character Check */}
          <div className="fs-subtle-box p-5 space-y-4">
            <div className="space-y-1">
              <div className="text-sm font-bold" style={{ color: 'var(--fs-text)' }}>
                How Characters Encode Meaning · 5 High-Frequency Radicals
              </div>
              <p className="text-xs" style={{ color: 'var(--fs-text-secondary)' }}>
                Study these 5 meaning clues, then spot which radical appears inside each <strong>new, unseen character</strong> below (the radical breakdown unlocks after you guess!):
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2">
              {STAGE0_RADICAL_LEGEND.map((item) => (
                <div key={item.radical} className="fs-card p-3 space-y-0.5">
                  <div className="text-lg font-bold" style={{ color: 'var(--fs-accent-text)' }}>{item.radical}</div>
                  <div className="text-xs font-bold" style={{ color: 'var(--fs-text)' }}>{item.meaning}</div>
                  <div className="text-[11px]" style={{ color: 'var(--fs-text-muted)' }}>{item.examples}</div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {STAGE0_RADICAL_QUIZ.map((q) => {
                const picked = radicalAnswers[q.id];
                return (
                  <div key={q.id} className="fs-card p-4 space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <div>
                        <div className="text-xs font-bold uppercase" style={{ color: 'var(--fs-text-muted)' }}>
                          {picked !== undefined ? `Building Blocks: ${q.breakdown}` : 'Spot the radical inside this character:'}
                        </div>
                        <div className="text-4xl font-bold mt-1" style={{ color: 'var(--fs-text)' }}>{q.char}</div>
                      </div>
                      {picked !== undefined && (
                        <span className="text-xs font-semibold px-2 py-1 rounded-lg" style={{ backgroundColor: 'var(--fs-subtle)', color: 'var(--fs-accent-text)' }}>
                          Key: {q.radical}
                        </span>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {q.options.map((opt, idx) => (
                        <StylusButton key={opt} variant={picked === idx ? (idx === q.correctIdx ? 'primary' : 'danger') : 'secondary'} onClick={() => { setRadicalAnswers((prev) => ({ ...prev, [q.id]: idx })); onSpeak?.(q.char, 0.82); }}>
                          <span>{opt}</span>
                        </StylusButton>
                      ))}
                    </div>
                    {picked !== undefined && (
                      <div className="fs-subtle-box p-3 space-y-1.5">
                        <div className="flex items-center justify-between gap-3">
                          <div className="flex items-center gap-3">
                            <RubyText text={q.char} zhuyin={q.zhuyin} pinyin={q.pinyin} showPinyinHint size="md" zhuyinDisplayMode="always" />
                            <div className="text-sm font-bold" style={{ color: picked === q.correctIdx ? 'var(--fs-accent-text)' : 'var(--fs-warm)' }}>
                              {picked === q.correctIdx ? '✓ Correct: ' : 'Answer: '}{q.char} ({q.zhuyin} / {q.pinyin}) = "{q.meaningEn}"
                            </div>
                          </div>
                          <StylusButton variant="ghost" onClick={() => onSpeak?.(q.char, 0.8)}><span>Listen</span></StylusButton>
                        </div>
                        <div className="text-xs" style={{ color: 'var(--fs-text-secondary)' }}>{q.explain}</div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <ModuleGateBar verified={mod04Verified} statusText={`${strokesPracticedCount >= 6 ? '✓' : '○'} Strokes (${strokesPracticedCount}/8 · need ≥6) · ${radicalCorrectCount >= 3 ? '✓' : '○'} Radicals (${radicalCorrectCount}/4 · need ≥3)`} unlockLabel="Complete Module 0.4 & Continue to Taipei Phrases →" lockedLabel="Practice 6 Strokes & Pass Quiz" onComplete={() => completeModule('0.4')} />
        </section>
      )}

      {/* MODULE 0.5: FIRST 10 TAIPEI PHRASES & AUDIO-FIRST CAFÉ ROLEPLAY */}
      {activeMod === '0.5' && (
        <section className="fs-card p-6 space-y-6">
          <div className="space-y-1">
            <h2 className="text-xl font-bold" style={{ color: 'var(--fs-text)' }}>0.5 Your First 10 Taipei Survival Phrases &amp; Audio-First Café Roleplay</h2>
            <p className="text-sm" style={{ color: 'var(--fs-text-secondary)' }}>Listen and shadow these 10 authentic Taiwan phrases, then complete the 3-turn Taipei café conversation by ear.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {STAGE0_FIRST_10_PHRASES.map((p) => (
              <div key={p.trad} className="fs-subtle-box p-4 flex items-center justify-between gap-3">
                <div className="space-y-1">
                  <RubyText text={p.trad} zhuyin={p.zhuyin} pinyin={p.pinyin} showPinyinHint size="md" zhuyinDisplayMode="always" />
                  <div className="text-sm font-bold" style={{ color: 'var(--fs-text)' }}>{p.english}</div>
                  <div className="text-xs" style={{ color: 'var(--fs-text-muted)' }}>Literal: {p.gloss}</div>
                </div>
                <div className="flex flex-col gap-1.5 shrink-0">
                  <StylusButton variant="secondary" onClick={() => onSpeak?.(p.trad, 0.92)}><span>Normal</span></StylusButton>
                  <StylusButton variant="ghost" onClick={() => onSpeak?.(p.trad, 0.65)}><span>Slow</span></StylusButton>
                </div>
              </div>
            ))}
          </div>
          <div className="fs-subtle-box p-5 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="text-sm font-bold" style={{ color: 'var(--fs-text)' }}>Mini Taipei Café Roleplay ({roleplayCorrectCount}/{STAGE0_CAFE_ROLEPLAY.length} correct) · Hear the Clerk &amp; Pick Your Reply:</div>
              <StylusButton variant="ghost" onClick={() => setRoleplayShowEnglish((v) => !v)}><span>{roleplayShowEnglish ? 'Hide English Hints' : 'Show English Hints'}</span></StylusButton>
            </div>
            <div className="space-y-3">
              {STAGE0_CAFE_ROLEPLAY.map((turn, idx) => {
                const picked = roleplayAnswers[idx];
                const answered = picked !== undefined;
                return (
                  <div key={idx} className="fs-card p-4 space-y-2.5">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div>
                        <div className="text-base font-bold" style={{ color: 'var(--fs-text)' }}>Turn {idx + 1} · Clerk: {roleplayShowEnglish || answered ? turn.clerkZh : '(Listen to the clerk first!)'}</div>
                        {(roleplayShowEnglish || answered) && <div className="text-xs" style={{ color: 'var(--fs-text-secondary)' }}>{turn.clerkPinyin} — "{turn.clerkEn}"</div>}
                      </div>
                      <div className="flex gap-1.5">
                        <StylusButton variant="primary" onClick={() => onSpeak?.(turn.clerkZh, 0.85)}><span>Hear Clerk</span></StylusButton>
                        <StylusButton variant="ghost" onClick={() => onSpeak?.(turn.clerkZh, 0.65)}><span>Slow</span></StylusButton>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {turn.options.map((opt, oIdx) => (
                        <StylusButton key={opt.text} variant={picked === oIdx ? (oIdx === turn.correctIdx ? 'primary' : 'danger') : 'secondary'} onClick={() => { setRoleplayAnswers((prev) => ({ ...prev, [idx]: oIdx })); onSpeak?.(opt.text, 0.88); }}>
                          <span>{opt.text}{roleplayShowEnglish || answered ? ` (${opt.en})` : ''}</span>
                        </StylusButton>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <ModuleGateBar verified={mod05Verified} statusText={mod05Verified ? '✓ Café Roleplay Passed (3/3)' : `○ Complete All 3 Café Turns (${roleplayCorrectCount}/3)`} unlockLabel="Finish Stage 0 & Begin Stage 1 →" lockedLabel="Pass Café Roleplay to Finish" onComplete={() => completeModule('0.5')} />
        </section>
      )}
    </div>
  );
};
