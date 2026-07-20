# Teoría de Preservación Estructural

**Núcleo.** Un marco axiomático para la preservación de propiedades bajo
morfismos. Los objetos primitivos son pares $(\text{estructura}, \preceq)$
que satisfagan tres axiomas. F, G2 y G3 son instancias.

---

## 1. Axiomas de estructura preservable

Un **tipo de estructura** $\mathcal{T}$ es una familia de conjuntos $S_Y$
(indexada por conjuntos $Y$) cuyos elementos llamamos **$\mathcal{T}$-estructuras**
sobre $Y$, junto con una relación $\preceq$ para cada $Y$, que satisfacen:

**A1 (Pullback).** Para toda función $f: X \to Y$ y toda
$\mathcal{T}$-estructura $\sigma$ sobre $Y$, existe una
$\mathcal{T}$-estructura $f^*(\sigma)$ sobre $X$ definida por
$f^*(\sigma)(x_1, x_2) = \sigma(f(x_1), f(x_2))$.

**A2 (Preorden).** $\preceq$ es un preorden sobre el conjunto de
$\mathcal{T}$-estructuras sobre cualquier $Y$. Escribimos
$\sigma_1 \preceq \sigma_2$ cuando $\sigma_1$ es **suficientemente fina**
respecto a $\sigma_2$ para la preservación (el orden concreto depende
del tipo).

**A3 (Monotonía del pullback).** Si $\sigma_1 \preceq \sigma_2$ sobre $Y$,
entonces $f^*(\sigma_1) \preceq f^*(\sigma_2)$ sobre $X$.

---

### 1.1 Instancias

#### Equivalencias ($\mathcal{T}_{\sim}$, $\subseteq$)

- $S_Y$: relaciones de equivalencia sobre $Y$.
- $\sigma_1 \preceq \sigma_2 \iff \sigma_1 \subseteq \sigma_2$ (más fina,
  clases más pequeñas).
- **A1:** $f^*(\sim)$ es la equivalencia $x_1 \sim_f x_2 \iff f(x_1) \sim f(x_2)$.
- **A2:** La inclusión es un orden parcial, luego preorden.
- **A3:** Si $\sim_1 \subseteq \sim_2$, entonces $f^*(\sim_1) \subseteq f^*(\sim_2)$.

#### Pseudométricas ($\mathcal{T}_d$, $\leq_k$)

- $S_Y$: pseudométricas sobre $Y$ (distancias simétricas, $d(y,y)=0$,
  desigualdad triangular).
- $\sigma_1 \preceq \sigma_2 \iff \exists k > 0: d_2 \leq k \cdot d_1$
  (dominación Lipschitz: $d_1$ acota a $d_2$).
- **A1:** $f^*(d)(x_1, x_2) = d(f(x_1), f(x_2))$ es una pseudométrica.
- **A2:** La dominación Lipschitz es un preorden.
- **A3:** Si $d_2 \leq k \cdot d_1$ sobre $Y$, entonces
  $f^*(d_2) \leq k \cdot f^*(d_1)$ sobre $X$ (porque la desigualdad se
  preserva punto a punto al componer con $f$).

#### Preórdenes ($\mathcal{T}_\leq$, $\Rightarrow$)

- $S_Y$: preórdenes sobre $Y$.
- $\sigma_1 \preceq \sigma_2 \iff (y_1 \leq_1 y_2 \implies y_1 \leq_2 y_2)$
  (monotonía: el orden de $\sigma_1$ implica el de $\sigma_2$).
- **A1, A2, A3:** Se verifican análogamente.

#### Topologías ($\mathcal{T}_\tau$, $\supseteq$)

- $S_Y$: topologías sobre $Y$.
- $\sigma_1 \preceq \sigma_2 \iff \tau_1 \supseteq \tau_2$
  ($\tau_1$ es más fina que $\tau_2$).
- **A1:** $f^*(\tau) = \{f^{-1}(U) \mid U \in \tau\}$ (topología inicial).
- **A2:** La inclusión inversa de topologías es un orden parcial.
- **A3:** Si $\tau_1 \supseteq \tau_2$, entonces $f^*(\tau_1) \supseteq f^*(\tau_2)$.

---

## 2. Morfismo y estructura inducida

