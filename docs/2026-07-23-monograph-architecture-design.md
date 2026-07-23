# TAKT Unified Treatise & Monograph Architecture — Design Specification

> **Status:** Active Spec for Step 2 / Pillar 2 (Consolidación Editorial: La Monografía Unificada de TAKT).
> 
> **Prerequisites:** Volumes I–V (Lean 4 verified core & extensions), `scientific-positioning-audit.md`, `takt-foundations-paper.md`.

---

## 1. Contexto y Filosofía de Arquitectura Editorial

Tras estabilizar la metateoría, la composición, las categorías, la complejidad y la incertidumbre en Lean 4, y haber completado la auditoría científica y el borrador fundacional (Paso 1), el **Paso 2 (Consolidación Editorial)** transforma el repositorio en un **Tratado Matemático Unificado**.

La monografía no se organiza cronológicamente (según la historia del desarrollo de TAKT), sino **lógicamente (según la dependencia formal de las ideas)**.

### El Criterio de Trazabilidad Triple (Level 1 / Level 2 / Level 3)
Cada concepto, definición y teorema en la monografía se presentará bajo tres niveles de lectura integrados:

```text
 ┌────────────────────────────────────────────────────────────────────────┐
 │                      EL TRIPLE NIVEL DE LECTURA DE TAKT                │
 └────────────────────────────────────────────────────────────────────────┘
                                      │
         ┌────────────────────────────┼────────────────────────────┐
         ▼                            ▼                            ▼
  Nivel 1: NARRATIVO           Nivel 2: MATEMÁTICO           Nivel 3: FORMAL (LEAN 4)
 Motivación conceptual,       Demostración rigurosa,       Enlace directo a `takt-formal/`,
 intuición y contexto         teorema formal y pruebas     símbolos exactos y estado de
 de decisión.                 en texto.                    mecanización (0 `sorry`s).
```

---

## 2. Estructura Maestra de la Monografía (`docs/monograph/`)

La monografía se ubicará en el directorio `docs/monograph/` con la siguiente arquitectura de archivos:

```text
docs/monograph/
├── README.md                           -- Índice Maestro & Guía de Lectura Triple
├── 00-front-matter/
│   ├── preface.md                      -- Prefacio & Filosofía "Adecuación sobre Compleitud"
│   ├── notation-conventions.md        -- Convenciones Matemáticas & Tabla de Símbolos
│   ├── glossary.md                     -- Glosario Canónico Armonizado
│   └── global-dependency-map.md        -- Grafo Global de Dependencias Teóricas
├── 01-volume-1-foundations/
│   └── volume-1-foundations.md        -- Problema, Modelo, Representaciones, Capacidades
├── 02-volume-2-structural-sufficiency/
│   └── volume-2-structural-sufficiency.md -- Capability Kernels, ST-015, R_min, Runtime
├── 03-volume-3-governance/
│   └── volume-3-governance.md          -- Gobernanza, EVSI, Políticas, Parada Racional π*
├── 04-volume-4-governed-convergence/
│   └── volume-4-governed-convergence.md -- Geometría Dual (d_→, d_≡), Margen M_D, Horizonte h*
├── 05-volume-5-extensions-metatheory/
│   └── volume-5-extensions-metatheory.md -- Metateoría, Composición, GovDet, Complejidad, Probabilidad
└── 06-back-matter/
    ├── literature-positioning.md       -- Relación Comparativa con la Literatura (Auditoría Paso 1)
    ├── theorem-index.md                -- Índice de Teoremas & Enlaces Lean 4
    ├── definition-index.md             -- Índice de Definiciones Canónicas
    └── lean-mapping-matrix.md          -- Matriz General de Trazabilidad Lean ↔ Texto
```

---

## 3. Detalle de Contenido por Sección

### Front Matter
- **`preface.md`:** Motivación del diseño gobernado y el cambio de paradigma de "conocimiento completo" a "conocimiento adecuado".
- **`notation-conventions.md`:** Notación unificada (espacio de estados $S$, acciones $A$, utility $U$, contrato $D$, kernels $K_D$, márgenes $M_D$, categoría $\mathbf{GovDet}$, etc.).
- **`glossary.md`:** Términos estandarizados de la auditoría del Paso 1 (eliminando redundancias como "defect", "error" o "gap").
- **`global-dependency-map.md`:** Grafo Mermaid detallando la cadena axiomática A0 $\to$ ST-015 $\to$ $M_D$ $\to$ $\mathbf{GovDet}$ $\to$ FPT / Monad.

