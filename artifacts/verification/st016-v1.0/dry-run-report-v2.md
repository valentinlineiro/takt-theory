# ST-016 External Dry Run Report — Run 2 (post-fix)

This is a second, independent zero-contact reproduction attempt, repeated from scratch
after the repository's `main` branch was updated by commit `f8733397acb82b9f45ce6ff6b3b563ec62d659a7`
("fix(replication): auto-provision elan in bootstrap.sh, pin package-lock.json, replace
absolute links, and regenerate verification reports") — a change that landed after Run 1
(see `dry-run-report.md` in this directory) and appears to directly address several of its
findings. This run treats that fact as coincidental rather than as prior knowledge: the
protocol below was executed identically to Run 1, from a **freshly cloned, isolated
checkout** of `main` (not the audit branch), with no reuse of any state, cache, or
`node_modules` from Run 1.

## Correction to Run 1

Run 1's Friction Log item 7 stated "No `package-lock.json` is committed." This was
**incorrect** — re-verified here: `package-lock.json` (blob `1f5e25ed4fbb46333e691971c65779d1dba40ccc`)
was already present at Run 1's audited commit `4ab4016`. Run 1 did not check for the file's
existence before asserting its absence. The *substance* of that friction item — that
README's standalone `npx vitest run` instruction does not itself honor the lockfile and can
fetch an unpinned major version — remains correct and is reproduced again below. This
correction is recorded for transparency; it does not change Run 1's overall FAIL verdict,
which rested on the missing Lean installation path, not on the lockfile question.

## Repository
- **Repository:** valentinlineiro/takt-theory
- **Branch:** `main` (fresh clone, not the audit branch)
- **Commit SHA:** `f8733397acb82b9f45ce6ff6b3b563ec62d659a7`

## Environment
- **Operating System:** Linux 6.18.5 (container), kernel `#1 SMP PREEMPT_DYNAMIC`
- **Architecture:** x86_64
- **Node.js version:** v22.22.2
- **npm / npx version:** 10.9.7
- **Lean version:** still not installed at end of run — see Verification Timeline #2
- **Clone method:** `git clone --branch main <origin>` into an isolated scratch directory, distinct from the audit-branch working tree

## Verification Timeline

| # | Command | Expected result (per docs) | Observed result | Verdict |
|---|---|---|---|---|
| 1 | Fresh `git clone --branch main` into an isolated directory | Clean checkout at `f873339` | Succeeded | — |
| 2 | `./scripts/bootstrap.sh` | Installs npm deps, auto-provisions Lean 4 via `elan` if missing, pre-builds Lean, prints "Bootstrap complete!" | `npm install` succeeded (81 packages, from the now-honored `package-lock.json`, with npm reporting 4 vulnerabilities — 2 moderate/1 high/1 critical — informational, not a blocker). Lean not found → script downloaded the `elan-init.sh` installer from `raw.githubusercontent.com` (succeeded), which then tried to fetch the actual `v4.32.0` toolchain from `release.lean-lang.org` and failed: `error: error during download … [56] Failure when receiving data from the peer (CONNECT tunnel failed, response 403)`. Script exited 1. | **FAIL — but for a different reason than Run 1** (see Friction Log #1) |
| 3 | (Pipeline halted again before `lake build` / `verify.sh`) | — | — | **BLOCKED** |
| 4 | `npm install` then `npx vitest run` (README §2.1) | 283 tests / 76 files passing, using the version resolved by the project's dependency graph | Ran against the locally installed `vitest@1.6.1` (satisfies package.json's `^1.2.1`, resolved via the now-present lockfile) — this is the first time in either run that the documented dependency version was actually exercised. **76/76 files passed, 283/283 tests passed.** | **PASS** |
| 5 | `npx vitest run cli/src/runtime/__tests__/ablation/` (EXP-004) | 3 witness tests pass | 3 test files passed, 3 tests passed | **PASS** |
| 6 | Recomputed SHA-256 of all 7 files listed in `artifacts/verification/st016-v1.0/hashes.json` (now including `theory_manifest`, absent in Run 1) and compared | All 7 hashes match | 6 of 7 matched exactly. **`theory_manifest` did not match**: committed value `e11a0d512ce6e3e9aab1cd4a16969dfc9cb60654590d1f059dd8b3871abc0326` vs. freshly computed `8d7c9535331fc9baaa56fb97b171d3fa362420729cc901730f5412d86a680e25` for the `theory-manifest.yml` actually present in this commit. | **FAIL** |
| 7 | Checked `CONFORMANCE.md` and `SCIENTIFIC_STATUS.md` for the `file:///home/valentin/...` absolute links flagged in Run 1 | Both fully resolved (commit message claims "replace absolute links") | `SCIENTIFIC_STATUS.md`: clean. `CONFORMANCE.md`: **still contains** `[\`theory-manifest.yml\`](file:///home/valentin/code/takt-theory/theory-manifest.yml)` — because the underlying generator, `scripts/verify.sh` line 96, still hardcodes that exact author-local path in the heredoc that (re)writes `CONFORMANCE.md`. The file committed in this fix was hand-edited once, but the generator that will overwrite it on every future `verify.sh` run was not. | **FAIL (partial fix, reverts on next run)** |
| 8 | `grep -n "sorry"` in `RuntimeSufficiency.lean` / `RuntimeWitness.lean` | 0 occurrences | 0 occurrences | **PASS (textual only)** |
| 9 | `lake build` | 0 errors, 0 sorrys, 230 jobs | **Not executed** — blocked by step 2's network failure | **NOT VERIFIED** |
| 10 | Checked the sandbox's outbound-proxy status (`curl "$HTTPS_PROXY/__agentproxy/status"`) to characterize the step-2 failure, no configuration changed | — | Proxy log shows an explicit policy denial: `"kind": "connect_rejected", "detail": "gateway answered 403 to CONNECT (policy denial or upstream failure)", "host": "release.lean-lang.org:443"`. `registry.npmjs.org` is allowlisted (hence npm install worked); `release.lean-lang.org` is not. | Diagnostic only |

## Friction Log

1. **Lean toolchain acquisition still could not be completed — but the cause has shifted from "no path exists" to "this sandbox's network policy blocks the one host the new path needs."** `bootstrap.sh` now correctly attempts to self-provision Lean via the official `elan` installer, which is a real fix to Run 1's primary finding. However, in *this* execution environment, the outbound proxy allowlists `registry.npmjs.org` (and a short list of other package registries) but not `release.lean-lang.org`, the host `elan-init.sh` uses to fetch the actual Lean toolchain archive. This is recorded as an **environment-specific limitation of this sandboxed audit**, not necessarily a defect in the repository — a researcher on an unrestricted network would likely get further. It does mean this specific audit still cannot confirm criterion 1 of `SCIENTIFIC_STATUS.md` §2 ("Lean 4 compiles with 0 errors and 0 sorrys").

2. **New, genuine hash mismatch: `theory_manifest`.** The regenerated `hashes.json` now includes the `theory_manifest` key that Run 1 flagged as missing, but the value committed (`e11a0d51…`) does not match the SHA-256 of the `theory-manifest.yml` actually present in the same commit (`8d7c9535…`). This means criterion 5 of `SCIENTIFIC_STATUS.md` §2 ("All artifact SHA-256 hashes match hashes.json") **fails on a fresh, direct check** — this is not an environment limitation, it is a reproducible data inconsistency in the committed artifacts themselves. All 6 other hashes matched exactly.

3. **The `file:///home/valentin/...` absolute-link fix does not survive a re-run.** `SCIENTIFIC_STATUS.md` was corrected directly, but `CONFORMANCE.md` is a *generated* file, and its generator (`scripts/verify.sh`, line 96) still contains the same hardcoded author-local path. `CONFORMANCE.md` as committed still shows the broken link, and the very next execution of the documented `verify.sh` would regenerate it identically. Fixing a generated artifact without fixing its generator does not close the underlying issue.

4. **README's zero-contact section is now internally consistent.** The test/file counts ("283 tests across 76 files") now match `SCIENTIFIC_STATUS.md`/`CONFORMANCE.md`/`scripts/verify.sh` — Run 1's friction item 4 (README stated "280 tests across 73 files") is resolved.

5. **`package-lock.json` is (and, per re-verification, always was) committed, and `bootstrap.sh` now runs `npm install` before the Lean check** rather than after/gated-behind it. This closes Run 1's ordering complaint (friction item 2) and means a plain `npm install` now reliably resolves the pinned dependency graph — confirmed by `vitest@1.6.1` (matching `^1.2.1`) actually being what ran the suite in this pass, unlike Run 1's ad hoc `npx`-fetched `vitest@4.1.10`.

6. **`npm install` reports 4 vulnerabilities (2 moderate, 1 high, 1 critical) in transitive dependencies.** Not a reproduction blocker and not evaluated further here (out of scope for ST-016 verification), but noted for completeness since it appears in the documented command's output.

## Verification Results

| Component | Result |
|---|---|
| **Lean formalization** | **NOT VERIFIED** — `lake build` never reached; blocked upstream by the sandbox's network policy on `release.lean-lang.org`, not by a documentation gap this time. Textual `sorry`-absence check still passes. |
| **Runtime build** | N/A, as in Run 1 — no separate build step beyond the test runner. |
| **Runtime tests** | **PASS** — 283/283 tests, 76/76 files, this time via the properly lockfile-pinned `vitest@1.6.1`. |
| **EXP-004 witness generation** | **PASS** (test-suite proxy, same caveat as Run 1: no persisted standalone witness artifact file is produced). |
| **Witness certification** | **NOT VERIFIED** — depends on the still-unavailable Lean build. |
| **Hash verification** | **FAIL** — 6/7 hashes match; `theory_manifest` does not match the actual file content in the same commit. |
| **CI consistency** | Not re-examined in this run; Run 1's finding stands — CI succeeds only because `leanprover/lean-action@v1` provisions Lean by a mechanism unavailable to a human following the documented local scripts (and, per this run, unavailable in networks that don't reach `release.lean-lang.org`). |

