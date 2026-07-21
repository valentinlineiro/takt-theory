# ST-008: Convergence Gap — Results

> Los resultados se registran a medida que se evalúa cada candidato.
> Este documento no se completa por adelantado.

---

## 1. Evaluación de $R_1$ — bit de terminalidad

### 1.1 Formalización

$R_1$ se define como:

$$
R_1(s_t) = (S_0(s_t),\ \text{done}(s_t))
$$

donde $s_t \in \mathcal{S}$ es el estado observable del pipeline, $S_0$ es
la representación de `takt`, y $\text{done}: \mathcal{S} \to \{0, 1\}$.

**Dominio.** $\mathcal{S}$ (estados observables del pipeline, que incluyen
kanban_state y trayectoria $\tau_{:t}$). No incluye $W$ ni ningún
observable del mundo externo.

**Codominio.** $\mathcal{S} \times \{0, 1\}$.

**Local.** $\text{done}$ es una función de $\mathcal{S}$, que a su vez es
función de (kanban_state, $\tau_{:t}$). No requiere acceso a $W$.
✅ Local.

**Acotada.** Añade exactamente 1 bit, independiente de $t$ y del backlog.
✅ Acotada.

$R_1$ pertenece a $\mathcal{F}$.

### 1.2 Evaluación

Por la construcción de `model.md` §2.2, las dos trayectorias $T_1$ y $T_2$
producen la misma secuencia de estados observables $s_t$ en cada paso
$t \leq 4$ (mismo kanban_state, misma $\tau_{:t}$).

Dado que $\text{done}$ es función de $s_t$:

$$
\text{done}(s_t(T_1)) = \text{done}(s_t(T_2)) \quad \forall t \leq 4
$$

Por tanto:

$$
R_1(T_1) = R_1(T_2)
$$

Pero $T_1$ requiere la decisión "detenerse" y $T_2$ requiere "continuar"
(porque $\text{Terminal}(\text{kanban\_state}_4, w_1)$ se cumple y
$\text{Terminal}(\text{kanban\_state}_4, w_2)$ no). Es decir:

$$
D(T_1) \neq D(T_2)
$$

Se sigue que:

$$
\ker(R_1) \not\subseteq \ker(D)
$$

| Candidato | Local | Acotada | $\ker(R_i) \subseteq \ker(D)$ | Resultado |
|-----------|:-----:|:-------:|:-----------------------------:|-----------|
| $R_0$ (baseline) | ✅ | ✅ | ❌ | No preserva (model.md §3) |
| $R_1$ (bit de terminalidad) | ✅ | ✅ | ❌ | Falla por anclaje a $W$ |

### 1.3 Diagnóstico

El fallo de $R_1$ no es por granularidad insuficiente (que un bit no baste
para codificar la distinción). Es por **anclaje**: $\text{done}$ es función
de $\mathcal{S}$, y $\mathcal{S}$ es idéntico para $T_1$ y $T_2$. La
única diferencia entre ambas trayectorias reside en $W$, que no forma
parte del dominio de $R_1$.

Ninguna elección de $\text{done}$ (binaria o no) puede resolver esto
mientras $\text{done}$ sea función de $\mathcal{S}$ — que es justo la
condición de localidad que define a $\mathcal{F}$.

---

## 2. Generalización estructural

### 2.1 Base del argumento

La evaluación de $R_1$ revela que su fallo no se debe a ninguna propiedad
específica (binario, bit único, etc.), sino a la relación entre $\mathcal{S}$
y $W$. Esto sugiere que el problema puede ser estructural. Formalizamos:

**Hecho 1 (construcción, model.md §2.2–2.3).** $s_t(T_1)=s_t(T_2)$ para
todo $t$. Las dos trayectorias son indistinguibles bajo $\mathcal{S}$.

**Hecho 2 (localidad, model.md §4.1).** Toda $R_i \in \mathcal{F}$ es
función del estado observable $\mathcal{S}$: $R_i: \mathcal{S} \to
\mathcal{Z}_i$. Esto excluye explícitamente el acceso a $W$.

### 2.2 Teorema de imposibilidad

> Para toda representación $R_i \in \mathcal{F}$ (local y acotada),
> $\ker(R_i) \not\subseteq \ker(D)$ respecto a la distinción
> terminar/continuar.

**Demostración.** Por el Hecho 1, $s_t(T_1) = s_t(T_2)$ para todo $t$.
Por el Hecho 2, $R_i$ es función de $\mathcal{S}$. Luego
$R_i(T_1) = R_i(T_2)$. Pero $T_1$ requiere "detenerse" (
$\text{Terminal}(\text{kanban\_state}_4, w_1)$ se cumple) y $T_2$ requiere
"continuar" ($\text{Terminal}(\text{kanban\_state}_4, w_2)$ no se cumple).
Por tanto $(T_1, T_2) \in \ker(R_i)$ y $(T_1, T_2) \notin \ker(D)$,
ergo $\ker(R_i) \not\subseteq \ker(D)$.

