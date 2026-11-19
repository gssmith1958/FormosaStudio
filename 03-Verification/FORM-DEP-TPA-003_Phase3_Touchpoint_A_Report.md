---
id: FORM-DEP-TPA-003
type: VerificationReport
title: FormosaStudio — Phase 3 Domain Expert Panel Touchpoint A Design Review Report
status: Approved
version: 1.0.0
created: 2026-11-13
owner: GSS
parent_ids:
  - FORM-BOE-003
  - FORM-REQ-0012
  - FORM-REQ-0013
  - FORM-REQ-0014
  - FORM-REQ-0015
  - FORM-REQ-0016
  - FORM-REQ-0017
  - FORM-REQ-0021
  - FORM-DEP-UX-001
---

# FormosaStudio (`FORM`) — Phase 3 Touchpoint A Design Review Report (`FORM-DEP-TPA-003`)

- **Review Type:** Pre-Implementation Domain Expert Panel Design Review (`Touchpoint A` — `Pattern 13`, `Pattern 17`, `Pattern 20`, & `Pattern 21`)
- **Triggered Panel Members (All 4 Roles Active):**
  - **`DEP-01`:** Taiwanese Mandarin & TOCFL Computational Linguist
  - **`DEP-02`:** Acoustic DSP & Wacom Stylus Hardware Engineer
  - **`DEP-03`:** SLA & "Taiwan in 10 Minutes a Day" Survival Pedagogist
  - **`DEP-04`:** UI/UX & Accessibility Designer (**Mandatory Standing Co-Lead** per `FORM-LL-007` & `FORM-DEP-UX-001`)

---

## 1. `DEP-01` Linguistic & Orthographic Pre-Implementation Requirements

1. **Taiwan MOE Standard Vector Stroke-Order (`教育部國字標準字體筆順`) (`FORM-REQ-0013`):**
   - `src/data/moeStrokeAndPhoneticData.ts` must provide `>= 20` Traditional Chinese characters with normalized `[0.0..1.0]` vector medians (`start`, `end`, optional `mid`), stroke categories (`橫, 豎, 撇, 捺, 點, 提, 折, 鉤`), and explicit Taiwan MOE vs. Mainland PRC orthographic comparison notes:
     - **`裡` (`衣+里`, 13 strokes):** Left-right `衣+里` structure (vs. Mainland `裏`), with vertical `豎` piercing `日` before closing the bottom two `橫` strokes.
     - **`為` (9 strokes):** Point-first sequence (`點 -> 撇 -> 橫折鉤 -> 橫折 -> 橫折鉤 -> 點 -> 點 -> 點 -> 點`).
     - **`骨` (10 strokes):** Upper-right inner fold (`橫折` inside the top skull box).
     - **`黃` (12 strokes):** `廿`-top structure (`橫 -> 豎 -> 豎 -> 橫`).
     - **High-Frequency Taiwan Survival & Core Characters:** `國, 臺, 灣, 麵, 捷, 運, 請, 謝` plus foundational characters (`永, 人, 大, 水, 木, 心, 日, 中`).
2. **Semantic-Phonetic (`形聲字`) Radical & Sound-Component Workbench (`FORM-REQ-0014`):**
   - Must include `>= 10` Semantic Radicals (`部首`: `氵, 言, 食, 扌, 心, 辵, 日, 目, 火, 金`) and `>= 10` Phonetic Series (`聲符`: `青, 馬, 巴, 包, 方, 交, 寺, 羊, 工, 主`) covering `>= 40` Traditional characters.
3. **Taiwanese Mandarin Spoken `Tone 3 [21]` & DaQian (`大千式`) Key Sequence (`FORM-REQ-0016`, `FORM-REQ-0017`):**
   - `pitchContourEngine.ts` must model both isolated citation `Tone 3 [214]` and natural Taiwanese low-falling `Tone 3 [21]`, plus `3+3 -> 2+3`, `不`, and `一` sandhi.
   - `daqianAndDojoData.ts` must enforce Taiwan `大千式` key order (`Initial -> Medial -> Rhyme -> Tone`, with `Tone 1 = Space`, `Tone 2 = 6`, `Tone 3 = 3`, `Tone 4 = 4`, `Neutral = 7`).

---

## 2. `DEP-02` Hardware & Acoustic DSP Pre-Implementation Requirements

