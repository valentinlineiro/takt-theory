export class CapabilityKernelMap<S, Z, A> {
  /** Verifies structural kernel refinement: ker(R)(s1, s2) => K_D(s1, s2) (ST-015) */
  public verifyKernelInclusion(
    s1: S,
    s2: S,
    representationR: (state: S) => Z,
    idealDecisionD: (state: S) => A
  ): boolean {
    const rEquiv = representationR(s1) === representationR(s2);
    if (!rEquiv) return true; // ker(R) precondition does not hold
    return idealDecisionD(s1) === idealDecisionD(s2); // ker(R) => K_D
  }
}
