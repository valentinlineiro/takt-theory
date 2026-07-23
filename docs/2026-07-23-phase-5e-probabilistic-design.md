# Phase V-E: Probabilistic Governance — Design Specification

> **Status:** Active Spec for Phase V-E (Probabilistic Governance & Volume V Closure).
> 
> **Prerequisites:** Phase V-0 (Extension Roadmap), Phase V-A (Metatheory), Phase V-B (Composition), Phase V-C (Categorical Unification), Phase V-D (Computational Complexity), Volumes I–IV-C.

---

## 1. Contexto y Principio Rector Metodológico

Tras establecer la metateoría (V-A), la composición de sistemas (V-B), la unificación categórica (V-C) y la complejidad computacional (V-D), la **Fase V-E (Teoría Probabilística de Gobernanza)** completa el programa de investigación del Volumen V extendiendo TAKT a entornos con información incompleta, observabilidad parcial y trazas estocásticas.

Para garantizar que V-E constituye una **extensión conservativa** y no una bifurcación o teoría paralela, se fija el siguiente principio rector:

> [!IMPORTANT]
> **Principio Rector de Conservatividad Probabilística:**
> *La teoría probabilística no reemplaza la teoría determinista; la contiene como caso límite cuando la incertidumbre desaparece ($P(\tau) = \delta_{\tau_0}$).*

---

## 2. Los Cinco Bloques de Gobernanza Probabilística

```text
                  Phase V-E: Probabilistic Governance
                                   │
     ┌──────────────┬──────────────┼──────────────┬──────────────┐
     ▼              ▼              ▼              ▼              ▼
 Block V-E.1    Block V-E.2    Block V-E.3    Block V-E.4    Block V-E.5
Soft Detectors  α-Confidence   Stochastic    Probability    Deterministic
 (D: τ ↦ [0,1])  Governance      EVSI        Monad (GovDet) Conservativity
```

---

### Bloque V-E.1 — Detectores Probabilísticos y Margen Estocástico

#### Definiciones Estructuradas
1. **Detector Suave ($D_{\text{soft}}$):**
   Un detector probabilístico es una función integrable sobre trazas de eventos $\tau$:
   $$D_{\text{soft}} : \tau \longrightarrow [0, 1]$$
   donde $D_{\text{soft}}(\tau)$ representa el grado de evidencia o confianza en la validez del estado.

2. **Distribución de Trazas ($P(\tau)$):**
   La evolución del entorno genera una medida de probabilidad $P$ sobre el espacio de trazas $\mathcal{T}$.

3. **Margen Dinámico Estocástico ($M_D^{\mathbb{P}}$):**
   $$M_D^{\mathbb{P}} = \mathbb{E}_{\tau \sim P} [M_D(\tau)]$$

---

### Bloque V-E.2 — Gobernanza Probabilística ($\alpha$-Confianza)

#### Definición (Predicado de $\alpha$-Confianza en Gobernanza)
Un sistema $S$ satisface la **$(\epsilon, \alpha)$-gobernanza probabilística** si la probabilidad de violar la cota de regret $\epsilon$ no supera $1 - \alpha$:
$$\mathbb{P}_{\tau \sim P}\left( Gov_\epsilon(D_{\text{soft}}(\tau)) \right) \ge \alpha$$
equivalente a la cota de Markov/Chebyshev sobre el regret esperado:
$$\mathbb{E}_{\tau \sim P}[Regret(D_{\text{soft}}(\tau))] \le (1 - \alpha)\epsilon$$

#### Teorema V-E.2.1 (Monotonía de Confianza)
Para todo $\alpha_1 \le \alpha_2$, la $(\epsilon, \alpha_2)$-gobernanza implica $(\epsilon, \alpha_1)$-gobernanza.

---

### Bloque V-E.3 — EVSI Probabilístico e Información Espacial

