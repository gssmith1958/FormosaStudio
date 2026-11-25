/**
 * FormosaStudio (FORM) — Flush Modern 5-Section Accordion Navigation Rail (v2.1.0 Crisp Neutral Studio)
 * Antigravity-inspired flush rail: zero boxed menu cards, hairline dividers, 16px Lucide monoline icons,
 * 40px desktop fine-pointer rows & >= 44px touch/iPad mini 6 targets (UX-C1..4, HW-C1).
 * Traces to: FORM-ECR-001, FORM-DEC-005, FORM-WF-001
 */

import React, { useEffect, useState } from 'react';
import {
  BookOpen,
  CalendarCheck,
  ChevronDown,
  ChevronRight,
  Compass,
  FileText,
  FlaskConical,
  GraduationCap,
  HelpCircle,
  Keyboard,
  Mic,
  Monitor,
  Moon,
  PanelRight,
  PenTool,
  Search,
  Settings,
  Sun,
  X,
} from 'lucide-react';
import { StudioId } from '../lib/studioContextBus.ts';
import { SYLLABUS_STAGES, StageNumber, getStageProgressDetail } from '../lib/syllabusModel.ts';
import {
  ResolvedThemeMode,
  ThemeMode,
  UserProgressState,
  getTodayProgressSummary,
} from '../lib/progressStore.ts';

export interface AccordionNavSidebarProps {
  activeStudio: StudioId;
  selectedStage: StageNumber;
  progress: UserProgressState;
  themePref: ThemeMode;
  resolvedTheme: ResolvedThemeMode;
  isLeftHanded: boolean;
  isCompactViewport: boolean;
  onSelectStudio: (studio: StudioId) => void;
  onSelectStage: (stage: StageNumber) => void;
  onOpenOmnibar: () => void;
  onOpenHelp: () => void;
  onToggleInspector: () => void;
  inspectorOpen: boolean;
  onCycleTheme: () => void;
  onTogglePinyin: () => void;
  onCycleZhuyin: () => void;
  onCloseDrawer: () => void;
}

const PRACTICE_LABS: { id: StudioId; Icon: React.FC<{ className?: string }>; nameEn: string }[] = [
  { id: 'survival', Icon: Compass, nameEn: 'Taiwan Survival' },
  { id: 'reader', Icon: FileText, nameEn: 'Reader & Grammar' },
  { id: 'calligraphy', Icon: PenTool, nameEn: 'Wacom Strokes' },
  { id: 'speaking', Icon: Mic, nameEn: 'Speaking & Pitch' },
  { id: 'dojo', Icon: Keyboard, nameEn: 'Vocab & DaQian' },
];

const LAB_IDS = new Set<StudioId>(PRACTICE_LABS.map((l) => l.id));

