# Teoría de Contracciones y Refinamientos

**Núcleo matemático.** Contracciones, estructuras inducidas, preservación,
factorización, refinamientos. Todo lo demás (mecanismos, Fase F, G2, G3,
HAA-001) son aplicaciones o ejemplos de diseño.

---

## 1. Contracción y estructura inducida

Sea $\mathcal{C}: X \to Y$ una función arbitraria. $\mathcal{C}$ induce una
**equivalencia** sobre $X$:

$$
x \sim_\mathcal{C} x' \iff \mathcal{C}(x) = \mathcal{C}(x')
$$

Las clases de equivalencia son las **fibras** $\mathcal{C}^{-1}(y)$,
$y \in Y$.

Dada una propiedad $\Phi: X \to \{0,1\}$, definimos su equivalencia inducida:

$$
x \sim_\Phi x' \iff \Phi(x) = \Phi(x')
$$

---

## 2. Preservación

Decimos que $\mathcal{C}$ **preserva** $\Phi$ si:

$$
\sim_\mathcal{C} \subseteq \sim_\Phi
$$

*Interpretación.* Si dos elementos son indistinguibles por $\mathcal{C}$,
tampoco deben ser distinguibles por $\Phi$. Equivalentemente:
$\mathcal{C}(x_1) = \mathcal{C}(x_2) \implies \Phi(x_1) = \Phi(x_2)$.

---

## 3. Principio de factorización

Sea $\mathcal{C}: X \to Y$ una contracción. Para $x_1, x_2 \in X$ con
$\mathcal{C}(x_1) = \mathcal{C}(x_2)$, toda estructura $S$ definida sobre
$Y$ (métrica, divergencia, orden, topología) induce

$$
S_\mathcal{C}(x_1, x_2) = S(y, y) = 0
$$

La fibra $\mathcal{C}^{-1}(y)$ es un **límite absoluto** para toda
estructura sobre el codominio. Ninguna refinación post-hoc de $Y$ puede
distinguir elementos en la misma fibra de $\mathcal{C}$.

---

## 4. Refinamiento de contracción

Un **refinamiento** de $\mathcal{C}: X \to Y$ es un par $(\mathcal{C}', \phi)$
donde $\mathcal{C}': X \to Y'$ y $\phi: Y' \to Y$ cumplen:

$$
\mathcal{C} = \phi \circ \mathcal{C}'
$$

```
          C'
    X ───────→ Y'
     \          │
      \   C     │ φ
       \        ↓
        ─────→ Y
```

De la factorización: $\sim_{\mathcal{C}'} \subseteq \sim_{\mathcal{C}}$
(el refinamiento hereda todas las distinciones y puede añadir otras).

**Casos extremos:**
- **Trivial:** $\mathcal{C}' = \mathcal{C}$, $\phi = \text{id}_Y$.
- **Maximal:** $\mathcal{C}'(x) = x$ (identidad sobre $X$). Induce la
  equivalencia más fina posible. Solución teórica, no siempre factible.

---

## 5. Teorema de caracterización

**Teorema.** Sea $\mathcal{C}: X \to Y$ y $\mathcal{C}': X \to Y'$ un
refinamiento con $\mathcal{C} = \phi \circ \mathcal{C}'$. Entonces:

$$
\sim_{\mathcal{C}'} \subseteq \sim_\Phi
$$

si y solo si $\mathcal{C}'$ separa, dentro de cada fibra de $\mathcal{C}$,
los pares que $\Phi$ separa.

*Demostración.* La condición $\sim_{\mathcal{C}'} \subseteq \sim_\Phi$ es la
definición de preservación. El contenido del teorema es que, por la
factorización $\mathcal{C} = \phi \circ \mathcal{C}'$, las fibras de
$\mathcal{C}$ son bloques dentro de los cuales $\mathcal{C}'$ opera;
$\mathcal{C}'$ nunca necesita separar elementos de distintas fibras de
$\mathcal{C}$ porque $\mathcal{C}$ ya las separa. Por tanto el problema se
reduce a refinar cada fibra $\mathcal{C}^{-1}(y)$ en subfibras que
separen los valores de $\Phi$. ∎

**Corolario (la fibra como unidad de refinamiento).** No es necesario
refinar fibras que ya son $\Phi$-homogéneas. El refinamiento actúa
únicamente sobre las fibras $\mathcal{C}^{-1}(y)$ que contienen elementos
con distintos valores de $\Phi$.

---

## 6. Aplicaciones

### Fase F: preservación de decisiones

- Contracción $R: S \to Z$ (representación).
- Propiedad $\Phi = D: S \to \{\text{decisión}\}$.
- Preservación: $\sim_R \subseteq \sim_D$.
- Si falla: refinar $R$ añadiendo información a $Z$.

### Fase G2: preservación de garantías

- Contracción $P \xrightarrow{\text{est}} \hat{P}$ (estimación de modelo).
- Propiedad $\Phi = M_D(P) - \beta > \theta$ (garantía de margen).
- Preservación: $d_{\text{est}}(P_{\text{true}}, \hat{P}) < \beta$.
- La estructura no es de equivalencias sino de pseudométricas. La teoría
  de refinamientos se extiende: ya no refinar fibras, sino **reducir la
  distancia de estimación**.

### Fase G3: preservación de certificados

- Contracción $F_\Gamma: \Pi \to \mathcal{D}(Y)$ (políticas a distribuciones).
- Propiedad $\Phi = V: \Pi \to \{\text{válido}, \text{inválido}\}$.
- Preservación: $\sim_\Gamma \subseteq \sim_V$.
- **HAA-001:** $F_\Gamma(\pi_1) = F_\Gamma(\pi_2)$ en prefijos seguros.
  Fibra $F_\Gamma^{-1}(\delta_{\text{idle}})$ contiene políticas con
  distinto $\Phi$. El teorema de caracterización exige refinar esta fibra.

---

## 7. Mecanismos de refinamiento (ejemplos de diseño)

Una vez establecida la teoría, los mecanismos son instancias que realizan
el refinamiento:

| Mecanismo | $\mathcal{C}'$ | $\phi$ | Refina fibra |
|-----------|---------------|--------|-------------|
| Observacional | $\mathcal{C}'(x) = (\mathcal{C}(x), \omega(x))$ | Proyección | Añade observables |
| Temporal | $\mathcal{C}'(x) = \text{seq}_t(\mathcal{C}(x))$ | Proyección al último | Añade memoria |
| Interactivo | $\mathcal{C}'(x) = (\mathcal{C}(x), \text{probe}(x))$ | Proyección | Añade sondeos |
| Causal | $\mathcal{C}'(x) = (\mathcal{C}(x), do(X=x'))$ | Proyección | Añade intervenciones |

Todos satisfacen $\mathcal{C} = \phi \circ \mathcal{C}'$ — son refinamientos
en sentido estricto.

### Ejemplo: HAA-001 con refinamiento observacional

$F_{\Gamma'}(\pi) = (F_\Gamma(\pi), a_t)$ donde $a_t$ es la acción en el
instante $t$. El morfismo $\phi$ es la proyección a $F_\Gamma(\pi)$. Este
refinamiento separa $\pi_{\text{wait}}$ de $\pi_{\text{attackAt(k)}}$ en
$t=1$ porque la primera acción difiere.
