# ST-003: External Formalism (Digital Control) — Hypothesis

## Contexto y Motivación

Para comprobar la transferibilidad y aplicabilidad de TAKT en disciplinas ajenas (fuera de su dominio de diseño), seleccionamos un problema clásico de la ingeniería de control digital y procesamiento de señales: la **cuantificación de variables de estado** mediante convertidores analógico-digitales (ADC).

En un sistema de control digital (e.g., control proporcional bang-bang), el estado del error es una variable continua. El controlador toma una acción de control discreta basada en este estado. Debido a la cuantificación del ADC (pérdida de información), el controlador opera sobre una representación discreta (cuantificada). La desalineación de la frontera de cuantificación con la de decisión suele introducir ciclos límite o inestabilidades alrededor de cero.

## Hipótesis

1. **Predicción de Inestabilidades:** La condición de seguridad de TAKT ($\ker(R) \subseteq \ker(D)$) predice con exactitud qué esquemas de cuantificación son seguros (estables) y cuáles introducen inestabilidades (divergencia decisional) alrededor de la frontera de cruce por cero.
2. **Seguridad de la Cuantificación Truncada (Floor):** Dado que la frontera de truncamiento hacia abajo coincide con el cero, esta representación será declarada **segura** por TAKT.
3. **Inseguridad de la Cuantificación Redondeada (Round):** Debido a que la frontera de redondeo se desplaza (introduciendo un solapamiento de signos en la clase que redondea a cero), esta representación será declarada **insegura** por TAKT.

## Criterio de Parada de ST-003

Este stress-test se considerará terminado y exitoso cuando:
1. Se modele un controlador proporcional bang-bang con dos esquemas de cuantificación (truncamiento vs. redondeo) sobre una escala discreta fina de enteros (simulando coma fija).
2. Se pruebe formalmente en Lean 4 que el truncamiento cumple la condición de seguridad de TAKT mientras que el redondeo la viola.
3. Se clasifique el resultado final bajo una de las etiquetas del framework.
