/** * FormosaStudio (FORM) — Studio 4: Wacom Stylus Calligraphy & Semantic-Phonetic (形聲字) Workbench
 * Traces to: FORM-REQ-0012, FORM-REQ-0013, FORM-REQ-0014, FORM-REQ-0021, FORM-DEP-UX-001 */
import React, { useEffect, useRef, useState } from 'react';
import {
  MOE_CANVAS_PAD, MOE_CANVAS_SCALE,
  MOE_STROKE_CHARACTER_BANK, MOE_VECTOR_BOX,
  MOE_VECTOR_Y_ORIGIN, MoeCharacterStrokeEntry,
  PHONETIC_SERIES_BANK, SEMANTIC_RADICALS,
  getMoeCharacterEntry, } from '../data/moeStrokeAndPhoneticData.ts';
import {
  CalligraphyGridStyle, CalligraphyPracticeMode,
  CharacterWritingGradeReport, StylusSamplePoint,
  UserDrawnStroke, extractCoalescedPoints,
  gradeCharacterWriting, gradeUserStroke,
  isWacomEraserEvent, shouldAcceptPointerEvent,
} from '../lib/wacomStrokeEngine.ts';
import {
  StylusHandedness, UserProgressState,
  recordStrokePractice, } from '../lib/progressStore.ts';
import {
  getStudioBusState, setFocusedContextItem,
  subscribeStudioBus, } from '../lib/studioContextBus.ts';
import {
  CrossStudioActionPills, HandednessToggle,
  StudioHeaderBanner, StudioModeOption,
  StudioModeSwitcher, StylusButton,
} from './uiPrimitives.tsx';
import { RubyText } from './RubyText.tsx';
type Studio4SubTab = 'calligraphy' | 'xingsheng';
const SUB_TABS: StudioModeOption<Studio4SubTab>[] = [
  { id: 'calligraphy', labelZh: 'Wacom 國字筆順畫布', labelEn: 'MOE Wacom Canvas', badge: '20 字' },
  { id: 'xingsheng', labelZh: '形聲字部首與聲符工坊', labelEn: 'Semantic-Phonetic Workbench', badge: '10 聲符 · 46 字' }, ];
