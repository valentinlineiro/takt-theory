# Bisimulation — Traducción formal

## Referencias

- Park, D. (1981). Concurrency and automata on infinite sequences.
  *Theoretical Computer Science*, 104–116.
- Milner, R. (1989). *Communication and Concurrency*. Prentice Hall.
- Larsen, K. G. & Skou, A. (1991). Bisimulation through probabilistic testing.
  *Information and Computation*, 94(1), 1–28.
- Givan, R., Dean, T., & Greig, M. (2003). Equivalence notions and model
  minimization in Markov decision processes. *Artificial Intelligence*,
  147(1–2), 163–223.
- Li, L., Walsh, T. J., & Littman, M. L. (2006). Towards a unified theory of
  state abstraction for MDPs. *Ninth International Symposium on Artificial
  Intelligence and Mathematics*, 531–539.
- Park, D. (1981). Concurrency and automata on infinite sequences.
  *Theoretical Computer Science*, 104–116.
- Milner, R. (1989). *Communication and Concurrency*. Prentice Hall.

## Pregunta

> ¿Cuándo dos estados son equivalentes desde el punto de vista del
> comportamiento futuro (acciones y recompensas) bajo cualquier política?

## Definiciones del marco

**Objeto primitivo**

Un MDP \((S, A, P, R, \gamma)\) donde:
- \(S\): estados
- \(A\): acciones
- \(P(s' \mid s, a)\): probabilidad de transición
- \(R(s, a)\): recompensa inmediata
- \(\gamma\): factor de descuento

**Relación de bisimulación (Givan, Dean & Greig, 2003)**

Una relación de equivalencia \(B \subseteq S \times S\) es una bisimulación si
para todo \((s_1, s_2) \in B\) y para toda acción \(a \in A\):

1. **Misma recompensa inmediata:** \(R(s_1, a) = R(s_2, a)\)
2. **Misma dinámica:** Para toda clase de equivalencia \(C \in S/B\),
   \[
   P(C \mid s_1, a) = P(C \mid s_2, a)
   \]
   donde \(P(C \mid s, a) = \sum_{s' \in C} P(s' \mid s, a)\).

Dos estados son **bisimilares** (\(s_1 \sim s_2\)) si existe una relación de
bisimulación que los contiene.

**Relación con state abstraction**

En la jerarquía de Li, Walsh & Littman (2006), la bisimulación corresponde a
\(\phi_{\text{model}}\): la abstracción más fina, que preserva tanto la
recompensa como las transiciones.

## Correspondencia observacional (hechos)

| Bisimulation                         | TAKT                                      |
|--------------------------------------|-------------------------------------------|
| Estados \(S\)                        | Estados \(S\)                             |
| Acciones \(A\)                       | Acciones \(A\)                            |
| Equivalencia \(\sim\) (bisimulación) | Representación \(R: S \to Z\)             |
| \(s_1 \sim s_2 \Rightarrow R(s_1)=R(s_2)\) y \(P\) | \(\ker(R) \subseteq \ker(D)\) |
| Preserva recompensa + dinámica       | Preserva solo decisión                    |
| Relación más fina de la jerarquía    | Corresponde a \(\phi_{\pi^*}\) (la más gruesa) |

> La auditoría busca correspondencias estructurales, no analogías
> terminológicas.

> La correspondencia no debe establecerse entre objetos, sino entre
> **relaciones de preservación**.

## Hipótesis de traducción

1. **Bisimulación → TAKT.** ¿\(s_1 \sim s_2\) implica
   \(\ker(R) \subseteq \ker(D)\)? Es decir, ¿preservar la conducta completa
   implica preservar la decisión?

2. **TAKT → Bisimulación.** ¿\(\ker(R) \subseteq \ker(D)\) implica
   \(s_1 \sim s_2\)? Es decir, ¿preservar la decisión implica preservar la
   conducta completa?

3. **Relación con la jerarquía de abstracciones.** La bisimulación es
   \(\phi_{\text{model}}\). TAKT es \(\phi_{\pi^*}\). ¿Cuál es la relación
   entre ambas?

4. **Equivalencia dinámica vs. estática.** Bisimulación requiere preservar
   transiciones (\(P\)). TAKT no tiene transiciones. ¿Es esto un obstáculo
   fundamental?

## Traducción a TAKT

**Dado:** Un MDP \((S, A, P, R, \gamma)\) con una relación de bisimulación
\(\sim\).

**Objetivo:** Construir un sistema de decisión TAKT.

| Elemento Bisimulation        | Traducción a TAKT                         |
|------------------------------|-------------------------------------------|
| \(S\) (estados)              | \(S\) (estados)                           |
| \(A\) (acciones)             | \(A\) (acciones)                          |
| \(R(s,a)\) (recompensa)      | \(U(s,a)\) (utilidad), con \(U = R\)      |
| \(\sim\) (bisimulación)      | \(R: S \to Z\) (representación)           |
| \(s_1 \sim s_2 \Rightarrow\) igual recompensa y transiciones | \(\ker(R) \subseteq \ker(D)\) |
| —                            | Regret \(\varepsilon_U, \varepsilon_D\)    |

**Traducción:**

De la bisimulación se sigue inmediatamente que \(s_1 \sim s_2\) implica
\(R(s_1, a) = R(s_2, a)\) para toda acción \(a\). En particular, si
\(U = R\), entonces \(\arg\max_a U(s_1, a) = \arg\max_a U(s_2, a)\).
Por tanto, \(D(s_1) = D(s_2)\). Luego:

\[
s_1 \sim s_2 \;\Rightarrow\; \ker(R) \subseteq \ker(D)
\]

si definimos \(R\) como la proyección canónica \(S \to S/\!\sim\).

**Veredicto:** La bisimulación implica la condición de TAKT. Toda
representación que preserva la conducta completa preserva también la decisión.
La implicación es unidireccional.

## Traducción desde TAKT

**Dado:** Sistema TAKT \((S, A, U, R, D)\) con \(\ker(R) \subseteq \ker(D)\).

**Objetivo:** Construir una relación de bisimulación.

| Elemento TAKT              | Traducción a Bisimulation                 |
|----------------------------|-------------------------------------------|
| \(S\)                      | \(S\) (estados)                           |
| \(A\)                      | \(A\) (acciones)                          |
| \(U\) (utilidad)           | \(R(s,a)\) (recompensa) si se iguala \(R = U\) |
| \(R\) (representación)     | \(\sim\) (bisimulación) tentativa         |
| \(\ker(R) \subseteq \ker(D)\) | No suficiente para bisimulación          |

**Limitaciones fundamentales:**

La condición \(\ker(R) \subseteq \ker(D)\) garantiza que dos estados con la
misma representación tienen la misma decisión. Pero la bisimulación exige
mucho más:

1. **Misma recompensa para TODAS las acciones.**
   \(\ker(R) \subseteq \ker(D)\) solo exige que coincida el argmax, no que
   coincidan todos los valores de utilidad/recompensa.

2. **Mismas transiciones probabilísticas.**
   TAKT no tiene \(P(s' \mid s, a)\) ni ningún concepto de dinámica.

**Contraejemplo (TAKT no implica bisimulación):**

Sean \(S = \{s_1, s_2\}\), \(A = \{a, b\}\).

| Estado | \(U(s,a)\) | \(U(s,b)\) | \(P(s_1 \mid s,a)\) | \(P(s_2 \mid s,a)\) | \(D(s)\) |
|--------|------------|------------|---------------------|---------------------|----------|
| \(s_1\) | 10         | 5          | 0.9                 | 0.1                 | \(a\)    |
| \(s_2\) | 8          | 3          | 0.1                 | 0.9                 | \(a\)    |

\(D(s_1)=D(s_2)=a\). TAKT permite \(R(s_1)=R(s_2)\).
Pero \(s_1 \not\sim s_2\) porque:
- \(U(s_1, a)=10 \neq 8=U(s_2, a)\)
- \(P(\cdot \mid s_1, a) \neq P(\cdot \mid s_2, a)\)

## Equivalencia

**Hipótesis 1:** ¿Bisimulación \(\Rightarrow\) \(\ker(R) \subseteq \ker(D)\)?

**Sí.** Si \(s_1 \sim s_2\), entonces comparten recompensa para toda acción,
luego comparten argmax. La bisimulación implica la condición de TAKT.

**Hipótesis 2:** ¿\(\ker(R) \subseteq \ker(D)\) \(\Rightarrow\) Bisimulación?

**No.** TAKT no preserva recompensas para acciones no-óptimas ni preserva
transiciones. La bisimulación es estrictamente más fuerte.

**Hipótesis 3:** Relación en la jerarquía de abstracciones.

En la jerarquía de Li, Walsh & Littman (2006):
- \(\phi_{\text{model}}\) (bisimulación) ⇒ \(\phi_{Q^*}\) ⇒ \(\phi_{a^*}\) ⇒
  \(\phi_{\pi^*}\) (TAKT)
- La bisimulación es la abstracción MÁS FINA; TAKT es la MÁS GRUESA entre las
  que preservan la decisión.

**Hipótesis 4:** ¿Equivalencia dinámica vs. estática impide traducción?

**Sí.** La bisimulación requiere preservar \(P(s' \mid s, a)\) — las
transiciones entre estados. TAKT no tiene este concepto. Es una diferencia
categorial: una teoría de comportamiento dinámico vs. una teoría de decisión
instantánea.

| Pregunta                     | Respuesta | Evidencia                                      |
|------------------------------|-----------|------------------------------------------------|
| ¿Traducción formal?          | Parcial   | Bisimulación ⇒ TAKT (unidireccional). TAKT ⇏ Bisimulación |
| ¿Isomorfismo?                | No        | Bisimulación requiere dinámica; TAKT no        |
| ¿Residual?                   | Sí        | Ver lista abajo                                 |

## Residual

**Elementos de TAKT no cubiertos por bisimulación:**

1. **Regret \((\varepsilon_U, \varepsilon_D)\) y cota.**
   Bisimulación no tiene noción de error de representación.

2. **Dirección inversa como axioma.**
   TAKT postula \(D = \pi \circ R\); en bisimulación la decisión es
   consecuencia de la equivalencia, no axioma.

3. **Composicionalidad secuencial.**
   TAKT compone representaciones con regret aditivo.

4. **Utilidad sin probabilidad.**
   TAKT no necesita \(P(s' \mid s, a)\) ni \(\gamma\).

**Elementos de bisimulación no representados por TAKT:**

1. **Transiciones probabilísticas \(P(s' \mid s, a)\).**
   El núcleo de la bisimulación — equivalencia de distribuciones de
   siguiente estado — no tiene equivalente en TAKT.

2. **Preservación de recompensa para TODAS las acciones.**
   Bisimulación requiere \(R(s_1, a) = R(s_2, a)\) para toda \(a\); TAKT
   solo exige coincidencia del argmax.

3. **Equivalencia conductual completa.**
   Bisimulación garantiza que dos estados son indistinguibles bajo
   CUALQUIER política; TAKT solo garantiza la misma decisión óptima.

4. **Factor de descuento \(\gamma\) y horizonte temporal.**
   Bisimulación se define en MDPs con horizonte (infinito o finito). TAKT
   es one-shot.

---

## Conclusión transversal (Fase A)

| Marco                                   | Relación de preservación                                          | Estado en el marco      |
|-----------------------------------------|-------------------------------------------------------------------|-------------------------|
| **Sufficient Statistics (Berger)**      | La decisión depende del estadístico suficiente (\(\delta = \delta^* \circ T\)) | **Teorema** |
| **Blackwell**                           | Orden de Blackwell ⇒ preservación de la decisión para todo problema de decisión | **Teorema** |
| **Decision-Sufficient Representations** | \(\phi(s_1)=\phi(s_2) \Rightarrow \pi^*(s_1)=\pi^*(s_2)\)        | **Definición derivada** |
| **Information Bottleneck**              | — (preserva información, no decisiones)                            | **No aplica**           |
| **Bisimulation**                        | \(s_1 \sim s_2 \Rightarrow D(s_1)=D(s_2)\) (preserva también recompensa y dinámica) | **Teorema + Definición** |
| **TAKT**                                | \(\ker(R) \subseteq \ker(D)\) (equiv. \(D = \pi \circ R\))        | **Axioma**              |

**Resultados de la Fase A:**

| Resultado                     | Marcos                                                     |
| ----------------------------- | ---------------------------------------------------------- |
| **Correspondencia fuerte**    | Sufficient Statistics, Decision-Sufficient Representations |
| **Correspondencia parcial**   | Blackwell, Bisimulation                                    |
| **No traducible**             | Information Bottleneck                                     |

**Patrón transversal confirmado (4/5 marcos con preservación decisional):**

En Berger, Blackwell, State Abstraction y Bisimulation, la preservación
decisional aparece como una propiedad **derivada** (teorema o definición
subordinada) de un aparato teórico más amplio (estadística, probabilidad,
dinámica de MDP). En TAKT, esa misma propiedad es el **axioma fundacional**.

La diferencia no es de contenido formal — la relación abstracta de preservar
la decisión mediante una representación es la misma — sino de **estatus
lógico**: qué se postula y qué se demuestra.

**Límite del patrón (1/5 marcos):**

Information Bottleneck se separa porque no es una teoría de preservación
decisional, sino de preservación informacional. Esto confirma que el patrón
no es trivial ni forzado: solo los marcos cuyo objeto primitivo son las
decisiones (o la conducta) tienden a contener la propiedad. Los marcos cuyo
objeto primitivo es la información no la contienen necesariamente.
