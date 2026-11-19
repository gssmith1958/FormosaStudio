/**
 * FormosaStudio (FORM) — Taiwan MOE Standard Vector Stroke-Order Bank & Semantic-Phonetic (形聲字) Workbench Data
 * Traces to: FORM-REQ-0013, FORM-REQ-0014, FORM-DEP-TPA-003
 */
export type MoeStrokeType = '橫' | '豎' | '撇' | '捺' | '點' | '提' | '折' | '鉤';
export interface NormalizedPoint {
  x: number; // [0.0 .. 1.0] left to right
  y: number; // [0.0 .. 1.0] top to bottom
}
export interface MoeVectorStroke {
  index: number; // 1-based stroke number
  type: MoeStrokeType;
  nameZh: string; // e.g., '橫折鉤'
  start: NormalizedPoint;
  mid?: NormalizedPoint;
  end: NormalizedPoint;
  tipEn: string;
}
export interface MoeCharacterStrokeEntry {
  char: string;
  zhuyin: string;
  pinyin: string;
  english: string;
  radical: string;
  totalStrokes: number;
  tocflBand: 'Novice 1' | 'Novice 2' | 'Band A1' | 'Band A2' | 'Band B1';
  taiwanMoeOrthographyNote: string;
  mainlandComparisonNote?: string;
  exampleWord: string;
  exampleZhuyin: string;
  strokes: MoeVectorStroke[];
}
export interface SemanticRadicalEntry {
  radical: string;
  variantForms: string;
  zhuyin: string;
  meaningEn: string;
  categoryExplanation: string;
  coreExamples: string[];
}
export interface PhoneticDerivativeChar {
  char: string;
  zhuyin: string;
  pinyin: string;
  english: string;
  semanticRadical: string;
  semanticRoleEn: string;
  phoneticRelationNote: string;
  exampleCompound: string;
}
export interface PhoneticSeriesEntry {
  id: string;
  phoneticComponent: string;
  baseZhuyin: string;
  basePinyin: string;
  baseMeaningEn: string;
  soundPatternSummary: string;
  derivatives: PhoneticDerivativeChar[];
}
function s(
  index: number, type: MoeStrokeType, nameZh: string, x1: number,
  y1: number, x2: number, y2: number, tipEn: string,
  mid?: NormalizedPoint
): MoeVectorStroke {
  return { index, type, nameZh, start: { x: x1, y: y1 }, mid, end: { x: x2, y: y2 }, tipEn };
}
/**
 * Curated 20-Character Taiwan MOE Standard Stroke-Order Bank (教育部國字標準字體筆順).
 * Explicitly encodes Taiwan MOE orthographic standards for 裡, 為, 骨, 黃, 國, 臺, 灣, 麵, 捷, 運, 請, 謝, etc.
 */
