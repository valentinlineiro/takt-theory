import TaktFormal.Representation.Order

/-- Estructura abstracta para los posets de costes. -/
class CostPartialOrder (α : Type) extends LE α, LT α where
  le_refl : ∀ a : α, a ≤ a
  le_trans : ∀ a b c : α, a ≤ b → b ≤ c → a ≤ c
  le_antisymm : ∀ a b : α, a ≤ b → b ≤ a → a = b
  lt_iff_le_not_le : ∀ a b : α, a < b ↔ a ≤ b ∧ ¬ b ≤ a

instance : CostPartialOrder Nat where
  le_refl := Nat.le_refl
  le_trans := fun _ _ _ => Nat.le_trans
  le_antisymm := fun _ _ => Nat.le_antisymm
  lt_iff_le_not_le := fun _ _ => by omega

