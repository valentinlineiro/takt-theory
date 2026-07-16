# ST-002: Compositional Pipeline — Prediction

Basándonos en la formulación de los dos modelos (teorema general y contraejemplo), formulamos las siguientes predicciones matemáticas:

## Predicción 1: Teorema de Composición Decisional Seguro

Si $R_1$ es segura para $D$, entonces $D$ se factoriza como $D = \pi_1 \circ R_1$. 
Si $R_2$ es segura para $\pi_1$, entonces $\pi_1$ se factoriza como $\pi_1 = \pi_2 \circ R_2$.

Por sustitución directa, para cualquier estado $s \in S$:
\[
D(s) = \pi_1(R_1(s)) = \pi_2(R_2(R_1(s))) = \pi_2((R_2 \circ R_1)(s))
\]
Esto demuestra que el operador de decisión $D$ se factoriza a través de la representación compuesta $R = R_2 \circ R_1$ utilizando la política $\pi_2$. 

Por el teorema de factorización de TAKT, predecimos que:
\[
\ker(R_2 \circ R_1) \subseteq \ker(D)
\]
La composición es **garantizadamente segura** si las etapas están alineadas a través de la política intermedia inducida.

## Predicción 2: Ruptura de la Composición por Desalineación

En el modelo de contraejemplo, evaluamos la composición de representaciones:
\[
R(s) = (R_2 \circ R_1)(s)
\]
* $R(s_0) = R_2(R_1(s_0)) = R_2(z_0) = w_0$
* $R(s_2) = R_2(R_1(s_2)) = R_2(z_1) = w_0$

Dado que $R(s_0) = R(s_2) = w_0$, tenemos:
\[
(s_0, s_2) \in \ker(R_2 \circ R_1)
\]
Sin embargo, evaluando las decisiones reales de estos estados:
* $D(s_0) = a$
* $D(s_2) = b$

Dado que $a \neq b$, entonces:
\[
(s_0, s_2) \notin \ker(D)
\]

Por lo tanto, predecimos que:
\[
\ker(R_2 \circ R_1) \not\subseteq \ker(D)
\]
La composición de representaciones es **insegura**, a pesar de que $R_1$ era segura para $D$ y $R_2$ era segura para el operador intermedio local $D_2$. La seguridad local no alineada no garantiza la seguridad global.
