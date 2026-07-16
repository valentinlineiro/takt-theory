# Sufficient Statistics — Traducción formal

## Referencias

- Berger, J. O. (1985). *Statistical Decision Theory and Bayesian Analysis*.
  Springer. https://link.springer.com/book/10.1007/978-1-4757-4286-2
- Lehmann, E. L. (1983). *Theory of Point Estimation*. Wiley.
- Fisher, R. A. (1922). On the mathematical foundations of theoretical
  statistics. *Phil. Trans. R. Soc. Lond. A*, 222, 309–368.
- Neyman, J. & Pearson, E. S. (1933). On the problem of the most efficient
  tests of statistical hypotheses. *Phil. Trans. R. Soc. Lond. A*, 231,
  289–337.
- Stat 135, UC Berkeley. Sufficiency and the Factorization Theorem.
  https://stat135.berkeley.edu/spring-2026/lectures/lecture-18.html

## Pregunta

> ¿Cuál es el objeto matemático que preserva un estadístico suficiente?

## Definiciones del marco

**Objeto primitivo**

Un experimento genera datos

\[
X \in \mathcal X
\]

dependientes de un parámetro desconocido

\[
\theta \in \Theta.
\]

**Estadístico**

Una función

\[
T: \mathcal X \rightarrow \mathcal T.
\]

**Suficiencia**

\(T(X)\) conserva toda la información de \(X\) relevante para inferir
\(\theta\). Equivalentemente: la distribución de \(X\) condicionada a
\(T(X)\) no depende de \(\theta\).

En modelos dominados, el **teorema de factorización de Neyman–Fisher**
caracteriza la suficiencia: existe una factorización

\[
f_\theta(x) = g_\theta(T(x)) \cdot h(x)
\]

de la densidad conjunta, donde \(g_\theta\) depende de \(x\) solo a
través de \(T(x)\) y \(h\) no depende de \(\theta\).

## Correspondencia observacional (hechos)

| Estadística suficiente                    | TAKT                          |
|-------------------------------------------|-------------------------------|
| Espacio de observaciones \(\mathcal X\)   | Espacio de estados \(S\)      |
| Estadístico \(T: \mathcal X \to \mathcal T\) | Representación \(R: S \to Z\) |
| Compresión de datos                       | Contracción representacional  |

> La auditoría busca correspondencias estructurales, no analogías
> terminológicas.

> La correspondencia no debe establecerse entre objetos, sino entre
> relaciones de preservación.

## Hipótesis de traducción

### H1: ¿La inferencia sobre \(\theta\) desempeña el mismo papel estructural que \(D\)?

**Fuente:** Berger (1985), §1.2–1.3.

**Definiciones en Berger:**

