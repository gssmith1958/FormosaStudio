/**
 * FormosaStudio (FORM) — Taiwanese Vertical Zhuyin Ruby Component with Polyphone (破音字), Sandhi & Adaptive Fading
 * Traces to: FORM-REQ-0001, FORM-REQ-0002, FORM-REQ-0018, FORM-REQ-0021
 */

import React, { useState } from 'react';
import { TONE_BY_NUMBER } from '../lib/zhuyinTypes.ts';
import { tokenizeAndAnnotate } from '../lib/zhuyinTokenizer.ts';
import { CharMasteryRecord, ZhuyinDisplayMode } from '../lib/progressStore.ts';

export interface RubyTextProps {
  text: string;
  zhuyin?: string;
  pinyin?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  zhuyinDisplayMode?: ZhuyinDisplayMode;
  showPinyinHint?: boolean;
  showSpokenSandhi?: boolean;
  charMastery?: Record<string, CharMasteryRecord>;
  colorByTone?: boolean;
  nonInteractive?: boolean;
  onSelectChar?: (char: string, zhuyin: string, wordContext?: string) => void;
}

export const RubyText: React.FC<RubyTextProps> = ({
  text,
  zhuyin,
  size = 'md',
  zhuyinDisplayMode = 'adaptive',
  showPinyinHint = false,
  showSpokenSandhi = true,
  charMastery = {},
  colorByTone = true,
  nonInteractive = false,
  onSelectChar,
}) => {
  const [peekedIndices, setPeekedIndices] = useState<Record<number, boolean>>({});
  const annotated = tokenizeAndAnnotate(text, zhuyin);
  const tokens = annotated.chars;

  const sizeMap = {
    sm: { hanzi: 'text-xl', ruby: 'text-[12px]', pinyin: 'text-[12px]', box: 'px-1 py-0.5' },
    md: { hanzi: 'text-3xl', ruby: 'text-[13px]', pinyin: 'text-[13px]', box: 'px-1.5 py-1' },
    lg: { hanzi: 'text-4xl', ruby: 'text-[14.5px]', pinyin: 'text-[14px]', box: 'px-2 py-1' },
    xl: { hanzi: 'text-5xl sm:text-6xl', ruby: 'text-[16px]', pinyin: 'text-[14px]', box: 'px-2.5 py-1.5' },
  }[size];

  const togglePeek = (idx: number) => {
    setPeekedIndices((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  return (
    <span className="inline-flex flex-wrap items-end gap-y-2 leading-none select-none">
      {tokens.map((tok, idx) => {
        if (!tok.isChinese || !tok.zhuyin) {
          return (
            <span
              key={idx}
              className={`${sizeMap.hanzi} font-semibold mx-0.5 self-center`}
              style={{ color: 'var(--fs-text-secondary)' }}
            >
              {tok.char}
            </span>
          );
        }

        const masteryLevel = charMastery[tok.char]?.level ?? 0;
        const isPeeked = !!peekedIndices[idx];
        const toneColor = colorByTone ? `var(--fs-tone-${tok.zhuyin.tone})` : 'var(--fs-text)';

        // Adaptive Zhuyin Fading (FORM-DESCHAR-001 Principle 1 & DEP-04 tap-to-peek)
        let rubyOpacityClass = 'opacity-100';
        if (!isPeeked) {
          if (zhuyinDisplayMode === 'hover_only') {
            rubyOpacityClass = 'opacity-15 group-hover:opacity-100 group-focus:opacity-100';
          } else if (zhuyinDisplayMode === 'adaptive') {
            if (masteryLevel >= 3) {
              rubyOpacityClass = 'opacity-15 group-hover:opacity-100 group-focus:opacity-100';
            } else if (masteryLevel === 2) {
              rubyOpacityClass = 'opacity-45 group-hover:opacity-100 group-focus:opacity-100';
            }
          }
        }

        const phoneticChars = Array.from(tok.zhuyin.phoneticBody);
        const isNeutral = tok.zhuyin.tone === 5;
        const toneMark = isNeutral ? '' : tok.zhuyin.toneMark;
        const hasSandhiShift =
          showSpokenSandhi &&
          tok.spokenZhuyin &&
          tok.spokenZhuyin !== tok.zhuyin.normalized;

        const charBody = (
          <>
            <span className="inline-flex items-center gap-0.5">
              {/* Traditional Character */}
              <span
                className={`${sizeMap.hanzi} font-bold tracking-tight`}
                style={{ color: toneColor }}
              >
                {tok.char}
              </span>

              {/* Right-Side Vertical Taiwanese Book-Style Zhuyin Column (直式注音) */}
              <span
                className={`inline-flex items-center transition-opacity duration-200 ${rubyOpacityClass}`}
              >
                <span className="inline-flex flex-col items-center justify-center leading-[1.15]">
                  {isNeutral && (
                    <span
                      className={`${sizeMap.ruby} font-bold leading-none mb-0.5`}
                      style={{ color: 'var(--fs-tone-5)' }}
                    >
                      ˙
                    </span>
                  )}
                  {phoneticChars.map((sym, sIdx) => (
                    <span
                      key={sIdx}
                      className={`${sizeMap.ruby} font-semibold leading-[1.15]`}
                      style={{ color: 'var(--fs-text-secondary)' }}
                    >
                      {sym}
                    </span>
                  ))}
                </span>
                {toneMark && (
                  <span
                    className={`${sizeMap.ruby} font-bold ml-0.5 self-center`}
                    style={{ color: toneColor }}
                  >
                    {toneMark}
                  </span>
                )}
              </span>
            </span>

            {/* Optional Spoken Sandhi Indicator or Pinyin Hint */}
            {hasSandhiShift && (
              <span
                className="text-xs font-semibold px-1.5 py-0.5 rounded mt-1"
                style={{ backgroundColor: 'var(--fs-warm-soft)', color: 'var(--fs-warm)' }}
              >
                →{tok.spokenZhuyin}
              </span>
            )}
            {showPinyinHint && tok.pinyin && (
              <span
                className={`${sizeMap.pinyin} font-medium mt-0.5`}
                style={{ color: 'var(--fs-text-muted)' }}
              >
                {tok.pinyin}
              </span>
            )}
          </>
        );

        const tooltipText = tok.moeNote
          ? `${tok.char} (${tok.zhuyin.normalized}) — ${tok.moeNote}`
          : `${tok.char} (${tok.zhuyin.normalized}${hasSandhiShift ? ` → spoken ${tok.spokenZhuyin}` : ''})`;

        if (nonInteractive) {
          return (
            <span
              key={idx}
              title={tooltipText}
              className={`group inline-flex flex-col items-center rounded-xl transition ${sizeMap.box}`}
            >
              {charBody}
            </span>
          );
        }

        return (
          <button
            key={idx}
            type="button"
            onClick={() => {
              togglePeek(idx);
              if (onSelectChar) {
                onSelectChar(tok.char, tok.zhuyin!.normalized, tok.wordContext);
              }
            }}
            style={{ touchAction: 'manipulation' }}
            title={tooltipText}
            className={`group inline-flex flex-col items-center rounded-xl transition ${sizeMap.box}`}
          >
            {charBody}
          </button>
        );
      })}
    </span>
  );
};
