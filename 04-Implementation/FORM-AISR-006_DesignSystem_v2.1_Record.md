---
id: FORM-AISR-006
type: ImplementationRecord
title: FormosaStudio — v2.1.0 Crisp Neutral Studio UI/UX Design System Overhaul Implementation Record
status: Approved
version: 2.1.0
created: 2026-11-25
owner: GSS
parent_ids:
  - FORM-DEC-005
  - FORM-REQ-0018
  - FORM-REQ-0021
  - FORM-DESCHAR-001
  - FORM-DEP-UX-001
---

# FormosaStudio (`FORM`) — `v2.1.0` Crisp Neutral Studio UI/UX Overhaul (`FORM-AISR-006`)

## 1. Pre-Decision Specialist Panel Governance (`FORM-LL-010` / `FORM FIR-004`)

- **Touchpoint A Independent Specialist Panel (`DEP-04` UI/UX Co-Lead, `DEP-01` Mandarin Typographer, `DEP-02` Wacom & iPad mini 6 Ergonomics, Software Architect):** Pre-reviewed the proposed design system overhaul **prior to Principal Engineer decision**, delivering 4/4 `Approve with Conditions` plus 1 hardware dissent (`DEP-02` on 38px Wacom sidebar rows) and 12 concrete conditions (`UX-C1..4`, `LING-C1..3`, `HW-C1..3`, `ARCH-C1..3`).
- **Touchpoint B Post-Implementation Audit (`DEP-04` UI/UX Co-Lead + Pattern 21 Propagation + `Guide 008 v0.9.4` Live Visual Audit):**
  - Migrated all **244** legacy dark-slate Tailwind classes across all **8** files (`ShellDrawersAndModals.tsx`, `ReadingGrammarStudio.tsx`, `TickMenuAndPragmatics.tsx`, `WacomCalligraphyStudio.tsx`, `VocabSrsDojoStudio.tsx`, `TaiwanSurvivalStudio.tsx`, `ResourceAdminModal.tsx`, `uiPrimitives.tsx`) onto semantic `--fs-*` / `.fs-*` design tokens and deleted the brittle `[data-theme='light'] .bg-slate-*` override block (`index.css`).
  - Propagated `ThemeMode = 'system' | 'light' | 'dark'` + `resolveEffectiveTheme()` across all 5 Pattern 21 consumers (`progressStore.ts`, `App.tsx`, `AccordionNavSidebar.tsx`, `WacomCalligraphyStudio.tsx`, `AdministrationStudio.tsx`).
  - Verified programmatic WCAG 2.1 AA (`>= 4.5:1`) contrast in BOTH Light and Dark modes via `Phase 4 Suite 9`, `check_structural_scaffolding.py` (`0` errors, `0` warnings `<= 600` LOC), and live Desktop + iPad mini 6 rendered screenshots.
