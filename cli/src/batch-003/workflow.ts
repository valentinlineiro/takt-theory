export interface WrkTask {
  id: string;
  cost: number;
  pFail: number;
  isCheckpoint: boolean;
}

export interface WrkCase {
  id: string;
  tasks: WrkTask[];
}

export function solveWorkflow(caseData: WrkCase, activeTaskIds: string[]): { g: number; e: number; risk: number } {
  const tasks = caseData.tasks.filter(t => activeTaskIds.includes(t.id));
  
  // Success Probability (product of task success rates)
  let successProb = 1.0;
  for (const t of tasks) {
    successProb *= (1.0 - t.pFail);
  }
  const g = 10 * successProb;
  const e = tasks.reduce((sum, t) => sum + t.cost, 0);

  // Risk: expected rollback cost
  let risk = 0;
  for (let i = 0; i < tasks.length; i++) {
    const t = tasks[i];
    if (t.pFail === 0) continue;

    // Find rollback target (nearest upstream checkpoint)
    let rollbackTargetIndex = -1;
    for (let j = i - 1; j >= 0; j--) {
      if (tasks[j].isCheckpoint) {
        rollbackTargetIndex = j;
        break;
      }
    }

    // Rollback cost: sum of execution costs between rollback target and task
    let rollbackCost = 0;
    const startIdx = rollbackTargetIndex + 1;
    for (let k = startIdx; k <= i; k++) {
      rollbackCost += tasks[k].cost;
    }

    risk += t.pFail * rollbackCost;
  }

  return { g, e, risk };
}
