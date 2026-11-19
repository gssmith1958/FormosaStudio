/**
 * FormosaStudio (FORM) — Phase 2 Automated Verification Suite
 * Verifies FORM-REQ-0006, FORM-REQ-0007, FORM-REQ-0008, FORM-REQ-0009, FORM-REQ-0010, FORM-REQ-0011
 */

import {
  GRADED_STORIES,
  REGISTER_BRIDGE_PAIRS,
} from '../data/gradedStoriesData.ts';
import {
  analyzePassageComprehensibility,
  generatePassageClozes,
} from '../lib/readingEngine.ts';
import {
  HOKKIEN_EXPRESSIONS,
  SURVIVAL_MODULES,
  SWISS_ARMY_FRAMES,
  TAIWAN_PARTICLES,
  TICK_MENU_CATALOG,
  TICK_MENU_MISSIONS,
} from '../data/taiwanSurvivalData.ts';
import {
  LISTENING_GYM_CATEGORIES,
  evaluateListeningAnswer,
  generateListeningDrill,
  verifyTickMenuOrder,
} from '../lib/listeningGymEngine.ts';
import {
  createInitialProgressState,
  recordWordPractice,
} from '../lib/progressStore.ts';

let totalSuites = 0;
let totalTests = 0;
let failedTests = 0;

function describe(suiteName: string, fn: () => void): void {
  totalSuites++;
  console.log(`\n=== ${suiteName} ===`);
  fn();
}

function it(testName: string, fn: () => void): void {
  totalTests++;
  try {
    fn();
    console.log(`  PASS: ${testName}`);
  } catch (err) {
    failedTests++;
    const msg = err instanceof Error ? err.message : String(err);
    console.error(`  FAIL: ${testName}\n    -> ${msg}`);
  }
}

function expect<T>(actual: T, customMessage?: string) {
  const prefix = customMessage ? `${customMessage}: ` : '';
  return {
    toBe(expected: T): void {
      if (actual !== expected) {
        throw new Error(
          `${prefix}Expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`
        );
      }
    },
    toBeGreaterThan(threshold: number): void {
      if (typeof actual !== 'number' || actual <= threshold) {
        throw new Error(`${prefix}Expected ${String(actual)} > ${threshold}`);
      }
    },
    toBeGreaterThanOrEqual(threshold: number): void {
      if (typeof actual !== 'number' || actual < threshold) {
        throw new Error(`${prefix}Expected ${String(actual)} >= ${threshold}`);
      }
    },
    toBeLessThan(threshold: number): void {
      if (typeof actual !== 'number' || actual >= threshold) {
        throw new Error(`${prefix}Expected ${String(actual)} < ${threshold}`);
      }
    },
    toContain(substring: string): void {
      if (typeof actual !== 'string' || !actual.includes(substring)) {
        throw new Error(
          `${prefix}Expected ${JSON.stringify(actual)} to contain ${JSON.stringify(substring)}`
        );
      }
    },
  };
}

