/**
 * FormosaStudio (FORM) — Forward Maximum-Matching (FMM) Word Tokenizer, Polyphone (破音字) Disambiguator & Tone Sandhi Engine
 * Traces to: FORM-REQ-0001, FORM-REQ-0002, FORM-REQ-0005, FORM-DEC-001
 */

import {
  ParsedZhuyinSyllable,
  normalizeZhuyinString,
  parseZhuyinSyllable,
} from './zhuyinTypes.ts';
import {
  CHAR_ZHUYIN_DICT,
  POLYPHONE_CHARS,
  POLYPHONE_PAIRS,
  TAIWAN_MOE_PRONUNCIATIONS,
  TaiwanMoeEntry,
  WORD_ZHUYIN_LEXICON,
} from './polyphoneLexicon.ts';

export interface AnnotatedCharToken {
  char: string;
  isChinese: boolean;
  zhuyin?: ParsedZhuyinSyllable;
  spokenZhuyin?: string;
  pinyin?: string;
  meaning?: string;
  wordContext?: string;
  isPolyphone?: boolean;
  moeNote?: string;
}

export interface AnnotatedWordSegment {
  text: string;
  isChinese: boolean;
  writtenZhuyin: string;
  spokenZhuyin: string;
  chars: AnnotatedCharToken[];
  isPolyphoneWord: boolean;
  moeInfo?: TaiwanMoeEntry;
}

export interface SandhiExplanation {
  ruleName: string;
  originalZhuyin: string;
  spokenZhuyin: string;
  description: string;
  explanation: string;
}

const CJK_REGEX = /[\u4e00-\u9fff]/;
const MAX_COMPOUND_LEN = 6;
const ORDINAL_PREFIXES = new Set(['第', '初', '十']);
const SERIAL_DIGITS = new Set(['零', '一', '二', '三', '四', '五', '六', '七', '八', '九', '十', '月', '樓', '號', '路']);

const DYNAMIC_LEXICON: Record<string, string> = {};

/**
 * Registers custom dynamically added vocabulary words into a rebuildable overlay lexicon (ARCH-3 / Pattern 21).
 */
export function registerDynamicLexiconWord(traditional: string, zhuyin: string): void {
  const cleanWord = traditional.trim();
  const cleanZh = normalizeZhuyinString(zhuyin);
  if (cleanWord.length >= 2 && cleanZh) {
    DYNAMIC_LEXICON[cleanWord] = cleanZh;
  }
}

/**
 * Clears all custom dynamic lexicon entries prior to rebuilding from active Admin packs (prevents stale words after delete).
 */
export function resetDynamicLexicon(): void {
  for (const key of Object.keys(DYNAMIC_LEXICON)) {
    delete DYNAMIC_LEXICON[key];
  }
}

export function lookupLexiconWord(word: string): string | undefined {
  return DYNAMIC_LEXICON[word] ?? WORD_ZHUYIN_LEXICON[word];
}

/**
 * Forward Maximum-Matching (FMM) word segmenter with contextual rules for standalone particles.
 */
