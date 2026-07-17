# Phase F — Strategic Governance Framework (TAKT v4.0 Spec)

Este documento especifica el diseño formal y los fundamentos teóricos de **TAKT v4.0**. Introduce el paso de configuraciones estáticas de estados a trayectorias dinámicas bajo interacción estratégica, formalizando la gobernanza de decisiones como un juego dinámico de información parcial.

---

## 1. Motivación y Principio de Trayectoria

La Fase E (Red Team v3.0) demostró de forma concluyente que evaluar la seguridad decisional como una propiedad geométrica estática sobre estados aislados es insuficiente ante derivas temporales, cambios exógenos del entorno y oponentes inteligentes. 

Para absorber de forma matemática estas fronteras, TAKT v4.0 se fundamenta en el **Principio de Trayectoria**:
> La unidad fundamental de análisis deja de ser el estado individual y pasa a ser la trayectoria observada. Todas las propiedades de gobernanza, seguridad y alineación se formulan sobre procesos temporales, no sobre configuraciones instantáneas.

---

## 2. Modelo del Sistema: Sistema de Decisión en Trayectorias (TDS)

Definimos un **Sistema de Decisión en Trayectorias (TDS)** mediante la tupla:
$$\mathcal{M} = (S, A, \mathcal{P}, \Omega, \mathcal{O})$$

Donde:
*   $S$ es el espacio de estados.
*   $A$ es el espacio de acciones/decisiones.
*   $\mathcal{P}: S \times A \to \Delta(S)$ es el operador de transición probabilístico del sistema.
*   $\Omega$ es el espacio de observaciones.
*   $\mathcal{O}: S \to \Omega$ es la función de observación, interpretada como el operador de información disponible para la toma de decisiones (no meramente una abstracción estática).

### Trayectorias y Prefijos
Una trayectoria $\tau$ de longitud $N$ es una secuencia temporal:
$$\tau = (s_0, a_0, s_1, a_1, \dots, s_N) \in \mathcal{T}$$
Denotamos como $\tau_{:k} \in \mathcal{T}_{\text{pref}}$ al prefijo de la trayectoria hasta el paso $k$.

### Política de Referencia Ideal ($\mathcal{D}$)
Prescribe la acción óptima condicionada estrictamente a la historia transcurrida, evitando dependencias causales de estados futuros:
$$\mathcal{D}: \mathcal{T}_{\text{pref}} \to A$$
De modo que la acción óptima en el paso $k$ es $a_k^* = \mathcal{D}(\tau_{:k})$.

### Política del Agente ($\pi$)
El agente opera bajo observabilidad limitada y decide basándose en la secuencia histórica de observaciones:
$$\pi: \Omega^* \to A$$

---

## 3. Observabilidad Dinámica (Cobertura Temporal)

La observabilidad dinámica separa la equivalencia observacional de la consistencia decisional del sistema.

### Equivalencia Observacional ($\equiv_{\mathcal{O}}$)
Dos prefijos de trayectoria $\tau_{:k}$ y $\tau'_{:k}$ son observacionalmente equivalentes si y solo si producen la misma secuencia de observaciones históricas:
$$\tau_{:k} \equiv_{\mathcal{O}} \tau'_{:k} \iff \mathcal{O}(\tau_{:k}) = \mathcal{O}(\tau'_{:k})$$
Donde $\mathcal{O}(\tau_{:k}) = (\mathcal{O}(s_0), \dots, \mathcal{O}(s_k))$.

### Cobertura Temporal ($C(T, \mathcal{T}_{\text{pref}})$)
Sea $T \subset \mathcal{T}_{\text{pref}}$ el conjunto de trayectorias prefijas de prueba/auditoría. Existe cobertura temporal si todo prefijo de trayectoria transitable en ejecución real posee una trayectoria observacionalmente equivalente en $T$:
$$C(T, \mathcal{T}_{\text{pref}}) \iff \forall \tau_{:k} \in \mathcal{T}_{\text{pref}}, \quad \exists \tau'_{:k} \in T \quad \text{t.q.} \quad \tau_{:k} \equiv_{\mathcal{O}} \tau'_{:k}$$

