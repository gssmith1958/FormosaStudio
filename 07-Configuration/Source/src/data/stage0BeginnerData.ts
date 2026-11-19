/**
 * FormosaStudio (FORM) — Stage 0: Start From Zero (Absolute Beginner Launchpad for Native English Speakers)
 * Covers all 5 Day-1 foundations identified by DEP-01 & DEP-03 (FORM-LL-009):
 *   0.1 Tone Ear Boot Camp (Plain-English analogies + Audio-only Tone Quiz + 2 Day-1 Sandhi Rules)
 *   0.2 Zhuyin (ㄅㄆㄇㄈ) Primer & English Sound Map (All 37 symbols in 6 families + Family-Specific Syllable Blender)
 *   0.3 English -> Mandarin Grammar Survival Map (5 Core Rules + Tap-the-Tiles Sentence Builder)
 *   0.4 Basic Strokes & Character Logic 101 (Interactive 8-Stroke Practice Pad + Instructive Radical Logic Quiz)
 *   0.5 First 10 Taipei Survival Phrases + Mini Café Roleplay
 */

import type { Stage0ModuleId } from '../lib/pathwayEngine.ts';

export interface Stage0ModuleMeta {
  id: Stage0ModuleId;
  numberLabel: string;
  titleEn: string;
  titleZh: string;
  estMinutes: number;
  summary: string;
}

export const STAGE0_MODULES: Stage0ModuleMeta[] = [
  { id: '0.1', numberLabel: '0.1', titleEn: 'Tone Ear Boot Camp', titleZh: '聲調聽辨入門', estMinutes: 8, summary: 'Hear the 4 Taiwanese tones + neutral tone before speaking.' },
  { id: '0.2', numberLabel: '0.2', titleEn: 'Zhuyin Sound Map', titleZh: '注音符號入門', estMinutes: 10, summary: 'Decode all 37 ㄅㄆㄇㄈ symbols using plain English sound cues.' },
  { id: '0.3', numberLabel: '0.3', titleEn: 'Grammar Survival Map', titleZh: '中英語序對照', estMinutes: 8, summary: '5 liberating Mandarin sentence rules + interactive tile builder.' },
  { id: '0.4', numberLabel: '0.4', titleEn: 'Strokes & Characters 101', titleZh: '基本筆畫邏輯', estMinutes: 8, summary: 'Practice all 8 basic strokes interactively and decode character radicals.' },
  { id: '0.5', numberLabel: '0.5', titleEn: 'First 10 Taipei Phrases', titleZh: '臺北生存十句', estMinutes: 10, summary: 'Essential polite phrases and a Taipei café roleplay.' },
];

export interface ToneAnalogyCard {
  tone: 1 | 2 | 3 | 4 | 5;
  nameEn: string;
  mark: string;
  englishAnalogy: string;
  exampleChar: string;
  exampleZhuyin: string;
  examplePinyin: string;
  meaningEn: string;
  taiwanTip: string;
}

export const STAGE0_TONE_CARDS: ToneAnalogyCard[] = [
  { tone: 1, nameEn: 'Tone 1 · High & Steady', mark: 'ˉ (blank)', englishAnalogy: 'Sing a clear, steady high note ("Ahhh..." at the doctor).', exampleChar: '媽', exampleZhuyin: 'ㄇㄚ', examplePinyin: 'mā', meaningEn: 'mom', taiwanTip: 'Keep it level—don’t let your voice drop at the end.' },
  { tone: 2, nameEn: 'Tone 2 · Rising Question', mark: 'ˊ', englishAnalogy: 'Say a quick surprised "Huh?" or "What?" going upward.', exampleChar: '麻', exampleZhuyin: 'ㄇㄚˊ', examplePinyin: 'má', meaningEn: 'numb / sesame', taiwanTip: 'Start mid-voice and glide smoothly upward.' },
  { tone: 3, nameEn: 'Tone 3 · Low Relaxed Dip', mark: 'ˇ', englishAnalogy: 'A low, relaxed "uhhh..." at the bottom of your voice.', exampleChar: '馬', exampleZhuyin: 'ㄇㄚˇ', examplePinyin: 'mǎ', meaningEn: 'horse', taiwanTip: 'In everyday Taiwan speech, stay low (Half-3) instead of bouncing back up!' },
  { tone: 4, nameEn: 'Tone 4 · Sharp Drop', mark: 'ˋ', englishAnalogy: 'A firm, crisp command: "No!" or "Stop!"', exampleChar: '罵', exampleZhuyin: 'ㄇㄚˋ', examplePinyin: 'mà', meaningEn: 'to scold', taiwanTip: 'Start high and drop quickly and decisively.' },
  { tone: 5, nameEn: 'Neutral · Quick Light Tap', mark: '˙', englishAnalogy: 'The light unstressed second syllable in "SO-fa".', exampleChar: '嗎', exampleZhuyin: '˙ㄇㄚ', examplePinyin: 'ma', meaningEn: '(yes/no question word)', taiwanTip: 'Short, soft, and unstressed—never force a tone on it.' },
];

export interface ToneQuizItem {
  id: string;
  kind: 'single' | 'pair_choice' | 'same_diff' | 'two_syllable';
  promptAudio: string;
  secondAudio?: string;
  answerTone?: 1 | 2 | 3 | 4;
  options?: string[];
  correctOptionIdx?: number;
  targetTones: (1 | 2 | 3 | 4)[];
  revealChar: string;
  revealZhuyin: string;
  revealPinyin: string;
  revealEnglish: string;
}

