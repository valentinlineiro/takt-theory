import TaktFormal.Information.Sufficiency

namespace Information

variable {X Y Z Z0 Z1 Z2 Z3 : Type}

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

/-- Structural Duality Theorem: Monotonicity of Minimal Sufficiency under Property Refinement.
    If property P1 is refined by P2 (P1 ≤_info P2), then the minimal sufficient transformation
    f1* for P1 is refined by the minimal sufficient transformation f2* for P2 (f1* ≤_info f2*). -/
theorem minimal_sufficiency_property_monotonicity {Y1 Y2 : Type}
    (P1 : X → Y1) (P2 : X → Y2) (f1_star : X → Z1) (f2_star : X → Z2)
    (h_prop_ref : RefinesInfo P1 P2)
    (h1_min : IsMinimalSufficient f1_star P1)
    (h2_min : IsMinimalSufficient f2_star P2) :
    RefinesInfo f1_star f2_star := by
  rcases h_prop_ref with ⟨h_prop, h_prop_eq⟩
  rcases h2_min.1 with ⟨h2_map, h2_eq⟩
  have h_suff_f2_P1 : IsSufficient f2_star P1 :=
    ⟨λ z2 => h_prop (h2_map z2), λ x => by rw [h_prop_eq x, h2_eq x]⟩
  exact h1_min.2 Z2 f2_star h_suff_f2_P1

/-- Universal Adjunction Equivalence Theorem for Minimal Sufficiency:
    For a minimal sufficient transformation f_star for property P,
    f_star refines f (f_star ≤_info f) if and only if f is sufficient for P. -/
theorem minimal_sufficiency_adjunction_equivalence (P : X → Y) (f_star : X → Z1) (f : X → Z2)
    (h_min : IsMinimalSufficient f_star P) :
    RefinesInfo f_star f ↔ IsSufficient f P := by
  constructor
  · intro h_ref
    exact sufficiency_monotonicity f_star f P h_ref h_min.1
  · intro h_suff
    exact h_min.2 Z2 f h_suff

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

/-- Top Element of Information Preorder: Identity transformation carries maximum information (f ≤_info id). -/
theorem info_top (f : X → Z) : RefinesInfo f (id : X → X) :=
  ⟨f, λ _ => rfl⟩

/-- Bottom Element of Information Preorder: Constant transformation carries minimum information (const ≤_info f). -/
theorem info_bottom (f : X → Z) (c : Z0) : RefinesInfo (λ (_ : X) => c) f :=
  ⟨λ _ => c, λ _ => rfl⟩

/-- Join Commutativity up to Information Equivalence: (f1 × f2) ~_info (f2 × f1). -/
theorem join_comm (f1 : X → Z1) (f2 : X → Z2) :
    EquivInfo (ProductTransformation f1 f2) (ProductTransformation f2 f1) := by
  constructor
  · exact ⟨λ p => (p.2, p.1), λ _ => rfl⟩
  · exact ⟨λ p => (p.2, p.1), λ _ => rfl⟩

/-- Join Associativity up to Information Equivalence: ((f1 × f2) × f3) ~_info (f1 × (f2 × f3)). -/
theorem join_assoc (f1 : X → Z1) (f2 : X → Z2) (f3 : X → Z3) :
    EquivInfo (ProductTransformation (ProductTransformation f1 f2) f3)
              (ProductTransformation f1 (ProductTransformation f2 f3)) := by
  constructor
  · exact ⟨λ p => ((p.1, p.2.1), p.2.2), λ _ => rfl⟩
  · exact ⟨λ p => (p.1.1, (p.1.2, p.2)), λ _ => rfl⟩

end Information
