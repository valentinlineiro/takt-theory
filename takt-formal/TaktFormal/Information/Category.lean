import TaktFormal.Information.Algebra

namespace Information

variable {X Y Z Z1 Z2 : Type}

/-- Subcategory of Sufficient Transformations for Property P.
    An object in this subcategory is a transformation `f : X → Z` together with a proof `IsSufficient f P`. -/
structure SufficientObject (X Y : Type) (P : X → Y) where
  Z : Type
  f : X → Z
  sufficient : IsSufficient f P

/-- A Morphism in the Sufficient Category between obj1 and obj2 is a factorizing map `h : obj2.Z → obj1.Z`
    such that `obj1.f = h ∘ obj2.f` (i.e. `RefinesInfo obj1.f obj2.f`). -/
def SufficientMorphism (P : X → Y) (obj1 obj2 : SufficientObject X Y P) : Type :=
  { h : obj2.Z → obj1.Z // ∀ x : X, obj1.f x = h (obj2.f x) }

/-- Identity Morphism in the Sufficient Category. -/
def sufficient_id (P : X → Y) (obj : SufficientObject X Y P) : SufficientMorphism P obj obj :=
  ⟨id, λ _ => rfl⟩

/-- Morphism Composition in the Sufficient Category. -/
def sufficient_comp (P : X → Y) {obj1 obj2 obj3 : SufficientObject X Y P}
    (m12 : SufficientMorphism P obj1 obj2) (m23 : SufficientMorphism P obj2 obj3) :
    SufficientMorphism P obj1 obj3 :=
  ⟨m12.val ∘ m23.val, λ x => by
    have h1 := m12.property x
    have h2 := m23.property x
    dsimp
    rw [h1, h2]⟩

/-- Categorical Initial Object Theorem:
    A Minimal Sufficient Transformation f* (as an object in SufficientObject) has a morphism
    to any other SufficientObject in the category of sufficient transformations for P. -/
theorem minimal_sufficient_is_initial_object (P : X → Y) (f_star : X → Z1)
    (h_min : IsMinimalSufficient f_star P) (obj : SufficientObject X Y P) :
    Nonempty (SufficientMorphism P ⟨Z1, f_star, h_min.1⟩ obj) := by
  have h_ref : RefinesInfo f_star obj.f := h_min.2 obj.Z obj.f obj.sufficient
  rcases h_ref with ⟨h_map, h_eq⟩
  exact ⟨⟨h_map, h_eq⟩⟩

end Information
