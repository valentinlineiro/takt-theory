# Teoría de Morfismos, Contracciones y Preservación

**Núcleo.** Cuatro conceptos: morfismo, propiedad, preservación, refinamiento.
Generan dos regímenes (categórico y cuantitativo) que unifican F, G2 y G3.

---

## 1. Morfismo y estructura inducida

Un **morfismo** $\mathcal{C}: X \to Y$ induce sobre $X$ la equivalencia

$$
x \sim_\mathcal{C} x' \iff \mathcal{C}(x) = \mathcal{C}(x')
$$

cuyas clases son las **fibras** $\mathcal{C}^{-1}(y)$. La palabra
"contracción" se reserva para el caso $\mathcal{C}$ **no inyectivo** (existen
$x_1 \neq x_2$ con $\mathcal{C}(x_1) = \mathcal{C}(x_2)$). La teoría funciona
para morfismos arbitrarios; las contracciones son el caso interesante.

Una propiedad $\Phi: X \to \{0,1\}$ induce su propia equivalencia:

$$
x \sim_\Phi x' \iff \Phi(x) = \Phi(x')
$$

---

## 2. Preservación

La preservación es una relación entre **estructuras inducidas** sobre $X$.
El tipo de estructura determina la forma de la relación:

| Régimen | Estructura | Preservación | Fases |
|---------|-----------|-------------|-------|
| **Categórico** | Equivalencia $\sim$ | $\sim_\mathcal{C} \subseteq \sim_\Phi$ | F, G3 |
| **Cuantitativo** | Pseudométrica $d$ | $d_\Phi(\mathcal{C}(x_1), \mathcal{C}(x_2)) \leq k \cdot d_\mathcal{C}(x_1, x_2)$ | G2 |

### 2.1 Preservación categórica

$$
\mathcal{C}(x_1) = \mathcal{C}(x_2) \;\Longrightarrow\; \Phi(x_1) = \Phi(x_2)
$$

*Interpretación.* Las fibras de $\mathcal{C}$ son $\Phi$-homogéneas: el
morfismo no agrupa elementos que la propiedad distingue.

### 2.2 Preservación cuantitativa

El morfismo $\mathcal{C}$ induce una pseudométrica $d_\mathcal{C}$ sobre
$X$ mediante pullback de una métrica sobre $Y$. La propiedad $\Phi$ induce
$d_\Phi$ similarmente. La preservación exige que $d_\mathcal{C}$ **acote**
a $d_\Phi$:

$$
d_\Phi(x_1, x_2) \leq k \cdot d_\mathcal{C}(x_1, x_2)
$$

*Interpretación.* Elementos cercanos según $\mathcal{C}$ no pueden tener
valores de $\Phi$ arbitrariamente distantes.

---

## 3. Principio de factorización

Para todo morfismo $\mathcal{C}: X \to Y$ y cualesquiera $x_1, x_2$ con
$\mathcal{C}(x_1) = \mathcal{C}(x_2)$, toda estructura $S$ definida sobre
$Y$ (métrica, divergencia, orden, topología) induce

$$
S_\mathcal{C}(x_1, x_2) = S(y, y) = 0
$$

La fibra $\mathcal{C}^{-1}(y)$ es un **límite absoluto** para toda estructura
sobre el codominio. Válido para ambos regímenes.

---

## 4. Refinamiento

