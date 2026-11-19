/**
 * FormosaStudio (FORM) — Unified TOCFL Novice 1 – Band B2 Vocabulary Catalog Builder
 * Merges Pimsleur Units 1–19, Contemporary Chinese Volumes 1–6, and Dynamic Admin Resource Packs (Pattern 21).
 * Traces to: FORM-REQ-0003, FORM-REQ-0005, FORM-REQ-0022
 */

import { PIMSLEUR_UNITS } from './pimsleurUnitsB.ts';
import type { PimsleurUnitData } from './pimsleurUnitsA.ts';
import { CONTEMPORARY_VOLUMES } from './contemporaryVols3to6.ts';
import { ContemporaryVolumeOverview } from './contemporaryVols1to2.ts';
import { getDaqianKeysForWord } from '../lib/zhuyinTypes.ts';
import {
  SandhiExplanation,
  annotateTraditionalText,
  detectToneSandhi,
} from '../lib/zhuyinTokenizer.ts';
import {
  getCustomPimsleurUnits,
  mergeCustomContemporaryVolumes,
  subscribeCurriculumAdminChanges,
} from '../lib/curriculumAdminStore.ts';

export type VocabCategory =
  | 'greetings_polite'
  | 'pronouns_people'
  | 'food_dining'
  | 'time_numbers'
  | 'shopping_money'
  | 'places_transport'
  | 'verbs_grammar'
  | 'taiwan_life';

export type TocflBand =
  | 'Novice 1 (準備一級)'
  | 'Novice 2 (準備二級)'
  | 'Band A · Level 1 (入門級)'
  | 'Band A · Level 2 (基礎級)'
  | 'Band B · Level 1 (進階級)'
  | 'Band B · Level 2 (高階級)';

export interface VocabExampleSentence {
  traditional: string;
  zhuyin: string;
  pinyin?: string;
  english: string;
  sourceLabel: string;
}

export interface VocabCharacterPart {
  char: string;
  zhuyin: string;
  pinyin: string;
  meaning: string;
}

export interface TaiwanNaturalEquivalent {
  mainlandTerm: string;
  taiwanPreferred: string;
  taiwanZhuyin: string;
  taiwanPinyin: string;
  note: string;
}

export interface VocabularyEntry {
  id: string;
  traditional: string;
  zhuyin: string;
  pinyin: string;
  english: string;
  category: VocabCategory;
  categoryLabel: string;
  sourceType: 'pimsleur' | 'contemporary';
  sourceUnit: number;
  sourceLabel: string;
  cefr: 'A1' | 'A2' | 'B1' | 'B2' | 'C1';
  tocflBand: TocflBand;
  taiwanUsage?: TaiwanNaturalEquivalent;
  charBreakdown: VocabCharacterPart[];
  daqianKeys: { syllable: string; keys: string }[];
  sandhiRules: SandhiExplanation[];
  examples: VocabExampleSentence[];
  collocations: { traditional: string; zhuyin: string; english: string }[];
}

export interface MeasureWordCollocation {
  id: string;
  measureChar: string;
  measureZhuyin: string;
  measurePinyin: string;
  usageRule: string;
  phraseTraditional: string;
  phraseZhuyin: string;
  phraseEnglish: string;
  nounTraditional: string;
}

export interface MorphemeRadicalFamily {
  id: string;
  morphemeChar: string;
  zhuyin: string;
  pinyin: string;
  coreMeaning: string;
  radicalNote: string;
  compounds: {
    traditional: string;
    zhuyin: string;
    pinyin: string;
    english: string;
    literalBreakdown: string;
  }[];
}

