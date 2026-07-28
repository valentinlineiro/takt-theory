# ST-016 Blind Read Results

**Protocol version:** Hito 2  
**Paper version sent:** `paper-v0.1-submission-candidate` (Commit `b60aa9a`)  
**PDF SHA-256:** `f86c1d7c07bc8c4ec3dd4ea658c8d169c85cb7da2c7b5284629aecf9b50b3d21`  
**Date dispatched:** 2026-07-28  
**Status:** 🔄 IN PROGRESS — 1/3 core responses received

---

## Reader Log

| # | Profile | Date Sent | Date Received | Status |
| :- | :--- | :--- | :--- | :--- |
| R1 | Formal methods | 2026-07-28 | 2026-07-28 | ✅ Received |
| R2 | Software systems | 2026-07-28 | — | Pending |
| R3 | External domain | 2026-07-28 | — | Pending |

**Minimum to proceed:** 2 responses  
**Target:** 3 core responses

---

## R1 — Formal Methods

**Profile:** Lean 4 / formal verification specialist  
**Q1 (Contribution):** Framework algebraico para razonar sobre suficiencia de representaciones y necesidad de capacidades. Código Lean compila sin errores ni sorrys.  
**Q2 (Formally proved):** Relaciones de orden entre kernels (StructuralSufficiency), teoremas de factorización, instancias finitas de ablación (4–8 estados).  
**Q3 (Empirically validated):** EXP-004 en runtime TypeScript de referencia; Vitest 283/283.  
**Q4 (Ambiguous):** Múltiples definiciones no alineadas de "decision preservation" (ST-015 vs Lean vs Sufficient). Conexión entre π*(R)=π*(S) y M.policy r = π* r no explicitada.  
**Q5 (Hardest to justify):** Afirmación "MUST possess three capability kernels" — no hay teorema universal en Lean; ST016_Conjecture es `def`, no `theorem`.

### Hallazgos R1

| ID | Severidad | Categoría | Descripción |
| :- | :--- | :--- | :--- |
| H1 | Alta | Formal definition | `minimal_implies_all_capabilities_necessary` es tautológico — expande la definición de `Irreducible`, no añade información |
| H2 | Alta | Formal definition | `ST016_Conjecture` es `def`, no `theorem`; no existe prueba Lean de la afirmación general |
| H3 | Alta | Formal definition + Scope | Capacidades son etiquetas sin semántica formal; no hay axiomas que conecten `contract` con contract soundness real |
| H4 | Alta | Overclaim | Abstract/Intro afirman necesidad universal; código sólo demuestra ejemplos finitos concretos (4–8 estados) |
| H5 | Media | Overclaim | "Witness bridge" es manual (humano construye WitnessArtifact); no es certificación automática de trazas TypeScript |
| H6 | Media | Formal definition | Tres definiciones de "decision preservation" no alineadas: ST-015, PreservesDecision, Sufficient |
| H7 | Media | Formal definition | Axiom0 (`kernel D x y ↔ K_D x y`) no explicado ni justificado en el artículo |
| H8 | Baja | Editorial | ST016_Conjecture mezcla necesidad y suficiencia en una afirmación |
| H9 | Baja | Editorial | Vitest 283/283 listado como "Runtime correctness" — demuestra implementación, no corrección formal |
| H10 | Baja | Formal/Editorial | Example 1: π* debe operar sobre representaciones, no trayectorias; dominio de π* ambiguo |

### Clasificación y Acción R1

| ID | Categoría final | Acción |
| :- | :--- | :--- |
| H1 | Formal definition | Reencuadrar: el teorema es consecuencia definitoria, no resultado sustantivo. Presentar la formalización como marco, no como teorema principal. |
| H2 | Formal definition | Mover ST016_Conjecture a Sec. 7 (Limitations / Future Work → ST-017). Eliminar referencia como resultado demostrado. |
| H3 | Scope | Añadir Non-Claim: "The formal model uses capability labels; semantic grounding in ST-017." |
| H4 | Overclaim | Corregir Abstract e Intro: "MUST possess" → "characterizes capability classes whose removal violates preservation in formalized witness scenarios" |
| H5 | Overclaim | Renombrar "witness bridge" → "formal witness validation schema". Describir construcción manual honestamente. |
| H6 | Formal definition | Añadir nota en Sec. 3 conectando las tres definiciones explícitamente |
| H7 | Formal definition | Exponer Axiom0 en Sec. 3; añadir a Non-Claims su carácter de supuesto |
| H8 | Editorial | Reescribir ST016_Conjecture en Sec. 7 separando necesidad y suficiencia |
| H9 | Editorial | Fix Evidence Matrix: "Vitest" → "Implementation stability (independent of Lean model)" |
| H10 | Editorial | Clarificar en Example 1 que π* sobre R^1, R^2 asume representaciones que codifican historia |

---

## Aggregate Classification

| Category | Count |
| :--- | :--- |
| Formal definition | 5 (H1, H2, H6, H7, H8) |
| Overclaim | 3 (H4, H5, H8) |
| Scope / Non-Claim | 1 (H3) |
| Editorial | 3 (H8, H9, H10) |
| ST-017 suggestion | 1 (H2 → ST-017) |

**Central diagnosis:** Claim–formalization desalignment. The formal architecture is sound; the narrative overstates what is currently certified.

---

## Changes Accepted (to apply in paper-v0.2)

| Issue | Change |
| :- | :--- |
| H4 | Abstract: remove "MUST possess"; replace with scoped characterization claim |
| H4 | Intro: soften "required to ensure π_M(R) = π*(R)" → "formally characterize the conditions" |
| H1 | Sec. 4: reframe Lean work as "formalizes the algebraic framework", not "proves universal necessity theorem" |
| H2 | Sec. 4 + 7: move ST016_Conjecture to Limitations as open research direction for ST-017 |
| H5 | Sec. 4 + 5: rename to "formal witness validation schema"; add honest description of manual construction |
| H6 | Sec. 3: add explicit connection between ST-015 π*(R)=π*(S), PreservesDecision, and Sufficient(M, π*) |
| H7 | Sec. 3: expose Axiom0; add to Non-Claims |
| H9 | Sec. 5 Evidence Matrix: fix "Runtime correctness" label |
| H10 | Sec. 3 Example 1: clarify π* domain (representations encoding history) |

## Changes Rejected

| Issue | Rationale |
| :- | :--- |
| H3 (add formal semantics now) | Out of scope for ST-016. Semantic grounding is ST-017 research. Addressed via Non-Claim addition. |

---

## Hito 2 Closure Criteria

- [x] ≥ 1 formal methods response received (R1)
- [ ] Apply all accepted changes → `paper-v0.2-post-review`
- [ ] Verify: post-review reader correctly identifies what is proved vs. what is future work
- [ ] Tag `paper-v0.2-post-review`

**Next:** Apply 9 surgical corrections. No new Lean modules. No new experiments.
