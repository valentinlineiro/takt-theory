# TAKT Replication Kit (v1.2 / R2)

Bienvenido al **Kit de Replicación Operativa de TAKT**. Este directorio contiene únicamente instrucciones ejecutables, esquemas de datos y herramientas de verificación. **No contiene discusiones teóricas**.

## Estructura del Kit

1. [01-environment.md](docs/replication/REPLICATION_KIT/01-environment.md) — Requisitos del sistema y configuración del entorno.
2. [02-adapter-contract.md](docs/replication/REPLICATION_KIT/02-adapter-contract.md) — Especificación técnica del contrato de adaptador TAKT.
3. [03-running-experiments.md](docs/replication/REPLICATION_KIT/03-running-experiments.md) — Protocolo de ejecución y recolección de trazas.
4. [04-validating-results.md](docs/replication/REPLICATION_KIT/04-validating-results.md) — Validación de resultados y generación del informe.

## Herramientas de Verificación
* `schemas/observation_trace.json` — Esquema JSON formal para validar trazas emitidas.
* `self-check/verify_adapter.py` — Script de auto-evaluación para probar tu adaptador antes de iniciar experimentos reales.

## Flujo de Trabajo Rápido

```bash
# 1. Verificar entorno
python3 REPLICATION_KIT/self-check/verify_adapter.py --check-env

# 2. Validar tu adaptador con el test suite automático
python3 REPLICATION_KIT/self-check/verify_adapter.py --adapter path/to/your_adapter.py

# 3. Ejecutar suite de observación
python3 REPLICATION_KIT/self-check/verify_adapter.py --run-experiment path/to/your_adapter.py
```
