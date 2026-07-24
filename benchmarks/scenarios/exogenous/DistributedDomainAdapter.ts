import type { ConcreteEvent } from '../../interface/BenchmarkEvent.js';

export interface DistributedNodeState {
  readonly activeQuorumCount: number;
  readonly networkLatencyMs: number;
  readonly leaderStatus: 'leader' | 'follower' | 'candidate';
  readonly faultCount: number;
  readonly ambientClockDriftMs: number; // Irrelevant ambient state
}

export type DistributedAction = 0 | 1 | 2; // 0: Commit, 1: Abort, 2: Re-elect Leader

export class DistributedDomainAdapter {
  private lcgState: number;

  constructor(seed = 42) {
    this.lcgState = seed % 2147483647;
  }

  private nextFloat(): number {
    this.lcgState = (this.lcgState * 16807) % 2147483647;
    return (this.lcgState - 1) / 2147483646;
  }

  /**
   * Independent Exogenous Distributed State Generator (Consensus/Paxos World Model)
   */
  public generateState(): DistributedNodeState {
    const activeQuorumCount = Math.floor(this.nextFloat() * 5); // 0 to 4 active nodes out of 5
    const networkLatencyMs = Math.floor(this.nextFloat() * 200);
    const leaders: Array<'leader' | 'follower' | 'candidate'> = ['leader', 'follower', 'candidate'];
    const leaderStatus = leaders[Math.floor(this.nextFloat() * 3)];
    const faultCount = Math.floor(this.nextFloat() * 3);
    const ambientClockDriftMs = Math.floor(this.nextFloat() * 50);

    return { activeQuorumCount, networkLatencyMs, leaderStatus, faultCount, ambientClockDriftMs };
  }

  /**
   * Independent Oracle D(S): Computes safe consensus action
   * Completely decoupled from TAKT decision engine.
   */
  public oracle(state: DistributedNodeState): DistributedAction {
    if (state.faultCount >= 2 || state.activeQuorumCount < 3) {
      return 1; // Abort action required due to quorum loss or high faults
    }
    if (state.leaderStatus !== 'leader') {
      return 2; // Re-elect Leader action required
    }
    return 0; // Commit consensus transaction
  }

  /**
   * Generates a concrete benchmark event containing decoupled state & 3 representations
   */
  public generateEvent(stepIndex: number): ConcreteEvent {
    const s = this.generateState();
    const trueAction = this.oracle(s);

    const leaderCode = s.leaderStatus === 'leader' ? 0 : s.leaderStatus === 'follower' ? 1 : 2;

    return {
      stepIndex,
      rawStateId: `distributed_state_${stepIndex}`,
      concreteStateVector: [s.activeQuorumCount, leaderCode, s.faultCount, s.networkLatencyMs, s.ambientClockDriftMs],
      trueDecision: trueAction,
      availableActions: [0, 1, 2]
    };
  }

  /**
   * Pre-registered 3-Representation Projections
   */
  public static projectRepresentation(stateVector: number[], type: 'sufficient' | 'insufficient' | 'excessive'): number[] {
    const [quorum, leader, faults, latency, drift] = stateVector;

    if (type === 'sufficient') {
      // R1 (Sufficient TAKT Quotient S / K_D): Preserves consensus-critical variables (quorum, leader, faults)
      return [quorum, leader, faults];
    } else if (type === 'insufficient') {
      // R2 (Insufficient): Strips fault count variable (only preserves quorum count)
      return [quorum];
    } else {
      // R3 (Excessive): Retains full network state including latency and clock drift
      return [quorum, leader, faults, latency, drift];
    }
  }
}
