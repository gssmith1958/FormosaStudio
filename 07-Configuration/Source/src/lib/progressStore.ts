/**
 * FormosaStudio (FORM) — FSRS-Lite Stability/Difficulty Progress Store & Validated JSON Backup/Restore
 * Traces to: FORM-REQ-0004, FORM-REQ-0005, FORM-REQ-0018, FORM-REQ-0020, FORM-REQ-0021
 */

export type MasteryLevel = 0 | 1 | 2 | 3;
export type FsrsRating = 1 | 2 | 3 | 4; // 1: Again, 2: Hard, 3: Good, 4: Easy
export type ZhuyinDisplayMode = 'adaptive' | 'always' | 'hover_only';
export type StylusHandedness = 'right' | 'left';
export type ThemeMode = 'system' | 'light' | 'dark';
export type ResolvedThemeMode = 'light' | 'dark';
export type VoicePitchPreset = 'low' | 'mid' | 'high';

/**
 * Node-safe resolver for ThemeMode ('system' -> prefers-color-scheme, defaulting to 'light' outside browser).
 */
export function resolveEffectiveTheme(pref?: ThemeMode): ResolvedThemeMode {
  if (pref === 'dark') return 'dark';
  if (pref === 'light') return 'light';
  if (typeof window !== 'undefined' && typeof window.matchMedia === 'function') {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  return 'light';
}

export interface FsrsMetrics {
  stability: number;     // Days (0.15 .. 365.0)
  difficulty: number;    // 1.0 .. 10.0 (default 5.0)
  retrievability: number;// 0.0 .. 1.0
  lapses: number;
}

export interface CharMasteryRecord extends FsrsMetrics {
  char: string;
  zhuyin: string;
  level: MasteryLevel;
  correctCount: number;
  attemptCount: number;
  lastPracticedAt?: string;
  nextReviewAt: number;
}

export interface WordMasteryRecord extends FsrsMetrics {
  word: string;
  zhuyin: string;
  english: string;
  level: MasteryLevel;
  correctCount: number;
  attemptCount: number;
  lastPracticedAt?: string;
  nextReviewAt: number;
}

export interface StrokeMasteryRecord extends FsrsMetrics {
  char: string;
  zhuyin: string;
  level: MasteryLevel;
  bestAccuracy: number;
  correctCount: number;
  attemptCount: number;
  lastPracticedAt?: string;
  nextReviewAt: number;
}

export interface NodeProgressRecord {
  nodeId: string;
  crowns: number;
  bestAccuracy: number;
  lastCompletedAt: string;
}

export interface UserProgressState {
  xp: number;
  streak: number;
  lastActiveDate: string;
  hearts: number;
  maxHearts: number;
  infiniteHearts: boolean;
  zhuyinDisplayMode: ZhuyinDisplayMode;
  showPinyinHint: boolean;
  handedness: StylusHandedness;
  palmRejectionPenOnly: boolean;
  theme?: ThemeMode;
  voicePreset?: VoicePitchPreset;
  quietRoomMode?: boolean;
  dailyGoalMinutes?: number;
  dailyDateIso?: string;
  dailyStepsCompleted?: number[];
  completedStage0Modules?: string[];
  completedArrivalScenarios?: string[];
  completedStageCheckpoints?: Record<number, { bestAccuracy: number; completedAt: string }>;
  stage0Skipped?: boolean;
  completedPimsleurUnits?: number[];
  completedNtnuLessons?: string[];
  completedSurvivalModules?: string[];
  completedNodes: Record<string, NodeProgressRecord>;
  charMastery: Record<string, CharMasteryRecord>;
  wordMastery: Record<string, WordMasteryRecord>;
  strokeMastery: Record<string, StrokeMasteryRecord>;
  daqianBestWpm: number;
  matchHighScore: number;
}

export interface ProgressBackupEnvelope {
  schemaVersion: 'formosa-progress-v2';
  exportedAt: string;
  state: UserProgressState;
  customPacks?: unknown[];
}

const STORAGE_KEY = 'formosa_studio_progress_v2';
const DAY_MS = 24 * 60 * 60 * 1000;
const DEFAULT_DIFFICULTY = 5.0;

function clamp(val: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, val));
}

