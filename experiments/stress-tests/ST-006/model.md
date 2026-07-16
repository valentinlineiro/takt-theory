# ST-006: Temporal Drift — Model

## Espacio de Estados y Acción

* **Espacio de Estados ($S$):**
  \[
  S = \{s_{-1.0}, s_{-0.1}, s_{0.1}, s_{1.0}\}
  \]
* **Espacio de Acciones ($A$):**
  \[
  A = \{0, 1\}
  \]
* **Operador de Decisión ($D$):**
  - $D(s_{-1.0}) = 0, \quad D(s_{-0.1}) = 0$
  - $D(s_{0.1}) = 1, \quad D(s_{1.0}) = 1$

---

## Representación Parametrizada por Deriva ($c_t$)

La representación en el tiempo $t$ se define utilizando un parámetro de deriva $c_t \in \mathbb{R}$:
\[
R_{c_t}(s) = \lfloor s - c_t \rfloor
\]
Evaluamos la secuencia temporal en 4 instantes con los siguientes valores de deriva:
* $c_0 = 0.00$
* $c_1 = 0.05$
* $c_2 = 0.10$
* $c_3 = 0.15$

---

## Métrica de Deriva y Umbral de Alerta

* **Distancia de Deriva ($\text{dist}$):** La distancia de cambio entre dos representaciones sucesivas es la diferencia absoluta de sus parámetros de deriva:
  \[
  \text{dist}(R_{c_a}, R_{c_b}) = |c_a - c_b|
  \]
* **Umbral de Alerta Local ($\tau$):** El sistema activa una alerta de deriva si y solo si la distancia supera el umbral:
  \[
  \tau = 0.08
  \]
  Como la deriva en cada paso es de $0.05$ (e.g., $|c_1 - c_0| = 0.05$), todos los cambios paso a paso son inferiores a $\tau = 0.08$ y, por tanto, **silenciosos**.
