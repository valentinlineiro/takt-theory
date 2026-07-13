export interface DepEdge {
  id: string;
  from: string;
  to: string;
}

export interface DepCase {
  id: string;
  nodes: string[];
  source: string;
  target: string;
  failures: Record<string, number>;
  isolationNodes: string[];
  edges: DepEdge[];
}

export function solveDependencyGraph(caseData: DepCase, activeEdgeIds: string[]): { g: number; e: number; risk: number } {
  const activeEdges = caseData.edges.filter(e => activeEdgeIds.includes(e.id));
  
  // Find all paths from source to target
  const paths: string[][] = [];
  const findPaths = (curr: string, path: string[], visited: Set<string>) => {
    if (curr === caseData.target) {
      paths.push([...path]);
      return;
    }
    for (const e of activeEdges) {
      if (e.from === curr && !visited.has(e.to)) {
        visited.add(e.to);
        path.push(e.id);
        findPaths(e.to, path, visited);
        path.pop();
        visited.delete(e.to);
      }
    }
  };
  findPaths(caseData.source, [], new Set([caseData.source]));

  // Reachability
  const reachable = paths.length > 0;
  if (!reachable) {
    return { g: 0, e: activeEdges.length, risk: 0 };
  }

  // Edge disjoint paths (greedy count)
  let pathCount = 0;
  const usedEdges = new Set<string>();
  for (const p of paths) {
    if (p.every(e => !usedEdges.has(e))) {
      pathCount++;
      p.forEach(e => usedEdges.add(e));
    }
  }
  const g = Math.min(20, 10 + 2 * pathCount);
  const e = activeEdges.length;

  // Failure propagation risk
  let risk = 0;
  for (const node of caseData.nodes) {
    if (node === caseData.target || node === caseData.source) continue;
    const p_u = caseData.failures[node] ?? 0;
    if (p_u === 0) continue;

    // Check if failure can reach target
    const hasPathToTarget = (start: string, visited: Set<string>): boolean => {
      if (start === caseData.target) return true;
      for (const edge of activeEdges) {
        if (edge.from === start && !visited.has(edge.to)) {
          visited.add(edge.to);
          if (hasPathToTarget(edge.to, visited)) return true;
          visited.delete(edge.to);
        }
      }
      return false;
    };

    const reaches = hasPathToTarget(node, new Set([node]));
    if (!reaches) continue;

    // Check propagation probability: falls to 0.05 if intercepted by an active isolation node
    let isIntercepted = false;
    // An isolation node intercepts if it lies on all paths from node to target
    // Simple check: removing isolation node disconnects node from target
    for (const iso of caseData.isolationNodes) {
      // If the isolation node itself is active/reached, check if it's in the graph
      if (!caseData.nodes.includes(iso)) continue;
      
      const pathExistsWithoutIso = (start: string, visited: Set<string>): boolean => {
        if (start === caseData.target) return true;
        for (const edge of activeEdges) {
          if (edge.from === start && edge.to !== iso && !visited.has(edge.to)) {
            visited.add(edge.to);
            if (pathExistsWithoutIso(edge.to, visited)) return true;
            visited.delete(edge.to);
          }
        }
        return false;
      };

      if (reaches && !pathExistsWithoutIso(node, new Set([node]))) {
        isIntercepted = true;
        break;
      }
    }

    const failProb = isIntercepted ? 0.05 : 0.90;
    risk += p_u * 20 * failProb;
  }

  return { g, e, risk };
}
