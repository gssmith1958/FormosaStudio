/**
 * FormosaStudio (FORM) — Stage 0: Start From Zero Interactive Beginner Launchpad
 * Guides true Day-1 native English speakers through 5 interactive micro-modules before Stage 1:
 *   0.1 Tone Ear Boot Camp -> 0.2 Zhuyin Sound Map & Blender -> 0.3 Grammar Survival Map
 *   -> 0.4 Basic Strokes & Character Logic -> 0.5 First 10 Taipei Phrases & Café Roleplay
 */

import React, { useState } from 'react';
import {
  STAGE0_CAFE_ROLEPLAY,
  STAGE0_FIRST_10_PHRASES,
  STAGE0_GRAMMAR_RULES,
  STAGE0_MODULES,
  STAGE0_RADICAL_LEGEND,
  STAGE0_RADICAL_QUIZ,
  STAGE0_SENTENCE_PUZZLES,
  STAGE0_STROKE_RULES,
  STAGE0_TONE_CARDS,
  STAGE0_TONE_QUIZ,
  STAGE0_ZHUYIN_FAMILIES,
} from '../data/stage0BeginnerData.ts';
import {
  Stage0ModuleId,
  UserProgressState,
  getStage0Summary,
  markStage0ModuleComplete,
  setStage0Skipped,
} from '../lib/progressStore.ts';
import { dispatchStudioHandoff } from '../lib/studioContextBus.ts';
import { StylusButton } from './uiPrimitives.tsx';
import { RubyText } from './RubyText.tsx';
import { BasicStrokePracticePad } from './BasicStrokePracticePad.tsx';

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

  // 0.1 Tone Ear Quiz state
  const [toneQuizIdx, setToneQuizIdx] = useState<number>(0);
  const [toneSelected, setToneSelected] = useState<number | null>(null);
  const [toneCorrectCount, setToneCorrectCount] = useState<number>(0);

  // 0.2 Zhuyin family & blender state
  const [familyIdx, setFamilyIdx] = useState<number>(0);
  const [blendIdx, setBlendIdx] = useState<number>(0);

  // 0.3 Sentence builder state
  const [puzzleIdx, setPuzzleIdx] = useState<number>(0);
  const [chosenTiles, setChosenTiles] = useState<string[]>([]);
  const [puzzleFeedback, setPuzzleFeedback] = useState<string | null>(null);

  // 0.4 Radical quiz state
  const [radicalAnswers, setRadicalAnswers] = useState<Record<string, number>>({});

  // 0.5 Café roleplay state
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

  const activeToneQ = STAGE0_TONE_QUIZ[toneQuizIdx % STAGE0_TONE_QUIZ.length];
  const activeFamily = STAGE0_ZHUYIN_FAMILIES[familyIdx] || STAGE0_ZHUYIN_FAMILIES[0];
  const activeBlend = activeFamily.blends[blendIdx] || activeFamily.blends[0];
  const activePuzzle = STAGE0_SENTENCE_PUZZLES[puzzleIdx] || STAGE0_SENTENCE_PUZZLES[0];

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
              Never studied Chinese or Zhuyin before? Complete these 5 short modules first—Pinyin training wheels stay on until you turn them off.
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
                <div className="text-sm font-bold leading-snug" style={{ color: 'var(--fs-text)' }}>
                  {m.titleEn}
                </div>
                <div className="text-xs" style={{ color: 'var(--fs-text-secondary)' }}>
                  {m.titleZh}
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* MODULE 0.1: TONE EAR BOOT CAMP */}
      {activeMod === '0.1' && (
        <section className="fs-card p-6 space-y-6">
          <div className="space-y-1">
            <h2 className="text-xl font-bold" style={{ color: 'var(--fs-text)' }}>
              0.1 Tone Ear Boot Camp · Train Your Ear Before Speaking
            </h2>
            <p className="text-sm" style={{ color: 'var(--fs-text-secondary)' }}>
              In English, pitch shows emotion ("Really?" vs "Really!"). In Mandarin, pitch changes the actual word. Listen to all 5 tones below:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
            {STAGE0_TONE_CARDS.map((card) => (
              <div key={card.tone} className="fs-subtle-box p-4 flex flex-col justify-between gap-3">
                <div className="space-y-1.5">
                  <div className="text-xs font-bold" style={{ color: `var(--fs-tone-${card.tone})` }}>
                    {card.nameEn}
                  </div>
                  <RubyText text={card.exampleChar} zhuyin={card.exampleZhuyin} pinyin={card.examplePinyin} showPinyinHint size="lg" zhuyinDisplayMode="always" />
                  <div className="text-sm font-bold" style={{ color: 'var(--fs-text)' }}>{card.meaningEn}</div>
                  <p className="text-xs" style={{ color: 'var(--fs-text-secondary)' }}>{card.englishAnalogy}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-xs italic" style={{ color: 'var(--fs-text-muted)' }}>{card.taiwanTip}</p>
                  <StylusButton variant="secondary" className="w-full" onClick={() => onSpeak?.(card.exampleChar, 0.8)}>
                    <span>Listen</span>
                  </StylusButton>
                </div>
              </div>
            ))}
          </div>

          {/* 2 Day-1 Sandhi Rules */}
          <div className="fs-subtle-box p-4 space-y-1.5 text-sm">
            <div className="font-bold" style={{ color: 'var(--fs-accent-text)' }}>
              The Only 2 Spoken Tone-Shift Rules You Need on Day 1:
            </div>
            <p style={{ color: 'var(--fs-text-secondary)' }}>
              1. <strong>Two 3rd tones in a row:</strong> The first rises to Tone 2 — so <strong>你好 (nǐ hǎo)</strong> is actually spoken <strong>ní hǎo</strong>!
            </p>
            <p style={{ color: 'var(--fs-text-secondary)' }}>
              2. <strong>不 (bù) before a 4th tone:</strong> Shifts up to Tone 2 (<strong>bú</strong>) — so <strong>不是 / 不會</strong> sound like <strong>bú shì / bú huì</strong>.
            </p>
          </div>

          {/* Audio-Only Tone Quiz */}
          <div className="fs-subtle-box p-5 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <div className="text-xs font-bold uppercase" style={{ color: 'var(--fs-accent-text)' }}>
                  Ear Check ({toneQuizIdx + 1} / {STAGE0_TONE_QUIZ.length} · Score: {toneCorrectCount})
                </div>
                <div className="text-base font-bold" style={{ color: 'var(--fs-text)' }}>
                  Listen to the syllable and pick which tone you hear: {activeToneQ.displayMasked}
                </div>
              </div>
              <div className="flex gap-2">
                <StylusButton variant="primary" onClick={() => onSpeak?.(activeToneQ.promptAudio, 0.9)}><span>Play Normal</span></StylusButton>
                <StylusButton variant="secondary" onClick={() => onSpeak?.(activeToneQ.promptAudio, 0.65)}><span>Play Slow</span></StylusButton>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {([1, 2, 3, 4] as const).map((t) => (
                <StylusButton
                  key={t}
                  variant={toneSelected === t ? (t === activeToneQ.answerTone ? 'primary' : 'danger') : 'secondary'}
                  onClick={() => {
                    if (toneSelected === null && t === activeToneQ.answerTone) setToneCorrectCount((c) => c + 1);
                    setToneSelected(t);
                  }}
                >
                  <span>Tone {t} ({t === 1 ? 'High' : t === 2 ? 'Rising' : t === 3 ? 'Low' : 'Drop'})</span>
                </StylusButton>
              ))}
            </div>

            {toneSelected !== null && (
              <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                <div className="text-sm font-semibold" style={{ color: toneSelected === activeToneQ.answerTone ? 'var(--fs-accent-text)' : 'var(--fs-danger)' }}>
                  {toneSelected === activeToneQ.answerTone ? '✓ Correct! ' : 'Not quite — '}
                  {activeToneQ.revealChar} ({activeToneQ.revealZhuyin} / {activeToneQ.revealPinyin}) = {activeToneQ.revealEnglish}
                </div>
                <StylusButton variant="secondary" onClick={() => { setToneSelected(null); setToneQuizIdx((i) => (i + 1) % STAGE0_TONE_QUIZ.length); }}>
                  <span>Next Audio Clip →</span>
                </StylusButton>
              </div>
            )}
          </div>

          <div className="flex justify-end">
            <StylusButton variant="primary" onClick={() => completeModule('0.1')}><span>Complete Module 0.1 &amp; Continue to Zhuyin →</span></StylusButton>
          </div>
        </section>
      )}

      {/* MODULE 0.2: ZHUYIN SOUND MAP & SYLLABLE BLENDER */}
      {activeMod === '0.2' && (
        <section className="fs-card p-6 space-y-6">
          <div className="space-y-1">
            <h2 className="text-xl font-bold" style={{ color: 'var(--fs-text)' }}>0.2 Zhuyin (ㄅㄆㄇㄈ) Sound Map · All 37 Taiwanese Phonetic Symbols</h2>
            <p className="text-sm" style={{ color: 'var(--fs-text-secondary)' }}>
              Zhuyin is Taiwan’s phonetic alphabet printed beside Traditional characters. Tap any symbol to hear its sound and read the English cue.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {STAGE0_ZHUYIN_FAMILIES.map((fam, idx) => (
              <StylusButton
                key={fam.id}
                variant={familyIdx === idx ? 'primary' : 'secondary'}
                onClick={() => {
                  setFamilyIdx(idx);
                  setBlendIdx(0);
                }}
              >
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
                  <span
                    className="px-2 py-0.5 rounded-full text-[11px] font-mono font-bold whitespace-nowrap shrink-0"
                    style={{ backgroundColor: 'var(--fs-surface)', color: 'var(--fs-text)' }}
                  >
                    {sym.pinyin}
                  </span>
                </div>
                <div className="text-sm font-bold" style={{ color: 'var(--fs-text)' }}>{sym.englishCue}</div>
                <div className="text-xs" style={{ color: 'var(--fs-text-secondary)' }}>{sym.mouthTip}</div>
              </button>
            ))}
          </div>

          {/* Interactive Family-Specific Syllable Blender */}
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

          <div className="flex justify-end">
            <StylusButton variant="primary" onClick={() => completeModule('0.2')}><span>Complete Module 0.2 &amp; Continue to Grammar →</span></StylusButton>
          </div>
        </section>
      )}

      {/* MODULE 0.3: ENGLISH -> MANDARIN GRAMMAR SURVIVAL MAP */}
      {activeMod === '0.3' && (
        <section className="fs-card p-6 space-y-6">
          <div className="space-y-1">
            <h2 className="text-xl font-bold" style={{ color: 'var(--fs-text)' }}>0.3 English → Mandarin Grammar Survival Map</h2>
            <p className="text-sm" style={{ color: 'var(--fs-text-secondary)' }}>
              Good news: Mandarin grammar is far simpler than European languages. Master these 5 word-order rules and avoid the #1 beginner mistake:
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
                <div className="text-xs font-bold uppercase" style={{ color: 'var(--fs-accent-text)' }}>Sentence Builder ({puzzleIdx + 1} / {STAGE0_SENTENCE_PUZZLES.length})</div>
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
                        if (ok) onSpeak?.(next.join(''), 0.85);
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

          <div className="flex justify-end">
            <StylusButton variant="primary" onClick={() => completeModule('0.3')}><span>Complete Module 0.3 &amp; Continue to Strokes →</span></StylusButton>
          </div>
        </section>
      )}

      {/* MODULE 0.4: BASIC STROKES & CHARACTER LOGIC 101 */}
      {activeMod === '0.4' && (
        <section className="fs-card p-6 space-y-6">
          <div className="space-y-1">
            <h2 className="text-xl font-bold" style={{ color: 'var(--fs-text)' }}>0.4 Basic Strokes &amp; Character Logic 101</h2>
            <p className="text-sm" style={{ color: 'var(--fs-text-secondary)' }}>
              Practice each of the 8 fundamental strokes individually, learn the 6 stroke-order rules, and see how radicals unlock character meanings.
            </p>
          </div>

          <BasicStrokePracticePad />

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
                Ready to combine strokes into real words? Tap any starter character to open it on the Wacom Calligraphy Studio:
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

          {/* Instructive Radical Building-Block Legend + Meaning Check */}
          <div className="fs-subtle-box p-5 space-y-4">
            <div className="space-y-1">
              <div className="text-sm font-bold" style={{ color: 'var(--fs-text)' }}>
                How Characters Encode Meaning · 5 High-Frequency Building Blocks (Radicals)
              </div>
              <p className="text-xs" style={{ color: 'var(--fs-text-secondary)' }}>
                Chinese characters aren’t random drawings: the left/top part usually gives a <strong>meaning category</strong> (radical). Study these 5 keys, then test yourself below:
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
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="text-xs font-bold uppercase" style={{ color: 'var(--fs-accent-text)' }}>Building Blocks: {q.breakdown}</div>
                        <div className="text-3xl font-bold mt-0.5" style={{ color: 'var(--fs-text)' }}>{q.char}</div>
                      </div>
                      <span className="text-xs font-semibold px-2 py-1 rounded-lg" style={{ backgroundColor: 'var(--fs-subtle)', color: 'var(--fs-accent-text)' }}>
                        Key: {q.radical}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {q.options.map((opt, idx) => (
                        <StylusButton
                          key={opt}
                          variant={picked === idx ? (idx === q.correctIdx ? 'primary' : 'danger') : 'secondary'}
                          onClick={() => {
                            setRadicalAnswers((prev) => ({ ...prev, [q.id]: idx }));
                            onSpeak?.(q.char, 0.82);
                          }}
                        >
                          <span>{opt}</span>
                        </StylusButton>
                      ))}
                    </div>
                    {picked !== undefined && (
                      <div className="fs-subtle-box p-3 space-y-2">
                        <div className="flex items-center justify-between gap-3">
                          <div className="flex items-center gap-3">
                            <RubyText text={q.char} zhuyin={q.zhuyin} pinyin={q.pinyin} showPinyinHint size="md" zhuyinDisplayMode="always" />
                            <div>
                              <div className="text-sm font-bold" style={{ color: picked === q.correctIdx ? 'var(--fs-accent-text)' : 'var(--fs-warm)' }}>
                                {picked === q.correctIdx ? '✓ Correct: ' : 'Answer: '}
                                {q.char} ({q.zhuyin} / {q.pinyin}) = "{q.meaningEn}"
                              </div>
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

          <div className="flex justify-end">
            <StylusButton variant="primary" onClick={() => completeModule('0.4')}><span>Complete Module 0.4 &amp; Continue to Taipei Phrases →</span></StylusButton>
          </div>
        </section>
      )}

      {/* MODULE 0.5: FIRST 10 TAIPEI PHRASES & CAFÉ ROLEPLAY */}
      {activeMod === '0.5' && (
        <section className="fs-card p-6 space-y-6">
          <div className="space-y-1">
            <h2 className="text-xl font-bold" style={{ color: 'var(--fs-text)' }}>0.5 Your First 10 Taipei Survival Phrases &amp; Mini Café Roleplay</h2>
            <p className="text-sm" style={{ color: 'var(--fs-text-secondary)' }}>
              With just these 10 authentic Taiwan phrases, you can greet people, order food, and navigate Taipei politely on Day 1.
            </p>
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

          {/* 3-Turn Taipei Café Roleplay */}
          <div className="fs-subtle-box p-5 space-y-3">
            <div className="text-sm font-bold" style={{ color: 'var(--fs-text)' }}>Mini Taipei Café Roleplay · Hear the Clerk &amp; Pick Your Reply:</div>
            <div className="space-y-3">
              {STAGE0_CAFE_ROLEPLAY.map((turn, idx) => {
                const picked = roleplayAnswers[idx];
                return (
                  <div key={idx} className="fs-card p-4 space-y-2.5">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div>
                        <div className="text-base font-bold" style={{ color: 'var(--fs-text)' }}>Clerk: {turn.clerkZh}</div>
                        <div className="text-xs" style={{ color: 'var(--fs-text-secondary)' }}>{turn.clerkPinyin} — "{turn.clerkEn}"</div>
                      </div>
                      <StylusButton variant="secondary" onClick={() => onSpeak?.(turn.clerkZh, 0.82)}><span>Hear Clerk</span></StylusButton>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {turn.options.map((opt, oIdx) => (
                        <StylusButton
                          key={opt.text}
                          variant={picked === oIdx ? (oIdx === turn.correctIdx ? 'primary' : 'danger') : 'secondary'}
                          onClick={() => { setRoleplayAnswers((prev) => ({ ...prev, [idx]: oIdx })); onSpeak?.(opt.text, 0.88); }}
                        >
                          <span>{opt.text} ({opt.en})</span>
                        </StylusButton>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex justify-end">
            <StylusButton variant="primary" onClick={() => completeModule('0.5')}><span>Finish Stage 0 &amp; Begin Stage 1 →</span></StylusButton>
          </div>
        </section>
      )}
    </div>
  );
};
