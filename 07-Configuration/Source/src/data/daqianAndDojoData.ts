/**
 * FormosaStudio (FORM) — Taiwan DaQian (大千式) 8-Stage Typing Dojo, 5-World Skill Tree & 3-Stage Match Arena Data
 * Traces to: FORM-REQ-0017, FORM-REQ-0001, FORM-REQ-0002, FORM-DEP-TPA-003
 */

export interface DaqianKeyCap {
  key: string;       // Physical keyboard character (lowercase or space)
  displayKey: string;// Uppercase label on keycap
  zhuyin: string;    // Taiwan DaQian symbol or tone mark
  category: 'initial' | 'medial' | 'rhyme' | 'tone';
  fingerHint: string;
}

export interface DaqianDojoPrompt {
  hanzi: string;
  zhuyin: string;
  english: string;
  expectedKeys: string; // Exact DaQian key sequence (with ' ' for Tone 1)
}

export interface DaqianDojoStage {
  stageNumber: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
  id: string;
  titleZh: string;
  titleEn: string;
  focusDescription: string;
  blindKeycapsRecommended: boolean;
  targetWpm: number;
  prompts: DaqianDojoPrompt[];
}

export interface SkillTreeNode {
  id: string;
  worldNumber: 1 | 2 | 3 | 4 | 5;
  worldTitleZh: string;
  worldTitleEn: string;
  nodeOrder: number;
  titleZh: string;
  titleEn: string;
  tocflBand: string;
  sampleWords: { hanzi: string; zhuyin: string; english: string }[];
}

export interface MatchArenaPair {
  id: string;
  stage: 1 | 2 | 3;
  leftPrompt: string;
  rightMatch: string;
  hintEn: string;
}

/**
 * Standard 4-Row Taiwan DaQian (大千式) Keyboard Layout + Spacebar (Tone 1).
 */
export const DAQIAN_KEYBOARD_ROWS: DaqianKeyCap[][] = [
  [
    { key: '1', displayKey: '1', zhuyin: 'ㄅ', category: 'initial', fingerHint: 'L-Pinky' },
    { key: '2', displayKey: '2', zhuyin: 'ㄉ', category: 'initial', fingerHint: 'L-Ring' },
    { key: '3', displayKey: '3', zhuyin: 'ˇ', category: 'tone', fingerHint: 'L-Middle (Tone 3)' },
    { key: '4', displayKey: '4', zhuyin: 'ˋ', category: 'tone', fingerHint: 'L-Index (Tone 4)' },
    { key: '5', displayKey: '5', zhuyin: 'ㄓ', category: 'initial', fingerHint: 'L-Index' },
    { key: '6', displayKey: '6', zhuyin: 'ˊ', category: 'tone', fingerHint: 'R-Index (Tone 2)' },
    { key: '7', displayKey: '7', zhuyin: '˙', category: 'tone', fingerHint: 'R-Index (Neutral)' },
    { key: '8', displayKey: '8', zhuyin: 'ㄚ', category: 'rhyme', fingerHint: 'R-Middle' },
    { key: '9', displayKey: '9', zhuyin: 'ㄞ', category: 'rhyme', fingerHint: 'R-Ring' },
    { key: '0', displayKey: '0', zhuyin: 'ㄢ', category: 'rhyme', fingerHint: 'R-Pinky' },
    { key: '-', displayKey: '-', zhuyin: 'ㄦ', category: 'rhyme', fingerHint: 'R-Pinky' },
  ],
  [
    { key: 'q', displayKey: 'Q', zhuyin: 'ㄆ', category: 'initial', fingerHint: 'L-Pinky' },
    { key: 'w', displayKey: 'W', zhuyin: 'ㄊ', category: 'initial', fingerHint: 'L-Ring' },
    { key: 'e', displayKey: 'E', zhuyin: 'ㄍ', category: 'initial', fingerHint: 'L-Middle' },
    { key: 'r', displayKey: 'R', zhuyin: 'ㄐ', category: 'initial', fingerHint: 'L-Index' },
    { key: 't', displayKey: 'T', zhuyin: 'ㄔ', category: 'initial', fingerHint: 'L-Index' },
    { key: 'y', displayKey: 'Y', zhuyin: 'ㄗ', category: 'initial', fingerHint: 'R-Index' },
    { key: 'u', displayKey: 'U', zhuyin: 'ㄧ', category: 'medial', fingerHint: 'R-Index' },
    { key: 'i', displayKey: 'I', zhuyin: 'ㄛ', category: 'rhyme', fingerHint: 'R-Middle' },
    { key: 'o', displayKey: 'O', zhuyin: 'ㄟ', category: 'rhyme', fingerHint: 'R-Ring' },
    { key: 'p', displayKey: 'P', zhuyin: 'ㄣ', category: 'rhyme', fingerHint: 'R-Pinky' },
  ],
  [
    { key: 'a', displayKey: 'A', zhuyin: 'ㄇ', category: 'initial', fingerHint: 'L-Pinky' },
    { key: 's', displayKey: 'S', zhuyin: 'ㄋ', category: 'initial', fingerHint: 'L-Ring' },
    { key: 'd', displayKey: 'D', zhuyin: 'ㄎ', category: 'initial', fingerHint: 'L-Middle' },
    { key: 'f', displayKey: 'F', zhuyin: 'ㄑ', category: 'initial', fingerHint: 'L-Index' },
    { key: 'g', displayKey: 'G', zhuyin: 'ㄕ', category: 'initial', fingerHint: 'L-Index' },
    { key: 'h', displayKey: 'H', zhuyin: 'ㄘ', category: 'initial', fingerHint: 'R-Index' },
    { key: 'j', displayKey: 'J', zhuyin: 'ㄨ', category: 'medial', fingerHint: 'R-Index' },
    { key: 'k', displayKey: 'K', zhuyin: 'ㄜ', category: 'rhyme', fingerHint: 'R-Middle' },
    { key: 'l', displayKey: 'L', zhuyin: 'ㄠ', category: 'rhyme', fingerHint: 'R-Ring' },
    { key: ';', displayKey: ';', zhuyin: 'ㄤ', category: 'rhyme', fingerHint: 'R-Pinky' },
  ],
  [
    { key: 'z', displayKey: 'Z', zhuyin: 'ㄈ', category: 'initial', fingerHint: 'L-Pinky' },
    { key: 'x', displayKey: 'X', zhuyin: 'ㄌ', category: 'initial', fingerHint: 'L-Ring' },
    { key: 'c', displayKey: 'C', zhuyin: 'ㄏ', category: 'initial', fingerHint: 'L-Middle' },
    { key: 'v', displayKey: 'V', zhuyin: 'ㄒ', category: 'initial', fingerHint: 'L-Index' },
    { key: 'b', displayKey: 'B', zhuyin: 'ㄖ', category: 'initial', fingerHint: 'L-Index' },
    { key: 'n', displayKey: 'N', zhuyin: 'ㄙ', category: 'initial', fingerHint: 'R-Index' },
    { key: 'm', displayKey: 'M', zhuyin: 'ㄩ', category: 'medial', fingerHint: 'R-Index' },
    { key: ',', displayKey: ',', zhuyin: 'ㄝ', category: 'rhyme', fingerHint: 'R-Middle' },
    { key: '.', displayKey: '.', zhuyin: 'ㄡ', category: 'rhyme', fingerHint: 'R-Ring' },
    { key: '/', displayKey: '/', zhuyin: 'ㄥ', category: 'rhyme', fingerHint: 'R-Pinky' },
  ],
];

