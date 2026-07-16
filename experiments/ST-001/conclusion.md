# ST-001: Decision Boundary Stability — Conclusion

## Clasificación del Resultado

* **Etiqueta Asignada:** **Boundary Identified** (Límite Identificado)

### Justificación de la Clasificación

El experimento ha validado formalmente que en presencia de fronteras degeneradas (donde coexisten múltiples acciones óptimas):
1. La preservación de utilidad y la preservación decisional se **desacoplan por completo**.
2. La métrica tradicional de regret de utilidad ($\varepsilon_U$) resulta **insuficiente** para certificar la seguridad decisional ($\varepsilon_D$).
3. Este comportamiento identifica una **frontera de aplicabilidad de la teoría**: cuando un sistema opera en el límite de indiferencia (empate de utilidad), no se puede delegar la seguridad en el regret de utilidad. Se debe verificar obligatoriamente la contención de los kernels de decisión ($\ker(R) \subseteq \ker(D)$).

---

## Respuestas a las Preguntas del Ciclo

### 1. ¿Qué ocurre cuando dos acciones tienen el mismo valor esperado (utilidad)?
Cuando hay empates de utilidad, el conjunto de acciones óptimas contiene más de un elemento. El operador de decisión $D(s)$, al ser determinista, debe elegir un elemento mediante una política de desempate $\theta$. Si el desempate responde de manera distinta debido a pequeñas variaciones contextuales o estructurales entre estados equivalentes, se produce una discrepancia decisional a pesar de que el regret de utilidad sigue siendo cero.

### 2. ¿La abstracción puede ocultar una diferencia decisiva?
**Sí.** La abstracción (representación $R$) puede agrupar estados que son idénticos desde la perspectiva del valor de utilidad (ambos alcanzan el óptimo de 5), pero cuyas decisiones óptimas elegidas por el desempate determinista difieren. Al colapsarlos bajo la misma representación, se asume que compartirán la misma acción en la política inducida ($\pi$), lo cual es imposible de cumplir de forma segura, ocultando una diferencia en la acción seleccionada.

### 3. ¿La equivalencia de seguridad se mantiene en la frontera?
**Sí.** El teorema fundamental de equivalencia de seguridad de TAKT ($\varepsilon_D(R) = 0 \iff \ker(R) \subseteq \ker(D)$) se mantiene intacto y es válido incluso en la frontera. Lo que se invalida en la frontera es la suficiencia de la utilidad: la implicación inversa $\varepsilon_U(R) = 0 \implies \varepsilon_D(R) = 0$ es falsa. La frontera no debilita la equivalencia de TAKT, sino que la justifica al demostrar que la decisión debe axiomatizarse por separado de la utilidad.