/**
 * Computes FSRS-Lite power-law retrievability R(t, S) = (1 + (19/81) * (dt / S))^-0.5
 */
export function computeFsrsRetrievability(
  stabilityDays: number,
  lastPracticedIso?: string,
  nowMs: number = Date.now()
): number {
  if (!lastPracticedIso || stabilityDays <= 0) return 0.9;
  const lastMs = Date.parse(lastPracticedIso);
  if (Number.isNaN(lastMs) || nowMs <= lastMs) return 1.0;
  const elapsedDays = (nowMs - lastMs) / DAY_MS;
  const r = Math.pow(1 + (19 / 81) * (elapsedDays / Math.max(0.15, stabilityDays)), -0.5);
  return Number(clamp(r, 0.05, 1.0).toFixed(4));
}

/**
 * FSRS-Lite stability (S) and difficulty (D) transition per DEP-03 specification (FORM-DEP-TPA-001 §2.1).
 */
export function computeNextFsrsMetrics(
  prev: Partial<FsrsMetrics> | undefined,
  rating: FsrsRating,
  lastPracticedIso?: string,
  nowMs: number = Date.now()
): FsrsMetrics & { nextReviewAt: number } {
  const prevD = prev?.difficulty ?? DEFAULT_DIFFICULTY;
  const prevS = prev?.stability ?? 0;
  const prevLapses = prev?.lapses ?? 0;

  // 1. Update Difficulty D in [1.0, 10.0] with mean reversion toward D0=5.0
  const rawD = clamp(prevD - 0.8 * (rating - 3), 1.0, 10.0);
  const nextD = Number(clamp(0.9 * rawD + 0.1 * DEFAULT_DIFFICULTY, 1.0, 10.0).toFixed(3));

  // 2. Initial or Updated Stability S in [0.15, 365.0] days
  let nextS: number;
  let lapses = prevLapses;

  if (prevS <= 0) {
    const initMap: Record<FsrsRating, number> = { 1: 0.15, 2: 0.4, 3: 1.0, 4: 3.5 };
    nextS = initMap[rating];
    if (rating === 1) lapses += 1;
  } else if (rating === 1) {
    nextS = Math.max(0.15, prevS * 0.35);
    lapses += 1;
  } else {
    const r = computeFsrsRetrievability(prevS, lastPracticedIso, nowMs);
    const multMap: Record<2 | 3 | 4, number> = { 2: 1.2, 3: 2.2, 4: 3.2 };
    const m = multMap[rating];
    const factor = 1 + m * ((11 - nextD) / 10) * (1.1 - 0.5 * r);
    nextS = Math.min(365.0, prevS * factor);
  }

  const roundedS = Number(clamp(nextS, 0.15, 365.0).toFixed(3));
  const nextReviewAt = nowMs + Math.round(roundedS * DAY_MS);

  return {
    stability: roundedS,
    difficulty: nextD,
    retrievability: 1.0,
    lapses,
    nextReviewAt,
  };
}

export function createInitialProgressState(): UserProgressState {
  const today = new Date().toISOString().slice(0, 10);
  return {
    xp: 0,
    streak: 1,
    lastActiveDate: today,
    hearts: 5,
    maxHearts: 5,
    infiniteHearts: true,
    zhuyinDisplayMode: 'adaptive',
    showPinyinHint: true,
    handedness: 'right',
    palmRejectionPenOnly: false,
    theme: 'system',
    voicePreset: 'mid',
    quietRoomMode: false,
    dailyGoalMinutes: 10,
    dailyDateIso: today,
    dailyStepsCompleted: [],
    completedStage0Modules: [],
    completedArrivalScenarios: [],
    completedStageCheckpoints: {},
    stage0Skipped: false,
    completedPimsleurUnits: [],
    completedNtnuLessons: [],
    completedSurvivalModules: [],
    completedNodes: {},
    charMastery: {},
    wordMastery: {},
    strokeMastery: {},
    daqianBestWpm: 0,
    matchHighScore: 0,
  };
}