export const MOE_STROKE_CHARACTER_BANK: MoeCharacterStrokeEntry[] = [
  {
    char: '裡', zhuyin: 'ㄌㄧˇ', pinyin: 'lǐ', english: 'inside / interior (Taiwan MOE left-衣 standard)',
    radical: '衣 (衤)', totalStrokes: 13, tocflBand: 'Novice 1',
    taiwanMoeOrthographyNote:
      'Taiwan MOE standard uses left-right 衤(衣) + 里 (13 strokes). In 里, write 日 first, then the vertical 豎 pierces down, followed by the bottom two 橫 strokes.',
    mainlandComparisonNote: 'Mainland/HK often use top-bottom 裏 or simplified 里 (which merges 裏/裡 into 里).', exampleWord: '裡面',
    exampleZhuyin: 'ㄌㄧˇ ㄇㄧㄢˋ',
    strokes: [
      s(1, '點', '點', 0.22, 0.14, 0.28, 0.22, 'Top dot of left 衤 radical'),
      s(2, '折', '橫撇', 0.12, 0.30, 0.18, 0.56, 'Horizontal-left sweep of 衤', { x: 0.32, y: 0.30 }),
      s(3, '豎', '豎', 0.24, 0.48, 0.24, 0.88, 'Vertical stem of 衤'),
      s(4, '撇', '撇', 0.34, 0.46, 0.26, 0.56, 'Short inner left sweep of 衤'),
      s(5, '點', '點', 0.27, 0.58, 0.35, 0.66, 'Right dot of 衤'),
      s(6, '豎', '豎', 0.46, 0.20, 0.48, 0.52, 'Left vertical of upper 日 in 里'),
      s(7, '折', '橫折', 0.46, 0.20, 0.82, 0.52, 'Top-right corner of 日 in 里', { x: 0.82, y: 0.20 }),
      s(8, '橫', '橫', 0.48, 0.36, 0.80, 0.36, 'Middle horizontal bar inside 日'),
      s(9, '橫', '橫', 0.48, 0.52, 0.80, 0.52, 'Bottom closing bar of 日'),
      s(10, '豎', '豎', 0.64, 0.22, 0.64, 0.84, 'Central vertical 豎 piercing through 里 (Taiwan MOE order)'),
      s(11, '橫', '橫', 0.48, 0.68, 0.80, 0.68, 'Upper horizontal of lower 土 in 里'),
      s(12, '橫', '橫', 0.40, 0.85, 0.88, 0.85, 'Final base horizontal closing 里'),
    ],
  },
  {
    char: '為', zhuyin: 'ㄨㄟˊ', pinyin: 'wéi / wèi', english: 'to act as / for / because of (Taiwan MOE 9-stroke point-first)',
    radical: '爪 (爫)', totalStrokes: 9, tocflBand: 'Novice 2',
    taiwanMoeOrthographyNote:
      'Taiwan MOE 國字標準字體筆順 strictly starts with top-left 點 (Stroke 1), then long left 撇 (Stroke 2), stepped 橫折 (Strokes 3–5), and finishes with 4 internal/bottom dots (Strokes 6–9).',
    mainlandComparisonNote: 'Mainland simplified 为 has only 4 strokes; HK/calligraphic 爲 has 12 strokes with 爪 top.',
    exampleWord: '因為', exampleZhuyin: 'ㄧㄣ ㄨㄟˋ',
    strokes: [
      s(1, '點', '點', 0.32, 0.14, 0.40, 0.23, 'Stroke 1: Top-left starting dot (點)'),
      s(2, '撇', '撇', 0.52, 0.14, 0.16, 0.82, 'Stroke 2: Long sweeping diagonal 撇 down to bottom-left'),
      s(3, '折', '橫折', 0.44, 0.28, 0.66, 0.44, 'Stroke 3: Upper step 橫折', { x: 0.68, y: 0.28 }),
      s(4, '折', '橫折', 0.40, 0.44, 0.72, 0.60, 'Stroke 4: Middle step 橫折', { x: 0.74, y: 0.44 }),
      s(5, '鉤', '橫折鉤', 0.34, 0.60, 0.78, 0.88, 'Stroke 5: Lower wide 橫折鉤 frame', { x: 0.84, y: 0.60 }),
      s(6, '點', '點', 0.32, 0.72, 0.35, 0.82, 'Stroke 6: First left bottom dot'),
      s(7, '點', '點', 0.44, 0.72, 0.48, 0.81, 'Stroke 7: Second bottom dot'),
      s(8, '點', '點', 0.56, 0.71, 0.60, 0.80, 'Stroke 8: Third bottom dot'),
      s(9, '點', '點', 0.68, 0.70, 0.73, 0.79, 'Stroke 9: Fourth bottom dot inside hook'),
    ],
  },
  {
    char: '骨', zhuyin: 'ㄍㄨˇ', pinyin: 'gǔ', english: 'bone / frame (Taiwan MOE right-side inner fold)',
    radical: '骨', totalStrokes: 10, tocflBand: 'Band A2',
    taiwanMoeOrthographyNote:
      'In Taiwan MOE standard, the inner small fold inside the top skull box sits on the RIGHT side (橫折 at Stroke 3), followed by an internal 點 (Stroke 4), whereas Mainland places the inner fold on the left.',
    mainlandComparisonNote: 'Mainland GB form places the small inner box on the left without a dot.', exampleWord: '排骨酥',
    exampleZhuyin: 'ㄆㄞˊ ㄍㄨˇ ㄙㄨ',
    strokes: [
      s(1, '豎', '豎', 0.32, 0.12, 0.32, 0.38, 'Outer top-left vertical'),
      s(2, '折', '橫折', 0.32, 0.12, 0.68, 0.38, 'Outer top-right corner', { x: 0.68, y: 0.12 }),
      s(3, '折', '橫折', 0.50, 0.24, 0.68, 0.38, 'Taiwan MOE right-side inner 橫折', { x: 0.68, y: 0.24 }),
      s(4, '點', '點', 0.40, 0.24, 0.45, 0.31, 'Taiwan MOE inner left dot'),
      s(5, '點', '點', 0.18, 0.40, 0.15, 0.52, 'Left overhang dot of 冖 cover'),
      s(6, '鉤', '橫鉤', 0.18, 0.40, 0.82, 0.46, 'Wide 冖 cover with right hook', { x: 0.85, y: 0.40 }),
      s(7, '豎', '豎', 0.36, 0.50, 0.36, 0.88, 'Left vertical of bottom 月 (肉)'),
      s(8, '鉤', '橫折鉤', 0.36, 0.50, 0.64, 0.88, 'Right frame & hook of bottom 月', { x: 0.64, y: 0.50 }),
      s(9, '橫', '橫', 0.36, 0.63, 0.62, 0.63, 'Upper bar inside 月'),
      s(10, '橫', '橫', 0.36, 0.75, 0.62, 0.75, 'Lower bar inside 月'),
    ],
  },
  {
    char: '黃', zhuyin: 'ㄏㄨㄤˊ', pinyin: 'huáng', english: 'yellow / surname Huang (Taiwan MOE 廿-top standard)',
    radical: '黃', totalStrokes: 12, tocflBand: 'Novice 2',
    taiwanMoeOrthographyNote:
      'Taiwan MOE preserves the traditional 廿-top (橫 -> 豎 -> 豎 -> 橫 closing the top 廿) above the wide橫 and central 田/由 structure.',
    mainlandComparisonNote: 'Mainland simplified 黄 replaces the closed 廿 top with an open 艹/共 top.', exampleWord: '蛋黃酥',
    exampleZhuyin: 'ㄉㄢˋ ㄏㄨㄤˊ ㄙㄨ',
    strokes: [
      s(1, '橫', '橫', 0.26, 0.18, 0.74, 0.18, 'Top horizontal of 廿'),
      s(2, '豎', '豎', 0.38, 0.10, 0.38, 0.30, 'Left vertical of 廿'),
      s(3, '豎', '豎', 0.62, 0.10, 0.62, 0.30, 'Right vertical of 廿'),
      s(4, '橫', '橫', 0.38, 0.30, 0.62, 0.30, 'Bottom closing bar of 廿 (Taiwan MOE standard)'),
      s(5, '橫', '橫', 0.16, 0.38, 0.84, 0.38, 'Wide main horizontal beam'),
      s(6, '豎', '豎', 0.28, 0.46, 0.32, 0.72, 'Left vertical of middle 田'),
      s(7, '折', '橫折', 0.28, 0.46, 0.68, 0.72, 'Top-right corner of middle 田', { x: 0.72, y: 0.46 }),
      s(8, '橫', '橫', 0.30, 0.59, 0.70, 0.59, 'Middle horizontal of 田'),
      s(9, '豎', '豎', 0.50, 0.38, 0.50, 0.72, 'Central vertical stem from main beam through 田'),
      s(10, '橫', '橫', 0.32, 0.72, 0.68, 0.72, 'Bottom closing horizontal of 田'),
      s(11, '撇', '撇', 0.38, 0.77, 0.22, 0.90, 'Bottom-left leg 撇'),
      s(12, '點', '點', 0.62, 0.77, 0.78, 0.90, 'Bottom-right leg 點'),
    ],
  },
  {
    char: '國', zhuyin: 'ㄍㄨㄛˊ', pinyin: 'guó', english: 'country / nation (Traditional 國 with 或 inside 囗)',
    radical: '囗', totalStrokes: 11, tocflBand: 'Novice 1',
    taiwanMoeOrthographyNote:
      'Outer 囗 enclosure starts with left 豎 and top-right 橫折, then complete inner 或 (橫, 口, 提, 斜鉤, 撇, 點), and finally seal the bottom 橫 last.',
    exampleWord: '國語', exampleZhuyin: 'ㄍㄨㄛˊ ㄩˇ',
    strokes: [
      s(1, '豎', '豎', 0.16, 0.14, 0.16, 0.88, 'Outer left vertical of 囗'),
      s(2, '折', '橫折', 0.16, 0.14, 0.84, 0.88, 'Outer top-right frame of 囗', { x: 0.84, y: 0.14 }),
      s(3, '橫', '橫', 0.26, 0.32, 0.72, 0.32, 'Inner horizontal of 戈'),
      s(4, '豎', '豎', 0.26, 0.44, 0.28, 0.62, 'Left vertical of inner 口'),
      s(5, '折', '橫折', 0.26, 0.44, 0.46, 0.62, 'Top-right of inner 口', { x: 0.46, y: 0.44 }),
      s(6, '橫', '橫', 0.28, 0.62, 0.46, 0.62, 'Bottom closing of inner 口'),
      s(7, '提', '提', 0.24, 0.74, 0.48, 0.68, 'Upward rising stroke 提 under 口'),
      s(8, '鉤', '斜鉤', 0.52, 0.20, 0.76, 0.78, 'Sweeping diagonal spear hook 斜鉤'),
      s(9, '撇', '撇', 0.72, 0.42, 0.52, 0.70, 'Diagonal 撇 crossing 斜鉤'),
      s(10, '點', '點', 0.64, 0.20, 0.72, 0.27, 'Top-right dot of 戈'),
      s(11, '橫', '橫', 0.16, 0.88, 0.84, 0.88, 'Final bottom horizontal sealing 囗'),
    ],
  },
  {
    char: '臺', zhuyin: 'ㄊㄞˊ', pinyin: 'tái', english: 'Taiwan / platform (Orthodox Traditional 臺)',
    radical: '至', totalStrokes: 14, tocflBand: 'Novice 1',
    taiwanMoeOrthographyNote:
      'Official Taiwan MOE orthography uses 14-stroke 臺 (吉 + 冖 + 至) in formal names like 臺灣 and 臺北.',
    exampleWord: '臺灣', exampleZhuyin: 'ㄊㄞˊ ㄨㄢ',
    strokes: [
      s(1, '橫', '橫', 0.26, 0.16, 0.74, 0.16, 'Top horizontal of 士'),
      s(2, '豎', '豎', 0.50, 0.08, 0.50, 0.26, 'Center vertical of 士'),
      s(3, '橫', '橫', 0.32, 0.26, 0.68, 0.26, 'Lower horizontal of 士'),
      s(4, '豎', '豎', 0.34, 0.32, 0.36, 0.44, 'Left vertical of middle 口'),
      s(5, '折', '橫折', 0.34, 0.32, 0.64, 0.44, 'Top-right of middle 口', { x: 0.66, y: 0.32 }),
      s(6, '橫', '橫', 0.36, 0.44, 0.64, 0.44, 'Bottom of middle 口'),
      s(7, '點', '點', 0.18, 0.50, 0.15, 0.60, 'Left dot of 冖 cover'),
      s(8, '鉤', '橫鉤', 0.18, 0.50, 0.82, 0.56, 'Wide 冖 cover with hook', { x: 0.84, y: 0.50 }),
      s(9, '橫', '橫', 0.30, 0.60, 0.70, 0.60, 'Top horizontal of lower 至'),
      s(10, '折', '撇折', 0.46, 0.60, 0.66, 0.72, 'ム triangle sweep of 至', { x: 0.34, y: 0.72 }),
      s(11, '點', '點', 0.62, 0.66, 0.70, 0.75, 'Right locking dot of 至'),
      s(12, '橫', '橫', 0.32, 0.80, 0.68, 0.80, 'Middle horizontal of lower 土'),
      s(13, '豎', '豎', 0.50, 0.72, 0.50, 0.90, 'Center vertical of lower 土'),
      s(14, '橫', '橫', 0.20, 0.90, 0.80, 0.90, 'Base horizontal foundation of 臺'),
    ],
  },
  {
    char: '灣', zhuyin: 'ㄨㄢ', pinyin: 'wān', english: 'bay / gulf / Taiwan (灣)',
    radical: '氵 (水)', totalStrokes: 25, tocflBand: 'Novice 1',
    taiwanMoeOrthographyNote:
      'Left 氵 (3 strokes) + right 彎 (糸 + 言 + 糸 above 弓). Graded here by structural macro-strokes for Wacom fluency.',
    exampleWord: '臺灣', exampleZhuyin: 'ㄊㄞˊ ㄨㄢ',
    strokes: [
      s(1, '點', '點', 0.14, 0.18, 0.22, 0.26, 'Top dot of 氵'),
      s(2, '點', '點', 0.12, 0.42, 0.20, 0.50, 'Middle dot of 氵'),
      s(3, '提', '提', 0.14, 0.82, 0.24, 0.64, 'Rising 提 of 氵'),
      s(4, '折', '撇折', 0.38, 0.14, 0.44, 0.38, 'Left 糸 component top'),
      s(5, '點', '點', 0.56, 0.12, 0.60, 0.20, 'Center 言 component top'),
      s(6, '橫', '橫', 0.50, 0.24, 0.66, 0.24, 'Center 言 horizontal bars'),
      s(7, '折', '撇折', 0.76, 0.14, 0.84, 0.38, 'Right 糸 component'),
      s(8, '折', '橫折', 0.38, 0.54, 0.76, 0.64, 'Upper turn of lower 弓', { x: 0.76, y: 0.54 }),
      s(9, '橫', '橫', 0.38, 0.66, 0.74, 0.66, 'Middle bar of lower 弓'),
      s(10, '鉤', '豎折折鉤', 0.38, 0.66, 0.78, 0.90, 'Lower bow hook of 弓', { x: 0.82, y: 0.76 }),
    ],
  },
  {
    char: '麵', zhuyin: 'ㄇㄧㄢˋ', pinyin: 'miàn', english: 'noodles / wheat flour (Traditional 麵 with 麥 + 面)',
    radical: '麥', totalStrokes: 20, tocflBand: 'Novice 1',
    taiwanMoeOrthographyNote:
      'Taiwan Traditional distinguishes 麵 (wheat noodles, 麥+面) from 面 (face/surface). Never merge 麵 into 面.',
    mainlandComparisonNote: 'Mainland simplified merges 麵 into 面.', exampleWord: '牛肉麵', exampleZhuyin: 'ㄋㄧㄡˊ ㄖㄡˋ ㄇㄧㄢˋ',
    strokes: [
      s(1, '橫', '橫', 0.14, 0.22, 0.44, 0.22, 'Top bar of left 麥'),
      s(2, '豎', '豎', 0.29, 0.12, 0.29, 0.54, 'Center stem of 来 in 麥'),
      s(3, '撇', '撇', 0.28, 0.30, 0.12, 0.52, 'Left sweep of 麥'),
      s(4, '點', '點', 0.30, 0.34, 0.44, 0.46, 'Right dot of 麥'),
      s(5, '撇', '撇', 0.28, 0.56, 0.14, 0.82, 'Lower 夊 left sweep of 麥'),
      s(6, '折', '橫撇', 0.26, 0.62, 0.16, 0.88, 'Lower 夊 cross-sweep of 麥', { x: 0.42, y: 0.62 }),
      s(7, '捺', '捺', 0.22, 0.68, 0.48, 0.88, 'Long base 捺 of 麥'),
      s(8, '橫', '橫', 0.52, 0.20, 0.88, 0.20, 'Top bar of right 面'),
      s(9, '撇', '撇', 0.68, 0.22, 0.60, 0.36, 'Short connector 撇 of 面'),
      s(10, '豎', '豎', 0.52, 0.36, 0.54, 0.84, 'Left vertical of 面 enclosure'),
      s(11, '折', '橫折', 0.52, 0.36, 0.86, 0.84, 'Top-right frame of 面', { x: 0.86, y: 0.36 }),
      s(12, '橫', '橫', 0.54, 0.84, 0.86, 0.84, 'Bottom closing bar of 面'),
    ],
  },
  {
    char: '捷', zhuyin: 'ㄐㄧㄝˊ', pinyin: 'jié', english: 'rapid / MRT (捷運)',
    radical: '扌 (手)', totalStrokes: 11,
    tocflBand: 'Novice 1', taiwanMoeOrthographyNote: 'Left 扌 (橫 -> 豎鉤 -> 提) + right 疌 (橫 -> 彐 -> 豎 -> 止/龰).',
    exampleWord: '捷運', exampleZhuyin: 'ㄐㄧㄝˊ ㄩㄣˋ',
    strokes: [
      s(1, '橫', '橫', 0.12, 0.32, 0.36, 0.32, 'Horizontal bar of 扌'),
      s(2, '鉤', '豎鉤', 0.25, 0.14, 0.25, 0.88, 'Vertical stem with hook of 扌'),
      s(3, '提', '提', 0.12, 0.64, 0.36, 0.50, 'Upward 提 of 扌'),
      s(4, '橫', '橫', 0.44, 0.22, 0.84, 0.22, 'Top horizontal of right 疌'),
      s(5, '折', '橫折', 0.46, 0.34, 0.80, 0.54, 'Upper-right turn of 彐', { x: 0.80, y: 0.34 }),
      s(6, '橫', '橫', 0.42, 0.44, 0.86, 0.44, 'Wide middle horizontal piercing 彐'),
      s(7, '橫', '橫', 0.46, 0.54, 0.80, 0.54, 'Lower horizontal of 彐'),
      s(8, '豎', '豎', 0.64, 0.12, 0.64, 0.78, 'Central vertical spine of 疌'),
      s(9, '橫', '橫', 0.64, 0.66, 0.80, 0.66, 'Right short branch on spine'),
      s(10, '撇', '撇', 0.48, 0.62, 0.36, 0.86, 'Lower-left 撇 of 龰'),
      s(11, '捺', '捺', 0.46, 0.72, 0.88, 0.88, 'Final sweeping 捺 of 龰'),
    ],
  },
  {
    char: '運', zhuyin: 'ㄩㄣˋ', pinyin: 'yùn', english: 'transport / transit / luck (捷運)',
    radical: '辵 (辶)', totalStrokes: 13, tocflBand: 'Novice 1',
    taiwanMoeOrthographyNote:
      'Always write the inner component 軍 (冖 + 車, 9 strokes) FIRST, then write the outer 辶 road radical LAST.',
    exampleWord: '捷運站', exampleZhuyin: 'ㄐㄧㄝˊ ㄩㄣˋ ㄓㄢˋ',
    strokes: [
      s(1, '點', '點', 0.40, 0.16, 0.38, 0.26, 'Left dot of 冖 crown in 軍'),
      s(2, '鉤', '橫鉤', 0.40, 0.16, 0.84, 0.24, 'Top 冖 crown of 軍', { x: 0.86, y: 0.16 }),
      s(3, '橫', '橫', 0.44, 0.30, 0.80, 0.30, 'Upper bar of 車'),
      s(4, '豎', '豎', 0.44, 0.38, 0.46, 0.58, 'Left vertical of 日 in 車'),
      s(5, '折', '橫折', 0.44, 0.38, 0.80, 0.58, 'Right corner of 日 in 車', { x: 0.80, y: 0.38 }),
      s(6, '橫', '橫', 0.46, 0.48, 0.78, 0.48, 'Middle bar of 日 in 車'),
      s(7, '橫', '橫', 0.46, 0.58, 0.78, 0.58, 'Bottom bar of 日 in 車'),
      s(8, '橫', '橫', 0.38, 0.68, 0.86, 0.68, 'Wide axle bar of 車'),
      s(9, '豎', '豎', 0.62, 0.20, 0.62, 0.80, 'Central vertical axle of 軍'),
      s(10, '點', '點', 0.16, 0.22, 0.26, 0.30, 'Top dot of 辶 road radical'),
      s(11, '折', '橫折折撇', 0.12, 0.48, 0.24, 0.76, 'Zig-zag body of 辶', { x: 0.28, y: 0.56 }),
      s(12, '捺', '平捺', 0.14, 0.76, 0.88, 0.88, 'Sweeping boat-bottom 平捺 of 辶'),
    ],
  },
  {
    char: '請', zhuyin: 'ㄑㄧㄥˇ', pinyin: 'qǐng', english: 'please / to invite (言 + 青)',
    radical: '言', totalStrokes: 15, tocflBand: 'Novice 1',
    taiwanMoeOrthographyNote:
      'Taiwan Traditional retains the full 7-stroke 言 radical on the left + 8-stroke 青 phonetic component on the right.',
    exampleWord: '請問', exampleZhuyin: 'ㄑㄧㄥˇ ㄨㄣˋ',
    strokes: [
      s(1, '點', '點', 0.22, 0.14, 0.28, 0.22, 'Top dot of 言'),
      s(2, '橫', '橫', 0.12, 0.28, 0.40, 0.28, 'Long top bar of 言'),
      s(3, '橫', '橫', 0.16, 0.40, 0.36, 0.40, 'Second bar of 言'),
      s(4, '橫', '橫', 0.16, 0.52, 0.36, 0.52, 'Third bar of 言'),
      s(5, '豎', '豎', 0.16, 0.64, 0.18, 0.84, 'Left vertical of 口 in 言'),
      s(6, '折', '橫折', 0.16, 0.64, 0.36, 0.84, 'Top-right of 口 in 言', { x: 0.36, y: 0.64 }),
      s(7, '橫', '橫', 0.18, 0.84, 0.36, 0.84, 'Bottom bar of 口 in 言'),
      s(8, '橫', '橫', 0.48, 0.22, 0.82, 0.22, 'First top bar of 青'),
      s(9, '橫', '橫', 0.50, 0.33, 0.80, 0.33, 'Second bar of 青'),
      s(10, '豎', '豎', 0.65, 0.12, 0.65, 0.44, 'Center vertical of upper 青'),
      s(11, '橫', '橫', 0.44, 0.44, 0.86, 0.44, 'Third wide bar of 青'),
      s(12, '豎', '豎', 0.52, 0.54, 0.52, 0.88, 'Left vertical of lower 月 in 青'),
      s(13, '鉤', '橫折鉤', 0.52, 0.54, 0.78, 0.88, 'Right frame & hook of 月 in 青', { x: 0.78, y: 0.54 }),
      s(14, '橫', '橫', 0.52, 0.66, 0.76, 0.66, 'Upper internal bar of 月'),
      s(15, '橫', '橫', 0.52, 0.76, 0.76, 0.76, 'Lower internal bar of 月'),
    ],
  },
  {
    char: '謝', zhuyin: 'ㄒㄧㄝˋ', pinyin: 'xiè', english: 'to thank / surname Xie (言 + 射)',
    radical: '言', totalStrokes: 17,
    tocflBand: 'Novice 1', taiwanMoeOrthographyNote: 'Три-part horizontal balance: 言 (left) + 身 (middle) + 寸 (right).',
    exampleWord: '謝謝', exampleZhuyin: 'ㄒㄧㄝˋ ˙ㄒㄧㄝ',
    strokes: [
      s(1, '點', '點', 0.18, 0.16, 0.24, 0.24, 'Top dot of 言'),
      s(2, '橫', '橫', 0.10, 0.30, 0.32, 0.30, 'Long bar of 言'),
      s(3, '橫', '橫', 0.14, 0.42, 0.30, 0.42, 'Middle bar of 言'),
      s(4, '橫', '橫', 0.14, 0.54, 0.30, 0.54, 'Lower bar of 言'),
      s(5, '折', '橫折', 0.14, 0.66, 0.30, 0.84, '口 box of 言', { x: 0.30, y: 0.66 }),
      s(6, '撇', '撇', 0.48, 0.14, 0.42, 0.26, 'Top 撇 of middle 身'),
      s(7, '豎', '豎', 0.40, 0.26, 0.40, 0.68, 'Left vertical of 身'),
      s(8, '鉤', '橫折鉤', 0.40, 0.26, 0.58, 0.86, 'Right frame & hook of 身', { x: 0.58, y: 0.26 }),
      s(9, '提', '提', 0.36, 0.68, 0.60, 0.60, 'Cross-提 of 身'),
      s(10, '撇', '撇', 0.62, 0.48, 0.36, 0.84, 'Diagonal 撇 through 身'),
      s(11, '橫', '橫', 0.66, 0.40, 0.90, 0.40, 'Horizontal of right 寸'),
      s(12, '鉤', '豎鉤', 0.80, 0.16, 0.80, 0.88, 'Vertical hook of right 寸'),
      s(13, '點', '點', 0.68, 0.56, 0.74, 0.66, 'Inner dot of 寸'),
    ],
  },
  {
    char: '永', zhuyin: 'ㄩㄥˇ', pinyin: 'yǒng', english: 'eternal (永字八法 Eight Principles of Yong)',
    radical: '水', totalStrokes: 5, tocflBand: 'Band A1',
    taiwanMoeOrthographyNote: 'Classic calligraphy benchmark character containing all 8 foundational stroke movements (永字八法).',
    exampleWord: '永康街', exampleZhuyin: 'ㄩㄥˇ ㄎㄤ ㄐㄧㄝ',
    strokes: [
      s(1, '點', '點', 0.46, 0.12, 0.54, 0.22, '側 (Dot)'),
      s(2, '鉤', '橫折鉤', 0.30, 0.30, 0.50, 0.88, '勒 + 努 + 趯 (Horizontal + Vertical + Hook)', { x: 0.50, y: 0.30 }),
      s(3, '折', '橫撇', 0.18, 0.50, 0.16, 0.78, '策 + 掠 (Left horizontal-sweep)', { x: 0.36, y: 0.50 }),
      s(4, '撇', '撇', 0.78, 0.38, 0.56, 0.56, '啄 (Short upper-right peck)'),
      s(5, '捺', '捺', 0.54, 0.54, 0.86, 0.84, '磔 (Sweeping right press)'),
    ],
  },
  {
    char: '人', zhuyin: 'ㄖㄣˊ', pinyin: 'rén', english: 'person / people',
    radical: '人', totalStrokes: 2, tocflBand: 'Novice 1',
    taiwanMoeOrthographyNote: 'Write 撇 (left sweep) first from top center, then 捺 (right press) starting slightly below the apex.',
    exampleWord: '臺灣人', exampleZhuyin: 'ㄊㄞˊ ㄨㄢ ㄖㄣˊ',
    strokes: [
      s(1, '撇', '撇', 0.52, 0.16, 0.16, 0.86, 'Primary left-falling 撇'),
      s(2, '捺', '捺', 0.46, 0.36, 0.86, 0.86, 'Supporting right-falling 捺'),
    ],
  },
  {
    char: '大', zhuyin: 'ㄉㄚˋ', pinyin: 'dà', english: 'big / large / great',
    radical: '大', totalStrokes: 3, tocflBand: 'Novice 1', taiwanMoeOrthographyNote: '橫 first, then central sweeping 撇, then right 捺.',
    exampleWord: '大安站', exampleZhuyin: 'ㄉㄚˋ ㄢ ㄓㄢˋ',
    strokes: [
      s(1, '橫', '橫', 0.18, 0.40, 0.82, 0.40, 'Main horizontal bar'),
      s(2, '撇', '撇', 0.50, 0.14, 0.16, 0.88, 'Central sweeping 撇'),
      s(3, '捺', '捺', 0.50, 0.44, 0.86, 0.88, 'Right sweeping 捺'),
    ],
  },
  {
    char: '水', zhuyin: 'ㄕㄨㄟˇ', pinyin: 'shuǐ', english: 'water / liquid',
    radical: '水', totalStrokes: 4,
    tocflBand: 'Novice 1', taiwanMoeOrthographyNote: 'Center 豎鉤 spine first, then left 橫撇, then right 撇 and 捺.',
    exampleWord: '水果', exampleZhuyin: 'ㄕㄨㄟˇ ㄍㄨㄛˇ',
    strokes: [
      s(1, '鉤', '豎鉤', 0.50, 0.14, 0.50, 0.88, 'Center vertical hook spine'),
      s(2, '折', '橫撇', 0.20, 0.44, 0.16, 0.78, 'Left 橫撇 wing', { x: 0.40, y: 0.44 }),
      s(3, '撇', '撇', 0.80, 0.34, 0.56, 0.54, 'Upper-right short 撇'),
      s(4, '捺', '捺', 0.54, 0.52, 0.86, 0.84, 'Lower-right sweeping 捺'),
    ],
  },
  {
    char: '木', zhuyin: 'ㄇㄨˋ', pinyin: 'mù', english: 'tree / wood',
    radical: '木', totalStrokes: 4,
    tocflBand: 'Novice 1', taiwanMoeOrthographyNote: '橫 -> 豎 -> 撇 -> 捺 (Taiwan MOE uses unhooked 豎 in 木).',
    exampleWord: '木柵', exampleZhuyin: 'ㄇㄨˋ ㄓㄚˋ',
    strokes: [
      s(1, '橫', '橫', 0.18, 0.36, 0.82, 0.36, 'Horizontal branch'),
      s(2, '豎', '豎', 0.50, 0.12, 0.50, 0.90, 'Central vertical trunk'),
      s(3, '撇', '撇', 0.48, 0.38, 0.16, 0.82, 'Left root sweep'),
      s(4, '捺', '捺', 0.52, 0.38, 0.84, 0.82, 'Right root press'),
    ],
  },
  {
    char: '心', zhuyin: 'ㄒㄧㄣ', pinyin: 'xīn', english: 'heart / mind / center',
    radical: '心', totalStrokes: 4,
    tocflBand: 'Novice 1', taiwanMoeOrthographyNote: 'Left 點 -> sweeping 臥鉤 (lying hook) -> middle 點 -> outer right 點.',
    exampleWord: '點心', exampleZhuyin: 'ㄉㄧㄢˇ ㄒㄧㄣ',
    strokes: [
      s(1, '點', '點', 0.18, 0.48, 0.14, 0.68, 'Left hanging dot'),
      s(2, '鉤', '臥鉤', 0.28, 0.46, 0.74, 0.78, 'Curved lying hook 臥鉤', { x: 0.48, y: 0.84 }),
      s(3, '點', '點', 0.48, 0.32, 0.54, 0.44, 'Center upper dot'),
      s(4, '點', '點', 0.76, 0.36, 0.86, 0.50, 'Outer right dot'),
    ],
  },
  {
    char: '日', zhuyin: 'ㄖˋ', pinyin: 'rì', english: 'sun / day',
    radical: '日', totalStrokes: 4,
    tocflBand: 'Novice 1', taiwanMoeOrthographyNote: 'Left 豎 -> top-right 橫折 -> middle 橫 -> bottom closing 橫.',
    exampleWord: '日月潭', exampleZhuyin: 'ㄖˋ ㄩㄝˋ ㄊㄢˊ',
    strokes: [
      s(1, '豎', '豎', 0.28, 0.18, 0.28, 0.84, 'Left vertical wall'),
      s(2, '折', '橫折', 0.28, 0.18, 0.72, 0.84, 'Top and right wall', { x: 0.72, y: 0.18 }),
      s(3, '橫', '橫', 0.28, 0.50, 0.70, 0.50, 'Middle dividing bar'),
      s(4, '橫', '橫', 0.28, 0.84, 0.72, 0.84, 'Bottom closing bar'),
    ],
  },
  {
    char: '中', zhuyin: 'ㄓㄨㄥ', pinyin: 'zhōng', english: 'middle / center',
    radical: '丨', totalStrokes: 4, tocflBand: 'Novice 1',
    taiwanMoeOrthographyNote: 'Complete the 口 box first (豎 -> 橫折 -> 橫), then pierce the central vertical 豎 last.', exampleWord: '臺中',
    exampleZhuyin: 'ㄊㄞˊ ㄓㄨㄥ',
    strokes: [
      s(1, '豎', '豎', 0.22, 0.32, 0.24, 0.60, 'Left vertical of 口'),
      s(2, '折', '橫折', 0.22, 0.32, 0.76, 0.60, 'Top and right of 口', { x: 0.78, y: 0.32 }),
      s(3, '橫', '橫', 0.24, 0.60, 0.76, 0.60, 'Bottom closing of 口'),
      s(4, '豎', '豎', 0.50, 0.10, 0.50, 0.92, 'Central piercing vertical 豎'),
    ],
  },
];
/**
 * 10 Core Semantic Radicals (部首) for the 形聲字 Workbench (FORM-REQ-0014).
 */
