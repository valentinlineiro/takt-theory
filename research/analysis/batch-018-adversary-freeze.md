# Batch-018 Adversary Search Freeze — Equivalence-Class Clustering Protocol

## 1. Goal

This document freezes the equivalence-class clustering algorithm and the optimized $O(N)$ regret bound calculation to map $\varepsilon(R_i)$ over the 38,760 configurations.

---

## 2. Equivalence Class Grouping

For each representation $R_i \in \{R_0, R_1, R_2, R_{dist}\}$:
1. Construct the representation key $key_i(S)$ for all $S \in \mathcal{S}_{018}$ by serializing the observable snapshot metrics at $k = 2$:
   * For $R_0$: structural metrics and capabilities.
   * For $R_1$: structural metrics, capabilities, and $X_1$.
   * For $R_2$: structural metrics, capabilities, and $X_2$.
   * For $R_{dist}$: structural metrics, capabilities, and the sorted multiset of relative distance signature tuples: `(pFail, Pr, Caps, ds, dt)`.
2. Group all configurations into equivalence classes (bins) sharing the same representation key:
   \[
   Bin_z = \{ S \in \mathcal{S}_{018} : key_i(S) = z \}
   \]

---

## 3. Bounded Regret Calculation Algorithm

For each bin $Bin_z$, we calculate the worst-case regret:
1. If all configurations $S \in Bin_z$ share the same optimal action $a^*(S) = a_0$, the regret is exactly $0.00$.
2. If there exist configurations with different optimal actions (i.e. both $T_0$ and $T_1$ are optimal for different states in the bin):
   * For each configuration $S \in Bin_z$:
     * The regret of confusing it is:
       \[
       Regret(S) = U(S, a^*(S)) - U(S, \text{alt})
       \]
       where $\text{alt} \in \mathcal{A}$ is the alternative action ($\text{alt} \neq a^*(S)$).
   * The maximum regret in $Bin_z$ is:
     \[
     \varepsilon(Bin_z) = \max_{S \in Bin_z} Regret(S)
     \]
3. The global representational regret bound is the maximum over all bins:
   \[
   \varepsilon(R_i) = \max_z \varepsilon(Bin_z)
   \]

---

## 4. Integrity and Mutation Prohibition

The clustering keys, optimization algorithms, and parameters are locked. No adjustments to metric tolerances or utility fallbacks are permitted during the execution phase.