export const MEASURE_WORD_DRILLS: MeasureWordCollocation[] = [
  { id: 'mw-bei-tea', measureChar: '杯', measureZhuyin: 'ㄅㄟ', measurePinyin: 'bēi', usageRule: 'Cups, glasses, and drinks (tea, coffee, boba)', phraseTraditional: '一杯烏龍茶', phraseZhuyin: 'ㄧˋ ㄅㄟ ㄨ ㄌㄨㄥˊ ㄔㄚˊ', phraseEnglish: 'a cup of Oolong tea', nounTraditional: '烏龍茶' },
  { id: 'mw-zhi-phone', measureChar: '支', measureZhuyin: 'ㄓ', measurePinyin: 'zhī', usageRule: 'Taiwanese standard classifier for cellphones and pens', phraseTraditional: '一支手機', phraseZhuyin: 'ㄧˋ ㄓ ㄕㄡˇ ㄐㄧ', phraseEnglish: 'a cellphone', nounTraditional: '手機' },
  { id: 'mw-wan-noodles', measureChar: '碗', measureZhuyin: 'ㄨㄢˇ', measurePinyin: 'wǎn', usageRule: 'Bowls of rice, soup, or noodles', phraseTraditional: '一碗牛肉麵', phraseZhuyin: 'ㄧˋ ㄨㄢˇ ㄋㄧㄡˊ ㄖㄡˋ ㄇㄧㄢˋ', phraseEnglish: 'a bowl of beef noodles', nounTraditional: '牛肉麵' },
  { id: 'mw-zhang-ticket', measureChar: '張', measureZhuyin: 'ㄓㄤ', measurePinyin: 'zhāng', usageRule: 'Flat objects (tickets, menus, paper, tables)', phraseTraditional: '兩張高鐵票', phraseZhuyin: 'ㄌㄧㄤˇ ㄓㄤ ㄍㄠ ㄊㄧㄝˇ ㄆㄧㄠˋ', phraseEnglish: 'two HSR tickets', nounTraditional: '高鐵票' },
  { id: 'mw-ge-person', measureChar: '個', measureZhuyin: 'ㄍㄜ˙', measurePinyin: 'ge', usageRule: 'General classifier for people and items', phraseTraditional: '五個人', phraseZhuyin: 'ㄨˇ ㄍㄜ˙ ㄖㄣˊ', phraseEnglish: 'five people', nounTraditional: '人' },
  { id: 'mw-kuai-money', measureChar: '塊', measureZhuyin: 'ㄎㄨㄞˋ', measurePinyin: 'kuài', usageRule: 'Spoken NT$ dollars and pieces', phraseTraditional: '五十塊錢', phraseZhuyin: 'ㄨˇ ㄕˊ ㄎㄨㄞˋ ㄑㄧㄢˊ', phraseEnglish: 'NT$50', nounTraditional: '錢' },
];

export const MORPHEME_RADICAL_FAMILIES: MorphemeRadicalFamily[] = [
  {
    id: 'fam-dian',
    morphemeChar: '電',
    zhuyin: 'ㄉㄧㄢˋ',
    pinyin: 'diàn',
    coreMeaning: 'Electricity / Electronic',
    radicalNote: 'Rain radical 雨 + flash: powers modern electronic compounds.',
    compounds: [
      { traditional: '電影', zhuyin: 'ㄉㄧㄢˋ ㄧㄥˇ', pinyin: 'diànyǐng', english: 'movie', literalBreakdown: 'electric + shadow' },
      { traditional: '電腦', zhuyin: 'ㄉㄧㄢˋ ㄋㄠˇ', pinyin: 'diànnǎo', english: 'computer', literalBreakdown: 'electric + brain' },
      { traditional: '電話', zhuyin: 'ㄉㄧㄢˋ ㄏㄨㄚˋ', pinyin: 'diànhuà', english: 'telephone', literalBreakdown: 'electric + speech' },
    ],
  },
  {
    id: 'fam-che',
    morphemeChar: '車',
    zhuyin: 'ㄔㄜ',
    pinyin: 'chē',
    coreMeaning: 'Wheeled Vehicle / Transit',
    radicalNote: 'Pictograph of a wheeled carriage.',
    compounds: [
      { traditional: '火車', zhuyin: 'ㄏㄨㄛˇ ㄔㄜ', pinyin: 'huǒchē', english: 'train (TRA)', literalBreakdown: 'fire + vehicle' },
      { traditional: '垃圾車', zhuyin: 'ㄌㄜˋ ㄙㄜˋ ㄔㄜ', pinyin: 'lèsèchē', english: 'musical garbage truck', literalBreakdown: 'trash + vehicle' },
      { traditional: '公車', zhuyin: 'ㄍㄨㄥ ㄔㄜ', pinyin: 'gōngchē', english: 'city bus (Taiwan)', literalBreakdown: 'public + vehicle' },
    ],
  },
];

