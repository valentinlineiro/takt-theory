# ST-005: Multi-agent / Distributed Decision — Results

## Resultados de la Verificación Formal en Lean 4

El modelo y las pruebas de acoplamiento decisional multi-agente han sido completamente formalizados y probados en **Lean 4** dentro del módulo [DistributedDecision.lean](../../../takt-formal/TaktFormal/DistributedDecision.lean). El proyecto compiló exitosamente sin advertencias ni errores.

Los resultados son los siguientes:

### 1. Seguridad bajo la Política Nominal de $A$
El teorema `R_B_safe_nom` demuestra formalmente que la representación local de $B$ es decisionalmente segura cuando $A$ ejecuta su política nominal:
```lean
theorem R_B_safe_nom : kernelSubset R_B D_B_nom
```
* **Resultado:** **APROBADO (Teorema Probado)**. Bajo $\pi_A^{\text{nom}}$, las decisiones efectivas requeridas para la clase del kernel de $R_B$ $\{s_1, s_2\}$ son idénticas ($D_B^{\text{nom}}(s_1) = D_B^{\text{nom}}(s_2) = 0$), garantizando la relación de kernels $\ker(R_B) \subseteq \ker(D_B^{\text{nom}})$.

### 2. Violación de Seguridad bajo el Desplazamiento de Política de $A$
El teorema `R_B_unsafe_shift` demuestra formalmente que la misma representación de $B$ se vuelve insegura cuando la política de $A$ se desplaza:
```lean
theorem R_B_unsafe_shift : ¬ kernelSubset R_B D_B_shift
```
* **Resultado:** **APROBADO (Contraejemplo Validado)**. Bajo $\pi_A^{\text{shift}}$, la decisión efectiva de $B$ para la clase del kernel $\{s_1, s_2\}$ diverge: $D_B^{\text{shift}}(s_1) = 0 \neq 1 = D_B^{\text{shift}}(s_2)$. Esto viola la relación de kernels, demostrando que la seguridad local de $B$ ha quedado rota de forma silenciosa por una perturbación ajena.
