/**
 * FormosaStudio (FORM) — Daily Guided Session & Stage 0..6 Taiwanese Mandarin Learning Pathway Engine
 * Extracted from progressStore.ts per Pattern 12 (<= 600 LOC) and expanded with Stage 0: Start From Zero
 * (Absolute Beginner Launchpad for Native English Speakers — FORM-LL-009).
 */

import type { UserProgressState } from './progressStore.ts';

export const STAGE0_MODULE_IDS = ['0.1', '0.2', '0.3', '0.4', '0.5'] as const;
export type Stage0ModuleId = (typeof STAGE0_MODULE_IDS)[number];

export interface TodayProgressSummary {
  dateIso: string;
  goalMinutes: number;
  minutesCompleted: number;
  stepsCompleted: number[];
  percentComplete: number;
  nextStep: 1 | 2 | 3 | null;
}

const STEP_MINUTES: Record<1 | 2 | 3, number> = { 1: 3, 2: 4, 3: 3 };

export function getTodayProgressSummary(state: UserProgressState): TodayProgressSummary {
  const today = new Date().toISOString().slice(0, 10);
  const steps =
    state.dailyDateIso === today && Array.isArray(state.dailyStepsCompleted)
      ? Array.from(new Set(state.dailyStepsCompleted)).filter((s) => s === 1 || s === 2 || s === 3)
      : [];
  const goalMinutes = state.dailyGoalMinutes || 10;
  const minutesCompleted = steps.reduce((acc, s) => acc + (STEP_MINUTES[s as 1 | 2 | 3] || 0), 0);
  const nextStep: 1 | 2 | 3 | null = !steps.includes(1) ? 1 : !steps.includes(2) ? 2 : !steps.includes(3) ? 3 : null;
  return {
    dateIso: today,
    goalMinutes,
    minutesCompleted,
    stepsCompleted: steps,
    percentComplete: Math.min(100, Math.round((minutesCompleted / goalMinutes) * 100)),
    nextStep,
  };
}

export function markDailyStepComplete(state: UserProgressState, step: 1 | 2 | 3): UserProgressState {
  const today = new Date().toISOString().slice(0, 10);
  const prevSteps =
    state.dailyDateIso === today && Array.isArray(state.dailyStepsCompleted) ? state.dailyStepsCompleted : [];
  const nextSteps = Array.from(new Set([...prevSteps, step])).sort((a, b) => a - b);
  return { ...state, lastActiveDate: today, dailyDateIso: today, dailyStepsCompleted: nextSteps };
}

export function markStage0ModuleComplete(state: UserProgressState, moduleId: Stage0ModuleId): UserProgressState {
  const prev = Array.isArray(state.completedStage0Modules) ? state.completedStage0Modules : [];
  const already = prev.includes(moduleId);
  const next = already ? prev : [...prev, moduleId].sort();
  return { ...state, completedStage0Modules: next, xp: already ? state.xp : state.xp + 30 };
}

export function setStage0Skipped(state: UserProgressState, skipped: boolean): UserProgressState {
  return { ...state, stage0Skipped: skipped };
}

export function togglePimsleurUnitComplete(state: UserProgressState, unit: number): UserProgressState {
  const prev = Array.isArray(state.completedPimsleurUnits) ? state.completedPimsleurUnits : [];
  const exists = prev.includes(unit);
  const next = exists ? prev.filter((u) => u !== unit) : [...prev, unit].sort((a, b) => a - b);
  return { ...state, completedPimsleurUnits: next, xp: exists ? state.xp : state.xp + 25 };
}

export function toggleNtnuLessonComplete(state: UserProgressState, key: string): UserProgressState {
  const prev = Array.isArray(state.completedNtnuLessons) ? state.completedNtnuLessons : [];
  const exists = prev.includes(key);
  const next = exists ? prev.filter((k) => k !== key) : [...prev, key];
  return { ...state, completedNtnuLessons: next, xp: exists ? state.xp : state.xp + 25 };
}

export interface PathwayStageProgress {
  id: string;
  stageNumber: number;
  titleEn: string;
  titleZh: string;
  tocflTarget: string;
  description: string;
  completedUnits: number;
  totalUnits: number;
  percent: number;
  status: 'completed' | 'current' | 'upcoming';
  nextPimsleurUnit?: number;
  nextNtnuVolume: number;
  nextNtnuLesson: number;
}

export function getStage0Summary(state: UserProgressState): {
  completedIds: string[];
  completedCount: number;
  totalCount: number;
  percent: number;
  isCompleteOrSkipped: boolean;
  nextModuleId: Stage0ModuleId | null;
} {
  const done = Array.isArray(state.completedStage0Modules)
    ? Array.from(new Set(state.completedStage0Modules)).filter((id) =>
        (STAGE0_MODULE_IDS as readonly string[]).includes(id)
      )
    : [];
  const nextModuleId = STAGE0_MODULE_IDS.find((id) => !done.includes(id)) || null;
  const percent = Math.round((done.length / STAGE0_MODULE_IDS.length) * 100);
  return {
    completedIds: done,
    completedCount: done.length,
    totalCount: STAGE0_MODULE_IDS.length,
    percent,
    isCompleteOrSkipped: Boolean(state.stage0Skipped) || done.length >= STAGE0_MODULE_IDS.length,
    nextModuleId,
  };
}

