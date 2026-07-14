import { CaseData } from '../batch-005/cases.js';

export function applyAdversaryBatch013(
  orig: CaseData,
  incidence: number
): CaseData {
  if (orig.id !== 'DEP-005' || incidence === 0.00) {
    return orig;
  }

  // Deep clone graph edges, nodes, and candidates
  const nodes = [...orig.graph.nodes];
  const capabilities = { ...orig.graph.capabilities };
  const candidates = JSON.parse(JSON.stringify(orig.candidates));

  // Permuted edges for Configuration #187
  const corruptEdges = [
    { from: 's', to: 'v3_next' },
    { from: 's', to: 'v3_next_next' },
    { from: 'v3', to: 't' },
    { from: 'v3_next_next', to: 't' },
    { from: 'v3_next', to: 'v3' },
    { from: 'v3_next_next', to: 'v3_next' },
  ];

  // Map corrupt edges to activeEdges string representation
  const corruptEdgesStr = corruptEdges.map(e => `${e.from}->${e.to}`);

  const cdExt: CaseData = {
    ...orig,
    graph: {
      nodes,
      edges: corruptEdges,
      capabilities,
    },
    candidates,
  };

  // Update candidate active edges dynamically
  candidates.T0.activeEdges = [...corruptEdgesStr];
  candidates.T1.activeEdges = corruptEdgesStr.filter(e => e !== 'v3->t');

  return cdExt;
}
