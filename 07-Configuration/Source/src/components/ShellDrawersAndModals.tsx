/**
 * FormosaStudio (FORM) — Global Omnibar (Ctrl+K), Collapsible Side Reference Dock & In-App Help/Manual Drawer (? / F1)
 * Traces to: FORM-REQ-0018, FORM-REQ-0020, FORM-REQ-0021, FORM-REQ-0023, FORM-DEP-UX-001
 */

import React, { useMemo, useState } from 'react';
import { getFullVocabularyCatalog } from '../data/vocabularyCatalog.ts';
import { MOE_STROKE_CHARACTER_BANK } from '../data/moeStrokeAndPhoneticData.ts';
import { DAQIAN_KEYBOARD_ROWS, zhuyinToDaqianKeySequence } from '../data/daqianAndDojoData.ts';
import { POLYPHONE_PAIRS, TAIWAN_MOE_PRONUNCIATIONS } from '../lib/polyphoneLexicon.ts';
import { detectToneSandhi } from '../lib/zhuyinTokenizer.ts';
import {
  FocusedContextItem,
  STUDIO_DEFINITIONS,
  StudioId,
  dispatchStudioHandoff,
  setActiveStudio,
} from '../lib/studioContextBus.ts';
import {
  CrossStudioActionPills,
  StudioModeOption,
  StudioModeSwitcher,
  StylusButton,
} from './uiPrimitives.tsx';
import { RubyText } from './RubyText.tsx';

export interface GlobalOmnibarModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeStudio: StudioId;
  adminRevision?: number;
}

