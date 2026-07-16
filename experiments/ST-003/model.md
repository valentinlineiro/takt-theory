# ST-003: External Formalism (Digital Control) — Model

## Espacio de Estados y Acciones

Para modelar la cuantificación en coma fija de forma compatible con los tipos de Lean 4 estándar, representamos las variables reales multiplicadas por 10 (e.g., $1.5$ se representa como $15$):

* **Espacio de Estados ($S$):**
  \[
  S = \mathbb{Z} \quad \text{(enteros representando décimas de unidad)}
  \]
* **Espacio de Acciones ($A$):**
  \[
  A = \{ \text{NEG}, \text{POS} \}
  \]

## Operador de Decisión ($D$)
El controlador Proporcional Bang-Bang ideal toma una decisión de control basada en el signo del error $x \in S$:
\[
D(x) = \begin{cases} 
\text{POS} & \text{si } x \ge 0 \\
\text{NEG} & \text{si } x < 0
\end{cases}
\]

---

## 1. Esquema 1: Cuantificación por Truncamiento (Floor)

La primera representación $R_{\text{floor}}: \mathbb{Z} \to \mathbb{Z}$ divide el estado por 10 (división entera con truncamiento hacia abajo):
\[
R_{\text{floor}}(x) = x \,/\, 10
\]
Las clases de equivalencia de esta representación agrupan estados en intervalos de longitud 10:
* $\dots, [-10, -1] \to -1, \quad [0, 9] \to 0, \quad [10, 19] \to 1, \dots$

---

## 2. Esquema 2: Cuantificación por Redondeo (Round)

La segunda representación $R_{\text{round}}: \mathbb{Z} \to \mathbb{Z}$ simula la cuantificación al entero más cercano añadiendo la mitad del paso (5 décimas) antes de dividir:
\[
R_{\text{round}}(x) = (x + 5) \,/\, 10
\]
Las clases de equivalencia de esta representación desplazan la ventana:
* $\dots, [-15, -6] \to -1, \quad [-5, 4] \to 0, \quad [5, 14] \to 1, \dots$
