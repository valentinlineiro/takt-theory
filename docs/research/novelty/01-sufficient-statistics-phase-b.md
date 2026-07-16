# Fase B — Separación formal: Sufficient Statistics

## Objetivo

Determinar si la correspondencia fuerte entre TAKT y la teoría de
estadísticos suficientes (Berger) depende de hipótesis estadísticas
que TAKT no presupone.

## Hipótesis de equivalencia

La factorización \(\delta = \delta^* \circ T\) (Berger) y \(D = \pi \circ R\)
(TAKT) son la misma estructura: la decisión depende de los datos/estados
solo a través de una representación comprimida.

## Traducción formal (referencia a Fase A)

Ver `01-sufficient-statistics.md`, sección «Equivalencia».

Correspondencias exactas identificadas:

- \(\delta = \delta^* \circ T\) ↔ \(D = \pi \circ R\)
- \(\ker(T) \subseteq \ker(\delta)\) ↔ \(\ker(R) \subseteq \ker(D)\)
- Minimidad del estadístico ↔ minimidad de la representación

## Hipótesis de separación

La correspondencia estructural es exacta, pero Berger requiere hipótesis
que TAKT no necesita para definir su relación de preservación:

1. **Distribución muestral.** Suficiencia requiere \(f(x \mid \theta)\)
   y el teorema de factorización de Neyman-Fisher (modelo dominado).
2. **Esperanza condicional.** \(\delta_1(t) = E[\delta_0(X) \mid T(X)=t]\)
   presupone espacio de probabilidad.
3. **Convexidad (Rao-Blackwell).** El teorema de mejora requiere pérdida
   convexa.
4. **Separación \(\theta\)/\(X\).** Berger separa el parámetro (lo que
   se desconoce) del espacio muestral (lo que se observa). TAKT unifica
   ambos en el espacio de estados \(S\).

Sin estas hipótesis, \(\ker(T) \subseteq \ker(\delta)\) no está
garantizado en Berger. En TAKT, \(\ker(R) \subseteq \ker(D)\) es un
axioma independiente.

## Contraejemplo mínimo

**Escenario:** Sistema determinista donde \(\ker(R) \subseteq \ker(D)\) se
cumple pero no hay estructura para definir suficiencia en Berger.

| \(s\) | \(U(s, a)\) | \(U(s, b)\) | \(D(s)\) | \(R(s)\) |
|------|------------|------------|----------|----------|
| \(s_1\) | 10        | 5          | \(a\)    | 0        |
| \(s_2\) | 8         | 3          | \(a\)    | 0        |

TAKT: \(\ker(R) \subseteq \ker(D)\) se cumple. Para Berger, habría que
postular \(f(x \mid s)\) y \(T\) con factorización de Neyman-Fisher. No
hay construcción canónica. La suficiencia de Berger no es falsa; es
**indefinida**.

## Propiedad que falla

La preservación decisional en TAKT es combinatoria sobre \(S\): no
requiere distribuciones, esperanzas ni convexidad. La suficiencia de
Berger requiere el aparato completo de la estadística matemática.

La relación preservada es la misma (\(\ker \subseteq \ker\)), pero los
marcos difieren en las condiciones de aplicabilidad.

## Clasificación

**Correspondencia fuerte** — la relación de preservación es
estructuralmente idéntica — pero el marco de Berger depende de hipótesis
estadísticas (distribución muestral, dominación, esperanza condicional,
convexidad) que no forman parte del núcleo de TAKT.

La preservación decisional en Berger es teorema; en TAKT es axioma. No
hay separación en la relación abstracta, pero sí en los requisitos para
establecerla.

## Consecuencia para TAKT

TAKT extiende la preservación decisional a dominios sin modelo
probabilístico (deterministas, lógicos, combinatorios). El coste es
no poder derivar Rao-Blackwell, optimalidad de estimadores o análisis
de riesgo esperado. Esa expresividad adicional requiere el aparato
probabilístico que TAKT deja fuera por diseño.
