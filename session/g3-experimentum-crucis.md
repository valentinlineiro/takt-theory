# G3 — Experimentum Crucis: La Frontera del Certificado

**Tipo:** Documento de investigación  
**Fecha:** 2026-07-17  
**Estado:** Congelado antes de cualquier código o especificación  
**Contexto:** H₁ establecida (G3-HAA-001). Frontera $\mathcal{W}_{hidden} = \ker(\operatorname{obs}_{G2}) \setminus V(C)$ no vacía.  
**Pregunta:** ¿La frontera pertenece al certificado $C_{v4}$ o al mecanismo $\Gamma$?

---

## 1. El Fenómeno

HAA-001 construye un par $(w_1, w_2)$ con:

$$\operatorname{obs}(G2, w_1) = \operatorname{obs}(G2, w_2) \quad\land\quad w_1 \in V(C) \quad\land\quad w_2 \notin V(C)$$

donde $w_1 = (S, A, P, O, \Pi_0)$ y $w_2 = (S, A, P, O, \Pi_k)$ difieren únicamente en el modelo de amenazas $\Pi_{adv}$.

La frontera $\mathcal{W}_{hidden}$ existe: hay mundos indistinguibles para G2 donde $C_{v4}$ deja de ser válido. La pregunta es **qué entidad es responsable** de que esa frontera exista.

---

## 2. Hipótesis

### Hipótesis A — La frontera pertenece al certificado

$$ \text{frontera} = f(C_{v4}) $$

El certificado $C_{v4}$ define un dominio $V(C)$ que es incompleto. El problema es semántico: la garantía que afirma el contrato no cubre todos los mundos que debería cubrir. Existe una región de validez $\tilde{V} \supset V(C)$ que el certificado debería haber declarado pero no declara — y esa región no declarada es precisamente $\mathcal{W}_{hidden}$.

**Consecuencia:** Aparece un nuevo objeto de contrato ($C_{v5}$ o un parámetro adicional de $C_{v4}$). El gobernador $\Gamma$ no necesita cambiar. La analogía es F: $R$ no cambió, lo que cambió fue la propiedad que debía preservar ($\varepsilon_D$).

### Hipótesis B — La frontera pertenece al mecanismo

$$ \text{frontera} = f(\Gamma) $$

El certificado podría ser semánticamente completo, pero $\Gamma$ no tiene una observación suficientemente rica para determinar cuándo está dentro o fuera de $V(C)$. El problema es observacional: $\operatorname{obs}_{G2}$ colapsa mundos que $V(C)$ necesita distinguir.

