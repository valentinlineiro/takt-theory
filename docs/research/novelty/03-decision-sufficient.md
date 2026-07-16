# Decision-Sufficient Representations — Traducción formal

## Referencias

- Li, L., Walsh, T. J., & Littman, M. L. (2006). Towards a unified theory of
  state abstraction for MDPs. *Ninth International Symposium on Artificial
  Intelligence and Mathematics*, 531–539.
- Dean, T., & Givan, R. (1997). Model minimization in Markov decision
  processes. *Proceedings of the Fourteenth National Conference on Artificial
  Intelligence*, 106–111.
- Givan, R., Dean, T., & Greig, M. (2003). Equivalence notions and model
  minimization in Markov decision processes. *Artificial Intelligence*,
  147(1–2), 163–223.
- Jiang, N., Kulesza, A., Singh, S., & Lewis, R. (2015). The dependence
  of effective planning horizon on model accuracy. *ICML*.
- Abel, D., Hershkowitz, D., & Littman, M. (2016). Near optimal behavior
  via approximate state abstraction. *ICML*.
- Abel, D. (2019). A theory of state abstraction for reinforcement learning.
  PhD thesis, Brown University.
- https://en.wikipedia.org/wiki/State_abstraction_(reinforcement_learning)

## Pregunta

> ¿Qué información del estado es necesario conservar para tomar una decisión
> óptima?

## Definiciones del marco

**Objeto primitivo**

Un MDP es una tupla \((S, A, P, R, \gamma)\) donde:

