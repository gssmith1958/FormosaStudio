/**
 * FormosaStudio (FORM) — Core Zhuyin Symbols, Taiwan DaQian (大千式) Keyboard Map & Syllable Parser
 * Traces to: FORM-REQ-0001, FORM-REQ-0002, FORM-REQ-0005, FORM-REQ-0017
 */

export type ZhuyinCategory = 'initial' | 'medial' | 'final';

export interface ZhuyinSymbolInfo {
  symbol: string;
  category: ZhuyinCategory;
  group: string;
  pinyin: string;
  ipa: string;
  daqianKey: string;
  daqianRow: number; // 0: number row, 1: QWERTY, 2: ASDF, 3: ZXCV
  daqianCol: number;
  exampleChar: string;
  exampleZhuyin: string;
  exampleMeaning: string;
  ttsSample: string;
  mnemonic: string;
}

export interface ToneInfo {
  tone: 1 | 2 | 3 | 4 | 5;
  nameZh: string;
  nameEn: string;
  mark: string;
  displayMark: string;
  daqianKey: string;
  daqianLabel: string;
  contour: string;
  pitchPoints: number[]; // 1..5 Chao pitch scale
  color: string;
  description: string;
  exampleChar: string;
  exampleZhuyin: string;
  exampleMeaning: string;
}

export const ZHUYIN_TONES: ToneInfo[] = [
  {
    tone: 1,
    nameZh: '一聲 (陰平)',
    nameEn: '1st Tone (High Level)',
    mark: '',
    displayMark: 'ˉ',
    daqianKey: ' ',
    daqianLabel: 'Space',
    contour: '55',
    pitchPoints: [5, 5, 5],
    color: '#38bdf8',
    description: 'High and flat pitch. In Zhuyin, 1st tone has NO tone mark written, and is finalized with Spacebar on a Taiwan DaQian keyboard.',
    exampleChar: '媽',
    exampleZhuyin: 'ㄇㄚ',
    exampleMeaning: 'mother',
  },
  {
    tone: 2,
    nameZh: '二聲 (陽平)',
    nameEn: '2nd Tone (Rising)',
    mark: 'ˊ',
    displayMark: 'ˊ',
    daqianKey: '6',
    daqianLabel: '6',
    contour: '35',
    pitchPoints: [3, 4, 5],
    color: '#34d399',
    description: 'Rises from middle to high pitch, like asking "Huh? Really?" in English. Typed with key 6 on the DaQian keyboard.',
    exampleChar: '茶',
    exampleZhuyin: 'ㄔㄚˊ',
    exampleMeaning: 'tea',
  },
  {
    tone: 3,
    nameZh: '三聲 (上聲)',
    nameEn: '3rd Tone (Dipping / Low)',
    mark: 'ˇ',
    displayMark: 'ˇ',
    daqianKey: '3',
    daqianLabel: '3',
    contour: '214',
    pitchPoints: [2, 1, 4],
    color: '#fbbf24',
    description: 'Dips low then rises (or stays low before 1st/2nd/4th tones). Before another 3rd tone, it shifts to 2nd tone (三聲變調). Typed with key 3.',
    exampleChar: '好',
    exampleZhuyin: 'ㄏㄠˇ',
    exampleMeaning: 'good / well',
  },
  {
    tone: 4,
    nameZh: '四聲 (去聲)',
    nameEn: '4th Tone (Falling)',
    mark: 'ˋ',
    displayMark: 'ˋ',
    daqianKey: '4',
    daqianLabel: '4',
    contour: '51',
    pitchPoints: [5, 3, 1],
    color: '#f87171',
    description: 'Sharp, emphatic fall from high to low pitch. Typed with key 4 on the DaQian keyboard.',
    exampleChar: '是',
    exampleZhuyin: 'ㄕˋ',
    exampleMeaning: 'to be / yes',
  },
  {
    tone: 5,
    nameZh: '輕聲 (Neutral)',
    nameEn: 'Neutral Tone (Light)',
    mark: '˙',
    displayMark: '˙',
    daqianKey: '7',
    daqianLabel: '7',
    contour: '·',
    pitchPoints: [3, 3],
    color: '#c084fc',
    description: 'Short, light, unstressed syllable. In vertical Taiwanese Zhuyin, the dot (˙) sits centered above the Zhuyin column. Typed with key 7.',
    exampleChar: '嗎',
    exampleZhuyin: 'ㄇㄚ˙',
    exampleMeaning: 'question particle',
  },
];

