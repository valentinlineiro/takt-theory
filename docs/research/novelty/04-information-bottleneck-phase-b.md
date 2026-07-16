# Fase B — Separación formal: Information Bottleneck

## Objetivo

Determinar si la relación entre TAKT e Information Bottleneck (IB) es de
independencia lógica o si existe una separación más fina que la establecida
en Fase A.

## Hipótesis de equivalencia

Dado un problema IB con variable relevante \(Y = D\) (decisión), ¿existe
equivalencia entre la optimalidad IB y la preservación decisional
\(\ker(R) \subseteq \ker(D)\)?

Fase A rechazó esta hipótesis:

1. Optimalidad IB \(\not\Rightarrow\) \(\ker(R) \subseteq \ker(D)\).
2. \(\ker(R) \subseteq \ker(D)\) \(\not\Rightarrow\) optimalidad IB.

## Traducción formal (referencia a Fase A)

Ver `04-information-bottleneck.md`, secciones:

- «Traducción a TAKT» — no hay traducción para el caso genérico (Y
  arbitrario); para \(Y = D\), la preservación informacional ni implica
  ni está implicada por la preservación decisional.
- «Traducción desde TAKT» — TAKT no tiene distribución conjunta, ni
  parámetro \(\beta\), ni algoritmo variacional.
- «Equivalencia» — las cuatro hipótesis se rechazan.

## Hipótesis de separación

IB y TAKT son lógicamente independientes: preservan propiedades ortogonales
(información vs. decisión).

## Contraejemplo mínimo

**Escenario:** Sistema con dos estados, decisiones idénticas, utilidades
muy distantes.

Sean \(S = \{s_1, s_2\}\), \(A = \{a, b\}\), distribución uniforme sobre
\(S\). Utilidades:

| Estado | \(U(s,a)\) | \(U(s,b)\) | \(D(s)\) |
|--------|------------|------------|----------|
| \(s_1\) | 10        | 9.9        | \(a\)    |
| \(s_2\) | 0.1       | 0          | \(a\)    |

**En TAKT:** \(D(s_1) = D(s_2) = a\). La representación \(R(s_1) = R(s_2)\)
es válida porque \(\ker(R) \subseteq \ker(D)\).

**En IB:** Con \(Y = U\), el encoder óptimo separará \(s_1\) de \(s_2\)
porque las distribuciones \(p(U \mid s_1)\) y \(p(U \mid s_2)\) son
prácticamente disjuntas. Fusionarlos destruiría casi toda la información
sobre \(U\).

## Propiedad que falla

La preservación decisional (\(\ker(R) \subseteq \ker(D)\)) no es
expresable como condición sobre información mutua.

- \(\ker(R) \subseteq \ker(D)\) implica \(I(R; D) = H(D)\) (máximo), pero
  el recíproco es falso: \(I(Z; D)\) puede ser máxima y aún existir un
  par de estados con igual código y distinta decisión (ver contraejemplo
  de 4 estados en Fase A).
- \(\ker(R) \subseteq \ker(D)\) no implica \(I(R; U)\) alta, como muestra
  el contraejemplo mínimo.

## Clasificación

**Independencia.** IB y TAKT son ortogonales:
- IB es una teoría de preservación **informacional**, cuantitativa,
  parametrizada por \(\beta\), basada en distribuciones.
- TAKT es una teoría de preservación **decisional**, cualitativa
  (binaria: se cumple o no), libre de parámetros y de distribuciones.

No hay subsumción de una bajo la otra, ni siquiera debilitando hipótesis.

## Consecuencia para TAKT

La independencia con IB no es una limitación: es un resultado positivo.

Demuestra que la preservación decisional no es un caso particular de la
preservación informacional, sino una noción genuinamente distinta. Un
marco que no distingue entre dos estados con la misma decisión óptima no
es «menos potente» que IB — opera en un plano lógico diferente.

TAKT no necesita ni puede ser comparado con IB en el terreno de la
información mutua. Su dominio de aplicación empieza donde la métrica
relevante no es la dependencia estadística, sino la identidad de la
acción óptima.
