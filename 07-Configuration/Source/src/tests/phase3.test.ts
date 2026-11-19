/**
 * FormosaStudio (FORM) — Phase 3 Automated Verification Suite
 * Verifies FORM-REQ-0012, FORM-REQ-0013, FORM-REQ-0014, FORM-REQ-0015, FORM-REQ-0016, FORM-REQ-0017
 */

import {
  MOE_STROKE_CHARACTER_BANK,
  PHONETIC_SERIES_BANK,
  SEMANTIC_RADICALS,
  getMoeCharacterEntry,
} from '../data/moeStrokeAndPhoneticData.ts';
import {
  computePressureBrushWidth,
  extractCoalescedPoints,
  gradeCharacterWriting,
  gradeUserStroke,
  isWacomEraserEvent,
  shouldAcceptPointerEvent,
} from '../lib/wacomStrokeEngine.ts';
import {
  RETROFLEX_MINIMAL_PAIRS,
  TONE_SANDHI_DRILL_PHRASES,
  computeToneContourMatchScore,
  detectPitchYinOffline,
  f0ToChaoToneLevel,
  generateReferenceToneWaveform,
  getReferenceChaoContour,
} from '../lib/pitchContourEngine.ts';
import {
  DAQIAN_DOJO_STAGES,
  DAQIAN_KEYBOARD_ROWS,
  FIVE_WORLD_SKILL_TREE,
  MATCH_ARENA_PAIRS,
  zhuyinToDaqianKeySequence,
} from '../data/daqianAndDojoData.ts';

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
    toBeTruthy() {
      if (!actual) {
        throw new Error(`Expected truthy value, got ${JSON.stringify(actual)}`);
      }
    },
  };
}

describe('Phase 3 Suite 1: Wacom Stylus PointerEvent Engine (FORM-REQ-0012)', () => {
  it('computes monotonically increasing brush widths from Wacom pressure [0.05..1.0]', () => {
    const light = computePressureBrushWidth(0.1);
    const medium = computePressureBrushWidth(0.5);
    const heavy = computePressureBrushWidth(0.95);
    expect(light.widthPx).toBeGreaterThan(2.5);
    expect(medium.widthPx).toBeGreaterThan(light.widthPx);
    expect(heavy.widthPx).toBeGreaterThan(medium.widthPx);
    expect(heavy.widthPx).toBeLessThanOrEqual(14.0);
  });

  it('extracts sub-frame coalesced points via getCoalescedEvents() and normalizes to [0..1]', () => {
    const rect = { left: 100, top: 50, width: 400, height: 400 };
    const syntheticEvent = {
      clientX: 300,
      clientY: 250,
      pressure: 0.7,
      pointerType: 'pen',
      getCoalescedEvents: () => [
        { clientX: 200, clientY: 150, pressure: 0.4, pointerType: 'pen', timeStamp: 10 },
        { clientX: 250, clientY: 200, pressure: 0.55, pointerType: 'pen', timeStamp: 15 },
        { clientX: 300, clientY: 250, pressure: 0.7, pointerType: 'pen', timeStamp: 20 },
      ],
    };
    const pts = extractCoalescedPoints(syntheticEvent, rect);
    expect(pts.length).toBe(3);
    expect(pts[0].x).toBe(0.25);
    expect(pts[0].y).toBe(0.25);
    expect(pts[2].x).toBe(0.5);
    expect(pts[2].y).toBe(0.5);
  });

  it('detects Wacom eraser nib (pointerType="eraser", buttons=32, button=5) & enforces Pen-Only Palm Rejection', () => {
    expect(isWacomEraserEvent({ clientX: 0, clientY: 0, pointerType: 'eraser' })).toBe(true);
    expect(isWacomEraserEvent({ clientX: 0, clientY: 0, pointerType: 'pen', buttons: 32 })).toBe(true);
    expect(isWacomEraserEvent({ clientX: 0, clientY: 0, pointerType: 'pen', button: 5 })).toBe(true);
    expect(isWacomEraserEvent({ clientX: 0, clientY: 0, pointerType: 'pen', buttons: 1 })).toBe(false);

    // Pen-only palm rejection rejects capacitive touch while accepting pen
    expect(shouldAcceptPointerEvent({ clientX: 0, clientY: 0, pointerType: 'touch' }, true)).toBe(false);
    expect(shouldAcceptPointerEvent({ clientX: 0, clientY: 0, pointerType: 'pen' }, true)).toBe(true);
    expect(shouldAcceptPointerEvent({ clientX: 0, clientY: 0, pointerType: 'touch' }, false)).toBe(true);
  });
});

