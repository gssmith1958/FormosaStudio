/**
 * FormosaStudio (FORM) — Unified Stages 0–5 Course Syllabus & Adaptive Daily Session Engine
 * Aligns Pre-A1 -> TOCFL Level 4 / CEFR B2 (Classic HSK 5 Equivalent) with PED-1..PED-4 & Option A UX.
 * Traces to: FORM-ECR-001, FORM-DEC-005, FORM-WF-001, FORM-WF-002, FORM-WF-003
 */

import type { UserProgressState, ZhuyinDisplayMode } from './progressStore.ts';
import type { VocabularyEntry } from '../data/vocabularyCatalog.ts';
import type { StudioId } from './studioContextBus.ts';
import { getCustomScenarioPacks } from './curriculumAdminStore.ts';

export type StageNumber = 0 | 1 | 2 | 3 | 4 | 5;

export interface StageCheckpointQuestion {
  id: string;
  promptEn: string;
  promptZh: string;
  promptZhuyin: string;
  choices: { label: string; zhuyin?: string; note: string }[];
  correctIdx: number;
}

export interface SyllabusStageDef {
  stageNumber: StageNumber;
  id: string;
  titleEn: string;
  titleZh: string;
  tocflDualLabel: string;
  cefrLabel: string;
  summary: string;
  v2SeedNote?: string;
  pimsleurUnits: number[];
  ntnuRanges: { volume: number; startLesson: number; endLesson: number }[];
  survivalModuleIds: string[];
  recommendedStrokeChars: string[];
  checkpointQuestions: StageCheckpointQuestion[];
}

