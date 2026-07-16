# ST-004: Hidden Kernel Attack — Model

## Espacio de Estados, Acciones y Decisión

Definimos las siguientes estructuras finitas:

* **Espacio de Estados ($S$):**
  \[
  S = \{s_0, s_1, s_2, s_3\}
  \]
* **Espacio de Acciones ($A$):**
  \[
  A = \{a, b\}
  \]
* **Operador de Decisión Global ($D$):**
  - $D(s_0) = a, \quad D(s_1) = a$
  - $D(s_2) = b, \quad D(s_3) = b$

---

## Conjunto de Test (Observable)

El subconjunto de estados donde se pueden realizar observaciones prácticas (el sensor empírico) es:
\[
T = \{s_0, s_2\} \subset S
\]
Los estados $s_1$ y $s_3$ permanecen ocultos a los observables empíricos de validación.

---

## Representaciones a Evaluar

Definimos dos representaciones $R_1, R_2: S \to \{z_0, z_1\}$:

### Representación 1 ($R_1$ - Segura Globalmente)
* $R_1(s_0) = z_0, \quad R_1(s_1) = z_0$ (decisiones: $a, a$ $\to$ consistentes)
* $R_1(s_2) = z_1, \quad R_1(s_3) = z_1$ (decisiones: $b, b$ $\to$ consistentes)
* *Relación global:* $\ker(R_1) \subseteq \ker(D)$ (es segura).

### Representación 2 ($R_2$ - Insegura Globalmente / Ataque)
* $R_2(s_0) = z_0, \quad R_2(s_3) = z_0$ (decisiones: $a, b$ $\to$ **inconsistentes**)
* $R_2(s_1) = z_1, \quad R_2(s_2) = z_1$ (decisiones: $a, b$ $\to$ **inconsistentes**)
* *Relación global:* $\ker(R_2) \not\subseteq \ker(D)$ (es insegura).

---

## Observables Empíricos en $T$

El observable de seguridad decisional sobre el conjunto de test $T$, denotado como $\text{safe\_on\_T}(R)$, se define como:
\[
\text{safe\_on\_T}(R) \iff \forall x, y \in T, \quad R(x) = R(y) \implies D(x) = D(y)
\]
Para ambas representaciones:
* En $T = \{s_0, s_2\}$, tenemos $R(s_0) = z_0 \neq z_1 = R(s_2)$.
* Como ningún par diferente en $T$ comparte la misma representación, la condición se cumple trivialmente por vacuidad para ambos.
* Por lo tanto, ambas representaciones se observan como **100% seguras** bajo el test.
