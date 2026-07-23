# Phase V-B: Governed System Composition — Design Specification

> **Status:** Active Spec for Phase V-B (Governed System Composition).
> 
> **Prerequisites:** Phase V-0 (Extension Roadmap), Phase V-A (Metatheory of TAKT), Volumes I–IV-C.

---

## 1. Contexto y Pregunta Central de Investigación

Mientras que las Fases I a IV-C formalizan la gobernanza de un **único sistema aislado** $S$, las arquitecturas modernas (redes multi-agente, microservicios, pipelines de decisión y orquestadores) operan sobre **ecosistemas de sistemas interactuantes**.

La **Fase V-B (Teoría de Composición de Sistemas Gobernados)** da el paso de sistemas individuales a sistemas compuestos, estudiando cómo interactúan los márgenes, las brechas de capacidad y la $\epsilon$-gobernanza bajo operadores de composición.

### Pregunta Central de V-B
> **¿Qué ocurre cuando varios sistemas gobernados interactúan y qué propiedades de gobernanza se preservan?**

---

## 2. Los Cinco Bloques de Composición

```text
               Phase V-B: Governed System Composition
                                 │
     ┌──────────────┬────────────┼────────────┬──────────────┐
     ▼              ▼            ▼            ▼              ▼
  Block V-B.1   Block V-B.2  Block V-B.3  Block V-B.4    Block V-B.5
 Composite Model Preservation  Geometry    Distributed   Compositional
  (S₁ ⊗ S₂)     (Soundness) (ε-Gov Thm)   EVSI (π₁* ⊗ π₂*) Limits
```

---

### Bloque V-B.1 — Modelo de Sistemas Compuestos

#### Definiciones Algebraicas
Sean dos sistemas gobernados $S_1 = (R_1, D_1, \mathcal{G}_{D_1}, \Phi_1)$ y $S_2 = (R_2, D_2, \mathcal{G}_{D_2}, \Phi_2)$.

1. **Composición Paralela ($S_1 \otimes S_2$):**
   - Espacio de estados compuesto: $\mathcal{S}_{12} = \mathcal{S}_1 \times \mathcal{S}_2$.
   - Kernel de representación compuesto: $\text{ker}(R_1 \otimes R_2) = \text{ker}(R_1) \times \text{ker}(R_2)$.
   - Kernel de decisión ideal: $K_{D_1 \otimes D_2} = K_{D_1} \times K_{D_2}$.
   - Detector compuesto: $D_1 \otimes D_2 : \tau_1 \times \tau_2 \to \{\top, \bot\}$.

2. **Composición en Cascada / Secuencial ($S_2 \circ S_1$):**
   - La traza de salida $\tau_1$ de $S_1$ se convierte en la traza de entrada de $S_2$.
   - Espacio de transición compuesto: $\Phi_{21}(D_2 \circ D_1, E_2 \circ E_1)$.

#### Principio de Compatibilidad de Interfaz
Dos sistemas $S_1$ y $S_2$ son **composables** si el espacio de capacidades $\mathcal{C}_1$ y $\mathcal{C}_2$ satisface las restricciones de interfaz de decisión $\mathcal{C}_{D_1 \otimes D_2} \subseteq \mathcal{C}_1 \cup \mathcal{C}_2$.

---

### Bloque V-B.2 — Preservación Estructural (Soundness y Reachability)

#### Teorema V-B.2.1 (Preservación de Solidez Paralela)
Si $D_1$ es un detector sólido en $S_1$ y $D_2$ es un detector sólido en $S_2$, entonces el detector compuesto $D_1 \otimes D_2$ es **sólido** en $S_1 \otimes S_2$:
$$\text{SoundDetector}(D_1) \land \text{SoundDetector}(D_2) \implies \text{SoundDetector}(D_1 \otimes D_2)$$

#### Teorema V-B.2.2 (Preservación de Alcanzabilidad en Cascada)
Si $D_{\text{top}}^{(1)}$ es alcanzable en $S_1$ vía $\pi_1^*$ y $D_{\text{top}}^{(2)}$ es alcanzable en $S_2$ vía $\pi_2^*$, entonces $D_{\text{top}}^{(2)} \circ D_{\text{top}}^{(1)}$ es alcanzable en $S_2 \circ S_1$ mediante la trayectoria compuesta $\pi_2^* \circ \pi_1^*$.

---

### Bloque V-B.3 — Propagación Geométrica y Teorema de Transmisión de $\epsilon$-Gobernanza

#### Teorema V-B.3.1 (Cota de Distancia en Composición Paralela)
La distancia de perfección $\delta$ en composición paralela satisface la cota de suma norma:
$$\delta(S_1 \otimes S_2) \le \delta(S_1) + \delta(S_2)$$

