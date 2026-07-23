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

## 2. Nivelación Formal: Axiomas, Definiciones y Teoremas

Para eliminar cualquier ambigüedad en la metateoría, se establece la distinción estricta entre tres niveles de enunciados:

1. **Axiomas Primitivos ($A_{\text{min}} = \{A_1, A_2, A_3\}$):** Supuestos fundamentales irreductibles sobre la estructura del espacio de detectores y su evolución.
2. **Definiciones Operacionales:** Construcciones sobre el estado primitivo ($\delta(D)$, $EVSI(E)$, $Gov_\epsilon(D)$, etc.).
3. **Teoremas Derivados:** Proposiciones demostradas a partir de los axiomas primitivos y las definiciones (Teorema de Parada EVSI, Teorema de Cota de Regret, Teorema de Conservatividad).

> [!IMPORTANT]
> **Aclaración Metateórica:** El Teorema de Parada Racional EVSI (anteriormente denominado A₄) y el Teorema de Cota Superior de Regret (anteriormente A₅) **no son axiomas**, sino **teoremas derivados** de la base mínima $A_{\text{min}}$.

---

## 3. Los Cuatro Bloques Metateóricos

```text
                     Phase V-A: Metatheory of TAKT
                                   │
      ┌────────────────┬───────────┴───────────┬────────────────┐
      ▼                ▼                       ▼                ▼
Block V-A.1       Block V-A.2             Block V-A.3      Block V-A.4
Conservativity    Axiom Independence      Minimality       Redundancy
(Embedding ι)     (Model Strategy)        (Basis Contract) (Dual Structure)
```

---

### Bloque V-A.1 — Teorema de Embedding Conservativo

#### Definición Formal
Sea $T_{\text{core}} = Theory_{\text{I–III}}$ la teoría de suficiencia de representación (ST-008, ST-015) y $T_{\text{IV-C}} = Theory_{\text{IV-C}}$ la extensión de gobernanza convergente.

#### Teorema V-A.1 (Embedding Conservativo General)
Existe un morfismo/monomorfismo conservativo $\iota: T_{\text{core}} \hookrightarrow T_{\text{IV-C}}$ tal que:
1. Para toda proposición $P$ formulada en el lenguaje de $T_{\text{core}}$, se cumple $T_{\text{IV-C}} \vdash \iota(P) \iff T_{\text{core}} \vdash P$.
2. **Corolario de Colapso en el Límite:** Para todo detector $D$ con $\delta(D) = 0$ y $\epsilon = 0$, el predicado $Gov_0(D)$ en $T_{\text{IV-C}}$ es isomórfico a la suficiencia de representación de ST-015:
   $$Gov_0(D) \iff \text{ker}(R) \subseteq K_D$$

#### Prueba en Lean 4
`TaktFormal/Metatheory/Conservativity.lean`: Construcción formal del embedding $\iota$ y prueba del teorema de conservatividad de teorías.

---

### Bloque V-A.2 — Independencia de Axiomas (Estrategia de Modelos)

Se demuestra la independencia de los 3 axiomas primitivos:

* **Axioma 1 (Alcanzabilidad de Detectores):** $(\mathcal{G}_D, \Phi)$ forma un espacio de transición con objeto inicial $D_{\text{alg}}$ y límite $D_{\text{top}}$.
* **Axioma 2 (Reducción Monótona de Distancia):** $d_{\rightarrow}(\Phi(D, E), D_{\text{top}}) \le d_{\rightarrow}(D, D_{\text{top}})$.
* **Axioma 3 (Homomorfismo de Acción Monoidal):** $\Phi(D, E_2 \circ E_1) = \Phi(\Phi(D, E_1), E_2)$.

#### Estrategia Metodológica de Independencia
Para cada axioma $A_i \in \{A_1, A_2, A_3\}$, se construye un modelo algebraico/geométrico explícito $\mathcal{M}_i$ tal que:
1. $\mathcal{M}_i \models \{A_j : j \neq i\}$ (los demás axiomas se satisfacen).
2. $\mathcal{M}_i \not\models A_i$ ($A_i$ es falso en $\mathcal{M}_i$).
3. Aparece un estado/comportamiento imposible en la teoría completa (demostrando la no-redundancia del axioma).

#### Prueba en Lean 4
`TaktFormal/Metatheory/Independence.lean`: Definición de las 3 estructuras de modelos $\mathcal{M}_1, \mathcal{M}_2, \mathcal{M}_3$ en Lean 4.

---

### Bloque V-A.3 — Minimalidad Axiomática y Contrato de Extensión

