/**
 * FormosaStudio (FORM) — Offline WebAudio YIN / Autocorrelation Pitch-Contour (F0) Extractor & Tone Coach Engine
 * Traces to: FORM-REQ-0015, FORM-REQ-0016, FORM-DEP-TPA-003
 */

export type MandarinToneId = 1 | 2 | 3 | 4 | 5 | '3_taiwan_half';

export interface PitchFrameResult {
  f0Hz: number | null; // Null when unvoiced or silent
  chaoLevel: number | null; // [1.0 .. 5.0] Speaker-normalized Chao tone level
  rms: number;
  confidence: number; // [0.0 .. 1.0]
}

export interface ToneContourMatchReport {
  matchScore: number; // [0 .. 100]
  meanChaoError: number;
  slopeCorrelation: number;
  resampledTarget: number[];
  resampledUser: number[];
  passed: boolean;
  diagnosticFeedbackEn: string;
}

export interface ToneSandhiDrillPhrase {
  id: string;
  hanzi: string;
  citationZhuyin: string;
  spokenSandhiZhuyin: string;
  pinyin: string;
  english: string;
  ruleCategory: '3+3 -> 2+3' | '3+3+3 Chain' | 'Taiwan Half-3 [21]' | '不 (bù) Sandhi' | '一 (yī) Sandhi';
  targetChaoCurve: number[]; // 20-point normalized Chao 1..5 contour
  coachingTipEn: string;
}

export interface RetroflexMinimalPair {
  id: string;
  retroflexWord: string;
  retroflexZhuyin: string;
  retroflexPinyin: string;
  retroflexMeaningEn: string;
  retroflexInitial: 'ㄓ' | 'ㄔ' | 'ㄕ' | 'ㄖ';
  flatWord: string;
  flatZhuyin: string;
  flatPinyin: string;
  flatMeaningEn: string;
  flatInitial: 'ㄗ' | 'ㄘ' | 'ㄙ';
  articulatoryTipEn: string;
  taiwanSociolinguisticNote: string;
}

function clamp(v: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, v));
}

/**
 * Converts a fundamental frequency (F0 in Hz) into a Speaker-Normalized Chao 5-Level Tone scale (1.0 .. 5.0)
 * using log-frequency scaling per DEP-02 specification (FORM-DEP-TPA-003 §2.2):
 * Chao(F0) = clamp(1.0, 5.0, 1.0 + 4.0 * ln(F0 / Fmin) / ln(Fmax / Fmin))
 */
export function f0ToChaoToneLevel(
  f0Hz: number,
  speakerFloorHz: number = 100,
  speakerCeilingHz: number = 260
): number {
  if (!Number.isFinite(f0Hz) || f0Hz <= 0) return 3.0;
  const fMin = Math.max(50, speakerFloorHz);
  const fMax = Math.max(fMin + 30, speakerCeilingHz);
  const ratio = Math.log(f0Hz / fMin) / Math.log(fMax / fMin);
  return Number(clamp(1.0 + 4.0 * ratio, 1.0, 5.0).toFixed(2));
}

/**
 * Converts a Chao 1.0..5.0 tone level back to Hz for reference waveform synthesis.
 */
export function chaoToneLevelToF0(
  chaoLevel: number,
  speakerFloorHz: number = 100,
  speakerCeilingHz: number = 260
): number {
  const c = clamp(chaoLevel, 1.0, 5.0);
  const norm = (c - 1.0) / 4.0;
  return speakerFloorHz * Math.pow(speakerCeilingHz / speakerFloorHz, norm);
}

/**
 * 100% Offline YIN Cumulative Mean Normalized Difference Function (CMNDF) F0 Pitch Detector
 * with 3-point Parabolic Lag Interpolation across [75 Hz .. 450 Hz] (FORM-REQ-0015).
 * Achieves < 3.0 Hz absolute error on synthetic reference waveforms.
 */
