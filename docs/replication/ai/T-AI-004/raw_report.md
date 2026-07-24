# Replication Report — TAKT Theory Repository

**Repository:** `valentinlineiro/takt-theory`  
**Audit date:** 2026-07-24  
**Evaluator role:** Perplexity Sonar 2 (T-AI-004)  
**Audit modality:** Static protocol audit (no terminal execution available).  
**Initial Classification:** Protocol Failure  

---

## 1. Repository Understanding

• **Scientific objective:** TAKT (*Theory of Adequate Knowledge for Decisions*) is an axiomatic theory claiming to formally determine when compressing or abstracting a representation of the world preserves the optimal decisions that would be made under complete information.  
• **Theoretical contribution:** Capability kernel $K_D$, dynamic decision margin $M_D$, critical drift rate $\theta_{crit}$, EVSI value of information, Lean 4 proofs, TypeScript benchmark suite.  
• **Replication objective:** Assess R1 protocol and standalone package.

---

## 2. Obstacles & Observations Encountered

1. **Observed "Private" metadata:** Inferred repository privacy from `package.json` `"private": true` field (npm publish restriction).
2. **Numerical Discrepancy in EXP-003:** `expected-results.md` listed `+99.2` while committed output JSON for EXP-003 (200 steps) showed `199.2`.
3. **Step 3 Instruction Divergence:** QUICKSTART mentioned manual scorecard comparison, while README mentioned `validation-script.ts`.
4. **Version Coexistence:** Version strings `v1.0`, `v1.1`, and `v1.2-R2` across historical docs.

---

## 3. Final Classification

**Classification:** Protocol Failure (en inspección estática sin ejecución).
