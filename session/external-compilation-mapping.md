# External Domain 1: Compilation (Type Erasure)

**Protocol:** Apply the core theory to an external domain without modifying axioms or introducing new fundamental concepts. Record result: success, partial, or failure.

---

## 1. Mechanical mapping

| Element | Instance | Notes |
|---------|----------|-------|
| Domain $X$ | Source programs with generic type annotations (e.g., Java with `List<String>`, `Map<K,V>`) | |
| Codomain $Y$ | Erased programs — generic type parameters removed (e.g., `List`, `Map`) | Java type erasure |
| Morphism $\mathcal{C}$ | Compile with type erasure: $\mathcal{C}(P) = \text{erase}(P)$ | Non-injective: `List<String>` and `List<Integer>` both erase to `List` |
| Property $\Phi$ | $P$ uses generic type $T$: $\Phi_T(P) = 1$ if $P$ declares a variable annotated with $T$, else $0$ | Binary property; $T$ fixed per instance (e.g., `List<String>`) |
| Structure type | Equivalence $\mathcal{T}_\sim$ | Discrete equivalence on $\{0,1\}$ for $\Phi$ |
| Preservation $\preceq$ | $\subseteq$ (subequivalence) | $\sim_\mathcal{C} \subseteq \sim_\Phi$ means: if $\mathcal{C}(P_1) = \mathcal{C}(P_2)$ then $\Phi(P_1) = \Phi(P_2)$ |
| Refinement | $(\mathcal{C}', \phi)$ where $\mathcal{C}'(P) = (\text{erase}(P), \text{sig}(P))$, $\phi(\text{erase}, \text{sig}) = \text{erase}$ | $\text{sig}(P)$ = generic type signatures preserved as metadata (e.g., Java `Signature` bytecode attribute) |

**Verification of factorization:** $\mathcal{C} = \phi \circ \mathcal{C}'$ holds: $\phi(\mathcal{C}'(P)) = \phi(\text{erase}(P), \text{sig}(P)) = \text{erase}(P) = \mathcal{C}(P)$. ✓

---

## 2. Execution of the procedure

### Step 1: Preservation failure

**Does $\mathcal{C}$ preserve $\Phi_T$?** No. Programs $P_1$ with `List<String> x` and $P_2$ with `List<Integer> x` (otherwise identical) satisfy $\mathcal{C}(P_1) = \mathcal{C}(P_2)$ but $\Phi_T(P_1) \neq \Phi_T(P_2)$ when $T = \text{String}$. Hence $\sim_\mathcal{C} \not\subseteq \sim_{\Phi_T}$.

### Step 2: Identify problematic fibres

**Fibre:** $\mathcal{C}^{-1}(P_{\text{erased}}) = \{P \in X \mid \text{erase}(P) = P_{\text{erased}}\}$ — all source programs that produce the same erased output.

A fibre $\mathcal{C}^{-1}(P_{\text{erased}})$ is problematic when it contains programs with different generic type parameters. Since type erasure removes ALL generic type info, EVERY non-trivial fibre is problematic. The number of problematic fibres equals the number of erased programs that were produced from generically-typed sources.

**Locus of action:** The compilation step itself — the erasure loses information at the boundary between generic and erased representations.

### Step 3: Propose refinement

**Refinement:** $\mathcal{C}'(P) = (\text{erase}(P), \text{sig}(P))$, where $\text{sig}(P)$ encodes the generic type signatures of $P$ (declarations, method signatures, field types).

**Factorization:** $\mathcal{C} = \phi \circ \mathcal{C}'$ with $\phi(\text{erase}, \text{sig}) = \text{erase}$. ✓

**How this separates within the fibre:** Two programs $P_1, P_2$ with $\text{erase}(P_1) = \text{erase}(P_2)$ are distinguished by $\mathcal{C}'$ if their generic signatures differ. E.g., `List<String>` vs `List<Integer>` produce different $\text{sig}$ values even when the erased code is identical.

**Real-world existence:** Exactly this refinement exists in Java bytecode. The `Signature` attribute (JVMS §4.7.9.1) stores generic type information alongside erased bytecode, precisely to recover information that erasure removes. The standard reflection API uses it — `Field.getGenericType()` vs `Field.getType()`.

### Step 4: Verify preservation

**Preservation under $\mathcal{C}'$:** With the signature metadata, $\sim_{\mathcal{C}'} \subseteq \sim_{\Phi_T}$ holds:

For $P_1, P_2$ in distinct fibres: $\mathcal{C}(P_1) \neq \mathcal{C}(P_2)$, so by Theorem 3, $\mathcal{C}'(P_1) \neq \mathcal{C}'(P_2)$ — preservation is automatic for interfibre pairs regardless of $\Phi$.

For $P_1, P_2$ in the same fibre $\mathcal{C}^{-1}(P_{\text{erased}})$: $\mathcal{C}'(P_1) = \mathcal{C}'(P_2)$ only if $\text{sig}(P_1) = \text{sig}(P_2)$, which implies the same generic type parameters, hence $\Phi_T(P_1) = \Phi_T(P_2)$. If $\text{sig}(P_1) \neq \text{sig}(P_2)$, then $\mathcal{C}'(P_1) \neq \mathcal{C}'(P_2)$ and the condition holds vacuously.

**Core theory form (Theorem 4):** The equivalence case applies unconditionally. Fibre condition holds by construction: within each fibre, $\text{sig}$ distinguishes programs with different $\Phi_T$.

---

## 3. Result

**Verdict:** SUCCESS

### What worked

| Step | Status |
|------|--------|
| 1. Clear morphism identifiable as contraction | ✓ |
| 2. Preservation failure documented | ✓ |
| 3. Fibres identified and characterized | ✓ |
| 4. Refinement $\mathcal{C} = \phi \circ \mathcal{C}'$ verified | ✓ |
| 5. Preservation restored under refinement | ✓ |
| 6. No new axioms or concepts required | ✓ |

### What this confirms

The core extends to compilation — at least for the simple case of type erasure, where the equivalence pattern (Theorem 4) applies directly. The refinement mechanism matches an existing real-world solution (Java `Signature` attribute).

### Potential concern: triviality

Type erasure is a deliberately simple case. The preservation failure is obvious (removing information causes information loss), and the refinement is known (keep the information). The core describes this exact pattern, so SUCCESS is expected. A stronger test would involve:
- A semantic (not syntactic) property
- A refinement that adds entirely new information (not just preserving pre-existing metadata)
- A non-binary property (pseudometric case)

---

## 4. Evidence Index update

| Domain | Core sufficient | Result |
|--------|----------------|--------|
| G3 (HAA-001) | Yes | ✓ |
| G2 (estimation uncertainty) | Yes | ✓ |
| **Compilation (type erasure)** | **Yes** | **✓** |

**Current EI:** 3/3 = 1.0

*Note: Type erasure (equivalence) + estimation uncertainty (pseudometric) + HAA-001 (equivalence with categorical refinement) all derive from the same core. First truly external domain added.*

---

## 5. What a stronger test would require

The user noted that compilation was chosen for its potential to **break** the theory. Type erasure does not break it — it resolves trivially. A stronger compilation test would pick a property where:

- $\Phi$ is **semantic** (not syntactic) — e.g., "the program has the same observational behavior as specification $S$"
- The morphism is a **non-trivial optimization** (not just information stripping)
- The refinement does not merely preserve pre-existing metadata but **generates new constraints** — e.g., adding proof annotations for a verified compiler

For the next external domain, the document should note whether the chosen case is "clean" (expected success) or "aggressive" (might reach a boundary). The Evidence Index will be more convincing with at least one aggressive domain.
