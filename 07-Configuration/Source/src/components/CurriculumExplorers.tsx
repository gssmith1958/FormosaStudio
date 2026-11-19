/**
 * FormosaStudio (FORM) — Interactive Pimsleur 1–19+ Recall Player, NTNU Vols. 1–6 Lesson View & TOCFL Readiness
 * Upgrades static reference lists into interactive audio-first lessons with Slow/Normal playback,
 * Hide-Text mode, 4-second Timed Anticipation Recall Drills, and Pinyin+Zhuyin training wheels (FORM-LL-009).
 */

import React, { useEffect, useMemo, useState } from 'react';
import { PimsleurUnitData } from '../data/pimsleurUnitsA.ts';
import { ContemporaryVolumeOverview } from '../data/contemporaryVols1to2.ts';
import { VocabularyEntry } from '../data/vocabularyCatalog.ts';
import {
  UserProgressState,
  recordWordPractice,
  toggleNtnuLessonComplete,
  togglePimsleurUnitComplete,
} from '../lib/progressStore.ts';
import { setFocusedContextItem } from '../lib/studioContextBus.ts';
import { CrossStudioActionPills, StylusButton } from './uiPrimitives.tsx';
import { RubyText } from './RubyText.tsx';

export const PimsleurExplorerView: React.FC<{
  units: PimsleurUnitData[];
  selectedUnit: number;
  onSelectUnit: (unit: number) => void;
  progress: UserProgressState;
  onUpdateProgress: (next: UserProgressState) => void;
  onSpeak?: (text: string, rate?: number) => void;
}> = ({ units, selectedUnit, onSelectUnit, progress, onUpdateProgress, onSpeak }) => {
  const activeUnit = units.find((u) => u.unit === selectedUnit) || units[0];
  const completedSet = new Set(progress.completedPimsleurUnits || []);
  const isDone = completedSet.has(activeUnit.unit);

  const [audioFirstHideText, setAudioFirstHideText] = useState<boolean>(false);
  const [recallMode, setRecallMode] = useState<boolean>(false);
  const [recallIdx, setRecallIdx] = useState<number>(0);
  const [countdown, setCountdown] = useState<number>(4);
  const [recallRevealed, setRecallRevealed] = useState<boolean>(false);

  const recallItems = activeUnit.dialogues.length > 0 ? activeUnit.dialogues : [];
  const activeRecall = recallItems[recallIdx % Math.max(1, recallItems.length)];

  useEffect(() => {
    setRecallIdx(0);
    setRecallRevealed(false);
    setCountdown(4);
  }, [activeUnit.unit, recallMode]);

  useEffect(() => {
    if (!recallMode || recallRevealed || countdown <= 0) return;
    const id = window.setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => window.clearTimeout(id);
  }, [recallMode, recallRevealed, countdown]);

  const handleRateRecall = (gotIt: boolean) => {
    if (activeRecall) {
      onUpdateProgress(
        recordWordPractice(
          { ...progress, xp: progress.xp + (gotIt ? 10 : 4) },
          { word: activeRecall.traditional.slice(0, 10), zhuyin: activeRecall.zhuyin, english: activeRecall.english },
          gotIt,
          gotIt ? 4 : 2
        )
      );
    }
    setRecallRevealed(false);
    setCountdown(4);
    if (recallIdx + 1 >= recallItems.length) {
      if (!isDone) onUpdateProgress(togglePimsleurUnitComplete(progress, activeUnit.unit));
      setRecallMode(false);
    } else {
      setRecallIdx((i) => i + 1);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      <div className="lg:col-span-4 fs-card p-5 space-y-3 max-h-[680px] overflow-y-auto">
        <h2 className="text-base font-bold" style={{ color: 'var(--fs-text)' }}>
          Pimsleur Units ({completedSet.size}/{units.length} complete)
        </h2>
        <div className="space-y-2">
          {units.map((u) => {
            const selected = u.unit === activeUnit.unit;
            const done = completedSet.has(u.unit);
            return (
              <button
                key={u.unit}
                type="button"
                onClick={() => onSelectUnit(u.unit)}
                style={{
                  minHeight: '50px',
                  backgroundColor: selected ? 'var(--fs-accent-soft)' : 'var(--fs-subtle)',
                  borderColor: selected ? 'var(--fs-accent-border)' : 'var(--fs-border)',
                }}
                className="w-full px-3.5 py-2.5 rounded-xl border text-left transition flex items-center justify-between gap-2"
              >
                <div className="min-w-0">
                  <div className="text-sm font-bold truncate" style={{ color: 'var(--fs-text)' }}>
                    {u.title.startsWith(`Unit ${u.unit}`) ? u.title : `Unit ${u.unit} · ${u.title}`}
                  </div>
                  <div className="text-xs truncate" style={{ color: 'var(--fs-text-secondary)' }}>
                    {u.subtitle}
                  </div>
                </div>
                {done && (
                  <span className="text-xs font-bold shrink-0" style={{ color: 'var(--fs-accent-text)' }}>
                    ✓ Done
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      <div className="lg:col-span-8 fs-card p-6 space-y-6">
        <div className="flex flex-wrap items-start justify-between gap-4 border-b pb-4" style={{ borderColor: 'var(--fs-border)' }}>
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--fs-accent-text)' }}>
              Pimsleur Taiwanese Mandarin · Unit {activeUnit.unit}
            </div>
            <h2 className="text-2xl font-bold" style={{ color: 'var(--fs-text)' }}>
              {activeUnit.title}
            </h2>
            <p className="text-sm" style={{ color: 'var(--fs-text-secondary)' }}>
              {activeUnit.subtitle}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <StylusButton variant={recallMode ? 'primary' : 'secondary'} onClick={() => setRecallMode((r) => !r)}>
              <span>{recallMode ? 'Exit Recall Drill' : 'Start Timed Recall Drill'}</span>
            </StylusButton>
            <StylusButton
              variant={isDone ? 'secondary' : 'ghost'}
              onClick={() => onUpdateProgress(togglePimsleurUnitComplete(progress, activeUnit.unit))}
            >
              <span>{isDone ? '✓ Completed' : 'Mark Complete'}</span>
            </StylusButton>
          </div>
        </div>

        {/* Interactive 4-Second Pimsleur Anticipation Recall Mode */}
        {recallMode && activeRecall && (
          <div className="fs-subtle-box p-6 space-y-4">
            <div className="flex items-center justify-between text-xs font-bold uppercase" style={{ color: 'var(--fs-accent-text)' }}>
              <span>Active Recall Prompt {recallIdx + 1} of {recallItems.length}</span>
              <span>{recallRevealed ? 'Compare with Native Audio' : countdown > 0 ? `Speak aloud in ${countdown}s…` : 'Time to check!'}</span>
            </div>
            <div className="text-xl font-bold" style={{ color: 'var(--fs-text)' }}>
              How do you say: "{activeRecall.english}"
            </div>
            {recallRevealed ? (
              <div className="fs-card p-5 space-y-4">
                <RubyText
                  text={activeRecall.traditional}
                  zhuyin={activeRecall.zhuyin}
                  pinyin={activeRecall.pinyin}
                  showPinyinHint={progress.showPinyinHint}
                  size="lg"
                  zhuyinDisplayMode="always"
                />
                <div className="flex flex-wrap gap-2">
                  <StylusButton variant="secondary" onClick={() => onSpeak?.(activeRecall.traditional, 0.92)}>
                    <span>Normal Audio</span>
                  </StylusButton>
                  <StylusButton variant="ghost" onClick={() => onSpeak?.(activeRecall.traditional, 0.65)}>
                    <span>Slow (0.65x)</span>
                  </StylusButton>
                  <StylusButton variant="amber" onClick={() => handleRateRecall(false)}>
                    <span>Needs Practice</span>
                  </StylusButton>
                  <StylusButton variant="primary" onClick={() => handleRateRecall(true)}>
                    <span>Got It → Next</span>
                  </StylusButton>
                </div>
              </div>
            ) : (
              <StylusButton
                variant="primary"
                onClick={() => {
                  setRecallRevealed(true);
                  onSpeak?.(activeRecall.traditional, 0.9);
                }}
              >
                <span>Reveal Answer &amp; Hear Native Audio</span>
              </StylusButton>
            )}
          </div>
        )}

        <div className="space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h3 className="text-sm font-bold uppercase tracking-wider" style={{ color: 'var(--fs-text-secondary)' }}>
              Audio-First Dialogues ({activeUnit.dialogues.length})
            </h3>
            <StylusButton variant={audioFirstHideText ? 'primary' : 'ghost'} onClick={() => setAudioFirstHideText((h) => !h)}>
              <span>{audioFirstHideText ? 'Show Chinese Text' : 'Hide Text (Listen Only)'}</span>
            </StylusButton>
          </div>
          {activeUnit.dialogues.map((d, i) => (
            <div key={i} className="fs-subtle-box p-4 flex flex-wrap items-center justify-between gap-3">
              <div className="space-y-1.5">
                {audioFirstHideText ? (
                  <div className="text-sm italic" style={{ color: 'var(--fs-text-muted)' }}>
                    (Text hidden for ear training — listen first, then toggle Show Text)
                  </div>
                ) : (
                  <RubyText
                    text={d.traditional}
                    zhuyin={d.zhuyin}
                    pinyin={d.pinyin}
                    showPinyinHint={progress.showPinyinHint}
                    size="md"
                    zhuyinDisplayMode={progress.zhuyinDisplayMode}
                    charMastery={progress.charMastery}
                  />
                )}
                <div className="text-sm font-medium" style={{ color: 'var(--fs-text-secondary)' }}>
                  {d.english}
                </div>
              </div>
              <div className="flex gap-1.5 shrink-0">
                <StylusButton variant="secondary" onClick={() => onSpeak?.(d.traditional, 0.92)}>
                  <span>Normal</span>
                </StylusButton>
                <StylusButton variant="ghost" onClick={() => onSpeak?.(d.traditional, 0.65)}>
                  <span>Slow</span>
                </StylusButton>
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-3">
          <h3 className="text-sm font-bold uppercase tracking-wider" style={{ color: 'var(--fs-text-secondary)' }}>
            Core Vocabulary ({activeUnit.vocab.length})
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {activeUnit.vocab.map((v, i) => (
              <div key={i} className="fs-subtle-box p-4 space-y-2.5">
                <div className="flex items-start justify-between gap-2">
                  <RubyText
                    text={v.traditional}
                    zhuyin={v.zhuyin}
                    pinyin={v.pinyin}
                    showPinyinHint={progress.showPinyinHint}
                    size="md"
                    zhuyinDisplayMode="always"
                  />
                  <StylusButton variant="ghost" onClick={() => onSpeak?.(v.traditional, 0.85)}>
                    <span>Listen</span>
                  </StylusButton>
                </div>
                <div className="text-sm font-medium" style={{ color: 'var(--fs-text)' }}>
                  {v.english}
                </div>
                <CrossStudioActionPills
                  targetText={v.traditional}
                  targetZhuyin={v.zhuyin}
                  targetEnglish={v.english}
                  sourceStudio="hub"
                  sourceLabel={`Pimsleur Unit ${activeUnit.unit}`}
                  onBoostSrs={() => {
                    onUpdateProgress(
                      recordWordPractice(progress, { word: v.traditional, zhuyin: v.zhuyin, english: v.english }, true, 3)
                    );
                    setFocusedContextItem({
                      text: v.traditional,
                      zhuyin: v.zhuyin,
                      english: v.english,
                      sourceStudio: 'hub',
                      sourceLabel: `Pimsleur Unit ${activeUnit.unit}`,
                    });
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export const NtnuExplorerView: React.FC<{
  volumes: ContemporaryVolumeOverview[];
  selectedVolume: number;
  selectedLesson: number;
  onSelectVolume: (vol: number, firstLesson: number) => void;
  onSelectLesson: (lesson: number) => void;
  progress: UserProgressState;
  onUpdateProgress: (next: UserProgressState) => void;
  onSpeak?: (text: string, rate?: number) => void;
}> = ({
  volumes,
  selectedVolume,
  selectedLesson,
  onSelectVolume,
  onSelectLesson,
  progress,
  onUpdateProgress,
  onSpeak,
}) => {
  const activeVolume = volumes.find((v) => v.volume === selectedVolume) || volumes[0];
  const activeLesson = activeVolume.lessons.find((l) => l.lesson === selectedLesson) || activeVolume.lessons[0];
  const completedSet = new Set(progress.completedNtnuLessons || []);
  const lessonKey = `${activeVolume.volume}-${activeLesson.lesson}`;
  const isDone = completedSet.has(lessonKey);
  const [queuedNotice, setQueuedNotice] = useState<string | null>(null);
  const [quizChoice, setQuizChoice] = useState<number | null>(null);

  useEffect(() => {
    setQueuedNotice(null);
    setQuizChoice(null);
  }, [lessonKey]);

  const lessonVocab = activeLesson.keyVocab || [];
  const quizTarget = lessonVocab[0];
  const quizOptions = useMemo(() => {
    if (!quizTarget) return [];
    const distractors = activeVolume.lessons
      .flatMap((l) => l.keyVocab || [])
      .filter((v) => v.traditional !== quizTarget.traditional)
      .slice(0, 2);
    return [quizTarget, ...distractors];
  }, [quizTarget, activeVolume]);

  const handleQueueAllLessonVocab = () => {
    let next = progress;
    for (const item of lessonVocab) {
      next = recordWordPractice(next, { word: item.traditional, zhuyin: item.zhuyin, english: item.english }, true, 2);
    }
    onUpdateProgress(next);
    setQueuedNotice(`Added ${lessonVocab.length} lesson words into your daily FSRS study queue!`);
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap gap-2">
        {volumes.map((vol) => (
          <StylusButton
            key={vol.volume}
            variant={vol.volume === activeVolume.volume ? 'primary' : 'secondary'}
            onClick={() => onSelectVolume(vol.volume, vol.lessons[0]?.lesson || 1)}
          >
            <span>Vol. {vol.volume} ({vol.cefrRange} · {vol.lessons.length} Lessons)</span>
          </StylusButton>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-4 fs-card p-5 space-y-2 max-h-[620px] overflow-y-auto">
          <div className="text-base font-bold pb-1" style={{ color: 'var(--fs-text)' }}>
            {activeVolume.titleTraditional} · {activeVolume.tocflBand}
          </div>
          {activeVolume.lessons.map((l) => {
            const key = `${activeVolume.volume}-${l.lesson}`;
            const done = completedSet.has(key);
            const selected = l.lesson === activeLesson.lesson;
            return (
              <button
                key={l.lesson}
                type="button"
                onClick={() => onSelectLesson(l.lesson)}
                style={{
                  minHeight: '50px',
                  backgroundColor: selected ? 'var(--fs-accent-soft)' : 'var(--fs-subtle)',
                  borderColor: selected ? 'var(--fs-accent-border)' : 'var(--fs-border)',
                }}
                className="w-full px-3.5 py-2.5 rounded-xl border text-left transition flex items-center justify-between gap-2"
              >
                <div className="min-w-0">
                  <div className="text-sm font-bold truncate" style={{ color: 'var(--fs-text)' }}>
                    L{l.lesson}: {l.titleTraditional}
                  </div>
                  <div className="text-xs truncate" style={{ color: 'var(--fs-text-secondary)' }}>
                    {l.titleEnglish}
                  </div>
                </div>
                {done && (
                  <span className="text-xs font-bold shrink-0" style={{ color: 'var(--fs-accent-text)' }}>
                    ✓
                  </span>
                )}
              </button>
            );
          })}
        </div>

        <div className="lg:col-span-8 fs-card p-6 space-y-5">
          <div className="flex flex-wrap items-start justify-between gap-4 border-b pb-4" style={{ borderColor: 'var(--fs-border)' }}>
            <div className="space-y-1.5">
              <div className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--fs-accent-text)' }}>
                NTNU Contemporary Chinese · Vol. {activeVolume.volume} Lesson {activeLesson.lesson}
              </div>
              <RubyText
                text={activeLesson.titleTraditional}
                zhuyin={activeLesson.titleZhuyin}
                showPinyinHint={progress.showPinyinHint}
                size="lg"
                zhuyinDisplayMode="always"
              />
              <div className="text-base font-medium" style={{ color: 'var(--fs-text-secondary)' }}>
                {activeLesson.titleEnglish}
              </div>
            </div>
            <StylusButton
              variant={isDone ? 'secondary' : 'primary'}
              onClick={() => onUpdateProgress(toggleNtnuLessonComplete(progress, lessonKey))}
            >
              <span>{isDone ? '✓ Lesson Completed' : 'Mark Lesson Complete'}</span>
            </StylusButton>
          </div>

          <div className="fs-subtle-box p-4 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--fs-accent-text)' }}>
                Dialogue &amp; Listening Practice
              </div>
              <div className="flex gap-1.5">
                <StylusButton variant="secondary" onClick={() => onSpeak?.(activeLesson.sampleSentence.traditional, 0.92)}>
                  <span>Normal Audio</span>
                </StylusButton>
                <StylusButton variant="ghost" onClick={() => onSpeak?.(activeLesson.sampleSentence.traditional, 0.65)}>
                  <span>Slow (0.65x)</span>
                </StylusButton>
              </div>
            </div>
            <RubyText
              text={activeLesson.sampleSentence.traditional}
              zhuyin={activeLesson.sampleSentence.zhuyin}
              showPinyinHint={progress.showPinyinHint}
              size="md"
              zhuyinDisplayMode={progress.zhuyinDisplayMode}
              charMastery={progress.charMastery}
            />
            <div className="text-sm font-medium" style={{ color: 'var(--fs-text-secondary)' }}>
              {activeLesson.sampleSentence.english}
            </div>
          </div>

          <div className="space-y-2.5">
            <h3 className="text-sm font-bold uppercase tracking-wider" style={{ color: 'var(--fs-text-secondary)' }}>
              Grammar Patterns in This Lesson
            </h3>
            {activeLesson.grammarPoints.map((g, idx) => (
              <div key={idx} className="fs-subtle-box px-4 py-3 text-[15px]" style={{ color: 'var(--fs-text)' }}>
                {idx + 1}. {g}
              </div>
            ))}
          </div>

          {lessonVocab.length > 0 && (
            <div className="space-y-2.5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 className="text-sm font-bold uppercase tracking-wider" style={{ color: 'var(--fs-text-secondary)' }}>
                  Key Vocabulary ({lessonVocab.length})
                </h3>
                <StylusButton variant="secondary" onClick={handleQueueAllLessonVocab}>
                  <span>Add All to FSRS Queue</span>
                </StylusButton>
              </div>
              {queuedNotice && <div className="text-xs font-semibold" style={{ color: 'var(--fs-accent-text)' }}>{queuedNotice}</div>}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {lessonVocab.map((item, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      onSpeak?.(item.traditional, 0.85);
                      setFocusedContextItem({
                        text: item.traditional,
                        zhuyin: item.zhuyin,
                        english: item.english,
                        sourceStudio: 'hub',
                        sourceLabel: `NTNU V${activeVolume.volume} L${activeLesson.lesson}`,
                      });
                    }}
                    className="fs-subtle-box p-3 text-left flex items-center justify-between gap-2"
                  >
                    <RubyText text={item.traditional} zhuyin={item.zhuyin} pinyin={item.pinyin} showPinyinHint={progress.showPinyinHint} size="sm" zhuyinDisplayMode="always" nonInteractive />
                    <span className="text-sm font-medium text-right" style={{ color: 'var(--fs-text-secondary)' }}>{item.english}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {quizTarget && quizOptions.length >= 2 && (
            <div className="fs-subtle-box p-4 space-y-2.5">
              <div className="text-xs font-bold uppercase" style={{ color: 'var(--fs-accent-text)' }}>
                Quick Lesson Check · What does 「{quizTarget.traditional}」 ({quizTarget.pinyin}) mean?
              </div>
              <div className="flex flex-wrap gap-2">
                {quizOptions.map((opt, idx) => (
                  <StylusButton
                    key={opt.traditional}
                    variant={quizChoice === idx ? (idx === 0 ? 'primary' : 'danger') : 'secondary'}
                    onClick={() => {
                      setQuizChoice(idx);
                      onSpeak?.(quizTarget.traditional, 0.85);
                    }}
                  >
                    <span>{opt.english}</span>
                  </StylusButton>
                ))}
              </div>
            </div>
          )}

          {activeLesson.culturalNote && (
            <div className="fs-subtle-box p-4 text-sm leading-relaxed" style={{ color: 'var(--fs-text-secondary)' }}>
              <strong style={{ color: 'var(--fs-text)' }}>Taiwan Cultural Note:</strong> {activeLesson.culturalNote}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export const TocflReadinessView: React.FC<{
  catalog: VocabularyEntry[];
  progress: UserProgressState;
}> = ({ catalog, progress }) => {
  const stats = useMemo(() => {
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
      const mastered = items.filter((c) => (progress.wordMastery[c.traditional]?.level ?? 0) >= 2).length;
      const pct = items.length > 0 ? Math.round((mastered / items.length) * 100) : 0;
      return { band, total: items.length, mastered, pct };
    });
  }, [catalog, progress.wordMastery]);

  return (
    <div className="fs-card p-6 space-y-5">
      <div>
        <h2 className="text-xl font-bold" style={{ color: 'var(--fs-text)' }}>
          TOCFL Readiness · Novice 1 through Band B2
        </h2>
        <p className="text-sm" style={{ color: 'var(--fs-text-secondary)' }}>
          Words reach mastery (Level 2+) automatically as you practice them in Stage 0, Today’s Session, Reader, Survival, Speaking, or Vocab SRS.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {stats.map((st) => (
          <div key={st.band} className="fs-subtle-box p-5 space-y-3">
            <div className="flex items-center justify-between">
              <div className="text-base font-bold" style={{ color: 'var(--fs-text)' }}>{st.band}</div>
              <span className="text-base font-bold" style={{ color: 'var(--fs-accent-text)' }}>{st.pct}%</span>
            </div>
            <div className="w-full h-2.5 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--fs-surface)' }}>
              <div className="h-full rounded-full transition-all" style={{ width: `${st.pct}%`, backgroundColor: 'var(--fs-accent)' }} />
            </div>
            <div className="text-xs font-medium" style={{ color: 'var(--fs-text-secondary)' }}>
              {st.mastered} of {st.total} catalog words mastered
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
