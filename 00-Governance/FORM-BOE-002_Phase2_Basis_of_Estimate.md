# Phase 2 Basis of Estimate (`FORM-BOE-002`)

```yaml
id: FORM-BOE-002
type: EngineeringPlan
title: Phase 2 Basis of Estimate — Adaptive i+1 Reader, Spoken/Written Register Bridge & "Taiwan in 10 Minutes a Day" Survival Studio
status: Approved
version: 1.0.0
project: FORM
owner: Principal Engineer
created_date: 2026-11-13
updated_date: 2026-11-13
framework_reference: "Volume 7 §5, Guide 002 §3, Guide 007 §13.1"
traces_to:
  - FORM-ROAD-001
  - FORM-REQ-0006
  - FORM-REQ-0007
  - FORM-REQ-0008
  - FORM-REQ-0009
  - FORM-REQ-0010
  - FORM-REQ-0011
```

---

## 1. Scope & Allocated Requirements (`Phase 2`)

Per `FORM-ROAD-001`, Phase 2 constructs **Studio 3 (`閱讀語法 — Reader & Grammar Studio`)** and **Studio 2 (`臺灣生存 — 10-Min Taiwan Survival Studio`)** directly atop the Phase 1 Shared UI Primitive Kit (`uiPrimitives.tsx`), Vertical Taiwanese Zhuyin Ruby (`RubyText.tsx`), Cross-Studio Context Handoff Bus (`studioContextBus.ts`), Taiwan MOE FMM Tokenizer (`zhuyinTokenizer.ts`), and FSRS-Lite Progress Store (`progressStore.ts`):

* **`FORM-REQ-0006`:** Adaptive $i + 1$ Graded Reader Across TOCFL Bands A1–B2 (`>= 8` multi-paragraph Taiwan-set graded stories, live `Known Lv.2+` / `Familiar Lv.1` / `Target i+1` percentages, Comprehensibility Badge, and 1-click cross-studio handoff).
* **`FORM-REQ-0007`:** Custom Traditional Chinese Text Importer & Instant Cloze Generator (`< 50 ms` FMM segmentation for passages up to `2,000` characters, live $i + 1$ scoring, and playable multiple-choice sentence cloze drills).
* **`FORM-REQ-0008`:** Spoken vs. Written Taiwan Register Bridge (`口語` vs. `書面語`) covering `>= 15` core Taiwanese pairs (`可是/然而`, `還有/此外`, `因為…所以…/由於…因此…`, etc.) with interactive register-conversion drills.
* **`FORM-REQ-0009`:** *Taiwan in 10 Minutes a Day* — Bite-Sized Visual Survival Modules (`6` themed 10-minute modules), the `12` "Swiss-Army-Knife" survival sentence frames, street/door sign decoders, and printable/viewable Sticky-Label Card sheet mode.
* **`FORM-REQ-0010`:** Interactive Taiwanese Laminated Paper Tick-Menu (`點菜單`) Simulator (fulfilling real-world dining scenarios and verifying NT$ bill totals) & Taiwanese Spoken Pragmatics Lab (`>= 8` sentence-final particles `語助詞` and `>= 10` everyday Hokkien `臺語` loanwords).
* **`FORM-REQ-0011`:** Taiwan Functional Listening Gym training auditory comprehension and structured numeric/text verification across all `5` categories: (1) NT$ prices & `萬` (`10,000`), (2) `打折` discount math (`八折 = 20% off`), (3) ROC `民國` calendar dates (`Year - 1911`), (4) Taiwan mobile phone numbers (`09XX-XXX-XXX`) & Uniform Invoice (`統一發票`) 3-digit endings, and (5) `段/巷/弄/號/樓` addresses.

---

## 2. Module-Level LOC Budget & Effort Estimate (`Pattern 12` Ceiling: `<= 600` Warn / `<= 800` Block)

| Target Module Path | Allocated Requirement(s) | Estimated LOC | Ceiling Check (`<= 600` Warn / `<= 800` Block) |
| :--- | :--- | :--- | :--- |
| `07-Configuration/Source/src/data/gradedStoriesData.ts` | `FORM-REQ-0006`, `0008` | `~460` LOC | Pass (`< 600`) |
| `07-Configuration/Source/src/lib/readingEngine.ts` | `FORM-REQ-0006`, `0007`, `0008` | `~350` LOC | Pass (`< 600`) |
| `07-Configuration/Source/src/components/ReadingGrammarStudio.tsx` | `FORM-REQ-0006`, `0007`, `0008`, `0021` | `~490` LOC | Pass (`< 600`) |
| `07-Configuration/Source/src/data/taiwanSurvivalData.ts` | `FORM-REQ-0009`, `0010` | `~510` LOC | Pass (`< 600`) |
| `07-Configuration/Source/src/lib/listeningGymEngine.ts` | `FORM-REQ-0011` | `~360` LOC | Pass (`< 600`) |
| `07-Configuration/Source/src/components/TickMenuAndPragmatics.tsx` | `FORM-REQ-0010`, `0021` | `~440` LOC | Pass (`< 600`) |
| `07-Configuration/Source/src/components/TaiwanSurvivalStudio.tsx` | `FORM-REQ-0009`, `0010`, `0011`, `0021` | `~480` LOC | Pass (`< 600`) |
| `07-Configuration/Source/src/tests/phase2.test.ts` | `FORM-REQ-0006`..`0011` | `~410` LOC | Pass (`< 600`) |

---

## 3. Domain Expert Panel Trigger Evaluation (`Pattern 17` Row-Level Coverage)

| Role ID | Triggered in Phase 2? | Rationale |
| :--- | :--- | :--- |
| **`DEP-01` (Taiwanese Mandarin & TOCFL Linguist)** | **YES** | Reviews TOCFL Novice–B2 graded stories (`FORM-REQ-0006`), `< 50 ms` FMM custom passage segmentation (`FORM-REQ-0007`), `口語 <-> 書面語` Register Bridge accuracy (`FORM-REQ-0008`), and Taiwanese `語助詞` / Hokkien `臺語` phonology (`FORM-REQ-0010`). |
| **`DEP-02` (Acoustic DSP & Wacom Stylus Engineer)** | **DEFERRED TO PHASE 3 (Advisory Pointer Check Only)** | Verifies that `<TickMenuAndPragmatics>` quantity steppers and checkboxes work cleanly with Wacom stylus taps (`>= 44×44 px`); full Wacom pressure canvas and WebAudio $F_0$ DSP are built in Phase 3. |
| **`DEP-03` (SLA & Survival Pedagogist)** | **YES** | Reviews $i + 1$ comprehensibility zones (`90–98%` optimal band), cloze distractor pedagogy (`FORM-REQ-0006`, `0007`), the 6 "Taiwan in 10 Minutes a Day" modules & 12 Swiss-Army-Knife frames (`FORM-REQ-0009`), `點菜單` task-based simulation (`FORM-REQ-0010`), and Functional Listening Gym drills (`FORM-REQ-0011`). |
| **`DEP-04` (UI/UX & Accessibility Designer — Standing Co-Lead)** | **YES (Mandatory Standing Co-Lead)** | Co-leads Phase 2 design and verification of `ReadingGrammarStudio.tsx`, `TaiwanSurvivalStudio.tsx`, and `TickMenuAndPragmatics.tsx`, ensuring strict reuse of `uiPrimitives.tsx`, `<RubyText>`, and `studioContextBus.ts` (`<CrossStudioActionPills>` & `focusedItem` consumption) with zero piece-part UI drift (`FORM-LL-007`). |
