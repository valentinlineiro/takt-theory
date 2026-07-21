# ST-008: Convergence Gap — Model

> **Objetivo del modelo.** Este documento únicamente fija el objeto matemático
> sobre el que se ejecutará ST-008. No introduce hipótesis adicionales ni
> contiene resultados experimentales.

---

## 1. Objeto de estudio

### 1.1 Dominio

El pipeline kanban de `takt`. Cada tarjeta (`card`) del sistema de producción
atraviesa una secuencia fija de columnas:

```
Backlog → Ready → In Progress → In Review → Done (o Abandoned)
```

El sistema es **generativo**: el backlog no se agota nunca porque KAIZEN
produce nuevas tarjetas a partir de retrospectivas. No existe un estado
"backlog vacío" alcanzable.

### 1.2 Modelo como sistema de decisión

Aplicamos el marco de TAKT — el Decision System $\mathcal{M} = (\mathcal{S},
\mathcal{A}, U, D)$ de `takt-formal-foundations-v1.md` — al pipeline.
Cada componente se instancia para el dominio kanban:

**Estados** $\mathcal{S}$. Un estado $s \in \mathcal{S}$ es una
instantánea completa del espacio de tarjetas en un instante del pipeline:
el conjunto de pares $(id, column, priority, size, dependencies)$ de todas
las tarjetas activas en ese momento, más la información contextual que el
runtime captura (prefijo de trayectoria observado hasta ese instante —
$M_D$ no está activo aquí, solo el registro del historial).

Un estado no contiene ningún campo de objetivo, distancia-a-meta,
convergencia declarada o impacto acumulado — porque `takt` no los almacena.

**Acciones** $\mathcal{A}$. Toda transición de columna permitida por las
reglas del pipeline:
- `Mover(card_id, origen → destino)` donde la columna destino es la
  siguiente en la secuencia y se cumplen las precondiciones de la regla
  (dependencias resueltas, ownership, etc.).
- El conjunto $\mathcal{A}$ es finito (depende del conjunto de tarjetas
  activas en el estado actual).

**Utilidad** $U: \mathcal{S} \times \mathcal{A} \to \mathbb{R}$. La
preferencia del sistema sobre pares (estado, acción). Se define
implícitamente por las reglas del pipeline. $U$ puede depender del objetivo
a través de $D$, pero el formalismo actual no hace explícita esa
dependencia — $U$ es una primitiva del sistema, no una función que reciba
el objetivo como argumento.

**Decisión** $D: \mathcal{S} \to \mathcal{A}$. La acción seleccionada por
las reglas del pipeline dado el estado actual. $D$ es determinista:
precondiciones y desempate producen una única acción por estado.

### 1.3 Memoria de trayectoria (G2)

El runtime de `takt` no opera sobre estados instantáneos aislados. Mantiene
un `TrajectoryMonitor` que acumula el prefijo de estados y acciones
observados. El estado $s \in \mathcal{S}$ en cada paso $t$ es por tanto
el par:

\[
s_t = (\text{kanban\_state}_t,\ \tau_{:t})
\]

donde $\tau_{:t}$ es el prefijo de trayectoria observado hasta $t-1$
(secuencia de $(\text{kanban\_state}_i, \text{accion}_i)$ para $i < t$).
Esto es lo que el runtime llama **$S_0$**: la representación que `takt`
usa hoy.

### 1.4 Estado del mundo externo $W$

El pipeline no opera en el vacío. Está inserto en un mundo que tiene un
**estado externo** $w \in \mathcal{W}$ que incluye — entre otras cosas —
el objetivo real que el pipeline debe alcanzar. Este estado externo no es
observable directamente por el pipeline: no forma parte del kanban, no se
registra en el `TrajectoryMonitor`, y no es accesible a $S_0$.

Formalmente, el sistema completo es un par $(\text{kanban\_state}, w)$.
El pipeline solo observa $\text{kanban\_state}$. El estado del mundo $w$
es la parte que el pipeline no ve, pero que determina si el objetivo está
cumplido.

Esta separación es necesaria porque la pregunta de ST-008 es si un sistema
que observa solo el kanban puede inferir la convergencia de $w$. Si $w$
fuera observable, la respuesta sería trivialmente sí (añadir $w$ al estado).
La pregunta interesante es si existe alguna representación local y acotada
que baste para determinar cuándo parar sin observar $w$ directamente.

### 1.5 Propiedad bajo prueba: convergencia

Llamamos **convergencia** a la propiedad:

> El proceso ha alcanzado un estado desde el cual ninguna acción restante
> puede mejorar la utilidad con respecto al objetivo que $W$ codifica.

