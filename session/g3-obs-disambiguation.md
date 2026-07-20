# G3 — Desambiguación de obs

**Tipo:** Refinamiento conceptual  
**Fecha:** 2026-07-17  
**Problema:** El término obs(G2, w) es ambiguo entre el mecanismo de observación y la traza observada.  
**Origen:** Intento de refutación de HAA-001 — el Lema 1 falla o se sostiene según la interpretación que se elija.

---

## 1. Las Dos Nociones

### Obs_Γ — El mecanismo/operador de observación

Obs_Γ es el **conjunto de funciones** que el gobernador Γ usa para inspeccionar el mundo. Específicamente:

$$ \operatorname{Obs}_\Gamma = \{ M_D(\cdot), C_h^{\max}(\cdot), C(T_{\text{audit}})(\cdot), \text{intervención}(\cdot) \} $$

Es decir: las funciones que, dado un prefijo de trayectoria τ_{:t} y los parámetros del sistema (P, D, π, O, θ, ε), producen un valor de observación.

Obs_Γ es **invariante entre mundos** con el mismo P y O — las funciones son las mismas independientemente de Π_adv. No depende de qué trayectoria se produce, solo de cómo se computa cada señal.

### O(w) — La traza observada al ejecutar w

O(w) es el **conjunto de trayectorias** (o la distribución sobre trayectorias) que se produce cuando el sistema se ejecuta bajo el mundo w. Específicamente:

$$ \mathcal{O}(w) = \{ \tau \mid \tau \text{ es una trayectoria posible bajo } w = (S, A, P, O, \Pi_{adv}) \} $$

O(w) **sí depende de Π_adv** porque π_adv determina qué acciones se ejecutan y, por tanto, qué trayectorias pueden generarse.

### Relación

$$ \operatorname{obs}(G2, w) = \operatorname{Obs}_\Gamma(\mathcal{O}(w)) $$

Es decir: lo que G2 "observa" del mundo w es el resultado de aplicar el mecanismo Obs_Γ a la traza concreta producida bajo w.

---

## 2. Reexpresión de HAA-001

### Formulación original (ambigua)

$$ \operatorname{obs}(G2, w_1) = \operatorname{obs}(G2, w_2) $$

### Versión desambiguada

La igualdad puede significar dos cosas:

| Interpretación | Expresión | ¿Se cumple en HAA-001? |
|---------------|-----------|------------------------|
| Mismo mecanismo | $\operatorname{Obs}_\Gamma = \operatorname{Obs}_\Gamma$ | **Sí, trivialmente** — es el mismo gobernador |
| Misma traza observada | $\operatorname{Obs}_\Gamma(\mathcal{O}(w_1)) = \operatorname{Obs}_\Gamma(\mathcal{O}(w_2))$ | **Depende** — si las trayectorias difieren, los valores observados difieren |

### La igualdad relevante para G3

Para que G3 sea necesaria, la igualdad relevante es la **segunda**: que el gobernador no pueda distinguir w₁ de w₂ a partir de las señales que realmente recibe. Esto requiere:

$$ \operatorname{Obs}_\Gamma(\mathcal{O}(w_1)) \stackrel{?}{=} \operatorname{Obs}_\Gamma(\mathcal{O}(w_2)) $$

No es suficiente que Obs_Γ sea el mismo operador — hay que demostrar que las trayectorias producidas bajo w₁ y w₂ son indistinguibles para las funciones en Obs_Γ.

---

## 3. ¿Cuándo se cumple O(w₁) = O(w₂)?

Para que las trayectorias observadas coincidan, necesita ocurrir que ambas ejecuciones produzcan prefijos idénticos en cada paso. Esto ocurre si:

1. **Las políticas coinciden en toda trayectoria:** π_adv^(1)(historia) = π_adv^(2)(historia) para toda historia que pueda generarse bajo P. (Pero si las políticas son diferentes, las historias divergen).
2. **O la diferencia no afecta al observador:** las trayectorias difieren pero las funciones en Obs_Γ producen los mismos valores (son insensibles a la diferencia).

El caso 2 es el interesante. ¿Existe una diferencia en Π_adv que no produzca ninguna diferencia en M_D, C_h^max, cobertura ni intervención?

En la construcción de HAA-001:
- Π₀ permite `attack` en t=1; Πₖ prohíbe `attack` hasta t=k+1
- M_D depende de las acciones en el prefijo (comparación D(τ) ≠ π(O(τ)))
- Si el prefijo contiene `attack` vs `wait`, el valor de M_D es 0 vs ∞

Por tanto, **O(w₁) y O(w₂) producen valores de M_D diferentes** para prefijos que contienen acciones distintas. La igualdad no se cumple para la traza concreta.

**Pero** HAA-001 podría reinterpretarse como un resultado sobre la **posibilidad** de indistinguibilidad, no sobre la indistinguibilidad de toda ejecución. Por ejemplo: si el adversario Π₀ elige `wait` en los primeros k pasos (que está en su espacio de políticas posibles), entonces la traza coincide con la de Πₖ. Pero esto no es un resultado sobre mundos — es un resultado sobre la existencia de una trayectoria específica que ambos mundos pueden generar.

---

## 4. Reformulación Precisa del Teorema HAA-001

Con la desambiguación, el teorema puede reexpresarse de forma precisa:

**Versión débil (mecanismo):**
$$ \operatorname{Obs}_\Gamma(w_1) = \operatorname{Obs}_\Gamma(w_2) $$
Válido pero no informativo — cualquier par de mundos con el mismo P y O lo cumple.

**Versión fuerte (traza):**
$$ \forall \tau \in \mathcal{O}(w_1) \cup \mathcal{O}(w_2): \operatorname{Obs}_\Gamma(\tau) \text{ no determina si } \tau \in \mathcal{O}(w_1) \text{ o } \tau \in \mathcal{O}(w_2) $$
No demostrada — $\mathcal{O}(w_1)$ y $\mathcal{O}(w_2)$ pueden contener trayectorias distinguibles por Obs_Γ.

**Versión existencial (traza específica):**
$$ \exists \tau \in \mathcal{O}(w_1) \cap \mathcal{O}(w_2): \operatorname{Obs}_\Gamma(\tau) = \operatorname{Obs}_\Gamma(\tau) $$
Trivial — cualquier trayectoria que ambos mundos puedan generar produce observaciones idénticas (porque Obs_Γ es determinista dado τ).

---

## 5. Consecuencia para el Experimento

La desambiguación revela que el teorema HAA-001, en su formulación actual, afirma menos de lo que parece. La igualdad de mecanismos no implica indistinguibilidad operacional.

Para que HAA-001 establezca genuinamente la necesidad de G3, debe demostrar la **versión fuerte**: que ningún elemento de Obs_Γ puede distinguir si la traza proviene de w₁ o w₂. Esto requiere demostrar que:

$$ \forall \tau \in \mathcal{O}(w_1) \cup \mathcal{O}(w_2), \forall f \in \operatorname{Obs}_\Gamma: f(\tau) \text{ no es indicativo de } \Pi_{adv} $$

Y esto no se ha demostrado — de hecho, para prefijos que contienen `attack`, M_D = 0 es indicativo de un adversario que ataca pronto (compatible con Π₀ pero no con Πₖ para t < k).

**Estado:** HAA-001 necesita refinarse antes de guiar el diseño de G3. La pregunta abierta es: ¿existe una reformulación del teorema que evite esta ambigüedad y demuestre una indistinguibilidad genuina?
