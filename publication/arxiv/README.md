# arXiv Submission Package

**Status:** ✅ READY — refreshed to `paper-v0.4-arxiv-ready` (R1+R2+R3 + bibliography audit)

---

## Contents

| File | Description | Status |
| :--- | :--- | :--- |
| `main.pdf` | Compiled manuscript (11 pages) | ✅ Ready |
| `source.tar.gz` | LaTeX source bundle, no build artifacts (131KB) | ✅ Ready |
| `abstract.txt` | arXiv abstract field, verbatim from `paper/main.tex` | ✅ Ready |
| `categories.txt` | Primary + secondary classification | ✅ Ready |
| `comments.txt` | Zenodo DOI + replication pointer | ✅ Ready |

SHA-256 of `main.pdf` (content-identical to `paper/main.pdf` at commit
`db9fe7f`, tag `paper-v0.4-arxiv-ready`):
`6bc61b7047b551852953c8d22b6bcaa11064a8f3eab91cfe5c8fcf2c2967038e`

---

## Submission Checklist

- [x] Update `main.pdf` and `source.tar.gz` to `paper-v0.4-arxiv-ready`
- [x] Verify SHA256 of `main.pdf` matches the tagged `paper/main.pdf`
- [x] Verify `abstract.txt` matches `paper/main.tex` abstract verbatim
- [x] Verify `source.tar.gz` excludes `.aux`/`.log`/`.blg`/`.out` and compiles standalone (0 errors, 0 warnings, 11 pages)
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
