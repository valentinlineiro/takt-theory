# Volume II — Geometry of Representation Spaces Induced by Cost Functionals

**Version:** 1.0 (Canonical Foundation)  
**Status:** Frozen Foundation  
**Language:** English (Canonical)  

---

## 1. Motivation and Epistemological Transition

In **Volume I**, the core research question centered on *decisional sufficiency*:

> **Which information structures are sufficient to resolve a given decision?**

Mathematically, this established the boundaries of sufficiency under a decision $D$ over a state space $S$, identifying a unique minimal sufficient representation $R_{\min}$ defined by the intersection of capability kernels ($K_D$).

In **Volume II**, the query shifts from the sufficiency of a single representation to the mathematical structure of the space of all possible representations when evaluated by operational constraints:

> **What is the geometric and algebraic structure of the space of all possible representations?**

Instead of studying individual representations in isolation, Volume II treats the pre-ordered space of representations as a domain over which **cost functionals** act. The introduction of these functionals induces a topology—a geometric "landscape"—characterized by equivalence regions, transition boundaries, and stability basins. This volume formalizes the operator theory over representation spaces, establishing how operational costs (computation, storage, safety margins) warp the space and dictate the location of the optimal representation ($R^*$).

---

## 2. Representation Spaces

We define representation spaces independently of concrete implementations or coordinate systems.

### 2.1 State Space
Let $S$ be a state space representing the underlying operational universe of the system. We assume no topological or metric structure on $S$ unless explicitly stated.

### 2.2 Representations and Kernel Equivalence
A **representation** $R$ is a mapping:

$$
R : S \to Z
$$

where $Z$ is an arbitrary set of codes. Two representations $R_1 : S \to Z_1$ and $R_2 : S \to Z_2$ are defined as **kernel-equivalent** if they partition the state space $S$ in exactly the same way:

$$
R_1 \sim_{\ker} R_2 \iff \ker(R_1) = \ker(R_2)
$$

where the kernel is the equivalence relation:

$$
\ker(R) := \{ (s_1, s_2) \in S \times S : R(s_1) = R(s_2) \}
$$

The canonical representation object is the equivalence class $[R] \in \mathcal{R} / \sim_{\ker}$. This abstract representation space $\mathcal{R}$ is the quotient space of all possible partitions of $S$.

### 2.3 Refinement Preorder
We equip $\mathcal{R}$ with a natural **refinement preorder** $\sqsubseteq$:

$$
[R_1] \sqsubseteq [R_2] \iff \ker(R_2) \subseteq \ker(R_1)
$$

Under this preorder:
*   $[R_1] \sqsubseteq [R_2]$ indicates that $R_1$ is **coarser** than or equal to $R_2$ (it makes fewer distinctions, aggregates more states, and discards more information).
*   Conversely, $R_2$ is **finer** than $R_1$ (it preserves more details).

*Note on Lattices:* While the set of all partitions $\Pi(S)$ form a complete lattice under refinement, we do not assume the restricted space of interest $\mathcal{R}$ is a lattice. We operate on a generic preorder $(\mathcal{R}, \sqsubseteq)$, specializing to lattices only when concrete partition realizations (e.g., `FinitePartitionRepresentation`) are introduced for runtime computation.

---

## 3. Cost Functionals

Operational trade-offs are introduced via cost functionals that map representation classes to a cost domain.

### 3.1 Definition of a Cost Functional
A **cost functional** is a mapping:

$$
c : \mathcal{R} \to L
$$

where $(L, \sqsubseteq_L)$ is a pre-ordered space of costs. 

To maintain strict mathematical generality, we do not assume $L = \mathbb{R}$ or even that $L$ is totally ordered. The preorder $(L, \sqsubseteq_L)$ allows the cost domain to represent:
*   **Ordinal Costs:** Simple preference relations.
*   **Vector-Valued Costs:** Multiobjective optimization spaces (e.g., $L = \mathbb{R} \times \mathbb{R}$ representing the Pareto frontier of latency vs. storage).
*   **Probabilistic/Uncertain Costs:** Safety margin distributions.

### 3.2 Monotonicity Properties
We classify cost functionals based on their compatibility with the information preorder:

#### Definition 3.1 (C0 - Cost Monotonicity)
A cost functional $c$ satisfies **C0 monotonicity** if:

$$
[R_1] \sqsubseteq [R_2] \implies c([R_1]) \sqsubseteq_L c([R_2])
$$