export function loadProgress(): UserProgressState {
  const fallback = createInitialProgressState();
  if (typeof window === 'undefined' || !window.localStorage) {
    return fallback;
  }
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw);
    return {
      ...fallback,
      ...parsed,
      completedNodes: parsed.completedNodes || {},
      charMastery: parsed.charMastery || {},
      wordMastery: parsed.wordMastery || {},
      strokeMastery: parsed.strokeMastery || {},
    };
  } catch {
    return fallback;
  }
}

export function saveProgress(state: UserProgressState): void {
  if (typeof window === 'undefined' || !window.localStorage) return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Ignore storage quota errors in restricted environments
  }
}

function computeNextMasteryLevel(prevLevel: MasteryLevel, correctCount: number, isCorrect: boolean): MasteryLevel {
  if (!isCorrect) {
    return Math.max(0, prevLevel - 1) as MasteryLevel;
  }
  if (correctCount >= 5) return 3;
  if (correctCount >= 3) return Math.max(prevLevel, 2) as MasteryLevel;
  if (correctCount >= 1) return Math.max(prevLevel, 1) as MasteryLevel;
  return prevLevel;
}

export function recordCharacterPractice(
  state: UserProgressState,
  chars: { char: string; zhuyin: string }[],
  isCorrect: boolean,
  ratingOverride?: FsrsRating,
  nowMs: number = Date.now()
): UserProgressState {
  const nextMastery: Record<string, CharMasteryRecord> = { ...state.charMastery };
  const rating: FsrsRating = ratingOverride ?? (isCorrect ? 3 : 1);
  const nowIso = new Date(nowMs).toISOString();

  for (const item of chars) {
    if (!item.char.trim()) continue;
    const prev = nextMastery[item.char];
    const correctCount = (prev?.correctCount ?? 0) + (isCorrect ? 1 : 0);
    const attemptCount = (prev?.attemptCount ?? 0) + 1;
    const nextLevel = computeNextMasteryLevel(prev?.level ?? 0, correctCount, isCorrect);
    const fsrs = computeNextFsrsMetrics(prev, rating, prev?.lastPracticedAt, nowMs);

    nextMastery[item.char] = {
      char: item.char,
      zhuyin: item.zhuyin || prev?.zhuyin || '',
      level: nextLevel,
      correctCount,
      attemptCount,
      lastPracticedAt: nowIso,
      ...fsrs,
    };
  }

  return {
    ...state,
    charMastery: nextMastery,
  };
}

export function recordWordPractice(
  state: UserProgressState,
  entry: {
    word: string;
    zhuyin: string;
    english: string;
    chars?: { char: string; zhuyin: string }[];
  },
  isCorrect: boolean,
  ratingOverride?: FsrsRating,
  nowMs: number = Date.now()
): UserProgressState {
  const rating: FsrsRating = ratingOverride ?? (isCorrect ? 3 : 1);
  const nowIso = new Date(nowMs).toISOString();
  const prev = state.wordMastery[entry.word];
  const correctCount = (prev?.correctCount ?? 0) + (isCorrect ? 1 : 0);
  const attemptCount = (prev?.attemptCount ?? 0) + 1;
  const nextLevel = computeNextMasteryLevel(prev?.level ?? 0, correctCount, isCorrect);
  const fsrs = computeNextFsrsMetrics(prev, rating, prev?.lastPracticedAt, nowMs);

  let nextState: UserProgressState = {
    ...state,
    wordMastery: {
      ...state.wordMastery,
      [entry.word]: {
        word: entry.word,
        zhuyin: entry.zhuyin,
        english: entry.english,
        level: nextLevel,
        correctCount,
        attemptCount,
        lastPracticedAt: nowIso,
        ...fsrs,
      },
    },
  };

  const derivedChars =
    entry.chars && entry.chars.length > 0
      ? entry.chars
      : (() => {
          const cjk = Array.from(entry.word).filter((ch) => /[\u4E00-\u9FFF]/.test(ch));
          const syls = (entry.zhuyin || '')
            .split(/\s+/)
            .map((s) => s.trim())
            .filter((s) => /[ㄅ-ㄩ]/.test(s));
          return cjk.map((char, idx) => ({ char, zhuyin: syls[idx] || '' }));
        })();

  if (derivedChars.length > 0) {
    nextState = recordCharacterPractice(nextState, derivedChars, isCorrect, rating, nowMs);
  }

  return nextState;
}

