# ST-002: Compositional Pipeline — Hypothesis

## Contexto y Motivación

En sistemas complejos de inteligencia artificial o control industrial, las representaciones no se obtienen en un solo paso, sino a través de cascadas o pipelines de contracción secuenciales (e.g., *Sensores $\to$ Embedding $\to$ Agregación $\to$ Política*). 

Para certificar la seguridad decisional de tales sistemas, es crucial determinar si la condición de seguridad de TAKT ($\ker(R) \subseteq \ker(D)$) es **composicional**: si cada etapa es segura individualmente, ¿es segura la composición de todas las etapas?

## Hipótesis

1. **Garantía de Composición Estructural:** La seguridad decisional se propaga a lo largo de un pipeline $S \xrightarrow{R_1} Z_1 \xrightarrow{R_2} Z_2$ si y solo si la seguridad de la segunda etapa se evalúa respecto a la política inducida $\pi_1: Z_1 \to A$ (proveniente de la factorización $D = \pi_1 \circ R_1$).
2. **Frontera de Incompatibilidad Local:** Si la seguridad de la segunda etapa $R_2$ se define respecto a un operador de decisión arbitrario $D_2: Z_1 \to A$ no alineado con la política inducida $\pi_1$, la composición $R_2 \circ R_1$ puede resultar **insegura**, a pesar de que cada etapa sea localmente segura para sus respectivas tareas.
3. **Rol de la Factorización:** La factorización de TAKT no es solo un resultado de equivalencia estática, sino el puente matemático necesario para transferir la noción de "decisión segura" a espacios de representación abstractos.

## Criterio de Parada de ST-002

Este stress-test se considerará terminado y exitoso cuando:
1. Se enuncie y demuestre formalmente en Lean 4 el teorema general de seguridad composicional.
2. Se construya y demuestre formalmente un contraejemplo que ilustre la ruptura de la seguridad composicional cuando los operadores de decisión intermedios no están alineados.
3. Se clasifique el resultado final bajo una de las etiquetas del framework.
