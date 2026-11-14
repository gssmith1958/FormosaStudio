#!/usr/bin/env python3
"""
Pattern 15 Non-Mutating Session-Start Mechanical Orientation for FormosaStudio (FORM).
Queries live gate statuses from FORM-BSL-001, live object/edge counts from formosa_traceability.db,
and runs structural & traceability health checks.
"""
from __future__ import annotations

import pathlib
import sqlite3
import sys

REPO_ROOT = pathlib.Path(__file__).resolve().parents[1]
sys.path.insert(0, str(REPO_ROOT / "08-Automation"))

import check_structural_scaffolding  # noqa: E402
import sync_traceability_graph  # noqa: E402


def main() -> int:
    print("=" * 76)
    print("FORMOSASTUDIO (FORM) — ASEF R2 SESSION-START ORIENTATION (NON-MUTATING)")
    print("=" * 76)

    objects, edges, trace_errors = sync_traceability_graph.collect_objects(REPO_ROOT)
    struct_errors, struct_warnings = check_structural_scaffolding.run_check(REPO_ROOT)

    print("\n1. R2 FOLDED ENGINEERING GATE STATUS (Live from FORM-BSL-001):")
    baselines = [
        obj for obj in objects.values() if obj.get("type") == "Baseline"
    ]
    for bsl in sorted(baselines, key=lambda x: x["id"]):
        print(f"   - {bsl['id']} ({bsl.get('title', '')}): [{bsl.get('status', 'Unknown')}]")

    print(f"\n2. ENGINEERING OBJECT GRAPH ({len(objects)} Objects, {len(edges)} Verified Relationships):")
    by_type: dict[str, int] = {}
    for obj in objects.values():
        t = obj.get("type", "Unknown")
        by_type[t] = by_type.get(t, 0) + 1
    for t, count in sorted(by_type.items()):
        print(f"   - {t:<28}: {count}")

    db_path = REPO_ROOT / "06-Repositories" / "formosa_traceability.db"
    if db_path.is_file():
        conn = sqlite3.connect(db_path)
        db_objs = conn.execute("SELECT COUNT(*) FROM objects").fetchone()[0]
        conn.close()
        print(f"\n3. TRACEABILITY REPOSITORY: 06-Repositories/formosa_traceability.db ({db_objs} synced rows)")

    total_errors = len(trace_errors) + len(struct_errors)
    print(f"\n4. MECHANICAL HEALTH CHECK: {total_errors} Error(s), {len(struct_warnings)} Warning(s)")
    if total_errors == 0:
        print("   [OK] All Pattern 12/14/15/18 structural and traceability invariants clean.")
    else:
        for e in struct_errors + trace_errors:
            print(f"   [FAIL] {e}")
    print("=" * 76)
    return 0 if total_errors == 0 else 1


if __name__ == "__main__":
    sys.exit(main())
