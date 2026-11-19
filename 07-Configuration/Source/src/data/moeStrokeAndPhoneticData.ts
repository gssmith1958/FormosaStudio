/**
 * FormosaStudio (FORM) — Taiwan MOE Standard Vector Stroke-Order Bank & Semantic-Phonetic (形聲字) Workbench Data
 * Powered by exact offline SVG stroke outlines & multi-point medians (AnimCJK ZhHant + MakeMeAHanzi Traditional)
 * so every shadow glyph, stroke guide, demo stroke, and Wacom vector grader aligns 100% mathematically.
 * Traces to: FORM-REQ-0013, FORM-REQ-0014, FORM-DEP-TPA-003
 */
import rawStrokeVectors from './moeStrokeVectorData.json';

export const MOE_VECTOR_BOX = 1024;
export const MOE_VECTOR_Y_ORIGIN = 900;
export const MOE_CANVAS_PAD = 0.08;
export const MOE_CANVAS_SCALE = 0.84;

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
  waypoints?: NormalizedPoint[]; // Multi-point centerline between start and end
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
  svgStrokes: string[];
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
type RawVectorDataset = Record<string, { source: string; strokes: string[]; medians: [number, number][][] }>;
const VECTOR_DATASET = rawStrokeVectors as unknown as RawVectorDataset;

function vectorToNorm(pt: [number, number]): NormalizedPoint {
  return {
    x: Number((MOE_CANVAS_PAD + (pt[0] / MOE_VECTOR_BOX) * MOE_CANVAS_SCALE).toFixed(4)),
    y: Number((MOE_CANVAS_PAD + ((MOE_VECTOR_Y_ORIGIN - pt[1]) / MOE_VECTOR_BOX) * MOE_CANVAS_SCALE).toFixed(4)),
  };
}

function classifyMedianStroke(pts: NormalizedPoint[]): { type: MoeStrokeType; nameZh: string } {
  const start = pts[0];
  const end = pts[pts.length - 1];
  const dx = end.x - start.x;
  const dy = end.y - start.y;
  const dist = Math.hypot(dx, dy);
  let polyLen = 0;
  for (let i = 1; i < pts.length; i++) {
    polyLen += Math.hypot(pts[i].x - pts[i - 1].x, pts[i].y - pts[i - 1].y);
  }
  if (pts.length >= 3 && polyLen > dist * 1.28) {
    const lastDx = end.x - pts[pts.length - 2].x;
    const lastDy = end.y - pts[pts.length - 2].y;
    if (lastDy < -0.02 || (lastDx < -0.02 && lastDy < 0.01)) return { type: '鉤', nameZh: '折鉤' };
    return { type: '折', nameZh: '橫折' };
  }
  if (dist < 0.14) return { type: '點', nameZh: '點' };
  if (dx > 0 && dy < -0.04) return { type: '提', nameZh: '提' };
  if (Math.abs(dx) >= Math.abs(dy) * 1.8) return { type: '橫', nameZh: '橫' };
  if (Math.abs(dy) >= Math.abs(dx) * 1.8) return { type: '豎', nameZh: '豎' };
  if (dx < 0 && dy > 0) return { type: '撇', nameZh: '撇' };
  return { type: '捺', nameZh: '捺' };
}

function buildEntry(meta: Omit<MoeCharacterStrokeEntry, 'totalStrokes' | 'svgStrokes' | 'strokes'>): MoeCharacterStrokeEntry {
  const vec = VECTOR_DATASET[meta.char];
  const strokes: MoeVectorStroke[] = vec.medians.map((rawMed, i) => {
    const normPts = rawMed.map(vectorToNorm);
    const start = normPts[0];
    const end = normPts[normPts.length - 1];
    const waypoints = normPts.length > 2 ? normPts.slice(1, -1) : undefined;
    const mid = normPts.length > 2 ? normPts[Math.floor(normPts.length / 2)] : undefined;
    const { type, nameZh } = classifyMedianStroke(normPts);
    return {
      index: i + 1,
      type,
      nameZh,
      start,
      mid,
      waypoints,
      end,
      tipEn: `Stroke ${i + 1} (${nameZh}) of ${meta.char}`,
    };
  });
  return {
    ...meta,
    totalStrokes: strokes.length,
    svgStrokes: vec.strokes,
    strokes,
  };
}

