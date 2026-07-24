# 04-validating-results.md: Validación de Resultados y Generación de Métricas

Una vez generadas las trazas en `output/traces/`, se debe ejecutar el motor de cálculo numérico para procesar las métricas observacionales.

---

## 1. Comando de Cálculo

```bash
python3 docs/replication/REPLICATION_KIT/self-check/verify_adapter.py --validate-results --trace-dir output/traces/
```

---

## 2. Métricas Calculadas Automáticamente

El script procesará las trazas y emitirá un archivo `output/summary_metrics.json` con los siguientes indicadores:

1. **Entropía de Enriquecimiento ($H_{enrichment}$):** Mide la ganancia de información entre el nivel de observación grueso y fino.
2. **Preservación Estructural (SPT Match Index):** Ratio de preservación de relaciones morfismos entre abstracciones ($[0.0, 1.0]$).
3. **Cota Observada de Convergencia ($\varepsilon_{obs}$):** Distancia residual observada al atractor del dominio.
4. **Regret acumulado de granularidad ($R_2$):** Diferencia acumulada en decisiones tomadas bajo abstracción versus grano fino.

---

## 3. Formato del Resumen de Salida (`summary_metrics.json`)

```json
{
  "replication_id": "AUTO-R2-LOCAL",
  "domain": "mi-nuevo-dominio",
  "traces_analyzed": 10,
  "metrics": {
    "enrichment_entropy": 1.42,
    "spt_preservation_index": 0.98,
    "epsilon_observed": 0.015,
    "r2_cumulative_regret": 0.12
  },
  "self_check_passed": true
}
```

---

## 4. Rellenado del Informe Final

Con el resumen `summary_metrics.json` generado, el replicador debe abrir `REPLICATION_REPORT_TEMPLATE.md`, completar todas las secciones y enviar el informe junto con los artefactos.
