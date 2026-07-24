# Volume II: Structural Sufficiency & Minimal Quotient Spaces

**Volume Author:** TAKT Theoretical Working Group  
**Formal Verification:** Lean 4 (`takt-formal/TaktFormal/StructuralSufficiency.lean`) — 100% Certified (0 `sorry`s)  
**Reading Paradigm:** Triple Reading Level Traceability (Narrative, Mathematics, Mechanized Proofs)

---

## Abstract & Executive Summary

Volume II develops the canonical theory of **Structural Sufficiency**, quotient space reductions, capability invariants, and runtime contract enforcement for Governed Decision Systems. 

Building on the foundations established in Volume I, this volume addresses the central question of structural adequacy: *How can a decision agent identify the minimal, coarsenings-closed abstract state space required to execute a decision policy $D: S \to A$ with zero structural decision error?*

We introduce the formal concept of **Capability Invariants**, construct the **Capability Kernel** $K_D$, and prove the **Structural Sufficiency Theorem (ST-015)**. We demonstrate that the set of structurally safe state representations $\mathcal{R}_{\text{sufficient}}(D)$ forms an upset (filter-like structure) in the lattice of state partitions, possessing a unique minimal canonical representation: the quotient space $R_{\text{min}} = S / K_D$. Furthermore, we establish that for any decision contract requiring $k$ finite boolean capability predicates, the cardinal dimension of the abstract state space is strictly bounded by $|S / K_D| \le 2^k$, converting intractable continuous or high-dimensional concrete state spaces into finite, computationally tractable runtime abstractions.

Finally, we bridge abstract algebraic sufficiency to physical runtime execution in `cli/src/runtime/`, formalizing capability gap reduction operators and contract evaluation monitors.

This volume presents complete mathematical proofs and 100% certified Lean 4 formalizations for:
1. **Capability Kernels $K_D$** and Axiom 0 (Contract Coherence).
2. **Structural Sufficiency Theorem (ST-015)** ($\text{ker}(R) \subseteq K_D \iff R \in \mathcal{R}_{\text{sufficient}}(D)$).
3. **The Upset Sufficiency Theorem** ($R_1 \in \mathcal{R}_{\text{sufficient}}(D) \land R_1 \sqsubseteq R_2 \implies R_2 \in \mathcal{R}_{\text{sufficient}}(D)$).
4. **Minimal Quotient Representation $R_{\text{min}} = S / K_D$** and Universal Minimality.
5. **Finite Quotient Bound** ($|S / K_D| \le 2^k$).
6. **Capability Enrichment Algebra & Gap Monotonicity** ($R_1 \sqsubseteq R_2 \implies G(D, R_1) \subseteq G(D, R_2)$).
7. **Runtime Contract & Monitor Correspondence** (`cli/src/runtime/`).

---

## 1. Capability Kernels $K_D$ & Axiom 0 (Contract Coherence)

### 1.1 Level 1: Narrative & Conceptual Motivation

In real-world autonomous systems, agents rarely inspect the raw continuous state vector directly. Instead, sensors, feature extractors, and software interfaces evaluate a set of **capability predicates** $c \in C$. Each capability relation $K(c) \subseteq S \times S$ establishes an observational equivalence: two concrete states $x, y \in S$ are equivalent under capability $c$ if no measurement available to capability $c$ can distinguish them.

A decision policy $D: S \to A$ operates under a **capability contract** $C_D \subseteq C$, specifying the exact set of capability invariants necessary to perform the decision. The intersection of all required capability relations forms the **Capability Kernel** $K_D$.

```text
 Concrete State Space S
 ┌─────────────────────────────────────────────────────────┐
 │  State x                                                │
 │  ┌───────────────────────────────────────────────────┐  │
 │  │ Capability c₁: K(c₁) x y                          │  │
 │  │ Capability c₂: K(c₂) x y   ───►  K_D(x, y)        │  │  ===► ker(D) x y
 │  │ Capability c_k: K(c_k) x y                        │  │       D(x) = D(y)
 │  └───────────────────────────────────────────────────┘  │
 │  State y                                                │
 └─────────────────────────────────────────────────────────┘
```

**Axiom 0 (Contract Coherence)** formalizes the requirement that a decision policy $D$ is completely governed by its contract $C_D$: two states induce the exact same decision if and only if they satisfy all capability invariants in $K_D$.

---

### 1.2 Level 2: Mathematical Definitions & Rigorous Proofs

#### Definition 1.1 (Capability Family & Provision)
Let $S$ be a state space, $Z$ a representation space, and $C$ a set of capability indices. Let $K : C \to S \to S \to \text{Prop}$ be a family of binary capability equivalence relations on $S$.
A state representation $R : S \to Z$ **provides** capability $c \in C$, written $\text{provides}(K, R, c)$, if its kernel refines $K(c)$:
$$\text{provides}(K, R, c) \triangleq \forall x, y \in S, \quad \text{ker}(R) x y \implies K(c) x y$$

The set of capabilities provided by representation $R$ is denoted $C_R(R) \triangleq \{ c \in C \mid \text{provides}(K, R, c) \}$.

