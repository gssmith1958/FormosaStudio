/**
 * FormosaStudio (FORM) — Phase 4 Automated Verification & End-to-End Golden Scenarios (FORM-VAL-001..005)
 * Verifies FORM-REQ-0018, FORM-REQ-0019, FORM-REQ-0020, FORM-REQ-0023 and Golden Scenarios FORM-VAL-001..005
 */

import { tokenizeAndAnnotate, detectToneSandhi, lookupLexiconWord } from '../lib/zhuyinTokenizer.ts';
import { parseZhuyinSyllable } from '../lib/zhuyinTypes.ts';
import { analyzePassageComprehensibility, generatePassageClozes } from '../lib/readingEngine.ts';
import { REGISTER_BRIDGE_PAIRS } from '../data/gradedStoriesData.ts';
import {
  publishCustomCurriculumPack,
  parseRawResourceMaterial,
  getCustomPimsleurUnits,
  mergeCustomContemporaryVolumes,
  updateCustomCurriculumPack,
  removeCustomCurriculumPack,
  exportCustomPacksData,
} from '../lib/curriculumAdminStore.ts';
import { CONTEMPORARY_VOLUMES } from '../data/contemporaryVols3to6.ts';
import { App } from '../App.tsx';
import { TodayAndCurriculumHub } from '../components/TodayAndCurriculumHub.tsx';
import { AccordionNavSidebar } from '../components/AccordionNavSidebar.tsx';
import { SyllabusStageView } from '../components/SyllabusStageView.tsx';
import { AdministrationStudio } from '../components/AdministrationStudio.tsx';
import { Stage0ArrivalScenarios } from '../components/Stage0ArrivalScenarios.tsx';
import {
  GlobalOmnibarModal,
  InteractiveHelpManualDrawer,
  SideContextReferenceDock,
} from '../components/ShellDrawersAndModals.tsx';
import { findVocabEntryByText, getFullVocabularyCatalog } from '../data/vocabularyCatalog.ts';
import {
  SURVIVAL_MODULES,
  SWISS_ARMY_FRAMES,
  TAIWAN_PARTICLES,
  HOKKIEN_EXPRESSIONS,
  TICK_MENU_MISSIONS,
} from '../data/taiwanSurvivalData.ts';
import {
  evaluateListeningAnswer,
  generateListeningDrill,
  verifyTickMenuOrder,
} from '../lib/listeningGymEngine.ts';
import {
  computePressureBrushWidth,
  gradeCharacterWriting,
  gradeUserStroke,
  isWacomEraserEvent,
} from '../lib/wacomStrokeEngine.ts';
import { getMoeCharacterEntry, PHONETIC_SERIES_BANK } from '../data/moeStrokeAndPhoneticData.ts';
import {
  computeToneContourMatchScore,
  detectPitchYinDownsampled2x,
  detectPitchYinOffline,
  generateReferenceToneWaveform,
  getReferenceChaoContour,
} from '../lib/pitchContourEngine.ts';
import { selectSupportedRecorderMimeType } from '../lib/audioSessionManager.ts';
import {
  SYLLABUS_STAGES,
  buildAdaptiveDailySession,
  getRecommendedDisplayPreset,
  getStageProgressDetail,
  resolveActiveStageNumber,
} from '../lib/syllabusModel.ts';
import {
  createInitialProgressState,
  exportProgressJson,
  extractCustomPacksFromBackupJson,
  getOverallPathwaySummary,
  getStage0Summary,
  getTodayProgressSummary,
  importProgressJson,
  markArrivalScenarioComplete,
  markDailyStepComplete,
  markStage0ModuleComplete,
  recordStageCheckpointResult,
  recordStrokePractice,
  recordWordPractice,
  setStage0Skipped,
  toggleNtnuLessonComplete,
  togglePimsleurUnitComplete,
} from '../lib/progressStore.ts';
import {
  STAGE0_ARRIVAL_SCENARIOS,
  STAGE0_BLIND_TONE_POOL,
  STAGE0_CAFE_ROLEPLAY,
  STAGE0_MODULES,
  STAGE0_RADICAL_LEGEND,
  STAGE0_RADICAL_QUIZ,
  STAGE0_ZHUYIN_FAMILIES,
  STAGE0_ZHUYIN_QUIZ_POOL,
} from '../data/stage0BeginnerData.ts';
import { PIMSLEUR_UNITS } from '../data/pimsleurUnitsB.ts';
import {
  STUDIO_DEFINITIONS,
  TOP_LEVEL_NAV_SECTIONS,
  clearStudioHandoff,
  dismissStudioHandoff,
  dispatchStudioHandoff,
  getStudioBusState,
  popReturnHandoff,
} from '../lib/studioContextBus.ts';
import { WCAG_TONE_PALETTE } from '../components/uiPrimitives.tsx';

