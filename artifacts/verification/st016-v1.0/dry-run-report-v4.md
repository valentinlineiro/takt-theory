# ST-016 External Dry Run Report — Run 4

## Repository
- **Repository:** valentinlineiro/takt-theory
- **Branch:** `main` (fresh, isolated clone)
- **Commit SHA:** `0102044c9641872b38b636d578e39979dae60c81`

## Environment
- **OS:** Linux 6.18.5, x86_64 (container)
- **Node.js:** v22.22.2
- **npm:** 10.9.7
- **Lean:** not installed (see below)

## Executed exactly as instructed
`./scripts/bootstrap.sh && ./scripts/verify.sh` — halted at `bootstrap.sh`'s Lean-provisioning step, exit code 1. `npm install` succeeded (81 packages) before that. `verify.sh` was never reached.

## Lean installation failure: (A) or (B)?

**Classification: (B) — external execution-environment restriction, not a repository defect.**

Evidence: `bootstrap.sh` downloaded the `elan` installer successfully from `raw.githubusercontent.com`, then failed fetching the pinned toolchain (`leanprover/lean4:v4.32.0`) from `release.lean-lang.org` with `CONNECT tunnel failed, response 403`. A check of this sandbox's outbound proxy shows an explicit policy denial for `release.lean-lang.org:443`, while `registry.npmjs.org` (which `npm install` used successfully) is allowlisted. The repository's provisioning logic executed correctly and failed only because this specific network cannot reach the one host it needs.

## Independent verification of each item

| Item | Result | Evidence |
|---|---|---|
| **`hashes.json` matches actual SHA-256 of every referenced artifact** | **PASS** (for `artifacts/verification/st016-v1.0/hashes.json`, the file `SCIENTIFIC_STATUS.md` §2 names as authoritative) | All 7 entries (`theory_manifest`, `st016_spec`, `lean_sufficiency`, `lean_witness`, `ts_temporal_ablation`, `ts_uncertainty_ablation`, `ts_contract_ablation`) recomputed and matched exactly. Defect #1 (`theory_manifest` mismatch) is resolved: committed and recomputed hash are both `e11a0d512ce6e3e9aab1cd4a16969dfc9cb60654590d1f059dd8b3871abc0326`. |
| **No `file:///home/...` links remain anywhere in the repository** | **FAIL** (as a repository-wide claim) | Defect #2 is resolved in its originally-reported scope: `CONFORMANCE.md`, `SCIENTIFIC_STATUS.md`, `theory-manifest.yml`, and the ST-016 normative spec (`docs/superpowers/specs/2026-07-27-st016-normative-runtime-specification.md`) contain zero `file:///home/...` links. However, checked repository-wide, **46 other tracked files** (e.g. `docs/superpowers/plans/*`, `docs/superpowers/specs/2026-07-23-phase-4c*`, `benchmarks/protocols/*`, `docs/cards/*`) still contain `file:///home/valentin/code/takt-theory/...` links. These files are outside ST-016's own document set per `theory-manifest.yml`. |
| **`CONFORMANCE.md` is generated correctly** | **NOT INDEPENDENTLY VERIFIABLE THIS RUN (B)** | The committed `CONFORMANCE.md` is well-formed and its capability table matches `theory-manifest.yml`. Its live regeneration by `verify.sh` could not be exercised because the script aborts (via `set -euo pipefail`) at the Lean-build step, before reaching the `CONFORMANCE.md`-generation step — a consequence of the environment restriction above, not of the generation logic itself. |
| **`theory-manifest.yml` is consistent with the generated artifacts** | **PASS** | All 14 file paths it references (Lean modules, TS components, ablation tests, scripts, CI workflow, report path) exist at the stated locations. Capability IDs (`KD-CONTRACT`, `KD-UNCERTAINTY`, `KD-TEMPORAL`) match `CONFORMANCE.md`'s table. |
| **Runtime tests pass** | **PASS** | `npx vitest run`: 283/283 tests, 76/76 files. |
| **EXP-004 passes** | **PASS** | `npx vitest run cli/src/runtime/__tests__/ablation/`: 3/3 tests, 3/3 files. |
| **Verification artifacts are internally consistent** | **FAIL** | Two divergent, non-reconciled duplicate artifact sets coexist in the repository: (1) `artifacts/verification/hashes.json` (top-level) vs. `artifacts/verification/st016-v1.0/hashes.json` — the top-level copy still holds the pre-fix `st016_spec` hash (`9bb10afd79c6...`, not matching the current spec file) and is missing the `theory_manifest` key entirely; (2) `artifacts/verification/st016-v1.0-report.md` (top-level, timestamp `2026-07-27T15:32:31Z`) vs. `artifacts/verification/st016-v1.0/st016-v1.0-report.md` (timestamp `2026-07-27T16:16:03Z`) — different step counts and content, and the older top-level report still cites the stale top-level `hashes.json` and `environment.json` as its hash/environment manifest. |

## Overall Result

**FAIL**

Both defects reported in the prior audit are confirmed fixed at their originally-reported locations: the `theory_manifest` hash in `artifacts/verification/st016-v1.0/hashes.json` now matches the actual file, and the ST-016 normative spec plus `CONFORMANCE.md`/`SCIENTIFIC_STATUS.md` no longer contain `file:///home/...` links. The Lean 4 build could not be completed, but this is attributable to (B) — the execution sandbox's network policy blocking `release.lean-lang.org` — not to the repository. Independent of both of the above, this run found a repository-attributable defect not previously reported: stale, unreconciled duplicate verification artifacts (a second `hashes.json` and a second `st016-v1.0-report.md`, both orphaned outside the path `verify.sh` and `SCIENTIFIC_STATUS.md` actually use, and internally contradicting the current ones). This makes "verification artifacts are internally consistent" fail on an objective, reproducible basis, which is sufficient on its own to keep the overall result at FAIL under zero-contact criteria.