export const ZHUYIN_TO_DAQIAN_KEY: Record<string, string> = {
  ㄅ: '1', ㄆ: 'q', ㄇ: 'a', ㄈ: 'z',
  ㄉ: '2', ㄊ: 'w', ㄋ: 's', ㄌ: 'x',
  ㄍ: 'e', ㄎ: 'd', ㄏ: 'c',
  ㄐ: 'r', ㄑ: 'f', ㄒ: 'v',
  ㄓ: '5', ㄔ: 't', ㄕ: 'g', ㄖ: 'b',
  ㄗ: 'y', ㄘ: 'h', ㄙ: 'n',
  ㄧ: 'u', ㄨ: 'j', ㄩ: 'm',
  ㄚ: '8', ㄛ: 'i', ㄜ: 'k', ㄝ: ',',
  ㄞ: '9', ㄟ: 'o', ㄠ: 'l', ㄡ: '.',
  ㄢ: '0', ㄣ: 'p', ㄤ: ';', ㄥ: '/',
  ㄦ: '-',
  'ˉ': ' ', 'ˊ': '6', 'ˇ': '3', 'ˋ': '4', '˙': '7',
};

/**
 * Converts a multi-syllable or single-syllable Taiwan MOE Zhuyin string into its exact
 * Taiwan DaQian (大千式) keystroke sequence: Initial -> Medial -> Rhyme -> Tone Key (Tone 1 = Space ' ').
 */
export function zhuyinToDaqianKeySequence(zhuyinPhrase: string): string {
  const syllables = zhuyinPhrase
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  return syllables
    .map((syl) => {
      let toneKey = ' '; // Default Tone 1 = Space
      let clean = syl;
      if (clean.startsWith('˙') || clean.endsWith('˙')) {
        toneKey = '7';
        clean = clean.replace(/˙/g, '');
      } else if (clean.endsWith('ˊ')) {
        toneKey = '6';
        clean = clean.slice(0, -1);
      } else if (clean.endsWith('ˇ')) {
        toneKey = '3';
        clean = clean.slice(0, -1);
      } else if (clean.endsWith('ˋ')) {
        toneKey = '4';
        clean = clean.slice(0, -1);
      } else if (clean.endsWith('ˉ')) {
        toneKey = ' ';
        clean = clean.slice(0, -1);
      }

      let keys = '';
      for (const ch of Array.from(clean)) {
        const mapped = ZHUYIN_TO_DAQIAN_KEY[ch];
        if (mapped) keys += mapped;
      }
      return keys + toneKey;
    })
    .join('');
}

/**
 * 8-Stage Taiwan DaQian (大千式) Touch-Typing Dojo Curriculum (FORM-REQ-0017).
 */