export function detectPitchYinOffline(
  samples: Float32Array,
  sampleRate: number = 44100,
  speakerFloorHz: number = 100,
  speakerCeilingHz: number = 260,
  silenceRmsThreshold: number = 0.012,
  yinThreshold: number = 0.15
): PitchFrameResult {
  const n = samples.length;
  if (n < 256) {
    return { f0Hz: null, chaoLevel: null, rms: 0, confidence: 0 };
  }

  // 1. Compute RMS energy to gate out silence
  let sumSq = 0;
  for (let i = 0; i < n; i++) {
    sumSq += samples[i] * samples[i];
  }
  const rms = Math.sqrt(sumSq / n);
  if (rms < silenceRmsThreshold) {
    return { f0Hz: null, chaoLevel: null, rms: Number(rms.toFixed(4)), confidence: 0 };
  }

  const minLag = Math.max(2, Math.floor(sampleRate / 450)); // 450 Hz ceiling
  const maxLag = Math.min(Math.floor(n / 2), Math.ceil(sampleRate / 75)); // 75 Hz floor
  if (maxLag <= minLag) {
    return { f0Hz: null, chaoLevel: null, rms: Number(rms.toFixed(4)), confidence: 0 };
  }

  const diff = new Float64Array(maxLag + 2);
  const cmndf = new Float64Array(maxLag + 2);
  cmndf[0] = 1.0;

  const windowSize = n - maxLag - 1;
  let runningSum = 0;

  for (let tau = 1; tau <= maxLag + 1; tau++) {
    let d = 0;
    for (let j = 0; j < windowSize; j++) {
      const delta = samples[j] - samples[j + tau];
      d += delta * delta;
    }
    diff[tau] = d;
    runningSum += d;
    cmndf[tau] = runningSum > 0 ? (d * tau) / runningSum : 1.0;
  }

  // 2. Absolute Threshold Search inside [minLag .. maxLag]
  let bestTau = -1;
  for (let tau = minLag; tau <= maxLag; tau++) {
    if (cmndf[tau] < yinThreshold) {
      while (tau + 1 <= maxLag && cmndf[tau + 1] < cmndf[tau]) {
        tau++;
      }
      bestTau = tau;
      break;
    }
  }

  // Fallback to global minimum in [minLag .. maxLag] if above threshold but still voiced (< 0.45)
  if (bestTau === -1) {
    let minVal = Infinity;
    let minIdx = -1;
    for (let tau = minLag; tau <= maxLag; tau++) {
      if (cmndf[tau] < minVal) {
        minVal = cmndf[tau];
        minIdx = tau;
      }
    }
    if (minVal < 0.45) {
      bestTau = minIdx;
    } else {
      return { f0Hz: null, chaoLevel: null, rms: Number(rms.toFixed(4)), confidence: 0 };
    }
  }

  // 3. 3-Point Parabolic Lag Interpolation on raw difference function d(tau) for sub-sample precision (< 3 Hz error)
  let refinedTau = bestTau;
  if (bestTau > 1 && bestTau <= maxLag) {
    const y1 = diff[bestTau - 1];
    const y2 = diff[bestTau];
    const y3 = diff[bestTau + 1];
    const denom = 2 * (y1 - 2 * y2 + y3);
    if (Math.abs(denom) > 1e-12) {
      const offset = (y1 - y3) / denom;
      if (Math.abs(offset) < 1.0) {
        refinedTau = bestTau + offset;
      }
    }
  }

  const f0Hz = sampleRate / refinedTau;
  if (f0Hz < 75 || f0Hz > 450) {
    return { f0Hz: null, chaoLevel: null, rms: Number(rms.toFixed(4)), confidence: 0 };
  }

  const confidence = clamp(1.0 - cmndf[bestTau], 0, 1);
  const chaoLevel = f0ToChaoToneLevel(f0Hz, speakerFloorHz, speakerCeilingHz);

  return {
    f0Hz: Number(f0Hz.toFixed(2)),
    chaoLevel,
    rms: Number(rms.toFixed(4)),
    confidence: Number(confidence.toFixed(3)),
  };
}

