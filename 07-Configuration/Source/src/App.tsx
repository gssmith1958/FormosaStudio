/**
 * FormosaStudio (FORM) — Unified 6-Studio Application Shell
 * Integrates all 6 permanent studios, Cross-Studio Context Handoff Bus, Return Breadcrumb Bar,
 * Global Omnibar (Ctrl+K), Collapsible Side Reference Dock, Resource Admin Modal, and In-App Help/Manual Drawer (? / F1).
 * Traces to: FORM-REQ-0018, FORM-REQ-0020, FORM-REQ-0021, FORM-REQ-0022, FORM-REQ-0023, FORM-DEC-004, FORM-DEP-UX-001
 */

import React, { useCallback, useEffect, useState } from 'react';
import {
  STUDIO_DEFINITIONS,
  StudioBusState,
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
import { subscribeCurriculumAdminChanges } from './lib/curriculumAdminStore.ts';
import {
  HandednessToggle,
  ReturnBreadcrumbBar,
  StylusButton,
} from './components/uiPrimitives.tsx';
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

export const App: React.FC = () => {
  const [progress, setProgress] = useState<UserProgressState>(() => loadProgress());
  const [busState, setBusState] = useState<StudioBusState>(() => getStudioBusState());
  const [omnibarOpen, setOmnibarOpen] = useState<boolean>(false);
  const [adminModalOpen, setAdminModalOpen] = useState<boolean>(false);
  const [helpDrawerOpen, setHelpDrawerOpen] = useState<boolean>(false);
  const [sideDockOpen, setSideDockOpen] = useState<boolean>(true);
  const [adminRevision, setAdminRevision] = useState<number>(0);

  const handleUpdateProgress = useCallback((next: UserProgressState) => {
    setProgress(next);
    saveProgress(next);
  }, []);

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
        return;
      }
      if (e.altKey && e.key >= '1' && e.key <= '6') {
        e.preventDefault();
        const idx = Number(e.key) - 1;
        const target = STUDIO_DEFINITIONS[idx];
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

  const dueCount = getDueSrsWords(progress).length;

  return (
    <div className="min-h-screen bg-[#0F172A] text-slate-100 flex flex-col">
      {/* Unified Top Shell Header & Single-Row 6-Studio Navigation Bar */}
      <header className="sticky top-0 z-40 bg-slate-950/95 backdrop-blur-md border-b border-slate-800 px-4 py-3 space-y-3 shadow-lg">
        <div className="max-w-[1600px] mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500 text-slate-950 font-black text-xl flex items-center justify-center shadow">
              臺
            </div>
            <div>
              <div className="text-base sm:text-lg font-extrabold text-white tracking-tight">
                FormosaStudio <span className="text-emerald-400">· 寶島華語正體與注音全能工坊</span>
              </div>
              <div className="text-[11px] text-slate-400">
                Taiwan MOE Standard Traditional Chinese · Vertical Zhuyin · Wacom Calligraphy · Offline YIN F0 Pitch Lab
              </div>
            </div>
          </div>

          {/* Global Telemetry & Quick Utility Controls */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-extrabold text-amber-300">
              🔥 Streak {progress.streak}d · ⭐ {progress.xp} XP · 🃏 Due {dueCount}
            </span>
            <StylusButton variant="secondary" onClick={cycleZhuyinMode} title="Cycle Vertical Zhuyin Ruby Display Policy">
              <span>注音: {progress.zhuyinDisplayMode.toUpperCase()}</span>
            </StylusButton>
            <HandednessToggle
              handedness={progress.handedness}
              onToggle={(next) => handleUpdateProgress({ ...progress, handedness: next })}
            />
            <StylusButton
              variant="secondary"
              shortcutHint="Ctrl+K"
              onClick={() => setOmnibarOpen(true)}
            >
              <span>🔍 Omnibar</span>
            </StylusButton>
            <StylusButton
              variant="amber"
              onClick={() => setAdminModalOpen(true)}
              title="Import additional Pimsleur units or NTNU Contemporary Chinese lessons"
            >
              <span>⚙️ Resource Admin</span>
            </StylusButton>
            <StylusButton
              variant={sideDockOpen ? 'primary' : 'secondary'}
              onClick={() => setSideDockOpen((d) => !d)}
            >
              <span>📌 Context Dock</span>
            </StylusButton>
            <StylusButton
              variant="secondary"
              shortcutHint="?"
              onClick={() => setHelpDrawerOpen(true)}
            >
              <span>📘 Manual</span>
            </StylusButton>
          </div>
        </div>

        {/* Single-Row Permanent 6-Studio Navigation Bar (Strictly <= 8 Ceiling per FORM-REQ-0018 & FORM-DEC-004) */}
        <nav
          aria-label="Primary 6-Studio Navigation"
          className="max-w-[1600px] mx-auto grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2"
        >
          {STUDIO_DEFINITIONS.map((st) => {
            const active = busState.activeStudio === st.id;
            return (
              <button
                key={st.id}
                type="button"
                onClick={() => setActiveStudio(st.id)}
                style={{ minHeight: '46px', touchAction: 'manipulation' }}
                className={`px-3.5 py-2 rounded-2xl border text-left transition flex items-center justify-between gap-2 ${
                  active
                    ? 'bg-emerald-500 text-slate-950 border-emerald-300 font-black shadow-lg'
                    : 'bg-slate-900/90 hover:bg-slate-800 text-slate-200 border-slate-800 font-bold'
                }`}
              >
                <div className="truncate">
                  <div className="text-xs sm:text-sm font-extrabold truncate">{st.titleZh}</div>
                  <div className={`text-[11px] truncate ${active ? 'text-slate-900 font-semibold' : 'text-slate-400'}`}>
                    {st.shortLabel}
                  </div>
                </div>
                <kbd
                  className={`px-1.5 py-0.5 rounded text-[10px] font-mono shrink-0 ${
                    active ? 'bg-slate-950 text-emerald-300' : 'bg-slate-950 text-slate-400'
                  }`}
                >
                  {st.shortcut}
                </kbd>
              </button>
            );
          })}
        </nav>
      </header>

      {/* Main Workspace Container + Persistent Return Breadcrumb + Collapsible Side Reference Dock */}
      <main className="max-w-[1600px] w-full mx-auto flex-1 px-4 py-5 space-y-4">
        <ReturnBreadcrumbBar
          handoff={busState.activeHandoff}
          onReturn={() => popReturnHandoff()}
          onDismiss={() => dismissStudioHandoff()}
        />

        <div className={`flex flex-col ${progress.handedness === 'left' ? 'xl:flex-row-reverse' : 'xl:flex-row'} gap-6 items-start`}>
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

          <SideContextReferenceDock
            focusedItem={busState.focusedItem}
            activeStudio={busState.activeStudio}
            isOpen={sideDockOpen}
            onToggle={() => setSideDockOpen((d) => !d)}
            onSpeak={speakTaiwanMandarin}
          />
        </div>
      </main>

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
