import { CaseData } from '../batch-005/cases.js';
import { CapabilitySignature } from '../batch-005/estimator.js';

export interface AdversaryState {
  obsCaps: Record<string, CapabilitySignature>;
}

export function applyAdversaryBatch011(
  orig: CaseData,
  incidence: number // 0.00 to 0.15
): { cdExt: CaseData; obsCaps: Record<string, CapabilitySignature> } {
  // Deep clone CaseData graph to prevent mutating original case representation
  const graph = {
    nodes: [...orig.graph.nodes],
    edges: orig.graph.edges.map(e => ({ ...e })),
    capabilities: { ...orig.graph.capabilities },
  };

  const cdExt: CaseData = {
    ...orig,
    graph,
  };

  // Determine boundary node and corresponding leaf node
  let boundaryNode = '';
  let leafNode = '';
  let capabilityKey: keyof CapabilitySignature | null = null;

  if (orig.id === 'WRK-002' || orig.id === 'WRK-003') {
    boundaryNode = 't2';
    leafNode = 't_leaf';
    capabilityKey = 'Pm';
  } else if (orig.id === 'DEP-005') {
    boundaryNode = 'v3';
    leafNode = 'v_leaf';
    capabilityKey = 'Pr';
  }

  // 1. Leaf Extension: Add dummy leaf node at distance 2
  if (boundaryNode && leafNode) {
    if (!graph.nodes.includes(leafNode)) {
      graph.nodes.push(leafNode);
      graph.edges.push({ from: boundaryNode, to: leafNode });
      graph.capabilities[leafNode] = {
        Pf: false,
        Pr: false,
        Ps: false,
        Pc: false,
        Pm: false,
      };
    }
  }

  // Define observed capabilities
  const obsCaps = { ...graph.capabilities };

  // 2. Corrupt observed capability only if incidence > 0
  if (incidence > 0.00 && boundaryNode && capabilityKey) {
    const currentCap = obsCaps[boundaryNode];
    if (currentCap) {
      obsCaps[boundaryNode] = {
        ...currentCap,
        [capabilityKey]: false, // corrupt to false
      };
    }
  }

  return { cdExt, obsCaps };
}
