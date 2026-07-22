# Strategy Theory: Search Strategies, Properties & Composition

**Date:** 2026-07-22  
**Author:** Antigravity AI  
**Status:** In Review (Draft Specification)

---

## 1. Engine / Strategy Boundary

The core principle of Strategy Theory in TAKT is the decoupling of decision-making from execution:

> **"A Strategy decides transitions. An Engine realizes transitions."**

Under this model:
*   **Strategy**: A pure mathematical object (a mapping from a search context to a recommended decision). It has no mutable state and does not update frontiers, heaps, or search trees.
*   **Search Engine (Runner)**: The execution context that manages the search state, owns and updates the frontier, drives the search loop, handles operational metrics, and implements priority structures.

This division ensures that strategies remain pure mathematical mappings that are easy to formalize in Lean, keeping the certified theory decoupled from the runtime's operational details.

---

## 2. Strategy Abstraction & Context Representation

To support both local search (traversing a single path) and global search (exploring a frontier of paths), the execution engine supplies a read-only view of the search frontier and expansion history to the strategy.

### 2.1 Search Problem Interface (`interfaces/problem.ts`)
Defines the transition space and the target condition, without specifying how to search.
```typescript
export interface SearchProblem<S, A> {
  initialState(): S;
  /** Returns valid actions from state S */
  actions(state: S): Iterable<A>;
  /** Computes the target state given an action */
  step(state: S, action: A): S;
  /** Returns true if state S is an accepting/goal state */
  isAccepting(state: S): boolean;
}
```

### 2.3 Search Frontier & Context (`interfaces/strategy.ts`)
The `SearchFrontier` represents the collection of active partial trajectories. The `StrategyContext` is an injected context that strategies query.

```typescript
import { TrajectoryPrefix } from '../../takt-core/types.js';

export interface SearchFrontier<S, A> {
  /** All candidate paths currently available for expansion */
  readonly paths: ReadonlyArray<TrajectoryPrefix<S, A>>;
}

export interface ExpansionStep<S, A> {
  /** The path selected from the frontier */
  readonly selectedPath: TrajectoryPrefix<S, A>;
  /** The action chosen to extend that path */
  readonly chosenAction: A;
}

export interface StrategyContext<S, A> {
  readonly problem: SearchProblem<S, A>;
  readonly frontier: SearchFrontier<S, A>; // Injected view from the runner
  readonly history: ReadonlyArray<ExpansionStep<S, A>>; // Read-only expansion log
}

export interface Strategy<S, A, O> {
  /** Pure decision mapping from context to decision object O */
  decide(context: StrategyContext<S, A>): O;
}
```

### 2.4 Decision Model Polymorphism (`interfaces/decision.ts`)
Strategies return a polymorphic decision object `O`, allowing for deterministic, non-deterministic, or probabilistic outputs.

```typescript
import { TrajectoryPrefix } from '../../takt-core/types.js';

/**
 * Recommends expanding a specific path on the frontier with a specific action.
 */
export type DeterministicDecision<S, A> =
  | { type: 'EXPAND'; path: TrajectoryPrefix<S, A>; action: A }
  | { type: 'TERMINATE' }
  | { type: 'DEFER' }; // Relinquishes control to a fallback strategy
```

---

## 3. Strategy Properties vs. Guarantees (`properties/evaluation.ts`)

We distinguish between properties that are intrinsic to the strategy definition itself, and guarantees that depend on the relationship between a strategy and a specific search problem.

### 3.1 Structural Properties
Intrinsic properties evaluated directly on the strategy mapping, independent of any state transitions or problem invariants.

*   **Deterministic**: The strategy produces a single unique output for every context.
*   **Memoryless (Markovian)**: The decision depends only on the current frontier, ignoring the expansion history:
    $$\forall c_1, c_2 \in \text{Context}, \quad c_1.\text{frontier} = c_2.\text{frontier} \implies S(c_1) = S(c_2)$$
*   **Stochastic**: The strategy returns a probability distribution over candidate transitions.
*   **Stateful**: The strategy utilizes `history` to make decisions (e.g., preventing cycles by looking at visited paths).

### 3.2 Relational Guarantees
Guarantees that can only be formulated in relation to a specific `SearchProblem` and its properties.

*   **Admissible**: Under a search problem $P$, a decision is admissible if it only recommends expanding paths currently in the frontier, and only using actions that are valid in the terminal state of that path.
    ```typescript
    export function isAdmissible<S, A>(
      decision: DeterministicDecision<S, A>,
      context: StrategyContext<S, A>
    ): boolean {
      if (decision.type === 'TERMINATE' || decision.type === 'DEFER') return true;
      
      const exists = context.frontier.paths.some(p => equalPaths(p, decision.path));
      if (!exists) return false;

      const terminalState = decision.path.states[decision.path.states.length - 1];
      const validActions = Array.from(context.problem.actions(terminalState));
      return validActions.includes(decision.action);
    }
    ```