export const SYLLABUS_STAGES: SyllabusStageDef[] = [
  {
    stageNumber: 0,
    id: 'stage-0',
    titleEn: 'Start From Zero (Taiwan Foundations)',
    titleZh: '零基礎臺灣起步',
    tocflDualLabel: 'Pre-A1 · Foundations',
    cefrLabel: 'Pre-A1',
    summary: '4 Mandarin tones, 37 Zhuyin symbols, 8 basic strokes, 16 core radicals, and 5 real-life Taiwan arrival scenarios.',
    pimsleurUnits: [],
    ntnuRanges: [],
    survivalModuleIds: [],
    recommendedStrokeChars: ['一', '十', '人', '口', '大', '小'],
    checkpointQuestions: [],
  },
  {
    stageNumber: 1,
    id: 'stage-1',
    titleEn: 'Everyday Taiwan Survival',
    titleZh: '臺灣生存入門',
    tocflDualLabel: 'TOCFL Level 1 · Band A1 (Novice)',
    cefrLabel: 'A1',
    summary: 'Polite greetings, ordering drinks & meals, NT$ prices, Pimsleur Units 1–4, and NTNU Vol. 1 (L1–8).',
    pimsleurUnits: [1, 2, 3, 4],
    ntnuRanges: [{ volume: 1, startLesson: 1, endLesson: 8 }],
    survivalModuleIds: ['mod-1-essentials-bathroom', 'mod-2-prices-paying'],
    recommendedStrokeChars: ['你', '好', '我', '不', '要', '茶'],
    checkpointQuestions: [
      { id: 'cp1-1', promptEn: 'How do you politely ask "Excuse me, where is the restroom?" in Taiwan?', promptZh: '請問，洗手間在哪裡？', promptZhuyin: 'ㄑㄧㄥˇ ㄨㄣˋ，ㄒㄧˇ ㄕㄡˇ ㄐㄧㄢ ㄗㄞˋ ㄋㄚˇ ㄌㄧˇ？', choices: [{ label: '請問，洗手間在哪裡？', zhuyin: 'ㄑㄧㄥˇ ㄨㄣˋ ㄒㄧˇ ㄕㄡˇ ㄐㄧㄢ ㄗㄞˋ ㄋㄚˇ ㄌㄧˇ', note: 'Natural Taiwan phrasing (洗手間)' }, { label: '我要買地鐵票。', zhuyin: 'ㄨㄛˇ ㄧㄠˋ ㄇㄞˇ ㄉㄧˋ ㄊㄧㄝˇ ㄆㄧㄠˋ', note: 'Wrong topic and non-Taiwan term' }, { label: '這個很好吃。', zhuyin: 'ㄓㄜˋ ㄍㄜ˙ ㄏㄣˇ ㄏㄠˇ ㄔ', note: 'Means "this is delicious"' }], correctIdx: 0 },
      { id: 'cp1-2', promptEn: 'At a Taipei boba shop, what does 「微糖去冰」 mean?', promptZh: '微糖去冰', promptZhuyin: 'ㄨㄟˊ ㄊㄤˊ ㄑㄩˋ ㄅㄧㄥ', choices: [{ label: 'Full sugar, extra ice', note: 'That would be 全糖多冰' }, { label: 'Slight sugar (30%), no ice', note: 'Correct Taiwan drink customization' }, { label: 'Hot tea to go', note: 'That would be 熱的外帶' }], correctIdx: 1 },
      { id: 'cp1-3', promptEn: 'What does 「外帶」 mean when a clerk asks 「內用還是外帶？」?', promptZh: '內用還是外帶？', promptZhuyin: 'ㄋㄟˋ ㄩㄥˋ ㄏㄞˊ ㄕˋ ㄨㄞˋ ㄉㄞˋ？', choices: [{ label: 'Dine in here', note: 'That is 內用' }, { label: 'Pay by credit card', note: 'That is 刷卡' }, { label: 'Take out / To go', note: 'Correct — 外帶 means takeout' }], correctIdx: 2 },
      { id: 'cp1-4', promptEn: 'How do Taiwanese locals refer to Mandarin Chinese?', promptZh: '你會說＿＿嗎？', promptZhuyin: 'ㄋㄧˇ ㄏㄨㄟˋ ㄕㄨㄛ ＿＿ ㄇㄚ˙？', choices: [{ label: '中文 / 國語', zhuyin: 'ㄓㄨㄥ ㄨㄣˊ / ㄍㄨㄛˊ ㄩˇ', note: 'Standard everyday Taiwan usage' }, { label: '英文', zhuyin: 'ㄧㄥ ㄨㄣˊ', note: 'Means English' }, { label: '日文', zhuyin: 'ㄖˋ ㄨㄣˊ', note: 'Means Japanese' }], correctIdx: 0 },
      { id: 'cp1-5', promptEn: 'In Taiwan, how is the character 「和」 ("and") pronounced in 「我和朋友」?', promptZh: '我和朋友', promptZhuyin: 'ㄨㄛˇ ㄏㄢˋ ㄆㄥˊ ㄧㄡˇ', choices: [{ label: 'ㄏㄜˊ (hé)', note: 'Mainland standard; not primary spoken Taiwan reading' }, { label: 'ㄏㄢˋ (hàn)', note: 'Correct Taiwan MOE spoken reading' }, { label: 'ㄏㄨㄛˋ (huò)', note: 'Used for mixing, not "and"' }], correctIdx: 1 },
    ],
  },
  {
    stageNumber: 2,
    id: 'stage-2',
    titleEn: 'Daily Life, MRT & Dining',
    titleZh: '日常交通與點餐',
    tocflDualLabel: 'TOCFL Level 2 · Band A2',
    cefrLabel: 'A2',
    summary: 'Paper tick-menus (點菜單), MRT transfers, time & money, Pimsleur Units 5–10, NTNU Vol. 1 (L9–15) & Vol. 2 (L1–6).',
    pimsleurUnits: [5, 6, 7, 8, 9, 10],
    ntnuRanges: [
      { volume: 1, startLesson: 9, endLesson: 15 },
      { volume: 2, startLesson: 1, endLesson: 6 },
    ],
    survivalModuleIds: ['mod-3-directions-transit', 'mod-4-food-boba'],
    recommendedStrokeChars: ['臺', '灣', '捷', '運', '麵', '裡'],
    checkpointQuestions: [
      { id: 'cp2-1', promptEn: 'What is Taipei\'s metro system called in Taiwan?', promptZh: '搭＿＿去台北101', promptZhuyin: 'ㄉㄚ ＿＿ ㄑㄩˋ ㄊㄞˊ ㄅㄟˇ 101', choices: [{ label: '捷運 (ㄐㄧㄝˊ ㄩㄣˋ)', note: 'Correct — MRT in Taiwan' }, { label: '公車 (ㄍㄨㄥ ㄔㄜ)', note: 'City bus' }, { label: '計程車 (ㄐㄧˋ ㄔㄥˊ ㄔㄜ)', note: 'Taxi' }], correctIdx: 0 },
      { id: 'cp2-2', promptEn: 'What is the Taiwan MOE pronunciation of 「垃圾」 (trash)?', promptZh: '倒垃圾', promptZhuyin: 'ㄉㄠˋ ㄌㄜˋ ㄙㄜˋ', choices: [{ label: 'ㄌㄚ ㄐㄧ', note: 'Mainland reading; not Taiwan MOE' }, { label: 'ㄌㄜˋ ㄙㄜˋ', note: 'Correct Taiwan MOE pronunciation' }, { label: 'ㄌㄧˋ ㄙㄜˋ', note: 'Incorrect' }], correctIdx: 1 },
      { id: 'cp2-3', promptEn: 'At 7-Eleven, what is the clerk offering when asking 「需要載具嗎？」?', promptZh: '需要載具嗎？', promptZhuyin: 'ㄒㄩ ㄧㄠˋ ㄗㄞˋ ㄐㄩˋ ㄇㄚ˙？', choices: [{ label: 'A plastic shopping bag', note: 'That is 袋子' }, { label: 'Hot water for noodles', note: 'That is 熱水' }, { label: 'Digital receipt barcode (e-invoice)', note: 'Correct — 載具 stores your Taiwan lottery receipt' }], correctIdx: 2 },
      { id: 'cp2-4', promptEn: 'Which classifier is standard in Taiwan for cellphones (手機)?', promptZh: '一＿＿手機', promptZhuyin: 'ㄧˋ ＿＿ ㄕㄡˇ ㄐㄧ', choices: [{ label: '支 (ㄓ)', note: 'Correct Taiwan standard classifier for phones' }, { label: '杯 (ㄅㄟ)', note: 'For cups/drinks' }, { label: '碗 (ㄨㄢˇ)', note: 'For bowls of noodles/rice' }], correctIdx: 0 },
      { id: 'cp2-5', promptEn: 'How is 「你好」 spoken aloud after 3rd-Tone Sandhi?', promptZh: '你好', promptZhuyin: 'ㄋㄧˇ ㄏㄠˇ → ㄋㄧˊ ㄏㄠˇ', choices: [{ label: 'ㄋㄧˇ ㄏㄠˇ (3rd + 3rd)', note: 'Written citation tones only' }, { label: 'ㄋㄧˊ ㄏㄠˇ (2nd + 3rd)', note: 'Correct — first 3rd tone rises to 2nd tone' }, { label: 'ㄋㄧˋ ㄏㄠˇ (4th + 3rd)', note: 'Incorrect shift' }], correctIdx: 1 },
    ],
  },
  {
    stageNumber: 3,
    id: 'stage-3',
    titleEn: 'Independent Living & Stories',
    titleZh: '獨立生活與閱讀',
    tocflDualLabel: 'TOCFL Level 3 · Band B1',
    cefrLabel: 'B1',
    summary: 'Connected conversations, clinic visits, Taiwan particles & Hokkien cues, Pimsleur Units 11–19, NTNU Vol. 2 (L7–12) & Vol. 3 (L1–6).',
    pimsleurUnits: [11, 12, 13, 14, 15, 16, 17, 18, 19],
    ntnuRanges: [
      { volume: 2, startLesson: 7, endLesson: 12 },
      { volume: 3, startLesson: 1, endLesson: 6 },
    ],
    survivalModuleIds: ['mod-5-stores-hotels-signs', 'mod-6-health-allergies-emergency'],
    recommendedStrokeChars: ['為', '骨', '黃', '銀', '行', '傳'],
    checkpointQuestions: [
      { id: 'cp3-1', promptEn: 'What does a store sign saying 「八折」 mean in Taiwan?', promptZh: '全館八折', promptZhuyin: 'ㄑㄩㄢˊ ㄍㄨㄢˇ ㄅㄚ ㄓㄜˊ', choices: [{ label: '80% off', note: 'Common English trap! 八折 means pay 80%' }, { label: '20% off (pay 80%)', note: 'Correct — 8/10 of original price' }, { label: 'Buy 8 get 1 free', note: 'Incorrect' }], correctIdx: 1 },
      { id: 'cp3-2', promptEn: 'Choose the correct polyphone reading of 「行」 in 「銀行」 (bank):', promptZh: '我去銀行', promptZhuyin: 'ㄨㄛˇ ㄑㄩˋ ㄧㄣˊ ㄏㄤˊ', choices: [{ label: 'ㄏㄤˊ (háng)', note: 'Correct — row / firm / bank' }, { label: 'ㄒㄧㄥˊ (xíng)', note: 'Used in 不行 / 行人' }, { label: 'ㄏㄥˊ (héng)', note: 'Incorrect' }], correctIdx: 0 },
      { id: 'cp3-3', promptEn: 'What does the warm Taiwanese expression 「拍謝」 (pháinn-sè) mean?', promptZh: '拍謝啦！', promptZhuyin: 'ㄆㄞ ㄒㄧㄝˋ ㄌㄚ˙', choices: [{ label: 'Thank you very much', note: 'That is 多謝 (to-siā)' }, { label: 'Delicious!', note: 'That is 讚 / 好吃' }, { label: 'Excuse me / Sorry to trouble you', note: 'Correct — everyday Taiwanese Hokkien politeness' }], correctIdx: 2 },
      { id: 'cp3-4', promptEn: 'How is 「還」 pronounced in 「去銀行還錢」 ("repay money")?', promptZh: '還錢', promptZhuyin: 'ㄏㄨㄢˊ ㄑㄧㄢˊ', choices: [{ label: 'ㄏㄞˊ (hái)', note: 'Means "still / also" (還有)' }, { label: 'ㄏㄨㄢˊ (huán)', note: 'Correct — return / repay' }, { label: 'ㄏㄨㄢˋ (huàn)', note: 'That is 換 (exchange)' }], correctIdx: 1 },
      { id: 'cp3-5', promptEn: 'What does Taiwan\'s famous phrase 「人情味」 describe?', promptZh: '臺灣的人情味', promptZhuyin: 'ㄊㄞˊ ㄨㄢ ㄉㄜ˙ ㄖㄣˊ ㄑㄧㄥˊ ㄨㄟˋ', choices: [{ label: 'Warm human hospitality and kindness', note: 'Correct — signature cultural concept in Taiwan' }, { label: 'Spicy beef noodle flavor', note: 'Not a food flavor' }, { label: 'Rush-hour traffic', note: 'Incorrect' }], correctIdx: 0 },
    ],
  },
  {
    stageNumber: 4,
    id: 'stage-4',
    titleEn: 'Connected Speech & Formal Bridge',
    titleZh: '連貫表達與書面語橋樑',
    tocflDualLabel: 'Lower TOCFL Level 4 · Band B2-',
    cefrLabel: 'B2-',
    summary: 'Spoken-to-formal (口語→書面語) register transitions, workplace/civic topics, NTNU Vol. 3 (L7–10) & Vol. 4 (L1–8).',
    v2SeedNote: 'v2.0 Core Seed: includes NTNU Vol. 3–4 lessons & Register Bridge. Expanded B2 vocabulary & essays arrive in Milestone B (v2.1).',
    pimsleurUnits: [],
    ntnuRanges: [
      { volume: 3, startLesson: 7, endLesson: 10 },
      { volume: 4, startLesson: 1, endLesson: 8 },
    ],
    survivalModuleIds: [],
    recommendedStrokeChars: ['企', '業', '危', '險', '傳', '統'],
    checkpointQuestions: [
      { id: 'cp4-1', promptEn: 'What is the Taiwan MOE tone for 「企」 in 「企業」 (enterprise)?', promptZh: '科技企業', promptZhuyin: 'ㄎㄜ ㄐㄧˋ ㄑㄧˋ ㄧㄝˋ', choices: [{ label: 'ㄑㄧˇ (3rd tone)', note: 'Mainland reading; Taiwan uses 4th tone' }, { label: 'ㄑㄧˋ (4th tone)', note: 'Correct Taiwan MOE standard' }, { label: 'ㄑㄧˊ (2nd tone)', note: 'Incorrect' }], correctIdx: 1 },
      { id: 'cp4-2', promptEn: 'What is the Taiwan MOE pronunciation of 「危險」 (dangerous)?', promptZh: '這樣太危險了', promptZhuyin: 'ㄨㄟˊ ㄒㄧㄢˇ', choices: [{ label: 'ㄨㄟˊ ㄒㄧㄢˇ (2nd + 3rd)', note: 'Correct Taiwan MOE pronunciation' }, { label: 'ㄨㄟ ㄒㄧㄢˇ (1st + 3rd)', note: 'Mainland standard' }, { label: 'ㄨㄟˋ ㄒㄧㄢˇ (4th + 3rd)', note: 'Incorrect' }], correctIdx: 0 },
      { id: 'cp4-3', promptEn: 'In 「自傳」 (autobiography), how is polyphone 「傳」 pronounced?', promptZh: '寫自傳', promptZhuyin: 'ㄒㄧㄝˇ ㄗˋ ㄓㄨㄢˋ', choices: [{ label: 'ㄔㄨㄢˊ (chuán)', note: 'Used for transmit / tradition (傳統)' }, { label: 'ㄓㄨㄢˇ (zhuǎn)', note: 'That is 轉' }, { label: 'ㄓㄨㄢˋ (zhuàn)', note: 'Correct — biography / chronicle' }], correctIdx: 2 },
      { id: 'cp4-4', promptEn: 'Which is the formal (書面語) counterpart to casual 「因為……所以……」?', promptZh: '書面語連接詞', promptZhuyin: 'ㄧㄡˊ ㄩˊ …… ㄧㄣ ㄘˇ ……', choices: [{ label: '由於……因此……', note: 'Correct formal written causal pair' }, { label: '然後……再來……', note: 'Spoken sequential filler' }, { label: '對呀……對不對……', note: 'Colloquial confirmation' }], correctIdx: 0 },
      { id: 'cp4-5', promptEn: 'In 「長大」 vs 「很長」, which pair of Taiwan readings is right?', promptZh: '長大以後這條路很長', promptZhuyin: 'ㄓㄤˇ ㄉㄚˋ / ㄏㄣˇ ㄔㄤˊ', choices: [{ label: 'ㄔㄤˊ ㄉㄚˋ / ㄏㄣˇ ㄓㄤˇ', note: 'Reversed!' }, { label: 'ㄓㄤˇ ㄉㄚˋ / ㄏㄣˇ ㄔㄤˊ', note: 'Correct — grow up (ㄓㄤˇ) vs long (ㄔㄤˊ)' }, { label: 'ㄓㄤˋ ㄉㄚˋ / ㄏㄣˇ ㄔㄤˊ', note: 'Incorrect tone on 長大' }], correctIdx: 1 },
    ],
  },
  {
    stageNumber: 5,
    id: 'stage-5',
    titleEn: 'Fluent Taiwan Discourse (HSK 5 Equiv.)',
    titleZh: '高階流利與文化語篇',
    tocflDualLabel: 'TOCFL Level 4 Mastery · Band B2 (Classic HSK 5 Equiv.)',
    cefrLabel: 'B2 / HSK 5',
    summary: 'Taiwan news/society articles, nuanced MOE polyphones, NTNU Vol. 5 (L1–8) & Vol. 6 (L1–8).',
    v2SeedNote: 'v2.0 Core Seed: includes NTNU Vol. 5–6 overviews & B2 polyphones. Full 2,500+ word TOCFL B2 lexicon, 50 成語 & timed Level 4 Mock Assessment arrive in Milestone B (v2.1).',
    pimsleurUnits: [],
    ntnuRanges: [
      { volume: 5, startLesson: 1, endLesson: 8 },
      { volume: 6, startLesson: 1, endLesson: 8 },
    ],
    survivalModuleIds: [],
    recommendedStrokeChars: ['知', '識', '都', '市', '成', '長'],
    checkpointQuestions: [
      { id: 'cp5-1', promptEn: 'How is 「識」 pronounced in 「知識」 under Taiwan MOE standard?', promptZh: '累積知識', promptZhuyin: 'ㄌㄟˇ ㄐㄧ ㄓ ㄕˋ', choices: [{ label: 'ㄕˋ (full 4th tone)', note: 'Correct Taiwan MOE pronunciation' }, { label: '˙ㄕ (neutral tone only)', note: 'Common Mainland reading' }, { label: 'ㄕˊ (2nd tone)', note: 'Incorrect' }], correctIdx: 0 },
      { id: 'cp5-2', promptEn: 'How is 「都」 pronounced in 「都市」 (metropolis)?', promptZh: '現代都市', promptZhuyin: 'ㄒㄧㄢˋ ㄉㄞˋ ㄉㄨ ㄕˋ', choices: [{ label: 'ㄉㄡ (dōu)', note: 'Means "all / both"' }, { label: 'ㄉㄨ (dū)', note: 'Correct — capital / metropolis' }, { label: 'ㄉㄨˇ (dǔ)', note: 'Incorrect' }], correctIdx: 1 },
      { id: 'cp5-3', promptEn: 'How is 「了」 pronounced in 「了解」 (to understand thoroughly)?', promptZh: '深入了解臺灣文化', promptZhuyin: 'ㄌㄧㄠˇ ㄐㄧㄝˇ', choices: [{ label: '˙ㄌㄜ (le)', note: 'Aspect particle only' }, { label: 'ㄌㄠˇ (lǎo)', note: 'Incorrect' }, { label: 'ㄌㄧㄠˇ (liǎo)', note: 'Correct — clear / understand' }], correctIdx: 2 },
      { id: 'cp5-4', promptEn: 'Which term means "profession / industry" using 「行」 as ㄏㄤˊ?', promptZh: '各行各業', promptZhuyin: 'ㄏㄤˊ ㄧㄝˋ', choices: [{ label: '行業 (ㄏㄤˊ ㄧㄝˋ)', note: 'Correct — industry / profession' }, { label: '旅行 (ㄌㄩˇ ㄒㄧㄥˊ)', note: 'Means travel (ㄒㄧㄥˊ)' }, { label: '行動 (ㄒㄧㄥˊ ㄉㄨㄥˋ)', note: 'Means action (ㄒㄧㄥˊ)' }], correctIdx: 0 },
      { id: 'cp5-5', promptEn: 'Which certification level in Taiwan aligns with CEFR B2 & Classic HSK 5?', promptZh: '華語文能力測驗', promptZhuyin: 'ㄏㄨㄚˊ ㄩˇ ㄨㄣˊ ㄋㄥˊ ㄌㄧˋ ㄘㄜˋ ㄧㄢˋ', choices: [{ label: 'TOCFL Level 1 (Band A1)', note: 'Introductory beginner' }, { label: 'TOCFL Level 4 (Band B2 · 高階級)', note: 'Correct — Taiwan B2 fluency benchmark' }, { label: 'Pre-A1 Novice', note: 'Absolute foundations' }], correctIdx: 1 },
    ],
  },
];

