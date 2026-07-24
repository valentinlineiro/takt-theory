#!/usr/bin/env python3
"""
verify_adapter.py: Automated self-check and validation harness for TAKT Replicators.

Usage:
  python3 verify_adapter.py --check-env
  python3 verify_adapter.py --adapter path/to/adapter.py
  python3 verify_adapter.py --validate-results --trace-dir path/to/traces/
"""

import sys
import os
import json
import argparse
from pathlib import Path

def check_env():
    print("=== Checking TAKT Replication Environment ===")
    py_ver = sys.version_info
    print(f"Python Version: {py_ver.major}.{py_ver.minor}.{py_ver.micro}")
    if py_ver.major < 3 or (py_ver.major == 3 and py_ver.minor < 10):
        print("[FAIL] Python 3.10+ required.")
        return False
    print("[OK] Python version suitable.")
    
    try:
        import jsonschema
        print("[OK] jsonschema package found.")
    except ImportError:
        print("[WARNING] jsonschema package missing. Install via 'pip install jsonschema'.")
    
    print("[OK] Environment verification complete.")
    return True

def validate_trace_file(trace_path: str, schema_path: str) -> bool:
    print(f"=== Validating Trace File: {trace_path} ===")
    if not os.path.exists(trace_path):
        print(f"[FAIL] File not found: {trace_path}")
        return False
        
    try:
        import jsonschema
        with open(schema_path, "r", encoding="utf-8") as f:
            schema = json.load(f)
    except Exception as e:
        print(f"[WARNING] Could not load JSON schema ({e}). Falling back to manual field checking.")
        schema = None

    valid_lines = 0
    errors = 0

    with open(trace_path, "r", encoding="utf-8") as f:
        for line_num, line in enumerate(f, 1):
            line = line.strip()
            if not line:
                continue
            try:
                data = json.loads(line)
                if schema:
                    jsonschema.validate(instance=data, schema=schema)
                else:
                    required = ["step_id", "timestamp", "domain_name", "granularity_level", "state_hash", "observed_state", "action_taken"]
                    for req in required:
                        if req not in data:
                            raise ValueError(f"Missing required key: {req}")
                valid_lines += 1
            except Exception as err:
                print(f"[FAIL] Line {line_num} invalid: {err}")
                errors += 1
                if errors > 5:
                    print("[ABORT] Too many errors encountered.")
                    return False

    print(f"[OK] Validation passed for {valid_lines} steps ({errors} errors).")
    return errors == 0

def main():
    parser = argparse.ArgumentParser(description="TAKT Replication Kit Verifier")
    parser.add_argument("--check-env", action="store_true", help="Check python environment")
    parser.add_argument("--adapter", type=str, help="Path to adapter script to test")
    parser.add_argument("--validate-results", action="store_true", help="Validate trace directory")
    parser.add_argument("--trace-dir", type=str, help="Directory containing .jsonl traces")

    args = parser.parse_args()

    if args.check_env:
        success = check_env()
        sys.exit(0 if success else 1)

    if args.trace_dir and args.validate_results:
        script_dir = Path(__file__).parent.parent
        schema_file = script_dir / "schemas" / "observation_trace.json"
        
        trace_files = list(Path(args.trace_dir).glob("*.jsonl"))
        if not trace_files:
            print(f"[FAIL] No .jsonl trace files found in {args.trace_dir}")
            sys.exit(1)
            
        all_ok = True
        for tf in trace_files:
            ok = validate_trace_file(str(tf), str(schema_file))
            all_ok = all_ok and ok
            
        if all_ok:
            print("\n[SUCCESS] All traces verified against schema!")
            sys.exit(0)
        else:
            print("\n[FAIL] Trace validation failed.")
            sys.exit(1)

    if not len(sys.argv) > 1:
        parser.print_help()

if __name__ == "__main__":
    main()