#### Teorema V-B.3.2 (Teorema Central de Transmisión de $\epsilon$-Gobernanza)
Si $S_1$ satisface $\epsilon_1$-gobernanza y $S_2$ satisface $\epsilon_2$-gobernanza, entonces el sistema compuesto $S_1 \otimes S_2$ satisface $\epsilon'$-gobernanza, donde $\epsilon' = \epsilon_1 + \epsilon_2$:
$$Gov_{\epsilon_1}(S_1) \land Gov_{\epsilon_2}(S_2) \implies Gov_{\epsilon_1 + \epsilon_2}(S_1 \otimes S_2)$$

#### Corolario (Composición Sub-aditiva de Regret)
El regret máximo del sistema compuesto satisface $Regret(S_1 \otimes S_2) \le \epsilon_1 + \epsilon_2$.

---

### Bloque V-B.4 — Optimización Distribuida y EVSI Compuesto

#### Definición
Sea $EVSI_1(E_1)$ el valor esperado de la información de enriquecimiento $E_1$ en $S_1$ y $EVSI_2(E_2)$ en $S_2$.

#### Teorema V-B.4.1 (Sub-aditividad del EVSI Paralelo Independiente)
Si los espacios de decisión de $S_1$ y $S_2$ son independientes, la optimización distribuida separable es idéntica a la optimización conjunta:
$$EVSI(E_1 \otimes E_2) = EVSI_1(E_1) + EVSI_2(E_2)$$
$$\pi_{12}^* = \pi_1^* \otimes \pi_2^*$$

#### Teorema V-B.4.2 (Super-aditividad del EVSI Cooperativo)
Si existe acoplamiento de capacidad ($\mathcal{C}_{D_1 \otimes D_2} \cap \mathcal{C}_1 \cap \mathcal{C}_2 \neq \emptyset$), el enriquecimiento de $S_2$ puede reducir la brecha de $S_1$, generando sinergia cooperativa:
$$EVSI(E_1 \otimes E_2) \ge EVSI_1(E_1) + EVSI_2(E_2)$$

---

### Bloque V-B.5 — Límites de Composición e Imposibilidades

#### Teorema V-B.5.1 (No-Invariancia de Inalcanzabilidad Local)
La inalcanzabilidad local en un sistema no implica inalcanzabilidad compuesta:
$$\text{Unreachable}(S_1) \kern-0.5em\implies\kern-0.5em \text{Unreachable}(S_1 \otimes S_2)$$
*Demostración:* Si $S_2$ provee la capacidad faltante $c \in G(D_1, R_1)$, el sistema compuesto $S_1 \otimes S_2$ elimina la brecha, demostrando resolución cooperativa de inalcanzabilidad.

#### Teorema V-B.5.2 (Barrera de Transmisión de Errores en Cascada)
En composición en cascada $S_2 \circ S_1$, la propagación del error no es acotada aditivamente si $S_1$ es inestable:
$$\delta(S_2 \circ S_1) \le L_2 \cdot \delta(S_1) + \delta(S_2)$$
donde $L_2$ es la constante de Lipschitz de amplificación de error de $S_2$.

---

## 3. Plan de Mecanización en Lean 4

El trabajo formal de la Fase V-B se ubicará en `takt-formal/TaktFormal/Composition/`:

```text
takt-formal/TaktFormal/Composition/
├── Basic.lean          -- Estructuras de sistemas compuestos (S₁ ⊗ S₂, S₂ ∘ S₁)
├── Preservation.lean   -- Teoremas de preservación de Solidez y Alcanzabilidad (V-B.2)
├── Geometry.lean       -- Teorema de Transmisión de ε-Gobernanza y cotas de δ (V-B.3)
├── Optimization.lean   -- EVSI distribuido y sinergia cooperativa (V-B.4)
├── Limits.lean         -- Resolución cooperativa y cota Lipschitz en cascada (V-B.5)
└── Composition.lean    -- Re-exportador global TaktFormal.Composition
```

Cada archivo incluirá la cabecera obligatoria `Module`, `Depends on` y `Exports`.

---

## 4. Criterios de Aceptación y Finalización

La Fase V-B se considerará completamente cerrada cuando:
1. Este documento de diseño sea aprobado.
2. Los 5 módulos en Lean 4 compilen cleanly sin advertencias y con **0 `sorry`s**.
3. Se demuestre formalmente el **Teorema Central de Transmisión de $\epsilon$-Gobernanza** ($Gov_{\epsilon_1 + \epsilon_2}(S_1 \otimes S_2)$).
