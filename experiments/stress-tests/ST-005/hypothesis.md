# ST-005: Multi-agent / Distributed Decision — Hypothesis

## Contexto y Motivación

En sistemas distribuidos o multi-agente, las decisiones están acopladas de forma secuencial o recíproca. Un agente $B$ toma decisiones coordinadas que dependen de las acciones del agente $A$. En la práctica, el agente $B$ optimiza su representación local $R_B$ asumiendo que el agente $A$ ejecutará una política nominal específica $\pi_A$.

Este experimento evalúa la robustez composicional distribuida de TAKT ante **desplazamientos de política de otros agentes** (policy shifts).

## Hipótesis

1. **Acoplamiento de Seguridad:** La seguridad decisional local de un agente $B$ no es una propiedad estática y aislada de su propio diseño. Depende intrínsecamente del comportamiento (política) del resto de agentes en el sistema.
2. **Ruptura por Desalineación Dinámica:** Si el agente $A$ cambia su política de una nominal $\pi_A^{\text{nom}}$ a una desplazada $\pi_A^{\text{shift}}$, el agente $B$ puede transicionar de ser decisionalmente seguro ($\ker(R_B) \subseteq \ker(D_B^{\text{nom}})$) a ser decisionalmente inseguro ($\ker(R_B) \not\subseteq \ker(D_B^{\text{shift}}$)), sin que $B$ haya modificado su representación $R_B$ o su regla de decisión.
3. **Inexistencia de Seguridad Local Absoluta:** La seguridad local absoluta en sistemas acoplados es una ilusión; la seguridad solo puede garantizarse mediante contratos dinámicos de alineación global.

## Criterio de Parada de ST-005

Este stress-test se considerará terminado y exitoso cuando:
1. Se modele un sistema de dos agentes ($A$ y $B$) donde la decisión de $B$ esté acoplada a la acción de $A$.
2. Se definan dos políticas para $A$ (nominal y desplazada).
3. Se demuestre formalmente en Lean 4 que la representación de $B$ es segura bajo la política nominal de $A$, pero se vuelve insegura bajo la política desplazada de $A$.
4. El resultado se clasifique formalmente bajo el framework.
