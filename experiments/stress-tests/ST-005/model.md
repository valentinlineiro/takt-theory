# ST-005: Multi-agent / Distributed Decision — Model

## Espacio de Estados y Acciones

* **Espacio de Estados ($S$):**
  \[
  S = \{s_0, s_1, s_2\}
  \]
* **Acciones de los Agentes ($A_A, A_B$):**
  \[
  A_A = \{0, 1\}, \quad A_B = \{0, 1\}
  \]

---

## Políticas del Agente $A$

El agente $A$ puede ejecutar dos políticas diferentes:

1. **Política Nominal ($\pi_A^{\text{nom}}$):**
   - $\pi_A^{\text{nom}}(s_0) = 0, \quad \pi_A^{\text{nom}}(s_1) = 0, \quad \pi_A^{\text{nom}}(s_2) = 1$
2. **Política Desplazada ($\pi_A^{\text{shift}}$):**
   - $\pi_A^{\text{shift}}(s_0) = 0, \quad \pi_A^{\text{shift}}(s_1) = 0, \quad \pi_A^{\text{shift}}(s_2) = 0$

---

## Decisión Coordinada y Representación del Agente $B$

### Representación de $B$ ($R_B$)
El agente $B$ filtra el estado con contracción de información en $s_1$ y $s_2$:
* $R_B(s_0) = 1$
* $R_B(s_1) = 0, \quad R_B(s_2) = 0$
* *Kernel de $R_B$:* Las clases de equivalencia son $\{s_0\}$ y $\{s_1, s_2\}$.

### Operador de Decisión Coordinada de $B$ ($D_B$)
La decisión de $B$ depende tanto del estado $s$ como de la acción elegida por $A$ ($a_A$):
* $D_B(s_0, 0) = 1$
* $D_B(s_1, 0) = 0$
* $D_B(s_2, 0) = 1$
* $D_B(s_2, 1) = 0$

---

## Operadores de Decisión Efectivos de $B$

Bajo cada política de $A$, la decisión efectiva que debe tomar el agente $B$ es $D_B^{\text{eff}}(s) = D_B(s, \pi_A(s))$:

1. **Decisión Efectiva Nominal ($D_B^{\text{nom}}$):**
   - $D_B^{\text{nom}}(s_0) = D_B(s_0, 0) = 1$
   - $D_B^{\text{nom}}(s_1) = D_B(s_1, 0) = 0$
   - $D_B^{\text{nom}}(s_2) = D_B(s_2, 1) = 0$

2. **Decisión Efectiva Desplazada ($D_B^{\text{shift}}$):**
   - $D_B^{\text{shift}}(s_0) = D_B(s_0, 0) = 1$
   - $D_B^{\text{shift}}(s_1) = D_B(s_1, 0) = 0$
   - $D_B^{\text{shift}}(s_2) = D_B(s_2, 0) = 1$
