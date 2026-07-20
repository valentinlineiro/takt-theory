# Catálogo de Estructuras Transportables

**Tipo:** Clasificación (versión corregida)  
**Corrige:** la versión anterior clasificaba por codominio; la correcta es por **estructura elegida sobre el codominio**.

---

## 1. El principio

Una contracción $\mathcal{C}: X \to \hat{X}$ no induce una estructura por sí sola. La induce **en función de qué estructura de $\hat{X}$ decides transportar hacia atrás**.

El mismo codominio puede inducir estructuras distintas según qué relación uses:

Ejemplo: $f: X \to \mathbb{R}$

| Estructura en $\mathbb{R}$ | Estructura inducida en $X$ |
|---------------------------|---------------------------|
| Igualdad $=_ℝ$ | $x \sim_f x' \iff f(x) = f(x')$ |
| Orden $\leq_ℝ$ | $x \preceq_f x' \iff f(x) \leq f(x')$ |
| Métrica $| \cdot - \cdot |_ℝ$ | $d_f(x, x') = |f(x) - f(x')|$ |

La estructura inducida depende del par $(\hat{X}, \text{estructura}_\text{ elegida sobre } \hat{X})$.

---

## 2. Catálogo de estructuras transportables

| Estructura en $\hat{X}$ | Tipo | Pullback a $X$ | Definición |
|------------------------|------|----------------|-----------|
| Igualdad | Equivalencia | $\sim_\mathcal{C}$ | $x \sim_\mathcal{C} x' \iff \mathcal{C}(x) = \mathcal{C}(x')$ |
| Métrica $d$ | Pseudométrica | $d_\mathcal{C}$ | $d_\mathcal{C}(x, x') = d(\mathcal{C}(x), \mathcal{C}(x'))$ |
| Orden $\leq$ | Preorden | $\preceq_\mathcal{C}$ | $x \preceq_\mathcal{C} x' \iff \mathcal{C}(x) \leq \mathcal{C}(x')$ |
| Topología $\tau$ | Topología inicial | $\tau_\mathcal{C}$ | $U$ abierto si $\mathcal{C}^{-1}(U)$ abierto |
| Divergencia $D$ | Divergencia | $D_\mathcal{C}$ | $D_\mathcal{C}(x, x') = D(\mathcal{C}(x) \| \mathcal{C}(x'))$ |

El pullback **hereda el tipo de estructura** (equivalencia→equivalencia, métrica→pseudométrica, etc.).

---

## 3. Principio de invariancia por factorización

Sea $\mathcal{C}: X \to Y$ cualquier contracción. Para $x_1, x_2 \in X$ con $\mathcal{C}(x_1) = \mathcal{C}(x_2)$, toda estructura $S$ sobre $Y$ (métrica, divergencia, orden, topología) induce $S_\mathcal{C}(x_1, x_2) = 0$.

*Demostración.* $S_\mathcal{C}(x_1, x_2) = S(\mathcal{C}(x_1), \mathcal{C}(x_2)) = S(y, y) = 0$. ∎

**La fibra $\mathcal{C}^{-1}(y)$ es un límite absoluto.** Cambiar $S$ (nivel 1) no refina la partición. Refinar requiere cambiar $\mathcal{C}$ (nivel 2).

### Dos niveles

| Nivel | Acción | ¿Refina partición? |
|-------|--------|-------------------|
| 1 | Cambiar estructura sobre $Y$ | No — fibras invariantes |
| 2 | Cambiar $\mathcal{C}$ misma | Sí — nuevas distinciones |

---

## 4. Las fases de TAKT como elección de estructura

### Fase F: $R: S \to Z$

| Elemento | Valor |
|----------|-------|
| Codominio | Conjunto $Z$ |
| Estructura elegida sobre $Z$ | Igualdad |
| $\mathcal{S}(\mathcal{C})$ | $\sim_R$: $s \sim_R s' \iff R(s) = R(s')$ |
| $\mathcal{S}(\Phi)$ | $\sim_D$: $s \sim_D s' \iff D(s) = D(s')$ |
| Preservación | $\sim_R \subseteq \sim_D$ |

