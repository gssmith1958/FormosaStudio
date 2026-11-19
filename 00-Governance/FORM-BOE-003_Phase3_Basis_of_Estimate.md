---
id: FORM-BOE-003
type: GovernancePolicy
title: FormosaStudio — Phase 3 Basis of Estimate (Wacom Calligraphy, MOE Stroke Grader, Acoustic Pitch Lab & DaQian Dojo)
status: Approved
version: 1.0.0
created: 2026-11-13
owner: GSS
parent_ids:
  - FORM-ROAD-001
  - FORM-REQ-0012
  - FORM-REQ-0013
  - FORM-REQ-0014
  - FORM-REQ-0015
  - FORM-REQ-0016
  - FORM-REQ-0017
  - FORM-REQ-0021
  - FORM-ARCH-001
  - FORM-DEP-UX-001
---

# FormosaStudio (`FORM`) — Phase 3 Basis of Estimate (`FORM-BOE-003`)

## 1. Phase 3 Scope & Objectives (`Pattern 12` & `Guide 002 §2`)

Phase 3 delivers the hardware-interactive calligraphy, acoustic DSP, and DaQian (`大千式`) typing & vocabulary studios (`Studios 4, 5, and 6`), built strictly atop the Phase 1 shared design system (`uiPrimitives.tsx`, `RubyText.tsx`) and Cross-Studio Context Handoff Bus (`studioContextBus.ts`):

1. **Wacom Stylus (`PointerEvent`) Calligraphy Canvas with Pressure, Coalesced Sampling & Eraser Support (`FORM-REQ-0012`):**
   - W3C `PointerEvent` (`pointerdown`, `pointermove`, `pointerup`, `pointercancel`) processing with `pressure` (`0.0–1.0`) mapped to dynamic stroke width, `getCoalescedEvents()` sub-frame trajectory extraction, Wacom eraser detection (`buttons === 32 || button === 5 || pointerType === 'eraser'`), Pen-Only Palm Rejection mode (`pointerType === 'pen'`), traditional Taiwanese `九宮格` (9-square) and `田字格` (4-quadrant) grids, and Left/Right-Handed toolbar docking (`<HandednessToggle>`).
2. **Taiwan MOE Standard Vector Stroke-Order Grading Engine (`國字標準字體筆順`) (`FORM-REQ-0013`):**
   - Evaluates user strokes against Taiwan Ministry of Education (`教育部國字標準字體筆順`) reference vector medians across Guided Trace (`描紅`), Audio/Zhuyin Dictation Recall (`聽寫默寫`), and Freehand Overlay Comparison (`臨摹`), enforcing Taiwan-specific orthographic forms (`裡` inside-衣, `為` 9-stroke point-first, `骨` upper-right inner fold, `黃` 廿-top, `國, 臺, 灣, 麵, 捷, 運, 請, 謝` and foundational characters).
3. **Semantic-Phonetic (`形聲字`) Radical & Sound-Component Workbench (`FORM-REQ-0014`):**
   - Decomposes Traditional characters into Semantic Radicals (`部首: 氵, 言, 食, 扌, 心, 辵, 日, 目, 火, 金`) and Phonetic Series (`聲符: 青, 馬, 巴, 包, 方, 交, 寺, 羊, 工, 主` — `10` phonetic series covering `45+` Traditional characters), with interactive radical/phonetic filtering and 1-click handoff to Wacom Calligraphy or SRS.
4. **Offline WebAudio Autocorrelation / YIN Pitch-Contour ($F_0$) Extractor (`FORM-REQ-0015`):**
   - 100% offline time-domain autocorrelation / YIN fundamental frequency ($F_0$) detector (`75 Hz – 450 Hz`) with parabolic lag interpolation achieving `< 3 Hz` error on reference waveforms, Speaker-Normalized log-$F_0$ to Chao 5-Level Tone (`1.0–5.0`) mapping, and synthetic reference tone waveform generation (`Tone 1: 55`, `Tone 2: 35`, `Tone 3: 214/21`, `Tone 4: 51`, `Neutral: 3`).
