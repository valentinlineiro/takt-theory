# Batch-001 Analysis — Pilot procedural evaluation

**Status:** Completed
**Protocol:** Protocol v0.2
**Date:** 2026-07-13

---

## 1. Summary of observed outcomes

| Case ID | Feature / Friction Point | Predicted | Observed | Match | Classification Inference |
|:---|:---|:---:|:---:|:---:|:---|
| **CASE-001** | DB schema migration (v1 vs v2) | ⪰ | ⪰ | True | F_A witness (Rule 1), F_N refuted (Rule 2) |
| **CASE-002** | Markdown dual-write on mutation | ⪰ | ⪰ | True | F_A witness (Rule 1), F_N refuted (Rule 2) |
| **CASE-003** | Orphaned touchfiles in `.takt/` | ⪰ | ⪰ | True | F_A witness (Rule 1), F_N refuted (Rule 2) |
| **CASE-004** | Pre-write hook blocking edits | ∥ | ≻ | False | None (observed strict degradation) |
| **CASE-005** | HANSEI + KAIZEN loop phases | ∥ | ∥ | True | None (observed incomparability) |

---

## 2. Hypothesis H1 evaluation (Local predictability)

### Overall accuracy

$$ \text{accuracy} = \frac{\text{matches}}{\text{total predictions}} = \frac{4}{5} = 80.0\% $$

- **Baseline comparison:** The majority-class baseline is $\ge 0$ (represented as $\$) which occurred 3 times out of 5 ($60\%$). The local predictability accuracy ($80\%$) lies above the majority-class baseline.
- **Random baseline comparison:** Accuracy of $80\%$ is substantially above the uniform random baseline ($1/3 \approx 33.3\%$).

### Accuracy stratified by predicted relation

- **Accuracy given $\$:** $3/3 = 100\%$ (CASE-001, CASE-002, CASE-003)
- **Accuracy given $\succ$:** N/A (0 predictions emitted)
- **Accuracy given $\parallel$:** $1/2 = 50\%$ (CASE-005 matched; CASE-004 mismatched)

---

## 3. Classification evidence (Rules 1–3)

- **$F_A$ witnesses found (Rule 1):** 3
  - CASE-001, CASE-002, and CASE-003 are confirmed accidental friction ($f \in F_A$).
- **$F_N$ refutations (Rule 2):** 3
  - CASE-001, CASE-002, and CASE-003 refutations confirm that these friction points are not necessary ($f \notin F_N$).
- **$F_N$ consistency groups (Rule 3):** 0
  - Group size is 1 for all cases in this batch; therefore, Rule 3 does not trigger.
- **Uninformative groups:** 2
  - CASE-004 and CASE-005 activated no classification rules.

---

## 4. Discussion and insights

1. **Accidental friction predictability:** Accidental friction was predicted with $100\%$ accuracy in this pilot. Completing legacy migrations (CASE-001), removing redundant write paths (CASE-002), and cleaning up stale filesystem artifacts (CASE-003) all successfully passed their respective oracles without degrading system utility.
2. **Pre-write hook mismatch (CASE-004):** The model predicted incomparability ($\parallel$) due to potential resource/coupling benefits vs. process risk, but the oracle execution demonstrated that the removal of the hook directly led to successful writes without the required `solo_declare` step. This represents a strict degradation of G (process discipline) and therefore maps to $\succ$ under the oracle, refuting the predicted incomparability.
3. **Loop phases (CASE-005):** The model correctly predicted incomparability ($\parallel$). Removing HANSEI and KAIZEN from the loop saves significant token and time resources (positive under environment constraints E), but removes a key defect-detection and continuous improvement discipline (negative under goal G). Since this trade-off is not orderable under $\succeq$, the outcome remains incomparable.
