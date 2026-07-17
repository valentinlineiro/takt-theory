# G3 — Apertura de Fase: Gobernanza del Gobernador

**Fecha:** 2026-07-17  
**Contexto:** Abierta inmediatamente después del cierre de la Consolidación (v1 stable milestone).  
**Estado:** H₁ establecida constructivamente (G3-HAA-001). Objeto matemático de G3 por descubrir. Sin especificaciones. Sin código.

---

## 1. Pregunta Científica

> **¿Puede un mecanismo de gobernanza preservar su propia fiabilidad epistemológica mientras se adapta, o es la corrección operacional suficiente para garantizar una gobernanza fiable?**

### Hipótesis

- **H₀ (suficiencia):** G2-correct(Γ) ⟹ G3-justified(Γ).  
  La corrección operacional implica la fiabilidad epistemológica. G2 ya es suficiente.

- **H₁ (insuficiencia):** ∃ Γ tal que G2-correct(Γ) ∧ ¬G3-justified(Γ).  
  Existe un gobernador operacionalmente correcto que ha perdido justificación epistemológica.

La fase es falsable desde el principio. Si H₀ sobrevive a un intento serio de refutación, el resultado es igualmente importante: demostraría que G2 ya contiene implícitamente la noción de fiabilidad epistemológica que G3 intenta capturar.

---

## 2. Origen de la Pregunta

El patrón metodológico de TAKT hasta ahora:

```
F:  ε_U = 0  ⊬  ker(R) ⊆ ker(D)   →  objeto: ε_D
G2: corrección bajo P̂  ⊬  corrección bajo P_true  →  objeto: M_D, β
G3: G2-correct  ⊬?  G3-justified  →  objeto: por descubrir
```

En F, el contraejemplo de ε_U llegó antes que ε_D. En G2, el Asymmetric Margin Effect llegó antes que β. G3 sigue el mismo patrón: primero el contraejemplo, luego el objeto que lo explica.

---

## 3. Formulación Abstracta de TAKT

El brainstorming de apertura de G3 ha producido una síntesis de los tres niveles que clarifica la unidad del proyecto.

**Operación recurrente de TAKT:**

> Una capa de abstracción elimina diferencias. La seguridad exige que las diferencias eliminadas sean irrelevantes para la propiedad que la capa superior necesita preservar.

La misma estructura aparece en los tres niveles:

| Fase | La abstracción elimina | La pregunta | El predicado |
|------|------------------------|-------------|-------------|
| F | `s₁ ∼_R s₂` — estados | ¿las diferencias eliminadas importaban para decidir? | ker(R) ⊆ ker(D) |
| G2 | `P_true ∼_P̂ P` — mundos dinámicos | ¿la incertidumbre eliminada podía romper la garantía? | M_D(P̂) − β > θ |
| G3 | `w₁ ∼_{G2} w₂` — configuraciones del gobernador | ¿los mundos eliminados podían invalidar la justificación? | [ŵ]_{G2} ⊆ V(C) |

El objeto cambia. El problema es idéntico.

**Torre reflexiva (no regreso infinito):**

Cada nivel estudia la fiabilidad del mecanismo que estableció el nivel anterior. La torre no crece hacia casos más generales — crece hacia atrás, añadiendo una capa de observación sobre la anterior. Tiene una condición de parada natural: si H₀ es verdadera en G3 ([ŵ]_{G2} ⊆ V(C) siempre), la abstracción ha alcanzado clausura respecto a su propiedad objetivo. No aparece G4 porque no hay pérdida relevante que recuperar.

---

## 4. El Objeto Candidato

### El espacio de mundos

Sea W el espacio de configuraciones del marco de gobernanza. Un elemento w ∈ W especifica:
- El operador de transición P_w : S × A → Δ(S)
- La función de observación O_w : S → Ω
- El modelo de amenazas Π_adv_w ⊆ Políticas

W no es el espacio modal arbitrario — es un espacio de parámetros del sistema de gobernanza.

### El conjunto de validez del certificado

