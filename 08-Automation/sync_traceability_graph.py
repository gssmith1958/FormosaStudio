#!/usr/bin/env python3
"""
Patterns 14 & 18 Traceability Graph Synchronizer & Validator for FormosaStudio (FORM).
- Parses fenced ```yaml engineering objects across 00-Governance/ .. 09-Releases/.
- Enforces Pattern 14: Roadmap composition table in FORM-ROAD-001 matches every Requirement's `phase:` field.
- Enforces Pattern 18: Cross-object reference fields (`traces_to`, `mitigated_by`, `verified_by`, `originating_lesson`)
  point to existing object IDs of the valid target type.
- Writes deterministic SQLite graph (`06-Repositories/formosa_traceability.db`) and JSON (`06-Repositories/formosa_graph.json`).
"""
from __future__ import annotations

import argparse
import json
import pathlib
import re
import sqlite3
import sys

REPO_ROOT = pathlib.Path(__file__).resolve().parents[1]

SCAN_DIRS = [
    "00-Governance",
    "01-Engineering",
    "02-Architecture",
    "03-Verification",
    "04-Implementation",
    "05-Knowledge",
    "09-Releases",
]

YAML_BLOCK_RE = re.compile(r"```yaml\s*\n(.*?)\n```", re.DOTALL)
REQ_ID_RE = re.compile(r"\b(FORM-REQ-\d{4})\b")

ALLOWED_TARGET_TYPES: dict[str, set[str]] = {
    "traces_to": {
        "Project",
        "Stakeholder",
        "Persona",
        "OperationalConcept",
        "Capability",
        "Workflow",
        "TailoringDecision",
        "EngineeringPlan",
        "DevelopmentRoadmap",
        "Risk",
        "Requirement",
        "ArchitectureDescription",
        "ArchitectureDecision",
        "DesignCharacterDocument",
        "VerificationPlan",
        "LessonLearned",
        "KnowledgeRegister",
    },
    "mitigated_by": {"Requirement", "ArchitectureDecision"},
    "verified_by": {"VerificationTest", "ValidationOutput"},
    "originating_lesson": {"LessonLearned"},
}


def parse_simple_yaml(block: str) -> dict:
    data: dict = {}
    current_list_key: str | None = None
    for raw_line in block.splitlines():
        line = raw_line.rstrip()
        if not line or line.lstrip().startswith("#"):
            continue
        if line.startswith("  - ") or line.startswith("- "):
            if current_list_key is not None:
                val = line.split("- ", 1)[1].strip().strip('"').strip("'")
                data.setdefault(current_list_key, []).append(val)
            continue
        if ":" in line and not line.startswith(" "):
            key, val = line.split(":", 1)
            key = key.strip()
            val = val.strip()
            if not val:
                current_list_key = key
                data[key] = []
            else:
                current_list_key = None
                data[key] = val.strip('"').strip("'")
    return data


def extract_roadmap_phases(roadmap_path: pathlib.Path) -> tuple[dict[str, str], list[str]]:
    req_to_phase: dict[str, str] = {}
    errors: list[str] = []
    if not roadmap_path.is_file():
        return req_to_phase, [f"Missing Roadmap file: {roadmap_path}"]

    for line in roadmap_path.read_text(encoding="utf-8").splitlines():
        if not line.strip().startswith("|") or "Phase" not in line:
            continue
        cells = [c.strip() for c in line.strip().strip("|").split("|")]
        if len(cells) < 4:
            continue
        phase_match = re.search(r"(Phase\s+\d+(?:\.\d+)?)", cells[0])
        if not phase_match:
            continue
        phase_name = phase_match.group(1)
        for req_id in REQ_ID_RE.findall(cells[3]):
            if req_id in req_to_phase and req_to_phase[req_id] != phase_name:
                errors.append(
                    f"Pattern 14 duplicate Roadmap allocation: {req_id} listed in both "
                    f"{req_to_phase[req_id]} and {phase_name}"
                )
            req_to_phase[req_id] = phase_name
    return req_to_phase, errors


