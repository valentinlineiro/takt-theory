# TAKT v1.1 — Standalone R1 Independent Replication Package

> **Package Status:** Official Scientific Replication Package (v1.1)  
> **Theory Baseline:** TAKT-v1.0 Frozen Core (`v1.0.0`)  
> **Git Commit Tag:** `v1.0.0`  
> **Target Audience:** Independent Researchers, Peer-Reviewers, Third-Party Auditors

---

## 1. Executive Objective

This package provides a zero-author-dependence protocol for independently verifying, executing, and auditing the empirical claims of TAKT v1.0.

An independent reviewer should be able to clone the repository, execute 1 canonical command, and verify dataset hashes without requesting any manual intervention, interpretation, or parameter tuning from the original authors.

---

## 2. Directory Structure

```text
replication-package-v1/
├── README.md                          (This document)
├── QUICKSTART.md                      (Fast 1-command quickstart)
├── R1-PROTOCOL.md                     (Registered R1 experimental protocol)
├── troubleshooting.md                 (Zero-oral-knowledge troubleshooting)
├── environment/
│   ├── node-version                   (v24.14.1 / LTS requirement)
│   └── hardware-requirements.md       (System memory, CPU, OS requirements)
├── theory/
│   └── TAKT-v1.0-reference.md         (Operational definitions of K_D, M_D, theta_crit, EVSI)
├── verification/
│   ├── expected-hashes.txt            (Cryptographic SHA-256 hash manifest)
│   ├── validation-script.ts           (Automated verification script)
│   └── reproduction-checklist.md      (Step-by-step R1 audit checklist)
└── reports/
    ├── expected-results.md            (Expected metric tables & numerical derivations)
    ├── R0'-report-template.md         (Internal dry-run calibration report)
    └── R1-Scorecard-template.md       (Auditor evaluation scorecard)
```

---

## 3. Autonomous Execution Commands

### Step 1: Install Dependencies
```bash
npm ci
```

### Step 2: Run Canonical Benchmark Suite (Single Command)
```bash
npx tsx benchmarks/cli.ts all --seed 42 --outDir replication-package-v1/output
```

### Step 3: Verify Cryptographic Integrity Hashes
```bash
npx tsx replication-package-v1/verification/validation-script.ts
```

---

## 4. Replication Metrics ($R_{\text{rep}}$ and $C_{\text{rep}}$)

1. **Reproduction Success ($R_{\text{rep}}$):** Binomial verification ($1$ if dataset hashes match `verification/expected-hashes.txt` and decision regret equals $0$; $0$ otherwise).
2. **Cognitive Cost ($C_{\text{rep}}$):** Measured setup and verification duration (target: $< 5 \text{ minutes}$ E2E).
