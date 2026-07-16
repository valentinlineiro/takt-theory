# Blackwell Comparison of Experiments — Traducción formal

## Referencias

- Blackwell, D. (1951). Comparison of experiments. *Proceedings of the Second
  Berkeley Symposium on Mathematical Statistics and Probability*, 93–102.
- Blackwell, D. (1953). Equivalent comparisons of experiments. *The Annals of
  Mathematical Statistics*, 24(2), 265–272.
- Le Cam, L. (1964). Sufficiency and approximate sufficiency. *The Annals of
  Mathematical Statistics*, 35(4), 1419–1455.
- Le Cam, L. (1986). *Asymptotic Methods in Statistical Decision Theory*.
  Springer.

## Pregunta

> ¿Cuándo un experimento estadístico es más informativo que otro para la toma
> de decisiones?

## Definiciones del marco

**Objeto primitivo**

Un experimento estadístico es una terna

\[
\mathcal E = (\Theta, \mathcal X, \{P_\theta\}_{\theta \in \Theta})
\]

donde \(\Theta\) es el espacio de parámetros, \(\mathcal X\) el espacio muestral,
y \(P_\theta\) la distribución de probabilidad de los datos cuando \(\theta\)
es el estado verdadero.

**Comparación de experimentos (Blackwell, 1951)**

Dados dos experimentos \(\mathcal E_1 = (\Theta, \mathcal X_1, \{P^1_\theta\})\)
y \(\mathcal E_2 = (\Theta, \mathcal X_2, \{P^2_\theta\})\) con el mismo espacio
de parámetros, se dice que \(\mathcal E_1\) es **más informativo que**
\(\mathcal E_2\) (notación: \(\mathcal E_1 \succeq \mathcal E_2\)) si todo
problema de decisión sobre \(\Theta\) resoluble en \(\mathcal E_2\) lo es
también en \(\mathcal E_1\) con riesgo menor o igual.

Equivalentemente, \(\mathcal E_1 \succeq \mathcal E_2\) si existe un kernel
de Markov (una "garbling" o randomization) que transforma las observaciones
de \(\mathcal E_1\) en observaciones con la misma distribución que las de
\(\mathcal E_2\).

**Teorema de Blackwell (1953)**

\(\mathcal E_1 \succeq \mathcal E_2\) si y solo si, para toda función de
pérdida \(L\) y toda regla de decisión \(\delta_2\) basada en \(\mathcal E_2\),
existe una regla \(\delta_1\) basada en \(\mathcal E_1\) con riesgo menor o
igual:

\[
R_{\mathcal E_1}(\theta, \delta_1) \leq R_{\mathcal E_2}(\theta, \delta_2)
\quad \forall \theta.
\]

**Kernel de suficiencia**

Una condición equivalente: existe un kernel de Markov
\(K: \mathcal X_1 \to \Delta(\mathcal X_2)\) tal que

\[
P^2_\theta(B) = \int K(x_1, B) \, dP^1_\theta(x_1) \quad \forall \theta, B.
\]

Es decir, \(\mathcal E_2\) se obtiene de \(\mathcal E_1\) por un proceso de
ruido (garbling).

## Correspondencia observacional (hechos)

| Blackwell                                       | TAKT                                |
|-------------------------------------------------|-------------------------------------|
| Experimento \(\mathcal E = (\Theta, \mathcal X, \{P_\theta\})\) | — (TAKT no tiene distribución)     |
| Garbling \(K: \mathcal X_1 \to \Delta(\mathcal X_2)\) | Contracción representacional \(R: S \to Z\) |
| \(\mathcal E_1 \succeq \mathcal E_2\) (más informativo) | Condición de seguridad (menos arrepentimiento) |

> La auditoría busca correspondencias estructurales, no analogías
> terminológicas.

> La correspondencia no debe establecerse entre objetos, sino entre
> relaciones de preservación.

## Hipótesis de traducción

### H1: ¿El orden parcial de Blackwell (\(\mathcal E_1 \succeq \mathcal E_2\)) corresponde al orden por seguridad en TAKT?