### Consistencia Decisional ($Consis(T)$)
Exige que la política ideal de referencia sea única e idéntica para toda trayectoria dentro de la misma clase de equivalencia observacional registrada en $T$:
$$Consis(T) \iff \forall \tau_{:k}, \tau'_{:k} \in T, \quad \tau_{:k} \equiv_{\mathcal{O}} \tau'_{:k} \implies \mathcal{D}(\tau_{:k}) = \mathcal{D}(\tau'_{:k})$$

### Persistencia y Región Alcanzable en Horizonte ($Reach_h$)
Para un horizonte $h \ge 1$, definimos el conjunto de estados alcanzables con probabilidad positiva en $h$ pasos de transición:
$$Reach_h(\tau_{:k}) \subseteq S$$
La cobertura temporal es **persistente** si $T$ contiene preimágenes observacionales para toda la región alcanzable en el horizonte de predicción.

---

## 4. Margen Dinámico ($M_D$)

El margen dinámico mide la **robustez dinámica local y accesibilidad al fallo** mediante un coste de transición probabilístico.

### Coste Acumulado de Sorpresa
Para cualquier transición $s_i \xrightarrow{a_i} s_{i+1}$, definimos su coste (sorpresa o energía de transición) como:
$$c(s_i, a_i, s_{i+1}) = - \log \mathcal{P}(s_{i+1} \mid s_i, a_i)$$

### Margen Dinámico de Trayectoria ($M_D(\tau_{:k})$)
El margen dinámico de la trayectoria prefija $\tau_{:k}$ es el coste mínimo acumulado de la trayectoria de transiciones más accesible para provocar un fallo decisional:
$$M_D(\tau_{:k}) = \inf_{\tau'_{:k+m}} \left\{ \sum_{i=k}^{k+m-1} - \log \mathcal{P}(s_{i+1} \mid s_i, a_i) \right\}$$
Sujeto a:
1.  $\tau'_{:k} = \tau_{:k}$ (extensión desde la trayectoria actual).
2.  $\mathcal{D}(\tau'_{:k+m}) \neq \pi(\mathcal{O}(\tau'_{:k+m}))$ (el estado final de la extensión es un colapso decisional).

---

## 5. Gobernanza Estratégica: El Juego de Auditoría ($\mathcal{G}$)

La seguridad deja de ser un estado y pasa a ser una **propiedad temporal de gobernabilidad**: *¿Dispongo de suficiente tiempo garantizado para actuar antes del colapso decisional?*

Formalizamos la gobernanza como el juego dinámico secuencial con información parcial:
$$\mathcal{G} = (\mathcal{M}, \Pi_{audit}, \Pi_{adv}, L, \mathcal{I})$$

Donde:
*   $\mathcal{M}$ es el TDS (sistema de transición).
*   $\Pi_{audit}$ es el espacio de políticas del Auditor. La acción del auditor satisface $A_{audit} \supseteq \{\text{Monitorizar}, \text{Intervenir}\}$.
*   $\Pi_{adv}$ es el espacio de políticas adversarias que eligen perturbaciones para inducir pérdidas decisionales.
*   $L$ es la función de pérdida decisional en ejecución.
*   $\mathcal{I}$ es la estructura de información que determina los observables históricos $\Omega^*$ de cada jugador.

### Acción de Intervención (Fallback)
Si el Auditor ejecuta la acción de $\text{Intervenir}$ en el paso $t$, el sistema entra en un modo seguro de contingencia donde se garantiza que la pérdida decisional es nula ($L = 0$) a expensas de la degradación temporal de la operatividad del sistema.

---

## 6. Contrato Dinámico v4.0

El contrato dinámico $\mathcal{C}_{v4}$ certifica la **existencia de una política de auditoría gobernada**, garantizando robustez frente a un modelo de amenaza explícito.

Definimos el contrato como la tupla:
$$\mathcal{C}_{v4} = (T, \Omega, A_{audit}, d_{\text{prob}}, m_{\text{min}}, \epsilon)$$

El contrato se considera **Satisfecho** si existe una política del auditor tal que la pérdida decisional esperada acumulada esté acotada ante cualquier adversario del modelo de amenaza:
$$\text{Satisfied}(\mathcal{C}_{v4}) \iff \exists \pi_{audit} \in \Pi_{audit}, \quad \forall \pi_{adv} \in \Pi_{adv}^{Threat}, \quad \mathbb{E}\left[ \sum_{t=0}^T L_t(\pi_{audit}, \pi_{adv}) \right] \le \epsilon$$

---

## 7. Obligaciones Formales (Propuestas para Lean 4)

### Teorema F-001: Consistencia Decisional y Cobertura Temporal
Demostrar que si una trayectoria $\tau_{:k}$ en ejecución real permanece dentro de la región alcanzable certificada $Reach_h$, la Cobertura Temporal y la Consistencia Decisional garantizan de forma incondicional que la política del agente es óptima:
$$\forall \tau_{:k} \in Reach_h, \quad C(T, \mathcal{T}_{\text{pref}}) \land Consis(T) \implies \mathcal{D}(\tau_{:k}) = \pi(\mathcal{O}(\tau_{:k}))$$

### Teorema F-002: Teorema del Margen de Transición (Garantía del Auditor)
Sea $C_h(\tau_{:t})$ el coste mínimo de transición requerido para alcanzar cualquier estado a distancia temporal $h$ desde la trayectoria $\tau_{:t}$:
$$C_h(\tau_{:t}) = \inf_{\tau'_{:t+h}} \left\{ \sum_{i=t}^{t+h-1} - \log \mathcal{P}(s_{i+1} \mid s_i, a_i) \right\}$$

Demostrar que si el margen dinámico supera el coste del horizonte $h$, entonces no existe ninguna trayectoria de transiciones capaz de provocar un fallo decisional antes de transcurridos $h$ pasos:
$$\forall \tau_{:t}, \quad M_D(\tau_{:t}) > C_h(\tau_{:t}) \implies \forall m < h, \quad \mathcal{D}(\tau_{:t+m}) = \pi(\mathcal{O}(\tau_{:t+m}))$$

*Garantía*: Este teorema asegura de forma matemática que el Auditor dispone de una ventana de tiempo estrictamente mayor o igual a $h$ pasos para activar la acción de $\text{Intervenir}$ antes de experimentar cualquier pérdida real.

---

## 8. Plan Experimental de Validación

El plan empírico en TypeScript constará de una simulación bidimensional donde un agente autónomo navega hacia un objetivo:
1.  **Dinámica**: Un mapa continuo de transición probabilística con corrientes de flujo dinámicas y obstáculos que representan zonas de decisión críticas.
2.  **Adversario**: Una política adversaria que altera sutilmente el flujo del viento/corrientes (dentro del modelo de amenaza) para desviar al agente hacia obstáculos.
3.  **Auditor**: Computa en cada paso el margen dinámico $M_D$ utilizando la estimación de probabilidades de la trayectoria restante.
4.  **Validación**: Confirmar que el Auditor activa la señal de intervención (parada segura) garantizando $L = 0$ siempre que $M_D \le m_{\text{min}}$, bloqueando con éxito la evasión del adversario.

---

## 9. Amenazas a la Validez

1.  **Finitud en Lean 4**: La demostración de teoremas sobre márgenes e ínfimos en Lean exige asumir espacios de trayectorias acotados o discretizados para conservar la decidibilidad matemática.
2.  **Estimación del Operador de Transición ($\mathcal{P}$)**: En sistemas reales, $\mathcal{P}$ se aproxima a partir de datos empíricos. Los errores de aproximación en la probabilidad de transición pueden sesgar el cómputo de $M_D$, reduciendo la ventana real de intervención.
3.  **Especificación del Modelo de Amenaza**: Si la estrategia adversaria real $\pi_{adv}$ excede el subconjunto de políticas autorizadas $\Pi_{adv}^{Threat}$, las garantías de cota de pérdida $\epsilon$ pierden validez matemática.