// Legacy 8-item export retained for compatibility; Module 0.1 uses STAGE0_BLIND_TONE_POOL
export const STAGE0_TONE_QUIZ: ToneQuizItem[] = [
  { id: 'tq1', kind: 'single', promptAudio: '媽', answerTone: 1, targetTones: [1], revealChar: '媽', revealZhuyin: 'ㄇㄚ', revealPinyin: 'mā', revealEnglish: 'mom (Tone 1 · High Steady)' },
  { id: 'tq2', kind: 'single', promptAudio: '麻', answerTone: 2, targetTones: [2], revealChar: '麻', revealZhuyin: 'ㄇㄚˊ', revealPinyin: 'má', revealEnglish: 'sesame / numb (Tone 2 · Rising)' },
  { id: 'tq3', kind: 'single', promptAudio: '馬', answerTone: 3, targetTones: [3], revealChar: '馬', revealZhuyin: 'ㄇㄚˇ', revealPinyin: 'mǎ', revealEnglish: 'horse (Tone 3 · Low Dip)' },
  { id: 'tq4', kind: 'single', promptAudio: '罵', answerTone: 4, targetTones: [4], revealChar: '罵', revealZhuyin: 'ㄇㄚˋ', revealPinyin: 'mà', revealEnglish: 'to scold (Tone 4 · Sharp Drop)' },
  { id: 'tq5', kind: 'single', promptAudio: '買', answerTone: 3, targetTones: [3], revealChar: '買', revealZhuyin: 'ㄇㄞˇ', revealPinyin: 'mǎi', revealEnglish: 'to buy (Tone 3 · Low)' },
  { id: 'tq6', kind: 'single', promptAudio: '賣', answerTone: 4, targetTones: [4], revealChar: '賣', revealZhuyin: 'ㄇㄞˋ', revealPinyin: 'mài', revealEnglish: 'to sell (Tone 4 · Drop)' },
  { id: 'tq7', kind: 'single', promptAudio: '湯', answerTone: 1, targetTones: [1], revealChar: '湯', revealZhuyin: 'ㄊㄤ', revealPinyin: 'tāng', revealEnglish: 'soup (Tone 1 · High Steady)' },
  { id: 'tq8', kind: 'single', promptAudio: '糖', answerTone: 2, targetTones: [2], revealChar: '糖', revealZhuyin: 'ㄊㄤˊ', revealPinyin: 'táng', revealEnglish: 'sugar (Tone 2 · Rising)' },
];

/**
 * Blind Tone Differentiation Pool (Zero Leaked Hints — DEP-01 / DEP-03):
 * Diverse syllables (ma, ba, tang, shi) + confusable pairs (Tone 2 vs 3, Tone 1 vs 4) + 2-syllable Taiwan combos.
 */
export const STAGE0_BLIND_TONE_POOL: ToneQuizItem[] = [
  ...STAGE0_TONE_QUIZ,
  { id: 'bt1', kind: 'single', promptAudio: '八', answerTone: 1, targetTones: [1], revealChar: '八', revealZhuyin: 'ㄅㄚ', revealPinyin: 'bā', revealEnglish: 'eight (Tone 1 · High Steady)' },
  { id: 'bt2', kind: 'single', promptAudio: '拔', answerTone: 2, targetTones: [2], revealChar: '拔', revealZhuyin: 'ㄅㄚˊ', revealPinyin: 'bá', revealEnglish: 'to pull (Tone 2 · Rising)' },
  { id: 'bt3', kind: 'single', promptAudio: '把', answerTone: 3, targetTones: [3], revealChar: '把', revealZhuyin: 'ㄅㄚˇ', revealPinyin: 'bǎ', revealEnglish: 'to hold / grasp (Tone 3 · Low)' },
  { id: 'bt4', kind: 'single', promptAudio: '爸', answerTone: 4, targetTones: [4], revealChar: '爸', revealZhuyin: 'ㄅㄚˋ', revealPinyin: 'bà', revealEnglish: 'dad (Tone 4 · Sharp Drop)' },
  { id: 'bt5', kind: 'single', promptAudio: '詩', answerTone: 1, targetTones: [1], revealChar: '詩', revealZhuyin: 'ㄕ', revealPinyin: 'shī', revealEnglish: 'poem (Tone 1 · High Steady)' },
  { id: 'bt6', kind: 'single', promptAudio: '十', answerTone: 2, targetTones: [2], revealChar: '十', revealZhuyin: 'ㄕˊ', revealPinyin: 'shí', revealEnglish: 'ten (Tone 2 · Rising)' },
  { id: 'bt7', kind: 'single', promptAudio: '史', answerTone: 3, targetTones: [3], revealChar: '史', revealZhuyin: 'ㄕˇ', revealPinyin: 'shǐ', revealEnglish: 'history (Tone 3 · Low)' },
  { id: 'bt8', kind: 'single', promptAudio: '是', answerTone: 4, targetTones: [4], revealChar: '是', revealZhuyin: 'ㄕˋ', revealPinyin: 'shì', revealEnglish: 'to be / yes (Tone 4 · Sharp Drop)' },
  // Targeted Confusable Minimal Pairs (Tone 2 vs 3, Tone 1 vs 4, Tone 3 vs 4)
  { id: 'mp1', kind: 'pair_choice', promptAudio: '糖', options: ['Tone 1 (High: tāng / soup)', 'Tone 2 (Rising: táng / sugar)'], correctOptionIdx: 1, targetTones: [2], revealChar: '糖', revealZhuyin: 'ㄊㄤˊ', revealPinyin: 'táng', revealEnglish: 'sugar (Tone 2 Rising vs. 湯 tāng Tone 1)' },
  { id: 'mp2', kind: 'pair_choice', promptAudio: '買', options: ['Tone 3 (Low: mǎi / buy)', 'Tone 4 (Drop: mài / sell)'], correctOptionIdx: 0, targetTones: [3], revealChar: '買', revealZhuyin: 'ㄇㄞˇ', revealPinyin: 'mǎi', revealEnglish: 'to buy (Tone 3 Low vs. 賣 mài Tone 4)' },
  { id: 'mp3', kind: 'pair_choice', promptAudio: '十', options: ['Tone 2 (Rising: shí / ten)', 'Tone 4 (Drop: shì / four/is)'], correctOptionIdx: 0, targetTones: [2], revealChar: '十', revealZhuyin: 'ㄕˊ', revealPinyin: 'shí', revealEnglish: 'ten (Tone 2 Rising vs. 四/是 Tone 4)' },
  { id: 'mp4', kind: 'pair_choice', promptAudio: '馬', options: ['Tone 2 (Rising: má / sesame)', 'Tone 3 (Low: mǎ / horse)'], correctOptionIdx: 1, targetTones: [3], revealChar: '馬', revealZhuyin: 'ㄇㄚˇ', revealPinyin: 'mǎ', revealEnglish: 'horse (Tone 3 Low vs. 麻 má Tone 2 — classic English ear trap!)' },
  { id: 'mp5', kind: 'pair_choice', promptAudio: '四', options: ['Tone 1 (High: sī)', 'Tone 4 (Drop: sì / four)'], correctOptionIdx: 1, targetTones: [4], revealChar: '四', revealZhuyin: 'ㄙˋ', revealPinyin: 'sì', revealEnglish: 'four (Tone 4 Sharp Drop)' },
  // 2-Syllable Taiwan Word Combinations (for Extended / Quiet-Room verification)
  { id: 'ts1', kind: 'two_syllable', promptAudio: '臺灣', options: ['Tone 2 + Tone 1 (Rising → High)', 'Tone 4 + Tone 3 (Drop → Low)'], correctOptionIdx: 0, targetTones: [2, 1], revealChar: '臺灣', revealZhuyin: 'ㄊㄞˊ ㄨㄢ', revealPinyin: 'Táiwān', revealEnglish: 'Taiwan (Rising ㄊㄞˊ + High Flat ㄨㄢ)' },
  { id: 'ts2', kind: 'two_syllable', promptAudio: '咖啡', options: ['Tone 1 + Tone 1 (High → High)', 'Tone 2 + Tone 4 (Rising → Drop)'], correctOptionIdx: 0, targetTones: [1], revealChar: '咖啡', revealZhuyin: 'ㄎㄚ ㄈㄟ', revealPinyin: 'kāfēi', revealEnglish: 'coffee (Two steady High Tone 1 syllables)' },
  { id: 'ts3', kind: 'two_syllable', promptAudio: '水餃', options: ['Tone 2 + Tone 3 (Rising → Low)', 'Tone 4 + Tone 4 (Drop → Drop)'], correctOptionIdx: 0, targetTones: [2, 3], revealChar: '水餃', revealZhuyin: 'ㄕㄨㄟˇ ㄐㄧㄠˇ', revealPinyin: 'shuǐjiǎo (spoken: shuíjiǎo)', revealEnglish: 'dumplings (3+3 sandhi → Rising + Low vs. 睡覺 shuìjiào 4+4!)' },
];

