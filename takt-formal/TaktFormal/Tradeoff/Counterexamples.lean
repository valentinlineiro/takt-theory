import TaktFormal.Kernel

open Classical

inductive S3 where
  | a
  | b
  | c

-- Representación mínima suficiente: R_min a = R_min b.
def R_min_3 (s : S3) : Bool :=
  match s with
  | S3.a => true
  | S3.b => true
  | S3.c => false

-- Representación identidad.
def R_id_3 (s : S3) : S3 :=
  s

-- Costes.
noncomputable def c_test {Z : Type} (R : S3 → Z) : Nat :=
  -- Si el kernel de R es el de la identidad, el coste es 2 (almacenamiento) + 0 (colisión) = 2.
  -- Si el kernel de R es R_min_3, el coste es 1 (almacenamiento) + 5 (colisión) = 6.
  if kernelSubset R R_min_3 ∧ ¬ kernelSubset R_min_3 R then 2
  else 6

theorem minimal_divergence : c_test R_id_3 < c_test R_min_3 := by
  dsimp [c_test, R_id_3, R_min_3]
  -- Demostramos que R_id_3 es estrictamente más fina que R_min_3.
  have h_id_finer : kernelSubset R_id_3 R_min_3 := by
    intro x y h
    dsimp [kernel, R_id_3, R_min_3] at *
    rw [h]
  have h_min_not_finer : ¬ kernelSubset R_min_3 R_id_3 := by
    intro h
    have h_ab : R_min_3 S3.a = R_min_3 S3.b := rfl
    have h_id_ab := h S3.a S3.b h_ab
    contradiction
  -- Ahora el condicional if de R_id_3 evalúa a true (coste 2).
  have h_cond_id : kernelSubset R_id_3 R_min_3 ∧ ¬ kernelSubset R_min_3 R_id_3 := ⟨h_id_finer, h_min_not_finer⟩
  -- Y el condicional de R_min_3 evalúa a false (coste 6).
  have h_cond_min : ¬ (kernelSubset R_min_3 R_min_3 ∧ ¬ kernelSubset R_min_3 R_min_3) := by
    intro h_and
    exact h_and.2 h_and.1
  -- Simplificamos los ifs.
  rw [if_pos h_cond_id, if_neg h_cond_min]
  decide
