/**
 * FormosaStudio (FORM) — W3C PointerEvent Wacom Stylus Processor & Taiwan MOE Vector Stroke Grader
 * Traces to: FORM-REQ-0012, FORM-REQ-0013, FORM-DEP-TPA-003
 */

import { MoeCharacterStrokeEntry, MoeVectorStroke, NormalizedPoint } from '../data/moeStrokeAndPhoneticData.ts';
import { FsrsRating } from './progressStore.ts';

export type CalligraphyPracticeMode = 'trace' | 'freehand' | 'dictation';
export type CalligraphyGridStyle = 'jiugongge' | 'tianzige';

export interface StylusSamplePoint extends NormalizedPoint {
  pressure: number; // [0.05 .. 1.0]
  widthPx: number;  // Computed dynamic brush width
  timestamp: number;
  pointerType: string;
}

export interface UserDrawnStroke {
  points: StylusSamplePoint[];
  startedAt: number;
  endedAt: number;
}

export interface PointerEventLike {
  clientX: number;
  clientY: number;
  pressure?: number;
  pointerType?: string;
  buttons?: number;
  button?: number;
  timeStamp?: number;
  getCoalescedEvents?: () => PointerEventLike[];
}

export interface CanvasRectLike {
  left: number;
  top: number;
  width: number;
  height: number;
}

export type StrokeDiagnosticFlag =
  | 'OK'
  | 'REVERSED_DIRECTION'
  | 'OFF_START_POINT'
  | 'DIRECTION_DRIFT'
  | 'SHORT_OR_LONG_STROKE';

export interface SingleStrokeGradeResult {
  strokeIndex: number; // 1-based
  overallScore: number; // 0..100
  startPointScore: number; // 0..100 (35% weight)
  directionCosine: number; // -1.0..1.0
  directionScore: number; // 0..100 (45% weight)
  lengthRatioScore: number; // 0..100 (20% weight)
  passed: boolean;
  flag: StrokeDiagnosticFlag;
  feedbackEn: string;
}

export interface CharacterWritingGradeReport {
  char: string;
  mode: CalligraphyPracticeMode;
  expectedStrokeCount: number;
  drawnStrokeCount: number;
  strokeCountMatch: boolean;
  overallAccuracy: number; // 0..100
  fsrsRating: FsrsRating;
  strokeResults: SingleStrokeGradeResult[];
  summaryFeedbackEn: string;
}

function clamp(v: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, v));
}

/**
 * Computes pressure-tapered calligraphy brush width per DEP-02 formula (FORM-DEP-TPA-003 §2.1):
 * width = baseMinWidth + (baseMaxWidth - baseMinWidth) * Math.pow(pressure, 0.85)
 */
export function computePressureBrushWidth(
  rawPressure: number | undefined,
  baseMinWidth: number = 2.5,
  baseMaxWidth: number = 14.0
): { normalizedPressure: number; widthPx: number } {
  const normalizedPressure =
    typeof rawPressure === 'number' && rawPressure > 0
      ? clamp(rawPressure, 0.05, 1.0)
      : 0.5;
  const widthPx =
    baseMinWidth + (baseMaxWidth - baseMinWidth) * Math.pow(normalizedPressure, 0.85);
  return {
    normalizedPressure: Number(normalizedPressure.toFixed(3)),
    widthPx: Number(widthPx.toFixed(2)),
  };
}

/**
 * Detects Wacom Stylus Eraser nib or eraser barrel button (buttons === 32 || button === 5 || pointerType === 'eraser').
 */
export function isWacomEraserEvent(e: PointerEventLike): boolean {
  if (e.pointerType === 'eraser') return true;
  if (typeof e.buttons === 'number' && (e.buttons & 32) === 32) return true;
  if (e.button === 5) return true;
  return false;
}

/**
 * Enforces Pen-Only Palm Rejection when enabled (`pointerType === 'pen'` or `'eraser'`),
 * rejecting accidental finger/palm `touch` contact on capacitive + Wacom EMR screens.
 */
export function shouldAcceptPointerEvent(
  e: PointerEventLike,
  penOnlyPalmRejection: boolean
): boolean {
  const pType = e.pointerType || 'mouse';
  if (penOnlyPalmRejection) {
    return pType === 'pen' || pType === 'eraser';
  }
  return true;
}

/**
 * Extracts high-frequency sub-frame Wacom stylus coordinates via W3C `getCoalescedEvents()`,
 * falling back cleanly to `[event]` on browsers or synthetic events without coalesced buffers.
 */
