# TAKT Theoretical Revision v3.0: Core, Observability, and Operational Layers

Este documento define la estructura revisada y consolidada de TAKT (Theory of Adequate Knowledge for Decisions) tras la finalización de los ciclos experimentales de validación (Fase B), ataques adversariales (Fase C) y consolidación (Fase D).

La teoría se organiza en una arquitectura de tres niveles bien diferenciados, separando los axiomas lógicos inmutables de los mecanismos empíricos y de gobernanza operativa.

---

## 1. Arquitectura de Tres Niveles de TAKT

```
  ┌────────────────────────────────────────────────────────┐
  │ Nivel 3: Capa Operativa (Contrato Dinámico C)          │ <-- Gobernanza
  └───────────────────────────┬────────────────────────────┘
                              ▼
  ┌────────────────────────────────────────────────────────┐
  │ Nivel 2: Capa de Observabilidad (Margin M & Coverage C)│ <-- Verificación
  └───────────────────────────┬────────────────────────────┘
                              ▼
  ┌────────────────────────────────────────────────────────┐
  │ Nivel 1: Núcleo Formal (Axiomas de Kernels)            │ <-- Lógica
  └────────────────────────────────────────────────────────┘
```

### Nivel 1: El Núcleo Formal (Formal Core)
* **Propósito:** Definir de manera absoluta e inmutable qué significa que una representación sea segura.
* **Componentes:**
  - El espacio de estados $S$, el espacio de acciones $A$, la decisión ideal $D : S \to A$, y la representación $R : S \to Z$.
  - **Axioma Fundamental de Seguridad Decisional (Estático):**
    \[
    \ker(R) \subseteq \ker(D)
    \]
* **Estatus de Gobernanza:** **Congelado**. Ningún resultado experimental puede modificar este núcleo lógico; es la constante teórica.

### Nivel 2: La Capa de Observabilidad (Observability Layer)
* **Propósito:** Permitir la verificación empírica y la generalización de la seguridad en entornos reales donde el dominio completo $S$ no es totalmente accesible o está sujeto a derivas.
* **Componentes:**
  - **Métrica de Margen Decisional ($M(R)$):** Cuantifica la distancia preventiva al fallo en espacios métricos:
    \[
    M(R) = \inf \{ d(x, y) \mid x, y \in S, \quad R(x) \neq R(y) \land D(x) \neq D(y) \}
    \]
  - **Condición de Cobertura de Fibras ($C(T, S)$):** Condición requerida para que las pruebas en el conjunto de test $T$ garanticen seguridad en todo $S$:
    \[
    C(T, S) \iff \forall x \in S, \quad \exists x' \in T, \quad R(x) = R(x') \land D(x) = D(x')
    \]
* **Estatus de Gobernanza:** **Capa de Extensión**. Define las métricas de monitoreo y las reglas de diseño para la toma de muestras empíricas.

### Nivel 3: La Capa Operativa (Operational Layer)
* **Propósito:** Asegurar y gobernar el comportamiento alineado del sistema dinámico a lo largo de la composición, las interacciones multi-agente y la deriva temporal.
* **Componentes:**
  - **Contrato Dinámico de Seguridad ($\mathcal{C}$):** Tupla $\mathcal{C} = (R, D, \pi, T, d, m_{\text{min}})$ que gobierna la ejecución de la política de acción $\pi: Z \to A$ bajo perturbaciones temporales ($\delta < M(R)/2$), desalineaciones de política en redes distribuidas, y brechas de cobertura.
* **Estatus de Gobernanza:** **Capa de Protocolo**. Define los mecanismos preventivos de control y alertamiento en tiempo de ejecución.

---

## 2. Correspondencia con Modos de Fallo Experimentales

Cada elemento de la arquitectura teórica de TAKT responde a un límite o modo de fallo descubierto de forma rigurosa y verificado en Lean 4 durante el programa experimental:

| Componente Teórico | Hito / Experimento de Origen | Modo de Fallo Mitigado |
| :--- | :--- | :--- |
| **Seguridad de Kernel ($\ker(R) \subseteq \ker(D)$)** | **ST-001** (Empates y Utility Regret) | La optimización de utilidad ($\varepsilon_U=0$) puede enmascarar inestabilidades y violaciones decisionales ($\varepsilon_D > 0$). |
| **Alineación de la Política ($\pi$)** | **ST-002** (Pipelines de Composición) | La composición local segura es globalmente insegura si la segunda etapa no está alineada con la política inducida de la primera. |
| **Cobertura de Fibras ($C(T, S)$)** | **ST-004** (Hidden Kernel Attack) | Un conjunto de test $T \subset S$ incompleto permite la supervivencia silenciosa de colisiones del kernel fuera del test. |
| **Política Dinámica ($\pi_A \to \pi'_A$)** | **ST-005** (Deriva Distribuida) | Un desplazamiento en la política de un nodo externo destruye la seguridad decisional de los nodos acoplados. |
| **Margen Decisional ($M(R)$)** | **ST-006** (Deriva Temporal Lenta) | Perturbaciones infinitesimales acumuladas destruyen repentinamente la seguridad sin disparar alertas incrementales locales. |
| **Límite de Representaciones Locales** | **ST-008** (Convergence Gap) | Ninguna representación local y acotada ($R: \mathcal{S} \to \mathcal{Z}$) puede preservar decisiones que dependan de información externa ($W$) no contenida en $\mathcal{S}$. Demostración por teorema de imposibilidad (ver Convergence Impossibility Theorem). |

---

## 3. Teoremas Fundamentales de Consolidación

La relación entre las tres capas se formaliza mediante los siguientes teoremas probados en Lean 4:

1. **Teorema de Generalización de Cobertura (D-002):**
   \[
   \text{safe}_T(R, D) \land C(T, S) \implies \ker(R) \subseteq \ker(D)
   \]
   Garantiza que la observabilidad empírica es suficiente para la seguridad lógica del Núcleo (Nivel 2 $\to$ Nivel 1).
2. **Teorema de Garantía del Contrato Dinámico (D-003):**
   \[
   \text{Satisfied}(\mathcal{C}) \implies \ker(R) \subseteq \ker(D) \land (\forall x \in S, \quad D(x) = \pi(R(x)))
   \]
   Garantiza que la satisfacción del contrato dinámico en tiempo de ejecución blinda la seguridad del Núcleo y la alineación del comportamiento del agente (Nivel 3 $\to$ Nivel 1).