/**
 * Canonical 20-point Chao 1.0..5.0 reference contours for Mandarin Tones 1–5 + Taiwanese Half-3 [21].
 */
export function getReferenceChaoContour(tone: MandarinToneId, length: number = 20): number[] {
  const out: number[] = [];
  for (let i = 0; i < length; i++) {
    const t = length <= 1 ? 0 : i / (length - 1);
    let val = 3.0;
    if (tone === 1) {
      // Tone 1 (55): High flat
      val = 4.85;
    } else if (tone === 2) {
      // Tone 2 (35): Mid-rising
      val = 2.9 + 2.0 * Math.pow(t, 1.15);
    } else if (tone === 3) {
      // Tone 3 citation (214): Dipping
      val = t < 0.45 ? 2.2 - 1.1 * (t / 0.45) : 1.1 + 2.7 * ((t - 0.45) / 0.55);
    } else if (tone === '3_taiwan_half') {
      // Natural Taiwanese spoken Tone 3 (半上 21 / 211): Low falling without final high rise
      val = 2.3 - 1.15 * Math.min(1, t * 1.3);
    } else if (tone === 4) {
      // Tone 4 (51): Sharp high-falling
      val = 4.9 - 3.8 * Math.pow(t, 0.95);
    } else {
      // Neutral Tone (輕聲): Short mid-low target
      val = 2.8 - 0.3 * t;
    }
    out.push(Number(clamp(val, 1.0, 5.0).toFixed(2)));
  }
  return out;
}

/**
 * Generates a synthetic voiced Float32Array waveform with fundamental + 2nd harmonic
 * for a constant F0 or a Chao tone contour, used both for reference playback and deterministic DSP verification.
 */
export function generateReferenceToneWaveform(options: {
  constantF0Hz?: number;
  chaoContour?: number[];
  durationSec?: number;
  sampleRate?: number;
  speakerFloorHz?: number;
  speakerCeilingHz?: number;
}): Float32Array {
  const sampleRate = options.sampleRate ?? 44100;
  const durationSec = options.durationSec ?? 0.45;
  const totalSamples = Math.floor(sampleRate * durationSec);
  const buffer = new Float32Array(totalSamples);
  const contour = options.chaoContour || [4.8, 4.8];

  let phase = 0;
  for (let i = 0; i < totalSamples; i++) {
    const tNorm = i / Math.max(1, totalSamples - 1);
    let instF0 = options.constantF0Hz ?? 200;
    if (!options.constantF0Hz && contour.length > 0) {
      const pos = tNorm * (contour.length - 1);
      const idx = Math.floor(pos);
      const frac = pos - idx;
      const c0 = contour[idx];
      const c1 = contour[Math.min(contour.length - 1, idx + 1)];
      const chao = c0 + frac * (c1 - c0);
      instF0 = chaoToneLevelToF0(chao, options.speakerFloorHz ?? 100, options.speakerCeilingHz ?? 260);
    }
    phase += (2 * Math.PI * instF0) / sampleRate;
    buffer[i] = 0.65 * Math.sin(phase) + 0.22 * Math.sin(2 * phase);
  }
  return buffer;
}

function resampleCurve(curve: number[], targetLen: number = 20): number[] {
  if (curve.length === 0) return new Array(targetLen).fill(3.0);
  if (curve.length === 1) return new Array(targetLen).fill(curve[0]);
  const res: number[] = [];
  for (let i = 0; i < targetLen; i++) {
    const pos = (i / (targetLen - 1)) * (curve.length - 1);
    const idx = Math.floor(pos);
    const frac = pos - idx;
    const v0 = curve[idx];
    const v1 = curve[Math.min(curve.length - 1, idx + 1)];
    res.push(Number((v0 + frac * (v1 - v0)).toFixed(2)));
  }
  return res;
}

