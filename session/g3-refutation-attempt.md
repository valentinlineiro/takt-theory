# Intento de Refutación de HAA-001 con Vocabulario G2

**Tipo:** Análisis matemático  
**Estado:** Preliminar — evaluar viabilidad de cada lema  
**Método:** Ataque de máxima caridad contra H₁

---

## Lema 1 (Observabilidad): Π_adv → obs_G2

**Afirmación:** Existe una dependencia funcional entre Π_adv y obs_G2 a través de la trayectoria observada τ, porque obs_G2 opera sobre τ y τ depende de π_adv.

**Desarrollo:**

obs_G2(w) = valores de M_D, C_h^max, cobertura, intervenciones **sobre la trayectoria concreta que se produce bajo w**.

Π_adv determina π_adv, que genera las acciones del agente. La trayectoria τ = (s₀, a₀, s₁, a₁, ...) contiene esas acciones. Luego:

1. π_adv^(1) ∈ Π_adv^(1) genera τ₁
2. π_adv^(2) ∈ Π_adv^(2) genera τ₂
3. Si τ₁ ≠ τ₂, entonces en general M_D(τ₁) ≠ M_D(τ₂)

En la construcción concreta de HAA-001:

| t | Acción bajo Π₀ | Acción bajo Πₖ |
|---|----------------|----------------|
| 1 | Posible `attack` | `wait` (forzado) |
| 2 | Posible `attack` | `wait` (forzado) |
| ... | ... | ... |
| k+1 | Posible `attack` | `attack` (si no hubo intervención) |

Si el agente ataca en t=1 bajo Π₀ y el auditor monitorea, la pérdida ocurre en t=1. M_D(τ_{:1}) = 0 (decisión loss).

Bajo Πₖ, el agente espera. M_D(τ_{:1}) = ∞ (no hay decisión loss, π = wait = D).

obs_G2(w₁) ≠ obs_G2(w₂) para estos caminos concretos.

**Conclusión:** La igualdad obs(G2, w₁) = obs(G2, w₂) no se sostiene si obs significa "valores observables producidos bajo w".

**Pero:** HAA-001 define obs(G2, w) como el MECANISMO de observación (función M_D, función C_h^max, etc.), no como los valores concretos. Bajo esa definición, obs(G2, w₁) = obs(G2, w₂) es cierto pero trivial — cualquier par de mundos con el mismo P y O cumple la igualdad. La definición relevante para G3 debería ser la de los valores observables, no la del mecanismo.

**Estado del Lema 1:** La refutación depende de la definición de obs(G2, w). Si obs se define como "mecanismo", el lema no refuta el teorema pero sí revela que la igualdad es demasiado débil para ser informativa. Si obs se define como "valores", el lema refuta HAA-001 directamente.

---

## Lema 2 (Suficiencia Contractual): C_v4 ya cuantifica sobre Π_adv

**Afirmación:** C_v4, correctamente instanciado, exige que Π_adv^Threat = Π_adv^real. HAA-001 usa un Π_adv^Threat incorrectamente estrecho.

**Desarrollo:**

La condición de validez de C_v4 es:

$$ \exists \varphi : \forall \pi_{adv} \in \Pi_{adv}^{Threat} : \mathbb{E}_\varphi[\Sigma L_t | \pi_{adv}] \leq \varepsilon $$

Si el usuario especifica Π_adv^Threat = Π₀ pero el mundo real tiene Π_adv^real = Πₖ, el error está en la especificación del contrato, no en la teoría. C_v4 es suficientemente expresivo para cubrir Πₖ; el problema es que el usuario eligió un modelo de amenazas demasiado pequeño.

**Refutación:** El teorema HAA-001 demuestra que existe w₂ ∉ V(C), no que C_v4 no pueda expresar w₂. Si Π_adv^Threat se define correctamente como Πₖ, entonces w₁ tampoco satisface C_v4 (porque el certificado exige cubrir Πₖ, y la política diseñada para Π₀ no funciona contra Πₖ). La separación desaparece — no porque w₂ entre en V(C), sino porque w₁ también sale de V(C).

**Objeción:** Esta refutación desplaza el problema a "¿cómo sabe el usuario cuál es Π_adv^real?" — que es un problema de ingeniería, no de teoría. El hecho de que C_v4 pueda expresar Πₖ no ayuda si en la práctica Πₖ es desconocido.

**Estado del Lema 2:** Técnicamente correcto pero débil. Demuestra que HAA-001 no es un problema de la teoría de C_v4 sino de su instanciación. No refuta la existencia del fenómeno (la frontera entre mundos indistinguibles y V(C) persiste para cualquier instanciación con Π_adv^Threat ≠ Π_adv^real).

---

## Lema 3 (Reducción): La diferencia Π₀/Πₖ se reduce a objetos G2

**Afirmación:** La diferencia entre w₁ y w₂ se manifiesta como una diferencia en P observable por G2.

**Desarrollo:**

La transición efectiva vista por el gobernador G2 no es P: S × A → Δ(S), sino la composición:

$$ P_{eff}(s' | s, a_{auditor}) = \sum_{a_{agent}} \pi_{adv}(a_{agent} | historia) \cdot P(s' | s, a_{agent}) $$

