# arXiv Submission Package

**Status:** 🔒 PREPARED — Do NOT submit until `paper-v0.2-post-review` is tagged

---

## Contents

| File | Description | Status |
| :--- | :--- | :--- |
| `main.pdf` | Compiled manuscript (7 pages) | ✅ Ready |
| `source.tar.gz` | LaTeX source bundle (140KB) | ✅ Ready |
| `abstract.txt` | arXiv abstract field | ✅ Ready |
| `categories.txt` | Primary + secondary classification | ✅ Ready |
| `comments.txt` | Zenodo DOI + replication pointer | ✅ Ready |

---

## Submission Checklist (execute after Hito 2)

- [ ] Update `main.pdf` and `source.tar.gz` to post-review version
- [ ] Verify SHA256 of `main.pdf` matches `paper-v0.2-post-review` tag
- [ ] Create arXiv account / log in at https://arxiv.org/submit
- [ ] Select: **cs.LO** (primary), **cs.SE**, **cs.PL** (secondary)
- [ ] Paste `abstract.txt` into the abstract field
- [ ] Upload `source.tar.gz` as the source submission
- [ ] Paste `comments.txt` into the comments field
- [ ] Add co-authors if applicable
- [ ] Set license (recommended: CC BY 4.0)
- [ ] Preview compiled PDF — verify figures and bibliography render correctly
- [ ] Submit and record arXiv ID

---

## Post-Submission

After arXiv ID is assigned:

1. Update `publication/PUBLICATION_STATUS.md` with arXiv ID and URL
2. Update repository `README.md` with preprint badge/link
3. Update Zenodo record metadata if DOI is already issued
4. Proceed to venue submission (CAV / FM / TACAS)

---

## Classification Rationale

| Category | Code | Rationale |
| :--- | :--- | :--- |
| Logic in Computer Science | `cs.LO` | Lean 4 proofs, necessity theorems, formal runtime model |
| Software Engineering | `cs.SE` | Runtime governance, ablation methodology, replication |
| Programming Languages | `cs.PL` | Type-theoretic foundations, abstract interpretation links |
