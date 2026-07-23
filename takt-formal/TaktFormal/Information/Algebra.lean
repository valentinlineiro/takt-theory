import TaktFormal.Information.Sufficiency

namespace Information

variable {X Y Z Z1 Z2 Z3 : Type}

/-- Information Equivalence (f1 ~_info f2): Transformations f1 and f2 carry
    equivalent informative content if f1 ≤_info f2 and f2 ≤_info f1. -/
def EquivInfo (f1 : X → Z1) (f2 : X → Z2) : Prop :=
  RefinesInfo f1 f2 ∧ RefinesInfo f2 f1

/-- Reflexivity of Information Equivalence: f ~_info f -/
theorem equiv_info_refl (f : X → Z) : EquivInfo f f :=
  ⟨refines_info_refl f, refines_info_refl f⟩

/-- Symmetry of Information Equivalence: f1 ~_info f2 ⇒ f2 ~_info f1 -/
theorem equiv_info_symm (f1 : X → Z1) (f2 : X → Z2) (h : EquivInfo f1 f2) : EquivInfo f2 f1 :=
  ⟨h.2, h.1⟩

/-- Transitivity of Information Equivalence: f1 ~_info f2 ∧ f2 ~_info f3 ⇒ f1 ~_info f3 -/
theorem equiv_info_trans (f1 : X → Z1) (f2 : X → Z2) (f3 : X → Z3)
    (h12 : EquivInfo f1 f2) (h23 : EquivInfo f2 f3) : EquivInfo f1 f3 :=
  ⟨refines_info_trans f1 f2 f3 h12.1 h23.1, refines_info_trans f3 f2 f1 h23.2 h12.2⟩

/-- Structural Theorem: Sufficiency Invariance under Information Equivalence.
    If f1 ~_info f2, then f1 is sufficient for P if and only if f2 is sufficient for P. -/
theorem sufficiency_equivalence_invariance (f1 : X → Z1) (f2 : X → Z2) (P : X → Y)
    (h_eq : EquivInfo f1 f2) : IsSufficient f1 P ↔ IsSufficient f2 P := by
  constructor
  · intro h1
    exact sufficiency_monotonicity f1 f2 P h_eq.1 h1
  · intro h2
    exact sufficiency_monotonicity f2 f1 P h_eq.2 h2

/-- Definition of Minimal Sufficiency: A transformation f* is minimal sufficient
    for property P if it is sufficient for P and refines all other sufficient transformations. -/
def IsMinimalSufficient (f_star : X → Z) (P : X → Y) : Prop :=
  IsSufficient f_star P ∧ ∀ (Z_other : Type) (f_other : X → Z_other),
    IsSufficient f_other P → RefinesInfo f_star f_other

/-- Theorem: Any two minimal sufficient transformations for P are Information-Equivalent. -/
theorem minimal_sufficiency_uniqueness (f1 : X → Z1) (f2 : X → Z2) (P : X → Y)
    (h1 : IsMinimalSufficient f1 P) (h2 : IsMinimalSufficient f2 P) : EquivInfo f1 f2 :=
  ⟨h1.2 Z2 f2 h2.1, h2.2 Z1 f1 h1.1⟩

/-- Product transformation bounds f1 from above in information preorder: f1 ≤_info (f1 × f2). -/
theorem product_refines_left (f1 : X → Z1) (f2 : X → Z2) :
    RefinesInfo f1 (ProductTransformation f1 f2) :=
  ⟨Prod.fst, λ _ => rfl⟩

/-- Product transformation bounds f2 from above in information preorder: f2 ≤_info (f1 × f2). -/
theorem product_refines_right (f1 : X → Z1) (f2 : X → Z2) :
    RefinesInfo f2 (ProductTransformation f1 f2) :=
  ⟨Prod.snd, λ _ => rfl⟩

/-- Universal Property of Information Join: ProductTransformation is the Least Upper Bound (Supremum / Join)
    in the Information Preorder. -/
theorem product_is_information_join (f1 : X → Z1) (f2 : X → Z2) (g : X → Z3)
    (h1 : RefinesInfo f1 g) (h2 : RefinesInfo f2 g) :
    RefinesInfo (ProductTransformation f1 f2) g := by
  rcases h1 with ⟨h1_map, h1_eq⟩
  rcases h2 with ⟨h2_map, h2_eq⟩
  exact ⟨λ z3 => (h1_map z3, h2_map z3), λ x => by dsimp [ProductTransformation]; rw [h1_eq x, h2_eq x]⟩

end Information
