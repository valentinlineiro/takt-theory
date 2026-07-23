# TAKT Scientific Positioning & Literature Audit — Design Specification

> **Status:** Active Spec for Pillar 3 / Step 1 (Scientific Positioning & Literature Audit).
> 
> **Prerequisites:** Volumes I–V (Lean 4 verified core & extensions), `docs/02-theoretical-positioning/`.

---

## 1. Contexto y Prioridad Estratégica

Con los Volúmenes I a V formalizados y mecanizados en Lean 4 (226 trabajos verificados, 0 `sorry`s), el riesgo principal del proyecto deja de ser la corrección interna de las pruebas para convertirse en el **posicionamiento científico externo**.

La mecanización en Lean demuestra coherencia interna *dadas las definiciones*; **no demuestra por sí misma novedad académica, independencia metodológica ni relevancia frente al estado del arte mundial**.

Esta auditoría constituye la **prioridad máxima (Step 1)** de la nueva etapa de TAKT, asegurando que la terminología, los teoremas y la narrativa se estabilicen antes de redactar la monografía definitiva (Step 2), ejecutar la validación empírica (Step 3) o certificar el runtime (Step 4).

---

## 2. Preguntas Fundamentales a Responder

La auditoría de posicionamiento responderá cinco preguntas científicas exigentes:

1. **¿Qué problema resuelve TAKT exactamente?**
   Formalización de la preservación de decisiones óptimas bajo compresión/abstracción de estados de representación y evolución convergente ejecutable.
2. **¿Cuáles son los objetos matemáticos nuevos introducidos por TAKT?**
   - Kernel de capacidad $K_D = \bigcap_{c \in C_D} K_c$.
   - Estructura de distancia dual de gobernanza $(d_{\rightarrow}, d_{\equiv})$.
   - Distancia de perfección $\delta(D)$ y espacio de evolución de detectores $(\mathcal{G}_D, \Phi)$.
   - Categoría monoidal $\mathbf{GovDet}$ con adjunción abstracción-enrichment ($\mathcal{A} \dashv \mathcal{E}$).
3. **¿Qué resultados son estrictamente originales frente a reformulaciones elegantes?**
   - *Originales:* Teorema de Suficiencia Estructural (ST-015), Teorema de Parada Racional EVSI ($\pi^*$), Teorema de Transmisión de $\epsilon$-Gobernanza ($Gov_{\epsilon_1 + \epsilon_2}(S_1 \otimes S_2)$).
   - *Reformulaciones/Incrustaciones:* Preservación de suficiencia de Blackwell en kernels $K_D$, interpretación monádica sobre espacios de decisión.
4. **¿Qué hipótesis adicionales exige TAKT respecto a teorías existentes?**
   Asunción de políticas Markovianas subyacentes en el cálculo de margen $M_D$ y estructura aditiva de costos de enriquecimiento.
5. **¿Qué ajustes terminológicos o axiológicos son necesarios antes de la monografía?**

---

## 3. Matriz de Auditoría Comparativa por Dominio Científico

```text
                        Matriz de Posicionamiento Científico
                                         │
     ┌──────────────────┬────────────────┼──────────────────┬──────────────────┐
     ▼                  ▼                ▼                  ▼                  ▼
Dominio 1          Dominio 2        Dominio 3          Dominio 4          Dominio 5
Teoría Decisión    Verificación     Categorías &       Planificación &    Value of Info
(Blackwell)        (Bisimulación)   Álgebras           POMDPs             (EVSI Clásico)
```

---

### Dominio 1 — Teoría de la Decisión e Información (Blackwell)
* **Estado del Arte:** Teorema de Suficiencia de Blackwell (1951/1953) y ordenamiento de experimentos estocásticos.
* **Mapeo con TAKT:** La condición de kernel refinement $\text{ker}(R) \subseteq K_D$ extiende la suficiencia de Blackwell de experimentos estocásticos completos a contratos de decisión específicos $D$.
* **Audit Target:** Demostrar formalmente cuándo $\text{ker}(R) \subseteq K_D$ coincide con el ordenamiento de Blackwell y dónde TAKT proporciona un criterio más relajado y computable.

---

### Dominio 2 — Verificación Formal y Teoría de Control (Bisimulación y Contratos)
* **Estado del Arte:** Bisimulación de Park/Milner, Abstracción de Sistemas de Transición (Cousot & Cousot Abstract Interpretation) y Contract-Based Design (Sangiovanni-Vincentelli et al.).
* **Mapeo con TAKT:** El margen dinámico $M_D$ y la distancia dual $(d_{\rightarrow}, d_{\equiv})$ cuantifican geométricamente la distancia a la pérdida de gobernanza, a diferencia de las nociones binarias de bisimulación tradicional.
* **Audit Target:** Comparar los márgenes de TAKT con los márgenes de robustez en Lógica Temporal Signal (STL/TLR).

---

### Dominio 3 — Teoría de Categorías y Procesos (Categorías Monoidales y Mónadas)
* **Estado del Arte:** Categorías Monoidales de Procesos (Selinger, Coecke), Mónada de Giry para probabilidad.
* **Mapeo con TAKT:** La categoría $\mathbf{GovDet}$ formaliza detectores como objetos y enriquecimientos como morfismos, con composición paralela $\otimes$.
* **Audit Target:** Demostrar si la adjunción $\mathcal{A} \dashv \mathcal{E}$ en $\mathbf{GovDet}$ es isomórfica a adjunciones conocidas en sintaxis/semántica de representación.

---

### Dominio 4 — Planificación en IA y Procesos de Decisión (MDPs/POMDPs)
* **Estado del Arte:** Planificación sensible a costos en POMDPs y espacio de creencia (Belief Space Planning).
* **Mapeo with TAKT:** El algoritmo EVSI Planner sobre $\text{Closure}_\mathcal{E}(R)$ y el Teorema de Parada Racional $\pi^*$.
* **Audit Target:** Clasificar la complejidad de TAKT respecto a la indecidibilidad general de POMDPs infinitos y la tractabilidad FPT por dimensión de kernel $k$.

---

### Dominio 5 — Valor de la Información (EVSI Clásico)
* **Estado del Arte:** Expected Value of Sample Information (EVSI) de Raiffa & Schlaifer (1961).
* **Mapeo con TAKT:** EVSI determinista y estocástico $EVSI_\mathbb{P}(E)$ formulado sobre reducción de distancias de perfección $\Delta \delta$.
* **Audit Target:** Certificar la equivalencia exacta entre el EVSI clásico bayesiano y el EVSI estocástico de la Fase V-E.

---

## 4. Entregables del Paso 1 (Scientific Positioning Audit)

La ejecución del Paso 1 producirá tres entregables clave:

1. **`docs/02-theoretical-positioning/scientific-positioning-audit.md`**:
   Documento de auditoría exhaustiva detallando la matriz comparativa, el inventario de novedad y la lista de ajustes terminológicos.
2. **`docs/04-academic-paper/takt-foundations-paper.md`**:
   Borrador del artículo científico de visión global de TAKT orientado a revisión por pares.
3. **Actualización de la Terminología Canónica**:
   Armonización de términos en `docs/canonical-core-v1.0.md` previa a la Monografía del Paso 2.

---

## 5. Criterios de Aceptación

El Paso 1 se considerará completado cuando:
1. La matriz comparativa de los 5 dominios esté documentada con citas bibliográficas exactas.
2. Se identifiquen explícitamente las 3 contribuciones matemáticas primarias y novedosas de TAKT.
3. El borrador del paper fundacional esté estructurado y listo para revisión.
