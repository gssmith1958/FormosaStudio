# FormosaStudio (`FORM`) — Phase 2 Post-Implementation Touchpoint B Panel Report (`FORM-DEP-TPB-002`)

* **Document ID:** `FORM-DEP-TPB-002`
* **Version:** `1.0.0`
* **Date:** `2026-11-13`
* **Phase:** Phase 2 — Adaptive $i + 1$ Reader, Spoken/Written Register Bridge & "Taiwan in 10 Minutes a Day" Survival Studio
* **Traces To:** `FORM-BOE-002`, `FORM-DEP-TPA-002`, `FORM-REQ-0006`, `FORM-REQ-0007`, `FORM-REQ-0008`, `FORM-REQ-0009`, `FORM-REQ-0010`, `FORM-REQ-0011`, `FORM-REQ-0005`, `FORM-REQ-0021`, `FORM-DEP-UX-001`
* **Panel Verdict:** **`PASS` (Unanimous Concurrence — `DEP-01`, `DEP-03`, `DEP-04` Co-Lead)**

---

## 1. Trigger Table Evaluation (`Pattern 13`, `Pattern 17`, `Pattern 21`)

| Role ID | Domain Expert Role | Phase 2 Touchpoint B Status | Verdict |
| :--- | :--- | :--- | :--- |
| **`DEP-01`** | Taiwanese Mandarin (`zh-TW`) & TOCFL Computational Linguist | **Triggered** (`gradedStoriesData.ts`, `readingEngine.ts`, `taiwanSurvivalData.ts`) | **PASS** |
| **`DEP-02`** | Acoustic DSP & Wacom Stylus Hardware Engineer | **Deferred to Phase 3** (Advisory pointer check verified `>= 44×44 px` Wacom tap targets on `TickMenuAndPragmatics.tsx` steppers) | **N/A (Advisory Verified)** |
| **`DEP-03`** | SLA & "Taiwan in 10 Minutes a Day" Survival Pedagogist | **Triggered** (`readingEngine.ts`, `listeningGymEngine.ts`, `TaiwanSurvivalStudio.tsx`, `TickMenuAndPragmatics.tsx`) | **PASS** |
| **`DEP-04`** | UI/UX & Accessibility Designer (`Guide 008`) | **Triggered — Mandatory Standing Co-Lead (`FORM-LL-007`)** (`ReadingGrammarStudio.tsx`, `TaiwanSurvivalStudio.tsx`, `TickMenuAndPragmatics.tsx`) | **PASS** |

---

## 2. Domain Expert Audit Verdicts

### 2.1 `DEP-01` (Taiwanese Mandarin & TOCFL Computational Linguist)
1. **`FORM-REQ-0006` (TOCFL Novice 1 – Band B2 Taiwan-Set Graded Stories):**
   - Verified 8 multi-paragraph Taiwan-set graded stories in `07-Configuration/Source/src/data/gradedStoriesData.ts` (`493` LOC) spanning TOCFL `Novice 1` through `Band B · Level 2`, embedding polyphone (`破音字`) and Taiwan MOE (`兩岸異讀字`) vocabulary.
2. **`FORM-REQ-0007` (`< 50 ms` FMM Custom Passage Segmentation):**
   - Verified `analyzePassageComprehensibility()` in `07-Configuration/Source/src/lib/readingEngine.ts` (`322` LOC) segments and annotates a `>= 2,000`-character Traditional Chinese passage in `< 50 ms` (`~3–8 ms` in `phase2.test.ts`).
3. **`FORM-REQ-0008` (Spoken `口語` vs. Written `書面語` Register Bridge):**
   - Verified 16 core Taiwanese register pairs (`可是/然而`, `還有/此外`, `因為…所以…/由於…因此…`, `不但/不僅`, `這時候/此時`, `常常/往往`, `覺得/認為`, `差不多/大致`, `馬上/立即`, `很多/許多`, `跟/與`, `幫忙/協助`, `如果/倘若`, `比方說/例如`, `特別/尤其`, `到最後/最終`) with interactive conversion drills.
