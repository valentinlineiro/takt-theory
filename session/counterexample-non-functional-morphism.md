# Counterexample: Non-Functional Morphism (Noisy Sensor)

**Goal:** Find a domain where at least one basic assumption of the core v1.0 is violated, not merely a theorem boundary.

## The domain

**Physical temperature sensor** with additive Gaussian noise.

- X: true temperature $T \in \mathbb{R}$ (physical quantity)
- C: sensor reading $r = T + \varepsilon$ where $\varepsilon \sim \mathcal{N}(0, \sigma^2)$
- Y: $\mathbb{R}$ (reported temperature)
- $\Phi(T) = 1$ if $T > \theta$ (safe), else $0$

---

## Assumption violated

**Section 2:** *"Let $\mathcal{C}: X \to Y$ be any function (a **morphism**)."*

$C$ is not a function from $X$ to $Y$. The same $T$ produces different $r$ values due to noise. $C$ maps one input to a *distribution* over outputs.

---

## Attempted rescues

### Rescue 1: Expand domain to include noise seed

$X' = \{(T, s)\}$ where $s$ determines $\varepsilon$.
$C': X' \to Y$ defined by $C'(T, s) = T + \varepsilon(s)$.
Now $C'$ is a function. ✓

**Cost:** The expanded domain includes an unobservable quantity (the noise seed). In practice, we never know $s$ — only $T$ is physically real. The seed is a *theoretical* construct that makes the math work but cannot be measured.

This is the same move as expanding "program + random seed" for randomised algorithms. It is always possible in principle but disconnects the domain from what we can actually observe.

### Rescue 2: Distribution as codomain

$C_{\text{dist}}: X \to \text{Dist}(Y)$ where $\text{Dist}(Y)$ is the set of probability distributions on $Y$.
$C_{\text{dist}}(T) = \mathcal{N}(T, \sigma^2)$ (Gaussian centered at $T$).
Now $C_{\text{dist}}$ is a function. ✓

**Cost:** We need a structure type on $\text{Dist}(Y)$. Natural choices exist (total variation metric, Wasserstein distance, KL divergence), but none is canonical. The choice of structure on $\text{Dist}(Y)$ changes the analysis.

---

## What happens under Rescue 1 (seed expansion)

With $X' = \{(T, s)\}$:

- $C'(T, s) = r \in Y$ (deterministic reading)
- $\Phi(T, s) = 1$ if $T > \theta$, else $0$

