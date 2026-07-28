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

## R2 — Software / Systems Engineering

**Profile:** Runtime systems / software engineering  
**Q1 (Contribution):** Framework formal para kernel mínimo de gobierno; Lean 4; ablación EXP-004; paquete replicable. Aprecia la separación ST-016/ST-017.  
**Q2 (Formally proved):** Teorema de necesidad en modelo formal; estructura del witness bridge.  
**Q3 (Empirically validated):** EXP-004 (pares policy divergentes); 283/283 tests; 6 dry runs.  
**Q4 (Ambiguous):** Brecha entre modelo formal y runtime TypeScript no explicada. EXP-004 muy breve. Witness bridge descrito como "elevación" pero mecanismo no detallado.  
**Q5 (Hardest to justify):** Witness bridge como elevación automática; 283 tests como evidencia de kernel correctness.

### Hallazgos R2

| ID | Severidad | Categoría | Descripción |
| :- | :--- | :--- | :--- |
| R2-1 | Alta | Editorial + Evidence | Contribuciones 3 y 4 no desarrolladas — EXP-004 sin protocolo ni métricas cuantitativas |
| R2-2 | Media | Editorial | π* ambiguo: ¿π* sobre S o sobre R? Pedir distinción π*_S : S→D y π_M : R→D |
| R2-3 | Media | Editorial | No hay fragmento Lean en el cuerpo; revisor no puede verificar correspondencia modelo-código |
| R2-4 | Alta | Evidence | EXP-004 sin datos cuantitativos — resultados anecdóticos |
| R2-5 | Media | Scope | Brecha formal↔TypeScript no cerrada — falta tabla de mapeo |
| R2-6 | Baja | Editorial | Discusión no conecta principios a resultados concretos |
| R2-7 | Media | Scope | Contribución 2 en Sec. 1.1 sin calificador "within the formal ST-016 model" |
| R2-8 | Baja | Evidence | 283/283 tests mezcla ablación vs. tests generales; no distingue categorías |
| R2-9 | Baja | Future | Trabajo relacionado superficial para audiencia sistemas — falta OPA, Kubernetes admission |

### Clasificación y Acción R2

| ID | Categoría final | Acción |
| :- | :--- | :--- |
| R2-1 | Editorial + Evidence | Añadir tabla de protocolo EXP-004 con columnas: Ablation / Scenario / Expected / Observed |
| R2-2 | Editorial | Sec. 3: añadir distinción π*_S y π_M explícitamente en la definición de sufficiency |
| R2-3 | Editorial | Sec. 4: añadir snippet Lean de definición clave (NecessaryCapability o MinimalRuntime) |
| R2-4 | Evidence | Sec. 5: añadir fila de protocolo con número de scenarios y tipo de divergencia |
| R2-5 | Scope | Sec. 4 o 5: añadir tabla formal concept → runtime implementation |
| R2-6 | Editorial | Sec. 6: vincular cada principio a EXP-004 resultado concreto |
| R2-7 | Scope | Sec. 1.1 Contrib 2: añadir "within the formal ST-016 model" |
| R2-8 | Evidence | Sec. 5: separar tests de ablación de tests de integridad en la Evidence Matrix |
| R2-9 | Future | Log para ST-017 / extended related work — no actuar ahora |

---

## Aggregate Classification (R1 + R2)

| Category | Count | Key items |
| :--- | :--- | :--- |
| Editorial clarity (A) | 7 | H6, H8, H10, R2-2, R2-3, R2-6, R2-7 |
| Evidence interpretation (B) | 4 | R2-1, R2-4, R2-8, H9 |
| Scope / Non-Claim (C) | 3 | H3, R2-5, R2-7 |
| Formal definition (A) | 5 | H1, H2, H7, H5, R2-3 |
| Future / ST-017 (D) | 2 | H3, R2-9 |

**Convergence:** Both reviewers identify the same central gap: claim–formalization desalignment, inadequate EXP-004 description, and unexplained witness bridge mechanism.

---

## Changes Accepted (to apply in paper-v0.3)

| Issue | Change |
| :- | :--- |
| R2-2 | Sec. 3: distinguish π*_S : S→D from π_M : R→D in decision preservation definition |
| R2-3 | Sec. 4: add Lean snippet of NecessaryCapability or MinimalRuntime definition |
| R2-1/4 | Sec. 5: add EXP-004 experimental protocol table with scenario / expected / observed |
| R2-5 | Sec. 4/5: add formal concept → runtime implementation mapping table |
| R2-6 | Sec. 6: link each design principle to concrete EXP-004 result |
| R2-7 | Sec. 1.1 Contrib 2: add "within the formal ST-016 model" qualifier |
| R2-8 | Sec. 5: separate ablation tests from integration tests in Evidence Matrix |

## Changes Rejected

| Issue | Rationale |
| :- | :--- |
| H3 | Semantic grounding → ST-017. Non-Claim added. |
| R2-9 | OPA/Kubernetes refs → extended related work for journal version. |

---

## Hito 2 Closure Criteria

- [x] ≥ 2 responses received (R1 formal methods, R2 software systems)
- [x] R1 corrections applied → `paper-v0.2-post-review`
- [x] All feedback classified
- [x] R2 corrections applied → `paper-v0.3-arxiv-ready`
- [x] `publication/arxiv/` updated with v0.3 PDF
  - SHA-256: `1d5c20c2f9fa235e7ee8f8acc9e60e835afde464b2709befcbf14e1a44848079`
- [x] Tag `paper-v0.3-arxiv-ready`

**✅ Hito 2 CLOSED. Ready for arXiv submission.**
