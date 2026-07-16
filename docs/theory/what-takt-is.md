# What TAKT Is

## 1. Motivation

Los sistemas de decisión — desde un controlador industrial hasta un agente
de IA — necesitan representaciones internas del mundo sobre las que decidir.
El problema no es solo *qué* representación usar, sino *cuándo* una
representación es segura: cuándo podemos estar seguros de que comprimir o
abstraer información no cambiará la decisión que tomaríamos con los datos
originales.

TAKT (Theory of Adequate Knowledge for Decisions) formaliza esta pregunta.
TAKT no propone un algoritmo para construir representaciones. Propone un criterio para determinar cuándo una representación preserva la decisión (decision-preserving).

---

## 2. Primitive

La primitiva de TAKT es la condición de preservación decisional (\(\ker(R) \subseteq \ker(D)\)). Una caracterización equivalente es la factorización (\(D = \pi \circ R\)).

Dado un espacio de estados \(S\), un espacio de acciones \(A\), una función
de utilidad \(U: S \times A \to \mathbb{R}\), una representación
\(R: S \to Z\), y una decisión \(D: S \to A\) definida como
\(D(s) = \arg\max_a U(s, a)\):

**Condición de seguridad:**

\[
\ker(R) \subseteq \ker(D)
\]

Dos estados con la misma representación tienen la misma decisión óptima.

**Factorización equivalente:**

\[
D = \pi \circ R
\]

La decisión se descompone en una representación seguida de una política:
\(\pi: Z \to A\) es una función que asigna acciones a códigos de
representación.

TAKT no define cómo se construye \(R\) ni cómo se aprende \(\pi\).
Define la estructura lógica que deben satisfacer para que la
representación sea segura. La condición \(\ker(R) \subseteq \ker(D)\) es
el axioma fundacional del sistema.

A partir de este axioma, TAKT define:

- **Regret:** \(\varepsilon_U(s) = \max_a U(s,a) - U(s, D_R(s))\) mide la
  pérdida por decidir desde la representación comprimida en lugar de desde
  el estado original. Análogamente, \(\varepsilon_D\) mide cuántas
  decisiones cambian al abstraer.
- **Cota de seguridad:** \(\varepsilon_U\) y \(\varepsilon_D\) se relacionan
  mediante un teorema que acota el error de representación.
- **Minimalidad:** la representación más compresiva que sigue siendo
  segura corresponde a la partición inducida por \(D\).
- **Composicionalidad:** el regret total de una cadena de representaciones
  es la suma de los regrets individuales.

---

## 3. Scope

TAKT asume deliberadamente la menor estructura posible. Cualquier supuesto adicional (probabilidad, dinámica, aprendizaje, teoría de la información) pertenece a una especialización y no al núcleo de la teoría.

Bajo este enfoque de supuestos mínimos, TAKT no presupone nada de lo siguiente:

- **Probabilidad.** No requiere distribuciones sobre estados,
  transiciones estocásticas, ni esperanzas. \(\ker(R) \subseteq \ker(D)\)
  es una condición combinatoria sobre el espacio de estados.
- **Dinámica.** No modela transiciones entre estados, horizontes
  temporales, factores de descuento, ni ecuaciones de Bellman. Es una
  teoría de decisión instantánea (one-shot).
- **Aprendizaje.** No dice cómo se construye \(R\) ni cómo se aprende
  \(\pi\). No reclama convergencia algorítmica ni optimalidad muestral.
- **Teoría de la información.** No usa entropía, información mutua, ni
  divergencias. La preservación es cualitativa (binaria: se cumple o no),
  no cuantitativa.
- **Metría de utilidad.** La función \(U(s,a)\) es un dato del problema.
  TAKT no explica cómo se obtiene ni qué relación tiene con recompensas
  observables.

TAKT presupone únicamente:

- Un conjunto de estados \(S\).
- Un conjunto de acciones \(A\).
- Una función de utilidad \(U: S \times A \to \mathbb{R}\).
- Una representación \(R: S \to Z\) (cualquier función de \(S\) a
  algún espacio \(Z\)).

