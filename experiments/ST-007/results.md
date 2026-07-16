# ST-007: External Dynamic Safety Contract — Results

Los resultados de la validación formal en Lean 4 del Contrato Dinámico de Seguridad aplicado al clasificador Edge-AI son:

## 1. Verificación del Escenario Nominal ($t = 0$)

* **Prueba:** `theorem c0_contract_satisfied : contract_satisfied c0`
* **Resultado:** **Éxito (Verificado)**.
* **Detalle:** Lean 4 demostró por reflexión (`rfl` / `decide`) que bajo la cuantificación nominal, el contrato $\mathcal{C}_0$ se cumple por completo:
  - El test local $T$ es seguro.
  - La cobertura de fibras $C(T, S)$ se satisface.
  - El margen decisional es $M(R_0) = 5$, que cumple con la cota de seguridad $m_{\text{min}} = 5$.
  - La política está alineada en el conjunto de test.

---

## 2. Falla Silenciosa del Test bajo Deriva ($t = 1$)

* **Prueba:** `theorem c1_test_safe : safe_on_T R1 D T`
* **Resultado:** **Éxito (Verificado)**.
* **Detalle:** Demuestra de forma exacta que para todos los estados del conjunto de test $T$, la representación del clasificador derivado $R_1$ no produce colisiones en $T$. El test reporta erróneamente un 100% de seguridad, sin detectar la colisión de la frontera en los estados no observados ($s=0$ y $s=-5$).

---

## 3. Detección de Inseguridad por Colapso de Margen ($t = 1$)

* **Prueba:** `theorem c1_contract_violated : ¬ contract_satisfied c1`
* **Resultado:** **Éxito (Verificado)**.
* **Detalle:** Lean 4 demostró que, debido a la colisión de la frontera ($R_1(0) = R_1(-5) = -1$ pero con decisiones diferentes), el margen decisional colapsa a $M(R_1) = 0$. Como $0 < m_{\text{min}} = 5$, el contrato se invalida de inmediato.

---

## 4. Estado de Ejecución
La prueba formal compiló en un entorno limpio y verificado bajo la suite de compilación de Lean 4:
```bash
$ lake build
Build completed successfully (36 jobs).
```
El archivo de pruebas se ubica en [ExternalContract.lean](file:///home/valentin/code/takt-theory/experiments/ST-007/implementation/ExternalContract.lean).