export interface StageRecommendedNext {
  kind: 'stage0_module' | 'pimsleur' | 'ntnu' | 'survival' | 'checkpoint' | 'next_stage';
  label: string;
  sublabel: string;
  targetStudio: StudioId;
  stageNumber: StageNumber;
  unitOrVolume?: number;
  lessonNumber?: number;
  moduleId?: string;
}

export interface StageDisplayPreset {
  showPinyinHint: boolean;
  zhuyinDisplayMode: ZhuyinDisplayMode;
  label: string;
}

export function getRecommendedDisplayPreset(stageNumber: number): StageDisplayPreset {
  if (stageNumber <= 1) {
    return {
      showPinyinHint: true,
      zhuyinDisplayMode: 'always',
      label: 'Stage 0–1 Scaffolding: Pinyin ON + Zhuyin Always',
    };
  }
  if (stageNumber <= 3) {
    return {
      showPinyinHint: false,
      zhuyinDisplayMode: 'adaptive',
      label: 'Stage 2–3 Bridge: Pinyin OFF + Adaptive Zhuyin',
    };
  }
  return {
    showPinyinHint: false,
    zhuyinDisplayMode: 'adaptive',
    label: 'Stage 4–5 Fluency: Pinyin OFF + Adaptive Zhuyin (Lv.0–1 kept)',
  };
}