export interface ZhuyinBlindQuizItem {
  id: string;
  speakSample: string;
  correctSymbol: string;
  options: string[];
  pinyin: string;
  wordHint: string;
}

export const STAGE0_ZHUYIN_QUIZ_POOL: ZhuyinBlindQuizItem[] = [
  { id: 'zq1', speakSample: '巴', correctSymbol: 'ㄅ', options: ['ㄅ', 'ㄆ', 'ㄇ', 'ㄈ'], pinyin: 'b', wordHint: '八 (bā)' },
  { id: 'zq2', speakSample: '怕', correctSymbol: 'ㄆ', options: ['ㄅ', 'ㄆ', 'ㄉ', 'ㄊ'], pinyin: 'p', wordHint: '怕 (pà)' },
  { id: 'zq3', speakSample: '大', correctSymbol: 'ㄉ', options: ['ㄉ', 'ㄊ', 'ㄋ', 'ㄌ'], pinyin: 'd', wordHint: '大 (dà)' },
  { id: 'zq4', speakSample: '他', correctSymbol: 'ㄊ', options: ['ㄉ', 'ㄊ', 'ㄍ', 'ㄎ'], pinyin: 't', wordHint: '他 (tā)' },
  { id: 'zq5', speakSample: '哥', correctSymbol: 'ㄍ', options: ['ㄍ', 'ㄎ', 'ㄏ', 'ㄐ'], pinyin: 'g', wordHint: '哥 (gē)' },
  { id: 'zq6', speakSample: '可', correctSymbol: 'ㄎ', options: ['ㄍ', 'ㄎ', 'ㄏ', 'ㄑ'], pinyin: 'k', wordHint: '可 (kě)' },
  { id: 'zq7', speakSample: '七', correctSymbol: 'ㄑ', options: ['ㄐ', 'ㄑ', 'ㄒ', 'ㄔ'], pinyin: 'q', wordHint: '七 (qī)' },
  { id: 'zq8', speakSample: '西', correctSymbol: 'ㄒ', options: ['ㄐ', 'ㄑ', 'ㄒ', 'ㄙ'], pinyin: 'x', wordHint: '西 (xī)' },
  { id: 'zq9', speakSample: '知', correctSymbol: 'ㄓ', options: ['ㄓ', 'ㄔ', 'ㄗ', 'ㄘ'], pinyin: 'zh', wordHint: '知 (zhī)' },
  { id: 'zq10', speakSample: '次', correctSymbol: 'ㄘ', options: ['ㄓ', 'ㄔ', 'ㄗ', 'ㄘ'], pinyin: 'c', wordHint: '次 (cì)' },
  { id: 'zq11', speakSample: '魚', correctSymbol: 'ㄩ', options: ['ㄧ', 'ㄨ', 'ㄩ', 'ㄜ'], pinyin: 'yu / ü', wordHint: '魚 (yú)' },
  { id: 'zq12', speakSample: '湯', correctSymbol: 'ㄤ', options: ['ㄢ', 'ㄣ', 'ㄤ', 'ㄥ'], pinyin: 'ang', wordHint: '湯 (tāng)' },
];

export interface ZhuyinSymbolLesson {
  symbol: string;
  pinyin: string;
  englishCue: string;
  speakSample: string;
  mouthTip: string;
}

export interface BlendCombo {
  partsLabel: string;
  zhuyin: string;
  pinyin: string;
  sampleChar: string;
  meaningEn: string;
}

export interface ZhuyinFamilyGroup {
  id: string;
  titleEn: string;
  keyInsight: string;
  symbols: ZhuyinSymbolLesson[];
  blends: BlendCombo[];
}

