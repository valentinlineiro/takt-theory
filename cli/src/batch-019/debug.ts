import { loadBatch005Cases, evaluateCaseUtility } from '../batch-005/cases.js';
import { extractObservableSubgraph } from '../batch-005/estimator.js';

const cases = loadBatch005Cases();
const orig = cases.find(c => c.id === 'DEP-005')!;

const S_edges = ['s->t', 's->v3', 's->v3_next_next', 'v3->t', 'v3_next->v3', 'v3_next_next->t'];
const S_prime_edges = ['s->t', 's->v3', 's->v3_next_next', 'v3->t', 'v3_next->v3_next_next', 'v3_next_next->t'];

const nodes = ['s', 't', 'v3', 'v3_next', 'v3_next_next'];

const S_graph = {
  nodes,
  edges: S_edges.map(e => { const [from, to] = e.split('->'); return { from, to }; }),
  capabilities: { ...orig.graph.capabilities },
};

const S_prime_graph = {
  nodes,
  edges: S_prime_edges.map(e => { const [from, to] = e.split('->'); return { from, to }; }),
  capabilities: { ...orig.graph.capabilities },
};

const subS = extractObservableSubgraph(S_graph, 's', 2);
const subSPrime = extractObservableSubgraph(S_prime_graph, 's', 2);

console.log('--- Evaluation on S ---');
const uS_T0 = evaluateCaseUtility({ ...orig, graph: S_graph }, subS, 'T0');
const uS_T1 = evaluateCaseUtility({ ...orig, graph: S_graph }, subS, 'T1');
console.log('T0:', uS_T0);
console.log('T1:', uS_T1);

console.log('--- Evaluation on S\' ---');
const uSPrime_T0 = evaluateCaseUtility({ ...orig, graph: S_prime_graph }, subSPrime, 'T0');
const uSPrime_T1 = evaluateCaseUtility({ ...orig, graph: S_prime_graph }, subSPrime, 'T1');
console.log('T0:', uSPrime_T0);
console.log('T1:', uSPrime_T1);
