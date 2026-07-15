# Session: Novelty Audit — TAKT Formal Core v1.0

## Goal

Compare TAKT's formal core against neighboring formalisms to produce a
correspondence map: TAKT concept ↔ known concept, identifying genuinely
differential residue.

## TAKT v1 Formal Core (frozen at `v1.0.0`)

### Central invariant

```
ker(R) ⊆ ker(D)   ⇔   ∃π, D = π∘R   ⇔   ε_D(R) = 0
```

### Falsified

```
ε_U(R) = 0  ⇒  ker(R) ⊆ ker(D)   — FALSE
```

### Core concepts to map

| Concept | Definition | File |
|---|---|---|
| `kernel(f)` | Equivalence relation: f(x)=f(y) | `Kernel.lean:16` |
| `kernelSubset(f,g)` | ker(f) ⊆ ker(g) | `Kernel.lean:21` |
| factorization | ker(R) ⊆ ker(D) ⇔ ∃π, D=π∘R | `Factorization.lean:77` |
| argmaxPred | a is max under U(s,·) | `DecisionSystem.lean:26` |
| DecisionSystem | <U, argmax_nonempty, θ, θ_consistent> | `DecisionSystem.lean:30` |
| DecisionSystem.D | θ(argmax U(s,·)) | `DecisionSystem.lean:37` |
| regret | U(x,D(x)) - U(x,D(y)) | `Regret.lean:24` |
| epsilon (ε_U) | sup bound on regret over ker(R) | `Regret.lean:47` |
| epsilon_D (ε_D) | ker(R) ⊆ ker(D) predicate | `SafetyEquivalence.lean:39` |

### Known boundaries (2 sorry, both documented)

1. `Regret.lean:70` — ε_U(R)=0 ⇒ ker(R)⊆ker(D) is unprovable
2. `SafetyEquivalence.lean:80` — same unprovable direction

### Key discovery from formalization

Decision preservation (ε_D) and utility preservation (ε_U) are distinct.
ε_D=0 ⇒ ε_U=0, but not vice versa. Two actions with tied utility give
zero regret but different decisions.

### Assumptions (v1 scope)

- D deterministic
- A finite
- θ globally consistent (same tie-breaking everywhere)
- Utility-defined decision (D = θ(argmax U))

### Failure boundaries (excluded from v1)

1. Stochastic
2. Temporal
3. Multi-objective
4. Adaptive

## Status

**Step 1: Freeze** — DONE (`v1.0.0` tagged and pushed).

**Step 2: Novelty audit** — NOT STARTED. Research task requiring:

### Neighboring formalisms to compare

1. **Sufficient statistics** (Fisher, Neyman, Le Cam)
2. **Blackwell sufficiency** (comparison of experiments)
3. **Information bottleneck** (Tishby, Bialek)
4. **State abstraction / bisimulation** (RL — Li, Dean, Ferns)
5. **Decision-sufficient representations** (Bertsekas, Tsitsiklis)
6. **Quotient / factorization approaches** (dynamic programming aggregation, Dean & Givan, Abel et al.)
7. **Bayesian sufficiency** (Kolgomorov, Pitman)

### Questions for each

- Does the neighboring formalism have a `ker(R) ⊆ ker(D)`-like invariant?
- If so, how does it derive or justify it? Is it definitional or proven?
- Does any neighboring formalism distinguish decision-preservation from utility-preservation?
- Which TAKT concepts have exact, approximate, or no correspondence?
- What is the genuine differential residue — what does TAKT express that no existing formalism captures?

### Expected output

A document mapping each TAKT concept to its known-precursor counterpart (or
marking it as novel), with a final section identifying what (if anything)
survives as genuinely differential.

## Next steps (as you proposed)

1. Freeze — DONE
2. Compare — THIS SESSION (novelty audit)
3. Re-derive — from core to operational concepts
4. Generate — test on context engineering for agents
5. Extend — open one frontier (adaptive recommended)

## Relevant files

- `takt-formal/` — Lean proofs (5 modules, 439 lines, 0 errors)
- `docs/theory/takt-formal-foundations-v1.md` — full derivation in LaTeX
- `session/README.md` — this file