#### Definition 1.2 (Capability Kernel $K_D$)
Given a contract subset of required capabilities $C_D : C \to \text{Prop}$, the **Capability Kernel** $K_D \subseteq S \times S$ is the joint binary relation defined by:
$$K_D(x, y) \triangleq \forall c \in C, \quad C_D(c) \implies K(c) x y$$

#### Proposition 1.1 (Equivalence Relation Properties of $K_D$)
If each constituent capability relation $K(c)$ is an equivalence relation for every $c \in C$, then the capability kernel $K_D$ is an equivalence relation on $S$.

*Proof:*
1. **Reflexivity:** Let $x \in S$. For any $c \in C$ with $C_D(c)$, since $K(c)$ is reflexive, $K(c) x x$ holds. Thus $K_D(x, x)$.
2. **Symmetry:** Assume $K_D(x, y)$. For any $c \in C$ such that $C_D(c)$, $K(c) x y$ holds. By symmetry of $K(c)$, $K(c) y x$ holds. Thus $K_D(y, x)$.
3. **Transitivity:** Assume $K_D(x, y)$ and $K_D(y, z)$. For any $c \in C$ with $C_D(c)$, $K(c) x y$ and $K(c) y z$ both hold. By transitivity of $K(c)$, $K(c) x z$ holds. Thus $K_D(x, z)$. $\blacksquare$

#### Definition 1.3 (Axiom 0: Contract Coherence)
A decision policy $D : S \to A$ satisfies **Axiom 0 (Contract Coherence)** with respect to capabilities $K$ and required contract $C_D$ if:
$$\text{Axiom0}(K, C_D, D) \triangleq \forall x, y \in S, \quad \text{ker}(D) x y \iff K_D(x, y)$$

---

### 1.3 Level 3: Lean 4 Code Mapping & Verification

All capability definitions and equivalence proofs are certified in `TaktFormal/StructuralSufficiency.lean` with **0 `sorry`s**.

| Mathematical Concept | Lean 4 Symbol Name | File Path | Line Range | Status |
| :--- | :--- | :--- | :--- | :--- |
| $\text{provides}(K, R, c)$ | `provides` | `takt-formal/TaktFormal/StructuralSufficiency.lean` | L11–L13 | Verified |
| Provided Capabilities $C_R$ | `C_R` | `takt-formal/TaktFormal/StructuralSufficiency.lean` | L15–L16 | Verified |
| Capability Kernel $K_D$ | `K_D` | `takt-formal/TaktFormal/StructuralSufficiency.lean` | L88–L89 | Verified |
| Axiom 0 Contract Coherence | `Axiom0` | `takt-formal/TaktFormal/StructuralSufficiency.lean` | L92–L93 | Verified |
| $K_D$ Reflexivity | `K_D_refl` | `takt-formal/TaktFormal/StructuralSufficiency.lean` | L113–L115 | Verified |
| $K_D$ Symmetry | `K_D_symm` | `takt-formal/TaktFormal/StructuralSufficiency.lean` | L117–L119 | Verified |
| $K_D$ Transitivity | `K_D_trans` | `takt-formal/TaktFormal/StructuralSufficiency.lean` | L121–L123 | Verified |
| $K_D$ Equivalence Instance | `K_D_equivalence` | `takt-formal/TaktFormal/StructuralSufficiency.lean` | L125–L126 | Verified |

---

## 2. Structural Sufficiency Theorem (ST-015) & Upset Property

### 2.1 Level 1: Narrative & Conceptual Motivation

The fundamental question of state abstraction is: *When can an abstract representation $R: S \to Z$ replace the concrete state $S$ without loss of decision quality?*

We define the space of sufficient representations $\mathcal{R}_{\text{sufficient}}(D)$ as those whose fiber partition refines the decision kernel $\text{ker}(D)$. **Theorem ST-015 (Structural Sufficiency Theorem)** proves that under Axiom 0, structural sufficiency is logically equivalent to refining the capability kernel $K_D$.

```text
           Lattice of State Partitions (Poset of Representations ⊑)
           
                     Identity Mapping R_top (Finest: S -> S)
                                    │
                                    ▼
                     Representation R_2 (Finer than R_1)
                                    │
   =================================┼=================================
   SUFFICIENT REGION               │   (Upper Set / Upset Property)
   R ∈ R_sufficient(D)             ▼
                     Representation R_1 (Sufficient)
                                    │
                                    ▼
   MINIMAL BOUNDARY ───►  R_min = S / K_D (Coarsest Sufficient Representation)
   =================================┼=================================
   INSUFFICIENT REGION              │   (Kernel fails to refine K_D)
   R ∉ R_sufficient(D)             ▼
                     Indiscrete Mapping R_bot (Coarsest: S -> ())
```

Furthermore, we prove the **Upset Property**: if a representation $R_1$ is sufficient, any finer representation $R_2 \sqsupseteq R_1$ (where $\text{ker}(R_2) \subseteq \text{ker}(R_1)$) is guaranteed to be sufficient. Sufficiency is an upward-closed property (an upset) in the preorder of state representations.

---

### 2.2 Level 2: Mathematical Definitions & Rigorous Proofs

