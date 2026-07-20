# G3 — La Propiedad Perdida: qué preserva Φ_π

**Tipo:** Investigación  
**Método:** Comparación estructural con F y G2 para aislar la propiedad perdida en la contracción Π → π̂  

---

## 1. El método: sustracción de propiedades

Cada fase pierde una propiedad distinta. La contracción la revela porque el objeto colapsado ya no la preserva.

**F** contrae $S \to R(S)$. Propiedad perdida: **decidibilidad óptima**.  
Dos estados con la misma $R$ pueden necesitar decisiones distintas.  
Φ_R: $\ker(R) \subseteq \ker(D)$.

**G2** contrae $P_{true} \to \hat{P}$. Propiedad perdida: **validez numérica de la garantía**.  
$M_D$ computado con $\hat{P}$ puede diferir del real.  
Φ_P: $M_D(\hat{P}) - \beta > \theta$ (el margen corregido absorbe el error de estimación).

**G3** contrae $\Pi_{real} \to \hat{\pi}$. ¿Propiedad perdida?

---

## 2. Lo que NO se pierde

Con π̂ incorrecta:

- **La decisión sigue siendo correcta** (F no se rompe). En HAA-001, D=wait y π̂=wait; la decisión de monitorear es la misma que con π correcta. La pérdida no es de F.
- **La garantía contractual sigue siendo evaluable** (G2 no se rompe). M_D se computa correctamente dado π̂; el problema es que el resultado de M_D no es el que importa. La pérdida no es de G2.

Ambas propiedades se preservan a nivel operacional. El fallo está en otro lado.

---

## 3. Lo que SÍ se pierde

La contracción $\Pi_{real} \to \hat{\pi}$ pierde la **capacidad de representar políticas históricas**.

En HAA-001:
- $\Pi_{real} = \Pi_k$: el agente toma decisiones basadas en la historia de intervenciones (cuántos pasos han pasado sin intervención)
- $\hat{\pi} = \text{alwaysWait}$: función pura de la observación actual, sin estado interno
- La diferencia no es cuantitativa (como en G2, donde $\hat{P}$ está cerca de $P_{true}$). Es **categórica**: π̂ pertenece a una clase de funciones más pobre que $\Pi_{real}$.

| Dimensión | F | G2 | G3 |
|-----------|---|----|----|
| Error | Colapso de estados | Error numérico | Error de clase |
| π̂ y $\Pi_{real}$ difieren en | Valor de R | Valor de P | **Tipo de función** |
| La propiedad perdida es | Alineación de kernels | Precisión numérica | **Expresividad de clase** |

---

## 4. Esto hace que G3 se parezca más a F que a G2

En F, el error era categórico: dos estados tenían el mismo R-value pero decisiones distintas. No se podía "estimar mejor" para arreglarlo — la representación R simplemente no tenía la granularidad necesaria.

En G2, el error era numérico: $\hat{P}$ estaba cerca de $P_{true}$ pero no exactamente igual. Se podía estimar mejor (más datos) o corregir el sesgo (β).

En G3, el error es categórico otra vez: π̂ (función pura) no puede representar $\Pi_k$ (histórica). No importa cuántos datos seguros se observen — siempre producirán π̂ = alwaysWait.

| Fase | Tipo de error | ¿Se puede estimar mejor? |
|------|---------------|--------------------------|
| F | Categórico (R colapsa) | No — R no tiene granularidad |
| G2 | Numérico (P se desvía) | Sí — más datos → mejor P̂ |
| G3 | Categórico (π clase pobre) | **No** — más datos seguros no revelan condicionalidad |

---

## 5. Entonces, ¿qué preserva Φ_π?

Φ_π debe certificar que la **clase de políticas representable por π̂** es suficientemente expresiva para capturar $\Pi_{real}$.

En F, Φ_R certificaba: $\ker(R) \subseteq \ker(D)$ — el kernel de la representación está contenido en el kernel de la decisión.

En G3, Φ_π certificaría algo análogo:

$$ \text{Mem}(\Pi_{real}) \subseteq \text{Mem}(\hat{\pi}) $$

donde $\text{Mem}(\mathcal{P})$ es la **profundidad de memoria máxima** que las políticas en $\mathcal{P}$ pueden utilizar.

O más precisamente:

$$ \text{toda política en } \Pi_{real} \text{ es expresable como función de observaciones actuales} $$

— o equivalentemente —

$$ \Pi_{real} \subseteq \text{Func}(O^* \to A) $$

Si $\Pi_{real}$ contiene políticas con memoria (como $\Pi_k$), la preservación falla. No hay π̂ que pueda representarlas correctamente porque la clase de funciones puras es demasiado pobre.

---

## 6. ¿Y eso es todo? ¿G3 se cierra con una condición sobre Π_adv?

Aquí está la dificultad: G2 no resolvió su contraejemplo con una condición sobre $P$ ("que $P_{true} = \hat{P}$"), sino con un mecanismo ($\beta$) que absorbía la incertidumbre sin requerir conocimiento perfecto.

G3 probablemente no se cerrará con "que $\Pi_{real}$ sea estacionaria". Eso sería trivial: el certificado solo vale si el adversario es simple.

La pregunta abierta es: **¿existe un mecanismo análogo a β para el error categórico de π?** Es decir, algo que permita preservar la garantía aunque $\Pi_{real}$ contenga políticas históricas — sin necesidad de estimar $\Pi_{real}$ perfectamente.

Eso es lo que el experimentum crucis (A/B) debe responder: si se puede enriquecer Γ o C para absorber esta brecha de expresividad, o si la brecha es irreducible y G3 necesita un objeto completamente nuevo.