export function extractCoalescedPoints(
  event: PointerEventLike,
  rect: CanvasRectLike,
  baseMinWidth: number = 2.5,
  baseMaxWidth: number = 14.0
): StylusSamplePoint[] {
  const coalesced =
    typeof event.getCoalescedEvents === 'function' ? event.getCoalescedEvents() : [];
  const rawList = coalesced && coalesced.length > 0 ? coalesced : [event];
  const safeW = Math.max(1, rect.width);
  const safeH = Math.max(1, rect.height);

  return rawList.map((ev) => {
    const x = clamp((ev.clientX - rect.left) / safeW, 0, 1);
    const y = clamp((ev.clientY - rect.top) / safeH, 0, 1);
    const { normalizedPressure, widthPx } = computePressureBrushWidth(
      ev.pressure ?? event.pressure,
      baseMinWidth,
      baseMaxWidth
    );
    return {
      x: Number(x.toFixed(4)),
      y: Number(y.toFixed(4)),
      pressure: normalizedPressure,
      widthPx,
      timestamp: ev.timeStamp ?? event.timeStamp ?? Date.now(),
      pointerType: ev.pointerType || event.pointerType || 'pen',
    };
  });
}

function euclideanDistance(a: NormalizedPoint, b: NormalizedPoint): number {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  return Math.sqrt(dx * dx + dy * dy);
}

function computePolylineLength(pts: NormalizedPoint[]): number {
  if (pts.length < 2) return 0;
  let total = 0;
  for (let i = 1; i < pts.length; i++) {
    total += euclideanDistance(pts[i - 1], pts[i]);
  }
  return total;
}

function computeReferenceLength(ref: MoeVectorStroke): number {
  if (ref.mid) {
    return euclideanDistance(ref.start, ref.mid) + euclideanDistance(ref.mid, ref.end);
  }
  return euclideanDistance(ref.start, ref.end);
}

/**
 * Grades a single user-drawn stroke against the expected Taiwan MOE reference stroke vector.
 * Weights: Start-Point Proximity (35%), Direction Cosine Similarity (45%), Length Ratio (20%).
 */
export function gradeUserStroke(
  userStroke: UserDrawnStroke,
  refStroke: MoeVectorStroke
): SingleStrokeGradeResult {
  const pts = userStroke.points;
  if (!pts || pts.length === 0) {
    return {
      strokeIndex: refStroke.index,
      overallScore: 0,
      startPointScore: 0,
      directionCosine: 0,
      directionScore: 0,
      lengthRatioScore: 0,
      passed: false,
      flag: 'OFF_START_POINT',
      feedbackEn: `Stroke ${refStroke.index} (${refStroke.nameZh}) was empty.`,
    };
  }

  const userStart = pts[0];
  const userEnd = pts[pts.length - 1];

  // 1. Start-Point Proximity Score (35% weight): full credit <= 0.14, linear decay to 0 at 0.48
  const startDist = euclideanDistance(userStart, refStroke.start);
  const startPointScore =
    startDist <= 0.14
      ? 100
      : startDist >= 0.48
      ? 0
      : Math.round(((0.48 - startDist) / (0.48 - 0.14)) * 100);

  // 2. Direction Vector Cosine Similarity (45% weight)
  const ux = userEnd.x - userStart.x;
  const uy = userEnd.y - userStart.y;
  const rx = refStroke.end.x - refStroke.start.x;
  const ry = refStroke.end.y - refStroke.start.y;
  const uMag = Math.sqrt(ux * ux + uy * uy);
  const rMag = Math.sqrt(rx * rx + ry * ry);

  let directionCosine = 1.0;
  if (uMag > 0.01 && rMag > 0.01) {
    directionCosine = clamp((ux * rx + uy * ry) / (uMag * rMag), -1, 1);
  } else if (uMag <= 0.01) {
    directionCosine = 0;
  }

  // Also check mid-point trajectory if compound折/鉤 stroke
  let midBonus = 0;
  if (refStroke.mid && pts.length >= 3) {
    const midPt = pts[Math.floor(pts.length / 2)];
    const midDist = euclideanDistance(midPt, refStroke.mid);
    if (midDist <= 0.22) midBonus = 10;
  }

  const rawDirScore =
    directionCosine < 0
      ? Math.max(0, Math.round((directionCosine + 0.3) * 60))
      : Math.round(Math.pow(directionCosine, 0.75) * 100);
  const directionScore = clamp(rawDirScore + midBonus, 0, 100);

  // 3. Trajectory Length Ratio (20% weight)
  const userLen = Math.max(0.02, computePolylineLength(pts));
  const refLen = Math.max(0.05, computeReferenceLength(refStroke));
  const ratio = userLen / refLen;
  const ratioError = Math.abs(1 - ratio);
  const lengthRatioScore =
    ratioError <= 0.22
      ? 100
      : ratioError >= 0.85
      ? 20
      : Math.round(100 - ((ratioError - 0.22) / (0.85 - 0.22)) * 80);

  const overallScore = Math.round(
    0.35 * startPointScore + 0.45 * directionScore + 0.20 * lengthRatioScore
  );

  let flag: StrokeDiagnosticFlag = 'OK';
  let feedbackEn = `Stroke ${refStroke.index} (${refStroke.nameZh}) matches Taiwan MOE standard (${overallScore}%).`;

  if (directionCosine < -0.25) {
    flag = 'REVERSED_DIRECTION';
    feedbackEn = `Stroke ${refStroke.index} (${refStroke.nameZh}) was drawn in reverse direction (逆筆). Follow ${refStroke.tipEn}.`;
  } else if (startPointScore < 50) {
    flag = 'OFF_START_POINT';
    feedbackEn = `Stroke ${refStroke.index} (${refStroke.nameZh}) started too far from the MOE entry point. ${refStroke.tipEn}.`;
  } else if (directionScore < 60) {
    flag = 'DIRECTION_DRIFT';
    feedbackEn = `Stroke ${refStroke.index} (${refStroke.nameZh}) angle drifted. ${refStroke.tipEn}.`;
  } else if (lengthRatioScore < 50) {
    flag = 'SHORT_OR_LONG_STROKE';
    feedbackEn = `Stroke ${refStroke.index} (${refStroke.nameZh}) proportion was ${ratio < 1 ? 'too short' : 'too long'}.`;
  }

  const passed = flag !== 'REVERSED_DIRECTION' && overallScore >= 65;

  return {
    strokeIndex: refStroke.index,
    overallScore,
    startPointScore,
    directionCosine: Number(directionCosine.toFixed(3)),
    directionScore,
    lengthRatioScore,
    passed,
    flag,
    feedbackEn,
  };
}

