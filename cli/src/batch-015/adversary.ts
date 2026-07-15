import { CaseData } from '../batch-005/cases.js';

export function applyAdversaryBatch015(
  orig: CaseData,
  incidence: number
): CaseData {
  if (orig.id !== 'DEP-005' || incidence === 0.00) {
    return orig;
  }

  // Node transposition map: t <-> v3_next_next
  const swap = (node: string): string => {
    if (node === 't') return 'v3_next_next';
    if (node === 'v3_next_next') return 't';
    return node;
  };

  const nodes = orig.graph.nodes.map(swap);
  const capabilities = { ...orig.graph.capabilities };
  const candidates = JSON.parse(JSON.stringify(orig.candidates));

  // Swapped edges
  const corruptEdges = orig.graph.edges.map(e => ({
    from: swap(e.from),
    to: swap(e.to),
  }));

  const cdExt: CaseData = {
    ...orig,
    graph: {
      nodes,
      edges: corruptEdges,
      capabilities,
    },
    candidates,
  };

  // Map candidate active edges
  const swapEdgeStr = (edgeStr: string): string => {
    const [from, to] = edgeStr.split('->');
    return `${swap(from)}->${swap(to)}`;
  };

  candidates.T0.activeEdges = orig.candidates.T0.activeEdges.map(swapEdgeStr);
  candidates.T1.activeEdges = orig.candidates.T1.activeEdges.map(swapEdgeStr);

  return cdExt;
}
