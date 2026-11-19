# Verification & Validation Plan (`FORM-VER-001`)

```yaml
id: FORM-VER-001
type: VerificationPlan
title: FormosaStudio R2 Verification & Golden Scenario Validation Plan
status: Approved
version: 1.0.0
project: FORM
owner: Principal Engineer
created_date: 2026-11-13
updated_date: 2026-11-13
framework_reference: "Volume 4 §12, Volume 4 §13, Guide 007 §9, Guide 007 §10, Guide 008 Part 1"
traces_to:
  - FORM-PLAN-001
  - FORM-REQ-0019
```

---

## 1. Verification Strategy (`Volume 4 §12`)

1. **Automated Unit & Cross-Module Workflow Tests:** Executed via Node.js `v22.22.1` + TypeScript against `07-Configuration/Source/src/tests/`, verifying 100% of requirements (`FORM-REQ-0001`..`0023`).
2. **Continuous End-to-End UI/UX Verification (`DEP-04` Standing Co-Leadership — `FORM-DEP-UX-001`):**
   * **Phase 1 Gate:** Verify `src/components/uiPrimitives.tsx` (`WCAG_TONE_PALETTE` `>= 4.5:1`, `<StylusButton>` `>= 44×44 px`, `<StudioHeaderBanner>`, `<StudioModeSwitcher>`, `<ReturnBreadcrumbBar>`, `<CrossStudioActionPills>`) and `src/lib/studioContextBus.ts`, plus First-Milestone `FORM-DESCHAR-001` Calibration (`Guide 008`).
   * **Phase 2 Gate:** Verify `Reader & Grammar` and `10-Min Taiwan` consume `uiPrimitives.tsx` and `studioContextBus.ts` with zero nested sub-tab clutter.
   * **Phase 3 Gate:** Execute `Pattern 20` Aggregate UI/UX Re-Review across all 6 studios (`Reader <-> Wacom <-> Pitch <-> Dojo`).
   * **Phase 4 Gate:** Verify `<= 6` fixed top-level studios, Inline 10-Minute Daily Flow Runner, and 1-click Return Breadcrumb flows across `FORM-VAL-001`..`005`.
3. **Production TypeScript & Bundle Verification:** `npm run build` (`tsc -b && vite build`) must exit `0` with zero type or bundler errors.
4. **Mechanical Governance Verification (`Pattern 12`, `14`, `16`, `18`):**
   * `python3 08-Automation/check_structural_scaffolding.py` (`0` files > `800` LOC, `uiPrimitives.tsx` presence, and mandatory `DEP-04` Touchpoint A/B sign-off in every `FORM-AISR-*.md`).
   * `python3 08-Automation/sync_traceability_graph.py --check` (`100%` requirement traceability & `Pattern 14` phase alignment).
   * `python3 08-Automation/test_governance_adversarial.py` (`6/6` adversarial fixtures passing).

---

## 2. Planned Golden Validation Scenarios (`Volume 4 §13` — `Gate 6/7`)

* **`FORM-VAL-001`:** Context-Aware Taiwan MOE & Polyphone (`破音字`) Annotation across Ambiguous Sentences (`長大 vs 很長`, `還錢 vs 還有`, `銀行 vs 不行`, `我和家人吃牛肉麵`, `垃圾車來了`).
* **`FORM-VAL-002`:** Adaptive `i + 1` Custom Text Ingestion, Comprehensibility Calculation, Spoken/Written (`口語/書面語`) Register Conversion, Cloze Generation, and **Curriculum & Resource Admin Ingestion (`FORM-REQ-0022`) of additional Pimsleur / NTNU *Contemporary Chinese* materials with live propagation across all 6 studios**.
* **`FORM-VAL-003`:** "Taiwan in 10 Minutes a Day" End-to-End Survival Flow — Sticky Labels, Interactive Taiwanese Paper Tick-Menu (`點菜單`) Order Totaling, `打折` Discount Math, `民國` Date Conversion, and Functional Listening Gym.
* **`FORM-VAL-004`:** Wacom Stylus (`PointerEvent`) Pressure Calligraphy, Eraser Nib Undo, Taiwan MOE Stroke-Order Vector Grading (Correct vs. Reversed/Out-of-Order Strokes), and `形聲字` Radical-Phonetic Series.
* **`FORM-VAL-005`:** Offline WebAudio $F_0$ Pitch-Contour Extraction & Chao Tone 1–5 / Sandhi Curve Correlation on Synthetic Vocal Waveforms + Cross-Module FSRS Progress Persistence.
