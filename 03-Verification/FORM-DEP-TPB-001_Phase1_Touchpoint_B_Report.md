# FormosaStudio (`FORM`) — Phase 1 Post-Implementation Touchpoint B Panel Report (`FORM-DEP-TPB-001`)

* **Document ID:** `FORM-DEP-TPB-001`
* **Version:** `1.0.0`
* **Date:** `2026-11-13`
* **Phase:** Phase 1 — Linguistic Core, Full Curriculum Database, FSRS-Lite Store, Shared UI Primitives, Cross-Studio Handoff Bus & Resource Admin Manager
* **Traces To:** `FORM-REQ-0001`, `FORM-REQ-0002`, `FORM-REQ-0003`, `FORM-REQ-0004`, `FORM-REQ-0005`, `FORM-REQ-0021`, `FORM-REQ-0022`, `FORM-TAILOR-001`, `FORM-BOE-001`, `FORM-DEP-TPA-001`, `FORM-DEP-UX-001`, `FORM-DEC-001`, `FORM-DEC-004`
* **Panel Verdict:** **`PASS` (Unanimous Concurrence — `DEP-01`, `DEP-03`, `DEP-04`)**

---

## 1. Trigger Table Evaluation (`Pattern 13`, `Pattern 17`, `Pattern 20`, `Pattern 21`)

| Role ID | Domain Expert Role | Phase 1 Touchpoint B Status | Verdict |
| :--- | :--- | :--- | :--- |
| **`DEP-01`** | Taiwanese Mandarin (`zh-TW`) & TOCFL Computational Linguist | **Triggered** (`polyphoneLexicon.ts`, `zhuyinTokenizer.ts`, `vocabularyCatalog.ts`, `curriculumAdminStore.ts`) | **PASS** |
| **`DEP-02`** | Acoustic DSP & Wacom Stylus Hardware Engineer | **Deferred to Phase 3** (Advisory schema check verified `strokeMastery`, `handedness`, and `palmRejectionPenOnly` in `progressStore.ts`) | **N/A (Advisory Verified)** |
| **`DEP-03`** | SLA & "Taiwan in 10 Minutes a Day" Survival Pedagogist | **Triggered** (`progressStore.ts` FSRS-lite math, `RubyText.tsx` adaptive fading, `ResourceAdminModal.tsx`) | **PASS** |
| **`DEP-04`** | UI/UX & Accessibility Designer (`Guide 008`) | **Triggered — Mandatory Standing Co-Lead (`FORM-LL-007`) & First-Milestone `FORM-DESCHAR-001` Calibration** | **PASS** |

---

## 2. Domain Expert Audit Verdicts

### 2.1 `DEP-01` (Taiwanese Mandarin & TOCFL Computational Linguist)
1. **`FORM-REQ-0001` (Forward Maximum-Matching Word Tokenizer & Polyphone `破音字` Disambiguator):**
   - `POLYPHONE_PAIRS` in `07-Configuration/Source/src/lib/polyphoneLexicon.ts` defines **26 core Taiwanese Mandarin polyphone pairs** (`長`, `還`, `行`, `得`, `樂`, `會`, `數`, `著`, `重`, `便`, `和`, `覺`, `了`, `少`, `好`, `傳`, `假`, `彈`, `乾`, `教`, `都`, `種`, `相`, `空`, `切`, `發/髮`).
   - `segmentTextFMM()` and `tokenizeAndAnnotate()` in `07-Configuration/Source/src/lib/zhuyinTokenizer.ts` achieve **100% (`52/52` test phrases)** disambiguation accuracy in `src/tests/phase1.test.ts` (exceeding the `>= 98%` threshold).
2. **`FORM-REQ-0002` (Taiwan MOE `兩岸異讀字` Standard & Tone Sandhi Engine):**
   - Verified all 12 Taiwan MOE cross-strait standard entries (`垃圾 ㄌㄜˋ ㄙㄜˋ`, `星期 ㄒㄧㄥ ㄑㄧˊ`, `研究 ㄧㄢˊ ㄐㄧㄡˋ`, `企業 ㄑㄧˋ ㄧㄝˋ`, `法國 ㄈㄚˋ ㄍㄨㄛˊ`, `液體 ㄧㄝˋ ㄊㄧˇ`, `微糖 ㄨㄟˊ ㄊㄤˊ`, conjunctive `和 ㄏㄢˋ`, `角色 ㄐㄧㄠˇ ㄙㄜˋ`, `蝸牛 ㄍㄨㄚ ㄋㄧㄡˊ`, `危險 ㄨㄟˊ ㄒㄧㄢˇ`, `知識 ㄓ ㄕˋ`).
   - Verified non-destructive spoken tone sandhi (`spokenZhuyin` + `sandhiExplanations`) for 2- and 3-syllable 3rd-tone chains (`我很好 -> ㄨㄛˊ ㄏㄣˊ ㄏㄠˇ`), `不` before 4th tone (`不會 -> ㄅㄨˊ ㄏㄨㄟˋ`), and `一` sandhi (`一塊 -> ㄧˊ ㄎㄨㄞˋ`, `一杯 -> ㄧˋ ㄅㄟ`, `第一 -> ㄉㄧˋ ㄧ`).
