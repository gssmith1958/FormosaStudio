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
  // Laminated Paper Tick-Menu (點菜單) State — starts blank so learner genuinely fills the order
  const [selectedMissionId, setSelectedMissionId] = useState<string>(TICK_MENU_MISSIONS[0].id);
  const [diningMode, setDiningMode] = useState<'dine_in' | 'takeout'>('dine_in');
  const [tableNumber, setTableNumber] = useState<string>('');
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [spiceNotes, setSpiceNotes] = useState<Record<string, 'none' | 'mild' | 'medium'>>({});
  const [showOrderVerification, setShowOrderVerification] = useState<boolean>(false);

  // Pragmatics Lab State + 4-Question Taiwanese Particle Context Check
  const [selectedParticleId, setSelectedParticleId] = useState<string>(TAIWAN_PARTICLES[0].id);
  const [selectedHokkienId, setSelectedHokkienId] = useState<string>(HOKKIEN_EXPRESSIONS[0].id);
  const [particleQuizIdx, setParticleQuizIdx] = useState<number>(0);
  const [particleQuizPicked, setParticleQuizPicked] = useState<string | null>(null);
  const [particleQuizScore, setParticleQuizScore] = useState<number>(0);

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
          <div className="rounded-2xl border fs-divider fs-card p-5 space-y-3">
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
                    setDiningMode('dine_in');
                    setTableNumber('');
                    setQuantities({});
                    setSpiceNotes({});
                    setShowOrderVerification(false);
                  }}
                >
                  Mission {m.missionNumber}
                </StylusButton>
              ))}
            </div>

            <div className="rounded-xl fs-subtle-box border fs-divider p-4 space-y-2">
              <div className="font-bold fs-text text-base">{activeMission.title}</div>
              <p className="text-sm fs-text-warm font-medium">
                {activeMission.customerBriefTraditional}
              </p>
              <p className="text-xs fs-text-secondary">{activeMission.customerBriefEnglish}</p>
              {onSpeakText && (
                <StylusButton
                  variant="secondary"
                  onClick={() => onSpeakText(activeMission.customerBriefTraditional, 0.9)}
                >
                  Hear Customer Order (zh-TW)
                </StylusButton>
              )}
            </div>

            <div className="flex items-center justify-between rounded-xl fs-subtle-box border fs-divider p-3.5">
              <div>
                <div className="text-xs fs-text-muted">Live Laminated Menu Total</div>
                <div className="text-2xl font-semibold fs-text-accent">
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
                    ? 'fs-surface-accent fs-divider fs-text-accent'
                    : 'fs-surface-danger fs-divider fs-text-danger'
                }`}
              >
                <div className="font-semibold text-sm">{verificationResult.summaryMessage}</div>
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
        <div className="lg:col-span-7 rounded-2xl border-2 fs-divider fs-card p-5 space-y-4 shadow-xl">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b fs-divider pb-3">
            <div>
              <h3 className="text-xl font-semibold fs-text-warm">
                老臺北牛肉麵館 · 點菜單 (Laminated Order Slip)
              </h3>
              <p className="text-xs fs-text-muted">
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
                <div className="flex items-center gap-1.5 fs-subtle-box px-3 py-1.5">
                  <span className="text-xs font-bold fs-text-warm">桌號 (Table):</span>
                  <input
                    type="text"
                    value={tableNumber}
                    onChange={(e) => setTableNumber(e.target.value)}
                    className="w-12 fs-card border fs-divider rounded px-2 py-1 text-center font-bold fs-text text-sm"
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
                      ? 'fs-surface-warm fs-divider'
                      : 'fs-subtle-box fs-divider'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-bold px-2 py-0.5 rounded fs-subtle-box fs-text-secondary">
                        {item.categoryLabel}
                      </span>
                      <span className="text-sm font-semibold fs-text-warm">
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
                    <div className="text-xs fs-text-muted">{item.english}</div>
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
                      <span className="w-9 text-center font-semibold text-lg fs-text">
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
      <div className="rounded-2xl border fs-divider fs-card p-5 space-y-4">
        <div>
          <h3 className="text-lg font-semibold fs-text">
            臺灣語助詞 · 8 Sentence-Final Particles ({TAIWAN_PARTICLES.length})
          </h3>
          <p className="text-xs fs-text-muted">
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

        <div className="rounded-xl fs-subtle-box border fs-divider p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-3xl font-semibold fs-text-accent">
                {activeParticle.particle} ({activeParticle.zhuyin})
              </span>
              <div className="text-sm font-bold fs-text mt-1">{activeParticle.nuance}</div>
            </div>
            {onSpeakText && (
              <StylusButton
                variant="secondary"
                onClick={() => onSpeakText(activeParticle.exampleTraditional, 0.9)}
              >
                Hear Nuance
              </StylusButton>
            )}
          </div>
          <p className="text-xs fs-text-secondary">{activeParticle.taiwanContext}</p>
          <div className="rounded-lg fs-card border fs-divider p-3 space-y-1.5">
            <RubyText
              text={activeParticle.exampleTraditional}
              zhuyin={activeParticle.exampleZhuyin}
              zhuyinDisplayMode="always"
              size="md"
            />
            <div className="text-xs fs-text-secondary">{activeParticle.exampleEnglish}</div>
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
      <div className="rounded-2xl border fs-divider fs-card p-5 space-y-4">
        <div>
          <h3 className="text-lg font-semibold fs-text">
            日常臺語借詞 · 10 Everyday Hokkien Expressions ({HOKKIEN_EXPRESSIONS.length})
          </h3>
          <p className="text-xs fs-text-muted">
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

        <div className="rounded-xl fs-subtle-box border fs-divider p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-2xl font-semibold fs-text-warm">
                {activeHokkien.traditional}
              </span>
              <span className="ml-2 text-xs font-bold px-2 py-0.5 rounded fs-surface-warm fs-text-warm border fs-divider">
                Tâi-lô: {activeHokkien.tailoRomanization} · {activeHokkien.mandarinZhuyin}
              </span>
              <div className="text-sm font-bold fs-text mt-1">{activeHokkien.english}</div>
            </div>
            {onSpeakText && (
              <StylusButton
                variant="secondary"
                onClick={() => onSpeakText(activeHokkien.exampleTraditional, 0.9)}
              >
                Speak Example
              </StylusButton>
            )}
          </div>
          <p className="text-xs fs-text-secondary">{activeHokkien.usageContext}</p>
          <div className="rounded-lg fs-card border fs-divider p-3 space-y-1.5">
            <RubyText
              text={activeHokkien.exampleTraditional}
              zhuyin={activeHokkien.exampleZhuyin}
              zhuyinDisplayMode="always"
              size="md"
            />
            <div className="text-xs fs-text-secondary">{activeHokkien.exampleEnglish}</div>
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

      {/* 4-Question Taiwanese Particle Context Check */}
      {(() => {
        const quizList = [
          { prompt: 'Soften a friendly reminder ("Remember to bring an umbrella!"): 記得帶傘___！', answer: '喔', options: ['喔', '嘛', '嗎', '吧'] },
          { prompt: 'Warmly reassure someone ("No problem at all!"): 沒關係___！', answer: '啦', options: ['嗎', '啦', '耶', '呢'] },
          { prompt: 'Make a polite suggestion ("Let’s go grab beef noodles!"): 我們去吃牛肉麵___！', answer: '吧', options: ['吧', '嘛', '啊', '喔'] },
          { prompt: 'Express mild persuasion ("Come on, try one bite!"): 吃一口___！', answer: '嘛', options: ['喔', '呢', '嘛', '嗎'] },
        ];
        const q = quizList[particleQuizIdx % quizList.length];
        return (
          <div className="lg:col-span-2 rounded-2xl border fs-divider fs-card p-5 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="text-xs font-bold uppercase tracking-wider fs-text-accent">
                Taiwanese Particle (語助詞) Context Check · Question {(particleQuizIdx % quizList.length) + 1}/{quizList.length} (Score: {particleQuizScore})
              </div>
              <StylusButton variant="ghost" onClick={() => { setParticleQuizIdx((i) => (i + 1) % quizList.length); setParticleQuizPicked(null); }}>
                <span>Next Scenario →</span>
              </StylusButton>
            </div>
            <div className="text-sm font-bold fs-text">{q.prompt}</div>
            <div className="flex flex-wrap gap-2">
              {q.options.map((opt) => (
                <StylusButton
                  key={opt}
                  variant={particleQuizPicked === opt ? (opt === q.answer ? 'primary' : 'danger') : 'secondary'}
                  onClick={() => {
                    if (particleQuizPicked === null && opt === q.answer) setParticleQuizScore((s) => s + 1);
                    setParticleQuizPicked(opt);
                    onSpeakText?.(q.prompt.split('：')[1]?.replace('___', opt) || opt, 0.88);
                  }}
                >
                  <span className="text-base font-bold">{opt}</span>
                </StylusButton>
              ))}
            </div>
            {particleQuizPicked && (
              <div className={`text-xs font-semibold ${particleQuizPicked === q.answer ? 'fs-text-accent' : 'fs-text-warm'}`}>
                {particleQuizPicked === q.answer ? `✓ Spot-on! 「${q.answer}」 matches natural Taiwanese tone here.` : `Not quite — natural Taiwanese phrasing uses 「${q.answer}」 here.`}
              </div>
            )}
          </div>
        );
      })()}
    </div>
  );
};