La convergencia es una **relación entre $(\text{kanban\_state}, w)$** y la
decisión de parar. No es una propiedad intrínseca de $\text{kanban\_state}$
ni una función de $S_0$ — porque $S_0$ no observa $w$.

Formalmente, un predicado $\text{Terminal} \subseteq \mathcal{S} \times
\mathcal{W}$ que identifica los pares (estado observable, estado del mundo)
en los que el sistema debe detenerse.

### 1.6 Decisiones para las que la convergencia importa

Las dos decisiones críticas que dependen de la convergencia son:

| Decisión | Sin convergencia | Con convergencia |
|----------|------------------|------------------|
| ¿Siguiente acción? | Mover una tarjeta según reglas | Detenerse — no mover ninguna |
| ¿Interpretación del backlog? | Nuevas tarjetas = trabajo pendiente | Nuevas tarjetas = fuera del alcance del objetivo actual |

En el pipeline real, $D$ nunca selecciona "detenerse" porque no hay un
estado terminal definido — siempre hay una tarjeta movible. Esto es
consistente con la observación empírica que originó ST-008: el pipeline
nunca converge porque no puede hacerlo.

---

## 2. Construcción de las dos trayectorias

### 2.1 Principio de aislamiento

Siguiendo el mismo patrón que el Teorema de No Inyectividad de G3
(`session/g3-impossibility-theorem.md`), construimos dos trayectorias
$T_1$ y $T_2$ que:

1. Parten del mismo estado inicial $s_0$.
2. Ejecutan exactamente la misma secuencia de acciones $a_1, a_2, \dots, a_n$.
3. Son indistinguibles bajo $S_0$ respecto a todas las propiedades que $S_0$
   preserva (i.e., son la misma secuencia observada de kanban snapshots).
4. Difieren únicamente en la propiedad de convergencia: $T_1$ ha alcanzado
   su objetivo, $T_2$ no.

### 2.2 Construcción

Fijamos un escenario concreto con dos estados del mundo $w_1, w_2 \in
\mathcal{W}$ que difieren únicamente en si el objetivo está cumplido tras
completar la tarjeta A.

**Estado inicial.** El kanban contiene exactamente una tarjeta en Backlog:

```
card_A:
  id:          "A"
  column:      "Backlog"
  priority:    100
  size:        "S"
  dependencies: []
```

El prefijo de trayectoria $\tau_{:0}$ está vacío. El estado del mundo es
$w$ (indeterminado todavía — solo se fija al final).

**Ambas trayectorias** ejecutan la misma secuencia de cuatro acciones:

```
a₁: Mover(A, Backlog → Ready)
a₂: Mover(A, Ready → In Progress)
a₃: Mover(A, In Progress → In Review)
a₄: Mover(A, In Review → Done)
```

**Trayectoria $T_1$ (convergente).** El estado del mundo tras $a_4$ es
$w_1$, donde $\text{Terminal}(\text{kanban\_state}_4, w_1)$ se cumple:
el objetivo está alcanzado. No hay más acciones — el pipeline debe
detenerse.

**Trayectoria $T_2$ (no convergente).** El estado del mundo tras $a_4$ es
$w_2$, donde $\text{Terminal}(\text{kanban\_state}_4, w_2)$ **no** se
cumple: el objetivo no está alcanzado. El pipeline debe continuar
— generar nueva tarjeta y seguir procesando.

### 2.3 Verificación del principio de aislamiento

| Propiedad | $T_1$ | $T_2$ | ¿Coinciden? |
|-----------|-------|-------|-------------|
| Estado inicial | $s_0$ | $s_0$ | ✅ |
| Secuencia de kanban states | misma | misma | ✅ |
| Secuencia de acciones | $a_1,a_2,a_3,a_4$ | $a_1,a_2,a_3,a_4$ | ✅ |
| Columnas visitadas por A | Backlog→Ready→IP→Review→Done | Backlog→Ready→IP→Review→Done | ✅ |
| Prioridad de A | 100 | 100 | ✅ |
| Tamaño de A | "S" | "S" | ✅ |
| Dependencias de A | [] | [] | ✅ |
| **Convergencia** ($\text{Terminal}(\text{kanban\_state}_4, w)$) | $\text{Terminal}(\text{kanban\_state}_4, w_1)$ | $\neg\text{Terminal}(\text{kanban\_state}_4, w_2)$ | ❌ |

Difieren exclusivamente en la propiedad de convergencia. Ninguna otra
variable del dominio del pipeline las distingue.

### 2.4 Justificación de que es un par válido

