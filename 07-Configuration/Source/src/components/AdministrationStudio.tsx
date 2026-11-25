/**
 * FormosaStudio (FORM) — Standalone Administration Workspace
 * Consolidates 4 administrative areas cleanly outside daily learning:
 *   1. Lesson Materials (Full Create/Edit/Delete CRUD for Pimsleur, NTNU & Custom Scenarios bound to Stages 0-5)
 *   2. Audio, Voice & iPad Self-Test (live diagnostics + 2s mic/YIN latency & audio/mp4 replay check)
 *   3. Unified Backup & Desktop <-> iPad JSON Transfer (bundles progress + custom packs in one file)
 *   4. Preferences & Hardware (Theme, Pinyin, Zhuyin Fade, Wacom Handedness, Voice Preset, Quiet Room)
 * Traces to: FORM-ECR-001, FORM-DEC-005, FORM-WF-007, FORM-WF-008, ARCH-3, DSP-2
 */

import React, { useRef, useState } from 'react';
import {
  CustomCurriculumPack,
  ParsedResourceRow,
  ResourcePackType,
  buildAnnotatedResourceRow,
  exportCustomPacksData,
  importCustomPacksData,
  loadCustomCurriculumPacks,
  parseRawResourceMaterial,
  publishCustomCurriculumPack,
  removeCustomCurriculumPack,
} from '../lib/curriculumAdminStore.ts';
import {
  ThemeMode,
  UserProgressState,
  VoicePitchPreset,
  ZhuyinDisplayMode,
  exportProgressJson,
  extractCustomPacksFromBackupJson,
  importProgressJson,
} from '../lib/progressStore.ts';
import {
  ActiveMicHandle,
  AudioSelfTestReport,
  MicCaptureResult,
  playRecordedThenNative,
  runAudioDiagnostics,
  startMicToneSession,
} from '../lib/audioSessionManager.ts';
import { StageNumber } from '../lib/syllabusModel.ts';
import { RubyText } from './RubyText.tsx';
import { StudioModeOption, StudioModeSwitcher, StylusButton } from './uiPrimitives.tsx';

type AdminTab = 'materials' | 'audio_diag' | 'backup' | 'preferences';

const ADMIN_TABS: StudioModeOption<AdminTab>[] = [
  { id: 'materials', labelEn: 'Lesson Materials (CRUD)', labelZh: '教材管理' },
  { id: 'audio_diag', labelEn: 'Audio & iPad Self-Test', labelZh: '音訊診斷' },
  { id: 'backup', labelEn: 'Backup & Transfer', labelZh: '備份與同步' },
  { id: 'preferences', labelEn: 'Preferences & Hardware', labelZh: '偏好與硬體' },
];

const SAMPLE_BY_TYPE: Record<ResourcePackType, string> = {
  pimsleur_unit: `銀行 | bank | ㄧㄣˊ ㄏㄤˊ | vocab\n還錢 | repay money | ㄏㄨㄢˊ ㄑㄧㄢˊ | vocab\n請問銀行在哪裡？ | Excuse me, where is the bank? | | dialogue`,
  ntnu_lesson: `環保杯 | reusable eco-cup | ㄏㄨㄢˊ ㄅㄠˇ ㄅㄟ | vocab\n打八折 | 20% off (pay 80%) | ㄉㄚˇ ㄅㄚ ㄓㄜˊ | vocab\n自備環保杯可以折五塊。 | Bringing an eco-cup saves NT$5. | | dialogue`,
  custom_scenario: `悠遊卡 | EasyCard | ㄧㄡ ㄧㄡˊ ㄎㄚˇ | vocab\n載具 | e-invoice barcode | ㄗㄞˋ ㄐㄩˋ | vocab\n我刷悠遊卡，不需要袋子。 | I will tap EasyCard, no bag needed. | | dialogue`,
};

export interface AdministrationStudioProps {
  progress: UserProgressState;
  onUpdateProgress: (next: UserProgressState) => void;
  onPacksUpdated: () => void;
  onSpeak?: (text: string, rate?: number) => void;
}

