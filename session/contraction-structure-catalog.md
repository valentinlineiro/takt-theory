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

## 3. Las fases de TAKT como elección de estructura

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

## 4. El experimentum crucis reformulado

Ya no es "buscar una señal $s^*$".

Es:

> **¿Existe alguna estructura sobre $\mathcal{D}(Y)$ cuyo pullback a $\Pi$ satisfaga la condición de preservación?**

Es decir, probar estructuras candidatas:

| Estructura en $\mathcal{D}(Y)$ | Pullback a $\Pi$ | ¿Separa $\pi_1$ de $\pi_2$? |
|------------------------------|-----------------|---------------------------|
| Igualdad (actual) | $\sim_\Gamma$ | No — $F_\Gamma(\pi_1) = F_\Gamma(\pi_2)$ |
| TV distancia | $d_{\text{TV}}(\pi, \pi')$ | Depende — $\|F_\Gamma(\pi_1) - F_\Gamma(\pi_2)\|_{\text{TV}} = 0$ sobre $\mathcal{T}_{\text{safe}}$ |
| Wasserstein | $W(\pi, \pi')$ | ? |
| KL divergencia | $D_{\text{KL}}(\pi \| \pi')$ | ? |
| Jensen-Shannon | $D_{\text{JS}}(\pi, \pi')$ | ? |
| $f$-divergencia | $D_f(\pi, \pi')$ | ? |

Para cada estructura $S$ sobre $\mathcal{D}(Y)$, el pullback es $S_{F_\Gamma}(\pi, \pi') = S(F_\Gamma(\pi), F_\Gamma(\pi'))$. La pregunta es si $S_{F_\Gamma}$ preserva la distinción entre $\pi_1$ y $\pi_2$.

---

## 5. Consecuencias

### Si alguna estructura funciona

G3 puede resolverse cambiando la estructura inducida. El objeto de G3 es esa estructura elegida — análogo a elegir la métrica correcta en G2.

### Si ninguna estructura funciona

El problema es del operador $F_\Gamma$ mismo, no de la estructura elegida sobre su codominio. Esto sería un resultado negativo fuerte: la no inyectividad de $F_\Gamma$ es irreducible — ninguna métrica sobre $\mathcal{D}(Y)$ puede distinguir $\pi_1$ de $\pi_2$ porque sus distribuciones son idénticas en la región relevante. Eso demostraría que el límite es del observador, no de la métrica.

