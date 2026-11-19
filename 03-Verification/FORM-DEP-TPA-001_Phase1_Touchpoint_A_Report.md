# Phase 1 Pre-Implementation Touchpoint A Panel Report (`FORM-DEP-TPA-001`)

* **Artifact ID:** `FORM-DEP-TPA-001`
* **Phase:** Phase 1 (Shared UI Primitive Kit, Cross-Studio Handoff Bus, Taiwan MOE Linguistic Core, Full Curriculum Database, FSRS-Lite Store & Resource Admin Manager)
* **Subagent Session Reference:** `9c2e45de-4856-40fb-b99b-47e939e45228`
* **Covered Requirements:** `FORM-REQ-0001`, `FORM-REQ-0002`, `FORM-REQ-0003`, `FORM-REQ-0004`, `FORM-REQ-0005`, `FORM-REQ-0021`, `FORM-REQ-0022`
* **Date:** `2026-11-13`
* **Panel Composition (`Pattern 13` & `Pattern 17` Row-Level Evaluation):**
  * **`DEP-01` (Taiwanese Mandarin & TOCFL Computational Linguist):** **TRIGGERED (Active)**
  * **`DEP-02` (Acoustic DSP & Wacom Stylus Engineer):** **DEFERRED TO PHASE 3 (Advisory Schema Check Completed: `strokeMastery` & `handedness` pre-allocated in `progressStore.ts`)**
  * **`DEP-03` (SLA & Survival Pedagogist):** **TRIGGERED (Active)**
  * **`DEP-04` (UI/UX & Accessibility Designer — Standing Co-Lead):** **TRIGGERED (Active Co-Lead per `FORM-LL-007`)**
* **Principal Engineer Disposition:** **Accepted in Full (`Approved for Phase 1 Construction`)**

---

## 1. `DEP-01` (Linguist) Pre-Construction Specifications

1. **Forward Maximum-Matching (`FMM`) Word Tokenizer & 26 Core Polyphone (`破音字`) Pairs (`FORM-REQ-0001`):**
   * Greedy FMM word segmentation (`maxCompoundLen = 6` down to `2`) before single-character lookup, plus contextual particle rules (`得`, `和`, `了`, `著`).
   * Covers 26 core Taiwanese Mandarin polyphone pairs (`長`, `還`, `行`, `得`, `樂`, `會`, `數`, `著`, `重`, `便`, `和`, `覺`, `了`, `少`, `好`, `傳`, `假`, `彈`, `乾/幹`, `教`, `都`, `種`, `相`, `空`, `切`, `發/髮`).
2. **Taiwan MOE (`教育部國語辭典` / `兩岸異讀字`) Standard Pronunciations (`FORM-REQ-0002`):**
   * Enforces Taiwan MOE standard readings (`垃圾 ㄌㄜˋ ㄙㄜˋ`, `星期 ㄒㄧㄥ ㄑㄧˊ`, `研究 ㄧㄢˊ ㄐㄧㄡˋ`, `企業 ㄑㄧˋ ㄧㄝˋ`, `法國 ㄈㄚˋ ㄍㄨㄛˊ`, `液體 ㄧㄝˋ ㄊㄧˇ`, `微糖 ㄨㄟˊ ㄊㄤˊ`, conjunctive `和 ㄏㄢˋ`, `角色 ㄐㄧㄠˇ ㄙㄜˋ`, `蝸牛 ㄍㄨㄚ ㄋㄧㄡˊ`, `危險 ㄨㄟˊ ㄒㄧㄢˇ`, `知識 ㄓ ㄕˋ`).
3. **Tone Sandhi Engine (`FORM-REQ-0002`):**
   * Computes both `writtenZhuyin` and `spokenZhuyin` + `SandhiExplanation[]` for 2-syllable and 3-syllable 3rd-tone chains (`我很好` → `ㄨㄛˊ ㄏㄣˊ ㄏㄠˇ`), `不` (`ㄅㄨˊ` before 4th tone, `ㄅㄨˋ` elsewhere), and `一` (`ㄧˊ` before 4th tone, `ㄧˋ` before 1st/2nd/3rd tones, `ㄧ` in ordinals/digits like `第一`, `星期一`, `十一`).

---

## 2. `DEP-03` (SLA Pedagogist) Pre-Construction Specifications

1. **FSRS-Lite Stability (`S`) & Difficulty (`D`) Scheduler (`FORM-REQ-0004`):**
   * Tracks `charMastery` (recognition), `wordMastery` (vocabulary recall), and `strokeMastery` (Wacom character writing) using FSRS-lite stability/difficulty updates and validated JSON backup/restore (`exportProgressJson` / `importProgressJson`).
2. **Complete *Contemporary Chinese* (`Volumes 1–6`) & *Pimsleur* (`Units 1–19`) Curriculum (`FORM-REQ-0003`):**
   * Every volume (`Vols. 1–6`) contains `8–15` structured lessons (`Vol.1`: 15, `Vol.2`: 12, `Vol.3`: 10, `Vol.4`: 8, `Vol.5`: 8, `Vol.6`: 8) spanning TOCFL Bands `Novice 1`, `Novice 2`, `Band A1`, `Band A2`, `Band B1`, and `Band B2`.
3. **Curriculum & Resource Admin Manager (`FORM-REQ-0022`):**
   * Multi-format ingestion (`.docx`, `.txt`, `.csv`, `.json` + structured paste) with live FMM Zhuyin/polyphone preview and `Pattern 21` cache invalidation so new units/lessons propagate immediately across all 6 studios.

---

## 3. `DEP-04` (UI/UX & Accessibility Designer — Standing Co-Lead) Pre-Construction Specifications

1. **Phase 1 Shared UI Primitive Kit (`src/components/uiPrimitives.tsx`) (`FORM-REQ-0021`):**
   * Exports `WCAG_TONE_PALETTE` (verified `>= 4.5:1` contrast on `#0f172a`), `STUDIO_DEFINITIONS` (6 permanent top-level studios), `<ToneBadge>`, `<StudioHeaderBanner>`, `<StudioModeSwitcher>`, `<StylusButton>` (`>= 44×44 px` hit target, zero hover-only dependencies), `<HandednessToggle>`, `<ReturnBreadcrumbBar>`, and `<CrossStudioActionPills>`.
2. **Cross-Studio Context Handoff Bus (`src/lib/studioContextBus.ts`) & `<RubyText>` (`src/components/RubyText.tsx`):**
   * Deterministic handoff state with return stack (`← Return to [Source Studio]`) and adaptive vertical Taiwanese Zhuyin ruby (`100% -> 45% -> 15% tap-to-peek`).
3. **3-Step Guided `<ResourceAdminModal>` (`src/components/ResourceAdminModal.tsx`) (`FORM-REQ-0022`):**
   * Clean 3-step wizard (*1. Upload/Paste → 2. Taiwan MOE Zhuyin & Polyphone Preview/Edit → 3. Publish & Export Pack*) built entirely with `uiPrimitives.tsx`.
