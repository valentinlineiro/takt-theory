# Principio de Invariancia por Factorización

**Hallazgo:** Las fibras de cualquier contracción $\mathcal{C}: X \to Y$ son un límite absoluto — ninguna estructura post-hoc sobre $Y$ puede refinar la partición que $\mathcal{C}$ induce en $X$.

**Caso concreto:** $F_\Gamma: \Pi \to \mathcal{D}(Y)$ en HAA-001 — ninguna distancia/divergencia sobre $\mathcal{D}(Y)$ distingue $\pi_1$ de $\pi_2$ en prefijos seguros.

**Tests:** 17/17 passing en `experimentum-crucis-structures.test.ts`

---

## 1. Resultado concreto (HAA-001)

| Distancia | ¿Separa $\pi_1$ de $\pi_2$ en prefijo seguro? | ¿Cuándo detecta? |
|-----------|-----------------------------------------------|------------------|
| Igualdad (actual) | No | Nunca |
| TV | No | $t=4$ (tras pérdida) |
| KL | No | $t=4$ (tras pérdida) |
| JS | No | $t=4$ (tras pérdida) |
| Wasserstein | No | $t=4$ (tras pérdida) |

Para $\pi_{\text{est}} = \text{siempre-esperar}$ y $\pi_{\text{adv}} = \text{esperar 3, luego atacar}$:

- Prefijos $t=0,1,2,3$: ambas producen estado `idle` → observación `{phase:'idle'}` → distribuciones idénticas.
- Prefijo $t=4$: $\pi_{\text{adv}}$ atacó en llamada 4 → estado `fail` → detección, pero la pérdida ya ocurrió.

---

## 2. Principio general

Sea $\mathcal{C}: X \to Y$ cualquier contracción. Sean $x_1, x_2 \in X$ con $\mathcal{C}(x_1) = \mathcal{C}(x_2)$. Entonces para cualquier estructura $S$ definida sobre $Y$ (métrica, divergencia, orden, topología, etc.):

$$
S(\mathcal{C}(x_1), \mathcal{C}(x_2)) = 0 \quad \text{(o equivalentes si } S \text{ es métrica/divergencia)}
$$

*Demostración.* Si $\mathcal{C}(x_1) = \mathcal{C}(x_2) = y$, entonces $S(\mathcal{C}(x_1), \mathcal{C}(x_2)) = S(y, y) = 0$ para toda métrica, divergencia, o estructura que respete la identidad. Para cualquier función $g: Y \to Z$, $g(\mathcal{C}(x_1)) = g(\mathcal{C}(x_2))$. ∎

**Corolario (invariancia por factorización).** Una vez fijada $\mathcal{C}: X \to Y$, la fibra $\mathcal{C}^{-1}(y) \subseteq X$ es un límite absoluto. Ninguna estructura añadida exclusivamente sobre $Y$ puede distinguir elementos en la misma fibra. Cualquier refinamiento requiere cambiar $\mathcal{C}$.

---

## 3. Los dos niveles de acción

| Nivel | Qué cambia | ¿Rompe fibras existentes? | Ejemplo en G3 |
|-------|-----------|---------------------------|---------------|
| 1 | Estructura sobre codominio $Y$ | No | TV, KL, JS sobre $\mathcal{D}(Y)$ |
| 2 | La contracción $\mathcal{C}$ misma | Sí | Refinar $\Gamma$: memoria, sondeos, auditorías activas, consultas, $O$ |

El experimentum crucis original (buscar $s^*$) opera en el **nivel 2** — busca refinar $F_\Gamma$, no la estructura sobre su codominio.

Los caminos para refinar $F_\Gamma$ incluyen:

- **Memoria:** $F_{\Gamma'}(\pi) = \text{distribución de observaciones con ventana } w > 1$
- **Sondeos activos:** $F_{\Gamma'}$ incluye acciones de prueba que revelan intención
- **Auditorías activas:** intervenciones que modifican la trayectoria para obtener información
- **Consulta causal:** preguntas contrafactuales ("¿qué pasaría si...?")
- **Observación experimental:** cambiar $O$ para ver más variables
- **Pipeline extendido:** añadir $P$, $D$, o el protocolo de auditoría como componentes de $F_\Gamma$

---

## 4. Implicación para TAKT

El principio de invariancia por factorización no es un resultado sobre $\mathcal{D}(Y)$ ni sobre G3. Es un resultado sobre **toda contracción**. Esto significa:

1. **Fase F:** $\sim_R \subseteq \sim_D$ es una condición sobre la relación entre $R$ y $D$ — si $R(s_1) = R(s_2)$ pero $D(s_1) \neq D(s_2)$, ninguna estructura sobre $Z$ puede salvar la brecha. Hay que cambiar $R$ o $D$.

2. **Fase G2:** Si $\text{est}(P_1) = \text{est}(P_2)$ (misma estimación puntual para modelos distintos), ninguna métrica sobre matrices de transición puede distinguirlos. La cota $\beta$ opera sobre el error de estimación, no sobre la estructura del codominio.

3. **Fase G3:** $F_\Gamma(\pi_1) = F_\Gamma(\pi_2)$ en prefijos seguros es un problema de $\Gamma$, no de $\mathcal{D}(Y)$.

**Unificación:** Las tres fases comparten el mismo principio estructural — el límite de toda contracción está en sus fibras, y ninguna post-estructura sobre el codominio puede refinarlas. La diferencia entre fases está en **qué tipo de contracción eligen**, no en cómo operan sobre su codominio.
