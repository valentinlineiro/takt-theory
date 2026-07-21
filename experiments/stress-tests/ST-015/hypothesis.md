# ST-015: Structural Sufficiency Theorem — Hypothesis

## Contexto y Motivación

ST-008 demostró que existen decisiones $D$ para las que ninguna
representación local y acotada preserva la distinción requerida. El
resultado fue un *Structural Representation Gap*: un límite inferior del
espacio de representaciones.

CARD-356/357/358 construyeron el lado positivo: dado un gap $G(D,R)$,
existe un espacio de enriquecimiento $\mathcal{E}$ que permite cerrarlo,
un catálogo de proveedores y un planificador que selecciona la ruta
óptima.

Entre ambos extremos — la imposibilidad de abajo y la recuperación
práctica de arriba — queda una pregunta abierta:

> Dada una decisión $D$ con requisitos de capacidad $C_D$, ¿qué propiedad
> caracteriza exactamente al conjunto de representaciones suficientes?

ST-008 respondió "cuándo NO". La pregunta de ST-015 es "cuándo SÍ, y
cuál es exactamente la frontera".

## Pregunta

> ¿Existe una caracterización única del conjunto
> $\mathcal{R}_{sufficient}(D) = \{ R : \ker(R) \subseteq \ker(D) \}$
> en términos de las capacidades que $D$ requiere y las que $R$ provee?
> Y de existir, ¿tiene $\mathcal{R}_{sufficient}(D)$ un elemento mínimo
> único — una representación $R_{min}$ tal que toda representación
> estrictamente más gruesa que $R_{min}$ es insuficiente?

La pregunta no es existencial (ST-008 ya demostró que suficiencia existe
para ciertos pares $(D,R)$) sino **estructural**: ¿cuál es la frontera
$\partial \mathcal{R}_{sufficient}$?

## Variable experimental

No hay variable experimental en sentido clásico. ST-015 es un resultado
de caracterización, no un experimento sobre candidatos concretos. La
variable es el **marco teórico**:

- **Estado actual (pre-ST-015):** $\mathcal{R}_{sufficient}(D)$ está
  definido por $\ker(R) \subseteq \ker(D)$. Es una caracterización válida
  pero operacional — no revela *por qué* una representación es suficiente
  ni *cuánto* falta para serlo.

- **Estado post-ST-015:** $\mathcal{R}_{sufficient}(D)$ se caracteriza
  por el **núcleo de capacidad** $K_D$, una relación de equivalencia
  construida a partir de $C_D$. La suficiencia se reduce a
  $\ker(R) \subseteq K_D$, y la frontera $R_{min}$ corresponde a
  $\ker(R_{min}) = K_D$.

## Principio de aislamiento

ST-015 se aplica al marco general de TAKT, no a un dominio concreto.
El aislamiento consiste en:

1. Separar la **definición de suficiencia** (relación entre $\ker(R)$ y
   $\ker(D)$) de la **construcción de representaciones suficientes**
   (enriquecimiento, CARD-357/358).
2. No depende del tipo de estructura (equivalencias, métricas, órdenes)
   — se formula en el lenguaje de núcleos de equivalencia del
   Canonical Core v1.0 (Teorema 4).
3. No presupone que $R_{min}$ sea alcanzable desde una representación
   base $R_0$ — la alcanzabilidad pertenece al plano del enriquecimiento
   (CARD-358), no al de la caracterización.

## Hipótesis

1. **Caracterización por núcleo de capacidad.** Existe una relación de
   equivalencia $K_D \subseteq S \times S$, constructible a partir de
   $C_D$, tal que:

   $$
   \mathcal{R}_{sufficient}(D) = \{ R : \ker(R) \subseteq K_D \}
   $$

   Es decir, la suficiencia se caracteriza enteramente por la inclusión
   de núcleos, sin referencia directa a $D$.

2. **Existencia de mínimo suficiente.** En el retículo de
   representaciones ordenadas por refinamiento ($R_1 \sqsubseteq R_2$
   si $\ker(R_2) \subseteq \ker(R_1)$), el conjunto
   $\mathcal{R}_{sufficient}(D)$ tiene un único elemento mínimo
   $R_{min}$, caracterizado por:

   $$
   \ker(R_{min}) = K_D
   $$

   Toda representación $R$ es suficiente para $D$ si y solo si es un
   refinamiento de $R_{min}$. Toda representación estrictamente más
   gruesa que $R_{min}$ es insuficiente.

3. **Correspondencia con gaps de capacidad.** Para cualquier gap
   $G(D,R) = C_D - C_R \neq \emptyset$, la distancia a la suficiencia
   es medible como el conjunto de núcleos $K_c$ que $\ker(R)$ no refina:

   $$
   \mathcal{G}_K(R) = \{ c \in C_D : \ker(R) \not\subseteq K_c \}
   $$

   que coincide con $G(D,R)$ cuando $C_R$ está definido por
   $C_R = \{ c : \ker(R) \subseteq K_c \}$.

## Clasificación de resultados

- **Caracterización completa.** Las tres hipótesis se sostienen y se
  demuestran formalmente. La frontera $\partial \mathcal{R}_{sufficient}$
  queda caracterizada por $K_D$. Las consecuencias para el marco teórico
  y para el runtime se documentan.

- **Caracterización parcial.** Las hipótesis 1 y 3 se sostienen, pero la
  unicidad del mínimo (H2) no: $\mathcal{R}_{sufficient}(D)$ tiene
  múltiples elementos minimales. Se documentan las condiciones bajo las
  que ocurre y las consecuencias para el planificador de enriquecimiento.

- **Refutada.** No existe una caracterización por núcleo de capacidad
  que capture $\mathcal{R}_{sufficient}(D)$. La relación entre
  $\ker(R)$ y $C_R$ no es de refino de equivalencias. Implicaría revisar
  el modelo de capacidad (CARD-356).

## Criterio de Parada

ST-015 se considera completo cuando:

1. Se define formalmente $K_c$ para cada capacidad $c \in \mathcal{C}$.
2. Se demuestra la equivalencia entre $\ker(R) \subseteq \ker(D)$ y
   $\ker(R) \subseteq K_D$.
3. Se demuestra la existencia (y unicidad o multiplicidad) de $R_{min}$.
4. Se demuestra la correspondencia entre $G(D,R)$ y $\mathcal{G}_K(R)$.
5. El resultado queda clasificado bajo una de las tres etiquetas.
6. Se documentan las consecuencias para el runtime: cómo $K_D$ informa
   al planificador de enriquecimiento (CARD-358) y a la caracterización
   de gaps (CARD-355).
