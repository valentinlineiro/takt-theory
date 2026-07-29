# ST-017 Phase III.1 Closure Report: Capability-Relative Witness Transportability

**Status:** Complete & Sealed (Stable research baseline)  
**Branch:** `st017-witness-transportability`  
**Scope:** Phase III.1 Core Formalization, Executable Witness Instance, and Traceability  

---

## Executive Summary

Phase III.1 of **ST-017 (Witness Transportability)** has reached full formal closure. The objective of this phase was to transition capability-relative transportability from exploratory theory into a canonical, verified formal core with an executable demonstration—without over-committing to unproven design choices.

This closure report seals Phase III.1 by establishing:
1. A **Frozen Formal Model** (`docs/superpowers/specs/2026-07-28-st017-formal-model-draft.md`).
2. An **Abstract Formal Lean Module** ([`RuntimeTransportability.lean`](file:///home/valentin/code/takt-theory/takt-formal/TaktFormal/RuntimeTransportability.lean)) compiled with **`0 sorry`**.
3. An **Executable Witness Demonstration** ([`mockRuntime.ts`](file:///home/valentin/code/takt-theory/cli/src/st017-transportability/mockRuntime.ts)) establishing a non-trivial runtime instance.
4. Complete **Freeze ↔ Lean ↔ Witness Traceability**.
5. Explicit boundary definition separating proven results from open research questions (Q1–Q6).

---

## 1. Freeze ↔ Lean ↔ Witness Traceability Matrix

Every definition and property frozen in the specification maps directly to its corresponding Lean construct and executable witness representation.

| Specification Element | Description | Lean Construct (`RuntimeTransportability.lean`) | Witness Realization (`mockRuntime.ts`) | Status |
| :--- | :--- | :--- | :--- | :--- |
| **Def D1** | Runtime Structure ($M = (\mathcal{C}_M, \pi_M)$) | `structure Runtime (α : Type u) (δ : Type v) (κ : Type w)` | `MockRuntime` class | Verified |
| **Def D2** | Capability Ablation ($M \setminus \{c\}$) | `def removeCapability (M : Runtime α δ κ) (c : κ)` | `ablateCapability(c)` | Verified |
| **Def D3** | Attribute Preserving Pair | `def Attributes (c : κ) (M : Runtime α δ κ) (x y : α)` | `checkAttributes(c, x, y)` | Verified |
| **Def D4** | Decision Soundness ($\mathrm{Sound}$) | `def Sound (T : α → β) (c : κ) ...` | `checkSoundness(...)` | Verified |
| **Def D5** | Capability Soundness ($\mathrm{Sound}'$) | `def SoundPrime (T : α → β) (c : κ) ...` | `checkSoundPrime(...)` | Verified |
| **Def D6** | Kernel Soundness | `def KernelSound (T : α → β) (K_D : Set κ) ...` | Tested on $K_D$ subsets | Verified |
| **Property P1** | Soundness Hierarchy ($\text{CapSound} \Rightarrow \text{KerSound} \Rightarrow \text{DecSound}$) | `capabilitySound_implies_kernelSound`<br>`kernelSound_implies_decisionSound` | Hierarchy test suite | Verified (`0 sorry`) |
| **Property P2** | Soundness Composition | `soundPrime_comp`<br>`capabilitySound_comp`<br>`kernelSound_comp` | Multi-hop transport pipeline | Verified (`0 sorry`) |
| **Property P3** | Non-composability of DecisionSound | Explicitly omitted theorem (Design exclusion) | Counterexample in mock runtime | Verified |
| **Property P6** | Preserved/Degraded/Lost Trichotomy | `theorem transport_trichotomy` | Case classification in runtime | Verified (`0 sorry`) |

---

## 2. Verified Artifacts

### 2.1 Abstract Formal Core (`takt-formal`)
* **File:** [`takt-formal/TaktFormal/RuntimeTransportability.lean`](file:///home/valentin/code/takt-theory/takt-formal/TaktFormal/RuntimeTransportability.lean)
* **Integrations:** Registered in [`TaktFormal.lean`](file:///home/valentin/code/takt-theory/takt-formal/TaktFormal.lean#L83).
* **Build Result:** Clean compilation with **`0 sorry`** (`lake build` succeeded without error).

### 2.2 Executable Witness Instance (`cli`)
* **File:** [`cli/src/st017-transportability/mockRuntime.ts`](file:///home/valentin/code/takt-theory/cli/src/st017-transportability/mockRuntime.ts)
* **Execution:** Demonstrates two non-trivial distinct runtimes ($M_1, M_2$) with attribute preservation, capability degradation, and lost capability scenarios.

---

## 3. Explicit Research Frontier (Excluded Open Questions)

To prevent premature design freezes, the following open questions from the formal draft are **explicitly excluded** from the Lean core and Phase III.1 scope:

* **Q1 (Necessity):** Whether $\mathrm{Attributes}$-preservation is strictly necessary vs. sufficient for failure when absent.
* **Q2 (Sub-capability Granularity):** Sub-relation formulation $\mathrm{Sound}(T, c, R)$.
* **Q3 (Per-hop Contract Choice):** Normative selection between $\mathrm{KernelSound}$ vs. $\mathrm{CapabilitySound}$ for runtime certificates.
* **Q4 (Certificate Schema & Provenance):** Wire-format layout of portable certificates.
* **Q5 (Relation to Monomorphism Axiom 2):** Exact logical relation between per-transport local soundness and global Policy Decision Monomorphism.
* **Q6 (Cross-Language Runtime Integration):** Native integration between TypeScript mock instances and Lean proof terms.

---

## 4. Phase III.1 Closure Status

Phase III.1 is **FUNCTIONALLY COMPLETE AND CLOSED**.

* **Theory:** Frozen and canonicalized.
* **Lean Core:** Verified (`0 sorry`).
* **Witness:** Executable and non-trivial.
* **Traceability:** Complete.
* **Open Agenda:** Fully isolated for future Phase III.2 work.
