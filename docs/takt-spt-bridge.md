# TAKT — Operational Interpretation of Structural Preservation Theory

**Status:** Translation layer. Structural Preservation Theory v1.1 is the
mathematical foundation; TAKT is the operational interpretation for
human-AI decision systems.

---

## 1. Correspondence

| SPT v1.1 | TAKT | Meaning |
|----------|------|---------|
| Domain $X$ | True system state | Complete but partially unobservable reality |
| Codomain $Y$ | Available context | What the agent sees, reads, remembers |
| Morphism $C: X \to Y$ | Context compression | Logging, summaries, delegation, forgetting |
| Fibre $C^{-1}(y)$ | Compatible worlds | All states that could produce this context |
| Property $\Phi: X \to L$ | Decision-relevant property | What matters for the action choice |
| $\Phi^\downarrow(y)$ | Guarantee (Takt) | Safe bound inferable from context alone |
| Refinement $C'$ with $C = \phi \circ C'$ | Information acquisition | Reading logs, running tests, asking human |
| Proxy collapse ($\Phi^\downarrow \equiv \bot$) | High DRU | Context insufficient for any safe decision |
| Loss $\Phi(x) - \Phi^\downarrow(C(x))$ | Gap between true state and guarantee | How much conservatism the context imposes |
| Cost of refinement | EVSI | Cost of acquiring enough context to improve the proxy |
| $\pi^*$: accept proxy vs. refine vs. escalate vs. stop | Decision policy | Optimal choice under proxy quality and acquisition cost |

---

## 2. DRU as fibre width

**Definition.** DRU (Decision-Relevant Uncertainty) at context $y$ is the
variation of the decision-relevant property $\Phi$ within the fibre
$C^{-1}(y)$:

$$ \text{DRU}(y) = \bigsqcup_{x \in C^{-1}(y)} \Phi(x) \;-\; \bigsqcap_{x \in C^{-1}(y)} \Phi(x) $$

where $-$ is the distance in $(L, \sqsubseteq)$ (for metric $L$) or the
interval $[\Phi^\downarrow(y), \Phi^\uparrow(y)]$ (for lattice $L$).

**Interpretation.**
- Low DRU: all compatible states agree on the decision-relevant property.
  The proxy is tight.
- High DRU: compatible states disagree. The proxy is conservative.
- Maximal DRU ($\Phi^\uparrow = \top, \Phi^\downarrow = \bot$): proxy
  collapses. Context carries zero decision information.

**DRU is not epistemic uncertainty.** It is not about what the agent
"knows" — it is about how much the compatible states vary on the property
that matters for the decision at hand.

### DRU examples

| Context $y$ | Fibre | $\Phi$ | DRU | Decision |
|-------------|-------|--------|-----|----------|
| "Service failed after deploy" | Config error, code regression, dependency | "Should I auto-rollback?" | High | Cannot decide — need more info |
| "Test suite passed" | All passing implementations | "Is code correct?" | Low | Proxy ≈ true (all passing) |
| "Ping timeout: 5s" | Network down, DDoS, firewall | "Should I retry connection?" | Medium | Proxy says "retry is safe" for some cases |

---

## 3. Conservative proxy as guarantee (Takt)

The guarantee is the safe lower bound:

$$ \text{Takt}(y) = \Phi^\downarrow(y) = \bigsqcap_{x \in C^{-1}(y)} \Phi(x) $$

**Properties.**
1. **Safe:** $\text{Takt}(y) \sqsubseteq \Phi(x)$ for all true states $x$
   compatible with $y$. An agent acting on the guarantee never violates
   a safety bound that holds for the actual state.
2. **Optimal:** No tighter guarantee is possible without refining $C$.
   Any claim stronger than $\text{Takt}(y)$ could be false for some
   compatible state.
