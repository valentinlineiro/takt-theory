# D-001: Decision Margin Formalization

## Contexto y Motivación

Los resultados de los stress-tests anteriores, en particular la deriva silenciosa observada en [ST-006](../../../experiments/stress-tests/ST-006/conclusion.md), revelan que evaluar la seguridad decisional como una propiedad binaria ($\varepsilon_D(R) = 0$ frente a $\varepsilon_D(R) > 0$) es insuficiente para operar sistemas reales de forma robusta. Un sistema seguro puede encontrarse al borde de una transición catastrófica sin que los observables binarios muestren ninguna degradación.

Para resolver esta limitación, el hito **D-001** formaliza el concepto de **Margen Decisional** $M(R)$, el cual mide la "distancia al fallo" de una representación segura.

---

## Definición Matemática de $M(R)$

Sea $(S, d)$ un espacio métrico de estados. Sea $D : S \to A$ un operador de decisión y $R : S \to Z$ una representación segura ($\ker(R) \subseteq \ker(D)$).

Definimos el **Margen Decisional** $M(R) \in \mathbb{R}_{\ge 0}$ como el ínfimo de la distancia entre cualquier par de estados que poseen diferentes decisiones ideales y se encuentran en diferentes clases de equivalencia de la representación:

\[
M(R) = \inf \{ d(x, y) \mid x, y \in S, \quad R(x) \neq R(y) \land D(x) \neq D(y) \}
\]

Si la representación es insegura ($\ker(R) \not\subseteq \ker(D)$), definimos:
\[
M(R) = 0
\]

---

## Teorema de Estabilidad bajo Deriva (Perturbaciones)

El margen decisional actúa como una cota superior para la perturbación permitida.

**Teorema de Estabilidad:** Sea $R_0$ una representación segura con margen $M(R_0) > 0$. Si la representación sufre una perturbación o deriva temporal tal que el desplazamiento máximo de las fronteras de sus fibras es inferior a la mitad del margen:
\[
\delta < \frac{M(R_0)}{2}
\]
entonces la representación resultante $R_t$ tiene garantizada su seguridad decisional:
\[
\ker(R_t) \subseteq \ker(D)
\]

### Demostración Intuitiva:
Si dos estados $x, y$ tienen diferentes decisiones ($D(x) \neq D(y)$), la definición de margen garantiza que su distancia mínima es $d(x, y) \ge M(R_0)$. Si la perturbación desplaza las fronteras de las clases del kernel por una distancia $\delta < M(R_0)/2$, las clases de equivalencia de $R_t$ no pueden expandirse lo suficiente como para colapsar a $x$ e $y$ en la misma clase. Por lo tanto, no se mezclan decisiones diferentes en ninguna clase del kernel de $R_t$.

---

## Verificación Formal en Lean 4

La formalización constructiva del margen decisional para espacios de estados finitos y su validación sobre la secuencia de deriva temporal de ST-006 ha sido probada en [DecisionMargin.lean](../../../takt-formal/TaktFormal/DecisionMargin.lean).

Los resultados de los teoremas compilados son:

* **Representación Inicial $R_0$ (Segura):**
  - Margen calculado: $M(R_0) = 2$ (equivalente a una distancia física de $0.2$).
  - Teorema: `theorem R0_margin : decisionMargin dist D R0 all_S = some 2`
* **Representación Derivada $R_1$ (Segura):**
  - Margen calculado: $M(R_1) = 2$.
  - Teorema: `theorem R1_margin : decisionMargin dist D R1 all_S = some 2`
* **Representación Derivada $R_2$ (Segura):**
  - Margen calculado: $M(R_2) = 2$.
  - Teorema: `theorem R2_margin : decisionMargin dist D R2 all_S = some 2`
* **Representación Final $R_3$ (Insegura):**
  - Margen calculado: $M(R_3) = 0$ (debido al colapso de estados con diferentes decisiones).
  - Teorema: `theorem R3_margin : decisionMargin dist D R3 all_S = some 0`

Estos resultados prueban constructivamente que el margen decisional se mantiene constante y positivo ($2$) durante la deriva segura, y colapsa instantáneamente a $0$ en el momento en que se viola la inclusión de kernels.
