# Phase V-D: Computational Complexity Theory of TAKT — Design Specification

> **Status:** Active Spec for Phase V-D (Computational Complexity Theory).
> 
> **Prerequisites:** Phase V-0 (Extension Roadmap), Phase V-A (Metatheory), Phase V-B (Composition), Phase V-C (Categorical Unification), Volumes I–IV-C.

---

## 1. Contexto y Cambio de Naturaleza Metodológica

Mientras que las Fases I a V-C desarrollan la **matemática interna y estructural** de TAKT, la **Fase V-D (Teoría de Complejidad Computacional)** realiza un cambio de paradigma: **clasificar la dificultad intrínseca de los problemas algorítmicos que la teoría define**.

Las afirmaciones de complejidad (P, NP, PSPACE, barreras de aproximabilidad y algoritmos FPT) deben apoyarse en:
1. **Especificaciones formales de los problemas de decisión y optimización**.
2. **Reducciones polinomiales explícitas** (e.g. desde `Set Cover`, `Shortest Path` o `DAG Reachability`).
3. **Distinción estricta de modelos** ($\mathbf{GovDet}$ abstracto, $\mathbf{GovDet}$ finito, y el Runtime de TAKT sobre flujos de eventos).

---

## 2. Formalización de Problemas Computacionales Fundamentales

Se definen cuatro problemas computacionales primarios en TAKT:

### 1. `DET-REACH` (Alcanzabilidad de Detectores)
* **Entrada:** Un espacio de detectores $(\mathcal{G}_D, \Phi)$, detector inicial $D_1$, detector objetivo $D_2$.
* **Pregunta:** ¿Existe una secuencia finita de enriquecimientos $\pi = (E_1, \dots, E_k)$ tal que $\Phi(D_1, \pi) = D_2$?

### 2. `OPT-EVSI-PATH` (Ruta Óptima EVSI)
* **Entrada:** Detector inicial $D_0$, conjunto de enriquecimientos conocidos $\mathcal{E}_{\text{known}}$, función de costo $C(E)$, cota $\epsilon$.
* **Salida:** La trayectoria óptima $\pi^* = \arg\min_{\pi} C(\pi)$ tal que $Gov_\epsilon(\Phi(D_0, \pi))$.

### 3. `GOV-VERIFY` (Verificación de $\epsilon$-Gobernanza)
* **Entrada:** Traza de eventos $\tau_{:t}$, detector $D$, cota de regret $\epsilon$.
* **Pregunta:** ¿Satisface la traza la condición de $\epsilon$-gobernanza $Gov_\epsilon(D)$?

### 4. `MIN-ENRICH` (Enriquecimiento Mínimo de Brecha)
* **Entrada:** Detector $D$, conjunto de capacidades requeridas $C_D$, catálogo de enriquecimientos $\mathcal{E}$.
* **Salida:** El subconjunto de enriquecimientos de costo mínimo que elimina la brecha $G(D, R) = \emptyset$.

---

## 3. Los Cinco Bloques de Complejidad Computacional

```text
            Phase V-D: Computational Complexity Theory
                                 │
     ┌──────────────┬────────────┼────────────┬──────────────┐
     ▼              ▼            ▼            ▼              ▼
  Block V-D.1   Block V-D.2  Block V-D.3  Block V-D.4    Block V-D.5
 Formal Problems Bounds &    Inapproxim-  Parameterized   Online Stream
& Decidability  Reductions   ability      Complexity(FPT) Runtime
```

---

### Bloque V-D.1 — Decidibilidad y Modelos de Estado

#### Teorema V-D.1.1 (Decidibilidad en Grafos Finitos)
Si el espacio de enriquecimiento $\mathcal{E}$ y el espacio de detectores $\mathcal{G}_D$ son finitos, los cuatro problemas (`DET-REACH`, `OPT-EVSI-PATH`, `GOV-VERIFY`, `MIN-ENRICH`) son **estrictamente decidibles**.

#### Teorema V-D.1.2 (Semi-decidibilidad en Cierre Infinito)
Si $\text{Closure}_\mathcal{E}(R)$ es infinito, `DET-REACH` es **semi-decidible (Recursivamente Enumerable)** pero indecidible en el caso general sin hipótesis de acotamiento de profundidad.

---

### Bloque V-D.2 — Clasificación de Complejidad y Reducciones Polinomiales

