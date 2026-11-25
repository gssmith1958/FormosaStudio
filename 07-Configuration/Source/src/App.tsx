/**
 * FormosaStudio (FORM) — v2.1.0 Crisp Neutral Studio Application Shell
 * Supports prefers-color-scheme live sync + dynamic iPadOS theme-color, 56px slim topbar (h-14),
 * auto-collapsing iPad mini 6 drawer (<=1180px) with always-visible Menu toggle, and Lucide icons.
 * Traces to: FORM-ECR-001, FORM-DEC-005, FORM-REQ-0018, FORM-REQ-0020, FORM-REQ-0021, FORM-REQ-0022, FORM-REQ-0023
 */

import React, { useCallback, useEffect, useState } from 'react';
import { Menu, PanelRight, Search } from 'lucide-react';
import {
  STUDIO_BY_ID,
  StudioBusState,
  StudioId,
  dismissStudioHandoff,
  getStudioBusState,
  popReturnHandoff,
  setActiveStudio,
  subscribeStudioBus,
} from './lib/studioContextBus.ts';
import {
  ResolvedThemeMode,
  ThemeMode,
  UserProgressState,
  ZhuyinDisplayMode,
  getDueSrsWords,
  loadProgress,
  resolveEffectiveTheme,
  saveProgress,
} from './lib/progressStore.ts';
import { StageNumber, resolveActiveStageNumber } from './lib/syllabusModel.ts';
import { speakTaiwaneseSafe } from './lib/audioSessionManager.ts';
import { subscribeCurriculumAdminChanges } from './lib/curriculumAdminStore.ts';
import { ReturnBreadcrumbBar, StylusButton } from './components/uiPrimitives.tsx';
import { AccordionNavSidebar } from './components/AccordionNavSidebar.tsx';
import { TodayAndCurriculumHub } from './components/TodayAndCurriculumHub.tsx';
import { SyllabusStageView } from './components/SyllabusStageView.tsx';
import { AdministrationStudio } from './components/AdministrationStudio.tsx';
import { TaiwanSurvivalStudio } from './components/TaiwanSurvivalStudio.tsx';
import { ReadingGrammarStudio } from './components/ReadingGrammarStudio.tsx';
import { WacomCalligraphyStudio } from './components/WacomCalligraphyStudio.tsx';
import { SpeakingPitchStudio } from './components/SpeakingPitchStudio.tsx';
import { VocabSrsDojoStudio } from './components/VocabSrsDojoStudio.tsx';
import {
  GlobalOmnibarModal,
  InteractiveHelpManualDrawer,
  SideContextReferenceDock,
} from './components/ShellDrawersAndModals.tsx';

export function speakTaiwanMandarin(text: string, rate: number = 0.92): void {
  speakTaiwaneseSafe(text, rate);
}

const COMPACT_BREAKPOINT_PX = 1180;
const AUTO_COLLAPSE_STUDIOS = new Set<StudioId>(['calligraphy', 'speaking']);

