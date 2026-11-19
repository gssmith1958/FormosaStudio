/**
 * FormosaStudio (FORM) — 3-Step Guided Curriculum & Resource Admin Modal
 * Allows uploading/pasting additional Pimsleur (.docx/.txt/.csv/.json) and NTNU Contemporary Chinese materials,
 * previewing/editing Taiwan MOE Zhuyin & polyphone (破音字) readings, and publishing live across all 6 studios.
 * Traces to: FORM-REQ-0022, FORM-REQ-0021, FORM-DEP-UX-001
 */

import React, { useState } from 'react';
import {
  CustomCurriculumPack,
  ParsedResourceRow,
  ResourcePackType,
  buildAnnotatedResourceRow,
  exportCustomCurriculumPacksJson,
  importCustomCurriculumPacksJson,
  loadCustomCurriculumPacks,
  parseRawResourceMaterial,
  publishCustomCurriculumPack,
  removeCustomCurriculumPack,
} from '../lib/curriculumAdminStore.ts';
import { StudioModeSwitcher, StylusButton } from './uiPrimitives.tsx';
import { RubyText } from './RubyText.tsx';

export interface ResourceAdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPacksUpdated?: (packs: CustomCurriculumPack[]) => void;
}

const SAMPLE_PIMSLEUR_TEMPLATE = `Unit 20 | Pimsleur Mandarin I - Unit 20
銀行 | bank | ㄧㄣˊ ㄏㄤˊ | vocab
還錢 | repay money | ㄏㄨㄢˊ ㄑㄧㄢˊ | vocab
會計師 | accountant | ㄎㄨㄞˋ ㄐㄧˋ ㄕ | vocab
請問銀行在哪裡？我去銀行還錢。 | Excuse me, where is the bank? I am going to the bank to repay money. | | dialogue`;

const SAMPLE_NTNU_TEMPLATE = `垃圾車 | musical garbage truck | ㄌㄜˋ ㄙㄜˋ ㄔㄜ | vocab
環保杯 | reusable eco-cup | ㄏㄨㄢˊ ㄅㄠˇ ㄅㄟ | vocab
打八折 | 20% discount (80% of price) | ㄉㄚˇ ㄅㄚ ㄓㄜˊ | vocab
自備環保杯不但能減少垃圾，還可以折五塊錢。 | Bringing your own eco-cup not only reduces trash, but saves NT$5. | | dialogue`;

