# ST-008: Convergence Gap — Hypothesis

## Contexto y Motivación

El pipeline de TAKT (el sistema de producción, repo `takt`) opera como un sistema
de decisión iterativo: cada tarjeta (`card`) atraviesa una secuencia fija de
columnas (Backlog → Ready → In Progress → In Review → Done) mediante
transiciones gobernadas por reglas de decisión locales. `CLAUDE.md` de `takt`
afirma explícitamente que TAKT está "fundamentado en teoría de autómatas y
teoría de grafos."

El formalismo actual de TAKT — el Decision System $\mathcal{M} = (S, A, U, D)$
de `takt-formal-foundations-v1.md`, y su extensión G2 sobre trayectorias
($M_D(\tau)$) — especifica cómo se decide una acción óptima dado un estado
(o un prefijo de trayectoria), pero en ningún punto especifica una condición
de aceptación o terminación: un subconjunto de estados, o un predicado sobre
trayectorias, que distinga "el proceso ha alcanzado su objetivo" de "el
proceso debe continuar."

Esta pregunta surgió durante un ejercicio de diseño sobre `docs/team-protocol.md`
en `takt` (no motivado por `takt-theory`): al preguntar "¿cuál es el objetivo
final del proceso, cuándo hemos terminado?", se observó que "incrementar la
utilidad reduciendo fricción accidental" (la formulación operacional de TAKT)
es una *dirección* de mejora, no un *criterio* de parada — y que el backlog es
generativo (KAIZEN produce nuevas tarjetas a partir de retrospectivas), por lo
que "backlog vacío" nunca es una condición de parada válida.

Un primer planteamiento del experimento arriesgaba demostrar algo trivial: si
la representación $S$ elegida descarta toda información sobre el objetivo,
que $D$ no pueda recuperarla no dice nada sobre el formalismo — solo dice que
esa representación concreta es insuficiente. Este documento fija el
experimento para evitar esa trivialidad, distinguiendo explícitamente entre
**una representación concreta** y **una familia de representaciones admisibles**.

## Pregunta

> ¿Puede un sistema de decisión autómata-céntrico (Decision System / extensión
> G2 de TAKT) quedar completamente caracterizado sin definir un conjunto de
> estados aceptantes o un criterio equivalente de convergencia — y si no,
> pertenece esa carencia a la representación concreta que usa `takt`, o a
> toda la familia de representaciones locales y acotadas admisibles para este
> dominio?

## Variable experimental: familia de representaciones

- **$S_0$ (naive).** El prefijo de trayectoria que ya ofrece el runtime de
  G2 portado a `takt` (`TrajectoryMonitor.ts`: la secuencia de estados y
  acciones observados hasta el paso actual, donde cada estado es una
  instantánea del esquema real de `cards` en `.takt/kanban.db` — columna,
  prioridad, dependencias, tamaño) — sin ningún campo de objetivo,
  distancia-a-meta, o impacto acumulado. Se elige esta y no un snapshot sin
  memoria como línea base; ver justificación más abajo.
- **$S_1, S_2, \dots$ (enriquecidas).** Representaciones candidatas que
  siguen siendo locales, finitas y compatibles con el dominio — p. ej.
  $S_0$ aumentada con un escalar de "distancia declarada al objetivo" bajo
  una `OrderedStructure<L>` (reutilizando la misma abstracción que M1 usa
  para $\Phi^\downarrow$), o $S_0$ aumentada con un ledger acotado de impacto
  acumulado, o una ventana finita de la trayectoria vía el mecanismo de G2
  ($M_D$).

**Definición de trabajo — "local y acotada".** Para que la clasificación de
resultados sea inequívoca, la familia admisible se restringe a
representaciones que cumplen ambas condiciones:

- **Local:** computable a partir de información disponible en el paso actual
  del pipeline (el prefijo de trayectoria observado hasta ese instante), sin
  necesitar lookahead sobre tarjetas futuras ni acceso a información fuera
  del dominio del pipeline (p. ej., sin oráculo externo que revele el
  objetivo real).
- **Acotada:** de tamaño fijo — no crece sin límite con la longitud de la
  trayectoria ni con el tamaño del backlog (excluye, por ejemplo, "la
  historia completa de todas las tarjetas procesadas" como representación
  candidata).

Toda $S_i$ que no cumpla ambas condiciones queda fuera del alcance de este
experimento — su existencia no contaría como *Application Representation
Gap* ni la refutaría.

**Elección de línea base: G2, no el Decision System de un solo paso.**
Probar la Hipótesis 1 contra el Decision System $(S,A,U,D)$ puro —sin
memoria de trayectoria— la confirmaría trivialmente por una razón distinta
y menos interesante: un sistema sin memoria no puede representar ningún
progreso acumulado, tenga o no relación con un objetivo. $S_0$ se fija por
tanto como el estado que ya ofrece el runtime de G2 portado a `takt`
(`TrajectoryMonitor.ts`: el prefijo de estados y acciones observados), no un
snapshot sin memoria. La pregunta que importa es si, *incluso con esa
memoria de trayectoria ya presente*, la distinción terminar/continuar sigue
sin poder representarse.

