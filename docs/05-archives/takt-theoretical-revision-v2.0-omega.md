# Theoretical Revision Note: From Risk Estimation to Observability Governance (v2.0)

**Date:** 2026-07-14  
**Status:** Active  
**Predecessor:** [omega-formalism-v0.1.md](omega-formalism-v0.1.md), [batch-010-design-v1.0.md](../../experiments/computational-batches/batch-010/batch-010-design-v1.0.md)

---

## 1. Paradigm Shift: From Estimator Search to Representation Design

This marks a clear inflection point: **TAKT has transitioned from an estimator search phase to a representation design phase.** 

The critical update is not Batch-010 itself or the TypeScript type fixes, but the formalization of the contraction property.

### 1.1 Contraction as a Fundamental Principle

Previously, contraction was treated as a problem to be solved:
\[
\text{Contraction} = \text{Problem}
\]

Now, we recognize contraction as an unavoidable mathematical property of any finite representation:
\[
\boxed{
I(\text{representation}; S) \leq I(S; S)
}
\]

The question is no longer "Can we eliminate contraction?" but rather:
> Where does contraction occur, and what information does it lose?

### 1.2 Governed Contraction vs. Representational Contraction

An important distinction must be made: **$\Omega$ delays decisional contraction, but it does not eliminate representational contraction.** Even the mapping $S \rightarrow \Omega$ is a projection; $\Omega$ does not contain the complete state of the world.

* **Legacy Model ($\alpha$):** 
  \[
  S \rightarrow \rho \rightarrow \alpha
  \]
  The loss occurred prematurely at the observation layer by building a structurally poor signal.
  
* **New Model ($\Omega$):** 
  \[
  S \rightarrow \Omega \rightarrow \Delta\Omega \rightarrow \text{EVSI} \rightarrow \text{Decision}
  \]
  The loss of information is delayed until a controlled decision boundary, where the system can measure the degradation of its own representation before acting. 

$\Omega$'s primary value is not that it eliminates contraction, but that it **governs it**: it preserves the necessary dimensions to detect its own informational degradation.

### 1.3 Mathematical Formulation of Governed Contraction

A representation $\Omega$ is effective not because it achieves perfect preservation ($I(\Omega; S) = I(S; S)$, which is impossible for finite representations), but because it enables self-diagnosing degradation:
\[
\boxed{
I(\Delta\Omega; \text{Loss}(S \rightarrow \Omega)) > 0
}
\]
That is, the transition of the representation itself preserves information about its own degradation.

---

## 2. Experimental Definition of Batch-010

The experimental question for Batch-010 has shifted. We no longer ask:
> Is there a better estimator $\alpha$?

Instead, the primary hypothesis is:
\[
\boxed{
\Delta\Omega > \varepsilon \ \land \ \alpha \leq \tau
}
\]
i.e., whether $\Delta\Omega$ can detect relevant information loss before $\alpha$ does.

This is a much stronger hypothesis. It implies that $\Omega$ does not attempt to model the entire system state, but rather preserves enough structure to detect when its own representation is no longer sufficient to make safe decisions.

---

## 3. The Three-Layer Theoretical Architecture

The theoretical framework is now explicitly decoupled into three distinct layers:

### Layer 1: Representation ($\Omega$)
* **Core Question:** What information does the system preserve?

### Layer 2: Observability ($\Delta\Omega$)
* **Core Question:** Which dimension of the representation has degraded?

### Layer 3: Decision ($\text{EVSI}$)
* **Core Question:** Is the value of recovering the lost information worth the computational cost?

Previously, $\alpha$ attempted to address all three concerns simultaneously. Decoupling them allows us to model observability independently of decision value.

---

## 4. Architectural Interpretation of Code Fixes

The type fixes applied to Batch-008/009 are conceptually aligned with this paradigm shift. The compilation errors arose because:
\[
\text{Expected Representation} \neq \text{Actual Representation}
\]
By aligning the type definitions (`Record<string, ScoreRow>` instead of `Record<string, ScoreRow[]>`), we aligned the assumed model with the observed reality. This mirrors the primary objective of TAKT: ensuring the system's internal representation matches the causal structure of the environment.

---

## 5. Cumulative Experimental Status

| Batch | Theoretical Transition | Demonstrated Outcomes / Learnings |
|---|---|---|
| **002** | $\text{Friction} \rightarrow \text{Context}$ | Properties depend fundamentally on topology and context. |
| **007** | $\text{Reliability} \rightarrow \text{Temporal Relation}$ | Reliability metrics require temporal comparison. |
| **008/009** | $\text{Risk} \rightarrow \text{Causal Structure}$ | Central tendency aggregation hides causal relevance. Causal impact helps but hits a ceiling. |
| **009.1** | $\text{Estimator} \rightarrow \text{Representation}$ | The $\rho$ vector does not contain the lost information; the bottleneck is the representation. |
| **010** | $\text{Representation} \rightarrow \text{Observability Governance}$ | Observability must be measured as a state vector transition ($\Delta\Omega$). |

---

## 6. The Central Hypothesis

The core hypothesis of TAKT can now be stated compactly:
\[
\boxed{
\text{Intelligence} \neq \text{Maximum Information Preservation}
}
\]
\[
\boxed{
\text{Intelligence} = \text{Ability to govern its own representational limits}
}
\]

An intelligent agent does not need to avoid losing information; indeed, any finite agent must project. Rather, it needs to know when the information it preserves is no longer sufficient for decision-making. 

This completes the transition from **Risk Estimation** to **Observability Governance**.

Executing Batch-010 will test this directly:
* **If $\exists i \in \Omega : \text{Loss}_i > \varepsilon_i \land \alpha \leq \tau$ (i.e. $\Delta\Omega > \varepsilon$ when $\alpha \leq \tau$):** We prove that observability ($\Delta\Omega$) is an independent dimension of risk, preceding and enabling decision value estimation.
* **If not ($\Delta\Omega \approx 0$ under corruption):** We prove that there is epistemic uncertainty that is fundamentally unobservable from within the system. This shifts the architectural requirement from **Detection & Correction** to **Irreducible Uncertainty Governance (Robustness)**.
