# ST-004: Hidden Kernel Attack — Prediction

Basándonos en la formulación del modelo, formulamos las siguientes predicciones analíticas:

## Predicción 1: Indistinguibilidad Empírica ($\Omega(R_1) = \Omega(R_2)$)

Predecimos que el sensor empírico $\text{safe\_on\_T}$ será incapaz de diferenciar entre la representación segura $R_1$ y la representación de ataque $R_2$:

1. Para $R_1$: Como $R_1(s_0) = z_0 \neq z_1 = R_1(s_2)$, no hay colisiones en el conjunto de test $T$.
   \[
   \text{safe\_on\_T}(R_1) = \text{True}
   \]
2. Para $R_2$: Como $R_2(s_0) = z_0 \neq z_1 = R_2(s_2)$, tampoco hay colisiones en el conjunto de test $T$.
   \[
   \text{safe\_on\_T}(R_2) = \text{True}
   \]

Ambas representaciones serán declaradas **empíricamente seguras** con un regret decisional observable de cero en el conjunto de test.

## Predicción 2: Ruptura Silenciosa de la Seguridad Global

A nivel global (sobre todo el espacio $S$), la seguridad de $R_2$ se rompe sin alertar a los observables empíricos:
* El par de estados $(s_0, s_3)$ comparte la representación $R_2(s_0) = R_2(s_3) = z_0$.
* Sin embargo, $D(s_0) = a \neq b = D(s_3)$.
* Por lo tanto, el kernel de $R_2$ no está contenido en el de $D$:
  \[
  \ker(R_2) \not\subseteq \ker(D)
  \]

Predecimos que **el ataque de kernel oculto será validado formalmente**, demostrando que los observables empíricos locales no son suficientes para garantizar la seguridad global sin supuestos de cobertura o regularidad.
