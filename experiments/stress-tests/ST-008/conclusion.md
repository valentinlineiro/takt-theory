# ST-008: Convergence Gap — Conclusion

## Resultado

**Structural Representation Gap.**

Queda demostrado que ninguna representación local y acotada ($\mathcal{F}$)
puede preservar la distinción terminar/continuar para el pipeline kanban de
`takt`, dado que la convergencia depende del mundo externo $W$, y
$\mathcal{F}$ excluye por construcción el acceso a $W$.

## Demostración

El teorema del §2.2 de `results.md` establece que para el par de
trayectorias $T_1$/$T_2$ construido en `model.md`:

- $s_t(T_1) = s_t(T_2)$ para todo $t$ (mismo estado observable).
- Por localidad, $R_i(T_1) = R_i(T_2)$ para todo $R_i \in \mathcal{F}$.
- $T_1$ y $T_2$ requieren decisiones distintas ($D$ difiere).
- Luego $\ker(R_i) \not\subseteq \ker(D)$ para todo $R_i \in \mathcal{F}$.

No se encontró ningún candidato suficiente. El resultado es estructural,
no atribuible a una representación concreta.

## Clasificación

| Criterio | Valor |
|----------|-------|
| Etiqueta | Structural Representation Gap |
| Evidencia | Demostración formal (teorema, no experimental) |
| Alcance | Pipeline kanban de `takt`, familia $\mathcal{F}$ de representaciones locales y acotadas |
| Límite identificado | La convergencia depende de $W$, que no pertenece a $\mathcal{S}$ |

## Consecuencias

1. **Para `takt`.** La representación actual ($S_0$) no puede detectar
   convergencia. Cualquier extensión que necesite detectar convergencia
   requerirá acceso a $W$ (información externa al estado del kanban).

2. **Para SPT.** El marco G2 tiene un límite de aplicabilidad
   explícitamente identificado: no puede representar propiedades que
   dependan de información externa al dominio del sistema de decisión
   cuando la representación está restringida a ser local y acotada. Este
   límite no invalida el marco, pero define su frontera.

3. **Para la teoría de representaciones locales y acotadas.** ST-008
   proporciona un ejemplo concreto de una propiedad que ninguna
   representación local y acotada puede preservar, siguiendo el patrón
   de no-inyectividad de G3. Es un resultado de imposibilidad dentro
   de la familia, no una limitación de un candidato concreto.
