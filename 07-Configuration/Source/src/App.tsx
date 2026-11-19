/**
 * FormosaStudio (FORM) — Modern Left-Rail 6-Studio Application Shell (v1.1.0 Warm Paper Light + Calm Dark)
 * Clean Left Sidebar Rail (swaps right in Left-Handed Wacom mode), slim top progress header,
 * live Daily & Overall Pathway progress telemetry, on-demand Context Inspector, Omnibar (Ctrl+K),
 * Resource Admin Modal, and In-App Help/Manual Drawer (? / F1).
 * Traces to: FORM-REQ-0018, FORM-REQ-0020, FORM-REQ-0021, FORM-REQ-0022, FORM-REQ-0023, FORM-DEC-004
 */

import React, { useCallback, useEffect, useState } from 'react';
import {
  STUDIO_BY_ID,
  STUDIO_DEFINITIONS,
  StudioBusState,
  StudioId,
  dismissStudioHandoff,
  getStudioBusState,
  popReturnHandoff,
  setActiveStudio,
  subscribeStudioBus,
} from './lib/studioContextBus.ts';
import {
  UserProgressState,
  ZhuyinDisplayMode,
  getDueSrsWords,
  getOverallPathwaySummary,
  getTodayProgressSummary,
  loadProgress,
  saveProgress,
} from './lib/progressStore.ts';
import { subscribeCurriculumAdminChanges } from './lib/curriculumAdminStore.ts';
import { ReturnBreadcrumbBar, StylusButton } from './components/uiPrimitives.tsx';
import { TodayAndCurriculumHub } from './components/TodayAndCurriculumHub.tsx';
import { TaiwanSurvivalStudio } from './components/TaiwanSurvivalStudio.tsx';
import { ReadingGrammarStudio } from './components/ReadingGrammarStudio.tsx';
import { WacomCalligraphyStudio } from './components/WacomCalligraphyStudio.tsx';
import { SpeakingPitchStudio } from './components/SpeakingPitchStudio.tsx';
import { VocabSrsDojoStudio } from './components/VocabSrsDojoStudio.tsx';
import { ResourceAdminModal } from './components/ResourceAdminModal.tsx';
import {
  GlobalOmnibarModal,
  InteractiveHelpManualDrawer,
  SideContextReferenceDock,
} from './components/ShellDrawersAndModals.tsx';

export function speakTaiwanMandarin(text: string, rate: number = 0.92): void {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
  try {
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = 'zh-TW';
    utter.rate = rate;
    const voices = window.speechSynthesis.getVoices();
    const twVoice =
      voices.find((v) => v.lang === 'zh-TW' && (v.name.includes('Taiwan') || v.name.includes('國語') || v.name.includes('Meijia'))) ||
      voices.find((v) => v.lang === 'zh-TW' || v.lang === 'zh_TW');
    if (twVoice) utter.voice = twVoice;
    window.speechSynthesis.speak(utter);
  } catch {
    // Ignore speech synthesis errors in headless environments
  }
}

const STUDIO_NAV_META: Record<StudioId, { icon: string; name: string }> = {
  hub: { icon: '◎', name: 'Today & Path' },
  survival: { icon: '⌖', name: 'Taiwan Survival' },
  reader: { icon: '▤', name: 'Reader & Grammar' },
  calligraphy: { icon: '✎', name: 'Wacom Strokes' },
  speaking: { icon: '◉', name: 'Speaking & Pitch' },
  dojo: { icon: '⊞', name: 'Vocab & DaQian' },
};

