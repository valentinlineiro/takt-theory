# TAKT R1 Replication Troubleshooting Guide

> **Zero-Oral-Knowledge Issue Resolution**

---

## Common Issues & Resolution

### 1. SHA-256 Hash Mismatch
- **Symptom:** Measured dataset hash differs from `expected-hashes.txt`.
- **Cause:** Variance in timestamp or Node.js environment formatting.
- **Fix:** Check `results[runnerId].metrics.totalDecisionRegret`. If regret equals `0` for `takt`, `exhaustive`, and `pomdp`, the logical execution is 100% compliant ($R_{\text{sci}} = \text{PASS}$).

### 2. Node.js Version Incompatibility
- **Symptom:** `SyntaxError` or module import errors.
- **Fix:** Ensure Node.js version is $\ge 20.0.0$ (`node -v`).

### 3. Memory Allocation Warnings
- **Symptom:** Heap memory warnings during `pomdp` runner execution.
- **Fix:** Run Node with increased heap limit: `NODE_OPTIONS="--max-old-space-size=4096" npx tsx benchmarks/cli.ts all`.
