# Phase V-A: Metatheory of TAKT — Design Specification

> **Status:** Active Spec for Phase V-A (Metatheory of TAKT).
> 
> **Prerequisites:** Phase V-0 (Extension Roadmap), Volumes I–IV-C (Lean 4 verified core).

---

## 1. Contexto y Pregunta Central de Investigación

Tras el cierre del núcleo axiomático en la Fase IV-C (mecanizado en Lean 4), TAKT cuenta con un motor formal completo desde la representación hasta la gobernanza ejecutable.

La **Fase V-A (Metateoría de TAKT)** realiza un cambio de nivel de abstracción: **el objeto de estudio deja de ser el sistema gobernado y pasa a ser la propia teoría TAKT y su lenguaje formal**.

### Pregunta Central de V-A
> **¿Qué propiedades del núcleo son estructuralmente esenciales y cuáles son consecuencia de otras?**

---

## 2. Los Cuatro Bloques Metateóricos

```text
                     Phase V-A: Metatheory of TAKT
                                   │
      ┌────────────────┬───────────┴───────────┬────────────────┐
      ▼                ▼                       ▼                ▼
Block V-A.1       Block V-A.2             Block V-A.3      Block V-A.4
Conservativity    Axiom Independence      Minimality       Redundancy
```

---

### Bloque V-A.1 — Teorema de Conservatividad

#### Definición Formal
Sea $T_{\text{core}} = Theory_{\text{I–III}}$ la teoría de suficiencia de representación (ST-008, ST-015) y $T_{\text{IV-C}} = Theory_{\text{IV-C}}$ la extensión de gobernanza convergente.

#### Teorema V-A.1 (Conservatividad Estructural)
$T_{\text{IV-C}}$ es una extensión **estrictamente conservativa** de $T_{\text{core}}$. Es decir:
1. Ninguna proposición demostrable en $T_{\text{core}}$ se invalida en $T_{\text{IV-C}}$.
2. Para todo detector perfecto $D$ tal que $\delta(D) = 0$ y $\epsilon = 0$, el predicado de $\epsilon$-gobernanza $Gov_\epsilon(D)$ colapsa isomórficamente a la condición de suficiencia estructural de ST-015:
   $$Gov_0(D) \iff \text{ker}(R) \subseteq K_D$$

#### Prueba esperada en Lean 4
`TaktFormal/Metatheory/Conservativity.lean`: Demostrar la equivalencia bi-direccional en el límite $\delta = 0, \epsilon = 0$.

---

### Bloque V-A.2 — Independencia de Axiomas

Se evalúa la independencia lógica de los 5 axiomas centrales introducidos en la Fase IV-C.1:

1. **Axioma 1 (Alcanzabilidad de Detectores):** $(\mathcal{G}_D, \Phi)$ forma un espacio de transición con objeto inicial $D_{\text{alg}}$ y límite $D_{\text{top}}$.
2. **Axioma 2 (Reducción Monótona de Distancia):** $d_{\rightarrow}(\Phi(D, E), D_{\text{top}}) \le d_{\rightarrow}(D, D_{\text{top}})$.
3. **Axioma 3 (Homomorfismo de Acción Monoidal):** $\Phi(D, E_2 \circ E_1) = \Phi(\Phi(D, E_1), E_2)$.
4. **Axioma 4 (Parada Racional EVSI):** $EVSI(E) \le Cost(E) \implies \text{STOP}$.
5. **Axioma 5 (Cota Superior de Regreso/Loss):** $Gov_\epsilon(D) \implies Regret(D) \le \epsilon$.

#### Teorema V-A.2 (Independencia Axiomática)
Para cada axioma $A_i \in \{A_1, A_2, A_3, A_4, A_5\}$, existe un modelo matemático $\mathcal{M}_i$ en el que todos los axiomas $\{A_j : j \neq i\}$ son válidos pero $A_i$ es falso.

#### Prueba esperada en Lean 4
`TaktFormal/Metatheory/Independence.lean`: Construcción explícita de los 5 contraejemplos/modelos independientes en Lean 4.

---

### Bloque V-A.3 — Minimalidad Axiomática ($A_{\text{min}}$)

#### Definición
Un conjunto de axiomas $A$ es **mínimo** para TAKT si $A \models T_{\text{TAKT}}$ y ningún subconjunto propio $A' \subset A$ satisface $A' \models T_{\text{TAKT}}$.

#### Teorema V-A.3 (Base Mínima de Gobernanza)
El conjunto mínimo generador $A_{\text{min}}$ consta de exactamente 3 axiomas:
$$A_{\text{min}} = \{ A_1 \text{ (Evolución)}, A_2 \text{ (Geometría Monótona)}, A_3 \text{ (Álgebra de Enriquecimiento)} \}$$
Los axiomas $A_4$ (Parada EVSI) y $A_5$ (Regret Bound) son **teoremas derivados** de $A_{\text{min}}$ bajo las definiciones de costo aditivo y topología de distancia dual $(d_{\rightarrow}, d_{\equiv})$.

#### Prueba esperada in Lean 4
`TaktFormal/Metatheory/Minimality.lean`: Demostración en Lean 4 de que $A_4$ y $A_5$ se deducen formalmente de $A_1, A_2, A_3$.

---

### Bloque V-A.4 — Eliminación de Redundancia y Compactación

#### Propósito
Auditar la totalidad de definiciones, métricas secundarias y lemmas de soporte acumulados en Fases I a IV-C para reducir el tamaño conceptual del núcleo sin perder expresividad.

#### Acciones Metateóricas:
1. Unificar las distancias intermedias de la Fase IV-C.2 en el par ordenado dúal $(d_{\rightarrow}, d_{\equiv})$.
2. Demostrar la equivalencia formal entre la brecha de capacidad $G(D, R)$ y la distancia de perfección $\delta(D)$.
3. Reducir la firma de `computeDynamicMargin` a la evaluación sobre el Kernel $K_D$.

---

## 3. Plan de Mecanización en Lean 4

El trabajo formal de la Fase V-A se ubicará en la nueva carpeta `takt-formal/TaktFormal/Metatheory/`:

```text
takt-formal/TaktFormal/Metatheory/
├── Basic.lean           -- Estructura formal de la Metateoría y firmas de axiomas
├── Conservativity.lean  -- Teorema V-A.1 (Conservatividad IV-C ↦ I–III)
├── Independence.lean    -- Teorema V-A.2 (Modelos independientes para A1..A5)
└── Minimality.lean      -- Teorema V-A.3 (Deducción de A4 y A5 desde A_min)
```

---

## 4. Criterio de Finalización

La Fase V-A se considerará cerrada cuando:
1. La especificación en este documento sea revisada y aprobada.
2. Los 3 módulos de Lean 4 (`Conservativity.lean`, `Independence.lean`, `Minimality.lean`) compilen limpiamente sin advertencias y con **0 `sorry`s**.
3. Se actualice `docs/theory-roadmap.md` reflejando el cierre metateórico de la Fase V-A.
