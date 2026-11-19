/**
 * FormosaStudio (FORM) — Interactive Basic Stroke Practice Pad (Stage 0 Module 0.4)
 * Lets Day-1 beginners practice each of the 8 fundamental Chinese strokes individually
 * with animated directional guides and live direction/accuracy feedback (Wacom stylus + mouse/touch).
 */

import React, { useEffect, useRef, useState } from 'react';
import { BasicStrokeLesson, STAGE0_BASIC_STROKES } from '../data/stage0BeginnerData.ts';
import { StylusButton } from './uiPrimitives.tsx';

interface Point2D {
  x: number;
  y: number;
  p: number;
}

function dist(a: { x: number; y: number }, b: { x: number; y: number }): number {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

function evaluateBasicStroke(drawn: Point2D[], ref: { x: number; y: number }[]): { pass: boolean; score: number; message: string } {
  if (drawn.length < 4) {
    return { pass: false, score: 0, message: 'Draw a smooth stroke following the green Start dot → arrow.' };
  }
  const dStart = dist(drawn[0], ref[0]);
  const dEnd = dist(drawn[drawn.length - 1], ref[ref.length - 1]);
  const revStart = dist(drawn[0], ref[ref.length - 1]);
  const revEnd = dist(drawn[drawn.length - 1], ref[0]);

  if (revStart + revEnd + 0.08 < dStart + dEnd) {
    return { pass: false, score: 25, message: 'Reversed direction! Start at the green "Start" dot and follow the arrow.' };
  }

  // Check midpoint proximity (especially important for Corner Turn 橫折 and Vertical Hook 豎鉤)
  const midRef = ref[Math.floor(ref.length / 2)];
  let bestMid = 1;
  for (const pt of drawn) {
    const d = dist(pt, midRef);
    if (d < bestMid) bestMid = d;
  }

  const avgErr = (dStart + dEnd + bestMid) / 3;
  const score = Math.max(0, Math.min(100, Math.round((1 - avgErr / 0.45) * 100)));
  if (dStart > 0.24) {
    return { pass: false, score, message: 'Start closer to the green "Start" dot and trace along the dashed guide.' };
  }
  if (bestMid > 0.22) {
    return { pass: false, score, message: 'Follow the curve/corner through the middle of the dashed guide without lifting!' };
  }
  if (dEnd > 0.26) {
    return { pass: false, score, message: 'Finish closer to the arrow tip so the stroke length is balanced.' };
  }
  return { pass: true, score: Math.max(82, score), message: `✓ Clean stroke! (${Math.max(82, score)}% match)` };
}

export const BasicStrokePracticePad: React.FC = () => {
  const [strokeIdx, setStrokeIdx] = useState<number>(0);
  const [practicedIds, setPracticedIds] = useState<string[]>([]);
  const [drawnPoints, setDrawnPoints] = useState<Point2D[]>([]);
  const [feedback, setFeedback] = useState<{ pass: boolean; score: number; message: string } | null>(null);
  const [demoProgress, setDemoProgress] = useState<number>(1);
  const drawingRef = useRef<boolean>(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const activeStroke: BasicStrokeLesson = STAGE0_BASIC_STROKES[strokeIdx] || STAGE0_BASIC_STROKES[0];

  // Animate guide stroke whenever stroke changes or user taps Replay
  const runDemoAnimation = () => {
    setDemoProgress(0);
    const start = performance.now();
    const duration = 750;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      setDemoProgress(t);
      if (t < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };

  useEffect(() => {
    setDrawnPoints([]);
    setFeedback(null);
    runDemoAnimation();
  }, [strokeIdx]);

  // Draw rice-paper grid, dashed stroke guide, animated guide nib, and user ink
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const W = canvas.width;
    const H = canvas.height;
    ctx.clearRect(0, 0, W, H);

    // Rice-paper background + 米字格 guide lines
    ctx.fillStyle = '#FCFBF7';
    ctx.fillRect(0, 0, W, H);
    ctx.strokeStyle = 'rgba(180, 165, 145, 0.35)';
    ctx.lineWidth = 1;
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(W / 2, 0); ctx.lineTo(W / 2, H);
    ctx.moveTo(0, H / 2); ctx.lineTo(W, H / 2);
    ctx.moveTo(0, 0); ctx.lineTo(W, H);
    ctx.moveTo(W, 0); ctx.lineTo(0, H);
    ctx.stroke();
    ctx.setLineDash([]);

    // Reference dashed stroke guide
    const pts = activeStroke.guidePoints.map((p) => ({ x: p.x * W, y: p.y * H }));
    ctx.strokeStyle = 'rgba(15, 118, 110, 0.28)';
    ctx.lineWidth = 14;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.beginPath();
    pts.forEach((p, i) => (i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y)));
    ctx.stroke();

    // Animated golden direction demo overlay
    if (demoProgress > 0 && pts.length >= 2) {
      const segLengths: number[] = [];
      let totalLen = 0;
      for (let i = 1; i < pts.length; i++) {
        const l = Math.hypot(pts[i].x - pts[i - 1].x, pts[i].y - pts[i - 1].y);
        segLengths.push(l);
        totalLen += l;
      }
      let targetLen = totalLen * demoProgress;
      ctx.strokeStyle = '#D97706';
      ctx.lineWidth = 6;
      ctx.beginPath();
      ctx.moveTo(pts[0].x, pts[0].y);
      for (let i = 1; i < pts.length; i++) {
        if (targetLen >= segLengths[i - 1]) {
          ctx.lineTo(pts[i].x, pts[i].y);
          targetLen -= segLengths[i - 1];
        } else {
          const frac = segLengths[i - 1] > 0 ? targetLen / segLengths[i - 1] : 0;
          ctx.lineTo(pts[i - 1].x + (pts[i].x - pts[i - 1].x) * frac, pts[i - 1].y + (pts[i].y - pts[i - 1].y) * frac);
          break;
        }
      }
      ctx.stroke();
    }

    // Start dot & End arrow tip
    ctx.fillStyle = '#0F766E';
    ctx.beginPath();
    ctx.arc(pts[0].x, pts[0].y, 7, 0, Math.PI * 2);
    ctx.fill();
    ctx.font = 'bold 11px sans-serif';
    ctx.fillText('Start', Math.max(8, pts[0].x - 16), Math.max(16, pts[0].y - 12));

    const last = pts[pts.length - 1];
    const prev = pts[pts.length - 2];
    const ang = Math.atan2(last.y - prev.y, last.x - prev.x);
    ctx.fillStyle = '#B45309';
    ctx.beginPath();
    ctx.moveTo(last.x, last.y);
    ctx.lineTo(last.x - 12 * Math.cos(ang - 0.45), last.y - 12 * Math.sin(ang - 0.45));
    ctx.lineTo(last.x - 12 * Math.cos(ang + 0.45), last.y - 12 * Math.sin(ang + 0.45));
    ctx.closePath();
    ctx.fill();

    // User's live ink stroke
    if (drawnPoints.length > 1) {
      ctx.strokeStyle = '#1C1917';
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      for (let i = 1; i < drawnPoints.length; i++) {
        ctx.lineWidth = Math.max(5, 4 + drawnPoints[i].p * 9);
        ctx.beginPath();
        ctx.moveTo(drawnPoints[i - 1].x * W, drawnPoints[i - 1].y * H);
        ctx.lineTo(drawnPoints[i].x * W, drawnPoints[i].y * H);
        ctx.stroke();
      }
    }
  }, [activeStroke, drawnPoints, demoProgress]);

  const toNorm = (e: React.PointerEvent<HTMLCanvasElement>): Point2D => {
    const rect = e.currentTarget.getBoundingClientRect();
    return {
      x: Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width)),
      y: Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height)),
      p: e.pressure && e.pressure > 0 ? e.pressure : 0.5,
    };
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="text-sm font-bold" style={{ color: 'var(--fs-text)' }}>
          Interactive 8-Stroke Practice Pad ({practicedIds.length} / {STAGE0_BASIC_STROKES.length} practiced)
        </div>
        <span className="text-xs" style={{ color: 'var(--fs-text-muted)' }}>
          Click any stroke below, then trace it on the pad with mouse, touch, or Wacom stylus
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        {STAGE0_BASIC_STROKES.map((st, idx) => {
          const selected = idx === strokeIdx;
          const done = practicedIds.includes(st.id);
          return (
            <button
              key={st.id}
              type="button"
              onClick={() => setStrokeIdx(idx)}
              style={{
                backgroundColor: selected ? 'var(--fs-accent-soft)' : 'var(--fs-subtle)',
                borderColor: selected ? 'var(--fs-accent-border)' : 'var(--fs-border)',
              }}
              className="p-3 rounded-xl border text-left transition flex flex-col justify-start gap-0.5"
            >
              <div className="flex items-center justify-between gap-1">
                <span className="text-2xl font-bold" style={{ color: 'var(--fs-accent-text)' }}>{st.glyph}</span>
                {done && <span className="text-xs font-bold" style={{ color: 'var(--fs-accent-text)' }}>✓</span>}
              </div>
              <div className="text-sm font-bold" style={{ color: 'var(--fs-text)' }}>{st.nameEn}</div>
              <div className="text-[11px]" style={{ color: 'var(--fs-text-muted)' }}>{st.nameZh}</div>
            </button>
          );
        })}
      </div>

      <div className="fs-subtle-box p-4 grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
        <div className="md:col-span-5 flex justify-center">
          <canvas
            ref={canvasRef}
            width={280}
            height={220}
            className="rounded-xl border shadow-sm touch-none cursor-crosshair max-w-full"
            style={{ borderColor: 'var(--fs-border-strong)' }}
            onPointerDown={(e) => {
              e.currentTarget.setPointerCapture(e.pointerId);
              drawingRef.current = true;
              setFeedback(null);
              setDrawnPoints([toNorm(e)]);
            }}
            onPointerMove={(e) => {
              if (!drawingRef.current) return;
              setDrawnPoints((prev) => [...prev, toNorm(e)]);
            }}
            onPointerUp={() => {
              if (!drawingRef.current) return;
              drawingRef.current = false;
              const res = evaluateBasicStroke(drawnPoints, activeStroke.guidePoints);
              setFeedback(res);
              if (res.pass && !practicedIds.includes(activeStroke.id)) {
                setPracticedIds((prev) => [...prev, activeStroke.id]);
              }
            }}
          />
        </div>
        <div className="md:col-span-7 space-y-3">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--fs-accent-text)' }}>
              Practicing Stroke {strokeIdx + 1} of {STAGE0_BASIC_STROKES.length} · Used in: {activeStroke.sampleChar}
            </div>
            <div className="text-lg font-bold" style={{ color: 'var(--fs-text)' }}>
              {activeStroke.nameEn} — {activeStroke.nameZh}
            </div>
            <p className="text-sm mt-1" style={{ color: 'var(--fs-text-secondary)' }}>{activeStroke.cue}</p>
          </div>
          {feedback && (
            <div
              className="px-3.5 py-2.5 rounded-xl text-sm font-semibold border"
              style={{
                backgroundColor: feedback.pass ? 'var(--fs-accent-soft)' : 'var(--fs-surface)',
                borderColor: feedback.pass ? 'var(--fs-accent-border)' : 'var(--fs-border-strong)',
                color: feedback.pass ? 'var(--fs-accent-text)' : 'var(--fs-warm)',
              }}
            >
              {feedback.message}
            </div>
          )}
          <div className="flex flex-wrap gap-2">
            <StylusButton variant="secondary" onClick={runDemoAnimation}><span>Replay Stroke Guide</span></StylusButton>
            <StylusButton variant="ghost" onClick={() => { setDrawnPoints([]); setFeedback(null); }}><span>Clear Pad</span></StylusButton>
            <StylusButton variant="primary" onClick={() => setStrokeIdx((i) => (i + 1) % STAGE0_BASIC_STROKES.length)}>
              <span>Next Stroke →</span>
            </StylusButton>
          </div>
        </div>
      </div>
    </div>
  );
};