export function getStageNtnuKeys(stage: SyllabusStageDef): string[] {
  const keys: string[] = [];
  for (const r of stage.ntnuRanges) {
    for (let l = r.startLesson; l <= r.endLesson; l++) {
      keys.push(`${r.volume}-${l}`);
    }
  }
  return keys;
}

export function getStageProgressDetail(stageNumber: StageNumber, state: UserProgressState): {
  stage: SyllabusStageDef;
  completedUnits: number;
  totalUnits: number;
  percent: number;
  checkpointPassed: boolean;
  checkpointBestAccuracy: number;
  customPacksCount: number;
  recommendedNext: StageRecommendedNext;
} {
  const stage = SYLLABUS_STAGES.find((s) => s.stageNumber === stageNumber) || SYLLABUS_STAGES[0];
  const customPacksCount = getCustomScenarioPacks(stageNumber).length;

  if (stageNumber === 0) {
    const doneMods = new Set(state.completedStage0Modules || []);
    const allIds = ['0.1', '0.2', '0.3', '0.4', '0.5'];
    const completedUnits = allIds.filter((id) => doneMods.has(id)).length;
    const nextMod = allIds.find((id) => !doneMods.has(id));
    const percent = Math.round((completedUnits / allIds.length) * 100);
    return {
      stage,
      completedUnits,
      totalUnits: allIds.length,
      percent,
      checkpointPassed: Boolean(state.stage0Skipped) || completedUnits >= allIds.length,
      checkpointBestAccuracy: percent,
      customPacksCount,
      recommendedNext: nextMod
        ? {
            kind: 'stage0_module',
            label: `Continue Module ${nextMod}`,
            sublabel: 'Stage 0 Taiwan Foundations',
            targetStudio: 'syllabus',
            stageNumber: 0,
            moduleId: nextMod,
          }
        : {
            kind: 'next_stage',
            label: 'Advance to Stage 1 · Everyday Taiwan Survival',
            sublabel: 'Stage 0 Foundations complete',
            targetStudio: 'syllabus',
            stageNumber: 1,
          },
    };
  }

  const donePim = new Set(state.completedPimsleurUnits || []);
  const doneNtnu = new Set(state.completedNtnuLessons || []);
  const ntnuKeys = getStageNtnuKeys(stage);
  const completedUnits =
    stage.pimsleurUnits.filter((u) => donePim.has(u)).length +
    ntnuKeys.filter((k) => doneNtnu.has(k)).length;
  const totalUnits = stage.pimsleurUnits.length + ntnuKeys.length;
  const percent = totalUnits > 0 ? Math.round((completedUnits / totalUnits) * 100) : 0;

  const cpRec = state.completedStageCheckpoints?.[stageNumber];
  const checkpointBestAccuracy = cpRec?.bestAccuracy ?? 0;
  const checkpointPassed = checkpointBestAccuracy >= 80;

  const nextPim = stage.pimsleurUnits.find((u) => !donePim.has(u));
  const nextNtnu = ntnuKeys.find((k) => !doneNtnu.has(k));

  let recommendedNext: StageRecommendedNext;
  if (nextPim !== undefined) {
    recommendedNext = {
      kind: 'pimsleur',
      label: `Start Pimsleur Unit ${nextPim}`,
      sublabel: 'Audio-first Taiwan Mandarin speaking & listening',
      targetStudio: 'syllabus',
      stageNumber,
      unitOrVolume: nextPim,
    };
  } else if (nextNtnu) {
    const [vol, les] = nextNtnu.split('-').map(Number);
    recommendedNext = {
      kind: 'ntnu',
      label: `Study NTNU Vol. ${vol} · Lesson ${les}`,
      sublabel: 'Contemporary Chinese structured grammar & vocabulary',
      targetStudio: 'syllabus',
      stageNumber,
      unitOrVolume: vol,
      lessonNumber: les,
    };
  } else if (!checkpointPassed) {
    recommendedNext = {
      kind: 'checkpoint',
      label: `Take Stage ${stageNumber} Checkpoint (5 Questions)`,
      sublabel: 'Score ≥ 80% to certify this stage',
      targetStudio: 'syllabus',
      stageNumber,
    };
  } else {
    const nextStage = Math.min(5, stageNumber + 1) as StageNumber;
    recommendedNext = {
      kind: 'next_stage',
      label: nextStage > stageNumber ? `Advance to Stage ${nextStage}` : 'Practice Fluency Labs',
      sublabel: nextStage > stageNumber ? SYLLABUS_STAGES[nextStage].titleEn : 'All stages completed!',
      targetStudio: nextStage > stageNumber ? 'syllabus' : 'reader',
      stageNumber: nextStage,
    };
  }

  return {
    stage,
    completedUnits,
    totalUnits,
    percent,
    checkpointPassed,
    checkpointBestAccuracy,
    customPacksCount,
    recommendedNext,
  };
}