5. **Live Dual-Curve Pitch-Contour Visualizer, Tone Sandhi & Retroflex vs. Flat Sibilant Coach (`FORM-REQ-0016`):**
   - Dual-curve Chao `1–5` pitch visualizer (native speaker target curve vs. learner recorded curve) with deterministic `0–100%` Tone Contour Match Score, 1-click **"Replay My Voice vs. Native Speaker"** (`AudioBuffer` / `MediaRecorder` self-monitoring), spoken Taiwan Tone Sandhi drills (`不`, `一`, `3+3 -> 2+3`, Taiwanese low-dipping `Tone 3 [21]`), and Taiwanese Retroflex (`ㄓㄔㄕㄖ`) vs. Flat Sibilant (`ㄗㄘㄙ`) Minimal-Pair Coach (`知/資, 吃/疵, 詩/私, 日/字, 山/三, 十/四, 主/組, 車/冊`, etc.).
6. **Modularized DaQian 8-Stage Typing Dojo, 5-World Skill Tree & 3-Stage Match Arena (`FORM-REQ-0017`):**
   - Decomposes the predecessor prototype's monolithic `App.tsx` typing/gamification features into clean `< 600` LOC modules inside Studio 6 (`詞彙與大千 — Vocab, SRS & Dojo Studio`), integrating the TOCFL Novice 1 – Band B2 Word Bank, FSRS-Lite Due Review Queue, 8-Stage Taiwan DaQian (`大千式`) Touch-Typing Dojo (with virtual keyboard, per-key error heatmap, and blind keycap toggle), 5-World Skill Tree, and 3-Stage Match Arena.

---

## 2. Per-File LOC Allocation & Complexity Budget (`Pattern 12`)

Every Phase 3 source file in `07-Configuration/Source/src/` is budgeted strictly below the **`600` LOC soft warning** and **`800` LOC hard mechanical block**:

| Planned File Path | Allocated Requirements | Target LOC | Soft / Hard Ceiling | Responsibility |
| :--- | :--- | :---: | :---: | :--- |
| `src/data/moeStrokeAndPhoneticData.ts` | `FORM-REQ-0013`, `FORM-REQ-0014` | `~460` LOC | `600 / 800` | Curated Taiwan MOE Standard Vector Stroke-Order character bank (`20` Traditional characters including `裡, 為, 骨, 黃, 國, 臺, 灣, 麵, 捷, 運, 請, 謝` with normalized `[0..1]` vector medians, stroke types, and MOE orthographic comparison notes) + `10` Semantic-Phonetic (`形聲字`) series (`46` Traditional characters) and `10` Semantic Radicals (`部首`). |
| `src/lib/wacomStrokeEngine.ts` | `FORM-REQ-0012`, `FORM-REQ-0013` | `~340` LOC | `600 / 800` | W3C `PointerEvent` stroke processor (`pressure -> tapered width`, `getCoalescedEvents()` extractor, Wacom eraser detection, pen-only palm rejection filter) + Taiwan MOE vector stroke grader (`gradeUserStroke` & `gradeCharacterWriting` scoring start point, direction cosine similarity, path length, and stroke order). |
| `src/components/WacomCalligraphyStudio.tsx` | `FORM-REQ-0012`, `FORM-REQ-0013`, `FORM-REQ-0014`, `FORM-REQ-0021` | `~510` LOC | `600 / 800` | Studio 4 (`書法筆順 — Wacom Calligraphy Studio`) with `<canvas>` (`九宮格` & `田字格` grids), pressure-tapered ink, `描紅 / 聽寫默寫 / 臨摹` modes, Left/Right-Handed toolbar docking swap, and the Semantic-Phonetic (`形聲字`) Radical & Sound-Component Workbench. |
| `src/lib/pitchContourEngine.ts` | `FORM-REQ-0015`, `FORM-REQ-0016` | `~360` LOC | `600 / 800` | 100% offline time-domain autocorrelation / YIN $F_0$ pitch extractor (`75–450 Hz`, parabolic interpolation `< 3 Hz` error), Speaker-Normalized log-$F_0$ to Chao `1.0–5.0` mapper, reference tone waveform synthesizer, Dual-Curve Tone Contour Match Scorer (`0–100%`), Tone Sandhi drill phrases, and `ㄓㄔㄕㄖ vs ㄗㄘㄙ` Minimal-Pair dataset. |
| `src/components/SpeakingPitchStudio.tsx` | `FORM-REQ-0015`, `FORM-REQ-0016`, `FORM-REQ-0021` | `~480` LOC | `600 / 800` | Studio 5 (`發音聲調 — Speaking & Pitch Lab`) with Dual-Curve Chao `1–5` Pitch-Contour SVG Visualizer, offline WebAudio mic capture + "Replay My Voice vs. Native Speaker", Tone Sandhi Phrase Coach, and `ㄓㄔㄕㄖ vs ㄗㄘㄙ` Minimal-Pair Discrimination & Production Lab. |
| `src/data/daqianAndDojoData.ts` | `FORM-REQ-0017` | `~370` LOC | `600 / 800` | Taiwan DaQian (`大千式`) keyboard map (`41` keys across 4 rows), 8-Stage Touch-Typing Dojo curriculum (`Stage 1` Initials `ㄅㄆㄇㄈ` through `Stage 8` Speed Passage Mastery), 5-World Skill Tree (`20` nodes), and 3-Stage Match Arena decks. |
| `src/components/VocabSrsDojoStudio.tsx` | `FORM-REQ-0017`, `FORM-REQ-0003`, `FORM-REQ-0004`, `FORM-REQ-0021` | `~510` LOC | `600 / 800` | Studio 6 (`詞彙與大千 — Vocab, SRS & Dojo Studio`) integrating TOCFL Novice 1 – Band B2 Word Bank, FSRS-Lite Due Review Flashcards, 8-Stage DaQian Typing Dojo (virtual keyboard + per-key error heatmap + blind mode), 5-World Skill Tree, and 3-Stage Match Arena. |
| `src/tests/phase3.test.ts` | `FORM-REQ-0012`..`0017` | `~340` LOC | `600 / 800` | Automated unit & integration test suite verifying Wacom `PointerEvent` pressure/coalesced/eraser/palm-rejection, Taiwan MOE stroke grading (`裡, 為, 骨, 黃`), `形聲字` 10-series workbench, offline YIN $F_0$ `< 3 Hz` accuracy, Dual-Curve Tone Match scoring, and DaQian 8-Stage Dojo. |