export const STAGE0_ZHUYIN_FAMILIES: ZhuyinFamilyGroup[] = [
  {
    id: 'lips',
    titleEn: '1. Lip Sounds (ㄅ ㄆ ㄇ ㄈ)',
    keyInsight: 'All 4 start at the lips: ㄅ is a soft "b" (zero puff of air), while ㄆ is a strong puffed "p" (like holding a tissue that flutters).',
    symbols: [
      { symbol: 'ㄅ', pinyin: 'b', englishCue: 'b in "Boy" (soft, no puff)', speakSample: '巴', mouthTip: 'Close lips and release gently like a soft "b" with zero puff of air.' },
      { symbol: 'ㄆ', pinyin: 'p', englishCue: 'p in "Pin" (strong puff)', speakSample: '怕', mouthTip: 'Hold a tissue in front of your mouth—it should flutter!' },
      { symbol: 'ㄇ', pinyin: 'm', englishCue: 'm in "Mom"', speakSample: '媽', mouthTip: 'Identical to English "m".' },
      { symbol: 'ㄈ', pinyin: 'f', englishCue: 'f in "Fun"', speakSample: '發', mouthTip: 'Upper teeth lightly touch lower lip, just like English "f".' },
    ],
    blends: [
      { partsLabel: 'ㄅ + ㄚ', zhuyin: 'ㄅㄚ', pinyin: 'bā', sampleChar: '八', meaningEn: 'eight (8)' },
      { partsLabel: 'ㄅ + ㄨˋ', zhuyin: 'ㄅㄨˋ', pinyin: 'bù', sampleChar: '不', meaningEn: 'no / not' },
      { partsLabel: 'ㄆ + ㄧˊ', zhuyin: 'ㄆㄧˊ', pinyin: 'pí', sampleChar: '皮', meaningEn: 'skin / peel' },
      { partsLabel: 'ㄇ + ㄚ', zhuyin: 'ㄇㄚ', pinyin: 'mā', sampleChar: '媽', meaningEn: 'mom' },
      { partsLabel: 'ㄇ + ㄟˇ', zhuyin: 'ㄇㄟˇ', pinyin: 'měi', sampleChar: '美', meaningEn: 'beautiful / USA' },
      { partsLabel: 'ㄈ + ㄢˋ', zhuyin: 'ㄈㄢˋ', pinyin: 'fàn', sampleChar: '飯', meaningEn: 'rice / meal' },
    ],
  },
  {
    id: 'tip-throat',
    titleEn: '2. Tongue Tip & Throat (ㄉ ㄊ ㄋ ㄌ · ㄍ ㄎ ㄏ)',
    keyInsight: 'Same soft-vs-puffed rule: ㄉ/ㄊ = soft "d" vs puffed "t"; ㄍ/ㄎ = soft "g" vs puffed "k".',
    symbols: [
      { symbol: 'ㄉ', pinyin: 'd', englishCue: 'd in "Dog" (soft, no puff)', speakSample: '大', mouthTip: 'Tap behind upper teeth gently like a soft "d" with no air puff.' },
      { symbol: 'ㄊ', pinyin: 't', englishCue: 't in "Top" (strong puff)', speakSample: '他', mouthTip: 'Strong burst of air behind upper teeth.' },
      { symbol: 'ㄋ', pinyin: 'n', englishCue: 'n in "No"', speakSample: '那', mouthTip: 'Identical to English "n".' },
      { symbol: 'ㄌ', pinyin: 'l', englishCue: 'l in "Light"', speakSample: '拉', mouthTip: 'Clear light "l" at the front of the roof of the mouth.' },
      { symbol: 'ㄍ', pinyin: 'g', englishCue: 'g in "Go" (soft, no puff)', speakSample: '哥', mouthTip: 'Back of tongue, soft "g" release with zero puff.' },
      { symbol: 'ㄎ', pinyin: 'k', englishCue: 'k in "Kite" (strong puff)', speakSample: '可', mouthTip: 'Strong puff from the back of the mouth.' },
      { symbol: 'ㄏ', pinyin: 'h', englishCue: 'h in "Hot" (slight rasp)', speakSample: '喝', mouthTip: 'Slightly breathier than English "h".' },
    ],
    blends: [
      { partsLabel: 'ㄉ + ㄚˋ', zhuyin: 'ㄉㄚˋ', pinyin: 'dà', sampleChar: '大', meaningEn: 'big / large' },
      { partsLabel: 'ㄊ + ㄞˊ', zhuyin: 'ㄊㄞˊ', pinyin: 'tái', sampleChar: '臺', meaningEn: 'Taiwan' },
      { partsLabel: 'ㄋ + ㄧˇ', zhuyin: 'ㄋㄧˇ', pinyin: 'nǐ', sampleChar: '你', meaningEn: 'you' },
      { partsLabel: 'ㄌ + ㄞˊ', zhuyin: 'ㄌㄞˊ', pinyin: 'lái', sampleChar: '來', meaningEn: 'to come' },
      { partsLabel: 'ㄍ + ㄨㄛˊ', zhuyin: 'ㄍㄨㄛˊ', pinyin: 'guó', sampleChar: '國', meaningEn: 'country' },
      { partsLabel: 'ㄎ + ㄚ', zhuyin: 'ㄎㄚ', pinyin: 'kā', sampleChar: '咖', meaningEn: 'coffee (咖啡)' },
      { partsLabel: 'ㄏ + ㄠˇ', zhuyin: 'ㄏㄠˇ', pinyin: 'hǎo', sampleChar: '好', meaningEn: 'good / well' },
    ],
  },
  {
    id: 'palatals',
    titleEn: '3. Smiling "EE" Consonants (ㄐ ㄑ ㄒ)',
    keyInsight: 'Always pair with ㄧ (ee) or ㄩ (ü). Smile wide with your tongue tip tucked behind your bottom teeth!',
    symbols: [
      { symbol: 'ㄐ', pinyin: 'j', englishCue: 'j in "Jeep" (flat tongue)', speakSample: '機', mouthTip: 'Tongue tip down behind lower teeth; zero puff.' },
      { symbol: 'ㄑ', pinyin: 'q', englishCue: 'ch in "Cheese" (smiling)', speakSample: '七', mouthTip: 'Same smiling position as ㄐ, add a bright puff of air.' },
      { symbol: 'ㄒ', pinyin: 'x', englishCue: 'sh in "Sheep" (smiling)', speakSample: '西', mouthTip: 'Whispery "sh" while smiling wide.' },
    ],
    blends: [
      { partsLabel: 'ㄐ + ㄧㄚ', zhuyin: 'ㄐㄧㄚ', pinyin: 'jiā', sampleChar: '家', meaningEn: 'home / family' },
      { partsLabel: 'ㄐ + ㄧㄝˇ', zhuyin: 'ㄐㄧㄝˇ', pinyin: 'jiě', sampleChar: '姐', meaningEn: 'older sister (小姐)' },
      { partsLabel: 'ㄑ + ㄧㄥˇ', zhuyin: 'ㄑㄧㄥˇ', pinyin: 'qǐng', sampleChar: '請', meaningEn: 'please' },
      { partsLabel: 'ㄑ + ㄧㄢˊ', zhuyin: 'ㄑㄧㄢˊ', pinyin: 'qián', sampleChar: '錢', meaningEn: 'money' },
      { partsLabel: 'ㄒ + ㄧㄝˋ', zhuyin: 'ㄒㄧㄝˋ', pinyin: 'xiè', sampleChar: '謝', meaningEn: 'thank (謝謝)' },
      { partsLabel: 'ㄒ + ㄧㄠˇ', zhuyin: 'ㄒㄧㄠˇ', pinyin: 'xiǎo', sampleChar: '小', meaningEn: 'small / little' },
    ],
  },
  {
    id: 'sibilants',
    titleEn: '4. Curled vs. Flat Hiss (ㄓ ㄔ ㄕ ㄖ · ㄗ ㄘ ㄙ)',
    keyInsight: 'Taiwan tip: ㄓㄔㄕㄖ are only gently curled (soft "j/ch/sh/r"); ㄗㄘㄙ stay flat right behind your front teeth.',
    symbols: [
      { symbol: 'ㄓ', pinyin: 'zh', englishCue: 'j in "Jar" (no puff)', speakSample: '知', mouthTip: 'Tongue tip slightly raised behind tooth ridge.' },
      { symbol: 'ㄔ', pinyin: 'ch', englishCue: 'ch in "Chart" (puff)', speakSample: '吃', mouthTip: 'Same position as ㄓ with a clear puff of air.' },
      { symbol: 'ㄕ', pinyin: 'sh', englishCue: 'sh in "Shirt"', speakSample: '師', mouthTip: 'Soft warm "sh" sound.' },
      { symbol: 'ㄖ', pinyin: 'r', englishCue: 'r in "Run" (no lip round)', speakSample: '日', mouthTip: 'Keep lips relaxed; gentle buzz.' },
      { symbol: 'ㄗ', pinyin: 'z', englishCue: 'ds in "kiDs" (no puff)', speakSample: '資', mouthTip: 'Flat tongue behind upper teeth, no puff.' },
      { symbol: 'ㄘ', pinyin: 'c', englishCue: 'ts in "caTs" (puff)', speakSample: '次', mouthTip: 'Sharp "ts" with puff of air.' },
      { symbol: 'ㄙ', pinyin: 's', englishCue: 's in "Sun"', speakSample: '思', mouthTip: 'Crisp English "s".' },
    ],
    blends: [
      { partsLabel: 'ㄓ + ㄨㄥ', zhuyin: 'ㄓㄨㄥ', pinyin: 'zhōng', sampleChar: '中', meaningEn: 'center / Mandarin' },
      { partsLabel: 'ㄔ + ㄚˊ', zhuyin: 'ㄔㄚˊ', pinyin: 'chá', sampleChar: '茶', meaningEn: 'tea' },
      { partsLabel: 'ㄕ + ㄨㄛ', zhuyin: 'ㄕㄨㄛ', pinyin: 'shuō', sampleChar: '說', meaningEn: 'to speak' },
      { partsLabel: 'ㄖ + ㄜˋ', zhuyin: 'ㄖㄜˋ', pinyin: 'rè', sampleChar: '熱', meaningEn: 'hot' },
      { partsLabel: 'ㄗ + ㄠˇ', zhuyin: 'ㄗㄠˇ', pinyin: 'zǎo', sampleChar: '早', meaningEn: 'morning / early' },
      { partsLabel: 'ㄘ + ㄞˋ', zhuyin: 'ㄘㄞˋ', pinyin: 'cài', sampleChar: '菜', meaningEn: 'dish / vegetable' },
      { partsLabel: 'ㄙ + ㄢ', zhuyin: 'ㄙㄢ', pinyin: 'sān', sampleChar: '三', meaningEn: 'three (3)' },
    ],
  },
  {
    id: 'glides',
    titleEn: '5. The 3 Bridge Vowels / Medials (ㄧ ㄨ ㄩ)',
    keyInsight: 'Every Chinese syllable can glue a bridge vowel in the middle! ㄩ is the one vowel English lacks.',
    symbols: [
      { symbol: 'ㄧ', pinyin: 'i / y', englishCue: 'ee in "See"', speakSample: '一', mouthTip: 'Wide smile "ee".' },
      { symbol: 'ㄨ', pinyin: 'u / w', englishCue: 'oo in "Moon"', speakSample: '五', mouthTip: 'Tight round lips "oo".' },
      { symbol: 'ㄩ', pinyin: 'ü / yu', englishCue: 'Say "ee" with "oo" lips!', speakSample: '魚', mouthTip: 'Hold your tongue in "ee" and pucker your lips to "oo".' },
    ],
    blends: [
      { partsLabel: 'ㄊ + ㄧ + ㄢ', zhuyin: 'ㄊㄧㄢ', pinyin: 'tiān', sampleChar: '天', meaningEn: 'day / sky' },
      { partsLabel: 'ㄉ + ㄧ + ㄢˇ', zhuyin: 'ㄉㄧㄢˇ', pinyin: 'diǎn', sampleChar: '點', meaningEn: 'order / o’clock' },
      { partsLabel: 'ㄏ + ㄨ + ㄟˋ', zhuyin: 'ㄏㄨㄟˋ', pinyin: 'huì', sampleChar: '會', meaningEn: 'can / know how to' },
      { partsLabel: 'ㄉ + ㄨ + ㄛ', zhuyin: 'ㄉㄨㄛ', pinyin: 'duō', sampleChar: '多', meaningEn: 'many / how much' },
      { partsLabel: 'ㄌ + ㄩˋ', zhuyin: 'ㄌㄩˋ', pinyin: 'lǜ', sampleChar: '綠', meaningEn: 'green (綠茶)' },
      { partsLabel: 'ㄑ + ㄩˋ', zhuyin: 'ㄑㄩˋ', pinyin: 'qù', sampleChar: '去', meaningEn: 'to go' },
    ],
  },
  {
    id: 'finals',
    titleEn: '6. Vowels & Nasals (ㄚ ㄛ ㄜ ㄝ ㄞ ㄟ ㄠ ㄡ ㄢ ㄣ ㄤ ㄥ ㄦ)',
    keyInsight: 'Once you know these 13 endings, you can read EVERY Zhuyin word in Taiwan!',
    symbols: [
      { symbol: 'ㄚ', pinyin: 'a', englishCue: 'a in "fAther"', speakSample: '啊', mouthTip: 'Open wide "ah".' },
      { symbol: 'ㄛ', pinyin: 'o', englishCue: 'aw/wo in "more"', speakSample: '喔', mouthTip: 'Rounded lips "o".' },
      { symbol: 'ㄜ', pinyin: 'e', englishCue: 'uh in "bUrd/uh"', speakSample: '餓', mouthTip: 'Relaxed unrounded "uh".' },
      { symbol: 'ㄝ', pinyin: 'ê / ie', englishCue: 'e in "bEd"', speakSample: '耶', mouthTip: 'Always follows ㄧ or ㄩ (ye / yue).' },
      { symbol: 'ㄞ', pinyin: 'ai', englishCue: 'igh in "hIgh"', speakSample: '愛', mouthTip: 'Glide "ah → ee".' },
      { symbol: 'ㄟ', pinyin: 'ei', englishCue: 'ay in "hEy"', speakSample: '杯', mouthTip: 'Glide "eh → ee".' },
      { symbol: 'ㄠ', pinyin: 'ao', englishCue: 'ow in "cOw"', speakSample: '好', mouthTip: 'Glide "ah → oo".' },
      { symbol: 'ㄡ', pinyin: 'ou', englishCue: 'o in "gO"', speakSample: '走', mouthTip: 'Glide "oh → oo".' },
      { symbol: 'ㄢ', pinyin: 'an', englishCue: 'an in "fAn" / "on"', speakSample: '安', mouthTip: 'Crisp front "n" ending.' },
      { symbol: 'ㄣ', pinyin: 'en', englishCue: 'un in "fUn"', speakSample: '恩', mouthTip: 'Short "uhn".' },
      { symbol: 'ㄤ', pinyin: 'ang', englishCue: 'ong in "sOng"', speakSample: '湯', mouthTip: 'Open "ah" + back "ng".' },
      { symbol: 'ㄥ', pinyin: 'eng', englishCue: 'ung in "sUng"', speakSample: '冷', mouthTip: '"uh" + back "ng".' },
      { symbol: 'ㄦ', pinyin: 'er', englishCue: 'ar in "cAr"', speakSample: '二', mouthTip: 'Standalone syllable (二 èr = two).' },
    ],
    blends: [
      { partsLabel: 'ㄅ + ㄟ', zhuyin: 'ㄅㄟ', pinyin: 'bēi', sampleChar: '杯', meaningEn: 'cup (一杯茶)' },
      { partsLabel: 'ㄗ + ㄡˇ', zhuyin: 'ㄗㄡˇ', pinyin: 'zǒu', sampleChar: '走', meaningEn: 'to walk / go' },
      { partsLabel: 'ㄇ + ㄢˋ', zhuyin: 'ㄇㄢˋ', pinyin: 'màn', sampleChar: '慢', meaningEn: 'slow (慢一點)' },
      { partsLabel: 'ㄏ + ㄣˇ', zhuyin: 'ㄏㄣˇ', pinyin: 'hěn', sampleChar: '很', meaningEn: 'very' },
      { partsLabel: 'ㄊ + ㄤ', zhuyin: 'ㄊㄤ', pinyin: 'tāng', sampleChar: '湯', meaningEn: 'soup' },
      { partsLabel: 'ㄌ + ㄥˇ', zhuyin: 'ㄌㄥˇ', pinyin: 'lěng', sampleChar: '冷', meaningEn: 'cold' },
      { partsLabel: 'ㄦˋ (solo)', zhuyin: 'ㄦˋ', pinyin: 'èr', sampleChar: '二', meaningEn: 'two (2)' },
    ],
  },
];

