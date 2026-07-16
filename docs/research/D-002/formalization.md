# D-002: Test Coverage Characterization

## Contexto y Motivación

El stress-test adversarial [ST-004 (Hidden Kernel Attack)](file:///home/valentin/code/takt-theory/experiments/ST-004/conclusion.md) demostró que validar la seguridad decisional de una representación sobre un conjunto de test local $T \subset S$ no es un certificado de seguridad global ($\text{safe}_T(R) \not\implies \text{safe}_S(R)$). Esto ocurre porque el test de validación puede dejar partes del dominio decisional o colisiones del kernel sin observar.

Para resolver este límite epistemológico, el hito **D-002** caracteriza formalmente la **Condición de Cobertura de Fibras** $C(T, S)$ que actúa como puente matemático para generalizar las garantías empíricas locales a garantías de seguridad global.

---

## Condición de Cobertura de Fibras $C(T, S)$

Definimos que un conjunto de test $T \subset S$ posee **Cobertura de Fibras** con respecto a una representación $R$ y una decisión $D$ si para todo estado del dominio global $S$ existe un estado representativo en $T$ que posee su misma representación y su misma decisión ideal:

\[
C(T, S) \iff \forall x \in S, \quad \exists x' \in T, \quad R(x) = R(x') \land D(x) = D(x')
\]

Esta condición exige que $T$ "cubra" todas las clases del kernel de $R$ y que para cada clase del kernel, el test contenga al menos un representante con la decisión ideal correspondiente.

---

## Teorema Fundamental de Generalización de Cobertura

El teorema fundamental establece que la seguridad empírica y la cobertura de fibras son conjuntamente suficientes para garantizar la seguridad decisional global.

**Teorema de Generalización:**
\[
\text{safe}_T(R) \land C(T, S) \implies \text{safe}_S(R)
\]

### Demostración Formal (esquema):
Sean $x, y \in S$ tales que compartan la misma representación: $R(x) = R(y)$.
1. Por la condición $C(T, S)$, existe $x' \in T$ tal que $R(x') = R(x)$ y $D(x') = D(x)$.
2. Por la condición $C(T, S)$, existe $y' \in T$ tal que $R(y') = R(y)$ y $D(y') = D(y)$.
3. Dado que $R(x') = R(x) = R(y) = R(y')$, tenemos $R(x') = R(y')$.
4. Dado que $x', y' \in T$ y comparten representación, la seguridad empírica $\text{safe}_T(R)$ garantiza que sus decisiones coinciden: $D(x') = D(y')$.
5. Por transitividad, concluimos que las decisiones de los estados originales coinciden: $D(x) = D(x') = D(y') = D(y)$.
6. Por lo tanto, $\ker(R) \subseteq \ker(D)$ globalmente.

---

## Verificación Formal en Lean 4

El teorema fundamental de generalización y la verificación del contraejemplo de ST-004 han sido implementados y probados en [Coverage.lean](file:///home/valentin/code/takt-theory/docs/research/D-002/implementation/Coverage.lean):

* **Teorema de Generalización:** Probo formalmente la implicación `coverage_implies_global_safety` sin restricciones sobre la finitud de los espacios de estados.
* **Verificación de $R_1$ (Generalización exitosa):**
  - El teorema `R1_has_coverage` prueba que la representación segura $R_1$ cumple la condición de cobertura sobre $T = \{s_0, s_2\}$.
  - Dado que cumple cobertura y es segura en $T$, generaliza con éxito.
* **Verificación de $R_2$ (Ataque de Kernel Oculto):**
  - El teorema `R2_no_coverage` prueba de manera constructiva que la representación de ataque $R_2$ viola la condición de cobertura sobre $T$ (específicamente, para el estado oculto $s_3$, no existe ningún representante en $T$ con la misma representación y decisión).
  - Esto explica formalmente por qué la seguridad local de $R_2$ en $T$ no pudo generalizarse a nivel global.

---

## Conexión Geométrica con el Margen Decisional $M(R)$

En espacios métricos $(S, d)$, la cobertura de fibras se relaciona directamente con el margen decisional $M(R)$ a través de la regularidad de la representación. Si la densidad del conjunto de test $T$ (radio de cobertura de Hausdorff) es menor a la mitad del margen decisional:
\[
d(T, S) = \sup_{x \in S} \inf_{y \in T} d(x, y) < \frac{M(R)}{2}
\]
entonces cualquier representación regular (e.g., localmente constante o Lipschitz con Lipschitz-kernel) que sea segura sobre $T$ tiene garantizada la cobertura de todas las fronteras de decisión, impidiendo la aparición de "kernels ocultos".
