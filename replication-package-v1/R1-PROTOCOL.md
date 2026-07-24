# TAKT R1 Independent Replication Experimental Protocol

> **Document Status:** Registered R1 Experimental Protocol  
> **Target Package:** `replication-package-v1`  
> **Theory Baseline:** TAKT-v1.0 Frozen Core (`takt-v1.0.0`)  
> **Git Commit:** `1bdd5a1`

---

## 1. Experimental Question

> **Primary Question:** Can an independent researcher execute `replication-package-v1` and reach the same scientific conclusion without prior knowledge of TAKT's internal development process or oral communication with the authors?

---

## 2. Experimental Hypotheses

- **Null Hypothesis ($H_0$):** $K_{\text{TAKT}} \not\subseteq \text{Protocol}$  
  The published replication protocol is insufficient; independent researchers cannot reproduce the scientific conclusion without oral/implicit author knowledge.
- **Alternative Hypothesis ($H_1$):** $K_{\text{TAKT}} \subseteq \text{Protocol}$  
  The published replication protocol is sufficient; independent researchers achieve exact reproduction and reach compatible scientific conclusions autonomously.

---

## 3. Measured Experimental Variables

1. **Exact Reproduction ($R_{\text{exact}}$):** Binomial match ($1$ if SHA-256 dataset hashes match; $0$ otherwise).
2. **Scientific Inference ($R_{\text{sci}}$):** Binomial match ($1$ if zero decision regret and expected performance scaling hold; $0$ otherwise).
3. **Cognitive Cost ($C_{\text{rep}}$):** Measured setup, execution, and audit duration (target: $< 5 \text{ min}$).

---

## 4. Evaluator Selection Profile

Replicators ($n = 3 \dots 5$) must be selected based on domain competence without prior participation in TAKT development:
- **Domains:** Formal verification (Lean / Coq), distributed systems, empirical software engineering, or AI governance.
- **Role:** Objective scientific observers (not advocates).

---

## 5. Phased Execution Roadmap

- **Fase 4 (Internal R0' Dry-Run):** Blind trial by an internal reviewer without development context. Output: `R0'-report.md`.
- **Fase 5 (External R1 Campaign):** Execution by $3 \dots 5$ independent third-party researchers. Output: Completed `R1-Scorecard-template.md`.
- **Fase 6 (Public Reporting):** Publication of `R1-REPORT.md` regardless of outcome (PASS, PARTIAL, or FAIL).
