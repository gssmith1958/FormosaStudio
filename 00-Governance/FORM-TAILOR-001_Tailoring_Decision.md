# Tailoring Decision (`FORM-TAILOR-001`)

```yaml
id: FORM-TAILOR-001
type: TailoringDecision
title: FormosaStudio Pure-R2 Tailoring Decision (n=3 Prototype-to-R2 Graduation)
status: Approved
version: 1.0.0
project: FORM
owner: Principal Engineer
created_date: 2026-11-13
updated_date: 2026-11-13
framework_reference: "ASEF Guide 002 v0.9.6, Volume 4 §4.3, Volume 6 §14.3, Guide 007 v0.9.11, Guide 008 v0.9.1, PEW v0.9.5"
traces_to:
  - FORM-PROJ-001
```

---

## 1. Project Summary

* **Project Name:** **FormosaStudio (`FORM`)** — Complete Taiwan-Based Traditional Chinese (`zh-TW` / 正體中文 / 臺灣國語) Language Training System
* **Lineage (`R1 → R2` Graduation per `Guide 002 §Best Practices`):** Graduated from `/home/gssmith/Programming/Chinese2` (`17,228` LOC un-governed prototype treated as an `R1` exploratory baseline and harvested for Phase 0 Lessons Learned `FORM-LL-001`..`005`).
* **Expected Lifespan:** Multi-year personal daily training workstation (Desktop Linux + Wacom Pen Tablet + WebAudio Microphone).
* **Team Size:** Solo Principal Engineer + Google Antigravity AI Agent + 4-Role Domain Expert Panel.
* **Criticality:** Personal learning & productivity tool (`R2`). No regulated financial or safety-critical liability, but high domain-accuracy requirements for Taiwan Ministry of Education (`教育部`) Zhuyin/stroke standards, polyphone (`破音字`) segmentation, Wacom stylus hardware responsiveness, and acoustic pitch-contour ($F_0$) math.

---

## 2. Chosen Rigor Level (`Guide 002 §2`)

* **Selected Rigor Level:** **Pure `R2` (Personal Tool)** (`Guide 002 v0.9.6` row `R2`).
* **Why Pure `R2` (`n = 3` ASEF Empirical Validation Goal):**
  1. `FDSS` (`n = 1`) validated uniform `R3` rigor; `VeilCrypt` (`n = 2`) validated `R3 Core / R2.5 UI` component-scoped sub-rigor.
  2. `FormosaStudio` (`n = 3`) validates **Pure `R2`**—testing whether ASEF's lightweight tier (`Git + Markdown + Zero-Daemon Embedded Traceability`, 4 folded milestone gates, and phase-consolidated planning/review artifacts) can govern a rich **TypeScript + React + WebAudio DSP + Wacom PointerEvent** application with minimal ceremony while eliminating all 5 prototype failure modes observed in `Chinese2`.
