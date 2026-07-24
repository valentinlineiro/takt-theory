export function validateEventPayload(payload: unknown): boolean {
  if (typeof payload !== 'object' || payload === null) return false;
  const p = payload as Record<string, unknown>;
  return typeof p.stepIndex === 'number' && Array.isArray(p.concreteStateVector);
}
