/**
 * FormosaStudio (FORM) — Unified Course Syllabus Stage View (Stages 0–5 · Option A Layout)
 * Delivers Pre-A1 -> TOCFL Level 4 / CEFR B2 (Classic HSK 5 Equivalent) progression with:
 *   - Stage 0 delegating cleanly to Stage0BeginnerLaunchpad
 *   - Stages 1-5 Option A layout: 1 prominent "Continue Recommended Next" CTA + expandable tracks
 *   - Integrated 5-Question Stage Checkpoint Quiz (>= 80% pass), retiring the redundant Skill Tree
 *   - Non-destructive stage-recommended Pinyin/Zhuyin preset chip (PED-2)
 * Traces to: FORM-ECR-001, FORM-DEC-005, FORM-WF-002, PED-1, PED-2
 */

import React, { useMemo, useState } from 'react';
import { PIMSLEUR_UNITS } from '../data/pimsleurUnitsB.ts';
import { CONTEMPORARY_VOLUMES } from '../data/contemporaryVols3to6.ts';
import { SURVIVAL_MODULES } from '../data/taiwanSurvivalData.ts';
import {
  getCustomPimsleurUnits,
  getCustomScenarioPacks,
  mergeCustomContemporaryVolumes,
} from '../lib/curriculumAdminStore.ts';
import {
  UserProgressState,
  recordStageCheckpointResult,
} from '../lib/progressStore.ts';
import {
  SYLLABUS_STAGES,
  StageNumber,
  getRecommendedDisplayPreset,
  getStageProgressDetail,
} from '../lib/syllabusModel.ts';
import { dispatchStudioHandoff } from '../lib/studioContextBus.ts';
import { NtnuExplorerView, PimsleurExplorerView } from './CurriculumExplorers.tsx';
import { Stage0BeginnerLaunchpad } from './Stage0BeginnerLaunchpad.tsx';
import { RubyText } from './RubyText.tsx';
import { StylusButton } from './uiPrimitives.tsx';

export interface SyllabusStageViewProps {
  selectedStage: StageNumber;
  onSelectStage: (stage: StageNumber) => void;
  progress: UserProgressState;
  onUpdateProgress: (next: UserProgressState) => void;
  onSpeak?: (text: string, rate?: number) => void;
  adminRevision?: number;
}

type TrackDrawerId = 'none' | 'pimsleur' | 'ntnu' | 'survival' | 'custom' | 'checkpoint';

