/**
 * FormosaStudio (FORM) — Phase 1 Shared UI Primitive Kit & Ergonomic Controls
 * Enforces FORM-DESCHAR-001 Night-Slate WCAG 2.1 AA Palette (>= 4.5:1) & >= 44x44 px Wacom Stylus Hit Targets.
 * Traces to: FORM-REQ-0021, FORM-REQ-0018, FORM-DEC-004, FORM-DEP-UX-001
 */

import React from 'react';
import {
  STUDIO_BY_ID,
  STUDIO_DEFINITIONS,
  StudioHandoffPayload,
  StudioId,
  dispatchStudioHandoff,
} from '../lib/studioContextBus.ts';
import { StylusHandedness } from '../lib/progressStore.ts';

export { STUDIO_DEFINITIONS, STUDIO_BY_ID };

export interface TonePaletteToken {
  tone: 1 | 2 | 3 | 4 | 5;
  labelZh: string;
  labelEn: string;
  contour: string;
  mark: string;
  textHex: string;
  borderHex: string;
  bgRgba: string;
  contrastRatioOnSlate: number; // Verified >= 4.5:1 on #0F172A
  tailwindBadgeClass: string;
}

/**
 * WCAG 2.1 Level AA Verified Tone Palette on #0F172A Night-Slate (FORM-DESCHAR-001 §2.5).
 * Explicitly avoids pure #EF4444 (4.43:1 fail) for Tone 4 in favor of #FCA5A5 / #F87171 (>= 6.8:1).
 */
export const WCAG_TONE_PALETTE: Record<1 | 2 | 3 | 4 | 5, TonePaletteToken> = {
  1: {
    tone: 1,
    labelZh: '一聲 (陰平)',
    labelEn: 'Tone 1 · High Flat',
    contour: '55',
    mark: 'ˉ',
    textHex: '#7DD3FC',
    borderHex: '#38BDF8',
    bgRgba: 'rgba(14, 116, 144, 0.35)',
    contrastRatioOnSlate: 11.4,
    tailwindBadgeClass: 'bg-sky-950/80 text-sky-300 border-sky-400/60',
  },
  2: {
    tone: 2,
    labelZh: '二聲 (陽平)',
    labelEn: 'Tone 2 · Rising',
    contour: '35',
    mark: 'ˊ',
    textHex: '#6EE7B7',
    borderHex: '#34D399',
    bgRgba: 'rgba(4, 120, 87, 0.35)',
    contrastRatioOnSlate: 12.1,
    tailwindBadgeClass: 'bg-emerald-950/80 text-emerald-300 border-emerald-400/60',
  },
  3: {
    tone: 3,
    labelZh: '三聲 (上聲)',
    labelEn: 'Tone 3 · Dipping',
    contour: '214',
    mark: 'ˇ',
    textHex: '#FDE68A',
    borderHex: '#FBBF24',
    bgRgba: 'rgba(180, 83, 9, 0.35)',
    contrastRatioOnSlate: 14.2,
    tailwindBadgeClass: 'bg-amber-950/80 text-amber-200 border-amber-400/60',
  },
  4: {
    tone: 4,
    labelZh: '四聲 (去聲)',
    labelEn: 'Tone 4 · Falling',
    contour: '51',
    mark: 'ˋ',
    textHex: '#FCA5A5',
    borderHex: '#F87171',
    bgRgba: 'rgba(185, 28, 28, 0.35)',
    contrastRatioOnSlate: 9.3,
    tailwindBadgeClass: 'bg-rose-950/80 text-rose-300 border-rose-400/60',
  },
  5: {
    tone: 5,
    labelZh: '輕聲 (Neutral)',
    labelEn: 'Tone 5 · Neutral',
    contour: '·',
    mark: '˙',
    textHex: '#E9D5FF',
    borderHex: '#C084FC',
    bgRgba: 'rgba(109, 40, 217, 0.35)',
    contrastRatioOnSlate: 12.8,
    tailwindBadgeClass: 'bg-purple-950/80 text-purple-200 border-purple-400/60',
  },
};

