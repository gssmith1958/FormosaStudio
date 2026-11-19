/**
 * FormosaStudio (FORM) — Studio 6: Vocab Catalog, FSRS-Lite Review Queue, 8-Stage DaQian Dojo & Skill Tree Arena
 * Traces to: FORM-REQ-0017, FORM-REQ-0003, FORM-REQ-0004, FORM-REQ-0005, FORM-REQ-0021, FORM-DEP-UX-001
 */
import React, { useEffect, useMemo, useState } from 'react';
import {
  DAQIAN_DOJO_STAGES,
  DAQIAN_KEYBOARD_ROWS,
} from '../data/daqianAndDojoData.ts';
import { SkillTreeAndArenaPanel } from './SkillTreeAndArenaPanel.tsx';
import {
  VocabularyEntry,
  getFullVocabularyCatalog,
} from '../data/vocabularyCatalog.ts';
import {
  FsrsRating,
  UserProgressState,
  exportProgressJson,
  getDueSrsWords,
  importProgressJson,
  recordWordPractice,
} from '../lib/progressStore.ts';
import {
  getStudioBusState,
  setFocusedContextItem,
  subscribeStudioBus,
} from '../lib/studioContextBus.ts';
import {
  CrossStudioActionPills,
  StudioHeaderBanner,
  StudioModeOption,
  StudioModeSwitcher,
  StylusButton,
} from './uiPrimitives.tsx';
import { RubyText } from './RubyText.tsx';
type Studio6SubTab = 'dojo' | 'srs' | 'wordbank' | 'skilltree_arena';
const SUB_TABS: StudioModeOption<Studio6SubTab>[] = [
  { id: 'dojo', labelZh: '大千八階盲打道場', labelEn: '8-Stage DaQian Dojo', badge: '8 階' },
  { id: 'srs', labelZh: 'FSRS 智慧記憶複習', labelEn: 'FSRS-Lite Review Queue', badge: 'S/D/R' },
  { id: 'wordbank', labelZh: 'TOCFL 詞彙銀行', labelEn: 'Novice 1–B2 Word Bank', badge: '215+ 詞' },
  { id: 'skilltree_arena', labelZh: '五世界技能樹與配對競技場', labelEn: '5-World Tree & 3-Stage Arena', badge: '20 節點' },
];
export interface VocabSrsDojoStudioProps {
  progress: UserProgressState;
  onUpdateProgress: (next: UserProgressState) => void;
  onSpeak?: (text: string) => void;
  adminRevision?: number;
}
export const VocabSrsDojoStudio: React.FC<VocabSrsDojoStudioProps> = ({
  progress,
  onUpdateProgress,
  onSpeak,
  adminRevision = 0,
}) => {
  const [subTab, setSubTab] = useState<Studio6SubTab>('dojo');
  const [stageIdx, setStageIdx] = useState<number>(0);
  const [promptIdx, setPromptIdx] = useState<number>(0);
  const [typedProgress, setTypedProgress] = useState<string>('');
  const [blindKeycaps, setBlindKeycaps] = useState<boolean>(false);
  const [keyErrorHeatmap, setKeyErrorHeatmap] = useState<Record<string, number>>({});
  const [dojoSessionStats, setDojoSessionStats] = useState<{ hits: number; misses: number; startedAt: number }>({
    hits: 0, misses: 0, startedAt: Date.now(),
  });
  // SRS state
  const [srsRevealed, setSrsRevealed] = useState<boolean>(false);
  const [backupMessage, setBackupMessage] = useState<string | null>(null);
  // Word Bank state
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedBand, setSelectedBand] = useState<string>('ALL');
  const [selectedVocab, setSelectedVocab] = useState<VocabularyEntry | null>(null);
  const [assistedCurrentWord, setAssistedCurrentWord] = useState<boolean>(false);
  const catalog = useMemo(() => getFullVocabularyCatalog(), [adminRevision, progress.xp]);
  const dueWords = useMemo(() => getDueSrsWords(progress), [progress]);
  const activeStage = DAQIAN_DOJO_STAGES[stageIdx] || DAQIAN_DOJO_STAGES[0];
  const activePrompt = activeStage.prompts[promptIdx % activeStage.prompts.length] || activeStage.prompts[0];
  const expectedNextKey = activePrompt.expectedKeys[typedProgress.length] ?? ' ';
  // Sync with Cross-Studio Handoff Bus
  useEffect(() => {
    const syncBus = () => {
      const bus = getStudioBusState();
      const targetText = bus.activeHandoff?.targetText;
      if (targetText) {
        const found = catalog.find((c) => c.traditional === targetText || c.traditional.includes(targetText));
        if (found) {
          setSelectedVocab(found);
          setSearchQuery(targetText);
          if (bus.activeHandoff?.modeHint === 'wordbank') {
            setSubTab('wordbank');
          }
        }
      }
    };
    syncBus();
    return subscribeStudioBus(syncBus);
  }, [catalog]);
  useEffect(() => {
    setFocusedContextItem({
      text: activePrompt.hanzi, zhuyin: activePrompt.zhuyin, english: activePrompt.english, sourceStudio: 'dojo',
      sourceLabel: '8-Stage DaQian Dojo',
    });
  }, [stageIdx, promptIdx]);
  const handleDaqianKeyPress = (rawKey: string, isGuidedAssist: boolean = false) => {
    const key = rawKey === 'Space' ? ' ' : rawKey.toLowerCase();
    if (isGuidedAssist) setAssistedCurrentWord(true);
    const wasAssisted = assistedCurrentWord || isGuidedAssist;
    if (key === expectedNextKey) {
      const nextTyped = typedProgress + key;
      const nextHits = dojoSessionStats.hits + 1;
      setDojoSessionStats((s) => ({ ...s, hits: nextHits }));
      if (nextTyped.length >= activePrompt.expectedKeys.length) {
        // Completed the phrase — only grant WPM/FSRS mastery if typed unassisted
        if (!wasAssisted) {
          const elapsedMin = Math.max(0.08, (Date.now() - dojoSessionStats.startedAt) / 60000);
          const wpm = Math.min(95, Math.round(nextHits / 3.5 / elapsedMin));
          const nextState = recordWordPractice(
            { ...progress, xp: progress.xp + 12, daqianBestWpm: Math.max(progress.daqianBestWpm, wpm) },
            { word: activePrompt.hanzi, zhuyin: activePrompt.zhuyin, english: activePrompt.english },
            true,
            4
          );
          onUpdateProgress(nextState);
        }
        onSpeak?.(activePrompt.hanzi);
        setTypedProgress('');
        setAssistedCurrentWord(false);
        setPromptIdx((i) => (i + 1) % activeStage.prompts.length);
      } else {
        setTypedProgress(nextTyped);
      }
    } else {
      setDojoSessionStats((s) => ({ ...s, misses: s.misses + 1 }));
      setKeyErrorHeatmap((prev) => ({
        ...prev,
        [expectedNextKey]: (prev[expectedNextKey] || 0) + 1,
      }));
    }
  };
  // Physical keyboard listener when on DaQian Dojo tab
  useEffect(() => {
    if (subTab !== 'dojo') return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (document.querySelector('[role="dialog"]')) return;
      if (e.ctrlKey || e.metaKey || e.altKey || e.key === '?') return;
      if (e.key === ' ' || e.key.length === 1) {
        e.preventDefault();
        handleDaqianKeyPress(e.key);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  });
  const activeDueCard =
    dueWords[0] ||
    (catalog[0]
      ? {
          word: catalog[0].traditional, zhuyin: catalog[0].zhuyin, english: catalog[0].english, stability: 1.0,
          difficulty: 5.0, retrievability: 0.9, lapses: 0,
        }
      : null);
  const handleGradeSrsCard = (rating: FsrsRating) => {
    if (!activeDueCard) return;
    const updated = recordWordPractice(
      { ...progress, xp: progress.xp + (rating >= 3 ? 10 : 4) },
      { word: activeDueCard.word, zhuyin: activeDueCard.zhuyin, english: activeDueCard.english },
      rating >= 2,
      rating
    );
    onUpdateProgress(updated);
    setSrsRevealed(false);
  };
  const filteredVocab = useMemo(() => {
    return catalog.filter((item) => {
      const bandOk = selectedBand === 'ALL' || item.tocflBand.includes(selectedBand);
      const q = searchQuery.trim().toLowerCase();
      const qOk =
        !q ||
        item.traditional.includes(q) ||
        item.zhuyin.includes(q) ||
        item.english.toLowerCase().includes(q) ||
        (item.pinyin && item.pinyin.toLowerCase().includes(q));
      return bandOk && qOk;
    });
  }, [catalog, selectedBand, searchQuery]);
  return (
    <div className="space-y-5">
      <StudioHeaderBanner
        studioId="dojo"
        titleZh="詞彙銀行、FSRS 記憶與大千盲打道場"
        titleEn="Vocab Catalog, FSRS-Lite SRS & 8-Stage DaQian Dojo"
        subtitle="Master Taiwan's standard DaQian (大千式) Zhuyin layout across 8 progressive touch-typing stages, review TOCFL Novice 1 – Band B2 vocabulary with FSRS-Lite Stability/Difficulty scheduling, and conquer the 5-World Skill Tree."
        rightSlot={
          <div className="flex flex-wrap items-center gap-2 text-xs font-extrabold">
            <span className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-emerald-300">⌨️ Best WPM: {progress.daqianBestWpm}</span>
            <span className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-amber-300">🃏 Due SRS: {dueWords.length}</span>
          </div>
        }
      />
      <StudioModeSwitcher modes={SUB_TABS} activeMode={subTab} onSelect={setSubTab} />
      {subTab === 'dojo' && (
        <div className="space-y-5">
          {/* 8-Stage Selector Strip */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-4 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex flex-wrap gap-1.5">
                {DAQIAN_DOJO_STAGES.map((st, idx) => (
                  <StylusButton
                    key={st.id}
                    variant={stageIdx === idx ? 'primary' : 'secondary'}
                    onClick={() => {
                      setStageIdx(idx);
                      setPromptIdx(0);
                      setTypedProgress('');
                      setBlindKeycaps(st.blindKeycapsRecommended);
                    }}
                  >
                    <span>Stage {st.stageNumber}</span>
                  </StylusButton>
                ))}
              </div>
              <StylusButton variant={blindKeycaps ? 'amber' : 'secondary'} onClick={() => setBlindKeycaps((b) => !b)} >
                <span>🙈 {blindKeycaps ? 'Blind Keycaps: ON (盲打)' : 'Show Keycap Labels'}</span>
              </StylusButton>
            </div>
            <div className="text-xs sm:text-sm text-slate-300">
              <strong className="text-emerald-300">{activeStage.titleZh}</strong> ({activeStage.titleEn}) —{' '}
              {activeStage.focusDescription}
            </div>
          </div>
          {/* Active Prompt & Keystroke Sequence Display */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="px-5 py-3 rounded-2xl bg-slate-950 border border-slate-800">
                  <RubyText
                    text={activePrompt.hanzi}
                    zhuyin={activePrompt.zhuyin}
                    size="xl"
                    zhuyinDisplayMode="always"
                  />
                </div>
                <div>
                  <div className="text-lg font-extrabold text-white">{activePrompt.english}</div>
                  <div className="text-xs text-slate-400">
                    Taiwan DaQian Key Sequence ({activePrompt.expectedKeys.length} keys):{' '}
                    <span className="font-mono text-emerald-300">
                      {Array.from(activePrompt.expectedKeys)
                        .map((k) => (k === ' ' ? '[Space=Tone1]' : k.toUpperCase()))
                        .join(' → ')}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <StylusButton variant="amber" onClick={() => handleDaqianKeyPress(expectedNextKey, true)} >
                  <span>⚡ Hint Key ({expectedNextKey === ' ' ? 'Space' : expectedNextKey.toUpperCase()})</span>
                </StylusButton>
                <StylusButton
                  variant="secondary"
                  onClick={() => {
                    setTypedProgress('');
                    setAssistedCurrentWord(false);
                    setPromptIdx((i) => (i + 1) % activeStage.prompts.length);
                  }}
                >
                  <span>Next Word →</span>
                </StylusButton>
              </div>
            </div>
            {/* Interactive 4-Row Taiwan DaQian Virtual Keyboard + Per-Key Error Heatmap */}
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-2 overflow-x-auto">
              {DAQIAN_KEYBOARD_ROWS.map((row, rIdx) => (
                <div
                  key={rIdx}
                  className="flex items-center justify-center gap-1.5"
                  style={{ paddingLeft: `${rIdx * 14}px` }}
                >
                  {row.map((cap) => {
                    const isNext = expectedNextKey === cap.key;
                    const errCount = keyErrorHeatmap[cap.key] || 0;
                    return (
                      <button
                        key={cap.key}
                        type="button"
                        onClick={() => handleDaqianKeyPress(cap.key)}
                        style={{ minHeight: '46px', minWidth: '46px', touchAction: 'manipulation' }}
                        className={`px-2.5 py-1.5 rounded-xl border text-left transition flex flex-col justify-between ${
                          isNext
                            ? 'bg-emerald-500 text-slate-950 border-emerald-300 font-black scale-105 shadow-lg'
                            : errCount > 0
                            ? 'bg-rose-950/80 text-rose-200 border-rose-500/60'
                            : 'bg-slate-900 hover:bg-slate-800 text-slate-200 border-slate-700'
                        }`}
                      >
                        <span className="text-[10px] font-mono opacity-75">{cap.displayKey}</span>
                        <span className="text-base font-extrabold self-center">{blindKeycaps && !isNext ? '•' : cap.zhuyin}</span>
                      </button>
                    );
                  })}
                </div>
              ))}
              {/* Spacebar = Tone 1 (一聲陰平) */}
              <div className="flex justify-center pt-1">
                <button
                  type="button"
                  onClick={() => handleDaqianKeyPress(' ')}
                  style={{ minHeight: '44px', touchAction: 'manipulation' }}
                  className={`w-72 rounded-xl border text-xs font-extrabold transition ${
                    expectedNextKey === ' '
                      ? 'bg-emerald-500 text-slate-950 border-emerald-300 shadow-lg'
                      : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border-slate-700'
                  }`}
                >
                  SPACEBAR · 一聲 (Tone 1 Default Termination)
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {subTab === 'srs' && activeDueCard && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          <div className="lg:col-span-7 bg-slate-900/90 border border-slate-800 rounded-3xl p-6 space-y-5">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>FSRS-Lite Power-Law Forgetting Curve Scheduler</span>
              <span>
                Stability S: <strong className="text-emerald-300">{activeDueCard.stability}d</strong> · Difficulty D:{' '}
                <strong className="text-amber-300">{activeDueCard.difficulty}</strong>
              </span>
            </div>
            <div className="bg-slate-950 border border-slate-800 rounded-3xl p-8 text-center space-y-4">
              <div className="flex justify-center">
                <RubyText
                  text={activeDueCard.word}
                  zhuyin={srsRevealed ? activeDueCard.zhuyin : undefined}
                  showPinyinHint={srsRevealed && progress.showPinyinHint}
                  size="xl"
                  zhuyinDisplayMode={srsRevealed ? 'always' : 'hover_only'}
                />
              </div>
              <div className="flex justify-center gap-2">
                {onSpeak && (
                  <StylusButton variant="secondary" onClick={() => onSpeak(activeDueCard.word)}>
                    <span>🔊 Listen</span>
                  </StylusButton>
                )}
                {!srsRevealed && (
                  <StylusButton variant="primary" onClick={() => setSrsRevealed(true)}>
                    <span>👁️ Reveal Answer &amp; Zhuyin</span>
                  </StylusButton>
                )}
              </div>
              {srsRevealed && (
                <div className="space-y-2 pt-1">
                  <div className="text-xl font-extrabold text-emerald-300">{activeDueCard.english}</div>
                  <div className="text-sm text-slate-300">Taiwan MOE Zhuyin: {activeDueCard.zhuyin}</div>
                </div>
              )}
            </div>
            {srsRevealed && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                <StylusButton variant="danger" onClick={() => handleGradeSrsCard(1)}>
                  <span>1 · Again (重來)</span>
                </StylusButton>
                <StylusButton variant="secondary" onClick={() => handleGradeSrsCard(2)}>
                  <span>2 · Hard (困難)</span>
                </StylusButton>
                <StylusButton variant="primary" onClick={() => handleGradeSrsCard(3)}>
                  <span>3 · Good (良好)</span>
                </StylusButton>
                <StylusButton variant="amber" onClick={() => handleGradeSrsCard(4)}>
                  <span>4 · Easy (熟練)</span>
                </StylusButton>
              </div>
            )}
          </div>
          <div className="lg:col-span-5 bg-slate-900/90 border border-slate-800 rounded-3xl p-5 space-y-4">
            <h3 className="text-sm font-extrabold text-emerald-300 uppercase tracking-wider">
              Validated JSON Progress Backup & Restore (FORM-REQ-0004)
            </h3>
            <p className="text-xs text-slate-300">
              Export your complete FSRS character, word, and Wacom stroke mastery state to a validated JSON file or restore a backup.
            </p>
            <div className="flex flex-wrap items-center gap-2">
              <StylusButton
                variant="secondary"
                onClick={() => {
                  const json = exportProgressJson(progress);
                  try {
                    const blob = new Blob([json], { type: 'application/json' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `formosastudio-progress-${new Date().toISOString().slice(0, 10)}.json`;
                    a.click();
                    URL.revokeObjectURL(url);
                    setBackupMessage('✅ Downloaded validated FSRS JSON backup file!');
                  } catch {
                    setBackupMessage(`✅ Generated ${json.length} bytes of validated backup JSON.`);
                  }
                }}
              >
                <span>📤 Export Progress JSON</span>
              </StylusButton>
              <label className="inline-flex items-center justify-center min-h-[44px] px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-bold text-slate-200 cursor-pointer">
                <span>📥 Restore JSON File</span>
                <input
                  type="file"
                  accept=".json,application/json"
                  className="hidden"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    try {
                      onUpdateProgress(importProgressJson(await file.text()));
                      setBackupMessage(`✅ Restored FSRS progress from ${file.name}!`);
                    } catch (err) {
                      setBackupMessage(`❌ ${err instanceof Error ? err.message : 'Invalid backup JSON.'}`);
                    }
                  }}
                />
              </label>
            </div>
            {backupMessage && <div className="text-xs font-bold text-emerald-300">{backupMessage}</div>}
          </div>
        </div>
      )}
      {subTab === 'wordbank' && (
        <div className="space-y-4">
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-4 flex flex-wrap items-center justify-between gap-3">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search Traditional Hanzi, Zhuyin (ㄅㄆㄇ), Pinyin, or English..."
              className="flex-1 min-w-[240px] min-h-[44px] px-4 py-2 rounded-xl bg-slate-950 border border-slate-700 text-sm text-white"
            />
            <div className="flex flex-wrap gap-1.5">
              {['ALL', 'Novice 1', 'Novice 2', 'Band A · Level 1', 'Band A · Level 2', 'Band B · Level 1', 'Band B · Level 2'].map((b) => (
                <StylusButton key={b} variant={selectedBand === b ? 'primary' : 'secondary'} onClick={() => setSelectedBand(b)} >
                  <span>{b}</span>
                </StylusButton>
              ))}
            </div>
          </div>
          {selectedVocab && (
            <div className="bg-slate-900/95 border border-emerald-500/50 rounded-3xl p-5 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <RubyText
                  text={selectedVocab.traditional}
                  zhuyin={selectedVocab.zhuyin}
                  pinyin={selectedVocab.pinyin}
                  size="xl"
                  zhuyinDisplayMode="always"
                />
                <div className="text-right">
                  <div className="text-lg font-extrabold text-white">{selectedVocab.english}</div>
                  <div className="text-xs text-emerald-300">{selectedVocab.tocflBand} · {selectedVocab.sourceLabel}</div>
                </div>
              </div>
              <CrossStudioActionPills
                targetText={selectedVocab.traditional}
                targetZhuyin={selectedVocab.zhuyin}
                targetEnglish={selectedVocab.english}
                sourceStudio="dojo"
                sourceLabel="TOCFL Word Bank"
              />
            </div>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {filteredVocab.slice(0, 24).map((item) => (
              <div
                key={item.id}
                onClick={() => setSelectedVocab(item)}
                className="bg-slate-900/90 hover:bg-slate-800/90 border border-slate-800 rounded-2xl p-4 cursor-pointer transition flex items-center justify-between gap-3"
              >
                <RubyText text={item.traditional} zhuyin={item.zhuyin} size="md" zhuyinDisplayMode="always" />
                <div className="text-right text-xs">
                  <div className="font-bold text-white">{item.english}</div>
                  <div className="text-slate-400">{item.sourceLabel}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      {subTab === 'skilltree_arena' && (
        <SkillTreeAndArenaPanel
          catalog={catalog}
          progress={progress}
          onUpdateProgress={onUpdateProgress}
          onSpeak={onSpeak}
        />
      )}
    </div>
  );
};
