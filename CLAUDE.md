# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this repository is

TAKT (Theory of Adequate Knowledge for Decisions) is an axiomatic theory of decision-preserving representations: it formalizes when compressing or abstracting a representation state preserves the optimal decisions made under complete information. The repo holds three parallel tracks that must stay consistent with each other:

* **Theory** (`docs/`) — the formal spec, design contracts, and academic paper.
* **Proofs** (`takt-formal/`) — Lean 4 mechanization of the same claims.
* **Empirical validation** (`cli/`, `experiments/`) — a TypeScript evaluation engine that runs numbered batches against the theory's predictions.

A change to the theory that isn't reflected in the Lean proofs or the batch suite (or vice versa) is an inconsistency, not just a missing task.

## Commands

Run the full TypeScript evaluation suite (no `package.json`/`tsconfig.json` in the repo — Vitest runs directly off its own defaults):

```bash
npx vitest run
```

Run a single batch or module:

```bash
npx vitest run cli/src/batch-f-004
npx vitest run cli/src/runtime
```

Run one standalone `.ts` experiment script (e.g. a results dump under `scratch/`):

```bash
npx tsx scratch/phase-f-results.ts
```

Build/verify the Lean 4 proofs (zero external dependencies; must complete with no `sorry`s):

```bash
cd takt-formal
lake build
```

## Architecture

### Theory → Proof → Validation mapping

* `docs/01-foundations/` — axiomatic introduction and the current formal spec (v3.0). Read this before touching `takt-core/`.
* `docs/03-design-contracts/` — the numbered contracts (D-001 Margin, D-002 Coverage, D-003 Dynamic Contracts) that `cli/src/takt-core/` implements directly: `margin.ts` ↔ D-001, `coverage.ts` ↔ D-002, dynamic-contract logic ↔ D-003.
* `takt-formal/TaktFormal/*.lean` — one file per formal object (`DecisionMargin.lean`, `Coverage.lean`, `DynamicSafetyContract.lean`, `SafetyEquivalence.lean`, `Regret.lean`, etc.), mirroring the same concepts proved instead of tested.
* `docs/02-theoretical-positioning/` — audits comparing TAKT's guarantees to prior art (Blackwell sufficiency, bisimulation).
* `docs/05-archives/` — frozen historical phases and precursor formalisms; treat as read-only history, not live spec.

### `cli/src/takt-core/` — the shared kernel

Every batch and every runtime component builds on this kernel; changes here ripple everywhere:

* `types.ts` — `State`, `Action`, `Observation`, `Trajectory`/`TrajectoryPrefix`.
* `margin.ts` — `computeDynamicMargin` (M_D: surprisal-cost distance to the first decision-losing state, memoized on `state+depth` under a Markovian-policy assumption) and `computeCMax` (worst-case cost bound over a horizon `h`).
* `coverage.ts`, `trajectory.ts` — temporal coverage/consistency checks and observational-equivalence helpers used by the F-001-style batches.

### Numbered experiments (`cli/src/batch-*`)

Each `batch-NNN/` or `batch-f-NNN/` directory is a self-contained empirical validation unit: `fixtures.ts` (the scenario/TDS setup), `eval.ts` (the batch's own logic, importing from `takt-core`), `eval.test.ts` (the assertions that make it pass/fail). Batches are numbered sequentially (`batch-001`…`batch-024` = the original Pareto-frontier sweep); `batch-f-*` are the Phase F strategic-governance batches (F-001 temporal coverage, F-002 dynamic margin, F-003 guaranteed intervention horizon, F-004 auditor-adversary game, F-005 estimation-error robustness / Asymmetric Margin Principle). `red-team/` (`rt001`-`rt004`) holds adversarial stress tests, each with a matching `RT00N.lean` proof.

`experiments/computational-batches/`, `experiments/stress-tests/`, `experiments/case-studies/` are the documentation-side mirror of these same batches/stress-tests/case-studies (numbered ST-00N, CASE-00N) — narrative writeups, not runnable code.

### `cli/src/runtime/` — the online governance layer (Phase G)

Built on top of `takt-core`, not a reimplementation of it. Wires the batch-validated contract to an incrementally-arriving event stream:

```
Event stream → TrajectoryMonitor (accumulates prefix τ:t)
                     → DynamicMarginEstimator (delegates to takt-core computeDynamicMargin)
                     → AuditPolicy (margin → MONITOR/INTERVENE)
                     → ContractEvaluator (tracks loss/interventions/violations vs. ε)
```

The invariant to preserve when extending this layer: online components must delegate to `takt-core` for the actual math rather than re-deriving it, so batch (offline) and runtime (online) results stay provably equivalent (see R0-R5 in `docs/superpowers/specs/2026-07-17-phase-g1-validation.md`).

### Phase history and where to look for "why"

Phases are sequential and each one's closing spec records the conceptual transition to the next: `docs/superpowers/plans/` holds phase plans, `docs/superpowers/specs/` holds design docs and closing validation specs (e.g. `2026-07-17-phase-f-strategic-governance-design.md`, `2026-07-17-phase-g1-validation.md`). Before starting new work in an existing phase's territory, read its closing spec rather than inferring intent from code alone — these documents state explicit limitations (e.g. G1 assumes a known transition model P, no online learning, no uncertainty over M_D) that constrain what "done" means for follow-on work.
