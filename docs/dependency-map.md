# Dependency Map — Structural Sufficiency Theory

> Dependencies between axioms, definitions, theorems, and consequences
> in ST-015 (Structural Sufficiency Theorem) and its supporting framework.

---

## Nivel 0 — Axiomas

**A0 (Contract Coherence).**

$$
\ker(D) = \bigcap_{c \in C_D} K_c
$$

La decisión $D$ y su contrato $C_D$ describen la misma frontera desde
lenguajes distintos. Sin este axioma existen dos nociones independientes
de suficiencia y T1–T2–T5 no pueden unificarlas.

**A1 (Arbitrary meets).**

$\mathcal{T}$ admite meets sobre familias arbitrarias (no solo finitas)
de estructuras. Necesario para que $\sigma_D = \bigsqcap_{c \in C_D}
\sigma_c$ esté definido en el caso general. Irrelevante para T1–T5
porque el retículo de equivalencias tiene meets (intersección) para
cualquier cardinal.

---

## Nivel 1 — Definiciones

| Símbolo | Definición | Depende de |
|---------|-----------|------------|
| $\mathcal{C}$ | Espacio de capacidades | — |
| $K_c$ | Equivalencia inducida por $c$ (model.md §2.1) | $\mathcal{C}$ |
| $C_R$ | $\{ c \in \mathcal{C} : \ker(R) \subseteq K_c \}$ (model.md §2.2) | $K_c$ |
| $C_D$ | Capacidades requeridas por $D$ (model.md §2.3) | $\mathcal{C}$ |
| $G(D,R)$ | $C_D - C_R$ (model.md §2.3) | $C_D, C_R$ |
| $K_D$ | $\bigcap_{c \in C_D} K_c$ (model.md §3.1) | $K_c, C_D$ |
| $R_1 \sqsubseteq R_2$ | $\ker(R_2) \subseteq \ker(R_1)$ (model.md §1.4) | $\ker$ |
| $\mathcal{R}_{sufficient}(D)$ | $\{ R : \ker(R) \subseteq \ker(D) \}$ (model.md §1.6) | $\ker$, $D$ |
| $\mathcal{G}_K(R)$ | $\{ c \in C_D : \ker(R) \not\subseteq K_c \}$ (hypothesis.md) | $C_D, K_c, \ker(R)$ |

Ninguna definición depende de teoremas. Solo dependen de otras
definiciones o de axiomas sobre la existencia de los objetos.

---

## Nivel 2 — Teoremas

### Dependencias

| Teorema | Enunciado | Definiciones usadas | A0 | A1 |
|---------|-----------|---------------------|:--:|:--:|
| T1 | Caracterización: $R \in \mathcal{R}_{sufficient}(D) \iff \ker(R) \subseteq K_D$ | $\mathcal{R}_{sufficient}$, $\ker$, $K_D$ | ✓ | ✗ |
| T2 | Mínimo único: $\mathcal{R}_{sufficient}(D)$ es upset con mínimo $R_{min}$ | $\sqsubseteq$, $\mathcal{R}_{sufficient}$, $K_D$ | ✓ | ✗ |
| T3 | Correspondencia: $G(D,R) = \{ c \in C_D : \ker(R) \not\subseteq K_c \}$ | $G(D,R)$, $C_D$, $C_R$, $K_c$ | ✗ | ✗ |
| T4 | Monotonicidad: $R_1 \sqsubseteq R_2 \implies G(D,R_1) \subseteq G(D,R_2)$ | $\sqsubseteq$, $G(D,R)$, $K_c$ | ✗ | ✗ |
| T5 | Punto fijo: $\ker(R) = K_D \implies R$ mínima suficiente | $K_D$, $\mathcal{R}_{sufficient}$, $\sqsubseteq$ | ✓ | ✗ |
| T6 | Generalización: $\sigma_R \preceq \sigma_D$ para estructuras binarias | $\sigma_R$, $\sigma_c$, $\sigma_D$, $\preceq$ | ✓ | ✓ |

### Justificación

**T1 → A0.** La demostración ($\Rightarrow$) parte de
$\ker(R) \subseteq \ker(D)$ y concluye $\ker(R) \subseteq K_D$.
Requiere $\ker(D) = K_D$, que es exactamente A0. Sin A0, la
caracterización se reduce a $C_D \subseteq C_R \iff \ker(R) \subseteq K_D$,
válida pero desacoplada de $\mathcal{R}_{sufficient}(D)$.

