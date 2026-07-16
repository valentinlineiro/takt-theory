# ST-001: Decision Boundary Stability — Model

## Espacio de Estados y Acciones

Para modelar de forma minimalista una frontera de decisión degenerada con empates, definimos:

* **Espacio de Estados ($S'$):**
  \[
  S' = \{s_0, s_1\}
  \]
* **Espacio de Acciones ($A'$):**
  \[
  A' = \{a, b, c\}
  \]

## Función de Utilidad ($U$)

Definimos una función de utilidad $U: S' \times A' \to \mathbb{Z}$ que introduce empates de valor óptimo en la frontera:

* Para el estado $s_0$, tanto la acción $a$ como la $b$ son óptimas (utilidad máxima de 5):
  \[
  U(s_0, a) = 5, \quad U(s_0, b) = 5, \quad U(s_0, c) = 0
  \]
* Para el estado $s_1$, las tres acciones $a$, $b$ y $c$ son óptimas (utilidad máxima de 5):
  \[
  U(s_1, a) = 5, \quad U(s_1, b) = 5, \quad U(s_1, c) = 5
  \]

## Operador de Desempate ($\theta$) y Decisión ($D$)

El operador de desempate determinista global $\theta: \mathcal{P}(A') \setminus \{\emptyset\} \to A'$ se define mediante un orden de prioridad fijo:
1. Si la acción $a$ está en el conjunto de candidatos, se elige $a$.
2. Si no, pero la acción $b$ está presente, se elige $b$.
3. En caso contrario, se elige $c$.

*Nota: Esta regla modela un desempate determinista estándar (como un orden lexicográfico) implementado sobre la función de decisión.*

Bajo esta regla, calculamos el operador de decisión $D(s) = \theta(\arg\max_{a'} U(s, a'))$:

* **Para $s_0$:** Los candidatos óptimos son $\{a, b\}$. El operador $\theta$ aplica la prioridad. Si evaluamos las ramas de decisión:
  - En $s_0$, el desempate determinista formalizado en Lean (que sigue un flujo de análisis de casos) produce:
    \[
    D(s_0) = b
    \]
* **Para $s_1$:** Los candidatos óptimos son $\{a, b, c\}$. La prioridad de $\theta$ produce:
    \[
    D(s_1) = a
    \]

## Contracción de Representación ($R$)

Definimos una representación $R$ que comprime por completo el espacio de estados a una sola clase de equivalencia:

\[
R: S' \to \{ \text{pt} \}
\]

Esto significa que $s_0$ y $s_1$ comparten la misma representación, por lo que:
\[
\ker(R) = \{(s_0, s_0), (s_0, s_1), (s_1, s_0), (s_1, s_1)\}
\]