### Volumen I — Foundations
- Formulación del problema de la decisión en sistemas abstractos y agentes autónomos.
- Primitivas de representación $R: S \to Z$, capacidades $C_D$ y fricción de adquisición de información.
- Teoremas fundamentales iniciales de compatibilidad de decisiones.

### Volumen II — Structural Sufficiency
- Definición de Capability Kernels $K_D = \bigcap_{c \in C_D} K_c$.
- Demostración y discusión del **Teorema de Suficiencia Estructural (ST-015)**: $\text{ker}(R) \subseteq K_D \iff R \in \mathcal{R}_{\text{sufficient}}(D)$.
- Representación canónica mínima $R_{\text{min}} = S / K_D$ y cota finita $|S / K_D| \le 2^k$.
- Correspondencia directa con los contratos del runtime (`cli/src/runtime/`).

### Volumen III — Governance & Information Value
- Predicados de gobernabilidad estática y dinámica.
- Valor Esperado de la Información de Muestreo (EVSI) en grafos de detectores.
- **Teorema de Parada Racional EVSI ($\pi^*$):** $\forall E, \, EVSI(E \mid D^*) \le C_{\text{acq}}(E) \iff \text{STOP}$.
- Formulación del planner de intervención mínima.

### Volumen IV — Governed Convergence & Geometry
- Espacio de detectores $\mathcal{D}_{\text{sound}}$ y grafo $\mathcal{G}_D$.
- **Geometría Dual de Gobernanza:** Distancia dirigida $d_{\rightarrow}(D_1, D_2)$, funcional de distancia de perfección $\delta(D)$ y pseudométrica simétrica de capacidad $d_{\equiv}(D_1, D_2)$.
- **Margen Dinámico de Surprisal $M_D(\tau_{:t})$** y **Teorema del Horizonte de Intervención Certificado ($h^* = \lfloor M_D / c_{\text{max}} \rfloor$)**.
- Calibración asimétrica frente a error de modelo ($M_D^{\text{calib}}$) y teoremas de límites de imposibilidad (ST-008).

### Volumen V — Extensions & Metatheory
- **V-A Metateoría:** Embebimiento conservativo $\iota$, independencia de axiomas $A_1, A_2, A_3$, minimalidad y redundancia dual.
- **V-B Composición de Sistemas:** Producto paralelo $S_1 \otimes S_2$, cascada $S_2 \circ S_1$ y Teorema de Transmisión $Gov_{\epsilon_1 + \epsilon_2}(S_1 \otimes S_2)$.
- **V-C Unificación Categórica:** Categoría monoidal $(\mathbf{GovDet}, \otimes, I)$ y Adjunción Canónica Abstracción-EVSI ($\mathcal{A} \dashv \mathcal{E}$).
- **V-D Complejidad Computacional:** Decidabilidad en grafos finitos, reducciones polinomiales y **Complejidad Parametrizada FPT ($\mathcal{O}(2^k \cdot |\mathcal{E}|)$)** por dimensión de kernel $k = |C_D|$.
- **V-E Gobernanza Probabilística:** Detectores suaves $D: \tau \to [0, 1]$, $(\epsilon, \alpha)$-gobernanza de confianza, Mónada de Probabilidad $\mathcal{T}_{\mathbb{P}}$ y **Teorema de Colapso Determinista de Dirac** ($P \to \delta_{\tau_0}$).

### Back Matter
- **`literature-positioning.md`:** Incorporación directa de la auditoría científica del Paso 1 (Blackwell, Bisimulación, Categorías de Procesos, Giry, POMDPs).
- **`theorem-index.md` & `definition-index.md`:** Índices con hipervínculos a los archivos `.lean` en `takt-formal/TaktFormal/`.
- **`lean-mapping-matrix.md`:** Matriz exhaustiva de trazabilidad formal (Nombre del Teorema en Texto $\leftrightarrow$ Módulo Lean 4 $\leftrightarrow$ Estado de Verificación).

---

## 4. Criterios de Aceptación del Paso 2

La monografía se considerará completada cuando:
1. El directorio `docs/monograph/` esté completamente creado y poblado.
2. Cada capítulo contenga la estructura de lectura triple (Narrativa, Matemática, Lean 4).
3. La Matriz de Trazabilidad Lean ↔ Texto en `lean-mapping-matrix.md` mapee el 100% de los 226 teoremas verificados sin vacíos ni contradicciones.
