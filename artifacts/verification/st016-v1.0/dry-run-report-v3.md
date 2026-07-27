# ST-016 External Dry Run Report — Run 3

Third independent zero-contact reproduction attempt, repeated from scratch after
`main` advanced by one more commit past Run 2: `5e6f9fbb1b6d38ef78e513761e0286c975388a38`
("fix(replication): ensure verify.sh generates relative markdown links and synchronized
artifact hashes"), which followed Run 2's report. As in Run 2, this run used a **fresh,
isolated `git clone --branch main`** (a new scratch directory, `clean-clone-run3`, distinct
from Run 2's `clean-clone`), reusing no cache, `node_modules`, or state from prior runs.

## Repository
- **Repository:** valentinlineiro/takt-theory
- **Branch:** `main` (fresh clone, not the audit branch)
- **Commit SHA:** `5e6f9fbb1b6d38ef78e513761e0286c975388a38`

## Environment
- **Operating System:** Linux 6.18.5 (container), kernel `#1 SMP PREEMPT_DYNAMIC`
- **Architecture:** x86_64
- **Node.js version:** v22.22.2
- **npm / npx version:** 10.9.7
- **Lean version:** still not installed at end of run (same network block as Run 2)

## What the new commit actually changed

The commit message claims two fixes: "generates relative markdown links" and
"synchronized artifact hashes." A direct diff against Run 2's audited commit (`f873339`)
shows only 3 files touched: `CONFORMANCE.md`, `artifacts/verification/st016-v1.0/environment.json`,
and `scripts/verify.sh`. **`artifacts/verification/st016-v1.0/hashes.json` and
`artifacts/verification/hashes.json` are byte-identical to Run 2** — the "synchronized
artifact hashes" half of the commit message does not correspond to any actual change. This
was checked directly (`git diff f873339 origin/main -- .../hashes.json` → empty) before
re-running the protocol, and confirmed again below by recomputing hashes against the fresh
clone.

## Verification Timeline

| # | Command | Expected result (per docs) | Observed result | Verdict |
|---|---|---|---|---|
| 1 | Fresh `git clone --branch main` into a new isolated directory | Clean checkout at `5e6f9fb` | Succeeded | — |
| 2 | `./scripts/bootstrap.sh` | Installs npm deps, auto-provisions Lean via `elan`, pre-builds Lean | `npm install`: 81 packages installed (same 4 vulnerabilities reported: 2 moderate/1 high/1 critical). Lean not found → `elan-init.sh` downloaded successfully, then failed identically to Run 2 fetching the toolchain: `error: error during download … [56] Failure when receiving data from the peer (CONNECT tunnel failed, response 403)`, host `release.lean-lang.org`. Exit code 1. | **FAIL — same cause as Run 2, reproducible** |
| 3 | (Pipeline halted before `lake build` / `verify.sh`, same as Run 2) | — | — | **BLOCKED** |
| 4 | `npx vitest run` | 283/283 tests, 76/76 files | 76/76 files passed, 283/283 tests passed | **PASS** |
| 5 | `npx vitest run cli/src/runtime/__tests__/ablation/` | 3 witness tests pass | 3 files passed, 3 tests passed | **PASS** |
| 6 | Recomputed SHA-256 of all 7 files in `hashes.json` | All match | 6 of 7 matched. **`theory_manifest` mismatch persists, unchanged from Run 2:** committed `e11a0d512ce6e3e9aab1cd4a16969dfc9cb60654590d1f059dd8b3871abc0326` vs. actual `8d7c9535331fc9baaa56fb97b171d3fa362420729cc901730f5412d86a680e25`. | **FAIL — not actually fixed, despite the commit message** |
| 7 | Inspected `CONFORMANCE.md` for the `file:///home/valentin/...` link flagged in Run 2 | Resolved | **Resolved.** `scripts/verify.sh`'s heredoc now emits `[\`theory-manifest.yml\`](theory-manifest.yml)` (relative), and the committed `CONFORMANCE.md` reflects it. This is now fixed at the generator, not just the generated file, so it will hold across future `verify.sh` runs. | **PASS** |
| 8 | Swept the whole repository for remaining `file:///home/valentin/...` links, to check whether the fix was general or narrowly scoped | Not specifically claimed either way by docs | The pattern is **extremely widespread** outside ST-016's own file set — dozens of occurrences across `docs/`, `PROGRAM_STATUS.md`, and an entire pre-existing "T-Series" external-replication apparatus (`docs/replication/`). These are out of scope for ST-016 verification and were not evaluated further, but are noted since they indicate the fix was scoped narrowly to the two files `verify.sh` regenerates, not a repo-wide pass. | Out of scope (noted only) |
| 9 | Checked the ST-016 normative spec itself (`docs/superpowers/specs/2026-07-27-st016-normative-runtime-specification.md`) — whose SHA-256 is one of the 7 hashes verified in step 6, and which `theory-manifest.yml` lists as the standard's normative specification — for the same absolute-link pattern | Should be clean, as an ST-016-scoped artifact | **Not clean.** Lines 41–43 contain three `file:///home/valentin/code/takt-theory/...` links (to `ContractEvaluator.ts`, `RuntimeSufficiency.lean` ×2, `contract.ablation.test.ts`, `RobustMarginEstimator.ts`, `TrajectoryMonitor.ts`, `uncertainty.ablation.test.ts`, `temporal.ablation.test.ts`). This file is squarely inside ST-016 scope (it's the frozen normative spec, hash-checked by `verify.sh`) and was untouched by either fix commit. | **FAIL** |
| 10 | `grep -n "sorry"` in `RuntimeSufficiency.lean` / `RuntimeWitness.lean` | 0 occurrences | 0 occurrences | **PASS (textual only)** |
| 11 | `lake build` | 0 errors, 0 sorrys, 230 jobs | Not executed — blocked by step 2 | **NOT VERIFIED** |

## Friction Log

1. **Lean toolchain acquisition remains blocked in this sandbox, identically to Run 2.** Same host (`release.lean-lang.org`), same 403 at the proxy CONNECT layer. No change expected here since neither fix commit touched `bootstrap.sh`'s Lean-provisioning logic.

2. **The commit message overstates what was fixed.** "…and synchronized artifact hashes" implies the `theory_manifest` hash mismatch found in Run 2 was corrected. It was not — `hashes.json` is byte-for-byte identical to Run 2's version, mismatch and all. Anyone trusting the commit message without re-running the check (as this audit did) would believe hash verification now passes.

3. **The relative-link fix was correctly scoped to what `verify.sh` regenerates (`CONFORMANCE.md`) but not to all ST-016-scoped source documents.** The normative ST-016 spec file itself — the one document `theory-manifest.yml` names as *the* normative specification, and whose hash is part of the verification manifest — still contains three unresolved absolute local-machine links. Content hash verification (step 6/9) does not check *for* this pattern, so the file's SHA-256 matching does not indicate portability; it only indicates the file hasn't changed since Run 1/2, links and all.

4. **TypeScript/Vitest half of the pipeline continues to reproduce cleanly and deterministically** across all three runs now, from a clean clone, with correctly pinned dependency versions.

## Verification Results

| Component | Result |
|---|---|
| **Lean formalization** | **NOT VERIFIED** — blocked by sandbox network policy, unchanged from Run 2. |
| **Runtime build** | N/A. |
| **Runtime tests** | **PASS** — 283/283, 76/76 files, third consecutive clean-clone pass. |
| **EXP-004 witness generation** | **PASS** (test-suite proxy, same caveat as prior runs). |
| **Witness certification** | **NOT VERIFIED** — depends on the Lean build. |
| **Hash verification** | **FAIL** — `theory_manifest` mismatch persists unchanged from Run 2, despite a commit claiming it was synchronized. |
| **CI consistency** | Not re-examined this run; Run 1's finding (CI passes only via a Lean-provisioning mechanism unavailable to a documentation-only local run) still stands architecturally. |

## Overall Result

**FAIL**

The relative-link fix is a genuine, durable improvement (fixed at the generator, verified to hold on a fresh clone). Everything else material to the FAIL verdict is unchanged from Run 2: the Lean 4 build still cannot be completed in this sandboxed environment, the `theory_manifest` hash in the committed verification manifest still does not match the actual file it is supposed to attest to (and the latest commit's claim to have fixed this does not hold up under direct re-verification), and the ST-016 normative specification document itself still contains non-portable absolute links that a byte-for-byte hash check cannot surface. Per the audit's governing rule, doubt about zero-contact completion resolves to FAIL.

## Recommendations

1. The `theory_manifest` hash in both `artifacts/verification/st016-v1.0/hashes.json` and `artifacts/verification/hashes.json` still does not match `theory-manifest.yml`'s actual content as of `5e6f9fb`. This has now been reported in two consecutive runs (Run 2 and Run 3) without being corrected, despite one commit claiming to have addressed it.
2. `docs/superpowers/specs/2026-07-27-st016-normative-runtime-specification.md` — the frozen ST-016 normative spec, in scope for hash verification — contains three `file:///home/valentin/code/takt-theory/...` absolute links (lines 41–43) that were not part of either prior fix.
3. Before relying on a commit message's description of what was fixed, re-run the specific check it claims to address — in this case the message and the actual diff disagreed on the hash-synchronization claim.
4. The Lean-toolchain network dependency (`release.lean-lang.org`) remains unreachable from this specific audit sandbox; this is carried forward from Run 2 as an environment characteristic, not a new finding.