- \(\theta \in \Theta\): estado de la naturaleza (desconocido).
- \(X \in \mathcal X\): observación muestral, distribuida según \(f(x \mid \theta)\).
- \(\delta(X) \in \mathcal A\): regla de decisión, función del sample space al action
  space (Berger, p. 7: "a function \(d(x)\) that maps the sample space \(\mathcal X\)
  into \(\mathcal A\) is called a nonrandomized decision rule").

**Correspondencia:**

| Berger                    | TAKT                                   |
|---------------------------|----------------------------------------|
| \(\theta\) (parámetro)    | \(s \in S\) (estado)                   |
| \(\delta(X)\) (regla)     | \(D: S \to A\) (decisión)              |
| \(X \sim f(x \mid \theta)\) | — (TAKT no tiene distribución muestral) |

**Análisis estructural:**

Berger separa el parámetro \(\theta\) (lo que se desconoce) de la regla \(\delta\)
(lo que se hace). La regla \(\delta\) se evalúa mediante la función de pérdida
\(L(\theta, \delta(X))\), que mide la consecuencia de actuar cuando el estado
verdadero es \(\theta\). En TAKT, \(D(s)\) asigna una acción directamente a
cada estado, y se evalúa mediante la función de utilidad \(U(s, a)\).

La primera diferencia estructural: en Berger hay un paso intermedio
\(X \sim f(x \mid \theta)\) que TAKT no modela explícitamente. Berger nunca
tiene acceso directo a \(\theta\); solo a \(X\). TAKT puede modelar acceso
directo o indirecto (vía \(R\)), pero no presupone una distribución muestral.

**Veredicto:** Traducción parcial. El par (\(\theta\), \(\delta\)) se corresponde
con (\(s\), \(D\)), pero Berger añade el aparato probabilístico
\(X \sim f(x\mid\theta)\) sin equivalente en TAKT.

---

### H2: ¿La función de pérdida de Berger corresponde al regret de TAKT?

**Fuente:** Berger (1985), §1.1–1.3.

**Definiciones:**

- Berger: \(L(\theta, a)\) es una función primitiva del problema de decisión.
  Representa la consecuencia de tomar la acción \(a\) cuando el estado verdadero
  es \(\theta\). No se deriva de nada más.
- TAKT: \(R(s, a) = U(s, a^*) - U(s, a)\) es una cantidad derivada, calculada
  a partir de la utilidad \(U\) y la acción óptima \(a^*\).

**Correspondencia formal:**

| Berger                              | TAKT                                   |
|-------------------------------------|----------------------------------------|
| \(L: \Theta \times \mathcal A \to \mathbb R\) | \(\text{Regret}: S \times A \to \mathbb R\) |
| Primitiva                           | Derivada (de \(U\))                    |

**Análisis estructural:**

Ambas funciones asignan un número real a cada par (estado, acción). Ambas
cuantifican lo "malo" de una decisión. Pero hay una diferencia conceptual
importante: la pérdida de Berger es un dato del problema (dada directamente),
mientras que el regret de TAKT se construye desde \(U\) y presupone la
existencia de una acción óptima \(a^*\) para cada estado.

Berger sí discute funciones de pérdida convexas (se usa en el teorema de
Rao–Blackwell, §1.8), lo que permite conexiones formales — pero la estructura
de pérdida-convexa-como-primitiva no es lo mismo que
regret-derivado-de-utilidad.

**Veredicto:** Correspondencia funcional (ambas son \(\text{Estados} \times \text{Acciones} \to \mathbb R\)), pero diferencia en estatuto ontológico: primitiva vs. derivada.

---

### H3: ¿Existe un resultado equivalente a \(D = \pi \circ R\) en teoría de decisión estadística?

**Fuente:** Berger (1985), §1.7 (Sufficient Statistics) y §8.2.1 (Decision Rules
Based on a Sufficient Statistic).

**Dos teoremas relevantes:**

**Teorema 1** (Berger §1.7, discutido en §8.2.1):

> "When evaluating decision rules through risk functions, Theorem 1 implies
> that it is only necessary to consider rules based on a sufficient statistic.
> If a rule is not a function of the sufficient statistic, another rule can be
> found that is a function of the sufficient statistic and has the same risk
> function."

**Teorema 4 (Rao–Blackwell)** (Berger §1.8, p. 41):

> "Assume that \(\mathcal A\) is a convex subset of \(\mathbb R^m\) and that
> \(L(\theta, a)\) is a convex function of \(a\) for all \(\theta \in \Theta\).
> Suppose also that \(T\) is a sufficient statistic for \(\theta\), and that
> \(\delta_0(x)\) is a nonrandomized decision rule in \(\mathcal D\). Then the
> decision rule, based on \(T(x) = t\), defined by
> \(\delta_1(t) = E_{X \mid T}[\delta_0(X)]\) is \(R\)-equivalent to or
> \(R\)-better than \(\delta_0\), provided the expectation exists."

**Correspondencia:**

En ambos teoremas, el resultado es que \(\delta\) puede escribirse como
\(\delta^* \circ T\): la regla de decisión depende de los datos solo a través
del estadístico suficiente \(T\). Esto es estructuralmente análogo a
\(D = \pi \circ R\).

| Berger                                  | TAKT                           |
|-----------------------------------------|--------------------------------|
| \(T: \mathcal X \to \mathcal T\)        | \(R: S \to Z\)                |
| \(\delta^*: \mathcal T \to \mathcal A\) | \(\pi: Z \to A\)             |
| \(\delta = \delta^* \circ T\)           | \(D = \pi \circ R\)           |
| Suficiencia (\(\ker(T) \subseteq \ker(\delta)\)) | Condición de consistencia (\(\ker(R) \subseteq \ker(D)\)) |

**Diferencia clave:**

La factorización de Berger es condicional:
\(\delta_1(t) = E[\delta_0(X) \mid T(X) = t]\). Es una esperanza condicional,
no una composición funcional determinista. La factorización determinista
\(\delta = \delta^* \circ T\) solo se da cuando el action space es convexo
y la pérdida es convexa. En TAKT, \(\pi \circ R\) es siempre una composición
determinista, sin necesidad de convexidad.

**Veredicto:** Análogo estructural confirmado. Existe una factorización
\(\delta = \delta^* \circ T\) que juega el mismo papel que \(D = \pi \circ R\),
pero su naturaleza (probabilística vs. determinista) difiere.

---

### H4: ¿La suficiencia induce \(\ker(R) \subseteq \ker(D)\)?

**Fuente:** Berger (1985), §1.7, §8.2.1.

**Análisis:**

Si \(\delta(x) = \delta^*(T(x))\), entonces:

\[
T(x_1) = T(x_2) \;\Longrightarrow\; \delta(x_1) = \delta^*(T(x_1)) = \delta^*(T(x_2)) = \delta(x_2).
\]

Es decir, \(\ker(T) \subseteq \ker(\delta)\). Esta inclusión es la expresión
formal de que la regla de decisión depende solo del estadístico suficiente.

En TAKT, la condición \(\ker(R) \subseteq \ker(D)\) es necesaria para que
exista \(\pi\) tal que \(D = \pi \circ R\). Sin ella, la representación \(R\)
no determina unívocamente la decisión.

**Correspondencia:**

| Berger                           | TAKT                           |
|----------------------------------|--------------------------------|
| \(\ker(T) \subseteq \ker(\delta)\) | \(\ker(R) \subseteq \ker(D)\) |

**Diferencia:**

En Berger, \(\ker(T) \subseteq \ker(\delta)\) es consecuencia de que
\(\delta\) factorice por \(T\); no es una condición impuesta. En TAKT,
\(\ker(R) \subseteq \ker(D)\) es una condición necesaria que debe verificarse
para que el sistema sea consistente.

**Veredicto:** La inclusión de núcleos es estructuralmente equivalente en
ambos marcos. Sin embargo, en Berger aparece como consecuencia de la
factorización de reglas de decisión mediante un estadístico suficiente,
mientras que en TAKT constituye el principio primario que define la
seguridad representacional.

---

## Traducción a TAKT

Desde Berger hacia TAKT:

1. Toda regla de decisión \(\delta(X)\) admite una versión \(\delta^*(T(X))\)
   basada únicamente en el estadístico suficiente \(T\) (Teorema 1, Berger).
   Esto corresponde a \(D = \pi \circ R\) en TAKT.

2. La factorización \(\delta = \delta^* \circ T\) garantiza que la regla
   depende solo de la información relevante comprimida por \(T\).

3. La suficiencia mínima corresponde a representaciones mínimas en TAKT:
   el estadístico suficiente minimal es el que maximiza la compresión sin
   perder información relevante para la decisión.

## Traducción desde TAKT

Desde TAKT hacia Berger:

1. TAKT define \(D: S \to A\) como primitivo. En Berger, la regla de
   decisión \(\delta\) es el análogo directo, pero siempre dependiente de
   una observación muestral \(X\).

2. La representación \(R: S \to Z\) en TAKT es análoga a un estadístico
   suficiente \(T: \mathcal X \to \mathcal T\), pero actúa sobre el espacio
   de estados en lugar del espacio muestral.

3. El regret de TAKT puede interpretarse como un caso particular de
   función de pérdida de Berger: aquella que es representable como
   diferencia respecto al óptimo.

4. TAKT no tiene equivalente de:
   - La distribución muestral \(f(x \mid \theta)\)
   - La distribución a priori \(\pi(\theta)\)
   - El riesgo \(R(\theta, \delta) = E_\theta[L(\theta, \delta(X))]\)

## Equivalencia

| Pregunta                     | Respuesta | Evidencia                                                                 |
|------------------------------|-----------|---------------------------------------------------------------------------|
| ¿Existe traducción formal?   | Sí, bajo  | Correspondencias: \(\delta \leftrightarrow D\), \(T \leftrightarrow R\),  |
|                              | las hipótesis del problema de |                                                                           |
|                              | decisión estadístico |                                                                           |
|                              |           | \(\delta = \delta^* \circ T \leftrightarrow D = \pi \circ R\),            |
|                              |           | \(\ker(T) \subseteq \ker(\delta) \leftrightarrow \ker(R) \subseteq \ker(D)\). |
| ¿Existe isomorfismo?         | Parcial   | La traducción es exacta en la estructura de compresión-factorización,     |
|                              |           | pero Berger añade aparato probabilístico (muestreo, riesgo esperado)      |
|                              |           | sin equivalente en TAKT.                                                  |
| ¿Existe residual?            | Sí        | Ver sección Residual.                                                     |

**Regla metodológica aplicada:** Las correspondencias no se establecieron entre
objetos aislados, sino entre relaciones de preservación: la relación
"\(T\) comprime \(X\) preservando información para la decisión" se corresponde
con "\(R\) comprime \(S\) preservando información para la decisión".

## Residual

**Elementos de TAKT no cubiertos por este marco:**

1. **Utility function primitiva.** TAKT parte de una función de utilidad
   \(U(s,a)\) de la cual se deriva el regret. Berger parte directamente de
   la pérdida \(L(\theta, a)\) sin conexión con utilidad.

2. **Acción óptima como referencia.** El regret de TAKT requiere identificar
   \(a^* = \arg\max_a U(s,a)\) para cada estado. Berger no tiene este paso;
   la pérdida es absoluta, no relativa.

3. **Espacio de estados \(S\) sin distribución.** TAKT trata los estados como
   dados, sin distribución de probabilidad. Berger siempre presupone una
   distribución muestral y (en el análisis bayesiano) una distribución a
   priori.

4. **Representación como construcción.** En TAKT, \(R\) es una función
   construida o aprendida. En Berger, \(T\) es una función definida que
   satisface la propiedad de suficiencia respecto al modelo estadístico.

**Elementos del marco no representados por TAKT:**

1. **Distribución muestral \(X \sim f(x \mid \theta)\).** Es el fundamento de
   la estadística clásica. TAKT no modela el proceso de generación de datos.

2. **Distribución a priori \(\pi(\theta)\).** Berger dedica el Capítulo 4 al
   análisis bayesiano; TAKT no tiene equivalente de creencias previas sobre
   los estados.

3. **Riesgo \(R(\theta, \delta) = E_\theta[L(\theta, \delta(X))]\).** La
   evaluación frecuentista de reglas de decisión no tiene análogo en TAKT,
   que evalúa decisiones caso por caso (por estado).

4. **Teorema de Rao–Blackwell como mejora.** El resultado de Berger es
   normativo: \(\delta_1\) mejora (o iguala) a \(\delta_0\). En TAKT,
   \(D = \pi \circ R\) es una condición de consistencia, no de optimalidad.
