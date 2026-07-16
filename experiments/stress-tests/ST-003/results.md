# ST-003: External Formalism (Digital Control) — Results

## Resultados de la Verificación Formal en Lean 4

El modelo y las pruebas de cuantificación para el controlador proporcional bang-bang han sido completamente formalizados y probados en **Lean 4** dentro del módulo [ExternalControl.lean](../../../takt-formal/TaktFormal/ExternalControl.lean). El proyecto compiló exitosamente con cero errores de verificación.

Los resultados son los siguientes:

### 1. Seguridad de la Cuantificación por Truncamiento (Floor)
El teorema `R_floor_safe` demuestra formalmente que la cuantificación por truncamiento es decisionalmente segura:
```lean
theorem R_floor_safe : kernelSubset R_floor D
```
* **Resultado:** **APROBADO (Teorema Probado)**. Dado que la frontera de truncamiento hacia abajo de $R_{\text{floor}}$ está alineada con el cruce por cero de la decisión bang-bang, ningún intervalo de equivalencia de la cuantificación mezcla estados con diferentes signos. Por lo tanto, la relación de kernels $\ker(R_{\text{floor}}) \subseteq \ker(D)$ se cumple de forma garantizada.

### 2. Inseguridad de la Cuantificación por Redondeo (Round)
El teorema `R_round_unsafe` demuestra formalmente que la cuantificación por redondeo es decisionalmente insegura:
```lean
theorem R_round_unsafe : ¬ kernelSubset R_round D
```
* **Resultado:** **APROBADO (Contraejemplo Validado)**. El teorema prueba de manera constructiva que los estados $x = -5$ y $y = 0$ se colapsan a la misma representación $R_{\text{round}}(-5) = R_{\text{round}}(0) = 0$. Dado que sus acciones óptimas ideales difieren ($D(-5) = \text{NEG} \neq D(0) = \text{POS}$), se viola la condición de seguridad de TAKT, lo que demuestra la inestabilidad de la acción del control digital alrededor de cero.
