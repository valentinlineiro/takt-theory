import type { BenchmarkEvent, ConcreteEvent } from '../../interface/BenchmarkEvent.js';

export interface PlanningState {
  readonly robotLoc: 'A' | 'B' | 'C';
  readonly boxLoc: 'A' | 'B' | 'C';
  readonly doorState: 'open' | 'closed';
  readonly batteryLevel: number; // Irrelevant ambient state
  readonly ambientTemp: number;   // Irrelevant ambient state
}

export type PlanningAction = 0 | 1 | 2; // 0: MoveRobot, 1: MoveBox, 2: OpenDoor

export class PlanningDomainAdapter {
  private lcgState: number;

  constructor(seed = 42) {
    this.lcgState = seed % 2147483647;
  }

  private nextFloat(): number {
    this.lcgState = (this.lcgState * 16807) % 2147483647;
    return (this.lcgState - 1) / 2147483646;
  }

  /**
   * Independent Exogenous State Generator (STRIPS World Model)
   */
  public generateState(): PlanningState {
    const locs: Array<'A' | 'B' | 'C'> = ['A', 'B', 'C'];
    const robotLoc = locs[Math.floor(this.nextFloat() * 3)];
    const boxLoc = locs[Math.floor(this.nextFloat() * 3)];
    const doorState = this.nextFloat() > 0.5 ? 'open' : 'closed';
    const batteryLevel = Math.floor(this.nextFloat() * 100);
    const ambientTemp = 15 + Math.floor(this.nextFloat() * 20);

    return { robotLoc, boxLoc, doorState, batteryLevel, ambientTemp };
  }

  /**
   * Independent Oracle D(S): Computes optimal next planning action
   * Completely decoupled from TAKT decision engine.
   */
  public oracle(state: PlanningState): PlanningAction {
    if (state.doorState === 'closed') {
      return 2; // OpenDoor action required first
    }
    if (state.robotLoc !== state.boxLoc) {
      return 0; // MoveRobot to box location first
    }
    return 1; // MoveBox to target location
  }

  /**
   * Generates a concrete benchmark event containing decoupled state & 3 representations
   */
  public generateEvent(stepIndex: number): ConcreteEvent {
    const s = this.generateState();
    const trueAction = this.oracle(s);

    // Encode state into vector for general benchmark interface
    const robotCode = s.robotLoc === 'A' ? 0 : s.robotLoc === 'B' ? 1 : 2;
    const boxCode = s.boxLoc === 'A' ? 0 : s.boxLoc === 'B' ? 1 : 2;
    const doorCode = s.doorState === 'open' ? 1 : 0;

    return {
      stepIndex,
      rawStateId: `strips_state_${stepIndex}`,
      concreteStateVector: [robotCode, boxCode, doorCode, s.batteryLevel, s.ambientTemp],
      trueDecision: trueAction,
      availableActions: [0, 1, 2]
    };
  }

  /**
   * Pre-registered 3-Representation Projections
   */
  public static projectRepresentation(stateVector: number[], type: 'sufficient' | 'insufficient' | 'excessive'): number[] {
    const [robot, box, door, battery, temp] = stateVector;

    if (type === 'sufficient') {
      // R1 (Sufficient TAKT Quotient S / K_D): Preserves task-critical predicates (robot, box, door)
      return [robot, box, door];
    } else if (type === 'insufficient') {
      // R2 (Insufficient): Strips essential door predicate (only preserves robot location)
      return [robot];
    } else {
      // R3 (Excessive): Retains full state including irrelevant ambient variables (battery, temp)
      return [robot, box, door, battery, temp];
    }
  }
}
