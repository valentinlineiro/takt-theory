import { computeFsaOracle, FsaCase } from './fsa.js';
import { computeFlowOracle, FlowCase } from './flow.js';
import { computeRagOracle, RagCase } from './rag.js';

const fsaCases: FsaCase[] = [
  {
    id: 'FSA-001',
    states: ['v0', 'v1', 'v2', 'v3', 'v4'],
    startState: 'v0',
    terminalStates: ['v3', 'v4'],
    beforeTransitions: [
      { from: 'v0', to: 'v1', cost: 4 },
      { from: 'v0', to: 'v2', cost: 5 },
      { from: 'v1', to: 'v3', cost: 2 },
      { from: 'v2', to: 'v4', cost: 3 }
    ],
    afterTransitions: [
      { from: 'v0', to: 'v1', cost: 4 },
      { from: 'v0', to: 'v2', cost: 2 },
      { from: 'v1', to: 'v3', cost: 2 },
      { from: 'v2', to: 'v4', cost: 3 }
    ]
  },
  {
    id: 'FSA-002',
    states: ['v0', 'v1', 'v2', 'v3', 'v4'],
    startState: 'v0',
    terminalStates: ['v3', 'v4'],
    beforeTransitions: [
      { from: 'v0', to: 'v3', cost: 10 },
      { from: 'v0', to: 'v1', cost: 2 },
      { from: 'v1', to: 'v4', cost: 2 }
    ],
    afterTransitions: [
      { from: 'v0', to: 'v3', cost: 1 },
      { from: 'v0', to: 'v1', cost: 2 }
    ]
  },
  {
    id: 'FSA-003',
    states: ['v0', 'v1', 'v2', 'v3', 'v4'],
    startState: 'v0',
    terminalStates: ['v3', 'v4'],
    beforeTransitions: [
      { from: 'v0', to: 'v3', cost: 2 },
      { from: 'v0', to: 'v1', cost: 1 },
      { from: 'v1', to: 'v4', cost: 1 }
    ],
    afterTransitions: [
      { from: 'v0', to: 'v3', cost: 2 },
      { from: 'v0', to: 'v1', cost: 1 }
    ]
  },
  {
    id: 'FSA-004',
    states: ['v0', 'v1', 'v2', 'v3', 'v4'],
    startState: 'v0',
    terminalStates: ['v3', 'v4'],
    beforeTransitions: [
      { from: 'v0', to: 'v3', cost: 5 },
      { from: 'v0', to: 'v1', cost: 2 },
      { from: 'v1', to: 'v4', cost: 3 }
    ],
    afterTransitions: [
      { from: 'v0', to: 'v3', cost: 6 },
      { from: 'v0', to: 'v1', cost: 2 },
      { from: 'v1', to: 'v4', cost: 3 }
    ]
  }
];

const flowCases: FlowCase[] = [
  {
    id: 'FLOW-001',
    vertices: ['s', 'v1', 'v2', 't'],
    source: 's',
    sink: 't',
    beforeEdges: [
      { from: 's', to: 'v1', cap: 10 },
      { from: 's', to: 'v2', cap: 5 },
      { from: 'v1', to: 't', cap: 5 },
      { from: 'v2', to: 't', cap: 10 }
    ],
    afterEdges: [
      { from: 's', to: 'v1', cap: 10 },
      { from: 's', to: 'v2', cap: 5 },
      { from: 'v1', to: 't', cap: 10 },
      { from: 'v2', to: 't', cap: 5 }
    ]
  },
  {
    id: 'FLOW-002',
    vertices: ['s', 'v1', 'v2', 't'],
    source: 's',
    sink: 't',
    beforeEdges: [
      { from: 's', to: 'v1', cap: 10 },
      { from: 's', to: 'v2', cap: 5 },
      { from: 'v1', to: 't', cap: 5 },
      { from: 'v2', to: 't', cap: 10 }
    ],
    afterEdges: [
      { from: 's', to: 'v1', cap: 10 },
      { from: 's', to: 'v2', cap: 5 },
      { from: 'v1', to: 't', cap: 10 },
      { from: 'v2', to: 't', cap: 10 }
    ]
  },
  {
    id: 'FLOW-003',
    vertices: ['s', 'v1', 'v2', 't'],
    source: 's',
    sink: 't',
    beforeEdges: [
      { from: 's', to: 'v1', cap: 10 },
      { from: 's', to: 'v2', cap: 5 },
      { from: 'v1', to: 't', cap: 5 },
      { from: 'v2', to: 't', cap: 10 }
    ],
    afterEdges: [
      { from: 's', to: 'v1', cap: 10 },
      { from: 's', to: 'v2', cap: 5 },
      { from: 'v1', to: 't', cap: 5 },
      { from: 'v2', to: 't', cap: 15 }
    ]
  },
  {
    id: 'FLOW-004',
    vertices: ['s', 'v1', 'v2', 't'],
    source: 's',
    sink: 't',
    beforeEdges: [
      { from: 's', to: 'v1', cap: 10 },
      { from: 's', to: 'v2', cap: 5 },
      { from: 'v1', to: 't', cap: 5 },
      { from: 'v2', to: 't', cap: 10 }
    ],
    afterEdges: [
      { from: 's', to: 'v1', cap: 8 },
      { from: 's', to: 'v2', cap: 5 },
      { from: 'v1', to: 't', cap: 5 },
      { from: 'v2', to: 't', cap: 12 }
    ]
  }
];

