# Phase F — Strategic Governance Framework (TAKT v4.0 Spec)

Este documento especifica el diseño formal y los fundamentos teóricos de **TAKT v4.0**. Introduce el paso de configuraciones estáticas de estados a trayectorias dinámicas bajo interacción estratégica, formalizando la gobernanza de decisiones como un juego dinámico de información parcial.

---

## 1. Motivación y Principio de Trayectoria

La Fase E (Red Team v3.0) demostró de forma concluyente que evaluar la seguridad decisional como una propiedad geométrica estática sobre estados aislados es insuficiente ante derivas temporales, cambios exógenos del entorno y oponentes inteligentes. 

Para absorber de forma matemática estas fronteras, TAKT v4.0 se fundamenta en el **Principio de Trayectoria**:
> La unidad fundamental de análisis deja de ser el estado individual y pasa a ser la trayectoria observada. Todas las propiedades de gobernanza, seguridad y alineación se formulan sobre procesos temporales, no sobre configuraciones instantáneas.

---

## 2. Estructura Teórica: Del Sistema al Contrato

El marco conceptual de TAKT v4.0 se construye como una progresión de tres niveles de abstracción claramente delimitados:

$$\mathcal{M} \text{ (Sistema Físico)} \implies \mathcal{G} \text{ (Juego Estratégico)} \implies \mathcal{C}_{v4} \text{ (Garantía de Contrato)}$$

1.  **El Sistema de Transición ($\mathcal{M}$)**: Representa la realidad física y dinámica del dominio gobernado.
2.  **El Juego de Auditoría ($\mathcal{G}$)**: Define el espacio estratégico de interacción, las políticas disponibles y la estructura de información de los jugadores.
3.  **El Contrato de Gobernanza ($\mathcal{C}_{v4}$)**: Es un artefacto normativo y de control construido sobre el juego para garantizar cotas de pérdida en ejecución.

---

## 3. Modelo del Sistema: Sistema de Decisión en Trayectorias (TDS)

Definimos un **Sistema de Decisión en Trayectorias (TDS)** mediante la tupla:
$$\mathcal{M} = (S, A, \mathcal{P}, \Omega, \mathcal{O})$$

Donde:
*   $S$ es el espacio de estados.
*   $A$ es el espacio de acciones/decisiones.
*   $\mathcal{P}: S \times A \to \Delta(S)$ es el operador de transición probabilístico del sistema. Si una transición es físicamente imposible, $\mathcal{P}(s_{i+1} \mid s_i, a_i) = 0$.
*   $\Omega$ es el espacio de observaciones.
*   $\mathcal{O}: S \to \Omega$ es la función de observación, interpretada como el operador de información disponible para la toma de decisiones (no meramente una abstracción estática).

Extendemos $\mathcal{O}$ a secuencias de estados $\mathcal{O}: S^* \to \Omega^*$ mediante aplicación elemento a elemento:
$$\mathcal{O}((s_0, \dots, s_k)) = (\mathcal{O}(s_0), \dots, \mathcal{O}(s_k))$$

### Trayectorias y Prefijos
Una trayectoria $\tau$ de longitud $N$ es una secuencia temporal:
$$\tau = (s_0, a_0, s_1, a_1, \dots, s_N) \in \mathcal{T}$$
Denotamos como $\tau_{:k} \in \mathcal{T}_{\text{pref}}$ al prefijo de la trayectoria hasta el paso $k$.

### Política de Referencia Ideal ($\mathcal{D}$)
Prescribe la acción óptima condicionada estrictamente a la historia transcurrida, evitando dependencias causales de estados futuros:
$$\mathcal{D}: \mathcal{T}_{\text{pref}} \to A$$
De modo que la acción óptima en el paso $k$ es $a_k^* = \mathcal{D}(\tau_{:k})$, i.e., la acción que se ejecuta desde $s_k$ para transitar a $s_{k+1}$. Es la acción inmediatamente siguiente al prefijo observado, no una acción ya contenida en $\tau_{:k}$.

### Política del Agente ($\pi$)
El agente opera bajo observabilidad limitada y decide basándose en la secuencia histórica de observaciones:
$$\pi: \Omega^* \to A$$

---

## 4. Observabilidad Dinámica (Cobertura Temporal)

La observabilidad dinámica separa la equivalencia observacional de la consistencia decisional del sistema.

