# Fase B — Separación formal: Decision-Sufficient Representations

## Objetivo

Determinar si la equivalencia entre TAKT y \(\pi^*\)-suficiencia es total
o si existe separación al fortalecer la hipótesis a \(Q^*\)-suficiencia.

## Hipótesis de equivalencia

La relación de preservación de TAKT (\(\ker(R) \subseteq \ker(D)\)) es
exactamente la \(\pi^*\)-suficiencia (\(\phi(s_1)=\phi(s_2) \Rightarrow
\pi^*(s_1)=\pi^*(s_2)\)). Ambas son la misma condición en lenguajes
distintos.

## Traducción formal (referencia a Fase A)

Ver `03-decision-sufficient.md`, sección «Equivalencia», Hipótesis 1.

La tabla de correspondencia muestra equivalencia solo para
\(\pi^*\)-suficiencia:

| Tipo                  | Relación con \(\ker(R) \subseteq \ker(D)\) |
|-----------------------|-------------------------------------------|
| \(Q^*\)-suficiencia   | Estrictamente más fuerte                  |
| \(a^*\)-suficiencia   | Estrictamente más fuerte                  |
| \(\pi^*\)-suficiencia | **Equivalente**                           |
| Valor-suficiencia     | Estrictamente más débil                   |

## Hipótesis de separación

TAKT es equivalente a \(\pi^*\)-suficiencia, pero no a \(Q^*\)-suficiencia.
La separación es por **fortalecimiento**: si se exige que la representación
preserve el valor \(Q^*(s,a)\) (no solo la acción óptima), la equivalencia
se rompe.

## Contraejemplo mínimo

Sean \(S = \{s_1, s_2\}\), \(A = \{a, b\}\).

| Estado | \(Q^*(s, a)\) | \(Q^*(s, b)\) | \(\pi^*(s)\) |
|--------|---------------|---------------|--------------|
| \(s_1\) | 10          | 5             | \(a\)        |
| \(s_2\) | 8           | 3             | \(a\)        |

- \(\phi_{\pi^*}(s_1) = \phi_{\pi^*}(s_2)\) porque \(\pi^*(s_1) = a = \pi^*(s_2)\).
  TAKT permite \(R(s_1) = R(s_2)\) por la misma razón (\(D(s_1) = D(s_2)\)).
- \(\phi_{Q^*}(s_1) \neq \phi_{Q^*}(s_2)\) porque \(Q^*(s_1, a) = 10 \neq 8 = Q^*(s_2, a)\)
  y \(Q^*(s_1, b) = 5 \neq 3 = Q^*(s_2, b)\).

## Propiedad que falla

TAKT no preserva el valor \(Q^*\) (o \(U\)) por estado. Solo preserva la
identidad de la decisión. Esto no es un defecto de TAKT — la teoría no
reclama preservación de utilidad. Pero sí marca una separación: quien
necesite una representación que preserve los valores \(Q^*\) (para
aprendizaje, planificación, o comparación de políticas) necesitará
\(Q^*\)-suficiencia, que es más fina que la condición de TAKT.

## Clasificación

**Correspondencia parcial** por fortalecimiento.

- Base común: \(\pi^*\)-suficiencia ↔ \(\ker(R) \subseteq \ker(D)\).
- Separación: TAKT no implica \(Q^*\)-suficiencia.
- Dirección: \(Q^*\)-suficiencia \(\Rightarrow\) TAKT, pero no al revés.

## Consecuencia para TAKT

TAKT ocupa un lugar específico en la jerarquía de abstracciones de estado:
es exactamente la \(\pi^*\)-suficiencia, ni más fuerte ni más débil. La
teoría no es competitiva con \(Q^*\)-suficiencia para aplicaciones que
requieran preservación de valor, pero eso está fuera de su alcance
declarado.

Esta separación delimita el dominio de TAKT: es aplicable cuando la
decisión (acción óptima) es lo único que debe preservarse. Si la
aplicación requiere preservar valores \(Q^*\) (e.g., aprendizaje por
refuerzo con Q-learning), se necesita un marco más fino.