A partir de estos elementos, la condición de seguridad se define y
verifica sin necesidad de estructura adicional.

---

## 4. Core Results

A partir de su núcleo axiomático, TAKT demuestra un conjunto de resultados estructurales sobre la decisión y la representación:

* **Teorema de Preservación Decisional (Decision Preservation Theorem):** 
  Una representación es perfectamente segura si y solo si su regret decisional es nulo:
  \[
  \varepsilon_D(R) = 0 \iff \ker(R) \subseteq \ker(D)
  \]
* **Teorema de Factorización (Factorization Theorem):** 
  Una representación preserva la decisión si y solo si el operador de decisión se factoriza a través de ella:
  \[
  \ker(R) \subseteq \ker(D) \iff \exists \pi : Z \to A \text{ t.q. } D = \pi \circ R
  \]
* **Teorema de Abstracción Mínima (Minimal Representation Theorem):** 
  La partición inducida por el núcleo del operador de decisión (\(\ker(D)\)) constituye la representación más comprimida que preserva la decisión sin pérdida.
* **Teorema de Regret Composicional (Compositional Regret Theorem):** 
  En una cascada de representaciones \(S \to Z_1 \to Z_2\), el regret total acumulado se descompone de manera aditiva por los regrets de las etapas individuales.

---

## 5. Positioning

La auditoría de novedad (Fase A + Fase B) compara el núcleo de TAKT con
cinco marcos formales existentes. El resultado se resume en una tabla:

| Framework                         | Preservación decisional | Resultado              |
|-----------------------------------|------------------------|------------------------|
| Sufficient Statistics (Berger)    | Teorema                | Correspondencia fuerte |
| Blackwell Comparison              | Teorema                | Correspondencia parcial|
| Decision-Sufficient (π*)          | Definición derivada    | Correspondencia fuerte |
| Information Bottleneck            | Ausente                | Independencia          |
| Bisimulation                      | Teorema + definición   | Correspondencia parcial|

**Interpretación de la tabla:**

En cuatro de los cinco marcos, la preservación decisional aparece — pero
siempre como una propiedad derivada (teorema o definición subordinada)
dentro de un aparato teórico más amplio (estadística, probabilidad,
dinámica de MDP). En TAKT, esa misma relación es el axioma fundacional.

En el quinto marco (Information Bottleneck), la preservación decisional
no aparece en absoluto: el marco preserva información, no decisiones.
Esto confirma que el resultado no es trivial — no todo marco de
representación contiene la condición de TAKT.

**Separaciones identificadas (Fase B):**

- Information Bottleneck: independencia lógica. Preservación
  informacional ≠ preservación decisional.
- Decision-Sufficient: TAKT equivale a π*-suficiencia. Q*-suficiencia
  es estrictamente más fuerte (requiere preservar valores, no solo
  acciones óptimas).
- Bisimulation: TAKT es un debilitamiento. Bisimulación preserva
  dinámica y recompensa completa; TAKT solo preserva la acción óptima.
- Blackwell: TAKT es determinista y específico. Blackwell usa kernels
  estocásticos y cuantifica sobre todo problema de decisión.
- Sufficient Statistics: la preservación es estructuralmente idéntica,
  pero TAKT no requiere las hipótesis estadísticas (distribuciones,
  convexidad, esperanza condicional) que Berger necesita.

El patrón transversal: TAKT aísla la preservación decisional de los
aparatos teóricos en los que aparece incrustada en otros marcos.

---

## 6. Main Claim

La conclusión que emerge de la auditoría no es que TAKT sea equivalente
o supere a otros marcos. Es que ocupa un lugar lógico distinto:

> TAKT axiomatiza la preservación decisional independientemente del
> aparato probabilístico, dinámico o informacional que otras teorías
> utilizan para derivarla.

