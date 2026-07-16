# Fase B — Separación formal: Blackwell Comparison of Experiments

## Objetivo

Determinar si la correspondencia parcial entre el orden de Blackwell y
el orden por seguridad de TAKT se debe a diferencias en el dominio
(probabilístico vs. determinista; universal vs. específico).

## Hipótesis de equivalencia

El orden parcial de Blackwell sobre experimentos (\(\mathcal E_1 \succeq
\mathcal E_2\)) y el orden por seguridad sobre sistemas TAKT definen la
misma relación de comparabilidad: un sistema es al menos tan informativo
como otro si toda decisión alcanzable en el segundo lo es también en el
primero.

## Traducción formal (referencia a Fase A)

Ver `02-blackwell.md`, secciones «Traducción a TAKT» y «Traducción desde
TAKT».

La Fase A identificó correspondencias estructurales y tres diferencias
fundamentales que impiden la equivalencia total:

| Blackwell                  | TAKT                          |
|----------------------------|-------------------------------|
| Kernel estocástico         | Función determinista          |
| Cuantificador universal    | \(U, A\) fijos                |
| Distribuciones (\(P_\theta\)) | Sin distribuciones         |

## Hipótesis de separación

La separación se produce en dos ejes ortogonales:

1. **Estocástico vs. determinista.** El garbling de Blackwell es un
   kernel de Markov; la representación de TAKT es una función
   determinista. No hay garbling en TAKT.
2. **Universal vs. específico.** Blackwell cuantifica sobre todo
   problema de decisión (toda utilidad, todo espacio de acciones). TAKT
   trabaja con \(U\) y \(A\) fijos.

Estos dos ejes son independientes: podría haber una versión determinista
de Blackwell (funciones en lugar de kernels) o una versión universal de
TAKT (cuantificando sobre \(U\) y \(A\)), pero ninguna de las dos existe
en los marcos actuales.

## Contraejemplo mínimo

**Escenario:** Dos sistemas TAKT comparables por el orden de Blackwell
pero no equivalentes en safety por la falta de cuantificador universal.

Sean dos sistemas de decisión:

\[
\begin{aligned}
S &= \{s_1, s_2\}, \quad A = \{a, b\} \\
U_1(s_1, a) &= 10, \quad U_1(s_1, b) = 0, \quad U_1(s_2, a) = 0, \quad U_1(s_2, b) = 10 \\
U_2(s_1, a) &= 5,  \quad U_2(s_1, b) = 0, \quad U_2(s_2, a) = 0, \quad U_2(s_2, b) = 5
\end{aligned}
\]

Ambos sistemas tienen las mismas decisiones óptimas (\(a\) en \(s_1\),
\(b\) en \(s_2\)). TAKT los considera equivalentes en safety (misma
partición por \(D\)), pero Blackwell no: el segundo sistema tiene
utilidades más bajas, lo que afectaría el riesgo esperado en problemas
con acciones intermedias o randomization.

## Propiedad que falla

TAKT no captura la **magnitud** de las utilidades, solo su orden. En
Blackwell, la magnitud importa porque el riesgo esperado depende de los
valores numéricos de la pérdida. Dos sistemas TAKT con la misma
partición decisional (\(D\)) pero utilidades escaladas diferentemente
son indistinguibles para TAKT, pero no para Blackwell cuando se permite
randomización entre acciones.

## Clasificación

**Correspondencia parcial**:
- El garbling de Blackwell y la representación \(R\) de TAKT comparten
  la función de transformar espacios de observaciones/estados.
- Se separan en dos dimensiones: estocasticidad (kernel vs. función) y
  dominio del cuantificador (universal vs. fijo).

## Consecuencia para TAKT

TAKT no es generalizable a un «orden de Blackwell interno» sin añadir
distribuciones y cuantificadores. La comparación entre sistemas TAKT
con distintas \(U\) requiere una métrica que TAKT no proporciona.

Esto no es una limitación del núcleo de TAKT: es una consecuencia de su
alcance. TAKT compara representaciones dentro de un sistema fijo; no
compara sistemas entre sí. Quien necesite comparar sistemas de decisión
distintos necesitará un marco como el de Blackwell.
