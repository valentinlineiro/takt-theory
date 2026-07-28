# ST-016 — Blind Read Package Guide

**Version:** `paper-v0.1-submission-candidate` (Commit `b60aa9a`)  
**Date:** 2026-07-28

---

## What to Send

Send **only** the PDF file:

```
paper/main.pdf
```

No README. No repository link. No context about TAKT or its history.

---

## Three Questions for the Reader

Send these verbatim alongside the PDF:

---

> After reading this paper, please answer these three questions briefly. There are no correct answers — what matters is your honest first impression.
>
> 1. **What would you say is the main contribution of this paper?**
>
> 2. **Which claims do you believe are formally proved, and which are empirically validated? Are there any that seem unsupported?**
>
> 3. **Which part of the scope or limitations is least clear to you?**

---

## Feedback Classification

When feedback arrives, classify each comment into exactly one category before acting on it:

| Category | Examples |
| :--- | :--- |
| **Editorial clarity** | "Section 2 is hard to follow", "the abstract is too dense" |
| **Formal definition** | "K_D is not defined before Section 3", "pi_M and pi* are confused in Example 1" |
| **Evidence gap** | "You claim X but I only see experimental support for Y" |
| **Scope overreach** | "This seems to claim universality but only validates one architecture" |
| **ST-017 suggestion** | "What about transport across runtimes?", "Can this generalize to continuous domains?" |

**Rule:** Only Editorial and Formal Definition feedback triggers manuscript changes before submission. Evidence gaps and Scope overreach trigger Non-Claims verification. ST-017 suggestions are logged for the future work section.

---

## Feedback Log Template

```
Reader: [anonymous / initials]
Date:   [YYYY-MM-DD]

Q1 (Contribution):
  ...

Q2 (Proved vs. Validated):
  ...

Q3 (Scope Clarity):
  ...

Classification:
  - [category]: [verbatim comment]
  - [category]: [verbatim comment]

Action:
  - [ ] None needed
  - [ ] Editorial fix: [description]
  - [ ] Non-Claims check: [description]
  - [ ] Log for ST-017: [description]
```

---

## When Hito 2 is Complete

Hito 2 closes when:

- [ ] Minimum 2 readers have responded (target: 5)
- [ ] All feedback classified
- [ ] All "Editorial" and "Formal Definition" items resolved or explicitly rejected with reasoning
- [ ] Tag `paper-v0.2-post-review` created

**Next step after Hito 2:** arXiv submission (`cs.LO` primary, `cs.SE` secondary).