def collect_objects(root: pathlib.Path) -> tuple[dict[str, dict], list[tuple[str, str, str]], list[str]]:
    objects: dict[str, dict] = {}
    edges: list[tuple[str, str, str]] = []
    errors: list[str] = []

    for d in SCAN_DIRS:
        dir_path = root / d
        if not dir_path.is_dir():
            continue
        for md_file in sorted(dir_path.rglob("*.md")):
            text = md_file.read_text(encoding="utf-8")
            for match in YAML_BLOCK_RE.finditer(text):
                parsed = parse_simple_yaml(match.group(1))
                obj_id = parsed.get("id")
                obj_type = parsed.get("type")
                if not obj_id or not obj_type:
                    continue
                if obj_id in objects:
                    errors.append(f"Duplicate Engineering Object ID: {obj_id} in {md_file.relative_to(root)}")
                    continue
                parsed["_file"] = str(md_file.relative_to(root))
                objects[obj_id] = parsed

    roadmap_path = root / "00-Governance" / "FORM-ROAD-001_Development_Roadmap.md"
    roadmap_map, rm_errors = extract_roadmap_phases(roadmap_path)
    errors.extend(rm_errors)

    # Pattern 14 check: every Requirement's `phase:` matches FORM-ROAD-001
    for obj_id, obj in objects.items():
        if obj.get("type") == "Requirement":
            req_phase = obj.get("phase", "")
            rm_phase = roadmap_map.get(obj_id)
            if not rm_phase:
                errors.append(f"Pattern 14 error: Requirement {obj_id} is not allocated in FORM-ROAD-001")
            elif req_phase != rm_phase:
                errors.append(
                    f"Pattern 14 drift on {obj_id}: Requirement phase='{req_phase}' != Roadmap '{rm_phase}'"
                )

    # Pattern 18 check: reference existence and target-type validation
    for obj_id, obj in objects.items():
        for rel_key, allowed_types in ALLOWED_TARGET_TYPES.items():
            targets = obj.get(rel_key)
            if not targets:
                continue
            if isinstance(targets, str):
                targets = [targets]
            for target_id in targets:
                if target_id not in objects:
                    errors.append(
                        f"Pattern 18 broken reference: {obj_id}.{rel_key} -> '{target_id}' (target does not exist)"
                    )
                    continue
                target_type = objects[target_id].get("type", "")
                if target_type not in allowed_types:
                    errors.append(
                        f"Pattern 18 target-type mismatch: {obj_id}.{rel_key} -> {target_id} "
                        f"(type '{target_type}' not in {sorted(allowed_types)})"
                    )
                else:
                    edges.append((obj_id, rel_key, target_id))

    return objects, edges, errors


def write_repositories(root: pathlib.Path, objects: dict[str, dict], edges: list[tuple[str, str, str]]) -> None:
    repo_dir = root / "06-Repositories"
    repo_dir.mkdir(parents=True, exist_ok=True)
    db_path = repo_dir / "formosa_traceability.db"
    json_path = repo_dir / "formosa_graph.json"

    conn = sqlite3.connect(db_path)
    with conn:
        conn.execute("DROP TABLE IF EXISTS edges")
        conn.execute("DROP TABLE IF EXISTS objects")
        conn.execute(
            "CREATE TABLE objects (id TEXT PRIMARY KEY, type TEXT, title TEXT, status TEXT, version TEXT, file TEXT, raw_json TEXT)"
        )
        conn.execute(
            "CREATE TABLE edges (source_id TEXT, rel_type TEXT, target_id TEXT)"
        )
        for obj_id, obj in sorted(objects.items()):
            conn.execute(
                "INSERT INTO objects VALUES (?, ?, ?, ?, ?, ?, ?)",
                (
                    obj_id,
                    obj.get("type", ""),
                    obj.get("title", ""),
                    obj.get("status", ""),
                    obj.get("version", ""),
                    obj.get("_file", ""),
                    json.dumps(obj, ensure_ascii=False),
                ),
            )
        for src, rel, dst in edges:
            conn.execute("INSERT INTO edges VALUES (?, ?, ?)", (src, rel, dst))
    conn.close()

    json_payload = {
        "object_count": len(objects),
        "edge_count": len(edges),
        "objects": objects,
        "edges": [{"source": s, "relation": r, "target": t} for s, r, t in edges],
    }
    json_path.write_text(json.dumps(json_payload, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")


def main() -> int:
    parser = argparse.ArgumentParser(description="FormosaStudio traceability graph sync & check")
    parser.add_argument("--root", type=pathlib.Path, default=REPO_ROOT)
    parser.add_argument("--check", action="store_true", help="Verify and sync graph")
    args = parser.parse_args()

    root = args.root.resolve()
    objects, edges, errors = collect_objects(root)
    if errors:
        for err in errors:
            print(f"[ERROR] {err}")
        print(f"RESULT: FAIL ({len(errors)} traceability error(s))")
        return 1

    write_repositories(root, objects, edges)
    print(
        f"RESULT: PASS ({len(objects)} tracked objects, {len(edges)} verified relationships synced to 06-Repositories/)"
    )
    return 0


if __name__ == "__main__":
    sys.exit(main())
