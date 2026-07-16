# TAKT Reference Implementation Guide

## Descripción

Para facilitar la adopción práctica y reproducibilidad de TAKT v3.0, se proporciona un script ejecutable en Python que simula de forma exacta el escenario de validación externa **ST-007 (Clasificador Edge-AI con deriva térmica)**.

El script se encuentra en:
* [takt_reference_implementation.py](file:///home/valentin/code/takt-theory/scratch/takt_reference_implementation.py)

---

## Cómo Ejecutar la Simulación

Puedes ejecutar la simulación directamente desde tu terminal de Linux:

```bash
chmod +x scratch/takt_reference_implementation.py
python3 scratch/takt_reference_implementation.py
```

---

## Salida de Consola Esperada

Al ejecutar el script, se obtiene la siguiente auditoría de seguridad:

```text
=== TAKT Dynamic Safety Contract Audit Simulation ===
State space S = [-20, -15, -10, -5, 0, 5, 10, 15]
Test set T = [-15, -5, 5, 15]
Contract minimum margin m_min = 5

--- Time t = 0: Nominal State (Drift theta = 0) ---
Empirical Safety on Test Set: True
Fiber Coverage on Test Set: True
Contract Status: ACTIVE (Margin = 5.0)
Policy execution: ENABLED

--- Time t = 1: Drifted State (Drift theta = 3) ---
Empirical Safety on Test Set: True  <-- SILENT FAILURE!
Fiber Coverage on Test Set: True
Contract Status: MARGIN_VIOLATED (Margin = 0 < 5)
Policy execution: DISABLED (Safety Shutdown)
====================================================
```

---

## Análisis de la Simulación

1. **Estado Nominal ($t=0$):**
   El contrato valida que la representación nominal es empíricamente segura, tiene cobertura total y su margen decisional $M(R_0) = 5$ cumple con el requisito mínimo. La ejecución de la política del agente está **habilitada**.
2. **Estado con Deriva ($t=1$):**
   La deriva desplaza las fronteras provocando una colisión oculta entre $s=0$ y $s=-5$.
   - **El Test Empírico falla silenciosamente** (`Empirical Safety = True`) porque ninguno de los puntos de test cae en la región colisionada.
   - **El Contrato Dinámico bloquea el fallo** (`Status = MARGIN_VIOLATED`) debido a que el sensor de margen decisional colapsa a $0$, inhabilitando la ejecución de la política y evitando una toma de acción potencialmente catastrófica en el hardware real.