export const SEMANTIC_RADICALS: SemanticRadicalEntry[] = [
  { radical: '氵', variantForms: '水 / 氵', zhuyin: 'ㄕㄨㄟˇ', meaningEn: 'Water, liquid, river, washing', categoryExplanation: 'Left 3-dot water radical (三點水) indicates liquids, beverages, rivers, or moisture.', coreExamples: ['清', '湯', '汁', '泡', '灣', '洋', '江', '注'] },
  { radical: '言', variantForms: '言 / 訁', zhuyin: 'ㄧㄢˊ', meaningEn: 'Speech, language, asking, thanking', categoryExplanation: 'Left 7-stroke speech radical (言字旁) signals verbal communication, polite requests, or words.', coreExamples: ['請', '謝', '語', '話', '訪', '詩', '認識'] },
  { radical: '食', variantForms: '食 / 飠', zhuyin: 'ㄕˊ', meaningEn: 'Food, eating, meals, nourishment', categoryExplanation: 'Food radical (食字旁) marks cooked dishes, staples, fullness, and dining.', coreExamples: ['飯', '飽', '餃', '餅', '館', '養', '餓'] },
  { radical: '扌', variantForms: '手 / 扌', zhuyin: 'ㄕㄡˇ', meaningEn: 'Hand action, holding, carrying, tapping', categoryExplanation: 'Left hand radical (提手旁) denotes physical manipulation or gesture.', coreExamples: ['把', '抱', '捷', '持', '找', '刷', '拉'] },
  { radical: '心', variantForms: '心 / 忄', zhuyin: 'ㄒㄧㄣ', meaningEn: 'Heart, emotion, cognition, feeling', categoryExplanation: 'Standing heart (豎心旁 忄) or bottom heart (心) indicates mood, feeling, or thought.', coreExamples: ['情', '快', '慢', '忙', '想', '您', '怕'] },
  { radical: '辵', variantForms: '辵 / 辶', zhuyin: 'ㄔㄨㄛˋ', meaningEn: 'Walking, road, transit, distance', categoryExplanation: 'Walking radical (走之部 辶) wraps around phonetic components to signify motion or transport.', coreExamples: ['運', '這', '邊', '遠', '近', '送', '過'] },
  { radical: '日', variantForms: '日', zhuyin: 'ㄖˋ', meaningEn: 'Sun, time, weather, brightness', categoryExplanation: 'Sun radical marks clear weather, time of day, or calendar periods.', coreExamples: ['晴', '時', '早', '晚', '明', '昨'] },
  { radical: '目', variantForms: '目', zhuyin: 'ㄇㄨˋ', meaningEn: 'Eye, vision, looking, pupil', categoryExplanation: 'Eye radical indicates sight, pupils, or visual attention.', coreExamples: ['睛', '眼', '看', '睡', '瞄'] },
  { radical: '火', variantForms: '火 / 灬', zhuyin: 'ㄏㄨㄛˇ', meaningEn: 'Fire, heat, roasting, cooking', categoryExplanation: 'Fire radical or 4-dot bottom fire (四點火 灬) denotes heat, frying, or light.', coreExamples: ['烤', '熱', '炒', '燒', '燈', '煮'] },
  { radical: '金', variantForms: '金 / 釒', zhuyin: 'ㄐㄧㄣ', meaningEn: 'Metal, coins, hardware, tools', categoryExplanation: 'Metal radical marks coins, metallic vessels, needles, or keys.', coreExamples: ['錢', '銀', '鐵', '鐘', '鍋', '錯'] },
];
/**
 * 10 High-Yield Phonetic Series (聲符) covering 47 Traditional Characters (FORM-REQ-0014).
 */