/**
 * Evaluates a full sequence of user strokes against a Taiwan MOE character entry across
 * Guided Trace (描紅), Freehand Overlay (臨摹), or Dictation Recall (聽寫默寫).
 */
export function gradeCharacterWriting(
  userStrokes: UserDrawnStroke[],
  entry: MoeCharacterStrokeEntry,
  mode: CalligraphyPracticeMode = 'trace'
): CharacterWritingGradeReport {
  const expectedCount = entry.strokes.length;
  const drawnCount = userStrokes.length;
  const compareLen = Math.min(expectedCount, drawnCount);

  const strokeResults: SingleStrokeGradeResult[] = [];
  for (let i = 0; i < compareLen; i++) {
    strokeResults.push(gradeUserStroke(userStrokes[i], entry.strokes[i]));
  }

  const avgStrokeScore =
    strokeResults.length > 0
      ? strokeResults.reduce((acc, r) => acc + r.overallScore, 0) / strokeResults.length
      : 0;

  const strokeDiff = Math.abs(expectedCount - drawnCount);
  const countPenalty = strokeDiff === 0 ? 0 : Math.min(40, strokeDiff * 12);
  const overallAccuracy = clamp(Math.round(avgStrokeScore - countPenalty), 0, 100);

  const reversedCount = strokeResults.filter((r) => r.flag === 'REVERSED_DIRECTION').length;
  let fsrsRating: FsrsRating = 3;
  if (overallAccuracy >= 85 && strokeDiff === 0 && reversedCount === 0) {
    fsrsRating = 4; // Easy
  } else if (overallAccuracy >= 70 && reversedCount === 0) {
    fsrsRating = 3; // Good
  } else if (overallAccuracy >= 50) {
    fsrsRating = 2; // Hard
  } else {
    fsrsRating = 1; // Again
  }

  let summaryFeedbackEn = `「${entry.char}」 (${entry.zhuyin}) graded at ${overallAccuracy}% under Taiwan MOE Standard (${mode.toUpperCase()}).`;
  if (strokeDiff !== 0) {
    summaryFeedbackEn += ` Drawn ${drawnCount} strokes vs. ${expectedCount} expected MOE guide strokes.`;
  } else if (reversedCount > 0) {
    summaryFeedbackEn += ` ${reversedCount} stroke(s) drawn in reverse direction (逆筆).`;
  } else if (overallAccuracy >= 85) {
    summaryFeedbackEn += ` Exemplary Taiwan MOE stroke order & proportion!`;
  }

  return {
    char: entry.char,
    mode,
    expectedStrokeCount: expectedCount,
    drawnStrokeCount: drawnCount,
    strokeCountMatch: strokeDiff === 0,
    overallAccuracy,
    fsrsRating,
    strokeResults,
    summaryFeedbackEn,
  };
}
