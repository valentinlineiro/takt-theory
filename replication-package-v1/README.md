# TAKT v1.0 — Standalone R1 Independent Replication Package

> **Package Status:** Official Scientific Replication Package (R1)  
> **Theory Baseline:** TAKT-v1.0 Frozen Core  
> **Repository Commit:** `3330b67`  
> **Target Audience:** Independent Researchers, Peer-Reviewers, Third-Party Auditors

---

## 1. Executive Objective

This package provides a zero-author-dependence protocol for independently verifying, executing, and auditing the empirical claims of TAKT v1.0.

An independent reviewer should be able to clone the repository, execute 1 command, and verify dataset hashes without requesting any manual intervention, interpretation, or parameter tuning from the original authors.

---

## 2. Directory Structure

```text
replication-package-v1/
├── README.md                          (This document)
├── environment/
│   ├── node-version                   (v24.14.1 / LTS requirement)
│   ├── dependencies-lock              (package.json / package-lock.json)
│   └── hardware-requirements.md       (System memory, CPU, OS requirements)
├── theory/
│   └── TAKT-v1.0-reference.md         (Frozen Lean 4 core claims & specs)
├── experiments/
│   ├── EXP-003-calibration            (Instrument calibration protocol)
│   ├── EXP-001-kernel-scaling         (Structural scaling protocol)
│   └── EXP-001-boundary-alpha         (Adaptive boundary search protocol)
├── verification/
│   ├── expected-hashes.txt            (Cryptographic SHA-256 hash manifest)
│   ├── validation-script.ts           (Automated verification script)
│   └── reproduction-checklist.md      (Step-by-step R1 audit checklist)
└── reports/
    └── expected-results.md            (Expected baseline metric tables)
```

---

## 3. Autonomous Execution Commands

### Step 1: Install Dependencies
```bash
npm ci
```

### Step 2: Run Calibration Protocol (EXP-003)
```bash
npx tsx benchmarks/cli.ts exp-003 --seed 42 --outDir replication-package-v1/output
```

### Step 3: Run Structural Scaling Protocol (EXP-001)
```bash
npx tsx benchmarks/cli.ts exp-001 --seed 42 --outDir replication-package-v1/output
```

### Step 4: Verify Cryptographic Integrity Hashes
```bash
npx tsx replication-package-v1/verification/validation-script.ts
```

---

## 4. Replication Metrics ($R_{\text{rep}}$ and $C_{\text{rep}}$)

1. **Reproduction Success ($R_{\text{rep}}$):** Binomial verification ($1$ if dataset hashes and decision regret metrics match expected values; $0$ otherwise).
2. **Cognitive Cost ($C_{\text{rep}}$):** Measured setup and verification duration (target: $< 5 \text{ minutes}$ E2E).