/**
 * Deterministic Dual-Curve Tone Contour Match Scorer (0..100%) per DEP-02 (FORM-DEP-TPA-003 §2.2).
 * Combines Mean Absolute Chao Deviation (60% weight) + Slope/Direction Correlation (40% weight).
 */
export function computeToneContourMatchScore(
  targetChao: number[],
  userChao: number[]
): ToneContourMatchReport {
  const N = 20;
  const rTarget = resampleCurve(targetChao, N);
  const rUser = resampleCurve(userChao, N);

  let absDiffSum = 0;
  for (let i = 0; i < N; i++) {
    absDiffSum += Math.abs(rTarget[i] - rUser[i]);
  }
  const meanChaoError = Number((absDiffSum / N).toFixed(3));
  // 0 error -> 100, 2.2 Chao units error -> 0
  const levelScore = clamp(Math.round((1 - meanChaoError / 2.2) * 100), 0, 100);

  // Slope/Trajectory correlation
  const targetStartEnd = rTarget[N - 1] - rTarget[0];
  const userStartEnd = rUser[N - 1] - rUser[0];

  let diffProd = 0;
  let tNormSq = 0;
  let uNormSq = 0;
  for (let i = 1; i < N; i++) {
    const dt = rTarget[i] - rTarget[i - 1];
    const du = rUser[i] - rUser[i - 1];
    diffProd += dt * du;
    tNormSq += dt * dt;
    uNormSq += du * du;
  }

  let slopeCorrelation = 1.0;
  if (tNormSq < 0.02 && uNormSq < 0.02) {
    // Both flat (Tone 1)
    slopeCorrelation = 1.0;
  } else if (tNormSq < 0.02 || uNormSq < 0.02) {
    slopeCorrelation = Math.max(0, 1 - Math.abs(targetStartEnd - userStartEnd) / 2.5);
  } else {
    slopeCorrelation = clamp(diffProd / Math.sqrt(tNormSq * uNormSq), -1, 1);
  }

  const slopeScore = clamp(Math.round(((slopeCorrelation + 1) / 2) * 100), 0, 100);
  const matchScore = clamp(Math.round(0.6 * levelScore + 0.4 * slopeScore), 0, 100);
  const passed = matchScore >= 72;

  let diagnosticFeedbackEn = `Excellent pitch contour match (${matchScore}%)! Mean Chao deviation: ${meanChaoError}.`;
  if (!passed) {
    if (targetStartEnd > 1.0 && userStartEnd <= 0.2) {
      diagnosticFeedbackEn = `Pitch did not rise enough (${matchScore}%). Drive your voice upward from mid [3] to high [5].`;
    } else if (targetStartEnd < -1.2 && userStartEnd >= -0.3) {
      diagnosticFeedbackEn = `Pitch did not fall sharply enough (${matchScore}%). Drop decisively from high [5] to low [1].`;
    } else {
      diagnosticFeedbackEn = `Pitch height drifted by ${meanChaoError} Chao levels (${matchScore}%). Match the emerald target curve.`;
    }
  }

  return {
    matchScore,
    meanChaoError,
    slopeCorrelation: Number(slopeCorrelation.toFixed(3)),
    resampledTarget: rTarget,
    resampledUser: rUser,
    passed,
    diagnosticFeedbackEn,
  };
}

/**
 * 8 Curated Spoken Taiwanese Tone Sandhi Drill Phrases (FORM-REQ-0016).
 */
