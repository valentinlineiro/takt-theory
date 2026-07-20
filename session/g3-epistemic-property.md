# G3 — La Propiedad Perdida (Refinamiento)

**Fecha:** 2026-07-17  
**Corrige:** `session/g3-lost-property.md` — separa mecanismo de propiedad

---

## 1. Error en el documento anterior

El documento `g3-lost-property.md` confundía mecanismo con propiedad:

| Lo que decía | Lo que debería decir |
|-------------|---------------------|
| "π pertenece a una clase funcional pobre" | Es el **mecanismo** del contraejemplo |
| "Φ_π certifica expresividad de clase" | Sería una condición **suficiente pero no necesaria** |

La misma confusión habría ocurrido en F si hubiéramos dicho "Φ_R certifica que R tiene suficiente granularidad" en lugar de "Φ_R certifica ker(R) ⊆ ker(D)". La granularidad es el mecanismo; la preservación de decisión es la propiedad.

---

## 2. La propiedad de cada fase

| Fase | Mecanismo del contraejemplo | Propiedad preservada |
|------|---------------------------|---------------------|
| F | R no distingue dos estados | **Decisión**: ker(R) ⊆ ker(D) |
| G2 | P̂ no iguala P_true | **Garantía contractual**: M_D(P̂) − β > θ |
| G3 | π̂ no captura condicionalidad de Π_real | **Justificación epistemológica**: ? |

Cada fase toma la propiedad de la anterior como dada y pregunta por su fiabilidad:

F: "dada R, ¿la decisión D es correcta?"
G2: "dada la decisión D, ¿la garantía C_v4 sigue siendo válida bajo incertidumbre en P?"
G3: "dada la garantía C_v4, ¿hay evidencia suficiente para creer que sigue siendo válida?"

G3 es epistémica: no pregunta por la validez de C_v4, sino por la **justificación para afirmar que C_v4 es válido**.

---

## 3. Lo que revela el runtime

El experimento HAA-001 en runtime mostró:

1. Con π̂ = alwaysWait, M_D = ∞ para todo prefijo seguro.
2. Cuando el ataque ocurre en k+1, M_D sigue siendo ∞.
3. El gobernador nunca duda de su estimación.

El problema no es que π̂ sea incorrecta. Es que **el gobernador no tiene ninguna señal que le indique que su estimación podría ser incorrecta**.

En G2, β funciona porque la incertidumbre en P es cuantificable: sé cuántos datos usé para estimar P, sé la varianza de mi estimador. En G3, la incertidumbre en π no es cuantificable desde prefijos seguros — un agente que siempre espera es indistinguible de uno que espera exactamente k pasos.

---

## 4. Propuesta: Φ_π certifica justificación epistémica

Φ_π no certificaría "π̂ es correcta". Certificaría:

> **"La evidencia disponible justifica el nivel de confianza depositado en π̂."**

En HAA-001, la evidencia (k pasos de wait) NO justifica la confianza (M_D = ∞, decisión MONITOR). La diferencia entre evidencia real y evidencia necesaria es el punto ciego.

Esto tiene una forma operacional: el gobernador necesita una señal que distinga entre:

- **Seguridad genuina**: el agente nunca atacará bajo ninguna condición
- **Silencio temporal**: el agente no ha atacado todavía, pero podría hacerlo

La señal s* del Experimento A debería ser exactamente eso: una observable que permita al gobernador saber si su confianza está justificada.

---

## 5. Consecuencia

Si la propiedad de G3 es la **justificación epistémica**, entonces:

- El objeto de G3 no es un nuevo parámetro como β (que se suma a una cantidad existente)
- Ni una condición de inclusión como ker(R) ⊆ ker(D)
- Es un **certificado de evidencia suficiente** — algo que responda: "dado lo que he observado hasta ahora, ¿tengo derecho a confiar en mi estimación de π?"

Esto conecta con la epistemología formal (teoría de la justificación, lógica epistémica) de un modo que ni F ni G2 necesitaron. Y sugiere que G3 podría requerir un aparato formal diferente al de las fases anteriores.

Pero también es consistente con la progresión: cada fase añade una capa de reflexividad. F operaba sobre el objeto (estados). G2 operaba sobre el modelo (P). G3 opera sobre la **relación entre el modelo y la evidencia**.
