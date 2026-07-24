# TACIT_AUDIT.md: Registro Vivo de Conocimiento Tácito de TAKT

Este documento es una bitácora científica donde se registran, clasifican y eliminan de forma explícita todos los **supuestos implícitos o conocimiento tácito del autor** descubiertos durante las fases de revisión y replicación independiente.

---

## Estructura de Registro

Cada hallazgo se documenta bajo el siguiente esquema uniforme:

```markdown
### [TACIT-XXX] Título del Supuesto

* **ID:** TACIT-XXX
* **Supuesto implícito:** Descripción clara de lo que el autor daba por sentado sin haber escrito.
* **Dónde apareció:** Documento o archivo de código involucrado (con ruta exacta).
* **Cómo se descubrió:** Proceso de revisión, fallo de adaptador de tercero o duda durante replicación.
* **Cómo se eliminó:** Modificación realizada en el contrato/especificación para volver explícito el conocimiento.
* **Estado:** [ IDENTIFIED | RESOLVED | VERIFIED ]
```

---

## Registro de Conocimiento Tácito

### [TACIT-001] Elección del Criterio de Hash de Estado

* **ID:** TACIT-001
* **Supuesto implícito:** Se asumía implícitamente que el hash de estado (`state_hash`) debía incluir el timestamp de la ejecución, lo que destruía el determinismo entre corridas identicas.
* **Dónde apareció:** `docs/takt-spt-bridge.md#L45`
* **Cómo se descubrió:** Durante la auto-evaluación del adaptador generador de trazas.
* **Cómo se eliminó:** Se especificó en `02-adapter-contract.md` que `state_hash` debe ser puramente funcional del estado observado sin variables de tiempo real.
* **Estado:** VERIFIED

---

### [TACIT-002] Definición de Niveles de Granularidad Discretos

* **ID:** TACIT-002
* **Supuesto implícito:** Se daba por hecho que cualquier dominio tenía exactamente dos niveles de abstracción (`coarse` y `fine`) con una proyección suryectiva natural entre ellos.
* **Dónde apareció:** `docs/canonical-core-v1.0.md`
* **Cómo se descubrió:** Al intentar aplicar el protocolo a sistemas continuos o jerarquías multitrama (>2 niveles).
* **Cómo se eliminó:** Se actualizó la especificación para admitir una lista finita arbitraria de niveles $g_1 \prec g_2 \prec \dots \prec g_k$ con proyección $p_{ij}: g_j \to g_i$.
* **Estado:** RESOLVED

---

### [TACIT-003] Criterio de Parada Terminal en Dominios Reactivos

* **ID:** TACIT-003
* **Supuesto implícito:** El autor asumía que las secuencias de observación siempre alcanzaban un estado terminal explícito (`is_terminal=True`), omitiendo la especificación para bucles reactivos infinitos.
* **Dónde apareció:** `replication-package-v1/R1-PROTOCOL.md`
* **Cómo se descubrió:** Análisis de casos límite en servidores y agentes conversacionales en bucle.
* **Cómo se eliminó:** Se estableció una ventana de horizonte temporal fijo ($H=100$ o $H=1000$) para dominios sin estado absorbente.
* **Estado:** IDENTIFIED
