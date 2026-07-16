# Information Bottleneck — Traducción formal

## Referencias

- Tishby, N., Pereira, F. C., & Bialek, W. (1999). The information bottleneck
  method. *Proceedings of the 37th Annual Allerton Conference on Communication,
  Control, and Computing*, 368–377.
- Tishby, N. & Polani, D. (2011). Information theory of decisions and actions.
  In *Perception-Action Cycle: Models, Architectures, and Hardware*. Springer,
  601–636.
- Still, S. & Precup, D. (2012). An information-theoretic approach to
  curiosity-driven reinforcement learning. *Theory in Biosciences*, 131(3),
  139–148.
- Fox, R., Pakman, A., & Tishby, N. (2016). Taming the noise in reinforcement
  learning via soft updates. *UAI*.
- Grau-Moya, J., Leibfried, F., & Vrancx, P. (2018). Soft Q-learning with
  mutual information regularization. *ICLR*.
- Dubois, Y., Kiela, D., Schwab, D. J., & Vedantam, R. (2020). Learning
  optimal representations with the decodable information bottleneck.
  *NeurIPS*.
- Kamatsuka, A. & Yoshida, T. (2026). A generalized information bottleneck
  method: A decision-theoretic perspective. *arXiv:2602.18405*.

## Pregunta

> Dado un par \((X, Y)\) con distribución conjunta \(p(x, y)\),
> ¿cuál es la representación comprimida \(Z\) de \(X\) que preserva
> la máxima información sobre \(Y\)?

## Definiciones del marco

**Objeto primitivo**

El IB clásico (Tishby, Pereira & Bialek, 1999) parte de:

- \(X\): variable aleatoria de entrada (datos)
- \(Y\): variable aleatoria relevante (target)
- \(Z\): representación comprimida (codificación)

Se asume la cadena de Markov \(Z \leftrightarrow X \leftrightarrow Y\), es decir,
\(p(z|x,y) = p(z|x)\). La representación \(Z\) se define mediante una
aplicación estocástica \(p(z|x)\) (encoder).

**Tradeoff compresión-preservación**

\[
\min_{p(z|x)} I(X; Z) - \beta I(Z; Y)
\]

donde \(\beta \geq 0\) es un parámetro de tradeoff:
- \(\beta \to 0\): máxima compresión (todo a una clase)
- \(\beta \to \infty\): preservación total (\(I(Z;Y) \approx I(X;Y)\))

**Solución formal**

El óptimo satisface las ecuaciones autoconsistentes:

\[
p(z|x) = \frac{p(z)}{Z(x,\beta)} \exp\left(-\beta \, D_{KL}[p(y|x) \| p(y|z)]\right)
\]
\[
p(z) = \sum_x p(x)\, p(z|x)
\]
\[
p(y|z) = \frac{1}{p(z)} \sum_x p(y|x)\, p(z|x)\, p(x)
\]

**Variable relevante \(Y\)**

La elección de \(Y\) determina qué preserva \(Z\). En contextos de decisión
(Tishby & Polani, 2011; Still & Precup, 2012), \(Y\) puede ser la acción
óptima, la recompensa esperada o la secuencia de acciones futuras. En todos
los casos, la preservación se mide mediante información mutua \(I(Z;Y)\),
no mediante una condición lógica sobre la identidad de \(Y\).

## Correspondencia observacional (hechos)

| Information Bottleneck             | TAKT                                      |
|------------------------------------|-------------------------------------------|
| Entrada \(X\)                      | Estados \(S\)                             |
| Relevante \(Y\)                    | Utilidad \(U\) o decisión \(D\)           |
| Representación \(Z\) (vía \(p(z|x)\)) | \(R: S \to Z\) (determinista)          |
| \(I(Z;Y)\) preservación informacional | \(\ker(R) \subseteq \ker(D)\)         |
| Tradeoff \(\beta\)                 | No tiene análogo                          |
| Estocástico                        | Determinista                              |

> La auditoría busca correspondencias estructurales, no analogías
> terminológicas.

> La correspondencia no debe establecerse entre objetos, sino entre
> **relaciones de preservación**.

## Hipótesis de traducción

1. **IB clásico (Y genérico).** ¿La optimalidad IB implica
   \(\ker(R) \subseteq \ker(D)\)? ¿O al revés?