**Preservation analysis:**
$C'(T_1, s_1) = C'(T_2, s_2)$ iff $T_1 + \varepsilon(s_1) = T_2 + \varepsilon(s_2)$.
Two pairs with the same reading $r$ can have $T_1 > \theta$ and $T_2 \leq \theta$ (different $\Phi$ values).
Hence $\sim_{C'} \not\subseteq \sim_\Phi$. Preservation fails.

**Fibre:** $C'^{-1}(r) = \{(T, s) \mid T = r - \varepsilon(s)\}$.
Within this fibre, $T$ varies by $\varepsilon(s)$.

**Refinement:** Add noise variance $\sigma^2$: $C''(T, s) = (r, \sigma^2)$.
$\phi(r, \sigma^2) = r$.
$C' = \phi \circ C''$? No. $(C''(T_1, s_1) = C''(T_2, s_2))$ if $r_1 = r_2$ and $\sigma_1^2 = \sigma_2^2$, but $\sigma^2$ is constant for all measurements (same sensor). So $C''$ does not distinguish more elements within the fibre.

**Better refinement:** Add the noise value $\varepsilon$ itself.
$C''(T, s) = (r, \varepsilon(s))$.
$C' = \phi \circ C''$ with $\phi(r, \varepsilon) = r$. ✓
Now from $(r, \varepsilon)$ we recover $T = r - \varepsilon$, so $\Phi$ is fully determined. Preservation holds. ✓

**Cost:** This requires knowing $\varepsilon$, which is exactly what a sensor reading does NOT provide. This is the maximal refinement in disguise — it makes $C''$ injective.

**Practical refinement:** Add $\sigma^2$ only, and define a safe proxy:
$\Phi_{\text{safe}}(r, \sigma) = 1$ if $r > \theta + 3\sigma$ (confidence bound), else $0$.
$\Phi_{\text{safe}} \circ C'' \leq \Phi$ pointwise (safe bound).
$C''$ preserves $\Phi_{\text{safe}}$ (trivially: it factors through $C''$).

**Conservative proxy pattern reappears** — exactly the same mechanism as G2 and lossy compression.

---

## What happens under Rescue 2 (distribution codomain)

$C_{\text{dist}}: X \to \text{Dist}(Y)$.
$C_{\text{dist}}(T) = \mathcal{N}(T, \sigma^2)$.

Structure type on $\text{Dist}(Y)$: total variation metric.
$d_{\text{TV}}(D_1, D_2) = \frac{1}{2} \int |dD_1 - dD_2|$.

$d_{C_{\text{dist}}}(T_1, T_2) = d_{\text{TV}}(\mathcal{N}(T_1, \sigma^2), \mathcal{N}(T_2, \sigma^2))$.

For the Gaussian case: $d_{\text{TV}}(\mathcal{N}(\mu_1, \sigma^2), \mathcal{N}(\mu_2, \sigma^2)) = \text{erf}(|\mu_1 - \mu_2| / (2\sigma\sqrt{2}))$.

$\Phi(T) = 1$ if $T > \theta$, else $0$.
$\tau_\Phi$: discrete equivalence on $\{0,1\}$.

$\sigma_{C_{\text{dist}}} \subseteq \tau_\Phi$? For $T_1 > \theta$ and $T_2 \leq \theta$, we have $C_{\text{dist}}(T_1) \neq C_{\text{dist}}(T_2)$ (Gaussians at different means differ in total variation). So $\sim_{C_{\text{dist}}} \subseteq \sim_\Phi$ holds for most pairs.

**BUT:** For $T_1, T_2$ very close together (within $\sigma/100$), the distributions are nearly identical ($d_{\text{TV}} \approx 0$). If $T_1 > \theta$ and $T_2 \leq \theta$, the distinct Φ values are not detected by the total variation metric on the codomain when the means differ by less than measurement resolution.

So preservation depends on the **resolution** of the structure on Dist(Y). With total variation, two very close distributions are nearly but not exactly the same, so $C_{\text{dist}}(T_1) \neq C_{\text{dist}}(T_2)$ strictly. But the $d_{C_{\text{dist}}}$ value is tiny, and we might need infinite precision to distinguish them.

This reveals a **granularity issue** that parallels the pseudometric case: the equivalence structure on Dist(Y) might be too coarse (or the metric too fine) for practical use.

---

## Result

**Classification:** SCOPE BOUNDARY (maps to PARTIAL in the three-outcome scheme)

| Assumption | Status |
|-----------|--------|
| $C$ is a function | **Violated** (noisy measurement is multi-valued) |
| Rescue 1 (seed expansion) | Technically valid, but adds unobservable quantities |
| Rescue 2 (distribution codomain) | Technically valid, but raises granularity issues |
| Conservative proxy pattern | Reappears independently (third instance) |

### What the counterexample reveals

1. **The core's function assumption is a genuine boundary.** Not every useful morphism is a function. Non-deterministic, noisy, or probabilistic transformations are common in practice, and the core cannot be applied directly.

2. **Rescue strategies exist but have costs.** Both seed-expansion and distribution-codomain preserve the core's formal applicability but change the nature of the analysis.

3. **Conservative proxy is robust across domains.** It appears independently in G2, lossy compression, and now sensor noise — three different types of uncertainty (estimation, quantization, measurement). This strengthens the case that it's a general principle, not a domain-specific hack.

---

## Evidence Index update

| Domain | Structure | Result | Note |
|--------|-----------|--------|------|
| HAA-001 | Equivalence | **SUCCESS** | Action observation repairs preservation |
| Type erasure | Equivalence | **SUCCESS** | Signature metadata repairs preservation |
| G2 | Pseudometric | **PARTIAL** | Boon-only; conservative proxy used |
| Lossy compression | Pseudometric | **PARTIAL** | Same pattern as G2 |
| **Noisy sensor** | **N/A (scope)** | **SCOPE BOUNDARY** | **Non-function morphism; third independent proxy instance** |

**EI (analysis):** 5/5 = 1.0 (core's framework correctly describes all situations)
**EI (solution):** 2/5 = 0.4 (core alone solves 2 of 5)

**Conservative proxy pattern:** 3 independent occurrences across structurally distinct domains. Could warrant formalization after one more independent instance.
