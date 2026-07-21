# Design Spec: Restructuring Optimal Representation Theory (Phase IV, Stage 2)

**Date:** 2026-07-21
**Author:** Antigravity AI
**Status:** Under Review (User Approved Conceptual Design)

---

## 1. Goal

Restructure [optimal-representation-theory.md](file:///home/valentin/code/takt-theory/docs/optimal-representation-theory.md) to reflect the exact epistemological status of the theorems, axioms, and open questions of Phase IV, Stage 2. The document must align with the discipline used in ST-015: defining the minimal object of study first and posing the weakest possible existence question as an open problem before stating or assuming theorems.

---

## 2. Epistemological Structure

The revised document will be organized into three distinct parts:

1.  **Part I — Established Framework**:
    *   Definitions, working axioms, and problems that are mathematically well-formulated and accepted for the current stage.
    *   The existence of an optimal representation is treated as an **Open Problem**, not a proven theorem.
2.  **Part II — Conditional Developments**:
    *   Theorems and consequences that are logically valid *if and only if* an existence theorem holds.
    *   Prefaced by a prominent note stating that these are conditional results.
3.  **Part III — Research Agenda**:
    *   Research questions and potential outcome scenarios that direct the research but are not yet proven.
    *   Strict Rule: No research question enters Part III unless it has the potential to alter the axioms, theorems, or architecture of the theory.

---

## 3. Status Labels Legend

We introduce an explicit taxonomy of mathematical blocks to be used throughout the document, represented in a legend table at the start:

| Status | Meaning |
| :--- | :--- |
| **Definition** | Established terminology and concepts. |
| **Working Axiom** | Axiom assumed for the current level of investigation. |
| **Open Problem** | A mathematical question with no known proof yet. |
| **Conditional Theorem** | A theorem that is valid assuming unresolved results (e.g., existence). |
| **Research Question** | An open inquiry that may alter the architecture of the theory. |
| **Research Outcome** | A potential endpoint or classification of research paths. |
| **Example** | An illustrative instance. |

---

## 4. Key Restructuring Details

### Part I: Established Framework
*   **Section 1 (Context and Motivation)**: Retains general context.
*   **Section 2 (Cost Theory)**:
    *   Defines the Cost Function.
    *   Labels axioms as **Working Axioms** (e.g., **Working Axiom 2.2 (C0 - Cost Monotonicity)**).
    *   Includes the Taxonomy (Intrinsic/Extrinsic) and Information Signature Classification.
    *   Includes the Realizability Matrix.
*   **Section 3 (Existence of Optimal Representations)**:
    *   Defines the minimal object of study, assuming ST-015 is closed (giving $R_{\min}$) and a cost poset $(L, \le)$ is given.
    *   **Definition 3.1 (Optimal Representation)**:
        Let $R \in \mathcal{R}_{\text{sufficient}}(D)$. We say $R$ is optimal if:
        $$\forall R' \in \mathcal{R}_{\text{sufficient}}(D), \quad c(R) \le c(R')$$
        *No existence is assumed.*
    *   **Open Problem 3.2 (Pregunta D1)**:
        Under which assumptions on $(\mathcal{R}_{\text{sufficient}}(D), \sqsubseteq)$ and $(L, \le)$ does an optimal representation exist?
    *   **Research Outcomes (Scenarios A/B/C)**:
        *   *Research Outcome 3.3 (Scenario A - Success)*: C0 and C1 are sufficient.
        *   *Research Outcome 3.4 (Scenario B - Failure in L)*: Poset of costs $L$ lacks minimums.
        *   *Research Outcome 3.5 (Scenario C - Failure in Domain)*: $\mathcal{R}_{\text{sufficient}}(D)$ is too large.

### Part II: Conditional Developments
*   Prefaced by the conditional disclaimer.
*   **Section 4 (Uniqueness)**:
    *   **Conditional Theorem 4.1 (Uniqueness)**: Proof sketch conditional on existence.
*   **Section 5 (Coincidence and Divergence)**:
    *   **Conditional Theorem 5.1 (Coincidence under Monotonic Costs)**: Proof sketch conditional on existence.
    *   Includes divergence analysis ($R^* \neq R_{\min}$) and the regiminal bifurcation (Regimes I/II).
*   **Section 6 (Composition)**:
    *   **Conditional Theorem 6.1 (Compositionality of Optima)**.
*   **Section 7 (Concrete Cost Models)**:
    *   **Example 7.1** to **7.4** for Latency, Memory, Enrichment, and Composite Costs.

### Part III: Research Agenda
*   **Section 8 (Distillation Questions)**:
    *   **Research Question 8.1** to **8.4** covering signature independence, matrix collapse, Regime II reduction, and axiom sufficiency (including Scott/Noether conditions).