2. **IB con Y = decisión.** Si \(Y = D(s)\), ¿es la preservación de
   \(I(Z; D)\) equivalente a \(\ker(R) \subseteq \ker(D)\)?

3. **Minimalidad.** ¿La minimalidad de IB (mínima \(I(X;Z)\) que maximiza
   \(I(Z;Y)\)) coincide con la minimalidad de TAKT (máxima compresión que
   preserva \(D\))?

4. **Determinismo vs. estocasticidad.** ¿La diferencia entre \(p(z|x)\)
   (estocástico) y \(R: S \to Z\) (determinista) impide una traducción
   directa?

## Traducción a TAKT

**Dado:** Un problema IB \((X, Y, p(x,y))\) con encoder \(p(z|x)\) óptimo para
algún \(\beta\).

**Objetivo:** Construir un sistema de decisión TAKT.

**Caso A — Y genérico (IB clásico).** No hay traducción. TAKT no tiene
información mutua, distribución conjunta ni variable relevante genérica.

**Caso B — Y = decisión \(D(s)\).**

| Elemento IB                    | Traducción a TAKT                         |
|--------------------------------|-------------------------------------------|
| \(X\)                          | \(S\) (estados)                           |
| \(Y = D(s)\)                   | \(D\) (decisión)                          |
| \(Z\) (vía \(p(z|x)\))         | \(R\) (representación)                    |
| \(I(Z; D)\) alta               | Necesaria pero no suficiente para \(\ker(R) \subseteq \ker(D)\) |
| Tradeoff \(\beta\)             | No traducible                             |

**Proposición:** \(\ker(R) \subseteq \ker(D)\) implica \(I(R; D) = H(D)\)
(máximo). Pero el recíproco no se sigue: \(I(Z; D)\) alta no implica
\(\ker(R) \subseteq \ker(D)\). La información mutua mide dependencia promedio;
la preservación decisional es una condición universal (todo par de estados).

**Contraejemplo (información alta, decisión no preservada):**

Sean \(S = \{s_1, s_2, s_3, s_4\}\), \(A = \{a, b\}\), distribución uniforme.

| Estado | \(D(s)\) | \(R(s)\) |
|--------|----------|----------|
| \(s_1\) | \(a\)   | 0        |
| \(s_2\) | \(b\)   | 0        |
| \(s_3\) | \(a\)   | 1        |
| \(s_4\) | \(b\)   | 1        |

\(I(R; D) = 0\) (independencia estadística). En general, \(I(Z; D)\) puede
ser arbitrariamente cercana a \(H(D)\) y aún violar \(\ker(Z) \subseteq
\ker(D)\): basta un solo par de estados con distinta decisión que comparta el
mismo código.

**Contraejemplo clave (divergencia entre información y decisión):**

Sean \(S = \{s_1, s_2\}\), \(A = \{a, b\}\).

| Estado | \(U(s,a)\) | \(U(s,b)\) | \(D(s)\) |
|--------|------------|------------|----------|
| \(s_1\) | 10         | 9.9        | \(a\)    |
| \(s_2\) | 0.1        | 0          | \(a\)    |

\(D(s_1) = D(s_2) = a\). TAKT permite \(R(s_1) = R(s_2)\). IB con
\(Y = U\) tenderá a separarlos porque las utilidades difieren mucho —
la información sobre \(U\) se pierde casi por completo al fusionarlos.

**Veredicto:** IB y TAKT preservan propiedades distintas. IB preserva
*información* sobre \(Y\) (cuantitativa, gradual). TAKT preserva la
*identidad* de \(D\) (cualitativa, binaria).

## Traducción desde TAKT

**Dado:** Sistema TAKT \((S, A, U, R, D)\) con \(\ker(R) \subseteq \ker(D)\).

**Objetivo:** Construir un problema IB.

| Elemento TAKT              | Traducción a IB                           |
|----------------------------|-------------------------------------------|
| \(S\)                      | \(X\) (entrada)                           |
| \(U\) o \(D\)              | \(Y\) (relevante)                         |
| \(R\)                      | \(Z\) (codificación)                      |
| \(\ker(R) \subseteq \ker(D)\) | Condición más fuerte que requisito IB |
| Regret \(\varepsilon\)      | No traducible                             |

**Limitaciones:**