export function segmentTextFMM(text: string): { word: string; isChinese: boolean; zhuyinSyllables: string[] }[] {
  const chars = Array.from(text);
  const segments: { word: string; isChinese: boolean; zhuyinSyllables: string[] }[] = [];
  let i = 0;

  while (i < chars.length) {
    const ch = chars[i];
    if (!CJK_REGEX.test(ch)) {
      segments.push({ word: ch, isChinese: false, zhuyinSyllables: [] });
      i++;
      continue;
    }

    let matchedLen = 0;
    let matchedSyllables: string[] = [];

    for (let len = Math.min(MAX_COMPOUND_LEN, chars.length - i); len >= 2; len--) {
      const candidate = chars.slice(i, i + len).join('');
      const lexEntry = lookupLexiconWord(candidate);
      if (lexEntry) {
        matchedLen = len;
        matchedSyllables = normalizeZhuyinString(lexEntry).split(/\s+/).filter(Boolean);
        break;
      }
    }

    if (matchedLen >= 2) {
      segments.push({
        word: chars.slice(i, i + matchedLen).join(''),
        isChinese: true,
        zhuyinSyllables: matchedSyllables,
      });
      i += matchedLen;
      continue;
    }

    // Contextual single-character disambiguation rules for 和 / 得 / 著 / 了
    let singleSyl = CHAR_ZHUYIN_DICT[ch]?.zhuyin || '';
    const nextCh = chars[i + 1] || '';
    const prevCh = chars[i - 1] || '';

    if (ch === '和') {
      // In Taiwan Mandarin, conjunctive 和 between nouns/pronouns is always ㄏㄢˋ
      singleSyl = 'ㄏㄢˋ';
    } else if (ch === '得') {
      if (['去', '要', '做', '買', '走', '先', '趕'].includes(nextCh)) {
        singleSyl = 'ㄉㄟˇ';
      } else if (prevCh && CJK_REGEX.test(prevCh)) {
        singleSyl = 'ㄉㄜ˙';
      } else {
        singleSyl = 'ㄉㄜˊ';
      }
    } else if (ch === '著') {
      singleSyl = 'ㄓㄜ˙';
    } else if (ch === '了') {
      singleSyl = 'ㄌㄜ˙';
    }

    segments.push({
      word: ch,
      isChinese: true,
      zhuyinSyllables: singleSyl ? [singleSyl] : [],
    });
    i++;
  }

  return segments;
}

/**
 * Computes spoken (surface) Zhuyin and Tone Sandhi explanations across a sequence of character tokens:
 * 1. 2-syllable & 3-syllable 3rd-Tone Sandhi chains (3+3 -> 2+3; 3+3+3 -> 2+2+3)
 * 2. 不 (ㄅㄨˋ) before 4th tone -> ㄅㄨˊ
 * 3. 一 (ㄧ) before 4th tone -> ㄧˊ; before 1st/2nd/3rd tone -> ㄧˋ; ordinal/digit -> ㄧ
 */
