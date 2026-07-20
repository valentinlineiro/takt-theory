# Hoja de Ruta: Validación y Delimitación

**Estado de origen:** Núcleo teórico estabilizado, primera validación experimental (HAA-001) completa.  
**Criterio de progreso:** Dejar de añadir teoría, empezar a medir alcance.

---

## 0. Especificación del alcance

> La teoría pretende caracterizar cuándo una transformación preserva una propiedad estructural y cómo recuperar esa preservación mediante refinamientos. No pretende caracterizar toda transformación ni toda noción de información.

## 1. Consolidación matemática

Documento autosuficiente del núcleo (definiciones, axiomas, teoremas, pruebas) sin referencias a TAKT. Revisar demostraciones buscando hipótesis implícitas. Separar resultados generales de ejemplos.

## 2. Generalización interna

Aplicar el procedimiento completo a un segundo problema dentro de TAKT (preferiblemente G2). Verificar que el esquema "identificar fallo → localizar fibras → refinar → verificar" funciona sin cambios en la teoría.

## 3. Generalización externa

Buscar un problema no motivado por TAKT donde exista pérdida de información por una transformación. Intentar resolverlo usando exclusivamente el marco axiomático, sin introducir conceptos nuevos. Etapa de mayor retorno científico: demostrar que la teoría captura un patrón general, no solo su caso de origen.

## 4. Límites de la teoría

Construir contraejemplos deliberados. Preguntar:
- ¿Qué ocurre si A1 falla?
- ¿Qué ocurre si la relación de preservación no es un preorden?
- ¿Existen estructuras naturales que no satisfacen los axiomas?

## 5. Posicionamiento académico

Comparar formalmente con literatura existente:
- Categorías y pullbacks
- Fibrations
- Instituciones (Goguen & Burstall)
- Galois connections, abstracción y refinamiento
- Teoría de dominios

## 6. Publicación

Tres artículos potenciales:
- **A:** Teoría axiomática de preservación estructural
- **B:** Teorema de imposibilidad para estructuras sobre el codominio
- **C:** Aplicación a TAKT y validación experimental

---

## Dependencias entre etapas

| Etapa | Pregunta que responde | Evidencia que aporta |
|-------|----------------------|---------------------|
| 0. Alcance | ¿Qué cubre y qué no cubre la teoría? | Contrato de uso |
| 1. Consolidación | ¿La teoría es internamente consistente? | Consistencia formal |
| 2. Generalización interna | ¿Explica más de un fenómeno dentro de TAKT? | Poder unificador |
| 3. Generalización externa | ¿Depende de TAKT o describe un patrón general? | Generalidad |
| 4. Límites | ¿Dónde deja de ser válida? | Delimitación científica |
| 5. Posicionamiento | ¿Cómo se relaciona con el estado del arte? | Contexto académico |
| 6. Publicación | ¿Cómo comunicar la contribución? | Transferencia |

Cada etapa reduce el riesgo de la siguiente. No invertir en posicionamiento si antes la teoría no demuestra generalidad externa.

---

## Criterios

**Inclusión de nuevos conceptos.** Un nuevo concepto fundamental solo se acepta si responde afirmativamente a:

> ¿Este concepto permite demostrar un teorema nuevo o resolver un problema que el núcleo actual no puede expresar?

**Validación de nuevas aplicaciones.** Una aplicación solo cuenta como validación independiente si:

> No requiere modificar los axiomas ni introducir conceptos fundamentales nuevos.

Si una aplicación obliga a cambiar el núcleo, no valida la teoría existente — contribuye a construir otra más amplia.
