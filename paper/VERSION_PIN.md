# Paper v0.2-post-review — Version Pin

**Fecha de preparación:** 2026-07-28
**Estado:** 🔒 FROZEN — candidato a tag `paper-v0.2-post-review`

Sucesor de [`blind-review/VERSION_PIN.md`](../blind-review/VERSION_PIN.md)
(`paper-v0.1-submission-candidate`), tras incorporar las 3 lecturas ciegas
(R1, R2, R3) registradas en `publication/BLIND_READ_RESULTS.md`.

---

## Identificador de versión

| Campo | Valor |
| :--- | :--- |
| Tag editorial | `paper-v0.2.1-post-review` |
| Tag predecesor | `paper-v0.2-post-review` (`5a534e9` — solo R1, previo a R2/R3 y auditoría bibliográfica) |
| Commit predecesor | `4d23780` (R2 corrections, Hito 2) |
| Commit freeze | `c836f20` |
| Fecha build | 2026-07-28 |
| Páginas | 11 |

## Integridad del PDF

| Archivo | SHA-256 |
| :--- | :--- |
| `paper/main.pdf` | `6bc61b7047b551852953c8d22b6bcaa11064a8f3eab91cfe5c8fcf2c2967038e` |

Generado mediante clean-room build (`rm` de artefactos → `pdflatex` →
`bibtex` → `pdflatex` ×2), 0 errores, 0 warnings de LaTeX, 0 warnings de
BibTeX.

## Auditoría de metadatos PDF

| Campo | Valor | Estado |
| :--- | :--- | :--- |
| `Author` | *(vacío)* | ✅ |
| `Title` | *(vacío)* | ✅ |
| `Creator` | `LaTeX with hyperref` | ✅ Genérico |
| `Producer` | `pdfTeX-1.40.25` | ✅ Genérico |
| Rutas locales / usuario embebidos | No detectados | ✅ |
| Imágenes rasterizadas | 0 `/Image` XObjects | ✅ Solo vector |

## Auditoría de bibliografía

| Check | Resultado |
| :--- | :--- |
| Entradas `.bib` citadas | 7/7 |
| Citas resueltas en `.bib` | 7/7 |
| `cousot1977abstract` | Corregido `@article` → `@inproceedings` (venue POPL se perdía) |
| `takt_st016_2026` | Corregido `@software` → `@misc` + `note`/`howpublished` (DOI se perdía en render) |

## Cambios respecto a `paper-v0.1-submission-candidate`

Ver `publication/BLIND_READ_RESULTS.md` para el detalle de las 3 lecturas.
Resumen: notación $\pi^*_S$/$\rho(S)$ desambiguada, puente ST-015→ST-016
explícito, Axiom0 con glosa informal, `WitnessArtifact` concreto mostrado,
scope calibrado ("dentro del modelo formal ST-016") en cada claim de
necesidad, matriz de evidencia (formal / empírica / ingeniería) separada,
lenguaje del witness bridge corregido, y las dos correcciones bibliográficas
de esta auditoría.

## Política

No tocar `ST-017`, el runtime, ni los experimentos en este ciclo. El
siguiente paso tras este freeze es el envío a arXiv; feedback posterior
abre una nueva iteración, no modifica este pin retroactivamente.