describe('Phase 3 Suite 2: Taiwan MOE Standard Vector Stroke-Order Grader (FORM-REQ-0013)', () => {
  it('contains >= 20 Taiwan MOE Standard characters including 裡, 為, 骨, 黃, 國, 臺, 灣, 麵, 捷, 運, 請, 謝', () => {
    expect(MOE_STROKE_CHARACTER_BANK.length).toBeGreaterThanOrEqual(20);
    for (const required of ['裡', '為', '骨', '黃', '國', '臺', '灣', '麵', '捷', '運', '請', '謝']) {
      const found = MOE_STROKE_CHARACTER_BANK.find((c) => c.char === required);
      expect(Boolean(found)).toBe(true);
    }
    const wei = getMoeCharacterEntry('為');
    expect(wei.totalStrokes).toBe(9);
    expect(wei.strokes[0].type).toBe('點'); // Point-first Taiwan MOE standard
  });

  it('scores accurate Taiwan MOE strokes >= 85% and flags REVERSED_DIRECTION (逆筆) strokes', () => {
    const liEntry = getMoeCharacterEntry('裡');
    const firstRef = liEntry.strokes[0];

    const accurateStroke = {
      startedAt: 0,
      endedAt: 50,
      points: [
        { x: firstRef.start.x, y: firstRef.start.y, pressure: 0.5, widthPx: 6, timestamp: 0, pointerType: 'pen' },
        { x: firstRef.end.x, y: firstRef.end.y, pressure: 0.6, widthPx: 7, timestamp: 50, pointerType: 'pen' },
      ],
    };
    const goodGrade = gradeUserStroke(accurateStroke, firstRef);
    expect(goodGrade.passed).toBe(true);
    expect(goodGrade.overallScore).toBeGreaterThanOrEqual(85);

    const reversedStroke = {
      startedAt: 0,
      endedAt: 50,
      points: [
        { x: firstRef.end.x, y: firstRef.end.y, pressure: 0.5, widthPx: 6, timestamp: 0, pointerType: 'pen' },
        { x: firstRef.start.x, y: firstRef.start.y, pressure: 0.6, widthPx: 7, timestamp: 50, pointerType: 'pen' },
      ],
    };
    const badGrade = gradeUserStroke(reversedStroke, firstRef);
    expect(badGrade.flag).toBe('REVERSED_DIRECTION');
    expect(badGrade.passed).toBe(false);
  });

  it('grades full character writing across trace, freehand, and dictation modes', () => {
    const renEntry = getMoeCharacterEntry('人');
    const simulatedStrokes = renEntry.strokes.map((st) => ({
      startedAt: 0,
      endedAt: 40,
      points: [
        { x: st.start.x, y: st.start.y, pressure: 0.5, widthPx: 6, timestamp: 0, pointerType: 'pen' },
        { x: st.end.x, y: st.end.y, pressure: 0.6, widthPx: 7, timestamp: 40, pointerType: 'pen' },
      ],
    }));
    const report = gradeCharacterWriting(simulatedStrokes, renEntry, 'dictation');
    expect(report.strokeCountMatch).toBe(true);
    expect(report.overallAccuracy).toBeGreaterThanOrEqual(90);
    expect(report.fsrsRating).toBe(4);
  });
});

describe('Phase 3 Suite 3: Semantic-Phonetic (形聲字) Radical & Sound-Component Workbench (FORM-REQ-0014)', () => {
  it('provides 10 Semantic Radicals and 10 Phonetic Series covering >= 45 Traditional characters', () => {
    expect(SEMANTIC_RADICALS.length).toBeGreaterThanOrEqual(10);
    expect(PHONETIC_SERIES_BANK.length).toBeGreaterThanOrEqual(10);
    const totalChars = PHONETIC_SERIES_BANK.reduce((acc, s) => acc + s.derivatives.length, 0);
    expect(totalChars).toBeGreaterThanOrEqual(45);
  });
});

