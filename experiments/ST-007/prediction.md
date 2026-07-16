# ST-007: External Dynamic Safety Contract — Prediction

Basándonos en la formulación del modelo, formulamos las siguientes predicciones analíticas:

## Predicción 1: Satisfacción bajo Condiciones Nominales ($t = 0$)

Bajo condiciones normales de temperatura ($\theta_0 = 0$):
1. **Seguridad empírica:** Se cumple en $T = \{-15, -5, 5, 15\}$.
2. **Cobertura de Fibras:** Satisfecha, ya que las 4 fibras de $R_0$ tienen un representante en $T$.
3. **Margen Decisional:** El par más cercano con decisiones y representaciones diferentes es $(-5, 0)$, con distancia $d(-5, 0) = 5$.
   \[
   M(R_0) = 5 \ge m_{\text{min}} = 5
   \]
4. **Alineación:** La política nominal $\pi$ está alineada con $D$ sobre $T$.

Predecimos que **el contrato dinámico $\mathcal{C}_0$ se declarará formalmente satisfecho (activo)**.

---

## Predicción 2: Falla Silenciosa del Test bajo Deriva ($t = 1$)

Bajo deriva térmica ($\theta_1 = 3$):
Examinamos las representaciones del conjunto de test $T$:
* $R_1(-15) = \lfloor -18/10 \rfloor = -2$ (decisión: 0)
* $R_1(-5) = \lfloor -8/10 \rfloor = -1$ (decisión: 0)
* $R_1(5) = \lfloor 2/10 \rfloor = 0$ (decisión: 1)
* $R_1(15) = \lfloor 12/10 \rfloor = 1$ (decisión: 1)

Como todos los elementos de $T$ se mapean a representaciones diferentes, no hay colisiones en el test. Por lo tanto, el test empírico reporta seguridad del 100%:
\[
\text{safe}_T(R_1) = \text{True}
\]
Predecimos que **el conjunto de test local fallará silenciosamente, declarando falsamente que la representación es segura**.

---

## Predicción 3: Alerta del Contrato por Colapso de Margen ($t = 1$)

A nivel global, la deriva térmica colapsa los estados $s = 0$ y $s = -5$ en la misma representación:
* $R_1(0) = R_1(-5) = -1$
* Dado que sus decisiones difieren ($D(0) = 1 \neq 0 = D(-5)$), la representación es globalmente insegura.
* Por la definición de margen decisional de D-001, al ser insegura:
   \[
   M(R_1) = 0
   \]
* Puesto que el margen requerido es $m_{\text{min}} = 5$, se viola la condición:
   \[
   M(R_1) = 0 < 5
   \]

Predecimos que **el Contrato Dinámico detectará la violación y se inhabilitará (alertando al sistema), bloqueando el fallo silencioso del test**.
