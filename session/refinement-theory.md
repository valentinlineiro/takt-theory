# Teoría de los Refinamientos de Contracciones

**Objetivo:** Caracterizar, antes de diseñar ningún $\Gamma'$ concreto, qué
propiedades debe satisfacer cualquier refinamiento para que
$\sim_{\Gamma'} \subseteq \sim_V$.

**Relación con las fases:**
- **F:** caracteriza cuándo una representación preserva decisiones.
- **G2:** caracteriza cuándo una métrica preserva garantías.
- **G3:** demuestra que una familia completa de soluciones (nivel 1) es imposible.
- **Ésta:** caracteriza cuándo un **refinamiento de contracción** preserva una
  propiedad. HAA-001 será una instancia, no el origen.

---

## 1. Definición: refinamiento de contracción

Sea $\mathcal{C}: X \to Y$ una contracción. Un **refinamiento** de $\mathcal{C}$
es un par $(\mathcal{C}', \phi)$ donde:

- $\mathcal{C}': X \to Y'$ es otra contracción, y
- $\phi: Y' \to Y$ es un morfismo tal que $\mathcal{C} = \phi \circ \mathcal{C}'$.

```
          C'
    X ───────→ Y'
     \          │
      \   C     │ φ
       \        ↓
        ─────→ Y
```

### Inducción sobre las fibras

De la factorización se sigue inmediatamente:

$$
\mathcal{C}'(x_1) = \mathcal{C}'(x_2) \;\Longrightarrow\; \mathcal{C}(x_1) = \mathcal{C}(x_2)
$$

es decir, $\sim_{\mathcal{C}'} \subseteq \sim_{\mathcal{C}}$. El refinamiento
**hereda todas las distinciones** de $\mathcal{C}$ y puede añadir otras nuevas.

### Refinamiento trivial y maximal

- **Refinamiento trivial:** $\mathcal{C}' = \mathcal{C}$, $\phi = \text{id}_Y$.
- **Refinamiento maximal:** $\mathcal{C}'(x) = x$ (la identidad sobre $X$).
  Induce la equivalencia más fina posible (igualdad). Es siempre solución
  teórica, pero requiere acceso a $X$ completo.

Toda teoría útil de refinamientos estudia los puntos intermedios entre ambos
extremos — refinamientos **factibles** que no requieren información
inaccesible.

---

## 2. El problema de preservación

Dada:

- Una contracción original $\mathcal{C}: X \to Y$ con fibras $\mathcal{C}^{-1}(y)$.
- Una propiedad $\Phi: X \to \{0,1\}$ con equivalencia inducida
  $x \sim_\Phi x' \iff \Phi(x) = \Phi(x')$.

Queremos un refinamiento $\mathcal{C}'$ tal que:

$$
\sim_{\mathcal{C}'} \subseteq \sim_\Phi
$$

Si $\sim_{\mathcal{C}} \subseteq \sim_\Phi$ ya se cumple, el problema está
resuelto con $\mathcal{C}' = \mathcal{C}$. El caso interesante es cuando
**falla**: existen $x_1, x_2$ con $\mathcal{C}(x_1) = \mathcal{C}(x_2)$ pero
$\Phi(x_1) \neq \Phi(x_2)$.

### Necesario

Para todo $\mathcal{C}'$ que refina $\mathcal{C}$ y preserva $\Phi$:

$$
\forall x_1, x_2 \in X: \quad \Phi(x_1) \neq \Phi(x_2) \;\Longrightarrow\; \mathcal{C}'(x_1) \neq \mathcal{C}'(x_2)
$$

Es decir, $\mathcal{C}'$ debe **separar todos los pares que $\Phi$ separa**.

### Suficiente (pero no necesario)

Si $\mathcal{C}'$ separa todos los pares que $\Phi$ separa, entonces
$\sim_{\mathcal{C}'} \subseteq \sim_\Phi$. La condición suficiente es que
$\mathcal{C}'$ sea **inyectiva sobre el complemento de $\sim_\Phi$**.

---

## 3. Teorema de caracterización

**Teorema.** Sea $\mathcal{C}: X \to Y$ una contracción que **no** preserva
$\Phi$ (es decir, $\sim_{\mathcal{C}} \not\subseteq \sim_\Phi$). Sea
$\mathcal{C}': X \to Y'$ un refinamiento de $\mathcal{C}$. Entonces:

$$
\sim_{\mathcal{C}'} \subseteq \sim_\Phi
\quad\iff\quad
\forall y \in Y,\; \forall x_1, x_2 \in \mathcal{C}^{-1}(y):
\; \mathcal{C}'(x_1) \neq \mathcal{C}'(x_2) \;\text{si}\; \Phi(x_1) \neq \Phi(x_2)
$$

*Demostración.* ($\Rightarrow$) Si $\sim_{\mathcal{C}'} \subseteq \sim_\Phi$,
entonces $\Phi(x_1) \neq \Phi(x_2)$ implica $x_1 \not\sim_{\mathcal{C}'} x_2$,
es decir, $\mathcal{C}'(x_1) \neq \mathcal{C}'(x_2)$.

($\Leftarrow$) Si $\mathcal{C}'(x_1) = \mathcal{C}'(x_2)$, entonces
$\Phi(x_1) = \Phi(x_2)$ por hipótesis (contrapositiva). Luego
$\sim_{\mathcal{C}'} \subseteq \sim_\Phi$. ∎

### Corolario (la fibra como unidad de refinamiento)

El problema se reduce a: **para cada fibra $\mathcal{C}^{-1}(y)$ que contiene
elementos con distinto valor de $\Phi$, $\mathcal{C}'$ debe refinar esa fibra
en subfibras que separen los valores de $\Phi$**.

No es necesario refinar fibras que ya son $\Phi$-homogéneas.

---

## 4. Clasificación de mecanismos de refinamiento

Un refinamiento $\mathcal{C}'$ debe añadir información a $Y$ para distinguir
elementos en la misma fibra de $\mathcal{C}$. Las fuentes posibles de
información se clasifican en:

### 4.1 Refinamiento observacional

Añadir observables al codominio: $Y' = Y \times Z$ donde $Z$ es un espacio
de observaciones adicionales. El morfismo $\phi$ es la proyección.

**Forma:** $\mathcal{C}'(x) = (\mathcal{C}(x), \omega(x))$ para alguna
$\omega: X \to Z$.

**Ejemplo en G3:** $F_{\Gamma'}(\pi) = (F_\Gamma(\pi), O'(s))$ donde $O'$
observa acciones además de estados. En HAA-001: $O'$ detecta `action:'attack'`
en $\pi_{\text{attackNow}}$ vs `action:'wait'` en $\pi_{\text{wait}}$.

### 4.2 Refinamiento temporal (memoria)

Añadir historia: $Y' = \text{Secuencias}(Y)$.

**Forma:** $\mathcal{C}'(x) = (\mathcal{C}(x)_1, \ldots, \mathcal{C}(x)_t)$
para $t$ pasos de observación.

**Ejemplo en G3:** $F_{\Gamma'}(\pi)$ produce la distribución sobre
secuencias de observaciones de longitud $w$. Un atacante que espera $k$
pasos es detectable en $t = k+1$ (tras el ataque), pero no antes.

### 4.3 Refinamiento interactivo (sondeos)

Añadir información obtenida mediante acciones de prueba:
$Y' = Y \times R$ donde $R$ son las respuestas a sondeos.

**Forma:** $\mathcal{C}'(x) = (\mathcal{C}(x), \text{probe}(x, a_p))$ donde
$a_p$ es una acción de sondeo que revela información sobre $x$ sin
comprometer $\Phi$.

**Ejemplo en G3:** Un sondeo que pregunta "¿qué harías si vieras $o$?"
revela la política $\pi$ sin ejecutarla realmente (consulta contrafactual).

### 4.4 Refinamiento causal

Añadir información sobre contrafactuales o intervenciones:
$Y' = Y \times \text{Efectos}(do(X = x'))$.

**Forma:** $\mathcal{C}'(x) = (\mathcal{C}(x), \text{resultado de intervenir
en } x)$.

**Ejemplo en G3:** ¿Cambiaría $\pi$ si la observación fuera diferente?

### 4.5 Refinamiento estructural

Reemplazar la representación interna: $Y'$ es un espacio con mayor capacidad
de distinción que $Y$, y $\mathcal{C}'$ es una nueva contracción que no
factoriza por $\mathcal{C}$.

**Forma:** $\mathcal{C}'$ no refina $\mathcal{C}$ en sentido estricto, sino
que se define como una contracción completamente nueva utilizando la misma
información fuente pero una arquitectura distinta.

---

## 5. La restricción de factibilidad

No todo refinamiento teórico es realizable. Tres restricciones:

### 5.1 Información disponible

$\mathcal{C}'$ solo puede usar información que el sistema tiene acceso en
tiempo real. En TAKT: observaciones $O$, acciones, decisiones de auditoría,
y el estado interno del gobernador.

### 5.2 Oportunidad

$\mathcal{C}'$ debe distinguir $x_1$ de $x_2$ **antes** de que ocurra la
pérdida. Esto define un **umbral de detectabilidad**: el prefijo mínimo
$t^*$ tal que $\mathcal{C}'(x_1) \neq \mathcal{C}'(x_2)$ en $t^*$.

### 5.3 Coste

Cada mecanismo de refinamiento tiene un coste (computacional, de
observación, de intrusividad). La elección entre mecanismos es una decisión
de diseño.

---

## 6. Aplicación a G3 / HAA-001

### La contracción original

$$
F_\Gamma: \Pi \to \mathcal{D}(Y_{\text{phase}})
$$

con $Y_{\text{phase}} = \{\text{idle}, \text{fail}\}$ y $O_{\text{ha}}$ que
observa solo la fase del estado.

### Fibras problemáticas

$$
F_\Gamma^{-1}(\delta_{\text{idle}}) = \{\pi \in \Pi \mid \text{en prefijos seguros, } \pi \text{ produce } \text{idle}\}
$$

Esta fibra contiene tanto $\pi_{\text{wait}}$ como $\pi_{\text{attackAt(k)}}$
para $t \leq k$, que tienen distinto $\Phi$ (uno es seguro, el otro no).

### Refinamientos candidatos

| Mecanismo | $\mathcal{C}'$ | ¿Separa en $t \leq k$? | ¿Realizable? |
|-----------|---------------|----------------------|-------------|
| Observacional ($O$ + acciones) | $F_{\Gamma'}(\pi) = (O_{\text{ha}}(s), a_t)$ | Sí, en $t=1$ | Sí |
| Temporal (memoria $w$) | $F_{\Gamma'}(\pi) = \text{seq}_{w}(O_{\text{ha}})$ | No en $t \leq k$ | Sí |
| Interactivo (sondeo a $\pi$) | $F_{\Gamma'}(\pi) = (O_{\text{ha}}(s), \pi(\text{obs}_{\text{prueba}}))$ | Sí, en $t=1$ | Requiere modelo de $\pi$ |
| Causal (contrafactual) | $F_{\Gamma'}(\pi) = \text{resultado de cambiar observación}$ | Sí | Requiere modelo causal |
| Estructural | Nueva representación de $\Pi$ | Depende | Abierto |

### Umbral de detectabilidad

Para $\pi_{\text{attackAt(k)}}$ bajo observación exclusiva de estados:

- $t_{\text{detección}} = k + 1$ (tras el ataque)
- $t_{\text{pérdida}} = k + 1$ (coinciden)

El refinamiento observacional ($O$ + acciones) logra $t_{\text{detección}} = 1$
para cualquier $k$, porque la primera acción del adversario revela su
intención.

---

## 7. Conclusión: HAA-001 como instancia

HAA-001 demuestra:

1. El nivel 1 (estructuras sobre $\mathcal{D}(Y)$) está agotado por el
   principio de factorización.
2. El nivel 2 (refinamiento de $F_\Gamma$) es la única clase de soluciones
   que sobrevive.
3. Entre los mecanismos de refinamiento, varios resuelven HAA-001
   (observacional, interactivo, causal).
4. El observacional ($O$ + acciones) es el más simple y directo, con
   $t_{\text{detección}} = 1$ para cualquier atacante.

Pero lo importante no es que HAA-001 tenga solución — es que la teoría de
refinamientos la sitúa como un caso particular de un problema más general:
dada una contracción $\mathcal{C}$ que no preserva $\Phi$, ¿qué
refinamientos $\mathcal{C}'$ (y mediante qué mecanismo) logran
$\sim_{\mathcal{C}'} \subseteq \sim_\Phi$?