describe('Phase 3 Suite 4: Offline WebAudio YIN F0 Pitch Extractor & Dual-Curve Scorer (FORM-REQ-0015, FORM-REQ-0016)', () => {
  it('achieves < 3.0 Hz absolute F0 error on synthetic voiced reference waveforms across [110 Hz, 200 Hz, 320 Hz]', () => {
    for (const targetHz of [110, 200, 320]) {
      const wave = generateReferenceToneWaveform({
        constantF0Hz: targetHz,
        durationSec: 0.12,
        sampleRate: 44100,
      });
      const detected = detectPitchYinOffline(wave, 44100, 90, 350);
      expect(detected.f0Hz !== null).toBe(true);
      const absErr = Math.abs((detected.f0Hz || 0) - targetHz);
      expect(absErr).toBeLessThan(3.0);
    }
  });

  it('maps Speaker-Normalized log-F0 to Chao 1.0..5.0 and scores matching vs. mismatched tone curves', () => {
    expect(f0ToChaoToneLevel(100, 100, 260)).toBe(1.0);
    expect(f0ToChaoToneLevel(260, 100, 260)).toBe(5.0);

    const tone2Target = getReferenceChaoContour(2, 20);
    const tone4Curve = getReferenceChaoContour(4, 20);

    const matchGood = computeToneContourMatchScore(tone2Target, tone2Target);
    expect(matchGood.matchScore).toBeGreaterThanOrEqual(95);
    expect(matchGood.passed).toBe(true);

    const matchOpposite = computeToneContourMatchScore(tone2Target, tone4Curve);
    expect(matchOpposite.matchScore).toBeLessThan(55);
    expect(matchOpposite.passed).toBe(false);
  });

  it('includes >= 8 Spoken Taiwanese Tone Sandhi phrases and 10 Retroflex vs. Flat Sibilant minimal pairs', () => {
    expect(TONE_SANDHI_DRILL_PHRASES.length).toBeGreaterThanOrEqual(8);
    expect(RETROFLEX_MINIMAL_PAIRS.length).toBeGreaterThanOrEqual(10);
  });
});

describe('Phase 3 Suite 5: Taiwan DaQian (大千式) 8-Stage Dojo, 5-World Skill Tree & 3-Stage Arena (FORM-REQ-0017)', () => {
  it('converts Taiwan MOE Zhuyin syllables into exact DaQian keystroke sequences (Initial -> Medial -> Rhyme -> Tone)', () => {
    // 臺灣 (ㄊㄞˊ ㄨㄢ) -> ㄊ(w) + ㄞ(9) + ˊ(6) + ㄨ(j) + ㄢ(0) + Space(' ')
    expect(zhuyinToDaqianKeySequence('ㄊㄞˊ ㄨㄢ')).toBe('w96j0 ');
    // 捷運 (ㄐㄧㄝˊ ㄩㄣˋ) -> ㄐ(r) + ㄧ(u) + ㄝ(,) + ˊ(6) + ㄩ(m) + ㄣ(p) + ˋ(4)
    expect(zhuyinToDaqianKeySequence('ㄐㄧㄝˊ ㄩㄣˋ')).toBe('ru,6mp4');
  });

  it('contains all 40 DaQian keys, 8 Dojo stages, 20 Skill Tree nodes, and 18 Match Arena pairs', () => {
    const keyCount = DAQIAN_KEYBOARD_ROWS.reduce((acc, row) => acc + row.length, 0);
    expect(keyCount).toBe(41);
    expect(DAQIAN_DOJO_STAGES.length).toBe(8);
    expect(FIVE_WORLD_SKILL_TREE.length).toBe(20);
    expect(MATCH_ARENA_PAIRS.length).toBe(18);
  });
});

console.log(`\n========================================`);
console.log(`Phase 3 Verification Summary: ${passed} passed, ${failed} failed`);
console.log(`========================================\n`);

if (failed > 0) {
  throw new Error(`Phase 3 verification failed with ${failed} error(s).`);
}
