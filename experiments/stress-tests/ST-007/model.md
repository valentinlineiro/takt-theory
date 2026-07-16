# ST-007: External Dynamic Safety Contract — Model

## Espacio de Estados, Decisión y Test

Representamos la escala continua de error mediante décimas de unidad:

* **Espacio de Estados ($S$):**
  \[
  S = \{-20, -15, -10, -5, 0, 5, 10, 15\} \subset \mathbb{Z}
  \]
* **Operador de Decisión del Clasificador ($D$):**
  - $D(s) = 1$ (Normal / $\text{POS}$) si $s \ge 0$.
  - $D(s) = 0$ (Anomalía / $\text{NEG}$) si $s < 0$.
* **Conjunto de Test Empírico ($T$):**
  \[
  T = \{-15, -5, 5, 15\} \subset S
  \]

---

## Representación por Cuantificación de Features con Deriva

El codificador de Edge-AI cuantifica el feature score $s$ aplicando una deriva térmica $\theta_t$:
\[
R_t(s) = \lfloor (s - \theta_t) \,/\, 10 \rfloor
*/
\]
*(Nota: implementado mediante divisiones enteras de floor)*.

Evaluamos el sistema en dos instantes:

### 1. Estado Nominal ($t = 0, \theta_0 = 0$)
\[
R_0(s) = \lfloor s \,/\, 10 \rfloor
\]
* Fibras del kernel: $\{-20, -15\} \to -2$, $\{-10, -5\} \to -1$, $\{0, 5\} \to 0$, $\{10, 15\} \to 1$.
* Todas las fibras son seguras (monocromáticas en $D$).
* Cobertura de fibras $C(T, S)$ satisfecha (cada fibra tiene un representante en $T$).
* Margen decisional: $M(R_0) = d(-5, 0) = 5$.

### 2. Estado de Deriva Térmica ($t = 1, \theta_1 = 3$)
\[
R_1(s) = \lfloor (s - 3) \,/\, 10 \rfloor
\]
* El estado $s = 0$ ahora se agrupa con $s = -5$:
  - $R_1(0) = \lfloor -3/10 \rfloor = -1$
  - $R_1(-5) = \lfloor -8/10 \rfloor = -1$
* Dado que $D(0) = 1 \neq 0 = D(-5)$, la representación es globalmente **insegura**.
* Margen decisional: $M(R_1) = 0$.

---

## El Contrato Dinámico $\mathcal{C}_0$

El contrato de gobernanza se inicializa como:
\[
\mathcal{C}_0 = (R_t, D, \pi, T, d, m_{\text{min}} = 5)
\]
donde la política del agente $\pi$ está alineada nominalmente.
* El umbral mínimo de seguridad requiere que el margen decisional sea al menos $5$.
* Si el margen colapsa por debajo de $5$ debido a la deriva, el contrato se considerará **violado (inactivo)**.
