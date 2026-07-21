# ST-015: Structural Sufficiency Theorem — Prediction

> **Nota.** ST-015 es un teorema de caracterización, no un experimento
> con candidatos. Las "predicciones" son los enunciados formales que se
> espera demostrar. No hay búsqueda sobre representaciones candidatas.

---

## Hipótesis bajo prueba

ST-015 tiene tres hipótesis (definidas en `hypothesis.md`):

| Hipótesis | Enunciado |
|-----------|-----------|
| H1 | $\mathcal{R}_{sufficient}(D) = \{ R : \ker(R) \subseteq K_D \}$ |
| H2 | $\mathcal{R}_{sufficient}(D)$ tiene mínimo único $R_{min}$ con $\ker(R_{min}) = K_D$ |
| H3 | $G(D,R) = \{ c \in C_D : \ker(R) \not\subseteq K_c \}$ |

## Predicción

### Predicción general

Las tres hipótesis se sostienen en el marco del Canonical Core v1.0
(estructura de tipo equivalencia), y la H1 se extiende a cualquier
estructura de tipo binaria monotónica.

### Fundamento

**H1** es consecuencia directa de las definiciones:

- $C_R$ se define como $\{ c : \ker(R) \subseteq K_c \}$ (model.md §2.2).
- $R$ es suficiente para $D$ precisamente cuando $C_D \subseteq C_R$.
- Esto equivale a $\ker(R) \subseteq \bigcap_{c \in C_D} K_c = K_D$.

No hay supuestos no triviales. H1 es una tautología del modelo.

**H2** depende de que $K_D$ sea realizable como núcleo de una
representación. Como $K_D$ es una relación de equivalencia
(intersección de equivalencias), la representación cociente
$s \mapsto [s]_{K_D}$ tiene exactamente $K_D$ como núcleo. Esta
representación existe en el sentido matemático. La cuestión de si es
construible desde observaciones $O$ (i.e., $R_{min} = f(O)$) pertenece
al enriquecimiento, no a la caracterización.

**H3** es la contracción del gap de verificación a núcleos no refinados.
Tampoco requiere supuestos — es la expansión de las definiciones.

### Riesgo de refutación parcial

El único riesgo real es que $\mathcal{R}_{sufficient}(D)$ tenga
**múltiples minimales** (no un único mínimo). Esto ocurriría si $K_D$
no es realizable desde las representaciones admisibles (p.ej., si hay
restricciones de localidad o acotación que impidan construir $S/K_D$).

Sin embargo, la unicidad en el retículo de equivalencias (sin
restricciones de admisibilidad) es directa. La multiplicidad de
minimales solo puede surgir cuando se restringe a una subfamilia
$\mathcal{F} \subset \mathcal{R}$, y en ese caso la caracterización
de la frontera pasa de $K_D$ al conjunto de representaciones
$\sqsubseteq$-minimales dentro de $\mathcal{F} \cap
\mathcal{R}_{sufficient}(D)$.

ST-015 predice que, en el retículo completo de representaciones,
$R_{min}$ es único.

## Criterio de minimalidad

$R_{min}$ es la representación mínima suficiente en el sentido del orden
de refinamiento $\sqsubseteq$. No hay otra noción de minimalidad
(p.ej., cardinalidad de $Z$, coste computacional) — esas pertenecen a
la optimización (Fase IV del roadmap).

## Condiciones de terminación

| Condición | Resultado esperado |
|-----------|-------------------|
| H1 demostrada (caracterización por $K_D$) | Caracterización completa |
| H2 demostrada ($R_{min}$ único) | Caracterización completa |
| H2 refutada (múltiples minimales) | Caracterización parcial |
| H3 demostrada (correspondencia de gaps) | Caracterización completa |
| H1 refutada | Refutada (revisar modelo de capacidad) |
