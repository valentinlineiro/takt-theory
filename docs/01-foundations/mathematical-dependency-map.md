# TAKT Mathematical Dependency Map

**Date:** 2026-07-23  
**Author:** Antigravity AI & TAKT Core Team  
**Status:** Frozen Theoretical Dependency DAG

---

## 0. Executive Summary

This document establishes the **Mathematical Dependency DAG** for the TAKT framework. It maps the logical flow of definitions, axioms, structural theorems, and formal Lean 4 modules from the foundational Volume 0 up to specific domain specializations.

---

## 1. Top-Level Dependency Graph

```text
               Volume 0: Information Sufficiency Kernel
                                 │
           ┌─────────────────────┴─────────────────────┐
           ▼                                           ▼
  Volume I: State Space                      Volume III: Trajectory Space
  Representational Sufficiency               Observation Sufficiency
           │                                           │
           └─────────────────────┬─────────────────────┘
                                 ▼
                     Problem 5: Duality Theorem
                    (State ↔ Trajectory Bridge)
                                 │
                                 ▼
                       Derived Necessary Friction
```

---

## 2. Detailed Theorem Dependency DAG (Volume 0 Core)

```text
Def 1.1: Information Transformation (f : X → Z)
                 │
                 ▼
Def 1.2: Information Preorder (RefinesInfo / f₁ ≤_info f₂)
                 │
   ┌─────────────┴─────────────┐
   ▼                           ▼
Thm 2.1: Reflexivity        Thm 2.2: Transitivity
(refines_info_refl)         (refines_info_trans)
   │                           │
   └─────────────┬─────────────┘
                 ▼
Def 1.3: Information Equivalence (EquivInfo / f₁ ~_info f₂)
                 │
   ┌─────────────┼─────────────┐
   ▼             ▼             ▼
Thm 3.1: Refl Thm 3.2: Symm Thm 3.3: Trans
                 │
                 ▼
Def 4.1: IsSufficient (P = h ∘ f)
                 │
   ┌─────────────┼─────────────────────────────┐
   ▼             ▼                             ▼
Thm 5.1: Id    Thm 5.2: Monotonicity         Thm 5.3: Kernel Equivalence
(identity)     (sufficiency_monotonicity)    (sufficiency_kernel_equivalence)
                 │                             │
                 ▼                             ▼
Def 4.2: IsMinimalSufficient                 Volume I Bridge
                 │                            (ker(f) ⊆ ker(P))
   ┌─────────────┴─────────────┐
   ▼                           ▼
Thm 6.1: Uniqueness         Thm 6.2: Universal Adjunction
(minimal_sufficiency_      (minimal_sufficiency_
 uniqueness)                adjunction_equivalence)
   │                           │
   └─────────────┬─────────────┘
                 ▼
Thm 6.3: Property Refinement Monotonicity
(minimal_sufficiency_property_monotonicity)
                 │
                 ▼
Thm 7.1: Join Supremum & Semilattice Structure
(product_is_information_join, join_comm, join_assoc)
```

---

## 3. Lean 4 Formal Module Mapping

| Module Name | File Path | Core Definitions / Theorems | Status |
|---|---|---|---|
| `TaktFormal.Kernel` | `TaktFormal/Kernel.lean` | `kernel`, `kernelSubset` | `Formalized` |
| `TaktFormal.Factorization` | `TaktFormal/Factorization.lean` | `factorization` | `Formalized` |
| `TaktFormal.Information.Sufficiency` | `TaktFormal/Information/Sufficiency.lean` | `IsSufficient`, `RefinesInfo`, `sufficiency_monotonicity`, `sufficiency_kernel_equivalence` | `Formalized` |
| `TaktFormal.Information.Algebra` | `TaktFormal/Information/Algebra.lean` | `EquivInfo`, `minimal_sufficiency_uniqueness`, `minimal_sufficiency_property_monotonicity`, `minimal_sufficiency_adjunction_equivalence`, `product_is_information_join`, `join_comm`, `join_assoc` | `Formalized` |
| `TaktFormal.Convergence.InfiniteTrajectory` | `TaktFormal/Convergence/InfiniteTrajectory.lean` | `InfiniteTrajectory`, `StateStream` | `Formalized` |
| `TaktFormal.Convergence.DynamicBehavior` | `TaktFormal/Convergence/DynamicBehavior.lean` | `IsConvergent`, `IsOscillatory`, `IsChaotic` | `Formalized` |
| `TaktFormal.Convergence.Stability` | `TaktFormal/Convergence/Stability.lean` | `IsFixedPoint`, `IsAbsorbingState`, `IsAttractor` | `Formalized` |

---

## 4. Primary Research Frontiers & Duality Bridge

### Problem 5: Representational-Dynamic Duality
- **Premise:** Prove that for any state space representation $\pi : X \to \bar{X}$, $\pi$ is representational sufficient for optimal decisions $D$ (Volume I) if and only if the induced trajectory mapping $\sigma_\pi : \text{Trace}(X) \to \text{Trace}(\bar{X})$ is observationally sufficient for dynamic behavior classification $C$ (Volume III).
- **Target Lean Module:** `TaktFormal.Information.Duality`
