# ST-008: Convergence Gap — Prediction

> **Propósito de este documento.** Traduce la hipótesis y el modelo en un
> protocolo de búsqueda sobre la familia admisible $\mathcal{F}$: qué
> candidatos se evaluarán, en qué orden, y bajo qué condiciones se detiene
> la búsqueda.

---

## 1. Hipótesis bajo prueba

ST-008 evalúa la Hipótesis 1 y la Hipótesis 2 de `hypothesis.md`:

**H₁.** $S_0$ (la representación que `takt` usa hoy) no preserva la
distinción terminar/continuar: $\ker(R_0) \not\subseteq \ker(D)$ respecto
a la convergencia. Esta hipótesis se considera establecida por la
construcción de `model.md` §2–3; su verificación es un control de que el
experimento está bien construido, no el resultado que se busca.

**H₂.** Existe al menos una representación $R_i \in \mathcal{F}$, local
y acotada, que sí preserva la distinción: $\ker(R_i) \subseteq \ker(D)$
respecto a la convergencia.

El objetivo del experimento es determinar si H₂ se cumple, y si lo hace,
con qué candidato mínimo.

---

## 2. Estrategia de búsqueda sobre $\mathcal{F}$

### 2.1 Principio de orden

Los candidatos se evalúan en orden **creciente de capacidad
representacional**, donde cada paso añade exactamente una nueva capacidad
que la anterior no tenía. Esto permite identificar qué información
adicional era necesaria (y cuál no) para preservar la convergencia.

La secuencia sigue la estructura natural del problema:

1. **Binaria.** ¿Puede un solo bit de terminalidad resolver el problema?
2. **Ordinal.** Si el bit no basta, ¿basta una magnitud escalar acotada?
3. **Temporal.** Si la magnitud no basta, ¿basta memoria de trayectoria
   reciente?

Cada candidato introduce exactamente **una** capacidad nueva respecto al
anterior.

### 2.2 Candidato $R_1$: bit de terminalidad

| Propiedad | Valor |
|-----------|-------|
| Capacidad nueva | Distinguir "terminal" de "no terminal" (1 bit) |
| Representación | $R_1(s_t) = (S_0(s_t),\ \text{done}(s_t))$, donde $\text{done}(s_t) \in \{0, 1\}$ |
| Local | ✅ Solo depende del estado actual $s_t$ |
| Acotada | ✅ Siempre 1 bit, independiente de $t$ y del backlog |

**Justificación como candidato mínimo.** $\text{done}$ es la señal más
pequeña que puede añadirse a $S_0$ para portar información sobre
convergencia. Cualquier otra señal (un escalar, una ventana temporal)
contiene al menos tanta información como un bit, pero no menos. Si $R_1$
no preserva la distinción, ningún candidato con menos de un bit adicional
puede hacerlo.

**Predicción.** $R_1$ distingue $T_1$ de $T_2$ si y solo si el bit
$\text{done}$ está anclado a $\text{Terminal}(\text{kanban\_state}, w)$
de modo que $\text{done}(s_t) = 1 \iff \text{Terminal}(\text{kanban\_state}_t, w)$.

Dado que $\text{done}$ es una variable declarada internamente por el
pipeline (no una observación de $W$), caben dos posibilidades:

- **Si existe un mecanismo que vincule $\text{done}$ a $\text{Terminal}$**
  (p. ej., el pipeline puede inspeccionar $W$ o $\text{Terminal}$ es
  computable a partir del kanban_state), entonces se predice
  $\ker(R_1) \subseteq \ker(D)$. Esto constituiría un Application
  Representation Gap con solución mínima.

- **Si $\text{done}$ es independiente de $\text{Terminal}$** (variable
  interna sin acceso a $W$), entonces se predice que $R_1$ no preservará
  la distinción: $\ker(R_1) \not\subseteq \ker(D)$. En particular, puede
  construirse un par $(w_1, w_2)$ con $\text{done}$ idéntico pero
  $\text{Terminal}$ distinto, colapsando $T_1$ y $T_2$ bajo $R_1$ del
  mismo modo que bajo $S_0$.

El experimento debe determinar cuál de estos dos casos se cumple. No se
asume de antemano que $\text{done}$ carece de anclaje — eso es parte de
lo que ST-008 debe establecer.

### 2.3 Candidato $R_2$: distancia ordinal acotada

| Propiedad | Valor |
|-----------|-------|
| Capacidad nueva | Magnitud ordinal (distancia a objetivo) además de la binaria |
| Representación | $R_2(s_t) = (S_0(s_t),\ \delta_t)$, donde $\delta_t \in \mathbb{N}_{\leq K}$ con $K$ fijo |
| Local | ✅ Solo depende del estado actual $s_t$ |
| Acotada | ✅ $\delta_t$ está en un rango fijo $[0, K]$ |

**Justificación.** Si $R_1$ falla porque un bit no transporta suficiente
información — en particular, porque "estoy cerca de terminar" y "apenas
empiezo" son indistinguibles bajo un solo bit — entonces $R_2$ añade
información ordinal: qué tan lejos se declara estar del objetivo.

**Predicción.** La predicción para $R_2$ depende de por qué falló $R_1$
(si es que falló):