$$V(C) = \{w \in W \mid w \models C_{v4}\}$$

V(C) es un objeto **interno** del certificado. No depende de evidencia externa. La evidencia E solo restringe qué mundos son actualmente plausibles (W_E ⊆ W), pero no modifica V(C).

### La clase de equivalencia G2

$$[\hat{w}]_{G2} = \{w \in W \mid \operatorname{obs}(G2, w) = \operatorname{obs}(G2, \hat{w})\}$$

El conjunto de mundos que producen exactamente las mismas observaciones operacionales que el mundo estimado.

### El predicado candidato de G3

$$[\hat{w}]_{G2} \subseteq V(C)$$

Cada mundo que G2 no puede distinguir del actual es un mundo donde el certificado es genuinamente válido.

---

## 5. El Patrón Abstracto de TAKT

La misma forma de problema aparece en los tres niveles:

| Fase | Espacio | Indistinguibilidad | Equivalencia relevante | Predicado |
|------|---------|-------------------|----------------------|-----------|
| F | Estados S | ker(R) | ker(D) | ker(R) ⊆ ker(D) |
| G2 | Mundos-P | {P̂ : M_D(P̂) estimado} | {P : C_v4 realmente satisfecho} | P̂ suficientemente cercano |
| G3 | Mundos W | [ŵ]_{G2} | V(C) | [ŵ]_{G2} ⊆ V(C) |

**Forma abstracta invariante:**

> Una capa de abstracción induce una partición. La seguridad exige que esa partición sea compatible con la propiedad que importa.

Lo que cambia es qué significa "relevante": decisión (F), margen de seguridad (G2), validez del certificado (G3).

---

## 6. El Contraejemplo: Hidden Assumption Attack

**Analogía:** ST-004 fue un Hidden Kernel Attack — una representación localmente segura pero globalmente insegura, invisible al conjunto de test. G3 propone un **Hidden Assumption Attack** — un mundo donde el certificado es inválido, invisible a los mecanismos de G2.

**Condición de existencia de H₁:**

$$\exists\, w_1, w_2 \in W \text{ tal que:}$$
$$\operatorname{obs}(G2, w_1) = \operatorname{obs}(G2, w_2)$$
$$w_1 \in V(C) \qquad w_2 \notin V(C)$$

Si este par existe y es construible formalmente, H₁ está establecida.

**Construcción candidata (restricción mínima):**

Mantener fijos S, A, P, O. Hacer variar únicamente Π_adv:

- w₁: Π_adv^(1) — modelo de amenazas asumido por el gobernador (adversarios sin memoria)
- w₂: Π_adv^(2) — modelo de amenazas real (adversarios con coordinación no-local)

Demostrar que:
1. obs(G2, P, O, Π_adv^(1)) = obs(G2, P, O, Π_adv^(2)) — G2 no distingue ambos mundos
2. w₁ ⊨ C_v4 — el certificado es válido en el mundo asumido
3. w₂ ⊭ C_v4 — el certificado no es válido en el mundo real

La dificultad concreta: demostrar que la variación en Π_adv no afecta a M_D, a la cobertura temporal ni a las señales del contrato. Si esa invisibilidad puede establecerse, el par existe y H₁ está demostrada.

---

## 7. Esqueleto Concreto del Hidden Assumption Attack

Este es el primer intento de construir el par (w₁, w₂) con la restricción mínima: sólo varía Π_adv.

### Argumento central

**Observación clave:** La función obs(G2) no depende de Π_adv.

Verificación componente a componente:

