# Phase 1 Basis of Estimate (`FORM-BOE-001`)

```yaml
id: FORM-BOE-001
type: EngineeringPlan
title: Phase 1 Basis of Estimate — Shared UI Primitive Kit, Cross-Studio Handoff Bus, Taiwan MOE Linguistic Core, Full Curriculum & Resource Admin Manager
status: Approved
version: 1.0.0
project: FORM
owner: Principal Engineer
created_date: 2026-11-13
updated_date: 2026-11-13
framework_reference: "Volume 7 §5, Guide 002 §3, Guide 007 §13.1"
traces_to:
  - FORM-ROAD-001
  - FORM-REQ-0001
  - FORM-REQ-0002
  - FORM-REQ-0003
  - FORM-REQ-0004
  - FORM-REQ-0005
  - FORM-REQ-0021
  - FORM-REQ-0022
```

---

## 1. Scope & Allocated Requirements (`Phase 1`)

Per `FORM-ROAD-001`, Phase 1 delivers the foundational linguistic engine, complete curriculum database, FSRS-lite progress store, Curriculum & Resource Admin Manager, and the end-to-end UI/UX foundation (`uiPrimitives.tsx` + `studioContextBus.ts`) for `FormosaStudio`:
* **`FORM-REQ-0001`:** Forward Maximum-Matching (`FMM`) Word Tokenizer & Polyphone (`破音字`) Disambiguation Engine (`>= 25` core Taiwanese polyphone pairs).
* **`FORM-REQ-0002`:** Taiwan Ministry of Education (`教育部`) Standard Pronunciation (`兩岸異讀字`) & Tone Sandhi Engine (`3rd-tone chains`, `不`, `一`).
* **`FORM-REQ-0003`:** Complete *Contemporary Chinese* (`Volumes 1–6`, `8–15` structured lessons per volume) & *Pimsleur* (`Units 1–19`) Curriculum Database spanning TOCFL Novice 1 through Band B2/C1.
* **`FORM-REQ-0004`:** FSRS-Lite Stability/Difficulty Scheduler (tracking character recognition, vocabulary recall, and Wacom character writing mastery) & Validated JSON Backup/Restore.
* **`FORM-REQ-0005`:** Modular Core & Data Decomposition strictly under the **`600` LOC soft warning / `800` LOC hard mechanical block** ceiling.
* **`FORM-REQ-0021`:** Unified 6-Studio Application Shell Contract, Shared UI Primitive Kit (`src/components/uiPrimitives.tsx`), and Cross-Studio Context Handoff Bus (`src/lib/studioContextBus.ts`).
* **`FORM-REQ-0022`:** Curriculum & Resource Admin Manager (`src/lib/curriculumAdminStore.ts` + `src/components/ResourceAdminModal.tsx`) for dynamic Pimsleur (`.docx`/`.txt`/`.csv`/`.json`) & NTNU *Contemporary Chinese* material ingestion.

---

## 2. Module-Level LOC Budget & Effort Estimate (`Pattern 12` Ceiling: `<= 600` Warn / `<= 800` Block)

