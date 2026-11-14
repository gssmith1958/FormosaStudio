# Development Roadmap (`FORM-ROAD-001`)

```yaml
id: FORM-ROAD-001
type: DevelopmentRoadmap
title: FormosaStudio R2 Five-Phase Development Roadmap
status: Approved
version: 1.0.0
project: FORM
owner: Principal Engineer
created_date: 2026-11-13
updated_date: 2026-11-13
framework_reference: "Volume 4 §6.4, Guide 006 Pattern 14"
traces_to:
  - FORM-PLAN-001
```

---

## 1. Authoritative Phase-to-Requirement Composition Table (`Pattern 14`)

Per `ASEF Guide 006 Pattern 14`, this table is the authoritative write-source for every requirement's `phase:` field in `01-Engineering/FORM-REQ-001_Requirements_Register.md`, verified mechanically by `08-Automation/sync_traceability_graph.py`.

| Phase | Phase Title | Target Gate(s) | Allocated Requirements | Status |
| :--- | :--- | :--- | :--- | :--- |
| **Phase 0** | **Prototype Retrospective, `R2` Initiation & Baselines** | `Gate 1` (`FORM-BSL-001`), `Gate 2/3/4/5` (`FORM-BSL-002`) | *(Governance & Baseline Infrastructure)* | **In Progress** |
| **Phase 1** | **Taiwan MOE Linguistic Core, Polyphone (`破音字`) Tokenizer, Full Vols. 1–6 Curriculum & Modular Refactoring** | Touchpoint A/B (`FORM-AISR-001`) | `FORM-REQ-0001`, `FORM-REQ-0002`, `FORM-REQ-0003`, `FORM-REQ-0004`, `FORM-REQ-0005` | **Planned** |
| **Phase 2** | **Adaptive `i + 1` Reader, Register Bridge & "Taiwan in 10 Minutes a Day" Survival Track** | Touchpoint A/B (`FORM-AISR-002`) | `FORM-REQ-0006`, `FORM-REQ-0007`, `FORM-REQ-0008`, `FORM-REQ-0009`, `FORM-REQ-0010`, `FORM-REQ-0011` | **Planned** |
| **Phase 3** | **Wacom Stylus (`PointerEvent`) MOE Stroke Studio & Offline WebAudio $F_0$ Pitch Coach** | Touchpoint A/B + Pattern 20 Aggregate Re-Review (`FORM-AISR-003`) | `FORM-REQ-0012`, `FORM-REQ-0013`, `FORM-REQ-0014`, `FORM-REQ-0015`, `FORM-REQ-0016`, `FORM-REQ-0017` | **Planned** |
| **Phase 4** | **System Usability, Structural Ceiling Verification, Golden Validation & `v1.0.0` Release** | `Gate 6/7` (`FORM-BSL-003`), `Gate 8/9` (`FORM-BSL-004`) | `FORM-REQ-0018`, `FORM-REQ-0019`, `FORM-REQ-0020` | **Planned** |
