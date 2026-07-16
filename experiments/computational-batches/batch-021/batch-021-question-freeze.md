# Batch-021 Question Freeze — Action-Conditioned Causal Reachability

## 1. Origin

Batch-020 successfully reduced the maximum regret bound for the first time ($\varepsilon = 15.58 \rightarrow 13.58$) by incorporating observational activation semantics. However, a residual regret of 13.58 remains because representation signatures are blind to the **composition of failure propagation and actions**. Specifically, whether a failed node's path to target `'t'` is active or blocked depends on the specific action-conditioned reachability paths.

Batch-021 evaluates whether an **action-conditioned causal reachability invariant** ($X_{reach}$) closes this residual gap.

---

## 2. Core Question

For each action $a \in \mathcal{A}$ and each observed node $v$ with $pFail(v) > 0$, we define the indicator $\mathbf{1}[v \leadsto_a t]$ representing whether there exists a directed path from $v$ to `'t'` using only the active observed edges of action $a$.

The label-blind signature $X_{reach}(S)$ collects the multiset of:
\[
X_{reach}(S) = \left\{ \Big( a, \ pFail(v), \ Pr(v), \ \mathbf{1}[v \leadsto_a t] \Big) : v \in O_2(S), \ pFail(v) > 0, \ a \in \mathcal{A} \right\}
\]

**Can we prove that the causal reachability-refined representation $R_{reach} = R_{active} \oplus X_{reach}$ reduces the global regret bound?**
\[
\boxed{
\exists X_{reach} : \varepsilon(R_{active} \oplus X_{reach}) < 13.58
}
\]

And does it achieve complete global decision sufficiency?
\[
\boxed{
\varepsilon(R_{active} \oplus X_{reach}) = 0.00
}
\]

---

## 3. Outcome Regimes

### Scenario A — Causal Reachability Sufficiency (Symmetry Closed)
* **Condition**: Appending $X_{reach}$ collapses the global regret bound to exactly **0.00**:
  \[
  \varepsilon(R_{active} \oplus X_{reach}) = 0.00
  \]
* **Implication**: Decisional sufficiency is achieved by preserving how action selections filter failure risk propagation to target landmarks.

### Scenario C — Residual Symmetries
* **Condition**: The global regret bound remains greater than $0.00$:
  \[
  \varepsilon(R_{active} \oplus X_{reach}) > 0.00
  \]
* **Implication**: Risk propagation contains topological dependencies beyond binary connectivity (such as path lengths or joint failure probabilities) that continue to hide regret.