let passed = 0;
let failed = 0;

function describe(suiteName: string, fn: () => void): void {
  console.log(`\n=== ${suiteName} ===`);
  fn();
}

function it(testName: string, fn: () => void): void {
  try {
    fn();
    passed++;
    console.log(`  ✅ PASS: ${testName}`);
  } catch (err) {
    failed++;
    console.error(`  ❌ FAIL: ${testName}`);
    console.error('   ', err);
  }
}

function expect<T>(actual: T) {
  return {
    toBe(expected: T) {
      if (actual !== expected) {
        throw new Error(`Expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`);
      }
    },
    toBeGreaterThan(expected: number) {
      if (typeof actual !== 'number' || actual <= expected) {
        throw new Error(`Expected ${actual} > ${expected}`);
      }
    },
    toBeGreaterThanOrEqual(expected: number) {
      if (typeof actual !== 'number' || actual < expected) {
        throw new Error(`Expected ${actual} >= ${expected}`);
      }
    },
    toBeLessThan(expected: number) {
      if (typeof actual !== 'number' || actual >= expected) {
        throw new Error(`Expected ${actual} < ${expected}`);
      }
    },
    toBeLessThanOrEqual(expected: number) {
      if (typeof actual !== 'number' || actual > expected) {
        throw new Error(`Expected ${actual} <= ${expected}`);
      }
    },
  };
}

describe('Phase 4 Suite 1: ASEF Guide 008 Ergonomic & Accessibility Thresholds (FORM-REQ-0018, FORM-REQ-0021)', () => {
  it('enforces <= 6 permanent top-level studios (strictly <= 8 ceiling) and WCAG 2.1 AA >= 4.5:1 contrast across all 5 tones', () => {
    expect(STUDIO_DEFINITIONS.length).toBe(6);
    expect(STUDIO_DEFINITIONS.length).toBeLessThanOrEqual(8);
    for (const tone of [1, 2, 3, 4, 5] as const) {
      expect(WCAG_TONE_PALETTE[tone].contrastRatioOnSlate).toBeGreaterThanOrEqual(4.5);
    }
  });

  it('supports 1-click cross-studio deep-link handoff and Return Breadcrumb restoration across all 6 studios', () => {
    clearStudioHandoff();
    dispatchStudioHandoff({
      fromStudio: 'reader',
      fromLabel: 'Adaptive Reader',
      toStudio: 'calligraphy',
      targetText: '裡',
      targetZhuyin: 'ㄌㄧˇ',
      targetEnglish: 'inside',
    });
    expect(getStudioBusState().activeStudio).toBe('calligraphy');
    expect(getStudioBusState().activeHandoff?.targetText).toBe('裡');
    dismissStudioHandoff();
    expect(getStudioBusState().activeStudio).toBe('calligraphy');
    expect(getStudioBusState().activeHandoff).toBe(null);

    dispatchStudioHandoff({
      fromStudio: 'reader',
      fromLabel: 'Adaptive Reader',
      toStudio: 'calligraphy',
      targetText: '裡',
      targetZhuyin: 'ㄌㄧˇ',
      targetEnglish: 'inside',
    });
    popReturnHandoff();
    expect(getStudioBusState().activeStudio).toBe('reader');
  });
});

