# 03-running-experiments.md: Protocolo de Ejecución de Experimentos

Este documento especifica la secuencia estricta para recolectar trazas de observación en un dominio nuevo.

---

## 1. Fase Previa: Ejecución de Auto-Chequeo

Antes de lanzar experimentos de recolección de trazas masivas, el replicador debe ejecutar la suite de verificación automática:

```bash
python3 docs/replication/REPLICATION_KIT/self-check/verify_adapter.py --adapter mi_adaptador.py
```

No continuar si el script reporta cualquier fallo de invariante o esquema.

---

## 2. Protocolo de Muestreo de Trazas

Para evitar el sesgo en la recolección de datos, se deben generar trazas bajo dos modos de exploración:

### Modo A: Muestreo Uniforme / Aleatorio (Baseline)
* **Objetivo:** Establecer la entropía base del espacio de estados.
* **Semillas:** Mínimo 5 semillas deterministas (`[42, 43, 44, 45, 46]`).
* **Pasos por traza:** Mínimo 100 pasos por semilla (o hasta estado terminal).

### Modo B: Muestreo Guiado por Heurística / Política del Dominio
* **Objetivo:** Observar la dinámica de convergencia cuando el sistema persigue un objetivo.
* **Semillas:** Mismas semillas que el Modo A (`[42, 43, 44, 45, 46]`).

---

## 3. Almacenamiento de Artefactos de Traza

Las trazas recolectadas deben guardarse en la siguiente estructura de directorios dentro de la réplica:

```
output/
    traces/
        seed_42_coarse.jsonl
        seed_42_fine.jsonl
        seed_43_coarse.jsonl
        seed_43_fine.jsonl
    metadata.json
```

El archivo `metadata.json` debe contener los hashes SHA-256 de todas las trazas generadas para garantizar inmutabilidad.
