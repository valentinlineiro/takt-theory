# ST-016 External Dry Run Report — Run 5 (Final Acceptance Audit)

## Repository
- **Repository:** valentinlineiro/takt-theory
- **Branch:** `main` (fresh, isolated clone)
- **Commit SHA:** `ba3510794ace7df06113f836529c9eec24663809`

## Environment
- **OS:** Linux 6.18.5, x86_64 (container)
- **Node.js:** v22.22.2
- **npm:** 10.9.7
- **Lean:** not installed (see below)

## Executed exactly as instructed
`./scripts/bootstrap.sh && ./scripts/verify.sh` — `npm install` succeeded (81 packages). Halted at `bootstrap.sh`'s Lean-provisioning step, exit code 1. `verify.sh` never reached.

## Lean installation failure: (A) or (B)?

**(B) — external execution-environment restriction, not a repository defect.** `elan` installer downloaded successfully from `raw.githubusercontent.com`; the subsequent fetch of the pinned toolchain from `release.lean-lang.org` failed with `CONNECT tunnel failed, response 403`. Proxy diagnostics confirm an explicit policy denial for `release.lean-lang.org:443` in this sandbox, while `registry.npmjs.org` (used successfully by `npm install`) is allowlisted. Identical cause and evidence as Runs 2–4.

## Checklist results

| Item | Result |
|---|---|
| `bootstrap.sh` executes as documented | **PASS** — Node check, `npm install`, Lean auto-provision attempt all ran as written; failure is confined to the network-blocked toolchain download (B). |
| `verify.sh` completes as far as the execution environment allows | **PASS** — never reached (script correctly aborts under `set -euo pipefail` when `bootstrap.sh` fails); this is the expected behavior given (B), not a script defect. |
| Verification artifacts exist only in `artifacts/verification/st016-v1.0/` | **PASS** — full repo sweep found exactly `environment.json`, `hashes.json`, `st016-v1.0-report.md` in the canonical directory, and no duplicates elsewhere. `artifacts/verification/dry-run-template.md` also exists but is a static human-facing template, not a generated/duplicate output. |
| No duplicate or stale verification artifacts elsewhere | **PASS** — the top-level `artifacts/verification/hashes.json`, `environment.json`, and `st016-v1.0-report.md` present in Run 4 are gone. |
| Hashes match their referenced artifacts | **PASS** — all 7 entries in `artifacts/verification/st016-v1.0/hashes.json` (`theory_manifest`, `st016_spec`, `lean_sufficiency`, `lean_witness`, `ts_temporal_ablation`, `ts_uncertainty_ablation`, `ts_contract_ablation`) recomputed independently and matched exactly. |
| `theory-manifest.yml` consistent with verification outputs | **PASS** — all 14 referenced paths (Lean modules, TS components, ablation tests, scripts, CI workflow, report path) exist; capability IDs match `CONFORMANCE.md`'s table. |
| Runtime tests pass | **PASS** — 283/283 tests, 76/76 files (`npx vitest run`). |
| EXP-004 passes | **PASS** — 3/3 tests, 3/3 files (`npx vitest run cli/src/runtime/__tests__/ablation/`). |
| No absolute local `file:///` links remain anywhere in the repository | **FAIL** — within ST-016's own artifact set (`CONFORMANCE.md`, `SCIENTIFIC_STATUS.md`, `theory-manifest.yml`, the ST-016 normative spec) zero occurrences remain, confirming the originally reported defect #2 stays fixed. Checked repository-wide, as this round's protocol specifies, **46 tracked files outside that set** (`docs/superpowers/plans/*`, `docs/superpowers/specs/2026-07-23-phase-4c*-design.md`, `benchmarks/protocols/*`, `docs/cards/*`, `docs/replication/*`, `PROGRAM_STATUS.md`, others) still contain `file:///home/valentin/code/takt-theory/...` links — identical list to Run 4, unchanged by commit `ba35107`. |

## Overall Result

**FAIL**

Every item scoped to ST-016's own verification chain — the artifact directory, hash manifest, `theory-manifest.yml`, runtime tests, EXP-004, and the previously-flagged normative documents — passes independently on a fresh clone. The Lean 4 build gap is (B), an external execution-environment restriction, not a repository defect. The sole basis for this result is the literal, repository-wide instruction to verify "no absolute local `file:///` links remain anywhere in the repository": 46 tracked files outside ST-016's artifact set still contain such links, unchanged since Run 4. This is a reproducible, repository-attributable condition, independently confirmed by direct grep against the fresh clone.