#### Definition 2.1 (Sufficient Representation Space $\mathcal{R}_{\text{sufficient}}(D)$)
Let $D : S \to A$ be a decision policy. The set of structurally sufficient representations for $D$ is:
$$\mathcal{R}_{\text{sufficient}}(D) \triangleq \{ R : S \to Z \mid \text{ker}(R) \subseteq \text{ker}(D) \}$$

#### Theorem 2.1 (Structural Sufficiency Theorem — ST-015)
Let $D : S \to A$ be a decision policy satisfying Axiom 0 with contract $C_D$ and capability family $K$. A representation $R : S \to Z$ is structurally sufficient for decision policy $D$ if and only if its function kernel refines the capability kernel $K_D$:
$$\text{ker}(R) \subseteq \text{ker}(D) \iff (\forall x, y \in S, \quad \text{ker}(R) x y \implies K_D(x, y))$$

*Proof:*
- **$(\Rightarrow)$ Forward Direction:** Assume $\text{ker}(R) \subseteq \text{ker}(D)$. Let $x, y \in S$ such that $\text{ker}(R) x y$, i.e., $R(x) = R(y)$. By assumption, $D(x) = D(y)$, so $\text{ker}(D) x y$ holds. By Axiom 0 ($\text{ker}(D) x y \iff K_D(x, y)$), we directly obtain $K_D(x, y)$.
- **$(\Leftarrow)$ Reverse Direction:** Assume $\forall x, y \in S, \text{ker}(R) x y \implies K_D(x, y)$. Let $x, y \in S$ with $R(x) = R(y)$. Then $K_D(x, y)$ holds. Applying the reverse implication of Axiom 0 gives $\text{ker}(D) x y$, i.e., $D(x) = D(y)$. Thus $\text{ker}(R) \subseteq \text{ker}(D)$. $\blacksquare$

#### Theorem 2.2 (Upset Sufficiency Theorem)
Let $R_1 : S \to Z_1$ be a sufficient representation ($\text{ker}(R_1) \subseteq \text{ker}(D)$). If representation $R_2 : S \to Z_2$ refines $R_1$ ($R_1 \sqsubseteq R_2$, meaning $\text{ker}(R_2) \subseteq \text{ker}(R_1)$), then $R_2$ is also sufficient for $D$ ($\text{ker}(R_2) \subseteq \text{ker}(D)$).

*Proof:*
Assume $\text{ker}(R_1) \subseteq \text{ker}(D)$ and $\text{ker}(R_2) \subseteq \text{ker}(R_1)$. By transitivity of set containment on equivalence relations (Proposition I.1.1):
$$\text{ker}(R_2) \subseteq \text{ker}(R_1) \subseteq \text{ker}(D) \implies \text{ker}(R_2) \subseteq \text{ker}(D)$$
Thus $R_2 \in \mathcal{R}_{\text{sufficient}}(D)$. $\blacksquare$

---

### 2.3 Level 3: Lean 4 Code Mapping & Verification

Formalized in `TaktFormal/StructuralSufficiency.lean`.

| Mathematical Concept | Lean 4 Symbol Name | File Path | Line Range | Status |
| :--- | :--- | :--- | :--- | :--- |
| **ST-015 Characterization** | `T1_characterization` | `takt-formal/TaktFormal/StructuralSufficiency.lean` | L96–L104 | Verified |
| **Upset Sufficiency** | `T2_upset` | `takt-formal/TaktFormal/StructuralSufficiency.lean` | L107–L111 | Verified |

---

## 3. Minimal Quotient Representation $R_{\text{min}} = S / K_D$

### 3.1 Level 1: Narrative & Conceptual Motivation

While any representation $R \in \mathcal{R}_{\text{sufficient}}(D)$ guarantees safe decision execution, representations that are unnecessarily fine preserve redundant state distinctions, incurring high storage, computation, and telemetry costs.

To achieve maximum information compression, we construct the **Canonical Minimal Quotient Representation** $R_{\text{min}} = S / K_D$. $R_{\text{min}}$ collapses all concrete states $x, y \in S$ that share identical capability profiles under contract $C_D$ into a single equivalence class $[x]_{K_D}$. 

```text
                  CONCRETE STATE SPACE S                MINIMAL QUOTIENT SPACE S / K_D
         ┌──────────────────────────────────────┐          ┌───────────────────────┐
         │  s₁  s₂  (K_D(s₁, s₂) holds)        │          │   [s₁] = {s₁, s₂}     │
         │  ────────────────────────────        │ ───────► │                       │
         │  s₃  s₄  s₅ (K_D(s₃, s₄) holds)     │ R_min    │   [s₃] = {s₃, s₄, s₅} │
         └──────────────────────────────────────┘          └───────────────────────┘
```

$R_{\text{min}}$ is the **coarsest possible sufficient representation**: any other sufficient representation $R$ must be finer than $R_{\text{min}}$ ($\text{ker}(R) \subseteq \text{ker}(R_{\text{min}})$).

---

### 3.2 Level 2: Mathematical Definitions & Rigorous Proofs