### Equivalencia Observacional ($\equiv_{\mathcal{O}}$)
Dos prefijos de trayectoria $\tau_{:k}$ y $\tau'_{:k}$ son observacionalmente equivalentes si y solo si producen la misma secuencia de observaciones históricas:
$$\tau_{:k} \equiv_{\mathcal{O}} \tau'_{:k} \iff \mathcal{O}(\tau_{:k}) = \mathcal{O}(\tau'_{:k})$$
Donde $\mathcal{O}(\tau_{:k}) = (\mathcal{O}(s_0), \dots, \mathcal{O}(s_k))$.

### Cobertura Temporal ($C(T_{\text{audit}}, \mathcal{T}_{\text{pref}})$)
Sea $T_{\text{audit}} \subset \mathcal{T}_{\text{pref}}$ el conjunto de trayectorias prefijas de prueba/auditoría. Existe cobertura temporal si todo prefijo de trayectoria transitable en ejecución real posee una trayectoria observacionalmente equivalente en $T_{\text{audit}}$:
$$C(T_{\text{audit}}, \mathcal{T}_{\text{pref}}) \iff \forall \tau_{:k} \in \mathcal{T}_{\text{pref}}, \quad \exists \tau'_{:k} \in T_{\text{audit}} \quad \text{t.q.} \quad \tau_{:k} \equiv_{\mathcal{O}} \tau'_{:k}$$

