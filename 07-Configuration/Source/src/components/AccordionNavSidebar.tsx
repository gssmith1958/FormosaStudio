/**
 * FormosaStudio (FORM) — 5-Section Modern Expandable Accordion Navigation Sidebar
 * Consolidates navigation into: Today's Session, Course Syllabus (Stages 0-5), Practice Labs (5),
 * Reference & Help, and standalone Administration. Adapts cleanly to Desktop and iPad mini 6 (<=1180px).
 * Traces to: FORM-ECR-001, FORM-DEC-005, FORM-WF-001, UX-1, UX-2
 */

import React, { useEffect, useState } from 'react';
import { StudioId } from '../lib/studioContextBus.ts';
import { SYLLABUS_STAGES, StageNumber, getStageProgressDetail } from '../lib/syllabusModel.ts';
import {
  ThemeMode,
  UserProgressState,
  getTodayProgressSummary,
} from '../lib/progressStore.ts';

export interface AccordionNavSidebarProps {
  activeStudio: StudioId;
  selectedStage: StageNumber;
  progress: UserProgressState;
  theme: ThemeMode;
  isLeftHanded: boolean;
  isCompactViewport: boolean;
  onSelectStudio: (studio: StudioId) => void;
  onSelectStage: (stage: StageNumber) => void;
  onOpenOmnibar: () => void;
  onOpenHelp: () => void;
  onToggleInspector: () => void;
  inspectorOpen: boolean;
  onToggleTheme: () => void;
  onTogglePinyin: () => void;
  onCycleZhuyin: () => void;
  onCloseDrawer: () => void;
}

const PRACTICE_LABS: { id: StudioId; icon: string; nameEn: string; nameZh: string }[] = [
  { id: 'survival', icon: '⌖', nameEn: 'Taiwan Survival', nameZh: '臺灣生存與點菜單' },
  { id: 'reader', icon: '▤', nameEn: 'Reader & Grammar', nameZh: '分級閱讀與語法' },
  { id: 'calligraphy', icon: '✎', nameEn: 'Wacom Strokes', nameZh: '書法筆順畫布' },
  { id: 'speaking', icon: '◉', nameEn: 'Speaking & Pitch', nameZh: '聲調音高實驗室' },
  { id: 'dojo', icon: '⊞', nameEn: 'Vocab & DaQian', nameZh: '詞彙與大千打字' },
];

const LAB_IDS = new Set<StudioId>(PRACTICE_LABS.map((l) => l.id));

