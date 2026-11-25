/**
 * FormosaStudio (FORM) — Shared UI Primitive Kit & Ergonomic Controls (v2.1.0 Crisp Neutral Studio)
 * Enforces WCAG 2.1 AA (>= 4.5:1) Light + Dark palettes, >= 44x44 px Wacom/iPad hit targets, and Lucide monoline icons.
 * Traces to: FORM-REQ-0021, FORM-REQ-0018, FORM-DEC-004, FORM-DEP-UX-001
 */

import React from 'react';
import { ArrowLeft, BookOpen, Brain, Hand, Mic, PenTool } from 'lucide-react';
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
  lightTextHex: string;
  borderHex: string;
  bgRgba: string;
  contrastRatioOnSlate: number; // Verified >= 4.5:1 on Dark #0F1115 / #0F172A
  contrastRatioOnLight: number; // Verified >= 4.5:1 on Light #FFFFFF / #FAFAFA
  tailwindBadgeClass: string;
}

/**
 * WCAG 2.1 Level AA Verified Tone Palette for both Dark (#0F1115) & Light (#FFFFFF/#FAFAFA) Neutral Studio (DEP-01 & DEP-04).
 */
export const WCAG_TONE_PALETTE: Record<1 | 2 | 3 | 4 | 5, TonePaletteToken> = {
  1: {
    tone: 1,
    labelZh: '一聲 (陰平)',
    labelEn: 'Tone 1 · High Flat',
    contour: '55',
    mark: 'ˉ',
    textHex: '#7DD3FC',
    lightTextHex: '#0369A1',
    borderHex: '#38BDF8',
    bgRgba: 'rgba(14, 116, 144, 0.25)',
    contrastRatioOnSlate: 11.3,
    contrastRatioOnLight: 5.93,
    tailwindBadgeClass: 'fs-subtle-box',
  },
  2: {
    tone: 2,
    labelZh: '二聲 (陽平)',
    labelEn: 'Tone 2 · Rising',
    contour: '35',
    mark: 'ˊ',
    textHex: '#6EE7B7',
    lightTextHex: '#047857',
    borderHex: '#34D399',
    bgRgba: 'rgba(4, 120, 87, 0.25)',
    contrastRatioOnSlate: 12.4,
    contrastRatioOnLight: 5.48,
    tailwindBadgeClass: 'fs-subtle-box',
  },
  3: {
    tone: 3,
    labelZh: '三聲 (上聲)',
    labelEn: 'Tone 3 · Dipping',
    contour: '214',
    mark: 'ˇ',
    textHex: '#FBBF24',
    lightTextHex: '#92400E',
    borderHex: '#FBBF24',
    bgRgba: 'rgba(180, 83, 9, 0.25)',
    contrastRatioOnSlate: 11.3,
    contrastRatioOnLight: 7.09,
    tailwindBadgeClass: 'fs-subtle-box',
  },
  4: {
    tone: 4,
    labelZh: '四聲 (去聲)',
    labelEn: 'Tone 4 · Falling',
    contour: '51',
    mark: 'ˋ',
    textHex: '#FCA5A5',
    lightTextHex: '#BE123C',
    borderHex: '#F87171',
    bgRgba: 'rgba(185, 28, 28, 0.25)',
    contrastRatioOnSlate: 9.9,
    contrastRatioOnLight: 6.29,
    tailwindBadgeClass: 'fs-subtle-box',
  },
  5: {
    tone: 5,
    labelZh: '輕聲 (Neutral)',
    labelEn: 'Tone 5 · Neutral',
    contour: '·',
    mark: '˙',
    textHex: '#D8B4FE',
    lightTextHex: '#6D28D9',
    borderHex: '#C084FC',
    bgRgba: 'rgba(109, 40, 217, 0.25)',
    contrastRatioOnSlate: 10.7,
    contrastRatioOnLight: 7.1,
    tailwindBadgeClass: 'fs-subtle-box',
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
      className={`inline-flex items-center gap-1 rounded-full border font-medium ${
        compact ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-0.5 text-xs'
      }`}
      style={{
        color: cssColor,
        borderColor: 'var(--fs-border-strong)',
        backgroundColor: 'var(--fs-subtle)',
      }}
    >
      <span>{token.labelZh.split(' ')[0]}</span>
      {showContour && <span className="opacity-80">({token.contour})</span>}
    </span>
  );
};

export interface StylusButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'amber' | 'ghost' | 'danger';
  shortcutHint?: string;
  active?: boolean;
}