**Fuente:** Blackwell (1951, 1953); Wikipedia "Blackwell's informativeness theorem";
QuantEcon lecture 30 (Blackwell's Theorem).

**Definiciones en Blackwell:**

Un experimento \(\mathcal E\) es una terna \((\Omega, S, \sigma)\) donde
\(\Omega\) es el espacio de estados, \(S\) el espacio de señales, y
\(\sigma: \Omega \to \Delta(S)\) un kernel de Markov que asigna a cada estado
una distribución sobre las señales.

Blackwell's theorem establece tres condiciones equivalentes para
\(\mathcal E_\mu \succeq \mathcal E_\nu\) (\(\mu\) es al menos tan informativo
como \(\nu\)):

1. **Económico**: para todo problema de decisión (acción A, utilidad u,
   prior p), el valor esperado de la utilidad bajo \(\mu\) es al menos tan
   alto como bajo \(\nu\).
2. **Garbling**: existe un kernel de Markov \(Q: S_\mu \to \Delta(S_\nu)\)
   tal que \(\nu = Q \circ \mu\) (i.e., \(\nu\) se obtiene añadiendo ruido a
   \(\mu\)).
3. **Incertidumbre**: para todo prior \(p\) y toda función cóncava
   \(U: \Delta(\Omega) \to \mathbb R\), la incertidumbre esperada bajo
   \(\mu\) es menor o igual que bajo \(\nu\).

**Correspondencia:**

| Blackwell                                        | TAKT                                    |
|--------------------------------------------------|-----------------------------------------|
| \(\mathcal E_\mu \succeq \mathcal E_\nu\)        | \(D_1\) es al menos tan seguro como \(D_2\) |
| Dominio decisional (toda utilidad, toda acción) | Condición de safety (todo regret)       |
| Garbling \(\nu = Q \circ \mu\)                   | Contracción representacional \(R\)      |

**Análisis estructural:**

Ambos órdenes comparan sistemas por su capacidad de apoyar decisiones.
Blackwell lo hace sobre experimentos probabilísticos; TAKT sobre sistemas
de decisión estado-por-estado. La condición económica de Blackwell (todo
problema de decisión) es más fuerte que la condición de safety de TAKT
porque Blackwell exige que la preferencia se mantenga para **toda** función
de utilidad y **todo** conjunto de acciones, mientras que TAKT fija
\(U\) y \(A\) como parte del sistema.

**Veredicto:** Correspondencia estructural parcial. Ambos definen un orden
basado en capacidad decisional, pero Blackwell es universal (cuantifica
sobre todos los problemas de decisión) mientras que TAKT es específico
(U y A fijos). Un orden blackwelliano sobre representaciones TAKT sería
más general que el actual orden por seguridad.

---

### H2: ¿La noción de garbling (kernel de Markov) es equivalente a la representación \(R: S \to Z\) de TAKT?

**Fuente:** Blackwell (1951); Leshno & Spector (1992); QuantEcon lecture 30.

**Definiciones:**

- Blackwell: Un garbling es un kernel de Markov
  \(Q: S \to \Delta(S')\) tal que \(\nu(s' \mid \omega) = \sum_s Q(s' \mid s)
  \sigma(s \mid \omega)\). Es una transformación estocástica que añade ruido
  a las señales.
- TAKT: \(R: S \to Z\) es una función (determinista) que asigna a cada
  estado un elemento de un espacio de representación.

**Correspondencia:**

| Blackwell                  | TAKT                              |
|----------------------------|-----------------------------------|
| Garbling \(Q: S \to \Delta(S')\) | Representación \(R: S \to Z\) |
| Estocástico (Markov kernel) | Determinista (función)            |
| Añade ruido                | Comprime/abstrae                  |

**Análisis estructural:**

Ambos son transformaciones del espacio de observaciones/señales a otro
espacio. Pero hay una diferencia fundamental: el garbling de Blackwell
es una transformación **ruidosa** (estocástica) cuyo efecto es **reducir**
la informatividad. La representación de TAKT es una transformación
**determinista** que puede ser tanto compresiva como preservadora de
información.

En Blackwell, la dirección del garbling es siempre de más informativo a
menos informativo (pérdida de información). En TAKT, \(R\) puede ser
cualquier función; la condición de seguridad determina si preserva
suficiente información para la decisión.

**Veredicto:** Correspondencia funcional (ambas transforman espacios),
pero no equivalencia. El garbling es estocástico y degradante; la
representación de TAKT es determinista y no implica pérdida (depende de
la condición \(\ker(R) \subseteq \ker(D)\)).

---

### H3: ¿El teorema de Blackwell (existencia de garbling \(\Leftrightarrow\) dominio decisional) tiene un análogo en términos de \(D = \pi \circ R\)?

**Fuente:** Blackwell (1951, 1953); Wikipedia.

**Teorema de Blackwell:**

\[
\mathcal E_\mu \succeq \mathcal E_\nu \iff \exists Q\; \nu = Q \circ \mu.
\]

El lado izquierdo es el criterio decisional (económico), el lado derecho
es el criterio de suficiencia (garbling). El teorema establece que la
comparabilidad en términos de decisiones y la existencia de una
transformación estocástica son equivalentes.

**Correspondencia tentativa:**

| Blackwell                                   | TAKT                                    |
|---------------------------------------------|-----------------------------------------|
| \(\mathcal E_\mu \succeq \mathcal E_\nu \iff \nu = Q \circ \mu\) | \(D_1 \succeq D_2 \iff \exists R\; D_2 = D_1 \circ R\)? |

**Análisis estructural:**

Si en TAKT definimos un orden análogo: \(D_1 \succeq D_2\) si toda
decisión alcanzable con \(D_2\) lo es también con \(D_1\), entonces la
condición \(\exists R: S_2 \to S_1\) tal que \(D_2 = D_1 \circ R\) es
suficiente. Esto es exactamente la factorización de TAKT generalizada.

Pero Blackwell requiere además que \(Q\) sea un kernel de Markov
(estocástico), mientras que en TAKT \(R\) es una función determinista.
La diferencia captura el hecho de que Blackwell trabaja con distribuciones
de probabilidad sobre señales, mientras que TAKT trabaja con estados
directamente.

**Veredicto:** Existe un análogo estructural: en ambos marcos, el dominio
decisional se expresa mediante factorización a través de una
transformación. Pero la naturaleza de la transformación (estocástica vs.
determinista) y el cuantificador (todo problema de decisión vs. uno fijo)
difieren.

---

### H4: ¿La equivalencia de experimentos (\(\mathcal E_\mu \simeq \mathcal E_\nu\)) corresponde a representaciones mutuamente suficientes en TAKT?

**Fuente:** Blackwell (1953); Kihlstrom reformulation (QuantEcon 30).

**Definiciones:**

- Blackwell: \(\mathcal E_\mu \simeq \mathcal E_\nu\) si
  \(\mathcal E_\mu \succeq \mathcal E_\nu\) y
  \(\mathcal E_\nu \succeq \mathcal E_\mu\). Esto ocurre cuando inducen la
  misma distribución sobre creencias posteriores (Kihlstrom).
- TAKT: Dos representaciones \(R_1, R_2\) son mutuamente suficientes si
  \(\ker(R_1) \subseteq \ker(D)\) y \(\ker(R_2) \subseteq \ker(D)\)
  simultáneamente, i.e., ambas preservan suficiente información para la
  decisión.

**Correspondencia:**

| Blackwell                                         | TAKT                                         |
|---------------------------------------------------|----------------------------------------------|
| \(\mathcal E_\mu \simeq \mathcal E_\nu\)           | \(\ker(R_1) \subseteq \ker(D)\) y viceversa? |
| Misma distribución sobre posteriores              | Misma partición del espacio de estados por D |

**Análisis estructural:**

En Blackwell, la equivalencia significa que los dos experimentos generan
las mismas distribuciones sobre creencias posteriores (para todo prior).
En TAKT, dos representaciones son equivalentes respecto a D si ambas
contienen la información necesaria para calcular D. La diferencia es que
Blackwell cuantifica sobre todos los priors, mientras que TAKT es
específico al D fijo.

**Veredicto:** La noción de equivalencia es estructuralmente análoga
(ambos marcos identifican cuándo dos sistemas son intercambiables para
la toma de decisiones), pero el criterio de Blackwell es más fuerte
(uniforme sobre todos los priors y utilidades).

---

## Traducción a TAKT

Desde Blackwell hacia TAKT:

1. El garbling \(Q\) corresponde a una representación \(R\): ambos
   transforman el espacio de observaciones/estados. Pero el garbling es
   estocástico y siempre reduce informatividad; \(R\) es determinista y
   su efecto depende de la condición de seguridad.

2. El teorema de Blackwell (garbling \(\Leftrightarrow\) dominio decisional)
   tiene un análogo en TAKT: si dos sistemas se comparan por su capacidad
   decisional, la comparación se expresa mediante factorización
   (\(D_1 = D_2 \circ R\) o viceversa). La diferencia es el cuantificador:
   Blackwell exige "todo problema de decisión", TAKT fija \(U\) y \(A\).

3. La equivalencia de experimentos de Blackwell (misma distribución de
   posteriores) corresponde a la noción de representaciones igualmente
   informativas para la decisión en TAKT.

## Traducción desde TAKT

Desde TAKT hacia Blackwell:

1. La factorización \(D = \pi \circ R\) es una versión determinista de la
   condición de garbling de Blackwell: \(D\) desempeña el papel de la
   regla de decisión óptima, \(R\) el del garbling.

2. TAKT no tiene equivalente de:
   - La distribución de probabilidad sobre señales \(\sigma(s \mid \omega)\)
   - La expectativa de utilidad sobre realizaciones aleatorias
   - La noción de prior \(p(\omega)\)
   - El cuantificador universal sobre problemas de decisión

3. Si se añadiera un cuantificador universal a TAKT ("para toda \(U\) y
   todo \(A\)"), se obtendría un orden comparable al de Blackwell, pero
   eso cambiaría el núcleo del marco.

## Equivalencia

| Pregunta                     | Respuesta | Evidencia                                                                 |
|------------------------------|-----------|---------------------------------------------------------------------------|
| ¿Existe traducción formal?   | Sí, bajo  | Correspondencias: garbling \(\leftrightarrow R\), orden blackwelliano     |
|                              | supuestos probabilísticos | \(\leftrightarrow\) safety, equivalencia \(\leftrightarrow\) representaciones mutuamente suficientes. |
| ¿Existe isomorfismo?         | No        | Blackwell requiere (a) cuantificador universal sobre utilidades/acciones, |
|                              |           | (b) distribuciones de probabilidad, (c) kernels estocásticos. TAKT no tiene nada de esto. |
| ¿Existe residual?            | Sí        | Ver sección Residual.                                                     |

## Residual

**Elementos de TAKT no cubiertos por este marco:**

1. **Determinismo.** TAKT opera con funciones deterministas; Blackwell
   con kernels estocásticos. No hay garbling en TAKT.

2. **Ausencia de distribuciones.** TAKT no modela la generación
   probabilística de observaciones. Blackwell se fundamenta en
   \(\sigma: \Omega \to \Delta(S)\).

3. **Sistema fijo.** TAKT compara sistemas con \(U\) y \(A\) fijos.
   Blackwell cuantifica sobre todos los problemas de decisión.

**Elementos del marco no representados por TAKT:**

1. **Teorema de equivalencia.** Blackwell demuestra que tres criterios
   aparentemente distintos (económico, garbling, incertidumbre) son
   equivalentes. TAKT no tiene un resultado análogo porque no tiene
   los tres criterios.

2. **Orden parcial sobre experimentos.** Blackwell define un orden
   parcial sobre el espacio de experimentos. TAKT no tiene un espacio
   de sistemas comparable.

3. **Distribución sobre posteriores (Kihlstrom).** La caracterización
   de Blackwell mediante convex order sobre distribuciones de
   probabilidad en el simplex no tiene análogo en TAKT.