export const STAGE0_SYLLABLE_BLENDS: BlendCombo[] = STAGE0_ZHUYIN_FAMILIES.flatMap((f) => f.blends);

export interface GrammarRuleCard {
  id: string;
  titleEn: string;
  ruleSummary: string;
  formula: string;
  exampleTrad: string;
  exampleZhuyin: string;
  examplePinyin: string;
  literalGloss: string;
  naturalEnglish: string;
  watchOutEn: string;
}

export const STAGE0_GRAMMAR_RULES: GrammarRuleCard[] = [
  { id: 'g1', titleEn: '1. Zero Conjugation, Plurals, or Tense Endings', ruleSummary: 'Verbs NEVER change for I/you/he/we or past/future. "喝" is always "喝"!', formula: 'Subject + Verb + Object', exampleTrad: '我喝茶。', exampleZhuyin: 'ㄨㄛˇ ㄏㄜ ㄔㄚˊ', examplePinyin: 'Wǒ hē chá.', literalGloss: 'I · drink · tea', naturalEnglish: 'I drink tea / I am drinking tea.', watchOutEn: 'No "a / the" articles either!' },
  { id: 'g2', titleEn: '2. Time & Place Go BEFORE the Verb', ruleSummary: 'English puts time/place at the end ("drink tea in Taipei tomorrow"). Mandarin puts them right after the subject!', formula: 'Subject + Time + 在 Place + Verb + Object', exampleTrad: '我明天在臺北喝茶。', exampleZhuyin: 'ㄨㄛˇ ㄇㄧㄥˊ ㄊㄧㄢ ㄗㄞˋ ㄊㄞˊ ㄅㄟˇ ㄏㄜ ㄔㄚˊ', examplePinyin: 'Wǒ míngtiān zài Táiběi hē chá.', literalGloss: 'I · tomorrow · at Taipei · drink · tea', naturalEnglish: 'I will drink tea in Taipei tomorrow.', watchOutEn: 'Never say "我喝茶在臺北"!' },
  { id: 'g3', titleEn: '3. NEVER Put 是 (shì) Before an Adjective!', ruleSummary: 'The #1 Day-1 English mistake is saying "我是好" ("I am good"). Use 很 (hěn) as a neutral linker instead.', formula: 'Subject + 很 + Adjective', exampleTrad: '我很好。', exampleZhuyin: 'ㄨㄛˇ ㄏㄣˇ ㄏㄠˇ', examplePinyin: 'Wǒ hěn hǎo.', literalGloss: 'I · (linker) · good', naturalEnglish: 'I am good / I’m fine.', watchOutEn: 'Use 是 ONLY to link two nouns: 我是美國人 (I am American).' },
  { id: 'g4', titleEn: '4. Instant Yes/No Questions (Just Add 嗎)', ruleSummary: 'Never invert word order like English "Are you… / Do you…". Keep the statement identical and tack 嗎 onto the end.', formula: 'Statement + 嗎？', exampleTrad: '你會說中文嗎？', exampleZhuyin: 'ㄋㄧˇ ㄏㄨㄟˋ ㄕㄨㄛ ㄓㄨㄥ ㄨㄣˊ ˙ㄇㄚ', examplePinyin: 'Nǐ huì shuō Zhōngwén ma?', literalGloss: 'You · can · speak · Mandarin · [?] ', naturalEnglish: 'Can you speak Mandarin?', watchOutEn: 'Or use V-不-V: 你要不要茶？ (Do you want tea or not?)' },
  { id: 'g5', titleEn: '5. Measure Words (Just Like "a CUP of tea")', ruleSummary: 'Between a number (or 這/那) and a noun, Mandarin always inserts a counter word. When unsure, 個 (ge) works almost everywhere!', formula: 'Number + Measure Word + Noun', exampleTrad: '我要一杯茶。', exampleZhuyin: 'ㄨㄛˇ ㄧㄠˋ ㄧˋ ㄅㄟ ㄔㄚˊ', examplePinyin: 'Wǒ yào yì bēi chá.', literalGloss: 'I · want · one · cup-of · tea', naturalEnglish: 'I want a cup of tea.', watchOutEn: '個 (general), 杯 (cups), 碗 (bowls), 支 (phones/pens in Taiwan).' },
];