const TAIWAN_EQUIVALENTS: Record<string, TaiwanNaturalEquivalent> = {
  普通話: {
    mainlandTerm: '普通話 (pǔtōnghuà)',
    taiwanPreferred: '國語 / 中文',
    taiwanZhuyin: 'ㄍㄨㄛˊ ㄩˇ / ㄓㄨㄥ ㄨㄣˊ',
    taiwanPinyin: 'Guóyǔ / Zhōngwén',
    note: 'In Taiwan, speakers say 國語 (Guóyǔ) or 中文 (Zhōngwén) rather than 普通話.',
  },
  一點兒: {
    mainlandTerm: '一點兒 (yìdiǎnr)',
    taiwanPreferred: '一點 / 一下',
    taiwanZhuyin: 'ㄧˋ ㄉㄧㄢˇ / ㄧˊ ㄒㄧㄚˋ',
    taiwanPinyin: 'yìdiǎn / yíxià',
    note: 'Taiwanese Mandarin omits the retroflex 兒 (-r) suffix in everyday speech.',
  },
};

function inferCategory(trad: string, eng: string): { category: VocabCategory; label: string } {
  const lower = eng.toLowerCase();
  if (/sorry|please|thank|welcome|hello|goodbye/.test(lower) || /[請謝對歡]/.test(trad)) {
    return { category: 'greetings_polite', label: 'Greetings & Courtesy' };
  }
  if (/eat|drink|noodle|rice|tea|water|beer|fruit|bento|dumpling|sweet|food/.test(lower) || /[飯麵茶水酒果菜包餃]/.test(trad)) {
    return { category: 'food_dining', label: 'Food & Taiwanese Dining' };
  }
  if (/money|dollar|buy|cheap|expensive|price|bank|account|invoice|discount/.test(lower) || /[錢塊買貴便宜銀行折票]/.test(trad)) {
    return { category: 'shopping_money', label: 'Shopping & NT$ Money' };
  }
  if (/mrt|train|station|street|road|taiwan|taipei|hotel|clinic|room|park/.test(lower) || /[街路站車捷店館院房臺台]/.test(trad)) {
    return { category: 'places_transport', label: 'Places & Taiwan Transit' };
  }
  if (/time|clock|today|tomorrow|morning|week|holiday|number|one|two|three|five/.test(lower) || /[點時天年星期假一二三四五六七八九十]/.test(trad)) {
    return { category: 'time_numbers', label: 'Time, Dates & Numbers' };
  }
  if (/family|friend|person|you|me|elder|sister|brother|people/.test(lower) || /[人你我他她家姐哥師]/.test(trad)) {
    return { category: 'pronouns_people', label: 'People & Family' };
  }
  return { category: 'taiwan_life', label: 'Taiwan Daily Life & Society' };
}

function buildEntryFromSource(params: {
  id: string;
  traditional: string;
  zhuyin: string;
  pinyin: string;
  english: string;
  sourceType: 'pimsleur' | 'contemporary';
  sourceUnit: number;
  sourceLabel: string;
  cefr: 'A1' | 'A2' | 'B1' | 'B2' | 'C1';
  tocflBand: TocflBand;
  exampleSentence?: { traditional: string; zhuyin: string; english: string };
}): VocabularyEntry {
  const { category, label } = inferCategory(params.traditional, params.english);
  const charTokens = annotateTraditionalText(params.traditional, params.zhuyin).filter(
    (t) => t.isChinese
  );

  return {
    id: params.id,
    traditional: params.traditional,
    zhuyin: params.zhuyin,
    pinyin: params.pinyin,
    english: params.english,
    category,
    categoryLabel: label,
    sourceType: params.sourceType,
    sourceUnit: params.sourceUnit,
    sourceLabel: params.sourceLabel,
    cefr: params.cefr,
    tocflBand: params.tocflBand,
    taiwanUsage: TAIWAN_EQUIVALENTS[params.traditional],
    charBreakdown: charTokens.map((ct) => ({
      char: ct.char,
      zhuyin: ct.zhuyin?.normalized || '',
      pinyin: ct.pinyin || '',
      meaning: ct.meaning || params.english,
    })),
    daqianKeys: getDaqianKeysForWord(params.zhuyin),
    sandhiRules: detectToneSandhi(params.traditional, params.zhuyin),
    examples: params.exampleSentence
      ? [
          {
            traditional: params.exampleSentence.traditional,
            zhuyin: params.exampleSentence.zhuyin,
            english: params.exampleSentence.english,
            sourceLabel: params.sourceLabel,
          },
        ]
      : [],
    collocations: [],
  };
}