/**
 * Curated 20-Character Taiwan MOE Standard Stroke-Order Bank (教育部國字標準字體筆順).
 * Ordered Easy-First (2–5 stroke primitives first, then Taiwan MOE core & cross-strait comparisons).
 */
export const MOE_STROKE_CHARACTER_BANK: MoeCharacterStrokeEntry[] = [
  buildEntry({
    char: '人', zhuyin: 'ㄖㄣˊ', pinyin: 'rén', english: 'person / people (2 strokes — Day 1 starter)',
    radical: '人', tocflBand: 'Novice 1',
    taiwanMoeOrthographyNote: 'Write 撇 (left sweep) first from top center, then 捺 (right press) starting slightly below the apex.',
    exampleWord: '臺灣人', exampleZhuyin: 'ㄊㄞˊ ㄨㄢ ㄖㄣˊ',
  }),
  buildEntry({
    char: '大', zhuyin: 'ㄉㄚˋ', pinyin: 'dà', english: 'big / large / great (3 strokes)',
    radical: '大', tocflBand: 'Novice 1',
    taiwanMoeOrthographyNote: '橫 first, then central sweeping 撇, then right 捺 (3 strokes).',
    exampleWord: '大安站', exampleZhuyin: 'ㄉㄚˋ ㄢ ㄓㄢˋ',
  }),
  buildEntry({
    char: '日', zhuyin: 'ㄖˋ', pinyin: 'rì', english: 'sun / day (4 strokes)',
    radical: '日', tocflBand: 'Novice 1',
    taiwanMoeOrthographyNote: 'Left 豎 -> top-right 橫折 (1 continuous stroke!) -> middle 橫 -> bottom closing 橫 last.',
    exampleWord: '日月潭', exampleZhuyin: 'ㄖˋ ㄩㄝˋ ㄊㄢˊ',
  }),
  buildEntry({
    char: '中', zhuyin: 'ㄓㄨㄥ', pinyin: 'zhōng', english: 'middle / center (4 strokes)',
    radical: '丨', tocflBand: 'Novice 1',
    taiwanMoeOrthographyNote: 'Complete the 口 box first (豎 -> 橫折 -> 橫), then pierce the central vertical 豎 last (4 strokes).',
    exampleWord: '臺中', exampleZhuyin: 'ㄊㄞˊ ㄓㄨㄥ',
  }),
  buildEntry({
    char: '木', zhuyin: 'ㄇㄨˋ', pinyin: 'mù', english: 'tree / wood (4 strokes)',
    radical: '木', tocflBand: 'Novice 1',
    taiwanMoeOrthographyNote: '橫 -> 豎 -> 撇 -> 捺 (Taiwan MOE uses unhooked 豎 in 木, 4 strokes).',
    exampleWord: '木柵', exampleZhuyin: 'ㄇㄨˋ ㄓㄚˋ',
  }),
  buildEntry({
    char: '水', zhuyin: 'ㄕㄨㄟˇ', pinyin: 'shuǐ', english: 'water / liquid (4 strokes)',
    radical: '水', tocflBand: 'Novice 1',
    taiwanMoeOrthographyNote: 'Center 豎鉤 spine first, then left 橫撇, then right 撇 and 捺 (4 strokes).',
    exampleWord: '水果', exampleZhuyin: 'ㄕㄨㄟˇ ㄍㄨㄛˇ',
  }),
  buildEntry({
    char: '心', zhuyin: 'ㄒㄧㄣ', pinyin: 'xīn', english: 'heart / mind / center (4 strokes)',
    radical: '心', tocflBand: 'Novice 1',
    taiwanMoeOrthographyNote: 'Left 點 -> sweeping 臥鉤 (lying hook) -> middle 點 -> outer right 點 (4 strokes).',
    exampleWord: '點心', exampleZhuyin: 'ㄉㄧㄢˇ ㄒㄧㄣ',
  }),
  buildEntry({
    char: '永', zhuyin: 'ㄩㄥˇ', pinyin: 'yǒng', english: 'eternal (5 strokes — 永字八法 calligraphy benchmark)',
    radical: '水', tocflBand: 'Band A1',
    taiwanMoeOrthographyNote: 'Classic 5-stroke calligraphy benchmark character containing all 8 foundational stroke movements (永字八法).',
    exampleWord: '永康街', exampleZhuyin: 'ㄩㄥˇ ㄎㄤ ㄐㄧㄝ',
  }),
  buildEntry({
    char: '為', zhuyin: 'ㄨㄟˊ', pinyin: 'wéi / wèi', english: 'to act as / for / because of (Taiwan MOE 9-stroke point-first)',
    radical: '爪 (爫)', tocflBand: 'Novice 2',
    taiwanMoeOrthographyNote: 'Taiwan MOE 國字標準字體筆順 strictly starts with top-left 點 (Stroke 1), then long sweeping 撇 (Stroke 2), stepped 橫折 / 橫折鉤 (Strokes 3–5), and finishes with 4 bottom dots (Strokes 6–9).',
    mainlandComparisonNote: 'Mainland simplified 为 has only 4 strokes; HK/calligraphic 爲 has 12 strokes with 爪 top.',
    exampleWord: '因為', exampleZhuyin: 'ㄧㄣ ㄨㄟˋ',
  }),
  buildEntry({
    char: '骨', zhuyin: 'ㄍㄨˇ', pinyin: 'gǔ', english: 'bone / frame (10-stroke right-side inner fold)',
    radical: '骨', tocflBand: 'Band A2',
    taiwanMoeOrthographyNote: 'In Taiwan MOE 10-stroke standard, the inner small corner inside the top skull box sits on the RIGHT side (Strokes 3–4), whereas Mainland places the inner fold on the left (9 strokes).',
    mainlandComparisonNote: 'Mainland GB form places the small inner box on the left (9 strokes).',
    exampleWord: '排骨酥', exampleZhuyin: 'ㄆㄞˊ ㄍㄨˇ ㄙㄨ',
  }),
  buildEntry({
    char: '國', zhuyin: 'ㄍㄨㄛˊ', pinyin: 'guó', english: 'country / nation (Traditional 國 with 或 inside 囗)',
    radical: '囗', tocflBand: 'Novice 1',
    taiwanMoeOrthographyNote: 'Outer 囗 enclosure starts with left 豎 and top-right 橫折, then complete inner 或 (橫, 口, 提, 斜鉤, 撇, 點), and finally seal the bottom 橫 last (11 strokes).',
    exampleWord: '國語', exampleZhuyin: 'ㄍㄨㄛˊ ㄩˇ',
  }),
  buildEntry({
    char: '捷', zhuyin: 'ㄐㄧㄝˊ', pinyin: 'jié', english: 'rapid / MRT (捷運)',
    radical: '扌 (手)', tocflBand: 'Novice 1',
    taiwanMoeOrthographyNote: 'Left 扌 (橫 -> 豎鉤 -> 提) + right 疌 (橫 -> 彐 -> 豎 -> 龰), 11 strokes total.',
    exampleWord: '捷運', exampleZhuyin: 'ㄐㄧㄝˊ ㄩㄣˋ',
  }),
  buildEntry({
    char: '裡', zhuyin: 'ㄌㄧˇ', pinyin: 'lǐ', english: 'inside / interior (Taiwan MOE left-衣 standard)',
    radical: '衣 (衤)', tocflBand: 'Novice 1',
    taiwanMoeOrthographyNote: 'Taiwan MOE standard uses left-right 衤(衣, 5 strokes) + 里 (7 strokes) = 12 strokes (variant 裏 has 13). In 里, write 日 first, then the vertical 豎 pierces down, followed by the bottom two 橫 strokes.',
    mainlandComparisonNote: 'Mainland/HK often use top-bottom 裏 or simplified 里 (which merges 裏/裡 into 里).',
    exampleWord: '裡面', exampleZhuyin: 'ㄌㄧˇ ㄇㄧㄢˋ',
  }),
  buildEntry({
    char: '黃', zhuyin: 'ㄏㄨㄤˊ', pinyin: 'huáng', english: 'yellow / surname Huang (Taiwan MOE 廿-top standard)',
    radical: '黃', tocflBand: 'Novice 2',
    taiwanMoeOrthographyNote: 'Taiwan MOE preserves the traditional 12-stroke 廿-top (橫 -> 豎 -> 豎 -> 橫 closing the top 廿) above the wide 橫 and central 田/由 structure.',
    mainlandComparisonNote: 'Mainland simplified 黄 replaces the closed 廿 top with an open 艹/共 top.',
    exampleWord: '蛋黃酥', exampleZhuyin: 'ㄉㄢˋ ㄏㄨㄤˊ ㄙㄨ',
  }),
  buildEntry({
    char: '運', zhuyin: 'ㄩㄣˋ', pinyin: 'yùn', english: 'transport / transit / luck (捷運)',
    radical: '辵 (辶)', tocflBand: 'Novice 1',
    taiwanMoeOrthographyNote: 'Always write the inner component 軍 (冖 + 車, 9 strokes) FIRST, then write the outer 4-stroke Taiwan MOE 辶 road radical LAST (13 strokes).',
    exampleWord: '捷運站', exampleZhuyin: 'ㄐㄧㄝˊ ㄩㄣˋ ㄓㄢˋ',
  }),
  buildEntry({
    char: '臺', zhuyin: 'ㄊㄞˊ', pinyin: 'tái', english: 'Taiwan / platform (Orthodox Traditional 臺)',
    radical: '至', tocflBand: 'Novice 1',
    taiwanMoeOrthographyNote: 'Official Taiwan MOE orthography uses 14-stroke 臺 (吉 + 冖 + 至) in formal names like 臺灣 and 臺北.',
    exampleWord: '臺灣', exampleZhuyin: 'ㄊㄞˊ ㄨㄢ',
  }),
  buildEntry({
    char: '請', zhuyin: 'ㄑㄧㄥˇ', pinyin: 'qǐng', english: 'please / to invite (言 + 青)',
    radical: '言', tocflBand: 'Novice 1',
    taiwanMoeOrthographyNote: 'Taiwan Traditional retains the full 7-stroke 言 radical on the left + 8-stroke 青 phonetic component on the right (15 strokes).',
    exampleWord: '請問', exampleZhuyin: 'ㄑㄧㄥˇ ㄨㄣˋ',
  }),
  buildEntry({
    char: '謝', zhuyin: 'ㄒㄧㄝˋ', pinyin: 'xiè', english: 'to thank / surname Xie (言 + 射)',
    radical: '言', tocflBand: 'Novice 1',
    taiwanMoeOrthographyNote: 'Three-part horizontal balance: 言 (7 strokes, left) + 身 (7 strokes, middle) + 寸 (3 strokes, right) = 17 strokes.',
    exampleWord: '謝謝', exampleZhuyin: 'ㄒㄧㄝˋ ˙ㄒㄧㄝ',
  }),
  buildEntry({
    char: '麵', zhuyin: 'ㄇㄧㄢˋ', pinyin: 'miàn', english: 'noodles / wheat flour (20-stroke Traditional 麵)',
    radical: '麥', tocflBand: 'Novice 1',
    taiwanMoeOrthographyNote: 'Taiwan Traditional distinguishes 20-stroke 麵 (wheat noodles, 麥+面) from 面 (face/surface). Never merge 麵 into 面.',
    mainlandComparisonNote: 'Mainland simplified merges 麵 into 面.',
    exampleWord: '牛肉麵', exampleZhuyin: 'ㄋㄧㄡˊ ㄖㄡˋ ㄇㄧㄢˋ',
  }),
  buildEntry({
    char: '灣', zhuyin: 'ㄨㄢ', pinyin: 'wān', english: 'bay / gulf / Taiwan (25-stroke Traditional 灣)',
    radical: '氵 (水)', tocflBand: 'Novice 1',
    taiwanMoeOrthographyNote: 'Complete 25-stroke Traditional 灣: left 氵 (3 strokes) + right 彎 (言 center + left/right 糸 above 弓).',
    exampleWord: '臺灣', exampleZhuyin: 'ㄊㄞˊ ㄨㄢ',
  }),
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
