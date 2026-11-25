/**
 * FormosaStudio (FORM) — Cross-Studio Context Handoff Bus & Return Breadcrumb State Manager
 * Traces to: FORM-REQ-0021, FORM-REQ-0020, FORM-DEC-004, FORM-DEP-UX-001
 */

export type StudioId =
  | 'hub'
  | 'syllabus'
  | 'survival'
  | 'reader'
  | 'calligraphy'
  | 'speaking'
  | 'dojo'
  | 'admin';

export interface TopLevelNavSection {
  id: 'today' | 'syllabus' | 'labs' | 'reference' | 'admin';
  titleEn: string;
  titleZh: string;
  shortcut: string;
  expandable: boolean;
}

/**
 * 5-Section Modern Expandable Accordion Menu (FORM-DEC-005 — strictly <= 8 ceiling).
 */
export const TOP_LEVEL_NAV_SECTIONS: TopLevelNavSection[] = [
  { id: 'today', titleEn: "Today's Session", titleZh: '今日學習', shortcut: 'Alt+1', expandable: false },
  { id: 'syllabus', titleEn: 'Course Syllabus', titleZh: '課程大綱', shortcut: 'Alt+2', expandable: true },
  { id: 'labs', titleEn: 'Practice Labs', titleZh: '專項練習室', shortcut: 'Alt+3', expandable: true },
  { id: 'reference', titleEn: 'Reference & Help', titleZh: '參考與手冊', shortcut: 'Alt+4', expandable: false },
  { id: 'admin', titleEn: 'Administration', titleZh: '系統與教材管理', shortcut: 'Alt+5', expandable: false },
];

export interface StudioDefinition {
  id: StudioId;
  titleZh: string;
  titleEn: string;
  shortLabel: string;
  shortcut: string;
  description: string;
}

/**
 * The 6 Permanent Top-Level Studios (strictly <= 8 ceiling per FORM-REQ-0018 & FORM-DEC-004).
 */
export const STUDIO_DEFINITIONS: StudioDefinition[] = [
  {
    id: 'hub',
    titleZh: '今日學習',
    titleEn: 'Today & Daily Flow',
    shortLabel: '1. Today & Flow',
    shortcut: 'Alt+1',
    description: 'Inline 10-Minute Daily Flow Runner, Curriculum Launcher & TOCFL Readiness.',
  },
  {
    id: 'survival',
    titleZh: '臺灣生存',
    titleEn: '10-Min Taiwan Survival',
    shortLabel: '2. 10-Min Taiwan',
    shortcut: 'Alt+2',
    description: 'Sticky Labels, Interactive Paper Tick-Menu (點菜單), 語助詞/臺語 & Listening Gym.',
  },
  {
    id: 'reader',
    titleZh: '閱讀語法',
    titleEn: 'Reader & Grammar',
    shortLabel: '3. Reader & Grammar',
    shortcut: 'Alt+3',
    description: 'Adaptive i+1 Graded Stories, Custom Text Importer, Cloze & 口語/書面語 Bridge.',
  },
  {
    id: 'calligraphy',
    titleZh: '書法筆順',
    titleEn: 'Wacom Calligraphy',
    shortLabel: '4. Wacom Calligraphy',
    shortcut: 'Alt+4',
    description: 'Wacom Stylus Pressure 九宮格 Canvas, Taiwan MOE Stroke Order & 形聲字 Workbench.',
  },
  {
    id: 'speaking',
    titleZh: '發音聲調',
    titleEn: 'Speaking & Pitch Lab',
    shortLabel: '5. Speaking & Pitch',
    shortcut: 'Alt+5',
    description: 'Offline WebAudio F0 Pitch-Contour Visualizer, Tone Sandhi & ㄓㄔㄕㄖ vs ㄗㄘㄙ Coach.',
  },
  {
    id: 'dojo',
    titleZh: '詞彙與大千',
    titleEn: 'Vocab, SRS & Dojo',
    shortLabel: '6. Vocab & Dojo',
    shortcut: 'Alt+6',
    description: 'TOCFL Word Bank, FSRS-Lite Review Queue, 8-Stage DaQian Typing Dojo & Match Arena.',
  },
];

export const EXTRA_STUDIO_DEFINITIONS: Record<'syllabus' | 'admin', StudioDefinition> = {
  syllabus: {
    id: 'syllabus',
    titleZh: '課程大綱',
    titleEn: 'Course Syllabus (Stages 0–5)',
    shortLabel: 'Course Syllabus',
    shortcut: 'Alt+2',
    description: 'Linear Pre-A1 to TOCFL Level 4 (CEFR B2 / HSK 5 Equiv.) progression with Stage Checkpoints.',
  },
  admin: {
    id: 'admin',
    titleZh: '系統管理',
    titleEn: 'Administration',
    shortLabel: 'Administration',
    shortcut: 'Alt+5',
    description: 'Standalone Custom Material CRUD, iPad/Desktop Audio Diagnostics, Backups & Preferences.',
  },
};

