export interface ResEdge {
  from: string;
  to: string;
}

export interface ResCase {
  id: string;
  processes: string[];
  resources: string[];
  capacities: Record<string, number>;
  demands: Record<string, number>;
  requests: ResEdge[];
  allocations: ResEdge[];
}

export function solveResourceSystem(
  caseData: ResCase,
  activeProcesses: string[],
  activeResources: string[],
  hasRateLimiter: boolean
): { g: number; e: number; risk: number } {
  // Environment cost
  const edgeCount = caseData.requests.length + caseData.allocations.length;
  const capacitySum = activeResources.reduce((sum, r) => sum + (caseData.capacities[r] ?? 1), 0);
  const e = capacitySum + edgeCount;

  // Goal: unblocked processes * 5. If rate limiter is active, one process is throttled/blocked
  const baseBlocked = caseData.processes.filter(p => !activeProcesses.includes(p)).length;
  const rateLimiterBlock = hasRateLimiter ? 1 : 0;
  const blockedCount = Math.min(caseData.processes.length, baseBlocked + rateLimiterBlock);
  const unblockedCount = Math.max(0, caseData.processes.length - blockedCount);
  const g = unblockedCount * 5;

  // Overload Calculation
  let totalOverload = 0;
  for (const r of activeResources) {
    const cap = caseData.capacities[r] ?? 1;
    let demand = caseData.demands[r] ?? 0;
    if (hasRateLimiter) {
      // Rate limiter reduces demand on resource r to capacity level or similar
      demand = Math.max(0, demand - 1);
    }
    const overload = Math.max(0, demand - cap);
    totalOverload += overload;
  }

  const crashProb = 1.0 - Math.exp(-0.5 * totalOverload);
  const risk = crashProb * 30;

  return { g, e, risk };
}