*Intuition:* Refining a representation (adding information or making more distinctions) never reduces the cost. Under C0, the minimal sufficient representation $R_{\min}$ is always a global optimum.

#### Definition 3.2 (C0' - Strict Monotonicity)
A cost functional $c$ satisfies **C0' strict monotonicity** if:

$$
[R_1] \sqsubset [R_2] \implies c([R_1]) \sqsubset_L c([R_2])
$$

where $[R_1] \sqsubset [R_2] \iff ([R_1] \sqsubseteq [R_2] \land [R_2] \not\sqsubseteq [R_1])$.

---

## 4. Cost Morphisms

We define three canonical morphisms on the space of cost functionals $\mathcal{C} = \{ c : \mathcal{R} \to L \}$. These morphisms extract distinct categories of structure from a cost functional.

```
                  Cost Functionals Space (C)
                 /             |            \
                /              |             \
        Morphism Φ         Morphism Ψ         Morphism Θ
              /                |               \
             v                 v                v
      Optimal Subset    Induced Preorder   Distortion Field
```

### 4.1 The Decisional Morphism ($\Phi$)
The decisional morphism maps a cost functional to the subset of sufficient representations that minimize it:

$$
\Phi : \mathcal{C} \to \mathcal{P}(\mathcal{R}_{\text{sufficient}}(D))
$$

$$
\Phi(c) = \arg\min_{[R] \in \mathcal{R}_{\text{sufficient}}(D)} c([R])
$$

### 4.2 The Ordinal Morphism ($\Psi$)
The ordinal morphism maps a cost functional to the complete preorder structure it induces over the representation space:

$$
\Psi : \mathcal{C} \to \operatorname{Preorder}(\mathcal{R})
$$

where the relation $\sqsubseteq_{\Psi(c)}$ is defined by:

$$
[R_1] \sqsubseteq_{\Psi(c)} [R_2] \iff c([R_1]) \sqsubseteq_L c([R_2])
$$

### 4.3 The Distortion Morphism ($\Theta$)
The distortion morphism maps a cost functional to its quantitative local and global distortion fields:

$$
\Theta : \mathcal{C} \to \operatorname{Fields}(\mathcal{R})
$$

When $L$ is specialized to a valued poset (such as $\mathbb{R}_{\geq 0}$), the morphism evaluates the quantitative violation of C0 monotonicity. For $R_1 \sqsubseteq R_2$:

$$
\delta(c)(R_1, R_2) = \max(0, c([R_1]) - c([R_2]))
$$

The global distortion is the supremum over all pairs:

$$
\Delta(c) := \sup_{R_1 \sqsubseteq R_2} \delta(c)(R_1, R_2)
$$

---

## 5. Induced Kernels and Quotients

Morphisms define equivalence relations on the space of cost functionals $\mathcal{C}$ by filtering out irrelevant information. These equivalence relations are the **kernels** of the morphisms.

### 5.1 Decisional Kernel ($\equiv_{\Phi}$)
Two cost functionals are decisionally equivalent if they yield the same set of optimal sufficient representations:

$$
c_1 \equiv_{\Phi} c_2 \iff \Phi(c_1) = \Phi(c_2)
$$

The quotient space $\mathcal{C}/\!\equiv_{\Phi}$ represents the partition of the cost space into decision-invariant classes.

### 5.2 Structural / Ordinal Kernel ($\equiv_{\Psi}$)
Two cost functionals are structurally equivalent if they induce the identical preorder of preference over the representation space:

$$
c_1 \equiv_{\Psi} c_2 \iff \Psi(c_1) = \Psi(c_2)
$$

This quotient preserves the complete relative structure of costs but discards their quantitative scaling.

### 5.3 Stability / Distortional Kernel ($\equiv_{\Theta}$)
Two cost functionals are stability-equivalent if they produce the same local and global distortion fields:

$$
c_1 \equiv_{\Theta} c_2 \iff \Theta(c_1) = \Theta(c_2)
$$

### 5.4 Morphism Hierarchy
The kernels form a strict containment hierarchy:

$$
\equiv_{\Theta} \;\implies\; \equiv_{\Psi} \;\implies\; \equiv_{\Phi}
$$

Proof outline: If two costs have the same distortion field ($\equiv_{\Theta}$), they share the same relative ordering of cost changes ($\equiv_{\Psi}$), which in turn guarantees they share the same minimal optimal elements ($\equiv_{\Phi}$).

---

## 6. Geometry of Cost Landscapes

