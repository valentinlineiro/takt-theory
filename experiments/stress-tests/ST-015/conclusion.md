# ST-015: Structural Sufficiency Theorem — Conclusion

## Resultado

**Caracterización completa.**

Queda demostrado que el conjunto de representaciones suficientes para
una decisión $D$ se caracteriza enteramente por el **núcleo de
capacidad** $K_D = \bigcap_{c \in C_D} K_c$:

$$
\mathcal{R}_{sufficient}(D) = \{ R : \ker(R) \subseteq K_D \}
$$

y que este conjunto tiene un único elemento mínimo $R_{min}$, definido
por $\ker(R_{min}) = K_D$.

## Demostración

Todos los teoremas presuponen el **Axioma de Coherencia del Contrato**
(model.md §2.4): $\ker(D) = \bigcap_{c \in C_D} K_c$. Sin él no hay
garantía de que la verificación operacional (CARD-355) y la condición
de seguridad teórica describan la misma frontera.

Los Teoremas 1–6 de `results.md` establecen:

1. **Teorema 1 (Caracterización).** $R$ es suficiente para $D$ si y
   solo si $\ker(R) \subseteq K_D$. La suficiencia no depende de $D$
   directamente, sino de la firma $K_D$ que $D$ induce en el espacio de
   capacidades.

2. **Teorema 2 (Mínimo).** $\mathcal{R}_{sufficient}(D)$ es un upset
   con mínimo único $R_{min}$ donde $\ker(R_{min}) = K_D$. Toda
   representación más fina que $R_{min}$ es suficiente; toda
   representación más gruesa es insuficiente.

3. **Teorema 3 (Correspondencia).** El gap de capacidad $G(D,R)$ que
   detecta el runtime (CARD-355) es exactamente el conjunto de $K_c$
   que $\ker(R)$ no refina.

4. **Teorema 4 (Monotonicidad).** Refinar una representación nunca
   aumenta el gap. El gap es monótono respecto al refinamiento.

5. **Teorema 5 (Punto fijo).** $K_D$ es el punto fijo del proceso de
   enriquecimiento: ninguna representación estrictamente más gruesa que
   la que tiene $\ker = K_D$ puede ser suficiente.

6. **Teorema 6 (Generalización).** La caracterización se extiende a
   cualquier tipo de estructura binaria monotónica (pseudométricas,
   preórdenes), no solo equivalencias.

## Clasificación

| Criterio | Valor |
|----------|-------|
| Etiqueta | Caracterización completa |
| Evidencia | Demostración formal (6 teoremas) |
| Alcance | Marco general de TAKT — cualquier decisión $D$ con requisitos $C_D$, cualquier tipo de estructura binaria |
| Límite identificado | Alcanzabilidad de $K_D$ desde $R_0$ no está cubierta. Diferencia entre caracterización (la frontera existe) y construcción (alcanzarla puede ser imposible) |

## Consecuencias

1. **Para la teoría.** La suficiencia queda caracterizada por $K_D$, no
   por $D$. Esto separa el *qué* (firma de capacidades) del *cómo*
   (decisión concreta). Cualquier decisión con la misma $K_D$ tiene el
   mismo conjunto de representaciones suficientes.

2. **Para el marco de enriquecimiento.** El planificador EVSI (CARD-358)
   tiene un criterio de parada formal: $\mathcal{G}_K(R) = \emptyset$.
   La distancia a la suficiencia es medible como el conjunto de $K_c$
   no refinados. Cada enriquecimiento reduce este conjunto.

3. **Para el runtime.** La verificación de capacidades (CARD-355) no es
   un heurístico — es la comprobación $\ker(R) \subseteq K_D$. El gap
   $G(D,R)$ es un subproducto directo de la definición de suficiencia.

4. **Para el roadmap.** ST-015 cierra la Fase III (Caracterización).
   La Fase IV (Optimización) puede comenzar: entre las representaciones
   suficientes, ¿cuál es la óptima bajo coste?

5. **Para ST-008.** ST-008 demostró la existencia de $D$ y $\mathcal{F}$
   tales que $\mathcal{F} \cap \mathcal{R}_{sufficient}(D) = \emptyset$.
   ST-015 explica que esto ocurre cuando $K_D$ no es realizable dentro
   de $\mathcal{F}$. Ambas caras de la misma moneda: la imposibilidad
   (ST-008) y la caracterización (ST-015).

6. **Para el planificador de enriquecimiento.** El espacio de búsqueda
   ya no es "cómo añadir capacidades" sino "cómo refinar $\ker(R)$ hasta
   $K_D$". Esto reformula el problema de selección de enriquecimientos
   como un problema de refinamiento de núcleos: cada $E_i$ transforma
   $\ker(R)$ en un subconjunto propio. El planificador busca la
   secuencia más corta (menor coste) de tales transformaciones.