1. **W3C `PointerEvent` Calligraphy Engine (`FORM-REQ-0012`, `FORM-REQ-0013`):**
   - `<canvas>` must set `touch-action: none` (`style={{ touchAction: 'none' }}`).
   - Pressure-to-width mapping: `width = minW + (maxW - minW) * Math.pow(pressure, 0.85)`.
   - `extractCoalescedPoints()` must extract sub-frame points via `getCoalescedEvents?.()` for 200 Hz Wacom tablets.
   - `isWacomEraserEvent()` must detect `pointerType === 'eraser' || (buttons & 32) === 32 || button === 5`.
   - `shouldAcceptPointerEvent(e, penOnlyMode)` must reject `pointerType === 'touch'` when Pen-Only Palm Rejection is active.
   - `gradeUserStroke()` and `gradeCharacterWriting()` must score start-point proximity (`35%`), direction cosine similarity (`45%`, flagging `REVERSED_DIRECTION` when $\cos\theta < -0.25$), and trajectory length ratio (`20%`).
2. **Offline WebAudio YIN / Autocorrelation Pitch Extractor (`FORM-REQ-0015`, `FORM-REQ-0016`):**
   - Must operate 100% offline over `75 Hz – 450 Hz` using YIN / normalized difference + 3-point parabolic lag interpolation achieving **`< 3.0 Hz` absolute error** on synthetic reference waveforms.
   - Speaker-Normalized log-$F_0$ to Chao `1.0–5.0` mapping: $\text{Chao}(F_0) = \text{clamp}(1, 5, 1 + 4 \ln(F_0/F_{\min})/\ln(F_{\max}/F_{\min}))$.
   - Dual-Curve Tone Contour Match Scorer (`0–100%`) combining Mean Absolute Chao Deviation (`60%`) and Slope Correlation (`40%`).

---

## 3. `DEP-03` SLA & Survival Pedagogy Pre-Implementation Requirements

1. **Progressive Calligraphy Recall Modes (`FORM-REQ-0013`):**
   - `描紅` (Guided Trace with directional arrows) -> `臨摹` (Freehand with post-completion overlay) -> `聽寫默寫` (Audio & Zhuyin Dictation Recall with hidden glyph).
2. **Perception-Before-Production Minimal Pairs & Sandhi Coaching (`FORM-REQ-0016`):**
   - `>= 8` Retroflex (`ㄓㄔㄕㄖ`) vs. Flat Sibilant (`ㄗㄘㄙ`) minimal pairs (`知/資, 吃/疵, 詩/私, 日/字, 山/三, 十/四, 主/組, 車/冊, 找到/早到, 商業/桑葉`) with tongue-position coaching and A/B auditory discrimination quiz.
   - 1-Click **"Replay My Voice vs. Native Speaker"** self-monitoring loop.
3. **8-Stage DaQian Typing Dojo, 5-World Skill Tree & 3-Stage Match Arena (`FORM-REQ-0017`):**
   - Progressive motor-memory stages (`Stage 1` Initials through `Stage 8` Blind Speed Mastery), 20-node Skill Tree across 5 Taiwan Worlds, and 3-Stage Match Arena synchronized with `progressStore.ts`.

---

## 4. `DEP-04` UI/UX Co-Leadership Pre-Implementation Requirements (`FORM-DEP-UX-001`)

1. **Mandatory Shared Component & Bus Integration (`FORM-REQ-0021`):**
   - Studios 4 (`WacomCalligraphyStudio.tsx`), 5 (`SpeakingPitchStudio.tsx`), and 6 (`VocabSrsDojoStudio.tsx`) must use `<StudioHeaderBanner>`, `<StudioModeSwitcher>`, `<StylusButton>`, `<HandednessToggle>`, `<CrossStudioActionPills>`, `<RubyText>`, and `studioContextBus.ts`.
2. **Left/Right-Handed Wacom Ergonomic Swap (`FORM-REQ-0012`):**
   - `WacomCalligraphyStudio.tsx` must flip the horizontal docking order (`flex-row` vs. `flex-row-reverse`) between the Calligraphy Canvas and the Inspector/Control Sidebar when toggling Left-Handed vs. Right-Handed mode.
3. **Mechanical LOC Compliance (`Pattern 12`):**
   - All 8 Phase 3 files must remain strictly `< 600` LOC (`0` warnings, `0` errors).

---

## 5. Sign-Off
- **`DEP-01` (Taiwanese Mandarin & TOCFL Computational Linguist):** Approved
- **`DEP-02` (Acoustic DSP & Wacom Stylus Hardware Engineer):** Approved
- **`DEP-03` (SLA & Survival Pedagogist):** Approved
- **`DEP-04` (UI/UX & Accessibility Co-Lead):** Approved