The cost functional $c$ warded on the pre-ordered space $(\mathcal{R}, \sqsubseteq)$ induces a **discrete landscape**. We characterize the geometry of this landscape through local order transitions.

### 6.1 Neighborhood and Refinement Paths
For a representation $[R]$, the immediate neighborhood consists of:
*   **Coarse Neighbors:** The set of representations that can be reached by a single merge operation (coarsening).
*   **Fine Neighbors:** The set of representations that can be reached by a single split operation (refining).

A refinement path is a chain $[R_0] \sqsubseteq [R_1] \sqsubseteq \dots \sqsubseteq [R_n]$.

### 6.2 Basins of Stability
A **basin of stability** is a region $U \subseteq \mathcal{R}$ such that the optimal set $\Phi(c)$ remains invariant under perturbations of $c$ restricted to $U$.

### 6.3 Local Minima and Critical Points
A representation $[R]$ is a **local minimum** of a cost landscape $c$ if it is cheaper than all its immediate neighbors. In non-monotonic cost landscapes (Regime II), critical representations emerge at the boundaries between intrinsic cost savings (storage) and extrinsic penalties (decision collisions).

### 6.4 Computability Bridge to the Runtime
The general preorder-based geometry outlined here is specialized in the execution layer (`takt` runtime) as a finite, discrete partition lattice. The runtime's `FinitePartitionRepresentation` implements the algorithms (Landscape Explorer, Monte Carlo sweeps) by translating these abstract geometric definitions into computable graph search problems.

---

## 7. Stability Theory and Epistemological Alignment

### 7.1 Stability Theory
Stability theory analyzes the behavior of optimal representations under cost functional perturbations. 

**Theorem 7.1 (Stability Bounds).** Let $c$ be a cost functional valued in $\mathbb{R}_{\geq 0}$ with global distortion $\Delta(c) \leq \epsilon$. For any optimal representation $R^*$ and the minimal sufficient representation $R_{\min}$, the following bound holds:

$$
c(R^*) \geq c(R_{\min}) - \epsilon
$$

*Proof:*
1. By Volume I, $R_{\min}$ is the unique minimum of the sufficient upset $\mathcal{R}_{\text{sufficient}}(D)$, implying $R_{\min} \sqsubseteq R^*$.
2. By definition of global distortion $\Delta(c)$:
   $$c(R_{\min}) - c(R^*) \leq \delta(c)(R_{\min}, R^*) \leq \Delta(c) \leq \epsilon$$
3. Rearranging yields:
   $$c(R^*) \geq c(R_{\min}) - \epsilon$$
   $\blacksquare$

This theorem guarantees that if the non-monotonic distortion of a cost functional is bounded by $\epsilon$, the operational penalty of using the structurally simple $R_{\min}$ instead of the absolute optimum $R^*$ is acotated by $\epsilon$.

### 7.2 Epistemological Alignment: Volume I vs. Volume II

The transition between the two volumes represents a progression from logical structure to geometric evaluation:

| Dimension | Volume I (Sufficiency) | Volume II (Geometry) |
| :--- | :--- | :--- |
| **Central Object** | Core Representation $R$ | Cost Operator $c : \mathcal{R} \to L$ |
| **Underlying Space** | Partition subset $\mathcal{R}_{\text{sufficient}}(D)$ | The entire preorder $(\mathcal{R}, \sqsubseteq)$ |
| **Key Invariant** | Sufficiency Boundary ($K_D$) | Morphism Kernels ($\equiv_{\Phi}, \equiv_{\Psi}, \equiv_{\Theta}$) |
| **Operational Target** | Minimizing information loss | Balancing information vs. execution cost |
| **Halting Condition** | $G(D, R) = \emptyset$ (No gap) | $\Delta \text{Guarantee} / \Delta \text{Cost} \to 0$ (Saturation) |

---

## Appendix: Categorical Interpretation

For future formalizations, the preorder representation space can be modeled as a category $\mathbf{Rep}$ where:
*   **Objects:** Representations $[R]$.
*   **Morphisms:** A unique arrow $[R_1] \to [R_2]$ exists if and only if $[R_1] \sqsubseteq [R_2]$.
*   **Cost Functor:** A cost functional $c$ is a functor $c : \mathbf{Rep} \to \mathbf{Cost}$, where $\mathbf{Cost}$ is the category induced by the preorder $(L, \sqsubseteq_L)$.
*   **Kernels as Pullbacks:** Morphism equivalence classes are constructed as categorical pullbacks, ensuring the quotient structures satisfy standard universal factorization properties.