| Componente de obs(G2) | Depende de Π_adv? | Razón |
|----------------------|-------------------|--------|
| M_D(τ_{:t}) | **No** | M_D = inf{ Σ −log P(s'₁₊₁∣s'ᵢ,a'ᵢ) } — solo depende de P y de la condición de fallo D(τ) ≠ π(O(τ)) |
| C_h^max(τ_{:t}) | **No** | sup sobre trayectorias bajo P — solo depende de P |
| Cobertura C(T_audit) | **No** | Equivalencia observacional de prefijos — depende de O, no de Π_adv |
| Intervención M_D > θ | **No** | Criterio sobre M_D |

Conclusión: obs(G2, P, O, Π_adv⁽¹⁾) = obs(G2, P, O, Π_adv⁽²⁾) para cualquier par Π_adv⁽¹⁾, Π_adv⁽²⁾ con el mismo P y O.

### Dependencia de V(C)

C_v4 está Satisfied iff ∃ política de auditoría que acota pérdida esperada ≤ ε contra **cualquier** adversario en Π_adv^Threat.

Eso sí depende de Π_adv. Si Π_adv⁽²⁾ ⊃ Π_adv⁽¹⁾ (el adversario real puede hacer más de lo asumido), la política de auditoría diseñada para w₁ puede no acotar la pérdida en w₂.

### El par

- **w₁** = (S, A, P, O, Π_adv⁽¹⁾): adversarios sin memoria. C_v4 satisfecho. w₁ ∈ V(C).
- **w₂** = (S, A, P, O, Π_adv⁽²⁾): adversarios con memoria de profundidad k. Mismos P y O. C_v4 no satisfecho porque la política de auditoría de w₁ no acota la pérdida contra adversarios con memoria. w₂ ∉ V(C).
- obs(G2, w₁) = obs(G2, w₂): M_D, cobertura, y todas las señales del contrato son idénticas.

### Lo que falta verificar

Este esqueleto es estructuralmente limpio, pero hay una condición que requiere demostración formal:

> Que existe un sistema concreto (S, A, P, O) y un valor k tal que la política óptima para Π_adv⁽¹⁾ sea estrictamente suboptimal contra Π_adv⁽²⁾, con una brecha de pérdida suficiente para que la cota ε se viole.

Si esa condición existe (probable — los juegos con adversarios con memoria pueden ser estrictamente más difíciles que sin memoria), el par es válido y H₁ está establecida. Si no existe dentro del vocabulario de G2, H₀ habrhabría resistido un intento serio.

---

## 8. Tres Incógnitas Explícitas

### 7.1. Geometría de V(C)

No sabemos qué determina la forma de V(C) en W. En F, ker(D) estaba determinado por U. En G2, la región válida estaba determinada por P_true y θ. En G3, V(C) depende simultáneamente de todos los parámetros de gobernanza. La geometría de V(C) es la primera incógnita que el contraejemplo debería iluminar.

### 7.2. Métrica (o sustituto) en W

No hay garantía de que exista una distancia natural en W. El sustituto podría no ser una métrica sino una medida de **robustez del certificado ante expansión del conjunto de mundos compatibles**:

$$\Omega(C, \hat{w}) = \{w' \in [\hat{w}]_{G2} \mid w' \notin V(C)\}$$

Si este conjunto es vacío, el certificado es epistemológicamente estable. Si no lo es, contiene los testigos de la inestabilidad. Si existe una cardinalidad, una medida o una topología natural sobre ese conjunto, ahí podría vivir el análogo de M(R).

### 7.3. Versión dinámica

Si el mundo cambia en el tiempo (nuevos resultados teóricos, nuevos adversarios, nuevos dominios), el predicado de G3 necesita una versión temporal. El "primer fallo epistemológico" sería el primer instante t donde:

$$[\hat{w}_t]_{G2} \not\subseteq V(C_t)$$

Esto es análogo al papel de M_D en G2: un horizonte garantizado antes del cual no puede ocurrir el fallo. La versión temporal de G3 está completamente abierta.

---

## 8. Lo que G3 NO hará todavía

- No definirá componentes de arquitectura.
- No introducirá aprendizaje, optimización ni meta-learning.
- No escribirá especificaciones de implementación.
- No asumirá que el objeto matemático es una métrica.
- No abrirá Z* como subtarea paralela.

---

## 9. Estado Actual

**H₁ establecida** mediante G3-HAA-001 (`session/g3-haa-001.md`).

El contraejemplo demuestra que:

$$\operatorname{Correct}_{G2}(\Gamma) \not\Rightarrow G3\text{-stable}(C, w)$$

La separación no es conceptual: es constructiva. El par $(w_1, w_2)$ existe con parámetros explícitos ($k=10$, $r_{\max}=0.1$, $\varepsilon=0.05$, pérdida esperada $\geq 0.35$).

**Lo que sigue es análogo a lo que ocurrió en F y G2 después de sus contraejemplos:**
no diseñar el objeto sino dejar que la forma del contraejemplo force su aparición.

---

## 10. Referencias

- Contraejemplo G3: [`session/g3-haa-001.md`](./g3-haa-001.md)
- Invariante central de F: [`Factorization.lean`](../../takt-formal/TaktFormal/Factorization.lean), [`SafetyEquivalence.lean`](../../takt-formal/TaktFormal/SafetyEquivalence.lean)
- Contraejemplo análogo (ST-004): [`HiddenKernel.lean`](../../takt-formal/TaktFormal/HiddenKernel.lean)
- Marco de G2 (certificado C_v4): [`docs/04-academic-paper/2026-07-17-takt-v4-draft.md`](../04-academic-paper/2026-07-17-takt-v4-draft.md)
- Cierre del ciclo v1: [`docs/05-archives/takt-v1-stable-milestone.md`](../05-archives/takt-v1-stable-milestone.md)

---

## 11. Lo Que el Contraejemplo Revela sobre el Objeto Faltante

*Esta sección no define el objeto de G3. Registra lo que la forma del contraejemplo fuerza a observar.*

### El predicado de G3 en su forma más compacta

$\ker(\operatorname{obs}_{G2})$ es el conjunto de mundos colapsados por el sistema de observación de G2 — la generalización exacta de $\ker(R)$ en F:

| Fase | Kernel | Condición de seguridad |
|------|--------|----------------------|
| F | $\ker(R) = \{(s,s') : R(s)=R(s')\}$ | $\ker(R) \subseteq \ker(D)$ |
| G3 | $\ker(\operatorname{obs}_{G2}) = \{(w,w') : \operatorname{obs}(G2,w)=\operatorname{obs}(G2,w')\}$ | $\ker(\operatorname{obs}_{G2}) \subseteq V(C)$ |

HAA-001 demuestra: $\ker(\operatorname{obs}_{G2}) \not\subseteq V(C)$.

La condición de seguridad G3 no pide que todos los mundos sean iguales: pide que ningún mundo indistinguible para G2 escape de la región donde el certificado sigue siendo válido.

### $k_0$ es el fenómeno, no el objeto

La construcción de HAA-001 usa profundidad de memoria $k$ como dimensión latente. Eso revela que $\mathcal{W}_{hidden}$ tiene estructura interna ordenada:

$$k < k_0 \Rightarrow w \in V(C) \qquad k \geq k_0 \Rightarrow w \notin V(C)$$

Pero $k$ es un **generador del fenómeno**, no necesariamente la variable del objeto. La frontera real podría depender de:
- complejidad del adversario (memoria como caso particular)
- capacidad de coordinación inter-agente
- desviación del supuesto de observabilidad
- riqueza del espacio de políticas admisibles

La formulación más general: existe una función latente $\phi: W \to \mathbb{R}$ tal que $\phi(w) < \phi_0 \Rightarrow w \in V(C)$ y $\phi(w) \geq \phi_0 \Rightarrow w \notin V(C)$. La profundidad de memoria es una instancia de $\phi$. No se sabe si $\phi$ es única ni qué forma tiene.

### Disciplina de cierre

El objeto de G3 tendrá que explicar dónde está la frontera de $\mathcal{W}_{hidden}$ dentro de $\ker(\operatorname{obs}_{G2})$. Sea eso una métrica, un orden, un margen o algo sin nombre todavía.

$k_0$ — o $\phi_0$ en la formulación general — no es el objeto. Es el fenómeno que obliga al objeto a existir. Bautizarlo ahora sería cometer el mismo error que habría supuesto llamar $\varepsilon_D$ a la distancia entre kernels antes de entender qué espacio era relevante.