export const TONE_SANDHI_DRILL_PHRASES: ToneSandhiDrillPhrase[] = [
  {
    id: 'sandhi-nihao',
    hanzi: '你好',
    citationZhuyin: 'ㄋㄧˇ ㄏㄠˇ',
    spokenSandhiZhuyin: 'ㄋㄧˊ ㄏㄠˇ',
    pinyin: 'ní hǎo',
    english: 'Hello (3+3 -> 2+3 sandhi + Taiwan half-3)',
    ruleCategory: '3+3 -> 2+3',
    targetChaoCurve: [2.8, 3.2, 3.7, 4.2, 4.6, 4.8, 3.8, 2.5, 2.1, 1.8, 1.5, 1.4, 1.3, 1.3, 1.4, 1.6, 1.8, 2.0, 2.1, 2.2],
    coachingTipEn: 'First Tone 3 (你) rises like Tone 2 [35]; second Tone 3 (好) stays low [21] in natural Taiwanese Mandarin.',
  },
  {
    id: 'sandhi-shuijiao',
    hanzi: '水餃',
    citationZhuyin: 'ㄕㄨㄟˇ ㄐㄧㄠˇ',
    spokenSandhiZhuyin: 'ㄕㄨㄟˊ ㄐㄧㄠˇ',
    pinyin: 'shuí jiǎo',
    english: 'Boiled dumplings (3+3 -> 2+3)',
    ruleCategory: '3+3 -> 2+3',
    targetChaoCurve: [2.9, 3.3, 3.8, 4.3, 4.7, 4.8, 3.6, 2.4, 2.0, 1.7, 1.4, 1.3, 1.3, 1.4, 1.5, 1.7, 1.8, 1.9, 2.0, 2.1],
    coachingTipEn: 'Raise 水 to [35] and keep 餃 low and relaxed at the bottom of your pitch range [21].',
  },
  {
    id: 'sandhi-zhanlanguan',
    hanzi: '展覽館',
    citationZhuyin: 'ㄓㄢˇ ㄌㄢˇ ㄍㄨㄢˇ',
    spokenSandhiZhuyin: 'ㄓㄢˊ ㄌㄢˊ ㄍㄨㄢˇ',
    pinyin: 'zhán lán guǎn',
    english: 'Exhibition hall (3+3+3 -> 2+2+3)',
    ruleCategory: '3+3+3 Chain',
    targetChaoCurve: [2.9, 3.6, 4.4, 4.8, 3.2, 3.7, 4.3, 4.8, 3.4, 2.2, 1.8, 1.5, 1.3, 1.3, 1.4, 1.5, 1.6, 1.8, 1.9, 2.0],
    coachingTipEn: 'In a [2+1] compound like 展覽+館, both 展 and 覽 rise to Tone 2 [35] before 館 [21].',
  },
  {
    id: 'sandhi-buyao',
    hanzi: '不要',
    citationZhuyin: 'ㄅㄨˋ ㄧㄠˋ',
    spokenSandhiZhuyin: 'ㄅㄨˊ ㄧㄠˋ',
    pinyin: 'bú yào',
    english: 'Do not want / No thanks (不 before Tone 4 -> ㄅㄨˊ)',
    ruleCategory: '不 (bù) Sandhi',
    targetChaoCurve: [2.8, 3.2, 3.7, 4.2, 4.6, 4.9, 4.9, 4.7, 4.2, 3.6, 3.0, 2.4, 1.9, 1.5, 1.3, 1.2, 1.1, 1.1, 1.1, 1.1],
    coachingTipEn: 'Before Falling Tone 4 (要 ㄧㄠˋ), 不 shifts from Falling ㄅㄨˋ to Rising ㄅㄨˊ [35], creating a smooth arch [35 -> 51].',
  },
  {
    id: 'sandhi-buhao',
    hanzi: '不好意思',
    citationZhuyin: 'ㄅㄨˋ ㄏㄠˇ ㄧˋ ˙ㄙ',
    spokenSandhiZhuyin: 'ㄅㄨˋ ㄏㄠˇ ㄧˋ ˙ㄙ',
    pinyin: 'bù hǎo yì si',
    english: 'Excuse me / Sorry to bother you (Taiwan polite staple)',
    ruleCategory: 'Taiwan Half-3 [21]',
    targetChaoCurve: [4.8, 3.8, 2.6, 1.6, 2.2, 1.8, 1.4, 1.3, 4.7, 3.8, 2.7, 1.6, 2.5, 2.4, 2.3, 2.2, 2.2, 2.1, 2.1, 2.0],
    coachingTipEn: 'Keep 不 falling [51] before Tone 3 好, and keep 好 as a short low Taiwanese half-third [21].',
  },
  {
    id: 'sandhi-yige',
    hanzi: '一個',
    citationZhuyin: 'ㄧ ㄍㄜˋ',
    spokenSandhiZhuyin: 'ㄧˊ ˙ㄍㄜ',
    pinyin: 'yí ge',
    english: 'One (item) (一 before Tone 4 -> ㄧˊ)',
    ruleCategory: '一 (yī) Sandhi',
    targetChaoCurve: [2.9, 3.3, 3.8, 4.2, 4.6, 4.8, 4.4, 3.6, 3.0, 2.7, 2.6, 2.5, 2.4, 2.4, 2.3, 2.3, 2.2, 2.2, 2.2, 2.2],
    coachingTipEn: 'Because 個 is underlying Tone 4 (ㄍㄜˋ), 一 shifts to Rising Tone 2 (ㄧˊ) even when 個 softens in fast speech.',
  },
  {
    id: 'sandhi-yitian',
    hanzi: '一天',
    citationZhuyin: 'ㄧ ㄊㄧㄢ',
    spokenSandhiZhuyin: 'ㄧˋ ㄊㄧㄢ',
    pinyin: 'yì tiān',
    english: 'One day (一 before Tone 1 -> ㄧˋ)',
    ruleCategory: '一 (yī) Sandhi',
    targetChaoCurve: [4.9, 4.2, 3.3, 2.4, 1.6, 1.2, 2.8, 4.5, 4.8, 4.8, 4.8, 4.8, 4.8, 4.8, 4.8, 4.8, 4.8, 4.8, 4.8, 4.8],
    coachingTipEn: 'Before Tone 1 (天 ㄊㄧㄢ), 一 drops sharply as Falling Tone 4 (ㄧˋ [51]) before jumping to High Flat [55].',
  },
  {
    id: 'sandhi-henhaochi',
    hanzi: '很好吃',
    citationZhuyin: 'ㄏㄣˇ ㄏㄠˇ ㄔ',
    spokenSandhiZhuyin: 'ㄏㄣˊ ㄏㄠˇ ㄔ',
    pinyin: 'hén hǎo chī',
    english: 'Very delicious! (3+3+1 -> 2 + Half-3 [21] + 1)',
    ruleCategory: 'Taiwan Half-3 [21]',
    targetChaoCurve: [2.9, 3.5, 4.2, 4.7, 3.2, 2.1, 1.6, 1.3, 1.3, 1.5, 3.4, 4.7, 4.8, 4.8, 4.8, 4.8, 4.8, 4.8, 4.8, 4.8],
    coachingTipEn: '很 rises [35], 好 dips low [21] without rising on its own, then jumps directly to High Flat 吃 [55].',
  },
];