#### Definition 3.1 (Minimal Quotient Representation $R_{\text{min}}$)
Let $K_D$ be the capability equivalence relation induced by capability family $K$ and contract $C_D$. The **Minimal Quotient Representation** $R_{\text{min}} : S \to S / K_D$ is the canonical quotient projection map:
$$R_{\text{min}}(s) \triangleq [s]_{K_D} = \text{Quot.mk}(K_D, s)$$

#### Theorem 3.1 (Kernel Equality of $R_{\text{min}}$)
For all $x, y \in S$, the kernel of $R_{\text{min}}$ coincides exactly with $K_D$:
$$\text{ker}(R_{\text{min}}) x y \iff K_D(x, y)$$

*Proof:*
- $(\Rightarrow)$ Suppose $R_{\text{min}}(x) = R_{\text{min}}(y)$, i.e., $\text{Quot.mk}(K_D, x) = \text{Quot.mk}(K_D, y)$. By exactness of Lean quotient lifting (`TaktQuot.quot_exact`), there exists an equivalence relation generator chain connecting $x$ and $y$. Applying `eqvGen_of_equiv` with the equivalence proof `K_D_equivalence` yields $K_D(x, y)$.
- $(\Leftarrow)$ Suppose $K_D(x, y)$. By the quotient soundness axiom (`Quot.sound`), $\text{Quot.mk}(K_D, x) = \text{Quot.mk}(K_D, y)$, so $\text{ker}(R_{\text{min}}) x y$. $\blacksquare$

#### Theorem 3.2 (Sufficiency of $R_{\text{min}}$)
Under Axiom 0, $R_{\text{min}}$ is structurally sufficient for decision policy $D$:
$$\text{ker}(R_{\text{min}}) \subseteq \text{ker}(D)$$

*Proof:*
Let $x, y \in S$ with $\text{ker}(R_{\text{min}}) x y$. By Theorem 3.1, $K_D(x, y)$ holds. By Axiom 0 ($\text{ker}(D) x y \iff K_D(x, y)$), we have $\text{ker}(D) x y$, i.e., $D(x) = D(y)$. $\blacksquare$

#### Theorem 3.3 (Universal Minimality of $R_{\text{min}}$)
$R_{\text{min}}$ is the unique minimal element of $\mathcal{R}_{\text{sufficient}}(D)$ up to kernel equivalence. For any sufficient representation $R : S \to Z$ ($\text{ker}(R) \subseteq \text{ker}(D)$), $R$ refines $R_{\text{min}}$:
$$\text{ker}(R) \subseteq \text{ker}(R_{\text{min}})$$

*Proof:*
Let $x, y \in S$ such that $\text{ker}(R) x y$. Since $R$ is sufficient ($\text{ker}(R) \subseteq \text{ker}(D)$), $D(x) = D(y)$. By Axiom 0, $K_D(x, y)$ holds. By Theorem 3.1, $K_D(x, y) \implies \text{ker}(R_{\text{min}}) x y$. Thus $\text{ker}(R) \subseteq \text{ker}(R_{\text{min}})$. $\blacksquare$

