# Extension Roadmap — Volume V: Extensions & Metatheory

> **Status:** Research Architecture Contract for Volume V of TAKT.
> 
> **Foundational Core Status:** Closed and frozen across Volumes I–IV-C. All core claims formalized and mechanized in Lean 4 (168 verified jobs, 0 `sorry`s).

---

## 1. Filosofía del Volumen V

El núcleo axiomático de TAKT (Volúmenes I–IV-C) se considera **cerrado y conservado**. 

Las investigaciones del Volumen V no modifican dicho núcleo, sino que estudian extensiones compatibles, demostrando en cada caso si preservan o no las garantías fundamentales.

### Transición de Naturaleza Teórica e Ingeniería

| Etapa | Objeto de Estudio | Pregunta Central | Estado |
| :--- | :--- | :--- | :--- |
| **Volúmenes I–III** | Representación y Suficiencia | *¿Qué información es suficiente para no perder la decisión óptima?* | Cerrado (ST-008, ST-015) |
| **Volumen IV** | Gobernabilidad Ejecutable | *¿Cómo evolucionar de forma óptima hasta una gobernanza suficiente?* | Cerrado (Fase IV-C Lean 4) |
| **Volumen V** | Extensión, Escala y Metateoría | *¿Cómo escala la teoría bajo composición, incertidumbre, complejidad y abstracción?* | **Abierto (Volumen V)** |

---

## 2. Clasificación de Resultados Esperados

Todas las proposiciones y teoremas desarrollados en el Volumen V deben clasificarse bajo una de las siguientes cuatro categorías estructurales:

| Tipo de Resultado | Definición | Criterio de Aceptación |
| :--- | :--- | :--- |
| **Conservación** | Demuestra que la teoría original se mantiene intacta bajo la extensión. | Demostrar que para $\delta(D)=0$ o $\epsilon=0$, la extensión colapsa exactamente al núcleo I–IV-C. |
| **Generalización** | Demuestra que la teoría funciona en un dominio más amplio. | Extender los teoremas a estructuras compuestas, estocásticas o categóricas preservando garantías. |
| **Limitación** | Demuestra que cierta extensión o aproximación es matemáticamente/computacionalmente imposible. | Establecer fronteras de decidibilidad, complejidad (P/NP/PSPACE) o no-aproximabilidad. |
| **Equivalencia** | Demuestra que dos formulaciones aparentemente distintas son la misma teoría. | Demostrar isomorfismo o adjunción entre representaciones alternativas. |

---

## 3. Grafo de Dependencias del Volumen V

```text
                V-0 (Extension Roadmap)
                 │
        ┌────────┴────────┐
        │                 │
        ▼                 ▼
      V-A (Metateoría)  V-B (Composición)
        │                 │
        └────────┬────────┘
                 ▼
              V-C (Unificación Categórica)
              ┌──┴──┐
              ▼     ▼
             V-D   V-E
        (Complejidad)(Probabilidad)
```

### Matriz de Dependencias y Reutilización

| Fase | Título | Dependencia Directa | Reutilización Axiomática Core | Produce / Resultado Principal |
| :--- | :--- | :--- | :--- | :--- |
| **V-0** | **Extension Roadmap** | Fases I–IV-C | `docs/theory-roadmap.md` | Arquitectura y contrato de investigación |
| **V-A** | **Metateoría** | Fases I–IV-C | Axiomas 1–5 de IV-C.1, $K_D$, $\mathcal{E}$ | Conservatividad, Minimalidad $A_{\text{min}}$, Independencia |
| **V-B** | **Composición** | IV-C.1, IV-C.2, IV-C.6 | Espacio $\mathcal{G}_D$, Márgenes $M_D$, Traces $\tau_{:t}$ | Álgebra de sistemas compuestos ($S_1 \otimes S_2$, $S_2 \circ S_1$), transmisión $\epsilon$ |
| **V-C** | **Unificación Categórica** | V-A, V-B | Monoide $\mathcal{E}$, Distancias $d_{\rightarrow}, d_{\equiv}$ | Categoría Monoidal $\mathbf{GovDet}$, Adjunciones, Límites/Colímites |
| **V-D** | **Complejidad Computacional**| IV-C.4, V-C | Trajetorias $C(\pi)$, Parada EVSI $\pi^*$ | Clases de complejidad para EVSI y Reachability, no-aproximabilidad |
| **V-E** | **Gobernanza Probabilística** | V-C | Detectores $D_{\text{alg}}$, Margen $M_D$ | Detectores en $[0, 1]$, Mónada probabilística sobre $\mathbf{GovDet}$, EVSI estocástico |