export const App: React.FC = () => {
  const [progress, setProgress] = useState<UserProgressState>(() => loadProgress());
  const [busState, setBusState] = useState<StudioBusState>(() => getStudioBusState());
  const [omnibarOpen, setOmnibarOpen] = useState<boolean>(false);
  const [adminModalOpen, setAdminModalOpen] = useState<boolean>(false);
  const [helpDrawerOpen, setHelpDrawerOpen] = useState<boolean>(false);
  const [sideDockOpen, setSideDockOpen] = useState<boolean>(false);
  const [mobileNavOpen, setMobileNavOpen] = useState<boolean>(false);
  const [adminRevision, setAdminRevision] = useState<number>(0);

  const theme = progress.theme === 'dark' ? 'dark' : 'light';

  const handleUpdateProgress = useCallback((next: UserProgressState) => {
    setProgress(next);
    saveProgress(next);
  }, []);

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('data-theme', theme);
    }
  }, [theme]);

  useEffect(() => subscribeStudioBus(setBusState), []);
  useEffect(() => subscribeCurriculumAdminChanges(() => setAdminRevision((r) => r + 1)), []);

  // Global keyboard shortcuts (Alt+1..6 Studio Switch, Ctrl+K Omnibar, F1/? Help Manual, Esc Close)
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setOmnibarOpen((o) => !o);
        return;
      }
      if (e.key === 'Escape') {
        setOmnibarOpen(false);
        setHelpDrawerOpen(false);
        setAdminModalOpen(false);
        setMobileNavOpen(false);
        return;
      }
      if (e.altKey && e.key >= '1' && e.key <= '6') {
        e.preventDefault();
        const target = STUDIO_DEFINITIONS[Number(e.key) - 1];
        if (target) setActiveStudio(target.id);
        return;
      }
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.key === 'F1' || e.key === '?') {
        e.preventDefault();
        setHelpDrawerOpen((h) => !h);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  const cycleZhuyinMode = () => {
    const order: ZhuyinDisplayMode[] = ['adaptive', 'always', 'hover_only'];
    const next = order[(order.indexOf(progress.zhuyinDisplayMode) + 1) % order.length];
    handleUpdateProgress({ ...progress, zhuyinDisplayMode: next });
  };

  const toggleTheme = () => {
    handleUpdateProgress({ ...progress, theme: theme === 'light' ? 'dark' : 'light' });
  };

  const toggleHandedness = () => {
    handleUpdateProgress({ ...progress, handedness: progress.handedness === 'right' ? 'left' : 'right' });
  };

  const togglePinyinHint = () => {
    handleUpdateProgress({ ...progress, showPinyinHint: !progress.showPinyinHint });
  };

  const todaySummary = getTodayProgressSummary(progress);
  const pathwaySummary = getOverallPathwaySummary(progress);
  const dueCount = getDueSrsWords(progress).length;
  const activeStudioMeta = STUDIO_BY_ID[busState.activeStudio];
  const isLeftHanded = progress.handedness === 'left';

  const zhuyinModeLabel =
    progress.zhuyinDisplayMode === 'adaptive'
      ? 'Zhuyin: Adaptive'
      : progress.zhuyinDisplayMode === 'always'
        ? 'Zhuyin: Always On'
        : 'Zhuyin: Tap to Peek';

  return (
    <div
      className={`min-h-screen flex flex-col lg:flex-row ${isLeftHanded ? 'lg:flex-row-reverse' : ''}`}
      style={{ backgroundColor: 'var(--fs-canvas)', color: 'var(--fs-text)' }}
    >
      {/* Left Sidebar Rail (swaps to right edge in Left-Handed Wacom mode) */}
      <aside
        aria-label="Primary 6-Studio Navigation"
        className={`${
          mobileNavOpen ? 'flex' : 'hidden lg:flex'
        } flex-col w-full lg:w-[284px] shrink-0 lg:sticky lg:top-0 lg:h-screen overflow-y-auto px-4 py-4 justify-between gap-4 border-b lg:border-b-0 ${
          isLeftHanded ? 'lg:border-l' : 'lg:border-r'
        }`}
        style={{ backgroundColor: 'var(--fs-sidebar)', borderColor: 'var(--fs-border)' }}
      >
        <div className="space-y-4">
          {/* Calm Brand Header */}
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-xl font-bold text-xl flex items-center justify-center shadow-sm fs-on-accent"
                style={{ backgroundColor: 'var(--fs-accent)' }}
              >
                臺
              </div>
              <div>
                <div className="text-base font-bold tracking-tight" style={{ color: 'var(--fs-text)' }}>
                  FormosaStudio
                </div>
                <div className="text-xs" style={{ color: 'var(--fs-text-muted)' }}>
                  臺灣華語 · 正體注音
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setMobileNavOpen(false)}
              className="lg:hidden px-2.5 py-1.5 rounded-lg text-sm"
              style={{ color: 'var(--fs-text-secondary)' }}
            >
              ✕
            </button>
          </div>

          {/* Live Daily Progress Widget in Sidebar */}
          <button
            type="button"
            onClick={() => {
              setActiveStudio('hub');
              setMobileNavOpen(false);
            }}
            className="w-full text-left rounded-2xl p-3.5 border transition"
            style={{ backgroundColor: 'var(--fs-surface)', borderColor: 'var(--fs-border)' }}
          >
            <div className="flex items-center justify-between text-xs font-semibold mb-1.5">
              <span style={{ color: 'var(--fs-text-secondary)' }}>Today’s Goal</span>
              <span style={{ color: 'var(--fs-accent-text)' }}>
                {todaySummary.minutesCompleted} / {todaySummary.goalMinutes} min
              </span>
            </div>
            <div
              className="w-full h-2 rounded-full overflow-hidden mb-2"
              style={{ backgroundColor: 'var(--fs-subtle)' }}
            >
              <div
                className="h-full rounded-full transition-all duration-300"
                style={{
                  width: `${todaySummary.percentComplete}%`,
                  backgroundColor: 'var(--fs-accent)',
                }}
              />
            </div>
            <div className="flex items-center justify-between text-xs" style={{ color: 'var(--fs-text-muted)' }}>
              <span>{todaySummary.stepsCompleted.length} of 3 steps</span>
              <span>Streak {progress.streak}d</span>
            </div>
          </button>

          {/* Permanent 6-Studio Navigation List */}
          <nav className="space-y-1">
            <div
              className="px-2 pb-1.5 text-xs font-semibold uppercase tracking-wider"
              style={{ color: 'var(--fs-text-muted)' }}
            >
              Studios
            </div>
            {STUDIO_DEFINITIONS.map((st) => {
              const active = busState.activeStudio === st.id;
              const navMeta = STUDIO_NAV_META[st.id];
              return (
                <button
                  key={st.id}
                  type="button"
                  onClick={() => {
                    setActiveStudio(st.id);
                    setMobileNavOpen(false);
                  }}
                  style={{
                    minHeight: '44px',
                    touchAction: 'manipulation',
                    backgroundColor: active ? 'var(--fs-accent-soft)' : 'transparent',
                    color: active ? 'var(--fs-accent-text)' : 'var(--fs-text)',
                    borderColor: active ? 'var(--fs-accent-border)' : 'transparent',
                  }}
                  className="w-full px-3 py-2 rounded-xl border text-left transition flex items-center justify-between gap-2 hover:opacity-95"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="text-base shrink-0 opacity-80">{navMeta.icon}</span>
                    <div className="min-w-0">
                      <div className={`text-sm whitespace-nowrap ${active ? 'font-bold' : 'font-medium'}`}>
                        {navMeta.name}
                      </div>
                      <div className="text-xs leading-tight" style={{ color: 'var(--fs-text-muted)' }}>
                        {st.titleZh}
                      </div>
                    </div>
                  </div>
                  <kbd
                    className="px-1.5 py-0.5 rounded text-[11px] font-mono shrink-0"
                    style={{
                      backgroundColor: active ? 'var(--fs-surface)' : 'var(--fs-hover)',
                      color: 'var(--fs-text-muted)',
                    }}
                  >
                    {st.shortcut}
                  </kbd>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Quiet Sidebar Footer Utilities & Preferences */}
        <div className="space-y-3 pt-4 border-t" style={{ borderColor: 'var(--fs-border)' }}>
          <div className="space-y-1">
            <button
              type="button"
              onClick={() => setOmnibarOpen(true)}
              style={{ minHeight: '40px', color: 'var(--fs-text-secondary)' }}
              className="w-full px-3 py-2 rounded-xl text-sm font-medium flex items-center justify-between hover:opacity-80"
            >
              <span>Search Lexicon</span>
              <kbd className="text-xs font-mono opacity-75">Ctrl+K</kbd>
            </button>
            <button
              type="button"
              onClick={() => setAdminModalOpen(true)}
              style={{ minHeight: '40px', color: 'var(--fs-text-secondary)' }}
              className="w-full px-3 py-2 rounded-xl text-sm font-medium flex items-center justify-between hover:opacity-80"
            >
              <span>Add Curriculum</span>
              <span className="text-xs opacity-75">+</span>
            </button>
            <button
              type="button"
              onClick={() => setHelpDrawerOpen(true)}
              style={{ minHeight: '40px', color: 'var(--fs-text-secondary)' }}
              className="w-full px-3 py-2 rounded-xl text-sm font-medium flex items-center justify-between hover:opacity-80"
            >
              <span>User’s Manual</span>
              <kbd className="text-xs font-mono opacity-75">?</kbd>
            </button>
          </div>

          <div
            className="rounded-xl p-2.5 space-y-2 border"
            style={{ backgroundColor: 'var(--fs-surface)', borderColor: 'var(--fs-border)' }}
          >
            <div className="grid grid-cols-2 gap-1.5">
              <button
                type="button"
                onClick={toggleTheme}
                style={{
                  minHeight: '36px',
                  backgroundColor: 'var(--fs-subtle)',
                  color: 'var(--fs-text)',
                }}
                className="px-2.5 py-1.5 rounded-lg text-xs font-semibold transition"
              >
                {theme === 'light' ? '☀ Paper' : '☾ Dark'}
              </button>
              <button
                type="button"
                onClick={toggleHandedness}
                style={{
                  minHeight: '36px',
                  backgroundColor: 'var(--fs-subtle)',
                  color: 'var(--fs-text)',
                }}
                className="px-2.5 py-1.5 rounded-lg text-xs font-semibold transition"
                title="Swap sidebar and Wacom controls between Right-Handed and Left-Handed"
              >
                {isLeftHanded ? 'Left Hand' : 'Right Hand'}
              </button>
            </div>
            <div className="grid grid-cols-2 gap-1.5">
              <button
                type="button"
                onClick={cycleZhuyinMode}
                style={{
                  minHeight: '36px',
                  backgroundColor: 'var(--fs-subtle)',
                  color: 'var(--fs-text-secondary)',
                }}
                className="px-2 py-1.5 rounded-lg text-xs font-semibold transition truncate"
                title={zhuyinModeLabel}
              >
                {progress.zhuyinDisplayMode === 'adaptive' ? '注音: Auto' : progress.zhuyinDisplayMode === 'always' ? '注音: On' : '注音: Peek'}
              </button>
              <button
                type="button"
                onClick={togglePinyinHint}
                style={{
                  minHeight: '36px',
                  backgroundColor: progress.showPinyinHint ? 'var(--fs-accent-soft)' : 'var(--fs-subtle)',
                  color: progress.showPinyinHint ? 'var(--fs-accent-text)' : 'var(--fs-text-secondary)',
                }}
                className="px-2 py-1.5 rounded-lg text-xs font-semibold transition"
                title="Show Pinyin training wheels alongside Taiwanese Zhuyin"
              >
                Pinyin: {progress.showPinyinHint ? 'ON' : 'OFF'}
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Column: Slim Top Progress Header + Spacious Active Workspace */}
      <div className="flex-1 min-w-0 flex flex-col">
        <header
          className="sticky top-0 z-30 h-16 px-5 sm:px-8 border-b flex items-center justify-between gap-4 backdrop-blur-md"
          style={{
            backgroundColor: theme === 'light' ? 'rgba(247, 244, 238, 0.92)' : 'rgba(19, 22, 26, 0.92)',
            borderColor: 'var(--fs-border)',
          }}
        >
          <div className="flex items-center gap-3 min-w-0">
            <button
              type="button"
              onClick={() => setMobileNavOpen((o) => !o)}
              className="lg:hidden px-3 py-2 rounded-xl border text-sm font-semibold"
              style={{ borderColor: 'var(--fs-border-strong)', color: 'var(--fs-text)' }}
            >
              ☰ Menu
            </button>
            <div className="min-w-0">
              <div className="text-base font-bold truncate" style={{ color: 'var(--fs-text)' }}>
                {activeStudioMeta.titleEn}{' '}
                <span className="font-medium text-sm opacity-65">· {activeStudioMeta.titleZh}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() => setActiveStudio('hub')}
              className="hidden sm:inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-semibold"
              style={{
                backgroundColor: 'var(--fs-surface)',
                borderColor: 'var(--fs-border)',
                color: 'var(--fs-text-secondary)',
              }}
            >
              <span>
                {!pathwaySummary.stage0.isCompleteOrSkipped
                  ? `Stage 0: Start From Zero (${pathwaySummary.stage0.completedCount}/5)`
                  : `Stage ${pathwaySummary.currentStage.stageNumber}: ${pathwaySummary.currentStage.tocflTarget}`}
              </span>
              <span style={{ color: 'var(--fs-accent-text)' }}>
                {!pathwaySummary.stage0.isCompleteOrSkipped
                  ? `${pathwaySummary.stage0.percent}%`
                  : `${pathwaySummary.overallPercent}%`}
              </span>
            </button>

            {dueCount > 0 && (
              <button
                type="button"
                onClick={() => setActiveStudio('dojo')}
                className="px-3 py-1.5 rounded-full border text-xs font-semibold"
                style={{
                  backgroundColor: 'var(--fs-warm-soft)',
                  borderColor: 'var(--fs-warm-border)',
                  color: 'var(--fs-warm)',
                }}
              >
                {dueCount} Reviews Due
              </button>
            )}

            <StylusButton
              variant={sideDockOpen ? 'primary' : 'ghost'}
              onClick={() => setSideDockOpen((d) => !d)}
              title="Toggle Contextual Word & Zhuyin Inspector"
            >
              <span>{sideDockOpen ? 'Hide Inspector' : 'Inspector'}</span>
            </StylusButton>
          </div>
        </header>

        <main className="flex-1 w-full max-w-[1240px] mx-auto px-5 sm:px-8 py-6 space-y-6">
          <ReturnBreadcrumbBar
            handoff={busState.activeHandoff}
            onReturn={() => popReturnHandoff()}
            onDismiss={() => dismissStudioHandoff()}
          />

          <div
            className={`flex flex-col ${
              isLeftHanded ? 'xl:flex-row-reverse' : 'xl:flex-row'
            } gap-6 items-start`}
          >
            <div className="flex-1 w-full min-w-0">
              {busState.activeStudio === 'hub' && (
                <TodayAndCurriculumHub
                  progress={progress}
                  onUpdateProgress={handleUpdateProgress}
                  onOpenAdminModal={() => setAdminModalOpen(true)}
                  onSpeak={speakTaiwanMandarin}
                  adminRevision={adminRevision}
                />
              )}
              {busState.activeStudio === 'survival' && (
                <TaiwanSurvivalStudio
                  progress={progress}
                  onUpdateProgress={handleUpdateProgress}
                  onSpeakText={speakTaiwanMandarin}
                />
              )}
              {busState.activeStudio === 'reader' && (
                <ReadingGrammarStudio
                  progress={progress}
                  onUpdateProgress={handleUpdateProgress}
                  onSpeakText={speakTaiwanMandarin}
                  adminRevision={adminRevision}
                />
              )}
              {busState.activeStudio === 'calligraphy' && (
                <WacomCalligraphyStudio
                  progress={progress}
                  onUpdateProgress={handleUpdateProgress}
                  onSpeak={speakTaiwanMandarin}
                />
              )}
              {busState.activeStudio === 'speaking' && (
                <SpeakingPitchStudio
                  progress={progress}
                  onUpdateProgress={handleUpdateProgress}
                  onSpeak={speakTaiwanMandarin}
                />
              )}
              {busState.activeStudio === 'dojo' && (
                <VocabSrsDojoStudio
                  progress={progress}
                  onUpdateProgress={handleUpdateProgress}
                  onSpeak={speakTaiwanMandarin}
                  adminRevision={adminRevision}
                />
              )}
            </div>

            {sideDockOpen && (
              <SideContextReferenceDock
                focusedItem={busState.focusedItem}
                activeStudio={busState.activeStudio}
                isOpen={sideDockOpen}
                onToggle={() => setSideDockOpen(false)}
                onSpeak={speakTaiwanMandarin}
              />
            )}
          </div>
        </main>
      </div>

      {/* Global Modals & Drawers */}
      <GlobalOmnibarModal
        isOpen={omnibarOpen}
        onClose={() => setOmnibarOpen(false)}
        activeStudio={busState.activeStudio}
        adminRevision={adminRevision}
      />
      <ResourceAdminModal
        isOpen={adminModalOpen}
        onClose={() => setAdminModalOpen(false)}
        onPacksUpdated={() => setAdminRevision((r) => r + 1)}
      />
      <InteractiveHelpManualDrawer
        isOpen={helpDrawerOpen}
        onClose={() => setHelpDrawerOpen(false)}
      />
    </div>
  );
};

export default App;
