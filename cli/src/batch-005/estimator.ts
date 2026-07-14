export interface GraphEdge {
  from: string;
  to: string;
}

export interface CapabilitySignature {
  Pf: boolean; // Propagates Failure
  Pr: boolean; // Recovery/Redundancy
  Ps: boolean; // Isolation/Shielding
  Pc: boolean; // Contention
  Pm: boolean; // Mutability
}

export interface GlobalGraph {
  nodes: string[];
  edges: GraphEdge[];
  capabilities: Record<string, CapabilitySignature>;
}

export interface ObservableSubgraph {
  nodes: string[];
  edges: GraphEdge[];
  globalDegrees: Record<string, number>;
  capabilities: Record<string, CapabilitySignature>;
}

export interface DecisionSensitivity {
  Df: boolean;
  Dr: boolean;
  Ds: boolean;
  Dc: boolean;
  Dm: boolean;
}

export function extractObservableSubgraph(
  S: GlobalGraph,
  f: string,
  k: number
): ObservableSubgraph {
  const visited = new Set<string>([f]);
  const queue: [string, number][] = [[f, 0]];
  let head = 0;

  // Undirected BFS to find all nodes within k hops from f
  while (head < queue.length) {
    const [curr, dist] = queue[head++];
    if (dist < k) {
      for (const edge of S.edges) {
        let neighbor: string | null = null;
        if (edge.from === curr) {
          neighbor = edge.to;
        } else if (edge.to === curr) {
          neighbor = edge.from;
        }

        if (neighbor !== null && !visited.has(neighbor)) {
          visited.add(neighbor);
          queue.push([neighbor, dist + 1]);
        }
      }
    }
  }

  const nodes = Array.from(visited);

  // Subgraph edges: edges where both endpoints are in the node set
  const edges = S.edges.filter(
    (edge) => visited.has(edge.from) && visited.has(edge.to)
  );

  // Compute global degrees and extract capability metadata for visited nodes
  const globalDegrees: Record<string, number> = {};
  const capabilities: Record<string, CapabilitySignature> = {};
  for (const node of nodes) {
    let degree = 0;
    for (const edge of S.edges) {
      if (edge.from === node || edge.to === node) {
        degree++;
      }
    }
    globalDegrees[node] = degree;
    capabilities[node] = S.capabilities[node] ?? {
      Pf: false,
      Pr: false,
      Ps: false,
      Pc: false,
      Pm: false,
    };
  }

  return {
    nodes,
    edges,
    globalDegrees,
    capabilities,
  };
}

function hasDirectedPath(
  start: string,
  target: string,
  edges: GraphEdge[]
): boolean {
  if (start === target) return true;
  const visited = new Set<string>([start]);
  const queue: string[] = [start];
  let head = 0;
  while (head < queue.length) {
    const curr = queue[head++];
    if (curr === target) return true;
    for (const edge of edges) {
      if (edge.from === curr && !visited.has(edge.to)) {
        visited.add(edge.to);
        queue.push(edge.to);
      }
    }
  }
  return false;
}

export function computeDecisionSensitivity(
  competitiveSensitivities: DecisionSensitivity[]
): DecisionSensitivity {
  const D_k = { Df: false, Dr: false, Ds: false, Dc: false, Dm: false };
  for (const s of competitiveSensitivities) {
    D_k.Df = D_k.Df || s.Df;
    D_k.Dr = D_k.Dr || s.Dr;
    D_k.Ds = D_k.Ds || s.Ds;
    D_k.Dc = D_k.Dc || s.Dc;
    D_k.Dm = D_k.Dm || s.Dm;
  }
  return D_k;
}

export function computeDecisionRelevantUncertainty(
  O_k: ObservableSubgraph,
  f: string,
  D_k: DecisionSensitivity
): 0 | 1 {
  // Compute local degrees for all nodes in O_k
  const localDegrees: Record<string, number> = {};
  for (const node of O_k.nodes) {
    localDegrees[node] = 0;
  }
  for (const edge of O_k.edges) {
    if (localDegrees[edge.from] !== undefined) {
      localDegrees[edge.from]++;
    }
    if (localDegrees[edge.to] !== undefined) {
      localDegrees[edge.to]++;
    }
  }

  // Check if there exists a boundary node v in O_k such that:
  // 1. Gamma_k(v) = 1 (global degree > local degree)
  // 2. Relevant_k(v, f) (connected in either direction)
  // 3. Overlap exists: D_k intersect M_k(v) is non-empty
  for (const v of O_k.nodes) {
    const globalDeg = O_k.globalDegrees[v] ?? 0;
    const localDeg = localDegrees[v] ?? 0;
    const gamma = globalDeg > localDeg ? 1 : 0;

    if (gamma === 1) {
      const relevant =
        hasDirectedPath(v, f, O_k.edges) || hasDirectedPath(f, v, O_k.edges);

      if (relevant) {
        const mv = O_k.capabilities[v];
        if (mv) {
          const overlap =
            (D_k.Df && mv.Pf) ||
            (D_k.Dr && mv.Pr) ||
            (D_k.Ds && mv.Ps) ||
            (D_k.Dc && mv.Pc) ||
            (D_k.Dm && mv.Pm);

          if (overlap) {
            return 1;
          }
        }
      }
    }
  }

  return 0;
}