export const PHONETIC_SERIES_BANK: PhoneticSeriesEntry[] = [
  {
    id: 'series-qing', phoneticComponent: '青', baseZhuyin: 'ㄑㄧㄥ', basePinyin: 'qīng',
    baseMeaningEn: 'green / blue / clear youth',
    soundPatternSummary: 'Preserves -ing rhyme (ㄧㄥ) with palatal initials ㄑ (q) or ㄐ (j).',
    derivatives: [
      { char: '請', zhuyin: 'ㄑㄧㄥˇ', pinyin: 'qǐng', english: 'please / to invite', semanticRadical: '言', semanticRoleEn: 'Speech (言) -> polite request', phoneticRelationNote: 'Exact segment match ㄑㄧㄥ in Tone 3', exampleCompound: '請問' },
      { char: '清', zhuyin: 'ㄑㄧㄥ', pinyin: 'qīng', english: 'clear / pure water', semanticRadical: '氵', semanticRoleEn: 'Water (氵) -> clear liquid', phoneticRelationNote: 'Identical pronunciation ㄑㄧㄥ', exampleCompound: '清楚' },
      { char: '晴', zhuyin: 'ㄑㄧㄥˊ', pinyin: 'qíng', english: 'sunny / clear sky', semanticRadical: '日', semanticRoleEn: 'Sun (日) -> clear weather', phoneticRelationNote: 'Same syllable ㄑㄧㄥ in Tone 2', exampleCompound: '晴天' },
      { char: '情', zhuyin: 'ㄑㄧㄥˊ', pinyin: 'qíng', english: 'feeling / emotion / situation', semanticRadical: '心', semanticRoleEn: 'Heart (忄) -> human emotion', phoneticRelationNote: 'Same syllable ㄑㄧㄥ in Tone 2', exampleCompound: '事情' },
      { char: '睛', zhuyin: 'ㄐㄧㄥ', pinyin: 'jīng', english: 'eyeball / pupil', semanticRadical: '目', semanticRoleEn: 'Eye (目) -> pupil of the eye', phoneticRelationNote: 'Unaspirated palatal ㄐ + ㄧㄥ', exampleCompound: '眼睛' },
      { char: '精', zhuyin: 'ㄐㄧㄥ', pinyin: 'jīng', english: 'refined / essence / energy', semanticRadical: '米', semanticRoleEn: 'Rice (米) -> refined grain', phoneticRelationNote: 'Unaspirated palatal ㄐ + ㄧㄥ', exampleCompound: '精神' },
    ],
  },
  {
    id: 'series-ma', phoneticComponent: '馬', baseZhuyin: 'ㄇㄚˇ', basePinyin: 'mǎ',
    baseMeaningEn: 'horse', soundPatternSummary: 'Strictly preserves syllable ㄇㄚ (ma) across all 5 tones.',
    derivatives: [
      { char: '媽', zhuyin: 'ㄇㄚ', pinyin: 'mā', english: 'mother / mom', semanticRadical: '女', semanticRoleEn: 'Woman (女) -> mother', phoneticRelationNote: 'ㄇㄚ in Tone 1', exampleCompound: '媽媽' },
      { char: '嗎', zhuyin: '˙ㄇㄚ', pinyin: 'ma', english: 'yes/no question particle', semanticRadical: '口', semanticRoleEn: 'Mouth (口) -> spoken particle', phoneticRelationNote: 'ㄇㄚ in Neutral Tone', exampleCompound: '好嗎' },
      { char: '罵', zhuyin: 'ㄇㄚˋ', pinyin: 'mà', english: 'to scold / curse', semanticRadical: '网', semanticRoleEn: 'Net/Mouths -> verbal scolding', phoneticRelationNote: 'ㄇㄚ in Tone 4', exampleCompound: '挨罵' },
      { char: '碼', zhuyin: 'ㄇㄚˇ', pinyin: 'mǎ', english: 'number / code / dock', semanticRadical: '石', semanticRoleEn: 'Stone (石) -> counting weight/number', phoneticRelationNote: 'Identical ㄇㄚˇ (Tone 3)', exampleCompound: '號碼' },
      { char: '螞', zhuyin: 'ㄇㄚˇ', pinyin: 'mǎ', english: 'ant (螞蟻)', semanticRadical: '虫', semanticRoleEn: 'Insect (虫) -> ant', phoneticRelationNote: 'Identical ㄇㄚˇ (Tone 3)', exampleCompound: '螞蟻' },
    ],
  },
  {
    id: 'series-ba', phoneticComponent: '巴', baseZhuyin: 'ㄅㄚ', basePinyin: 'bā',
    baseMeaningEn: 'to cling to / hope / bus', soundPatternSummary: 'Preserves bilabial ㄅ/ㄆ + ㄚ (ba/pa) across tones.',
    derivatives: [
      { char: '吧', zhuyin: '˙ㄅㄚ', pinyin: 'ba', english: 'suggestion particle', semanticRadical: '口', semanticRoleEn: 'Mouth (口) -> modal particle', phoneticRelationNote: 'ㄅㄚ in Neutral Tone', exampleCompound: '走吧' },
      { char: '爸', zhuyin: 'ㄅㄚˋ', pinyin: 'bà', english: 'father / dad', semanticRadical: '父', semanticRoleEn: 'Father (父) -> dad', phoneticRelationNote: 'ㄅㄚ in Tone 4', exampleCompound: '爸爸' },
      { char: '把', zhuyin: 'ㄅㄚˇ', pinyin: 'bǎ', english: 'to hold / disposal marker', semanticRadical: '扌', semanticRoleEn: 'Hand (扌) -> grasping handle', phoneticRelationNote: 'ㄅㄚ in Tone 3', exampleCompound: '把手' },
      { char: '靶', zhuyin: 'ㄅㄚˇ', pinyin: 'bǎ', english: 'shooting target', semanticRadical: '革', semanticRoleEn: 'Leather (革) -> leather target', phoneticRelationNote: 'ㄅㄚ in Tone 3', exampleCompound: '目標靶' },
      { char: '疤', zhuyin: 'ㄅㄚ', pinyin: 'bā', english: 'scar', semanticRadical: '疒', semanticRoleEn: 'Sickness (疒) -> healed wound', phoneticRelationNote: 'Identical ㄅㄚ (Tone 1)', exampleCompound: '傷疤' },
    ],
  },
  {
    id: 'series-bao', phoneticComponent: '包', baseZhuyin: 'ㄅㄠ', basePinyin: 'bāo',
    baseMeaningEn: 'to wrap / bun / bag', soundPatternSummary: 'Preserves -ao rhyme (ㄠ) with bilabial initials ㄅ (b) or ㄆ (p).',
    derivatives: [
      { char: '飽', zhuyin: 'ㄅㄠˇ', pinyin: 'bǎo', english: 'full (from eating)', semanticRadical: '食', semanticRoleEn: 'Food (飠) -> eaten until full', phoneticRelationNote: 'ㄅㄠ in Tone 3', exampleCompound: '吃飽' },
      { char: '抱', zhuyin: 'ㄅㄠˋ', pinyin: 'bào', english: 'to hug / hold in arms', semanticRadical: '扌', semanticRoleEn: 'Hand (扌) -> embrace', phoneticRelationNote: 'ㄅㄠ in Tone 4', exampleCompound: '抱歉' },
      { char: '泡', zhuyin: 'ㄆㄠˋ', pinyin: 'pào', english: 'to steep / bubble / brew', semanticRadical: '氵', semanticRoleEn: 'Water (氵) -> steeping tea/bubbles', phoneticRelationNote: 'Aspirated bilabial ㄆ + ㄠˋ', exampleCompound: '泡茶' },
      { char: '跑', zhuyin: 'ㄆㄠˇ', pinyin: 'pǎo', english: 'to run / jog', semanticRadical: '足', semanticRoleEn: 'Foot (足) -> running', phoneticRelationNote: 'Aspirated bilabial ㄆ + ㄠˇ', exampleCompound: '跑步' },
      { char: '胞', zhuyin: 'ㄅㄠ', pinyin: 'bāo', english: 'cell / compatriot', semanticRadical: '月', semanticRoleEn: 'Flesh (月) -> biological cell', phoneticRelationNote: 'Identical ㄅㄠ (Tone 1)', exampleCompound: '同胞' },
    ],
  },
  {
    id: 'series-fang', phoneticComponent: '方', baseZhuyin: 'ㄈㄤ', basePinyin: 'fāng',
    baseMeaningEn: 'square / direction / place', soundPatternSummary: 'Strictly preserves labiodental ㄈ + ㄤ (fang) across Tones 1–4.',
    derivatives: [
      { char: '房', zhuyin: 'ㄈㄤˊ', pinyin: 'fáng', english: 'room / house', semanticRadical: '戶', semanticRoleEn: 'Door (戶) -> room/building', phoneticRelationNote: 'ㄈㄤ in Tone 2', exampleCompound: '房間' },
      { char: '放', zhuyin: 'ㄈㄤˋ', pinyin: 'fàng', english: 'to put / release', semanticRadical: '攴', semanticRoleEn: 'Action (攵) -> let go/place', phoneticRelationNote: 'ㄈㄤ in Tone 4', exampleCompound: '放心' },
      { char: '訪', zhuyin: 'ㄈㄤˇ', pinyin: 'fǎng', english: 'to visit / interview', semanticRadical: '言', semanticRoleEn: 'Speech (言) -> inquire/visit', phoneticRelationNote: 'ㄈㄤ in Tone 3', exampleCompound: '拜訪' },
      { char: '防', zhuyin: 'ㄈㄤˊ', pinyin: 'fáng', english: 'to defend / prevent', semanticRadical: '阜', semanticRoleEn: 'Mound (阝) -> defensive embankment', phoneticRelationNote: 'ㄈㄤ in Tone 2', exampleCompound: '防止' },
    ],
  },
  {
    id: 'series-jiao', phoneticComponent: '交', baseZhuyin: 'ㄐㄧㄠ', basePinyin: 'jiāo',
    baseMeaningEn: 'to hand over / intersect',
    soundPatternSummary: 'Preserves -iao rhyme (ㄧㄠ) across ㄐ (j), ㄒ (x), and zero-initial ㄧ (y).',
    derivatives: [
      { char: '校', zhuyin: 'ㄒㄧㄠˋ', pinyin: 'xiào', english: 'school / campus', semanticRadical: '木', semanticRoleEn: 'Wood (木) -> wooden academy building', phoneticRelationNote: 'Palatal fricative ㄒ + ㄧㄠˋ', exampleCompound: '學校' },
      { char: '較', zhuyin: 'ㄐㄧㄠˋ', pinyin: 'jiào', english: 'comparatively / rather (Taiwan ㄐㄧㄠˋ)', semanticRadical: '車', semanticRoleEn: 'Chariot (車) -> comparing side-by-side', phoneticRelationNote: 'Taiwan MOE standard ㄐㄧㄠˋ', exampleCompound: '比較' },
      { char: '郊', zhuyin: 'ㄐㄧㄠ', pinyin: 'jiāo', english: 'suburb / outskirts', semanticRadical: '邑', semanticRoleEn: 'City (阝) -> outer district', phoneticRelationNote: 'Identical ㄐㄧㄠ (Tone 1)', exampleCompound: '郊區' },
      { char: '咬', zhuyin: 'ㄧㄠˇ', pinyin: 'yǎo', english: 'to bite / chew', semanticRadical: '口', semanticRoleEn: 'Mouth (口) -> biting', phoneticRelationNote: 'Medial+rhyme ㄧㄠˇ', exampleCompound: '咬一口' },
    ],
  },
  {
    id: 'series-si', phoneticComponent: '寺', baseZhuyin: 'ㄙˋ', basePinyin: 'sì',
    baseMeaningEn: 'Buddhist temple (龍山寺)',
    soundPatternSummary: 'Ancient alveolar/retroflex cluster yielding ㄕ (shi), ㄔ (chi), ㄉ (d), and ㄊ (t).',
    derivatives: [
      { char: '時', zhuyin: 'ㄕˊ', pinyin: 'shí', english: 'time / hour', semanticRadical: '日', semanticRoleEn: 'Sun (日) -> solar time', phoneticRelationNote: 'Retroflex ㄕˊ', exampleCompound: '時間' },
      { char: '詩', zhuyin: 'ㄕ', pinyin: 'shī', english: 'poem / poetry', semanticRadical: '言', semanticRoleEn: 'Speech (言) -> verse', phoneticRelationNote: 'Retroflex ㄕ (Tone 1)', exampleCompound: '唐詩' },
      { char: '持', zhuyin: 'ㄔˊ', pinyin: 'chí', english: 'to hold / maintain / support', semanticRadical: '扌', semanticRoleEn: 'Hand (扌) -> hold steady', phoneticRelationNote: 'Retroflex ㄔˊ', exampleCompound: '支持' },
      { char: '等', zhuyin: 'ㄉㄥˇ', pinyin: 'děng', english: 'to wait / rank', semanticRadical: '竹', semanticRoleEn: 'Bamboo (竹) -> sorted bamboo slips', phoneticRelationNote: 'Alveolar stop ㄉㄥˇ', exampleCompound: '等一下' },
      { char: '特', zhuyin: 'ㄊㄜˋ', pinyin: 'tè', english: 'special / particular', semanticRadical: '牛', semanticRoleEn: 'Ox (牛) -> standout bull', phoneticRelationNote: 'Alveolar stop ㄊㄜˋ', exampleCompound: '特別' },
    ],
  },
  {
    id: 'series-yang', phoneticComponent: '羊', baseZhuyin: 'ㄧㄤˊ', basePinyin: 'yáng',
    baseMeaningEn: 'sheep / goat', soundPatternSummary: 'Preserves ㄧㄤ (yang) in most derivatives.',
    derivatives: [
      { char: '洋', zhuyin: 'ㄧㄤˊ', pinyin: 'yáng', english: 'ocean / foreign', semanticRadical: '氵', semanticRoleEn: 'Water (氵) -> vast ocean', phoneticRelationNote: 'Identical ㄧㄤˊ', exampleCompound: '太平洋' },
      { char: '樣', zhuyin: 'ㄧㄤˋ', pinyin: 'yàng', english: 'appearance / kind / type', semanticRadical: '木', semanticRoleEn: 'Wood (木) -> wooden pattern mold', phoneticRelationNote: 'ㄧㄤ in Tone 4', exampleCompound: '怎麼樣' },
      { char: '養', zhuyin: 'ㄧㄤˇ', pinyin: 'yǎng', english: 'to raise / nourish', semanticRadical: '食', semanticRoleEn: 'Food (食) -> nurture with food', phoneticRelationNote: 'ㄧㄤ in Tone 3', exampleCompound: '營養' },
      { char: '鮮', zhuyin: 'ㄒㄧㄢ', pinyin: 'xiān', english: 'fresh / delicious (魚+羊)', semanticRadical: '魚', semanticRoleEn: 'Fish + Sheep -> fresh umami flavor', phoneticRelationNote: 'Compound semantic-phonetic ㄒㄧㄢ', exampleCompound: '海鮮' },
    ],
  },
  {
    id: 'series-gong', phoneticComponent: '工', baseZhuyin: 'ㄍㄨㄥ', basePinyin: 'gōng',
    baseMeaningEn: 'work / craft / carpenter square', soundPatternSummary: 'Preserves velar -ong (ㄍㄨㄥ/ㄎㄨㄥ/ㄏㄨㄥ) and palatal ㄐㄧㄤ.',
    derivatives: [
      { char: '紅', zhuyin: 'ㄏㄨㄥˊ', pinyin: 'hóng', english: 'red / popular (紅茶)', semanticRadical: '糸', semanticRoleEn: 'Silk (糸) -> red-dyed silk', phoneticRelationNote: 'Velar ㄏ + ㄨㄥˊ', exampleCompound: '紅茶' },
      { char: '空', zhuyin: 'ㄎㄨㄥ', pinyin: 'kōng / kòng', english: 'sky / empty / free time', semanticRadical: '穴', semanticRoleEn: 'Cave (穴) -> hollow space', phoneticRelationNote: 'Velar ㄎ + ㄨㄥ', exampleCompound: '空氣' },
      { char: '功', zhuyin: 'ㄍㄨㄥ', pinyin: 'gōng', english: 'merit / achievement / skill', semanticRadical: '力', semanticRoleEn: 'Strength (力) -> effort/skill', phoneticRelationNote: 'Identical ㄍㄨㄥ', exampleCompound: '成功' },
      { char: '江', zhuyin: 'ㄐㄧㄤ', pinyin: 'jiāng', english: 'large river', semanticRadical: '氵', semanticRoleEn: 'Water (氵) -> major river', phoneticRelationNote: 'Historical velar -> palatal ㄐㄧㄤ', exampleCompound: '淡水江' },
    ],
  },
  {
    id: 'series-zhu', phoneticComponent: '主', baseZhuyin: 'ㄓㄨˇ', basePinyin: 'zhǔ',
    baseMeaningEn: 'host / main / owner', soundPatternSummary: 'Preserves retroflex ㄓㄨ (zhu) or rounded ㄨㄤ (wang).',
    derivatives: [
      { char: '住', zhuyin: 'ㄓㄨˋ', pinyin: 'zhù', english: 'to live / reside / stay', semanticRadical: '人', semanticRoleEn: 'Person (亻) -> where a person stays', phoneticRelationNote: 'ㄓㄨ in Tone 4', exampleCompound: '住在臺灣' },
      { char: '注', zhuyin: 'ㄓㄨˋ', pinyin: 'zhù', english: 'to pour / annotate (注音)', semanticRadical: '氵', semanticRoleEn: 'Water (氵) -> pour focus/water', phoneticRelationNote: 'ㄓㄨ in Tone 4', exampleCompound: '注音符號' },
      { char: '柱', zhuyin: 'ㄓㄨˋ', pinyin: 'zhù', english: 'pillar / column', semanticRadical: '木', semanticRoleEn: 'Wood (木) -> wooden pillar', phoneticRelationNote: 'ㄓㄨ in Tone 4', exampleCompound: '柱子' },
      { char: '往', zhuyin: 'ㄨㄤˇ', pinyin: 'wǎng', english: 'toward / bound for', semanticRadical: '彳', semanticRoleEn: 'Step (彳) -> walking toward', phoneticRelationNote: 'Rounded medial ㄨㄤˇ', exampleCompound: '往臺北' },
    ],
  },
];
export function getMoeCharacterEntry(char: string): MoeCharacterStrokeEntry {
  return MOE_STROKE_CHARACTER_BANK.find((c) => c.char === char) || MOE_STROKE_CHARACTER_BANK[0];
}