3. **`FORM-REQ-0003` & `FORM-REQ-0022` (Complete NTNU Vols 1–6, Pimsleur Units 1–19 & TOCFL Catalog):**
   - `contemporaryVols1to2.ts` and `contemporaryVols3to6.ts` provide **61 complete lessons** across Volumes 1–6 (`15, 12, 10, 8, 8, 8` lessons per volume), eliminating the 1-lesson stubs in `Chinese2` (`FORM-LL-002`).
   - `pimsleurUnitsA.ts` and `pimsleurUnitsB.ts` provide all 19 Pimsleur units, and `vocabularyCatalog.ts` indexes vocabulary across all 6 TOCFL bands (`Novice 1` through `Band B2`).

### 2.2 `DEP-03` (SLA & Survival Pedagogist)
1. **`FORM-REQ-0004` (FSRS-Lite Stability/Difficulty Progress Store & JSON Backup/Restore):**
   - `progressStore.ts` implements power-law retrievability $R(t, S) = (1 + \frac{19}{81}\frac{\Delta t}{S})^{-0.5}$, mean-reverting difficulty $D \in [1, 10]$, stability growth across `charMastery`, `wordMastery`, and `strokeMastery`, and validated `formosa-progress-v2` JSON export/import round-trip.
2. **`FORM-REQ-0021` & `FORM-REQ-0022` (Adaptive Ruby Fading & 3-Step Resource Admin):**
   - `RubyText.tsx` implements mastery-linked opacity (`Lv.0–1: 100%`, `Lv.2: 45%`, `Lv.3: 15%`) with tap-to-peek (`togglePeek`) for stylus/touch accessibility.
   - `curriculumAdminStore.ts` and `ResourceAdminModal.tsx` implement a 3-step guided ingestion workflow (`.docx` XML, `.txt`, `.csv`, `.json`) with automatic Taiwan MOE Zhuyin annotation and polyphone review.

### 2.3 `DEP-04` (UI/UX & Accessibility Designer — Standing Co-Lead & First-Milestone Calibration)
1. **`FORM-REQ-0021` & `FORM-REQ-0005` (Shared UI Primitive Kit, 6-Studio Shell Contract & LOC Budgets):**
   - All 14 source and test files in `07-Configuration/Source/src/` are strictly under the `600`-LOC soft warning and `800`-LOC hard block ceiling (`0` warnings, `0` errors).
   - `WCAG_TONE_PALETTE` in `uiPrimitives.tsx` enforces WCAG 2.1 AA contrast (`>= 9.3:1` on `#0F172A` slate across all 5 tones, replacing `#EF4444` with `#FCA5A5` for Tone 4).
   - `<StylusButton>` and `<StudioModeSwitcher>` enforce `>= 44×44 px` hit targets; `<HandednessToggle>` supports `'right'` / `'left'` Wacom toolbar docking; `studioContextBus.ts` + `<ReturnBreadcrumbBar>` + `<CrossStudioActionPills>` eliminate inter-studio dead ends.
2. **First-Milestone `FORM-DESCHAR-001` Calibration Notes (`Guide 008`):**
   - Vertical Zhuyin column line-height (`leading-[1.02]` / `leading-[1.05]`) in `RubyText.tsx` cleanly aligns 1–3 Bopomofo symbols with right-column tone marks (`ˊ ˇ ˋ`) and top-centered neutral dot (`˙`).
   - Phases 2–3 studios must read `getStudioBusState().focusedItem` on mount/update so cross-studio deep links (`✒️ Write on Wacom`, `🎤 Coach Pitch`) preload the active character or phrase with zero friction.

---

## 3. Pattern 21 Shared-Concept Consumer Propagation Check

| Producer Module | Shared Concept / Export | Phase 1 Consumers | Propagation & Live Invalidation Verified |
| :--- | :--- | :--- | :--- |
| `src/lib/zhuyinTypes.ts` | `ParsedZhuyinSyllable`, `parseZhuyinSyllable`, `getDaqianKeysForWord` | `zhuyinTokenizer.ts`, `curriculumAdminStore.ts`, `vocabularyCatalog.ts`, `RubyText.tsx` | **PASS** |
| `src/lib/polyphoneLexicon.ts` | `POLYPHONE_PAIRS`, `TAIWAN_MOE_PRONUNCIATIONS`, `WORD_ZHUYIN_LEXICON` | `zhuyinTokenizer.ts`, `curriculumAdminStore.ts`, `phase1.test.ts` | **PASS** (`registerDynamicLexiconWord` updates runtime lexicon in-place) |
| `src/lib/zhuyinTokenizer.ts` | `tokenizeAndAnnotate`, `annotateTraditionalText`, `detectToneSandhi` | `vocabularyCatalog.ts`, `curriculumAdminStore.ts`, `RubyText.tsx`, `phase1.test.ts` | **PASS** |
| `src/lib/progressStore.ts` | `UserProgressState`, `CharMasteryRecord`, `StylusHandedness` | `uiPrimitives.tsx`, `RubyText.tsx`, `phase1.test.ts` | **PASS** (`recordWordPractice` & `recordStrokePractice` propagate to `charMastery`) |
| `src/lib/studioContextBus.ts` | `STUDIO_DEFINITIONS`, `dispatchStudioHandoff`, `popReturnHandoff` | `uiPrimitives.tsx`, `phase1.test.ts` | **PASS** |
| `src/lib/curriculumAdminStore.ts` | `publishCustomCurriculumPack`, `subscribeCurriculumAdminChanges` | `vocabularyCatalog.ts`, `ResourceAdminModal.tsx`, `phase1.test.ts` | **PASS** (`invalidateVocabularyCatalogCache` triggered automatically on publish/remove) |