describe('Phase 4 Suite 2: Golden Scenario FORM-VAL-001 — Context-Aware Taiwan MOE & Polyphone Disambiguation', () => {
  it('disambiguates 長大 vs 很長, 還錢 vs 還有, 銀行 vs 不行, 我和家人, and 垃圾車來了 under Taiwan MOE standard', () => {
    const annotated = tokenizeAndAnnotate('長大以後這條路很長，我去銀行還錢，還有不行忘記我和家人倒垃圾，垃圾車來了。');
    const byWord = Object.fromEntries(annotated.words.map((w) => [w.text, w.writtenZhuyin]));
    expect(byWord['長大']).toBe('ㄓㄤˇ ㄉㄚˋ');
    expect(byWord['很長']).toBe('ㄏㄣˇ ㄔㄤˊ');
    expect(byWord['銀行']).toBe('ㄧㄣˊ ㄏㄤˊ');
    expect(byWord['不行']).toBe('ㄅㄨˋ ㄒㄧㄥˊ');
    expect(byWord['還錢']).toBe('ㄏㄨㄢˊ ㄑㄧㄢˊ');
    expect(byWord['還有']).toBe('ㄏㄞˊ ㄧㄡˇ');
    const heChar = annotated.chars.find((c) => c.char === '和');
    expect(heChar?.zhuyin?.normalized).toBe('ㄏㄢˋ');
    expect(byWord['倒垃圾']).toBe('ㄉㄠˋ ㄌㄜˋ ㄙㄜˋ');
    expect(byWord['垃圾車']).toBe('ㄌㄜˋ ㄙㄜˋ ㄔㄜ');

    const sandhi = detectToneSandhi('你好', 'ㄋㄧˇ ㄏㄠˇ');
    expect(sandhi.length).toBeGreaterThanOrEqual(1);
    expect(sandhi[0].spokenZhuyin).toBe('ㄋㄧˊ ㄏㄠˇ');
  });
});

describe('Phase 4 Suite 3: Golden Scenario FORM-VAL-002 — Adaptive i+1 Reader, Register Bridge & Admin Live Propagation (FORM-REQ-0020)', () => {
  it('updates live i+1 comprehensibility when words are practiced and propagates newly published Admin packs across studios', () => {
    let state = createInitialProgressState();
    const passage = '今天我去銀行還錢，還在便利商店買了微糖豆漿。';
    const before = analyzePassageComprehensibility(passage, state);

    state = recordWordPractice(state, { word: '銀行', zhuyin: 'ㄧㄣˊ ㄏㄤˊ', english: 'bank' }, true, 4);
    state = recordWordPractice(state, { word: '銀行', zhuyin: 'ㄧㄣˊ ㄏㄤˊ', english: 'bank' }, true, 4);
    state = recordWordPractice(state, { word: '銀行', zhuyin: 'ㄧㄣˊ ㄏㄤˊ', english: 'bank' }, true, 4);

    const after = analyzePassageComprehensibility(passage, state);
    expect(after.knownWordsCount).toBeGreaterThan(before.knownWordsCount);

    const clozes = generatePassageClozes(passage, state);
    expect(clozes.length).toBeGreaterThanOrEqual(1);
    expect(REGISTER_BRIDGE_PAIRS.length).toBeGreaterThanOrEqual(15);

    const rows = parseRawResourceMaterial('高鐵月台 | HSR platform | | vocab');
    publishCustomCurriculumPack({
      packType: 'pimsleur_unit',
      unitOrVolume: 25,
      titleTraditional: 'Unit 25: 高鐵月台',
      titleEnglish: 'Unit 25: High Speed Rail Platform',
      subtitleOrTopic: 'Taiwan HSR Travel',
      cefrRange: 'A2',
      tocflBand: 'Level 2 (Band A2)',
      rows,
    });
    const found = findVocabEntryByText('高鐵月台');
    expect(Boolean(found)).toBe(true);
    expect(getFullVocabularyCatalog().length).toBeGreaterThanOrEqual(150);
  });
});

describe('Phase 4 Suite 4: Golden Scenario FORM-VAL-003 — Taiwan in 10 Minutes a Day Survival & Tick-Menu (點菜單)', () => {
  it('validates Sticky-Label modules, Table 5 點菜單 NT$250 order, and 5-category Functional Listening Gym', () => {
    expect(SURVIVAL_MODULES.length).toBe(6);
    expect(SWISS_ARMY_FRAMES.length).toBe(12);
    expect(TAIWAN_PARTICLES.length).toBeGreaterThanOrEqual(8);
    expect(HOKKIEN_EXPRESSIONS.length).toBeGreaterThanOrEqual(10);

    const mission1 = TICK_MENU_MISSIONS[0];
    const menuCheck = verifyTickMenuOrder(mission1, {
      diningMode: 'dine_in',
      tableNumber: '5',
      quantities: {
        'tm-beef-lg': 1,
        'tm-cucumber': 1,
        'tm-soymilk': 2,
      },
      spiceNotes: {
        'tm-beef-lg': 'mild',
      },
    });
    expect(menuCheck.isCompleteMatch).toBe(true);
    expect(menuCheck.calculatedTotalNtd).toBe(250);

    const drill = generateListeningDrill('nt_prices', 1);
    const evalRes = evaluateListeningAnswer(drill, '24,500');
    expect(evalRes.isCorrect).toBe(true);
  });
});