const VOLUME_BAND_MAP: Record<number, { cefr: 'A1' | 'A2' | 'B1' | 'B2' | 'C1'; band: TocflBand }> = {
  1: { cefr: 'A1', band: 'Novice 2 (準備二級)' },
  2: { cefr: 'A2', band: 'Band A · Level 1 (入門級)' },
  3: { cefr: 'B1', band: 'Band A · Level 2 (基礎級)' },
  4: { cefr: 'B2', band: 'Band B · Level 1 (進階級)' },
  5: { cefr: 'B2', band: 'Band B · Level 2 (高階級)' },
  6: { cefr: 'C1', band: 'Band B · Level 2 (高階級)' },
};

// Higher-level Band B1/B2 vocabulary items from Volumes 3–6
const CONTEMPORARY_ADVANCED_VOCAB: {
  vol: number;
  lesson: number;
  traditional: string;
  zhuyin: string;
  pinyin: string;
  english: string;
}[] = [
  { vol: 3, lesson: 2, traditional: '打折', zhuyin: 'ㄉㄚˇ ㄓㄜˊ', pinyin: 'dǎzhé', english: 'give a discount (八折 = 20% off)' },
  { vol: 3, lesson: 4, traditional: '人情味', zhuyin: 'ㄖㄣˊ ㄑㄧㄥˊ ㄨㄟˋ', pinyin: 'rénqíngwèi', english: 'human warmth & Taiwanese hospitality' },
  { vol: 3, lesson: 8, traditional: '企業', zhuyin: 'ㄑㄧˋ ㄧㄝˋ', pinyin: 'qìyè', english: 'enterprise / corporation (Taiwan 4th tone ㄑㄧˋ)' },
  { vol: 3, lesson: 8, traditional: '自傳', zhuyin: 'ㄗˋ ㄓㄨㄢˋ', pinyin: 'zìzhuàn', english: 'autobiography (polyphone 傳=ㄓㄨㄢˋ)' },
  { vol: 3, lesson: 10, traditional: '減少', zhuyin: 'ㄐㄧㄢˇ ㄕㄠˇ', pinyin: 'jiǎnshǎo', english: 'to reduce / decrease' },
  { vol: 4, lesson: 1, traditional: '長輩', zhuyin: 'ㄓㄤˇ ㄅㄟˋ', pinyin: 'zhǎngbèi', english: 'elders / senior generation' },
  { vol: 4, lesson: 3, traditional: '危險', zhuyin: 'ㄨㄟˊ ㄒㄧㄢˇ', pinyin: 'wéixiǎn', english: 'dangerous (Taiwan MOE 2nd tone ㄨㄟˊ)' },
  { vol: 4, lesson: 4, traditional: '開會', zhuyin: 'ㄎㄞ ㄏㄨㄟˋ', pinyin: 'kāihuì', english: 'hold or attend a meeting' },
  { vol: 4, lesson: 6, traditional: '傳統', zhuyin: 'ㄔㄨㄢˊ ㄊㄨㄥˇ', pinyin: 'chuántǒng', english: 'tradition / traditional' },
  { vol: 5, lesson: 1, traditional: '重要', zhuyin: 'ㄓㄨㄥˋ ㄧㄠˋ', pinyin: 'zhòngyào', english: 'important / vital' },
  { vol: 5, lesson: 3, traditional: '知識', zhuyin: 'ㄓ ㄕˋ', pinyin: 'zhīshì', english: 'knowledge (Taiwan MOE full 4th tone ㄕˋ)' },
  { vol: 5, lesson: 4, traditional: '都市', zhuyin: 'ㄉㄨ ㄕˋ', pinyin: 'dūshì', english: 'metropolis / urban city (polyphone 都=ㄉㄨ)' },
  { vol: 6, lesson: 1, traditional: '行業', zhuyin: 'ㄏㄤˊ ㄧㄝˋ', pinyin: 'hángyè', english: 'profession / industry (polyphone 行=ㄏㄤˊ)' },
  { vol: 6, lesson: 4, traditional: '成長', zhuyin: 'ㄔㄥˊ ㄓㄤˇ', pinyin: 'chéngzhǎng', english: 'to grow / personal growth' },
  { vol: 6, lesson: 5, traditional: '了解', zhuyin: 'ㄌㄧㄠˇ ㄐㄧㄝˇ', pinyin: 'liǎojiě', english: 'to understand thoroughly (polyphone 了=ㄌㄧㄠˇ)' },
];

let cachedCatalog: VocabularyEntry[] | null = null;

export function invalidateVocabularyCatalogCache(): void {
  cachedCatalog = null;
}