describe('Phase 2 Verification Suite (FORM-REQ-0006..0011)', () => {
  describe('FORM-REQ-0006: Adaptive i+1 Graded Reader Across TOCFL Bands A1–B2', () => {
    it('provides 8 multi-paragraph Taiwan-set graded stories spanning TOCFL Novice 1 through Band B2', () => {
      expect(GRADED_STORIES.length).toBeGreaterThanOrEqual(8);
      for (const story of GRADED_STORIES) {
        expect(story.paragraphs.length).toBeGreaterThanOrEqual(3);
        expect(story.questions.length).toBeGreaterThanOrEqual(1);
      }
    });

    it('computes live Known (Lv.2+), Familiar (Lv.1), and Target i+1 percentages and updates when words are practiced', () => {
      let state = createInitialProgressState();
      const storyText = GRADED_STORIES[0].paragraphs.map((p) => p.traditional).join(' ');
      const initialReport = analyzePassageComprehensibility(storyText, state);

      expect(initialReport.totalChineseWords).toBeGreaterThan(20);
      expect(initialReport.zoneLabel).toContain('% Known');

      // Practice a target i+1 word and verify comprehensibility increases
      const firstTarget = initialReport.targetWords[0];
      expect(Boolean(firstTarget)).toBe(true);
      state = recordWordPractice(
        state,
        {
          word: firstTarget.text,
          zhuyin: firstTarget.writtenZhuyin,
          english: firstTarget.englishGloss || 'test',
        },
        true,
        4
      );
      state = recordWordPractice(
        state,
        {
          word: firstTarget.text,
          zhuyin: firstTarget.writtenZhuyin,
          english: firstTarget.englishGloss || 'test',
        },
        true,
        4
      );
      state = recordWordPractice(
        state,
        {
          word: firstTarget.text,
          zhuyin: firstTarget.writtenZhuyin,
          english: firstTarget.englishGloss || 'test',
        },
        true,
        4
      );

      const updatedReport = analyzePassageComprehensibility(storyText, state);
      expect(updatedReport.knownWordsCount).toBeGreaterThan(initialReport.knownWordsCount);
    });
  });

  describe('FORM-REQ-0007: Custom Traditional Chinese Text Importer & Instant Cloze Generator', () => {
    it('segments a 2,000-character Traditional Chinese passage in < 50 ms and generates playable clozes', () => {
      const baseSample =
        '每天晚上七點半，我們都會在師大巷口聽到黃色垃圾車播放古典鋼琴音樂。我和朋友先去便利商店用悠遊卡買微糖溫豆漿，再搭捷運去臺北車站。';
      const longPassage = baseSample.repeat(32); // > 2,000 characters
      expect(longPassage.length).toBeGreaterThanOrEqual(2000);

      const state = createInitialProgressState();
      const report = analyzePassageComprehensibility(longPassage, state);
      expect(report.elapsedMs).toBeLessThan(50);

      const clozes = generatePassageClozes(baseSample, state, 4);
      expect(clozes.length).toBeGreaterThanOrEqual(2);
      for (const clz of clozes) {
        expect(clz.options.length).toBe(4);
        expect(clz.options[clz.correctIndex].traditional).toBe(clz.targetWord);
        expect(clz.sentenceWithBlank).toContain('______');
      }
    });
  });

  describe('FORM-REQ-0008: Spoken (口語) vs. Written (書面語) Taiwan Register Bridge', () => {
    it('covers at least 15 core 口語 <-> 書面語 pairs with interactive register-conversion drills', () => {
      expect(REGISTER_BRIDGE_PAIRS.length).toBeGreaterThanOrEqual(15);
      const requiredSpoken = ['可是', '還有', '不但', '這時候', '常常', '覺得', '差不多'];
      for (const req of requiredSpoken) {
        expect(
          REGISTER_BRIDGE_PAIRS.some((p) => p.spoken.includes(req)),
          `Missing spoken pair ${req}`
        ).toBe(true);
      }
      for (const pair of REGISTER_BRIDGE_PAIRS) {
        expect(pair.drillOptions.includes(pair.drillAnswer)).toBe(true);
      }
    });
  });

  describe('FORM-REQ-0009: Taiwan in 10 Minutes a Day — 6 Sticky-Label Modules & 12 Swiss-Army-Knife Frames', () => {
    it('includes all 6 themed 10-minute survival modules and 12 Swiss-Army-Knife sentence frames', () => {
      expect(SURVIVAL_MODULES.length).toBe(6);
      for (const mod of SURVIVAL_MODULES) {
        expect(mod.estimatedMinutes).toBe(10);
        expect(mod.labels.length).toBeGreaterThanOrEqual(4);
      }
      expect(SWISS_ARMY_FRAMES.length).toBe(12);
    });
  });

  describe('FORM-REQ-0010: Interactive Taiwanese Paper Tick-Menu (點菜單) & Taiwanese Pragmatics (語助詞 & 臺語)', () => {
    it('verifies Table 5 dine-in beef noodle order and NT$250 bill total on the 點菜單 simulator', () => {
      expect(TICK_MENU_CATALOG.length).toBeGreaterThanOrEqual(8);
      const mission1 = TICK_MENU_MISSIONS[0];

      const exactResult = verifyTickMenuOrder(mission1, {
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
      expect(exactResult.isCompleteMatch).toBe(true);
      expect(exactResult.calculatedTotalNtd).toBe(250);

      const wrongResult = verifyTickMenuOrder(mission1, {
        diningMode: 'takeout',
        tableNumber: '5',
        quantities: { 'tm-beef-lg': 2 },
        spiceNotes: {},
      });
      expect(wrongResult.isCompleteMatch).toBe(false);
      expect(wrongResult.discrepancies.length).toBeGreaterThan(0);
    });

    it('covers at least 8 Taiwanese sentence-final particles (語助詞) and 10 Hokkien (臺語) expressions', () => {
      expect(TAIWAN_PARTICLES.length).toBeGreaterThanOrEqual(8);
      expect(HOKKIEN_EXPRESSIONS.length).toBeGreaterThanOrEqual(10);
    });
  });

  describe('FORM-REQ-0011: 5-Category Taiwan Functional Listening Gym', () => {
    it('generates and validates drills across all 5 categories (NT$萬, 打折, 民國 dates, 09XX/發票, and 段/巷/弄 addresses)', () => {
      expect(LISTENING_GYM_CATEGORIES.length).toBe(5);

      // 1. NT$ 萬 price
      const priceDrill = generateListeningDrill('nt_prices', 1); // 24500
      const priceEval = evaluateListeningAnswer(priceDrill, '24,500');
      expect(priceEval.isCorrect).toBe(true);

      // 2. 打折 discount (八折 = 800)
      const discDrill = generateListeningDrill('discounts', 0);
      const discEval = evaluateListeningAnswer(discDrill, '800');
      expect(discEval.isCorrect).toBe(true);

      // 3. 民國 calendar date (民國88年10月5號 -> 1999-10-05)
      const dateDrill = generateListeningDrill('minguo_dates', 0);
      const dateEval = evaluateListeningAnswer(dateDrill, '1999-10-05');
      expect(dateEval.isCorrect).toBe(true);

      // 4. 09XX mobile number
      const phoneDrill = generateListeningDrill('phone_invoice', 0);
      const phoneEval = evaluateListeningAnswer(phoneDrill, '0912345678');
      expect(phoneEval.isCorrect).toBe(true);

      // 5. 段/巷/弄/號/樓 address
      const addrDrill = generateListeningDrill('addresses', 0);
      const addrEval = evaluateListeningAnswer(addrDrill, '1段 162號 3樓');
      expect(addrEval.isCorrect).toBe(true);
    });
  });
});

console.log(
  `\nSUMMARY: ${totalTests - failedTests}/${totalTests} tests passed across ${totalSuites} suites.`
);
if (failedTests > 0) {
  throw new Error(`${failedTests} test(s) failed.`);
}
