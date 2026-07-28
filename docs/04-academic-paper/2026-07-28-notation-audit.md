# ST-016 Notation Audit Report

**Date:** 2026-07-28  
**Manuscript:** `paper/main.tex` (Commit post-audit)  
**Auditor:** Antigravity  
**Status:** ✅ CLOSED — All issues resolved

---

## Canonical Symbol Table

| Symbol | LaTeX | Meaning | First Defined |
| :--- | :--- | :--- | :--- |
| $S$ | `S` | Full environment state (uncompressed) | Sec. 1 Introduction |
| $\mathcal{S}$ | `\mathcal{S}` | Space of full environment states | Sec. 3.1 |
| $R$ | `R` | Compressed representation, $R = \rho(S)$ | Sec. 1 Introduction |
| $\mathcal{R}$ | `\mathcal{R}` | Space of representations | Sec. 3.1 |
| $\rho$ | `\rho` | State abstraction function $\rho : \mathcal{S} \to \mathcal{R}$ | Sec. 1 Introduction |
| $\mathcal{D}$ | `\mathcal{D}` | Discrete decision domain | Sec. 3.2 |
| $\pi^*$ | `\pi^*` | Optimal decision policy on $\mathcal{R}$ | Sec. 1 Introduction |
| $\pi_M$ | `\pi_M` | Decision policy of governed runtime $M$ | Sec. 1 Introduction |
| $\pi_{M \setminus \{C\}}$ | `\pi_{M \setminus \{C\}}` | Policy of runtime with capability $C$ removed | Sec. 3.2 |
| $M$ | `M` | TAKT Governed Runtime tuple $(\mathcal{C}, \pi_M)$ | Sec. 3.2 |
| $\mathcal{C}$ | `\mathcal{C}` | Runtime's active capability set | Sec. 3.2 |
| $\mathcal{K}_D$ | `\mathcal{K}_D` | Minimal governance kernel (constant set) | Sec. 3.2 |
| $C_{\text{contract}}$ | `C_{\text{contract}}` | ContractSoundness capability | Sec. 3.2 |
| $C_{\text{uncertainty}}$ | `C_{\text{uncertainty}}` | UncertaintyBound capability | Sec. 3.2 |
| $C_{\text{temporal}}$ | `C_{\text{temporal}}` | TemporalConsistency capability | Sec. 3.2 |
| $\Sigma^*$ | `\Sigma^*` | Decision-sufficient representation set | Sec. 5 (table) |

---

## Audit Results by Axis

### Axis 1 — States and Representations

| Check | Finding | Resolution |
| :--- | :--- | :--- |
| $R$ used without time subscript | ❌ Sec. 3.1 used `$R_t$`, `$S_t$` | **Fixed:** removed `_t`; sufficiency condition uses `$R = \rho(S)$` inline |
| $\rho(S)$ consistent meaning | ✅ Consistent in Sec. 1, 3, figure caption | — |
| No unexplained primed variants | ⚠️ `$r'_0$`, `$r'_1$` in old Example 1 | **Fixed:** Example 1 now uses `$R^1$`, `$R^2$` for representations; trajectory elements `$(r_0, r_1, r_2)$` kept at a distinct layer |

### Axis 2 — Policies

| Check | Finding | Resolution |
| :--- | :--- | :--- |
| $\pi^*$ = optimal policy | ✅ Consistent throughout | — |
| $\pi_M$ = runtime policy | ❌ Sec. 1 body implied `$\pi^*$` acts on `$R$` without runtime mediation | **Fixed:** intro now reads "governed runtime's policy $\pi_M$ is evaluated on $R$"; goal stated as `$\pi_M(R) = \pi^*(R)$` |
| $\pi^*$ and $\pi_M$ never interchangeable | ❌ Example 1 (old): `$\pi_M(\tau_1) \neq \pi^*(\tau_1)$` — type error; both take $R$, not $\tau$ | **Fixed:** rewritten to `$\pi_{M \setminus \{C_\text{temporal}\}}(R^1) = \pi_{M \setminus \{C_\text{temporal}\}}(R^2)$` and `$\pi^*(R^1) \neq \pi^*(R^2)$` |

### Axis 3 — Capability Kernel

| Check | Finding | Resolution |
| :--- | :--- | :--- |
| $\mathcal{K}_D$ formally defined before use | ❌ Used in Sec. 2 and Sec. 5 before formal definition | **Fixed:** Sec. 3.2 now opens with the formal definition of `$\mathcal{K}_D$` |
| $\mathcal{C}$ vs $\mathcal{K}_D$ distinguished | ❌ Previously implicit | **Fixed:** Sec. 3.2 states "$M$ is minimally governed when $\mathcal{C} = \mathcal{K}_D$" |
| Capability names consistent | ✅ All 7 sections use `C_{\text{contract}}`, `C_{\text{uncertainty}}`, `C_{\text{temporal}}` | — |

### Axis 4 — Runtime Model

| Check | Finding | Resolution |
| :--- | :--- | :--- |
| $M = (\mathcal{C}, \pi_M)$ defined once | ✅ Defined in Sec. 3.2, referenced in Sec. 7 | — |
| No confusion $\mathcal{C}$ vs $\mathcal{K}_D$ after fix | ✅ Clean after fix above | — |

### Axis 5 — Experimental Claims (EXP-004)

| Check | Finding | Resolution |
| :--- | :--- | :--- |
| Ablation results framed as observations | ✅ All bullets: "Ablating ... yields ... vs." | — |
| No universal "removing $C$ implies" in Sec. 5 | ✅ Clean | — |

---

## Issues Found and Resolved

| ID | Severity | Location | Issue | Fix Applied |
| :--- | :--- | :--- | :--- | :--- |
| N-01 | **High** | Sec. 3.1 | `$R_t$`, `$S_t$` inconsistent with rest of paper | Removed `_t`; added `R = \rho(S)` condition |
| N-02 | **High** | Sec. 1 body | `$\pi^*$` implied to act on `$R$` without runtime mediation | Rewritten: `$\pi_M(R) = \pi^*(R)$` as goal condition |
| N-03 | **High** | Sec. 3 Example 1 | `$\pi_M(\tau_1) \neq \pi^*(\tau_1)$` type error: policies take $R$ not $\tau$ | Rewritten using `$R^1$`, `$R^2$` |
| N-04 | **Medium** | Sec. 3.2 | `$\mathcal{K}_D$` used before formal definition | Defined explicitly at start of Sec. 3.2 |
| N-05 | **Medium** | Sec. 3.2 | `$\mathcal{C}$ vs $\mathcal{K}_D$` distinction implicit | Added explicit disambiguating sentence |

---

## Post-Audit Build State

```
main.pdf: 7 pages
Fatal errors:         0
Undefined references: 0
Undefined citations:  0
Notation issues open: 0
```

> [!IMPORTANT]
> **Hito 1 CLOSED.** The manuscript is notation-stable.
> No further changes to fundamental symbols should be made before Hito 2.

---

## Hito 2 Checklist — External Review (Blind Read)

- [ ] Identify 2–5 readers unfamiliar with TAKT
- [ ] Send `paper/main.pdf` with no context or explanation
- [ ] Collect answers: research question / contribution / what is proved / what is validated / what are the limits
- [ ] Incorporate structural (not notational) feedback only
- [ ] On completion: tag `paper-v0.2-post-review`