#### Teorema V-D.2.1 (`MIN-ENRICH` es NP-completo)
El problema de decisión `MIN-ENRICH` es **NP-completo**:
1. **Pertenencia a NP:** Dada una trayectoria propuesta $\pi$, se puede verificar en tiempo polinomial $O(|\pi|)$ si elimina la brecha y su costo es $\le K$.
2. **NP-dureza (Reducción desde Set Cover):** Existe una reducción polinomial $SetCover \le_p MIN-ENRICH$ donde cada elemento a cubrir corresponde a una capacidad requerida $c \in C_D$ y cada conjunto a un enriquecimiento $E_i \in \mathcal{E}$.

#### Teorema V-D.2.2 (`OPT-EVSI-PATH` en DAGs vs PSPACE)
* En un grafo de detectores DAG acotado de profundidad $h$, `OPT-EVSI-PATH` resoluble en tiempo polinomial $O(|V| + |E|)$ mediante programación dinámica topológica.
* En espacios de detectores con ciclos o expansión de estado implícito, `OPT-EVSI-PATH` es **PSPACE-completo** (mediante reducción desde $QBF$ / $SuccinctReachability$).

---

### Bloque V-D.3 — Barreras de Aproximabilidad

#### Teorema V-D.3.1 (No-Aproximabilidad Logarítmica de `MIN-ENRICH`)
A menos que $\text{P} = \text{NP}$, no existe ningún algoritmo en tiempo polinomial que aproxime `MIN-ENRICH` con un factor mejor que:
$$(1 - o(1)) \ln |C_D|$$
*Demostración:* Derivado directamente del teorema de inaproximabilidad de Feige para Set Cover.

#### Teorema V-D.3.2 (PTAS para $\epsilon$-Gobernanza Acotada)
Existe un Esquema de Aproximación en Tiempo Polinomial (PTAS) $(1+\delta)$-aproximado para `OPT-EVSI-PATH` en grafos de enriquecimiento acotados por margen dinámico $M_D$.

---

### Bloque V-D.4 — Complejidad Parametrizada (FPT)

Muchos problemas NP-duros en TAKT admiten algoritmos FPT cuando se parametrizan por la estructura interna de la teoría:

#### Parámetros Estructurales de TAKT:
1. Dimensión del Kernel: $k = |\text{dim}(K_D)|$.
2. Treewidth del Grafo de Enriquecimiento: $w = \text{tw}(\mathcal{G}_D)$.
3. Profundidad del Horizonte de Intervención: $h$.

#### Teorema V-D.4.1 (Algoritmo FPT para `MIN-ENRICH` por Dimensión de Kernel)
`MIN-ENRICH` es **Fixed-Parameter Tractable (FPT)** respecto a la dimensión del kernel $k$:
$$\text{Tiempo de Cómputo} = O(2^k \cdot |\mathcal{E}|)$$
*Consecuencia:* Para decisiones complejas pero con núcleos de capacidad pequeños ($k \le 15$), la planeación EVSI óptima se resuelve exactamente en milisegundos.

---

### Bloque V-D.5 — Complejidad del Runtime en Línea (Online Event Stream)

#### Teorema V-D.5.1 (Verificación en Tiempo Amortizado $O(1)$)
El componente `TrajectoryMonitor` y `ContractEvaluator` del runtime en línea (Fase G) verifica cada evento entrante en tiempo amortizado $O(1)$ y espacio memoria constante $O(|K_D|)$.

---

## 4. Plan de Mecanización en Lean 4

El trabajo formal de la Fase V-D se ubicará en `takt-formal/TaktFormal/Complexity/`:

```text
takt-formal/TaktFormal/Complexity/
├── Problems.lean      -- Definiciones formales de DET-REACH, OPT-EVSI-PATH, MIN-ENRICH
├── Decidability.lean  -- Teoremas de decidibilidad en grafos finitos vs infinitos (V-D.1)
├── Reductions.lean    -- Reducciones polinomiales y teoremas de NP/PSPACE (V-D.2)
├── Parameterized.lean -- Algoritmos FPT y cotas por dimensión de kernel k (V-D.4)
├── Runtime.lean       -- Cotas de tiempo amortizado O(1) en runtime en línea (V-D.5)
└── Complexity.lean   -- Re-exportador global TaktFormal.Complexity
```

Cada archivo incluirá la cabecera obligatoria `Module`, `Depends on` y `Exports`.

---

## 5. Criterios de Aceptación y Finalización

La Fase V-D se considerará cerrada cuando:
1. La especificación en este documento sea aprobada.
2. Los 5 módulos en Lean 4 compilen cleanly sin advertencias y con **0 `sorry`s**.
3. Se demuestren formalmente las reducciones de complejidad y los teoremas FPT por dimensión de kernel.
