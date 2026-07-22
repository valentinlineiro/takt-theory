import TaktFormal.Representation.Preorder

/-- Characterization of bottom (coarsest/indiscrete) representation. -/
def IsBottom (R : RepresentationSpace) (bot : R.Rep) : Prop :=
  ∀ r : R.Rep, R.le bot r

/-- Characterization of top (finest/discrete) representation. -/
def IsTop (R : RepresentationSpace) (top : R.Rep) : Prop :=
  ∀ r : R.Rep, R.le r top

/-- The canonical representation space of equivalence relations on a state space `S`. -/
def EquivRel (S : Type) : Type :=
  { r : S → S → Prop // Equivalence r }

/-- The canonical preorder on equivalence relations.
    Convention: e1 ≤ e2 means e2 is finer than e1, which mathematically translates
    to e2 being a subset of e1 (i.e. e2 makes more distinctions, so its equivalence classes are smaller).
    So: e2 s1 s2 → e1 s1 s2.
-/
def equiv_refinement {S : Type} (e1 e2 : EquivRel S) : Prop :=
  ∀ {s1 s2 : S}, e2.val s1 s2 → e1.val s1 s2

theorem equiv_refinement_refl {S : Type} (e : EquivRel S) : equiv_refinement e e :=
  fun h => h

theorem equiv_refinement_trans {S : Type} {e1 e2 e3 : EquivRel S}
    (h1 : equiv_refinement e1 e2) (h2 : equiv_refinement e2 e3) :
    equiv_refinement e1 e3 :=
  fun h => h1 (h2 h)

/-- The canonical RepresentationSpace induced by equivalence relations on a state space `S`. -/
def CanonicalRepresentationSpace (S : Type) : RepresentationSpace where
  Rep := EquivRel S
  le := equiv_refinement
  le_refl := equiv_refinement_refl
  le_trans := @equiv_refinement_trans S