export function getOverallPathwaySummary(state: UserProgressState): {
  overallPercent: number;
  completedLessonsTotal: number;
  totalCurriculumLessons: number;
  masteredWordsCount: number;
  masteredCharsCount: number;
  stage0: ReturnType<typeof getStage0Summary>;
  currentStage: PathwayStageProgress;
  stages: PathwayStageProgress[];
} {
  const stage0 = getStage0Summary(state);
  const donePim = new Set(state.completedPimsleurUnits || []);
  const doneNtnu = new Set(state.completedNtnuLessons || []);
  const defs = [
    { id: 'stage-1', titleEn: 'Foundations & Daily Survival', titleZh: '基礎生存入門', tocflTarget: 'Novice 1', desc: 'Pimsleur Units 1–4 · NTNU Vol. 1 (L1–8)', pim: [1, 2, 3, 4], vol: 1, lStart: 1, lEnd: 8 },
    { id: 'stage-2', titleEn: 'Everyday Taiwan Conversations', titleZh: '臺灣日常會話', tocflTarget: 'Novice 2', desc: 'Pimsleur Units 5–9 · NTNU Vol. 1 (L9–15)', pim: [5, 6, 7, 8, 9], vol: 1, lStart: 9, lEnd: 15 },
    { id: 'stage-3', titleEn: 'Independent Living & Dining', titleZh: '獨立生活溝通', tocflTarget: 'Band A1', desc: 'Pimsleur Units 10–14 · NTNU Vol. 2 (L1–12)', pim: [10, 11, 12, 13, 14], vol: 2, lStart: 1, lEnd: 12 },
    { id: 'stage-4', titleEn: 'Connected Speech & Reading', titleZh: '連貫表達閱讀', tocflTarget: 'Band A2', desc: 'Pimsleur Units 15–19 · NTNU Vol. 3 (L1–10)', pim: [15, 16, 17, 18, 19], vol: 3, lStart: 1, lEnd: 10 },
    { id: 'stage-5', titleEn: 'Formal Register & Media Bridge', titleZh: '進階書面語篇', tocflTarget: 'Band B1', desc: 'NTNU Vol. 4 (L1–8) & Vol. 5 (L1–8)', pim: [], vol: 4, lStart: 1, lEnd: 8 },
    { id: 'stage-6', titleEn: 'Fluent Taiwan Discourse', titleZh: '高階文化流利', tocflTarget: 'Band B2', desc: 'NTNU Vol. 5–6 Advanced Readings (L1–8)', pim: [], vol: 6, lStart: 1, lEnd: 8 },
  ];

  let foundCurrent = false;
  const stages: PathwayStageProgress[] = defs.map((d, idx) => {
    const ntnuKeys: string[] = [];
    for (let l = d.lStart; l <= d.lEnd; l++) ntnuKeys.push(`${d.vol}-${l}`);
    const doneCount = d.pim.filter((u) => donePim.has(u)).length + ntnuKeys.filter((k) => doneNtnu.has(k)).length;
    const totalCount = d.pim.length + ntnuKeys.length;
    const pct = totalCount > 0 ? Math.round((doneCount / totalCount) * 100) : 0;
    let status: 'completed' | 'current' | 'upcoming' = 'upcoming';
    if (pct >= 100) {
      status = 'completed';
    } else if (!foundCurrent) {
      status = 'current';
      foundCurrent = true;
    }
    const nextPim = d.pim.find((u) => !donePim.has(u));
    const nextNtnuKey = ntnuKeys.find((k) => !doneNtnu.has(k)) || `${d.vol}-${d.lStart}`;
    const [nv, nl] = nextNtnuKey.split('-').map(Number);
    return {
      id: d.id,
      stageNumber: idx + 1,
      titleEn: d.titleEn,
      titleZh: d.titleZh,
      tocflTarget: d.tocflTarget,
      description: d.desc,
      completedUnits: doneCount,
      totalUnits: totalCount,
      percent: pct,
      status,
      nextPimsleurUnit: nextPim,
      nextNtnuVolume: nv,
      nextNtnuLesson: nl,
    };
  });

  const completedLessonsTotal = donePim.size + doneNtnu.size;
  const totalCurriculumLessons = 19 + 61;
  const masteredWordsCount = Object.values(state.wordMastery).filter((w) => w.level >= 2).length;
  const masteredCharsCount = Object.values(state.charMastery).filter((c) => c.level >= 2).length;
  const currentStage = stages.find((s) => s.status === 'current') || stages[stages.length - 1];
  const overallPercent = Math.min(100, Math.round((completedLessonsTotal / totalCurriculumLessons) * 100));

  return { overallPercent, completedLessonsTotal, totalCurriculumLessons, masteredWordsCount, masteredCharsCount, stage0, currentStage, stages };
}
