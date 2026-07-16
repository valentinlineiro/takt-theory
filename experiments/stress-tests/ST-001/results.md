# ST-001: Decision Boundary Stability — Results

## Resultados de la Verificación Formal en Lean 4

El modelo y las predicciones descritas en este stress-test han sido formalizados y verificados matemáticamente utilizando el asistente de pruebas **Lean 4**. La compilación del proyecto mediante `lake build` se ejecutó con éxito (18/18 tareas completadas con cero errores).

Los resultados de los teoremas clave son los siguientes:

### 1. Preservación del Regret de Utilidad
El teorema `epsilon_zero` demuestra formalmente que para el espacio de estados $S'$ y acciones $A'$, la representación $R$ que colapsa toda la información tiene un regret de exactamente $0$:
```lean
theorem epsilon_zero : epsilon 0
```
* **Resultado:** **CONFIRMADO**. El regret de utilidad máximo es cero, por lo que la representación es "segura" bajo métricas de utilidad tradicionales.

### 2. Ruptura de la Preservación Decisional
El teorema `epsilon_D_false` demuestra formalmente que la condición de preservación decisional de TAKT es falsa para la misma representación $R$ en este escenario:
```lean
theorem epsilon_D_false : ¬ epsilon_D
```
* **Resultado:** **CONFIRMADO**. El operador de desempate determinista $\theta$ selecciona $D(s_0) = b$ y $D(s_1) = a$. Dado que $b \neq a$, colapsar los estados en la representación rompe la preservación decisional.

### 3. Validez de la Equivalencia de Seguridad
El teorema de equivalencia de seguridad de TAKT se mantiene invariante:
```lean
theorem safety_equivalence (R : S -> Z) :
    epsilon_D ds R <-> kernelSubset R (DecisionSystem.D S A Int ds)
```
* **Resultado:** **CONFIRMADO**. La equivalencia tautológica entre la contención de los kernels y la nula pérdida decisional ($\varepsilon_D = 0$) es estructuralmente sólida en la frontera, pero se confirma su desacoplamiento del regret de utilidad ($\varepsilon_U$).
