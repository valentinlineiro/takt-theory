import TaktFormal.DynamicSafetyContract

open DynamicSafetyContract
open Kernel
open DecisionMargin
open Coverage

namespace RT001

inductive SAudit : Type where
  | a1 : SAudit
  | a2 : SAudit
  | a3 : SAudit
  deriving DecidableEq

inductive SReal : Type where
  | r1 : SReal
  | r2 : SReal
  | r3 : SReal
  | r_ood : SReal
  deriving DecidableEq

def inject : SAudit → SReal
  | SAudit.a1 => SReal.r1
  | SAudit.a2 => SReal.r2
  | SAudit.a3 => SReal.r3

def D_real : SReal → Nat
  | SReal.r1 => 0
  | SReal.r2 => 0
  | SReal.r3 => 1
  | SReal.r_ood => 1

def R_real : SReal → Int
  | SReal.r1 => -1
  | SReal.r2 => -1
  | SReal.r3 => 0
  | SReal.r_ood => -1  -- Collision with r1 / r2 but decision is 1!

def D_audit (x : SAudit) : Nat := D_real (inject x)
def R_audit (x : SAudit) : Int := R_real (inject x)

def T_audit : SAudit → Prop
  | SAudit.a1 => False
  | SAudit.a2 => True
  | SAudit.a3 => True

def dist_audit (x y : SAudit) : Nat := if x = y then 0 else 1

def all_S_audit : List SAudit := [SAudit.a1, SAudit.a2, SAudit.a3]

def π : Int → Nat
  | -1 => 0
  | 0 => 1
  | _ => 0

def c_audit : SafetyContract SAudit Int Nat := {
  R := R_audit
  D := D_audit
  π := π
  T := T_audit
  all_S := all_S_audit
  dist := dist_audit
  m_min := 1
}

-- Target theorem proving RT-001: contract satisfied on audit but unsafe globally
theorem rt001_success : 
  contract_satisfied c_audit ∧ 
  ¬ (∀ (x y : SReal), R_real x = R_real y → D_real x = D_real y) := by
  refine ⟨?_, ?_⟩
  · dsimp [contract_satisfied, c_audit, T_audit, safe_on_T, fiber_coverage, decisionMargin, has_unsafe_pair]
    refine ⟨?_, ⟨?_, ⟨?_, ⟨?_, ?_⟩⟩⟩⟩
    · intro x y hx hy hk
      cases x <;> cases y <;> first | rfl | contradiction
    · intro x
      cases x
      · exact ⟨SAudit.a2, True.intro, rfl, rfl⟩
      · exact ⟨SAudit.a2, True.intro, rfl, rfl⟩
      · exact ⟨SAudit.a3, True.intro, rfl, rfl⟩
    · decide
    · decide
    · intro x hx
      cases x <;> first | rfl | contradiction
  · intro h_safe
    have h_col : R_real SReal.r1 = R_real SReal.r_ood := rfl
    have h_dec := h_safe SReal.r1 SReal.r_ood h_col
    contradiction

end RT001
