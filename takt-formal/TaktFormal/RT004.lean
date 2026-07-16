namespace RT004

-- Mathematical representation of the game space
-- S is infinite (Nat), representation Z is finite (Bool)
abbrev S : Type := Nat
abbrev Z : Type := Bool
abbrev A : Type := Bool

def R (x : S) : Z := (x % 2 == 0)

-- Ideal decisions: state x is odd/even but with an exception state
def D : S → A
  | 0 => false
  | 1 => true
  | 2 => false
  | 3 => true
  | 4 => true  -- Exception state! Even but decision is true
  | _ => true

-- The adversary plays on exception states that satisfy the general even/odd representation
-- but deviate from standard decision classes, bypassing contract.
theorem exists_evasion_state : ∃ (x : S), R x = R 0 ∧ D x ≠ D 0 :=
  ⟨4, rfl, by decide⟩

end RT004
