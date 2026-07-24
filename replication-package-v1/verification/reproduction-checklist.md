# TAKT R1 Independent Reproduction Checklist

> **Auditor Checklist for Third-Party Independent Replication**

- [ ] **Environment Verification:** Node version matches `>= v20.x.x` (tested on v24.14.1).
- [ ] **Hardware Verification:** Minimum 4GB RAM, x64 architecture.
- [ ] **Command Execution:** Ran `npx tsx benchmarks/cli.ts all --seed 42`.
- [ ] **Regret Verification:** `totalDecisionRegret` equals `0` for `takt`, `exhaustive`, and `pomdp` runners across all seeds.
- [ ] **SHA-256 Hash Verification:** Generated dataset hashes match `verification/expected-hashes.txt`.
- [ ] **Cognitive Cost Audit:** Time from repository cloning to hash verification logged.
- [ ] **Zero Author Interaction:** Protocol executed without requesting clarifications or manual adjustments.