Un **refinamiento** de $\mathcal{C}: X \to Y$ es un par $(\mathcal{C}', \phi)$
donde $\mathcal{C}': X \to Y'$ y $\phi: Y' \to Y$ cumplen:

$$
\mathcal{C} = \phi \circ \mathcal{C}'
$$

De la factorización: $\sim_{\mathcal{C}'} \subseteq \sim_{\mathcal{C}}$
(el refinamiento hereda las distinciones y puede añadir otras). En el régimen
cuantitativo: $d_{\mathcal{C}'} \geq d_\mathcal{C}$ (métrica más fina).

---

## 5. Teorema de caracterización

### Régimen categórico

**Teorema.** Sea $\mathcal{C}: X \to Y$ y $\mathcal{C}': X \to Y'$ un
refinamiento. Entonces $\sim_{\mathcal{C}'} \subseteq \sim_\Phi$ si y solo
si $\mathcal{C}'$ separa, dentro de cada fibra de $\mathcal{C}$, los pares
que $\Phi$ separa.

**Corolario (fibra como unidad).** No es necesario refinar fibras
$\Phi$-homogéneas. El refinamiento actúa únicamente sobre las fibras que
mezclan valores de $\Phi$.

### Régimen cuantitativo

**Teorema.** Sea $\mathcal{C}: X \to Y$ con pseudométrica inducida
$d_\mathcal{C}$, y $\mathcal{C}'$ un refinamiento. Entonces
$d_\Phi \leq k \cdot d_{\mathcal{C}'}$ si y solo si, para toda fibra
$\mathcal{C}^{-1}(y)$, $d_{\mathcal{C}'}$ acota $d_\Phi$ dentro de ella.

*Demostración.* Análoga al caso categórico: la factorización garantiza que
elementos en distintas fibras ya están separados por $d_\mathcal{C}$; el
refinamiento solo necesita mejorar la resolución dentro de cada fibra. ∎

---

## 6. Unificación

Ambos regímenes son casos de un mismo esquema:

1. **Morfismo** $\mathcal{C}: X \to Y$ induce estructura $S_\mathcal{C}$ sobre $X$.
2. **Propiedad** $\Phi: X \to \{0,1\}$ (o $\Phi: X \to \mathbb{R}$) induce
   estructura $S_\Phi$ sobre $X$.
3. **Preservación:** $S_\mathcal{C} \preceq S_\Phi$, donde $\preceq$ depende
   del tipo de estructura.
4. **Si falla:** refinar $\mathcal{C}$ a $\mathcal{C}'$ con
   $\mathcal{C} = \phi \circ \mathcal{C}'$.
5. **Teorema:** el refinamiento actúa dentro de las fibras de $\mathcal{C}$.

| Componente | F | G2 | G3 |
|-----------|--|----|----|
| Morfismo | $R: S \to Z$ | $\text{est}: P \to \hat{P}$ | $F_\Gamma: \Pi \to \mathcal{D}(Y)$ |
| $\Phi$ | $D: S \to \{\text{dec}\}$ | $M_D(P) - \beta$ | $V: \Pi \to \{\text{val}\}$ |
| Estructura | Equivalencia | Pseudométrica | Equivalencia |
| Preservación | $\sim_R \subseteq \sim_D$ | $d_{\text{est}} < \beta$ | $\sim_\Gamma \subseteq \sim_V$ |
| Refinamiento | $R'$ más fina | Estimar con menor error | $F_{\Gamma'}$ más fina |

---

## 7. Mecanismos de refinamiento (ejemplos de diseño)

| Mecanismo | $\mathcal{C}'$ | $\phi$ | Refina |
|-----------|---------------|--------|--------|
| Observacional | $(\mathcal{C}(x), \omega(x))$ | Proyección | Codominio |
| Temporal | $\text{seq}_t(\mathcal{C}(x))$ | Último elemento | Memoria |
| Interactivo | $(\mathcal{C}(x), \text{probe}(x))$ | Proyección | Sondeos |
| Causal | $(\mathcal{C}(x), do(X=x'))$ | Proyección | Intervenciones |

### HAA-001

- **Problema:** $F_\Gamma(\pi_1) = F_\Gamma(\pi_2)$ en prefijos seguros.
  Fibra $F_\Gamma^{-1}(\delta_{\text{idle}})$ contiene políticas seguras e
  inseguras.
- **Refinamiento observacional:** $F_{\Gamma'}(\pi) = (F_\Gamma(\pi), a_t)$.
  Separa $\pi_1$ de $\pi_2$ en $t=1$.
- **Verificación:** $F_\Gamma = \phi \circ F_{\Gamma'}$ con $\phi$ la
  proyección. $\sim_{\Gamma'} \subseteq \sim_V$ se satisface.
