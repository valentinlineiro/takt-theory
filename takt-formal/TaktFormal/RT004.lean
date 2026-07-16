import TaktFormal.DynamicSafetyContract

open DynamicSafetyContract
open DecisionMargin
open Coverage

namespace RT004

inductive SAudit : Type where
  | s0 : SAudit
  | s1 : SAudit
  | s2 : SAudit
  | s3 : SAudit
  deriving DecidableEq

inductive SReal : Type where
  | r0 : SReal
  | r1 : SReal
  | r2 : SReal
  | r3 : SReal
  | r_evade : SReal
  deriving DecidableEq

def inject : SAudit → SReal
  | SAudit.s0 => SReal.r0
  | SAudit.s1 => SReal.r1
  | SAudit.s2 => SReal.r2
  | SAudit.s3 => SReal.r3

def D_real : SReal → Nat
  | SReal.r0 => 0
  | SReal.r1 => 1
  | SReal.r2 => 0
  | SReal.r3 => 1
  | SReal.r_evade => 1 -- Evasion: even representation, but odd/1 decision

def R_real : SReal → Int
  | SReal.r0 => 0
  | SReal.r1 => 1
  | SReal.r2 => 0
  | SReal.r3 => 1
  | SReal.r_evade => 0 -- Even representation

def D_audit (x : SAudit) : Nat := D_real (inject x)
def R_audit (x : SAudit) : Int := R_real (inject x)

def T_audit : SAudit → Prop
  | _ => True

def dist_audit (x y : SAudit) : Nat := if x = y then 0 else 5

def all_S_audit : List SAudit := [SAudit.s0, SAudit.s1, SAudit.s2, SAudit.s3]

def π : Int → Nat
  | 0 => 0
  | 1 => 1
  | _ => 0

def c_audit : SafetyContract SAudit Int Nat := {
  R := R_audit
  D := D_audit
  π := π
  T := T_audit
  all_S := all_S_audit
  dist := dist_audit
  m_min := 2
}

theorem rt004_success :
  contract_satisfied c_audit ∧ (π (R_real SReal.r_evade) ≠ D_real SReal.r_evade) := by
  refine ⟨?_, ?_⟩
  · dsimp [contract_satisfied, c_audit, T_audit, safe_on_T, fiber_coverage, decisionMargin, has_unsafe_pair]
    refine ⟨?_, ⟨?_, ⟨?_, ⟨?_, ?_⟩⟩⟩⟩
    · intro x y hx hy hk
      unfold kernel at hk
      cases x <;> cases y <;> first | rfl | contradiction
    · intro x
      cases x
      · exact ⟨SAudit.s0, True.intro, rfl, rfl⟩
      · exact ⟨SAudit.s1, True.intro, rfl, rfl⟩
      · exact ⟨SAudit.s2, True.intro, rfl, rfl⟩
      · exact ⟨SAudit.s3, True.intro, rfl, rfl⟩
    · decide
    · decide
    · intro x hx
      cases x <;> first | rfl | contradiction
  · intro h_eq
    -- π (R_real r_evade) = π 0 = 0
    -- D_real r_evade = 1
    -- h_eq says 0 = 1, contradiction
    contradiction

end RT004
