# ST-006: Temporal Drift — Prediction

Basándonos en la formulación del modelo, formulamos las siguientes predicciones analíticas:

## Predicción 1: Cambios Incrementales Silenciosos

Para todos los pasos de la secuencia temporal, la distancia de deriva incremental se mantiene estrictamente por debajo del umbral de alerta $\tau = 0.08$:
* $\text{dist}(R_0, R_1) = |c_1 - c_0| = 0.05 < 0.08$
* $\text{dist}(R_1, R_2) = |c_2 - c_1| = 0.05 < 0.08$
* $\text{dist}(R_2, R_3) = |c_3 - c_2| = 0.05 < 0.08$

El sistema no activará ninguna alerta de deriva en ningún paso de tiempo individual.

---

## Predicción 2: Seguridad de las Etapas Intermedias ($t = 0, 1, 2$)

1. **En $t = 0$ ($c_0 = 0.00$):**
   - $R_0(s_{-1.0}) = -1, \quad R_0(s_{-0.1}) = -1 \implies$ Fibra: $\{s_{-1.0}, s_{-0.1}\}$ (Decisiones: $0, 0 \to$ Safe).
   - $R_0(s_{0.1}) = 0 \implies$ Fibra: $\{s_{0.1}\}$ (Decision: $1 \to$ Safe).
   - $R_0(s_{1.0}) = 1 \implies$ Fibra: $\{s_{1.0}\}$ (Decision: $1 \to$ Safe).
   - *Resultado:* $\ker(R_0) \subseteq \ker(D)$ (**Seguro**).

2. **En $t = 1$ ($c_1 = 0.05$):**
   - $R_1(s_{-1.0}) = -2, \quad R_1(s_{-0.1}) = -1 \implies$ Fibras separadas.
   - $R_1(s_{0.1}) = \lfloor 0.05 \rfloor = 0, \quad R_1(s_{1.0}) = \lfloor 0.95 \rfloor = 0 \implies$ Fibra: $\{s_{0.1}, s_{1.0}\}$ (Decisiones: $1, 1 \to$ Safe).
   - *Resultado:* $\ker(R_1) \subseteq \ker(D)$ (**Seguro**).

3. **En $t = 2$ ($c_2 = 0.10$):**
   - $R_2(s_{0.1}) = \lfloor 0.00 \rfloor = 0, \quad R_2(s_{1.0}) = \lfloor 0.90 \rfloor = 0 \implies$ Fibra: $\{s_{0.1}, s_{1.0}\}$ (Decisiones: $1, 1 \to$ Safe).
   - *Resultado:* $\ker(R_2) \subseteq \ker(D)$ (**Seguro**).

---

## Predicción 3: Ruptura Repentina de la Seguridad ($t = 3$)

En $t = 3$ ($c_3 = 0.15$), la deriva acumulada alcanza $0.15$:
* $R_3(s_{-0.1}) = \lfloor -0.1 - 0.15 \rfloor = \lfloor -0.25 \rfloor = -1$
* $R_3(s_{0.1}) = \lfloor 0.1 - 0.15 \rfloor = \lfloor -0.05 \rfloor = -1$

Los estados $s_{-0.1}$ y $s_{0.1}$ se colapsan en la misma representación $R_3(s_{-0.1}) = R_3(s_{0.1}) = -1$.
* Sin embargo, sus decisiones difieren: $D(s_{-0.1}) = 0 \neq 1 = D(s_{0.1})$.
* *Resultado:* $\ker(R_3) \not\subseteq \ker(D)$ (**Inseguro**).

Predecimos que **la seguridad decisional se romperá repentinamente en $t = 3$ sin haber disparado alertas de cambio local en ningún paso intermedio**.