1. **IB requiere distribución conjunta.** TAKT no tiene \(p(s, a, u)\).
2. **IB optimiza; TAKT verifica.** No hay \(\beta\) ni función de pérdida.
3. **IB produce \(p(z|x)\) estocástico.** TAKT usa funciones deterministas.

## Equivalencia

**Hipótesis 1:** ¿Optimalidad IB \(\Rightarrow\) \(\ker(R) \subseteq \ker(D)\)?
**No.** IB preserva información, no decisiones.

**Hipótesis 2:** ¿Con \(Y = D\), hay equivalencia?
**No.** Son lógicamente independientes:
- \(I(Z; D)\) alto \(\not\Rightarrow\) \(\ker(R) \subseteq \ker(D)\)
- \(\ker(R) \subseteq \ker(D)\) \(\not\Rightarrow\) \(I(R; D)\) alto
  (ej: \(D\) constante)

**Hipótesis 3:** ¿Minimalidad coincide?
**No.** IB: compromiso cuantitativo vía \(\beta\). TAKT: límite combinatorio
fijo (partición de \(D\)).

**Hipótesis 4:** ¿Estocasticidad impide traducción?
**Sí.** \(p(z|x)\) no tiene equivalente funcional determinista en TAKT.

| Pregunta                     | Respuesta | Evidencia                                      |
|------------------------------|-----------|------------------------------------------------|
| ¿Traducción formal?          | No        | Información vs. decisión; estocástico vs. determinista; variacional vs. axiomático |
| ¿Isomorfismo?                | No        | Propiedades fundamentalmente distintas          |
| ¿Residual?                   | Sí        | Ver lista abajo                                 |

## Residual

**Elementos de TAKT no cubiertos por IB:**

1. **Preservación decisional binaria.** \(\ker(R) \subseteq \ker(D)\) se
   cumple o no. IB es gradual (bits).
2. **Regret y cota.** TAKT relaciona utilidad y regret. IB mide dependencia
   estadística, no calidad de decisión.
3. **Composicionalidad secuencial.** TAKT compone representaciones con regret
   aditivo. IB no estudia composición.
4. **Ausencia de parámetros.** TAKT no tiene \(\beta\) ni tradeoff.

**Elementos de IB no representados por TAKT:**

1. **Información mutua.** \(I(X;Z), I(Z;Y)\) sin equivalente en TAKT.
2. **Tradeoff \(\beta\).** IB explora un espectro de representaciones. TAKT
   tiene un único criterio.
3. **Estocasticidad.** \(p(z|x)\) permite representaciones probabilísticas.
   TAKT es determinista.
4. **Distribuciones de probabilidad.** IB requiere \(p(x,y)\). TAKT no
   presupone distribuciones.
5. **Algoritmo variacional.** IB tiene iteraciones de Blahut-Arimoto.
   TAKT es una teoría de condiciones.

---

## Observación transversal (Fase A)

| Marco                                   | Relación de preservación                                          | Estado en el marco      |
|-----------------------------------------|-------------------------------------------------------------------|-------------------------|
| **Sufficient Statistics (Berger)**      | La decisión depende del estadístico suficiente (\(\delta = \delta^* \circ T\)) | **Teorema** |
| **Blackwell**                           | Orden de Blackwell ⇒ preservación de la decisión para todo problema de decisión | **Teorema** |
| **Decision-Sufficient Representations** | \(\phi(s_1)=\phi(s_2) \Rightarrow \pi^*(s_1)=\pi^*(s_2)\)        | **Definición derivada** |
| **Information Bottleneck**              | — (preserva información, no decisiones)                            | **No aplica**           |
| **TAKT**                                | \(\ker(R) \subseteq \ker(D)\) (equiv. \(D = \pi \circ R\))        | **Axioma**              |

**Information Bottleneck se separa del patrón.** IB no es una teoría de
representaciones para la decisión, sino una teoría de representaciones para
la información. Su objeto primitivo es la información mutua \(I(Z;Y)\); la
preservación decisional no es ni teorema, ni definición derivada, ni axioma.

Esta separación es valiosa: demuestra que la hipótesis transversal no es
trivial. No todo marco de representación encaja en el esquema de preservación
decisional. Queda por ver si **Bisimulation** confirma el patrón o traza otro
límite.