export const DAQIAN_DOJO_STAGES: DaqianDojoStage[] = [
  {
    stageNumber: 1,
    id: 'dojo-stage-1',
    titleZh: '第一階：左手雙唇與舌尖聲母',
    titleEn: 'Stage 1: Left-Hand Labial & Alveolar Initials (ㄅㄆㄇㄈㄉㄊㄋㄌ)',
    focusDescription: 'Build vertical column muscle memory on 1/Q/A/Z (ㄅㄆㄇㄈ) and 2/W/S/X (ㄉㄊㄋㄌ).',
    blindKeycapsRecommended: false,
    targetWpm: 18,
    prompts: [
      { hanzi: '八', zhuyin: 'ㄅㄚ', english: 'eight', expectedKeys: zhuyinToDaqianKeySequence('ㄅㄚ') },
      { hanzi: '媽', zhuyin: 'ㄇㄚ', english: 'mother', expectedKeys: zhuyinToDaqianKeySequence('ㄇㄚ') },
      { hanzi: '發', zhuyin: 'ㄈㄚ', english: 'to send / issue', expectedKeys: zhuyinToDaqianKeySequence('ㄈㄚ') },
      { hanzi: '大', zhuyin: 'ㄉㄚˋ', english: 'big', expectedKeys: zhuyinToDaqianKeySequence('ㄉㄚˋ') },
      { hanzi: '他', zhuyin: 'ㄊㄚ', english: 'he / him', expectedKeys: zhuyinToDaqianKeySequence('ㄊㄚ') },
      { hanzi: '拿', zhuyin: 'ㄋㄚˊ', english: 'to hold / take', expectedKeys: zhuyinToDaqianKeySequence('ㄋㄚˊ') },
    ],
  },
  {
    stageNumber: 2,
    id: 'dojo-stage-2',
    titleZh: '第二階：舌根、舌面與捲舌/平舌聲母',
    titleEn: 'Stage 2: Velar, Palatal & Retroflex/Sibilant Initials (ㄍㄎㄏㄐㄑㄒㄓㄔㄕㄖㄗㄘㄙ)',
    focusDescription: 'Master middle columns E/D/C (ㄍㄎㄏ), R/F/V (ㄐㄑㄒ), 5/T/G/B (ㄓㄔㄕㄖ), and Y/H/N (ㄗㄘㄙ).',
    blindKeycapsRecommended: false,
    targetWpm: 20,
    prompts: [
      { hanzi: '咖啡', zhuyin: 'ㄎㄚ ㄈㄟ', english: 'coffee', expectedKeys: zhuyinToDaqianKeySequence('ㄎㄚ ㄈㄟ') },
      { hanzi: '喝茶', zhuyin: 'ㄏㄜ ㄔㄚˊ', english: 'drink tea', expectedKeys: zhuyinToDaqianKeySequence('ㄏㄜ ㄔㄚˊ') },
      { hanzi: '知道', zhuyin: 'ㄓ ㄉㄠˋ', english: 'to know', expectedKeys: zhuyinToDaqianKeySequence('ㄓ ㄉㄠˋ') },
      { hanzi: '自己', zhuyin: 'ㄗˋ ㄐㄧˇ', english: 'oneself', expectedKeys: zhuyinToDaqianKeySequence('ㄗˋ ㄐㄧˇ') },
      { hanzi: '休息', zhuyin: 'ㄒㄧㄡ ˙ㄒㄧ', english: 'to rest (Taiwan MOE)', expectedKeys: zhuyinToDaqianKeySequence('ㄒㄧㄡ ˙ㄒㄧ') },
    ],
  },
  {
    stageNumber: 3,
    id: 'dojo-stage-3',
    titleZh: '第三階：介音 (ㄧㄨㄩ) 與單韻母 (ㄚㄛㄜㄝ)',
    titleEn: 'Stage 3: Medials (ㄧㄨㄩ on U/J/M) & Simple Rhymes (8/I/K/,)',
    focusDescription: 'Combine right-index medials U/J/M (ㄧㄨㄩ) with right-middle rhymes 8/I/K/, (ㄚㄛㄜㄝ).',
    blindKeycapsRecommended: false,
    targetWpm: 22,
    prompts: [
      { hanzi: '謝謝', zhuyin: 'ㄒㄧㄝˋ ˙ㄒㄧㄝ', english: 'thank you', expectedKeys: zhuyinToDaqianKeySequence('ㄒㄧㄝˋ ˙ㄒㄧㄝ') },
      { hanzi: '國家', zhuyin: 'ㄍㄨㄛˊ ㄐㄧㄚ', english: 'country', expectedKeys: zhuyinToDaqianKeySequence('ㄍㄨㄛˊ ㄐㄧㄚ') },
      { hanzi: '捷運', zhuyin: 'ㄐㄧㄝˊ ㄩㄣˋ', english: 'MRT metro', expectedKeys: zhuyinToDaqianKeySequence('ㄐㄧㄝˊ ㄩㄣˋ') },
      { hanzi: '西瓜', zhuyin: 'ㄒㄧ ㄍㄨㄚ', english: 'watermelon', expectedKeys: zhuyinToDaqianKeySequence('ㄒㄧ ㄍㄨㄚ') },
    ],
  },
  {
    stageNumber: 4,
    id: 'dojo-stage-4',
    titleZh: '第四階：複韻母 (ㄞㄟㄠㄡ) 與鼻韻母 (ㄢㄣㄤㄥ)',
    titleEn: 'Stage 4: Diphthongs (9/O/L/.) & Nasal Rhymes (0/P/;/and /)',
    focusDescription: 'Right ring finger (ㄞㄟㄠㄡ on 9/O/L/.) vs. right pinky finger (ㄢㄣㄤㄥ on 0/P/;/and /).',
    blindKeycapsRecommended: false,
    targetWpm: 25,
    prompts: [
      { hanzi: '臺灣', zhuyin: 'ㄊㄞˊ ㄨㄢ', english: 'Taiwan', expectedKeys: zhuyinToDaqianKeySequence('ㄊㄞˊ ㄨㄢ') },
      { hanzi: '臺北', zhuyin: 'ㄊㄞˊ ㄅㄟˇ', english: 'Taipei', expectedKeys: zhuyinToDaqianKeySequence('ㄊㄞˊ ㄅㄟˇ') },
      { hanzi: '牛肉麵', zhuyin: 'ㄋㄧㄡˊ ㄖㄡˋ ㄇㄧㄢˋ', english: 'beef noodle soup', expectedKeys: zhuyinToDaqianKeySequence('ㄋㄧㄡˊ ㄖㄡˋ ㄇㄧㄢˋ') },
      { hanzi: '幫忙', zhuyin: 'ㄅㄤ ㄇㄤˊ', english: 'to help', expectedKeys: zhuyinToDaqianKeySequence('ㄅㄤ ㄇㄤˊ') },
    ],
  },
  {
    stageNumber: 5,
    id: 'dojo-stage-5',
    titleZh: '第五階：五聲調鍵反射訓練 (Space/6/3/4/7)',
    titleEn: 'Stage 5: Five-Tone Reflex Drill (Space=1, 6=2, 3=3, 4=4, 7=Neutral)',
    focusDescription: 'Lock in automatic tone termination at the end of every syllable.',
    blindKeycapsRecommended: false,
    targetWpm: 28,
    prompts: [
      { hanzi: '媽媽騎馬', zhuyin: 'ㄇㄚ ˙ㄇㄚ ㄑㄧˊ ㄇㄚˇ', english: 'Mom rides a horse', expectedKeys: zhuyinToDaqianKeySequence('ㄇㄚ ˙ㄇㄚ ㄑㄧˊ ㄇㄚˇ') },
      { hanzi: '買賣', zhuyin: 'ㄇㄞˇ ㄇㄞˋ', english: 'buying and selling', expectedKeys: zhuyinToDaqianKeySequence('ㄇㄞˇ ㄇㄞˋ') },
      { hanzi: '珍珠奶茶', zhuyin: 'ㄓㄣ ㄓㄨ ㄋㄞˇ ㄔㄚˊ', english: 'bubble milk tea', expectedKeys: zhuyinToDaqianKeySequence('ㄓㄣ ㄓㄨ ㄋㄞˇ ㄔㄚˊ') },
      { hanzi: '悠遊卡', zhuyin: 'ㄧㄡ ㄧㄡˊ ㄎㄚˇ', english: 'EasyCard', expectedKeys: zhuyinToDaqianKeySequence('ㄧㄡ ㄧㄡˊ ㄎㄚˇ') },
    ],
  },
  {
    stageNumber: 6,
    id: 'dojo-stage-6',
    titleZh: '第六階：教育部國語一字多音與兩岸異讀',
    titleEn: 'Stage 6: Taiwan MOE Polyphones (破音字) & Cross-Strait Standards',
    focusDescription: 'Type authentic Taiwan MOE pronunciations (垃圾 ㄌㄜˋ ㄙㄜˋ, 星期 ㄒㄧㄥ ㄑㄧˊ, 和 ㄏㄢˋ).',
    blindKeycapsRecommended: false,
    targetWpm: 30,
    prompts: [
      { hanzi: '垃圾車', zhuyin: 'ㄌㄜˋ ㄙㄜˋ ㄔㄜ', english: 'garbage truck (Taiwan ㄌㄜˋ ㄙㄜˋ)', expectedKeys: zhuyinToDaqianKeySequence('ㄌㄜˋ ㄙㄜˋ ㄔㄜ') },
      { hanzi: '星期五', zhuyin: 'ㄒㄧㄥ ㄑㄧˊ ㄨˇ', english: 'Friday (Taiwan ㄑㄧˊ)', expectedKeys: zhuyinToDaqianKeySequence('ㄒㄧㄥ ㄑㄧˊ ㄨˇ') },
      { hanzi: '銀行', zhuyin: 'ㄧㄣˊ ㄏㄤˊ', english: 'bank (ㄏㄤˊ)', expectedKeys: zhuyinToDaqianKeySequence('ㄧㄣˊ ㄏㄤˊ') },
      { hanzi: '法國人', zhuyin: 'ㄈㄚˋ ㄍㄨㄛˊ ㄖㄣˊ', english: 'French person (Taiwan ㄈㄚˋ)', expectedKeys: zhuyinToDaqianKeySequence('ㄈㄚˋ ㄍㄨㄛˊ ㄖㄣˊ') },
    ],
  },
  {
    stageNumber: 7,
    id: 'dojo-stage-7',
    titleZh: '第七階：臺灣日常生活生存短句',
    titleEn: 'Stage 7: Taiwan Daily Survival Sentences (Night Market & MRT)',
    focusDescription: 'Fluid multi-word typing across beverage orders, MRT navigation, and polite requests.',
    blindKeycapsRecommended: true,
    targetWpm: 34,
    prompts: [
      { hanzi: '微糖少冰', zhuyin: 'ㄨㄟˊ ㄊㄤˊ ㄕㄠˇ ㄅㄧㄥ', english: '30% sugar, less ice', expectedKeys: zhuyinToDaqianKeySequence('ㄨㄟˊ ㄊㄤˊ ㄕㄠˇ ㄅㄧㄥ') },
      { hanzi: '內用還是外帶', zhuyin: 'ㄋㄟˋ ㄩㄥˋ ㄏㄞˊ ㄕˋ ㄨㄞˋ ㄉㄞˋ', english: 'For here or to go?', expectedKeys: zhuyinToDaqianKeySequence('ㄋㄟˋ ㄩㄥˋ ㄏㄞˊ ㄕˋ ㄨㄞˋ ㄉㄞˋ') },
      { hanzi: '請問洗手間在哪裡', zhuyin: 'ㄑㄧㄥˇ ㄨㄣˋ ㄒㄧˇ ㄕㄡˇ ㄐㄧㄢ ㄗㄞˋ ㄋㄚˇ ㄌㄧˇ', english: 'Excuse me, where is the restroom?', expectedKeys: zhuyinToDaqianKeySequence('ㄑㄧㄥˇ ㄨㄣˋ ㄒㄧˇ ㄕㄡˇ ㄐㄧㄢ ㄗㄞˋ ㄋㄚˇ ㄌㄧˇ') },
    ],
  },
  {
    stageNumber: 8,
    id: 'dojo-stage-8',
    titleZh: '第八階：大千盲打極速大師道場',
    titleEn: 'Stage 8: Blind-Keycap DaQian Master Sprint (盲打極速道場)',
    focusDescription: 'Zero visual keycap labels — pure touch-typing reflex at native Taiwan messaging speed.',
    blindKeycapsRecommended: true,
    targetWpm: 40,
    prompts: [
      { hanzi: '不好意思請給我一張載具發票', zhuyin: 'ㄅㄨˋ ㄏㄠˇ ㄧˋ ˙ㄙ ㄑㄧㄥˇ ㄍㄟˇ ㄨㄛˇ ㄧ ㄓㄤ ㄗㄞˋ ㄐㄩˋ ㄈㄚ ㄆㄧㄠˋ', english: 'Excuse me, please give me a cloud receipt', expectedKeys: zhuyinToDaqianKeySequence('ㄅㄨˋ ㄏㄠˇ ㄧˋ ˙ㄙ ㄑㄧㄥˇ ㄍㄟˇ ㄨㄛˇ ㄧ ㄓㄤ ㄗㄞˋ ㄐㄩˋ ㄈㄚ ㄆㄧㄠˋ') },
      { hanzi: '我們搭高鐵去臺南吃牛肉湯', zhuyin: 'ㄨㄛˇ ˙ㄇㄣ ㄉㄚ ㄍㄠ ㄊㄧㄝˇ ㄑㄩˋ ㄊㄞˊ ㄋㄢˊ ㄔ ㄋㄧㄡˊ ㄖㄡˋ ㄊㄤ', english: 'We take the HSR to Tainan for beef soup', expectedKeys: zhuyinToDaqianKeySequence('ㄨㄛˇ ˙ㄇㄣ ㄉㄚ ㄍㄠ ㄊㄧㄝˇ ㄑㄩˋ ㄊㄞˊ ㄋㄢˊ ㄔ ㄋㄧㄡˊ ㄖㄡˋ ㄊㄤ') },
    ],
  },
];