export const ZHUYIN_SYMBOLS: ZhuyinSymbolInfo[] = [
  // 21 INITIALS (聲母)
  { symbol: 'ㄅ', category: 'initial', group: 'Labials (雙唇/唇齒音)', pinyin: 'b', ipa: '[p]', daqianKey: '1', daqianRow: 0, daqianCol: 0, exampleChar: '不', exampleZhuyin: 'ㄅㄨˋ', exampleMeaning: 'no / not', ttsSample: 'ㄅㄚ', mnemonic: 'Unaspirated "b" as in "spin". Key [1].' },
  { symbol: 'ㄆ', category: 'initial', group: 'Labials (雙唇/唇齒音)', pinyin: 'p', ipa: '[pʰ]', daqianKey: 'q', daqianRow: 1, daqianCol: 0, exampleChar: '啤', exampleZhuyin: 'ㄆㄧˊ', exampleMeaning: 'beer (啤酒)', ttsSample: 'ㄆㄛ', mnemonic: 'Aspirated "p" as in "pop". Key [Q].' },
  { symbol: 'ㄇ', category: 'initial', group: 'Labials (雙唇/唇齒音)', pinyin: 'm', ipa: '[m]', daqianKey: 'a', daqianRow: 2, daqianCol: 0, exampleChar: '美', exampleZhuyin: 'ㄇㄟˇ', exampleMeaning: 'America (美國)', ttsSample: 'ㄇㄛ', mnemonic: 'Doorway shape; "m" in "mom". Key [A].' },
  { symbol: 'ㄈ', category: 'initial', group: 'Labials (雙唇/唇齒音)', pinyin: 'f', ipa: '[f]', daqianKey: 'z', daqianRow: 3, daqianCol: 0, exampleChar: '飯', exampleZhuyin: 'ㄈㄢˋ', exampleMeaning: 'rice / meal', ttsSample: 'ㄈㄛ', mnemonic: 'Sideways F; "f" in "fun". Key [Z].' },
  { symbol: 'ㄉ', category: 'initial', group: 'Alveolars (舌尖中音)', pinyin: 'd', ipa: '[t]', daqianKey: '2', daqianRow: 0, daqianCol: 1, exampleChar: '對', exampleZhuyin: 'ㄉㄨㄟˋ', exampleMeaning: 'correct / sorry', ttsSample: 'ㄉㄜ', mnemonic: 'Unaspirated "d"/"t" as in "stop". Key [2].' },
  { symbol: 'ㄊ', category: 'initial', group: 'Alveolars (舌尖中音)', pinyin: 't', ipa: '[tʰ]', daqianKey: 'w', daqianRow: 1, daqianCol: 1, exampleChar: '臺', exampleZhuyin: 'ㄊㄞˊ', exampleMeaning: 'Taiwan (臺灣)', ttsSample: 'ㄊㄜ', mnemonic: 'Aspirated "t" as in "top". Key [W].' },
  { symbol: 'ㄋ', category: 'initial', group: 'Alveolars (舌尖中音)', pinyin: 'n', ipa: '[n]', daqianKey: 's', daqianRow: 2, daqianCol: 1, exampleChar: '你', exampleZhuyin: 'ㄋㄧˇ', exampleMeaning: 'you', ttsSample: 'ㄋㄜ', mnemonic: '"n" in "nice". Key [S].' },
  { symbol: 'ㄌ', category: 'initial', group: 'Alveolars (舌尖中音)', pinyin: 'l', ipa: '[l]', daqianKey: 'x', daqianRow: 3, daqianCol: 1, exampleChar: '來', exampleZhuyin: 'ㄌㄞˊ', exampleMeaning: 'to come', ttsSample: 'ㄌㄜ', mnemonic: 'From 力; "l" in "love". Key [X].' },
  { symbol: 'ㄍ', category: 'initial', group: 'Velars (舌根音)', pinyin: 'g', ipa: '[k]', daqianKey: 'e', daqianRow: 1, daqianCol: 2, exampleChar: '國', exampleZhuyin: 'ㄍㄨㄛˊ', exampleMeaning: 'country', ttsSample: 'ㄍㄜ', mnemonic: 'Unaspirated "g" as in "sky". Key [E].' },
  { symbol: 'ㄎ', category: 'initial', group: 'Velars (舌根音)', pinyin: 'k', ipa: '[kʰ]', daqianKey: 'd', daqianRow: 2, daqianCol: 2, exampleChar: '咖', exampleZhuyin: 'ㄎㄚ', exampleMeaning: 'coffee (咖啡)', ttsSample: 'ㄎㄜ', mnemonic: 'Aspirated "k" as in "kite". Key [D].' },
  { symbol: 'ㄏ', category: 'initial', group: 'Velars (舌根音)', pinyin: 'h', ipa: '[x]', daqianKey: 'c', daqianRow: 3, daqianCol: 2, exampleChar: '好', exampleZhuyin: 'ㄏㄠˇ', exampleMeaning: 'good', ttsSample: 'ㄏㄜ', mnemonic: 'Throatier "h" as in "hot". Key [C].' },
  { symbol: 'ㄐ', category: 'initial', group: 'Palatals (舌面前音)', pinyin: 'j', ipa: '[tɕ]', daqianKey: 'r', daqianRow: 1, daqianCol: 3, exampleChar: '街', exampleZhuyin: 'ㄐㄧㄝ', exampleMeaning: 'street', ttsSample: 'ㄐㄧ', mnemonic: 'Unaspirated palatal "j" with tongue flat behind lower teeth. Key [R].' },
  { symbol: 'ㄑ', category: 'initial', group: 'Palatals (舌面前音)', pinyin: 'q', ipa: '[tɕʰ]', daqianKey: 'f', daqianRow: 2, daqianCol: 3, exampleChar: '請', exampleZhuyin: 'ㄑㄧㄥˇ', exampleMeaning: 'please', ttsSample: 'ㄑㄧ', mnemonic: 'Aspirated palatal "ch" as in "cheek". Key [F].' },
  { symbol: 'ㄒ', category: 'initial', group: 'Palatals (舌面前音)', pinyin: 'x', ipa: '[ɕ]', daqianKey: 'v', daqianRow: 3, daqianCol: 3, exampleChar: '謝', exampleZhuyin: 'ㄒㄧㄝˋ', exampleMeaning: 'thank (謝謝)', ttsSample: 'ㄒㄧ', mnemonic: 'Crisp palatal "sh" as in "she". Key [V].' },
  { symbol: 'ㄓ', category: 'initial', group: 'Retroflex (翹舌音)', pinyin: 'zh', ipa: '[ʈʂ]', daqianKey: '5', daqianRow: 0, daqianCol: 4, exampleChar: '知', exampleZhuyin: 'ㄓ', exampleMeaning: 'to know (知道)', ttsSample: 'ㄓ', mnemonic: 'Retroflex unaspirated "j" (tongue curled gently back). Key [5].' },
  { symbol: 'ㄔ', category: 'initial', group: 'Retroflex (翹舌音)', pinyin: 'ch', ipa: '[ʈʂʰ]', daqianKey: 't', daqianRow: 1, daqianCol: 4, exampleChar: '吃', exampleZhuyin: 'ㄔ', exampleMeaning: 'to eat', ttsSample: 'ㄔ', mnemonic: 'Retroflex aspirated "ch" as in "church". Key [T].' },
  { symbol: 'ㄕ', category: 'initial', group: 'Retroflex (翹舌音)', pinyin: 'sh', ipa: '[ʂ]', daqianKey: 'g', daqianRow: 2, daqianCol: 4, exampleChar: '是', exampleZhuyin: 'ㄕˋ', exampleMeaning: 'to be / yes', ttsSample: 'ㄕ', mnemonic: 'Retroflex "sh" as in "shirt". Key [G].' },
  { symbol: 'ㄖ', category: 'initial', group: 'Retroflex (翹舌音)', pinyin: 'r', ipa: '[ʐ]', daqianKey: 'b', daqianRow: 3, daqianCol: 4, exampleChar: '熱', exampleZhuyin: 'ㄖㄜˋ', exampleMeaning: 'hot', ttsSample: 'ㄖ', mnemonic: 'Voiced retroflex "r/zh" as in "measure". Key [B].' },
  { symbol: 'ㄗ', category: 'initial', group: 'Flat Sibilants (平舌音)', pinyin: 'z', ipa: '[ts]', daqianKey: 'y', daqianRow: 1, daqianCol: 5, exampleChar: '早', exampleZhuyin: 'ㄗㄠˇ', exampleMeaning: 'morning / early', ttsSample: 'ㄗ', mnemonic: 'Flat-tongue "dz" as in "kids". Key [Y].' },
  { symbol: 'ㄘ', category: 'initial', group: 'Flat Sibilants (平舌音)', pinyin: 'c', ipa: '[tsʰ]', daqianKey: 'h', daqianRow: 2, daqianCol: 5, exampleChar: '菜', exampleZhuyin: 'ㄘㄞˋ', exampleMeaning: 'dish / vegetable', ttsSample: 'ㄘ', mnemonic: 'Aspirated flat-tongue "ts" as in "cats". Key [H].' },
  { symbol: 'ㄙ', category: 'initial', group: 'Flat Sibilants (平舌音)', pinyin: 's', ipa: '[s]', daqianKey: 'n', daqianRow: 3, daqianCol: 5, exampleChar: '四', exampleZhuyin: 'ㄙˋ', exampleMeaning: 'four (4)', ttsSample: 'ㄙ', mnemonic: 'Crisp "s" as in "sun". Key [N].' },
  // 3 MEDIALS (介音)
  { symbol: 'ㄧ', category: 'medial', group: 'Medials (介音)', pinyin: 'yi / -i-', ipa: '[i]', daqianKey: 'u', daqianRow: 1, daqianCol: 6, exampleChar: '一', exampleZhuyin: 'ㄧ', exampleMeaning: 'one (1)', ttsSample: 'ㄧ', mnemonic: 'High front "ee" as in "see". Key [U].' },
  { symbol: 'ㄨ', category: 'medial', group: 'Medials (介音)', pinyin: 'wu / -u-', ipa: '[u]', daqianKey: 'j', daqianRow: 2, daqianCol: 6, exampleChar: '五', exampleZhuyin: 'ㄨˇ', exampleMeaning: 'five (5)', ttsSample: 'ㄨ', mnemonic: 'Rounded "oo" as in "food". Key [J].' },
  { symbol: 'ㄩ', category: 'medial', group: 'Medials (介音)', pinyin: 'yu / -ü-', ipa: '[y]', daqianKey: 'm', daqianRow: 3, daqianCol: 6, exampleChar: '魚', exampleZhuyin: 'ㄩˊ', exampleMeaning: 'fish', ttsSample: 'ㄩ', mnemonic: 'Say "ee" while rounding lips like whistling. Key [M].' },
  // 13 FINALS (韻母)
  { symbol: 'ㄚ', category: 'final', group: 'Simple Finals (單韻母)', pinyin: 'a', ipa: '[a]', daqianKey: '8', daqianRow: 0, daqianCol: 7, exampleChar: '茶', exampleZhuyin: 'ㄔㄚˊ', exampleMeaning: 'tea', ttsSample: 'ㄚ', mnemonic: 'Open "ah" as in "father". Key [8].' },
  { symbol: 'ㄛ', category: 'final', group: 'Simple Finals (單韻母)', pinyin: 'o / uo', ipa: '[o]', daqianKey: 'i', daqianRow: 1, daqianCol: 7, exampleChar: '說', exampleZhuyin: 'ㄕㄨㄛ', exampleMeaning: 'to speak', ttsSample: 'ㄛ', mnemonic: 'Rounded "aw/o" as in "more". Key [I].' },
  { symbol: 'ㄜ', category: 'final', group: 'Simple Finals (單韻母)', pinyin: 'e', ipa: '[ɤ]', daqianKey: 'k', daqianRow: 2, daqianCol: 7, exampleChar: '喝', exampleZhuyin: 'ㄏㄜ', exampleMeaning: 'to drink', ttsSample: 'ㄜ', mnemonic: 'Unrounded back vowel "uh" as in "her". Key [K].' },
  { symbol: 'ㄝ', category: 'final', group: 'Simple Finals (單韻母)', pinyin: 'ê / -ie / -üe', ipa: '[ɛ]', daqianKey: ',', daqianRow: 3, daqianCol: 7, exampleChar: '姐', exampleZhuyin: 'ㄐㄧㄝˇ', exampleMeaning: 'older sister (小姐)', ttsSample: 'ㄧㄝ', mnemonic: 'Short "eh" as in "bet" (after ㄧ/ㄩ: 謝謝 ㄒㄧㄝˋ). Key [,].' },
  { symbol: 'ㄞ', category: 'final', group: 'Diphthongs (複韻母)', pinyin: 'ai', ipa: '[aɪ]', daqianKey: '9', daqianRow: 0, daqianCol: 8, exampleChar: '買', exampleZhuyin: 'ㄇㄞˇ', exampleMeaning: 'to buy', ttsSample: 'ㄞ', mnemonic: 'Sounds like "eye". Key [9].' },
  { symbol: 'ㄟ', category: 'final', group: 'Diphthongs (複韻母)', pinyin: 'ei / -ui', ipa: '[eɪ]', daqianKey: 'o', daqianRow: 1, daqianCol: 8, exampleChar: '美', exampleZhuyin: 'ㄇㄟˇ', exampleMeaning: 'America / beautiful', ttsSample: 'ㄟ', mnemonic: 'Sounds like "ay" in "day". Key [O].' },
  { symbol: 'ㄠ', category: 'final', group: 'Diphthongs (複韻母)', pinyin: 'ao', ipa: '[aʊ]', daqianKey: 'l', daqianRow: 2, daqianCol: 8, exampleChar: '早', exampleZhuyin: 'ㄗㄠˇ', exampleMeaning: 'early / morning', ttsSample: 'ㄠ', mnemonic: 'Sounds like "ow" in "cow". Key [L].' },
  { symbol: 'ㄡ', category: 'final', group: 'Diphthongs (複韻母)', pinyin: 'ou', ipa: '[oʊ]', daqianKey: '.', daqianRow: 3, daqianCol: 8, exampleChar: '有', exampleZhuyin: 'ㄧㄡˇ', exampleMeaning: 'to have', ttsSample: 'ㄡ', mnemonic: 'Sounds like "oh" in "go". Key [.].' },
  { symbol: 'ㄢ', category: 'final', group: 'Nasal Finals (鼻韻母)', pinyin: 'an', ipa: '[an]', daqianKey: '0', daqianRow: 0, daqianCol: 9, exampleChar: '晚', exampleZhuyin: 'ㄨㄢˇ', exampleMeaning: 'evening / late', ttsSample: 'ㄢ', mnemonic: 'Front nasal "ahn". Key [0].' },
  { symbol: 'ㄣ', category: 'final', group: 'Nasal Finals (鼻韻母)', pinyin: 'en / in / un', ipa: '[ən]', daqianKey: 'p', daqianRow: 1, daqianCol: 9, exampleChar: '很', exampleZhuyin: 'ㄏㄣˇ', exampleMeaning: 'very', ttsSample: 'ㄣ', mnemonic: 'Front nasal "uhn" (or "een" after ㄧ). Key [P].' },
  { symbol: 'ㄤ', category: 'final', group: 'Nasal Finals (鼻韻母)', pinyin: 'ang', ipa: '[ɑŋ]', daqianKey: ';', daqianRow: 2, daqianCol: 9, exampleChar: '想', exampleZhuyin: 'ㄒㄧㄤˇ', exampleMeaning: 'would like / think', ttsSample: 'ㄤ', mnemonic: 'Open back nasal "ahng". Key [;].' },
  { symbol: 'ㄥ', category: 'final', group: 'Nasal Finals (鼻韻母)', pinyin: 'eng / ing / ong', ipa: '[əŋ]', daqianKey: '/', daqianRow: 3, daqianCol: 9, exampleChar: '請', exampleZhuyin: 'ㄑㄧㄥˇ', exampleMeaning: 'please', ttsSample: 'ㄥ', mnemonic: 'Back nasal "uhng" (or "ing"/"ong"). Key [/].' },
  { symbol: 'ㄦ', category: 'final', group: 'Retroflex Final (捲舌韻母)', pinyin: 'er / -r', ipa: '[ɚ]', daqianKey: '-', daqianRow: 0, daqianCol: 10, exampleChar: '二', exampleZhuyin: 'ㄦˋ', exampleMeaning: 'two (2)', ttsSample: 'ㄦˋ', mnemonic: 'Retroflex "er" as in "her". Key [-].' },
];