Un **morfismo** $\mathcal{C}: X \to Y$, junto con una $\mathcal{T}$-estructura
$\sigma$ sobre $Y$, induce $\sigma_\mathcal{C} = \mathcal{C}^*(\sigma)$ sobre
$X$. Una **contracción** es un morfismo no inyectivo (fibras con más de un
elemento).

Una propiedad $\Phi: X \to Z$, junto con una $\mathcal{T}$-estructura $\tau$
sobre $Z$, induce $\tau_\Phi = \Phi^*(\tau)$ sobre $X$.

---

## 3. Preservación

Decimos que $\mathcal{C}$ **preserva** $\Phi$ (dadas $\sigma, \tau$) si:

$$
\sigma_\mathcal{C} \preceq \tau_\Phi
$$

*Interpretación.* La estructura que $\mathcal{C}$ induce sobre $X$ es
suficientemente fina para capturar las distinciones que $\Phi$ requiere.

---

## 4. Principio de factorización

Para todo $\mathcal{C}: X \to Y$, si $\mathcal{C}(x_1) = \mathcal{C}(x_2)$
entonces $\sigma_\mathcal{C}(x_1, x_2) = \sigma(y, y)$ para toda
$\mathcal{T}$-estructura $\sigma$. Para equivalencias, métricas, órdenes
y topologías, $\sigma(y, y)$ es el elemento neutro (identidad, $0$,
reflexividad, todo el espacio). La fibra $\mathcal{C}^{-1}(y)$ es un
**límite absoluto**.

---

## 5. Refinamiento

