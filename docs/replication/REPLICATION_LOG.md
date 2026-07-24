# REPLICATION_LOG.md: Registro Oficial de Réplicas de TAKT

Este registro contabiliza **todas** las réplicas ejecutadas de la teoría y protocolo TAKT, incluyendo éxitos, réplicas inconclusas y falsaciones empíricas.

---

## Registro de Experimentos: Serie R (Teoría) y Serie T (Transportabilidad)

| ID | Fecha | Serie | Dominio | Replicador | Nivel Indep. | Tipo | Resultado | Fricción ($N_{consults} / T_{exp}$) | Conocimiento Tácito Aportado |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **R-000** | 2026-07-20 | **R** | AST Refining (Internal) | Autor (Valentin) | **Nivel 0** | Baseline | PASS | N/A | Baseline autor inicial |
| **R-001** | 2026-07-24 | **R** | Auto-Verification Harness | Kit Auto-Check | **Nivel 0** | Baseline | PASS | 0 / 0.1h | `TACIT-001`, `TACIT-002` |
| **T-001** | *Pendiente* | **T** | *First Independent Rep.* | Independent #1 | **Nivel 3** | Blind | *En espera* | *Por medir* | *Transportabilidad inicial* |
| **T-002** | *Pendiente* | **T** | *Multi-Replicator Study* | Varios Replicadores | **Nivel 3** | Open | *En espera* | *Por medir* | *Distribución de fricción* |
| **T-003** | *Pendiente* | **T** | *Public Adoption* | Comunidad Abierta | **Nivel 4** | Spontaneous | *En espera* | *Por medir* | *Adopción autónoma* |
| **T-004** | *Pendiente* | **T** | *Adversarial Stress Test* | External Red-Team | **Nivel 3/4** | Adversarial | *En espera* | *Por medir* | *Límites y falsabilidad* |



---

## Detalle de Entradas

### [R-000] Baseline Interno (Refinement Planner AST)
* **Autor:** Valentin Lineiro (Autor original TAKT)
* **Dominio:** Transformación y refinamiento de AST en generador de código.
* **Resultado:** PASS (Interno)
* **Notas:** Evaluó la convergencia inicial y definió las primeras versiones de $H_{enrichment}$ y $R_2$.

### [R-001] Auto-Evaluación del Kit de Replicación v1.2 / R2
* **Autor:** Subsistema de Verificación Automática (`verify_adapter.py`)
* **Dominio:** Sintético / Entorno Mock de referencia.
* **Resultado:** PASS
* **Conocimiento Tácito Identificado:** `TACIT-001` (Determinismo de Hash), `TACIT-002` (Estructura multitrama de granularidad).
* **Cambios en Documentación:** Creación de `REPLICATION_SPEC.md` y formalización de `02-adapter-contract.md`.

---

## Instrucciones para Registrar una Nueva Réplica

Para añadir una réplica a este registro:
1. Asegurarse de adjuntar el informe completado según `REPLICATION_REPORT_TEMPLATE.md`.
2. Registrar cualquier entrada de conocimiento tácito descubierta en `TACIT_AUDIT.md`.
3. Asignar un ID secuencial (`R-003`, `R-004`, etc.) e ingresar la fila correspondiente en la tabla superior.
