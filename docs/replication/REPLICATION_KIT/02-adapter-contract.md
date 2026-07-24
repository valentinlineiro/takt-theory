# 02-adapter-contract.md: Contrato del Adaptador TAKT

Para que cualquier dominio (ej. AST de código, planificador de tareas, simulación robótica, agente LLM) sea evaluable bajo TAKT, el replicador debe implementar una interfaz conocida como **Adaptador TAKT**.

---

## 1. Responsabilidades del Adaptador

Un Adaptador TAKT es una función o ejecutable que mapea estados del dominio a **observaciones discretas estructuradas**.

Debe cumplir 3 responsabilidades:
1. **Extraer el estado del dominio:** Mapear la configuración actual del sistema a una representación discreta o jerárquica.
2. **Definir niveles de granularidad ($g_1, g_2, \dots$):** Permitir la observación del estado bajo al menos dos niveles de abstracción (un nivel fino y un nivel grueso).
3. **Emitir Traza de Ejecución:** Formatear las transiciones de estado en objetos JSON conformes al esquema oficial.

---

## 2. Estructura JSON de la Traza de Observación

Cada paso de ejecución emitido por el adaptador debe ser una línea JSON (JSONL) o una lista de objetos JSON con el siguiente esquema:

```json
{
  "step_id": 42,
  "timestamp": 1700000000.123,
  "domain_name": "mi-nuevo-dominio",
  "granularity_level": "g1_fine",
  "state_hash": "a1b2c3d4e5f6...",
  "observed_state": {
    "node_id": "state_A",
    "metrics": {
      "cost": 12.5,
      "progress": 0.85
    },
    "metadata": {}
  },
  "action_taken": "TRANSITION_ALPHA",
  "parent_state_hash": "f6e5d4c3b2a1..."
}
```

---

## 3. Interfaz del Adaptador (Firma Mínima en Python)

Si implementas tu adaptador en Python, debe heredar de la clase base `TaktAdapter`:

```python
from abc import ABC, abstractmethod
from typing import Dict, Any, List

class TaktAdapter(ABC):

    @abstractmethod
    def get_domain_name(self) -> str:
        """Devuelve el identificador único del dominio."""
        pass

    @abstractmethod
    def get_granularity_levels(self) -> List[str]:
        """Devuelve los niveles de granularidad soportados (ej: ['coarse', 'fine'])."""
        pass

    @abstractmethod
    def reset(self, seed: int = 42) -> Dict[str, Any]:
        """Reinicia el entorno a un estado inicial determinista."""
        pass

    @abstractmethod
    def step(self, action: Any, granularity: str = "fine") -> Dict[str, Any]:
        """
        Ejecuta un paso en el dominio y devuelve la observación estandarizada.
        Devuelve dict conforme a observation_trace.json schema.
        """
        pass
```

---

## 4. Invariantes del Contrato

* **Determinismo de Reset:** Dados el mismo `seed` y la misma secuencia de acciones, el adaptador DEBE producir secuencias de hashes de estado idénticas.
* **Aislabilidad de Granularidad:** Cambiar el nivel de observación en `step()` NO DEBE alterar la dinámica interna subyacente del sistema.