En Berger, la preservación decisional es consecuencia del teorema de
Rao-Blackwell y requiere distribuciones, esperanzas y convexidad.
En Blackwell, es consecuencia del teorema de comparación y requiere
kernels estocásticos y cuantificación universal. En State Abstraction,
π*-suficiencia es una definición entre muchas en una jerarquía que
presupone MDPs. En Bisimulation, la preservación decisional es un
subproducto de una equivalencia conductual mucho más fuerte.

En TAKT, la preservación decisional no se deriva de nada. Es el punto
de partida.

Esta diferencia no es de grado — no es que TAKT sea "más simple" o "más
abstracta". Es una diferencia de **estatus lógico**: qué se postula y
qué se demuestra. Los otros marcos demuestran la preservación decisional.
TAKT la postula como axioma, y a partir de ahí deriva consecuencias
(regret, minimalidad, composicionalidad).

---

## 7. Limits

TAKT no es un marco universal. No pretende reemplazar ninguno de los
marcos auditados. Explícitamente:

- **No reemplaza MDPs.** TAKT no modela transiciones, descuento,
  planificación ni aprendizaje secuencial. Para problemas que requieran
  dinámica, un MDP (o bisimulación) es necesario.
- **No reemplaza teoría estadística.** TAKT no ofrece estimación,
  inferencia, intervalos de confianza ni análisis de riesgo. Para
  problemas que requieran inferencia estadística, la teoría de
  estadísticos suficientes (Berger) es necesaria.
- **No reemplaza Information Bottleneck.** TAKT no ofrece compresión
  informacional, tradeoff β ni representaciones con grados de
  preservación. Para problemas que requieran cuantificar cuánta
  información se retiene, IB es necesario.
- **No modela incertidumbre.** TAKT no tiene distribuciones, creencias
  previas, riesgo esperado ni análisis bayesiano. Para problemas con
  incertidumbre epistémica o aleatoria, se necesita teoría de la
  decisión estadística.
- **No es algorítmico.** TAKT no ofrece métodos para construir Rs, ni
  garantías de convergencia, ni cotas de error muestral. Es una teoría
  de condiciones, no de procedimientos.
- **No es una teoría de representaciones.** TAKT solo distingue
  representaciones seguras de inseguras. No dice qué representación
  es "mejor" entre dos seguras (salvo por minimalidad), ni cómo
  encontrarla.

Estos límites no son debilidades. Son el resultado de aislar la
preservación decisional como principio autónomo. Lo que TAKT gana en
generalidad (no requiere distribuciones, dinámica, ni información) lo
pierde en expresividad (no modela esos fenómenos).

---

## 8. Outlook

La utilidad de TAKT no está en competir con los marcos existentes, sino
en ocupar el espacio que dejan vacío: ofrecer una condición de seguridad
que no dependa de supuestos probabilísticos, dinámicos o informacionales.

Esto habilita aplicaciones donde esos supuestos no están disponibles:

- **Sistemas deterministas** donde no hay distribuciones que modelar,
  pero sigue siendo necesario verificar que una abstracción no altera
  la decisión.
- **Sistemas lógicos** donde los estados son fórmulas y las decisiones
  son inferencias. La condición \(\ker(R) \subseteq \ker(D)\) es
  verificable combinatoriamente.
- **Sistemas compuestos** donde el regret total es la suma de regrets
  parciales. La composicionalidad permite descomponer la verificación
  de seguridad en componentes independientes.
- **Control de representaciones** en pipelines de IA donde múltiples
  transformaciones (embedding, selección, proyección) se aplican
  secuencialmente. TAKT permite verificar que ninguna transformación
  individual destruye la seguridad de la representación.

Más allá de estas aplicaciones inmediatas, TAKT ofrece un lenguaje para
formular una pregunta que otros marcos presuponen respondida:

> Dado un sistema que decide, ¿qué información es necesario retener
> para que la decisión no cambie?

Al responder esta pregunta de manera mínima — sin añadir ni probabilidad,
ni dinámica, ni información — TAKT define el límite inferior de la
preservación decisional. Todo marco más expresivo añade algo más;
ninguno puede prescindir de menos.
