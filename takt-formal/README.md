# TAKT Formal Core v1

## ¿Qué contiene?

Un núcleo formal en Lean 4 con 0 dependencias externas (solo base 4.32):

- `Kernel.lean` — relación de equivalencia `ker(R)` entre estados
- `Factorization.lean` — factorización `D = π ∘ R`
- `DecisionSystem.lean` — sistema de decisión: U, argmax, θ, D
- `Regret.lean` — regret y ε(R)
- `SafetyEquivalence.lean` — equivalencia ε(R)=0 ⇔ ker(R) ⊆ ker(D)
- `EpsilonUCounterexample.lean` — contraejemplo: ε_U=0 ⇏ ε_D=0

## ¿Qué demuestra?

```
ε(R) = 0  ⇔  ker(R) ⊆ ker(D)               [SafetyEquivalence]
ker(R) ⊆ ker(D)  ⇒  ε_U(R) = 0              [epsilon_D_implies_epsilon_U]
D = π ∘ R  ⇔  ker(R) ⊆ ker(D)              [Factorisation Theorem]
```

## ¿Qué NO demuestra?

```
ε_U(R) = 0  ⇒  ker(R) ⊆ ker(D)             [FALSO — contraejemplo constructivo]
```

El contraejemplo (2 estados, 3 acciones, empates de utilidad) es un objeto formal del mismo nivel que los teoremas: `EpsilonUCounterexample.lean`.

## Fronteras conocidas (no cubiertas en v1)

- Decisiones estocásticas (D probabilística)
- Secuencias temporales / MDP
- Utilidad multiobjetivo (R^k)
- Representaciones adaptativas (R depende del historial)
- Separación utilidad/decisión cuando el argmax no es único

## Reproducibilidad

```bash
cd takt-formal
lake build
```

Sin errores, sin `sorry`, sin dependencias externas. Resultado: `v1.0.0-formal-core`.
