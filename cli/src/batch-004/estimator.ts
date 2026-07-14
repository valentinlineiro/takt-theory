export interface GraphEdge {
  from: string;
  to: string;
}

export interface GlobalGraph {
  nodes: string[];
  edges: GraphEdge[];
}

export interface ObservableSubgraph {
  nodes: string[];
  edges: GraphEdge[];
  globalDegrees: Record<string, number>;
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
      // Find all undirected neighbors of curr in S
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

  // Subgraph edges: all edges in S where both endpoints are in the node set
  const edges = S.edges.filter(
    (edge) => visited.has(edge.from) && visited.has(edge.to)
  );

  // Compute global degrees for all nodes in the extracted subgraph
  const globalDegrees: Record<string, number> = {};
  for (const node of nodes) {
    let degree = 0;
    for (const edge of S.edges) {
      if (edge.from === node || edge.to === node) {
        degree++;
      }
    }
    globalDegrees[node] = degree;
  }

  return {
    nodes,
    edges,
    globalDegrees,
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

export function computeProxyUncertainty(
  O_k: ObservableSubgraph,
  f: string
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
  // 1. Gamma_k(v) = 1 (i.e. global degree > local degree)
  // 2. Relevant_k(v, f) (i.e. connected to f via directed path in O_k)
  for (const v of O_k.nodes) {
    const globalDeg = O_k.globalDegrees[v] ?? 0;
    const localDeg = localDegrees[v] ?? 0;
    const gamma = globalDeg > localDeg ? 1 : 0;

    if (gamma === 1) {
      const relevant =
        hasDirectedPath(v, f, O_k.edges) || hasDirectedPath(f, v, O_k.edges);
      if (relevant) {
        return 1;
      }
    }
  }

  return 0;
}