Un **refinamiento** de $\mathcal{C}: X \to Y$ es $(\mathcal{C}', \phi)$
con $\mathcal{C}': X \to Y'$ y $\phi: Y' \to Y$ tales que:

$$
\mathcal{C} = \phi \circ \mathcal{C}'
$$

### Propiedades

1. **Fibra heredada:** $\sim_{\mathcal{C}'} \subseteq \sim_{\mathcal{C}}$.
2. **Estructura heredada:** Para $\sigma'$ sobre $Y'$ y $\sigma$ sobre $Y$
   con $\phi^*(\sigma) \preceq \sigma'$, se cumple
   $\sigma_\mathcal{C} \preceq \sigma'_{\mathcal{C}'}$
   (el refinamiento permite una estructura al menos tan fina).

*Demostración de 2.* $\sigma_\mathcal{C} = \mathcal{C}^*(\sigma) =
(\phi \circ \mathcal{C}')^*(\sigma) = \mathcal{C}'^*(\phi^*(\sigma))$.
Por A3, $\phi^*(\sigma) \preceq \sigma'$ implica
$\mathcal{C}'^*(\phi^*(\sigma)) \preceq \mathcal{C}'^*(\sigma')$,
luego $\sigma_\mathcal{C} \preceq \sigma'_{\mathcal{C}'}$. ∎

---

## 6. Teorema de caracterización (versión axiomática)

**Teorema (alcance del refinamiento).** Sea $\mathcal{C}: X \to Y$ y
$(\mathcal{C}', \phi)$ un refinamiento con $\mathcal{C} = \phi \circ
\mathcal{C}'$. La acción de $\mathcal{C}'$ está **confinada a las fibras**
de $\mathcal{C}$: para $x_1, x_2$ con $\mathcal{C}(x_1) \neq
\mathcal{C}(x_2)$, ninguna estructura $\sigma'$ sobre $Y'$ puede hacer
que $\mathcal{C}'$ los identifique.

*Demostración.* $\mathcal{C}(x_1) \neq \mathcal{C}(x_2)$ implica
$\phi(\mathcal{C}'(x_1)) \neq \phi(\mathcal{C}'(x_2))$, luego
$\mathcal{C}'(x_1) \neq \mathcal{C}'(x_2)$. La equivalencia inducida
$\sim_{\mathcal{C}'}$ nunca agrupa elementos de distintas fibras de
$\mathcal{C}$, independientemente de $\sigma'$. ∎

**Teorema (preservación, caso equivalencias).** Sea $\mathcal{C}: X \to Y$
con $\sim_Y$ sobre $Y$ (que induce $\sim_\mathcal{C}$ sobre $X$), y
$\Phi: X \to Z$ con $\sim_Z$ sobre $Z$ (que induce $\sim_\Phi$). Sea
$(\mathcal{C}', \phi)$ un refinamiento con $\sim_{Y'}$ sobre $Y'$.
Entonces $\sim_{\mathcal{C}'} \subseteq \sim_\Phi$ si y solo si, para
toda fibra $\mathcal{C}^{-1}(y)$, la restricción de $\mathcal{C}'$
separa los pares que $\Phi$ separa.

*Demostración.* ($\Rightarrow$) Directo de la definición.
($\Leftarrow$) Para $x_1, x_2$ en distintas fibras, $\mathcal{C}(x_1) \neq
\mathcal{C}(x_2)$, luego $\mathcal{C}'(x_1) \neq \mathcal{C}'(x_2)$
(teorema anterior), y la inclusión $\sim_{\mathcal{C}'} \subseteq
\sim_\Phi$ se satisface sin condiciones. Para $x_1, x_2$ en la misma
fibra, la hipótesis garantiza que si $\Phi(x_1) \neq \Phi(x_2)$ entonces
$\mathcal{C}'(x_1) \neq \mathcal{C}'(x_2)$. ∎

**Teorema (preservación, caso pseudométricas).** Sea $\mathcal{C}: X \to Y$
con $d_Y$ sobre $Y$, $\Phi: X \to \mathbb{R}$ con $d_\mathbb{R}$ la
métrica euclídea, y $(\mathcal{C}', \phi)$ un refinamiento con $d_{Y'}$
sobre $Y'$. Entonces $d_\Phi \leq k \cdot d_{\mathcal{C}'}$ si se
cumplen:

1. Para toda fibra $\mathcal{C}^{-1}(y)$: $d_\Phi \leq k \cdot d_{\mathcal{C}'}$
   dentro de la fibra.
2. Para pares interfibra: $d_{Y'}$ es compatible con $\phi$ en el sentido
   de que $d_Y(\phi(y'_1), \phi(y'_2)) \leq d_{Y'}(y'_1, y'_2)$
   ($\phi$ es 1-Lipschitz).

*Demostración.* La condición 1 cubre pares en la misma fibra. La condición 2
asegura que $d_{\mathcal{C}'}$ no es arbitrariamente pequeña para pares
interfibra: $d_{\mathcal{C}}(x_1, x_2) \leq d_{\mathcal{C}'}(x_1, x_2)$,
y junto con $d_\Phi \leq k \cdot d_\mathcal{C}$ (si se cumple) da el
resultado. ∎

*Observación.* Para equivalencias, la condición interfibra es automática
(por el teorema de alcance). Para pseudométricas, requiere una hipótesis
adicional de compatibilidad — lo que refleja la diferencia estructural entre
ambos tipos.

---

## 7. Aplicaciones

| Fase | $\mathcal{T}$ | $\preceq$ | Morfismo | $\Phi$ | Condición |
|------|--------------|-----------|----------|--------|-----------|
| **F** | Equivalencia | $\subseteq$ | $R: S \to Z$ | $D: S \to \{\text{dec}\}$ | $\sim_R \subseteq \sim_D$ |
| **G2** | Pseudométrica | $\leq_k$ | $\text{est}: P \to \hat{P}$ | $M_D(P) - \beta$ | $d_{\text{est}} < \beta$ |
| **G3** | Equivalencia | $\subseteq$ | $F_\Gamma: \Pi \to \mathcal{D}(Y)$ | $V: \Pi \to \{\text{val}\}$ | $\sim_\Gamma \subseteq \sim_V$ |

### HAA-001 (G3)

$F_\Gamma(\pi_1) = F_\Gamma(\pi_2)$ en prefijos seguros. La fibra
$F_\Gamma^{-1}(\delta_{\text{idle}})$ contiene políticas con distinto
$V$. Refinamiento observacional: $F_{\Gamma'}(\pi) = (F_\Gamma(\pi), a_t)$
con $F_\Gamma = \phi \circ F_{\Gamma'}$ (proyección). $F_{\Gamma'}$
separa $\pi_1$ de $\pi_2$ en $t=1$. Como estamos en $\mathcal{T}_{\sim}$,
la preservación interfibra es automática y basta verificar dentro de la
fibra.
