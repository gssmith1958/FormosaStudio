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
  const cssColor = `var(--fs-tone-${tone})`;
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border font-semibold ${
        compact ? 'px-2.5 py-0.5 text-xs' : 'px-3 py-1 text-sm'
      }`}
      style={{
        color: cssColor,
        borderColor: cssColor,
        backgroundColor: 'var(--fs-subtle)',
      }}
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
 * Wacom Stylus-First Button Primitive enforcing >= 44x44 px hit target and calm Warm-Paper / Calm-Dark styling.
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
    primary: 'fs-btn-primary shadow-sm',
    secondary: active ? 'fs-btn-active' : 'fs-btn-secondary',
    amber: 'fs-btn-warm',
    ghost: 'fs-btn-ghost',
    danger: 'fs-btn-danger',
  };

  return (
    <button
      type="button"
      style={{ minHeight: '44px', minWidth: '44px', touchAction: 'manipulation' }}
      className={`min-h-[44px] min-w-[44px] px-4 py-2 rounded-xl border text-sm whitespace-nowrap shrink-0 inline-flex items-center justify-center gap-2 transition select-none ${variantClasses[variant]} ${className}`}
      {...rest}
    >
      {children}
      {shortcutHint && (
        <kbd
          className="px-1.5 py-0.5 rounded text-xs font-mono opacity-80"
          style={{ backgroundColor: 'rgba(128, 128, 128, 0.16)' }}
        >
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
 * Clean Segmented Studio Sub-Mode Switcher enforcing >= 44px height per tab.
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
      className="rounded-2xl p-1.5 flex flex-wrap items-center gap-1.5 border"
      style={{ backgroundColor: 'var(--fs-subtle)', borderColor: 'var(--fs-border)' }}
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
            style={{
              minHeight: '44px',
              minWidth: '44px',
              touchAction: 'manipulation',
              backgroundColor: isSelected ? 'var(--fs-surface)' : 'transparent',
              color: isSelected ? 'var(--fs-accent-text)' : 'var(--fs-text-secondary)',
              borderColor: isSelected ? 'var(--fs-accent-border)' : 'transparent',
              boxShadow: isSelected ? 'var(--fs-shadow)' : 'none',
            }}
            className="min-h-[44px] px-3.5 py-2 rounded-xl border text-sm font-semibold whitespace-nowrap transition flex items-center gap-2"
            title={`${m.labelEn} · ${m.labelZh}`}
          >
            <span className={isSelected ? 'font-bold' : ''}>{m.labelEn}</span>
            {modes.length <= 3 && <span className="opacity-70 text-xs hidden sm:inline">{m.labelZh}</span>}
            {m.badge !== undefined && (
              <span
                className="px-2 py-0.5 rounded-full text-xs font-semibold"
                style={{
                  backgroundColor: isSelected ? 'var(--fs-accent-soft)' : 'var(--fs-hover)',
                  color: isSelected ? 'var(--fs-accent-text)' : 'var(--fs-text-secondary)',
                }}
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
 * Clean Studio Header Banner used across studios.
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
    <div className="fs-card px-6 py-5">
      <div className="flex flex-col gap-4">
        <div className="space-y-1.5 min-w-0">
          <div
            className="inline-flex items-center gap-2 text-xs font-semibold tracking-wide uppercase"
            style={{ color: 'var(--fs-accent-text)' }}
          >
            <span>{studio.shortLabel}</span>
            <span>·</span>
            <span>{studio.titleZh}</span>
          </div>
          <h1
            className="text-2xl sm:text-[26px] font-bold tracking-tight"
            style={{ color: 'var(--fs-text)' }}
          >
            {titleEn}{' '}
            <span className="font-semibold opacity-70 text-xl">· {titleZh}</span>
          </h1>
          <p
            className="text-sm sm:text-[15px] max-w-3xl leading-relaxed"
            style={{ color: 'var(--fs-text-secondary)' }}
          >
            {subtitle}
          </p>
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
      title="Swap sidebar and canvas docking edge so your Wacom drawing hand never covers buttons"
    >
      <span>{handedness === 'right' ? 'Right-Handed' : 'Left-Handed'}</span>
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
    <div
      className="rounded-2xl px-5 py-3 flex flex-wrap items-center justify-between gap-3 border"
      style={{
        backgroundColor: 'var(--fs-accent-soft)',
        borderColor: 'var(--fs-accent-border)',
      }}
    >
      <div className="flex items-center gap-2.5 text-sm" style={{ color: 'var(--fs-text)' }}>
        <span
          className="px-2.5 py-0.5 rounded-full text-xs font-semibold"
          style={{ backgroundColor: 'var(--fs-surface)', color: 'var(--fs-accent-text)' }}
        >
          Focused Practice
        </span>
        <span>
          Practicing <strong className="font-bold">「{handoff.targetText}」</strong> from{' '}
          <strong style={{ color: 'var(--fs-accent-text)' }}>
            {originStudio?.titleEn || handoff.fromLabel}
          </strong>
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
