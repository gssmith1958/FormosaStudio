/**
 * FormosaStudio (FORM) — Taiwanese Laminated Paper Tick-Menu (點菜單) Simulator
 * & Taiwanese Spoken Pragmatics (語助詞 & 臺語 Hokkien) Interactive Sub-Component
 * Uses >= 44x44 px Wacom Stylus / Touch controls from uiPrimitives.tsx.
 * Traces to: FORM-REQ-0010, FORM-REQ-0021, FORM-REQ-0005, FORM-DEP-TPA-002
 */

import React, { useMemo, useState } from 'react';
import {
  CrossStudioActionPills,
  StylusButton,
} from './uiPrimitives.tsx';
import { RubyText } from './RubyText.tsx';
import {
  HOKKIEN_EXPRESSIONS,
  TAIWAN_PARTICLES,
  TICK_MENU_CATALOG,
  TICK_MENU_MISSIONS,
} from '../data/taiwanSurvivalData.ts';
import {
  TickMenuSelectionState,
  verifyTickMenuOrder,
} from '../lib/listeningGymEngine.ts';
import { UserProgressState } from '../lib/progressStore.ts';

export interface TickMenuAndPragmaticsProps {
  activeTab: 'tick_menu' | 'pragmatics';
  progress: UserProgressState;
  onSpeakText?: (text: string, rate?: number) => void;
}

