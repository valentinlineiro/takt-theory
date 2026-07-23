# Phase V-C: Categorical Unification (GovDet) — Design Specification

> **Status:** Active Spec for Phase V-C (Categorical Unification).
> 
> **Prerequisites:** Phase V-0 (Extension Roadmap), Phase V-A (Metatheory), Phase V-B (Composition), Volumes I–IV-C.

---

## 1. Contexto y Pregunta Central de Investigación

Mientras que la Fase V-B formaliza los operadores algebraicos de composición ($S_1 \otimes S_2$, $S_2 \circ S_1$), la **Fase V-C (Unificación Categórica)** re-expresa la totalidad de TAKT en la teoría algebraica de categorías, formalizando la categoría canónica de gobernanza **$\mathbf{GovDet}$**.

La Fase V-C no introduce nuevos axiomas arbitrarios; **abstrae y unifica** el núcleo determinista y la composición de sistemas en una categoría monoidal estructurada.

### Pregunta Central de V-C
> **¿Admite la Teoría TAKT una estructura categórica canónica y qué propiedades universales emergen de esta abstracción?**

---

## 2. Clasificación de Resultados Categóricos

Todo teorema o proposición en la Fase V-C debe clasificarse formalmente en una de dos categorías metodológicas:

1. **Resultados de Representación:** Demostraciones de que los teoremas de las Fases I–V-B se incrustan de forma fiel e isomórfica en el lenguaje de $\mathbf{GovDet}$.
2. **Resultados Nuevos (Estructurales):** Descubrimiento de propiedades categóricas universales (adjunciones, límites, objetos iniciales/finales) no visibles en la formulación previa.

---

## 3. Los Cinco Bloques de Unificación Categórica

```text
               Phase V-C: Categorical Unification (GovDet)
                                    │
     ┌──────────────┬───────────────┼───────────────┬──────────────┐
     ▼              ▼               ▼               ▼              ▼
 Block V-C.1    Block V-C.2     Block V-C.3     Block V-C.4    Block V-C.5
Categoría GovDet Monoidal        Funtores        Adjunciones     Límites y
(Objetos/Morf) (GovDet, ⊗, I) (Rep & Decision)  (Abstr ⊣ Enr)    Colímites
```

---

### Bloque V-C.1 — La Categoría $\mathbf{GovDet}$

#### Definición Categórica
Definimos la categoría $\mathbf{GovDet}$ como:
* **Objetos $\text{Ob}(\mathbf{GovDet})$:** Detectores de gobernanza sólidos $D \in \mathcal{G}_D$.
* **Morfismos $\text{Hom}(D_1, D_2)$:** Enriquecimientos sólidos y monótonos $E: D_1 \to D_2$ tales que $\Phi(D_1, E) = D_2$ y $d_{\rightarrow}(D_2, D_{\text{top}}) \le d_{\rightarrow}(D_1, D_{\text{top}})$.
* **Composición de Morfismos:** La composición monoidal de enriquecimientos $E_2 \circ E_1$.
* **Morfismo Identidad:** $id_D = \text{idEnrichment}$.

#### Teorema V-C.1.1 (Axiomas de Categoría para $\mathbf{GovDet}$)
La estructura $\mathbf{GovDet}$ satisface formalmente los axiomas de categoría:
1. **Asociatividad:** $(E_3 \circ E_2) \circ E_1 = E_3 \circ (E_2 \circ E_1)$.
2. **Identidad:** $E \circ id_{D_1} = E = id_{D_2} \circ E$.
3. **Cierre:** La composición de dos morfismos de enriquecimiento válidos es un morfismo de enriquecimiento válido.

---

### Bloque V-C.2 — Estructura Categórica Monoidal $(\mathbf{GovDet}, \otimes, I)$

#### Definición Monoidal
Utilizando el operador de composición paralela de la Fase V-B:
* **Producto Monoidal:** $D_1 \otimes D_2$ definido por el detector compuesto en espacio producto.
* **Objeto Unidad $I$:** El detector trivial de solidez universal $D_{\text{unit}}$.
* **Funtor Monoidal:** $\otimes : \mathbf{GovDet} \times \mathbf{GovDet} \to \mathbf{GovDet}$.

#### Teorema V-C.2.1 (Categoría Monoidal Estricta/Simétrica)
La tupla $(\mathbf{GovDet}, \otimes, I, \alpha, \lambda, \rho)$ constituye una **categoría monoidal simétrica**:
1. Iso de asociatividad $\alpha_{A,B,C} : (A \otimes B) \otimes C \cong A \otimes (B \otimes C)$.
2. Isos de unidad $\lambda_A : I \otimes A \cong A$ y $\rho_A : A \otimes I \cong A$.
3. Simetría $\beta_{A,B} : A \otimes B \cong B \otimes A$.