export function recordStrokePractice(
  state: UserProgressState,
  item: { char: string; zhuyin: string; accuracy: number },
  isCorrect: boolean,
  ratingOverride?: FsrsRating,
  nowMs: number = Date.now()
): UserProgressState {
  const rating: FsrsRating =
    ratingOverride ?? ( !isCorrect ? 1 : item.accuracy >= 92 ? 4 : item.accuracy >= 78 ? 3 : 2 );
  const nowIso = new Date(nowMs).toISOString();
  const prev = state.strokeMastery[item.char];
  const correctCount = (prev?.correctCount ?? 0) + (isCorrect ? 1 : 0);
  const attemptCount = (prev?.attemptCount ?? 0) + 1;
  const nextLevel = computeNextMasteryLevel(prev?.level ?? 0, correctCount, isCorrect);
  const fsrs = computeNextFsrsMetrics(prev, rating, prev?.lastPracticedAt, nowMs);

  const withStroke: UserProgressState = {
    ...state,
    strokeMastery: {
      ...state.strokeMastery,
      [item.char]: {
        char: item.char,
        zhuyin: item.zhuyin || prev?.zhuyin || '',
        level: nextLevel,
        bestAccuracy: Math.max(prev?.bestAccuracy ?? 0, item.accuracy),
        correctCount,
        attemptCount,
        lastPracticedAt: nowIso,
        ...fsrs,
      },
    },
  };

  return recordCharacterPractice(withStroke, [{ char: item.char, zhuyin: item.zhuyin }], isCorrect, rating, nowMs);
}

export function getDueSrsCharacters(state: UserProgressState, nowMs: number = Date.now()): CharMasteryRecord[] {
  return Object.values(state.charMastery)
    .filter((rec) => rec.nextReviewAt <= nowMs || rec.level < 2)
    .sort((a, b) => a.nextReviewAt - b.nextReviewAt || a.stability - b.stability);
}

export function getDueSrsWords(state: UserProgressState, nowMs: number = Date.now()): WordMasteryRecord[] {
  return Object.values(state.wordMastery)
    .filter((rec) => rec.nextReviewAt <= nowMs || rec.level < 2)
    .sort((a, b) => a.nextReviewAt - b.nextReviewAt || a.stability - b.stability);
}

export function getDueSrsStrokes(state: UserProgressState, nowMs: number = Date.now()): StrokeMasteryRecord[] {
  return Object.values(state.strokeMastery)
    .filter((rec) => rec.nextReviewAt <= nowMs || rec.level < 2)
    .sort((a, b) => a.nextReviewAt - b.nextReviewAt || a.stability - b.stability);
}

/**
 * Exports complete UserProgressState (plus optional custom Admin packs) to a timestamped JSON string (FORM-REQ-0004).
 */
export function exportProgressJson(state: UserProgressState, customPacks?: unknown[]): string {
  const envelope: ProgressBackupEnvelope = {
    schemaVersion: 'formosa-progress-v2',
    exportedAt: new Date().toISOString(),
    state,
    ...(Array.isArray(customPacks) ? { customPacks } : {}),
  };
  return JSON.stringify(envelope, null, 2);
}

export function extractCustomPacksFromBackupJson(rawJson: string): unknown[] | null {
  try {
    const parsed = JSON.parse(rawJson) as Partial<ProgressBackupEnvelope>;
    return Array.isArray(parsed?.customPacks) ? parsed.customPacks : null;
  } catch {
    return null;
  }
}