3. **Monotonic under refinement:** If the agent acquires more context
   ($C'$ refines $C$), the guarantee improves:
   $\text{Takt}_{C'}(y') \sqsupseteq \text{Takt}_C(\phi(y'))$.

### Decision rule

Given threshold $\theta \in L$ (the minimum acceptable $\Phi$ value):

$$
\text{Decide:}\;
\begin{cases}
\text{Act} & \text{if } \text{Takt}(y) \succ \theta \\
\text{Refine} & \text{if } \text{Takt}(y) \preceq \theta \text{ and refinement possible} \\
\text{Escalate} & \text{if } \text{Takt}(y) \preceq \theta \text{ and refinement too costly} \\
\text{Stop} & \text{if } \text{Takt}(y) \preceq \theta \text{ and escalation impossible}
\end{cases}
$$

Where $\succ$ means "satisfies the threshold" (sufficiently above $\theta$
for the decision).

---

## 4. EVSI as expected improvement in proxy

EVSI (Expected Value of Sample Information) in TAKT is the expected
improvement in the guarantee from refining $C$ to $C'$:

$$ \text{EVSI}(C \to C') = \mathbb{E}_{y' \sim C'(X)}
   [\, \text{value}(\Phi^\downarrow_{C'}(y')) \,] -
   \text{value}(\Phi^\downarrow_C(y)) $$

where $\text{value}: L \to \mathbb{R}$ maps the guarantee to a utility
(quality of decisions enabled).

**Simplified form.** If $\text{value}$ is the indicator of
"guarantee exceeds threshold $\theta$":

$$ \text{EVSI}(C \to C') = P(\Phi^\downarrow_{C'}(y') \succ \theta) -
   P(\Phi^\downarrow_C(y) \succ \theta) $$

**Net benefit of refinement:**

$$ \text{Net}(C \to C') = \text{EVSI}(C \to C') - \text{Cost}(C \to C') $$

Refinement is worthwhile when $\text{Net} > 0$.

---

## 5. $\pi^*$ as optimal refinement selection

The agent's policy chooses among:

1. **Accept** current guarantee and act
2. **Refine** to $C' \succ C$ (acquire context)
3. **Escalate** to human (delegate decision outside the automated system)
4. **Stop** (failure — insufficient guarantee, no further options)

**Optimal policy:**

$$ \pi^*(y) = \arg\max_{a \in \{\text{accept}, \text{refine}, \text{escalate}, \text{stop}\}} U_a(y) $$

Where $U_a(y)$ is the expected utility of action $a$ given context $y$:

- $U_{\text{accept}}(y) = \text{value}(\Phi^\downarrow(y))$
- $U_{\text{refine}}(y) = \max_{C'} [ \text{EVSI}(C \to C') - \text{Cost}(C \to C') + U_{\text{accept}}(y') ]$
- $U_{\text{escalate}}(y) = \text{value}_{\text{human}}(\Phi^\downarrow(y)) - \text{cost}_{\text{escalate}}$
- $U_{\text{stop}}(y) = -\text{cost}_{\text{failure}}$

**This is the TAKT decision policy, grounded in SPT.**

---

## 6. $\Omega$ as monitor of preservation quality

$\Omega$ observes the chain $C$, $\Phi$, $\Phi^\downarrow$ and tracks:

| Metric | What it measures | Formula |
|--------|-----------------|---------|
| DRU | Fibre width on $\Phi$ | $\bigsqcup_{x \in C^{-1}(y)} \Phi(x) - \bigsqcap \ldots$ |
| Proxy tightness | How far from $\Phi^\downarrow$ to $\Phi^\uparrow$ | $\Phi^\uparrow(y) - \Phi^\downarrow(y)$ |
| Collapse rate | Frequency of useless proxy | $P_y(\Phi^\downarrow(y) = \bot)$ |
| Refinement benefit | Average EVSI per unit cost | $\mathbb{E}[\text{EVSI}] / \mathbb{E}[\text{Cost}]$ |
| Preservation ratio | Decisions where proxy sufficed | $\frac{\#\text{decisions from proxy}}{\#\text{total decisions}}$ |

When $\Omega$ detects degradation (DRU rising, collapse rate increasing,
preservation ratio falling), it signals that the context representation
$C$ is no longer adequate for the decision landscape — the system should
recalibrate or escalate more aggressively.

---

## 7. The complete TAKT loop

```text
                      System state x ∈ X
                            │
                            │ C (context compression)
                            ▼
                   Available context y ∈ Y
                            │
                    ┌───────┴───────┐
                    │               │
              Compute Φ^↓(y)    Compute DRU(y)
                    │               │
                    └───────┬───────┘
                            │
                     ┌──────┴──────┐
                     │             │
               Φ^↓(y) ≻ θ?    DRU(y) low?
                     │             │
                 ┌───┴───┐    ┌────┴────┐
                 │       │    │         │
                Yes      No  Yes        No
                 │       │    │         │
               Act    Refine?  └──┬──────┘
                 │       │        │
                 │   ┌───┴───┐    │
                 │   │       │    │
                 │  Yes      No   │
                 │   │       │    │
                 │  Cost ≤  │     │
                 │  EVSI?   │     │
                 │   │       │    │
                 │  ┌─┴─┐   │    │
                 │  │   │   │    │
                 │ Yes  No  │   └──────┐
                 │  │    │  │          │
                 │  │  Escalate      Refine C
                 │  │    │             │
                 │  │  ┌─┴──┐          │
                 │  │  │   │          └──→ back to top
                 │  │ Human  Stop
                 │  │ decides │
                 │  └────┬────┘
                 │       │
                 └───┬───┘
                     │
                Record outcome
                     │
                Update Ω metrics
```

---

## 8. Relation to the original TAKT concepts

The mapping formalizes TAKT's previously informal concepts:

| Original TAKT | Now formalized as |
|--------------|-------------------|
| "Too much context" | Proxy collapse: $\Phi^\downarrow(y) = \bot$ for all reachable $y$ |
| "Right amount of context" | $\Phi^\downarrow(y) \succ \theta$ — guarantee sufficient for decision |
| "Human intervention" | Escalation triggered by $\Phi^\downarrow \preceq \theta$ with refinement infeasible |
| "DRU" | Fibre width on decision-relevant property |
| "Takt" | Conservative proxy — the safe lower bound |
| "EVSI" | Expected improvement in $\Phi^\downarrow$ from refinement $C \to C'$ |
| "$\Omega$ monitor" | Tracks DRU, collapse rate, preservation ratio over time |
| "Governance" | Policy $\pi^*$ balancing acceptance, refinement, escalation, stop |

---

## 9. What this is not

- **Not a new theory.** TAKT adds zero mathematical content to SPT v1.1.
  All theorems come from the core and proxy extension.

- **Not a replacement for SPT.** SPT is the Why; TAKT is the How.
  SPT says "a conservative proxy exists when fibre images have GLBs."
  TAKT says "here's how to decide using that proxy, when to refine,
  when to escalate."

- **Not domain-specific.** TAKT's domain (human-AI decision systems)
  is one operational interpretation. Other interpretations are possible:
  database query optimization, automated monitoring, control theory.

---

## 10. Open questions in the TAKT layer

1. **Value function.** What is the right $\text{value}: L \to \mathbb{R}$
   for a given decision domain? Safety-critical vs. exploratory decisions
   need different mappings.

2. **Refinement cost model.** The cost of refinement $C \to C'$ depends
   on the specific acquisition mechanism (API call, human query, log
   analysis). Is there a general cost structure?

3. **Multi-step refinement.** The optimal policy $\pi^*$ above considers
   single-step refinement. Multi-step sequential refinement (acquire
   information iteratively) requires dynamic programming over the
   refinement graph.

4. **Multiple properties.** Real decisions involve multiple $\Phi_i$.
   The proxy is the meet over all:
   $(\sqcap_i \Phi_i)^\downarrow(y)$. How does DRU combine across
   properties?

5. **Adversarial context.** If the morphism $C$ can be manipulated by
   an adversary (log injection, context poisoning), the proxy is no
   longer safe. This is a security extension beyond the current theory.