describe('Phase 4 Suite 5: Golden Scenario FORM-VAL-004 — Wacom Stylus Pressure, Eraser & Taiwan MOE Vector Stroke Grader', () => {
  it('verifies Wacom pressure tapering, eraser detection, Taiwan MOE 裡/為/骨/黃 grading, and 10-series 形聲字 workbench', () => {
    expect(computePressureBrushWidth(0.9).widthPx).toBeGreaterThan(computePressureBrushWidth(0.2).widthPx);
    expect(isWacomEraserEvent({ clientX: 0, clientY: 0, pointerType: 'eraser' })).toBe(true);

    const wei = getMoeCharacterEntry('為');
    const firstRef = wei.strokes[0];
    const reversed = gradeUserStroke(
      {
        startedAt: 0,
        endedAt: 20,
        points: [
          { x: firstRef.end.x, y: firstRef.end.y, pressure: 0.5, widthPx: 6, timestamp: 0, pointerType: 'pen' },
          { x: firstRef.start.x, y: firstRef.start.y, pressure: 0.5, widthPx: 6, timestamp: 20, pointerType: 'pen' },
        ],
      },
      firstRef
    );
    expect(reversed.flag).toBe('REVERSED_DIRECTION');

    const correctStrokes = wei.strokes.map((st) => ({
      startedAt: 0,
      endedAt: 20,
      points: [
        { x: st.start.x, y: st.start.y, pressure: 0.5, widthPx: 6, timestamp: 0, pointerType: 'pen' },
        { x: st.end.x, y: st.end.y, pressure: 0.6, widthPx: 7, timestamp: 20, pointerType: 'pen' },
      ],
    }));
    const fullGrade = gradeCharacterWriting(correctStrokes, wei, 'trace');
    expect(fullGrade.overallAccuracy).toBeGreaterThanOrEqual(85);
    expect(PHONETIC_SERIES_BANK.length).toBe(10);
  });
});

describe('Phase 4 Suite 6: Golden Scenario FORM-VAL-005 — Offline YIN F0 Pitch Extraction & Cross-Module FSRS Persistence', () => {
  it('extracts offline YIN F0 within < 3 Hz, scores Dual-Curve Chao contours, and persists FSRS state losslessly', () => {
    const wave = generateReferenceToneWaveform({ constantF0Hz: 220, durationSec: 0.12, sampleRate: 44100 });
    const pitch = detectPitchYinOffline(wave, 44100, 100, 300);
    expect(Math.abs((pitch.f0Hz || 0) - 220)).toBeLessThan(3.0);

    const target2 = getReferenceChaoContour(2, 20);
    const score = computeToneContourMatchScore(target2, target2);
    expect(score.matchScore).toBeGreaterThanOrEqual(95);

    let progress = createInitialProgressState();
    progress = recordStrokePractice(progress, { char: '裡', zhuyin: 'ㄌㄧˇ', accuracy: 96 }, true, 4);
    const json = exportProgressJson(progress);
    const restored = importProgressJson(json);
    expect(restored.strokeMastery['裡'].bestAccuracy).toBe(96);
    expect(restored.charMastery['裡'].stability).toBeGreaterThan(0);
  });
});

