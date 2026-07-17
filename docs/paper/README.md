# TAKT v4 — Trajectory-Based Strategic Governance under Partial Observability

**Tag:** `paper-v4.0-freeze`
**Commit:** `0aebe7a`
**Branch:** `main`
**Repository:** https://github.com/valentinlineiro/takt-theory
**Date frozen:** 2026-07-17

---

## Experimental Reproducibility

| Component | Status | How to run |
|-----------|--------|-----------|
| Theoretical claims (F-001–F-005) | All validated | `cd cli && npx vitest run` |
| F-005 Asymmetric Margin Effect | Confirmed under $p_{\text{true}}=0.3, \delta=0.5, \theta=1.5$ | `cli/src/batch-f-005/` |
| F-005.1 Conservative Calibration $\beta$ | Pareto frontier observed | `cli/src/batch-f-005.1/` |
| Full test suite | 131 tests, 51 files, 0 failures | `npx vitest run` |

All code is ESM TypeScript on Node v24.14.1, Vitest 4.1.10, zero external dependencies.

---

## Claim Inventory

### Theorem-Level (proven analytically)

| ID | Claim | Status | Location |
|----|-------|--------|----------|
| C1 | $M_D(\\tau_{:t})$ is monotonic in $t$ — margin can only decrease as the trajectory unfolds | Proven | Dynamic margin |
| C2 | $\text{Spec}(C_{v4}) \subseteq \text{Spec}(C_{\text{static}})$ when both are expressible | Proven | F-002 |
| C3 | Guaranteed Intervention Horizon: $H \\geq \\lceil \\theta / \\delta \\rceil$ ensures expected loss $\\leq \\epsilon$ | Proven | F-002, F-003 |
| C4 | Audit game has a dominant strategy $d^*_{\\text{prob}}$ for the auditor | Proven | F-004 |
| C5 | $C_h^{\\max}$ is reachable-transition-cover monotonic (adding irrelevant states does not increase the worst-case value of $C_h$) | Proven | F-001 |

### Implementation-Level (verified by test)

| ID | Claim | Test file |
|----|-------|-----------|
| I1 | `computeDynamicMargin` returns $[0, \\infty)$ for any finite TDS | batch-f-002 |
| I2 | $M_D = 0$ at the first failure state in any trajectory | batch-f-002 |
| I3 | $M_D \\to \\infty$ as trajectory approaches certain safety | batch-f-002 |
| I4 | Intervention horizon constraint reduces expected loss below $\epsilon$ | batch-f-003 |
| I5 | Audit probability $d_{\\text{prob}}$ controls auditor vs. agent payoff equilibrium | batch-f-004 |

### Empirical-Level (observed in experiment)

| ID | Claim | Boundary conditions |
|----|-------|--------------------|
| E1 | Optimistic bias in $P$ invalidates contractual guarantee | $p_{\\text{true}}=0.3, \\delta=0.5, \\theta=1.5$ |
| E2 | Pessimistic bias preserves guarantee at efficiency cost | Same config |
| E3 | Asymmetric Margin Effect: $p_{\\text{true}}$ position relative to intervention threshold determines asymmetry direction | Hypothesis, not proven — inverts near $p_{\\text{true}} \\gg 0.5$ |
| E4 | $\\beta \\in [0.2, 0.5]$ reduces false safe rates $\\sim 90\\%$ without false alarms | Same config |

### Future Hypotheses (not yet tested)

| ID | Claim | Priority |
|----|-------|----------|
| H1 | Generalization: AMP holds across all $p_{\\text{true}}, \\delta, \\theta$ regimes | High |
| H2 | Online $\beta$ adaptation improves safety-efficiency Pareto frontier | High |
| H3 | $M_D$ is Lipschitz in $P$ (small changes in $P$ produce bounded changes in $M_D$) | Medium |
| H4 | $C_{v4}$ is compositional: contracts compose under parallel/serial system combination | Medium |
| H5 | $M_D$ admits a formalization in Lean 4 | Low |

---

## Paper Artifacts

| File | Description |
|------|-------------|
| `docs/04-academic-paper/2026-07-17-takt-v4-draft.md` | Manuscript (490 lines, 11 BibTeX references) |
| `docs/04-academic-paper/fig1-static-vs-dynamic.svg` | Figure 1: Static Certification vs Dynamic Governance |
| `docs/04-academic-paper/fig2-architecture.svg` | Figure 2: TAKT v4 Architecture |
| `docs/04-academic-paper/2026-07-17-takt-v4-paper-outline.md` | Outline (post-reviewer-attack revision) |
| `docs/superpowers/specs/2026-07-17-phase-f-strategic-governance-design.md` | Phase F specification |

---

## Relationship to Code

| Phase | What it validated | Status |
|-------|-------------------|--------|
| F-001 | Temporal coverage via $C_h^{\\max}$ ($H=10, n=3, C_h^{\\max} \\approx 4.4 \\times 10^7$) | PASS |
| F-002 | Dynamic margin $M_D$ (monotonic, $\\infty$ at safety, 0 at failure) | PASS |
| F-003 | Intervention horizon constraint reduces expected loss below $\epsilon$ | PASS |
| F-004 | Audit game equilibrium (dominant strategy for auditor) | PASS |
| F-005 | Asymmetric Margin Effect (optimistic vs pessimistic bias) | PASS |
| F-005.1 | Conservative calibration $\beta$ (Pareto frontier) | PASS |

---

## Next Steps (beyond freeze)

The paper is now frozen as a scientific baseline. The codebase moves to **Phase G: Operational Governance** — a runtime prototype that implements $M_D$, audit policy, and contract evaluation on streaming trajectories, then integrates $\hat{P}_t$ online estimation and $\beta$ adaptation.
