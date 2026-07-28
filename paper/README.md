# TAKT ST-016 Paper — LaTeX Source Package

This directory contains the production LaTeX source for the TAKT ST-016 academic manuscript.

**Target Venue:** Formal Methods & Applied Verification (CAV / FM / TACAS)  
**Preprint:** arXiv (`cs.LO` / `cs.SE`)  
**Zenodo DOI:** [10.5281/zenodo.21638014](https://doi.org/10.5281/zenodo.21638014)  

---

## Structure

```
paper/
├── main.tex                # Root document (IEEEtran format)
├── bibliography.bib        # Audited canonical references
├── sections/
│   ├── 01-introduction.tex
│   ├── 02-related-work.tex
│   ├── 03-foundations.tex
│   ├── 04-formalization.tex
│   ├── 05-evaluation.tex
│   ├── 06-discussion.tex
│   └── 07-limitations.tex
└── figures/                # Vector figures (TikZ/PDF) — to be added
```

## Building

```bash
pdflatex main.tex
bibtex main
pdflatex main.tex
pdflatex main.tex
```

## Status

- [x] Skeleton structure complete
- [x] All sections drafted
- [x] Bibliography with canonical references
- [ ] Vector figures (TikZ architecture diagram)
- [ ] Mathematical notation consistency pass
- [ ] Final bibliography audit
