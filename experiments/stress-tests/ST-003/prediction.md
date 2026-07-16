# ST-003: External Formalism (Digital Control) — Prediction

Basándonos en la formulación de los esquemas de cuantificación, formulamos las siguientes predicciones analíticas:

## Predicción 1: Seguridad de la Cuantificación Truncada

Bajo el truncamiento $R_{\text{floor}}(x) = x \,/\, 10$:

Si dos estados $x, y \in \mathbb{Z}$ comparten la misma representación $R_{\text{floor}}(x) = R_{\text{floor}}(y)$:
* Ambos pertenecen al mismo intervalo $[10k, 10k + 9]$ para algún $k \in \mathbb{Z}$.
* Si $k \ge 0$, todos los puntos del intervalo son $\ge 0$, por lo que $D(x) = D(y) = \text{POS}$.
* Si $k < 0$, todos los puntos del intervalo son $< 0$, por lo que $D(x) = D(y) = \text{NEG}$.

En ningún caso se mezclan signos en una misma clase de equivalencia. Por lo tanto, predecimos que:
\[
\ker(R_{\text{floor}}) \subseteq \ker(D)
\]
TAKT predice que **la cuantificación por truncamiento es decisionalmente segura**.

## Predicción 2: Inseguridad de la Cuantificación Redondeada

Bajo el redondeo $R_{\text{round}}(x) = (x + 5) \,/\, 10$:

Consideremos los estados $x = -2$ y $y = 2$:
* $R_{\text{round}}(-2) = (-2 + 5) \,/\, 10 = 3 \,/\, 10 = 0$
* $R_{\text{round}}(2) = (2 + 5) \,/\, 10 = 7 \,/\, 10 = 0$

Ambos estados comparten la misma representación $R_{\text{round}}(-2) = R_{\text{round}}(2) = 0$. Sin embargo:
* $D(-2) = \text{NEG}$
* $D(2) = \text{POS}$

Dado que las acciones difieren ($\text{NEG} \neq \text{POS}$), entonces:
\[
(-2, 2) \in \ker(R_{\text{round}}) \quad \text{pero} \quad (-2, 2) \notin \ker(D)
\]
Esto demuestra que:
\[
\ker(R_{\text{round}}) \not\subseteq \ker(D)
\]
TAKT predice que **la cuantificación por redondeo es decisionalmente insegura**, ya que oculta la frontera de cruce por cero dentro de su intervalo central, provocando que la decisión digital difiera inevitablemente del control ideal.