export function applyToneSandhiToTokens(tokens: AnnotatedCharToken[]): SandhiExplanation[] {
  const cjkTokens = tokens.filter((t) => t.isChinese && t.zhuyin);
  const explanations: SandhiExplanation[] = [];

  for (const t of cjkTokens) {
    t.spokenZhuyin = t.zhuyin!.normalized;
  }

  // Pass 1: Contiguous 3rd-tone chains (length >= 2)
  let idx = 0;
  while (idx < cjkTokens.length) {
    if (cjkTokens[idx].zhuyin!.tone !== 3) {
      idx++;
      continue;
    }
    let end = idx + 1;
    while (end < cjkTokens.length && cjkTokens[end].zhuyin!.tone === 3) {
      end++;
    }
    const chainLen = end - idx;
    if (chainLen >= 2) {
      const chainChars = cjkTokens.slice(idx, end).map((t) => t.char).join('');
      const origList = cjkTokens.slice(idx, end).map((t) => t.zhuyin!.normalized);
      for (let k = idx; k < end - 1; k++) {
        cjkTokens[k].spokenZhuyin = `${cjkTokens[k].zhuyin!.phoneticBody}ˊ`;
      }
      const spokenList = cjkTokens.slice(idx, end).map((t) => t.spokenZhuyin!);
      const desc =
        chainLen >= 3
          ? `3-Syllable 3rd-Tone Chain (${chainChars}): the first ${chainLen - 1} third-tone syllables shift to rising 2nd tone (${spokenList.join(' ')}).`
          : `When two 3rd-tone characters (${chainChars}) appear together, the first 3rd tone (ˇ) is spoken as a rising 2nd tone (ˊ): ${spokenList.join(' ')}.`;
      explanations.push({
        ruleName: chainLen >= 3 ? '三聲連讀變調 (3-Syllable 3rd-Tone Chain)' : '三聲變調 (3rd Tone Sandhi)',
        originalZhuyin: `${chainChars} (${origList.join(' ')})`,
        spokenZhuyin: spokenList.join(' '),
        description: desc,
        explanation: desc,
      });
    }
    idx = end;
  }

  // Pass 2: 不 (ㄅㄨˋ) and 一 (ㄧ) Tone Sandhi
  for (let i = 0; i < cjkTokens.length - 1; i++) {
    const curr = cjkTokens[i];
    const next = cjkTokens[i + 1];
    const prev = i > 0 ? cjkTokens[i - 1] : undefined;
    if (!curr.zhuyin || !next.zhuyin) continue;

    if (curr.char === '不') {
      if (next.zhuyin.tone === 4) {
        curr.spokenZhuyin = 'ㄅㄨˊ';
        const desc = `When 不 (ㄅㄨˋ) precedes a 4th-tone syllable (${next.char} ${next.zhuyin.normalized}), 不 shifts to rising 2nd tone (ㄅㄨˊ).`;
        explanations.push({
          ruleName: '「不」的變調 (Bu Before 4th Tone → ㄅㄨˊ)',
          originalZhuyin: `${curr.char}${next.char} (ㄅㄨˋ ${next.zhuyin.normalized})`,
          spokenZhuyin: `ㄅㄨˊ ${next.spokenZhuyin || next.zhuyin.normalized}`,
          description: desc,
          explanation: desc,
        });
      } else {
        curr.spokenZhuyin = 'ㄅㄨˋ';
      }
    }

    if (curr.char === '一') {
      const isOrdinalOrSerial =
        (prev && (ORDINAL_PREFIXES.has(prev.char) || prev.char === '期' || prev.char === '拜' || prev.char === '週')) ||
        SERIAL_DIGITS.has(next.char);

      if (isOrdinalOrSerial) {
        curr.spokenZhuyin = 'ㄧ';
      } else if (next.zhuyin.tone === 4) {
        curr.spokenZhuyin = 'ㄧˊ';
        const desc = `When 一 (ㄧ) precedes a 4th-tone syllable (${next.char} ${next.zhuyin.normalized}), 一 shifts to rising 2nd tone (ㄧˊ).`;
        explanations.push({
          ruleName: '「一」的變調 (Yi Before 4th Tone → ㄧˊ)',
          originalZhuyin: `${curr.char}${next.char} (ㄧ ${next.zhuyin.normalized})`,
          spokenZhuyin: `ㄧˊ ${next.spokenZhuyin || next.zhuyin.normalized}`,
          description: desc,
          explanation: desc,
        });
      } else if (next.zhuyin.tone === 1 || next.zhuyin.tone === 2 || next.zhuyin.tone === 3) {
        curr.spokenZhuyin = 'ㄧˋ';
        const desc = `When 一 (ㄧ) precedes a 1st, 2nd, or 3rd-tone syllable (${next.char} ${next.zhuyin.normalized}), 一 shifts to falling 4th tone (ㄧˋ).`;
        explanations.push({
          ruleName: '「一」的變調 (Yi Before 1st/2nd/3rd Tone → ㄧˋ)',
          originalZhuyin: `${curr.char}${next.char} (ㄧ ${next.zhuyin.normalized})`,
          spokenZhuyin: `ㄧˋ ${next.spokenZhuyin || next.zhuyin.normalized}`,
          description: desc,
          explanation: desc,
        });
      }
    }
  }

  return explanations;
}

/**
 * Full word-segmented & sandhi-aware tokenizer returning both word segments and character tokens.
 */
