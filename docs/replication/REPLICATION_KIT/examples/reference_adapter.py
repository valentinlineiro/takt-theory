import time
import hashlib
from typing import Dict, Any, List

class ReferenceDomainAdapter:
    """
    Ejemplo de Referencia de Adaptador TAKT.
    Mapea un entorno discreto sintético a trazas de observación estandarizadas.
    """

    def __init__(self):
        self.domain_name = "reference-synthetic-domain"
        self.state_id = 0
        self.seed = 42

    def get_domain_name(self) -> str:
        return self.domain_name

    def get_granularity_levels(self) -> List[str]:
        return ["coarse", "fine"]

    def reset(self, seed: int = 42) -> Dict[str, Any]:
        self.seed = seed
        self.state_id = 0
        return {"state_id": self.state_id}

    def step(self, action: str = "DEFAULT", granularity: str = "fine") -> Dict[str, Any]:
        self.state_id += 1
        state_str = f"{self.domain_name}:{self.seed}:{self.state_id}:{granularity}"
        state_hash = hashlib.sha256(state_str.encode("utf-8")).hexdigest()

        return {
            "step_id": self.state_id,
            "timestamp": time.time(),
            "domain_name": self.domain_name,
            "granularity_level": granularity,
            "state_hash": state_hash,
            "observed_state": {
                "state_id": self.state_id,
                "granularity": granularity,
                "metrics": {"progress": min(1.0, self.state_id / 100.0)}
            },
            "action_taken": action,
            "parent_state_hash": None
        }
