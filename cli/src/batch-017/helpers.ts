import type { GlobalGraph } from '../batch-005/estimator.js';

export function getPermutations<T>(array: T[]): T[][] {
  const result: T[][] = [];
  function permute(arr: T[], m: T[] = []) {
    if (arr.length === 0) {
      result.push(m);
    } else {
      for (let i = 0; i < arr.length; i++) {
        const curr = arr.slice();
        const next = curr.splice(i, 1);
        permute(curr.slice(), m.concat(next));
      }
    }
  }
  permute(array);
  return result;
}

export function computeShortestPath(graph: GlobalGraph, from: string, to: string): number {
  if (from === to) return 0;
  const queue: [string, number][] = [[from, 0]];
  const visited = new Set<string>([from]);
  let head = 0;

  while (head < queue.length) {
    const [curr, dist] = queue[head++];
    if (curr === to) return dist;

    for (const edge of graph.edges) {
      if (edge.from === curr && !visited.has(edge.to)) {
        visited.add(edge.to);
        queue.push([edge.to, dist + 1]);
      }
    }
  }

  return 99; // Represents infinity
}

export function isReachable(graph: GlobalGraph, from: string, to: string): boolean {
  return computeShortestPath(graph, from, to) < 99;
}
