#!/usr/bin/env python3
"""
Pattern 16 Adversarial Verification Suite for FormosaStudio's Governance Checks.
Verifies that check_structural_scaffolding.py and sync_traceability_graph.py:
  1. Pass on the clean live workspace.
  2. Deterministically FAIL when injected with:
     - Fixture A: An 805-line TypeScript file exceeding the 800-LOC ceiling (Pattern 12).
     - Fixture B: A Requirement whose `phase:` field drifts from FORM-ROAD-001 (Pattern 14).
     - Fixture C: A Risk `mitigated_by:` pointing to a Persona instead of a Requirement/Decision (Pattern 18).
"""
from __future__ import annotations

import pathlib
import shutil
import tempfile
import unittest

REPO_ROOT = pathlib.Path(__file__).resolve().parents[1]
import sys

sys.path.insert(0, str(REPO_ROOT / "08-Automation"))
import check_structural_scaffolding  # noqa: E402
import sync_traceability_graph  # noqa: E402


class TestGovernanceAdversarial(unittest.TestCase):
    def test_1_live_workspace_passes_cleanly(self) -> None:
        s_err, _ = check_structural_scaffolding.run_check(REPO_ROOT)
        self.assertEqual(s_err, [])
        _, _, t_err = sync_traceability_graph.collect_objects(REPO_ROOT)
        self.assertEqual(t_err, [])

    def test_2_loc_budget_violation_detected(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            tmp_root = pathlib.Path(tmp)
            for d in check_structural_scaffolding.CANONICAL_PEW_DIRS:
                (tmp_root / d).mkdir(parents=True, exist_ok=True)
            for rel in check_structural_scaffolding.REQUIRED_FILES:
                dest = tmp_root / rel
                dest.parent.mkdir(parents=True, exist_ok=True)
                shutil.copy2(REPO_ROOT / rel, dest)

            bloated = tmp_root / "07-Configuration" / "Source" / "src" / "BloatedMonolith.tsx"
            bloated.parent.mkdir(parents=True, exist_ok=True)
            bloated.write_text("// line\n" * 805, encoding="utf-8")

            errors, _ = check_structural_scaffolding.run_check(tmp_root)
            self.assertTrue(
                any("Hard LOC ceiling exceeded" in e for e in errors),
                f"Expected LOC budget failure, got: {errors}",
            )

    def test_3_pattern14_phase_drift_detected(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            tmp_root = pathlib.Path(tmp)
            for d in sync_traceability_graph.SCAN_DIRS:
                shutil.copytree(REPO_ROOT / d, tmp_root / d)
            req_file = tmp_root / "01-Engineering" / "FORM-REQ-001_Requirements_Register.md"
            text = req_file.read_text(encoding="utf-8").replace("phase: Phase 1", "phase: Phase 4", 1)
            req_file.write_text(text, encoding="utf-8")

            _, _, errors = sync_traceability_graph.collect_objects(tmp_root)
            self.assertTrue(
                any("Pattern 14 drift" in e for e in errors),
                f"Expected Pattern 14 drift error, got: {errors}",
            )

    def test_4_pattern18_target_type_mismatch_detected(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            tmp_root = pathlib.Path(tmp)
            for d in sync_traceability_graph.SCAN_DIRS:
                shutil.copytree(REPO_ROOT / d, tmp_root / d)
            risk_file = tmp_root / "01-Engineering" / "FORM-RISK-001_Risk_and_Assumption_Register.md"
            text = risk_file.read_text(encoding="utf-8").replace("  - FORM-REQ-0005", "  - FORM-PER-001", 1)
            risk_file.write_text(text, encoding="utf-8")

            _, _, errors = sync_traceability_graph.collect_objects(tmp_root)
            self.assertTrue(
                any("Pattern 18 target-type mismatch" in e for e in errors),
                f"Expected Pattern 18 target-type mismatch, got: {errors}",
            )


if __name__ == "__main__":
    unittest.main(verbosity=2)