export const SYMBOL_BY_CHAR: Record<string, ZhuyinSymbolInfo> = Object.fromEntries(
  ZHUYIN_SYMBOLS.map((s) => [s.symbol, s])
);

export const TONE_BY_MARK: Record<string, ToneInfo> = {
  '': ZHUYIN_TONES[0],
  'ˉ': ZHUYIN_TONES[0],
  'ˊ': ZHUYIN_TONES[1],
  'ˇ': ZHUYIN_TONES[2],
  'ˋ': ZHUYIN_TONES[3],
  '˙': ZHUYIN_TONES[4],
};

export const TONE_BY_NUMBER: Record<number, ToneInfo> = {
  1: ZHUYIN_TONES[0],
  2: ZHUYIN_TONES[1],
  3: ZHUYIN_TONES[2],
  4: ZHUYIN_TONES[3],
  5: ZHUYIN_TONES[4],
};

export interface ParsedZhuyinSyllable {
  raw: string;
  normalized: string;
  initial: string;
  medial: string;
  final: string;
  phoneticBody: string;
  tone: 1 | 2 | 3 | 4 | 5;
  toneMark: string;
  daqianKeys: string[];
  daqianDisplay: string;
  pinyin: string;
}

const INITIAL_SET = new Set(ZHUYIN_SYMBOLS.filter((s) => s.category === 'initial').map((s) => s.symbol));
const MEDIAL_SET = new Set(ZHUYIN_SYMBOLS.filter((s) => s.category === 'medial').map((s) => s.symbol));
const FINAL_SET = new Set(ZHUYIN_SYMBOLS.filter((s) => s.category === 'final').map((s) => s.symbol));