---

### Bloque V-C.3 — Funtores Fundamentales

#### 1. Funtor de Representación ($\mathcal{F}_{\text{Rep}}$)
$$\mathcal{F}_{\text{Rep}} : \mathbf{GovDet} \longrightarrow \mathbf{Poset}_{\text{Ker}}$$
Asigna a cada detector $D$ su equivalente kernel $\text{ker}(R_D) \subseteq K_D$ y a cada morfismo de enriquecimiento la inclusión de kernels correspondiente.

#### 2. Funtor de Decisión ($\mathcal{F}_{\text{Dec}}$)
$$\mathcal{F}_{\text{Dec}} : \mathbf{GovDet} \longrightarrow \mathbf{Set}_{\text{Dec}}$$
Mapea el detector al espacio de decisiones ejecutables sin brechas $G(D, R) = \emptyset$.

#### Teorema V-C.3.1 (Preservación Funtorial de Suficiencia)
$\mathcal{F}_{\text{Rep}}$ y $\mathcal{F}_{\text{Dec}}$ son **funtores fieles** que preservan refinamientos y suficiencia de representación.

---

### Bloque V-C.4 — Teorema de Adjunción $(\text{Abstracción} \dashv \text{Enrichment})$

#### Formulación de Adjunción
Sea $\mathcal{A} : \mathbf{GovDet} \to \mathbf{AbsRep}$ el funtor de abstracción (que contrae o simplifica detectores) y $\mathcal{E} : \mathbf{AbsRep} \to \mathbf{GovDet}$ el funtor de enriquecimiento óptimo EVSI.

#### Teorema V-C.4.1 (Adjunción Canónica Abstracción-Enrichment)
Existe una pareja de adjunción funtorial:
$$\mathcal{A} \dashv \mathcal{E}$$
tal que para todo detector $D \in \mathbf{GovDet}$ y todo espacio de abstracción $R \in \mathbf{AbsRep}$, se cumple el isomorfismo natural de conjuntos de morfismos:
$$\text{Hom}_{\mathbf{AbsRep}}(\mathcal{A}(D), R) \cong \text{Hom}_{\mathbf{GovDet}}(D, \mathcal{E}(R))$$

*Significado Teórico:* La recuperación de capacidad óptima EVSI (Fase II y IV-C.4) es el adjunto derecho canónico del funtor de abstracción de representación.

---

### Bloque V-C.5 — Límites y Colímites en $\mathbf{GovDet}$

#### Teorema V-C.5.1 (Existencia de Productos Categóricos)
Para cualesquiera dos detectores $D_1, D_2 \in \mathbf{GovDet}$, el producto categórico $D_1 \times D_2$ existe en $\mathbf{GovDet}$ y coincide isomórficamente con el producto monoidal paralela $D_1 \otimes D_2$.

#### Teorema V-C.5.2 (Pullbacks de Enriquecimiento Mínimo Combinado)
Para dos enriquecimientos $E_1 : D_1 \to D_0$ y $E_2 : D_2 \to D_0$, el pullback categórico $D_1 \times_{D_0} D_2$ representa el **detector mínimo combinado** que aporta las capacidades de ambos enriquecimientos de forma óptima.

---

## 4. Plan de Mecanización en Lean 4

El trabajo formal de la Fase V-C se ubicará en `takt-formal/TaktFormal/Categorical/`:

```text
takt-formal/TaktFormal/Categorical/
├── Basic.lean       -- Definición de la categoría GovDet (Objetos, Morfismos, Identidad, Comp)
├── Monoidal.lean    -- Estructura Monoidal (GovDet, ⊗, I) y asociadores
├── Functor.lean     -- Funtores fundamentales F_Rep y F_Dec
├── Adjunction.lean  -- Adjunción Abstracción ⊣ Enrichment (A ⊣ E)
├── Limits.lean      -- Productos, Pullbacks y Límites en GovDet
└── Categorical.lean -- Re-exportador global TaktFormal.Categorical
```

Cada archivo incluirá la cabecera obligatoria `Module`, `Depends on` y `Exports`.

---

## 5. Criterios de Aceptación y Finalización

La Fase V-C se considerará cerrada cuando:
1. La especificación en este documento sea aprobada.
2. Los 5 módulos en Lean 4 compilen cleanly sin advertencias y con **0 `sorry`s**.
3. Se demuestre formalmente el **Teorema de Adjunción Abstracción-Enrichment ($\mathcal{A} \dashv \mathcal{E}$)** y la existencia de productos monoidales en Lean 4.