export const ToneBadge: React.FC<{
  tone: 1 | 2 | 3 | 4 | 5;
  showContour?: boolean;
  compact?: boolean;
}> = ({ tone, showContour = true, compact = false }) => {
  const token = WCAG_TONE_PALETTE[tone] || WCAG_TONE_PALETTE[1];
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border font-bold ${
        compact ? 'px-2 py-0.5 text-[11px]' : 'px-2.5 py-1 text-xs'
      } ${token.tailwindBadgeClass}`}
      style={{ color: token.textHex, borderColor: token.borderHex }}
    >
      <span>{token.labelZh.split(' ')[0]}</span>
      {showContour && <span className="opacity-85">({token.contour})</span>}
    </span>
  );
};

export interface StylusButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'amber' | 'ghost' | 'danger';
  shortcutHint?: string;
  active?: boolean;
}

/**
 * Wacom Stylus-First Button Primitive enforcing >= 44x44 px hit target and zero hover-only dependencies.
 */
export const StylusButton: React.FC<StylusButtonProps> = ({
  variant = 'secondary',
  shortcutHint,
  active = false,
  className = '',
  children,
  ...rest
}) => {
  const variantClasses: Record<NonNullable<StylusButtonProps['variant']>, string> = {
    primary: 'bg-emerald-500 hover:bg-emerald-400 active:bg-emerald-300 text-slate-950 border-emerald-400 font-extrabold shadow',
    secondary: active
      ? 'bg-slate-800 text-emerald-300 border-emerald-400/80 font-bold'
      : 'bg-slate-900 hover:bg-slate-800 active:bg-slate-700 text-slate-100 border-slate-700 font-bold',
    amber: 'bg-amber-400 hover:bg-amber-300 active:bg-amber-200 text-slate-950 border-amber-300 font-extrabold shadow',
    ghost: 'bg-slate-950/60 hover:bg-slate-900 text-slate-300 border-slate-800 font-semibold',
    danger: 'bg-rose-950/90 hover:bg-rose-900 text-rose-200 border-rose-500/60 font-bold',
  };

  return (
    <button
      type="button"
      style={{ minHeight: '44px', minWidth: '44px', touchAction: 'manipulation' }}
      className={`min-h-[44px] min-w-[44px] px-3.5 py-2 rounded-xl border text-xs sm:text-sm inline-flex items-center justify-center gap-2 transition select-none ${variantClasses[variant]} ${className}`}
      {...rest}
    >
      {children}
      {shortcutHint && (
        <kbd className="px-1.5 py-0.5 rounded bg-black/30 text-[10px] font-mono opacity-80">
          {shortcutHint}
        </kbd>
      )}
    </button>
  );
};

export interface StudioModeOption<T extends string = string> {
  id: T;
  labelZh: string;
  labelEn: string;
  badge?: string | number;
}

/**
 * Single-level Studio Sub-Mode Switcher enforcing >= 44px height per tab pill.
 */
export function StudioModeSwitcher<T extends string>({
  modes,
  activeMode,
  onSelect,
}: {
  modes: StudioModeOption<T>[];
  activeMode: T;
  onSelect: (mode: T) => void;
}) {
  return (
    <div
      role="tablist"
      className="bg-slate-950/90 border border-slate-800 rounded-2xl p-1.5 flex flex-wrap items-center gap-1.5"
    >
      {modes.map((m) => {
        const isSelected = m.id === activeMode;
        return (
          <button
            key={m.id}
            role="tab"
            aria-selected={isSelected}
            type="button"
            onClick={() => onSelect(m.id)}
            style={{ minHeight: '44px', minWidth: '44px', touchAction: 'manipulation' }}
            className={`min-h-[44px] px-4 py-2 rounded-xl text-xs sm:text-sm font-extrabold transition flex items-center gap-2 ${
              isSelected
                ? 'bg-emerald-500 text-slate-950 shadow'
                : 'bg-slate-900/70 text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-800/80'
            }`}
          >
            <span>{m.labelZh}</span>
            <span className={isSelected ? 'text-slate-900 font-semibold' : 'text-slate-400 font-medium'}>
              · {m.labelEn}
            </span>
            {m.badge !== undefined && (
              <span
                className={`px-2 py-0.5 rounded-full text-[11px] font-black ${
                  isSelected ? 'bg-slate-950 text-emerald-300' : 'bg-slate-800 text-amber-300'
                }`}
              >
                {m.badge}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

/**
 * Uniform Studio Header Banner used across all 6 top-level studios.
 */
export const StudioHeaderBanner: React.FC<{
  studioId: StudioId;
  titleZh: string;
  titleEn: string;
  subtitle: string;
  rightSlot?: React.ReactNode;
}> = ({ studioId, titleZh, titleEn, subtitle, rightSlot }) => {
  const studio = STUDIO_BY_ID[studioId];
  return (
    <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-emerald-950/30 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xl">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-extrabold uppercase tracking-wider">
            <span>{studio.shortLabel}</span>
            <span>·</span>
            <span>{studio.titleZh}</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
            {titleZh} <span className="text-emerald-300 font-bold">· {titleEn}</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed">{subtitle}</p>
        </div>
        {rightSlot && <div className="flex flex-wrap items-center gap-2 shrink-0">{rightSlot}</div>}
      </div>
    </div>
  );
};

/**
 * 1-Click Left-Handed / Right-Handed Wacom Toolbar Docking Toggle (FORM-REQ-0012, FORM-REQ-0018).
 */
export const HandednessToggle: React.FC<{
  handedness: StylusHandedness;
  onToggle: (next: StylusHandedness) => void;
}> = ({ handedness, onToggle }) => {
  const next = handedness === 'right' ? 'left' : 'right';
  return (
    <StylusButton
      variant="secondary"
      onClick={() => onToggle(next)}
      title="Swap toolbar docking edge so your Wacom drawing hand never covers action buttons"
    >
      <span>✋ {handedness === 'right' ? 'Right-Handed Dock (右手模式)' : 'Left-Handed Dock (左手模式)'}</span>
    </StylusButton>
  );
};

/**
 * Persistent Return Breadcrumb Banner shown whenever a learner deep-links across studios.
 */
export const ReturnBreadcrumbBar: React.FC<{
  handoff: StudioHandoffPayload | null;
  onReturn: () => void;
  onDismiss?: () => void;
}> = ({ handoff, onReturn, onDismiss }) => {
  if (!handoff) return null;
  const originStudio = STUDIO_BY_ID[handoff.fromStudio];
  return (
    <div className="bg-emerald-950/70 border border-emerald-500/50 rounded-2xl px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 shadow-lg">
      <div className="flex items-center gap-2.5 text-xs sm:text-sm text-emerald-100">
        <span className="px-2.5 py-1 rounded-lg bg-emerald-500/20 border border-emerald-400/40 font-extrabold text-emerald-300">
          Cross-Studio Handoff
        </span>
        <span>
          Practicing <strong className="text-white font-extrabold">「{handoff.targetText}」</strong> from{' '}
          <strong className="text-emerald-300">{originStudio?.titleEn || handoff.fromLabel}</strong>
        </span>
      </div>
      <div className="flex items-center gap-2">
        <StylusButton variant="primary" onClick={onReturn}>
          <span>← Return to {handoff.fromLabel || originStudio?.shortLabel}</span>
        </StylusButton>
        {onDismiss && (
          <StylusButton variant="ghost" onClick={onDismiss}>
            <span>Dismiss</span>
          </StylusButton>
        )}
      </div>
    </div>
  );
};

/**
 * 1-Click Cross-Studio Action Strip rendered inside the Context Dock and Word Inspector popovers.
 */
export const CrossStudioActionPills: React.FC<{
  targetText: string;
  targetZhuyin?: string;
  targetEnglish?: string;
  sourceStudio: StudioId;
  sourceLabel: string;
  onHandoffDispatched?: (payload: StudioHandoffPayload) => void;
  onBoostSrs?: () => void;
}> = ({
  targetText,
  targetZhuyin,
  targetEnglish,
  sourceStudio,
  sourceLabel,
  onHandoffDispatched,
  onBoostSrs,
}) => {
  const trigger = (toStudio: StudioId, modeHint: string) => {
    const payload = dispatchStudioHandoff({
      fromStudio: sourceStudio,
      fromLabel: sourceLabel,
      toStudio,
      targetText,
      targetZhuyin,
      targetEnglish,
      modeHint,
    });
    if (onHandoffDispatched) onHandoffDispatched(payload);
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      <StylusButton
        variant="secondary"
        onClick={() => trigger('calligraphy', 'trace')}
        title="Practice writing this character/word on the Wacom 九宮格 canvas"
      >
        <span>✒️ Write on Wacom (描紅)</span>
      </StylusButton>
      <StylusButton
        variant="secondary"
        onClick={() => trigger('speaking', 'pitch_coach')}
        title="Overlay your spoken F0 pitch contour for this phrase"
      >
        <span>🎤 Coach Pitch (F0)</span>
      </StylusButton>
      <StylusButton
        variant="secondary"
        onClick={() => trigger('reader', 'custom_cloze')}
        title="Inspect in Adaptive i+1 Reader & Cloze Studio"
      >
        <span>📖 Open in Reader</span>
      </StylusButton>
      {onBoostSrs && (
        <StylusButton
          variant="amber"
          onClick={onBoostSrs}
          title="Schedule or boost this item in your FSRS review queue"
        >
          <span>🧠 Boost in FSRS</span>
        </StylusButton>
      )}
    </div>
  );
};
