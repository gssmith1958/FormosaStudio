#!/usr/bin/env python3
"""
Pattern 12 Mechanical Structural & LOC Budget Check for FormosaStudio (FORM).
Verifies:
  1. All 11 canonical PEW root directories exist (00-Governance/ .. 10-Archive/).
  2. Core R2 governance artifacts exist and are non-empty.
  3. No TypeScript/React source file under 07-Configuration/Source/src/ exceeds:
     - Soft warning ceiling: 600 LOC
     - Hard blocking ceiling: 800 LOC
"""
from __future__ import annotations

import argparse
import pathlib
import sys

REPO_ROOT = pathlib.Path(__file__).resolve().parents[1]

CANONICAL_PEW_DIRS = [
    "00-Governance",
    "01-Engineering",
    "02-Architecture",
    "03-Verification",
    "04-Implementation",
    "05-Knowledge",
    "06-Repositories",
    "07-Configuration",
    "08-Automation",
    "09-Releases",
    "10-Archive",
]

REQUIRED_FILES = [
    "README.md",
    "AGENTS.md",
    "00-Governance/FORM-TAILOR-001_Tailoring_Decision.md",
    "00-Governance/FORM-PLAN-001_Engineering_and_AI_Collaboration_Plan.md",
    "00-Governance/FORM-ROAD-001_Development_Roadmap.md",
    "01-Engineering/FORM-CTX-001_Project_Context_Stakeholders_Personas_ConOps.md",
    "01-Engineering/FORM-RISK-001_Risk_and_Assumption_Register.md",
    "01-Engineering/FORM-REQ-001_Requirements_Register.md",
    "02-Architecture/FORM-DESCHAR-001_Design_Character_Document.md",
    "02-Architecture/FORM-ARCH-001_Architecture_and_Decisions.md",
    "03-Verification/FORM-VER-001_Verification_and_Validation_Plan.md",
    "04-Implementation/FORM-BSL-001_Baseline_Register.md",
    "05-Knowledge/FORM-LL-001_Lessons_Learned_and_FIR_Register.md",
    "05-Knowledge/FORM-EVAL-001_ASEF_N3_R2_Empirical_Scorecard.md",
]

WARN_LOC = 600
MAX_LOC = 800


def run_check(root: pathlib.Path) -> tuple[list[str], list[str]]:
    errors: list[str] = []
    warnings: list[str] = []

    for d in CANONICAL_PEW_DIRS:
        p = root / d
        if not p.is_dir():
            errors.append(f"Missing canonical PEW directory: {d}")

    for rel in REQUIRED_FILES:
        p = root / rel
        if not p.is_file() or p.stat().st_size == 0:
            errors.append(f"Missing or empty required governance artifact: {rel}")

    src_root = root / "07-Configuration" / "Source" / "src"
    if src_root.is_dir():
        for ext in ("*.ts", "*.tsx", "*.py"):
            for fpath in sorted(src_root.rglob(ext)):
                if "node_modules" in fpath.parts or "dist" in fpath.parts:
                    continue
                lines = fpath.read_text(encoding="utf-8", errors="replace").splitlines()
                loc = len(lines)
                rel_path = fpath.relative_to(root)
                if loc > MAX_LOC:
                    errors.append(
                        f"Hard LOC ceiling exceeded ({loc} > {MAX_LOC} LOC): {rel_path}"
                    )
                elif loc > WARN_LOC:
                    warnings.append(
                        f"Soft LOC warning ceiling exceeded ({loc} > {WARN_LOC} LOC): {rel_path}"
                    )

    return errors, warnings


def main() -> int:
    parser = argparse.ArgumentParser(description="FormosaStudio structural & LOC budget checker")
    parser.add_argument("--root", type=pathlib.Path, default=REPO_ROOT)
    args = parser.parse_args()

    errors, warnings = run_check(args.root.resolve())
    for w in warnings:
        print(f"[WARN] {w}")
    for e in errors:
        print(f"[ERROR] {e}")

    if errors:
        print(f"RESULT: FAIL ({len(errors)} error(s), {len(warnings)} warning(s))")
        return 1

    print(f"RESULT: PASS (0 errors, {len(warnings)} warning(s); hard ceiling <= {MAX_LOC} LOC)")
    return 0


if __name__ == "__main__":
    sys.exit(main())