export interface SentenceBuilderPuzzle {
  id: string;
  englishPrompt: string;
  tiles: { text: string; gloss: string }[];
  correctOrder: string[];
  explanationEn: string;
}

export const STAGE0_SENTENCE_PUZZLES: SentenceBuilderPuzzle[] = [
  { id: 'sp1', englishPrompt: 'I am doing well. (Remember: no 是 before adjectives!)', tiles: [{ text: '很', gloss: '(linker)' }, { text: '好', gloss: 'good' }, { text: '我', gloss: 'I' }], correctOrder: ['我', '很', '好'], explanationEn: 'Subject (我) + 很 + Adjective (好). Never insert 是!' },
  { id: 'sp2', englishPrompt: 'Can you speak Mandarin?', tiles: [{ text: '說', gloss: 'speak' }, { text: '嗎', gloss: '[?]' }, { text: '你', gloss: 'you' }, { text: '中文', gloss: 'Mandarin' }, { text: '會', gloss: 'can' }], correctOrder: ['你', '會', '說', '中文', '嗎'], explanationEn: 'Keep statement order (你會說中文) and add 嗎 at the end.' },
  { id: 'sp3', englishPrompt: 'I want one cup of tea.', tiles: [{ text: '一杯', gloss: 'one cup' }, { text: '茶', gloss: 'tea' }, { text: '我', gloss: 'I' }, { text: '要', gloss: 'want' }], correctOrder: ['我', '要', '一杯', '茶'], explanationEn: 'Subject + Verb + Number/Measure Word (一杯) + Noun (茶).' },
  { id: 'sp4', englishPrompt: 'I am going to Taipei tomorrow.', tiles: [{ text: '去', gloss: 'go' }, { text: '明天', gloss: 'tomorrow' }, { text: '臺北', gloss: 'Taipei' }, { text: '我', gloss: 'I' }], correctOrder: ['我', '明天', '去', '臺北'], explanationEn: 'Time (明天) comes BEFORE the verb (去)!' },
];

