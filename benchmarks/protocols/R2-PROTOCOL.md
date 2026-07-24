# TAKT R2 Structural Invariance Experimental Protocol

> **Document Status:** Pre-Registered R2 Experimental Protocol (Exogenous Domain Generalization)  
> **Theory Baseline:** TAKT-v1.2.0 Frozen Core  
> **Git Commit Tag:** `v1.2.0`

---

## 1. Experimental Objective

To test whether the fundamental law of structural sufficiency:

$$\text{ker}(R) \subseteq K_D \implies \text{Regret}(R) = 0$$

holds universally across exogenous, non-vectorial domain families without adjusting or re-tuning the core TAKT theoretical model.

---

## 2. Experimental Hypotheses

- **Null Hypothesis ($H_0$):** Decision preservation under state compression is an artifact of synthetic benchmark design; it degrades or fails when applied to exogenous domains.
- **Alternative Hypothesis ($H_1$):** For all exogenous domains $\mathcal{D}$, structural sufficiency $\text{ker}(R) \subseteq K_D$ guarantees zero decision regret, while insufficient representations $\text{ker}(R) \not\subseteq K_D$ exhibit non-zero regret ($\text{Regret} > 0$).

---

## 3. Exogenous Domain Families

1. **Domain A — Classical Planning (STRIPS / Search):** State space $S$ defined over world proposition predicates; decision $D(S)$ is optimal action selection.
2. **Domain B — Distributed Consensus (Faults & Messages):** State space $S$ defined over node topology, network latency, and fault logs; decision $D(S)$ is safe consensus action.
3. **Domain C — Adaptive Resource Agents (EVSI Control):** State space $S$ defined over uncertainty state and resource constraints; decision $D(S)$ is rational information acquisition action.

---

## 4. Decoupled Domain Adapter Interface

```typescript
export interface DecisionDomain<S, A> {
  generateState(): S;
  oracle(state: S): A;
  availableRepresentations(): Array<{
    id: string;
    type: 'sufficient' | 'insufficient' | 'excessive';
    project(state: S): unknown;
  }>;
}
```

---

## 5. Pre-Registered 3-Representation Evaluation Pattern

For each exogenous domain $\mathcal{D}$:
- **$R_1$ (Sufficient):** $\text{ker}(R) \subseteq K_D \implies \text{Expected Regret} = 0$, Low Transformation Friction.
- **$R_2$ (Insufficient):** $\text{ker}(R) \not\subseteq K_D \implies \text{Expected Regret} > 0$.
- **$R_3$ (Excessive):** $\text{ker}(R) \subset K_D \implies \text{Expected Regret} = 0$, High Transformation Friction ($C_{\text{trans}} \uparrow$).

---

## 6. Publication Outcomes

- **R2-PASS:** All exogenous domains exhibit $\text{Regret}(R_1) = 0$, $\text{Regret}(R_2) > 0$, $C_{\text{trans}}(R_3) > C_{\text{trans}}(R_1)$.
- **R2-PARTIAL:** Structural invariance holds in a subset of domain families (validity boundary identified).
- **R2-FAIL:** Boundary fails to discriminate or requires domain-specific theoretical modification.