/**
 * Restores UserProgressState losslessly with schema validation (FORM-REQ-0004).
 */
export function importProgressJson(rawJson: string): UserProgressState {
  let parsed: unknown;
  try {
    parsed = JSON.parse(rawJson);
  } catch {
    throw new Error('Invalid JSON format in progress backup file.');
  }
  if (!parsed || typeof parsed !== 'object') {
    throw new Error('Progress backup payload must be a JSON object.');
  }

  const candidate =
    'schemaVersion' in parsed && (parsed as ProgressBackupEnvelope).state
      ? (parsed as ProgressBackupEnvelope).state
      : (parsed as Partial<UserProgressState>);

  if (
    typeof candidate.xp !== 'number' ||
    typeof candidate.streak !== 'number' ||
    typeof candidate.charMastery !== 'object' ||
    candidate.charMastery === null ||
    typeof candidate.wordMastery !== 'object' ||
    candidate.wordMastery === null
  ) {
    throw new Error('Progress backup is missing required mastery or XP fields.');
  }

  const defaults = createInitialProgressState();
  const handedness: StylusHandedness = candidate.handedness === 'left' ? 'left' : 'right';
  const zhuyinDisplayMode: ZhuyinDisplayMode =
    candidate.zhuyinDisplayMode === 'always' || candidate.zhuyinDisplayMode === 'hover_only'
      ? candidate.zhuyinDisplayMode
      : 'adaptive';

  return {
    ...defaults,
    ...candidate,
    handedness,
    zhuyinDisplayMode,
    theme: candidate.theme === 'dark' || candidate.theme === 'light' || candidate.theme === 'system' ? candidate.theme : 'system',
    voicePreset:
      candidate.voicePreset === 'low' || candidate.voicePreset === 'high'
        ? candidate.voicePreset
        : 'mid',
    quietRoomMode: Boolean(candidate.quietRoomMode),
    dailyGoalMinutes: typeof candidate.dailyGoalMinutes === 'number' ? candidate.dailyGoalMinutes : 10,
    dailyDateIso: typeof candidate.dailyDateIso === 'string' ? candidate.dailyDateIso : defaults.dailyDateIso,
    dailyStepsCompleted: Array.isArray(candidate.dailyStepsCompleted) ? candidate.dailyStepsCompleted : [],
    completedStage0Modules: Array.isArray(candidate.completedStage0Modules) ? candidate.completedStage0Modules : [],
    completedArrivalScenarios: Array.isArray(candidate.completedArrivalScenarios)
      ? candidate.completedArrivalScenarios
      : [],
    completedStageCheckpoints:
      candidate.completedStageCheckpoints && typeof candidate.completedStageCheckpoints === 'object'
        ? candidate.completedStageCheckpoints
        : {},
    stage0Skipped: Boolean(candidate.stage0Skipped),
    completedPimsleurUnits: Array.isArray(candidate.completedPimsleurUnits) ? candidate.completedPimsleurUnits : [],
    completedNtnuLessons: Array.isArray(candidate.completedNtnuLessons) ? candidate.completedNtnuLessons : [],
    completedSurvivalModules: Array.isArray(candidate.completedSurvivalModules) ? candidate.completedSurvivalModules : [],
    completedNodes: candidate.completedNodes || {},
    charMastery: candidate.charMastery || {},
    wordMastery: candidate.wordMastery || {},
    strokeMastery: candidate.strokeMastery || {},
  };
}

export {
  STAGE0_MODULE_IDS,
  getOverallPathwaySummary,
  getStage0Summary,
  getTodayProgressSummary,
  markArrivalScenarioComplete,
  markDailyStepComplete,
  markStage0ModuleComplete,
  recordStageCheckpointResult,
  setStage0Skipped,
  toggleNtnuLessonComplete,
  togglePimsleurUnitComplete,
} from './pathwayEngine.ts';
export type {
  PathwayStageProgress,
  Stage0ModuleId,
  TodayProgressSummary,
} from './pathwayEngine.ts';
