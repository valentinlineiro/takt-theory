# 01-environment.md: Configuración del Entorno de Replicación

## 1. Requisitos del Sistema

* **OS:** Linux (Ubuntu 20.04+, Debian 11+, Arch) / macOS 12+ / WSL2 en Windows.
* **Runtime Python:** Python 3.10+ (Recomendado 3.11 o 3.12).
* **Node.js (Opcional):** 18+ (Si se implementa el adaptador en TypeScript/JavaScript).
* **Rust (Opcional):** 1.70+ (Si se utiliza la librería de formalización en Rust).

## 2. Instalación de Dependencias Mínimas

El kit de replicación de TAKT utiliza únicamente librerías de estándar abierto y dependencias reducidas:

```bash
# Crear entorno virtual aislado
python3 -m venv .venv
source .venv/bin/activate

# Instalar dependencias base de validación y esquemas
pip install jsonschema numpy pydantic pytest
```

## 3. Verificación del Entorno

Ejecute la verificación básica de entorno:

```bash
python3 docs/replication/REPLICATION_KIT/self-check/verify_adapter.py --check-env
```

Salida esperada:
`[OK] Python Version >= 3.10`  
`[OK] jsonschema engine ready`  
`[OK] Environment ready for TAKT Replication Kit v1.2-R2`