export const AdministrationStudio: React.FC<AdministrationStudioProps> = ({
  progress,
  onUpdateProgress,
  onPacksUpdated,
  onSpeak,
}) => {
  const [tab, setTab] = useState<AdminTab>('materials');

  // 1. CRUD Material Manager state
  const [editingPackId, setEditingPackId] = useState<string | null>(null);
  const [packType, setPackType] = useState<ResourcePackType>('custom_scenario');
  const [unitOrVolume, setUnitOrVolume] = useState<number>(20);
  const [lessonNumber, setLessonNumber] = useState<number>(13);
  const [targetStage, setTargetStage] = useState<StageNumber>(1);
  const [titleTraditional, setTitleTraditional] = useState<string>('臺北生活補充包');
  const [titleEnglish, setTitleEnglish] = useState<string>('Custom Taipei Everyday Pack');
  const [subtitleOrTopic, setSubtitleOrTopic] = useState<string>('Personal Study Notes');
  const [rawInput, setRawInput] = useState<string>(SAMPLE_BY_TYPE.custom_scenario);
  const [parsedRows, setParsedRows] = useState<ParsedResourceRow[]>(() =>
    parseRawResourceMaterial(SAMPLE_BY_TYPE.custom_scenario)
  );
  const [savedPacks, setSavedPacks] = useState<CustomCurriculumPack[]>(() => loadCustomCurriculumPacks());
  const [crudStatus, setCrudStatus] = useState<string>('');

  // 2. Audio Diagnostics state
  const [diagReport, setDiagReport] = useState<AudioSelfTestReport | null>(null);
  const [micTesting, setMicTesting] = useState<boolean>(false);
  const [micSummary, setMicSummary] = useState<string>('');
  const [testCapture, setTestCapture] = useState<MicCaptureResult | null>(null);
  const micRef = useRef<ActiveMicHandle | null>(null);

  // 3. Backup Transfer state
  const [backupStatus, setBackupStatus] = useState<string>('');

  const handleParseMaterial = () => {
    const rows = parseRawResourceMaterial(rawInput);
    setParsedRows(rows);
    setCrudStatus(`Annotated ${rows.length} rows using Taiwan MOE FMM polyphone tokenizer.`);
  };

  const handleUploadMaterialFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const text = await file.text();
    setRawInput(text);
    const rows = parseRawResourceMaterial(text);
    setParsedRows(rows);
    setCrudStatus(`Loaded "${file.name}" (${rows.length} annotated items).`);
  };

  const handleUpdateRowZhuyin = (rowId: string, zh: string) => {
    setParsedRows((prev) =>
      prev.map((r) =>
        r.id === rowId
          ? buildAnnotatedResourceRow({ id: r.id, rowType: r.rowType, traditional: r.traditional, english: r.english, zhuyinOverride: zh })
          : r
      )
    );
  };

  const handleSavePack = () => {
    const rowsToSave = parsedRows.length > 0 ? parsedRows : parseRawResourceMaterial(rawInput);
    if (rowsToSave.length === 0) {
      setCrudStatus('Please enter at least one Traditional Chinese row (e.g. 悠遊卡 | EasyCard).');
      return;
    }
    publishCustomCurriculumPack({
      id: editingPackId || undefined,
      packType,
      unitOrVolume,
      lessonNumber: packType === 'ntnu_lesson' ? lessonNumber : undefined,
      targetStage,
      titleTraditional,
      titleEnglish,
      subtitleOrTopic,
      cefrRange: targetStage <= 1 ? 'A1' : targetStage === 2 ? 'A2' : targetStage === 3 ? 'B1' : 'B2',
      tocflBand: `Stage ${targetStage}`,
      rows: rowsToSave,
    });
    const next = loadCustomCurriculumPacks();
    setSavedPacks(next);
    setEditingPackId(null);
    onPacksUpdated();
    setCrudStatus(`${editingPackId ? 'Updated' : 'Published'} "${titleEnglish}" (${rowsToSave.length} items) live across Syllabus, Today's Session & Labs!`);
  };

  const handleStartEditPack = (pack: CustomCurriculumPack) => {
    setEditingPackId(pack.id);
    setPackType(pack.packType);
    setUnitOrVolume(pack.unitOrVolume);
    setLessonNumber(pack.lessonNumber || 1);
    setTargetStage((pack.targetStage ?? 1) as StageNumber);
    setTitleTraditional(pack.titleTraditional);
    setTitleEnglish(pack.titleEnglish);
    setSubtitleOrTopic(pack.subtitleOrTopic);
    setParsedRows(pack.rows);
    setRawInput(pack.rows.map((r) => `${r.traditional} | ${r.english} | ${r.zhuyin} | ${r.rowType}`).join('\n'));
    setCrudStatus(`Editing "${pack.titleEnglish}" — modify fields or rows, then click Update Pack.`);
  };

  const handleDeletePack = (packId: string) => {
    const next = removeCustomCurriculumPack(packId);
    setSavedPacks(next);
    if (editingPackId === packId) setEditingPackId(null);
    onPacksUpdated();
    setCrudStatus('Removed pack and rebuilt Taiwan MOE dynamic lexicon cleanly.');
  };

  const handleRunDiagnostics = () => {
    setDiagReport(runAudioDiagnostics());
  };

  const handleRunMicSelfTest = async () => {
    if (micTesting && micRef.current) {
      const res = await micRef.current.stop();
      micRef.current = null;
      setMicTesting(false);
      setTestCapture(res);
      setMicSummary(
        `Codec: ${res.mimeType || 'WebAudio'} · Avg YIN Frame: ${res.avgYinMs.toFixed(2)} ms · Pitch Frames: ${res.chaoFrames.length}${res.lastHz ? ` (${res.lastHz} Hz)` : ''}`
      );
      return;
    }
    try {
      setMicSummary('Recording 2-second test — say “媽 (mā)” or “臺灣 (Táiwān)”…');
      setMicTesting(true);
      const handle = await startMicToneSession({
        floorHz: 90,
        ceilingHz: 340,
        maxDurationMs: 2200,
        onAutoStop: (res) => {
          micRef.current = null;
          setMicTesting(false);
          setTestCapture(res);
          setMicSummary(
            `✓ Done! Codec: ${res.mimeType || 'WebAudio'} · Avg YIN: ${res.avgYinMs.toFixed(2)} ms/frame · Pitch Frames: ${res.chaoFrames.length}${res.lastHz ? ` (${res.lastHz} Hz)` : ''}`
          );
        },
      });
      micRef.current = handle;
    } catch {
      setMicTesting(false);
      setMicSummary('Microphone permission denied or unavailable. You can enable Quiet-Room Mode in Preferences.');
    }
  };

  const handleExportUnifiedBackup = () => {
    const customPacks = exportCustomPacksData();
    const json = exportProgressJson(progress, customPacks);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `formosastudio-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setBackupStatus(`Exported unified backup (${Object.keys(progress.wordMastery).length} words + ${customPacks.length} custom packs).`);
  };

  const handleImportUnifiedBackup = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const text = await file.text();
      const restoredState = importProgressJson(text);
      onUpdateProgress(restoredState);
      const restoredPacks = extractCustomPacksFromBackupJson(text);
      if (restoredPacks) {
        importCustomPacksData(restoredPacks as CustomCurriculumPack[]);
        setSavedPacks(loadCustomCurriculumPacks());
        onPacksUpdated();
      }
      setBackupStatus(
        `✓ Restored progress (${restoredState.xp} XP, ${Object.keys(restoredState.wordMastery).length} words${
          restoredPacks ? `, ${restoredPacks.length} custom packs` : ''
        }).`
      );
    } catch (err) {
      setBackupStatus(err instanceof Error ? err.message : 'Failed to parse backup JSON file.');
    }
  };

  return (
    <div className="space-y-5">
      <section className="fs-card p-5 sm:p-6 space-y-4">
        <div>
          <div className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--fs-accent-text)' }}>
            Standalone Administration Workspace · 系統與教材管理
          </div>
          <h1 className="text-2xl font-bold tracking-tight" style={{ color: 'var(--fs-text)' }}>
            Manage Custom Lessons, Audio Self-Test, Backups &amp; Preferences
          </h1>
        </div>
        <StudioModeSwitcher modes={ADMIN_TABS} activeMode={tab} onSelect={setTab} />
      </section>

      {/* TAB 1: LESSON MATERIALS CRUD */}
      {tab === 'materials' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          <section className="lg:col-span-7 fs-card p-5 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2 className="text-base font-bold" style={{ color: 'var(--fs-text)' }}>
                {editingPackId ? 'Edit Existing Lesson Material Pack' : 'Create / Import Lesson Material'}
              </h2>
              {editingPackId && (
                <StylusButton variant="ghost" onClick={() => setEditingPackId(null)}><span>Cancel Edit</span></StylusButton>
              )}
            </div>

            {crudStatus && (
              <div className="fs-subtle-box p-3 text-xs font-semibold" style={{ color: 'var(--fs-accent-text)' }}>
                {crudStatus}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {([
                { id: 'custom_scenario', label: 'Custom Scenario / Deck' },
                { id: 'pimsleur_unit', label: 'Pimsleur Unit' },
                { id: 'ntnu_lesson', label: 'NTNU Lesson' },
              ] as const).map((t) => (
                <StylusButton
                  key={t.id}
                  variant={packType === t.id ? 'primary' : 'secondary'}
                  onClick={() => {
                    setPackType(t.id);
                    if (!editingPackId) {
                      setRawInput(SAMPLE_BY_TYPE[t.id]);
                      setParsedRows(parseRawResourceMaterial(SAMPLE_BY_TYPE[t.id]));
                    }
                  }}
                >
                  <span>{t.label}</span>
                </StylusButton>
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold mb-1" style={{ color: 'var(--fs-text-secondary)' }}>
                  Target Syllabus Stage (0–5)
                </label>
                <select
                  value={targetStage}
                  onChange={(e) => setTargetStage(Number(e.target.value) as StageNumber)}
                  className="w-full min-h-[44px] px-3 rounded-xl border text-sm"
                  style={{ backgroundColor: 'var(--fs-subtle)', borderColor: 'var(--fs-border-strong)', color: 'var(--fs-text)' }}
                >
                  {[0, 1, 2, 3, 4, 5].map((s) => (
                    <option key={s} value={s}>Stage {s}</option>
                  ))}
                </select>
              </div>
              {packType !== 'custom_scenario' && (
                <div>
                  <label className="block text-xs font-bold mb-1" style={{ color: 'var(--fs-text-secondary)' }}>
                    {packType === 'pimsleur_unit' ? 'Pimsleur Unit #' : 'NTNU Volume # (1–6)'}
                  </label>
                  <input
                    type="number"
                    value={unitOrVolume}
                    onChange={(e) => setUnitOrVolume(Number(e.target.value) || 1)}
                    className="w-full min-h-[44px] px-3 rounded-xl border text-sm"
                    style={{ backgroundColor: 'var(--fs-subtle)', borderColor: 'var(--fs-border-strong)', color: 'var(--fs-text)' }}
                  />
                </div>
              )}
              <div>
                <label className="block text-xs font-bold mb-1" style={{ color: 'var(--fs-text-secondary)' }}>Traditional Title</label>
                <input
                  type="text"
                  value={titleTraditional}
                  onChange={(e) => setTitleTraditional(e.target.value)}
                  className="w-full min-h-[44px] px-3 rounded-xl border text-sm"
                  style={{ backgroundColor: 'var(--fs-subtle)', borderColor: 'var(--fs-border-strong)', color: 'var(--fs-text)' }}
                />
              </div>
              <div>
                <label className="block text-xs font-bold mb-1" style={{ color: 'var(--fs-text-secondary)' }}>English Title</label>
                <input
                  type="text"
                  value={titleEnglish}
                  onChange={(e) => setTitleEnglish(e.target.value)}
                  className="w-full min-h-[44px] px-3 rounded-xl border text-sm"
                  style={{ backgroundColor: 'var(--fs-subtle)', borderColor: 'var(--fs-border-strong)', color: 'var(--fs-text)' }}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <label className="text-xs font-bold" style={{ color: 'var(--fs-text-secondary)' }}>
                  Lines: Traditional | English | Optional Zhuyin | vocab/dialogue
                </label>
                <label className="text-xs font-bold underline cursor-pointer" style={{ color: 'var(--fs-accent-text)' }}>
                  Upload .docx/.txt/.csv/.json
                  <input type="file" accept=".docx,.xml,.txt,.csv,.tsv,.json" onChange={handleUploadMaterialFile} className="hidden" />
                </label>
              </div>
              <textarea
                rows={4}
                value={rawInput}
                onChange={(e) => setRawInput(e.target.value)}
                className="w-full p-3 rounded-2xl border text-xs sm:text-sm font-mono"
                style={{ backgroundColor: 'var(--fs-subtle)', borderColor: 'var(--fs-border-strong)', color: 'var(--fs-text)' }}
              />
            </div>

            <div className="flex flex-wrap gap-2">
              <StylusButton variant="secondary" onClick={handleParseMaterial}><span>Preview MOE Zhuyin</span></StylusButton>
              <StylusButton variant="primary" onClick={handleSavePack}>
                <span>{editingPackId ? 'Update Published Pack ✓' : 'Publish Pack Live ✓'}</span>
              </StylusButton>
            </div>

            {parsedRows.length > 0 && (
              <div className="space-y-2 max-h-[260px] overflow-y-auto pt-1">
                {parsedRows.map((row) => (
                  <div key={row.id} className="fs-subtle-box p-3 flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <RubyText text={row.traditional} zhuyin={row.zhuyin} size="sm" zhuyinDisplayMode="always" />
                      <span className="text-xs font-medium" style={{ color: 'var(--fs-text-secondary)' }}>{row.english}</span>
                    </div>
                    <input
                      type="text"
                      value={row.zhuyin}
                      onChange={(e) => handleUpdateRowZhuyin(row.id, e.target.value)}
                      className="min-h-[36px] px-2.5 rounded-lg border text-xs font-mono"
                      style={{ backgroundColor: 'var(--fs-surface)', borderColor: 'var(--fs-border)', color: 'var(--fs-accent-text)' }}
                    />
                  </div>
                ))}
              </div>
            )}
          </section>

          <section className="lg:col-span-5 fs-card p-5 space-y-3">
            <h2 className="text-base font-bold" style={{ color: 'var(--fs-text)' }}>
              Saved Custom Packs ({savedPacks.length})
            </h2>
            {savedPacks.length === 0 ? (
              <p className="text-sm" style={{ color: 'var(--fs-text-muted)' }}>
                No custom packs yet. Publish a Custom Scenario, Pimsleur Unit, or NTNU Lesson on the left—it appears live in Course Syllabus, Today’s Session, and Vocab Dojo!
              </p>
            ) : (
              <div className="space-y-2.5">
                {savedPacks.map((pack) => (
                  <div key={pack.id} className="fs-subtle-box p-3.5 space-y-2">
                    <div>
                      <div className="text-sm font-bold" style={{ color: 'var(--fs-text)' }}>
                        {pack.titleTraditional} · {pack.titleEnglish}
                      </div>
                      <div className="text-xs" style={{ color: 'var(--fs-text-muted)' }}>
                        {pack.packType} · Stage {pack.targetStage ?? 1} · {pack.rows.length} items
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <StylusButton variant="secondary" onClick={() => handleStartEditPack(pack)}><span>Edit</span></StylusButton>
                      <StylusButton variant="danger" onClick={() => handleDeletePack(pack.id)}><span>Delete</span></StylusButton>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      )}

      {/* TAB 2: AUDIO, VOICE & IPAD SELF-TEST */}
      {tab === 'audio_diag' && (
        <section className="fs-card p-5 sm:p-6 space-y-4">
          <div className="space-y-1">
            <h2 className="text-lg font-bold" style={{ color: 'var(--fs-text)' }}>
              iPad mini 6 &amp; Desktop Audio, Voice &amp; Mic Self-Test
            </h2>
            <p className="text-sm" style={{ color: 'var(--fs-text-secondary)' }}>
              Verify native Taiwanese voices (<code>zh-TW</code>), offline YIN pitch timing (&lt; 5 ms/frame), and Safari <code>audio/mp4</code> playback in one click.
            </p>
          </div>
          <div className="flex flex-wrap gap-2.5">
            <StylusButton variant="primary" onClick={handleRunDiagnostics}><span>1. Run System &amp; Voice Check</span></StylusButton>
            <StylusButton variant="secondary" onClick={() => onSpeak?.('你好，歡迎來到臺灣！', 0.9)}><span>2. Test Taiwan TTS Voice</span></StylusButton>
            <StylusButton variant={micTesting ? 'danger' : 'amber'} onClick={() => void handleRunMicSelfTest()}>
              <span>{micTesting ? 'Stop Mic Test' : '3. Run 2-Sec Mic & YIN Test'}</span>
            </StylusButton>
            {testCapture && (testCapture.audioBlob || testCapture.audioUrl) && (
              <StylusButton
                variant="secondary"
                onClick={() => void playRecordedThenNative(testCapture.audioBlob, testCapture.audioUrl, '臺灣', 0.85)}
              >
                <span>4. Replay My Voice vs. Native</span>
              </StylusButton>
            )}
          </div>

          {micSummary && (
            <div className="fs-subtle-box p-4 text-sm font-semibold" style={{ color: 'var(--fs-accent-text)' }}>
              {micSummary}
            </div>
          )}

          {diagReport && (
            <div className="fs-subtle-box p-4 space-y-2 text-sm">
              <div>
                <strong>Platform:</strong> {diagReport.isLikelyIosSafari ? 'iPadOS / iOS Safari' : 'Desktop Browser'} ·{' '}
                <strong>Sample Rate:</strong> {diagReport.sampleRateHz} Hz ·{' '}
                <strong>Recorder Codec:</strong> {diagReport.recorderMime}
              </div>
              <div>
                <strong>Synthetic YIN Benchmark:</strong> {diagReport.yinFrameMs} ms/frame (error: {diagReport.yinErrorHz} Hz) ·{' '}
                <strong>Taiwan (zh-TW) Voice:</strong> {diagReport.detectedVoice || 'System fallback'}
              </div>
              <div className="text-xs font-medium" style={{ color: diagReport.hasTaiwanVoice ? 'var(--fs-accent-text)' : 'var(--fs-warm)' }}>
                {diagReport.ipadTip}
              </div>
            </div>
          )}
        </section>
      )}

      {/* TAB 3: UNIFIED BACKUP & TRANSFER */}
      {tab === 'backup' && (
        <section className="fs-card p-5 sm:p-6 space-y-4">
          <div className="space-y-1">
            <h2 className="text-lg font-bold" style={{ color: 'var(--fs-text)' }}>
              Unified Desktop ↔ iPad Progress &amp; Curriculum Transfer
            </h2>
            <p className="text-sm" style={{ color: 'var(--fs-text-secondary)' }}>
              Export one single JSON file containing all FSRS word/stroke mastery, Stage 0–5 checkpoints, AND all custom Admin lesson packs. Transfer via iCloud Drive, AirDrop, or USB.
            </p>
          </div>
          {backupStatus && (
            <div className="fs-subtle-box p-3 text-sm font-semibold" style={{ color: 'var(--fs-accent-text)' }}>
              {backupStatus}
            </div>
          )}
          <div className="flex flex-wrap gap-3">
            <StylusButton variant="primary" onClick={handleExportUnifiedBackup}>
              <span>Export Unified Backup (.json)</span>
            </StylusButton>
            <label
              className="min-h-[44px] px-4 py-2 rounded-xl border text-sm font-bold inline-flex items-center cursor-pointer"
              style={{ backgroundColor: 'var(--fs-surface)', borderColor: 'var(--fs-border-strong)', color: 'var(--fs-text)' }}
            >
              <span>Restore Backup (.json)</span>
              <input type="file" accept=".json" onChange={handleImportUnifiedBackup} className="hidden" />
            </label>
          </div>
        </section>
      )}

      {/* TAB 4: PREFERENCES & HARDWARE */}
      {tab === 'preferences' && (
        <section className="fs-card p-5 sm:p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="fs-subtle-box p-4 space-y-2">
            <div className="text-sm font-semibold" style={{ color: 'var(--fs-text)' }}>Appearance &amp; Theme</div>
            <div className="flex flex-wrap gap-2">
              {([
                { id: 'system', label: 'Match System' },
                { id: 'light', label: 'Light' },
                { id: 'dark', label: 'Dark' },
              ] as { id: ThemeMode; label: string }[]).map((m) => (
                <StylusButton key={m.id} variant={(progress.theme || 'system') === m.id ? 'primary' : 'secondary'} onClick={() => onUpdateProgress({ ...progress, theme: m.id })}>
                  <span>{m.label}</span>
                </StylusButton>
              ))}
            </div>
          </div>

          <div className="fs-subtle-box p-4 space-y-2">
            <div className="text-sm font-bold" style={{ color: 'var(--fs-text)' }}>Pinyin &amp; Zhuyin Scaffolding</div>
            <div className="flex flex-wrap gap-2">
              <StylusButton variant={progress.showPinyinHint ? 'primary' : 'secondary'} onClick={() => onUpdateProgress({ ...progress, showPinyinHint: !progress.showPinyinHint })}>
                <span>Pinyin: {progress.showPinyinHint ? 'ON' : 'OFF'}</span>
              </StylusButton>
              {(['always', 'adaptive', 'hover_only'] as ZhuyinDisplayMode[]).map((zm) => (
                <StylusButton key={zm} variant={progress.zhuyinDisplayMode === zm ? 'primary' : 'secondary'} onClick={() => onUpdateProgress({ ...progress, zhuyinDisplayMode: zm })}>
                  <span>{zm === 'always' ? 'Zhuyin Always' : zm === 'adaptive' ? 'Adaptive Fade' : 'Tap to Peek'}</span>
                </StylusButton>
              ))}
            </div>
          </div>

          <div className="fs-subtle-box p-4 space-y-2">
            <div className="text-sm font-bold" style={{ color: 'var(--fs-text)' }}>Wacom / Apple Pencil Ergonomics</div>
            <div className="flex flex-wrap gap-2">
              <StylusButton variant={progress.handedness === 'right' ? 'primary' : 'secondary'} onClick={() => onUpdateProgress({ ...progress, handedness: 'right' })}>
                <span>Right-Handed</span>
              </StylusButton>
              <StylusButton variant={progress.handedness === 'left' ? 'primary' : 'secondary'} onClick={() => onUpdateProgress({ ...progress, handedness: 'left' })}>
                <span>Left-Handed Dock</span>
              </StylusButton>
              <StylusButton variant={progress.palmRejectionPenOnly ? 'primary' : 'secondary'} onClick={() => onUpdateProgress({ ...progress, palmRejectionPenOnly: !progress.palmRejectionPenOnly })}>
                <span>Pen-Only Palm Reject: {progress.palmRejectionPenOnly ? 'ON' : 'OFF'}</span>
              </StylusButton>
            </div>
          </div>

          <div className="fs-subtle-box p-4 space-y-2">
            <div className="text-sm font-bold" style={{ color: 'var(--fs-text)' }}>Voice Range &amp; Quiet-Room Mode</div>
            <div className="flex flex-wrap gap-2">
              {(['low', 'mid', 'high'] as VoicePitchPreset[]).map((vp) => (
                <StylusButton key={vp} variant={(progress.voicePreset || 'mid') === vp ? 'primary' : 'secondary'} onClick={() => onUpdateProgress({ ...progress, voicePreset: vp })}>
                  <span>{vp === 'low' ? 'Low Voice' : vp === 'mid' ? 'Medium Voice' : 'High Voice'}</span>
                </StylusButton>
              ))}
              <StylusButton variant={progress.quietRoomMode ? 'amber' : 'secondary'} onClick={() => onUpdateProgress({ ...progress, quietRoomMode: !progress.quietRoomMode })}>
                <span>Quiet-Room Mode: {progress.quietRoomMode ? 'ON' : 'OFF'}</span>
              </StylusButton>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};