∎

### 2.3 Consecuencia para la Hipótesis 2

H₂ (hipothesis.md) predice la existencia de al menos un $R_i \in
\mathcal{F}$ tal que $\ker(R_i) \subseteq \ker(D)$. El teorema §2.2
demuestra que para el par $T_1$/$T_2$ construido en model.md, no existe
tal $R_i$. Por tanto **H₂ queda refutada** por el teorema de
imposibilidad, no por ausencia de candidatos en una búsqueda. La refutación
es lógica, no empírica: la propia definición de $\mathcal{F}$ impide que
cualquier miembro pueda preservar la distinción.

### 2.4 Independencia del candidato concreto

El teorema no depende de $R_1$, $R_2$ ni $R_3$. Descarta simultáneamente
a todos los miembros de $\mathcal{F}$. No es necesario evaluar candidatos
adicionales — la demostración es universal dentro de la familia.

### 2.5 Interpretación

La causa del gap no es una deficiencia de $R_1$ o de cualquier candidato
concreto. Es **estructural**: la propiedad de convergencia no es función
del estado observable del pipeline. Depende del mundo externo $W$. Como
$\mathcal{F}$ excluye por definición el acceso a $W$, ninguna
representación en $\mathcal{F}$ puede preservarla.

---

## 3. Aplicación del criterio de terminación

| Condición | ¿Se cumple? |
|-----------|:-----------:|
| $S_0$ preserva la convergencia | ❌ (descartado en model.md §3) |
| Existe $R_i \in \mathcal{F}$ con $\ker(R_i) \subseteq \ker(D)$ | ❌ (demostrado: ninguno puede) |
| Para todo $R_i \in \mathcal{F}$, $\ker(R_i) \not\subseteq \ker(D)$ | ✅ (demostrado en §2.2) |

**Resultado: Structural Representation Gap.**

No se evalúan $R_2$ ni $R_3$. El teorema del §2.2 los descarta sin
necesidad de prueba adicional, porque el argumento es independiente del
candidato. Evaluarlos sería redundante.

---

## 4. Tabla de evaluación completa

| Candidato | Local | Acotada | $\ker(R_i) \subseteq \ker(D)$ | Resultado |
|-----------|:-----:|:-------:|:-----------------------------:|-----------|
| $R_0$ (baseline) | ✅ | ✅ | ❌ | No preserva |
| $R_1$ (bit terminalidad) | ✅ | ✅ | ❌ | Estructural: $\mathcal{F}$ no puede |
| $R_2$ (distancia ordinal) | ✅ | ✅ | ❌ | Descartado por teorema §2.2 |
| $R_3$ (ventana temporal) | ✅ | ✅ | ❌ | Descartado por teorema §2.2 |

El experimento concluye que **ninguna** representación local y acotada
puede preservar la distinción terminar/continuar para el par de
trayectorias construido. La limitación es estructural: la convergencia
depende de $W$, y $\mathcal{F}$ excluye $W$.

---

## 5. Observaciones

### 5.1 Relación con el teorema de no inyectividad de G3

Este resultado sigue exactamente el mismo patrón que el Teorema de No
Inyectividad de G3 (`session/g3-impossibility-theorem.md`): se construyen
dos objetos ($T_1$, $T_2$) que son indistinguibles bajo la representación
pero requieren decisiones distintas. La diferencia es que G3 opera sobre
políticas de gobierno ($\Pi \to \mathcal{D}(Y)$) y ST-008 opera sobre
estados de pipeline ($\mathcal{S} \to \mathcal{Z}$), pero la estructura
del argumento es idéntica.

### 5.2 ¿Por qué no se detectó antes?

La limitación no era detectable antes de ST-008 porque:
- El formalismo G2 no define un predicado de convergencia (esa es la
  observación que origina el experimento).
- El par de trayectorias $T_1$/$T_2$ requiere explícitamente la
  distinción entre estado observable $\mathcal{S}$ y mundo externo $W$,
  que ST-008 introduce por primera vez.

### 5.3 Implicación para SPT

El resultado no invalida el marco G2. Establece un **límite de
aplicabilidad**: G2 (y cualquier representación local y acotada) no puede
detectar convergencia cuando esta depende de información externa al
estado observable. Para representaciones locales y acotadas, la distinción
terminar/continuar está fuera del alcance de la condición de seguridad.