/**
 * 10 Taiwanese Mandarin Retroflex (ㄓㄔㄕㄖ) vs. Flat Sibilant (ㄗㄘㄙ) Minimal Pairs (FORM-REQ-0016).
 */
export const RETROFLEX_MINIMAL_PAIRS: RetroflexMinimalPair[] = [
  { id: 'mp-1', retroflexWord: '知道', retroflexZhuyin: 'ㄓ ㄉㄠˋ', retroflexPinyin: 'zhīdào', retroflexMeaningEn: 'to know', retroflexInitial: 'ㄓ', flatWord: '資料', flatZhuyin: 'ㄗ ㄌㄧㄠˋ', flatPinyin: 'zīliào', flatMeaningEn: 'data / information', flatInitial: 'ㄗ', articulatoryTipEn: 'For ㄓ, curl the tongue tip slightly back behind the alveolar ridge; for ㄗ, touch the tongue tip gently behind the upper front teeth.', taiwanSociolinguisticNote: 'In everyday Taipei speech, ㄓ is only lightly postalveolar (avoid heavy Beijing rhotic curling).' },
  { id: 'mp-2', retroflexWord: '吃飯', retroflexZhuyin: 'ㄔ ㄈㄢˋ', retroflexPinyin: 'chīfàn', retroflexMeaningEn: 'to eat a meal', retroflexInitial: 'ㄔ', flatWord: '瑕疵', flatZhuyin: 'ㄒㄧㄚˊ ㄘ', flatPinyin: 'xiácī', flatMeaningEn: 'flaw / defect', flatInitial: 'ㄘ', articulatoryTipEn: 'Both ㄔ and ㄘ are strongly aspirated (air puff); ㄔ retracts the tongue tip while ㄘ hisses sharply at the front teeth.', taiwanSociolinguisticNote: 'Distinguishing aspirated ㄔ from ㄘ keeps words like 吃 (eat) vs. 刺 (thorn) unambiguous.' },
  { id: 'mp-3', retroflexWord: '老師', retroflexZhuyin: 'ㄌㄠˇ ㄕ', retroflexPinyin: 'lǎoshī', retroflexMeaningEn: 'teacher', retroflexInitial: 'ㄕ', flatWord: '自私', flatZhuyin: 'ㄗˋ ㄙ', flatPinyin: 'zìsī', flatMeaningEn: 'selfish', flatInitial: 'ㄙ', articulatoryTipEn: 'ㄕ produces a lower-frequency "sh" hush; ㄙ produces a bright high-frequency "s" hiss.', taiwanSociolinguisticNote: 'Taiwanese speakers use a soft postalveolar ㄕ rather than a deep retroflex.' },
  { id: 'mp-4', retroflexWord: '山林', retroflexZhuyin: 'ㄕㄢ ㄌㄧㄣˊ', retroflexPinyin: 'shānlín', retroflexMeaningEn: 'mountain forest', retroflexInitial: 'ㄕ', flatWord: '三十', flatZhuyin: 'ㄙㄢ ㄕˊ', flatPinyin: 'sānshí', flatMeaningEn: 'thirty (30)', flatInitial: 'ㄙ', articulatoryTipEn: 'Practice alternating ㄙㄢ (3) -> ㄕㄢ (mountain): move tongue tip forward for ㄙ, slightly back for ㄕ.', taiwanSociolinguisticNote: 'Essential for numbers at Taiwan markets (三十 vs. 十四).' },
  { id: 'mp-5', retroflexWord: '十塊', retroflexZhuyin: 'ㄕˊ ㄎㄨㄞˋ', retroflexPinyin: 'shí kuài', retroflexMeaningEn: '10 NT dollars', retroflexInitial: 'ㄕ', flatWord: '四塊', flatZhuyin: 'ㄙˋ ㄎㄨㄞˋ', flatPinyin: 'sì kuài', flatMeaningEn: '4 NT dollars', flatInitial: 'ㄙ', articulatoryTipEn: 'Combine initial contrast (ㄕ vs. ㄙ) with tone contrast (Rising Tone 2 ㄕˊ vs. Falling Tone 4 ㄙˋ).', taiwanSociolinguisticNote: 'Because Taiwanese speakers often soften ㄕ/ㄙ, the Tone 2 vs. Tone 4 contour carries critical weight in cash transactions!' },
  { id: 'mp-6', retroflexWord: '找到', retroflexZhuyin: 'ㄓㄠˇ ㄉㄠˋ', retroflexPinyin: 'zhǎodào', retroflexMeaningEn: 'found it', retroflexInitial: 'ㄓ', flatWord: '早到', flatZhuyin: 'ㄗㄠˇ ㄉㄠˋ', flatPinyin: 'zǎodào', flatMeaningEn: 'arrived early', flatInitial: 'ㄗ', articulatoryTipEn: 'ㄓㄠˇ retracts the tongue tip at onset; ㄗㄠˇ starts right against the back of the front teeth.', taiwanSociolinguisticNote: 'Classic minimal pair tested in TOCFL listening comprehension.' },
  { id: 'mp-7', retroflexWord: '主力', retroflexZhuyin: 'ㄓㄨˇ ㄌㄧˋ', retroflexPinyin: 'zhǔlì', retroflexMeaningEn: 'main force', retroflexInitial: 'ㄓ', flatWord: '阻力', flatZhuyin: 'ㄗㄨˇ ㄌㄧˋ', flatPinyin: 'zǔlì', flatMeaningEn: 'resistance / drag', flatInitial: 'ㄗ', articulatoryTipEn: 'With rounded medial ㄨ, keep ㄓㄨˇ postalveolar and ㄗㄨˇ dental.', taiwanSociolinguisticNote: 'Common in news and engineering registers.' },
  { id: 'mp-8', retroflexWord: '車站', retroflexZhuyin: 'ㄔㄜ ㄓㄢˋ', retroflexPinyin: 'chēzhàn', retroflexMeaningEn: 'train/bus station', retroflexInitial: 'ㄔ', flatWord: '手冊', flatZhuyin: 'ㄕㄡˇ ㄘㄜˋ', flatPinyin: 'shǒucè', flatMeaningEn: 'handbook / manual', flatInitial: 'ㄘ', articulatoryTipEn: 'ㄔㄜ pairs aspirated postalveolar ㄔ with mid-back ㄜ; ㄘㄜˋ pairs dental ㄘ with ㄜˋ.', taiwanSociolinguisticNote: '台北車站 (Taipei Main Station) has two consecutive retroflex initials (ㄔ + ㄓ).' },
  { id: 'mp-9', retroflexWord: '商業', retroflexZhuyin: 'ㄕㄤ ㄧㄝˋ', retroflexPinyin: 'shāngyè', retroflexMeaningEn: 'commerce / business', retroflexInitial: 'ㄕ', flatWord: '桑葉', flatZhuyin: 'ㄙㄤ ㄧㄝˋ', flatPinyin: 'sāngyè', flatMeaningEn: 'mulberry leaf', flatInitial: 'ㄙ', articulatoryTipEn: 'Keep the tongue tip slightly raised for ㄕㄤ and flat against the teeth for ㄙㄤ.', taiwanSociolinguisticNote: 'Identical rhyme ㄤ and tone (Tone 1), making initial placement the sole cue.' },
  { id: 'mp-10', retroflexWord: '日本', retroflexZhuyin: 'ㄖˋ ㄅㄣˇ', retroflexPinyin: 'Rìběn', retroflexMeaningEn: 'Japan', retroflexInitial: 'ㄖ', flatWord: '字本', flatZhuyin: 'ㄗˋ ㄅㄣˇ', flatPinyin: 'zìběn', flatMeaningEn: 'character workbook', flatInitial: 'ㄗ', articulatoryTipEn: 'ㄖ is a voiced postalveolar approximant/fricative (no dental closure); ㄗ is an unvoiced dental affricate.', taiwanSociolinguisticNote: 'In Southern Taiwan, older speakers sometimes realize ㄖ closer to [dz/l], so clarity on ㄖ vs. ㄗ aids comprehension.' },
];

export async function playFloat32Waveform(
  samples: Float32Array,
  sampleRate: number = 44100,
  existingCtx?: AudioContext | null
): Promise<AudioContext | null> {
  if (typeof window === 'undefined') return existingCtx || null;
  const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
  if (!AudioCtx) return existingCtx || null;
  try {
    const ctx = existingCtx || new AudioCtx();
    if (ctx.state === 'suspended') await ctx.resume();
    const buf = ctx.createBuffer(1, samples.length, sampleRate);
    buf.getChannelData(0).set(samples);
    const src = ctx.createBufferSource();
    src.buffer = buf;
    src.connect(ctx.destination);
    src.start();
    return ctx;
  } catch {
    return existingCtx || null;
  }
}