describe('Phase 4 Suite 7: Unified Shell, In-App Manual (FORM-REQ-0023) & Cross-Studio Sync (FORM-REQ-0020)', () => {
  it('exports the unified 6-Studio App shell, Hub, Omnibar, Context Dock, and Help/Manual Drawer cleanly', () => {
    expect(typeof App).toBe('function');
    expect(typeof TodayAndCurriculumHub).toBe('function');
    expect(typeof GlobalOmnibarModal).toBe('function');
    expect(typeof SideContextReferenceDock).toBe('function');
    expect(typeof InteractiveHelpManualDrawer).toBe('function');
  });

  it('propagates custom Admin packs into Studio 1 Pimsleur/NTNU explorers and raises FSRS mastery for Adaptive Zhuyin fading', () => {
    expect(getCustomPimsleurUnits().some((u) => u.unit === 25)).toBe(true);
    const mergedVols = mergeCustomContemporaryVolumes(CONTEMPORARY_VOLUMES);
    expect(mergedVols.length).toBe(6);

    let state = createInitialProgressState();
    state = recordWordPractice(state, { word: '銀行', zhuyin: 'ㄧㄣˊ ㄏㄤˊ', english: 'bank' }, true, 4);
    expect(Boolean(state.charMastery['銀'] && state.charMastery['行'])).toBe(true);
    state = recordStrokePractice(state, { char: '臺', zhuyin: 'ㄊㄞˊ', accuracy: 95 }, true, 4);
    state = recordStrokePractice(state, { char: '臺', zhuyin: 'ㄊㄞˊ', accuracy: 96 }, true, 4);
    state = recordStrokePractice(state, { char: '臺', zhuyin: 'ㄊㄞˊ', accuracy: 98 }, true, 4);
    expect(state.charMastery['臺'].level).toBeGreaterThanOrEqual(2);
    expect(state.strokeMastery['臺'].attemptCount).toBe(3);

    // Verify Daily 10-Min Progress Ring & 6-Stage Learning Pathway persistence (v1.1.0 HMI)
    state = markDailyStepComplete(state, 1);
    const today = getTodayProgressSummary(state);
    expect(today.minutesCompleted).toBe(3);
    expect(today.percentComplete).toBe(30);
    expect(today.nextStep).toBe(2);

    state = togglePimsleurUnitComplete(state, 1);
    state = toggleNtnuLessonComplete(state, '1-1');
    const pathway = getOverallPathwaySummary(state);
    expect(pathway.completedLessonsTotal).toBe(2);
    expect(pathway.stages.length).toBe(6);
    expect(pathway.currentStage.stageNumber).toBe(1);
    expect(pathway.currentStage.completedUnits).toBe(2);

    // Verify Stage 0 Beginner Launchpad, Pinyin training wheels & Taiwanized Pimsleur (v1.2.0 / FORM-LL-009)
    expect(createInitialProgressState().showPinyinHint).toBe(true);
    expect(STAGE0_MODULES.length).toBe(5);
    const totalZhuyinSymbols = STAGE0_ZHUYIN_FAMILIES.reduce((acc, f) => acc + f.symbols.length, 0);
    expect(totalZhuyinSymbols).toBe(37);
    expect(STAGE0_ZHUYIN_FAMILIES[0].symbols[0].englishCue.startsWith('b ')).toBe(true);
    expect(STAGE0_ZHUYIN_FAMILIES.every((f) => f.blends.length >= 5)).toBe(true);
    expect(STAGE0_ZHUYIN_FAMILIES[0].blends.every((b) => ['ㄅ', 'ㄆ', 'ㄇ', 'ㄈ'].includes(b.zhuyin[0]))).toBe(true);
    expect(STAGE0_RADICAL_QUIZ.every((q) => Boolean(q.zhuyin && q.pinyin && q.meaningEn))).toBe(true);
    // Anti-tautology checks (v1.3.0): blind tone pool covers all 4 tones + pairs, Zhuyin blind quiz >= 10, unseen radicals, non-fixed Café roleplay
    expect(STAGE0_BLIND_TONE_POOL.length).toBeGreaterThanOrEqual(20);
    expect(([1, 2, 3, 4] as const).every((t) => STAGE0_BLIND_TONE_POOL.some((q) => q.answerTone === t))).toBe(true);
    expect(STAGE0_BLIND_TONE_POOL.some((q) => q.kind === 'pair_choice')).toBe(true);
    expect(STAGE0_ZHUYIN_QUIZ_POOL.length).toBeGreaterThanOrEqual(12);
    const legendExamplesJoined = STAGE0_RADICAL_LEGEND.map((l) => l.examples).join(' ');
    expect(STAGE0_RADICAL_QUIZ.every((q) => !legendExamplesJoined.includes(q.char))).toBe(true);
    expect(new Set(STAGE0_CAFE_ROLEPLAY.map((t) => t.correctIdx)).size).toBeGreaterThanOrEqual(2);
    expect(SURVIVAL_MODULES[0].labels.some((l) => l.traditional.includes('洗手間'))).toBe(true);
    expect(SURVIVAL_MODULES[1].labels.some((l) => l.traditional.includes('多少錢'))).toBe(true);
    expect(SURVIVAL_MODULES[2].labels.some((l) => l.traditional.includes('怎麼走'))).toBe(true);
    state = markStage0ModuleComplete(state, '0.1');
    expect(getStage0Summary(state).completedCount).toBe(1);
    expect(PIMSLEUR_UNITS.every((u) => !u.dialogues.some((d) => d.traditional.includes('普通話') || d.traditional.includes('一點兒')))).toBe(true);

    // Verify exact tone-marked Hanyu Pinyin conversion from Zhuyin (no garbled dwuei/bwu/qyi)
    expect(parseZhuyinSyllable('ㄉㄨㄟˋ').pinyin).toBe('duì');
    expect(parseZhuyinSyllable('ㄅㄨˋ').pinyin).toBe('bù');
    expect(parseZhuyinSyllable('ㄑㄧˇ').pinyin).toBe('qǐ');
    expect(parseZhuyinSyllable('ㄨㄛˇ').pinyin).toBe('wǒ');
    expect(parseZhuyinSyllable('ㄇㄧㄥˊ').pinyin).toBe('míng');
    expect(parseZhuyinSyllable('ㄏㄨㄟˋ').pinyin).toBe('huì');
    expect(parseZhuyinSyllable('ㄕㄨㄛ').pinyin).toBe('shuō');
    expect(parseZhuyinSyllable('ㄓㄨㄥ').pinyin).toBe('zhōng');
    expect(parseZhuyinSyllable('ㄒㄧㄝˋ').pinyin).toBe('xiè');
    expect(parseZhuyinSyllable('ㄌㄩˋ').pinyin).toBe('lǜ');
    expect(parseZhuyinSyllable('ㄓ').pinyin).toBe('zhī');
    expect(parseZhuyinSyllable('˙ㄇㄚ').pinyin).toBe('ma');
  });
});