export function getEntryStageNumber(entry: VocabularyEntry): StageNumber {
  if (typeof entry.targetStage === 'number') return entry.targetStage as StageNumber;
  if (entry.sourceType === 'pimsleur') {
    if (entry.sourceUnit <= 4) return 1;
    if (entry.sourceUnit <= 10) return 2;
    return 3;
  }
  if (entry.sourceUnit <= 1) return 1;
  if (entry.sourceUnit === 2) return 2;
  if (entry.sourceUnit === 3) return 3;
  if (entry.sourceUnit === 4) return 4;
  return 5;
}

export interface AdaptiveDailySessionPlan {
  activeStageNumber: StageNumber;
  sessionStageNumber: StageNumber;
  isPeekAhead: boolean;
  stageDef: SyllabusStageDef;
  recommendedPreset: StageDisplayPreset;
  queueItems: VocabularyEntry[];
  currentStageCount: number;
  spiralReviewCount: number;
  stepTitles: [string, string, string];
  stepDescriptions: [string, string, string];
  targetChar: { char: string; zhuyin: string; english: string };
}

export function resolveActiveStageNumber(state: UserProgressState): StageNumber {
  const doneStage0 = (state.completedStage0Modules || []).length >= 5;
  const hasHigherProgress =
    (state.completedPimsleurUnits || []).length > 0 || (state.completedNtnuLessons || []).length > 0;
  if (!state.stage0Skipped && !doneStage0 && !hasHigherProgress) {
    return 0;
  }
  for (const s of [1, 2, 3, 4, 5] as StageNumber[]) {
    const detail = getStageProgressDetail(s, state);
    if (detail.percent < 100) return s;
  }
  return 5;
}