export const AccordionNavSidebar: React.FC<AccordionNavSidebarProps> = ({
  activeStudio,
  selectedStage,
  progress,
  theme,
  isLeftHanded,
  isCompactViewport,
  onSelectStudio,
  onSelectStage,
  onOpenOmnibar,
  onOpenHelp,
  onToggleInspector,
  inspectorOpen,
  onToggleTheme,
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

  return (
    <aside
      aria-label="FormosaStudio 5-Section Navigation"
      className={`flex flex-col w-[292px] max-w-[86vw] shrink-0 h-full overflow-y-auto px-4 py-4 justify-between gap-4 ${
        isCompactViewport ? 'shadow-2xl' : isLeftHanded ? 'border-l' : 'border-r'
      }`}
      style={{ backgroundColor: 'var(--fs-sidebar)', borderColor: 'var(--fs-border)' }}
    >
      <div className="space-y-3.5">
        {/* Brand Header */}
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2.5">
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
                臺灣華語 · v2.0 Syllabus
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={onCloseDrawer}
            aria-label="Collapse navigation menu"
            className="min-h-[44px] min-w-[44px] rounded-xl flex items-center justify-center text-sm font-bold border"
            style={{ borderColor: 'var(--fs-border)', color: 'var(--fs-text-secondary)' }}
            title="Collapse Menu"
          >
            ✕
          </button>
        </div>

        {/* Live Today's Goal Compact Card */}
        <button
          type="button"
          onClick={() => navAndClose(() => onSelectStudio('hub'))}
          className="w-full text-left rounded-2xl p-3 border transition"
          style={{ backgroundColor: 'var(--fs-surface)', borderColor: 'var(--fs-border)' }}
        >
          <div className="flex items-center justify-between text-xs font-semibold mb-1.5">
            <span style={{ color: 'var(--fs-text-secondary)' }}>Today’s Adaptive Goal</span>
            <span style={{ color: 'var(--fs-accent-text)' }}>
              {today.minutesCompleted}/{today.goalMinutes}m
            </span>
          </div>
          <div className="w-full h-2 rounded-full overflow-hidden mb-1.5" style={{ backgroundColor: 'var(--fs-subtle)' }}>
            <div className="h-full rounded-full transition-all duration-300" style={{ width: `${today.percentComplete}%`, backgroundColor: 'var(--fs-accent)' }} />
          </div>
          <div className="flex items-center justify-between text-[11px]" style={{ color: 'var(--fs-text-muted)' }}>
            <span>{today.stepsCompleted.length}/3 daily steps</span>
            <span>Streak {progress.streak}d</span>
          </div>
        </button>

        {/* 5-SECTION EXPANDABLE ACCORDION MENU */}
        <nav className="space-y-1.5">
          {/* 1. Today's Session */}
          <button
            type="button"
            onClick={() => navAndClose(() => onSelectStudio('hub'))}
            style={{
              minHeight: '44px',
              touchAction: 'manipulation',
              backgroundColor: activeStudio === 'hub' ? 'var(--fs-accent-soft)' : 'transparent',
              color: activeStudio === 'hub' ? 'var(--fs-accent-text)' : 'var(--fs-text)',
              borderColor: activeStudio === 'hub' ? 'var(--fs-accent-border)' : 'transparent',
            }}
            className="w-full px-3 py-2 rounded-xl border text-left transition flex items-center justify-between gap-2"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <span className="text-base shrink-0">◎</span>
              <div className="min-w-0">
                <div className={`text-sm truncate ${activeStudio === 'hub' ? 'font-bold' : 'font-semibold'}`}>
                  1. Today’s Session
                </div>
                <div className="text-[11px]" style={{ color: 'var(--fs-text-muted)' }}>今日自適應 10 分鐘</div>
              </div>
            </div>
            <kbd className="px-1.5 py-0.5 rounded text-[10px] font-mono" style={{ backgroundColor: 'var(--fs-hover)', color: 'var(--fs-text-muted)' }}>
              Alt+1
            </kbd>
          </button>

          {/* 2. Course Syllabus (Expandable Stages 0–5) */}
          <div className="rounded-xl border overflow-hidden" style={{ borderColor: activeStudio === 'syllabus' ? 'var(--fs-accent-border)' : 'var(--fs-border)' }}>
            <button
              type="button"
              aria-expanded={syllabusOpen}
              aria-controls="nav-syllabus-panel"
              onClick={() => setSyllabusOpen((o) => !o)}
              style={{
                minHeight: '44px',
                touchAction: 'manipulation',
                backgroundColor: activeStudio === 'syllabus' ? 'var(--fs-accent-soft)' : 'var(--fs-surface)',
                color: activeStudio === 'syllabus' ? 'var(--fs-accent-text)' : 'var(--fs-text)',
              }}
              className="w-full px-3 py-2 text-left transition flex items-center justify-between gap-2"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <span className="text-base shrink-0">▤</span>
                <div className="min-w-0">
                  <div className="text-sm font-semibold truncate">2. Course Syllabus</div>
                  <div className="text-[11px]" style={{ color: 'var(--fs-text-muted)' }}>課程大綱 · Stages 0–5</div>
                </div>
              </div>
              <span className="text-xs font-bold shrink-0">{syllabusOpen ? '▾' : '▸'}</span>
            </button>

            {syllabusOpen && (
              <div id="nav-syllabus-panel" className="p-1.5 space-y-1 border-t" style={{ backgroundColor: 'var(--fs-subtle)', borderColor: 'var(--fs-border)' }}>
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
                        minHeight: '44px',
                        touchAction: 'manipulation',
                        backgroundColor: isActiveStage ? 'var(--fs-surface)' : 'transparent',
                        borderColor: isActiveStage ? 'var(--fs-accent-border)' : 'transparent',
                      }}
                      className="w-full px-2.5 py-1.5 rounded-lg border text-left flex items-center justify-between gap-2 transition"
                    >
                      <div className="min-w-0">
                        <div className={`text-xs truncate ${isActiveStage ? 'font-bold' : 'font-medium'}`} style={{ color: isActiveStage ? 'var(--fs-accent-text)' : 'var(--fs-text)' }}>
                          Stage {st.stageNumber}: {st.stageNumber === 0 ? 'Start From Zero' : st.titleEn}
                        </div>
                        <div className="text-[10px] truncate" style={{ color: 'var(--fs-text-muted)' }}>
                          {st.cefrLabel} · {detail.completedUnits}/{detail.totalUnits}
                        </div>
                      </div>
                      <span className="text-[11px] font-bold shrink-0" style={{ color: detail.checkpointPassed ? 'var(--fs-accent-text)' : 'var(--fs-text-muted)' }}>
                        {detail.checkpointPassed ? '✓' : `${detail.percent}%`}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* 3. Practice Labs (Expandable 5 Labs) */}
          <div className="rounded-xl border overflow-hidden" style={{ borderColor: LAB_IDS.has(activeStudio) ? 'var(--fs-accent-border)' : 'var(--fs-border)' }}>
            <button
              type="button"
              aria-expanded={labsOpen}
              aria-controls="nav-labs-panel"
              onClick={() => setLabsOpen((o) => !o)}
              style={{
                minHeight: '44px',
                touchAction: 'manipulation',
                backgroundColor: LAB_IDS.has(activeStudio) ? 'var(--fs-accent-soft)' : 'var(--fs-surface)',
                color: LAB_IDS.has(activeStudio) ? 'var(--fs-accent-text)' : 'var(--fs-text)',
              }}
              className="w-full px-3 py-2 text-left transition flex items-center justify-between gap-2"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <span className="text-base shrink-0">✎</span>
                <div className="min-w-0">
                  <div className="text-sm font-semibold truncate">3. Practice Labs</div>
                  <div className="text-[11px]" style={{ color: 'var(--fs-text-muted)' }}>專項練習室 · 5 Tools</div>
                </div>
              </div>
              <span className="text-xs font-bold shrink-0">{labsOpen ? '▾' : '▸'}</span>
            </button>

            {labsOpen && (
              <div id="nav-labs-panel" className="p-1.5 space-y-1 border-t" style={{ backgroundColor: 'var(--fs-subtle)', borderColor: 'var(--fs-border)' }}>
                {PRACTICE_LABS.map((lab) => {
                  const active = activeStudio === lab.id;
                  return (
                    <button
                      key={lab.id}
                      type="button"
                      onClick={() => navAndClose(() => onSelectStudio(lab.id))}
                      style={{
                        minHeight: '44px',
                        touchAction: 'manipulation',
                        backgroundColor: active ? 'var(--fs-surface)' : 'transparent',
                        borderColor: active ? 'var(--fs-accent-border)' : 'transparent',
                      }}
                      className="w-full px-2.5 py-1.5 rounded-lg border text-left flex items-center gap-2.5 transition"
                    >
                      <span className="text-sm shrink-0 opacity-80">{lab.icon}</span>
                      <div className="min-w-0">
                        <div className={`text-xs truncate ${active ? 'font-bold' : 'font-medium'}`} style={{ color: active ? 'var(--fs-accent-text)' : 'var(--fs-text)' }}>
                          {lab.nameEn}
                        </div>
                        <div className="text-[10px] truncate" style={{ color: 'var(--fs-text-muted)' }}>{lab.nameZh}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* 4. Reference & Help (Expandable Utilities) */}
          <div className="rounded-xl border overflow-hidden" style={{ borderColor: 'var(--fs-border)' }}>
            <button
              type="button"
              aria-expanded={refOpen}
              aria-controls="nav-reference-panel"
              onClick={() => setRefOpen((o) => !o)}
              style={{
                minHeight: '44px',
                touchAction: 'manipulation',
                backgroundColor: 'var(--fs-surface)',
                color: 'var(--fs-text)',
              }}
              className="w-full px-3 py-2 text-left transition flex items-center justify-between gap-2"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <span className="text-base shrink-0">?</span>
                <div className="min-w-0">
                  <div className="text-sm font-semibold truncate">4. Reference &amp; Help</div>
                  <div className="text-[11px]" style={{ color: 'var(--fs-text-muted)' }}>辭典檢索與操作手冊</div>
                </div>
              </div>
              <span className="text-xs font-bold shrink-0">{refOpen ? '▾' : '▸'}</span>
            </button>
            {refOpen && (
              <div id="nav-reference-panel" className="p-1.5 space-y-1 border-t" style={{ backgroundColor: 'var(--fs-subtle)', borderColor: 'var(--fs-border)' }}>
                <button
                  type="button"
                  onClick={() => navAndClose(onOpenOmnibar)}
                  style={{ minHeight: '44px', color: 'var(--fs-text)' }}
                  className="w-full px-2.5 py-1.5 rounded-lg text-xs font-medium flex items-center justify-between hover:opacity-80"
                >
                  <span>Search Lexicon</span>
                  <kbd className="font-mono text-[10px] opacity-70">Ctrl+K</kbd>
                </button>
                <button
                  type="button"
                  onClick={() => navAndClose(onToggleInspector)}
                  style={{ minHeight: '44px', color: 'var(--fs-text)' }}
                  className="w-full px-2.5 py-1.5 rounded-lg text-xs font-medium flex items-center justify-between hover:opacity-80"
                >
                  <span>Word Inspector Dock</span>
                  <span className="text-[10px] font-bold">{inspectorOpen ? 'ON' : 'OFF'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => navAndClose(onOpenHelp)}
                  style={{ minHeight: '44px', color: 'var(--fs-text)' }}
                  className="w-full px-2.5 py-1.5 rounded-lg text-xs font-medium flex items-center justify-between hover:opacity-80"
                >
                  <span>User’s Manual</span>
                  <kbd className="font-mono text-[10px] opacity-70">?</kbd>
                </button>
              </div>
            )}
          </div>

          {/* 5. Standalone Administration Menu Item (Separated) */}
          <div className="pt-2 mt-2 border-t" style={{ borderColor: 'var(--fs-border)' }}>
            <button
              type="button"
              onClick={() => navAndClose(() => onSelectStudio('admin'))}
              style={{
                minHeight: '46px',
                touchAction: 'manipulation',
                backgroundColor: activeStudio === 'admin' ? 'var(--fs-accent-soft)' : 'transparent',
                color: activeStudio === 'admin' ? 'var(--fs-accent-text)' : 'var(--fs-text)',
                borderColor: activeStudio === 'admin' ? 'var(--fs-accent-border)' : 'var(--fs-border)',
              }}
              className="w-full px-3 py-2 rounded-xl border text-left transition flex items-center justify-between gap-2"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <span className="text-base shrink-0">⚙</span>
                <div className="min-w-0">
                  <div className={`text-sm truncate ${activeStudio === 'admin' ? 'font-bold' : 'font-semibold'}`}>
                    5. Administration
                  </div>
                  <div className="text-[11px]" style={{ color: 'var(--fs-text-muted)' }}>教材管理 · iPad音訊 · 備份</div>
                </div>
              </div>
              <kbd className="px-1.5 py-0.5 rounded text-[10px] font-mono" style={{ backgroundColor: 'var(--fs-hover)', color: 'var(--fs-text-muted)' }}>
                Alt+5
              </kbd>
            </button>
          </div>
        </nav>
      </div>

      {/* Compact Quick Display Toggles */}
      <div className="rounded-xl p-2 border grid grid-cols-3 gap-1.5" style={{ backgroundColor: 'var(--fs-surface)', borderColor: 'var(--fs-border)' }}>
        <button
          type="button"
          onClick={onToggleTheme}
          style={{ minHeight: '38px', backgroundColor: 'var(--fs-subtle)', color: 'var(--fs-text)' }}
          className="px-1.5 py-1 rounded-lg text-[11px] font-semibold"
        >
          {theme === 'light' ? '☀ Paper' : '☾ Dark'}
        </button>
        <button
          type="button"
          onClick={onCycleZhuyin}
          style={{ minHeight: '38px', backgroundColor: 'var(--fs-subtle)', color: 'var(--fs-text-secondary)' }}
          className="px-1.5 py-1 rounded-lg text-[11px] font-semibold truncate"
        >
          {progress.zhuyinDisplayMode === 'adaptive' ? '注音:Auto' : progress.zhuyinDisplayMode === 'always' ? '注音:On' : '注音:Peek'}
        </button>
        <button
          type="button"
          onClick={onTogglePinyin}
          style={{
            minHeight: '38px',
            backgroundColor: progress.showPinyinHint ? 'var(--fs-accent-soft)' : 'var(--fs-subtle)',
            color: progress.showPinyinHint ? 'var(--fs-accent-text)' : 'var(--fs-text-secondary)',
          }}
          className="px-1.5 py-1 rounded-lg text-[11px] font-semibold"
        >
          Pin:{progress.showPinyinHint ? 'ON' : 'OFF'}
        </button>
      </div>
    </aside>
  );
};
