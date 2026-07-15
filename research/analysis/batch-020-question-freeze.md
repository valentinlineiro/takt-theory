# Batch-020 Question Freeze — Observational Activation Sufficiency

## 1. Origin

Batch-019 falsified global path sufficiency ($\varepsilon(R_{path}) = 15.58 > 0.00$), showing that paths and landmark coordinates are insufficient if the representation fails to align with the **observation operator** $O_k(S)$. Because $O_k$ is undirected, target nodes can fall inside or outside the observer's horizon $k$, silently changing active edge costs and failure risks.

Batch-020 addresses this gap directly by introducing an **observation-aware activation representation** ($X_{activation}$).

---

## 2. Core Question

Let $O_k(S)$ be the observed subgraph at depth $k=2$. The active sub-graph for action $a \in \mathcal{A}$ under representation $S$ is:
\[
Active_a(S) = O_k(S) \cap candidate\_active\_geometry(a)
\]
We define $X_{activation}(S)$ as the canonical representation of the active observed nodes and edges for all actions $a \in \mathcal{A}$:
\[
X_{activation}(S) = \Big( Sign(Active_{T_0}(S)), \ Sign(Active_{T_1}(S)) \Big)
\]
where the signature of each active subgraph includes:
* The count and attributes of active nodes that are observed.
* The count of active edges that are observed.
* The simple paths from source `'s'` to target `'t'` formed by observed active edges, along with their attribute sequences.

**Can we prove that the activation-aware representation $R_{active} = R_{path} \oplus X_{activation}$ reduces the global regret bound?**
\[
\boxed{
\exists X_{activation} : \varepsilon(R_{path} \oplus X_{activation}) < \varepsilon(R_{path})
}
\]

And does it achieve complete global decision sufficiency?
\[
\boxed{
\varepsilon(R_{path} \oplus X_{activation}) = 0.00
}
\]

---

## 3. Outcome Regimes

### Scenario A — Activation Sufficiency (Symmetry Closed)
* **Condition**: Appending $X_{activation}$ collapses the global regret bound to exactly **0.00**:
  \[
  \varepsilon(R_{path} \oplus X_{activation}) = 0.00
  \]
* **Implication**: Decision sufficiency is achieved by matching both the path geometry and the observational limits of the active structure.

### Scenario C — Residual Symmetries
* **Condition**: The global regret bound remains greater than $0.00$:
  \[
  \varepsilon(R_{path} \oplus X_{activation}) > 0.00
  \]
* **Implication**: Even with activation-aware properties, some deeper global properties continue to escape the representation.