---

## 4. Desglose de Líneas de Investigación

### Fase V-0 — Extension Roadmap (Arquitectura)
* **Objetivo:** Definir el contrato de investigación del Volumen V sin introducir teoremas nuevos.
* **Función:** Establecer fronteras, clasificaciones de resultados y grafos de dependencias.
* **Criterio de Éxito:** Documento congelado y aprobado como referencia para V-A a V-E.

---

### Fase V-A — Metateoría de TAKT
* **Problema:** Demostrar propiedades *de la propia teoría* (meta-propiedades), no solo *dentro* de la teoría.
* **Preguntas Centrales:**
  * ¿Es la Fase IV-C una extensión estrictamente conservativa respecto a I–III?
  * ¿Son los 5 invariantes de evolución independientes entre sí?
  * ¿Existe un conjunto axiomático mínimo $A_{\text{min}}$ tal que $A_{\text{min}} \models \text{TAKT}$?
* **Tipos de Resultado:** Conservación, Limitación, Minimalidad.
* **Criterio de Éxito:** Verificación en Lean 4 de independencia de axiomas y teorema de conservatividad.

---

### Fase V-B — Teoría de Composición de Sistemas Gobernados
* **Problema:** Determinar las propiedades de gobernanza cuando interactúan múltiples sistemas gobernados.
* **Estructuras a Formalizar:**
  * Composición paralela: $S_1 \otimes S_2$
  * Composición en cascada: $S_2 \circ S_1$
  * Preservación de margen dinámico $M_D(S_1 \otimes S_2)$
  * Propagación de brechas $G(D, R)$ y transmisión de $\epsilon$-gobernanza.
* **Tipos de Resultado:** Generalización, Conservación.
* **Criterio de Éxito:** Teoremas de composición estableciendo cotas para $\epsilon_{12}$ en función de $\epsilon_1$ y $\epsilon_2$.

---

### Fase V-C — Unificación Categórica ($\mathbf{GovDet}$)
* **Problema:** Formular la teoría completa en el lenguaje algebraico de Teoría de Categorías para unificar representación, enriquecimiento y composición.
* **Objetos y Morfismos:**
  * Categoría $\mathbf{GovDet}$: Objetos = Detectores $D \in \mathcal{G}_D$, Morfismos = Enriquecimientos $E: D_1 \to D_2$.
  * Estructura Monoidal: $(\mathbf{GovDet}, \otimes, I)$ representando composición paralela con objeto identidad.
  * Funtores y Adjunciones: Funtores entre espacios de representación $\mathcal{R}_A \to \mathcal{R}_B$ y adjunciones abstracción $\dashv$ enriquecimiento.
  * Límites y Colímites: Detectores mínimos combinados (límites) y amalgamas de gobernanza (colímites).
* **Tipos de Resultado:** Equivalencia, Generalización.
* **Criterio de Éxito:** Formalización de la categoría monoidal $\mathbf{GovDet}$ y demostración de preservación de suficiencia mediante adjunciones.

---

### Fase V-D — Teoría de Complejidad Computacional
* **Problema:** Determinar el coste algorítmico e intrínseco de aplicar la teoría TAKT.
* **Preguntas Centrales:**
  * Complejidad de Reachability en el grafo de detectores $(\mathcal{G}_D, \Phi)$.
  * Complejidad de búsqueda de la trayectoria óptima EVSI $\pi^*$ sobre $\text{Closure}_\mathcal{E}(R)$.
  * Existencia y límites de algoritmos de aproximación polinomial para $\epsilon$-gobernanza.
* **Tipos de Resultado:** Limitación, Generalización.
* **Criterio de Éxito:** Caracterización de clases de complejidad (P, NP, PSPACE) y teoremas de barrera de aproximabilidad.

---

### Fase V-E — Teoría Probabilística de Gobernanza
* **Problema:** Generalizar TAKT a entornos con incertidumbre explícita, observabilidad parcial y trazas ruidosas.
* **Preguntas Centrales:**
  * Detectores suaves $D: \tau \to [0, 1]$ y distribución de eventos $P(\tau)$.
  * Margen Dinámico Estocástico $M_D^\mathbb{P}$ y confianza en la gobernanza.
  * Formulación mediante mónadas de probabilidad sobre $\mathbf{GovDet}$.
* **Tipos de Resultado:** Generalización, Conservación (demostrando que $P(\tau) = \delta_{\tau_0}$ recupera el modelo determinista).
* **Criterio de Éxito:** Teorema de Parada EVSI Estocástico y conservación del límite determinista.
