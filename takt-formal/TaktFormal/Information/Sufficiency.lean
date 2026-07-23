import TaktFormal.Factorization

namespace Information

variable {X Y Z Z1 Z2 : Type}

/-- Abstract Information Sufficiency: Transformation `f : X → Z` is sufficient
    for property `P : X → Y` if there exists a factorizing map `h : Z → Y`
    such that `P = h ∘ f`. -/
def IsSufficient (f : X → Z) (P : X → Y) : Prop :=
  ∃ (h : Z → Y), ∀ x : X, P x = h (f x)

/-- Axiom/Theorem: Identity Transformation is always sufficient for any property. -/
theorem identity_sufficient (P : X → Y) : IsSufficient (id : X → X) P :=
  ⟨P, λ _ => rfl⟩

/-- Information Preorder (f1 ≤_info f2): Transformation `f1` is coarser than `f2`
    if `f1` factorizes through `f2`. -/
def RefinesInfo (f1 : X → Z1) (f2 : X → Z2) : Prop :=
  ∃ (h : Z2 → Z1), ∀ x : X, f1 x = h (f2 x)

/-- Preorder Reflexivity: f ≤_info f -/
theorem refines_info_refl (f : X → Z) : RefinesInfo f f :=
  ⟨id, λ _ => rfl⟩

/-- Preorder Transitivity: f1 ≤_info f2 ∧ f2 ≤_info f3 ⇒ f1 ≤_info f3 -/
theorem refines_info_trans (f1 : X → Z1) (f2 : X → Z2) (f3 : X → Z)
    (h12 : RefinesInfo f1 f2) (h23 : RefinesInfo f2 f3) : RefinesInfo f1 f3 := by
  rcases h12 with ⟨h12_map, h12_eq⟩
  rcases h23 with ⟨h23_map, h23_eq⟩
  exact ⟨λ z3 => h12_map (h23_map z3), λ x => by rw [h12_eq x, h23_eq x]⟩

/-- Structural Theorem: Sufficiency Monotonicity under Information Preorder.
    If f1 ≤_info f2 and f1 is sufficient for P, then f2 is sufficient for P. -/
theorem sufficiency_monotonicity (f1 : X → Z1) (f2 : X → Z2) (P : X → Y)
    (h_ref : RefinesInfo f1 f2) (h_suff : IsSufficient f1 P) : IsSufficient f2 P := by
  rcases h_ref with ⟨h_map, h_ref_eq⟩
  rcases h_suff with ⟨h_suff_map, h_suff_eq⟩
  exact ⟨λ z2 => h_suff_map (h_map z2), λ x => by rw [h_suff_eq x, h_ref_eq x]⟩

/-- Product Transformation of two information transformations. -/
def ProductTransformation (f1 : X → Z1) (f2 : X → Z2) : X → (Z1 × Z2) :=
  λ x => (f1 x, f2 x)

/-- Structural Theorem: Product Sufficiency for Joint Properties.
    If f1 is sufficient for P1 and f2 is sufficient for P2,
    then f1 × f2 is sufficient for the joint property P1 × P2. -/
theorem product_sufficiency (f1 : X → Z1) (f2 : X → Z2) (P1 : X → Y) (P2 : X → Z)
    (h1 : IsSufficient f1 P1) (h2 : IsSufficient f2 P2) :
    IsSufficient (ProductTransformation f1 f2) (λ x => (P1 x, P2 x)) := by
  rcases h1 with ⟨h1_map, h1_eq⟩
  rcases h2 with ⟨h2_map, h2_eq⟩
  exact ⟨λ p => (h1_map p.1, h2_map p.2), λ x => by dsimp [ProductTransformation]; rw [h1_eq x, h2_eq x]⟩

/-- Bridge Theorem: Connection to Volume I Kernel Factorization.
    For non-empty property domains Y, IsSufficient f P is logically equivalent
    to kernel inclusion ker(f) ⊆ ker(P). -/
theorem sufficiency_kernel_equivalence [Nonempty Y] (f : X → Z) (P : X → Y) :
    IsSufficient f P ↔ kernelSubset f P := by
  constructor
  · rintro ⟨h, h_eq⟩ x y hk
    dsimp [kernel, kernelSubset]
    rw [h_eq x, h_eq y, hk]
  · intro h_subset
    exact factorization f P |>.mp h_subset

end Information