*   **Complete**: Under a search problem $P$, a strategy is complete if it guarantees finding an accepting path if one exists.
*   **Optimal**: Under a cost-morphism landscape, the strategy guarantees finding a path minimizing the objective function.

---

## 4. Strategy Algebra & Composition (`implementations/composition.ts`)

Combinators are mathematical functions mapping strategies to new strategies:
$$\text{Combinator} : \text{Strategy} \times \text{Strategy} \to \text{Strategy}$$

This algebraic approach makes it straightforward to prove property preservation (e.g., "if $A$ and $B$ are deterministic, then $\text{fallback}(A, B)$ is deterministic").

### 4.1 Fallback Function
Returns a new strategy that delegates to `primary`; if it defers, delegates to `secondary`.
```typescript
export function fallback<S, A>(
  primary: Strategy<S, A, DeterministicDecision<S, A>>,
  secondary: Strategy<S, A, DeterministicDecision<S, A>>
): Strategy<S, A, DeterministicDecision<S, A>> {
  return {
    decide: (context) => {
      const decision = primary.decide(context);
      return decision.type === 'DEFER' ? secondary.decide(context) : decision;
    }
  };
}
```

### 4.2 Depth-Bounding Function
Returns a new strategy that caps expansion depth, returning `DEFER` if a selected path exceeds `maxDepth`.
```typescript
export function depthBound<S, A>(
  strategy: Strategy<S, A, DeterministicDecision<S, A>>,
  maxDepth: number
): Strategy<S, A, DeterministicDecision<S, A>> {
  return {
    decide: (context) => {
      const decision = strategy.decide(context);
      if (decision.type === 'EXPAND' && decision.path.states.length > maxDepth) {
        return { type: 'DEFER' };
      }
      return decision;
    }
  };
}
```

---

## 5. Examples of Strategy Instantiations (`implementations/canonical.ts`)

These are concrete instantiations of the `Strategy` interface, illustrating applications of the theory:

*   **GreedyStrategy**: Recommends expanding the path in the frontier that leads to a state with the lowest cost (or estimated distance to target), choosing the cheapest next action.
*   **RandomStrategy**: Selects a random path from the frontier and a random valid action.
*   **BestFirstStrategy**: Selects the path $p$ on the frontier minimizing $f(p) = g(p) + h(p)$ (where $g$ is path cost and $h$ is heuristic), recommending the action leading to the minimum $f$-value state.

---

## 6. Search Runner (Execution Engine) (`runtime/runner.ts`)

The runner manages search execution state (frontier, queues), updates it according to the pure strategy's decisions, and decides termination.

```typescript
export interface RunResult<S, A> {
  readonly trajectory: TrajectoryPrefix<S, A> | null;
  readonly expansionCount: number;
  readonly success: boolean;
}

export class SearchRunner<S, A> {
  constructor(private readonly problem: SearchProblem<S, A>) {}

  run(
    strategy: Strategy<S, A, DeterministicDecision<S, A>>,
    initialFrontier: SearchFrontier<S, A>,
    maxExpansions: number = 1000
  ): RunResult<S, A> {
    let frontier: SearchFrontier<S, A> = initialFrontier;
    const history: ExpansionStep<S, A>[] = [];
    let expansions = 0;

    while (expansions < maxExpansions) {
      const acceptingPath = frontier.paths.find(p => 
        this.problem.isAccepting(p.states[p.states.length - 1])
      );
      if (acceptingPath) {
        return { trajectory: acceptingPath, expansionCount: expansions, success: true };
      }

      if (frontier.paths.length === 0) {
        break; // Frontier exhausted
      }

      const context: StrategyContext<S, A> = {
        problem: this.problem,
        frontier,
        history
      };

      const decision = strategy.decide(context);

      if (decision.type === 'TERMINATE' || decision.type === 'DEFER') {
        break;
      }

      const nextState = this.problem.step(
        decision.path.states[decision.path.states.length - 1],
        decision.action
      );

      const extendedPath: TrajectoryPrefix<S, A> = {
        states: [...decision.path.states, nextState],
        actions: [...decision.path.actions, decision.action]
      };

      frontier = this.updateFrontier(frontier, decision.path, extendedPath);
      
      history.push({
        selectedPath: decision.path,
        chosenAction: decision.action
      });

      expansions++;
    }

    return { trajectory: null, expansionCount: expansions, success: false };
  }

  private updateFrontier(
    current: SearchFrontier<S, A>,
    expanded: TrajectoryPrefix<S, A>,
    extended: TrajectoryPrefix<S, A>
  ): SearchFrontier<S, A> {
    const paths = current.paths.filter(p => !equalPaths(p, expanded));
    return {
      paths: [...paths, extended]
    };
  }
}
```
