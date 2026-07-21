# ST-015: Structural Sufficiency Theorem — Model

> **Objetivo del modelo.** Fijar el objeto matemático sobre el que se
> construye el teorema de suficiencia estructural. No contiene resultados
> — solo las definiciones y la estructura formal.

---

## 1. Objeto de estudio

### 1.1 Espacio de estados

Sea $S$ un conjunto (posiblemente infinito) de estados del mundo.
Cada estado $s \in S$ codifica toda la información relevante para un
sistema de decisión, incluyendo tanto el estado observable del pipeline
como el estado del mundo externo.

### 1.2 Decisiones

Una **decisión** $D: S \to A$ es una función determinista que asigna a
cada estado una acción. El núcleo de $D$ es:

$$
\ker(D) = \{ (s_1, s_2) \in S \times S : D(s_1) = D(s_2) \}
$$

$\ker(D)$ es una relación de equivalencia: $s_1 \sim_D s_2$ si y solo si
$D$ prescribe la misma acción para ambos.

### 1.3 Representaciones

Una **representación** $R: S \to Z$ es una función del espacio de
estados a un espacio de código $Z$. Su núcleo:

$$
\ker(R) = \{ (s_1, s_2) \in S \times S : R(s_1) = R(s_2) \}
$$

es la relación de equivalencia que identifica estados que $R$ no puede
distinguir.

### 1.4 Orden de refinamiento

Definimos el **orden de refinamiento** en el conjunto de representaciones:

$$
R_1 \sqsubseteq R_2 \iff \ker(R_2) \subseteq \ker(R_1)
$$

$R_1 \sqsubseteq R_2$ significa que $R_1$ es **más fina** que $R_2$
(hace al menos las mismas distinciones). El orden es inverso a la
inclusión de núcleos.

El conjunto $\mathcal{R} = \{ R : S \to Z \}$ con $\sqsubseteq$ forma
un preorden. Identificando representaciones con el mismo núcleo
($R_1 \sim R_2$ si $\ker(R_1) = \ker(R_2)$), obtenemos un orden parcial
— el retículo de equivalencias sobre $S$.

### 1.5 Suficiencia

Decimos que $R$ es **suficiente** para $D$ cuando:

$$
\ker(R) \subseteq \ker(D)
$$

Esto es exactamente la condición de seguridad del Canonical Core v1.0
(Teorema 4): la representación preserva la decisión. $D$ factoriza a
través de $R$:

$$
\exists \pi: Z \to A \text{ tal que } D = \pi \circ R
$$

### 1.6 El conjunto suficiente

Definimos:

$$
\mathcal{R}_{sufficient}(D) = \{ R \in \mathcal{R} : \ker(R) \subseteq \ker(D) \}
$$

---

## 2. Modelo de capacidades

### 2.1 Capacidades como relaciones de equivalencia

CARD-356 define una capacidad $c \in \mathcal{C}$ como "un identificador
tipado que representa una clase de evidencia que una representación puede
proveer". Formalizamos cada capacidad $c$ como una **relación de
equivalencia** $K_c \subseteq S \times S$:

$$
K_c = \{ (s_1, s_2) \in S \times S : \text{la evidencia para } c
\text{ es equivalente en } s_1 \text{ y } s_2 \}
$$

$K_c$ identifica los pares de estados que $c$ no puede distinguir. Una
representación $R$ provee $c$ si y solo si distingue todos los pares
que $c$ distingue:

$$
R \text{ provee } c \iff \ker(R) \subseteq K_c
$$

### 2.2 El conjunto de capacidades de una representación

Dada una representación $R$, su conjunto de capacidades provistas es:

$$
C_R = \{ c \in \mathcal{C} : \ker(R) \subseteq K_c \}
$$

**Observación fundamental.** $C_R$ es un conjunto decreciente en el
orden de refinamiento: si $R_1 \sqsubseteq R_2$ ($R_1$ es más fina),
entonces $C_{R_1} \supseteq C_{R_2}$. Una representación más fina
provee al menos las mismas capacidades.

### 2.3 Requisitos de una decisión

Toda decisión $D$ declara un conjunto de capacidades requeridas:

$$
C_D = \{ c \in \mathcal{C} : D \text{ requiere } c \}
$$

El **gap de capacidad** es la diferencia:

$$
G(D,R) = C_D - C_R
$$

### 2.4 Axioma de Coherencia del Contrato

$C_D$ no es arbitrario. Describe la misma realidad que $D$ desde el
lenguaje de capacidades:

> **Axioma (Contract Coherence).**
> Para toda decisión $D$, el conjunto de capacidades requeridas $C_D$
> es completo y exacto:
>
> $$
> \ker(D) = \bigcap_{c \in C_D} K_c
> $$

Este axioma unifica los dos lenguajes:

- Desde la decisión ($\ker(D)$), la condición de seguridad exige
  $\ker(R) \subseteq \ker(D)$.
- Desde el contrato ($C_D$), la verificación exige $C_D \subseteq C_R$,
  que equivale a $\ker(R) \subseteq \bigcap K_c = K_D$.

El axioma afirma que ambas exigencias describen la misma frontera.
Sin él existirían dos nociones independientes de suficiencia y T1
no podría unificarlas. La verificación operacional (CARD-355) y la
condición de seguridad teórica coinciden precisamente porque el
contrato es coherente.

**Convención para $C_D = \emptyset$.** Cuando el conjunto de
capacidades requeridas es vacío, tenemos $\ker(D) = S \times S$
(por el axioma: $K_D = \bigcap \emptyset = S \times S$). Una decisión
sin requisitos de capacidad es trivialmente preservada por toda
representación.

---

## 3. El núcleo de capacidad $K_D$

### 3.1 Definición

Dado $C_D = \{ c_1, c_2, \dots, c_n \}$, definimos el **núcleo de
capacidad** de $D$ como la intersección de las equivalencias de cada
capacidad requerida:

$$
K_D = \bigcap_{c \in C_D} K_c
$$

**Propiedades:**

1. $K_D$ es una relación de equivalencia (intersección de equivalencias).
2. $K_D \subseteq K_c$ para todo $c \in C_D$ (refina cada $K_c$).
3. Si $C_D = \emptyset$, entonces $K_D = S \times S$ (todo es equivalente).

### 3.2 La condición de suficiencia en términos de $K_D$

**Proposición 1 (Suficiencia por núcleo de capacidad).**

$$
R \in \mathcal{R}_{sufficient}(D) \iff \ker(R) \subseteq K_D
$$

*Demostración.* ($\Rightarrow$) Si $R$ es suficiente,
$\ker(R) \subseteq \ker(D)$. Por el Axioma de Coherencia del Contrato
($\ker(D) = \bigcap_{c \in C_D} K_c$), se sigue inmediatamente
$\ker(R) \subseteq \bigcap_{c \in C_D} K_c = K_D$.

($\Leftarrow$) Si $\ker(R) \subseteq K_D$, entonces para cada
$c \in C_D$, $\ker(R) \subseteq K_D \subseteq K_c$, luego $R$ provee
$c$. Por tanto $C_D \subseteq C_R$, luego $G(D,R) = \emptyset$.
El runtime autoriza la ejecución. Por el Axioma de Coherencia,
$K_D = \ker(D)$, luego $\ker(R) \subseteq \ker(D)$. ∎

**Corolario 1.** La suficiencia es una propiedad de la inclusión de
núcleos, no de la decisión directamente. $D$ solo importa a través
de $K_D$.

---

## 4. Estructura de $\mathcal{R}_{sufficient}(D)$

### 4.1 $\mathcal{R}_{sufficient}(D)$ como upset

**Proposición 2 (Upset).** $\mathcal{R}_{sufficient}(D)$ es un upset
en $(\mathcal{R}, \sqsubseteq)$: si $R \in \mathcal{R}_{sufficient}(D)$
y $R \sqsubseteq R'$, entonces $R' \in \mathcal{R}_{sufficient}(D)$.