---

## 3. Domain Expert Panel Trigger Evaluation (`Pattern 13`, `Pattern 17`, `Pattern 20`)

All **4 Domain Expert Panel roles** are triggered in Phase 3:
- **`DEP-01` (Taiwanese Mandarin & TOCFL Computational Linguist):** Triggered by Taiwan MOE stroke order (`國字標準字體筆順`: `裡, 為, 骨, 黃`), Semantic-Phonetic (`形聲字`) radical/phonetic decomposition, Taiwanese Mandarin `Tone 3 [21]` / sandhi rules, and DaQian (`大千式`) key-sequence ordering.
- **`DEP-02` (Acoustic DSP & Wacom Stylus Hardware Engineer):** Triggered by W3C `PointerEvent` pressure/coalesced/eraser/palm-rejection processing (`FORM-REQ-0012`) and offline WebAudio autocorrelation / YIN $F_0$ pitch extraction (`75–450 Hz`, `< 3 Hz` error) (`FORM-REQ-0015`).
- **`DEP-03` (SLA & "Taiwan in 10 Minutes a Day" Survival Pedagogist):** Triggered by Guided Trace (`描紅`) -> Dictation Recall (`聽寫默寫`) -> Freehand (`臨摹`) scaffolding, Minimal-Pair (`ㄓㄔㄕㄖ vs ㄗㄘㄙ`) perception-before-production coaching, and FSRS-Lite + 8-Stage DaQian skill progression.
- **`DEP-04` (UI/UX & Accessibility Designer — Mandatory Co-Lead):** Triggered at both Touchpoint A and Touchpoint B (`FORM-DEP-UX-001`) PLUS the **Pattern 20 Aggregate UI/UX Re-Review** across Studios 2, 3, 4, 5, and 6 before Phase 4 integrates Studio 1 (`課程與聽力`) and the unified App Shell.