export interface BasicStrokeLesson {
  id: string;
  glyph: string;
  nameZh: string;
  nameEn: string;
  cue: string;
  sampleChar: string;
  guidePoints: { x: number; y: number }[];
}

export const STAGE0_BASIC_STROKES: BasicStrokeLesson[] = [
  { id: 'heng', glyph: '一', nameZh: '橫 (héng)', nameEn: 'Horizontal', cue: 'Draw smoothly left → right (slight gentle upward tilt).', sampleChar: '一 / 三', guidePoints: [{ x: 0.18, y: 0.52 }, { x: 0.5, y: 0.50 }, { x: 0.82, y: 0.48 }] },
  { id: 'shu', glyph: '丨', nameZh: '豎 (shù)', nameEn: 'Vertical', cue: 'Draw straight top → bottom with steady pressure.', sampleChar: '十 / 中', guidePoints: [{ x: 0.50, y: 0.16 }, { x: 0.50, y: 0.50 }, { x: 0.50, y: 0.84 }] },
  { id: 'pie', glyph: '丿', nameZh: '撇 (piě)', nameEn: 'Left Sweep', cue: 'Start upper-right, curve down-left, and lift smoothly at the tip.', sampleChar: '人 / 大', guidePoints: [{ x: 0.62, y: 0.18 }, { x: 0.50, y: 0.54 }, { x: 0.24, y: 0.84 }] },
  { id: 'na', glyph: '㇏', nameZh: '捺 (nà)', nameEn: 'Right Press', cue: 'Start upper-left, glide down-right, press firmer, then release right.', sampleChar: '人 / 木', guidePoints: [{ x: 0.28, y: 0.22 }, { x: 0.54, y: 0.62 }, { x: 0.82, y: 0.82 }] },
  { id: 'dian', glyph: '丶', nameZh: '點 (diǎn)', nameEn: 'Dot', cue: 'Short teardrop stroke: touch lightly, press down-right, and stop.', sampleChar: '六 / 心', guidePoints: [{ x: 0.42, y: 0.38 }, { x: 0.52, y: 0.52 }, { x: 0.58, y: 0.62 }] },
  { id: 'ti', glyph: '㇀', nameZh: '提 (tí)', nameEn: 'Upward Flick', cue: 'Press at lower-left and flick briskly upward to the right.', sampleChar: '我 / 氵', guidePoints: [{ x: 0.26, y: 0.68 }, { x: 0.50, y: 0.52 }, { x: 0.76, y: 0.34 }] },
  { id: 'hengzhe', glyph: '𠃍', nameZh: '橫折 (héngzhé)', nameEn: 'Corner Turn', cue: 'ONE continuous stroke: go right, pause at the corner, then pull straight down!', sampleChar: '口 / 日', guidePoints: [{ x: 0.22, y: 0.26 }, { x: 0.74, y: 0.26 }, { x: 0.74, y: 0.80 }] },
  { id: 'shugou', glyph: '亅', nameZh: '豎鉤 (shùgōu)', nameEn: 'Vertical Hook', cue: 'Draw straight down, pause at the bottom, and flick a short hook up-left.', sampleChar: '小 / 水', guidePoints: [{ x: 0.54, y: 0.16 }, { x: 0.54, y: 0.80 }, { x: 0.36, y: 0.68 }] },
];

export const STAGE0_STROKE_RULES = [
  '1. Top before bottom (like 三 or 臺).',
  '2. Left before right (like 你 or 請).',
  '3. Horizontal before vertical when crossing (like 十 or 大).',
  '4. Outside frame first, fill inside, CLOSE the bottom last (like 日 or 國).',
  '5. Center spine first on symmetric shapes (like 水 or 小).',
  '6. A corner bend (橫折 𠃍) is ONE continuous stroke—don’t lift the pen!',
];

export const STAGE0_RADICAL_LEGEND = [
  { radical: '氵', meaning: 'Water / liquid', examples: '海 (ocean), 湯 (soup), 洗 (wash)' },
  { radical: '口', meaning: 'Mouth / eating & talking', examples: '喝 (drink), 問 (ask), 嗎 (?)' },
  { radical: '言', meaning: 'Words / polite speech', examples: '請 (please), 說 (speak), 話 (words)' },
  { radical: '木', meaning: 'Tree / wood', examples: '林 (woods), 桌 (table), 杯 (cup)' },
  { radical: '日 / 月', meaning: 'Sun / moon / time', examples: '明 (bright/tomorrow), 早 (morning)' },
];

