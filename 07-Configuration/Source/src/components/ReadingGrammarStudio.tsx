/**
 * FormosaStudio (FORM) — Studio 3: Reader & Grammar Studio (閱讀語法)
 * Integrates:
 * 1. Adaptive i+1 Graded Reader across TOCFL Bands Novice 1 – B2 (FORM-REQ-0006)
 * 2. Custom Traditional Chinese Text Importer & Instant Cloze Generator (FORM-REQ-0007)
 * 3. Spoken vs. Written Taiwan Register Bridge (口語 vs. 書面語) (FORM-REQ-0008)
 * Built on Phase 1 Shared UI Primitives, Vertical RubyText, and StudioContextBus (FORM-REQ-0021).
 */

import React, { useEffect, useMemo, useState } from 'react';
import {
  CrossStudioActionPills,
  StudioHeaderBanner,
  StudioModeSwitcher,
  StylusButton,
  ToneBadge,
} from './uiPrimitives.tsx';
import { RubyText } from './RubyText.tsx';
import {
  GRADED_STORIES,
  REGISTER_BRIDGE_PAIRS,
  GradedStory,
} from '../data/gradedStoriesData.ts';
import {
  AnalyzedWordSegment,
  analyzePassageComprehensibility,
  generatePassageClozes,
} from '../lib/readingEngine.ts';
import {
  UserProgressState,
  recordWordPractice,
} from '../lib/progressStore.ts';
import { getStudioBusState, setFocusedContextItem, subscribeStudioBus } from '../lib/studioContextBus.ts';
import { parseZhuyinSyllable } from '../lib/zhuyinTypes.ts';

export interface ReadingGrammarStudioProps {
  progress: UserProgressState;
  onUpdateProgress: (next: UserProgressState) => void;
  onSpeakText?: (text: string, rate?: number) => void;
  adminRevision?: number;
}

type ReaderSubMode = 'graded_reader' | 'custom_cloze' | 'register_bridge';

const DEFAULT_CUSTOM_SAMPLE =
  '今天下午我和朋友坐捷運去淡水看夕陽。我們在老街買了阿給和微糖溫豆漿，還在便利商店用悠遊卡付錢。聽到黃色垃圾車播放《給愛麗絲》的音樂時，附近的居民都出來倒垃圾，街道保持得非常乾淨。';