**Consecuencia:** No aparece un nuevo contrato. Aparece una nueva capacidad del gobernador ($\Gamma'$ con un observador ampliado). La arquitectura de gobernanza cambia. La analogía es G2: $M_D$ no cambió, lo que cambió fue la estimación de $P$ ($\hat{P}_t$ online, $\beta$).

---

## 3. Los Dos Experimentos

### Experimento A — Fijar $C_{v4}$, enriquecer $\Gamma$

| Variable | Valor |
|----------|-------|
| $C_{v4}$ | Fijo (misma definición, mismo $\varepsilon$, mismas condiciones de validez) |
| $\Gamma$ | Se añade una señal $s^*$ que distingue $\Pi_0$ de $\Pi_k$ |
| $\operatorname{obs}_{G2}$ | Extendido: $\operatorname{obs}_{G2}^* = (\operatorname{obs}_{G2}, s^*)$ |

**Pregunta:** ¿Existe una señal $s^*$ observable por $\Gamma$ tal que:

$$\operatorname{obs}_{G2}^*(w_1) \neq \operatorname{obs}_{G2}^*(w_2)$$

y que la separación $\mathcal{W}_{hidden}$ desaparezca bajo $\operatorname{obs}_{G2}^*$?

**Falsación de A:** Si para toda señal $s^*$ que $\Gamma$ pueda observar, $\mathcal{W}_{hidden} \neq \varnothing$ persiste, entonces la frontera no es del mecanismo. (Esto es análogo a: si ningún enriquecimiento de $R$ puede hacer $\ker(R) \subseteq \ker(D)$, el problema no es de $R$.)

**Si A se cumple:** G3 produce un observador extendido para $\Gamma$. El objeto de G3 es la señal $s^*$ o un método para descubrirla.

**Si A se falsa:** La frontera no es eliminable enriqueciendo $\Gamma$ — el problema está en el contrato.

---

### Experimento B — Fijar $\Gamma$, enriquecer $C_{v4}$

| Variable | Valor |
|----------|-------|
| $\Gamma$ | Fijo (mismo $\operatorname{obs}_{G2}$, mismo $M_D$, mismo audit game) |
| $C_{v4}$ | Se extiende: $C_{v4}^*$ exige cobertura explícita de $\Pi_k$ |
| $V(C)$ | Extendido: $V(C^*) = \{w \mid w \models C_{v4}^*\}$ |

**Pregunta:** ¿$w_1 \in V(C^*)$? Es decir, ¿el mundo que antes satisfacía $C_{v4}$ sigue satisfaciendo el certificado enriquecido?

**Falsación de B:** Si $w_1 \in V(C^*)$ (el certificado enriquecido sigue siendo satisfecho por $w_1$), entonces la frontera era del contrato — $C_{v4}$ era incompleto.

**Resultado negativo:** Si $w_1 \notin V(C^*)$ (enriquecer el certificado elimina también a $w_1$), entonces el experimento B no elimina la frontera — solo la desplaza. La pregunta se transforma en "¿cómo sabe $\Gamma$ cuál es $\Pi_{adv}^{real}$?" — un problema observacional disfrazado de problema contractual.

**Si B se cumple:** G3 produce una extensión de $C_{v4}$. El objeto de G3 es un parámetro o condición adicional del contrato.

**Si el resultado es negativo:** El problema es genuinamente la relación $\Gamma \leftrightarrow C$ — la frontera no es atribuible a ninguna de las dos entidades por separado.

---

## 4. Implicaciones de Cada Resultado

| Resultado | Objeto de G3 | Analogía | Tipo de artefacto |
|-----------|-------------|----------|-------------------|
| A sí, B no | Señal $s^*$ para $\Gamma$ | G2: $\hat{P}$ online | Nueva capacidad del gobernador |
| A no, B sí | Extensión de $C_{v4}$ | F: $\varepsilon_D$ | Nueva condición contractual |
| Ambos no | Relación $\Gamma \leftrightarrow C \leftrightarrow W$ | — | Nueva capa de gobernanza sobre gobernanza |
| Ambos sí (contradicción aparente) | Ambos mecanismos operan; elegir el más barato | — | Decisión de diseño |

El caso "ambos no" es el más interesante: implicaría que el objeto de G3 es una **tercera entidad** que no pertenece ni al certificado ni al mecanismo, sino a la correspondencia entre ambos y el espacio de mundos. Esto sería una repetición del patrón de F ($\ker(R) \subseteq \ker(D)$ no es ni $R$ ni $D$) y G2 ($M_D$ no es ni $P$ ni $\theta$), pero en un nivel de abstracción superior: la correspondencia entre el kernel de observación de $\Gamma$ y el conjunto de validez de $C$.

---

## 5. Materialización del Experimento

Para ejecutar el experimentum crucis, hace falta:

### Experimento A

Construir una señal $s^*$ candidata que $\Gamma$ podría observar. Candidatas:

1. **Frecuencia de transiciones atípicas:** Si $\Pi_k$ produce patrones de acciones que $\Pi_0$ no puede generar (por ejemplo, rachas de ataques), una estadística sobre la secuencia de acciones podría distinguirlos.
2. **Detección de coordinación temporal:** Si $\Pi_k$ requiere esperar $k$ pasos, el intervalo entre acciones revela la profundidad de memoria.
3. **Complejidad de la política:** Si $\Pi_k$ tiene más parámetros que $\Pi_0$, la entropía de la política observable puede diferir.

Para cada candidata $s^*$:

- Verificar si $\operatorname{obs}_{G2}^*(w_1) \neq \operatorname{obs}_{G2}^*(w_2)$.
- Verificar si bajo $\operatorname{obs}_{G2}^*$, $\mathcal{W}_{hidden} = \varnothing$.

### Experimento B

Extender $C_{v4}$ para exigir cobertura explícita de $\Pi_k$. Esto requiere:

1. Definir $C_{v4}^*$: $C_{v4}$ con $\Pi_{adv}^{Threat}$ expandido a $\Pi_k$.
2. Verificar si $w_1 \models C_{v4}^*$ (el mundo con adversarios sin memoria satisface el certificado que exige cubrir adversarios con memoria).
3. Si $w_1 \not\models C_{v4}^*$: la extensión del contrato destruye la validez de $w_1$, y el problema se desplaza en lugar de resolverse.

---

## 6. Estado

**Congelado.** No se abre código, especificaciones ni implementación hasta que el experimentum crucis esté formalizado o refutado.

**Próxima acción:** Intentar refutar HAA-001 usando únicamente el vocabulario de G2 ($C_{v4}$, $\operatorname{obs}_{G2}$, $M_D$, $\beta$, $\hat{P}$). Si la refutación fracasa, ejecutar los experimentos A y B.
