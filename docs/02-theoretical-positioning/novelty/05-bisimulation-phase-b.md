# Fase B — Separación formal: Bisimulation

## Objetivo

Determinar si la correspondencia parcial entre TAKT y bisimulación se
debe a un debilitamiento de hipótesis y si existe separación residual.

## Hipótesis de equivalencia

Bisimulación y TAKT definen relaciones de equivalencia sobre estados
basadas en el comportamiento observable. ¿Son la misma relación bajo
supuestos adecuados?

## Traducción formal (referencia a Fase A)

Ver `05-bisimulation.md`, secciones «Traducción a TAKT» y «Traducción
desde TAKT».

La Fase A estableció que la bisimulación implica la condición de TAKT,
pero el recíproco no se sostiene. La correspondencia es unidireccional.

| Dirección                        | Resultado |
|----------------------------------|-----------|
| Bisimulación \(\Rightarrow\) TAKT | Sí        |
| TAKT \(\Rightarrow\) Bisimulación | No        |

## Hipótesis de separación

La separación es por **debilitamiento**: la bisimulación preserva
recompensa para toda acción y dinámica completa; TAKT solo preserva la
acción óptima.

Si se debilita la bisimulación eliminando los requisitos de (a) igual
recompensa para acciones no-óptimas y (b) igualdad de transiciones,
se obtiene la condición de TAKT.

## Contraejemplo mínimo

Sean \(S = \{s_1, s_2\}\), \(A = \{a, b\}\).

| Estado | \(U(s,a)\) | \(U(s,b)\) | \(P(s_1 \mid s,a)\) | \(P(s_2 \mid s,a)\) | \(D(s)\) |
|--------|------------|------------|---------------------|---------------------|----------|
| \(s_1\) | 10         | 5          | 0.9                 | 0.1                 | \(a\)    |
| \(s_2\) | 8          | 3          | 0.1                 | 0.9                 | \(a\)    |

\(D(s_1) = D(s_2) = a\). TAKT permite \(R(s_1) = R(s_2)\). Pero
\(s_1 \not\sim s_2\) porque:
- \(U(s_1, a) = 10 \neq 8 = U(s_2, a)\)
- \(P(\cdot \mid s_1, a) \neq P(\cdot \mid s_2, a)\)

## Propiedad que falla

TAKT no preserva dos propiedades esenciales de la bisimulación:

1. **Recompensa para todas las acciones.** Bisimulación exige
   \(R(s_1, a) = R(s_2, a)\) para toda acción \(a\). TAKT solo exige
   coincidencia del argmax.
2. **Dinámica probabilística.** Bisimulación exige
   \(P(C \mid s_1, a) = P(C \mid s_2, a)\) para toda clase de
   equivalencia \(C\). TAKT no modela transiciones.

## Clasificación

**Correspondencia parcial** por debilitamiento.

- Dirección fuerte: bisimulación \(\Rightarrow\) TAKT.
- Separación: TAKT carece de los requisitos dinámicos y de recompensa
  completa que definen la bisimulación.

## Consecuencia para TAKT

La separación confirma que TAKT no es una teoría de comportamiento
dinámico, sino de decisión instantánea. No compite con bisimulación en
aplicaciones donde la equivalencia de transiciones y recompensas sea
necesaria (e.g., minimización de modelos de MDP).

La ventaja de TAKT respecto a bisimulación es la inversa: al no requerir
dinámica, TAKT es aplicable donde no hay MDP, no hay transiciones, o no
hay distribución de probabilidad sobre los estados siguientes.