export const AccordionNavSidebar: React.FC<AccordionNavSidebarProps> = ({
  activeStudio,
  selectedStage,
  progress,
  themePref,
  isLeftHanded,
  isCompactViewport,
  onSelectStudio,
  onSelectStage,
  onOpenOmnibar,
  onOpenHelp,
  onToggleInspector,
  inspectorOpen,
  onCycleTheme,
  onTogglePinyin,
  onCycleZhuyin,
  onCloseDrawer,
}) => {
  const [syllabusOpen, setSyllabusOpen] = useState<boolean>(activeStudio === 'syllabus');
  const [labsOpen, setLabsOpen] = useState<boolean>(LAB_IDS.has(activeStudio));
  const [refOpen, setRefOpen] = useState<boolean>(false);

  useEffect(() => {
    if (activeStudio === 'syllabus') setSyllabusOpen(true);
    if (LAB_IDS.has(activeStudio)) setLabsOpen(true);
  }, [activeStudio]);

  const today = getTodayProgressSummary(progress);

  const navAndClose = (fn: () => void) => {
    fn();
    if (isCompactViewport) onCloseDrawer();
  };

  const ThemeIcon = themePref === 'system' ? Monitor : themePref === 'dark' ? Moon : Sun;
  const themeLabel = themePref === 'system' ? 'Auto' : themePref === 'dark' ? 'Dark' : 'Light';

  return (
    <aside
      aria-label="FormosaStudio Navigation"
      className={`flex flex-col w-[264px] max-w-[84vw] shrink-0 h-full overflow-y-auto px-3 py-3 justify-between gap-3 ${
        isCompactViewport ? 'shadow-2xl' : isLeftHanded ? 'border-l' : 'border-r'
      }`}
      style={{ backgroundColor: 'var(--fs-sidebar)', borderColor: 'var(--fs-border)' }}
    >
      <div className="space-y-3">
        {/* Clean Brand Header */}
        <div className="flex items-center justify-between px-1.5 py-0.5">
          <div className="flex items-center gap-2.5 min-w-0">
            <div
              className="w-8 h-8 rounded-lg font-bold text-base flex items-center justify-center shrink-0 fs-on-accent"
              style={{ backgroundColor: 'var(--fs-accent)' }}
            >
              臺
            </div>
            <div className="min-w-0">
              <div className="text-[14px] font-semibold tracking-tight truncate" style={{ color: 'var(--fs-text)' }}>
                FormosaStudio
              </div>
              <div className="text-[11.5px] truncate" style={{ color: 'var(--fs-text-muted)' }}>
                臺灣華語 · Taiwan Mandarin
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={onCloseDrawer}
            aria-label="Collapse navigation menu"
            className="fs-nav-row w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
            style={{ color: 'var(--fs-text-muted)' }}
            title="Collapse Menu"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Quiet Inline Daily Goal Progress Strip (no heavy outer box) */}
        <button
          type="button"
          onClick={() => navAndClose(() => onSelectStudio('hub'))}
          className="w-full text-left px-2.5 py-2 rounded-lg transition hover:opacity-90"
          style={{ backgroundColor: 'var(--fs-surface)', border: '1px solid var(--fs-border)' }}
        >
          <div className="flex items-center justify-between text-xs font-medium mb-1.5">
            <span style={{ color: 'var(--fs-text-secondary)' }}>Daily Goal</span>
            <span style={{ color: 'var(--fs-accent-text)' }}>
              {today.minutesCompleted}/{today.goalMinutes} min · {progress.streak}d
            </span>
          </div>
          <div className="w-full h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--fs-hover)' }}>
            <div
              className="h-full rounded-full transition-all duration-300"
              style={{ width: `${today.percentComplete}%`, backgroundColor: 'var(--fs-accent)' }}
            />
          </div>
        </button>

        {/* FLUSH 5-SECTION NAVIGATION RAIL */}
        <nav className="space-y-0.5">
          {/* 1. Today's Session */}
          <button
            type="button"
            onClick={() => navAndClose(() => onSelectStudio('hub'))}
            style={{
              backgroundColor: activeStudio === 'hub' ? 'var(--fs-accent-soft)' : undefined,
              color: activeStudio === 'hub' ? 'var(--fs-accent-text)' : 'var(--fs-text)',
            }}
            className="fs-nav-row w-full px-2.5 py-1.5 rounded-lg text-left flex items-center justify-between gap-2"
          >
            <span className="flex items-center gap-2.5 min-w-0">
              <CalendarCheck className="w-4 h-4 shrink-0 opacity-85" />
              <span className={`text-[13.5px] truncate ${activeStudio === 'hub' ? 'font-semibold' : 'font-medium'}`}>
                Today’s Session
              </span>
            </span>
            <kbd className="text-[11px] font-mono opacity-55 shrink-0">Alt+1</kbd>
          </button>

          {/* 2. Course Syllabus (Flush Expandable Stages 0–5) */}
          <div>
            <button
              type="button"
              aria-expanded={syllabusOpen}
              aria-controls="nav-syllabus-panel"
              onClick={() => setSyllabusOpen((o) => !o)}
              style={{
                backgroundColor: activeStudio === 'syllabus' && !syllabusOpen ? 'var(--fs-accent-soft)' : undefined,
                color: activeStudio === 'syllabus' ? 'var(--fs-accent-text)' : 'var(--fs-text)',
              }}
              className="fs-nav-row w-full px-2.5 py-1.5 rounded-lg text-left flex items-center justify-between gap-2"
            >
              <span className="flex items-center gap-2.5 min-w-0">
                <GraduationCap className="w-4 h-4 shrink-0 opacity-85" />
                <span className={`text-[13.5px] truncate ${activeStudio === 'syllabus' ? 'font-semibold' : 'font-medium'}`}>
                  Course Syllabus
                </span>
              </span>
              {syllabusOpen ? <ChevronDown className="w-4 h-4 opacity-60 shrink-0" /> : <ChevronRight className="w-4 h-4 opacity-60 shrink-0" />}
            </button>

            {syllabusOpen && (
              <div id="nav-syllabus-panel" className="ml-4 pl-2.5 mt-0.5 mb-1 border-l space-y-0.5" style={{ borderColor: 'var(--fs-border-strong)' }}>
                {SYLLABUS_STAGES.map((st) => {
                  const detail = getStageProgressDetail(st.stageNumber, progress);
                  const isActiveStage = activeStudio === 'syllabus' && selectedStage === st.stageNumber;
                  return (
                    <button
                      key={st.id}
                      type="button"
                      onClick={() =>
                        navAndClose(() => {
                          onSelectStage(st.stageNumber);
                          onSelectStudio('syllabus');
                        })
                      }
                      style={{
                        backgroundColor: isActiveStage ? 'var(--fs-accent-soft)' : undefined,
                        color: isActiveStage ? 'var(--fs-accent-text)' : 'var(--fs-text-secondary)',
                      }}
                      className="fs-nav-row w-full px-2.5 py-1 rounded-md text-left flex items-center justify-between gap-2"
                    >
                      <span className={`text-[13px] truncate ${isActiveStage ? 'font-semibold' : 'font-normal'}`}>
                        Stage {st.stageNumber} · {st.stageNumber === 0 ? 'Foundations' : st.cefrLabel}
                      </span>
                      <span className="text-[11px] font-medium shrink-0" style={{ color: detail.checkpointPassed ? 'var(--fs-accent-text)' : 'var(--fs-text-muted)' }}>
                        {detail.checkpointPassed ? '✓' : `${detail.percent}%`}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* 3. Practice Labs (Flush Expandable 5 Labs) */}
          <div>
            <button
              type="button"
              aria-expanded={labsOpen}
              aria-controls="nav-labs-panel"
              onClick={() => setLabsOpen((o) => !o)}
              style={{
                backgroundColor: LAB_IDS.has(activeStudio) && !labsOpen ? 'var(--fs-accent-soft)' : undefined,
                color: LAB_IDS.has(activeStudio) ? 'var(--fs-accent-text)' : 'var(--fs-text)',
              }}
              className="fs-nav-row w-full px-2.5 py-1.5 rounded-lg text-left flex items-center justify-between gap-2"
            >
              <span className="flex items-center gap-2.5 min-w-0">
                <FlaskConical className="w-4 h-4 shrink-0 opacity-85" />
                <span className={`text-[13.5px] truncate ${LAB_IDS.has(activeStudio) ? 'font-semibold' : 'font-medium'}`}>
                  Practice Labs
                </span>
              </span>
              {labsOpen ? <ChevronDown className="w-4 h-4 opacity-60 shrink-0" /> : <ChevronRight className="w-4 h-4 opacity-60 shrink-0" />}
            </button>

            {labsOpen && (
              <div id="nav-labs-panel" className="ml-4 pl-2.5 mt-0.5 mb-1 border-l space-y-0.5" style={{ borderColor: 'var(--fs-border-strong)' }}>
                {PRACTICE_LABS.map(({ id, Icon, nameEn }) => {
                  const active = activeStudio === id;
                  return (
                    <button
                      key={id}
                      type="button"
                      onClick={() => navAndClose(() => onSelectStudio(id))}
                      style={{
                        backgroundColor: active ? 'var(--fs-accent-soft)' : undefined,
                        color: active ? 'var(--fs-accent-text)' : 'var(--fs-text-secondary)',
                      }}
                      className="fs-nav-row w-full px-2.5 py-1 rounded-md text-left flex items-center gap-2"
                    >
                      <Icon className="w-3.5 h-3.5 shrink-0 opacity-80" />
                      <span className={`text-[13px] truncate ${active ? 'font-semibold' : 'font-normal'}`}>{nameEn}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* 4. Reference & Help */}
          <div>
            <button
              type="button"
              aria-expanded={refOpen}
              aria-controls="nav-reference-panel"
              onClick={() => setRefOpen((o) => !o)}
              style={{ color: 'var(--fs-text)' }}
              className="fs-nav-row w-full px-2.5 py-1.5 rounded-lg text-left flex items-center justify-between gap-2"
            >
              <span className="flex items-center gap-2.5 min-w-0">
                <BookOpen className="w-4 h-4 shrink-0 opacity-85" />
                <span className="text-[13.5px] font-medium truncate">Reference &amp; Help</span>
              </span>
              {refOpen ? <ChevronDown className="w-4 h-4 opacity-60 shrink-0" /> : <ChevronRight className="w-4 h-4 opacity-60 shrink-0" />}
            </button>
            {refOpen && (
              <div id="nav-reference-panel" className="ml-4 pl-2.5 mt-0.5 mb-1 border-l space-y-0.5" style={{ borderColor: 'var(--fs-border-strong)' }}>
                <button
                  type="button"
                  onClick={() => navAndClose(onOpenOmnibar)}
                  style={{ color: 'var(--fs-text-secondary)' }}
                  className="fs-nav-row w-full px-2.5 py-1 rounded-md text-[13px] flex items-center justify-between"
                >
                  <span className="flex items-center gap-2"><Search className="w-3.5 h-3.5" />Search Lexicon</span>
                  <kbd className="font-mono text-[11px] opacity-60">Ctrl+K</kbd>
                </button>
                <button
                  type="button"
                  onClick={() => navAndClose(onToggleInspector)}
                  style={{ color: 'var(--fs-text-secondary)' }}
                  className="fs-nav-row w-full px-2.5 py-1 rounded-md text-[13px] flex items-center justify-between"
                >
                  <span className="flex items-center gap-2"><PanelRight className="w-3.5 h-3.5" />Inspector Dock</span>
                  <span className="text-[11px] font-medium opacity-75">{inspectorOpen ? 'On' : 'Off'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => navAndClose(onOpenHelp)}
                  style={{ color: 'var(--fs-text-secondary)' }}
                  className="fs-nav-row w-full px-2.5 py-1 rounded-md text-[13px] flex items-center justify-between"
                >
                  <span className="flex items-center gap-2"><HelpCircle className="w-3.5 h-3.5" />User’s Manual</span>
                  <kbd className="font-mono text-[11px] opacity-60">?</kbd>
                </button>
              </div>
            )}
          </div>

          {/* 5. Standalone Administration (Separated by Hairline) */}
          <div className="pt-2 mt-2 border-t fs-divider">
            <button
              type="button"
              onClick={() => navAndClose(() => onSelectStudio('admin'))}
              style={{
                backgroundColor: activeStudio === 'admin' ? 'var(--fs-accent-soft)' : undefined,
                color: activeStudio === 'admin' ? 'var(--fs-accent-text)' : 'var(--fs-text)',
              }}
              className="fs-nav-row w-full px-2.5 py-1.5 rounded-lg text-left flex items-center justify-between gap-2"
            >
              <span className="flex items-center gap-2.5 min-w-0">
                <Settings className="w-4 h-4 shrink-0 opacity-85" />
                <span className={`text-[13.5px] truncate ${activeStudio === 'admin' ? 'font-semibold' : 'font-medium'}`}>
                  Administration
                </span>
              </span>
              <kbd className="text-[11px] font-mono opacity-55 shrink-0">Alt+5</kbd>
            </button>
          </div>
        </nav>
      </div>

      {/* Flush Quick Footer Toggles (strictly >= 44px on touch/compact per HW-C1) */}
      <div className="pt-2 border-t fs-divider grid grid-cols-3 gap-1">
        <button
          type="button"
          onClick={onCycleTheme}
          className="fs-nav-row px-1.5 rounded-lg text-xs font-medium inline-flex items-center justify-center gap-1"
          style={{ color: 'var(--fs-text-secondary)' }}
          title={`Theme: ${themePref} (click to cycle Auto / Light / Dark)`}
        >
          <ThemeIcon className="w-3.5 h-3.5 shrink-0" />
          <span>{themeLabel}</span>
        </button>
        <button
          type="button"
          onClick={onCycleZhuyin}
          className="fs-nav-row px-1.5 rounded-lg text-xs font-medium truncate"
          style={{ color: 'var(--fs-text-secondary)' }}
          title="Cycle Zhuyin display mode"
        >
          {progress.zhuyinDisplayMode === 'adaptive' ? '注音 Auto' : progress.zhuyinDisplayMode === 'always' ? '注音 On' : '注音 Peek'}
        </button>
        <button
          type="button"
          onClick={onTogglePinyin}
          className="fs-nav-row px-1.5 rounded-lg text-xs font-medium"
          style={{
            backgroundColor: progress.showPinyinHint ? 'var(--fs-accent-soft)' : undefined,
            color: progress.showPinyinHint ? 'var(--fs-accent-text)' : 'var(--fs-text-secondary)',
          }}
          title="Toggle Pinyin hints"
        >
          Pin {progress.showPinyinHint ? 'On' : 'Off'}
        </button>
      </div>
    </aside>
  );
};
