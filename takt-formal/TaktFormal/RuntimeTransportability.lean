/-
ST-017 formal core: capability-relative transportability.

Formalizes only the items marked "ready" in
docs/superpowers/specs/2026-07-28-st017-formal-model-draft.md: Attributes,
Sound, Sound', KernelSound, DecisionSound, CapabilitySound; the hierarchy
CapabilitySound => KernelSound => DecisionSound (P1); composition for the
two composable levels (P2); the Preserved/Degraded/Lost trichotomy (P6).

Q1-Q6 in the formal model draft are NOT formalized here -- doing so would
freeze an undecided design choice. Sound(T,c,R) (sub-relation granularity)
is likewise not included, per the draft's exclusion.
-/
namespace TaktFormal.RuntimeTransportability

universe u v w

def Set (α : Type u) := α → Prop

instance : Membership α (Set α) where
  mem s x := s x

instance : SDiff (Set α) where
  sdiff s1 s2 := fun x => s1 x ∧ ¬ s2 x

instance : Singleton α (Set α) where
  singleton x := fun y => y = x

variable {α β γ : Type u} {δ : Type v} {κ : Type w}

/-- A runtime over representation type α, decision type δ, and capability
alphabet κ. More general than `RuntimeSufficiency.Runtime`, which fixes
κ := RuntimeCapability: ST-017 transports between hypothetical runtimes
that need not share that fixed 3-constructor type. -/
structure Runtime (α : Type u) (δ : Type v) (κ : Type w) where
  capabilities : Set κ
  policy : α → δ

def removeCapability (M : Runtime α δ κ) (c : κ) : Runtime α δ κ :=
  { capabilities := M.capabilities \ {c}, policy := M.policy }

/-- Attributes(c, M, x, y) -- formal model draft §1, table row 1. -/
def Attributes (c : κ) (M : Runtime α δ κ) (x y : α) : Prop :=
  M.policy x ≠ M.policy y ∧ (removeCapability M c).policy x = (removeCapability M c).policy y

/-- Sound(T, c) -- decision-level. Does not compose (P3); no composition
theorem is stated for it, deliberately. -/
def Sound (T : α → β) (c : κ) (M1 : Runtime α δ κ) (M2 : Runtime β δ κ) : Prop :=
  ∀ x y : α, Attributes c M1 x y → M2.policy (T x) ≠ M2.policy (T y)

/-- Sound'(T, c) -- capability-level. -/
def SoundPrime (T : α → β) (c : κ) (M1 : Runtime α δ κ) (M2 : Runtime β δ κ) : Prop :=
  ∀ x y : α, Attributes c M1 x y → Attributes c M2 (T x) (T y)

/-- KernelSound(T) -- existential over a capability kernel K_D. -/
def KernelSound (T : α → β) (K_D : Set κ) (M1 : Runtime α δ κ) (M2 : Runtime β δ κ) : Prop :=
  ∀ x y : α, (∃ c, c ∈ K_D ∧ Attributes c M1 x y) →
             (∃ c', c' ∈ K_D ∧ Attributes c' M2 (T x) (T y))

def CapabilitySound (T : α → β) (K_D : Set κ) (M1 : Runtime α δ κ) (M2 : Runtime β δ κ) : Prop :=
  ∀ c, c ∈ K_D → SoundPrime T c M1 M2

def DecisionSound (T : α → β) (K_D : Set κ) (M1 : Runtime α δ κ) (M2 : Runtime β δ κ) : Prop :=
  ∀ c, c ∈ K_D → Sound T c M1 M2

/-- P1, first arrow: certificate-granularity.md §2. -/
theorem capabilitySound_implies_kernelSound
    (T : α → β) (K_D : Set κ) (M1 : Runtime α δ κ) (M2 : Runtime β δ κ) :
    CapabilitySound T K_D M1 M2 → KernelSound T K_D M1 M2 := by
  intro hcap x y hex
  obtain ⟨c, hcKD, hattr⟩ := hex
  exact ⟨c, hcKD, hcap c hcKD x y hattr⟩

/-- P1, second arrow: certificate-granularity.md §2. -/
theorem kernelSound_implies_decisionSound
    (T : α → β) (K_D : Set κ) (M1 : Runtime α δ κ) (M2 : Runtime β δ κ) :
    KernelSound T K_D M1 M2 → DecisionSound T K_D M1 M2 := by
  intro hker c hcKD x y hattr
  obtain ⟨_c', _hc'KD, hattr'⟩ := hker x y ⟨c, hcKD, hattr⟩
  exact hattr'.1

/-- P2 for Sound' at a fixed capability: compositional-soundness-obligation.md §2. -/
theorem soundPrime_comp (T12 : α → β) (T23 : β → γ) (c : κ)
    (M1 : Runtime α δ κ) (M2 : Runtime β δ κ) (M3 : Runtime γ δ κ) :
    SoundPrime T12 c M1 M2 → SoundPrime T23 c M2 M3 → SoundPrime (T23 ∘ T12) c M1 M3 := by
  intro h12 h23 x y hattr
  exact h23 (T12 x) (T12 y) (h12 x y hattr)

/-- P2 for CapabilitySound. -/
theorem capabilitySound_comp (T12 : α → β) (T23 : β → γ) (K_D : Set κ)
    (M1 : Runtime α δ κ) (M2 : Runtime β δ κ) (M3 : Runtime γ δ κ) :
    CapabilitySound T12 K_D M1 M2 → CapabilitySound T23 K_D M2 M3 →
    CapabilitySound (T23 ∘ T12) K_D M1 M3 := by
  intro h12 h23 c hcKD
  exact soundPrime_comp T12 T23 c M1 M2 M3 (h12 c hcKD) (h23 c hcKD)

/-- P2 for KernelSound: compositional-soundness-obligation.md §4. -/
theorem kernelSound_comp (T12 : α → β) (T23 : β → γ) (K_D : Set κ)
    (M1 : Runtime α δ κ) (M2 : Runtime β δ κ) (M3 : Runtime γ δ κ) :
    KernelSound T12 K_D M1 M2 → KernelSound T23 K_D M2 M3 →
    KernelSound (T23 ∘ T12) K_D M1 M3 := by
  intro h12 h23 x y hex
  exact h23 (T12 x) (T12 y) (h12 x y hex)

/-- P6: Preserved/Degraded/Lost trichotomy, transportability-failure-modes.md §1.
Exhaustive by construction (case split on two booleans). Note: Lean gives
"Lost" no distinct ill-formed status -- `c ∉ M2.capabilities` is an
ordinary False Prop, the same status as any other false proposition. The
stronger informal distinction in the notes (a question that "can no
longer be formed") describes the intent of a per-runtime capability
alphabet; formalized with `Set κ` membership, it does not surface as a
separate proof-theoretic category. -/
theorem transport_trichotomy (c : κ) (M2 : Runtime β δ κ) (u v : β) :
    (c ∈ M2.capabilities ∧ Attributes c M2 u v) ∨
    (c ∈ M2.capabilities ∧ ¬ Attributes c M2 u v) ∨
    c ∉ M2.capabilities := by
  by_cases hc : c ∈ M2.capabilities
  · by_cases ha : Attributes c M2 u v
    · exact Or.inl ⟨hc, ha⟩
    · exact Or.inr (Or.inl ⟨hc, ha⟩)
  · exact Or.inr (Or.inr hc)

end TaktFormal.RuntimeTransportability