export function tokenizeAndAnnotate(
  traditional: string,
  zhuyinOverride?: string
): {
  words: AnnotatedWordSegment[];
  chars: AnnotatedCharToken[];
  writtenZhuyinString: string;
  spokenZhuyinString: string;
  sandhiExplanations: SandhiExplanation[];
} {
  const overrideList = zhuyinOverride
    ? normalizeZhuyinString(zhuyinOverride).split(/\s+/).filter(Boolean)
    : [];
  const totalCjk = Array.from(traditional).filter((c) => CJK_REGEX.test(c)).length;
  const useOverride = overrideList.length > 0 && overrideList.length === totalCjk;

  const rawSegments = segmentTextFMM(traditional);
  const allCharTokens: AnnotatedCharToken[] = [];
  const wordSegments: AnnotatedWordSegment[] = [];
  let cjkCounter = 0;

  for (const seg of rawSegments) {
    if (!seg.isChinese) {
      const nonCjkToken: AnnotatedCharToken = { char: seg.word, isChinese: false };
      allCharTokens.push(nonCjkToken);
      wordSegments.push({
        text: seg.word,
        isChinese: false,
        writtenZhuyin: '',
        spokenZhuyin: '',
        chars: [nonCjkToken],
        isPolyphoneWord: false,
      });
      continue;
    }

    const segChars = Array.from(seg.word);
    const moeInfo = TAIWAN_MOE_PRONUNCIATIONS[seg.word];
    const segCharTokens: AnnotatedCharToken[] = [];

    for (let idx = 0; idx < segChars.length; idx++) {
      const ch = segChars[idx];
      const fallback = CHAR_ZHUYIN_DICT[ch];
      const rawSyl = useOverride
        ? overrideList[cjkCounter]
        : seg.zhuyinSyllables[idx] || fallback?.zhuyin || '';
      cjkCounter++;

      const parsed = rawSyl ? parseZhuyinSyllable(rawSyl) : undefined;
      const charToken: AnnotatedCharToken = {
        char: ch,
        isChinese: true,
        zhuyin: parsed,
        spokenZhuyin: parsed?.normalized,
        pinyin: parsed?.pinyin || fallback?.pinyin,
        meaning: fallback?.meaning,
        wordContext: seg.word,
        isPolyphone: POLYPHONE_CHARS.has(ch),
        moeNote: moeInfo?.moeNote || TAIWAN_MOE_PRONUNCIATIONS[ch]?.moeNote,
      };
      segCharTokens.push(charToken);
      allCharTokens.push(charToken);
    }

    wordSegments.push({
      text: seg.word,
      isChinese: true,
      writtenZhuyin: segCharTokens.map((t) => t.zhuyin?.normalized || '').filter(Boolean).join(' '),
      spokenZhuyin: '',
      chars: segCharTokens,
      isPolyphoneWord: segChars.some((c) => POLYPHONE_CHARS.has(c)),
      moeInfo,
    });
  }

  const sandhiExplanations = applyToneSandhiToTokens(allCharTokens);

  for (const ws of wordSegments) {
    if (ws.isChinese) {
      ws.spokenZhuyin = ws.chars.map((t) => t.spokenZhuyin || t.zhuyin?.normalized || '').filter(Boolean).join(' ');
    }
  }

  const writtenZhuyinString = allCharTokens
    .filter((t) => t.isChinese && t.zhuyin)
    .map((t) => t.zhuyin!.normalized)
    .join(' ');
  const spokenZhuyinString = allCharTokens
    .filter((t) => t.isChinese && (t.spokenZhuyin || t.zhuyin))
    .map((t) => t.spokenZhuyin || t.zhuyin!.normalized)
    .join(' ');

  return {
    words: wordSegments,
    chars: allCharTokens,
    writtenZhuyinString,
    spokenZhuyinString,
    sandhiExplanations,
  };
}

export function annotateTraditionalText(
  traditional: string,
  zhuyinRaw?: string
): AnnotatedCharToken[] {
  return tokenizeAndAnnotate(traditional, zhuyinRaw).chars;
}

export function annotateTraditionalWithZhuyin(
  traditional: string,
  zhuyinRaw?: string
): { char: string; zhuyin: string }[] {
  return tokenizeAndAnnotate(traditional, zhuyinRaw)
    .chars.filter((t) => t.isChinese && t.zhuyin)
    .map((t) => ({
      char: t.char,
      zhuyin: t.zhuyin!.normalized,
    }));
}

export function detectToneSandhi(traditional: string, zhuyinRaw?: string): SandhiExplanation[] {
  return tokenizeAndAnnotate(traditional, zhuyinRaw).sandhiExplanations;
}

export { POLYPHONE_PAIRS, TAIWAN_MOE_PRONUNCIATIONS, CHAR_ZHUYIN_DICT };
