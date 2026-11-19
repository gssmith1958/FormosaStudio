import {
  POLYPHONE_PAIRS,
  TAIWAN_MOE_PRONUNCIATIONS,
} from '../lib/polyphoneLexicon';
import {
  tokenizeAndAnnotate,
} from '../lib/zhuyinTokenizer';
import {
  getAllPimsleurUnits,
  getAllContemporaryVolumes,
  getFullVocabularyCatalog,
} from '../data/vocabularyCatalog';
import {
  createInitialProgressState,
  recordCharacterPractice,
  recordWordPractice,
  recordStrokePractice,
  exportProgressJson,
  importProgressJson,
} from '../lib/progressStore';
import {
  STUDIO_DEFINITIONS,
  dispatchStudioHandoff,
  popReturnHandoff,
  clearStudioHandoff,
  getStudioBusState,
} from '../lib/studioContextBus';
import { WCAG_TONE_PALETTE } from '../components/uiPrimitives';
import {
  parseRawResourceMaterial,
  publishCustomCurriculumPack,
  removeCustomCurriculumPack,
  loadCustomCurriculumPacks,
  clearCustomCurriculumPacks,
} from '../lib/curriculumAdminStore';

// Lightweight zero-dependency test harness compatible with strict browser/ES2020 TypeScript
let totalSuites = 0;
let totalTests = 0;
let failedTests = 0;
let beforeEachHook: (() => void) | null = null;

function beforeEach(fn: () => void): void {
  beforeEachHook = fn;
}

function describe(suiteName: string, fn: () => void): void {
  totalSuites++;
  console.log(`\n=== ${suiteName} ===`);
  fn();
}