/**
 * Generates a syllabus-adaptive 3-step 10-minute session (~70% current stage + ~30% spiral review).
 * Stage 0 uses foundational survival drills; Stage 1 spirals Stage 0 basics; supports contextual Peek-Ahead.
 */
export function buildAdaptiveDailySession(
  state: UserProgressState,
  catalog: VocabularyEntry[],
  peekStageNumber?: StageNumber | null
): AdaptiveDailySessionPlan {
  const activeStageNumber = resolveActiveStageNumber(state);
  const sessionStageNumber: StageNumber =
    typeof peekStageNumber === 'number' ? peekStageNumber : activeStageNumber;
  const isPeekAhead = sessionStageNumber !== activeStageNumber;
  const stageDef = SYLLABUS_STAGES[sessionStageNumber] || SYLLABUS_STAGES[0];
  const nowMs = Date.now();

  const scoreByUrgency = (a: VocabularyEntry, b: VocabularyEntry): number => {
    const ma = state.wordMastery[a.traditional];
    const mb = state.wordMastery[b.traditional];
    const dueA = ma && ma.nextReviewAt <= nowMs ? 0 : ma ? 2 : 1;
    const dueB = mb && mb.nextReviewAt <= nowMs ? 0 : mb ? 2 : 1;
    return dueA - dueB;
  };

  const primaryPool = catalog
    .filter((e) =>
      sessionStageNumber === 0
        ? getEntryStageNumber(e) <= 1
        : getEntryStageNumber(e) === sessionStageNumber
    )
    .sort(scoreByUrgency);

  const spiralPool =
    sessionStageNumber === 0
      ? []
      : catalog
          .filter((e) => {
            const st = getEntryStageNumber(e);
            if (sessionStageNumber === 1) {
              // Stage 1 spirals Stage 0 survival foundations (greetings, restroom, numbers, polite requests)
              return st <= 1 && (e.category === 'greetings_polite' || e.category === 'time_numbers');
            }
            return st < sessionStageNumber;
          })
          .sort(scoreByUrgency);

  const primaryPick = primaryPool.slice(0, sessionStageNumber === 0 ? 5 : 4);
  const pickedIds = new Set(primaryPick.map((p) => p.traditional));
  const spiralPick = spiralPool.filter((e) => !pickedIds.has(e.traditional)).slice(0, 2);

  const queueItems = [...primaryPick, ...spiralPick];
  if (queueItems.length < 4) {
    for (const fallback of catalog) {
      if (!pickedIds.has(fallback.traditional)) {
        queueItems.push(fallback);
        pickedIds.add(fallback.traditional);
        if (queueItems.length >= 5) break;
      }
    }
  }

  const primaryItem = queueItems[0];
  const firstChar =
    Array.from(primaryItem?.traditional || stageDef.recommendedStrokeChars[0] || '臺').find((c) =>
      /[\u4e00-\u9fff]/.test(c)
    ) || '臺';

  const stepTitles: [string, string, string] =
    sessionStageNumber === 0
      ? ['Step 1: Tones & Zhuyin Ear Warm-Up', 'Step 2: First Taiwan Survival Recall', 'Step 3: Basic Strokes & DaQian Intro']
      : [
          `Step 1: Stage ${sessionStageNumber} Listen & Shadow`,
          `Step 2: Active Recall (${primaryPick.length} Stage + ${spiralPick.length} Spiral)`,
          'Step 3: Stroke Order & DaQian Practice',
        ];

  const stepDescriptions: [string, string, string] =
    sessionStageNumber === 0
      ? [
          'Hear each syllable clearly in Taiwan Mandarin before trying tones.',
          'Listen first, recall the meaning, then reveal English to earn mastery.',
          'Write one foundational stroke character or test a Zhuyin key.',
        ]
      : [
          `Shadow ${stageDef.titleEn} phrases aloud in natural Taiwan cadence.`,
          `Recall ${primaryPick.length} current-stage phrases plus ${spiralPick.length} spiral review items from earlier stages.`,
          'Practice writing or typing one target character to cement visual memory.',
        ];

  return {
    activeStageNumber,
    sessionStageNumber,
    isPeekAhead,
    stageDef,
    recommendedPreset: getRecommendedDisplayPreset(sessionStageNumber),
    queueItems,
    currentStageCount: primaryPick.length,
    spiralReviewCount: spiralPick.length,
    stepTitles,
    stepDescriptions,
    targetChar: {
      char: firstChar,
      zhuyin: primaryItem?.zhuyin.split(/\s+/)[0] || 'ㄊㄞˊ',
      english: primaryItem?.english || 'Taiwan',
    },
  };
}
