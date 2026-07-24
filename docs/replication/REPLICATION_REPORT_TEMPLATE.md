# Plantilla de Informe de Replicación Independiente de TAKT

**ID de Replicación:** R-XXX  
**Fecha:** YYYY-MM-DD  
**Replicador(es):** [Nombre / Pseudónimo / Anónimo]  
**Institución / Afiliación (Opcional):** [Organización / Independiente]  
**Nivel de Independencia:** [ Nivel 0 | Nivel 1 | Nivel 2 | Nivel 3 | Nivel 4 ]  
**Modalidad de Replicación:** [ Abierta | Ciega (Blind) ]  

---

## 1. Dominio Seleccionado y Motivación

* **Dominio:** [Describir el dominio elegido: ej. Optimización de AST en compilador, agente RL en Minecraft, sistema de trading, etc.]
* **Motivación:** [¿Por qué este dominio representa un test de estrés adecuado para TAKT?]
* **Niveles de Granularidad Implementados:**
  * **Fino ($g_{fine}$):** [Descripción]
  * **Grueso ($g_{coarse}$):** [Descripción]

---

## 2. Detalle de Implementación y Métricas de Fricción del Protocolo

### 2.1. Indicadores Cuantitativos de Fricción
* **Tiempo hasta el primer experimento válido ($T_{first\_exp}$):** [X.X horas]
* **Número de consultas/aclaraciones al autor ($N_{consults}$):** [N consultas] *(Debe ser 0 para Nivel >= 3)*
* **Número de supuestos no escritos que tuviste que tomar ($N_{assumptions}$):** [N supuestos]
* **Número de errores detectados autónomamente por `self-check` ($N_{self\_check\_err}$):** [N errores]
* **Líneas de código (LOC) del adaptador:** [N LOC]

### 2.2. Diagnóstico del Protocolo (El Protocolo como Sistema Observable)
1. **¿En qué punto te bloqueaste durante el proceso?**
   > [Respuesta detallada]
2. **¿Qué interpretaste de forma distinta a la intención original del documento?**
   > [Respuesta detallada]
3. **¿Qué parte del protocolo te obligó a hacer una suposición no documentada?**
   > [Respuesta detallada]
4. **¿Cuántas veces tuviste que volver a consultar la documentación para resolver una duda?**
   > [Respuesta detallada]
5. **¿Qué información asumiste que existía pero no encontraste en el kit?**
   > [Respuesta detallada]


---

## 3. Resultados del Auto-Chequeo (`self-check`)

```text
[ Pegar aquí el output resumido de verify_adapter.py ]
```

---

## 4. Resultados Cuantitativos y Métricas

| Métrica | Valor Observado | Margen / Desviación | Cumple Cota Teórica |
| :--- | :--- | :--- | :--- |
| **Entropía $H_{enrichment}$** | [X.XX] | $\pm$ [Y.YY] | [ SÍ / NO ] |
| **SPT Match Index** | [X.XX] | $\pm$ [Y.YY] | [ SÍ / NO ] |
| **Cota Residual $\varepsilon_{obs}$** | [X.XX] | $\pm$ [Y.YY] | [ SÍ / NO ] |
| **Regret $R_2$ Acumulado** | [X.XX] | $\pm$ [Y.YY] | [ SÍ / NO ] |

---

## 5. Dificultades, Puntos de Fricción y Conocimiento Tácito Hallado

Describir detalladamente cualquier momento en que la documentación del `REPLICATION_KIT` fue ambigua o requirió suposiciones:

1. **Fricción 1:** [Descripción del problema y cómo se resolvió localmente]
2. **Fricción 2:** [Descripción]

---

## 6. Amenazas a la Validez y Desviaciones del Protocolo

* **Amenazas a la validez interna:** [Ej. falta de determinismo en el simulador, redondeos de punto flotante]
* **Amenazas a la validez externa:** [Ej. representatividad del dominio elegido]
* **Desviaciones voluntarias:** [Cualquier cambio realizado con respecto al kit predeterminado]

---

## 7. Conclusión del Replicador

* [ ] **Replicación Exitosa:** Se implementó el adaptador autónomamente y los resultados confirman/acotan la suficiencia estructural.
* [ ] **Replicación Inconclusa:** Ambiguëdades en la especificación impidieron completar el experimento.
* [ ] **Replicación Falsadora:** El adaptador funcionó correctamente pero los resultados contradicen las cotas de la teoría.
