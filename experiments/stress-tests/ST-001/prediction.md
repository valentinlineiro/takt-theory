# ST-001: Decision Boundary Stability — Prediction

Basándonos en la formulación del modelo, formulamos las siguientes predicciones matemáticas:

## Predicción 1: Preservación Absoluta de la Utilidad ($\varepsilon_U = 0$)

Dado que todos los pares de estados pertenecen a la misma clase de equivalencia bajo $R$, el regret de utilidad máximo $\varepsilon_U$ se calcula sobre todas las combinaciones posibles en $\ker(R)$:

* $Regret_U(s_0, s_0) = U(s_0, D(s_0)) - U(s_0, D(s_0)) = 5 - 5 = 0$
* $Regret_U(s_0, s_1) = U(s_0, D(s_0)) - U(s_0, D(s_1)) = U(s_0, b) - U(s_0, a) = 5 - 5 = 0$
* $Regret_U(s_1, s_0) = U(s_1, D(s_1)) - U(s_1, D(s_0)) = U(s_1, a) - U(s_1, b) = 5 - 5 = 0$
* $Regret_U(s_1, s_1) = U(s_1, D(s_1)) - U(s_1, D(s_1)) = 5 - 5 = 0$

Por lo tanto, predecimos que:
\[
\varepsilon_U(R) = \max_{(x,y) \in \ker(R)} Regret_U(x, y) = 0
\]
La representación $R$ es **completamente segura desde la perspectiva del regret de utilidad**.

## Predicción 2: Ruptura de la Preservación Decisional ($\varepsilon_D > 0$)

Para que la representación sea segura decisionalmente, debe cumplirse la condición del kernel de TAKT:
\[
\ker(R) \subseteq \ker(D)
\]

Sin embargo:
* $(s_0, s_1) \in \ker(R)$ porque $R(s_0) = R(s_1)$.
* Pero $D(s_0) = b$ y $D(s_1) = a$. Dado que $a \neq b$, el par $(s_0, s_1) \notin \ker(D)$.

Por lo tanto:
\[
\ker(R) \not\subseteq \ker(D) \implies \varepsilon_D(R) > 0
    \]
Predecimos que **la preservación decisional se rompe de forma absoluta debido al operador de desempate en la frontera degenerada**.

## Predicción 3: Asimetría Teórica y Validez de la Equivalencia

1. Se confirmará formalmente en Lean 4 que $\varepsilon_U(R) = 0 \not\implies \varepsilon_D(R) = 0$, demostrando que la utilidad no puede actuar como sustituto de la decisión en escenarios de frontera.
2. El teorema de equivalencia de seguridad de TAKT ($\varepsilon_D(R) = 0 \iff \ker(R) \subseteq \ker(D)$) se mantendrá intacto porque no depende de la métrica de utilidad sino de la consistencia de las acciones seleccionadas.
