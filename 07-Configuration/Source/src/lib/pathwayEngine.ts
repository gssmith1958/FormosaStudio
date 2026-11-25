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

/**
 * Records completion of a Stage 0.5 Taiwan Arrival Scenario; >= 3 scenarios unlocks Stage 0.5 (PED-3).
 */
export function markArrivalScenarioComplete(state: UserProgressState, scenarioId: string): UserProgressState {
  const prev = Array.isArray(state.completedArrivalScenarios) ? state.completedArrivalScenarios : [];
  const already = prev.includes(scenarioId);
  const next = already ? prev : [...prev, scenarioId];
  let updated: UserProgressState = {
    ...state,
    completedArrivalScenarios: next,
    xp: already ? state.xp : state.xp + 20,
  };
  if (next.length >= 3) {
    updated = markStage0ModuleComplete(updated, '0.5');
  }
  return updated;
}

export function recordStageCheckpointResult(
  state: UserProgressState,
  stageNumber: number,
  accuracy: number
): UserProgressState {
  const prevMap = state.completedStageCheckpoints || {};
  const prevBest = prevMap[stageNumber]?.bestAccuracy ?? 0;
  const passedNow = accuracy >= 80 && prevBest < 80;
  return {
    ...state,
    completedStageCheckpoints: {
      ...prevMap,
      [stageNumber]: {
        bestAccuracy: Math.max(prevBest, accuracy),
        completedAt: new Date().toISOString(),
      },
    },
    xp: state.xp + (passedNow ? 60 : 15),
  };
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
  const hasHigherProgress = donePim.size > 0 || doneNtnu.size > 0;
  const defs = [
    { num: 0, id: 'stage-0', titleEn: 'Start From Zero (Taiwan Foundations)', titleZh: '零基礎臺灣起步', tocflTarget: 'Pre-A1 · Foundations', desc: '4 Tones, 37 Zhuyin, 8 Strokes, 16 Radicals & 5 Arrival Scenarios', pim: [] as number[], ntnu: [] as string[], vol: 1, lStart: 1 },
    { num: 1, id: 'stage-1', titleEn: 'Everyday Taiwan Survival', titleZh: '臺灣生存入門', tocflTarget: 'TOCFL Level 1 · Band A1', desc: 'Pimsleur Units 1–4 · NTNU Vol. 1 (L1–8)', pim: [1, 2, 3, 4], ntnu: ['1-1', '1-2', '1-3', '1-4', '1-5', '1-6', '1-7', '1-8'], vol: 1, lStart: 1 },
    { num: 2, id: 'stage-2', titleEn: 'Daily Life, MRT & Dining', titleZh: '日常交通與點餐', tocflTarget: 'TOCFL Level 2 · Band A2', desc: 'Pimsleur Units 5–10 · NTNU Vol. 1 (L9–15) & Vol. 2 (L1–6)', pim: [5, 6, 7, 8, 9, 10], ntnu: ['1-9', '1-10', '1-11', '1-12', '1-13', '1-14', '1-15', '2-1', '2-2', '2-3', '2-4', '2-5', '2-6'], vol: 1, lStart: 9 },
    { num: 3, id: 'stage-3', titleEn: 'Independent Living & Stories', titleZh: '獨立生活與閱讀', tocflTarget: 'TOCFL Level 3 · Band B1', desc: 'Pimsleur Units 11–19 · NTNU Vol. 2 (L7–12) & Vol. 3 (L1–6)', pim: [11, 12, 13, 14, 15, 16, 17, 18, 19], ntnu: ['2-7', '2-8', '2-9', '2-10', '2-11', '2-12', '3-1', '3-2', '3-3', '3-4', '3-5', '3-6'], vol: 2, lStart: 7 },
    { num: 4, id: 'stage-4', titleEn: 'Connected Speech & Formal Bridge', titleZh: '連貫表達與書面語橋樑', tocflTarget: 'Lower TOCFL Level 4 · Band B2-', desc: 'NTNU Vol. 3 (L7–10) & Vol. 4 (L1–8) + Register Bridge', pim: [] as number[], ntnu: ['3-7', '3-8', '3-9', '3-10', '4-1', '4-2', '4-3', '4-4', '4-5', '4-6', '4-7', '4-8'], vol: 3, lStart: 7 },
    { num: 5, id: 'stage-5', titleEn: 'Fluent Taiwan Discourse (HSK 5 Equiv.)', titleZh: '高階流利與文化語篇', tocflTarget: 'TOCFL Level 4 · Band B2 / HSK 5', desc: 'NTNU Vol. 5 (L1–8) & Vol. 6 (L1–8) Advanced Readings', pim: [] as number[], ntnu: ['5-1', '5-2', '5-3', '5-4', '5-5', '5-6', '5-7', '5-8', '6-1', '6-2', '6-3', '6-4', '6-5', '6-6', '6-7', '6-8'], vol: 5, lStart: 1 },
  ];

  let foundCurrent = false;
  const stages: PathwayStageProgress[] = defs.map((d) => {
    if (d.num === 0) {
      const done = stage0.isCompleteOrSkipped || hasHigherProgress;
      const status: 'completed' | 'current' | 'upcoming' = done ? 'completed' : 'current';
      if (status === 'current') foundCurrent = true;
      return {
        id: d.id,
        stageNumber: 0,
        titleEn: d.titleEn,
        titleZh: d.titleZh,
        tocflTarget: d.tocflTarget,
        description: d.desc,
        completedUnits: stage0.completedCount,
        totalUnits: stage0.totalCount,
        percent: stage0.percent,
        status,
        nextNtnuVolume: 1,
        nextNtnuLesson: 1,
      };
    }
    const doneCount = d.pim.filter((u) => donePim.has(u)).length + d.ntnu.filter((k) => doneNtnu.has(k)).length;
    const totalCount = d.pim.length + d.ntnu.length;
    const pct = totalCount > 0 ? Math.round((doneCount / totalCount) * 100) : 0;
    let status: 'completed' | 'current' | 'upcoming' = 'upcoming';
    if (pct >= 100) {
      status = 'completed';
    } else if (!foundCurrent) {
      status = 'current';
      foundCurrent = true;
    }
    const nextPim = d.pim.find((u) => !donePim.has(u));
    const nextNtnuKey = d.ntnu.find((k) => !doneNtnu.has(k)) || `${d.vol}-${d.lStart}`;
    const [nv, nl] = nextNtnuKey.split('-').map(Number);
    return {
      id: d.id,
      stageNumber: d.num,
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
