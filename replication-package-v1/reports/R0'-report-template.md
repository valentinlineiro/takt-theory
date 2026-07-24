# TAKT R0' Blind Dry-Run Calibration Report Template

> **Experiment:** R0' Internal Blind Trial (Channel Calibration)  
> **Target Package:** `replication-package-v1`  
> **Theory Baseline:** TAKT-v1.0 Frozen Core  
> **Git Commit:** `9d35938`

---

## 1. Participant Profile

- **Participant ID:** __________________________________
- **Background / Domain:** __________________________________ (Software / SE / Verification)
- **Prior TAKT Knowledge:** Zero internal development context.

---

## 2. Friction Decomposition ($C_{\text{rep}}$)

$$C_{\text{rep}} = C_{\text{ambigüedad}} + C_{\text{entorno}} + C_{\text{operación}} + C_{\text{interpretación}}$$

| Friction Component | Measured Value (Min / Count) | Description & Notes |
| :--- | :--- | :--- |
| **$C_{\text{ambigüedad}}$** | _______ min / _____ questions | Unclear instructions or terminology ambiguity |
| **$C_{\text{entorno}}$** | _______ min | Node.js, OS, or hardware environment issues |
| **$C_{\text{operación}}$** | _______ min | CLI execution or verification script issues |
| **$C_{\text{interpretación}}$** | _______ min | Ambiguity in evaluating output metrics vs baselines |
| **Total $C_{\text{rep}}$** | **_______ minutes** | **Target: $< 5 \text{ minutes}$ E2E** |

---

## 3. Information Leak Classification

| Incident ID | Incident Description | Leak Type (A / B / C / D) | Resolution / Action Required |
| :--- | :--- | :--- | :--- |
| **LEAK-001** | __________________________________ | [ ] A (Documental) [ ] B (Conceptual) [ ] C (Científica) [ ] D (Inevitable) | __________________________________ |
| **LEAK-002** | __________________________________ | [ ] A (Documental) [ ] B (Conceptual) [ ] C (Científica) [ ] D (Inevitable) | __________________________________ |

---

## 4. R0' Channel Calibration Outcome

- [ ] **CLEAN (R0'-PASS):** Total $C_{\text{rep}} < 5 \text{ min}$, zero Type A/B/C leaks. Package ready for external R1 campaign.
- [ ] **LEAKS DETECTED:** Type A/B/C leaks identified. Proceed to publish `replication-package-v1.1` before R1.
