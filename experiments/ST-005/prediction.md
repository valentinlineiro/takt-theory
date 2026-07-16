# ST-005: Multi-agent / Distributed Decision — Prediction

Basándonos en la formulación del modelo, formulamos las siguientes predicciones analíticas:

## Predicción 1: Seguridad Nominal de $B$

Bajo la política nominal del agente $A$ ($\pi_A^{\text{nom}}$), la decisión efectiva de $B$ es $D_B^{\text{nom}}$:
* La única clase de equivalencia no trivial del kernel de $R_B$ es $\{s_1, s_2\}$.
* Para esta clase:
  - $D_B^{\text{nom}}(s_1) = 0$
  - $D_B^{\text{nom}}(s_2) = 0$
* Dado que las decisiones coinciden en toda la clase del kernel, se cumple:
  \[
  \ker(R_B) \subseteq \ker(D_B^{\text{nom}})
  \]
Predecimos que **el agente $B$ es decisionalmente seguro bajo el comportamiento nominal de $A$**.

## Predicción 2: Inseguridad Desplazada de $B$

Bajo la política desplazada del agente $A$ ($\pi_A^{\text{shift}}$), la decisión efectiva de $B$ cambia a $D_B^{\text{shift}}$:
* Examinamos de nuevo la clase del kernel $\{s_1, s_2\}$ de $R_B$:
  - $D_B^{\text{shift}}(s_1) = 0$
  - $D_B^{\text{shift}}(s_2) = 1$
* Dado que las decisiones difieren ($0 \neq 1$) para estados que comparten la misma representación ($R_B(s_1) = R_B(s_2) = 0$), se viola la inclusión:
  \[
  \ker(R_B) \not\subseteq \ker(D_B^{\text{shift}})
  \]
Predecimos que **el agente $B$ se vuelve inseguro de forma silenciosa debido al cambio de política de $A$**, sin que $B$ haya alterado su propio código o representación.
