# ST-016 External Dry Run Report

## Repository
- **Repository:** valentinlineiro/takt-theory
- **Branch:** claude/st-016-reproducibility-audit-4td5z5
- **Commit SHA:** `4ab4016ee02010b3ca9ea1a622e6ce3c054a9e1e`

## Environment
- **Operating System:** Linux 6.18.5 (container), kernel `#1 SMP PREEMPT_DYNAMIC`
- **Architecture:** x86_64
- **Node.js version:** v22.22.2
- **npm / npx version:** 10.9.7
- **Lean version:** **not installed** (`lean`, `lake`, `elan` all "command not found")
- **Other tools:** `sha256sum` available; no Docker/devcontainer/Nix definition present in the repo

## Verification Timeline

| # | Command | Expected result (per docs) | Observed result | Verdict |
|---|---|---|---|---|
| 1 | Located ST-016 reproduction entry point (`SCIENTIFIC_STATUS.md` §2) | A documented, single reproduction path | Found: `./scripts/bootstrap.sh && ./scripts/verify.sh` | — |
| 2 | `./scripts/bootstrap.sh` | Checks Node/Lean, runs `npm install`, runs `lake build`, prints "Bootstrap complete!" | Printed `[+] Node.js detected: v22.22.2`, then `[!] ERROR: Lean 4 (lake) is required but not installed.` and exited with code 1. Script never reached `npm install` or `lake build`. | **FAIL** |
| 3 | (Documented pipeline halted here — `verify.sh` was never reached via the documented invocation) | — | — | **BLOCKED** |
| 4 | `npx vitest run` (README §2.1, run independently since it doesn't require Lean) | "280 tests across 73 files, all passing" per README | npm auto-installed `vitest@4.1.10` (not the `^1.2.1` pinned in `package.json`, since no prior `npm install` had populated `node_modules`). Result: **76 test files passed (76), 283 tests passed (283)**, in 13.3s. | Test run **PASS**, but count contradicts README; matches SCIENTIFIC_STATUS.md/CONFORMANCE.md instead |
| 5 | `npx vitest run cli/src/runtime/__tests__/ablation/` (EXP-004 suite, per `verify.sh` step 4) | 3 ablation witness tests pass | 3 test files passed, 3 tests passed | **PASS** |
| 6 | `grep -n "sorry"` in `RuntimeSufficiency.lean` / `RuntimeWitness.lean` | 0 occurrences (per "0 sorrys" claim) | 0 occurrences found | **PASS (textual only — not a Lean typecheck)** |
| 7 | `grep -n "validWitness_implies_necessity"` in `takt-formal/TaktFormal/*.lean` | Theorem present in `RuntimeWitness.lean` | Found at `RuntimeWitness.lean:25` | **PASS (existence only)** |
| 8 | Recomputed SHA-256 of the 6 files listed in `artifacts/verification/hashes.json` and compared | All hashes match | All 6 match exactly | **PASS** |
| 9 | Computed SHA-256 of `theory-manifest.yml` (a 7th value that current `verify.sh` generates as `"theory_manifest"`) | Should appear in `hashes.json` per the current script | **Key absent** from both `artifacts/verification/hashes.json` and `artifacts/verification/st016-v1.0/hashes.json` — those committed files predate the `theory_manifest` field added in commit `4ab4016` | **FAIL (stale artifact)** |
| 10 | `lake build` (Lean 4 proof compilation) | 0 errors, 0 sorrys, 230 build jobs | **Not executable** — no Lean toolchain available and no documentation anywhere in the repository explains how to install one | **NOT VERIFIED / FAIL** |
| 11 | Searched for Lean/elan installation instructions (README, CONTRIBUTING, INSTALL, SETUP, takt-formal/README.md, docs/) | Some documented path to obtain Lean 4 matching `lean-toolchain` (`leanprover/lean4:v4.32.0`) | None found. Only place Lean 4 is actually *installed automatically* is CI, via the `leanprover/lean-action@v1` GitHub Action — which is invisible to a human running the documented shell scripts locally | — |
| 12 | `git status` after all commands | Clean (no source modified) | Clean — no files changed by test/hash runs; `verify.sh` was never run so `CONFORMANCE.md`/`artifacts/verification/*` were never regenerated | **PASS (no unintended mutation)** |

## Friction Log

1. **Blocking: no Lean 4 installation instructions anywhere in the documentation.** `scripts/bootstrap.sh` *checks* for `lake` and hard-fails with a bare error if absent — it does not install Lean, and no README/SETUP/CONTRIBUTING file in the repo tells a new user how to obtain it (no `elan` command, no download link, no Docker/devcontainer image). The only place Lean is actually provisioned automatically is `.github/workflows/verify.yml`, via `leanprover/lean-action@v1`, which is a CI-only mechanism not reproducible by literally following the repo's own documentation on a local machine. This alone breaks the documented zero-contact path at the very first gated step.

2. **`bootstrap.sh` ordering makes the failure worse than necessary.** The Lean check happens *before* `npm install`, so even the parts of the pipeline that don't need Lean (the TypeScript/Vitest suite) are never reached by following the documented script as written.

3. **Version pinning is not actually enforced by the documented commands.** README §2.1 tells the reader to run `npx vitest run` directly. Because `bootstrap.sh` (the only place `npm install` is documented) is gated behind the unmet Lean requirement, a reader following README's standalone instruction gets `npx` silently downloading `vitest@4.1.10` from the registry instead of the `^1.2.1` pinned in `package.json`. In this run the newer major version happened to still pass, but this is not a controlled, reproducible dependency resolution — a future `npx` fetch could pull an incompatible major version and there is no lockfile (`package-lock.json`) committed to pin transitive versions either.

4. **Inconsistent test counts across documentation.** `README.md` §2.1 states "280 tests across 73 files"; `SCIENTIFIC_STATUS.md`, `CONFORMANCE.md`, and `scripts/verify.sh` all state "283/283 tests" across "76 test files". The actual observed run produced 283/283 across 76 files — matching the newer docs, meaning `README.md` is stale and was not updated when the ST-016 work landed.

5. **Committed verification artifacts are stale relative to the current script.** `artifacts/verification/hashes.json` and `artifacts/verification/st016-v1.0/hashes.json` are missing the `theory_manifest` hash key that the current `scripts/verify.sh` (as of commit `4ab4016`, the HEAD commit) generates. The committed `CONFORMANCE.md` and `artifacts/verification/st016-v1.0-report.md` likewise reflect an older script version (missing the "Manifest File Check" step present in the current script's generated output). This means the artifacts checked into the repository as "evidence" were not regenerated by the version of `verify.sh` currently at HEAD.

6. **Broken/non-portable file links in normative documents.** `CONFORMANCE.md` and `SCIENTIFIC_STATUS.md` link to source files via `file:///home/valentin/code/takt-theory/...` — absolute paths on the original author's machine. These are not clickable/resolvable in any other environment (including this one) and constitute leaked local-environment context in files meant to certify external reproducibility.

7. **No `package-lock.json` committed.** Combined with friction item 3, this means `npm install` (the step that *is* documented in `bootstrap.sh`) has no guaranteed deterministic dependency resolution across time.

8. **Lean proof correctness cannot be independently confirmed by textual inspection.** Absence of the string `"sorry"` and presence of a theorem's *signature* in `RuntimeWitness.lean` are necessary but not sufficient evidence of a passing, dependency-consistent `lake build`. This audit could only verify these proxies, not the actual compilation, because of friction item 1.

## Verification Results

| Component | Result |
|---|---|
| **Lean formalization** | **NOT VERIFIED.** Could not build — no Lean toolchain obtainable from documentation alone. Textual checks (no `sorry`, theorem present) passed but are not a substitute for `lake build`. |
| **Runtime build** | N/A — no separate TS build step is documented beyond the test runner; `npx vitest run` implicitly transpiles via esbuild and succeeded. |
| **Runtime tests** | **PASS** — 283/283 tests, 76/76 files, via `npx vitest run` (run independently of the broken `bootstrap.sh`/`verify.sh` chain). |
| **EXP-004 witness generation** | **PASS** (as an automated test-suite proxy) — the three ablation test files (`contract`, `uncertainty`, `temporal`) ran and passed, exercising `createWitnessArtifact`. No persisted, standalone `WitnessArtifact` file/output was produced or documented as an inspectable artifact separate from the test assertions. |
| **Witness certification** | **NOT VERIFIED** — the Lean-side certification (`validWitness_implies_necessity`) could not be executed (depends on the unavailable Lean build). |
| **Hash verification** | **PARTIAL PASS** — all 6 hashes present in the committed `hashes.json` files matched freshly recomputed SHA-256 sums of their target files. However, the committed hash manifest is incomplete/stale relative to the current `verify.sh` (missing `theory_manifest`), so full hash verification per the current script could not be completed as documented. |
| **CI consistency** | The GitHub Actions workflow (`.github/workflows/verify.yml`) runs the identical `bootstrap.sh`/`verify.sh` pair used in this audit, but only succeeds because it additionally invokes `leanprover/lean-action@v1` to provision Lean — a step with no local-environment equivalent documented anywhere in the repository. CI's ability to pass is therefore not evidence that a documentation-only, zero-contact human reproduction succeeds. |

## Overall Result

**FAIL**

The documented zero-contact procedure (`./scripts/bootstrap.sh && ./scripts/verify.sh`, per `SCIENTIFIC_STATUS.md` §2) terminated with a hard error at step 2 of `bootstrap.sh` because Lean 4/`lake` was not present and the repository contains no instructions, script, or bundled environment for installing it — the only working installation path (the `lean-action` GitHub Action) is CI-internal and not part of the documented human-facing procedure. Per the audit's own governing rule ("if there is any doubt whether reproduction was truly zero-contact, the correct result is FAIL"), this is a disqualifying gap regardless of the fact that the TypeScript/Vitest portions (283/283 tests) and file-hash checks that *could* be executed all passed.

## Recommendations

Reporting obstacles only, not proposing designs:

1. The repository needs a documented, platform-general method for obtaining the exact Lean 4 toolchain pinned in `lean-toolchain` (`leanprover/lean4:v4.32.0`) that a human can execute outside of CI — `scripts/bootstrap.sh` currently only checks for it and fails otherwise.
2. `scripts/bootstrap.sh` should not gate `npm install` behind the Lean check, since the two toolchains are unrelated and this ordering causes a single missing dependency to block the entire pipeline, including parts that don't need it.
3. `README.md`'s test-count claim ("280 tests across 73 files") is out of date relative to `SCIENTIFIC_STATUS.md`/`CONFORMANCE.md`/`verify.sh` ("283/283 tests, 76 files") and needs reconciliation.
4. `artifacts/verification/hashes.json` and `artifacts/verification/st016-v1.0/hashes.json`, as committed at HEAD, do not match the output shape of the `verify.sh` script also committed at HEAD (missing the `theory_manifest` hash key) — these committed "certification" artifacts were not regenerated by the current script version.
5. `CONFORMANCE.md` and `SCIENTIFIC_STATUS.md` contain `file:///home/valentin/code/takt-theory/...` links specific to the original author's local machine; these are unusable in any other environment and undermine the documents' role as external-facing certification records.
6. No `package-lock.json` is committed, and the README's standalone `npx vitest run` instruction (independent of `bootstrap.sh`'s `npm install`) does not guarantee the `vitest` major version pinned in `package.json` is what actually runs — an external run pulled `vitest@4.1.10` instead of the pinned `^1.2.1` line.
7. There is no persisted, inspectable `WitnessArtifact` output file from the EXP-004 suite — witness generation is currently verifiable only as a passing/failing test assertion, not as a standalone artifact a third party could inspect independent of trusting the test code.
