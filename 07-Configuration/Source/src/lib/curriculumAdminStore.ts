/**
 * FormosaStudio (FORM) — Curriculum & Resource Admin Manager Store (Pimsleur, NTNU Contemporary Chinese & Custom Packs)
 * Supports .docx (XML extraction), .txt, .csv, .json, and structured paste with automatic Taiwan MOE FMM Zhuyin tokenization.
 * Traces to: FORM-REQ-0022, FORM-REQ-0001, FORM-REQ-0002, FORM-REQ-0003, FORM-REQ-0005
 */

import { getDaqianKeysForWord, normalizeZhuyinString } from './zhuyinTypes.ts';
import {
  POLYPHONE_PAIRS,
  SandhiExplanation,
  registerDynamicLexiconWord,
  tokenizeAndAnnotate,
} from './zhuyinTokenizer.ts';
import { PimsleurDialogueItem, PimsleurUnitData, PimsleurVocabItem } from '../data/pimsleurUnitsA.ts';
import {
  ContemporaryLessonOverview,
  ContemporaryVolumeOverview,
} from '../data/contemporaryVols1to2.ts';

export type ResourcePackType = 'pimsleur_unit' | 'ntnu_lesson';

export interface ParsedResourceRow {
  id: string;
  rowType: 'vocab' | 'dialogue' | 'grammar';
  traditional: string;
  english: string;
  zhuyin: string;
  spokenZhuyin: string;
  pinyin: string;
  daqianKeys: string;
  polyphoneOptions: { char: string; currentZhuyin: string; choices: string[] }[];
  sandhiNotes: SandhiExplanation[];
}

export interface CustomCurriculumPack {
  id: string;
  packType: ResourcePackType;
  unitOrVolume: number;
  lessonNumber?: number;
  titleTraditional: string;
  titleEnglish: string;
  subtitleOrTopic: string;
  cefrRange: string;
  tocflBand: string;
  culturalNote?: string;
  rows: ParsedResourceRow[];
  createdAt: string;
}

export interface ResourceAdminState {
  schemaVersion: 'formosa-admin-resources-v1';
  packs: CustomCurriculumPack[];
}

const ADMIN_STORAGE_KEY = 'formosa_curriculum_admin_packs_v1';
let memoryPacks: CustomCurriculumPack[] = [];
const changeListeners = new Set<() => void>();

function notifyAdminChanges(): void {
  for (const fn of changeListeners) {
    fn();
  }
}

export function subscribeCurriculumAdminChanges(listener: () => void): () => void {
  changeListeners.add(listener);
  return () => {
    changeListeners.delete(listener);
  };
}

/**
 * Annotates a single Traditional Chinese string using the Taiwan MOE FMM polyphone tokenizer.
 */