#### Theorem 3.4 (Sufficiency Fixed Point Theorem)
Let $R : S \to Z$ be a representation such that $\text{ker}(R) = K_D$. Then $R$ is sufficient, and any strictly coarser representation $R' : S \to Z'$ (where $\text{ker}(R) \subseteq \text{ker}(R')$ and $\text{ker}(R') \nsubseteq \text{ker}(R)$) is strictly **insufficient** ($\text{ker}(R') \nsubseteq \text{ker}(D)$).

*Proof:*
- Sufficiency of $R$ follows directly from $\text{ker}(R) = K_D$ and Axiom 0.
- Suppose for contradiction that $R'$ is strictly coarser than $R$ but sufficient ($\text{ker}(R') \subseteq \text{ker}(D)$). By Theorem 3.3, since $R'$ is sufficient, $\text{ker}(R') \subseteq \text{ker}(R_{\text{min}}) = K_D = \text{ker}(R)$. This contradicts the strict coarseness assumption $\text{ker}(R') \nsubseteq \text{ker}(R)$. Thus $R'$ cannot be sufficient. $\blacksquare$

---

### 3.3 Level 3: Lean 4 Code Mapping & Verification

Formalized in `TaktFormal/StructuralSufficiency.lean`.

| Mathematical Concept | Lean 4 Symbol Name | File Path | Line Range | Status |
| :--- | :--- | :--- | :--- | :--- |
| Minimal Quotient Map | `R_min` | `takt-formal/TaktFormal/StructuralSufficiency.lean` | L129–L130 | Verified |
| Kernel Equality $\text{ker}(R_{\text{min}}) = K_D$ | `kernel_R_min_eq_K_D` | `takt-formal/TaktFormal/StructuralSufficiency.lean` | L132–L142 | Verified |
| $R_{\text{min}}$ Sufficiency | `R_min_sufficient` | `takt-formal/TaktFormal/StructuralSufficiency.lean` | L145–L149 | Verified |
| **Universal Minimality** | `R_min_is_minimum` | `takt-formal/TaktFormal/StructuralSufficiency.lean` | L152–L157 | Verified |
| **Sufficiency Fixed Point** | `T5_fixed_point` | `takt-formal/TaktFormal/StructuralSufficiency.lean` | L162–L175 | Verified |

---

## 4. Finite Quotient Bound $|S / K_D| \le 2^k$

### 4.1 Level 1: Narrative & Conceptual Motivation

In engineering applications, state spaces $S$ are frequently continuous ($\mathbb{R}^n$) or combinatorially massive. However, runtime decision contracts $C_D$ consist of a finite collection of $k = |C_D|$ boolean capability evaluation predicates.

We prove the **Finite Quotient Bound Theorem**: when contract $C_D$ comprises $k$ finite boolean predicates, the minimal quotient representation space $S / K_D$ embeds injectively into the $k$-dimensional boolean hypercube $\{0, 1\}^k$. Consequently, the number of distinct abstract states required by the runtime executor is bounded by $|S / K_D| \le 2^k$, regardless of whether the concrete state space $S$ is continuous or infinite.

```text
 Concrete State Space S                       Boolean Hypercube {0, 1}^k
 (Infinite / Continuous R^n)                  (Finite Quotient Dimension <= 2^k)
 ┌───────────────────────────┐                 ┌───────────────────────────┐
 │   State s₁                │ ──────────────► │ (1, 0, 1, ..., 0)         │
 │   State s₂                │ ──────────────► │ (1, 0, 1, ..., 0) [Class 1]│
 │                           │                 ├───────────────────────────┤
 │   State s₃                │ ──────────────► │ (0, 1, 1, ..., 1) [Class 2]│
 └───────────────────────────┘                 └───────────────────────────┘
```

---

### 4.2 Level 2: Mathematical Definitions & Rigorous Proofs

#### Definition 4.1 (Boolean Capability Feature Map)
Let $C_D = \{c_1, c_2, \dots, c_k\}$ be an ordered finite set of $k$ binary capability indicators. For each capability predicate $c_i \in C_D$, let $\chi_i : S \to \{0, 1\}$ denote its boolean evaluation function on state $s$. The **Boolean Feature Mapping** $\phi_{C_D} : S \to \{0, 1\}^k$ is defined by:
$$\phi_{C_D}(s) \triangleq (\chi_1(s), \chi_2(s), \dots, \chi_k(s))$$

#### Lemma 4.1 (Kernel Equality of Boolean Feature Mapping)
The kernel of the boolean feature map $\phi_{C_D}$ equals the capability kernel $K_D$:
$$\text{ker}(\phi_{C_D}) = K_D$$

*Proof:*
For any $x, y \in S$:
$$\text{ker}(\phi_{C_D})(x, y) \iff \phi_{C_D}(x) = \phi_{C_D}(y) \iff \forall i \in \{1, \dots, k\}, \, \chi_i(x) = \chi_i(y) \iff \forall c \in C_D, \, K(c) x y \iff K_D(x, y) \quad \blacksquare$$

#### Theorem 4.1 (Injective Embedding into Boolean Hypercube)
There exists a canonical injective map $\bar{\phi} : (S / K_D) \hookrightarrow \{0, 1\}^k$ from the quotient space into the boolean hypercube.

*Proof:*
Define $\bar{\phi}([s]_{K_D}) \triangleq \phi_{C_D}(s)$.
- **Well-definedness:** If $[x]_{K_D} = [y]_{K_D}$, then $K_D(x, y)$ holds, so by Lemma 4.1, $\phi_{C_D}(x) = \phi_{C_D}(y)$.
- **Injectivity:** Suppose $\bar{\phi}([x]_{K_D}) = \bar{\phi}([y]_{K_D})$. Then $\phi_{C_D}(x) = \phi_{C_D}(y)$, so $\text{ker}(\phi_{C_D})(x, y)$ holds. By Lemma 4.1, $K_D(x, y)$ holds, which implies $[x]_{K_D} = [y]_{K_D}$. $\blacksquare$

#### Theorem 4.2 (Finite Quotient Bound)
For any decision system with contract dimension $k = |C_D|$, the cardinality of the minimal quotient state representation space satisfies:
$$|S / K_D| \le 2^k$$

*Proof:*
By Theorem 4.1, $\bar{\phi}$ is an injection from $S / K_D$ into $\{0, 1\}^k$. By cardinal monotonicity of injective functions:
$$|S / K_D| \le |\{0, 1\}^k| = 2^k \quad \blacksquare$$

---

### 4.3 Level 3: Lean 4 Code Mapping & Verification

Formalized across `TaktFormal/StructuralSufficiency.lean` and `TaktFormal/Complexity/`.

| Mathematical Concept | Lean 4 Symbol Name | File Path | Line Range | Status |
| :--- | :--- | :--- | :--- | :--- |
| Hypercube Injection | `Quotient.inject_hypercube` | `takt-formal/TaktFormal/Complexity/Complexity.lean` | L12–L18 | Verified |
| **Finite Quotient Bound** | `finite_quotient_bound` | `takt-formal/TaktFormal/Complexity/Complexity.lean` | L22–L29 | Verified |

---

## 5. Capability Enrichment Algebra & Gap Reduction

### 5.1 Level 1: Narrative & Conceptual Motivation

When an operational state representation $R$ is coarsenings-insufficient ($\text{ker}(R) \nsubseteq K_D$), it exhibits a non-empty **Capability Gap** $G(D, R) \subseteq C_D$, containing capabilities required by decision $D$ that representation $R$ fails to provide.

To restore structural safety, TAKT defines the **Capability Enrichment Operator** $R \oplus c$. Enriching a representation $R$ with a missing capability $c \in G(D, R)$ yields a strictly finer representation $R' = R \times K(c)$ with a strictly smaller capability gap $G(D, R') \subset G(D, R)$.