export const SyllabusStageView: React.FC<SyllabusStageViewProps> = ({
  selectedStage,
  onSelectStage,
  progress,
  onUpdateProgress,
  onSpeak,
  adminRevision = 0,
}) => {
  const [openDrawer, setOpenDrawer] = useState<TrackDrawerId>('none');
  const [selectedPimsleurUnit, setSelectedPimsleurUnit] = useState<number>(1);
  const [selectedNtnuVol, setSelectedNtnuVol] = useState<number>(1);
  const [selectedNtnuLesson, setSelectedNtnuLesson] = useState<number>(1);
  const [cpAnswers, setCpAnswers] = useState<Record<string, number>>({});
  const [cpSubmitted, setCpSubmitted] = useState<boolean>(false);

  const stageDetail = useMemo(
    () => getStageProgressDetail(selectedStage, progress),
    [selectedStage, progress, adminRevision]
  );
  const stageDef = stageDetail.stage;
  const recommendedPreset = getRecommendedDisplayPreset(selectedStage);
  const presetMatches =
    progress.showPinyinHint === recommendedPreset.showPinyinHint &&
    progress.zhuyinDisplayMode === recommendedPreset.zhuyinDisplayMode;

  const allPimsleurUnits = useMemo(() => {
    const custom = getCustomPimsleurUnits();
    const map = new Map<number, (typeof PIMSLEUR_UNITS)[number]>();
    for (const u of PIMSLEUR_UNITS) map.set(u.unit, u);
    for (const c of custom) map.set(c.unit, c);
    return Array.from(map.values()).sort((a, b) => a.unit - b.unit);
  }, [adminRevision]);

  const stagePimsleurUnits = useMemo(() => {
    const set = new Set(stageDef.pimsleurUnits);
    return allPimsleurUnits.filter((u) => set.has(u.unit));
  }, [allPimsleurUnits, stageDef]);

  const allVolumes = useMemo(() => mergeCustomContemporaryVolumes(CONTEMPORARY_VOLUMES), [adminRevision]);
  const stageVolumes = useMemo(() => {
    const volNums = new Set(stageDef.ntnuRanges.map((r) => r.volume));
    return allVolumes.filter((v) => volNums.has(v.volume));
  }, [allVolumes, stageDef]);

  const stageSurvivalModules = useMemo(() => {
    const ids = new Set(stageDef.survivalModuleIds);
    return SURVIVAL_MODULES.filter((m) => ids.has(m.id));
  }, [stageDef]);

  const stageCustomPacks = useMemo(
    () => getCustomScenarioPacks(selectedStage),
    [selectedStage, adminRevision]
  );

  const handleSelectStageClean = (st: StageNumber) => {
    onSelectStage(st);
    setOpenDrawer('none');
    setCpAnswers({});
    setCpSubmitted(false);
  };

  const handleRunRecommendedNext = () => {
    const rec = stageDetail.recommendedNext;
    if (rec.kind === 'pimsleur' && rec.unitOrVolume) {
      setSelectedPimsleurUnit(rec.unitOrVolume);
      setOpenDrawer('pimsleur');
    } else if (rec.kind === 'ntnu' && rec.unitOrVolume && rec.lessonNumber) {
      setSelectedNtnuVol(rec.unitOrVolume);
      setSelectedNtnuLesson(rec.lessonNumber);
      setOpenDrawer('ntnu');
    } else if (rec.kind === 'checkpoint') {
      setOpenDrawer('checkpoint');
    } else if (rec.kind === 'next_stage') {
      if (rec.stageNumber !== selectedStage) {
        handleSelectStageClean(rec.stageNumber);
      } else {
        dispatchStudioHandoff({
          fromStudio: 'syllabus',
          fromLabel: `Stage ${selectedStage}`,
          toStudio: 'reader',
          targetText: '臺灣文化',
        });
      }
    }
  };

  const handleSubmitCheckpoint = () => {
    const questions = stageDef.checkpointQuestions;
    if (questions.length === 0) return;
    const correct = questions.filter((q) => cpAnswers[q.id] === q.correctIdx).length;
    const accuracy = Math.round((correct / questions.length) * 100);
    setCpSubmitted(true);
    onUpdateProgress(recordStageCheckpointResult(progress, selectedStage, accuracy));
  };

  return (
    <div className="space-y-5">
      {/* Compact Horizontal Stage 0..5 Strip (works smoothly even with sidebar collapsed on iPad mini 6) */}
      <div className="flex flex-wrap gap-2">
        {SYLLABUS_STAGES.map((st) => {
          const d = getStageProgressDetail(st.stageNumber, progress);
          const active = st.stageNumber === selectedStage;
          return (
            <button
              key={st.id}
              type="button"
              onClick={() => handleSelectStageClean(st.stageNumber)}
              style={{
                minHeight: '44px',
                backgroundColor: active ? 'var(--fs-accent)' : 'var(--fs-surface)',
                color: active ? 'var(--fs-on-accent)' : 'var(--fs-text)',
                borderColor: active ? 'var(--fs-accent)' : 'var(--fs-border)',
              }}
              className="px-3.5 py-2 rounded-xl border text-xs sm:text-sm font-bold transition flex items-center gap-2"
            >
              <span>Stage {st.stageNumber}</span>
              <span className="opacity-80 text-[11px]">{st.cefrLabel}</span>
              <span className="text-[11px] opacity-90">{d.checkpointPassed ? '✓' : `${d.percent}%`}</span>
            </button>
          );
        })}
      </div>

      {/* STAGE 0: DELEGATES CLEANLY TO START FROM ZERO LAUNCHPAD */}
      {selectedStage === 0 ? (
        <Stage0BeginnerLaunchpad
          progress={progress}
          onUpdateProgress={onUpdateProgress}
          onSpeak={onSpeak}
          onFinishedStage0={() => handleSelectStageClean(1)}
        />
      ) : (
        <div className="space-y-5">
          {/* OPTION A STAGE HERO: SINGLE RECOMMENDED NEXT CTA */}
          <section className="fs-card p-5 sm:p-6 space-y-5">
            <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold" style={{ backgroundColor: 'var(--fs-accent-soft)', color: 'var(--fs-accent-text)' }}>
                    Stage {stageDef.stageNumber} of 5 · {stageDef.tocflDualLabel}
                  </span>
                  {stageDetail.checkpointPassed && (
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold" style={{ backgroundColor: 'var(--fs-accent)', color: 'var(--fs-on-accent)' }}>
                      ✓ Checkpoint Certified ({stageDetail.checkpointBestAccuracy}%)
                    </span>
                  )}
                </div>
                <h1 className="text-2xl font-bold tracking-tight" style={{ color: 'var(--fs-text)' }}>
                  {stageDef.titleEn} <span className="font-medium text-base opacity-65">· {stageDef.titleZh}</span>
                </h1>
                <p className="text-sm max-w-3xl" style={{ color: 'var(--fs-text-secondary)' }}>
                  {stageDef.summary}
                </p>
                {stageDef.v2SeedNote && (
                  <div className="text-xs font-medium px-3 py-2 rounded-xl border" style={{ backgroundColor: 'var(--fs-warm-soft)', borderColor: 'var(--fs-warm-border)', color: 'var(--fs-warm)' }}>
                    {stageDef.v2SeedNote}
                  </div>
                )}
              </div>

              <div className="flex flex-col sm:items-end gap-2 shrink-0">
                <StylusButton variant="primary" onClick={handleRunRecommendedNext}>
                  <span>{stageDetail.recommendedNext.label} →</span>
                </StylusButton>
                <div className="text-xs" style={{ color: 'var(--fs-text-muted)' }}>
                  {stageDetail.recommendedNext.sublabel}
                </div>
              </div>
            </div>

            {/* Progress Bar + Non-Destructive Display Preset Chip (PED-2) */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
              <div className="flex-1 max-w-md space-y-1">
                <div className="flex justify-between text-xs font-semibold">
                  <span style={{ color: 'var(--fs-text-secondary)' }}>
                    Stage Completion ({stageDetail.completedUnits}/{stageDetail.totalUnits} lessons)
                  </span>
                  <span style={{ color: 'var(--fs-accent-text)' }}>{stageDetail.percent}%</span>
                </div>
                <div className="w-full h-2.5 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--fs-subtle)' }}>
                  <div className="h-full rounded-full transition-all" style={{ width: `${stageDetail.percent}%`, backgroundColor: 'var(--fs-accent)' }} />
                </div>
              </div>

              {!presetMatches && (
                <StylusButton
                  variant="ghost"
                  onClick={() =>
                    onUpdateProgress({
                      ...progress,
                      showPinyinHint: recommendedPreset.showPinyinHint,
                      zhuyinDisplayMode: recommendedPreset.zhuyinDisplayMode,
                    })
                  }
                >
                  <span>Apply Recommended: {recommendedPreset.label}</span>
                </StylusButton>
              )}
            </div>

            {/* OPTION A EXPANDABLE TRACK CARDS (2-col on iPad mini 6 portrait) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-1">
              {stagePimsleurUnits.length > 0 && (
                <button
                  type="button"
                  onClick={() => {
                    setSelectedPimsleurUnit(stagePimsleurUnits[0].unit);
                    setOpenDrawer(openDrawer === 'pimsleur' ? 'none' : 'pimsleur');
                  }}
                  style={{
                    minHeight: '72px',
                    backgroundColor: openDrawer === 'pimsleur' ? 'var(--fs-accent-soft)' : 'var(--fs-subtle)',
                    borderColor: openDrawer === 'pimsleur' ? 'var(--fs-accent-border)' : 'var(--fs-border)',
                  }}
                  className="p-3.5 rounded-2xl border text-left transition space-y-1"
                >
                  <div className="text-xs font-bold" style={{ color: 'var(--fs-accent-text)' }}>
                    Pimsleur Audio Track {openDrawer === 'pimsleur' ? '▾' : '▸'}
                  </div>
                  <div className="text-sm font-bold" style={{ color: 'var(--fs-text)' }}>
                    Units {stageDef.pimsleurUnits[0]}–{stageDef.pimsleurUnits[stageDef.pimsleurUnits.length - 1]}
                  </div>
                  <div className="text-xs" style={{ color: 'var(--fs-text-secondary)' }}>Listening &amp; timed recall</div>
                </button>
              )}

              <button
                type="button"
                onClick={() => {
                  const firstRange = stageDef.ntnuRanges[0];
                  if (firstRange) {
                    setSelectedNtnuVol(firstRange.volume);
                    setSelectedNtnuLesson(firstRange.startLesson);
                  }
                  setOpenDrawer(openDrawer === 'ntnu' ? 'none' : 'ntnu');
                }}
                style={{
                  minHeight: '72px',
                  backgroundColor: openDrawer === 'ntnu' ? 'var(--fs-accent-soft)' : 'var(--fs-subtle)',
                  borderColor: openDrawer === 'ntnu' ? 'var(--fs-accent-border)' : 'var(--fs-border)',
                }}
                className="p-3.5 rounded-2xl border text-left transition space-y-1"
              >
                <div className="text-xs font-bold" style={{ color: 'var(--fs-accent-text)' }}>
                  NTNU Contemporary Track {openDrawer === 'ntnu' ? '▾' : '▸'}
                </div>
                <div className="text-sm font-bold" style={{ color: 'var(--fs-text)' }}>
                  {stageDef.ntnuRanges.map((r) => `Vol.${r.volume} L${r.startLesson}–${r.endLesson}`).join(' · ')}
                </div>
                <div className="text-xs" style={{ color: 'var(--fs-text-secondary)' }}>Structured grammar &amp; vocab</div>
              </button>

              {stageSurvivalModules.length > 0 && (
                <button
                  type="button"
                  onClick={() => setOpenDrawer(openDrawer === 'survival' ? 'none' : 'survival')}
                  style={{
                    minHeight: '72px',
                    backgroundColor: openDrawer === 'survival' ? 'var(--fs-accent-soft)' : 'var(--fs-subtle)',
                    borderColor: openDrawer === 'survival' ? 'var(--fs-accent-border)' : 'var(--fs-border)',
                  }}
                  className="p-3.5 rounded-2xl border text-left transition space-y-1"
                >
                  <div className="text-xs font-bold" style={{ color: 'var(--fs-accent-text)' }}>
                    Taiwan Survival &amp; Strokes {openDrawer === 'survival' ? '▾' : '▸'}
                  </div>
                  <div className="text-sm font-bold" style={{ color: 'var(--fs-text)' }}>
                    {stageSurvivalModules.length} Survival Modules + {stageDef.recommendedStrokeChars.length} Chars
                  </div>
                  <div className="text-xs" style={{ color: 'var(--fs-text-secondary)' }}>Real-life drills &amp; Wacom writing</div>
                </button>
              )}

              <button
                type="button"
                onClick={() => setOpenDrawer(openDrawer === 'checkpoint' ? 'none' : 'checkpoint')}
                style={{
                  minHeight: '72px',
                  backgroundColor: openDrawer === 'checkpoint' ? 'var(--fs-accent-soft)' : 'var(--fs-subtle)',
                  borderColor: openDrawer === 'checkpoint' ? 'var(--fs-accent-border)' : 'var(--fs-border)',
                }}
                className="p-3.5 rounded-2xl border text-left transition space-y-1"
              >
                <div className="text-xs font-bold" style={{ color: 'var(--fs-accent-text)' }}>
                  Stage {stageDef.stageNumber} Checkpoint {openDrawer === 'checkpoint' ? '▾' : '▸'}
                </div>
                <div className="text-sm font-bold" style={{ color: 'var(--fs-text)' }}>
                  5-Question Gate (≥ 80%)
                </div>
                <div className="text-xs" style={{ color: 'var(--fs-text-secondary)' }}>
                  {stageDetail.checkpointPassed ? `Best: ${stageDetail.checkpointBestAccuracy}% ✓` : 'Verify stage mastery'}
                </div>
              </button>
            </div>

            {/* Custom Packs Bound to This Stage */}
            {stageCustomPacks.length > 0 && (
              <div className="fs-subtle-box p-4 space-y-2">
                <div className="text-xs font-bold uppercase" style={{ color: 'var(--fs-accent-text)' }}>
                  Custom Scenarios &amp; Packs in Stage {selectedStage} ({stageCustomPacks.length})
                </div>
                <div className="flex flex-wrap gap-2">
                  {stageCustomPacks.map((pack) => (
                    <StylusButton
                      key={pack.id}
                      variant="secondary"
                      onClick={() =>
                        dispatchStudioHandoff({
                          fromStudio: 'syllabus',
                          fromLabel: `Stage ${selectedStage} Custom Pack`,
                          toStudio: 'dojo',
                          targetText: pack.rows[0]?.traditional || pack.titleTraditional,
                          targetZhuyin: pack.rows[0]?.zhuyin,
                          targetEnglish: pack.rows[0]?.english || pack.titleEnglish,
                        })
                      }
                    >
                      <span>{pack.titleTraditional} · {pack.titleEnglish} ({pack.rows.length} items)</span>
                    </StylusButton>
                  ))}
                </div>
              </div>
            )}
          </section>

          {/* EXPANDED TRACK CONTENT */}
          {openDrawer === 'pimsleur' && stagePimsleurUnits.length > 0 && (
            <PimsleurExplorerView
              units={stagePimsleurUnits}
              selectedUnit={selectedPimsleurUnit}
              onSelectUnit={setSelectedPimsleurUnit}
              progress={progress}
              onUpdateProgress={onUpdateProgress}
              onSpeak={onSpeak}
            />
          )}

          {openDrawer === 'ntnu' && stageVolumes.length > 0 && (
            <NtnuExplorerView
              volumes={stageVolumes}
              selectedVolume={selectedNtnuVol}
              selectedLesson={selectedNtnuLesson}
              onSelectVolume={(vol, firstL) => {
                setSelectedNtnuVol(vol);
                setSelectedNtnuLesson(firstL);
              }}
              onSelectLesson={setSelectedNtnuLesson}
              progress={progress}
              onUpdateProgress={onUpdateProgress}
              onSpeak={onSpeak}
            />
          )}

          {openDrawer === 'survival' && (
            <section className="fs-card p-5 space-y-4">
              <div className="text-base font-bold" style={{ color: 'var(--fs-text)' }}>
                Stage {selectedStage} Survival Modules &amp; Stroke Characters
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {stageSurvivalModules.map((mod) => (
                  <div key={mod.id} className="fs-subtle-box p-4 flex items-center justify-between gap-3">
                    <div>
                      <div className="text-sm font-bold" style={{ color: 'var(--fs-text)' }}>{mod.titleEnglish}</div>
                      <div className="text-xs" style={{ color: 'var(--fs-text-secondary)' }}>{mod.titleTraditional}</div>
                    </div>
                    <StylusButton
                      variant="secondary"
                      onClick={() =>
                        dispatchStudioHandoff({
                          fromStudio: 'syllabus',
                          fromLabel: `Stage ${selectedStage}`,
                          toStudio: 'survival',
                          targetText: mod.titleTraditional,
                        })
                      }
                    >
                      <span>Open Lab →</span>
                    </StylusButton>
                  </div>
                ))}
              </div>
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <span className="text-xs font-bold" style={{ color: 'var(--fs-text-muted)' }}>Practice Stage Strokes:</span>
                {stageDef.recommendedStrokeChars.map((ch) => (
                  <StylusButton
                    key={ch}
                    variant="secondary"
                    onClick={() =>
                      dispatchStudioHandoff({
                        fromStudio: 'syllabus',
                        fromLabel: `Stage ${selectedStage} Strokes`,
                        toStudio: 'calligraphy',
                        targetText: ch,
                      })
                    }
                  >
                    <span className="text-base font-bold">{ch}</span>
                  </StylusButton>
                ))}
              </div>
            </section>
          )}

          {openDrawer === 'checkpoint' && (
            <section className="fs-card p-5 sm:p-6 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <div className="text-xs font-bold uppercase" style={{ color: 'var(--fs-accent-text)' }}>
                    Integrated Stage {selectedStage} Mastery Checkpoint (5 Questions · Pass ≥ 80%)
                  </div>
                  <h2 className="text-lg font-bold" style={{ color: 'var(--fs-text)' }}>
                    Prove Stage {selectedStage} Taiwan Mandarin Readiness
                  </h2>
                </div>
                <StylusButton variant="ghost" onClick={() => { setCpAnswers({}); setCpSubmitted(false); }}>
                  <span>Reset Quiz</span>
                </StylusButton>
              </div>

              <div className="space-y-3">
                {stageDef.checkpointQuestions.map((q, idx) => {
                  const picked = cpAnswers[q.id];
                  return (
                    <div key={q.id} className="fs-subtle-box p-4 space-y-2.5">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="text-sm font-bold" style={{ color: 'var(--fs-text)' }}>
                          {idx + 1}. {q.promptEn}
                        </div>
                        <StylusButton variant="ghost" onClick={() => onSpeak?.(q.promptZh, 0.85)}>
                          <span>Listen</span>
                        </StylusButton>
                      </div>
                      {cpSubmitted ? (
                        <RubyText text={q.promptZh} zhuyin={q.promptZhuyin} showPinyinHint={progress.showPinyinHint} size="sm" zhuyinDisplayMode="always" />
                      ) : (
                        <div className="text-lg font-bold tracking-wide" style={{ color: 'var(--fs-text)' }}>
                          {q.promptZh}
                        </div>
                      )}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        {q.choices.map((ch, cIdx) => {
                          const isSelected = picked === cIdx;
                          const variant = !cpSubmitted
                            ? isSelected ? 'primary' : 'secondary'
                            : cIdx === q.correctIdx
                            ? 'primary'
                            : isSelected
                            ? 'danger'
                            : 'secondary';
                          return (
                            <StylusButton
                              key={ch.label}
                              variant={variant}
                              onClick={() => !cpSubmitted && setCpAnswers((prev) => ({ ...prev, [q.id]: cIdx }))}
                            >
                              <span className="text-left text-xs sm:text-sm">
                                <strong>{ch.label}</strong>
                                {cpSubmitted && <span className="block text-[11px] opacity-85">{ch.note}</span>}
                              </span>
                            </StylusButton>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                {cpSubmitted ? (
                  <div className="text-sm font-bold" style={{ color: stageDetail.checkpointPassed ? 'var(--fs-accent-text)' : 'var(--fs-warm)' }}>
                    Score:{' '}
                    {Math.round(
                      (stageDef.checkpointQuestions.filter((q) => cpAnswers[q.id] === q.correctIdx).length /
                        Math.max(1, stageDef.checkpointQuestions.length)) *
                        100
                    )}
                    % {stageDetail.checkpointPassed ? '— ✓ Stage Certified!' : '— Aim for ≥ 80% and try again!'}
                  </div>
                ) : (
                  <div className="text-xs" style={{ color: 'var(--fs-text-muted)' }}>
                    Answered {Object.keys(cpAnswers).length} of {stageDef.checkpointQuestions.length}
                  </div>
                )}
                <StylusButton
                  variant="primary"
                  disabled={cpSubmitted || Object.keys(cpAnswers).length < stageDef.checkpointQuestions.length}
                  onClick={handleSubmitCheckpoint}
                >
                  <span>Grade Stage {selectedStage} Checkpoint</span>
                </StylusButton>
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
};
