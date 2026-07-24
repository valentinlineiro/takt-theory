import type { ScenarioConfig, ConcreteEvent } from '../../interface/BenchmarkEvent.js';

class LCG {
  private state: number;
  constructor(seed: number) {
    this.state = seed % 2147483647;
    if (this.state <= 0) this.state += 2147483646;
  }
  public nextFloat(): number {
    this.state = (this.state * 16807) % 2147483647;
    return (this.state - 1) / 2147483646;
  }
}

export class StateSpaceGenerator {
  private lcg: LCG;

  constructor(private config: ScenarioConfig) {
    this.lcg = new LCG(config.seed);
  }

  public generateEvents(count: number): ConcreteEvent[] {
    const events: ConcreteEvent[] = [];
    const k = this.config.kernelDimensionK;

    for (let i = 0; i < count; i++) {
      const vector: number[] = [];
      for (let j = 0; j < k; j++) {
        vector.push(Math.floor(this.lcg.nextFloat() * 100) / 100);
      }
      
      // True decision rule: majority threshold on first half of features
      const sum = vector.slice(0, Math.ceil(k / 2)).reduce((a, b) => a + b, 0);
      const trueDecision = sum >= Math.ceil(k / 2) * 0.5 ? 1 : 0;

      events.push({
        stepIndex: i,
        rawStateId: `state_${i}`,
        concreteStateVector: vector,
        trueDecision,
        availableActions: [0, 1]
      });
    }

    return events;
  }
}