#### Teorema V-A.3 (Base Mínima de Gobernanza)
El conjunto $A_{\text{min}} = \{A_1, A_2, A_3\}$ es una **base axiomática mínima** para la Teoría TAKT:
1. $A_{\text{min}} \models T_{\text{TAKT}}$.
2. Ningún subconjunto propio de $A_{\text{min}}$ genera la teoría.
3. El **Teorema de Parada EVSI** y el **Teorema de Cota de Regret** son consecuencias formales deducidas estrictamente de $A_{\text{min}}$ bajo costos aditivos y la estructura dual de distancia.

#### Contrato para Futuras Extensiones (Volumen V)
> **Principio de Minimalidad Axiomática:** Toda futura extensión en las Fases V-B a V-E deberá apoyarse exclusivamente en $A_{\text{min}} = \{A_1, A_2, A_3\}$ o justificar explícitamente y demostrar la necesidad de incorporar un nuevo axioma primitivo.

#### Prueba en Lean 4
`TaktFormal/Metatheory/Minimality.lean`: Deducción formal de los teoremas de parada y regret a partir de $A_{\text{min}}$.

---

### Bloque V-A.4 — Redundancia y Derivación Funcional

#### Justificación Estructural (Estructura Dual $(d_{\rightarrow}, d_{\equiv})$)
La compactación del núcleo alrededor de la distancia dual no es una simplificación estética, sino la demostración de una propiedad estructural:

> **Teorema V-A.4 (Generación Funcional Dual):** Todas las métricas de gobernanza, distancias de perfección $\delta(D)$, brechas de capacidad $G(D, R)$ y márgenes dinámicos $M_D$ son obtenibles **funcionalmente** como proyecciones de la distancia dual $(d_{\rightarrow}, d_{\equiv})$.

---

## 4. Mapa Estructural de Resultados del Núcleo

El siguiente mapa representa las dependencias lógicas deduvisibles entre los resultados centrales de TAKT:

```text
           ┌───────────────────────────────────────────────┐
           │ Axiomas Primitivos A_min = { A₁, A₂, A₃ }     │
           └───────────────────────┬───────────────────────┘
                                   │ (Imprescindible)
                                   ▼
           ┌───────────────────────────────────────────────┐
           │ Suficiencia de Representación ker(R) ⊆ K_D    │ (ST-015)
           └───────────────────────┬───────────────────────┘
                                   │ (Imprescindible)
                                   ▼
           ┌───────────────────────────────────────────────┐
           │ Estructura Dual de Distancia (d_→, d_≡)        │ (IV-C.2)
           └───────────────────────┬───────────────────────┘
                                   │ (Derivación Funcional)
           ┌───────────────────────┴───────────────────────┐
           ▼                                               ▼
┌───────────────────────────────┐               ┌───────────────────────────────┐
│ Distancia de Perfección δ(D)  │               │ Acción Monoidal E_2 ∘ E_1     │ (IV-C.3)
└──────────────┬────────────────┘               └──────────────┬────────────────┘
               │                                               │
               └───────────────────────┬───────────────────────┘
                                       │ (Derivable)
                                       ▼
               ┌───────────────────────────────────────────────┐
               │ Teorema de Parada Racional EVSI π*             │ (IV-C.4)
               └───────────────────────┬───────────────────────┘
                                       │ (Derivable)
                                       ▼
               ┌───────────────────────────────────────────────┐
               │ Teorema de Cota Superior de Regret / Gov_ε    │ (IV-C.5)
               └───────────────────────────────────────────────┘
```

---

## 5. Plan de Mecanización en Lean 4

El trabajo formal de la Fase V-A se ubicará en `takt-formal/TaktFormal/Metatheory/`:

```text
takt-formal/TaktFormal/Metatheory/
├── Basic.lean           -- Estructura formal de A_min = {A1, A2, A3} y definiciones
├── Conservativity.lean  -- Teorema V-A.1 (Embedding conservativo ι: T_core ↪ T_IV-C)
├── Independence.lean    -- Teorema V-A.2 (Modelos independientes M1, M2, M3)
└── Minimality.lean      -- Teorema V-A.3 (Deducción formal de Parada EVSI y Regret Bound)
```

---

## 6. Criterios de Aceptación y Finalización

La Fase V-A se considerará completamente cerrada cuando:
1. Este documento de especificación sea aprobado.
2. Los 4 módulos en Lean 4 compilen cleanly sin advertencias y con **0 `sorry`s**.
3. Se valide formalmente que ninguna extensión del Volumen V viola el **Principio de Minimalidad Axiomática**.