- \(S\) es el conjunto de estados
- \(A\) es el conjunto de acciones
- \(P(s' \mid s, a)\) es la probabilidad de transición
- \(R(s, a)\) es la función de recompensa
- \(\gamma\) es el factor de descuento

**Abstracción de estado (state abstraction)**

Una función \(\phi: S \to Z\) que agrupa estados en clases de equivalencia.
Se dice que \(\phi\) es una abstracción de estado.

**Suficiencia para la decisión**

Una abstracción \(\phi\) es suficiente para la decisión (decision-sufficient)
si preserva la información necesaria para tomar decisiones óptimas.

Literatura distingue varios tipos de suficiencia:

- **Q*-suficiencia**: \(\phi(s_1) = \phi(s_2) \implies Q^*(s_1, a) = Q^*(s_2, a)\)
  para toda acción \(a\).
- **\(\pi^*\)-suficiencia**: \(\phi(s_1) = \phi(s_2) \implies \pi^*(s_1) = \pi^*(s_2)\).
- **Suficiencia de valor**: \(\phi(s_1) = \phi(s_2) \implies V^*(s_1) = V^*\)
  (solo preserva el valor, no la acción).

**Minimalidad**

Una abstracción es mínima si ninguna otra abstracción tiene menos clases
y sigue siendo suficiente. Es decir, la partición inducida por \(\phi\) es la
más gruesa que preserva la decisión.

## Correspondencia observacional (hechos)

| Marco (State Abstraction)               | TAKT                                      |
|-----------------------------------------|-------------------------------------------|
| Abstracción \(\phi: S \to Z\)           | Representación \(R: S \to Z\)             |
| \(\phi(s_1)=\phi(s_2) \;\Rightarrow\; \pi^*(s_1)=\pi^*(s_2)\) | \(\ker(R) \subseteq \ker(D)\) |
| Relación de preservación (π*-suficiencia) | Relación de preservación (seguridad)    |
| Abstracción mínima                      | Representación minimal                    |

> La auditoría busca correspondencias estructurales, no analogías
> terminológicas.

> La correspondencia no debe establecerse entre objetos, sino entre
> **relaciones de preservación.**

> La afirmación fuerte no es «\(D\) es análogo a \(\pi^*\)», sino
> «\(\ker(R)\subseteq\ker(D)\) y \(\phi(s_1)=\phi(s_2)\Rightarrow\pi^*(s_1)=\pi^*(s_2)\)
> son la misma relación de preservación en dos lenguajes distintos.»

## Hipótesis de traducción

1. ¿La condición \(\phi(s_1) = \phi(s_2) \implies Q^*(s_1, a) = Q^*(s_2, a)\)
   es equivalente a \(\ker(R) \subseteq \ker(D)\) en TAKT?

2. ¿Existe una factorización \(D = \pi \circ \phi\) explícita en la
   literatura de state abstraction, análoga a \(D = \pi \circ R\)?

3. ¿La noción de minimalidad en state abstraction (máxima compresión que
   preserva decisiones) coincide con la minimalidad de TAKT?

4. ¿La distinción entre Q*-suficiencia, \(\pi^*\)-suficiencia y
   suficiencia de valor tiene análogo en TAKT?

## Traducción a TAKT

**Dado:** Un MDP \((S, A, P, R, \gamma)\) con una abstracción \(\phi: S \to Z\)

**Objetivo:** Construir un sistema de decisión TAKT.

La literatura de state abstraction no provee todos los elementos de TAKT,
pero la traducción parcial es:

| Elemento MDP / State Abstraction | Traducción a TAKT                  |
|-----------------------------------|------------------------------------|
| \(S\) (estados)                   | \(S\) (estados)                    |
| \(A\) (acciones)                  | \(A\) (acciones)                   |
| \(Q^*(s, a)\) (valor óptimo)      | \(U: S \times A \to \mathbb{R}\)   |
| \(\pi^*(s) = \arg\max_a Q^*(s,a)\)| \(D = \arg\max U\)                 |
| \(\phi: S \to Z\) (abstracción)   | \(R: S \to Z\) (representación)    |
| \(\pi^*(s_1) = \pi^*(s_2)\) si \(\phi(s_1)=\phi(s_2)\) | \(\ker(R) \subseteq \ker(D)\) |
| —                                 | Regret \(\varepsilon_U, \varepsilon_D\) |

**Traducción parcial** — requiere elegir qué tipo de suficiencia se traduce:
- **\(\phi_Q^*\)**: si \(\phi\) es Q*-suficiente, entonces \(U(s,a) = Q^*(s,a)\) produce
  \(\ker(R) \subseteq \ker(D)\) como consecuencia. Pero no al revés.
- **\(\phi_{\pi^*}\)**: si \(\phi\) es \(\pi^*\)-suficiente, la traducción es bicondicional.
  \(\phi_{\pi^*}(s_1)=\phi_{\pi^*}(s_2) \iff \pi^*(s_1)=\pi^*(s_2) \iff D(s_1)=D(s_2)\).

**Contraejemplo (Q*-suficiencia estrictamente más fuerte que TAKT):**

Sean \(S = \{s_1, s_2\}\), \(A = \{a, b\}\).

| Estado | \(Q^*(s, a)\) | \(Q^*(s, b)\) | \(\pi^*(s)\) |
|--------|---------------|---------------|--------------|
| \(s_1\) | 10            | 5             | \(a\)        |
| \(s_2\) | 8             | 3             | \(a\)        |

- \(\phi_Q^*(s_1) \neq \phi_Q^*(s_2)\) porque \(Q^*(s_1, a)=10 \neq 8=Q^*(s_2, a)\) y
  \(Q^*(s_1, b)=5 \neq 3=Q^*(s_2, b)\).
- \(\phi_{\pi^*}(s_1) = \phi_{\pi^*}(s_2)\) porque \(\pi^*(s_1)=a=\pi^*(s_2)\).
- TAKT permite \(R(s_1) = R(s_2)\) porque \(D(s_1)=a=D(s_2)\).

**Veredicto:** \(\phi_Q^* \Rightarrow \ker(R)\subseteq\ker(D)\) pero no al revés.
La relación de preservación que define TAKT (\(\ker(R)\subseteq\ker(D)\)) es
exactamente la relación que la literatura denomina \(\pi^*\)-suficiencia:
\(\phi(s_1)=\phi(s_2) \Rightarrow \pi^*(s_1)=\pi^*(s_2)\). No es una analogía
entre objetos (\(D\) y \(\pi^*\)), sino identidad de la relación de preservación
en ambos lenguajes.

## Traducción desde TAKT

**Dado:** Un sistema de decisión TAKT \((S, A, U, R, D)\) con
\(\ker(R) \subseteq \ker(D)\) y \(D = \arg\max U\).

**Objetivo:** Construir un MDP con abstracción suficiente.

| Elemento TAKT              | Traducción a State Abstraction        |
|----------------------------|---------------------------------------|
| \(S\) (estados)            | \(S\) (estados)                       |
| \(A\) (acciones)           | \(A\) (acciones)                      |
| \(U\) (utilidad)           | \(Q^*\) (valor óptimo de acción)      |
| \(R\) (representación)     | \(\phi\) (abstracción)                |
| \(D = \arg\max U\)         | \(\pi^* = \arg\max Q^*\)              |
| \(\ker(R) \subseteq \ker(D)\) | \(\phi_{\pi^*}\)-suficiencia        |
| Regret \(\varepsilon_U, \varepsilon_D\) | — (no existe análogo directo) |

**Limitaciones de la traducción:**

1. **No hay dinámica subyacente.** TAKT no tiene \(P(s' \mid s, a)\), \(\gamma\),
   ni función de recompensa. Para construir un MDP desde TAKT, habría que
   añadir artificialmente \(P\) y \(\gamma\) para definir \(Q^*\). La traducción
   requiere igualar \(U\) y \(Q^*\), pero TAKT no dice cómo se genera \(U\).

2. **No hay aprendizaje.** State abstraction se estudia en el contexto de
   algoritmos de RL (Q-learning, policy iteration). TAKT no hace afirmaciones
   sobre aprendizaje. El contraejemplo de Li, Walsh & Littman (2006, Theorem 2)
   muestra que \(\phi_{\pi^*}\) (la condición de TAKT) es *insuficiente* para
   Q-learning. Esto no contradice TAKT porque TAKT no reclama suficiencia
   algorítmica — es una teoría ontológica de representación segura.

3. **Estatus arquitectónico diferente.**
   State abstraction define \(\phi_{\pi^*}\)-suficiencia como *una clase de
   abstracciones entre muchas* dentro de una jerarquía. TAKT adopta la *misma
   relación de preservación* (\(\ker(R)\subseteq\ker(D)\)) como *principio
   fundacional* del sistema. Es la misma relación, pero con estatus
   arquitectónico distinto: consecuencia derivada en un marco, axioma
   primitivo en el otro. Este patrón replica exactamente lo observado en
   Berger (factorización de la decisión como consecuencia del teorema de
   Rao-Blackwell vs. axioma de factorización) y en Blackwell (garbling como
   consecuencia de un aparato probabilístico vs. relación estructural
   primitiva).

## Equivalencia

**Hipótesis 1:** ¿\(\phi(s_1)=\phi(s_2) \Rightarrow Q^*(s_1,a)=Q^*(s_2,a)\) equivale a
\(\ker(R) \subseteq \ker(D)\)?

**No.** Q*-suficiencia es estrictamente más fuerte. Correspondencia real:
\(\phi_{\pi^*}\)-suficiencia (\(\pi^*(s_1)=\pi^*(s_2)\)) es equivalente a
\(\ker(R) \subseteq \ker(D)\). Referencia: Li, Walsh & Littman (2006),
Definition 7 (\(\phi_{\pi^*}\)), Theorem 1 (jerarquía: \(\phi_Q^* \Rightarrow
\phi_{a^*} \Rightarrow \phi_{\pi^*}\)).

**Hipótesis 2:** ¿Existe factorización \(D = \pi \circ \phi\)?

**Sí, parcialmente.** Para \(\phi_{\pi^*}\), la política abstracta
\(\tilde{\pi}(z) = \pi^*(s)\) para cualquier \(s \in \phi^{-1}(z)\) está bien
definida. Para \(\phi_Q^*\), existe \(Q^*\) abstracta
\(\tilde{Q}^*(z, a) = Q^*(s, a)\) que preserva más información. La
factorización de TAKT (\(D = \pi \circ R\)) es más explícita: TAKT postula
\(R\) como función primitiva y \(D\) como función *derivada* de \(R\) vía
\(\pi\). En state abstraction, tanto \(\phi\) como \(\pi^*\) se definen
directamente sobre \(S\); la factorización es una consecuencia, no un axioma.

**Hipótesis 3:** ¿La minimalidad coincide?

**Sí.** La abstracción \(\phi_{\pi^*}\) mínima agrupa estados con el mismo
\(\pi^*\), que es exactamente la partición inducida por \(D\) en TAKT. Ambas
nociones: la máxima compresión que preserva la decisión. TAKT agrega la
posibilidad de representaciones no-minimales (finer que la partición de \(D\)),
que en state abstraction se llaman simplemente "abstracciones suficientes no
mínimas."

**Hipótesis 4:** ¿La jerarquía Q*-/π*-/valor-suficiencia tiene análogo en TAKT?

**Sí — la relación de preservación de TAKT es la π*-suficiencia:**

| Tipo                  | Condición de preservación                      | Relación con ker(R)⊆ker(D) |
|-----------------------|-----------------------------------------------|----------------------------|
| Q*-suficiencia        | \(\phi(s_1)=\phi(s_2) \Rightarrow Q^*(s_1,a)=Q^*(s_2,a)\) | Estrictamente más fuerte    |
| a*-suficiencia        | Preserva acción *y valor* óptimos              | Estrictamente más fuerte    |
| \(\pi^*\)-suficiencia | \(\phi(s_1)=\phi(s_2) \Rightarrow \pi^*(s_1)=\pi^*(s_2)\) | **Equivalente** (misma relación) |
| Valor-suficiencia     | \(\phi(s_1)=\phi(s_2) \Rightarrow V^*(s_1)=V^*(s_2)\) | Estrictamente más débil     |

Referencia: Li, Walsh & Littman (2006), Definitions 5-7.

La diferencia no está en la relación de preservación (idéntica en ambos casos),
sino en el estatus: en state abstraction es una clase de abstracciones entre
varias; en TAKT es el axioma fundacional del sistema. Es el mismo patrón
observado en Berger (Rao-Blackwell como consecuencia vs. factorización como
axioma) y Blackwell (garbling en aparato probabilístico vs. relación
estructural primitiva).

| Pregunta                     | Respuesta         | Evidencia                    |
|------------------------------|-------------------|------------------------------|
| ¿Existe traducción formal?   | Parcial           | TAKT ↔ \(\phi_{\pi^*}\); Q*-suficiencia es más fuerte |
| ¿Existe isomorfismo?         | No                | Falta teoría de aprendizaje y dinámica en TAKT; TAKT tiene regret y composicionalidad |
| ¿Existe residual?            | Sí                | Ver lista abajo              |

## Residual

**Elementos de TAKT no cubiertos por este marco:**

1. **Regret \((\varepsilon_U, \varepsilon_D)\) y teorema de cota.**
   State abstraction no define una noción análoga de error de representación
   como diferencia entre utilidad/regret antes y después de abstraer. El
   concepto de "pérdida por abstracción" aparece en Jiang et al. (2015) como
   "planning error" bound, pero no es equivalente a la estructura dua de TAKT.

2. **Dirección inversa (\(D = \pi \circ R\) como axioma).**
   TAKT postula que la decisión *es* la composición de representación y
   política. En state abstraction, \(\phi\) y \(\pi^*\) se definen
   independientemente sobre \(S\); la factorización es consecuencia de la
   suficiencia, no axioma fundacional.

3. **Utilidad determinista sin probabilidad.**
   TAKT opera con utilidades deterministas \(U: S \times A \to \mathbb{R}\)
   sin necesidad de distribuciones de probabilidad, transiciones estocásticas
   ni factores de descuento. State abstraction requiere el aparato completo
   del MDP (\(P, \gamma\)).

4. **Composicionalidad secuencial.**
   TAKT tiene teoremas de composición donde el regret total es la suma de
   regrets de componentes secuenciales. State abstraction no estudia
   composición de abstracciones en el mismo sentido.

**Elementos del marco no representados por TAKT:**

1. **Probabilidad y dinámica (\(P(s' \mid s, a), \gamma\)).**
   El corazón del MDP — transiciones estocásticas y horizonte temporal — no
   tiene representación en TAKT. TAKT es una teoría de decisión instantánea
   (one-shot), no secuencial.

2. **Valor acumulado (\(V^*, Q^*\) y ecuación de Bellman).**
   TAKT no tiene análogo de la función de valor, descuento temporal, ni
   ecuación de optimalidad de Bellman. La utilidad \(U\) en TAKT es un dato,
   no el resultado de un proceso de planificación.

3. **Garantías algorítmicas (convergencia de Q-learning).**
   El Teorema 2 de Li, Walsh & Littman (2006) establece que \(\phi_Q^*\) es
   necesaria y suficiente para convergencia de Q-learning a política óptima.
   \(\phi_{\pi^*}\) (la condición de TAKT) NO es suficiente. TAKT no necesita
   esta garantía porque no es una teoría de aprendizaje.

4. **Preservación del modelo (\(\phi_{\text{model}}\)).**
   State abstraction estudia abstracciones que preservan la dinámica
   (\(P\) y \(R\)). TAKT no tiene concepto de "modelo del mundo" que
   preservar. El nivel más fino de la jerarquía (\(\phi_{\text{model}}\)) no
   tiene traducción posible a TAKT.

---

## Observación transversal (Fase A)

Este es el tercer marco auditado, y en los tres emerge el mismo patrón
arquitectónico:

| Marco                                   | Relación de preservación                                          | Estado en el marco      |
|-----------------------------------------|-------------------------------------------------------------------|-------------------------|
| **Sufficient Statistics (Berger)**      | La decisión depende únicamente del estadístico suficiente (\(\delta = \delta^* \circ T\)) | **Teorema** |
| **Blackwell**                           | Orden de Blackwell (garbling) ⇒ preservación de la decisión para todo problema de decisión | **Teorema** |
| **Decision-Sufficient Representations** | \(\phi(s_1)=\phi(s_2) \Rightarrow \pi^*(s_1)=\pi^*(s_2)\)        | **Definición derivada** |
| **TAKT**                                | \(\ker(R) \subseteq \ker(D)\) (**equivalentemente**, \(D = \pi \circ R\)) | **Axioma** |

**Patrón transversal.** En los marcos auditados, la preservación decisional
aparece como una propiedad derivada (mediante un teorema o una definición
subordinada) de una teoría más amplia. En TAKT, esa misma relación constituye
un axioma fundacional. La diferencia no reside en la relación de preservación
en sí, sino en su **estatus lógico** dentro de la teoría. No es la misma fórmula — cada marco expresa la preservación decisional con sus propios recursos formales — pero es la misma **propiedad abstracta**: la representación retiene suficiente información para no alterar la decisión.

Este patrón se mantiene en tres de los cuatro marcos auditados hasta ahora.
**Information Bottleneck** se separa: no es una teoría de preservación
decisional, sino de preservación informacional. Si **Bisimulation** confirma
el patrón, la hipótesis transversal quedará respaldada por 4 de 5 marcos,
con un contraejemplo claro (IB) que demuestra que el patrón no es trivial.
