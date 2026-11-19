/**
 * FormosaStudio (FORM) — Phase 2 Adaptive i+1 Comprehensibility Analyzer & Instant Sentence Cloze Generator
 * Executes FMM segmentation & i+1 scoring in < 50 ms for passages up to 2,000 characters.
 * Traces to: FORM-REQ-0006, FORM-REQ-0007, FORM-REQ-0008, FORM-REQ-0005, FORM-DEP-TPA-002
 */

import {
  AnnotatedWordSegment,
  SandhiExplanation,
  tokenizeAndAnnotate,
} from './zhuyinTokenizer.ts';
import { UserProgressState } from './progressStore.ts';
import { getFullVocabularyCatalog } from '../data/vocabularyCatalog.ts';

export type WordFamiliarityTier = 'known' | 'familiar' | 'target_i_plus_1';

export type ComprehensibilityZone =
  | 'optimal_i_plus_1'
  | 'fluent_review'
  | 'intensive_scaffolding';

export interface AnalyzedWordSegment extends AnnotatedWordSegment {
  tier: WordFamiliarityTier;
  effectiveLevel: 0 | 1 | 2 | 3;
  englishGloss?: string;
}

export interface PassageComprehensibilityReport {
  rawText: string;
  totalChineseWords: number;
  knownWordsCount: number;
  familiarWordsCount: number;
  targetIPlus1Count: number;
  knownPercentage: number;
  familiarPercentage: number;
  targetIPlus1Percentage: number;
  comprehensibilityScore: number; // Weighted: Known + 0.5 * Familiar
  zone: ComprehensibilityZone;
  zoneLabel: string;
  zoneBadgeClass: string;
  elapsedMs: number;
  segments: AnalyzedWordSegment[];
  targetWords: AnalyzedWordSegment[];
  sandhiNotes: SandhiExplanation[];
}

export interface ClozeOption {
  traditional: string;
  zhuyin: string;
  english: string;
}

export interface GeneratedClozeItem {
  id: string;
  sentenceTraditional: string;
  sentenceWithBlank: string;
  targetWord: string;
  targetZhuyin: string;
  targetEnglish: string;
  options: ClozeOption[];
  correctIndex: number;
  isPolyphone: boolean;
  moeNote?: string;
}

// High-frequency core Novice 1 function characters treated as baseline Known (Lv.2) unless lapsed
const BASELINE_KNOWN_FUNCTION_CHARS = new Set([
  '我', '你', '他', '她', '們', '是', '的', '了', '在', '有',
  '不', '這', '那', '嗎', '呢', '吧', '和', '個', '人', '一',
  '二', '三', '上', '下', '好', '去', '來', '要', '會', '看',
  '吃', '喝', '說', '到', '也', '都', '很', '天', '大', '小',
]);

/**
 * Evaluates effective familiarity level (0..3) of a segmented Chinese word against UserProgressState.
 */
export function evaluateWordFamiliarity(
  wordText: string,
  progress: UserProgressState
): { level: 0 | 1 | 2 | 3; tier: WordFamiliarityTier } {
  const directWord = progress.wordMastery[wordText];
  if (directWord) {
    const lv = directWord.level;
    return {
      level: lv,
      tier: lv >= 2 ? 'known' : lv === 1 ? 'familiar' : 'target_i_plus_1',
    };
  }

  const chars = Array.from(wordText);
  let minCharLevel: number | null = null;
  let allBaseline = true;

  for (const ch of chars) {
    const rec = progress.charMastery[ch];
    if (rec) {
      minCharLevel = minCharLevel === null ? rec.level : Math.min(minCharLevel, rec.level);
      allBaseline = false;
    } else if (BASELINE_KNOWN_FUNCTION_CHARS.has(ch)) {
      minCharLevel = minCharLevel === null ? 2 : Math.min(minCharLevel, 2);
    } else {
      minCharLevel = 0;
      allBaseline = false;
    }
  }

  if (allBaseline && chars.length <= 2) {
    return { level: 2, tier: 'known' };
  }

  const resolved = (minCharLevel ?? 0) as 0 | 1 | 2 | 3;
  return {
    level: resolved,
    tier: resolved >= 2 ? 'known' : resolved === 1 ? 'familiar' : 'target_i_plus_1',
  };
}