## Hipótesis

1. **Pérdida en $S_0$.** Dos trayectorias con secuencia de decisiones
   idéntica hasta un punto $T$, que difieren únicamente en si el proceso ha
   alcanzado su objetivo declarado (una continúa hacia "terminar", la otra
   hacia "seguir refinando"), colapsan al mismo estado bajo $S_0$. Es decir,
   $\ker(R_0)$ no separa la distinción "terminar" / "continuar": la condición
   de seguridad de TAKT falla específicamente en esta dimensión para la
   representación que usa `takt` hoy. Se espera que esto se confirme con
   relativa facilidad — no es el resultado interesante del experimento, es
   la motivación para exigir la prueba sobre la familia completa.

2. **Existencia de al menos un $S_i$ suficiente.** Se predice que existe al
   menos una representación enriquecida, local y acotada — candidata natural:
   $S_0$ + un valor escalar de distancia-a-objetivo bajo un orden total — que
   restaura la distinción, i.e. bajo la cual $\ker(R_i) \subseteq \ker(D)$
   vuelve a cumplirse respecto a "terminar" / "continuar". Esta predicción
   debe demostrarse formalmente, no asumirse; si se refuta, el resultado se
   inclina hacia B. La buena definición del propio escalar de
   distancia-a-objetivo (que exista, que sea computable localmente, que
   respete la estructura de orden requerida) es parte de lo que debe
   justificarse en la Aplicación — no se da por supuesta aquí.

3. **No unicidad del contraejemplo.** Si se encuentra un $S_i$ suficiente,
   debe verificarse que no es un caso aislado construido ad hoc, sino un
   miembro representativo de una clase de soluciones locales/acotadas
   razonables — de lo contrario, el resultado A sería anecdótico y no
   comparable en fuerza a los resultados previos de SPT (ST-001–007).

## Clasificación de resultados

El experimento debe concluir bajo exactamente una de estas tres etiquetas —
ninguna se trata como "victoria" de una hipótesis concreta, son mutuamente
excluyentes y colectivamente exhaustivas:

- **No Gap.** $S_0$ ya preserva la propiedad (refutaría la Hipótesis 1;
  poco probable dado el schema actual, pero debe descartarse formalmente).
- **Application Representation Gap.** $S_0$ pierde la propiedad, pero existe
  al menos un $S_i$ dentro de la familia admisible que la preserva. La
  consecuencia es una recomendación para la capa de aplicación (`takt`) —
  enriquecer su representación de estado — no una extensión de SPT.
- **Structural Representation Gap.** Para toda representación local y
  acotada razonable, la distinción se sigue perdiendo. Sería un resultado
  sobre los propios fundamentos del tipo de sistema representacional,
  comparable en estatus a los resultados de ST-001–007.

## Criterio de Parada de ST-008

Este stress-test se considerará terminado y exitoso cuando:

1. Se formalice el problema de convergencia del pipeline de TAKT como una
   pregunta sobre $S$ y $D$ (no como una pregunta de producto o de diseño de
   `takt`).
2. Se evalúe $S_0$ — la representación real que usa `takt` hoy — y se
   demuestre si $\ker(R_0)$ preserva o no la distinción terminar/continuar.
3. Se evalúe al menos una familia representativa de representaciones
   enriquecidas pero locales y acotadas $\{S_1, S_2, \dots\}$, no un único
   ejemplo ad hoc.
4. Se demuestre (idealmente en Lean 4, siguiendo el patrón de ST-001–007) si
   existe al menos un $S_i$ que preserve la propiedad, o si ninguno puede
   hacerlo. Para el caso negativo (*Structural Representation Gap*), la
   demostración no puede ser por enumeración —la familia admisible es
   potencialmente infinita— y debe seguir el patrón de no-inyectividad de
   `session/g3-impossibility-theorem.md`: construir dos trayectorias
   concretas, ambas dentro del dominio del pipeline, que todo $S_i$ local y
   acotado observe como idénticas pese a requerir decisiones distintas
   ("terminar" vs. "continuar"). Un único par de trayectorias así construido,
   junto con el argumento de por qué ninguna $S_i$ admisible puede
   separarlas, basta como demostración — igual que el corolario de G3 no
   requiere enumerar todas las políticas.
5. El resultado quede clasificado formalmente bajo una de las tres etiquetas
   de la sección anterior — sin ambigüedad ni resultado mixto sin resolver.

## Nota de gobernanza

Este experimento no propone ninguna primitiva teórica nueva. Reutiliza la
condición de seguridad existente ($\ker(R) \subseteq \ker(D)$, Teorema de
Seguridad) sobre un segundo dominio dentro de TAKT — el pipeline de kanban de
`takt` — siguiendo la Etapa 2 de `session/roadmap-validation.md`
("Generalización interna"). Si el resultado es *Application Representation
Gap*, la extensión ocurre en `takt` (capa de aplicación), no en el núcleo
formal — consistente con "las aplicaciones preceden a las extensiones." Solo
un resultado *Structural Representation Gap* constituiría evidencia externa
suficiente para proponer una extensión del núcleo, tal como exige la regla de
gobernanza.