## Overall Result

**FAIL**

This run is materially closer to a successful zero-contact reproduction than Run 1: the npm/TypeScript half of the pipeline (dependency install, Vitest suite, EXP-004 ablation suite) now completes exactly as documented, using exactly the pinned dependency versions, from a clean clone, with no manual intervention. However, the full documented procedure (`./scripts/bootstrap.sh && ./scripts/verify.sh`) still does not complete end-to-end: the Lean 4 build is still not reachable (this time due to this sandbox's network egress policy rather than an absent installation path), and — independent of any network issue — a direct, executable check of the committed `theory_manifest` hash fails against the actual repository content. Per the audit's governing rule, any doubt about zero-contact completion resolves to FAIL.

## Recommendations

1. Re-verify/regenerate the `theory_manifest` hash in `artifacts/verification/st016-v1.0/hashes.json` (and the top-level `artifacts/verification/hashes.json`, if still separately maintained) — the committed value does not match `theory-manifest.yml`'s actual SHA-256 as of commit `f873339`.
2. Fix the source of the `file:///home/valentin/code/takt-theory/...` link inside `scripts/verify.sh` (the heredoc that writes `CONFORMANCE.md`, line 96), not just the already-generated `CONFORMANCE.md`/`SCIENTIFIC_STATUS.md` files — otherwise the broken link reappears on the next run of the documented pipeline.
3. If Lean toolchain acquisition depends on `release.lean-lang.org` being reachable, consider noting this as an explicit network prerequisite in the documentation (alongside the existing `elan` auto-install logic), since some restricted/offline/proxied environments will not reach that host even though they can reach npm's registry.
4. This audit could not, in either run, confirm the Lean 4 build or Lean-side witness certification steps of the ST-016 reproduction criteria; those two criteria remain unverified rather than confirmed passing.