/**
 * 5-World Progressive Taiwan Skill Tree (20 Nodes) (FORM-REQ-0017).
 */
export const FIVE_WORLD_SKILL_TREE: SkillTreeNode[] = [
  { id: 'w1-n1', worldNumber: 1, worldTitleZh: '世界一：桃園機場與臺北捷運', worldTitleEn: 'World 1: Taoyuan Airport & Taipei MRT', nodeOrder: 1, titleZh: '禮貌問候', titleEn: 'Polite Greetings', tocflBand: 'Novice 1', sampleWords: [{ hanzi: '請問', zhuyin: 'ㄑㄧㄥˇ ㄨㄣˋ', english: 'Excuse me' }, { hanzi: '謝謝', zhuyin: 'ㄒㄧㄝˋ ˙ㄒㄧㄝ', english: 'Thank you' }] },
  { id: 'w1-n2', worldNumber: 1, worldTitleZh: '世界一：桃園機場與臺北捷運', worldTitleEn: 'World 1: Taoyuan Airport & Taipei MRT', nodeOrder: 2, titleZh: '悠遊卡加值', titleEn: 'EasyCard Top-Up', tocflBand: 'Novice 1', sampleWords: [{ hanzi: '悠遊卡', zhuyin: 'ㄧㄡ ㄧㄡˊ ㄎㄚˇ', english: 'EasyCard' }, { hanzi: '加值', zhuyin: 'ㄐㄧㄚ ㄓˊ', english: 'Top up' }] },
  { id: 'w1-n3', worldNumber: 1, worldTitleZh: '世界一：桃園機場與臺北捷運', worldTitleEn: 'World 1: Taoyuan Airport & Taipei MRT', nodeOrder: 3, titleZh: '捷運轉乘', titleEn: 'MRT Line Transfers', tocflBand: 'Novice 1', sampleWords: [{ hanzi: '捷運站', zhuyin: 'ㄐㄧㄝˊ ㄩㄣˋ ㄓㄢˋ', english: 'MRT Station' }, { hanzi: '出口', zhuyin: 'ㄔㄨ ㄎㄡˇ', english: 'Exit' }] },
  { id: 'w1-n4', worldNumber: 1, worldTitleZh: '世界一：桃園機場與臺北捷運', worldTitleEn: 'World 1: Taoyuan Airport & Taipei MRT', nodeOrder: 4, titleZh: '飯店入住', titleEn: 'Hotel Check-In', tocflBand: 'Novice 2', sampleWords: [{ hanzi: '護照', zhuyin: 'ㄏㄨˋ ㄓㄠˋ', english: 'Passport' }, { hanzi: '房間', zhuyin: 'ㄈㄤˊ ㄐㄧㄢ', english: 'Room' }] },

  { id: 'w2-n1', worldNumber: 2, worldTitleZh: '世界二：饒河夜市與小吃點菜', worldTitleEn: 'World 2: Night Market & Tick-Menu Dining', nodeOrder: 1, titleZh: '內用與外帶', titleEn: 'Dine-In vs. Takeout', tocflBand: 'Novice 1', sampleWords: [{ hanzi: '內用', zhuyin: 'ㄋㄟˋ ㄩㄥˋ', english: 'For here' }, { hanzi: '外帶', zhuyin: 'ㄨㄞˋ ㄉㄞˋ', english: 'To go' }] },
  { id: 'w2-n2', worldNumber: 2, worldTitleZh: '世界二：饒河夜市與小吃點菜', worldTitleEn: 'World 2: Night Market & Tick-Menu Dining', nodeOrder: 2, titleZh: '牛肉麵與水餃', titleEn: 'Beef Noodles & Dumplings', tocflBand: 'Novice 2', sampleWords: [{ hanzi: '牛肉麵', zhuyin: 'ㄋㄧㄡˊ ㄖㄡˋ ㄇㄧㄢˋ', english: 'Beef noodles' }, { hanzi: '水餃', zhuyin: 'ㄕㄨㄟˇ ㄐㄧㄠˇ', english: 'Dumplings' }] },
  { id: 'w2-n3', worldNumber: 2, worldTitleZh: '世界二：饒河夜市與小吃點菜', worldTitleEn: 'World 2: Night Market & Tick-Menu Dining', nodeOrder: 3, titleZh: '手搖飲甜度冰塊', titleEn: 'Bubble Tea Sweetness & Ice', tocflBand: 'Novice 2', sampleWords: [{ hanzi: '微糖', zhuyin: 'ㄨㄟˊ ㄊㄤˊ', english: '30% sugar' }, { hanzi: '去冰', zhuyin: 'ㄑㄩˋ ㄅㄧㄥ', english: 'Ice-free' }] },
  { id: 'w2-n4', worldNumber: 2, worldTitleZh: '世界二：饒河夜市與小吃點菜', worldTitleEn: 'World 2: Night Market & Tick-Menu Dining', nodeOrder: 4, titleZh: '結帳與載具', titleEn: 'Checkout & Cloud Receipt', tocflBand: 'Band A1', sampleWords: [{ hanzi: '買單', zhuyin: 'ㄇㄞˇ ㄉㄢ', english: 'Bill please' }, { hanzi: '載具', zhuyin: 'ㄗㄞˋ ㄐㄩˋ', english: 'Cloud invoice carrier' }] },

  { id: 'w3-n1', worldNumber: 3, worldTitleZh: '世界三：便利商店與包裹生活', worldTitleEn: 'World 3: Convenience Store & Daily Errands', nodeOrder: 1, titleZh: '微波加熱與提袋', titleEn: 'Microwave & Shopping Bag', tocflBand: 'Novice 2', sampleWords: [{ hanzi: '加熱', zhuyin: 'ㄐㄧㄚ ㄖㄜˋ', english: 'Heat up' }, { hanzi: '袋子', zhuyin: 'ㄉㄞˋ ˙ㄗ', english: 'Bag' }] },
  { id: 'w3-n2', worldNumber: 3, worldTitleZh: '世界三：便利商店與包裹生活', worldTitleEn: 'World 3: Convenience Store & Daily Errands', nodeOrder: 2, titleZh: '超商取貨', titleEn: 'Parcel Pickup (末三碼)', tocflBand: 'Band A1', sampleWords: [{ hanzi: '包裹', zhuyin: 'ㄅㄠ ㄍㄨㄛˇ', english: 'Package' }, { hanzi: '號碼', zhuyin: 'ㄏㄠˋ ㄇㄚˇ', english: 'Number' }] },
  { id: 'w3-n3', worldNumber: 3, worldTitleZh: '世界三：便利商店與包裹生活', worldTitleEn: 'World 3: Convenience Store & Daily Errands', nodeOrder: 3, titleZh: '垃圾車與回收', titleEn: 'Garbage Truck & Recycling', tocflBand: 'Band A1', sampleWords: [{ hanzi: '垃圾', zhuyin: 'ㄌㄜˋ ㄙㄜˋ', english: 'Trash (TW)' }, { hanzi: '回收', zhuyin: 'ㄏㄨㄟˊ ㄕㄡ', english: 'Recycle' }] },
  { id: 'w3-n4', worldNumber: 3, worldTitleZh: '世界三：便利商店與包裹生活', worldTitleEn: 'World 3: Convenience Store & Daily Errands', nodeOrder: 4, titleZh: '租房與房東', titleEn: 'Apartment & Landlord', tocflBand: 'Band A2', sampleWords: [{ hanzi: '房租', zhuyin: 'ㄈㄤˊ ㄗㄨ', english: 'Rent' }, { hanzi: '冷氣', zhuyin: 'ㄌㄥˇ ㄑㄧˋ', english: 'Air conditioner' }] },

  { id: 'w4-n1', worldNumber: 4, worldTitleZh: '世界四：健保診所、郵局與銀行', worldTitleEn: 'World 4: NHI Clinic, Post Office & Bank', nodeOrder: 1, titleZh: '健保卡掛號', titleEn: 'NHI Clinic Registration', tocflBand: 'Band A2', sampleWords: [{ hanzi: '健保卡', zhuyin: 'ㄐㄧㄢˋ ㄅㄠˇ ㄎㄚˇ', english: 'NHI Card' }, { hanzi: '感冒', zhuyin: 'ㄍㄢˇ ㄇㄠˋ', english: 'Cold/flu' }] },
  { id: 'w4-n2', worldNumber: 4, worldTitleZh: '世界四：健保診所、郵局與銀行', worldTitleEn: 'World 4: NHI Clinic, Post Office & Bank', nodeOrder: 2, titleZh: '藥局領藥', titleEn: 'Pharmacy Prescription', tocflBand: 'Band A2', sampleWords: [{ hanzi: '過敏', zhuyin: 'ㄍㄨㄛˋ ㄇㄧㄣˇ', english: 'Allergy' }, { hanzi: '藥局', zhuyin: 'ㄧㄠˋ ㄐㄩˊ', english: 'Pharmacy' }] },
  { id: 'w4-n3', worldNumber: 4, worldTitleZh: '世界四：健保診所、郵局與銀行', worldTitleEn: 'World 4: NHI Clinic, Post Office & Bank', nodeOrder: 3, titleZh: '銀行開戶與轉帳', titleEn: 'Bank Account & Transfer', tocflBand: 'Band B1', sampleWords: [{ hanzi: '銀行', zhuyin: 'ㄧㄣˊ ㄏㄤˊ', english: 'Bank' }, { hanzi: '匯率', zhuyin: 'ㄏㄨㄟˋ ㄌㄩˋ', english: 'Exchange rate' }] },
  { id: 'w4-n4', worldNumber: 4, worldTitleZh: '世界四：健保診所、郵局與銀行', worldTitleEn: 'World 4: NHI Clinic, Post Office & Bank', nodeOrder: 4, titleZh: '颱風假與新聞', titleEn: 'Typhoon Day & News', tocflBand: 'Band B1', sampleWords: [{ hanzi: '颱風', zhuyin: 'ㄊㄞˊ ㄈㄥ', english: 'Typhoon' }, { hanzi: '安全', zhuyin: 'ㄢ ㄑㄩㄢˊ', english: 'Safety' }] },

  { id: 'w5-n1', worldNumber: 5, worldTitleZh: '世界五：高鐵環島與職場商務', worldTitleEn: 'World 5: HSR Island Tour & Professional Register', nodeOrder: 1, titleZh: '高鐵自由座與對號座', titleEn: 'Taiwan High Speed Rail', tocflBand: 'Band A2', sampleWords: [{ hanzi: '高鐵', zhuyin: 'ㄍㄠ ㄊㄧㄝˇ', english: 'HSR' }, { hanzi: '月台', zhuyin: 'ㄩㄝˋ ㄊㄞˊ', english: 'Platform' }] },
  { id: 'w5-n2', worldNumber: 5, worldTitleZh: '世界五：高鐵環島與職場商務', worldTitleEn: 'World 5: HSR Island Tour & Professional Register', nodeOrder: 2, titleZh: '阿里山烏龍茶道', titleEn: 'High-Mountain Oolong Tea', tocflBand: 'Band B1', sampleWords: [{ hanzi: '烏龍茶', zhuyin: 'ㄨ ㄌㄨㄥˊ ㄔㄚˊ', english: 'Oolong tea' }, { hanzi: '香氣', zhuyin: 'ㄒㄧㄤ ㄑㄧˋ', english: 'Aroma' }] },
  { id: 'w5-n3', worldNumber: 5, worldTitleZh: '世界五：高鐵環島與職場商務', worldTitleEn: 'World 5: HSR Island Tour & Professional Register', nodeOrder: 3, titleZh: '書面語商務信函', titleEn: 'Formal Written Register', tocflBand: 'Band B1', sampleWords: [{ hanzi: '協助', zhuyin: 'ㄒㄧㄝˊ ㄓㄨˋ', english: 'Assist (formal)' }, { hanzi: '目前', zhuyin: 'ㄇㄨˋ ㄑㄧㄢˊ', english: 'Currently' }] },
  { id: 'w5-n4', worldNumber: 5, worldTitleZh: '世界五：高鐵環島與職場商務', worldTitleEn: 'World 5: HSR Island Tour & Professional Register', nodeOrder: 4, titleZh: '華語文能力測驗進階', titleEn: 'TOCFL Band B2 Mastery', tocflBand: 'Band B2', sampleWords: [{ hanzi: '傳統', zhuyin: 'ㄔㄨㄢˊ ㄊㄨㄥˇ', english: 'Tradition' }, { hanzi: '影響', zhuyin: 'ㄧㄥˇ ㄒㄧㄤˇ', english: 'Influence' }] },
];

