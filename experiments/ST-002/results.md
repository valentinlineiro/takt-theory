# ST-002: Compositional Pipeline — Results

## Resultados de la Verificación Formal en Lean 4

El teorema general de composición y el escenario de contraejemplo para la desalineación inter-etapa han sido completamente formalizados y probados en **Lean 4** dentro del módulo [RegretPipeline.lean](file:///home/valentin/code/takt-theory/takt-formal/TaktFormal/RegretPipeline.lean). El proyecto compiló exitosamente sin errores de verificación.

Los resultados de las pruebas formales son los siguientes:

### 1. Teorema de Seguridad Composicional
El teorema `compositional_safety` demuestra que la composición es segura si la segunda etapa preserva la política inducida de la primera etapa:
```lean
theorem compositional_safety {S Z1 Z2 A : Type} (R1 : S → Z1) (R2 : Z1 → Z2) (D : S → A) (pi1 : Z1 → A)
    (h_fact : ∀ x, D x = pi1 (R1 x)) (h_safe2 : kernelSubset R2 pi1) :
    kernelSubset (fun x => R2 (R1 x)) D
```
* **Resultado:** **APROBADO (Teorema Probado)**. Si $R_1$ es segura para $D$ (lo que induce la política $\pi_1$) y $R_2$ es segura para $\pi_1$, entonces la composición $R_2 \circ R_1$ es garantizadamente segura para $D$.

### 2. Escenario de Contraejemplo (Desalineación Inter-Etapa)
En el espacio `CompositionalCounterexample`, las pruebas demuestran la ruptura de la seguridad cuando no hay alineación a través de la política inducida:

* **Seguridad de la etapa 1:**
  ```lean
  theorem R1_safe : kernelSubset R1 D
  ```
  * **Resultado:** **APROBADO**. $R_1$ es segura para la decisión original $D$.

* **Seguridad local aislada de la etapa 2:**
  ```lean
  theorem R2_safe_D2 : kernelSubset R2 D2
  ```
  * **Resultado:** **APROBADO**. $R_2$ es segura para una decisión intermedia arbitraria $D_2$.

* **Inseguridad local con respecto a la política inducida:**
  ```lean
  theorem R2_unsafe_pi1 : ¬ kernelSubset R2 pi1
  ```
  * **Resultado:** **APROBADO**. $R_2$ no es segura para la política inducida $\pi_1$ del sistema global.

* **Ruptura de la seguridad global compuesta:**
  ```lean
  theorem composite_unsafe : ¬ kernelSubset (fun x => R2 (R1 x)) D
  ```
  * **Resultado:** **APROBADO (Contraejemplo Validado)**. La composición $R_2 \circ R_1$ es insegura para la decisión original $D$.
