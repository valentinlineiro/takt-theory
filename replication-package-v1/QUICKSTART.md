# TAKT v1.0 R1 Replication Quickstart Guide

> **Target:** 1-Command Autonomous Replication in $< 5 \text{ minutes}$

---

## 1. Prerequisites
- **Node.js:** `>= v20.0.0` (Tested on `v24.14.1`)
- **npm:** `>= 10.0.0`
- **RAM:** Minimum 4 GB

---

## 2. Fast-Track Execution Steps

### Step 1: Install Dependencies
```bash
npm ci
```

### Step 2: Run Full Benchmark Suite & Validation
```bash
npx tsx benchmarks/cli.ts all --seed 42 --outDir replication-package-v1/output
```

### Step 3: Audit Results against Scorecard
Compare output JSON files in `replication-package-v1/output/` against expected baselines in `replication-package-v1/reports/R1-Scorecard-template.md`.