- **Si $R_1$ falló por falta de anclaje a $W$** (el bit $\text{done}$ no
  está vinculado a $\text{Terminal}$), entonces se predice que $R_2$
  también fallará por la misma razón: $\delta_t$ es una señal declarada
  internamente como $\text{done}$, y su anclaje a $W$ no es mayor. En
  ese caso, $\ker(R_2) \not\subseteq \ker(D)$.
- **Si $R_1$ falló por granularidad insuficiente** (el bit existe y está
  anclado a $W$, pero un solo bit no basta para guiar la decisión),
  entonces se predice que $R_2$ sí preservará la distinción:
  $\ker(R_2) \subseteq \ker(D)$.

### 2.4 Candidato $R_3$: ventana acotada de impacto acumulado

| Propiedad | Valor |
|-----------|-------|
| Capacidad nueva | Memoria de los últimos $W$ pasos del pipeline |
| Representación | $R_3(s_t) = (S_0(s_t),\ \text{ledger}_t)$, donde $\text{ledger}_t$ son los últimos $W$ pares (acción, resultado) |
| Local | ✅ Computable del prefijo $\tau_{:t}$ |
| Acotada | ✅ $W$ fijo, independiente de $t$ |

**Justificación.** Si el problema no es de señalización (bits o escalares
declarados) sino de **inferencia** — el pipeline no puede declarar su
convergencia porque no sabe si ha convergido — entonces la solución no
está en añadir una señal declarada, sino en darle al pipeline la capacidad
de inferir convergencia a partir de su propia historia. Una ventana de
impacto acumulado permite detectar patrones (p. ej., "en los últimos $W$
pasos no ha ocurrido nada nuevo") que un solo instante no revela.

**Predicción.** $R_3$ se distingue de $R_1$ y $R_2$ en que no introduce
una señal declarada internamente, sino que extrae información ya
disponible en $\tau_{:t}$. Esto evita el problema de anclaje a $W$ que
afecta a las señales declaradas. La predicción depende de si la
convergencia es detectable a partir de la historia observable:

- **Si la dinámica del pipeline es tal que la convergencia (o su ausencia)
  produce un patrón distinguible en la ventana de $W$ pasos** (p. ej.,
  inactividad prolongada, repetición de acciones, saturación de métricas),
  entonces se predice $\ker(R_3) \subseteq \ker(D)$. Esto requeriría
  demostrar que $\tau_{:t}$ contiene suficiente información para inferir
  $\text{Terminal}(\text{kanban\_state}_t, w)$.
- **Si la convergencia es independiente de la historia observable** (el
  estado del mundo $w$ puede cambiar sin que $\tau_{:t}$ registre cambio
  alguno), entonces se predice $\ker(R_3) \not\subseteq \ker(D)$.

### 2.5 Candidatos adicionales

Si $R_1$, $R_2$ y $R_3$ resultan insuficientes, la búsqueda puede
extenderse a combinaciones de las capacidades anteriores (p. ej.,
$R_4$ = $R_2$ + $R_3$: distancia ordinal + ventana temporal), siempre
que el candidato resultante siga siendo local y acotado. La regla es:
cada nuevo candidato añade exactamente una capacidad que ninguno de los
anteriores tenía.

---

## 3. Criterio de minimalidad

El experimento no busca "cualquier $R_i$ que funcione." Busca el **más
pequeño** (en capacidad representacional) que lo haga. Esto es importante
porque:

- Si $R_1$ funciona, la recomendación para `takt` es mínima: un bit.
- Si solo $R_3$ funciona, la recomendación es más costosa: ventana de
  historial.
- Si ninguno funciona, el gap es estructural.

La minimalidad se mide en **capacidades representacionales**, no en bytes:
un bit es más pequeño que un escalar ordinal no porque ocupe menos memoria
(que también) sino porque codifica menos distinciones.

---

## 4. Condiciones de terminación

| Condición | Resultado | Acción |
|-----------|-----------|--------|
| $S_0$ preserva la convergencia | **No Gap** | El experimento termina. No se evalúan más candidatos. |
| Existe $R_i \in \mathcal{F}$ con $\ker(R_i) \subseteq \ker(D)$ | **Application Representation Gap** | Se registra el candidato mínimo encontrado. Se documenta qué capacidad adicional fue necesaria. |
| Para todo $R_i \in \mathcal{F}$, $\ker(R_i) \not\subseteq \ker(D)$ | **Structural Representation Gap** | Se demuestra por argumento de no-inyectividad (patrón G3) que ninguna representación local y acotada puede preservar la convergencia. |

La búsqueda termina en cuanto se encuentra una representación suficiente
(o se demuestra que ninguna puede serlo). No se exige probar todos los
candidatos.

---

## 5. Lo que este documento no decide

Este documento no decide:

- El tamaño exacto de $K$ para $R_2$ (pertenece al diseño del candidato).
- El tamaño exacto de $W$ para $R_3$ (ídem).
- El orden entre $R_2$ y $R_3$ si la evidencia experimental sugiere
  invertirlo (pero se justificará en `results.md`).

Toda desviación del orden aquí establecido se documentará en `results.md`
con su justificación.
