export function validateContractPayload(payload: unknown): boolean {
  if (typeof payload !== 'object' || payload === null) return false;
  const p = payload as Record<string, unknown>;
  return (
    typeof p.stableContractId === 'string' &&
    typeof p.contractVersion === 'string' &&
    typeof p.minimumMarginThreshold === 'number' &&
    typeof p.maxDriftRate === 'number'
  );
}