**T2 → A0.** T2 usa la definición de $\mathcal{R}_{sufficient}(D)$ y la
existencia de $R_{min}$ vía $K_D$. Sin A0, $R_{min}$ existe como
representación cociente $S/K_D$, pero no es mínima respecto a
$\mathcal{R}_{sufficient}(D)$ porque la definición de este conjunto
sigue atada a $\ker(D)$, no a $K_D$. Sin A0, $R_{min}$ es mínimo del
conjunto $\{R : C_D \subseteq C_R\}$, no de $\mathcal{R}_{sufficient}(D)$.

**T3 → independiente.** Solo usa las definiciones de $G(D,R)$, $C_D$,
$C_R$ y $K_c$. No referencia $\ker(D)$ ni $K_D$. Sobrevive intacto
sin A0 ni A1.

**T4 → independiente.** Solo usa $\sqsubseteq$, $G(D,R)$ y $K_c$.
Ídem.

**T5 → A0.** Usa T1 para establecer que $\ker(R) = K_D$ implica
suficiencia. Sin A0, la suficiencia no está garantizada. Además, el
argumento de que "ninguna representación más gruesa es suficiente"
depende de que la suficiencia se defina respecto a $K_D$, que sin A0
no equivale a $\ker(D)$.

**T6 → A0 + A1.** Generaliza T1. A0 se generaliza a
$\sigma_D = \bigsqcap \sigma_c$. A1 es necesario para que ese meet
exista sobre familias arbitrarias. Sin A0, no hay conexión entre
$\sigma_D$ y la decisión $D$. Sin A1, $\sigma_D$ puede no estar
definido.

---

## Nivel 3 — Consecuencias

| Consecuencia | Depende de | Enunciado |
|-------------|------------|-----------|
| C1 | T3 | El EVSI planner (CARD-358) tiene criterio de parada: $\mathcal{G}_K(R) = \emptyset$ |
| C2 | T3 | El gap del runtime $G(D,R)$ es un subproducto directo de la definición de suficiencia, no un heurístico |
| C3 | T1 + A0 | ContractVerifier (CARD-355) y condición de seguridad teórica son equivalentes |
| C4 | T5 | Planificación de enriquecimiento = refinamiento de núcleos: cada $E_i$ transforma $\ker(R)$ en subconjunto propio hacia $K_D$ |
| C5 | T6 | Extensiones a pseudométricas y preórdenes requieren verificar A1 para la estructura concreta |

---

## Matriz de independencia

Para cada axioma, qué ocurre si se elimina:

| Resultado | Sin A0 | Sin A1 |
|-----------|:------:|:------:|
| T1 | Falla (el teorema deja de conectar con $\mathcal{R}_{sufficient}(D)$) | Sobrevive (intersección de equivalencias existe siempre) |
| T2 | Falla (mínimo se define respecto a $C_D \subseteq C_R$, no a $\mathcal{R}_{sufficient}(D)$) | Sobrevive |
| T3 | Sobrevive | Sobrevive |
| T4 | Sobrevive | Sobrevive |
| T5 | Falla (usa T1) | Sobrevive |
| T6 | Sobrevive solo como teorema sobre $\sigma_R \preceq \bigsqcap \sigma_c$ sin conexión a $D$ | Falla ($\sigma_D$ no definido) |
| C1 | Sobrevive | Sobrevive |
| C2 | Sobrevive | Sobrevive |
| C3 | Falla | Sobrevive |
| C4 | Falla | Sobrevive |
| C5 | — | Aplica |

La teoría tiene dos componentes casi ortogonales:

- **Núcleo robusto** (T3, T4, C1, C2): no depende de ningún axioma.
  Solo definiciones. Describe la estructura del espacio de capacidades
  independientemente de la decisión concreta.
- **Puente con la decisión** (T1, T2, T5, C3, C4): depende de A0.
  Conecta la estructura de capacidades con la condición de seguridad
  del Canonical Core.
- **Generalización** (T6, C5): depende de A0 + A1. Extiende el
  resultado a otras estructuras.

---

## Implicaciones

1. **Un contrato mal construido** (A0 falso) no rompe el modelo de
   capacidades (T3, T4). Solo rompe la conexión entre el contrato y
   la decisión real. La verificación sigue siendo correcta — verifica
   lo que el contrato dice, no lo que la decisión necesita.

2. **Una estructura sin meets arbitrarios** (A1 falso para ese tipo)
   no rompe la teoría sobre equivalencias. Solo impide la
   generalización a esa estructura concreta.

3. **Lean no necesita importar todos los axiomas en cada teorema.**
   T3 y T4 pueden formalizarse sin A0 ni A1, reduciendo la carga de
   verificación. T1 necesita explícitamente A0 como hipótesis.

4. **El mapa permite extensiones seguras**: si alguien añade una
   nueva consecuencia, puede determinar inmediatamente qué axiomas
   debe verificar.