### Consistencia Decisional ($Consis(T_{\text{audit}})$)
Exige que la política ideal de referencia sea única e idéntica para toda trayectoria dentro de la misma clase de equivalencia observacional registrada en $T_{\text{audit}}$:
$$Consis(T_{\text{audit}}) \iff \forall \tau_{:k}, \tau'_{:k} \in T_{\text{audit}}, \quad \tau_{:k} \equiv_{\mathcal{O}} \tau'_{:k} \implies \mathcal{D}(\tau_{:k}) = \mathcal{D}(\tau'_{:k})$$

### Persistencia y Región Alcanzable en Horizonte ($Reach_h$)
Para un horizonte $h \ge 1$, definimos el conjunto de estados alcanzables con probabilidad positiva en $h$ pasos de transición:
$$Reach_h(\tau_{:k}) \subseteq S$$
La cobertura temporal es **persistente** si $T_{\text{audit}}$ contiene preimágenes observacionales para toda la región alcanzable en el horizonte de predicción.

---

## 5. Margen Dinámico ($M_D$)

El margen dinámico mide la **robustez dinámica local y accesibilidad al fallo** mediante un coste de transición probabilístico.

### Coste Acumulado de Sorpresa
Para cualquier transición $s_i \xrightarrow{a_i} s_{i+1}$, definimos su coste (sorpresa o energía de transición) como:
$$c(s_i, a_i, s_{i+1}) = - \log \mathcal{P}(s_{i+1} \mid s_i, a_i)$$
*Nota*: Si la transición es imposible ($\mathcal{P} = 0$), el coste de sorpresa es infinito ($c = \infty$).

### Margen Dinámico de Trayectoria ($M_D(\tau_{:k})$)
El margen dinámico de la trayectoria prefija $\tau_{:k}$ es el coste mínimo acumulado de la trayectoria de transiciones más accesible para alcanzar el primer estado donde aparece una pérdida decisional:
$$M_D(\tau_{:k}) = \inf_{m \ge 1} \inf_{\tau'_{:k+m}} \left\{ \sum_{i=k}^{k+m-1} - \log \mathcal{P}(s_{i+1} \mid s_i, a_i) \right\}$$
Sujeto a:
1.  $\tau'_{:k} = \tau_{:k}$ (extensión desde la trayectoria actual).
2.  $\mathcal{D}(\tau'_{:k+m}) \neq \pi(\mathcal{O}(\tau'_{:k+m}))$ (el estado final de la extensión es un colapso decisional).

---

## 6. Gobernanza Estratégica: El Juego de Auditoría ($\mathcal{G}$)

La seguridad deja de ser un estado y pasa a ser una **propiedad temporal de gobernabilidad**: *¿Dispongo de suficiente tiempo garantizado para actuar antes del colapso decisional?*

Formalizamos la gobernanza como el juego dinámico secuencial con información parcial:
$$\mathcal{G} = (\mathcal{M}, \Pi_{audit}, \Pi_{adv}, L, \mathcal{I})$$

Donde:
*   $\mathcal{M}$ es el TDS (sistema de transición).
*   $\Pi_{audit}$ es el espacio de políticas del Auditor. La acción del auditor satisface $A_{audit} \supseteq \{\text{Monitorizar}, \text{Intervenir}\}$.
*   $\Pi_{adv}$ es el espacio de políticas adversarias que eligen perturbaciones para inducir pérdidas decisionales. $\Pi_{adv}^{Threat} \subseteq \Pi_{adv}$ denota el subconjunto de políticas adversarias contempladas en el modelo de amenaza, que acota el espacio de perturbaciones frente al cual el contrato ofrece garantías.
*   $L$ es la función de pérdida decisional en ejecución.
*   $\mathcal{I}$ es la estructura de información que determina los observables históricos $\Omega^*$ de cada jugador.

### Acción de Intervención (Fallback)
Si el Auditor ejecuta la acción de $\text{Intervenir}$ en el paso $t$, el sistema entra en un modo seguro de contingencia donde se garantiza que la pérdida decisional es nula ($L = 0$) a expensas de la degradación temporal de la operatividad del sistema.

---

## 7. Contrato Dinámico v4.0

El contrato dinámico $\mathcal{C}_{v4}$ deja de verificar una configuración dada y se redefine como un **problema de síntesis de política de auditoría robusta** (Synthesis of Robust Control Policy):

$$\mathcal{C}_{v4} = (H, \Omega, A_{audit}, d_{\text{prob}}, m_{\text{min}}, \epsilon)$$

Donde $H \in \mathbb{N}$ es el horizonte de evaluación del contrato (independiente del conjunto de prueba $T_{\text{audit}}$ definido en §4).

El contrato se considera **Satisfecho** si y solo si es posible sintetizar una política del auditor capaz de acotar la pérdida decisional esperada acumulada en $H$ pasos ante cualquier política adversaria compatible con el modelo de amenaza:
$$\text{Satisfied}(\mathcal{C}_{v4}) \iff \exists \pi_{audit} \in \Pi_{audit}, \quad \forall \pi_{adv} \in \Pi_{adv}^{Threat}, \quad \mathbb{E}\left[ \sum_{t=0}^H L_t(\pi_{audit}, \pi_{adv}) \right] \le \epsilon$$

---

## 8. Obligaciones Formales (Propuestas para Lean 4)

### Teorema F-001: Consistencia Decisional y Cobertura Temporal
Demostrar que si una trayectoria $\tau_{:k}$ en ejecución real permanece dentro de la región alcanzable certificada $Reach_h$, la Cobertura Temporal y la Consistencia Decisional garantizan de forma incondicional que la política del agente es óptima:
$$\forall \tau_{:k} \in Reach_h, \quad C(T_{\text{audit}}, \mathcal{T}_{\text{pref}}) \land Consis(T_{\text{audit}}) \implies \mathcal{D}(\tau_{:k}) = \pi(\mathcal{O}(\tau_{:k}))$$

### Teorema F-002: Guaranteed Intervention Horizon Theorem
Sea $C_h^{\max}(\tau_{:t})$ el coste **máximo** de transición requerido para recorrer cualquier trayectoria de exactamente $h$ pasos desde $\tau_{:t}$:
$$C_h^{\max}(\tau_{:t}) = \sup_{\tau'_{:t+h}} \left\{ \sum_{i=t}^{t+h-1} - \log \mathcal{P}(s_{i+1} \mid s_i, a_i) \right\}$$
sujeto a $\tau'_{:t} = \tau_{:t}$.

Demostrar que si el margen dinámico supera el coste máximo de cualquier trayectoria de $h$ pasos, entonces no existe ninguna trayectoria de transiciones capaz de provocar un fallo decisional antes de transcurridos $h$ pasos:
$$\forall \tau_{:t}, \quad M_D(\tau_{:t}) > C_h^{\max}(\tau_{:t}) \implies \forall m < h, \quad \mathcal{D}(\tau_{:t+m}) = \pi(\mathcal{O}(\tau_{:t+m}))$$

*Nota*: La corrección se sigue de que cualquier trayectoria de fallo de longitud $m < h$ puede extenderse a $h$ pasos sin disminuir su coste (pues $-\log \mathcal{P} \ge 0$), y $C_h^{\max}$ acota superiormente toda trayectoria de $h$ pasos. Si existiera un fallo en $m < h$, su coste estaría acotado entre $M_D$ y $C_h^{\max}$, contradiciendo $M_D > C_h^{\max}$.

---

## 8.5. Observación Experimental: Conservative Margin Calibration (F-005)

Se trata de una **proposición de diseño** basada en evidencia experimental, no de un teorema formal.

**Observación.** La evidencia experimental sugiere que introducir un desplazamiento conservador $\beta \ge 0$ sobre el margen dinámico estimado,

$$M_D^{safe}(\tau_{:t}) = M_D(\hat{\mathcal{P}}, \tau_{:t}) - \beta,$$

induce una **frontera de Pareto** entre seguridad y eficiencia: $\beta$ pequeño elimina falsas alarmas pero retiene falsos seguros; $\beta$ intermedio ($\beta \in [0.2, 0.5]$) reduce los falsos seguros en $\sim 90\%$ sin generar falsas alarmas; $\beta$ grande elimina los falsos seguros pero introduce falsas alarmas.

El sesgo de estimación en $\mathcal{P}$ es **asimétrico**: la sobreestimación de la seguridad (sesgo optimista) puede invalidar la garantía contractual, mientras que la subestimación (sesgo pesimista) preserva la garantía a costa de eficiencia operativa. Una corrección universal no es viable — $\beta$ está diseñado para el lado optimista del error.

**Implicación de diseño.** $\beta$ deja de ser un hiperparámetro de ajuste y pasa a ser un **parámetro explícito de gobernanza** cuya elección se justifica mediante la curva de compromiso observada. Una posible generalización teórica futura es la aproximación

$$M_D^{safe} \approx \inf_{\mathcal{P} \in \mathcal{U}} M_D(\mathcal{P}),$$

donde $\mathcal{U}$ es un conjunto de incertidumbre alrededor de $\hat{\mathcal{P}}$.

---

## 9. Plan Experimental de Validación

Los experimentos de la Fase F se estructurarán en lotes secuenciales de validación empírica en TypeScript para asegurar la modularidad de los resultados:

1.  **Batch F-001 (Validación de Cobertura Temporal)**: Implementar y verificar el detector de equivalencia observacional $\equiv_{\mathcal{O}}$ y de consistencia decisional sobre bases de datos de trayectorias.
2.  **Batch F-002 (Validación del Margen Dinámico)**: Simular trayectorias de estados y calcular $M_D$ mediante algoritmos de búsqueda del camino más corto probabilístico (Dijkstra sobre sorpresas $-\log \mathcal{P}$).
3.  **Batch F-003 (Validación de Horizonte Garantizado)**: Validar experimentalmente la ventana temporal de $h$ pasos predicha por el *Guaranteed Intervention Horizon Theorem*.
4.  **Batch F-004 (Juego Auditor-Adversario Completo)**: Simular la interacción estratégica de las políticas optimizadas de intervención frente a perturbaciones del modelo de amenaza.
5.  **Batch F-005 (Error de Estimación en $\mathcal{P}$)**: Identificar la vulnerabilidad asimétrica del contrato ante errores en el operador de transición estimado $\hat{\mathcal{P}}$. Demostrar que el sesgo optimista puede invalidar la garantía contractual mientras que el pesimista solo reduce eficiencia.
6.  **Batch F-005.1 (Barrido de Corrección Conservadora $\beta$)**: Demostrar experimentalmente que $\beta \in [0.2, 0.5]$ proporciona una reducción controlada de falsos seguros ($\sim 90\%$) sin generación de falsas alarmas, validando la existencia de una frontera de Pareto gobernable.

---

## 10. Amenazas a la Validez

1.  **Finitud en Lean 4**: La demostración de teoremas sobre márgenes e ínfimos en Lean exige asumir espacios de trayectorias acotados o discretizados para conservar la decidibilidad matemática.
2.  **Estimación del Operador de Transición ($\mathcal{P}$)**: En sistemas reales, $\mathcal{P}$ se aproxima a partir de datos empíricos. Los errores de aproximación en la probabilidad de transición pueden sesgar el cómputo de $M_D$, reduciendo la ventana real de intervención. La evidencia experimental (F-005) muestra que esta degradación es **asimétrica**: el sesgo optimista invalida la garantía; el pesimista solo reduce eficiencia. La corrección conservadora $M_D - \beta$ (F-005.1) mitiga el sesgo optimista de forma controlada.
3.  **Especificación del Modelo de Amenaza**: Si la estrategia adversaria real $\pi_{adv}$ excede el subconjunto de políticas autorizadas $\Pi_{adv}^{Threat}$, las garantías de cota de pérdida $\epsilon$ pierden validez matemática.
4.  **Dependencia de la Estructura de Información ($\mathcal{I}$)**: Si la estructura de información real del sistema (latencia, ruido de sensores, pérdida de observaciones) difiere de la asumida por el auditor, las garantías de gobernanza dinámica pueden degradarse significativamente.
5.  **Tratabilidad Computacional**: El cómputo exacto de $Reach_h$, $M_D$ y políticas de auditoría óptimas puede ser intratable en espacios de estados grandes o continuos. Las implementaciones prácticas requerirán aproximaciones cuyo impacto sobre las garantías formales debe caracterizarse.
