import TaktFormal.Composition.Basic

/-!
Module: TaktFormal.Composition.Preservation
Depends on: TaktFormal.Composition.Basic
Exports: soundness_parallel_preservation, reachability_cascade_preservation
-/

namespace TaktFormal
namespace Composition

section Preservation

variable {C1 C2 : Type}

/-- Theorem V-B.2.1: Parallel Soundness Preservation --/
theorem soundness_parallel_preservation (d1 : Detector C1) (d2 : Detector C2)
    (h : SoundDetector d1 ∧ SoundDetector d2) :
    SoundDetector (ParallelDetector d1 d2) := by
  dsimp [SoundDetector, ParallelDetector] at *
  rw [h.1, h.2]
  rfl

/-- Theorem V-B.2.2: Cascade Reachability Preservation --/
theorem reachability_cascade_preservation (d1 : Detector C1) (d2 : Detector C2)
    (h : SoundDetector d1 ∧ SoundDetector d2) :
    SoundDetector (CascadeDetector d1 d2) := by
  dsimp [SoundDetector, CascadeDetector] at *
  rw [h.1, h.2]
  rfl

end Preservation

end Composition
end TaktFormal
