# Plan de Validación (30 días)

**Objetivo:** Poner el núcleo axiomático bajo presión — no escribir más teoría.

---

## Día 1–7: Documento canónico del núcleo (v1.0)

Congelar una versión 1.0 que contenga únicamente:
- Definiciones
- Axiomas
- Teoremas
- Demostraciones
- Hipótesis explícitas

Sin HAA-001, TAKT, agentes ni ejemplos salvo un apéndice separado.
Este documento es la referencia para todo lo demás.

## Día 8–14: Validación interna en G2

No preguntar "¿podemos resolver G2?" sino "¿podemos describir G2 usando el mismo procedimiento?":

```
fallo de preservación → identificar fibras → refinamiento → verificación
```

Sin añadir un solo concepto al núcleo. Si funciona, ya no hay una única instancia.

## Día 15–21: Primera validación externa

Buscar un problema completamente ajeno a TAKT (ej: análisis estático, compiladores, compresión, representación latente, control, sistemas distribuidos). El objetivo no es resolverlo mejor que el estado del arte — es comprobar si la teoría lo describe.

## Día 22–28: Intentar romper la teoría

Construir contraejemplos deliberados:
- Estructuras que no admiten pullback útil
- Propiedades no representables como estructura
- Refinamientos imposibles
- Situaciones donde las fibras no bastan

Cada contraejemplo tiene dos resultados posibles: rompe la teoría o fortalece su delimitación. Ambos son útiles.

## Día 29–30: Medir Evidence Index

Tras G2, validación externa y contraejemplos:

$$
\text{EI} = \frac{\text{Explicados sin ampliar núcleo}}{\text{Total estudiados}}
$$

Si el núcleo sigue intacto y EI se mantiene alto, la base para afirmar un patrón general es mucho más sólida.

---

## Reglas para el Evidence Index

1. Cada dominio debe ser independiente de los anteriores (no variantes del mismo problema).
2. Un dominio solo cuenta como "explicado" si no requiere modificar el núcleo axiomático.
3. EI es un indicador interno de investigación, no evidencia estadística.

---

## Lo que no hacer todavía

- No escribir artículos. Falta responder: ¿HAA-001 es un buen ejemplo o el primero de muchos?
- No posicionar académicamente sin antes tener 2–3 validaciones independientes.
- No añadir conceptos al núcleo.

---

## Criterio de éxito del ciclo

El núcleo sigue intacto tras G2 + una validación externa + al menos un contraejemplo que delimite su alcance. En ese punto, la transición de "teoría de TAKT" a "teoría general cuya primera aplicación fue TAKT" está justificada.
