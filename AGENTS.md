# FormosaStudio (`FORM`) — AI Agent Operational Instructions (`Pattern 15`)

## 1. Canonical Framework Reference (`FIR-002`)
- **ASEF Repository Path:** `/home/gssmith/Programming/AI Engineering Framework/` (`Volume 0 v0.9.36`, `Standard 001 v0.9.15`, `Guide 002 v0.9.6`, `Guide 006 v0.9.21`, `Guide 007 v0.9.11`, `Guide 008 v0.9.1`, `PEW v0.9.5`)
- **Rule:** Never copy ASEF Volumes or Guides into this workspace. Reference them by canonical path and version.
- **Project Tailoring Level:** **Pure `R2` (Personal Tool — `n = 3` ASEF Empirical Validation)** graduated from the un-governed `Chinese2` (`R1` / pre-ASEF) exploratory prototype (`FORM-TAILOR-001`).

## 2. Session-Start Mechanical Orientation (`Pattern 15 Principle 5`)
At the beginning of every session, run:
```bash
python3 08-Automation/session_start.py
```
Never hardcode volatile object counts or gate statuses into this file (`Pattern 15 Principle 1`). All live counts and gate states are queried dynamically from `04-Implementation/FORM-BSL-001_Baseline_Register.md` and `06-Repositories/formosa_traceability.db`.

## 3. Standing Engineering Rules (`Patterns 12–21`)
1. **No Silent Scope Drops:** Every requirement in `01-Engineering/FORM-REQ-001_Requirements_Register.md` must be implemented and verified, or explicitly deferred via a Decision Record.
2. **Mechanical Structural Budgets (`Guide 002 §2` & `Pattern 12`):**
   - Soft warning ceiling: **`600` LOC** per application source file (`07-Configuration/Source/src/**/*.{ts,tsx}`).
   - Hard blocking ceiling: **`800` LOC** per application source file (enforced mechanically by `08-Automation/check_structural_scaffolding.py`).
   - Top-level navigation tabs ceiling: **`<= 8` top-level workspace tabs**.
3. **Domain Expert Panel Touchpoints A & B (`Pattern 13`, `Pattern 17`, `Pattern 20`, `Pattern 21`):**
   - Evaluate all 4 rows of the Trigger Table in `00-Governance/FORM-TAILOR-001_Tailoring_Decision.md` (`DEP-01` Taiwanese Mandarin & TOCFL Computational Linguist, `DEP-02` Acoustic DSP & Wacom Stylus Hardware Engineer, `DEP-03` SLA & "Taiwan in 10 Minutes a Day" Survival Pedagogist, `DEP-04` UI/UX & Accessibility Designer).
   - **End-to-End UI/UX Co-Leadership Mandate (`FORM-LL-007` & `FORM-DEP-UX-001`):** To prevent the "piece-part and glued-together" UX observed in `Chinese2`, **`DEP-04` (UI/UX & Accessibility Designer) is a Mandatory Standing Co-Lead at both Touchpoint A and Touchpoint B of EVERY phase (`Phase 1`, `Phase 2`, `Phase 3`, and `Phase 4`)**, enforced mechanically by `08-Automation/check_structural_scaffolding.py`. Phase 1 must deliver `src/components/uiPrimitives.tsx` and `src/lib/studioContextBus.ts` (`FORM-REQ-0021`) before any Phase 2–3 feature studios are built.
   - **Pre-Decision Specialist Review & Explicit Dissent Mandate (`FORM-LL-010`):** Never present a substantive technical, architectural, pedagogical, hardware/DSP, or UI/UX recommendation to the decision maker (PE/User) without **first** convening the relevant triggered Domain Expert Panel roles (`DEP-01`..`DEP-04` + Software Architect as applicable). Every decision-bearing proposal MUST include a structured **Specialist Team View** summarizing each role's verdict (`Approve` / `Approve with Conditions` / `Object`), key risks/conditions, and **any dissenting opinions preserved explicitly** (never smoothed away into a single-voice summary).
   - At every Touchpoint B review, execute the **Pattern 21 Shared-Concept Consumer Propagation Check** across all consumers of any modified shared type, dictionary, or store interface.
4. **Derived-Field & Target-Type Integrity (`Pattern 14` & `Pattern 18`):**
   - Run `python3 08-Automation/sync_traceability_graph.py --check` before every commit.
5. **Adversarial Verification of Governance Checks (`Pattern 16`):**
   - Run `python3 08-Automation/test_governance_adversarial.py` whenever modifying any script in `08-Automation/`.