### Fase G2: $P \xrightarrow{\text{est}} \hat{P}$

| Elemento | Valor |
|----------|-------|
| Codominio | Espacio de matrices de transición |
| Estructura elegida sobre $\hat{X}$ | Métrica (norma, KL, varianza del estimador) |
| $\mathcal{S}(\mathcal{C})$ | Pseudométrica $d_{\text{est}}(P_1, P_2)$ |
| $\mathcal{S}(\Phi)$ | $M_D(P) - \beta > \theta$ |
| Preservación | $d_{\text{est}}(P_{\text{true}}, \hat{P}) < \beta$ |

### Fase G3: $\Pi \xrightarrow{F_\Gamma} \mathcal{D}(Y)$

| Elemento | Valor |
|----------|-------|
| Codominio | Distribuciones $\mathcal{D}(Y)$ |
| Estructura elegida sobre $\mathcal{D}(Y)$ | **Igualdad** (actualmente) |
| $\mathcal{S}(\mathcal{C})$ | $\sim_\Gamma$: $\pi \sim_\Gamma \pi' \iff F_\Gamma(\pi) = F_\Gamma(\pi')$ |
| $\mathcal{S}(\Phi)$ | $\sim_V$: $\pi \sim_V \pi' \iff \pi,\pi' \in V(C)$ |
| Preservación actual | $\sim_\Gamma \subseteq \sim_V$ (FALLIDA: HAA-001) |

**Observación clave:** $\mathcal{D}(Y)$ posee muchas otras estructuras naturales — TV, Wasserstein, KL, Jensen-Shannon — que **también pueden transportarse** a $\Pi$. La elección de igualdad es la más pobre.

---

## 4. Resultado del experimentum crucis (nivel 1)

**Ninguna estructura sobre $\mathcal{D}(Y)$ puede resolver HAA-001.**

La razón es inmediata por el principio de factorización (sección 3): $F_\Gamma(\pi_1) = F_\Gamma(\pi_2)$ en prefijos seguros. Toda estructura $S$ sobre $\mathcal{D}(Y)$ induce $S_{F_\Gamma}(\pi_1, \pi_2) = 0$.

| Estructura en $\mathcal{D}(Y)$ | Pullback a $\Pi$ | ¿Separa $\pi_1$ de $\pi_2$? |
|------------------------------|-----------------|---------------------------|
| Igualdad (actual) | $\sim_\Gamma$ | No |
| TV | $d_{\text{TV}}$ | No |
| Wasserstein | $W$ | No |
| KL | $D_{\text{KL}}$ | No |
| Jensen-Shannon | $D_{\text{JS}}$ | No |

*Tests:* 17/17 passing en `experimentum-crucis-structures.test.ts`.

---

## 5. Consecuencia (nivel 2): reformulación del experimentum crucis

El teorema de imposibilidad elimina completamente el espacio de búsqueda del nivel 1. En consecuencia, cualquier solución debe pertenecer al nivel 2:

> **¿Qué contracción $\Gamma'$ refina $F_\Gamma$ lo suficiente para que $\sim_{\Gamma'} \subseteq \sim_V$?**

Caminos posibles:
- **Memoria:** $F_{\Gamma'}$ considera secuencias de observaciones, no solo el estado actual
- **Sondeos activos:** acciones de prueba que revelan intención adversaria
- **Auditorías activas:** intervenciones que modifican la trayectoria para obtener información
- **Observación experimental:** $O$ más rica (ej: acciones observables, contadores de pasos)
- **Pipeline extendido:** $F_\Gamma$ como composición de $O$, $P$, $D$, protocolo de auditoría
- **Consulta causal:** preguntas contrafactuales sobre trayectorias alternativas

El experimentum crucis original (buscar $s^*$) es exactamente esta búsqueda entre $\Gamma'$ candidatos — y ahora sabemos que opera en el nivel correcto.

