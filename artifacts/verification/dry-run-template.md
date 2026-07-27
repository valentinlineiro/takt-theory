# External Dry Run Log Template

| Field | Value |
| :--- | :--- |
| **Reviewer / Observer ID** | [External Reviewer Initials / ID] |
| **Execution Date** | [YYYY-MM-DD] |
| **Platform Details** | OS: [Linux/MacOS/Windows], Node: [vXX.X.X], Lake: [vXX.X.X] |
| **Clean Environment Verified?** | [Yes / No] |
| **Time to First Clean Verification** | [e.g. 15 minutes] |
| **Incidents / Friction Identified** | [None / List of issues encountered] |
| **Required Fixes / Docs Updates** | [None / Details of fixes applied] |
| **Final Reproduction Status** | [REPRODUCED / FAILED] |

---

## Zero-Contact Checkist Verified
- [ ] `./scripts/bootstrap.sh` executed cleanly without manual intervention.
- [ ] `./scripts/verify.sh` executed cleanly and generated `artifacts/verification/st016-v1.0-report.md`.
- [ ] Lean 4 build succeeded (230 jobs, 0 errors, 0 `sorry`s).
- [ ] Vitest runtime suite passed (283/283 tests).
- [ ] EXP-004 witness suite generated artifacts for $C_{\text{contract}}$, $C_{\text{uncertainty}}$, and $C_{\text{temporal}}$.
- [ ] SHA-256 hashes in `hashes.json` matched the frozen specification files.
