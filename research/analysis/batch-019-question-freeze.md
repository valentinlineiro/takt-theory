# Batch-019 Question Freeze — Compositional Path Sufficiency

## 1. Origin

Batch-018 falsified the hypothesis that local relative distance coordinate multisets ($R_{dist}$) achieve global decision sufficiency ($\varepsilon = 15.58 > 0.00$), showing that residual symmetries allow decision regret to hide. This is because node-relative coordinates fail to capture **algebraic path composition**: how attributes are ordered and grouped along directed paths feeding the utility function $U$.

Batch-019 tests whether a **compositional path representation** ($X_{path}$) breaks the residual symmetries and reduces the global regret bound.

---

## 2. Core Question

We formulate the candidate representation $X_{path}$ as the canonical set of directed active paths from source `'s'` to target `'t'` of length $\le L$:
\[
X_{path}(S) = \left\{ \left( \ell(p), \text{Seq} [ pFail(v), \ Pr(v), \ C(v) ]_{v \in p} \right) : p: s \leadsto t, \ \ell(p) \le 3 \right\}
\]

Two graphs $S_1$ and $S_2$ share the same path representation $X_{path}(S_1) = X_{path}(S_2)$ if they contain the identical multiset of attribute sequences along their paths.

**Can we prove that the compositional representation $R_{path} = R_{dist} \oplus X_{path}$ reduces the global regret bound relative to $R_{dist}$?**
\[
\boxed{
\exists X_{path} : \varepsilon(R_{dist} \oplus X_{path}) < \varepsilon(R_{dist})
}
\]

And does it achieve complete global decision sufficiency?
\[
\boxed{
\varepsilon(R_{dist} \oplus X_{path}) = 0.00
}
\]

---

## 3. Outcome Regimes

### Scenario A — Compositional Sufficiency (Symmetry Closed)
* **Condition**: Appending $X_{path}$ successfully collapses the global regret bound to exactly **0.00**:
  \[
  \varepsilon(R_{dist} \oplus X_{path}) = 0.00
  \]
* **Implication**: Decisional sufficiency is achieved by matching the computational structure of the decision function directly, rather than reconstructing the full graph state.

### Scenario C — Residual Symmetries
* **Condition**: The global regret bound remains greater than $0.00$:
  \[
  \varepsilon(R_{dist} \oplus X_{path}) > 0.00
  \]
* **Implication**: Path sequences alone are still insufficient; some deeper global graph properties (e.g. branch structures or joint probabilities) continue to hide regret.