export const GlobalOmnibarModal: React.FC<GlobalOmnibarModalProps> = ({
  isOpen,
  onClose,
  activeStudio,
  adminRevision = 0,
}) => {
  const [query, setQuery] = useState<string>('');
  const catalog = useMemo(() => getFullVocabularyCatalog(), [isOpen, adminRevision]);

  const matchingVocab = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return catalog.slice(0, 6);
    return catalog
      .filter(
        (c) =>
          c.traditional.includes(q) ||
          c.zhuyin.includes(q) ||
          c.english.toLowerCase().includes(q) ||
          (c.pinyin && c.pinyin.toLowerCase().includes(q))
      )
      .slice(0, 8);
  }, [catalog, query]);

  const matchingMoeChars = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return MOE_STROKE_CHARACTER_BANK.slice(0, 4);
    return MOE_STROKE_CHARACTER_BANK.filter(
      (m) =>
        m.char.includes(q) ||
        m.zhuyin.includes(q) ||
        m.english.toLowerCase().includes(q) ||
        m.pinyin.toLowerCase().includes(q)
    ).slice(0, 5);
  }, [query]);

  const matchingMoeRules = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = Object.values(TAIWAN_MOE_PRONUNCIATIONS);
    if (!q) return list.slice(0, 3);
    return list
      .filter(
        (m) =>
          m.word.includes(q) ||
          m.taiwanZhuyin.includes(q) ||
          m.taiwanPinyin.toLowerCase().includes(q) ||
          m.english.toLowerCase().includes(q) ||
          m.moeNote.toLowerCase().includes(q)
      )
      .slice(0, 5);
  }, [query]);

  const matchingPolyphones = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return POLYPHONE_PAIRS.slice(0, 3);
    return POLYPHONE_PAIRS.filter(
      (p) =>
        p.char.includes(q) ||
        p.readings.some(
          (r) =>
            r.zhuyin.includes(q) ||
            r.pinyin.toLowerCase().includes(q) ||
            r.meaning.toLowerCase().includes(q) ||
            r.examples.some((ex) => ex.word.includes(q) || ex.english.toLowerCase().includes(q))
        )
    ).slice(0, 5);
  }, [query]);

  if (!isOpen) return null;

  return (
    <div role="dialog" aria-modal="true" aria-label="Global Omnibar Search" className="fixed inset-0 z-50 fs-modal-backdrop backdrop-blur-sm flex items-start justify-center p-4 pt-12">
      <div className="w-full max-w-3xl bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl p-5 space-y-4">
        <div className="flex items-center justify-between gap-3">
          <div className="text-sm font-extrabold text-emerald-300 uppercase tracking-wider">
            🔍 Global Omnibar · Search Studios, TOCFL Word Bank, Polyphones & MOE Characters (Ctrl+K)
          </div>
          <StylusButton variant="ghost" onClick={onClose} shortcutHint="Esc">
            <span>✕ Close</span>
          </StylusButton>
        </div>

        <input
          type="text"
          autoFocus
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Type Hanzi (垃圾, 裡, 微糖), Zhuyin (ㄌㄜˋ ㄙㄜˋ), Pinyin, or English..."
          className="w-full min-h-[48px] px-4 py-2.5 rounded-2xl bg-slate-950 border border-emerald-500/60 text-white text-sm font-semibold"
        />

        {/* Quick Studio Jump Strip (<= 2 clicks / 1 shortcut per Guide 008) */}
        <div className="space-y-1.5">
          <div className="text-xs font-bold text-slate-400">Direct Studio Jump (Alt+1..6):</div>
          <div className="flex flex-wrap gap-2">
            {STUDIO_DEFINITIONS.map((st) => (
              <StylusButton
                key={st.id}
                variant={activeStudio === st.id ? 'primary' : 'secondary'}
                shortcutHint={st.shortcut}
                onClick={() => {
                  setActiveStudio(st.id);
                  onClose();
                }}
              >
                <span>{st.titleZh}</span>
              </StylusButton>
            ))}
          </div>
        </div>

        {/* Matching Vocabulary & Polyphones */}
        <div className="space-y-2 max-h-[340px] overflow-y-auto pr-1">
          <div className="text-xs font-bold text-amber-300">Matching TOCFL Vocabulary ({matchingVocab.length}):</div>
          {matchingVocab.map((item) => (
            <div
              key={item.id}
              className="bg-slate-950 border border-slate-800 rounded-2xl p-3 flex flex-wrap items-center justify-between gap-2"
            >
              <div className="flex items-center gap-3">
                <RubyText text={item.traditional} zhuyin={item.zhuyin} size="md" zhuyinDisplayMode="always" />
                <div>
                  <div className="text-sm font-bold text-white">{item.english}</div>
                  <div className="text-[11px] text-slate-400">{item.tocflBand} · {item.sourceLabel}</div>
                </div>
              </div>
              <div className="flex flex-wrap gap-1.5">
                <StylusButton
                  variant="secondary"
                  onClick={() => {
                    dispatchStudioHandoff({
                      fromStudio: activeStudio,
                      fromLabel: 'Omnibar Search',
                      toStudio: 'calligraphy',
                      targetText: item.traditional,
                      targetZhuyin: item.zhuyin,
                      targetEnglish: item.english,
                    });
                    onClose();
                  }}
                >
                  <span>✒️ Wacom</span>
                </StylusButton>
                <StylusButton
                  variant="secondary"
                  onClick={() => {
                    dispatchStudioHandoff({
                      fromStudio: activeStudio,
                      fromLabel: 'Omnibar Search',
                      toStudio: 'speaking',
                      targetText: item.traditional,
                      targetZhuyin: item.zhuyin,
                      targetEnglish: item.english,
                    });
                    onClose();
                  }}
                >
                  <span>🎤 Pitch</span>
                </StylusButton>
                <StylusButton
                  variant="primary"
                  onClick={() => {
                    dispatchStudioHandoff({
                      fromStudio: activeStudio,
                      fromLabel: 'Omnibar Search',
                      toStudio: 'dojo',
                      targetText: item.traditional,
                      targetZhuyin: item.zhuyin,
                      targetEnglish: item.english,
                      modeHint: 'wordbank',
                    });
                    onClose();
                  }}
                >
                  <span>🃏 Word Bank</span>
                </StylusButton>
              </div>
            </div>
          ))}

          {matchingMoeRules.length > 0 && (
            <>
              <div className="text-xs font-bold text-sky-300 pt-2">
                🇹🇼 Taiwan MOE Standard Readings (兩岸異讀字 · {matchingMoeRules.length}):
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {matchingMoeRules.map((m) => (
                  <div key={m.word} className="bg-slate-950 border border-slate-800 rounded-xl p-2.5 flex items-center justify-between gap-2 text-xs">
                    <RubyText text={m.word} zhuyin={m.taiwanZhuyin} size="sm" zhuyinDisplayMode="always" />
                    <div className="text-right">
                      <div className="font-bold text-white">{m.english} ({m.taiwanPinyin})</div>
                      <div className="text-[11px] text-slate-400">{m.moeNote}</div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {matchingPolyphones.length > 0 && (
            <>
              <div className="text-xs font-bold text-amber-300 pt-2">
                Polyphone Disambiguation Rules (破音字 · {matchingPolyphones.length}):
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {matchingPolyphones.map((p) => (
                  <div key={p.id} className="bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs">
                    <span className="font-black text-white mr-2">「{p.char}」</span>
                    {p.readings.map((r, i) => (
                      <span key={i} className="mr-2 text-emerald-300">
                        {r.zhuyin} ({r.examples[0]?.word})
                      </span>
                    ))}
                  </div>
                ))}
              </div>
            </>
          )}

          {matchingMoeChars.length > 0 && (
            <>
              <div className="text-xs font-bold text-emerald-300 pt-2">
                Taiwan MOE Standard Stroke Characters ({matchingMoeChars.length}):
              </div>
              <div className="flex flex-wrap gap-2">
                {matchingMoeChars.map((ch) => (
                  <StylusButton
                    key={ch.char}
                    variant="secondary"
                    onClick={() => {
                      dispatchStudioHandoff({
                        fromStudio: activeStudio,
                        fromLabel: 'Omnibar MOE Lookup',
                        toStudio: 'calligraphy',
                        targetText: ch.char,
                        targetZhuyin: ch.zhuyin,
                        targetEnglish: ch.english,
                      });
                      onClose();
                    }}
                  >
                    <span className="text-base font-black">{ch.char}</span>
                    <span className="text-xs text-emerald-300">{ch.zhuyin}</span>
                    <span className="text-xs text-slate-400">{ch.totalStrokes}畫</span>
                  </StylusButton>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export interface SideContextReferenceDockProps {
  focusedItem: FocusedContextItem | null;
  activeStudio: StudioId;
  isOpen: boolean;
  onToggle: () => void;
  onSpeak?: (text: string) => void;
}

export const SideContextReferenceDock: React.FC<SideContextReferenceDockProps> = ({
  focusedItem,
  activeStudio,
  isOpen,
  onToggle,
  onSpeak,
}) => {
  if (!isOpen) return null;
  const item = focusedItem || {
    text: '臺灣',
    zhuyin: 'ㄊㄞˊ ㄨㄢ',
    english: 'Taiwan (Formosa)',
    sourceStudio: activeStudio,
    sourceLabel: 'Default Inspector',
  };
  const daqianKeys = item.zhuyin ? zhuyinToDaqianKeySequence(item.zhuyin) : '';
  const moeLexEntry = TAIWAN_MOE_PRONUNCIATIONS[item.text];
  const sandhiList = item.zhuyin ? detectToneSandhi(item.text, item.zhuyin) : [];

  return (
    <aside className="w-full xl:w-80 shrink-0 bg-slate-900/95 border border-slate-800 rounded-3xl p-4 space-y-4 self-start shadow-xl">
      <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
        <span className="text-xs font-extrabold text-emerald-300 uppercase tracking-wider">
          📌 Live Context Dock · 詞字即時解析
        </span>
        <StylusButton variant="ghost" onClick={onToggle}>
          <span>Hide</span>
        </StylusButton>
      </div>

      <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 flex items-center justify-between gap-2">
        <RubyText text={item.text} zhuyin={item.zhuyin} size="lg" zhuyinDisplayMode="always" />
        {onSpeak && (
          <StylusButton variant="secondary" onClick={() => onSpeak(item.text)}>
            <span>🔊 Speak</span>
          </StylusButton>
        )}
      </div>

      <div className="space-y-2 text-xs text-slate-300">
        {item.english && (
          <div>
            <span className="text-slate-400">Meaning:</span>{' '}
            <strong className="text-white font-bold">{item.english}</strong>
          </div>
        )}
        {daqianKeys && (
          <div>
            <span className="text-slate-400">Taiwan DaQian Keys:</span>{' '}
            <span className="font-mono text-emerald-300 font-bold">
              {Array.from(daqianKeys).map((k) => (k === ' ' ? '[Space]' : k.toUpperCase())).join(' → ')}
            </span>
          </div>
        )}
        {sandhiList.length > 0 && (
          <div className="bg-amber-950/40 border border-amber-500/40 rounded-xl p-2.5 text-amber-200">
            <strong>Spoken Sandhi:</strong> {sandhiList.map((s) => `${s.spokenZhuyin} (${s.ruleName})`).join(' · ')}
          </div>
        )}
        {(item.moeNote || moeLexEntry?.moeNote) && (
          <div className="bg-emerald-950/40 border border-emerald-500/40 rounded-xl p-2.5 text-emerald-200">
            <strong>🇹🇼 Taiwan MOE Standard:</strong> {item.moeNote || moeLexEntry?.moeNote}
          </div>
        )}
      </div>

      <div className="pt-1 border-t border-slate-800 space-y-2">
        <div className="text-[11px] font-bold text-slate-400">1-Click Cross-Studio Deep Links:</div>
        <CrossStudioActionPills
          targetText={item.text}
          targetZhuyin={item.zhuyin}
          targetEnglish={item.english}
          sourceStudio={activeStudio}
          sourceLabel={item.sourceLabel}
        />
      </div>
    </aside>
  );
};

type ManualTabId = 'workflow' | 'hardware_dsp' | 'moe_linguistics' | 'daqian_admin';

const MANUAL_TABS: StudioModeOption<ManualTabId>[] = [
  { id: 'workflow', labelZh: '六大工坊與日常流程', labelEn: '6 Studios & Daily Flow' },
  { id: 'hardware_dsp', labelZh: '桌面、iPad 與硬體設定', labelEn: 'Desktop, iPad & Hardware' },
  { id: 'moe_linguistics', labelZh: '教育部異讀字與連讀變調', labelEn: 'MOE Standards & Sandhi' },
  { id: 'daqian_admin', labelZh: '大千鍵盤與教材匯入格式', labelEn: 'DaQian Map & Admin Import' },
];

export interface InteractiveHelpManualDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const InteractiveHelpManualDrawer: React.FC<InteractiveHelpManualDrawerProps> = ({
  isOpen,
  onClose,
}) => {
  const [tab, setTab] = useState<ManualTabId>('workflow');
  if (!isOpen) return null;

  return (
    <div role="dialog" aria-modal="true" aria-label="FormosaStudio User Manual and Reference Guide" className="fixed inset-0 z-50 fs-modal-backdrop backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-4xl max-h-[88vh] overflow-y-auto bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl p-6 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <div>
            <h2 className="text-lg font-extrabold text-white">
              📘 FormosaStudio User's Manual & Reference Guide (FORM-MAN-001)
            </h2>
            <p className="text-xs text-slate-300">
              Complete operational manual also available at <code>09-Releases/FORM-MAN-001_FormosaStudio_User_Manual.md</code>
            </p>
          </div>
          <StylusButton variant="ghost" onClick={onClose} shortcutHint="Esc / ?">
            <span>✕ Close Manual</span>
          </StylusButton>
        </div>

        <StudioModeSwitcher modes={MANUAL_TABS} activeMode={tab} onSelect={setTab} />

        {tab === 'workflow' && (
          <div className="space-y-3 text-xs sm:text-sm text-slate-200 leading-relaxed">
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-2">
              <h3 className="font-extrabold text-emerald-300">1. v2.0 5-Section Menu &amp; Syllabus-Adaptive 10-Min Loop</h3>
              <p>
                Navigate from anywhere via the <strong>5-Section Expandable Accordion Menu</strong>:
                (1) <strong>Today’s Session (Alt+1)</strong> dynamically builds 3 daily steps (~70% current stage + ~30% spiral review, plus contextual Peek Ahead),
                (2) <strong>Course Syllabus (Alt+2)</strong> maps a clear linear path across <strong>Stages 0–5</strong> (Pre-A1 → TOCFL Level 4 / CEFR B2 / Classic HSK 5 Equivalent),
                (3) <strong>Practice Labs (Alt+3)</strong> groups all 5 focused drill studios, (4) <strong>Reference &amp; Help (Alt+4)</strong>, and
                (5) standalone <strong>Administration (Alt+5)</strong> for custom lesson CRUD, iPad/Desktop Audio Self-Test, and unified JSON backups.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {STUDIO_DEFINITIONS.map((st) => (
                <div key={st.id} className="bg-slate-950 border border-slate-800 rounded-2xl p-3.5 space-y-1">
                  <div className="font-extrabold text-amber-300">
                    {st.shortLabel} · {st.titleZh} ({st.shortcut})
                  </div>
                  <div className="text-xs text-slate-300">{st.description}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === 'hardware_dsp' && (
          <div className="space-y-3 text-xs sm:text-sm text-slate-200">
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-2">
              <h3 className="font-extrabold text-amber-300">Linux Desktop App &amp; iPad Installation (GitHub Pages PWA)</h3>
              <p>
                <strong>Linux Desktop:</strong> Click the <strong>FormosaStudio</strong> Jade <code>臺</code> icon in your Applications menu or Desktop
                (reinstall/update anytime via <code>python3 07-Configuration/Desktop/install_desktop_app.py</code>). It runs locally on
                <code>127.0.0.1:41755</code> with zero terminal windows and shuts down automatically when closed.
              </p>
              <p>
                <strong>iPad mini 6 / iPadOS (Anywhere Access):</strong> Open{' '}
                <code>https://gssmith1958.github.io/FormosaStudio/</code> in Safari → tap <strong>Share → Add to Home Screen</strong>.
                On iPad mini 6 (<code>744×1133</code> / <code>1133×744</code>), the menu auto-collapses during calligraphy and tone drills (always reopenable via <strong>☰ Menu</strong>).
                Run the 1-click <strong>Audio &amp; iPad Self-Test</strong> in <strong>Administration (Alt+5)</strong> to verify native <code>zh-TW</code> voices (install <em>Meijia</em> under Settings → Accessibility → Spoken Content → Voices → Chinese Taiwan) and offline YIN mic timing. Move progress + custom packs between Desktop and iPad with one unified JSON export in <strong>Administration → Backup &amp; Transfer</strong>.
              </p>
            </div>
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-2">
              <h3 className="font-extrabold text-emerald-300">Linux X11/Wayland Wacom Stylus Configuration</h3>
              <p>
                In <strong>Studio 4 (書法筆順 · Alt+4)</strong>, the calligraphy canvas uses W3C <code>PointerEvent</code> with
                <code>touch-action: none</code>, sub-frame <code>getCoalescedEvents()</code>, and pressure tapering (<code>2.5–14.0 px</code>).
                Flip the stylus to its <strong>eraser nib</strong> (or press the barrel button mapped to <code>button 5</code> / <code>buttons === 32</code>)
                to immediately pop the last stroke. Toggle <strong>Left-Handed Dock (左手模式)</strong> so your drawing hand never covers toolbar buttons.
              </p>
            </div>
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-2">
              <h3 className="font-extrabold text-sky-300">Offline WebAudio YIN F0 Microphone Calibration</h3>
              <p>
                In <strong>Studio 5 (發音聲調 · Alt+5)</strong>, pitch extraction runs 100% offline via time-domain YIN autocorrelation
                (<code>75–450 Hz</code>, <code>&lt; 3 Hz</code> accuracy). Choose <strong>Low Voice (95–220 Hz)</strong> or
                <strong>High Voice (145–330 Hz)</strong> to calibrate Speaker-Normalized Chao <code>1.0–5.0</code> mapping, then click
                <strong>🔁 Replay My Voice vs. Native Speaker</strong> for immediate auditory self-monitoring.
              </p>
            </div>
          </div>
        )}

        {tab === 'moe_linguistics' && (
          <div className="space-y-3 text-xs">
            <div className="font-extrabold text-emerald-300">
              🇹🇼 Taiwan Ministry of Education (教育部國語) Cross-Strait Standard Readings (兩岸異讀字):
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {Object.values(TAIWAN_MOE_PRONUNCIATIONS).map((m) => (
                <div key={m.word} className="bg-slate-950 border border-slate-800 rounded-xl p-3 flex items-center justify-between gap-2">
                  <RubyText text={m.word} zhuyin={m.taiwanZhuyin} size="sm" zhuyinDisplayMode="always" />
                  <div className="text-right">
                    <div className="font-bold text-white">{m.english} (TW: {m.taiwanPinyin} vs. Mainland: {m.mainlandPinyin})</div>
                    <div className="text-slate-400">{m.moeNote}</div>
                  </div>
                </div>
              ))}
            </div>
            <div className="font-extrabold text-amber-300 pt-2">
              Sample Taiwanese Mandarin Polyphones (破音字 · {POLYPHONE_PAIRS.length} Total Pairs):
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {POLYPHONE_PAIRS.slice(0, 6).map((p) => (
                <div key={p.id} className="bg-slate-950 border border-slate-800 rounded-xl p-3">
                  <span className="text-base font-black text-white mr-2">「{p.char}」</span>
                  {p.readings.map((r, i) => (
                    <span key={i} className="mr-3 text-emerald-300">
                      {r.zhuyin} ({r.examples[0]?.word})
                    </span>
                  ))}
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === 'daqian_admin' && (
          <div className="space-y-3 text-xs sm:text-sm text-slate-200">
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-2">
              <h3 className="font-extrabold text-emerald-300">
                Taiwan Standard DaQian (大千式) Keyboard Map ({DAQIAN_KEYBOARD_ROWS.flat().length} Keys + Spacebar = Tone 1)
              </h3>
              <p>
                Always type in strict phonetic order: <strong>Initial (聲母) → Medial (介音 ㄧ/ㄨ/ㄩ on U/J/M) → Rhyme (韻母) → Tone Key</strong>
                (<code>Space</code> = Tone 1, <code>6</code> = Tone 2 ˊ, <code>3</code> = Tone 3 ˇ, <code>4</code> = Tone 4 ˋ, <code>7</code> = Neutral ˙).
              </p>
            </div>
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-2">
              <h3 className="font-extrabold text-amber-300">
                ➕ Adding New Pimsleur Units & NTNU Contemporary Chinese Materials (Resource Admin)
              </h3>
              <p>
                Click <strong>⚙️ Resource Admin</strong> in the top header to import <code>.docx</code>, <code>.txt</code>, <code>.csv</code>, or <code>.json</code> files,
                or paste pipe-delimited lines (<code>Traditional | English | Optional Zhuyin | vocab/dialogue</code>). Any omitted Zhuyin is automatically
                annotated using the Taiwan MOE Forward Maximum-Matching polyphone tokenizer and propagates live to all 6 studios!
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