export const STUDIO_BY_ID: Record<StudioId, StudioDefinition> = {
  ...(Object.fromEntries(STUDIO_DEFINITIONS.map((s) => [s.id, s])) as Record<StudioId, StudioDefinition>),
  ...EXTRA_STUDIO_DEFINITIONS,
};

export interface StudioHandoffPayload {
  id: string;
  fromStudio: StudioId;
  fromLabel: string;
  toStudio: StudioId;
  targetText: string;
  targetZhuyin?: string;
  targetEnglish?: string;
  targetChar?: string;
  modeHint?: string;
  stageHint?: number;
  subTarget?: string;
  timestamp: number;
}

export interface FocusedContextItem {
  text: string;
  zhuyin?: string;
  spokenZhuyin?: string;
  english?: string;
  charFocus?: string;
  sourceStudio: StudioId;
  sourceLabel: string;
  moeNote?: string;
}

export interface StudioBusState {
  activeStudio: StudioId;
  activeHandoff: StudioHandoffPayload | null;
  handoffStack: StudioHandoffPayload[];
  focusedItem: FocusedContextItem | null;
}

type StudioBusListener = (state: StudioBusState) => void;

let currentBusState: StudioBusState = {
  activeStudio: 'hub',
  activeHandoff: null,
  handoffStack: [],
  focusedItem: null,
};

const listeners = new Set<StudioBusListener>();

function emitBusChange(): void {
  const snapshot = getStudioBusState();
  for (const fn of listeners) {
    fn(snapshot);
  }
}

export function getStudioBusState(): StudioBusState {
  return {
    activeStudio: currentBusState.activeStudio,
    activeHandoff: currentBusState.activeHandoff ? { ...currentBusState.activeHandoff } : null,
    handoffStack: [...currentBusState.handoffStack],
    focusedItem: currentBusState.focusedItem ? { ...currentBusState.focusedItem } : null,
  };
}

export function setActiveStudio(studioId: StudioId, clearBreadcrumb = false): StudioBusState {
  currentBusState = {
    ...currentBusState,
    activeStudio: studioId,
    activeHandoff: clearBreadcrumb ? null : currentBusState.activeHandoff,
  };
  emitBusChange();
  return getStudioBusState();
}

export function setFocusedContextItem(item: FocusedContextItem | null): StudioBusState {
  currentBusState = {
    ...currentBusState,
    focusedItem: item ? { ...item } : null,
  };
  emitBusChange();
  return getStudioBusState();
}

/**
 * Dispatches a cross-studio handoff (e.g., Reader -> Wacom Calligraphy or Survival -> Pitch Lab)
 * and records the source studio in the Return Breadcrumb stack.
 */
export function dispatchStudioHandoff(
  input: Omit<StudioHandoffPayload, 'id' | 'timestamp'>
): StudioHandoffPayload {
  const firstCjk = Array.from(input.targetText).find((c) => /[\u4e00-\u9fff]/.test(c));
  const payload: StudioHandoffPayload = {
    ...input,
    targetChar: input.targetChar || firstCjk || input.targetText.slice(0, 1),
    id: `handoff-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    timestamp: Date.now(),
  };

  currentBusState = {
    activeStudio: payload.toStudio,
    activeHandoff: payload,
    handoffStack: [...currentBusState.handoffStack.slice(-9), payload],
    focusedItem: {
      text: payload.targetText,
      zhuyin: payload.targetZhuyin,
      english: payload.targetEnglish,
      charFocus: payload.targetChar,
      sourceStudio: payload.fromStudio,
      sourceLabel: payload.fromLabel,
    },
  };
  emitBusChange();
  return payload;
}

/**
 * Pops the active Return Breadcrumb and returns the learner to the originating studio.
 */
export function popReturnHandoff(): StudioHandoffPayload | null {
  const stack = [...currentBusState.handoffStack];
  const popped = stack.pop() || currentBusState.activeHandoff;
  if (!popped) {
    return null;
  }
  const previous = stack.length > 0 ? stack[stack.length - 1] : null;
  currentBusState = {
    ...currentBusState,
    activeStudio: popped.fromStudio,
    activeHandoff: previous,
    handoffStack: stack,
  };
  emitBusChange();
  return popped;
}

export function getActiveHandoff(): StudioHandoffPayload | null {
  return currentBusState.activeHandoff ? { ...currentBusState.activeHandoff } : null;
}

export function dismissStudioHandoff(): void {
  currentBusState = {
    ...currentBusState,
    activeHandoff: null,
    handoffStack: [],
  };
  emitBusChange();
}

export function clearStudioHandoff(): void {
  currentBusState = {
    activeStudio: 'hub',
    activeHandoff: null,
    handoffStack: [],
    focusedItem: null,
  };
  emitBusChange();
}

export function subscribeStudioBus(listener: StudioBusListener): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}