export const ReadingGrammarStudio: React.FC<ReadingGrammarStudioProps> = ({
  progress,
  onUpdateProgress,
  onSpeakText,
  adminRevision = 0,
}) => {
  const [subMode, setSubMode] = useState<ReaderSubMode>('graded_reader');
  const [selectedStoryId, setSelectedStoryId] = useState<string>(GRADED_STORIES[0].id);
  const [selectedWord, setSelectedWord] = useState<AnalyzedWordSegment | null>(null);
  const [showEnglishTranslation, setShowEnglishTranslation] = useState<boolean>(true);
  const [storyQuizAnswers, setStoryQuizAnswers] = useState<Record<string, number>>({});

  // Custom Text Importer & Cloze state (FORM-REQ-0007)
  const [customText, setCustomText] = useState<string>(DEFAULT_CUSTOM_SAMPLE);
  const [clozeSelections, setClozeSelections] = useState<Record<string, number>>({});

  // Register Bridge state (FORM-REQ-0008)
  const [registerFilter, setRegisterFilter] = useState<string>('all');
  const [registerDrillAnswers, setRegisterDrillAnswers] = useState<Record<string, string>>({});

  // Consume incoming Cross-Studio Handoff focus item if dispatched from another studio (Pattern 21)
  useEffect(() => {
    const syncBus = () => {
      const bus = getStudioBusState();
      if (bus.activeHandoff?.toStudio === 'reader' && bus.activeHandoff.targetText) {
        const target = bus.activeHandoff.targetText;
        const matchStory = GRADED_STORIES.find((s) => s.paragraphs.some((p) => p.traditional.includes(target)));
        if (bus.activeHandoff.modeHint === 'custom_cloze' || !matchStory) {
          setSubMode('custom_cloze');
          setCustomText((prev) => (prev.includes(target) ? prev : `${target}。\n${prev}`));
        } else {
          setSelectedStoryId(matchStory.id);
        }
      }
    };
    syncBus();
    return subscribeStudioBus(syncBus);
  }, []);

  const activeStory: GradedStory = useMemo(
    () => GRADED_STORIES.find((s) => s.id === selectedStoryId) || GRADED_STORIES[0],
    [selectedStoryId]
  );

  const storyFullText = useMemo(
    () => activeStory.paragraphs.map((p) => p.traditional).join('\n'),
    [activeStory]
  );

  const storyReport = useMemo(() => analyzePassageComprehensibility(storyFullText, progress), [storyFullText, progress, adminRevision]);
  const customReport = useMemo(() => analyzePassageComprehensibility(customText, progress), [customText, progress, adminRevision]);
  const customClozes = useMemo(() => generatePassageClozes(customText, progress, 6), [customText, progress, adminRevision]);

  const filteredRegisterPairs = useMemo(
    () =>
      registerFilter === 'all'
        ? REGISTER_BRIDGE_PAIRS
        : REGISTER_BRIDGE_PAIRS.filter((p) => p.category === registerFilter),
    [registerFilter]
  );

  const handleInspectWord = (seg: AnalyzedWordSegment) => {
    setSelectedWord(seg);
    setFocusedContextItem({
      text: seg.text,
      zhuyin: seg.writtenZhuyin,
      spokenZhuyin: seg.spokenZhuyin,
      english: seg.englishGloss,
      charFocus: seg.text.slice(0, 1),
      sourceStudio: 'reader',
      sourceLabel: subMode === 'graded_reader' ? activeStory.titleTraditional : 'Custom Reader',
      moeNote: seg.moeInfo?.moeNote,
    });
  };

  const handleBoostWordMastery = (seg: AnalyzedWordSegment, rating: 3 | 4 = 3) => {
    const next = recordWordPractice(
      progress,
      {
        word: seg.text,
        zhuyin: seg.writtenZhuyin,
        english: seg.englishGloss || seg.text,
        chars: seg.chars
          .filter((c) => c.isChinese && c.zhuyin)
          .map((c) => ({ char: c.char, zhuyin: c.zhuyin!.normalized })),
      },
      true,
      rating
    );
    onUpdateProgress(next);
  };

  const firstSylTone = selectedWord?.chars[0]?.zhuyin
    ? selectedWord.chars[0].zhuyin.tone
    : selectedWord?.writtenZhuyin
    ? parseZhuyinSyllable(selectedWord.writtenZhuyin.split(/\s+/)[0]).tone
    : 1;

  return (
    <div className="space-y-5">
      <StudioHeaderBanner
        studioId="reader"
        titleZh="閱讀與語法工作室"
        titleEn="Adaptive i+1 Graded Reader, Custom Cloze Importer & Register Bridge"
        subtitle="Read Taiwan-set stories across TOCFL Novice 1 – Band B2, inspect any polyphone or sandhi word, and convert spoken 口語 to formal 書面語."
        rightSlot={
          <StudioModeSwitcher
            activeMode={subMode}
            onSelect={(m) => setSubMode(m as ReaderSubMode)}
            modes={[
              { id: 'graded_reader', labelZh: '分級閱讀', labelEn: 'i+1 Stories', badge: `${GRADED_STORIES.length}` },
              { id: 'custom_cloze', labelZh: '自訂文章與克漏字', labelEn: 'Custom & Cloze' },
              { id: 'register_bridge', labelZh: '口語 vs 書面語', labelEn: 'Register Bridge', badge: `${REGISTER_BRIDGE_PAIRS.length}` },
            ]}
          />
        }
      />

      {/* SUB-MODE 1: ADAPTIVE i+1 GRADED READER (FORM-REQ-0006) */}
      {subMode === 'graded_reader' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Story Selector Sidebar */}
          <div className="lg:col-span-4 space-y-2.5">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400 px-1">
              TOCFL Graded Stories (Novice 1 – Band B2)
            </div>
            {GRADED_STORIES.map((story) => {
              const rep = analyzePassageComprehensibility(
                story.paragraphs.map((p) => p.traditional).join(' '),
                progress
              );
              const isSelected = story.id === activeStory.id;
              return (
                <button
                  key={story.id}
                  type="button"
                  onClick={() => {
                    setSelectedStoryId(story.id);
                    setSelectedWord(null);
                  }}
                  style={{ minHeight: '56px', touchAction: 'manipulation' }}
                  className={`w-full text-left p-3.5 rounded-xl border transition-all ${
                    isSelected
                      ? 'bg-teal-950/60 border-teal-400 text-white shadow-md'
                      : 'bg-slate-900/80 border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-800 text-teal-300">
                      {story.cefr} · {story.tocflBand.split(' ')[0]}
                    </span>
                    <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${rep.zoneBadgeClass}`}>
                      {rep.comprehensibilityScore}% Known
                    </span>
                  </div>
                  <div className="font-bold text-base mt-1.5 text-white">{story.titleTraditional}</div>
                  <div className="text-xs text-slate-400">{story.titleEnglish}</div>
                </button>
              );
            })}
          </div>

          {/* Story Passage & Interactive Word Inspector */}
          <div className="lg:col-span-8 space-y-4">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
                <div>
                  <span className="text-xs font-semibold text-teal-400">{activeStory.locationTag}</span>
                  <h3 className="text-xl font-extrabold text-white mt-0.5">
                    {activeStory.titleTraditional} — {activeStory.titleEnglish}
                  </h3>
                </div>
                <div className="flex items-center gap-2">
                  <StylusButton
                    variant="secondary"
                    onClick={() => setShowEnglishTranslation((v) => !v)}
                  >
                    {showEnglishTranslation ? 'Hide English' : 'Show English'}
                  </StylusButton>
                  {onSpeakText && (
                    <StylusButton
                      variant="primary"
                      onClick={() => onSpeakText(storyFullText, 0.92)}
                    >
                      🔊 Read Aloud (zh-TW)
                    </StylusButton>
                  )}
                </div>
              </div>

              {/* Live i+1 Comprehensibility Bar */}
              <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-slate-950/80 border border-slate-800 px-3.5 py-2.5 text-xs">
                <span className={`px-2.5 py-1 rounded-full border font-bold ${storyReport.zoneBadgeClass}`}>
                  {storyReport.zoneLabel}
                </span>
                <div className="flex items-center gap-4 text-slate-300">
                  <span>
                    <strong className="text-emerald-300">{storyReport.knownPercentage}%</strong> Known (Lv.2+)
                  </span>
                  <span>
                    <strong className="text-sky-300">{storyReport.familiarPercentage}%</strong> Familiar (Lv.1)
                  </span>
                  <span>
                    <strong className="text-amber-300">{storyReport.targetIPlus1Percentage}%</strong> Target i+1 ({storyReport.targetIPlus1Count} words)
                  </span>
                  <span className="text-slate-500">FMM: {storyReport.elapsedMs} ms</span>
                </div>
              </div>

              {/* Story Paragraphs with Vertical Zhuyin Ruby & Clickable Word Segmentation */}
              <div className="space-y-4">
                {activeStory.paragraphs.map((para, pIdx) => {
                  const paraRep = analyzePassageComprehensibility(para.traditional, progress);
                  return (
                    <div
                      key={pIdx}
                      className="rounded-xl bg-slate-950/50 border border-slate-800/80 p-4 space-y-2.5"
                    >
                      <div className="flex flex-wrap items-center gap-1.5 leading-relaxed">
                        {paraRep.segments.map((seg, sIdx) => {
                          if (!seg.isChinese) {
                            return (
                              <span key={sIdx} className="text-xl text-slate-400 px-0.5">
                                {seg.text}
                              </span>
                            );
                          }
                          const isSelected = selectedWord?.text === seg.text;
                          const tierBorder =
                            seg.tier === 'target_i_plus_1'
                              ? 'border-amber-400/60 bg-amber-950/30'
                              : seg.isPolyphoneWord
                              ? 'border-teal-400/50 bg-teal-950/25'
                              : 'border-transparent hover:border-slate-700';

                          return (
                            <button
                              key={sIdx}
                              type="button"
                              onClick={() => handleInspectWord(seg)}
                              style={{ touchAction: 'manipulation' }}
                              className={`rounded-lg border px-1.5 py-1 transition-all ${tierBorder} ${
                                isSelected ? 'ring-2 ring-teal-400 bg-teal-900/40' : ''
                              }`}
                            >
                              <RubyText
                                text={seg.text}
                                zhuyin={seg.writtenZhuyin}
                                zhuyinDisplayMode={progress.zhuyinDisplayMode}
                                charMastery={progress.charMastery}
                                showPinyinHint={progress.showPinyinHint}
                                size="lg"
                                nonInteractive
                              />
                            </button>
                          );
                        })}
                      </div>
                      {showEnglishTranslation && (
                        <p className="text-sm text-slate-300 border-t border-slate-800/80 pt-2">
                          {para.english}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Word Inspector & Cross-Studio Action Pills (FORM-REQ-0006, FORM-REQ-0021) */}
              {selectedWord && (
                <div className="rounded-xl border border-teal-500/50 bg-teal-950/30 p-4 space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl font-extrabold text-white">{selectedWord.text}</span>
                      <span className="text-sm font-bold text-teal-300">
                        {selectedWord.writtenZhuyin}
                        {selectedWord.spokenZhuyin &&
                          selectedWord.spokenZhuyin !== selectedWord.writtenZhuyin && (
                            <span className="ml-2 text-amber-300">
                              (Spoken Sandhi: {selectedWord.spokenZhuyin})
                            </span>
                          )}
                      </span>
                      <ToneBadge tone={firstSylTone} compact />
                    </div>
                    <div className="flex items-center gap-2">
                      {onSpeakText && (
                        <StylusButton
                          variant="secondary"
                          onClick={() => onSpeakText(selectedWord.text, 0.85)}
                        >
                          🔊 Hear Word
                        </StylusButton>
                      )}
                      <StylusButton
                        variant="amber"
                        onClick={() => handleBoostWordMastery(selectedWord, 4)}
                      >
                        ⚡ Mark Known (+FSRS)
                      </StylusButton>
                    </div>
                  </div>
                  <div className="text-sm text-slate-200">
                    <strong>Meaning:</strong> {selectedWord.englishGloss || 'Contextual compound'}
                    {selectedWord.moeInfo && (
                      <span className="block mt-1 text-xs text-amber-200">
                        <strong>Taiwan MOE Note:</strong> {selectedWord.moeInfo.moeNote}
                      </span>
                    )}
                  </div>
                  <CrossStudioActionPills
                    sourceStudio="reader"
                    sourceLabel={activeStory.titleTraditional}
                    targetText={selectedWord.text}
                    targetZhuyin={selectedWord.writtenZhuyin}
                    targetEnglish={selectedWord.englishGloss}
                    onBoostSrs={() => handleBoostWordMastery(selectedWord, 3)}
                  />
                </div>
              )}

              {/* Story Comprehension Check */}
              <div className="border-t border-slate-800 pt-4 space-y-3">
                <h4 className="text-sm font-bold text-teal-300">
                  Comprehension & Taiwan MOE Check ({activeStory.questions.length})
                </h4>
                {activeStory.questions.map((q) => {
                  const chosen = storyQuizAnswers[q.id];
                  return (
                    <div key={q.id} className="rounded-xl bg-slate-950/60 border border-slate-800 p-3.5 space-y-2">
                      <div className="font-bold text-white text-sm">{q.questionTraditional}</div>
                      <div className="text-xs text-slate-400">{q.questionEnglish}</div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                        {q.options.map((opt, idx) => {
                          const isChosen = chosen === idx;
                          const isCorrect = idx === q.correctIndex;
                          return (
                            <StylusButton
                              key={idx}
                              variant={
                                isChosen
                                  ? isCorrect
                                    ? 'primary'
                                    : 'danger'
                                  : 'secondary'
                              }
                              onClick={() =>
                                setStoryQuizAnswers((prev) => ({ ...prev, [q.id]: idx }))
                              }
                            >
                              {opt}
                            </StylusButton>
                          );
                        })}
                      </div>
                      {chosen !== undefined && (
                        <div className="text-xs text-emerald-300 pt-1">{q.explanation}</div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUB-MODE 2: CUSTOM TEXT IMPORTER & INSTANT CLOZE GENERATOR (FORM-REQ-0007) */}
      {subMode === 'custom_cloze' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          <div className="lg:col-span-6 rounded-2xl border border-slate-800 bg-slate-900/90 p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-white">
                Custom Traditional Chinese Passage Importer
              </h3>
              <span className="text-xs font-semibold text-teal-300">
                Tokenized in {customReport.elapsedMs} ms (&lt; 50 ms budget)
              </span>
            </div>
            <textarea
              value={customText}
              onChange={(e) => {
                setCustomText(e.target.value);
                setClozeSelections({});
              }}
              rows={5}
              placeholder="Paste any Taiwan news, LINE message, menu, or textbook passage here..."
              className="w-full rounded-xl bg-slate-950 border border-slate-700 p-3 text-sm text-white focus:border-teal-400 focus:outline-none"
            />
            <div className="flex items-center justify-between text-xs">
              <span className={`px-2.5 py-1 rounded-full border font-bold ${customReport.zoneBadgeClass}`}>
                {customReport.zoneLabel}
              </span>
              <span className="text-slate-400">
                {customReport.totalChineseWords} segmented words · {customReport.targetWords.length} target i+1 / polyphone items
              </span>
            </div>
            <div className="rounded-xl bg-slate-950/70 border border-slate-800 p-4 flex flex-wrap items-center gap-1.5">
              {customReport.segments.map((seg, idx) =>
                seg.isChinese ? (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleInspectWord(seg)}
                    className="rounded-lg border border-slate-800 hover:border-teal-500/60 px-1.5 py-1"
                  >
                    <RubyText text={seg.text} zhuyin={seg.writtenZhuyin} zhuyinDisplayMode="always" size="md" nonInteractive />
                  </button>
                ) : (
                  <span key={idx} className="text-lg text-slate-400 px-0.5">{seg.text}</span>
                )
              )}
            </div>
          </div>

          <div className="lg:col-span-6 rounded-2xl border border-slate-800 bg-slate-900/90 p-5 space-y-4">
            <h3 className="text-lg font-bold text-white">
              Auto-Generated i+1 Sentence Cloze Drills ({customClozes.length})
            </h3>
            {customClozes.map((cloze) => {
              const selectedIdx = clozeSelections[cloze.id];
              return (
                <div key={cloze.id} className="rounded-xl bg-slate-950/80 border border-slate-800 p-4 space-y-2.5">
                  <div className="text-base font-bold text-white">{cloze.sentenceWithBlank}</div>
                  <div className="text-xs text-slate-400">
                    Target meaning: <strong className="text-teal-300">{cloze.targetEnglish}</strong>
                    {cloze.moeNote && <span className="ml-2 text-amber-300">({cloze.moeNote})</span>}
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {cloze.options.map((opt, oIdx) => {
                      const isChosen = selectedIdx === oIdx;
                      const isRight = oIdx === cloze.correctIndex;
                      return (
                        <StylusButton
                          key={oIdx}
                          variant={isChosen ? (isRight ? 'primary' : 'danger') : 'secondary'}
                          onClick={() => {
                            setClozeSelections((prev) => ({ ...prev, [cloze.id]: oIdx }));
                            if (isRight) {
                              onUpdateProgress(
                                recordWordPractice(
                                  progress,
                                  { word: cloze.targetWord, zhuyin: cloze.targetZhuyin, english: cloze.targetEnglish },
                                  true,
                                  3
                                )
                              );
                            }
                          }}
                        >
                          <span>{opt.traditional}</span>
                          <span className="text-xs opacity-80">({opt.zhuyin})</span>
                        </StylusButton>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* SUB-MODE 3: SPOKEN (口語) VS. WRITTEN (書面語) REGISTER BRIDGE (FORM-REQ-0008) */}
      {subMode === 'register_bridge' && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-slate-900/90 border border-slate-800 p-3.5">
            <span className="text-sm font-bold text-slate-200">
              Taiwan Spoken (口語) ↔ Formal Written (書面語) Register Bridge ({filteredRegisterPairs.length} pairs)
            </span>
            <div className="flex items-center gap-2">
              {(['all', 'connector', 'adverb', 'verb', 'preposition'] as const).map((cat) => (
                <StylusButton
                  key={cat}
                  variant={registerFilter === cat ? 'primary' : 'secondary'}
                  onClick={() => setRegisterFilter(cat)}
                >
                  {cat.toUpperCase()}
                </StylusButton>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredRegisterPairs.map((pair) => {
              const chosenAns = registerDrillAnswers[pair.id];
              return (
                <div key={pair.id} className="rounded-2xl border border-slate-800 bg-slate-900/90 p-4 space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-1 rounded-lg bg-amber-950/70 border border-amber-400/50 text-amber-200 font-bold text-sm">
                        口語: {pair.spoken} ({pair.spokenZhuyin})
                      </span>
                      <span className="text-slate-400 font-bold">→</span>
                      <span className="px-2.5 py-1 rounded-lg bg-teal-950/70 border border-teal-400/50 text-teal-200 font-bold text-sm">
                        書面語: {pair.written} ({pair.writtenZhuyin})
                      </span>
                    </div>
                    <span className="text-xs font-semibold text-slate-400">{pair.english}</span>
                  </div>

                  <div className="text-xs space-y-1 bg-slate-950/70 rounded-xl p-3 border border-slate-800">
                    <div className="text-amber-200"><strong>口語例句:</strong> {pair.spokenSentence}</div>
                    <div className="text-teal-200"><strong>書面例句:</strong> {pair.writtenSentence}</div>
                    <div className="text-slate-400">{pair.sentenceEnglish}</div>
                  </div>

                  <div className="space-y-2 pt-1">
                    <div className="text-xs font-bold text-slate-300">
                      Formal Register Drill: {pair.drillPromptTraditional}
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                      {pair.drillOptions.map((opt) => {
                        const isPicked = chosenAns === opt;
                        const isCorrect = opt === pair.drillAnswer;
                        return (
                          <StylusButton
                            key={opt}
                            variant={isPicked ? (isCorrect ? 'primary' : 'danger') : 'secondary'}
                            onClick={() => setRegisterDrillAnswers((prev) => ({ ...prev, [pair.id]: opt }))}
                          >
                            {opt}
                          </StylusButton>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