subscribeCurriculumAdminChanges(() => {
  invalidateVocabularyCatalogCache();
});

export function getAllPimsleurUnits(): PimsleurUnitData[] {
  const custom = getCustomPimsleurUnits();
  const byUnit = new Map<number, PimsleurUnitData>();
  for (const u of PIMSLEUR_UNITS) byUnit.set(u.unit, u);
  for (const c of custom) byUnit.set(c.unit, c);
  return Array.from(byUnit.values()).sort((a, b) => a.unit - b.unit);
}

export function getAllContemporaryVolumes(): ContemporaryVolumeOverview[] {
  return mergeCustomContemporaryVolumes(CONTEMPORARY_VOLUMES);
}

export function getFullVocabularyCatalog(): VocabularyEntry[] {
  if (cachedCatalog) return cachedCatalog;

  const map = new Map<string, VocabularyEntry>();
  const allPimsleur = getAllPimsleurUnits();
  const allContemporary = getAllContemporaryVolumes();

  for (const unit of allPimsleur) {
    const band: TocflBand =
      unit.unit <= 7
        ? 'Novice 1 (準備一級)'
        : unit.unit <= 14
        ? 'Novice 2 (準備二級)'
        : 'Band A · Level 1 (入門級)';
    const firstDiag = unit.dialogues[0];
    for (const v of unit.vocab) {
      if (map.has(v.traditional)) continue;
      map.set(
        v.traditional,
        buildEntryFromSource({
          id: `pim-u${unit.unit}-${v.traditional}`,
          traditional: v.traditional,
          zhuyin: v.zhuyin,
          pinyin: v.pinyin,
          english: v.english,
          sourceType: 'pimsleur',
          sourceUnit: unit.unit,
          sourceLabel: `Pimsleur Unit ${unit.unit}`,
          cefr: unit.unit <= 14 ? 'A1' : 'A2',
          tocflBand: band,
          exampleSentence: firstDiag
            ? {
                traditional: firstDiag.traditional,
                zhuyin: firstDiag.zhuyin,
                english: firstDiag.english,
              }
            : undefined,
        })
      );
    }
  }

  for (const vol of allContemporary) {
    const meta = VOLUME_BAND_MAP[vol.volume] || { cefr: 'B1', band: 'Band A · Level 2 (基礎級)' };
    for (const les of vol.lessons) {
      for (const kv of les.keyVocab || []) {
        if (map.has(kv.traditional)) continue;
        map.set(
          kv.traditional,
          buildEntryFromSource({
            id: `cc-v${vol.volume}-l${les.lesson}-${kv.traditional}`,
            traditional: kv.traditional,
            zhuyin: kv.zhuyin,
            pinyin: kv.pinyin,
            english: kv.english,
            sourceType: 'contemporary',
            sourceUnit: vol.volume,
            sourceLabel: `Contemporary Vol.${vol.volume} L${les.lesson}`,
            cefr: meta.cefr,
            tocflBand: meta.band,
            exampleSentence: les.sampleSentence,
          })
        );
      }
    }
  }

  for (const adv of CONTEMPORARY_ADVANCED_VOCAB) {
    if (map.has(adv.traditional)) continue;
    const meta = VOLUME_BAND_MAP[adv.vol] || { cefr: 'B2', band: 'Band B · Level 1 (進階級)' };
    const volObj = allContemporary.find((v) => v.volume === adv.vol);
    const lesObj = volObj?.lessons.find((l) => l.lesson === adv.lesson);
    map.set(
      adv.traditional,
      buildEntryFromSource({
        id: `cc-adv-v${adv.vol}-l${adv.lesson}-${adv.traditional}`,
        traditional: adv.traditional,
        zhuyin: adv.zhuyin,
        pinyin: adv.pinyin,
        english: adv.english,
        sourceType: 'contemporary',
        sourceUnit: adv.vol,
        sourceLabel: `Contemporary Vol.${adv.vol} L${adv.lesson}`,
        cefr: meta.cefr,
        tocflBand: meta.band,
        exampleSentence: lesObj?.sampleSentence,
      })
    );
  }

  cachedCatalog = Array.from(map.values());
  return cachedCatalog;
}

export function findVocabEntryByText(query: string): VocabularyEntry | undefined {
  const catalog = getFullVocabularyCatalog();
  return (
    catalog.find((e) => e.traditional === query) ||
    catalog.find((e) => e.traditional.includes(query))
  );
}