export function buildAnnotatedResourceRow(
  input: {
    id?: string;
    rowType?: 'vocab' | 'dialogue' | 'grammar';
    traditional: string;
    english: string;
    zhuyinOverride?: string;
    pinyinOverride?: string;
  }
): ParsedResourceRow {
  const cleanTrad = input.traditional.trim();
  const tokenized = tokenizeAndAnnotate(cleanTrad, input.zhuyinOverride);
  const writtenZhuyin = input.zhuyinOverride
    ? normalizeZhuyinString(input.zhuyinOverride)
    : tokenized.writtenZhuyinString;

  const daqian = getDaqianKeysForWord(writtenZhuyin)
    .map((d) => `${d.syllable}[${d.keys}]`)
    .join(' · ');

  const approxPinyin =
    input.pinyinOverride?.trim() ||
    tokenized.chars
      .filter((c) => c.isChinese && c.pinyin)
      .map((c) => c.pinyin)
      .join(' ');

  const polyphoneOptions: { char: string; currentZhuyin: string; choices: string[] }[] = [];
  for (const tok of tokenized.chars) {
    if (!tok.isChinese || !tok.isPolyphone) continue;
    const pairSpec = POLYPHONE_PAIRS.find((p) => p.char === tok.char);
    if (pairSpec) {
      polyphoneOptions.push({
        char: tok.char,
        currentZhuyin: tok.zhuyin?.normalized || '',
        choices: pairSpec.readings.map((r) => r.zhuyin),
      });
    }
  }

  return {
    id: input.id || `row-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    rowType: input.rowType || (cleanTrad.length > 6 ? 'dialogue' : 'vocab'),
    traditional: cleanTrad,
    english: input.english.trim(),
    zhuyin: writtenZhuyin,
    spokenZhuyin: tokenized.spokenZhuyinString,
    pinyin: approxPinyin,
    daqianKeys: daqian,
    polyphoneOptions,
    sandhiNotes: tokenized.sandhiExplanations,
  };
}

/**
 * Extracts text from a .docx XML payload or raw text buffer.
 */
export function extractTextFromDocxOrXml(rawContent: string): string {
  if (rawContent.includes('<w:t')) {
    const paragraphs: string[] = [];
    const pBlocks = rawContent.split(/<\/w:p>/i);
    for (const block of pBlocks) {
      const matches = Array.from(block.matchAll(/<w:t(?:\s[^>]*)?>([^<]*)<\/w:t>/gi));
      if (matches.length > 0) {
        const line = matches.map((m) => m[1]).join('').trim();
        if (line) paragraphs.push(line);
      }
    }
    if (paragraphs.length > 0) {
      return paragraphs.join('\n');
    }
  }
  return rawContent;
}

/**
 * Multi-format ingestion parser supporting .json, .csv, .tsv, .txt, and .docx XML text (FORM-REQ-0022).
 */
export function parseRawResourceMaterial(
  rawInput: string,
  formatHint: 'auto' | 'json' | 'csv' | 'txt' | 'docx' = 'auto'
): ParsedResourceRow[] {
  const trimmed = extractTextFromDocxOrXml(rawInput).trim();
  if (!trimmed) return [];

  // 1. JSON format check
  if (formatHint === 'json' || trimmed.startsWith('{') || trimmed.startsWith('[')) {
    try {
      const parsed = JSON.parse(trimmed);
      const rawItems = Array.isArray(parsed)
        ? parsed
        : Array.isArray(parsed.rows)
        ? parsed.rows
        : Array.isArray(parsed.vocab)
        ? [
            ...parsed.vocab.map((v: Record<string, string>) => ({ ...v, rowType: 'vocab' })),
            ...(Array.isArray(parsed.dialogues)
              ? parsed.dialogues.map((d: Record<string, string>) => ({ ...d, rowType: 'dialogue' }))
              : []),
          ]
        : [];
      return rawItems
        .filter((it: Record<string, string>) => it && typeof it.traditional === 'string')
        .map((it: Record<string, string>, idx: number) =>
          buildAnnotatedResourceRow({
            id: `json-row-${idx}`,
            rowType:
              it.rowType === 'dialogue' || it.rowType === 'grammar' ? it.rowType : 'vocab',
            traditional: it.traditional,
            english: it.english || '',
            zhuyinOverride: it.zhuyin,
            pinyinOverride: it.pinyin,
          })
        );
    } catch {
      // Fall through to line-based parser
    }
  }

  // 2. Line-by-line CSV / Pipe / Tab / Pimsleur-Reference parser
  const lines = trimmed
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l && !l.startsWith('#') && !l.startsWith('//'));

  const rows: ParsedResourceRow[] = [];
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (/^(traditional|chinese)\s*[,|\t]/i.test(line)) {
      continue; // Skip header row
    }

    let parts: string[] = [];
    if (line.includes('|')) {
      parts = line.split('|').map((s) => s.trim());
    } else if (line.includes('\t')) {
      parts = line.split('\t').map((s) => s.trim());
    } else if (line.includes(',')) {
      parts = line.split(',').map((s) => s.trim());
    }

    if (parts.length >= 2) {
      // Detect whether column 0 or column 1 has CJK characters
      const firstHasCjk = /[\u4e00-\u9fff]/.test(parts[0]);
      const secondHasCjk = /[\u4e00-\u9fff]/.test(parts[1]);
      const traditional = firstHasCjk ? parts[0] : secondHasCjk ? parts[1] : parts[0];
      const english = firstHasCjk ? parts[1] : parts[0];
      const zhuyinOverride = parts[2] && /[ㄅ-ㄩ]/.test(parts[2]) ? parts[2] : undefined;
      const rowType =
        parts[3] === 'dialogue' || parts[3] === 'grammar'
          ? (parts[3] as 'dialogue' | 'grammar')
          : traditional.length > 6
          ? 'dialogue'
          : 'vocab';

      if (/[\u4e00-\u9fff]/.test(traditional)) {
        rows.push(
          buildAnnotatedResourceRow({
            id: `line-row-${i}`,
            rowType,
            traditional,
            english,
            zhuyinOverride,
          })
        );
      }
    }
  }

  return rows;
}

export function loadCustomCurriculumPacks(): CustomCurriculumPack[] {
  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      const raw = window.localStorage.getItem(ADMIN_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as ResourceAdminState;
        if (Array.isArray(parsed.packs)) {
          memoryPacks = parsed.packs;
        }
      }
    } catch {
      // Fallback to in-memory store
    }
  }
  return [...memoryPacks];
}

function persistCustomPacks(packs: CustomCurriculumPack[]): void {
  memoryPacks = [...packs];
  for (const pack of memoryPacks) {
    for (const row of pack.rows) {
      if (row.rowType === 'vocab' && row.traditional.length >= 2 && row.zhuyin) {
        registerDynamicLexiconWord(row.traditional, row.zhuyin);
      }
    }
  }
  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      const payload: ResourceAdminState = {
        schemaVersion: 'formosa-admin-resources-v1',
        packs: memoryPacks,
      };
      window.localStorage.setItem(ADMIN_STORAGE_KEY, JSON.stringify(payload));
    } catch {
      // Ignore storage error
    }
  }
  notifyAdminChanges();
}

export function publishCustomCurriculumPack(
  input: Omit<CustomCurriculumPack, 'id' | 'createdAt'> & { id?: string }
): CustomCurriculumPack {
  const existing = loadCustomCurriculumPacks();
  const pack: CustomCurriculumPack = {
    ...input,
    id: input.id || `pack-${input.packType}-${Date.now()}`,
    createdAt: new Date().toISOString(),
  };

  const filtered = existing.filter((p) => p.id !== pack.id);
  persistCustomPacks([...filtered, pack]);
  return pack;
}

export function removeCustomCurriculumPack(packId: string): CustomCurriculumPack[] {
  const next = loadCustomCurriculumPacks().filter((p) => p.id !== packId);
  persistCustomPacks(next);
  return next;
}

export function clearCustomCurriculumPacks(): void {
  persistCustomPacks([]);
}

/**
 * Converts user-added Pimsleur packs into PimsleurUnitData objects (Pattern 21).
 */
export function getCustomPimsleurUnits(): PimsleurUnitData[] {
  return loadCustomCurriculumPacks()
    .filter((p) => p.packType === 'pimsleur_unit')
    .map((p) => {
      const vocab: PimsleurVocabItem[] = p.rows
        .filter((r) => r.rowType === 'vocab')
        .map((r) => ({
          traditional: r.traditional,
          simplified: r.traditional,
          english: r.english,
          zhuyin: r.zhuyin,
          pinyin: r.pinyin,
        }));
      const dialogues: PimsleurDialogueItem[] = p.rows
        .filter((r) => r.rowType === 'dialogue')
        .map((r) => ({
          traditional: r.traditional,
          simplified: r.traditional,
          english: r.english,
          zhuyin: r.zhuyin,
          pinyin: r.pinyin,
        }));
      return {
        unit: p.unitOrVolume,
        title: `Unit ${p.unitOrVolume}: ${p.titleEnglish || p.titleTraditional}`,
        subtitle: p.subtitleOrTopic,
        vocab,
        dialogues,
      };
    });
}

/**
 * Merges user-added NTNU Contemporary Chinese lessons into the volume hierarchy (Pattern 21).
 */
export function mergeCustomContemporaryVolumes(
  baseVolumes: ContemporaryVolumeOverview[]
): ContemporaryVolumeOverview[] {
  const customLessons = loadCustomCurriculumPacks().filter((p) => p.packType === 'ntnu_lesson');
  if (customLessons.length === 0) return baseVolumes;

  const cloned: ContemporaryVolumeOverview[] = baseVolumes.map((v) => ({
    ...v,
    lessons: [...v.lessons],
  }));

  for (const pack of customLessons) {
    let targetVol = cloned.find((v) => v.volume === pack.unitOrVolume);
    if (!targetVol) {
      targetVol = {
        volume: pack.unitOrVolume,
        titleTraditional: `當代中文課程 第${pack.unitOrVolume}冊 (Custom Volume ${pack.unitOrVolume})`,
        titleEnglish: `A Course in Contemporary Chinese — Volume ${pack.unitOrVolume}`,
        cefrRange: pack.cefrRange || 'CEFR B1',
        tocflBand: pack.tocflBand || 'Band A · Level 2 (基礎級)',
        focus: pack.subtitleOrTopic,
        lessons: [],
      };
      cloned.push(targetVol);
    }

    const firstDialogue = pack.rows.find((r) => r.rowType === 'dialogue') || pack.rows[0];
    const grammarRows = pack.rows.filter((r) => r.rowType === 'grammar');
    const vocabRows = pack.rows.filter((r) => r.rowType === 'vocab');
    const lessonNum = pack.lessonNumber || targetVol.lessons.length + 1;
    const titleTokenized = tokenizeAndAnnotate(pack.titleTraditional);

    const newLesson: ContemporaryLessonOverview = {
      lesson: lessonNum,
      titleTraditional: pack.titleTraditional,
      titleZhuyin: titleTokenized.writtenZhuyinString,
      titleEnglish: pack.titleEnglish,
      topic: pack.subtitleOrTopic,
      grammarPoints:
        grammarRows.length > 0
          ? grammarRows.map((g) => `${g.traditional} (${g.english})`)
          : vocabRows.slice(0, 3).map((v) => `${v.traditional}: ${v.english}`),
      culturalNote: pack.culturalNote,
      keyVocab: vocabRows.map((v) => ({
        traditional: v.traditional,
        zhuyin: v.zhuyin,
        pinyin: v.pinyin,
        english: v.english,
      })),
      sampleSentence: firstDialogue
        ? {
            traditional: firstDialogue.traditional,
            zhuyin: firstDialogue.zhuyin,
            english: firstDialogue.english,
          }
        : {
            traditional: pack.titleTraditional,
            zhuyin: titleTokenized.writtenZhuyinString,
            english: pack.titleEnglish,
          },
    };

    targetVol.lessons = [
      ...targetVol.lessons.filter((l) => l.lesson !== lessonNum),
      newLesson,
    ].sort((a, b) => a.lesson - b.lesson);
  }

  return cloned.sort((a, b) => a.volume - b.volume);
}

export function exportCustomCurriculumPacksJson(): string {
  const payload: ResourceAdminState = {
    schemaVersion: 'formosa-admin-resources-v1',
    packs: loadCustomCurriculumPacks(),
  };
  return JSON.stringify(payload, null, 2);
}

export function importCustomCurriculumPacksJson(rawJson: string): CustomCurriculumPack[] {
  const parsed = JSON.parse(rawJson) as Partial<ResourceAdminState>;
  if (!parsed || !Array.isArray(parsed.packs)) {
    throw new Error('Invalid Curriculum Resource Pack JSON schema.');
  }
  persistCustomPacks(parsed.packs);
  return loadCustomCurriculumPacks();
}