export const App: React.FC = () => {
  const [progress, setProgress] = useState<UserProgressState>(() => loadProgress());
  const [busState, setBusState] = useState<StudioBusState>(() => getStudioBusState());
  const [selectedStage, setSelectedStage] = useState<StageNumber>(() =>
    resolveActiveStageNumber(loadProgress())
  );
  const [resolvedTheme, setResolvedTheme] = useState<ResolvedThemeMode>(() =>
    resolveEffectiveTheme(loadProgress().theme)
  );
  const [isCompactViewport, setIsCompactViewport] = useState<boolean>(() =>
    typeof window !== 'undefined' ? window.innerWidth <= COMPACT_BREAKPOINT_PX : false
  );
  const [navOpen, setNavOpen] = useState<boolean>(() =>
    typeof window !== 'undefined' ? window.innerWidth > COMPACT_BREAKPOINT_PX : true
  );
  const [omnibarOpen, setOmnibarOpen] = useState<boolean>(false);
  const [helpDrawerOpen, setHelpDrawerOpen] = useState<boolean>(false);
  const [sideDockOpen, setSideDockOpen] = useState<boolean>(false);
  const [adminRevision, setAdminRevision] = useState<number>(0);

  const themePref: ThemeMode = progress.theme || 'system';
  const isLeftHanded = progress.handedness === 'left';

  const handleUpdateProgress = useCallback((next: UserProgressState) => {
    setProgress(next);
    saveProgress(next);
  }, []);

  // Resolve ThemeMode ('system' | 'light' | 'dark') live & keep iPadOS theme-color synced (HW-C2, HW-C3)
  useEffect(() => {
    const syncTheme = () => {
      const next = resolveEffectiveTheme(themePref);
      setResolvedTheme(next);
      if (typeof document !== 'undefined') {
        document.documentElement.setAttribute('data-theme', next);
        const meta = document.querySelector('meta[name="theme-color"]');
        if (meta) meta.setAttribute('content', next === 'dark' ? '#0F1115' : '#FAFAFA');
      }
    };
    syncTheme();
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return;
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const listener = () => {
      if (themePref === 'system') syncTheme();
    };
    mq.addEventListener?.('change', listener);
    return () => mq.removeEventListener?.('change', listener);
  }, [themePref]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const onResize = () => {
      const compact = window.innerWidth <= COMPACT_BREAKPOINT_PX;
      setIsCompactViewport((prev) => {
        if (prev !== compact) setNavOpen(!compact);
        return compact;
      });
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  useEffect(() => subscribeStudioBus(setBusState), []);
  useEffect(() => subscribeCurriculumAdminChanges(() => setAdminRevision((r) => r + 1)), []);

  useEffect(() => {
    if (isCompactViewport && AUTO_COLLAPSE_STUDIOS.has(busState.activeStudio)) {
      setNavOpen(false);
    }
  }, [busState.activeStudio, isCompactViewport]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const req = new URLSearchParams(window.location.search).get('studio') as StudioId | null;
    if (req && req in STUDIO_BY_ID) setActiveStudio(req);
  }, []);

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
        if (isCompactViewport) setNavOpen(false);
        return;
      }
      if (e.altKey) {
        if (e.key === '1') { e.preventDefault(); setActiveStudio('hub'); return; }
        if (e.key === '2') { e.preventDefault(); setActiveStudio('syllabus'); return; }
        if (e.key === '3') { e.preventDefault(); setActiveStudio('survival'); return; }
        if (e.key === '4') { e.preventDefault(); setHelpDrawerOpen((h) => !h); return; }
        if (e.key === '5') { e.preventDefault(); setActiveStudio('admin'); return; }
      }
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.key === 'F1' || e.key === '?') {
        e.preventDefault();
        setHelpDrawerOpen((h) => !h);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isCompactViewport]);

  const cycleZhuyinMode = () => {
    const order: ZhuyinDisplayMode[] = ['adaptive', 'always', 'hover_only'];
    const next = order[(order.indexOf(progress.zhuyinDisplayMode) + 1) % order.length];
    handleUpdateProgress({ ...progress, zhuyinDisplayMode: next });
  };

  const cycleTheme = () => {
    const order: ThemeMode[] = ['system', 'light', 'dark'];
    const next = order[(order.indexOf(themePref) + 1) % order.length];
    handleUpdateProgress({ ...progress, theme: next });
  };

  const activeStageNum = resolveActiveStageNumber(progress);
  const dueCount = getDueSrsWords(progress).length;
  const activeStudioMeta = STUDIO_BY_ID[busState.activeStudio] || STUDIO_BY_ID.hub;

  const sidebarNode = (
    <AccordionNavSidebar
      activeStudio={busState.activeStudio}
      selectedStage={selectedStage}
      progress={progress}
      themePref={themePref}
      resolvedTheme={resolvedTheme}
      isLeftHanded={isLeftHanded}
      isCompactViewport={isCompactViewport}
      onSelectStudio={(st) => setActiveStudio(st)}
      onSelectStage={(st) => setSelectedStage(st)}
      onOpenOmnibar={() => setOmnibarOpen(true)}
      onOpenHelp={() => setHelpDrawerOpen(true)}
      onToggleInspector={() => setSideDockOpen((d) => !d)}
      inspectorOpen={sideDockOpen}
      onCycleTheme={cycleTheme}
      onTogglePinyin={() => handleUpdateProgress({ ...progress, showPinyinHint: !progress.showPinyinHint })}
      onCycleZhuyin={cycleZhuyinMode}
      onCloseDrawer={() => setNavOpen(false)}
    />
  );

  return (
    <div
      className={`min-h-screen flex ${isLeftHanded ? 'flex-row-reverse' : 'flex-row'}`}
      style={{ backgroundColor: 'var(--fs-canvas)', color: 'var(--fs-text)' }}
    >
      {!isCompactViewport && navOpen && (
        <div className="sticky top-0 h-screen shrink-0">{sidebarNode}</div>
      )}

      {isCompactViewport && navOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div className="fixed inset-0 fs-modal-backdrop backdrop-blur-xs" onClick={() => setNavOpen(false)} />
          <div className={`relative z-10 h-full ${isLeftHanded ? 'ml-auto' : ''}`}>{sidebarNode}</div>
        </div>
      )}

      <div className="flex-1 min-w-0 flex flex-col">
        <header
          className="sticky top-0 z-30 h-14 px-4 sm:px-6 border-b flex items-center justify-between gap-3 backdrop-blur-md"
          style={{ backgroundColor: 'var(--fs-header-bg)', borderColor: 'var(--fs-border)' }}
        >
          <div className="flex items-center gap-2.5 min-w-0">
            {(!navOpen || isCompactViewport) && (
              <button
                type="button"
                onClick={() => setNavOpen((o) => !o)}
                aria-label="Open navigation menu"
                className="min-h-[44px] min-w-[44px] px-2.5 rounded-lg border text-sm font-medium inline-flex items-center gap-1.5 shrink-0"
                style={{
                  backgroundColor: 'var(--fs-surface)',
                  borderColor: 'var(--fs-border-strong)',
                  color: 'var(--fs-text)',
                }}
              >
                <Menu className="w-4 h-4" />
                <span className="hidden xs:inline">Menu</span>
              </button>
            )}
            <div className="text-sm font-semibold truncate" style={{ color: 'var(--fs-text)' }}>
              {busState.activeStudio === 'syllabus'
                ? `Course Syllabus · Stage ${selectedStage}`
                : activeStudioMeta.titleEn}
              <span className="hidden sm:inline font-normal opacity-55">
                {' '}· {activeStudioMeta.titleZh}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => setOmnibarOpen(true)}
              aria-label="Search Lexicon"
              className="hidden md:inline-flex items-center gap-2 min-h-[36px] px-3 rounded-lg border text-xs font-medium"
              style={{
                backgroundColor: 'var(--fs-surface)',
                borderColor: 'var(--fs-border)',
                color: 'var(--fs-text-muted)',
              }}
            >
              <Search className="w-3.5 h-3.5" />
              <span>Search…</span>
              <kbd className="font-mono text-[11px] opacity-75">Ctrl+K</kbd>
            </button>

            <button
              type="button"
              onClick={() => {
                setSelectedStage(activeStageNum);
                setActiveStudio('syllabus');
              }}
              className="hidden sm:inline-flex items-center min-h-[36px] px-2.5 rounded-lg border text-xs font-medium"
              style={{
                backgroundColor: 'var(--fs-surface)',
                borderColor: 'var(--fs-border)',
                color: 'var(--fs-text-secondary)',
              }}
            >
              Stage {activeStageNum}
            </button>

            {dueCount > 0 && (
              <button
                type="button"
                onClick={() => setActiveStudio('dojo')}
                className="min-h-[36px] px-2.5 rounded-lg border text-xs font-medium"
                style={{
                  backgroundColor: 'var(--fs-warm-soft)',
                  borderColor: 'var(--fs-warm-border)',
                  color: 'var(--fs-warm)',
                }}
              >
                {dueCount} Due
              </button>
            )}

            <StylusButton
              variant={sideDockOpen ? 'secondary' : 'ghost'}
              active={sideDockOpen}
              onClick={() => setSideDockOpen((d) => !d)}
              title="Toggle Word & Zhuyin Inspector"
            >
              <PanelRight className="w-4 h-4" />
              <span className="hidden sm:inline">Inspector</span>
            </StylusButton>
          </div>
        </header>

        <main className="flex-1 w-full max-w-[1160px] mx-auto px-4 sm:px-6 py-5 space-y-5">
          <ReturnBreadcrumbBar
            handoff={busState.activeHandoff}
            onReturn={() => popReturnHandoff()}
            onDismiss={() => dismissStudioHandoff()}
          />

          <div className={`flex flex-col ${isLeftHanded ? 'xl:flex-row-reverse' : 'xl:flex-row'} gap-5 items-start`}>
            <div className="flex-1 w-full min-w-0">
              {busState.activeStudio === 'hub' && (
                <TodayAndCurriculumHub
                  progress={progress}
                  onUpdateProgress={handleUpdateProgress}
                  onOpenAdminModal={() => setActiveStudio('admin')}
                  onOpenSyllabusStage={(st) => {
                    setSelectedStage(st);
                    setActiveStudio('syllabus');
                  }}
                  onSpeak={speakTaiwanMandarin}
                  adminRevision={adminRevision}
                />
              )}
              {busState.activeStudio === 'syllabus' && (
                <SyllabusStageView
                  selectedStage={selectedStage}
                  onSelectStage={setSelectedStage}
                  progress={progress}
                  onUpdateProgress={handleUpdateProgress}
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
                  resolvedTheme={resolvedTheme}
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
              {busState.activeStudio === 'admin' && (
                <AdministrationStudio
                  progress={progress}
                  onUpdateProgress={handleUpdateProgress}
                  onPacksUpdated={() => setAdminRevision((r) => r + 1)}
                  onSpeak={speakTaiwanMandarin}
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

      <GlobalOmnibarModal
        isOpen={omnibarOpen}
        onClose={() => setOmnibarOpen(false)}
        activeStudio={busState.activeStudio}
        adminRevision={adminRevision}
      />
      <InteractiveHelpManualDrawer
        isOpen={helpDrawerOpen}
        onClose={() => setHelpDrawerOpen(false)}
      />
    </div>
  );
};

export default App;
