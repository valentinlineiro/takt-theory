# Blind Review Package — Version Pin

**Fecha de preparación:** 2026-07-28  
**Estado:** 🔒 FROZEN — no modificar mientras el feedback esté en curso

---

## Identificador de versión

| Campo | Valor |
| :--- | :--- |
| Tag editorial | `paper-v0.1-submission-candidate` |
| Commit base | `b60aa9a` |
| Commit paquete | `986aae2` |
| Fecha build | 2026-07-28 |
| Páginas | 7 |

## Integridad del PDF

| Archivo | SHA-256 |
| :--- | :--- |
| `blind-review/paper.pdf` | `f86c1d7c07bc8c4ec3dd4ea658c8d169c85cb7da2c7b5284629aecf9b50b3d21` |

## Auditoría de metadatos PDF

| Campo | Valor | Estado |
| :--- | :--- | :--- |
| `Author` | *(vacío)* | ✅ Anónimo |
| `Title` | *(vacío)* | ✅ Anónimo |
| `Subject` | *(vacío)* | ✅ Limpio |
| `Keywords` | *(vacío)* | ✅ Limpio |
| `Creator` | `LaTeX with hyperref` | ✅ Genérico |
| `Producer` | `pdfTeX-1.40.25` | ✅ Genérico |
| Rutas locales | No detectadas | ✅ Limpio |
| Repositorio embebido | No | ✅ Limpio |

---

## Política de congelación

El manuscrito `paper/main.tex` y todos sus archivos de sección **no deben modificarse** mientras el feedback de lectura ciega esté en curso.

**Evitar durante la espera:**
- Reescribir secciones por intuición
- Añadir referencias bibliográficas
- Modificar el framing o abstract
- Ampliar la sección de ST-017

**Permitido durante la espera:**
- Preparar infraestructura para arXiv (plantilla, metadatos)
- Formalizar ST-017 en rama separada
- Actualizar documentación no científica

---

## Descongelación

El manuscrito puede modificarse únicamente tras:

1. Recibir ≥ 2 respuestas de lectura ciega
2. Clasificar todo el feedback en `BLIND_READ_RESULTS.md`
3. Identificar explícitamente los items *Editorial* / *Formal definition* que justifican cambios

**Tag de salida:** `paper-v0.2-post-review`
