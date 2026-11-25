/**
 * FormosaStudio (FORM) — v2.0.0 Application Shell (5-Section Expandable Accordion Menu + iPad mini 6 Ergonomics)
 * Auto-collapses navigation on <= 1180px viewports (including iPad mini 6 1133px landscape & 744px portrait)
 * when entering Calligraphy or Speaking labs, with an ALWAYS-VISIBLE "☰ Menu" toggle whenever collapsed (UX-2).
 * Traces to: FORM-ECR-001, FORM-DEC-005, FORM-REQ-0018, FORM-REQ-0020, FORM-REQ-0021, FORM-REQ-0022, FORM-REQ-0023
 */

import React, { useCallback, useEffect, useState } from 'react';
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
  UserProgressState,
  ZhuyinDisplayMode,
  getDueSrsWords,
  loadProgress,
  saveProgress,
} from './lib/progressStore.ts';
import {
  StageNumber,
  resolveActiveStageNumber,
} from './lib/syllabusModel.ts';
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

  const theme = progress.theme === 'dark' ? 'dark' : 'light';
  const isLeftHanded = progress.handedness === 'left';

  const handleUpdateProgress = useCallback((next: UserProgressState) => {
    setProgress(next);
    saveProgress(next);
  }, []);

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('data-theme', theme);
    }
  }, [theme]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const onResize = () => {
      const compact = window.innerWidth <= COMPACT_BREAKPOINT_PX;
      setIsCompactViewport((prev) => {
        if (prev !== compact) {
          setNavOpen(!compact);
        }
        return compact;
      });
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  useEffect(() => subscribeStudioBus(setBusState), []);
  useEffect(() => subscribeCurriculumAdminChanges(() => setAdminRevision((r) => r + 1)), []);

  // Auto-collapse sidebar on iPad mini 6 / compact screens when entering Wacom or Speaking labs (UX-2)
  useEffect(() => {
    if (isCompactViewport && AUTO_COLLAPSE_STUDIOS.has(busState.activeStudio)) {
      setNavOpen(false);
    }
  }, [busState.activeStudio, isCompactViewport]);

  // Support desktop shortcut quick-launch (?studio=...)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const req = new URLSearchParams(window.location.search).get('studio') as StudioId | null;
    if (req && req in STUDIO_BY_ID) setActiveStudio(req);
  }, []);

  // Global keyboard shortcuts (Alt+1..5 top sections, Ctrl+K Omnibar, ?/F1 Help, Esc Close)
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

  const activeStageNum = resolveActiveStageNumber(progress);
  const dueCount = getDueSrsWords(progress).length;
  const activeStudioMeta = STUDIO_BY_ID[busState.activeStudio] || STUDIO_BY_ID.hub;

  const sidebarNode = (
    <AccordionNavSidebar
      activeStudio={busState.activeStudio}
      selectedStage={selectedStage}
      progress={progress}
      theme={theme}
      isLeftHanded={isLeftHanded}
      isCompactViewport={isCompactViewport}
      onSelectStudio={(st) => setActiveStudio(st)}
      onSelectStage={(st) => setSelectedStage(st)}
      onOpenOmnibar={() => setOmnibarOpen(true)}
      onOpenHelp={() => setHelpDrawerOpen(true)}
      onToggleInspector={() => setSideDockOpen((d) => !d)}
      inspectorOpen={sideDockOpen}
      onToggleTheme={() => handleUpdateProgress({ ...progress, theme: theme === 'light' ? 'dark' : 'light' })}
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
      {/* Desktop Docked Sidebar (> 1180px when expanded) */}
      {!isCompactViewport && navOpen && (
        <div className="sticky top-0 h-screen shrink-0">{sidebarNode}</div>
      )}

      {/* Compact / iPad mini 6 Overlay Drawer (<= 1180px when open) */}
      {isCompactViewport && navOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 fs-modal-backdrop backdrop-blur-xs"
            onClick={() => setNavOpen(false)}
          />
          <div className={`relative z-10 h-full ${isLeftHanded ? 'ml-auto' : ''}`}>{sidebarNode}</div>
        </div>
      )}

      {/* Main Content Column */}
      <div className="flex-1 min-w-0 flex flex-col">
        <header
          className="sticky top-0 z-30 h-15 px-4 sm:px-6 border-b flex items-center justify-between gap-3 backdrop-blur-md"
          style={{
            backgroundColor: theme === 'light' ? 'rgba(247, 244, 238, 0.94)' : 'rgba(19, 22, 26, 0.94)',
            borderColor: 'var(--fs-border)',
          }}
        >
          <div className="flex items-center gap-2.5 min-w-0">
            {/* ALWAYS-VISIBLE Menu button whenever collapsed (UX-2: never hidden by lg:hidden!) */}
            {(!navOpen || isCompactViewport) && (
              <button
                type="button"
                onClick={() => setNavOpen((o) => !o)}
                aria-label="Open navigation menu"
                className="min-h-[44px] px-3 py-1.5 rounded-xl border text-sm font-bold shrink-0"
                style={{
                  backgroundColor: 'var(--fs-surface)',
                  borderColor: 'var(--fs-border-strong)',
                  color: 'var(--fs-text)',
                }}
              >
                ☰ Menu
              </button>
            )}
            <div className="min-w-0">
              <div className="text-sm sm:text-base font-bold truncate" style={{ color: 'var(--fs-text)' }}>
                {busState.activeStudio === 'syllabus'
                  ? `Course Syllabus · Stage ${selectedStage}`
                  : activeStudioMeta.titleEn}
                <span className="hidden sm:inline font-medium text-sm opacity-65">
                  {' '}· {activeStudioMeta.titleZh}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => {
                setSelectedStage(activeStageNum);
                setActiveStudio('syllabus');
              }}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-semibold"
              style={{
                backgroundColor: 'var(--fs-surface)',
                borderColor: 'var(--fs-border)',
                color: 'var(--fs-text-secondary)',
              }}
            >
              <span>Active: Stage {activeStageNum}</span>
            </button>

            {dueCount > 0 && (
              <button
                type="button"
                onClick={() => setActiveStudio('dojo')}
                className="px-2.5 py-1.5 rounded-full border text-xs font-semibold"
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
              variant={sideDockOpen ? 'primary' : 'ghost'}
              onClick={() => setSideDockOpen((d) => !d)}
              title="Toggle Contextual Word & Zhuyin Inspector"
            >
              <span>{sideDockOpen ? 'Hide Dock' : 'Inspector'}</span>
            </StylusButton>
          </div>
        </header>

        <main className="flex-1 w-full max-w-[1220px] mx-auto px-4 sm:px-6 py-5 space-y-5">
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

      {/* Global Modals & Drawers */}
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
