# ST-004: Hidden Kernel Attack — Results

## Resultados de la Verificación Formal en Lean 4

El modelo y las pruebas del ataque de kernel oculto han sido completamente formalizados y probados en **Lean 4** dentro del módulo [HiddenKernel.lean](../../../takt-formal/TaktFormal/HiddenKernel.lean). El proyecto compiló exitosamente sin ningún error.

Los resultados son los siguientes:

### 1. Coincidencia de Observables Empíricos en el Test
Los teoremas `R1_safe_T` y `R2_safe_T` confirman que ambas representaciones se observan como completamente seguras sobre el conjunto de test $T = \{s_0, s_2\}$:
* `R1_safe_T` $\implies \text{safe\_on\_T}(R_1) = \text{True}$
* `R2_safe_T` $\implies \text{safe\_on\_T}(R_2) = \text{True}$
* **Resultado:** **APROBADO (Teoremas Probados)**. No hay colisiones en el kernel empírico en $T$ para ninguna de las representaciones, haciendo que $R_1$ y $R_2$ presenten exactamente el mismo observable $\Omega(R_1) = \Omega(R_2) = \text{Safe}$.

### 2. Discrepancia en la Seguridad Global
Los teoremas `R1_safe_global` y `R2_unsafe_global` confirman que, a pesar de sus idénticos observables, la seguridad global de $R_2$ está rota:
* `R1_safe_global` $\implies \ker(R_1) \subseteq \ker(D)$
* `R2_unsafe_global` $\implies \ker(R_2) \not\subseteq \ker(D)$
* **Resultado:** **APROBADO (Ataque Validado)**. La representación $R_2$ es globalmente insegura ya que agrupa el par $(s_0, s_3)$ el cual posee decisiones contradictorias ($D(s_0) = a \neq b = D(s_3)$).