*Demostración.* $R \sqsubseteq R'$ implica $\ker(R') \subseteq \ker(R)$.
Dado $\ker(R) \subseteq K_D$ (por Proposición 1), tenemos
$\ker(R') \subseteq \ker(R) \subseteq K_D$, luego
$R' \in \mathcal{R}_{sufficient}(D)$. ∎

Una representación más fina que una suficiente también es suficiente.
Intuitivamente: añadir distinciones nunca rompe la suficiencia.

### 4.2 El elemento mínimo

**Proposición 3 (Mínimo suficiente).** Si existe una representación
$R_{min}$ tal que $\ker(R_{min}) = K_D$, entonces $R_{min}$ es el
elemento mínimo de $\mathcal{R}_{sufficient}(D)$:

1. $R_{min} \in \mathcal{R}_{sufficient}(D)$.
2. Para toda $R \in \mathcal{R}_{sufficient}(D)$,
   $R \sqsubseteq R_{min}$.

*Demostración.* (1) $\ker(R_{min}) = K_D \subseteq K_D$, luego por
Proposición 1, $R_{min}$ es suficiente.
(2) Si $R$ es suficiente, $\ker(R) \subseteq K_D = \ker(R_{min})$.
Esto significa $R \sqsubseteq R_{min}$ (por definición del orden de
refinamiento). ∎

**Observación.** $R_{min}$ existe en el sentido matemático: siempre
podemos construir la representación cociente $S \to S / K_D$. La
pregunta relevante no es existencia matemática sino **alcanzabilidad**
desde una representación base $R_0$ mediante el espacio de
enriquecimiento $\mathcal{E}$, que es un problema del plano operacional
(CARD-357/358). ST-015 caracteriza la frontera; no garantiza que sea
alcanzable.

### 4.3 Unicidad

**Corolario 2 (Unicidad del mínimo).** El mínimo de
$\mathcal{R}_{sufficient}(D)$ es único salvo equivalencia de núcleos.

*Demostración.* Si $R_{min}$ y $R'_{min}$ son ambos mínimos, entonces
$R_{min} \sqsubseteq R'_{min}$ y $R'_{min} \sqsubseteq R_{min}$. Esto
implica $\ker(R_{min}) \subseteq \ker(R'_{min})$ y
$\ker(R'_{min}) \subseteq \ker(R_{min})$, luego
$\ker(R_{min}) = \ker(R'_{min})$, que es la identificación del orden
parcial. ∎

---

## 5. Correspondencia con el gap de capacidad

### 5.1 Gap de núcleo

Definimos el **gap de núcleo** de $R$ respecto a $D$ como el conjunto de
capacidades requeridas cuyos núcleos $R$ no refina:

$$
\mathcal{G}_K(R) = \{ c \in C_D : \ker(R) \not\subseteq K_c \}
$$

**Proposición 4 (Correspondencia).** Si $C_R$ se define como
$\{ c \in \mathcal{C} : \ker(R) \subseteq K_c \}$, entonces:

$$
G(D,R) = \mathcal{G}_K(R)
$$

*Demostración.* $G(D,R) = C_D - C_R = \{ c \in C_D : c \notin C_R \}
= \{ c \in C_D : \ker(R) \not\subseteq K_c \} = \mathcal{G}_K(R)$. ∎

Este resultado unifica los dos lenguajes: el gap que la verificación
detecta (CARD-355) es exactamente el conjunto de $K_c$ que la
representación no refina.

### 5.2 Distancia a la suficiencia

El gap $G(D,R)$ mide la distancia a la suficiencia en términos de
capacidades. Su contraparte en el espacio de núcleos es:

$$
\mathcal{K}_{gap}(R) = K_D \setminus \ker(R)
$$

(aunque estrictamente, $K_D$ y $\ker(R)$ son conjuntos de pares, no
escalares). Cuando $\mathcal{K}_{gap}(R) = \emptyset$, tenemos
$\ker(R) \subseteq K_D$ y $R$ es suficiente. Cuando no, cada par en
$\mathcal{K}_{gap}(R)$ representa una distinción que $D$ necesita pero
$R$ no hace.

---

## 6. Límites del modelo

1. **No dice nada sobre la alcanzabilidad de $R_{min}$ desde $R_0$.**
   La frontera caracterizada por $K_D$ puede estar fuera del alcance del
   espacio de enriquecimiento $\mathcal{E}$. Eso es un problema del plano
   operacional (CARD-358), no de la caracterización.

2. **$K_c$ puede no ser una relación de equivalencia bien definida para
   toda capacidad.** Si una capacidad $c$ no induce una relación de
   equivalencia natural (por ejemplo, si la evidencia es ordinal o
   métrica), $K_c$ debe definirse como una estructura más rica. Esta
   extensión se trata en §XXX de `results.md`.

3. **El modelo presupone $C_D$ conocido.** En la práctica, $C_D$ puede
   ser difícil de elicitar. El teorema caracteriza la suficiencia
   suponiendo $C_D$ dado; no resuelve el problema de cómo obtener $C_D$.

4. **El modelo asume que toda capacidad $c$ se comporta monotónicamente
   respecto al refinamiento** (si $R_1 \sqsubseteq R_2$, entonces
   $R_1$ provee al menos las capacidades de $R_2$). Esto es una propiedad
   de la definición de $C_R$ y debe verificarse empíricamente.