const PRACTICE_MODES: { id: CalligraphyPracticeMode; labelZh: string; labelEn: string; desc: string }[] = [
  { id: 'trace', labelZh: '描紅導引', labelEn: 'Guided Trace', desc: 'Shows outline + next-stroke MOE arrow & starting dot' },
  { id: 'freehand', labelZh: '臨摹對照', labelEn: 'Freehand Overlay', desc: 'Write freely on 九宮格, then overlay MOE skeleton' },
  { id: 'dictation', labelZh: '聽寫默寫', labelEn: 'Zhuyin Dictation Recall', desc: 'Hides glyph — recall character from Zhuyin + meaning' },
];
export interface WacomCalligraphyStudioProps {
  progress: UserProgressState;
  onUpdateProgress: (next: UserProgressState) => void;
  onSpeak?: (text: string) => void;
}
export const WacomCalligraphyStudio: React.FC<WacomCalligraphyStudioProps> = ({
  progress, onUpdateProgress,
  onSpeak, }) => {
  const [subTab, setSubTab] = useState<Studio4SubTab>('calligraphy');
  const [selectedChar, setSelectedChar] = useState<string>('人');
  const [practiceMode, setPracticeMode] = useState<CalligraphyPracticeMode>('trace');
  const [gridStyle, setGridStyle] = useState<CalligraphyGridStyle>('jiugongge');
  const [drawnStrokes, setDrawnStrokes] = useState<UserDrawnStroke[]>([]);
  const [activePoints, setActivePoints] = useState<StylusSamplePoint[]>([]);
  const [revealDictationGlyph, setRevealDictationGlyph] = useState<boolean>(false);
  const [lastPointerInfo, setLastPointerInfo] = useState<{ type: string; pressure: number; widthPx: number; coalescedCount: number }>({
    type: 'pen', pressure: 0.5, widthPx: 6.5, coalescedCount: 1, });
  const [gradeReport, setGradeReport] = useState<CharacterWritingGradeReport | null>(null);
  const [selectedSeriesId, setSelectedSeriesId] = useState<string>(PHONETIC_SERIES_BANK[0].id);
  const [selectedRadical, setSelectedRadical] = useState<string>('ALL');
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const isDrawingRef = useRef<boolean>(false);
  const currentStrokeStartRef = useRef<number>(0);
  const charEntry: MoeCharacterStrokeEntry = getMoeCharacterEntry(selectedChar);
  // Listen to Cross-Studio Handoff Bus (e.g. clicking "Write on Wacom" from Reader or Survival Studio)
  useEffect(() => {
    const applyBusTarget = () => {
      const bus = getStudioBusState();
      const targetText = bus.activeHandoff?.targetText || bus.focusedItem?.text;
      if (targetText) {
        for (const ch of Array.from(targetText)) {
          const match = MOE_STROKE_CHARACTER_BANK.find((m) => m.char === ch);
          if (match) {
            setSelectedChar(match.char);
            setSubTab('calligraphy');
            break;
          }
        }
      }
    };
    applyBusTarget();
    return subscribeStudioBus(applyBusTarget);
  }, []);
  // Reset canvas state when character or practice mode changes
  useEffect(() => {
    setDrawnStrokes([]);
    setActivePoints([]);
    setGradeReport(null);
    setRevealDictationGlyph(false);
    setFocusedContextItem({
      text: charEntry.char, zhuyin: charEntry.zhuyin, english: charEntry.english, sourceStudio: 'calligraphy',
      sourceLabel: 'Wacom Calligraphy Studio', moeNote: charEntry.taiwanMoeOrthographyNote, });
  }, [selectedChar, practiceMode]);
  // Render 九宮格 / 田字格, Ghost Glyph, MOE Vector Guides, and Pressure-Tapered User Ink
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const w = canvas.width;
    const h = canvas.height;
    const isLight = progress.theme !== 'dark';
    ctx.clearRect(0, 0, w, h);
    // 1. Warm Rice-Paper (Light) or Calm Slate (Dark) Calligraphy Sheet
    ctx.fillStyle = isLight ? '#FFFDF7' : '#161B22'; ctx.fillRect(0, 0, w, h);
    // 2. Traditional Taiwanese 九宮格 (9-square) or 田字格 (4-quadrant) Grid
    ctx.save(); ctx.strokeStyle = isLight ? 'rgba(180, 83, 9, 0.35)' : 'rgba(52, 211, 153, 0.28)';
    ctx.lineWidth = 2; ctx.strokeRect(4, 4, w - 8, h - 8);
    ctx.setLineDash([6, 6]); ctx.strokeStyle = isLight ? 'rgba(120, 113, 108, 0.3)' : 'rgba(148, 163, 184, 0.25)';
    ctx.lineWidth = 1.25;
    if (gridStyle === 'jiugongge') {
      for (const frac of [1 / 3, 2 / 3]) {
        ctx.beginPath(); ctx.moveTo(w * frac, 0);
        ctx.lineTo(w * frac, h); ctx.moveTo(0, h * frac);
        ctx.lineTo(w, h * frac); ctx.stroke();
      }
    } else {
      ctx.beginPath(); ctx.moveTo(w / 2, 0);
      ctx.lineTo(w / 2, h); ctx.moveTo(0, h / 2);
      ctx.lineTo(w, h / 2); ctx.moveTo(0, 0);
      ctx.lineTo(w, h); ctx.moveTo(w, 0);
      ctx.lineTo(0, h); ctx.stroke();
    }
    ctx.restore();
    // 3. Exact Offline SVG Vector Character Silhouette (100% aligned with stroke medians & demos)
    const nextStrokeIdx = drawnStrokes.length;
    const showSilhouette = practiceMode === 'trace' ||
      (practiceMode === 'freehand' && (drawnStrokes.length === 0 || gradeReport !== null)) ||
      (practiceMode === 'dictation' && (revealDictationGlyph || gradeReport !== null));
    if (showSilhouette && charEntry.svgStrokes && charEntry.svgStrokes.length > 0 && typeof Path2D !== 'undefined') {
      const scaleX = (w * MOE_CANVAS_SCALE) / MOE_VECTOR_BOX;
      const scaleY = (h * MOE_CANVAS_SCALE) / MOE_VECTOR_BOX;
      ctx.save();
      ctx.translate(w * MOE_CANVAS_PAD, h * MOE_CANVAS_PAD + MOE_VECTOR_Y_ORIGIN * scaleY);
      ctx.scale(scaleX, -scaleY);
      charEntry.svgStrokes.forEach((svgPath, idx) => {
        const isCurrent = practiceMode === 'trace' && idx === nextStrokeIdx;
        ctx.fillStyle = isCurrent
          ? (isLight ? 'rgba(217, 119, 6, 0.24)' : 'rgba(245, 158, 11, 0.30)')
          : practiceMode === 'trace'
          ? (isLight ? 'rgba(28, 25, 23, 0.14)' : 'rgba(203, 213, 225, 0.22)')
          : (isLight ? 'rgba(15, 118, 110, 0.14)' : 'rgba(16, 185, 129, 0.18)');
        ctx.fill(new Path2D(svgPath));
      });
      ctx.restore();
    }
    // 4. MOE Vector Centerline & Next-Stroke Guide (drawn in identical normalized space)
    if (practiceMode === 'trace' || gradeReport !== null) {
      charEntry.strokes.forEach((st, idx) => {
        const isCurrentGuide = practiceMode === 'trace' && idx === nextStrokeIdx;
        const isCompleted = idx < nextStrokeIdx;
        if (!isCurrentGuide && !gradeReport && !isCompleted) return;
        ctx.save(); ctx.beginPath();
        ctx.moveTo(st.start.x * w, st.start.y * h);
        if (st.waypoints && st.waypoints.length > 0) {
          for (const wp of st.waypoints) {
            ctx.lineTo(wp.x * w, wp.y * h);
          }
          ctx.lineTo(st.end.x * w, st.end.y * h);
        } else if (st.mid && (st.type === '折' || st.type === '鉤')) {
          ctx.lineTo(st.mid.x * w, st.mid.y * h);
          ctx.lineTo(st.end.x * w, st.end.y * h);
        } else if (st.mid) {
          ctx.quadraticCurveTo(st.mid.x * w, st.mid.y * h, st.end.x * w, st.end.y * h);
        } else {
          ctx.lineTo(st.end.x * w, st.end.y * h);
        }
        ctx.strokeStyle = isCurrentGuide ? 'rgba(217, 119, 6, 0.92)'
          : gradeReport ? 'rgba(14, 165, 233, 0.65)'
          : 'rgba(100, 116, 139, 0.35)';
        ctx.lineWidth = isCurrentGuide ? 3.5 : 2.2; ctx.setLineDash(isCurrentGuide ? [7, 5] : []);
        ctx.stroke();
        if (isCurrentGuide) {
          ctx.beginPath(); ctx.arc(st.end.x * w, st.end.y * h, 4.5, 0, Math.PI * 2);
          ctx.fillStyle = '#D97706'; ctx.fill();
          ctx.beginPath(); ctx.arc(st.start.x * w, st.start.y * h, 10, 0, Math.PI * 2);
          ctx.fillStyle = '#F59E0B'; ctx.fill();
          ctx.fillStyle = '#090F1E'; ctx.font = '800 11px sans-serif';
          ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
          ctx.fillText(String(st.index), st.start.x * w, st.start.y * h);
        }
        ctx.restore();
      });
    }
    // 5. Render User's Pressure-Tapered Strokes
    const drawSamplePolyline = (pts: StylusSamplePoint[], color: string) => {
      if (pts.length === 0) return;
      ctx.save(); ctx.lineCap = 'round';
      ctx.lineJoin = 'round'; ctx.strokeStyle = color;
      ctx.fillStyle = color;
      if (pts.length === 1) {
        ctx.beginPath(); ctx.arc(pts[0].x * w, pts[0].y * h, pts[0].widthPx / 2, 0, Math.PI * 2);
        ctx.fill(); ctx.restore();
        return;
      }
      for (let i = 1; i < pts.length; i++) {
        const p0 = pts[i - 1];
        const p1 = pts[i];
        ctx.beginPath(); ctx.lineWidth = (p0.widthPx + p1.widthPx) / 2;
        ctx.moveTo(p0.x * w, p0.y * h); ctx.lineTo(p1.x * w, p1.y * h);
        ctx.stroke();
      }
      ctx.restore();
    };
    drawnStrokes.forEach((st, idx) => {
      const singleGrade = gradeReport?.strokeResults[idx];
      const strokeColor = singleGrade && !singleGrade.passed
        ? (isLight ? '#BE123C' : '#FDA4AF')
        : (isLight ? '#1C1917' : '#6EE7B7');
      drawSamplePolyline(st.points, strokeColor);
    });
    if (activePoints.length > 0) {
      drawSamplePolyline(activePoints, isLight ? '#0F766E' : '#38BDF8');
    }
  }, [charEntry, drawnStrokes, activePoints, practiceMode, gridStyle, gradeReport, revealDictationGlyph, progress.theme]);
  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const nativeEv = e.nativeEvent as unknown as Parameters<typeof extractCoalescedPoints>[0];
    if (!shouldAcceptPointerEvent(nativeEv, progress.palmRejectionPenOnly)) {
      return;
    }
    // Wacom Eraser nib or barrel button immediately pops the last stroke
    if (isWacomEraserEvent(nativeEv)) {
      setDrawnStrokes((prev) => prev.slice(0, -1));
      setGradeReport(null);
      return;
    }
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.setPointerCapture?.(e.pointerId);
    const rect = canvas.getBoundingClientRect();
    const pts = extractCoalescedPoints(nativeEv, rect);
    isDrawingRef.current = true;
    currentStrokeStartRef.current = Date.now();
    setActivePoints(pts);
    if (pts.length > 0) {
      const latest = pts[pts.length - 1];
      setLastPointerInfo({
        type: latest.pointerType, pressure: latest.pressure, widthPx: latest.widthPx, coalescedCount: pts.length, });
    }
  };
  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawingRef.current) return;
    const nativeEv = e.nativeEvent as unknown as Parameters<typeof extractCoalescedPoints>[0];
    if (!shouldAcceptPointerEvent(nativeEv, progress.palmRejectionPenOnly)) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const pts = extractCoalescedPoints(nativeEv, rect);
    setActivePoints((prev) => [...prev, ...pts]);
    if (pts.length > 0) {
      const latest = pts[pts.length - 1];
      setLastPointerInfo({
        type: latest.pointerType, pressure: latest.pressure, widthPx: latest.widthPx, coalescedCount: pts.length, });
    }
  };
  const finalizeStroke = () => {
    if (!isDrawingRef.current) return;
    isDrawingRef.current = false;
    if (activePoints.length === 0) return;
    const newStroke: UserDrawnStroke = {
      points: activePoints, startedAt: currentStrokeStartRef.current, endedAt: Date.now(), };
    const nextStrokes = [...drawnStrokes, newStroke];
    setDrawnStrokes(nextStrokes);
    setActivePoints([]);
    // Auto-grade when user finishes all expected MOE strokes
    if (nextStrokes.length >= charEntry.strokes.length) {
      const report = gradeCharacterWriting(nextStrokes, charEntry, practiceMode);
      setGradeReport(report);
      const updated = recordStrokePractice( progress,
        { char: charEntry.char, zhuyin: charEntry.zhuyin, accuracy: report.overallAccuracy }, report.overallAccuracy >= 68,
        report.fsrsRating );
      onUpdateProgress(updated);
    }
  };
  const handleSimulateMoeStroke = () => {
    // Visual demonstration only — never writes FSRS mastery or XP credit
    const nextIdx = drawnStrokes.length;
    if (nextIdx >= charEntry.strokes.length) return;
    const ref = charEntry.strokes[nextIdx];
    const spine = [ref.start, ...(ref.waypoints && ref.waypoints.length > 0 ? ref.waypoints : ref.mid ? [ref.mid] : []), ref.end];
    const now = Date.now();
    const pts: StylusSamplePoint[] = spine.map((pt, i) => {
      const t = spine.length <= 1 ? 0.5 : i / (spine.length - 1);
      const pressure = Number((0.48 + Math.sin(t * Math.PI) * 0.32).toFixed(2));
      return { x: pt.x, y: pt.y, pressure, widthPx: 4.5 + pressure * 8.5, timestamp: now + i * 16, pointerType: 'pen' };
    });
    const nextStrokes = [...drawnStrokes, { points: pts, startedAt: now, endedAt: now + pts.length * 16 }];
    setDrawnStrokes(nextStrokes);
    if (nextStrokes.length >= charEntry.strokes.length) {
      setGradeReport(gradeCharacterWriting(nextStrokes, charEntry, practiceMode));
    }
  };
  const handleToggleHandedness = (next: StylusHandedness) => {
    onUpdateProgress({ ...progress, handedness: next });
  };
  const handleTogglePalmRejection = () => {
    onUpdateProgress({ ...progress, palmRejectionPenOnly: !progress.palmRejectionPenOnly });
  };
  const nextRefStroke = charEntry.strokes[drawnStrokes.length];
  const latestStrokeGrade = drawnStrokes.length > 0 && drawnStrokes.length <= charEntry.strokes.length
      ? gradeUserStroke(drawnStrokes[drawnStrokes.length - 1], charEntry.strokes[drawnStrokes.length - 1]) : null;
  const activeSeries = PHONETIC_SERIES_BANK.find((s) => s.id === selectedSeriesId) || PHONETIC_SERIES_BANK[0];
  const filteredDerivatives = selectedRadical === 'ALL'
      ? activeSeries.derivatives : activeSeries.derivatives.filter((d) => d.semanticRadical === selectedRadical);
  return (
    <div className="space-y-5">
      <StudioHeaderBanner studioId="calligraphy"
        titleZh="書法筆順與形聲工坊" titleEn="Wacom Calligraphy & MOE Stroke Studio"
        subtitle="Taiwan Ministry of Education (國字標準字體筆順) vector stroke grading with W3C PointerEvent pressure tapering, coalesced sampling, Wacom eraser detection, and Semantic-Phonetic (形聲字) decomposition."
        rightSlot={
          <div className="flex flex-wrap items-center gap-2">
            <HandednessToggle handedness={progress.handedness} onToggle={handleToggleHandedness} />
            <StylusButton variant={progress.palmRejectionPenOnly ? 'primary' : 'secondary'}
              onClick={handleTogglePalmRejection}
              title="Reject capacitive finger/palm touch events and accept only Wacom EMR pen/eraser events" >
              <span>🛡️ {progress.palmRejectionPenOnly ? 'Pen-Only Palm Rejection: ON' : 'Pen + Mouse/Touch: ON'}</span>
            </StylusButton>
          </div>
        }
      />
      <StudioModeSwitcher modes={SUB_TABS} activeMode={subTab} onSelect={setSubTab} />
      {subTab === 'calligraphy' ? (
        <div className={`flex flex-col lg:flex-row gap-6 items-start ${
            progress.handedness === 'left' ? 'lg:flex-row-reverse' : 'lg:flex-row' }`}
        >
          {/* Wacom Calligraphy Canvas Column (Compact for iPad mini 6 landscape 1133x744) */}
          <div className="w-full lg:w-[400px] shrink-0 fs-card p-4 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-1.5">
                {PRACTICE_MODES.map((m) => (
                  <StylusButton key={m.id} variant={practiceMode === m.id ? 'primary' : 'secondary'} onClick={() => setPracticeMode(m.id)} >
                    <span>{m.labelZh}</span>
                  </StylusButton>
                ))}
              </div>
              <StylusButton variant="ghost" onClick={() => setGridStyle((g) => (g === 'jiugongge' ? 'tianzige' : 'jiugongge'))} >
                <span>{gridStyle === 'jiugongge' ? '九宮格' : '田字格'}</span>
              </StylusButton>
            </div>
            <div className="relative flex justify-center">
              <canvas ref={canvasRef}
                width={340}
                height={340}
                style={{ touchAction: 'none' }}
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={finalizeStroke}
                onPointerCancel={finalizeStroke}
                className="w-full max-w-[340px] aspect-square rounded-2xl border-2 border-emerald-600/40 shadow-inner cursor-crosshair select-none"
              />
            </div>
            {/* Live Wacom Telemetry & Action Bar */}
            <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-3 text-xs text-slate-300 flex flex-wrap items-center justify-between gap-2">
              <span>
                Stylus: <strong className="text-emerald-300">{lastPointerInfo.type}</strong> · Pressure:{' '}
                <strong className="text-sky-300">{Math.round(lastPointerInfo.pressure * 100)}%</strong> ({lastPointerInfo.widthPx}px)
              </span>
              <span>
                Strokes:{' '}
                <strong className="text-amber-300">{drawnStrokes.length} / {charEntry.strokes.length}</strong>
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <StylusButton variant="secondary"
                onClick={() => {
                  setDrawnStrokes((prev) => prev.slice(0, -1));
                  setGradeReport(null);
                }}
                disabled={drawnStrokes.length === 0}
              >
                <span>↩️ Undo Stroke</span>
              </StylusButton>
              <StylusButton variant="danger"
                onClick={() => {
                  setDrawnStrokes([]);
                  setGradeReport(null);
                }}
              >
                <span>🧹 Clear Canvas</span>
              </StylusButton>
              <StylusButton variant="amber" onClick={handleSimulateMoeStroke}>
                <span>✨ Demo Next MOE Stroke</span>
              </StylusButton>
              {practiceMode === 'dictation' && (
                <StylusButton variant="ghost" onClick={() => setRevealDictationGlyph((r) => !r)} >
                  <span>👁️ {revealDictationGlyph ? 'Hide Hint' : 'Peek Glyph'}</span>
                </StylusButton>
              )}
            </div>
          </div>
          {/* Character Bank & Taiwan MOE Orthography Inspector Column */}
          <div className="flex-1 space-y-4 w-full">
            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-extrabold text-emerald-300 uppercase tracking-wider">
                  教育部國字標準字體筆順字庫 · Curated 20-Character Taiwan MOE Bank
                </h2>
                <span className="text-xs text-slate-400">Docking: <strong>{progress.handedness === 'left' ? 'Left-Handed (Canvas Right)' : 'Right-Handed (Canvas Left)'}</strong></span>
              </div>
              <div className="flex flex-wrap gap-2">
                {MOE_STROKE_CHARACTER_BANK.map((c) => {
                  const mastery = progress.strokeMastery[c.char];
                  return (
                    <StylusButton key={c.char}
                      variant={selectedChar === c.char ? 'primary' : 'secondary'}
                      onClick={() => setSelectedChar(c.char)}
                    >
                      <span className="text-base font-black">{c.char}</span>
                      <span className="text-xs opacity-80">{c.zhuyin}</span>
                      {mastery && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300">{mastery.bestAccuracy}%</span>)}</StylusButton>
                  );
                })}
              </div>
            </div>
            {/* Active Character Orthography & Stroke-by-Stroke Feedback Card */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="px-4 py-3 rounded-2xl bg-slate-950 border border-slate-800">
                    <RubyText text={practiceMode === 'dictation' && !revealDictationGlyph && !gradeReport ? '？' : charEntry.char}
                      zhuyin={charEntry.zhuyin}
                      pinyin={charEntry.pinyin}
                      showPinyinHint={progress.showPinyinHint}
                      size="xl" zhuyinDisplayMode="always"
                    />
                  </div>
                  <div className="space-y-1">
                    <div className="text-lg font-extrabold text-white">
                      {charEntry.english}{' '}
                      <span className="text-xs px-2.5 py-1 rounded-full bg-slate-800 text-amber-300 font-bold">部首: {charEntry.radical} · {charEntry.totalStrokes} 畫</span>
                    </div>
                    <div className="text-xs text-slate-300">
                      Example: <strong className="text-emerald-300">{charEntry.exampleWord}</strong> ({charEntry.exampleZhuyin})
                    </div>
                  </div>
                </div>
                {onSpeak && (
                  <StylusButton variant="secondary" onClick={() => onSpeak(charEntry.exampleWord)}>
                    <span>🔊 Speak 「{charEntry.exampleWord}」</span>
                  </StylusButton>
                )}
              </div>
              <div className="bg-amber-950/40 border border-amber-500/40 rounded-2xl p-3.5 text-xs sm:text-sm text-amber-100 space-y-1">
                <div className="font-extrabold text-amber-300">🇹🇼 Taiwan MOE Standard Orthography Note (國字標準字體筆順):</div>
                <p>{charEntry.taiwanMoeOrthographyNote}</p>
                {charEntry.mainlandComparisonNote && (
                  <p className="text-xs text-slate-300 pt-1">
                    <strong>Cross-Strait Contrast:</strong> {charEntry.mainlandComparisonNote}
                  </p>
                )}
              </div>
              {nextRefStroke && (
                <div className="bg-slate-950/90 border border-slate-800 rounded-2xl p-3.5 text-xs sm:text-sm flex items-center justify-between">
                  <div>
                    <span className="text-emerald-300 font-extrabold">Next Stroke #{nextRefStroke.index} ({nextRefStroke.nameZh}):</span>{' '}
                    <span className="text-slate-200">{nextRefStroke.tipEn}</span>
                  </div>
                  <span className="text-xs text-slate-400">Type: {nextRefStroke.type}</span>
                </div>
              )}
              {latestStrokeGrade && !gradeReport && (
                <div className={`rounded-2xl p-3 text-xs sm:text-sm border ${
                    latestStrokeGrade.passed ? 'bg-emerald-950/50 border-emerald-500/50 text-emerald-200'
                      : 'bg-rose-950/60 border-rose-500/60 text-rose-200' }`}
                >
                  <strong>{latestStrokeGrade.feedbackEn}</strong> (Start: {latestStrokeGrade.startPointScore}%, Direction:{' '}
                  {latestStrokeGrade.directionScore}%)
                </div>
              )}
              {gradeReport && (
                <div className="bg-emerald-950/60 border border-emerald-400/60 rounded-2xl p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-base font-extrabold text-emerald-300">MOE Grading Report: {gradeReport.overallAccuracy}% (FSRS Rating {gradeReport.fsrsRating})</span>
                    <StylusButton variant="primary"
                      onClick={() => {
                        setDrawnStrokes([]);
                        setGradeReport(null);
                      }}
                    >
                      <span>Practice Again</span>
                    </StylusButton>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-100">{gradeReport.summaryFeedbackEn}</p>
                </div>
              )}
              <CrossStudioActionPills targetText={charEntry.char}
                targetZhuyin={charEntry.zhuyin}
                targetEnglish={charEntry.english}
                sourceStudio="calligraphy" sourceLabel="Wacom Calligraphy Studio"
              />
            </div>
          </div>
        </div>
      ) : ( /* 形聲字 Semantic-Phonetic Radical & Sound-Component Workbench (FORM-REQ-0014) */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          <div className="lg:col-span-5 bg-slate-900/90 border border-slate-800 rounded-3xl p-5 space-y-4">
            <h2 className="text-sm font-extrabold text-emerald-300 uppercase tracking-wider">10 Core Semantic Radicals (部首意義分類)</h2>
            <div className="flex flex-wrap gap-2">
              <StylusButton variant={selectedRadical === 'ALL' ? 'primary' : 'secondary'} onClick={() => setSelectedRadical('ALL')} >
                <span>All Radicals (全部部首)</span>
              </StylusButton>
              {SEMANTIC_RADICALS.map((rad) => (
                <StylusButton key={rad.radical}
                  variant={selectedRadical === rad.radical ? 'primary' : 'secondary'}
                  onClick={() => setSelectedRadical(rad.radical)}
                >
                  <span className="text-base font-black">{rad.radical}</span>
                  <span className="text-xs opacity-80">{rad.meaningEn.split(',')[0]}</span>
                </StylusButton>
              ))}
            </div>
            <h3 className="text-sm font-extrabold text-amber-300 uppercase tracking-wider pt-2">
              10 High-Yield Phonetic Series (聲符字族 · 46 Traditional Characters)
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {PHONETIC_SERIES_BANK.map((ser) => (
                <StylusButton key={ser.id}
                  variant={selectedSeriesId === ser.id ? 'amber' : 'secondary'}
                  onClick={() => {
                    setSelectedSeriesId(ser.id);
                    setSelectedRadical('ALL');
                  }}
                >
                  <span className="text-base font-black">{ser.phoneticComponent}</span>
                  <span className="text-xs">{ser.baseZhuyin}</span>
                </StylusButton>
              ))}
            </div>
          </div>
          <div className="lg:col-span-7 bg-slate-900/90 border border-slate-800 rounded-3xl p-5 space-y-4">
            <div className="border-b border-slate-800 pb-3">
              <div className="text-lg font-extrabold text-white">
                聲符 「{activeSeries.phoneticComponent}」 ({activeSeries.baseZhuyin} · {activeSeries.basePinyin}) —{' '}
                <span className="text-emerald-300">{activeSeries.baseMeaningEn}</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-300 mt-1">{activeSeries.soundPatternSummary}</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {filteredDerivatives.map((d) => (
                <div key={d.char}
                  className="bg-slate-950/90 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between gap-3" >
                  <div className="flex items-start justify-between gap-3">
                    <RubyText text={d.char} zhuyin={d.zhuyin} pinyin={d.pinyin} size="lg" zhuyinDisplayMode="always" />
                    <span className="px-2.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-bold">部首 {d.semanticRadical} + 聲符 {activeSeries.phoneticComponent}</span>
                  </div>
                  <div className="text-xs text-slate-300 space-y-1">
                    <div className="font-bold text-white">{d.english} · 例詞: {d.exampleCompound}</div>
                    <div>{d.semanticRoleEn}</div>
                    <div className="text-amber-300">{d.phoneticRelationNote}</div>
                  </div>
                  <div className="flex items-center gap-2 pt-1">
                    {MOE_STROKE_CHARACTER_BANK.some((c) => c.char === d.char) ? (
                      <StylusButton
                        variant="secondary"
                        onClick={() => {
                          setSelectedChar(d.char);
                          setSubTab('calligraphy');
                        }}
                      >
                        <span>✒️ Practice on Canvas</span>
                      </StylusButton>
                    ) : (
                      <span className="text-xs px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-400">
                        Reference Only (Not in 20-char MOE stroke bank)
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
