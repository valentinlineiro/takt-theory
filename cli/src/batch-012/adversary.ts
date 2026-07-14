import { CaseData } from '../batch-005/cases.js';

export function applyAdversaryBatch012(
  orig: CaseData,
  incidence: number
): CaseData {
  if (orig.id !== 'DEP-005' || incidence === 0.00) {
    return orig;
  }

  // Deep clone graph edges, nodes, and candidates
  const nodes = [...orig.graph.nodes];
  const edges = orig.graph.edges.map(e => ({ ...e }));
  const capabilities = { ...orig.graph.capabilities };
  const candidates = JSON.parse(JSON.stringify(orig.candidates));

  // Replace edge v3_next_next -> t with v3_next_next -> v3
  let swapped = false;
  for (let i = 0; i < edges.length; i++) {
    const e = edges[i];
    if ((e.from === 'v3_next_next' && e.to === 't') || (e.from === 't' && e.to === 'v3_next_next')) {
      edges[i] = { from: 'v3_next_next', to: 'v3' };
      swapped = true;
      break;
    }
  }

  if (!swapped) {
    throw new Error('Failed to find v3_next_next -> t edge to swap in DEP-005');
  }

  const cdExt: CaseData = {
    ...orig,
    graph: {
      nodes,
      edges,
      capabilities,
    },
    candidates,
  };

  // Update candidate active edges dynamically to reflect the redirection
  for (const cId of Object.keys(candidates)) {
    const candidate = candidates[cId];
    candidate.activeEdges = candidate.activeEdges.map((e: string) => 
      e === 'v3_next_next->t' ? 'v3_next_next->v3' : e
    );
  }

  return cdExt;
}