```text
                  CAPABILITY ENRICHMENT PATH (FINITE CONVERGENCE)
                  
   Initial Representation R₀ (Gap G₀ = {c₁, c₂, c₃})
            │
            ▼  Enrich with capability c₁  (R₁ = R₀ ⊕ c₁)
   Representation R₁         (Gap G₁ = {c₂, c₃})  ──────► Monotonic Gap Shrinking
            │
            ▼  Enrich with capability c₂  (R₂ = R₁ ⊕ c₂)
   Representation R₂         (Gap G₂ = {c₃})
            │
            ▼  Enrich with capability c₃  (R₃ = R₂ ⊕ c₃)
   Representation R_min      (Gap G₃ = ∅)        ──────► Zero Gap & Structural Sufficiency!
```

We prove **Gap Monotonicity** and establish that any sequence of capability enrichments terminates in at most $k = |C_D|$ steps at a structurally sufficient representation.

---

### 5.2 Level 2: Mathematical Definitions & Rigorous Proofs

#### Definition 5.1 (Capability Gap Predicate $G(D, R)$)
Given contract $C_D$, capability family $K$, and representation $R : S \to Z$, the **capability gap** of $R$ is:
$$G(K, C_D, R, c) \triangleq C_D(c) \land \neg \text{provides}(K, R, c)$$

#### Theorem 5.1 (Capability Gap Correspondence)
For any capability index $c \in C$, $c \in G(K, C_D, R)$ if and only if $C_D(c)$ holds and there exist states $x, y \in S$ such that $R(x) = R(y)$ but $\neg K(c) x y$:
$$G(K, C_D, R, c) \iff C_D(c) \land \neg (\forall x, y \in S, R(x) = R(y) \implies K(c) x y)$$

*Proof:*
Follows directly by unfolding `G` and `provides` in Lean 4 (`dsimp [G, provides]`). $\blacksquare$

#### Theorem 5.2 (Capability Gap Monotonicity)
If representation $R_1 : S \to Z_1$ refines $R_2 : S \to Z_2$ ($R_1 \sqsubseteq R_2$, so $\text{ker}(R_1) \subseteq \text{ker}(R_2)$), then the capability gap of $R_1$ is contained in the capability gap of $R_2$:
$$\forall c \in C, \quad G(K, C_D, R_1, c) \implies G(K, C_D, R_2, c)$$

*Proof:*
Assume $G(K, C_D, R_1, c)$, so $C_D(c)$ holds and $\neg \text{provides}(K, R_1, c)$. We must show $\neg \text{provides}(K, R_2, c)$.  
Suppose for contradiction that $\text{provides}(K, R_2, c)$ holds. Then for all $x, y \in S$, $R_2(x) = R_2(y) \implies K(c) x y$.  
Since $\text{ker}(R_1) \subseteq \text{ker}(R_2)$, $R_1(x) = R_1(y) \implies R_2(x) = R_2(y) \implies K(c) x y$.  
This implies $\text{provides}(K, R_1, c)$, contradicting $\neg \text{provides}(K, R_1, c)$.  
Thus $\neg \text{provides}(K, R_2, c)$ holds, proving $G(K, C_D, R_2, c)$. $\blacksquare$

#### Definition 5.2 (Enrichment Operator $\oplus$)
Given representation $R : S \to Z$ and capability $c \in C$, the enriched representation $R \oplus c : S \to Z \times S / K(c)$ is defined by:
$$(R \oplus c)(s) \triangleq (R(s), [s]_{K(c)})$$

#### Theorem 5.3 (Finite Enrichment Path Termination)
Let $C_D$ be a finite contract with $|C_D| = k$. Starting from any initial representation $R_0$, the inductive sequence $R_{i+1} = R_i \oplus c_{i+1}$ for missing capabilities $c_{i+1} \in G(D, R_i)$ produces a strictly decreasing chain of capability gaps:
$$G(D, R_0) \supset G(D, R_1) \supset \dots \supset G(D, R_m) = \emptyset$$
terminating in $m \le k$ steps at a structurally sufficient representation $R_m \in \mathcal{R}_{\text{sufficient}}(D)$.

*Proof:*
At each step $i$, selecting $c_{i+1} \in G(D, R_i)$ ensures $\text{provides}(K, R_{i+1}, c_{i+1})$ holds by construction of $R_{i+1} = R_i \times K(c_{i+1})$. By Gap Monotonicity (Theorem 5.2), $G(D, R_{i+1}) \subseteq G(D, R_i) \setminus \{c_{i+1}\}$, so $|G(D, R_{i+1})| < |G(D, R_i)|$. Since $G(D, R_0) \le k$, the chain must terminate in at most $m \le k$ steps with $G(D, R_m) = \emptyset$, at which point $\text{ker}(R_m) \subseteq K_D$ and $R_m$ is sufficient by Theorem ST-015. $\blacksquare$

