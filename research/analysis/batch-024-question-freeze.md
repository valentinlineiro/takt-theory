# Batch-024 Question Freeze — Admissibility and Computational Minimality

## 1. Origin

Batch-023 established that $R_{minimal} = X_{path} \oplus X_{reach}$ (412 bins) refines the decision kernel $\ker(D_{opt})$ perfectly (0 decision conflicts) but is strictly finer than the exact utility kernel $\ker(D_{util})$ (38 bins) and the optimal action kernel ($2$ bins). However, it remains open whether there exists a coarser, cheaper representation $2 < |Z| < 412$ that is decision-sufficient under a formally defined class of **admissible representations** $\mathcal{R}_{admissible}$.

Batch-024 formalizes representation admissibility and evaluates partition compression under extraction constraints.

---

## 2. Core Question

We define the class of **local admissible representations ($\mathcal{R}_{local}$)** as functions $R(S)$ that can be computed by evaluating only structural invariants (paths and node properties) without executing the full utility expectation formula $U(S, a)$.

Specifically, we evaluate if we can merge the 412 fibers of $R_{minimal}$ by defining a **coarsened reachability invariant $X_{coarse}$**:
* Instead of capturing the exact reachability indicator for *every* individual failed node under *each* action, we group failed nodes by their failure probabilities and capture only the aggregate count of failed nodes that have a path to `'t'`.
* This yields $R_{coarse} = X_{path} \oplus X_{coarse\_reach}$.

**Can we find an admissible representation $R_{coarse} \in \mathcal{R}_{local}$ that achieves global decision sufficiency ($\varepsilon = 0.00$) with a partition cardinality strictly smaller than 412 bins?**
\[
\boxed{
\exists R_{coarse} \in \mathcal{R}_{local} : \varepsilon(R_{coarse}) = 0.00 \quad \text{and} \quad |R_{coarse}(\mathcal{S})| < 412
}
\]

---

## 3. Outcome Regimes

### Scenario A — Coarsened Sufficiency Confirmed
* **Condition**: $R_{coarse}$ achieves $\varepsilon = 0.00$ with partition size $N_{coarse} < 412$.
* **Implication**: We prove that exact node-by-node reachability is redundant for decision safety, and aggregate reachability counts are sufficient.

### Scenario C — Node-Specific Resolution Required
* **Condition**: Deleting node-specific reachability identifiers causes decision conflicts ($\varepsilon > 0.00$).
* **Implication**: Decision safety requires preserving the exact mapping of specific failure rates to their reachability status, establishing 412 as the lower bound for partition cardinality within this local invariant class.
