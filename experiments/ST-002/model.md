# ST-002: Compositional Pipeline — Model

Este experimento utiliza dos modelos formales: un teorema general de composición y un escenario mínimo de contraejemplo.

---

## 1. Modelo General de Composición

Definimos la cascada de representaciones:
\[
S \xrightarrow{R_1} Z_1 \xrightarrow{R_2} Z_2
    \]
y un operador de decisión sobre el espacio original:
\[
D: S \to A
\]

### Supuesto de Seguridad de Primera Etapa
La representación $R_1$ es decisionalmente segura para $D$:
\[
\ker(R_1) \subseteq \ker(D)
\]
Por el teorema de factorización de TAKT, esto implica la existencia de una política inducida:
\[
\pi_1: Z_1 \to A \quad \text{tal que} \quad D = \pi_1 \circ R_1
\]

### Supuesto de Seguridad de Segunda Etapa
La representación $R_2$ es decisionalmente segura para la política inducida $\pi_1$:
\[
\ker(R_2) \subseteq \ker(\pi_1)
\]

---

## 2. Modelo de Contraejemplo (Alineación Incorrecta)

Para demostrar qué ocurre cuando las etapas no están alineadas a través de la política inducida, definimos las siguientes estructuras finitas:

* **Espacios:**
  - $S = \{s_0, s_1, s_2\}$
  - $Z_1 = \{z_0, z_1\}$
  - $Z_2 = \{w_0\}$
  - $A = \{a, b\}$

* **Operador de Decisión Global ($D$):**
  - $D(s_0) = a, \quad D(s_1) = a, \quad D(s_2) = b$

* **Primera Representación ($R_1$):**
  - $R_1(s_0) = z_0, \quad R_1(s_1) = z_0, \quad R_1(s_2) = z_1$
  - *Nota:* $\ker(R_1) \subseteq \ker(D)$ ya que $R_1(s_0) = R_1(s_1) \implies D(s_0) = D(s_1) = a$. $R_1$ es segura.
  - La política inducida es $\pi_1(z_0) = a, \quad \pi_1(z_1) = b$.

* **Segunda Representación ($R_2$):**
  - $R_2(z_0) = w_0, \quad R_2(z_1) = w_0$

* **Operador de Decisión Intermedio No Alineado ($D_2$):**
  - $D_2(z_0) = a, \quad D_2(z_1) = a$
  - *Nota:* $\ker(R_2) \subseteq \ker(D_2)$ se cumple trivialmente porque $D_2$ es constante ($a = a$). Por lo tanto, $R_2$ es "segura" para el sistema intermedio local $D_2$.
  - Sin embargo, $\ker(R_2) \not\subseteq \ker(\pi_1)$ ya que $R_2(z_0) = R_2(z_1) = w_0$, pero $\pi_1(z_0) = a \neq b = \pi_1(z_1)$.