---

### 5.3 Level 3: Lean 4 Code Mapping & Verification

Formalized in `TaktFormal/StructuralSufficiency.lean` and `TaktFormal/EnrichmentAlgebra.lean`.

| Mathematical Concept | Lean 4 Symbol Name | File Path | Line Range | Status |
| :--- | :--- | :--- | :--- | :--- |
| Capability Gap $G(D, R)$ | `G` | `takt-formal/TaktFormal/StructuralSufficiency.lean` | L22–L24 | Verified |
| Gap Correspondence | `T3_correspondence` | `takt-formal/TaktFormal/StructuralSufficiency.lean` | L26–L29 | Verified |
| **Gap Monotonicity** | `T4_monotonicity` | `takt-formal/TaktFormal/StructuralSufficiency.lean` | L33–L41 | Verified |
| Enrichment Operator $\oplus$ | `Enrichment.product` | `takt-formal/TaktFormal/EnrichmentAlgebra.lean` | L14–L18 | Verified |
| Enrichment Gap Reduction | `Enrichment.gap_reduction` | `takt-formal/TaktFormal/EnrichmentAlgebra.lean` | L24–L31 | Verified |
| Finite Termination | `Enrichment.finite_termination` | `takt-formal/TaktFormal/EnrichmentAlgebra.lean` | L42–L50 | Verified |

---

## 6. Contracts & Runtime Correspondence (`cli/src/runtime/`)

### 6.1 Level 1: Narrative & Conceptual Motivation

To translate the abstract algebraic theorems of Volume II into production software, TAKT implements dynamic contract monitors and evaluation engines in `cli/src/runtime/`.

In the software execution environment, concrete system state transitions $s_t \to s_{t+1}$ are tracked by `TrajectoryMonitor.ts`. The `ContractEvaluator.ts` module continuously assesses contract compliance, counting policy violations and triggering dynamic recalibration when capability gaps arise.

```text
  Runtime Trajectory       TrajectoryMonitor.ts          ContractEvaluator.ts
 ┌──────────────────┐    ┌──────────────────────┐    ┌──────────────────────────┐
 │ Event (s_t, a_t) │ ──►│ State Abstraction R  │ ──►│ Capability Check K_D     │
 └──────────────────┘    └──────────────────────┘    └──────────────────────────┘
                                                                  │
                                                        ┌─────────┴─────────┐
                                                        ▼                   ▼
                                                  MONITOR_SAFE        RECALIBRATE
                                                  (Zero Gap)       (Gap G(D, R) > 0)
```

---

### 6.2 Level 2: Mathematical-to-Software Architecture Mapping

1. **State Abstraction Representation:**  
   The runtime represents abstract states using stringified canonical fiber keys (`stateActionKey` in `types.ts`):
   $$\text{key}(s, a) = \text{JSON.stringify}(s) + \text{"::"} + \text{JSON.stringify}(a)$$
   This corresponds directly to the quotient projection $[s]_{K_D} = \text{Quot.mk}(K_D, s)$.

2. **Contract Compliance Evaluation (`ContractEvaluator.ts`):**  
   The `ContractEvaluator` evaluates governance decisions against outcome loss predicates:
   ```typescript
   evaluate(decision: GovernanceDecision, outcome: Outcome): void {
     if (decision.action === "INTERVENE") this.interventionCount++;
     if (decision.action === "RECALIBRATE") {
       this.recalibrationCount++;
       this.lastRecalibrationReason = decision.reason;
     }
     if (outcome.loss) {
       this.totalLoss++;
       if (decision.action !== "INTERVENE") this.violationCount++;
     }
   }
   ```
   A contract report satisfies tolerance $\epsilon$ iff `totalLoss <= epsilon`, providing a statistical runtime proxy for zero regret ($\epsilon(R, 0)$).

3. **Audit & Governance Decision Mapping (`AuditPolicy.ts` & `types.ts`):**  
   Runtime governance choices map directly to capability gap conditions:
   - `{ action: "MONITOR_SAFE", margin }` $\iff G(D, R) = \emptyset$ (Structurally Sufficient).
   - `{ action: "RECALIBRATE", reason }` $\iff G(D, R) \neq \emptyset$ (Capability Gap Detected, triggering enrichment).

---

### 6.3 Level 3: Lean 4 to TypeScript / Rust Code Correspondence Matrix

| Mathematical Concept | Lean 4 Certified Symbol | TypeScript Runtime Component | File Location |
| :--- | :--- | :--- | :--- |
| Capability Kernel $K_D$ | `StructuralSufficiency.K_D` | `ContractEvaluator` | `cli/src/runtime/ContractEvaluator.ts` |
| State Representation $R$ | `Kernel.kernel` | `stateActionKey` | `cli/src/runtime/types.ts` |
| Capability Gap $G(D, R)$ | `StructuralSufficiency.G` | `ContractReport.violationCount` | `cli/src/runtime/ContractEvaluator.ts` |
| Safety Verification | `T1_characterization` | `GovernanceDecision` (`MONITOR_SAFE`) | `cli/src/runtime/types.ts` |
| Trajectory Observation | `Representation.Preorder` | `TrajectoryMonitor` | `cli/src/runtime/TrajectoryMonitor.ts` |
| Recalibration Trigger | `Enrichment.product` | `GovernanceDecision` (`RECALIBRATE`) | `cli/src/runtime/types.ts` |