/**
 * Segments a Traditional Chinese passage in a single FMM pass (< 50 ms for 2,000 chars)
 * and computes live Known (Lv.2+), Familiar (Lv.1), and Target i+1 (Unseen) metrics (FORM-REQ-0006, FORM-REQ-0007).
 */
export function analyzePassageComprehensibility(
  text: string,
  progress: UserProgressState
): PassageComprehensibilityReport {
  const startMs = typeof performance !== 'undefined' ? performance.now() : Date.now();
  const tokenized = tokenizeAndAnnotate(text);
  const catalog = getFullVocabularyCatalog();
  const glossByWord = new Map<string, string>();
  for (const item of catalog) {
    if (!glossByWord.has(item.traditional)) {
      glossByWord.set(item.traditional, item.english);
    }
  }

  let totalChineseWords = 0;
  let knownWordsCount = 0;
  let familiarWordsCount = 0;
  let targetIPlus1Count = 0;

  const analyzedSegments: AnalyzedWordSegment[] = [];
  const targetMap = new Map<string, AnalyzedWordSegment>();

  for (const seg of tokenized.words) {
    if (!seg.isChinese) {
      analyzedSegments.push({
        ...seg,
        tier: 'known',
        effectiveLevel: 3,
      });
      continue;
    }

    totalChineseWords++;
    const { level, tier } = evaluateWordFamiliarity(seg.text, progress);
    if (tier === 'known') knownWordsCount++;
    else if (tier === 'familiar') familiarWordsCount++;
    else targetIPlus1Count++;

    const gloss =
      glossByWord.get(seg.text) ||
      seg.moeInfo?.english ||
      seg.chars.map((c) => c.meaning).filter(Boolean).join(' / ') ||
      undefined;

    const analyzed: AnalyzedWordSegment = {
      ...seg,
      tier,
      effectiveLevel: level,
      englishGloss: gloss,
    };
    analyzedSegments.push(analyzed);

    if ((tier === 'target_i_plus_1' || seg.isPolyphoneWord) && !targetMap.has(seg.text)) {
      targetMap.set(seg.text, analyzed);
    }
  }

  const denom = Math.max(1, totalChineseWords);
  const knownPercentage = Math.round((knownWordsCount / denom) * 100);
  const familiarPercentage = Math.round((familiarWordsCount / denom) * 100);
  const targetIPlus1Percentage = Math.max(
    0,
    100 - knownPercentage - familiarPercentage
  );
  const comprehensibilityScore = Math.min(
    100,
    Math.round(((knownWordsCount + 0.5 * familiarWordsCount) / denom) * 100)
  );

  let zone: ComprehensibilityZone;
  let zoneLabel: string;
  let zoneBadgeClass: string;

  if (comprehensibilityScore >= 90 && comprehensibilityScore <= 98) {
    zone = 'optimal_i_plus_1';
    zoneLabel = `${comprehensibilityScore}% Known · Optimal i+1 Zone (最佳 i+1 閱讀區)`;
    zoneBadgeClass = 'bg-emerald-950/80 text-emerald-300 border-emerald-400/60';
  } else if (comprehensibilityScore > 98) {
    zone = 'fluent_review';
    zoneLabel = `${comprehensibilityScore}% Known · Fluent Review Zone (流利鞏固區)`;
    zoneBadgeClass = 'bg-sky-950/80 text-sky-300 border-sky-400/60';
  } else {
    zone = 'intensive_scaffolding';
    zoneLabel = `${comprehensibilityScore}% Known · Intensive Scaffolding Zone (密集輔助區)`;
    zoneBadgeClass = 'bg-amber-950/80 text-amber-200 border-amber-400/60';
  }

  const endMs = typeof performance !== 'undefined' ? performance.now() : Date.now();

  return {
    rawText: text,
    totalChineseWords,
    knownWordsCount,
    familiarWordsCount,
    targetIPlus1Count,
    knownPercentage,
    familiarPercentage,
    targetIPlus1Percentage,
    comprehensibilityScore,
    zone,
    zoneLabel,
    zoneBadgeClass,
    elapsedMs: Number(Math.max(0.01, endMs - startMs).toFixed(2)),
    segments: analyzedSegments,
    targetWords: Array.from(targetMap.values()),
    sandhiNotes: tokenized.sandhiExplanations,
  };
}

