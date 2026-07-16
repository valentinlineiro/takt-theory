# ST-001: Decision Boundary Stability — Hypothesis

## Contexto y Motivación

En la teoría de la decisión determinista, cuando un estado presenta múltiples acciones que maximizan la utilidad, el sistema requiere de un operador de desempate determinista $\theta$ para seleccionar una única acción preferida y garantizar que el operador de decisión $D(s)$ sea una función bien definida. 

En los límites de estas fronteras decisionales (donde la diferencia de utilidad entre las mejores acciones es cero), surge una posible inestabilidad. Si dos estados tienen conjuntos de acciones óptimas que se solapan pero no son idénticos, la pérdida de utilidad de cruzarlas es nula, pero la decisión final elegida por el desempate determinista puede diferir.

## Hipótesis

1. **Sensibilidad al Desempate:** La condición de seguridad decisional de TAKT ($\ker(R) \subseteq \ker(D)$) es altamente sensible al operador de desempate determinista $\theta$ en presencia de fronteras degeneradas (estados con múltiples óptimos).
2. **Insuficiencia del Regret de Utilidad:** Preservar la utilidad óptima (regret cero, $\varepsilon_U = 0$) es una condición necesaria pero **insuficiente** para garantizar la preservación de la decisión ($\varepsilon_D = 0$) en estas fronteras.
3. **Persistencia de la Equivalencia de Seguridad:** La equivalencia de seguridad decisional en sí misma ($\varepsilon_D(R) = 0 \iff \ker(R) \subseteq \ker(D)$) permanece matemáticamente válida en la frontera, ya que la inestabilidad afecta a la relación entre la utilidad y la decisión, no a la consistencia del kernel.

## Criterio de Parada de ST-001

Este stress-test se considerará terminado y exitoso cuando:
1. Se modele un escenario de frontera degenerada (con empates de utilidad).
2. Se implemente y demuestre formalmente en Lean 4 la asimetría entre la preservación de utilidad y la preservación decisional.
3. Se responda de manera inequívoca a las preguntas sobre el comportamiento de la teoría en empates, ocultación de diferencias y validez de la equivalencia en la frontera.
4. El resultado quede clasificado formalmente bajo una de las etiquetas del framework.