/**
 * 3-Stage Match Arena Pairs (Stage 1: Hanzi <-> Zhuyin, Stage 2: Hanzi <-> English, Stage 3: Polyphone Compound Blitz).
 */
export const MATCH_ARENA_PAIRS: MatchArenaPair[] = [
  // Stage 1: Hanzi <-> Taiwan MOE Zhuyin
  { id: 'ma-1-1', stage: 1, leftPrompt: '垃圾', rightMatch: 'ㄌㄜˋ ㄙㄜˋ', hintEn: 'Trash (Taiwan MOE standard)' },
  { id: 'ma-1-2', stage: 1, leftPrompt: '捷運', rightMatch: 'ㄐㄧㄝˊ ㄩㄣˋ', hintEn: 'MRT rapid transit' },
  { id: 'ma-1-3', stage: 1, leftPrompt: '微糖', rightMatch: 'ㄨㄟˊ ㄊㄤˊ', hintEn: '30% sugar' },
  { id: 'ma-1-4', stage: 1, leftPrompt: '星期', rightMatch: 'ㄒㄧㄥ ㄑㄧˊ', hintEn: 'Week (Taiwan Tone 2 ㄑㄧˊ)' },
  { id: 'ma-1-5', stage: 1, leftPrompt: '載具', rightMatch: 'ㄗㄞˋ ㄐㄩˋ', hintEn: 'Cloud receipt barcode' },
  { id: 'ma-1-6', stage: 1, leftPrompt: '悠遊卡', rightMatch: 'ㄧㄡ ㄧㄡˊ ㄎㄚˇ', hintEn: 'EasyCard' },

  // Stage 2: Hanzi <-> English Meaning
  { id: 'ma-2-1', stage: 2, leftPrompt: '內用', rightMatch: 'For here (dine-in)', hintEn: 'ㄋㄟˋ ㄩㄥˋ' },
  { id: 'ma-2-2', stage: 2, leftPrompt: '外帶', rightMatch: 'To go (takeout)', hintEn: 'ㄨㄞˋ ㄉㄞˋ' },
  { id: 'ma-2-3', stage: 2, leftPrompt: '牛肉麵', rightMatch: 'Beef noodle soup', hintEn: 'ㄋㄧㄡˊ ㄖㄡˋ ㄇㄧㄢˋ' },
  { id: 'ma-2-4', stage: 2, leftPrompt: '不好意思', rightMatch: 'Excuse me / Sorry to bother', hintEn: 'ㄅㄨˋ ㄏㄠˇ ㄧˋ ˙ㄙ' },
  { id: 'ma-2-5', stage: 2, leftPrompt: '發票', rightMatch: 'Uniform invoice receipt', hintEn: 'ㄈㄚ ㄆㄧㄠˋ' },
  { id: 'ma-2-6', stage: 2, leftPrompt: '健保卡', rightMatch: 'National Health Insurance card', hintEn: 'ㄐㄧㄢˋ ㄅㄠˇ ㄎㄚˇ' },

  // Stage 3: Contextual Polyphone (破音字) Compound Blitz
  { id: 'ma-3-1', stage: 3, leftPrompt: '銀行 (行)', rightMatch: 'ㄏㄤˊ (háng · institution)', hintEn: 'vs. 行走 ㄒㄧㄥˊ' },
  { id: 'ma-3-2', stage: 3, leftPrompt: '走路 (行)', rightMatch: 'ㄒㄧㄥˊ (xíng · walk/go)', hintEn: 'vs. 銀行 ㄏㄤˊ' },
  { id: 'ma-3-3', stage: 3, leftPrompt: '還錢 (還)', rightMatch: 'ㄏㄨㄢˊ (huán · return/repay)', hintEn: 'vs. 還是 ㄏㄞˊ' },
  { id: 'ma-3-4', stage: 3, leftPrompt: '還是 (還)', rightMatch: 'ㄏㄞˊ (hái · still / or)', hintEn: 'vs. 歸還 ㄏㄨㄢˊ' },
  { id: 'ma-3-5', stage: 3, leftPrompt: '音樂 (樂)', rightMatch: 'ㄩㄝˋ (yuè · music)', hintEn: 'vs. 快樂 ㄌㄜˋ' },
  { id: 'ma-3-6', stage: 3, leftPrompt: '快樂 (樂)', rightMatch: 'ㄌㄜˋ (lè · happy/joy)', hintEn: 'vs. 音樂 ㄩㄝˋ' },
];
