/-- Given two Setoids s1 and s2 on a type A, if s1.r is a subrelation of s2.r
    (meaning s1 is finer, i.e., s1.r implies s2.r), then there is a canonical map
    from Quotient s1 to Quotient s2. -/
def quotientMap {A : Type} (s1 s2 : Setoid A) (h : ∀ a b : A, s1.r a b → s2.r a b) (q : Quotient s1) : Quotient s2 :=
  Quotient.lift (fun a => Quotient.mk s2 a) (fun a b hab => Quotient.sound (h a b hab)) q

/-- The quotient map preserves the equivalence classes of elements. -/
theorem quotientMap_mk {A : Type} (s1 s2 : Setoid A) (h : ∀ a b : A, s1.r a b → s2.r a b) (a : A) :
    quotientMap s1 s2 h (Quotient.mk s1 a) = Quotient.mk s2 a :=
  rfl
