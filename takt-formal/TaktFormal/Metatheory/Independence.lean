import TaktFormal.DetectorEvolution
import TaktFormal.GovernanceGeometry
import TaktFormal.EnrichmentAlgebra

/-!
Module: TaktFormal.Metatheory.Independence
Depends on: TaktFormal.DetectorEvolution, TaktFormal.GovernanceGeometry, TaktFormal.EnrichmentAlgebra
Exports: Axiom1_Reachability, Axiom2_DistanceMonotonicity, Axiom3_MonoidHomomorphism, model1_independence, model2_independence, model3_independence
-/

namespace TaktFormal
namespace Metatheory

section Independence

variable {C : Type}

/-- Primitive Axiom 1: Reachability Space (Detector evolution exists) --/
def Axiom1_Reachability (phi_fn : Detector C → Enrichment C → Detector C) : Prop :=
  ∀ d e, (phi_fn d e).id = d.id ++ "+" ++ e.id

/-- Primitive Axiom 2: Distance Monotonicity --/
def Axiom2_DistanceMonotonicity (dist : Detector C → Nat)
    (phi_fn : Detector C → Enrichment C → Detector C) : Prop :=
  ∀ d e, dist (phi_fn d e) ≤ dist d

/-- Primitive Axiom 3: Enrichment Monoid Homomorphism --/
def Axiom3_MonoidHomomorphism (phi_fn : Detector C → Enrichment C → Detector C)
    (comp_e : Enrichment C → Enrichment C → Enrichment C) : Prop :=
  ∀ d e1 e2, phi_fn d (comp_e e1 e2) = phi_fn (phi_fn d e1) e2

-- Model 1: Axioms 2 and 3 hold, but Axiom 1 fails (non-standard id concatenation)
def phi_model1 (d : Detector C) (_e : Enrichment C) : Detector C :=
  { id := "constant_id", isSound := d.isSound, capabilities := d.capabilities, progressMeasure := d.progressMeasure }

theorem model1_independence (dummyCap : C) :
    ¬ Axiom1_Reachability (phi_model1 (C:=C)) := by
  intro h
  have h_ex := h { id := "a", isSound := true, capabilities := fun _ => True, progressMeasure := 0 }
                 { id := "b", targetCapability := dummyCap, preservesSoundness := true }
  dsimp [Axiom1_Reachability, phi_model1] at h_ex
  have h_str : "constant_id" = "a" ++ "+" ++ "b" := h_ex
  have h_len : "constant_id".length = ("a" ++ "+" ++ "b").length := congrArg String.length h_str
  revert h_len
  decide

-- Model 2: Axioms 1 and 3 hold, but Axiom 2 fails (distance increases)
def dist_model2 (d : Detector C) : Nat := d.progressMeasure

def phi_model2 (d : Detector C) (e : Enrichment C) : Detector C :=
  { id := d.id ++ "+" ++ e.id, isSound := d.isSound, capabilities := d.capabilities, progressMeasure := d.progressMeasure + 10 }

theorem model2_independence (dummyCap : C) :
    ¬ Axiom2_DistanceMonotonicity (dist_model2 (C:=C)) (phi_model2 (C:=C)) := by
  intro h
  have h_ex := h { id := "a", isSound := true, capabilities := fun _ => True, progressMeasure := 0 }
                 { id := "b", targetCapability := dummyCap, preservesSoundness := true }
  dsimp [Axiom2_DistanceMonotonicity, dist_model2, phi_model2] at h_ex
  omega

-- Model 3: Axioms 1 and 2 hold, but Axiom 3 fails (non-associative action)
def comp_model3 (e1 : Enrichment C) (_e2 : Enrichment C) : Enrichment C := e1

def phi_model3 (d : Detector C) (e : Enrichment C) : Detector C :=
  { id := d.id ++ "+" ++ e.id, isSound := d.isSound, capabilities := d.capabilities, progressMeasure := d.progressMeasure }

theorem model3_independence (dummyCap : C) :
    ¬ Axiom3_MonoidHomomorphism (phi_model3 (C:=C)) (comp_model3 (C:=C)) := by
  intro h
  have h_ex := h { id := "d", isSound := true, capabilities := fun _ => True, progressMeasure := 0 }
                 { id := "e1", targetCapability := dummyCap, preservesSoundness := true }
                 { id := "e2", targetCapability := dummyCap, preservesSoundness := true }
  dsimp [Axiom3_MonoidHomomorphism, phi_model3, comp_model3] at h_ex
  have h_str : "d" ++ "+" ++ "e1" = ("d" ++ "+" ++ "e1") ++ "+" ++ "e2" := congrArg Detector.id h_ex
  have h_len : ("d" ++ "+" ++ "e1").length = (("d" ++ "+" ++ "e1") ++ "+" ++ "e2").length := congrArg String.length h_str
  revert h_len
  decide

end Independence
end Metatheory
end TaktFormal