export const ResourceAdminModal: React.FC<ResourceAdminModalProps> = ({
  isOpen,
  onClose,
  onPacksUpdated,
}) => {
  const [step, setStep] = useState<'1_upload' | '2_preview' | '3_manage'>('1_upload');
  const [packType, setPackType] = useState<ResourcePackType>('pimsleur_unit');
  const [unitOrVolume, setUnitOrVolume] = useState<number>(20);
  const [lessonNumber, setLessonNumber] = useState<number>(13);
  const [titleTraditional, setTitleTraditional] = useState<string>('銀行與還錢 · Banking & Payments');
  const [titleEnglish, setTitleEnglish] = useState<string>('Banking, Accounting & Repaying Money');
  const [subtitleOrTopic, setSubtitleOrTopic] = useState<string>('Taiwanese Banking & Everyday Finance');
  const [rawInput, setRawInput] = useState<string>(SAMPLE_PIMSLEUR_TEMPLATE);
  const [parsedRows, setParsedRows] = useState<ParsedResourceRow[]>(() =>
    parseRawResourceMaterial(SAMPLE_PIMSLEUR_TEMPLATE)
  );
  const [savedPacks, setSavedPacks] = useState<CustomCurriculumPack[]>(() =>
    loadCustomCurriculumPacks()
  );
  const [statusMessage, setStatusMessage] = useState<string>('');

  if (!isOpen) return null;

  const handleParseMoveToStep2 = () => {
    const rows = parseRawResourceMaterial(rawInput);
    setParsedRows(rows);
    setStep('2_preview');
    setStatusMessage(`Parsed ${rows.length} items with Taiwan MOE FMM polyphone & sandhi annotation.`);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const text = await file.text();
    setRawInput(text);
    const rows = parseRawResourceMaterial(text);
    setParsedRows(rows);
    setStatusMessage(`Loaded "${file.name}" (${rows.length} annotated items).`);
    setStep('2_preview');
  };

  const handleUpdateRowZhuyin = (rowId: string, newZhuyin: string) => {
    setParsedRows((prev) =>
      prev.map((row) =>
        row.id === rowId
          ? buildAnnotatedResourceRow({
              id: row.id,
              rowType: row.rowType,
              traditional: row.traditional,
              english: row.english,
              zhuyinOverride: newZhuyin,
            })
          : row
      )
    );
  };

  const handlePublishPack = () => {
    if (parsedRows.length === 0) {
      setStatusMessage('Please add at least one vocabulary or dialogue row before publishing.');
      return;
    }
    publishCustomCurriculumPack({
      packType,
      unitOrVolume,
      lessonNumber: packType === 'ntnu_lesson' ? lessonNumber : undefined,
      titleTraditional,
      titleEnglish,
      subtitleOrTopic,
      cefrRange: packType === 'pimsleur_unit' ? 'CEFR A2' : 'CEFR B1',
      tocflBand:
        packType === 'pimsleur_unit'
          ? 'Band A · Level 1 (入門級)'
          : 'Band A · Level 2 (基礎級)',
      rows: parsedRows,
    });
    const updated = loadCustomCurriculumPacks();
    setSavedPacks(updated);
    if (onPacksUpdated) onPacksUpdated(updated);
    setStatusMessage(
      `Published "${titleEnglish}" (${parsedRows.length} items) — now live across all 6 studios!`
    );
    setStep('3_manage');
  };

  const handleExportPacks = () => {
    const json = exportCustomCurriculumPacksJson();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `formosa-custom-curriculum-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportPackJson = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const text = await file.text();
      const restored = importCustomCurriculumPacksJson(text);
      setSavedPacks(restored);
      if (onPacksUpdated) onPacksUpdated(restored);
      setStatusMessage(`Restored ${restored.length} curriculum packs.`);
    } catch (err) {
      setStatusMessage(err instanceof Error ? err.message : 'Failed to import JSON pack.');
    }
  };

  return (
    <div role="dialog" aria-modal="true" aria-label="Curriculum and Resource Admin Manager" className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-5xl w-full p-5 sm:p-7 space-y-5 shadow-2xl max-h-[92vh] overflow-y-auto">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div>
            <div className="text-xs font-extrabold uppercase tracking-wider text-emerald-400">
              ⚙️ Curriculum &amp; Resource Admin Manager (FORM-REQ-0022)
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-white">
              Add Pimsleur Units &amp; NTNU Contemporary Chinese Materials
            </h2>
          </div>
          <StylusButton variant="ghost" onClick={onClose}>
            ✕ Close Admin
          </StylusButton>
        </div>

        <StudioModeSwitcher
          modes={[
            { id: '1_upload', labelZh: '1. 匯入教材', labelEn: 'Upload / Paste Source' },
            { id: '2_preview', labelZh: '2. 注音與破音字校對', labelEn: 'MOE Zhuyin Preview', badge: parsedRows.length },
            { id: '3_manage', labelZh: '3. 已發佈教材包', labelEn: 'Published Packs', badge: savedPacks.length },
          ]}
          activeMode={step}
          onSelect={(m) => setStep(m)}
        />

        {statusMessage && (
          <div className="bg-emerald-950/70 border border-emerald-500/40 rounded-2xl px-4 py-2.5 text-xs sm:text-sm text-emerald-200 font-semibold">
            {statusMessage}
          </div>
        )}

        {step === '1_upload' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <StylusButton
                variant={packType === 'pimsleur_unit' ? 'primary' : 'secondary'}
                onClick={() => {
                  setPackType('pimsleur_unit');
                  setRawInput(SAMPLE_PIMSLEUR_TEMPLATE);
                }}
              >
                🎧 Pimsleur Unit Pack
              </StylusButton>
              <StylusButton
                variant={packType === 'ntnu_lesson' ? 'primary' : 'secondary'}
                onClick={() => {
                  setPackType('ntnu_lesson');
                  setRawInput(SAMPLE_NTNU_TEMPLATE);
                }}
              >
                📘 NTNU Contemporary Lesson
              </StylusButton>
              <label className="min-h-[44px] px-4 py-2 rounded-xl border border-emerald-500/50 bg-slate-950 hover:bg-slate-800 text-emerald-300 font-bold text-xs sm:text-sm flex items-center justify-center cursor-pointer">
                <span>📂 Upload .docx / .txt / .csv / .json</span>
                <input
                  type="file"
                  accept=".docx,.xml,.txt,.csv,.tsv,.json"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  {packType === 'pimsleur_unit' ? 'Pimsleur Unit #' : 'NTNU Volume # (1–6)'}
                </label>
                <input
                  type="number"
                  value={unitOrVolume}
                  onChange={(e) => setUnitOrVolume(Number(e.target.value) || 1)}
                  className="w-full min-h-[44px] bg-slate-950 border border-slate-700 rounded-xl px-3 text-white text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Traditional Title (標題)
                </label>
                <input
                  type="text"
                  value={titleTraditional}
                  onChange={(e) => setTitleTraditional(e.target.value)}
                  className="w-full min-h-[44px] bg-slate-950 border border-slate-700 rounded-xl px-3 text-white text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  English Title / Topic
                </label>
                <input
                  type="text"
                  value={titleEnglish}
                  onChange={(e) => setTitleEnglish(e.target.value)}
                  className="w-full min-h-[44px] bg-slate-950 border border-slate-700 rounded-xl px-3 text-white text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                Paste Vocabulary &amp; Dialogue Lines (`Traditional | English | Optional Zhuyin | vocab/dialogue`)
              </label>
              <textarea
                rows={6}
                value={rawInput}
                onChange={(e) => setRawInput(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-2xl p-3 text-xs sm:text-sm font-mono text-slate-100"
              />
            </div>

            <div className="flex justify-end">
              <StylusButton variant="primary" onClick={handleParseMoveToStep2}>
                Auto-Segment &amp; Preview Taiwan MOE Zhuyin →
              </StylusButton>
            </div>
          </div>
        )}

        {step === '2_preview' && (
          <div className="space-y-4">
            <div className="space-y-2.5 max-h-[46vh] overflow-y-auto pr-1">
              {parsedRows.map((row) => (
                <div
                  key={row.id}
                  className="bg-slate-950 border border-slate-800 rounded-2xl p-3.5 flex flex-col md:flex-row md:items-center justify-between gap-3"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded bg-slate-800 text-emerald-300 text-[10px] font-extrabold uppercase">
                        {row.rowType}
                      </span>
                      <span className="text-xs text-slate-300 font-semibold">{row.english}</span>
                    </div>
                    <RubyText text={row.traditional} zhuyin={row.zhuyin} size="md" />
                    <div className="text-[11px] text-slate-400 font-mono">
                      DaQian: {row.daqianKeys}
                    </div>
                  </div>

                  <div className="flex flex-col sm:items-end gap-2">
                    <input
                      type="text"
                      value={row.zhuyin}
                      onChange={(e) => handleUpdateRowZhuyin(row.id, e.target.value)}
                      className="min-h-[44px] bg-slate-900 border border-slate-700 rounded-xl px-3 text-xs text-emerald-300 font-bold"
                      aria-label={`Zhuyin override for ${row.traditional}`}
                    />
                    {row.polyphoneOptions.length > 0 && (
                      <div className="text-[11px] text-amber-300 font-semibold">
                        破音字 verified: {row.polyphoneOptions.map((p) => `${p.char}=${p.currentZhuyin}`).join(', ')}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap justify-between gap-3">
              <StylusButton variant="secondary" onClick={() => setStep('1_upload')}>
                ← Back to Source Editor
              </StylusButton>
              <StylusButton variant="primary" onClick={handlePublishPack}>
                ✓ Publish to All 6 Studios
              </StylusButton>
            </div>
          </div>
        )}

        {step === '3_manage' && (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-xs sm:text-sm text-slate-300 font-semibold">
                {savedPacks.length} custom curriculum pack(s) active across all 6 studios.
              </span>
              <div className="flex flex-wrap items-center gap-2">
                <StylusButton variant="secondary" onClick={handleExportPacks}>
                  ⬇️ Export Custom Packs (.json)
                </StylusButton>
                <label className="min-h-[44px] px-3.5 py-2 rounded-xl border border-slate-700 bg-slate-900 hover:bg-slate-800 text-slate-200 font-bold text-xs flex items-center cursor-pointer">
                  <span>⬆️ Restore Packs (.json)</span>
                  <input type="file" accept=".json" onChange={handleImportPackJson} className="hidden" />
                </label>
              </div>
            </div>

            {savedPacks.map((pack) => (
              <div
                key={pack.id}
                className="bg-slate-950 border border-slate-800 rounded-2xl p-4 flex items-center justify-between gap-3"
              >
                <div>
                  <div className="text-sm font-extrabold text-white">
                    {pack.titleTraditional} · {pack.titleEnglish}
                  </div>
                  <div className="text-xs text-slate-400">
                    {pack.packType === 'pimsleur_unit'
                      ? `Pimsleur Unit ${pack.unitOrVolume}`
                      : `NTNU Vol.${pack.unitOrVolume} Lesson ${pack.lessonNumber}`}{' '}
                    · {pack.rows.length} items
                  </div>
                </div>
                <StylusButton
                  variant="danger"
                  onClick={() => {
                    const next = removeCustomCurriculumPack(pack.id);
                    setSavedPacks(next);
                    if (onPacksUpdated) onPacksUpdated(next);
                  }}
                >
                  Remove
                </StylusButton>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
