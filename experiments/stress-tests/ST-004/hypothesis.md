# ST-004: Hidden Kernel Attack — Hypothesis

## Contexto y Motivación

En la práctica, evaluar la seguridad decisional global de una representación ($\ker(R) \subseteq \ker(D)$) sobre todo el espacio de estados $S$ puede ser computacionalmente inviable o imposible (por ejemplo, en espacios continuos o extremadamente grandes). Por ello, los ingenieros recurren a **observables empíricos** $\Omega(R)$ evaluados sobre un conjunto finito de test $T \subset S$.

Esta limitación abre la puerta a un ataque adversarial a la capacidad de detección de TAKT: el **Hidden Kernel Attack** (Ataque de Kernel Oculto).

## Hipótesis

1. **Incompletitud del Sensor Empírico:** Si la seguridad decisional de una representación se evalúa únicamente a través de observables prácticos sobre un subconjunto de estados $T$, es posible construir una representación $R_2$ que parezca perfectamente segura sobre $T$ ($\hat{\varepsilon}_D(R_2) = 0$), pero que oculte una violación grave de la seguridad decisional global ($\varepsilon_D(R_2) > 0$).
2. **Existencia de Particiones Ocultas:** Dos representaciones $R_1$ (segura globalmente) y $R_2$ (insegura globalmente) pueden producir exactamente el mismo perfil de observables en el conjunto de test:
   \[
   \Omega(R_1) = \Omega(R_2)
   \]
   haciéndolas indistinguibles para los sensores empíricos de TAKT.
3. **Necesidad de Invariantes de Cobertura:** Este ataque demostrará que TAKT necesita un mecanismo de garantía o invariante de cobertura (generalización del kernel) para asegurar que la seguridad empírica se traduzca en seguridad global.

## Criterio de Parada de ST-004

Este stress-test se considerará terminado y exitoso cuando:
1. Se modele un espacio de estados donde un conjunto de test $T$ deje estados sin observar.
2. Se definan dos representaciones $R_1$ y $R_2$ con idénticos observables en $T$, pero donde solo una de ellas sea segura globalmente.
3. Se demuestre formalmente en Lean 4 la seguridad empírica coincidente de ambas y la asimetría en su seguridad global.
4. El resultado quede clasificado formalmente bajo el framework de etiquetas.