/**
 * Generates interactive multiple-choice sentence cloze drills from target i+1 & polyphone words
 * in any graded story or custom pasted passage (FORM-REQ-0007).
 */
export function generatePassageClozes(
  text: string,
  progress: UserProgressState,
  maxItems = 6
): GeneratedClozeItem[] {
  const sentences = text
    .split(/(?<=[。！？!?])\s*|\r?\n/)
    .map((s) => s.trim())
    .filter((s) => s.length >= 5);

  const catalog = getFullVocabularyCatalog();
  const clozes: GeneratedClozeItem[] = [];
  const usedTargets = new Set<string>();

  for (let sIdx = 0; sIdx < sentences.length && clozes.length < maxItems; sIdx++) {
    const sentence = sentences[sIdx];
    const report = analyzePassageComprehensibility(sentence, progress);

    // Prefer >= 2-char target i+1 words or polyphone words, then fallback to any >= 2-char word
    const candidates = report.segments.filter(
      (seg) => seg.isChinese && seg.text.length >= 2 && !usedTargets.has(seg.text)
    );
    if (candidates.length === 0) continue;

    candidates.sort((a, b) => {
      const scoreA =
        (a.tier === 'target_i_plus_1' ? 4 : a.tier === 'familiar' ? 2 : 0) +
        (a.isPolyphoneWord ? 3 : 0) +
        (a.moeInfo ? 2 : 0);
      const scoreB =
        (b.tier === 'target_i_plus_1' ? 4 : b.tier === 'familiar' ? 2 : 0) +
        (b.isPolyphoneWord ? 3 : 0) +
        (b.moeInfo ? 2 : 0);
      return scoreB - scoreA;
    });

    const chosen = candidates[0];
    usedTargets.add(chosen.text);

    const sentenceWithBlank = sentence.replace(chosen.text, ' ______ ');
    const targetEnglish = chosen.englishGloss || 'target vocabulary in context';

    // Select 3 deterministic distractors matching word length where possible
    const distractorPool = catalog.filter(
      (v) => v.traditional !== chosen.text && v.traditional.length === chosen.text.length
    );
    const fallbackPool = catalog.filter((v) => v.traditional !== chosen.text);
    const activePool = distractorPool.length >= 3 ? distractorPool : fallbackPool;

    const distractors: ClozeOption[] = [];
    for (let k = 0; k < activePool.length && distractors.length < 3; k++) {
      const idx = (sIdx * 7 + k * 13) % activePool.length;
      const cand = activePool[idx];
      if (!distractors.some((d) => d.traditional === cand.traditional)) {
        distractors.push({
          traditional: cand.traditional,
          zhuyin: cand.zhuyin,
          english: cand.english,
        });
      }
    }

    const correctOption: ClozeOption = {
      traditional: chosen.text,
      zhuyin: chosen.writtenZhuyin,
      english: targetEnglish,
    };

    const insertPos = sIdx % 4;
    const options = [...distractors];
    options.splice(insertPos, 0, correctOption);

    clozes.push({
      id: `cloze-${sIdx}-${chosen.text}`,
      sentenceTraditional: sentence,
      sentenceWithBlank,
      targetWord: chosen.text,
      targetZhuyin: chosen.writtenZhuyin,
      targetEnglish,
      options,
      correctIndex: options.findIndex((o) => o.traditional === chosen.text),
      isPolyphone: chosen.isPolyphoneWord,
      moeNote: chosen.moeInfo?.moeNote,
    });
  }

  return clozes;
}