const ragCases: RagCase[] = [
  {
    id: 'RAG-001',
    processes: ['p1', 'p2'],
    resources: ['r1', 'r2'],
    beforeCapacities: { r1: 1, r2: 1 },
    beforeRequests: [{ from: 'p1', to: 'r2' }, { from: 'p2', to: 'r1' }],
    beforeAllocations: [{ from: 'r1', to: 'p1' }, { from: 'r2', to: 'p2' }],
    afterCapacities: { r1: 1, r2: 1 },
    afterRequests: [{ from: 'p1', to: 'r2' }],
    afterAllocations: [{ from: 'r2', to: 'p2' }]
  },
  {
    id: 'RAG-002',
    processes: ['p1', 'p2'],
    resources: ['r1', 'r2'],
    beforeCapacities: { r1: 1, r2: 1 },
    beforeRequests: [{ from: 'p1', to: 'r2' }, { from: 'p2', to: 'r1' }],
    beforeAllocations: [{ from: 'r1', to: 'p1' }, { from: 'r2', to: 'p2' }],
    afterCapacities: { r1: 2, r2: 1 },
    afterRequests: [{ from: 'p1', to: 'r2' }],
    afterAllocations: [{ from: 'r1', to: 'p1' }, { from: 'r1', to: 'p2' }, { from: 'r2', to: 'p2' }]
  },
  {
    id: 'RAG-003',
    processes: ['p1', 'p2'],
    resources: ['r1', 'r2'],
    beforeCapacities: { r1: 1, r2: 1 },
    beforeRequests: [{ from: 'p1', to: 'r2' }, { from: 'p2', to: 'r1' }],
    beforeAllocations: [{ from: 'r1', to: 'p1' }, { from: 'r2', to: 'p2' }],
    afterCapacities: { r1: 1, r2: 1 },
    afterRequests: [{ from: 'p1', to: 'r2' }, { from: 'p2', to: 'r1' }, { from: 'p1', to: 'r1' }],
    afterAllocations: [{ from: 'r1', to: 'p1' }, { from: 'r2', to: 'p2' }]
  },
  {
    id: 'RAG-004',
    processes: ['p1', 'p2'],
    resources: ['r1', 'r2'],
    beforeCapacities: { r1: 1, r2: 1 },
    beforeRequests: [{ from: 'p1', to: 'r2' }],
    beforeAllocations: [{ from: 'r1', to: 'p1' }, { from: 'r2', to: 'p2' }],
    afterCapacities: { r1: 1, r2: 1 },
    afterRequests: [{ from: 'p1', to: 'r1' }],
    afterAllocations: [{ from: 'r2', to: 'p1' }, { from: 'r1', to: 'p2' }]
  }
];

export function executeBatch002(): Record<string, string> {
  const results: Record<string, string> = {};
  for (const c of fsaCases) {
    results[c.id] = computeFsaOracle(c);
  }
  for (const c of flowCases) {
    results[c.id] = computeFlowOracle(c);
  }
  for (const c of ragCases) {
    results[c.id] = computeRagOracle(c);
  }
  return results;
}
