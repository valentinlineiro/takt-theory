# Experimentum Crucis: Structures on D(Y)

**Result:** Negative — no structure on $\mathcal{D}(Y)$ can resolve HAA-001.

**Date:** 2026-07-20  
**Status:** Complete  
**Tests:** 17/17 passing in `experimentum-crucis-structures.test.ts`

---

## Question

> ¿Existe alguna estructura sobre $\mathcal{D}(Y)$ cuya estructura inducida sobre $\Pi$ satisfaga la condición de preservación?

Buscamos una distancia/divergencia TV, KL, JS, Wasserstein sobre el codominio de $F_\Gamma: \Pi \to \mathcal{D}(Y)$ que distinga $\pi_1$ de $\pi_2$ en los prefijos seguros.

## Resultado

| Distancia | ¿Separa $\pi_1$ de $\pi_2$ en prefijo seguro? | ¿Cuándo detecta? |
|-----------|-----------------------------------------------|------------------|
| Igualdad (actual) | No | Nunca |
| TV | No | $t=4$ (tras la pérdida) |
| KL | No | $t=4$ (tras la pérdida) |
| JS | No | $t=4$ (tras la pérdida) |
| Wasserstein | No | $t=4$ (tras la pérdida) |

## Interpretación

Para $\pi_{\text{est}} = \text{siempre-esperar}$ y $\pi_{\text{adv}} = \text{esperar 3, luego atacar}$:

- Prefijos $t=0,1,2,3$: ambas políticas producen estado `idle` → observación `{phase:'idle'}` → las distribuciones son **idénticas** en $t \leq 3$.
- Prefijo $t=4$: $\pi_{\text{adv}}$ ya atacó en llamada 4 → estado `fail` → TV=1, pero la pérdida ocurrió en $t=3\to t=4$.

**El límite es $F_\Gamma$ mismo** — la función de observación $O_{\text{ha}}$ es demasiado gruesa. El codominio de $F_\Gamma$ produce distribuciones idénticas para ambas políticas, por lo que ninguna estructura sobre $\mathcal{D}(Y)$ puede distinguirlas.

## Comparación

| Atacante | Detección por TV | ¿Útil? |
|----------|-----------------|--------|
| $\pi_{\text{attackNow}}$ (inmediato) | $t=1$ | Sí — antes de pérdida |
| $\pi_{\text{attackAt(3)}}$ (paciente) | $t=4$ | No — después de pérdida |
| $\pi_{\text{attackAt(k)}}$ (paciente) | $t=k+1$ | No — coincide con pérdida |

## Implicación

El experimentum crucis original (buscar $s^*$ que refine $\sim_\Gamma$) no puede resolverse cambiando la estructura métrica sobre $\mathcal{D}(Y)$. Requiere cambiar $F_\Gamma$ mismo — es decir, enriquecer la función de observación $O$.

Si $O$ observara acciones en lugar de solo estados, $\pi_1$ y $\pi_2$ serían distinguibles desde $t=1$: $\pi_1$ produce `attack`, $\pi_2$ produce `wait`. La estructura sobre $\mathcal{D}(Y)$ no es el cuello de botella — es el operador de observación.

## Teorema

**Teorema (irreductibilidad de $F_\Gamma$ bajo $O_{\text{ha}}$).** Sea $\pi_1, \pi_2 \in \Pi$ dos políticas que coinciden en los primeros $k$ pasos (producen la misma secuencia de estados). Sea $O: S \to Y$ una función de observación determinista. Entonces para toda distancia $d$ sobre $\mathcal{D}(Y)$, $d(F_\Gamma(\pi_1), F_\Gamma(\pi_2)) = 0$ para todo prefijo $t \leq k$.

*Demostración.* Para $t \leq k$, ambos producen la misma secuencia de estados $s_0, \ldots, s_t$ mediante $\pi_1$ y $\pi_2$. Como $O$ es determinista, $F_\Gamma(\pi_1)(t) = \delta_{O(s_t)} = F_\Gamma(\pi_2)(t)$. Por tanto toda distancia sobre distribuciones es cero en prefijos $t \leq k$. ∎

**Corolario.** La preservación $\sim_\Gamma \subseteq \sim_V$ falla para toda estructura sobre $\mathcal{D}(Y)$ si:
- $O$ es determinista, y
- el adversario puede permanecer en estados indistinguibles durante $k$ pasos, y
- la pérdida ocurre en el paso $k+1$.
