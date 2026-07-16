import TaktFormal.Kernel

open Kernel

namespace DecisionMargin

/--
  Estructura de Espacio Métrico sobre S.
-/
class MetricSpace (S : Type) where
  dist : S → S → Nat

/--
  Verifica si hay algún par que viole la seguridad (kernel de R no contenido en D).
-/
def has_unsafe_pair {S A Z : Type} [DecidableEq Z] [DecidableEq A] (R : S → Z) (D : S → A) (pairs : List (S × S)) : Bool :=
  pairs.any (fun (x, y) => R x = R y && D x ≠ D y)

/--
  Calcula el mínimo de una lista no vacía de números naturales.
-/
def list_min (d : Nat) (ds : List Nat) : Nat :=
  ds.foldl (fun acc x => if x < acc then x else acc) d

/--
  Cálculo constructivo del margen decisional para espacios de estados finitos.
-/
def decisionMargin {S A Z : Type} [DecidableEq S] [DecidableEq Z] [DecidableEq A] 
    (dist : S → S → Nat) (D : S → A) (R : S → Z) (all_S : List S) : Option Nat :=
  let pairs := all_S.flatMap (fun x => all_S.map (fun y => (x, y)))
  if has_unsafe_pair R D pairs then
    some 0
  else
    let filtered := pairs.filter (fun (x, y) => R x ≠ R y && D x ≠ D y)
    let distances := filtered.map (fun (x, y) => dist x y)
    match distances with
    | [] => none
    | d :: ds => some (list_min d ds)

/--
  Instanciación para el modelo de deriva temporal.
-/
inductive S : Type where
  | sm10 : S
  | sm01 : S
  | sp01 : S
  | sp10 : S
  deriving DecidableEq, Repr

open S

def all_S : List S := [sm10, sm01, sp01, sp10]

def dist : S → S → Nat
  | sm10, sm10 => 0
  | sm10, sm01 => 9
  | sm10, sp01 => 11
  | sm10, sp10 => 20
  | sm01, sm10 => 9
  | sm01, sm01 => 0
  | sm01, sp01 => 2
  | sm01, sp10 => 11
  | sp01, sm10 => 11
  | sp01, sm01 => 2
  | sp01, sp01 => 0
  | sp01, sp10 => 9
  | sp10, sm10 => 20
  | sp10, sm01 => 11
  | sp10, sp01 => 9
  | sp10, sp10 => 0

instance : MetricSpace S where
  dist := dist

def D : S → Nat
  | sm10 => 0
  | sm01 => 0
  | sp01 => 1
  | sp10 => 1

def R0 : S → Int
  | sm10 => -1
  | sm01 => -1
  | sp01 => 0
  | sp10 => 1

def R1 : S → Int
  | sm10 => -2
  | sm01 => -1
  | sp01 => 0
  | sp10 => 0

def R2 : S → Int
  | sm10 => -2
  | sm01 => -1
  | sp01 => 0
  | sp10 => 0

def R3 : S → Int
  | sm10 => -2
  | sm01 => -1
  | sp01 => -1
  | sp10 => 0

theorem R0_margin : decisionMargin dist D R0 all_S = some 2 := by rfl
theorem R1_margin : decisionMargin dist D R1 all_S = some 2 := by rfl
theorem R2_margin : decisionMargin dist D R2 all_S = some 2 := by rfl
theorem R3_margin : decisionMargin dist D R3 all_S = some 0 := by rfl

end DecisionMargin