export interface RadicalQuizItem {
  id: string;
  char: string;
  zhuyin: string;
  pinyin: string;
  meaningEn: string;
  radical: string;
  breakdown: string;
  options: string[];
  correctIdx: number;
  explain: string;
}

export const STAGE0_RADICAL_QUIZ: RadicalQuizItem[] = [
  {
    id: 'rq1',
    char: '河',
    zhuyin: 'ㄏㄜˊ',
    pinyin: 'hé',
    meaningEn: 'river',
    radical: '氵 (3 drops of water)',
    breakdown: '氵 (water) + 可 (sound clue)',
    options: ['wooden chair', 'river', 'loud speech'],
    correctIdx: 1,
    explain: 'The 3-drop water radical 氵 on the left signals water—just like 海 (ocean), 湯 (soup), and 洗 (wash)!',
  },
  {
    id: 'rq2',
    char: '吃',
    zhuyin: 'ㄔ',
    pinyin: 'chī',
    meaningEn: 'to eat',
    radical: '口 (mouth)',
    breakdown: '口 (mouth) + 乞',
    options: ['to eat', 'cold snow', 'fast train'],
    correctIdx: 0,
    explain: 'The mouth radical 口 on the left signals an action done with your mouth—just like 喝 (hē, drink) and 嗎 (question particle)!',
  },
  {
    id: 'rq3',
    char: '謝',
    zhuyin: 'ㄒㄧㄝˋ',
    pinyin: 'xiè',
    meaningEn: 'to thank (謝謝)',
    radical: '言 (words / speech)',
    breakdown: '言 (speech) + 射 (shè sound clue)',
    options: ['hot fire', 'mountain', 'to thank (polite words)'],
    correctIdx: 2,
    explain: '言 (speech) tells you it involves polite words, while 射 hints at the sound! Over 80% of Chinese characters pair meaning + sound like this.',
  },
  {
    id: 'rq4',
    char: '森',
    zhuyin: 'ㄙㄣ',
    pinyin: 'sēn',
    meaningEn: 'dense forest',
    radical: '木 + 木 + 木 (three trees)',
    breakdown: 'Three 木 (tree) blocks stacked together',
    options: ['heavy stone', 'dense forest', 'bright morning'],
    correctIdx: 1,
    explain: 'One 木 is a tree, two 木 (林) are woods, and three 木 (森 sēn) mean a dense forest (森林 sēnlín)!',
  },
];

export const STAGE0_FIRST_10_PHRASES = [
  { trad: '你好', zhuyin: 'ㄋㄧˇ ㄏㄠˇ', pinyin: 'nǐ hǎo (spoken: ní hǎo)', english: 'Hello', gloss: 'you + good' },
  { trad: '謝謝', zhuyin: 'ㄒㄧㄝˋ ˙ㄒㄧㄝ', pinyin: 'xièxie', english: 'Thank you', gloss: 'thank + thank' },
  { trad: '不好意思', zhuyin: 'ㄅㄨˋ ㄏㄠˇ ㄧˋ ˙ㄙ', pinyin: 'bù hǎo yìsi', english: 'Excuse me / sorry (Taiwan #1 polite phrase!)', gloss: 'not + good + meaning' },
  { trad: '請問', zhuyin: 'ㄑㄧㄥˇ ㄨㄣˋ', pinyin: 'qǐngwèn', english: 'May I ask…', gloss: 'please + ask' },
  { trad: '這個 / 那個', zhuyin: 'ㄓㄜˋ ˙ㄍㄜ / ㄋㄚˋ ˙ㄍㄜ', pinyin: 'zhège / nàge', english: 'This one / That one', gloss: 'this-item / that-item' },
  { trad: '多少錢？', zhuyin: 'ㄉㄨㄛ ㄕㄠˇ ㄑㄧㄢˊ', pinyin: 'duōshǎo qián?', english: 'How much money?', gloss: 'many-few + money' },
  { trad: '我要這個', zhuyin: 'ㄨㄛˇ ㄧㄠˋ ㄓㄜˋ ˙ㄍㄜ', pinyin: 'wǒ yào zhège', english: 'I want this one', gloss: 'I + want + this-one' },
  { trad: '好 / 不要', zhuyin: 'ㄏㄠˇ / ㄅㄨˋ ㄧㄠˋ', pinyin: 'hǎo / bú yào', english: 'Okay / No thanks (don’t want)', gloss: 'good / not-want' },
  { trad: '聽不懂', zhuyin: 'ㄊㄧㄥ ㄅㄨˋ ㄉㄨㄥˇ', pinyin: 'tīng bù dǒng', english: 'I don’t understand (by ear)', gloss: 'listen + not + understand' },
  { trad: '再見', zhuyin: 'ㄗㄞˋ ㄐㄧㄢˋ', pinyin: 'zàijiàn', english: 'Goodbye', gloss: 'again + see' },
];

export const STAGE0_CAFE_ROLEPLAY = [
  { clerkZh: '你好！請問要點什麼？', clerkPinyin: 'Nǐ hǎo! Qǐngwèn yào diǎn shénme?', clerkEn: 'Hello! What would you like to order?', options: [{ text: '再見！', pinyin: 'Zàijiàn!', en: 'Goodbye!' }, { text: '我要一杯茶，謝謝。', pinyin: 'Wǒ yào yì bēi chá, xièxie.', en: 'I want a cup of tea, thanks.' }, { text: '聽不懂。', pinyin: 'Tīng bù dǒng.', en: 'I don’t understand.' }], correctIdx: 1 },
  { clerkZh: '好，一共五十塊。', clerkPinyin: 'Hǎo, yígòng wǔshí kuài.', clerkEn: 'Okay, that’s NT$50 total.', options: [{ text: '謝謝！', pinyin: 'Xièxie!', en: 'Thank you!' }, { text: '請問洗手間在哪裡？', pinyin: 'Qǐngwèn xǐshǒujiān zài nǎlǐ?', en: 'Where is the bathroom?' }, { text: '不要辣。', pinyin: 'Búyào là.', en: 'Not spicy.' }], correctIdx: 0 },
  { clerkZh: '需要袋子嗎？', clerkPinyin: 'Xūyào dàizi ma?', clerkEn: 'Do you need a bag?', options: [{ text: '請問？', pinyin: 'Qǐngwèn?', en: 'May I ask?' }, { text: '多少錢？', pinyin: 'Duōshǎo qián?', en: 'How much?' }, { text: '不用，謝謝！', pinyin: 'Búyòng, xièxie!', en: 'No need, thanks!' }], correctIdx: 2 },
];