function it(testName: string, fn: () => void): void {
  totalTests++;
  if (beforeEachHook) beforeEachHook();
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
    toEqual(expected: unknown): void {
      const aStr = JSON.stringify(actual);
      const eStr = JSON.stringify(expected);
      if (aStr !== eStr) {
        throw new Error(`${prefix}Expected ${eStr}, got ${aStr}`);
      }
    },
    toBeDefined(): void {
      if (actual === undefined || actual === null) {
        throw new Error(`${prefix}Expected value to be defined, got ${String(actual)}`);
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
    toBeLessThanOrEqual(threshold: number): void {
      if (typeof actual !== 'number' || actual > threshold) {
        throw new Error(`${prefix}Expected ${String(actual)} <= ${threshold}`);
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

describe('Phase 1 Verification Suite (FORM-REQ-0001..0005, 0021, 0022)', () => {
  beforeEach(() => {
    clearStudioHandoff();
    clearCustomCurriculumPacks();
  });

  describe('FORM-REQ-0001: Taiwanese Mandarin Polyphone (破音字) Disambiguator', () => {
    it('defines at least 25 core Taiwanese Mandarin polyphone pairs', () => {
      expect(POLYPHONE_PAIRS.length).toBeGreaterThanOrEqual(25);
    });

    it('achieves >= 98% contextual disambiguation accuracy across all 26 polyphone pairs', () => {
      const testCases: Array<{
        phrase: string;
        targetChar: string;
        expectedZhuyin: string;
      }> = [
        // 1. 長
        { phrase: '長大', targetChar: '長', expectedZhuyin: 'ㄓㄤˇ' },
        { phrase: '很長', targetChar: '長', expectedZhuyin: 'ㄔㄤˊ' },
        // 2. 還
        { phrase: '還錢', targetChar: '還', expectedZhuyin: 'ㄏㄨㄢˊ' },
        { phrase: '還有', targetChar: '還', expectedZhuyin: 'ㄏㄞˊ' },
        // 3. 行
        { phrase: '銀行', targetChar: '行', expectedZhuyin: 'ㄏㄤˊ' },
        { phrase: '不行', targetChar: '行', expectedZhuyin: 'ㄒㄧㄥˊ' },
        // 4. 得
        { phrase: '覺得', targetChar: '得', expectedZhuyin: 'ㄉㄜˊ' },
        { phrase: '得去', targetChar: '得', expectedZhuyin: 'ㄉㄟˇ' },
        { phrase: '跑得快', targetChar: '得', expectedZhuyin: 'ㄉㄜ˙' },
        // 5. 樂
        { phrase: '音樂', targetChar: '樂', expectedZhuyin: 'ㄩㄝˋ' },
        { phrase: '快樂', targetChar: '樂', expectedZhuyin: 'ㄌㄜˋ' },
        // 6. 會
        { phrase: '會計', targetChar: '會', expectedZhuyin: 'ㄎㄨㄞˋ' },
        { phrase: '開會', targetChar: '會', expectedZhuyin: 'ㄏㄨㄟˋ' },
        // 7. 數
        { phrase: '數學', targetChar: '數', expectedZhuyin: 'ㄕㄨˋ' },
        { phrase: '數一數', targetChar: '數', expectedZhuyin: 'ㄕㄨˇ' },
        // 8. 著
        { phrase: '看著', targetChar: '著', expectedZhuyin: 'ㄓㄜ˙' },
        { phrase: '睡著', targetChar: '著', expectedZhuyin: 'ㄓㄠˊ' },
        // 9. 重
        { phrase: '重要', targetChar: '重', expectedZhuyin: 'ㄓㄨㄥˋ' },
        { phrase: '重新', targetChar: '重', expectedZhuyin: 'ㄔㄨㄥˊ' },
        // 10. 便
        { phrase: '便宜', targetChar: '便', expectedZhuyin: 'ㄆㄧㄢˊ' },
        { phrase: '方便', targetChar: '便', expectedZhuyin: 'ㄅㄧㄢˋ' },
        // 11. 和
        { phrase: '我和你', targetChar: '和', expectedZhuyin: 'ㄏㄢˋ' },
        { phrase: '和平', targetChar: '和', expectedZhuyin: 'ㄏㄜˊ' },
        // 12. 覺
        { phrase: '發覺', targetChar: '覺', expectedZhuyin: 'ㄐㄩㄝˊ' },
        { phrase: '睡覺', targetChar: '覺', expectedZhuyin: 'ㄐㄧㄠˋ' },
        // 13. 了
        { phrase: '了解', targetChar: '了', expectedZhuyin: 'ㄌㄧㄠˇ' },
        { phrase: '吃了', targetChar: '了', expectedZhuyin: 'ㄌㄜ˙' },
        // 14. 少
        { phrase: '多少', targetChar: '少', expectedZhuyin: 'ㄕㄠˇ' },
        { phrase: '少年', targetChar: '少', expectedZhuyin: 'ㄕㄠˋ' },
        // 15. 好
        { phrase: '好客', targetChar: '好', expectedZhuyin: 'ㄏㄠˋ' },
        { phrase: '好吃', targetChar: '好', expectedZhuyin: 'ㄏㄠˇ' },
        // 16. 傳
        { phrase: '傳統', targetChar: '傳', expectedZhuyin: 'ㄔㄨㄢˊ' },
        { phrase: '自傳', targetChar: '傳', expectedZhuyin: 'ㄓㄨㄢˋ' },
        // 17. 假
        { phrase: '放假', targetChar: '假', expectedZhuyin: 'ㄐㄧㄚˋ' },
        { phrase: '真假', targetChar: '假', expectedZhuyin: 'ㄐㄧㄚˇ' },
        // 18. 彈
        { phrase: '彈琴', targetChar: '彈', expectedZhuyin: 'ㄊㄢˊ' },
        { phrase: '子彈', targetChar: '彈', expectedZhuyin: 'ㄉㄢˋ' },
        // 19. 乾
        { phrase: '乾淨', targetChar: '乾', expectedZhuyin: 'ㄍㄢ' },
        { phrase: '乾坤', targetChar: '乾', expectedZhuyin: 'ㄑㄧㄢˊ' },
        // 20. 教
        { phrase: '教書', targetChar: '教', expectedZhuyin: 'ㄐㄧㄠ' },
        { phrase: '教室', targetChar: '教', expectedZhuyin: 'ㄐㄧㄠˋ' },
        // 21. 都
        { phrase: '都市', targetChar: '都', expectedZhuyin: 'ㄉㄨ' },
        { phrase: '都是', targetChar: '都', expectedZhuyin: 'ㄉㄡ' },
        // 22. 種
        { phrase: '種花', targetChar: '種', expectedZhuyin: 'ㄓㄨㄥˋ' },
        { phrase: '種子', targetChar: '種', expectedZhuyin: 'ㄓㄨㄥˇ' },
        // 23. 相
        { phrase: '照相', targetChar: '相', expectedZhuyin: 'ㄒㄧㄤˋ' },
        { phrase: '相信', targetChar: '相', expectedZhuyin: 'ㄒㄧㄤ' },
        // 24. 空
        { phrase: '有空', targetChar: '空', expectedZhuyin: 'ㄎㄨㄥˋ' },
        { phrase: '空氣', targetChar: '空', expectedZhuyin: 'ㄎㄨㄥ' },
        // 25. 切
        { phrase: '切菜', targetChar: '切', expectedZhuyin: 'ㄑㄧㄝ' },
        { phrase: '一切', targetChar: '切', expectedZhuyin: 'ㄑㄧㄝˋ' },
        // 26. 發
        { phrase: '發票', targetChar: '發', expectedZhuyin: 'ㄈㄚ' },
        { phrase: '頭髮', targetChar: '髮', expectedZhuyin: 'ㄈㄚˇ' },
      ];

      let passed = 0;
      for (const tc of testCases) {
        const result = tokenizeAndAnnotate(tc.phrase);
        const match = result.chars.find((c) => c.char === tc.targetChar);
        expect(match, `Missing char ${tc.targetChar} in ${tc.phrase}`).toBeDefined();
        const actualNormalized = match?.zhuyin?.normalized || '';
        if (actualNormalized === tc.expectedZhuyin) {
          passed++;
        } else {
          expect(actualNormalized, `Phrase ${tc.phrase}`).toBe(tc.expectedZhuyin);
        }
      }
      const accuracy = passed / testCases.length;
      expect(accuracy).toBeGreaterThanOrEqual(0.98);
    });
  });

  describe('FORM-REQ-0002: Taiwan MOE Lexical Standard (兩岸異讀字) & Tone Sandhi', () => {
    it('enforces Taiwan MOE standard readings across 兩岸異讀字 entries', () => {
      expect(Object.keys(TAIWAN_MOE_PRONUNCIATIONS).length).toBeGreaterThanOrEqual(10);

      const moeCases: Array<{ word: string; expectedSyllables: string[] }> = [
        { word: '垃圾', expectedSyllables: ['ㄌㄜˋ', 'ㄙㄜˋ'] },
        { word: '星期', expectedSyllables: ['ㄒㄧㄥ', 'ㄑㄧˊ'] },
        { word: '研究', expectedSyllables: ['ㄧㄢˊ', 'ㄐㄧㄡˋ'] },
        { word: '企業', expectedSyllables: ['ㄑㄧˋ', 'ㄧㄝˋ'] },
        { word: '法國', expectedSyllables: ['ㄈㄚˋ', 'ㄍㄨㄛˊ'] },
        { word: '液體', expectedSyllables: ['ㄧㄝˋ', 'ㄊㄧˇ'] },
        { word: '微糖', expectedSyllables: ['ㄨㄟˊ', 'ㄊㄤˊ'] },
        { word: '知識', expectedSyllables: ['ㄓ', 'ㄕˋ'] },
        { word: '危險', expectedSyllables: ['ㄨㄟˊ', 'ㄒㄧㄢˇ'] },
        { word: '蝸牛', expectedSyllables: ['ㄍㄨㄚ', 'ㄋㄧㄡˊ'] },
      ];

      for (const mc of moeCases) {
        const annotated = tokenizeAndAnnotate(mc.word);
        expect(
          annotated.chars.map((c) => c.zhuyin?.normalized || ''),
          mc.word
        ).toEqual(mc.expectedSyllables);
      }

      const conj = tokenizeAndAnnotate('我和你');
      expect(conj.chars[1].zhuyin?.normalized).toBe('ㄏㄢˋ');
      const peace = tokenizeAndAnnotate('和平');
      expect(peace.chars[0].zhuyin?.normalized).toBe('ㄏㄜˊ');
    });

    it('computes spoken tone sandhi for 3rd-tone chains, 不, and 一 without mutating written Zhuyin', () => {
      const threeThirds = tokenizeAndAnnotate('我很好');
      expect(threeThirds.writtenZhuyinString).toBe('ㄨㄛˇ ㄏㄣˇ ㄏㄠˇ');
      expect(threeThirds.spokenZhuyinString).toBe('ㄨㄛˊ ㄏㄣˊ ㄏㄠˇ');
      expect(threeThirds.sandhiExplanations.length).toBeGreaterThanOrEqual(1);

      const buCase = tokenizeAndAnnotate('不會');
      expect(buCase.chars[0].zhuyin?.normalized).toBe('ㄅㄨˋ');
      expect(buCase.chars[0].spokenZhuyin).toBe('ㄅㄨˊ');

      const yiBefore4 = tokenizeAndAnnotate('一個');
      expect(yiBefore4.chars[0].zhuyin?.normalized).toBe('ㄧ');

      const yiBefore4th = tokenizeAndAnnotate('一塊');
      expect(yiBefore4th.chars[0].zhuyin?.normalized).toBe('ㄧ');
      expect(yiBefore4th.chars[0].spokenZhuyin).toBe('ㄧˊ');

      const yiBefore1 = tokenizeAndAnnotate('一杯');
      expect(yiBefore1.chars[0].zhuyin?.normalized).toBe('ㄧ');
      expect(yiBefore1.chars[0].spokenZhuyin).toBe('ㄧˋ');

      const ordinalYi = tokenizeAndAnnotate('第一');
      expect(ordinalYi.chars[1].spokenZhuyin).toBe('ㄧ');
    });
  });

  describe('FORM-REQ-0003: Expanded NTNU Vols 1–6, Pimsleur 1–19 & TOCFL Catalog', () => {
    it('contains all 6 NTNU Contemporary Chinese volumes with 8–15 lessons per volume', () => {
      const volumes = getAllContemporaryVolumes();
      expect(volumes.length).toBe(6);
      let totalLessons = 0;
      for (const vol of volumes) {
        expect(vol.lessons.length).toBeGreaterThanOrEqual(8);
        expect(vol.lessons.length).toBeLessThanOrEqual(15);
        totalLessons += vol.lessons.length;
        for (const lesson of vol.lessons) {
          expect(lesson.grammarPoints.length).toBeGreaterThanOrEqual(1);
          expect(lesson.sampleSentence.traditional.length).toBeGreaterThan(0);
        }
      }
      expect(totalLessons).toBe(61);
    });

    it('contains all 19 Pimsleur Taiwanese Mandarin Phase 1 units', () => {
      const units = getAllPimsleurUnits();
      expect(units.length).toBe(19);
      expect(units[0].unit).toBe(1);
      expect(units[18].unit).toBe(19);
    });

    it('indexes vocabulary across all 6 TOCFL bands (Novice 1 through Band B2)', () => {
      const catalog = getFullVocabularyCatalog();
      expect(catalog.length).toBeGreaterThan(150);
      const bands = new Set(catalog.map((e) => e.tocflBand));
      expect(bands.has('Novice 1 (準備一級)')).toBe(true);
      expect(bands.has('Novice 2 (準備二級)')).toBe(true);
      expect(bands.has('Band A · Level 1 (入門級)')).toBe(true);
      expect(bands.has('Band A · Level 2 (基礎級)')).toBe(true);
      expect(bands.has('Band B · Level 1 (進階級)')).toBe(true);
      expect(bands.has('Band B · Level 2 (高階級)')).toBe(true);
    });
  });

  describe('FORM-REQ-0004: Unified FSRS-Lite Progress Store & JSON Backup/Restore', () => {
    it('updates stability and difficulty across charMastery, wordMastery, and strokeMastery', () => {
      let state = createInitialProgressState();
      state = recordCharacterPractice(state, [{ char: '學', zhuyin: 'ㄒㄩㄝˊ' }], true, 3);
      state = recordCharacterPractice(state, [{ char: '學', zhuyin: 'ㄒㄩㄝˊ' }], true, 4);
      state = recordWordPractice(
        state,
        { word: '悠遊卡', zhuyin: 'ㄧㄡ ㄧㄡˊ ㄎㄚˇ', english: 'EasyCard' },
        true,
        3
      );
      state = recordStrokePractice(state, { char: '臺', zhuyin: 'ㄊㄞˊ', accuracy: 94 }, true, 4);

      expect(state.charMastery['學'].correctCount).toBe(2);
      expect(state.charMastery['學'].stability).toBeGreaterThan(1.5);
      expect(state.wordMastery['悠遊卡'].correctCount).toBe(1);
      expect(state.strokeMastery['臺'].bestAccuracy).toBe(94);
    });

    it('supports handedness toggle and lossless JSON export/import round-trip with schema validation', () => {
      let state = createInitialProgressState();
      state = { ...state, handedness: 'left' };
      state = recordCharacterPractice(state, [{ char: '灣', zhuyin: 'ㄨㄢ' }], true, 4);

      const json = exportProgressJson(state);
      const imported = importProgressJson(json);
      expect(imported.handedness).toBe('left');
      expect(imported.charMastery['灣'].correctCount).toBe(1);

      let threw = false;
      try {
        importProgressJson('{"schemaVersion": "0.0.1"}');
      } catch {
        threw = true;
      }
      expect(threw).toBe(true);
    });
  });

  describe('FORM-REQ-0021: Unified 6-Studio Shell, UI Primitives & Cross-Studio Bus', () => {
    it('enforces <= 6 top-level studios and WCAG AA >= 4.5:1 contrast across all 5 tones', () => {
      expect(STUDIO_DEFINITIONS.length).toBe(6);
      expect(STUDIO_DEFINITIONS.length).toBeLessThanOrEqual(8);

      for (const tone of [1, 2, 3, 4, 5] as const) {
        expect(WCAG_TONE_PALETTE[tone].contrastRatioOnSlate).toBeGreaterThanOrEqual(4.5);
      }
    });

    it('dispatches cross-studio handoffs and restores previous studio via Return Breadcrumb stack', () => {
      const payload = dispatchStudioHandoff({
        fromStudio: 'reader',
        fromLabel: 'NTNU Vol.1 L2',
        toStudio: 'calligraphy',
        targetText: '臺灣',
        targetZhuyin: 'ㄊㄞˊ ㄨㄢ',
      });

      expect(payload.toStudio).toBe('calligraphy');
      expect(getStudioBusState().handoffStack.length).toBe(1);

      const popped = popReturnHandoff();
      expect(popped?.fromStudio).toBe('reader');
      expect(popped?.targetText).toBe('臺灣');
      expect(getStudioBusState().handoffStack.length).toBe(0);
    });
  });

  describe('FORM-REQ-0022: Curriculum & Resource Admin Manager Live Propagation', () => {
    it('parses raw curriculum lines, auto-annotates Taiwan MOE Zhuyin, and propagates live to all catalogs', () => {
      const rawText = [
        '垃圾桶 | trash can',
        '博愛座 | priority seat',
        '請把垃圾丟進垃圾桶。 | Please throw trash in the trash can.',
      ].join('\n');

      const parsedRows = parseRawResourceMaterial(rawText, 'txt');
      expect(parsedRows.length).toBe(3);
      expect(parsedRows[0].zhuyin).toBe('ㄌㄜˋ ㄙㄜˋ ㄊㄨㄥˇ');
      expect(parsedRows[2].rowType).toBe('dialogue');

      const initialUnitsCount = getAllPimsleurUnits().length;
      const initialVocabCount = getFullVocabularyCatalog().length;

      const pack = publishCustomCurriculumPack({
        packType: 'pimsleur_unit',
        unitOrVolume: 20,
        titleTraditional: '博愛座與垃圾車',
        titleEnglish: 'Priority Seats & Musical Trash Trucks',
        subtitleOrTopic: 'Taipei Metro & Civic Etiquette',
        cefrRange: 'CEFR A2',
        tocflBand: 'Band A · Level 1 (入門級)',
        culturalNote: 'Taiwan musical garbage trucks play Beethoven.',
        rows: parsedRows,
      });

      expect(loadCustomCurriculumPacks().length).toBe(1);
      expect(getAllPimsleurUnits().length).toBe(initialUnitsCount + 1);
      expect(getFullVocabularyCatalog().length).toBe(initialVocabCount + 2);
      expect(
        getFullVocabularyCatalog().some((v) => v.traditional === '垃圾桶')
      ).toBe(true);

      removeCustomCurriculumPack(pack.id);
      expect(getAllPimsleurUnits().length).toBe(initialUnitsCount);
    });
  });
});

console.log(
  `\nSUMMARY: ${totalTests - failedTests}/${totalTests} tests passed across ${totalSuites} suites.`
);
if (failedTests > 0) {
  throw new Error(`${failedTests} test(s) failed.`);
}