Ambas trayectorias son ejecuciones legalmente posibles del pipeline de
`takt`, para sendos estados del mundo $w_1, w_2 \in \mathcal{W}$ que
producen la misma secuencia de estados kanban observables. La diferencia
reside exclusivamente en $\text{Terminal}(\text{kanban\_state}_4, w_1)$
vs. $\neg\text{Terminal}(\text{kanban\_state}_4, w_2)$, una propiedad
de $W$ que $S_0$ no observa.

---

## 3. Indistinguibilidad bajo $S_0$

### 3.1 Definición de $S_0$

$S_0: \mathcal{S} \to \mathcal{Z}_0$ es la representación que usa `takt`
hoy. Para cada estado $s_t = (\text{kanban\_state}_t,\ \tau_{:t})$:

\[
S_0(s_t) = (\text{kanban\_state}_t,\ \tau_{:t})
\]

donde $\text{kanban\_state}_t$ es la proyección de todas las tarjetas a
sus campos $(id, column, priority, size, dependencies)$ en el instante $t$,
y $\tau_{:t}$ es el prefijo de trayectoria observado (secuencia de
kanban_states y acciones).

El dominio de $S_0$ es $\mathcal{S}$ (el estado observable del pipeline),
no $\mathcal{S} \times \mathcal{W}$. $S_0$ no ve $w$ por construcción:
no contiene objetivo, distancia-a-meta, señal de terminal, impacto
acumulado, ni ninguna variable del mundo externo que distinga $T_1$ de
$T_2$ en la dimensión de convergencia.

### 3.2 Proposición

> Para todo $t \leq 4$ (los cuatro pasos de la construcción), se cumple
>
> \[
> S_0(T_1{:t}) = S_0(T_2{:t})
> \]
>
> Es decir, la representación de `takt` produce la misma observación para
> ambas trayectorias en cada prefijo.

**Demostración.** Por la construcción del §2.2, ambas trayectorias
comparten el mismo estado inicial $s_0$ y ejecutan la misma secuencia
de acciones $a_1, a_2, a_3, a_4$. Dado que $S_0$ es función únicamente
del kanban_state (proyección de las tarjetas) y del prefijo $\tau_{:t}$
(la secuencia de estados y acciones observados), y ambos son idénticos
por construcción, se sigue que $S_0$ produce el mismo valor para
$T_1{:t}$ y $T_2{:t}$ para todo $t$. El valor de $w$ (que distingue $T_1$
de $T_2$) no está en el dominio de $S_0$, por lo que no puede afectar su
salida.

∎

### 3.3 Consecuencia

Dado que $S_0$ no puede distinguir $T_1$ de $T_2$, y que la decisión que
cada una requiere difiere — $T_1$ debe detenerse ($\text{Terminal}(\text{kanban\_state}_4, w_1)$ se cumple) mientras que $T_2$ debe continuar ($\text{Terminal}(\text{kanban\_state}_4, w_2)$ no se cumple) — se sigue que $\ker(R_0) \not\subseteq \ker(D)$ con respecto a estas dos decisiones. La condición de seguridad falla: $S_0$ no preserva la distinción terminar/continuar.

**Esto no es un resultado del experimento.** Es una comprobación de que
el modelo está bien construido: si $S_0$ ya distinguiera $T_1$ de $T_2$,
ST-008 sería un No Gap y el experimento terminaría aquí.

---

## 4. Familia admisible $R_i$

### 4.1 Definición de la familia

La familia admisible $\mathcal{F}$ consiste en toda representación
$R_i: \mathcal{S} \to \mathcal{Z}_i$ que cumpla ambas condiciones:

**Local.** $R_i(s_t)$ es computable a partir de la información disponible
en el paso $t$ del pipeline: el estado actual del kanban (proyección de
todas las tarjetas a sus campos) y el prefijo de trayectoria $\tau_{:t}$
observado hasta $t$. Sin lookahead a tarjetas futuras ni acceso a
información fuera del dominio del pipeline (p. ej., sin oráculo externo
que revele el objetivo real). Es decir, $R_i$ es función únicamente de
$\mathcal{S}$.

**Acotada.** $|R_i(s_t)|$ no crece sin límite con $t$ ni con el tamaño
del backlog. La representación tiene cardinalidad máxima fija.

La elección del primer candidato a evaluar dentro de $\mathcal{F}$, y
el orden en que se exploren, pertenece a `prediction.md`. Este documento
solo define el conjunto de representaciones admisibles.

---

## 5. Prediction y Results

Esta sección se deja intencionadamente vacía. Todo enunciado sobre lo que
se espera observar pertenece a `prediction.md`. Toda evidencia experimental
pertenece a `results.md`. Este documento contiene únicamente el modelo.