* **Structural & Modularity Budgets (`Guide 002 §2` & `Guide 006 Pattern 12`):**
  * **Per-File Soft Warning Ceiling:** **`600` LOC** for any `.ts` / `.tsx` source file under `07-Configuration/Source/src/`.
  * **Per-File Hard Mechanical Block:** **`800` LOC** enforced by `08-Automation/check_structural_scaffolding.py` (directly remediating `Chinese2`'s 8 files that grew between `1,003` and `1,689` LOC).
  * **Top-Level Navigation Budget:** **`<= 8` top-level workspace tabs** in the application shell (`Guide 008`).

---

## 3. Included, Consolidated, and Excluded Artifacts (`Guide 002 §3` & `PEW v0.9.5`)

### 3.1 Canonical PEW Root Directory Mapping (`PEW v0.9.5`)
`FormosaStudio` instantiates the canonical 11 root-level numbered folders (`00-Governance/` through `10-Archive/`), verified mechanically by `08-Automation/check_structural_scaffolding.py`:
* `00-Governance/` — Tailoring (`FORM-TAILOR-001`), Consolidated Engineering/CM/AI Plan (`FORM-PLAN-001`), Roadmap (`FORM-ROAD-001`), and Phase BOEs (`FORM-BOE-001`..`004`).
* `01-Engineering/` — Consolidated Context/Stakeholders/Personas/ConOps/Capabilities/Workflows (`FORM-CTX-001`), Risk & Assumption Register (`FORM-RISK-001`), and Requirements Register (`FORM-REQ-001`).
* `02-Architecture/` — Design Character Document (`FORM-DESCHAR-001`) and Architecture, Live Environment Audit & Decisions (`FORM-ARCH-001`).
* `03-Verification/` — Verification & Validation Plan (`FORM-VER-001`), Domain Expert Touchpoint A/B Reports (`FORM-DEP-TPA/TPB-*`), and V&V Report (`FORM-VVR-001`).
* `04-Implementation/` — Baseline Register (`FORM-BSL-001`) and Phase Implementation Session Records (`FORM-AISR-001`..`004`).
* `05-Knowledge/` — Prototype & Execution Lessons Learned + FIR Register (`FORM-LL-001`) and `n = 3` (`R2`) Empirical Scorecard (`FORM-EVAL-001`).
* `06-Repositories/` — Zero-daemon embedded SQLite traceability database (`formosa_traceability.db`) and JSON graph (`formosa_graph.json`) generated deterministically from Markdown YAML blocks.
* `07-Configuration/Source/` — Modular TypeScript/React/Vite application source and automated tests.
* `08-Automation/` — Pure Python 3 standard-library governance checks (`session_start.py`, `check_structural_scaffolding.py`, `sync_traceability_graph.py`, `test_governance_adversarial.py`).
* `09-Releases/` — `v1.0.0` Release Manifest (`FORM-REL-001`).
* `10-Archive/` — Historical/superseded records.

### 3.2 Excluded / Streamlined at `R2`
* **Excluded:** External database daemons (MariaDB, Neo4j server), per-WBS micro-BOEs (replaced by phase-level BOEs at `R2`), and multi-tenant RBAC/cloud deployment artifacts.

---

## 4. Repository Strategy (`Guide 002 §4` & `Guide 004 v0.9.2`)

* **Primary Source of Truth:** Git-tracked Markdown files containing fenced `yaml` engineering object blocks.
* **Automated Synchronization:** `python3 08-Automation/sync_traceability_graph.py` parses all Markdown YAML blocks, enforces `Pattern 14` (Roadmap-to-Requirement `phase:` alignment) and `Pattern 18` (cross-object reference target-type validation), and writes `06-Repositories/formosa_traceability.db` + `06-Repositories/formosa_graph.json`.

---

## 5. AI Collaboration Rules & Domain Expert Panel Charter (`Guide 002 §5` & `Volume 6 §14.3`)

| Role ID | Domain Expert Role | Coverage Area | Trigger Condition (`Pattern 17` Row-Level Evaluation) |
| :--- | :--- | :--- | :--- |
| **`DEP-01`** | **Taiwanese Mandarin (`zh-TW`) & TOCFL Computational Linguist** | Word segmentation (`FMM`), polyphones (`破音字`), Taiwan MOE standard pronunciations (`兩岸異讀字`, `和=ㄏㄢˋ`, `垃圾=ㄌㄜˋ ㄙㄜˋ`), tone sandhi, `語助詞`, Hokkien (`臺語`) loanwords, `口語/書面語` register, and *Contemporary Chinese* Vols. 1–6 / *Pimsleur* alignment | Any phase touching NLP tokenization, Zhuyin annotation, dictionaries, graded stories, or curriculum data |
| **`DEP-02`** | **Acoustic Speech DSP & Wacom Stylus Hardware Engineer** | WebAudio microphone pitch-contour ($F_0$) autocorrelation/YIN tracking, Chao 5-level tone scoring, W3C `PointerEvent` Wacom pen pressure (`e.pressure`), coalesced sampling (`getCoalescedEvents()`), eraser/barrel buttons, and Taiwan MOE vector stroke-order grading | Any phase touching `audioService`, `pitchTracker`, `wacomStrokeEngine`, or canvas/audio hardware APIs |
| **`DEP-03`** | **SLA & "Taiwan in 10 Minutes a Day" Survival Pedagogist** | Adaptive `i + 1` reading comprehensibility math, FSRS-lite spaced repetition intervals, and practical English-speaker survival modules (sticky labels, paper tick-menus `點菜單`, `打折` discount math, `民國` dates, `段/巷/弄/號` addresses, clinic/pharmacy survival) | Any phase touching SRS scheduling, `i + 1` grading, survival modules, or functional listening drills |
| **`DEP-04`** | **UI/UX & Accessibility Designer (`Guide 008`)** | Adherence to `FORM-DESCHAR-001`, Wacom pen ergonomics (left/right-handed stylus toolbar, `>= 44px` pen hit targets, zero hover-only traps), WCAG 2.1 AA contrast (`>= 4.5:1`), vertical Zhuyin ruby legibility, and navigation ceiling (`<= 8` tabs) | Any phase touching React UI components, workspace navigation, canvas overlays, or visual themes |

---

## 6. Review Gates (`Guide 002 §6` & `Volume 4 §4.3` — 9-Gate Disposition for `R2`)

For `R2` (Personal Tool), all nine canonical Engineering Gates from `Volume 4 §4.3` are explicitly dispositioned below by folding adjacent checkpoints into **4 lightweight Milestone Gates** (`FORM-BSL-001`..`004`):

| Canonical Gate (`Volume 4 §4.3`) | `R2` Disposition | Target Baseline ID | Rationale |
| :--- | :--- | :--- | :--- |
| **Gate 1: Project Approval** | **Adopted** | `FORM-BSL-001` | Verifies Project Initiation, `Chinese2` Prototype Retrospective (`FORM-LL-001`..`005`), Tailoring, and Design Character Document. |
| **Gate 2: Requirements Baseline** | **Folded into Gate 2/3/4/5** | `FORM-BSL-002` | At `R2`, Requirements (`FORM-REQ-001`), Architecture (`FORM-ARCH-001`), Live Environment Audit, and Implementation Readiness are baselined together in Phase 0.2 before Phase 1 coding begins. |
| **Gate 3: Architecture Baseline** | **Folded into Gate 2/3/4/5** | `FORM-BSL-002` | Consolidated with Requirements & Design in `FORM-ARCH-001`. |
| **Gate 4: Design Approval** | **Folded into Gate 2/3/4/5** | `FORM-BSL-002` | Covered by `FORM-ARCH-001`, `FORM-DESCHAR-001`, and Phase Touchpoint A reviews. |
| **Gate 5: Implementation Readiness** | **Folded into Gate 2/3/4/5** | `FORM-BSL-002` | Verified via `Guide 007 §2` live environment audit + mechanical governance scripts passing 100%. |
| **Gate 6: Verification Completion** | **Folded into Gate 6/7** | `FORM-BSL-003` | Verifies 100% requirement test coverage, `<= 800` LOC structural compliance across all source files, and Touchpoint B sign-off. |
| **Gate 7: Validation Acceptance** | **Folded into Gate 6/7** | `FORM-BSL-003` | Executes end-to-end Golden Scenarios (`FORM-VAL-001`..`005`) covering Wacom stylus writing, `i + 1` reading, $F_0$ pitch coaching, and "Taiwan in 10 Minutes a Day" survival workflows. |
| **Gate 8: Release Approval** | **Folded into Gate 8/9** | `FORM-BSL-004` | Approves `FORM-REL-001` (`v1.0.0` production build & user guide). |
| **Gate 9: Project Closure** | **Folded into Gate 8/9** | `FORM-BSL-004` | Completes `FORM-EVAL-001` (`n = 3` `R2` empirical scorecard) and promotes any new FIRs to the canonical ASEF repository. |

---

## 7. Approval

* **Approved By:** Principal Engineer (`2026-11-13`)