export function normalizeZhuyinString(raw: string): string {
  return raw
    .replace(/ㄏâㄛ/g, 'ㄏㄠˇ')
    .replace(/ㄧôㄨ/g, 'ㄧㄡˇ')
    .replace(/ㄏuoˋ/g, 'ㄏㄨㄛˋ')
    .replace(/ㄊè/g, 'ㄊㄜˋ')
    .replace(/這/g, 'ㄓㄜˋ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function parseZhuyinSyllable(rawSyl: string): ParsedZhuyinSyllable {
  const normalized = normalizeZhuyinString(rawSyl);
  let initial = '';
  let medial = '';
  let final = '';
  let tone: 1 | 2 | 3 | 4 | 5 = 1;
  let toneMark = '';

  for (const ch of normalized) {
    if (ch === 'ˊ') {
      tone = 2;
      toneMark = 'ˊ';
    } else if (ch === 'ˇ') {
      tone = 3;
      toneMark = 'ˇ';
    } else if (ch === 'ˋ') {
      tone = 4;
      toneMark = 'ˋ';
    } else if (ch === '˙') {
      tone = 5;
      toneMark = '˙';
    } else if (INITIAL_SET.has(ch)) {
      initial = ch;
    } else if (MEDIAL_SET.has(ch)) {
      medial = ch;
    } else if (FINAL_SET.has(ch)) {
      final = ch;
    }
  }

  const phoneticBody = `${initial}${medial}${final}`;
  const daqianKeys: string[] = [];
  if (initial && SYMBOL_BY_CHAR[initial]) daqianKeys.push(SYMBOL_BY_CHAR[initial].daqianKey);
  if (medial && SYMBOL_BY_CHAR[medial]) daqianKeys.push(SYMBOL_BY_CHAR[medial].daqianKey);
  if (final && SYMBOL_BY_CHAR[final]) daqianKeys.push(SYMBOL_BY_CHAR[final].daqianKey);

  const toneInfo = TONE_BY_NUMBER[tone];
  if (phoneticBody.length > 0) {
    daqianKeys.push(toneInfo.daqianKey);
  }

  const daqianDisplay = daqianKeys
    .map((k) => (k === ' ' ? 'Space' : k.toUpperCase()))
    .join(' ');

  const pInit = initial && SYMBOL_BY_CHAR[initial] ? SYMBOL_BY_CHAR[initial].pinyin : '';
  const pMed = medial && SYMBOL_BY_CHAR[medial] ? SYMBOL_BY_CHAR[medial].pinyin.split('/')[0].trim() : '';
  const pFin = final && SYMBOL_BY_CHAR[final] ? SYMBOL_BY_CHAR[final].pinyin.split('/')[0].trim() : '';
  const approxPinyin = `${pInit}${pMed}${pFin}` || normalized;

  return {
    raw: rawSyl,
    normalized: tone === 5 ? `${phoneticBody}˙` : `${phoneticBody}${toneMark}`,
    initial,
    medial,
    final,
    phoneticBody,
    tone,
    toneMark,
    daqianKeys,
    daqianDisplay,
    pinyin: approxPinyin,
  };
}

export function getDaqianKeysForWord(zhuyinWord: string): { syllable: string; keys: string }[] {
  return normalizeZhuyinString(zhuyinWord)
    .split(/\s+/)
    .filter(Boolean)
    .map((syl) => {
      const parsed = parseZhuyinSyllable(syl);
      return {
        syllable: parsed.normalized,
        keys: parsed.daqianDisplay,
      };
    });
}
