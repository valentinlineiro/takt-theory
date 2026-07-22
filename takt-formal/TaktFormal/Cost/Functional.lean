import TaktFormal.Representation.Preorder

/-- Abstract cost space equipped with a preorder. -/
structure CostSpace where
  Carrier : Type
  le : Carrier → Carrier → Prop
  le_refl : ∀ c, le c c
  le_trans : ∀ {a b c}, le a b → le b c → le a c

/-- Abstract cost functional mapping a representation space to a cost space. -/
structure CostFunctional (R : RepresentationSpace) (L : CostSpace) where
  eval : R.Rep → L.Carrier

namespace CostFunctional

variable {R : RepresentationSpace} {L : CostSpace}

/-- Define monotonicity (C0) on the abstract cost functional.
    Under our preorder convention, coarser representations have lower or equal cost.
    So if `a ⊑ b` (a is coarser than b), then `eval a ≤ eval b`.
-/
def isMonotone (cf : CostFunctional R L) : Prop :=
  ∀ {a b : R.Rep}, R.le a b → L.le (cf.eval a) (cf.eval b)

/-- Define strict monotonicity (C0') on the abstract cost functional.
    Strict refinement `a ⊏ b` implies strictly lower cost.
    Strict inequality on L is defined as `L.le x y ∧ ¬ L.le y x`.
-/
def isStrictlyMonotone (cf : CostFunctional R L) : Prop :=
  ∀ {a b : R.Rep}, (R.le a b ∧ ¬ R.le b a) → (L.le (cf.eval a) (cf.eval b) ∧ ¬ L.le (cf.eval b) (cf.eval a))

/-- Define cost functional invariance under kernel equivalence.
    If `a sim b`, then `cf.eval a sim cf.eval b` in the cost space.
-/
def isInvariant (cf : CostFunctional R L) : Prop :=
  ∀ {a b : R.Rep}, KernelEquiv R a b → (L.le (cf.eval a) (cf.eval b) ∧ L.le (cf.eval b) (cf.eval a))

/-- Prove that monotonicity implies invariance. -/
theorem monotone_implies_invariant (cf : CostFunctional R L) (h : isMonotone cf) :
    isInvariant cf := by
  intro a b h_equiv
  exact ⟨h h_equiv.1, h h_equiv.2⟩

end CostFunctional