#### Definición (EVSI Estocástico)
El Valor Esperado de la Información Estocástica para un enriquecimiento $E \in \mathcal{E}$ bajo una distribución de observaciones $P(\tau)$ es la reducción esperada en la distancia de perfección $\delta$:
$$EVSI_{\mathbb{P}}(E) = \mathbb{E}_{\tau \sim P} \left[ \delta(D, \tau) - \delta(\Phi(D, E), \tau) \right] - Cost(E)$$

#### Teorema V-E.3.1 (Parada EVSI Estocástica)
La trayectoria de enriquecimiento estocástico óptima $\pi_{\mathbb{P}}^*$ satisface:
$$EVSI_{\mathbb{P}}(E^*) \le 0 \implies \text{STOP}$$

---

### Bloque V-E.4 — Mónada de Probabilidad sobre $\mathbf{GovDet}$

#### Definición Monádica
Tras establecer la teoría probabilística, se formaliza como una **mónada de probabilidad $\mathcal{T}_{\mathbb{P}}$** (tipo mónada de Giry o mónada de espacios convexos) sobre la categoría monoidal $\mathbf{GovDet}$:
$$\mathcal{T}_{\mathbb{P}} : \mathbf{GovDet} \longrightarrow \mathbf{GovDet}$$
donde para cada detector $D$, $\mathcal{T}_{\mathbb{P}}(D)$ es el detector suave resultante ponderado sobre la distribución de trazas.

#### Teorema V-E.4.1 (Propiedad de Mónada Categórica)
La tupla $(\mathcal{T}_{\mathbb{P}}, \eta, \mu)$ satisface los axiomas monádicos de unidad y multiplicación en $\mathbf{GovDet}$:
$$\mu \circ \mathcal{T}_{\mathbb{P}}(\eta) = \text{id}_{\mathcal{T}_{\mathbb{P}}}$$

---

### Bloque V-E.5 — Teorema de Conservatividad Determinista (Cierre de Volumen V)

#### Teorema V-E.5.1 (Colapso Determinista del Límite de Dirac)
Sea $P(\tau) = \delta_{\tau_0}$ la medida de probabilidad degenerada en una única traza determinista $\tau_0$.
Entonces:
1. El detector suave colapsa a la función característica determinista:
   $$D_{\text{soft}}(\tau_0) \in \{0, 1\}$$
2. La $(\epsilon, \alpha)$-gobernanza probabilística coincide exactamente con el predicado determinista de IV-C:
   $$\mathbb{P}_{\tau_0}\left( Gov_\epsilon(D(\tau_0)) \right) \ge \alpha \iff Gov_\epsilon(D(\tau_0))$$
3. El EVSI estocástico $EVSI_{\mathbb{P}}(E)$ se reduce isomórficamente al EVSI determinista de IV-C.4.

> [!CHECK]
> **Cierre del Volumen V:** Este teorema certifica que el Volumen V mantiene intacto el núcleo axiomático determinista de TAKT.

---

## 3. Plan de Mecanización en Lean 4

El trabajo formal de la Fase V-E se ubicará en `takt-formal/TaktFormal/Probabilistic/`:

```text
takt-formal/TaktFormal/Probabilistic/
├── SoftDetector.lean     -- Detectores suaves D: τ ↦ [0,1] y margen estocástico
├── Governance.lean       -- Predicado de (ε, α)-gobernanza probabilística
├── StochasticEVSI.lean   -- EVSI estocástico e información esperada
├── Monad.lean            -- Mónada de probabilidad T_P sobre GovDet
├── Conservativity.lean   -- Teorema V-E.5.1 (Colapso Dirac a núcleo determinista)
└── Probabilistic.lean    -- Re-exportador global TaktFormal.Probabilistic
```

Cada archivo incluirá la cabecera obligatoria `Module`, `Depends on` y `Exports`.

---

## 4. Criterios de Aceptación y Cierre de Volumen V

La Fase V-E y el **Volumen V** se considerarán formalmente cerrados cuando:
1. Este documento de especificación sea aprobado.
2. Los 5 módulos en Lean 4 compilen cleanly sin advertencias y con **0 `sorry`s**.
3. Se demuestre formalmente el **Teorema de Colapso Determinista (V-E.5.1)** en Lean 4.