4. **`FORM-REQ-0010` (Taiwanese `語助詞` & Hokkien `臺語` Loanwords):**
   - Verified 8 Taiwanese sentence-final particles (`啦, 喔, 耶, 欸, 齁, 囉, 嘛, 吧`) and 10 everyday Hokkien-in-Mandarin expressions (`歹勢, 阿公/阿嬤, 頭家, 龜毛, 麻吉, 落漆, 鬱卒, 凍蒜, 買單, 黑輪`).

### 2.2 `DEP-03` (SLA & Survival Pedagogist)
1. **`FORM-REQ-0006` & `FORM-REQ-0007` ($i + 1$ Comprehensibility Zones & Cloze Generator):**
   - Verified live `Known (Lv.2+)`, `Familiar (Lv.1)`, and `Target i+1 (Unseen)` classification against `progressStore.ts`, Comprehensibility Zone badges (`Optimal i+1 Zone 90–98%`, `Fluent Review Zone > 98%`, `Intensive Scaffolding Zone < 90%`), and 4-option multiple-choice cloze generation (`generatePassageClozes()`).
2. **`FORM-REQ-0009` & `FORM-REQ-0010` (6 Sticky-Label Modules, 12 Swiss-Army-Knife Frames & `點菜單` Simulator):**
   - Verified 6 themed 10-minute survival modules, 12 Swiss-Army-Knife survival sentence frames, and the interactive laminated paper `點菜單` simulator (`verifyTickMenuOrder()`) validating Table 5 dine-in beef noodle orders (`NT$250`).
3. **`FORM-REQ-0011` (5-Category Taiwan Functional Listening Gym):**
   - Verified `LISTENING_GYM_CATEGORIES`, `generateListeningDrill()`, and `evaluateListeningAnswer()` in `07-Configuration/Source/src/lib/listeningGymEngine.ts` (`407` LOC) across all 5 categories (`nt_prices`, `discounts`, `minguo_dates`, `phone_invoice`, `addresses`).

### 2.3 `DEP-04` (UI/UX & Accessibility Designer — Mandatory Standing Co-Lead)
1. **`FORM-REQ-0021` & `FORM-LL-007` (Anti-Silo Component Reuse & Cross-Studio Handoff):**
   - `ReadingGrammarStudio.tsx` (`591` LOC), `TaiwanSurvivalStudio.tsx` (`433` LOC), and `TickMenuAndPragmatics.tsx` (`430` LOC) are built directly on `<StudioHeaderBanner>`, `<StudioModeSwitcher>`, `<StylusButton>` (`>= 44×44 px`), `<RubyText>`, and `<CrossStudioActionPills>` (`studioContextBus.ts`), preventing any piece-part UI drift.
   - Verified the `🖨️ Printable Sticky-Label Sheet Mode` (`printableSheetMode`) in `TaiwanSurvivalStudio.tsx` rendering dashed cut-out cards with `<RubyText size="xl" />`.
2. **`FORM-REQ-0005` (Mechanical LOC Budget Compliance):**
   - All 23 cumulative Phase 1 + Phase 2 files are strictly `< 600` LOC (`0` warnings, `0` errors).

---

## 3. Pattern 21 Shared-Concept Consumer Propagation Check

| Producer Module | Shared Concept / Export | Phase 2 Consumers | Propagation Verified |
| :--- | :--- | :--- | :--- |
| `src/lib/zhuyinTokenizer.ts` | `tokenizeAndAnnotate` | `readingEngine.ts`, `RubyText.tsx` | **PASS** |
| `src/lib/progressStore.ts` | `UserProgressState`, `recordWordPractice` | `readingEngine.ts`, `ReadingGrammarStudio.tsx`, `TaiwanSurvivalStudio.tsx` | **PASS** (Practicing a word immediately updates live $i + 1$ comprehensibility counts) |
| `src/lib/studioContextBus.ts` | `getStudioBusState`, `setFocusedContextItem`, `dispatchStudioHandoff` | `ReadingGrammarStudio.tsx`, `TaiwanSurvivalStudio.tsx`, `TickMenuAndPragmatics.tsx` | **PASS** |
| `src/components/uiPrimitives.tsx` | `<StudioHeaderBanner>`, `<StudioModeSwitcher>`, `<StylusButton>`, `<CrossStudioActionPills>` | `ReadingGrammarStudio.tsx`, `TaiwanSurvivalStudio.tsx`, `TickMenuAndPragmatics.tsx` | **PASS** |
