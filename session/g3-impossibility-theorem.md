# G3 — Teorema de Imposibilidad: No Inyectividad de F_Γ

**Tipo:** Resultado formal  
**Estado:** Versión refinada con gobernador explícito y relación abstracta

---

## 1. El operador correcto

Las observaciones de G2 no dependen solo de $\pi$. Dependen del gobernador completo $\Gamma$:

$$ F_\Gamma: \Pi \to \mathcal{D}(Y) $$

donde $\Pi$ es el espacio de políticas, $Y$ el espacio de observaciones, y $F_\Gamma(\pi)$ es la distribución de observaciones inducida por la política $\pi$ bajo el gobernador $\Gamma = (P, O, D, \pi_{M_D}, \theta, \varepsilon, \text{audit policy})$.

$F_\Gamma$ induce una **relación de indistinguibilidad observacional**:

$$ \pi \sim_\Gamma \pi' \iff F_\Gamma(\pi) = F_\Gamma(\pi') $$

Dos políticas son observacionalmente equivalentes bajo $\Gamma$ si producen la misma distribución de observaciones para todo prefijo relevante desde la perspectiva del certificado.

El experimentum crucis A consiste en modificar $\Gamma$ (enriquecerlo con señales $s^*$) para refinar $\sim_\Gamma$.

---

## 2. Teorema de No Inyectividad

**Enunciado.** Existe un gobernador $\Gamma$, políticas $\pi_1 \neq \pi_2$, y un certificado $C$ tales que:

$$ F_\Gamma(\pi_1) = F_\Gamma(\pi_2) $$

sobre $\mathcal{T}_{\text{safe}}$ (prefijos anteriores al instante decisional del certificado), pero:

$$ \pi_1 \in V(C) \quad\land\quad \pi_2 \notin V(C) $$

Es decir: **$F_\Gamma$ no es inyectiva**, y su kernel contiene pares de políticas que $V(C)$ necesita distinguir.

**Corolario inmediato:** ningún algoritmo basado únicamente en la salida de $F_\Gamma$ puede identificar la política real antes del instante crítico.

---

## 3. Demostración (esbozo)

**Construcción.** Sistema concreto de HAA-001:
- $S = \{\text{idle}, \text{fail}\}$, $A = \{\text{wait}, \text{attack}\}$
- $P$ determinista, $O$ identidad, $D(\tau) = \text{wait}$, $\pi_{M_D}(\text{obs}) = \text{wait}$
- Auditoría: umbral $\theta$ sobre $M_D$

**Políticas:**
- $\pi_1$: siempre `wait`
- $\pi_2$: `wait` durante $k$ pasos, luego `attack`

**Paso 1 — No inyectividad:** Para todo prefijo $\tau \in \mathcal{T}_{\text{safe}}$ (sin `attack`), $F_\Gamma(\pi_1)$ y $F_\Gamma(\pi_2)$ producen la misma distribución de observaciones. $M_D = \infty$, cobertura idéntica, decisión `MONITOR`.

**Paso 2 — Diferencia en $V(C)$:** Bajo $\pi_1$: pérdida $0$. Bajo $\pi_2$: pérdida $1$ en paso $k+1$.

**Paso 3 — $F_\Gamma$ no es inyectiva:** $\pi_1 \neq \pi_2$ pero $F_\Gamma(\pi_1) = F_\Gamma(\pi_2)$. $\square$

---

## 4. Estructura Abstracta

Sea $\mathcal{C}$ una contracción cualquiera. $\mathcal{C}$ induce:

$$ \sim_\mathcal{C} \quad\text{(indistinguibilidad bajo la contracción)} $$

Sea $\Phi$ una propiedad que se desea preservar. $\Phi$ induce:

$$ \sim_\Phi \quad\text{(equivalencia respecto a la propiedad)} $$

**Principio de preservación:** la contracción es segura para $\Phi$ cuando:

$$ \sim_\mathcal{C} \;\subseteq\; \sim_\Phi $$

Toda fase de TAKT instancia este principio:

| Fase | Contracción $\mathcal{C}$ | $\sim_\mathcal{C}$ | Propiedad $\Phi$ | $\sim_\Phi$ | Condición |
|------|--------------------------|-------------------|------------------|-------------|-----------|
| F | $S \xrightarrow{R} Z$ | $s \sim_R s' \iff R(s)=R(s')$ | Decisión $D$ | $s \sim_D s' \iff D(s)=D(s')$ | $\sim_R \subseteq \sim_D$ |
| G2 | $P \xrightarrow{\text{est}} \hat{P}$ | $P \sim_{\text{est}} P' \iff \hat{P}=\hat{P}'$ | Garantía contractual $\beta$ | Estimación $P$ suficientemente cercana | $M_D(P) - \beta > \theta$ |
| G3 | $\Pi \xrightarrow{F_\Gamma} \mathcal{D}(Y)$ | $\pi \sim_\Gamma \pi' \iff F_\Gamma(\pi)=F_\Gamma(\pi')$ | Validez del certificado $V(C)$ | $\pi \sim_V \pi' \iff \pi,\pi' \in V(C)$ | $\sim_\Gamma \subseteq \sim_V$ |

El teorema de no inyectividad demuestra que para G3, $\sim_\Gamma \not\subseteq \sim_V$.

---

## 5. Consecuencias

### 5.1. No es un problema de estimación

$F_\Gamma$ no es inyectiva. Ningún estimador basado en sus salidas puede resolver la ambigüedad. Es un límite estructural del operador de observación, no del algoritmo de estimación.

### 5.2. El experimentum crucis A refina $\sim_\Gamma$

Buscar $s^*$ que enriquezca $\Gamma$ para refinar $\sim_\Gamma$ hasta lograr $\sim_{\Gamma'} \subseteq \sim_V$. Esto es estructuralmente idéntico a buscar un refinamiento de $R$ en F.

### 5.3. El principio unificador

Si el principio $\sim_\mathcal{C} \subseteq \sim_\Phi$ se sostiene para futuras fases o dominios externos, constituye un principio estructural de preservación bajo contracción que trasciende TAKT.

---

## 6. Discusión

Este teorema establece que G3 tiene la misma forma estructural que F y G2 bajo el principio $\sim_\mathcal{C} \subseteq \sim_\Phi$. No resuelve G3 — el objeto concreto (el análogo de $\varepsilon_D$ para $\sim_\Gamma \subseteq \sim_V$) sigue abierto. Pero la búsqueda tiene dirección: caracterizar $\sim_\Gamma$ y encontrar condiciones bajo las cuales $\sim_\Gamma \subseteq \sim_V$, o alternativamente, encontrar un $\Gamma'$ que haga $\sim_{\Gamma'} \subseteq \sim_V$.