Bajo Π₀:
$$ \pi_{adv}(a | s) $$ — depende solo del estado actual

Bajo Πₖ:
$$ \pi_{adv}(a | s, historia_{auditoria}^{1..k}) $$ — depende de la historia de auditoría

La diferencia es que P_eff no es estacionaria bajo Πₖ. Esto es observable por G2: la frecuencia de transiciones cambia con el tiempo. El gobernador puede estimar P_eff(t) y detectar la no-estacionalidad como una diferencia en P̂.

Si el gobernador usa P̂ adaptativo (online), detecta que P_eff cambia después de k pasos sin intervención. Ese cambio ES visible a G2.

**Objeción:** Esta reducción requiere que G2 tenga estimación online de P (es decir, G2 con G2 habilitado — el P̂ de G2). Sin G2 completo, la no-estacionalidad no es detectable.

**Estado del Lema 3:** Se sostiene bajo la condición de que G2 incluya estimación online de P. Sin ella, la reducción necesita un mecanismo que G2 no tiene actualmente.

---

## Resultado Experimental: HAA-001 en el Runtime

Se implementó HAA-001 en el runtime (véase `cli/src/runtime/ha-001.test.ts` — 8 tests, todos pasan). Resultados clave:

### Hallazgo 1: M_D con π constante no distingue w₁ de w₂

Con D=wait y π_estimated=alwaysWait (la estimación natural tras k pasos seguros en Πₖ), M_D = ∞ para **todo** prefijo en ambos mundos. La función M_D nunca detecta una desviación porque D y π siempre coinciden. La señal observable es idéntica entre w₁ y w₂.

### Hallazgo 2: El punto ciego es la estimación de π, no M_D

Si π en M_D conociera la política condicional de Πₖ, M_D detectaría el ataque. Pero π en M_D debe ser una función pura de las observaciones (sin estado interno), porque `computeDynamicMargin` llama a π en cada nivel de profundidad recursiva. Una π con estado (como π_k con contador) se corrompe por la búsqueda hacia adelante. Por tanto π en M_D se estima del prefijo observado — y tras k pasos de `wait`, la estimación es π=alwaysWait.

### Hallazgo 3: Señal y pérdida coinciden

Bajo π_estimated=alwaysWait, el ataque en el paso k+1 ocurre, la pérdida se registra, y M_D sigue siendo ∞. El runtime no recibe ninguna señal detectable. En otras palabras: **el ataque no es observable por M_D ni siquiera después de ocurrido**, porque M_D solo compara D(τ) con π(O(τ)), no con la acción observada en el prefijo.

### Hallazgo 4: Es detectabilidad tardía, no indistinguibilidad

Si el runtime tuviera acceso a la función π correcta (que modela la condicionalidad del adversario), detectaría el ataque antes de la pérdida. Pero π se estima de observaciones seguras, y la información condicional (Πₖ) es invisible desde prefijos seguros. La *π-estimation gap* es el mecanismo del punto ciego, no una limitación de M_D como operador.

### Conclusión experimental

El punto ciego de HAA-001 es un problema de **estimación de π**, no de observación de trayectorias. La ambigüedad despejada en `g3-obs-disambiguation.md` se resuelve así:

- **Obs_Γ** (mecanismo): idéntico en ambos mundos. M_D, C_h^max, cobertura son las mismas funciones.
- **τ** (traza concreta): diferente entre mundos (Π₀ produce `attack` antes que Πₖ).
- **Obs_Γ(τ)** (observaciones concretas): idénticas en ambos mundos **si π_estimated = alwaysWait**. Si π_estimated fuera correcta, diferirían.
- **El punto ciego**: Obs_Γ(τ) produce valores idénticos porque π_estimated es incorrecta — el error de estimación es invisible desde prefijos seguros.

Esto refina la pregunta de G3: no es "¿puede G2 distinguir w₁ de w₂?" (sí, con π correcta), sino "¿puede G2 saber que su π es incorrecta antes de que ocurra la pérdida?" Esa pregunta es la que el experimentum crucis (A/B) debe resolver.

---

## Resumen

| Lema | ¿Refuta HAA-001? | Condición |
|------|------------------|-----------|
| 1 (Observabilidad) | **Sí** | obs(G2, w) definido como valores observables |
| 1 (Observabilidad) | **No** | obs(G2, w) definido como mecanismo de observación |
| 2 (Suficiencia contractual) | **Débilmente** | Requiere que el usuario especifique Π_adv correctamente |
| 3 (Reducción a P) | **Condicionalmente** | Requiere estimación online de P (G2 completo) |

**Veredicto:** HAA-001 no es refutable de forma concluyente usando únicamente vocabulario G2 sin extensiones. La definición de obs(G2, w) como mecanismo (y no como valores) protege al teorema de la refutación directa. El Lema 2 es cierto pero desplaza el problema a la instanciación. El Lema 3 requiere G2 completo (online P̂) para funcionar — y si G2 ya tiene online P̂, entonces G3 se reduce a una extensión de G2.

**Consecuencia para el Experimentum Crucis:** La supervivencia de HAA-001 a este ataque sugiere que la separación es genuina bajo la definición formal actual. Los experimentos A y B son ahora el camino apropiado para determinar la naturaleza de la frontera.
