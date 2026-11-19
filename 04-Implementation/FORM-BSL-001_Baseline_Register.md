# Baseline Register (`FORM-BSL-001`)

```yaml
id: FORM-BSL-REG-001
type: BaselineRegister
title: FormosaStudio R2 Engineering Baseline Register
status: Active
version: 1.0.0
project: FORM
owner: Principal Engineer
created_date: 2026-11-13
updated_date: 2026-11-19
framework_reference: "Volume 8 §5, Guide 001 §40, Guide 002 §6"
traces_to:
  - FORM-TAILOR-001
```

---

## 1. Folded `R2` Engineering Gate Baselines (`FORM-TAILOR-001 §6`)

```yaml
id: FORM-BSL-001
type: Baseline
title: "Gate 1: Project Approval & Chinese2 Prototype Retrospective Baseline"
status: Approved
version: 1.0.0
gate_date: 2026-11-13
traces_to:
  - FORM-TAILOR-001
  - FORM-PLAN-001
  - FORM-PROJ-001
  - FORM-CONOPS-001
  - FORM-DESCHAR-001
```

```yaml
id: FORM-BSL-002
type: Baseline
title: "Gate 2/3/4/5: Requirements, Architecture, Environment Audit & Implementation Readiness Baseline"
status: Approved
version: 1.0.0
gate_date: 2026-11-13
traces_to:
  - FORM-ROAD-001
  - FORM-RISK-001
  - FORM-ARCH-001
  - FORM-VER-001
```

```yaml
id: FORM-BSL-003
type: Baseline
title: "Gate 6/7: Verification Completion & Golden Scenario Validation Acceptance"
status: Approved
version: 1.0.0
gate_date: 2026-11-19
traces_to:
  - FORM-VER-001
```

```yaml
id: FORM-BSL-004
type: Baseline
title: "Gate 8/9: v1.0.0 Release Approval & R2 (n=3) Project Closure"
status: Approved
version: 1.0.0
gate_date: 2026-11-19
traces_to:
  - FORM-TAILOR-001
```