export const TickMenuAndPragmatics: React.FC<TickMenuAndPragmaticsProps> = ({
  activeTab,
  progress,
  onSpeakText,
}) => {
  // Laminated Paper Tick-Menu (點菜單) State
  const [selectedMissionId, setSelectedMissionId] = useState<string>(TICK_MENU_MISSIONS[0].id);
  const [diningMode, setDiningMode] = useState<'dine_in' | 'takeout'>('dine_in');
  const [tableNumber, setTableNumber] = useState<string>('5');
  const [quantities, setQuantities] = useState<Record<string, number>>({
    'tm-beef-lg': 1,
    'tm-cucumber': 1,
    'tm-soymilk': 2,
  });
  const [spiceNotes, setSpiceNotes] = useState<Record<string, 'none' | 'mild' | 'medium'>>({
    'tm-beef-lg': 'mild',
  });
  const [showOrderVerification, setShowOrderVerification] = useState<boolean>(false);

  // Pragmatics Lab State
  const [selectedParticleId, setSelectedParticleId] = useState<string>(TAIWAN_PARTICLES[0].id);
  const [selectedHokkienId, setSelectedHokkienId] = useState<string>(HOKKIEN_EXPRESSIONS[0].id);

  const activeMission = useMemo(
    () => TICK_MENU_MISSIONS.find((m) => m.id === selectedMissionId) || TICK_MENU_MISSIONS[0],
    [selectedMissionId]
  );

  const currentSelection: TickMenuSelectionState = useMemo(
    () => ({
      diningMode,
      tableNumber,
      quantities,
      spiceNotes,
    }),
    [diningMode, tableNumber, quantities, spiceNotes]
  );

  const verificationResult = useMemo(
    () => verifyTickMenuOrder(activeMission, currentSelection),
    [activeMission, currentSelection]
  );

  const adjustQuantity = (itemId: string, delta: number) => {
    setQuantities((prev) => {
      const nextQty = Math.max(0, (prev[itemId] || 0) + delta);
      return { ...prev, [itemId]: nextQty };
    });
    setShowOrderVerification(false);
  };

  const resetMenuOrder = () => {
    setQuantities({});
    setSpiceNotes({});
    setShowOrderVerification(false);
  };

  if (activeTab === 'tick_menu') {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Column: Mission Brief & Verification */}
        <div className="lg:col-span-5 space-y-4">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 space-y-3">
            <div className="text-xs font-bold uppercase tracking-wider text-amber-400">
              Real-World Taiwanese 點菜單 Mission
            </div>
            <div className="flex flex-wrap gap-2">
              {TICK_MENU_MISSIONS.map((m) => (
                <StylusButton
                  key={m.id}
                  variant={m.id === activeMission.id ? 'amber' : 'secondary'}
                  onClick={() => {
                    setSelectedMissionId(m.id);
                    setDiningMode(m.diningMode);
                    setTableNumber(m.expectedTableNumber || '');
                    setQuantities({});
                    setSpiceNotes({});
                    setShowOrderVerification(false);
                  }}
                >
                  Mission {m.missionNumber}
                </StylusButton>
              ))}
            </div>

            <div className="rounded-xl bg-slate-950/80 border border-slate-800 p-4 space-y-2">
              <div className="font-bold text-white text-base">{activeMission.title}</div>
              <p className="text-sm text-amber-200 font-medium">
                {activeMission.customerBriefTraditional}
              </p>
              <p className="text-xs text-slate-300">{activeMission.customerBriefEnglish}</p>
              {onSpeakText && (
                <StylusButton
                  variant="secondary"
                  onClick={() => onSpeakText(activeMission.customerBriefTraditional, 0.9)}
                >
                  🔊 Hear Customer Order (zh-TW)
                </StylusButton>
              )}
            </div>

            <div className="flex items-center justify-between rounded-xl bg-slate-950 border border-slate-800 p-3.5">
              <div>
                <div className="text-xs text-slate-400">Live Laminated Menu Total</div>
                <div className="text-2xl font-extrabold text-teal-300">
                  NT$ {verificationResult.calculatedTotalNtd}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <StylusButton variant="ghost" onClick={resetMenuOrder}>
                  Clear Slip
                </StylusButton>
                <StylusButton
                  variant="primary"
                  onClick={() => setShowOrderVerification(true)}
                >
                  ✓ Submit 點菜單 to Counter
                </StylusButton>
              </div>
            </div>

            {showOrderVerification && (
              <div
                className={`rounded-xl border p-4 space-y-2 ${
                  verificationResult.isCompleteMatch
                    ? 'bg-emerald-950/50 border-emerald-400/70 text-emerald-200'
                    : 'bg-rose-950/50 border-rose-400/70 text-rose-200'
                }`}
              >
                <div className="font-extrabold text-sm">{verificationResult.summaryMessage}</div>
                {verificationResult.discrepancies.length > 0 && (
                  <ul className="list-disc list-inside text-xs space-y-1">
                    {verificationResult.discrepancies.map((d, idx) => (
                      <li key={idx}>{d}</li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Interactive Wacom/Stylus Laminated Paper Tick-Menu (點菜單) */}
        <div className="lg:col-span-7 rounded-2xl border-2 border-amber-500/40 bg-slate-900/95 p-5 space-y-4 shadow-xl">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
            <div>
              <h3 className="text-xl font-extrabold text-amber-300">
                老臺北牛肉麵館 · 點菜單 (Laminated Order Slip)
              </h3>
              <p className="text-xs text-slate-400">
                Use your Wacom stylus or mouse to mark 內用/外帶, table number (桌號), and item quantities.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <StylusButton
                variant={diningMode === 'dine_in' ? 'amber' : 'secondary'}
                onClick={() => setDiningMode('dine_in')}
              >
                內用 (Dine-In)
              </StylusButton>
              <StylusButton
                variant={diningMode === 'takeout' ? 'amber' : 'secondary'}
                onClick={() => setDiningMode('takeout')}
              >
                外帶 (Takeout)
              </StylusButton>
              {diningMode === 'dine_in' && (
                <div className="flex items-center gap-1.5 bg-slate-950 border border-slate-700 rounded-xl px-3 py-1.5">
                  <span className="text-xs font-bold text-amber-300">桌號 (Table):</span>
                  <input
                    type="text"
                    value={tableNumber}
                    onChange={(e) => setTableNumber(e.target.value)}
                    className="w-12 bg-slate-900 border border-slate-700 rounded px-2 py-1 text-center font-bold text-white text-sm"
                  />
                </div>
              )}
            </div>
          </div>

          <div className="space-y-2.5">
            {TICK_MENU_CATALOG.map((item) => {
              const qty = quantities[item.id] || 0;
              const spice = spiceNotes[item.id] || 'none';
              return (
                <div
                  key={item.id}
                  className={`rounded-xl border p-3.5 flex flex-wrap items-center justify-between gap-3 transition-all ${
                    qty > 0
                      ? 'bg-amber-950/30 border-amber-400/60'
                      : 'bg-slate-950/60 border-slate-800'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                        {item.categoryLabel}
                      </span>
                      <span className="text-sm font-extrabold text-amber-300">
                        NT$ {item.priceNtd}
                      </span>
                    </div>
                    <RubyText
                      text={item.traditional}
                      zhuyin={item.zhuyin}
                      zhuyinDisplayMode={progress.zhuyinDisplayMode}
                      charMastery={progress.charMastery}
                      size="md"
                    />
                    <div className="text-xs text-slate-400">{item.english}</div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    {item.allowSpice && qty > 0 && (
                      <div className="flex items-center gap-1">
                        {(
                          [
                            { id: 'none', label: '不辣' },
                            { id: 'mild', label: '小辣' },
                            { id: 'medium', label: '中辣' },
                          ] as const
                        ).map((sp) => (
                          <StylusButton
                            key={sp.id}
                            variant={spice === sp.id ? 'amber' : 'secondary'}
                            onClick={() =>
                              setSpiceNotes((prev) => ({ ...prev, [item.id]: sp.id }))
                            }
                          >
                            {sp.label}
                          </StylusButton>
                        ))}
                      </div>
                    )}

                    <div className="flex items-center gap-2">
                      <StylusButton
                        variant="secondary"
                        onClick={() => adjustQuantity(item.id, -1)}
                        aria-label={`Decrease ${item.traditional}`}
                      >
                        −
                      </StylusButton>
                      <span className="w-9 text-center font-extrabold text-lg text-white">
                        {qty}
                      </span>
                      <StylusButton
                        variant="primary"
                        onClick={() => adjustQuantity(item.id, 1)}
                        aria-label={`Increase ${item.traditional}`}
                      >
                        +
                      </StylusButton>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // PRAGMATICS TAB: 8 TAIWANESE SENTENCE-FINAL PARTICLES (語助詞) & 10 HOKKIEN EXPRESSIONS (臺語)
  const activeParticle =
    TAIWAN_PARTICLES.find((p) => p.id === selectedParticleId) || TAIWAN_PARTICLES[0];
  const activeHokkien =
    HOKKIEN_EXPRESSIONS.find((h) => h.id === selectedHokkienId) || HOKKIEN_EXPRESSIONS[0];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
      {/* 8 Taiwanese Sentence-Final Particles (語助詞) */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 space-y-4">
        <div>
          <h3 className="text-lg font-extrabold text-white">
            臺灣語助詞 · 8 Sentence-Final Particles ({TAIWAN_PARTICLES.length})
          </h3>
          <p className="text-xs text-slate-400">
            Master the warm, non-confrontational pragmatic cadence of everyday Taiwanese Mandarin.
          </p>
        </div>

        <div className="grid grid-cols-4 gap-2">
          {TAIWAN_PARTICLES.map((pt) => (
            <StylusButton
              key={pt.id}
              variant={pt.id === activeParticle.id ? 'primary' : 'secondary'}
              onClick={() => setSelectedParticleId(pt.id)}
            >
              <span>{pt.particle}</span>
              <span className="text-xs opacity-80">({pt.zhuyin})</span>
            </StylusButton>
          ))}
        </div>

        <div className="rounded-xl bg-slate-950/80 border border-teal-500/40 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-3xl font-extrabold text-teal-300">
                {activeParticle.particle} ({activeParticle.zhuyin})
              </span>
              <div className="text-sm font-bold text-white mt-1">{activeParticle.nuance}</div>
            </div>
            {onSpeakText && (
              <StylusButton
                variant="secondary"
                onClick={() => onSpeakText(activeParticle.exampleTraditional, 0.9)}
              >
                🔊 Hear Nuance
              </StylusButton>
            )}
          </div>
          <p className="text-xs text-slate-300">{activeParticle.taiwanContext}</p>
          <div className="rounded-lg bg-slate-900 border border-slate-800 p-3 space-y-1.5">
            <RubyText
              text={activeParticle.exampleTraditional}
              zhuyin={activeParticle.exampleZhuyin}
              zhuyinDisplayMode="always"
              size="md"
            />
            <div className="text-xs text-slate-300">{activeParticle.exampleEnglish}</div>
          </div>
          <CrossStudioActionPills
            sourceStudio="survival"
            sourceLabel={`語助詞 ${activeParticle.particle}`}
            targetText={activeParticle.exampleTraditional}
            targetZhuyin={activeParticle.exampleZhuyin}
            targetEnglish={activeParticle.exampleEnglish}
          />
        </div>
      </div>

      {/* 10 Everyday Hokkien-in-Mandarin (臺語) Expressions */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 space-y-4">
        <div>
          <h3 className="text-lg font-extrabold text-white">
            日常臺語借詞 · 10 Everyday Hokkien Expressions ({HOKKIEN_EXPRESSIONS.length})
          </h3>
          <p className="text-xs text-slate-400">
            Essential Taiwanese Hokkien (臺語) expressions woven into daily Taipei & southern conversation.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {HOKKIEN_EXPRESSIONS.map((hk) => (
            <StylusButton
              key={hk.id}
              variant={hk.id === activeHokkien.id ? 'amber' : 'secondary'}
              onClick={() => setSelectedHokkienId(hk.id)}
            >
              {hk.traditional}
            </StylusButton>
          ))}
        </div>

        <div className="rounded-xl bg-slate-950/80 border border-amber-500/40 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-2xl font-extrabold text-amber-300">
                {activeHokkien.traditional}
              </span>
              <span className="ml-2 text-xs font-bold px-2 py-0.5 rounded bg-amber-950 text-amber-200 border border-amber-400/50">
                Tâi-lô: {activeHokkien.tailoRomanization} · {activeHokkien.mandarinZhuyin}
              </span>
              <div className="text-sm font-bold text-white mt-1">{activeHokkien.english}</div>
            </div>
            {onSpeakText && (
              <StylusButton
                variant="secondary"
                onClick={() => onSpeakText(activeHokkien.exampleTraditional, 0.9)}
              >
                🔊 Speak Example
              </StylusButton>
            )}
          </div>
          <p className="text-xs text-slate-300">{activeHokkien.usageContext}</p>
          <div className="rounded-lg bg-slate-900 border border-slate-800 p-3 space-y-1.5">
            <RubyText
              text={activeHokkien.exampleTraditional}
              zhuyin={activeHokkien.exampleZhuyin}
              zhuyinDisplayMode="always"
              size="md"
            />
            <div className="text-xs text-slate-300">{activeHokkien.exampleEnglish}</div>
          </div>
          <CrossStudioActionPills
            sourceStudio="survival"
            sourceLabel={`臺語 ${activeHokkien.traditional}`}
            targetText={activeHokkien.traditional}
            targetZhuyin={activeHokkien.mandarinZhuyin}
            targetEnglish={activeHokkien.english}
          />
        </div>
      </div>
    </div>
  );
};