/**
 * Wacom & iPad Stylus-First Button enforcing >= 44x44 px hit target (FORM-REQ-0018).
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
    primary: 'fs-btn-primary',
    secondary: active ? 'fs-btn-active' : 'fs-btn-secondary',
    amber: 'fs-btn-warm',
    ghost: 'fs-btn-ghost',
    danger: 'fs-btn-danger',
  };

  return (
    <button
      type="button"
      style={{ minHeight: '44px', minWidth: '44px', touchAction: 'manipulation' }}
      className={`min-h-[44px] min-w-[44px] px-3.5 py-2 rounded-lg border text-[13.5px] whitespace-nowrap shrink-0 inline-flex items-center justify-center gap-2 transition-colors duration-150 select-none disabled:opacity-45 disabled:pointer-events-none ${variantClasses[variant]} ${className}`}
      {...rest}
    >
      {children}
      {shortcutHint && (
        <kbd
          className="px-1.5 py-0.5 rounded text-[11px] font-mono opacity-75"
          style={{ backgroundColor: 'rgba(128, 128, 128, 0.14)' }}
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
      className="rounded-xl p-1 inline-flex flex-wrap items-center gap-1 border"
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
              color: isSelected ? 'var(--fs-text)' : 'var(--fs-text-secondary)',
              borderColor: isSelected ? 'var(--fs-border-strong)' : 'transparent',
              boxShadow: isSelected ? 'var(--fs-shadow)' : 'none',
            }}
            className="min-h-[44px] px-3 py-1.5 rounded-lg border text-[13.5px] font-medium whitespace-nowrap transition-colors flex items-center gap-1.5"
            title={`${m.labelEn} · ${m.labelZh}`}
          >
            <span className={isSelected ? 'font-semibold' : ''}>{m.labelEn}</span>
            {modes.length <= 3 && <span className="opacity-60 text-xs hidden sm:inline">{m.labelZh}</span>}
            {m.badge !== undefined && (
              <span
                className="px-1.5 py-0.5 rounded-md text-[11px] font-medium"
                style={{
                  backgroundColor: isSelected ? 'var(--fs-accent-soft)' : 'var(--fs-hover)',
                  color: isSelected ? 'var(--fs-accent-text)' : 'var(--fs-text-muted)',
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
 * Calm Studio Header — flat header strip with hairline divider (zero heavy boxed clutter).
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
    <div className="pb-4 border-b flex flex-col gap-3" style={{ borderColor: 'var(--fs-border)' }}>
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-3">
        <div className="space-y-1 min-w-0">
          <div className="text-xs font-medium tracking-wide" style={{ color: 'var(--fs-accent-text)' }}>
            {studio.titleEn} · {studio.titleZh}
          </div>
          <h1 className="text-xl sm:text-2xl font-semibold tracking-tight" style={{ color: 'var(--fs-text)' }}>
            {titleEn}{' '}
            <span className="font-normal opacity-60 text-base sm:text-lg">· {titleZh}</span>
          </h1>
          <p className="text-sm max-w-3xl leading-relaxed" style={{ color: 'var(--fs-text-secondary)' }}>
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
      <Hand className="w-4 h-4 shrink-0 opacity-80" />
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
      className="rounded-xl px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 border"
      style={{
        backgroundColor: 'var(--fs-accent-soft)',
        borderColor: 'var(--fs-accent-border)',
      }}
    >
      <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--fs-text)' }}>
        <span
          className="px-2 py-0.5 rounded-md text-xs font-medium"
          style={{ backgroundColor: 'var(--fs-surface)', color: 'var(--fs-accent-text)' }}
        >
          Focused Practice
        </span>
        <span>
          Practicing <strong className="font-semibold">「{handoff.targetText}」</strong> from{' '}
          <strong style={{ color: 'var(--fs-accent-text)' }}>
            {originStudio?.titleEn || handoff.fromLabel}
          </strong>
        </span>
      </div>
      <div className="flex items-center gap-2">
        <StylusButton variant="primary" onClick={onReturn}>
          <ArrowLeft className="w-4 h-4 shrink-0" />
          <span>Return to {handoff.fromLabel || originStudio?.shortLabel}</span>
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
      <StylusButton variant="secondary" onClick={() => trigger('calligraphy', 'trace')} title="Practice stroke order on Wacom canvas">
        <PenTool className="w-4 h-4 shrink-0 opacity-80" />
        <span>Write Strokes</span>
      </StylusButton>
      <StylusButton variant="secondary" onClick={() => trigger('speaking', 'pitch_coach')} title="Compare your pitch contour">
        <Mic className="w-4 h-4 shrink-0 opacity-80" />
        <span>Pitch Coach</span>
      </StylusButton>
      <StylusButton variant="secondary" onClick={() => trigger('reader', 'custom_cloze')} title="Open in Reader & Cloze">
        <BookOpen className="w-4 h-4 shrink-0 opacity-80" />
        <span>Open in Reader</span>
      </StylusButton>
      {onBoostSrs && (
        <StylusButton variant="amber" onClick={onBoostSrs} title="Add or boost in FSRS review queue">
          <Brain className="w-4 h-4 shrink-0 opacity-80" />
          <span>Boost FSRS</span>
        </StylusButton>
      )}
    </div>
  );
};