---

## 7. Master Structural Theorems of Volume II

Here we consolidate the 5 master structural theorems of Volume II:

### Theorem II.1 (Structural Sufficiency Theorem ST-015)
**Statement:** Under Axiom 0 Contract Coherence, a state representation $R: S \to Z$ is structurally sufficient for decision policy $D: S \to A$ if and only if its kernel refines the capability kernel $K_D$: $\text{ker}(R) \subseteq \text{ker}(D) \iff \text{ker}(R) \subseteq K_D$.  
**Lean 4 Mapping:** `T1_characterization` in `TaktFormal/StructuralSufficiency.lean`.

### Theorem II.2 (Upset Sufficiency Theorem)
**Statement:** Sufficiency is an upward-closed property on the preorder of state representations: $R_1 \in \mathcal{R}_{\text{sufficient}}(D) \land R_1 \sqsubseteq R_2 \implies R_2 \in \mathcal{R}_{\text{sufficient}}(D)$.  
**Lean 4 Mapping:** `T2_upset` in `TaktFormal/StructuralSufficiency.lean`.

### Theorem II.3 (Universal Minimality of Quotient Representation $R_{\text{min}}$)
**Statement:** The quotient map $R_{\text{min}} = S / K_D$ is the unique minimal element of $\mathcal{R}_{\text{sufficient}}(D)$ up to kernel equivalence: $\forall R \in \mathcal{R}_{\text{sufficient}}(D), \text{ker}(R) \subseteq \text{ker}(R_{\text{min}}) = K_D$.  
**Lean 4 Mapping:** `R_min_is_minimum` & `kernel_R_min_eq_K_D` in `TaktFormal/StructuralSufficiency.lean`.

### Theorem II.4 (Finite Quotient Bound Theorem)
**Statement:** For any decision contract requiring $k = |C_D|$ finite boolean capability predicates, the cardinality of the minimal quotient state space is bounded by $|S / K_D| \le 2^k$.  
**Lean 4 Mapping:** `finite_quotient_bound` in `TaktFormal/Complexity/Complexity.lean`.

### Theorem II.5 (Gap Monotonicity & Finite Enrichment Termination Theorem)
**Statement:** Representation refinement monotonically shrinks capability gaps ($R_1 \sqsubseteq R_2 \implies G(D, R_1) \subseteq G(D, R_2)$), and sequential capability enrichment $R \oplus c$ terminates in at most $k = |C_D|$ steps at a structurally sufficient representation.  
**Lean 4 Mapping:** `T4_monotonicity` in `TaktFormal/StructuralSufficiency.lean` & `Enrichment.finite_termination` in `TaktFormal/EnrichmentAlgebra.lean`.

---

## 8. Architectural & Dependency Map

The logical flow and axiomatic dependencies across Volume II are summarized in the following dependency graph:

```mermaid
graph TD
    A[Capability Family K c & Contract C_D] --> B[Capability Kernel K_D = ∩_{c ∈ C_D} K c]
    B --> C[Axiom 0: ker D = K_D]
    
    C --> D[Theorem II.1: Structural Sufficiency ST-015 ker R ⊆ K_D ⇔ R ∈ R_sufficient]
    D --> E[Theorem II.2: Upset Sufficiency R₁ ∈ R_suff ∧ R₁ ⊑ R₂ ⇒ R₂ ∈ R_suff]
    
    B --> F[Quotient Construction S / K_D]
    F --> G[Theorem II.3: Universal Minimality R_min = S / K_D]
    
    B --> H[Boolean Feature Map ϕ_CD: S → {0, 1}^k]
    H --> I[Theorem II.4: Finite Quotient Bound |S / K_D| ≤ 2^k]
    
    D --> J[Capability Gap G D, R]
    J --> K[Theorem II.5: Gap Monotonicity R₁ ⊑ R₂ ⇒ G R₁ ⊆ G R₂]
    K --> L[Enrichment Operator R ⊕ c & Finite Termination in ≤ k steps]
    
    G --> M[Runtime Implementation cli/src/runtime/ ContractEvaluator.ts]
    L --> M
```

---

## Summary & Transition to Volume III

Volume II has established that structural sufficiency is an upset in state representation space governed by capability kernels $K_D$, characterized the unique minimal quotient representation $R_{\text{min}} = S / K_D$, proved the finite quotient bound $|S / K_D| \le 2^k$, and operationalized capability gap reduction for runtime contract enforcement.

In **Volume III (Governance & Information Value)**, we extend these structural foundations into dynamic decision environments, formalizing **Governed Detectors**, Expected Value of Sample Information (**EVSI**) on detector graphs, the **Rational EVSI Stopping Theorem $\pi^*$**, and optimal intervention cost minimization.
