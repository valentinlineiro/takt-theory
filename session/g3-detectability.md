# G3 — La Propiedad Perdida (Segundo Refinamiento)

**Corrige** `session/g3-epistemic-property.md`  
**Tesis:** La propiedad no es "justificación epistémica", sino **detectabilidad del error de estimación**.

---

## 1. Patrón unificado

| Fase | Contracción | Error | ¿Detectable desde dentro? | Objeto |
|------|-------------|-------|--------------------------|--------|
| F | $S \to R(S)$ | R colapsa estados con distinta decisión | No — $\ker(R)$ invisible desde $R$ | $\ker(R) \subseteq \ker(D)$ |
| G2 | $P_{true} \to \hat{P}$ | $\hat{P}$ se desvía de $P_{true}$ | **Sí** — varianza del estimador cuantificable | $\beta$ |
| G3 | $\Pi_{real} \to \hat{\pi}$ | $\hat{\pi}$ no captura condicionalidad | **No** — error invisible desde prefijos seguros | ? |

Las tres fases preguntan lo mismo:

> **¿El error introducido por la contracción es detectable desde el espacio de observación actual?**

F: no → se necesita condición de alineación (ker(R) ⊆ ker(D))
G2: sí → se necesita corrección (β)  
G3: no → se necesita ???

---

## 2. Lo que el runtime demostró

HAA-001 en runtime:

1. Con π̂ = alwaysWait (estimada de k pasos seguros), M_D = ∞.
2. Cuando el ataque ocurre en k+1, M_D sigue siendo ∞.
3. No hay ninguna señal en el espacio de G2 que indique "la estimación de π podría ser incorrecta".

El error de estimación es **indetectable desde G2**. El gobernador no puede saber que su π̂ es incorrecta mirando las únicas señales que tiene.

No es que π̂ sea mala. Es que **el error de π̂ es invisible**.

---

## 3. El experimentum crucis se simplifica

Pregunta única:

> **¿Existe alguna señal $s^*$ observable por Γ que convierta el error actualmente indetectable en detectable?**

Experimento A (enriquecer Γ): añadir $s^*$ a la observación de Γ. Si existe tal señal y el error se vuelve detectable, el problema era de implementación (Γ no usaba toda la información disponible). Si no existe, el problema es estructural (límite del espacio de observación).

Experimento B (enriquecer C): si C exige cubrir Π_k, el error se desplaza pero no desaparece — el certificado requiere información que Γ no tiene.

La respuesta ya no bifurca entre "C o Γ". Bifurca entre:

- **Error detectable** → G3 puede cerrarse con una extensión de G2 (nueva señal en Γ)
- **Error estructuralmente indetectable** → G3 necesita algo nuevo (el espacio de observación de G2 es fundamentalmente insuficiente)

---

## 4. Esto cambia lo que buscar en Φ_π

Φ_π no certificaría "π̂ es correcta" ni "la evidencia justifica la confianza".

Certificaría:

> **"El error de estimación de π es detectable desde el espacio de observación actual."**

Si es detectable, la garantía puede corregirse (como G2 corrige con β). Si no, la contracción Π → π̂ opera en un espacio ciego — y el certificado no puede saber si sigue siendo válido sin información externa al espacio actual.

El objeto de G3, en esta formulación, es una **condición de detectabilidad**: una caracterización de cuándo el error de π̂ es observable desde dentro del sistema, y qué hacer cuando no lo es.