| Target Module Path | Allocated Requirement(s) | Estimated LOC | Ceiling Check (`<= 600` Warn / `<= 800` Block) |
| :--- | :--- | :--- | :--- |
| `07-Configuration/Source/src/lib/zhuyinTypes.ts` | `FORM-REQ-0001`, `0002`, `0005` | `~320` LOC | Pass (`< 600`) |
| `07-Configuration/Source/src/lib/polyphoneLexicon.ts` | `FORM-REQ-0001`, `0002`, `0005` | `~420` LOC | Pass (`< 600`) |
| `07-Configuration/Source/src/lib/zhuyinTokenizer.ts` | `FORM-REQ-0001`, `0002`, `0005` | `~380` LOC | Pass (`< 600`) |
| `07-Configuration/Source/src/lib/progressStore.ts` | `FORM-REQ-0004`, `0005`, `0021` | `~360` LOC | Pass (`< 600`) |
| `07-Configuration/Source/src/lib/studioContextBus.ts` | `FORM-REQ-0021`, `0005` | `~210` LOC | Pass (`< 600`) |
| `07-Configuration/Source/src/lib/curriculumAdminStore.ts` | `FORM-REQ-0022`, `0005` | `~390` LOC | Pass (`< 600`) |
| `07-Configuration/Source/src/data/pimsleurUnitsA.ts` | `FORM-REQ-0003`, `0005` | `~540` LOC | Pass (`< 600`) |
| `07-Configuration/Source/src/data/pimsleurUnitsB.ts` | `FORM-REQ-0003`, `0005` | `~540` LOC | Pass (`< 600`) |
| `07-Configuration/Source/src/data/contemporaryVols1to2.ts` | `FORM-REQ-0003`, `0005` | `~520` LOC | Pass (`< 600`) |
| `07-Configuration/Source/src/data/contemporaryVols3to6.ts` | `FORM-REQ-0003`, `0005` | `~550` LOC | Pass (`< 600`) |
| `07-Configuration/Source/src/data/vocabularyCatalog.ts` | `FORM-REQ-0003`, `0005`, `0022` | `~380` LOC | Pass (`< 600`) |
| `07-Configuration/Source/src/components/uiPrimitives.tsx` | `FORM-REQ-0021`, `0005` | `~380` LOC | Pass (`< 600`) |
| `07-Configuration/Source/src/components/RubyText.tsx` | `FORM-REQ-0001`, `0002`, `0021` | `~220` LOC | Pass (`< 600`) |
| `07-Configuration/Source/src/components/ResourceAdminModal.tsx` | `FORM-REQ-0022`, `0021`, `0005` | `~420` LOC | Pass (`< 600`) |
| `07-Configuration/Source/src/tests/phase1.test.ts` | `FORM-REQ-0001`..`0005`, `0021`, `0022` | `~420` LOC | Pass (`< 600`) |

---

## 3. Domain Expert Panel Trigger Evaluation (`Pattern 17` Row-Level Coverage)

| Role ID | Triggered in Phase 1? | Rationale |
| :--- | :--- | :--- |
| **`DEP-01` (Taiwanese Mandarin & TOCFL Linguist)** | **YES** | Reviews FMM word tokenizer (`FORM-REQ-0001`), 25+ polyphones (`破音字`), Taiwan MOE standard pronunciations (`兩岸異讀字`), tone sandhi rules (`FORM-REQ-0002`), and *Contemporary Chinese* Vols. 1–6 curriculum (`FORM-REQ-0003`). |
| **`DEP-02` (Acoustic DSP & Wacom Stylus Engineer)** | **DEFERRED TO PHASE 3 (Advisory Schema Check Only)** | Wacom canvas and WebAudio $F_0$ DSP are constructed in Phase 3; Phase 1 `progressStore.ts` pre-allocates `strokeMastery` and `handedness` fields per `DEP-02`/`DEP-04` alignment. |
| **`DEP-03` (SLA & Survival Pedagogist)** | **YES** | Reviews FSRS-lite stability/difficulty interval math (`FORM-REQ-0004`), TOCFL Band Novice 1 – B2 progression (`FORM-REQ-0003`), and Resource Admin lesson generation (`FORM-REQ-0022`). |
| **`DEP-04` (UI/UX & Accessibility Designer — Standing Co-Lead)** | **YES (Mandatory Standing Co-Lead)** | Co-leads Phase 1 design and verification of `uiPrimitives.tsx`, `RubyText.tsx`, `studioContextBus.ts` (`FORM-REQ-0021`), and `ResourceAdminModal.tsx` (`FORM-REQ-0022`), plus First-Milestone `FORM-DESCHAR-001` Calibration (`Guide 008`). |