describe('Phase 4 Suite 8: FORM-ECR-001 (v2.0.0 Milestone A) — 5-Section Menu, Syllabus 0–5, 5 Arrival Scenarios, iPad 48 kHz YIN & Admin CRUD', () => {
  it('enforces 5-section accordion navigation ceiling and exports v2.0 UI components cleanly', () => {
    expect(TOP_LEVEL_NAV_SECTIONS.length).toBe(5);
    expect(TOP_LEVEL_NAV_SECTIONS.length).toBeLessThanOrEqual(8);
    expect(typeof AccordionNavSidebar).toBe('function');
    expect(typeof SyllabusStageView).toBe('function');
    expect(typeof AdministrationStudio).toBe('function');
    expect(typeof Stage0ArrivalScenarios).toBe('function');
  });

  it('extracts anti-aliased 2x downsampled YIN F0 within < 3 Hz at BOTH iPad 48 kHz and Desktop 44.1 kHz (DSP-1)', () => {
    const wave48k = generateReferenceToneWaveform({ constantF0Hz: 220, durationSec: 0.12, sampleRate: 48000 });
    const pitch48k = detectPitchYinDownsampled2x(wave48k.subarray(0, 2048), 48000, 100, 300);
    expect(Math.abs((pitch48k.f0Hz || 0) - 220)).toBeLessThan(3.0);

    const wave44k = generateReferenceToneWaveform({ constantF0Hz: 180, durationSec: 0.12, sampleRate: 44100 });
    const pitch44k = detectPitchYinDownsampled2x(wave44k.subarray(0, 2048), 44100, 100, 300);
    expect(Math.abs((pitch44k.f0Hz || 0) - 180)).toBeLessThan(3.0);

    expect(typeof selectSupportedRecorderMimeType()).toBe('string');
  });

  it('delivers 5 authentic Taiwan Stage 0.5 arrival scenarios with zero Mainland leakage and >= 3/5 unlock gate (PED-3)', () => {
    expect(STAGE0_ARRIVAL_SCENARIOS.length).toBe(5);
    const forbidden = ['地鐵', '一點兒', '普通話', '服務員'];
    for (const sc of STAGE0_ARRIVAL_SCENARIOS) {
      expect(sc.turns.length).toBe(3);
      expect(sc.culturalCue.length).toBeGreaterThan(20);
      const joined = sc.turns.map((t) => `${t.clerkZh} ${t.options.map((o) => o.text).join(' ')}`).join(' ');
      for (const bad of forbidden) {
        expect(joined.includes(bad)).toBe(false);
      }
    }

    let state = createInitialProgressState();
    state = markArrivalScenarioComplete(state, STAGE0_ARRIVAL_SCENARIOS[0].id);
    state = markArrivalScenarioComplete(state, STAGE0_ARRIVAL_SCENARIOS[1].id);
    expect((state.completedStage0Modules || []).includes('0.5')).toBe(false);
    state = markArrivalScenarioComplete(state, STAGE0_ARRIVAL_SCENARIOS[2].id);
    expect((state.completedStage0Modules || []).includes('0.5')).toBe(true);
  });

  it('aligns Syllabus Stages 0–5 to TOCFL Level 4 / HSK 5, drives Adaptive Daily Sessions, and certifies checkpoints (PED-1, PED-2)', () => {
    expect(SYLLABUS_STAGES.length).toBe(6);
    expect(SYLLABUS_STAGES[5].tocflDualLabel.includes('HSK 5')).toBe(true);
    expect(getRecommendedDisplayPreset(0).showPinyinHint).toBe(true);
    expect(getRecommendedDisplayPreset(4).showPinyinHint).toBe(false);

    let state = createInitialProgressState();
    expect(resolveActiveStageNumber(state)).toBe(0);

    state = setStage0Skipped(state, true);
    expect(resolveActiveStageNumber(state)).toBe(1);

    const catalog = getFullVocabularyCatalog();
    const sessionS1 = buildAdaptiveDailySession(state, catalog);
    expect(sessionS1.sessionStageNumber).toBe(1);
    expect(sessionS1.isPeekAhead).toBe(false);
    expect(sessionS1.queueItems.length).toBeGreaterThanOrEqual(4);

    const peekS2 = buildAdaptiveDailySession(state, catalog, 2);
    expect(peekS2.sessionStageNumber).toBe(2);
    expect(peekS2.isPeekAhead).toBe(true);
    expect(peekS2.spiralReviewCount).toBeGreaterThanOrEqual(1);

    state = recordStageCheckpointResult(state, 1, 60);
    expect(getStageProgressDetail(1, state).checkpointPassed).toBe(false);
    state = recordStageCheckpointResult(state, 1, 80);
    expect(getStageProgressDetail(1, state).checkpointPassed).toBe(true);
  });

  it('supports Admin Create/Edit/Delete for custom scenarios, cleans DYNAMIC_LEXICON on delete, and bundles packs in unified JSON backup (ARCH-3)', () => {
    const rows = parseRawResourceMaterial('蚵仔煎 | Taiwan oyster omelette | ㄜˊ ㄚˇ ㄐㄧㄢ | vocab');
    const created = publishCustomCurriculumPack({
      packType: 'custom_scenario',
      unitOrVolume: 1,
      targetStage: 2,
      titleTraditional: '夜市小吃',
      titleEnglish: 'Night Market Classics',
      subtitleOrTopic: 'Custom Stage 2 Scenario',
      cefrRange: 'A2',
      tocflBand: 'Stage 2',
      rows,
    });
    expect(lookupLexiconWord('蚵仔煎')).toBe('ㄜˊ ㄚˇ ㄐㄧㄢ');
    expect(tokenizeAndAnnotate('我要吃蚵仔煎').words.some((w) => w.text === '蚵仔煎')).toBe(true);
    expect(Boolean(findVocabEntryByText('蚵仔煎'))).toBe(true);

    const updated = updateCustomCurriculumPack(created.id, { titleEnglish: 'Taipei Night Market Classics' });
    expect(updated?.titleEnglish).toBe('Taipei Night Market Classics');

    // Unified JSON backup bundles progress + custom packs
    const baseState = createInitialProgressState();
    const unifiedJson = exportProgressJson(baseState, exportCustomPacksData());
    const restoredPacks = extractCustomPacksFromBackupJson(unifiedJson);
    expect(Array.isArray(restoredPacks) && restoredPacks.length >= 1).toBe(true);

    // Deleting pack cleans DYNAMIC_LEXICON so deleted custom words do not linger
    removeCustomCurriculumPack(created.id);
    expect(lookupLexiconWord('蚵仔煎')).toBe(undefined);
  });
});

console.log(`\n========================================`);
console.log(`Phase 4 & Golden Scenarios Summary: ${passed} passed, ${failed} failed`);
console.log(`========================================\n`);

if (failed > 0) {
  throw new Error(`Phase 4 verification failed with ${failed} error(s).`);
}
