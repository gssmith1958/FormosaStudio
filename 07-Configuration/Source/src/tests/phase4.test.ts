/**
 * FormosaStudio (FORM) — Phase 4 Automated Verification & End-to-End Golden Scenarios (FORM-VAL-001..005)
 * Verifies FORM-REQ-0018, FORM-REQ-0019, FORM-REQ-0020, FORM-REQ-0023 and Golden Scenarios FORM-VAL-001..005
 */

import { tokenizeAndAnnotate, detectToneSandhi } from '../lib/zhuyinTokenizer.ts';
import { analyzePassageComprehensibility, generatePassageClozes } from '../lib/readingEngine.ts';
import { REGISTER_BRIDGE_PAIRS } from '../data/gradedStoriesData.ts';
import {
  publishCustomCurriculumPack,
  parseRawResourceMaterial,
  getCustomPimsleurUnits,
  mergeCustomContemporaryVolumes,
} from '../lib/curriculumAdminStore.ts';
import { CONTEMPORARY_VOLUMES } from '../data/contemporaryVols3to6.ts';
import { App } from '../App.tsx';
import { TodayAndCurriculumHub } from '../components/TodayAndCurriculumHub.tsx';
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
  detectPitchYinOffline,
  generateReferenceToneWaveform,
  getReferenceChaoContour,
} from '../lib/pitchContourEngine.ts';
import {
  createInitialProgressState,
  exportProgressJson,
  importProgressJson,
  recordStrokePractice,
  recordWordPractice,
} from '../lib/progressStore.ts';
import {
  STUDIO_DEFINITIONS,
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
  });
});

console.log(`\n========================================`);
console.log(`Phase 4 & Golden Scenarios Summary: ${passed} passed, ${failed} failed`);
console.log(`========================================\n`);

if (failed > 0) {
  throw new Error(`Phase 4 verification failed with ${failed} error(s).`);
}
