# Reconstructing the Secret (c) from Mixed‑Base Shares – Node.js

This repository/script solves a simplified **Shamir’s Secret Sharing (SSS)** reconstruction task. You receive shares written in **different bases** (binary, decimal, hex, etc.). From any `k` of the `n` shares, the program finds the **constant term** `c` of the hidden polynomial `P(x)` (i.e., the secret) using **Lagrange interpolation** evaluated at `x = 0`.

---

## 1) Problem in One Line

Given JSON with `n` shares and a threshold `k`, convert each share’s `value` from its `base` to decimal to form points `(x=i, y)`, then compute `P(0)` using Lagrange interpolation on **any** `k` points. The result is the **secret** `c`.

---

## 2) Input Format (JSON)

```json
{
  "keys": { "n": 4, "k": 3 },
  "1": { "base": "10", "value": "4" },
  "2": { "base": "2",  "value": "111" },
  "3": { "base": "10", "value": "12" },
  "4": { "base": "16", "value": "213" }
}
```

* `n`: total number of shares provided.
* `k`: minimum number of shares required to reconstruct the polynomial of degree `k−1`.
* Each key `"i"` (e.g., `"1"`, `"2"`) is a **share**. Its index `i` is used as `x = i`.
* Each share has a `base` (number system) and a `value` (string in that base). We must convert `value` → **decimal**.

---

## 3) Quick Start (Node.js)

Place the provided script in `index.js` and run:

```bash
node index.js
```

* The script contains a sample JSON object in code. Replace it with your test case JSON and run again.
* The program prints:

```
Secret: <number>
```

---

## 4) How the Algorithm Works (Deep Dive)

### 4.1 Shamir’s Idea (Intuition)

* Pick a finite field (in standard SSS) and choose a random polynomial of degree `k−1`:
  $P(x) = c + a_1 x + a_2 x^2 + \dots + a_{k-1} x^{k-1}$
  where `c` is the **secret**.
* Give each participant a share `(x_i, y_i)` where `y_i = P(x_i)` for distinct `x_i`.
* Any **k** points uniquely determine that degree-`k−1` polynomial; fewer than `k` reveal nothing.

> **Our assignment**: We’re only asked to reconstruct `c = P(0)` from mixed‑base shares. No modulus/field is specified in the prompt, so we treat numbers as integers and use floating‑point Lagrange with rounding to the nearest integer at the end. (If the original used modular arithmetic, see §8 for the modular extension.)

### 4.2 Convert Mixed Bases to Decimal

For each share `i`:

1. Read `base = parseInt(json[i].base)`.
2. Read `value = json[i].value` (string in that base).
3. Convert `y = parseInt(value, base)` to decimal.
4. Set `x = i` (the JSON key index).

We now have a set of points: `points = [(1, y1), (2, y2), …, (n, yn)]`.

### 4.3 Use Any `k` Points

A polynomial of degree `k−1` is uniquely determined by any `k` **distinct** points. So we can take the **first `k`** shares (or any `k`) without changing the answer for `P(0)` as long as shares are correct.

### 4.4 Lagrange Interpolation (Formula)

Given distinct points `(x_i, y_i)` for `i = 1..k`, the unique polynomial of degree ≤ `k−1` is

$$
P(x) = \sum_{i=1}^{k} y_i \cdot \ell_i(x)
$$

where the **Lagrange basis** polynomials are

$$
\ell_i(x) = \prod_{\substack{j=1 \\ j\ne i}}^{k} \frac{x - x_j}{x_i - x_j}.
$$

We need $P(0)$:

$$
P(0) = \sum_{i=1}^{k} y_i \cdot \ell_i(0), \quad\text{with}\quad
\ell_i(0) = \prod_{\substack{j=1 \\ j\ne i}}^{k} \frac{0 - x_j}{x_i - x_j}.
$$

The code computes exactly this sum and finally `Math.round(...)` to remove minor floating‑point noise.

### 4.5 Why This Returns the Constant Term `c`

Since `P(x)` is exactly reconstructed by Lagrange interpolation, evaluating at `x=0` gives the true value `P(0)`. But `P(0)` is by definition the constant term (the y‑intercept), i.e., the **secret** `c`.

---

## 5) Worked Example (from the sample JSON)

Shares after base conversion:

* Share `1`: base10 value `"4"` → `y1 = 4`, `x1 = 1`
* Share `2`: base2  value `"111"` → `y2 = 7`, `x2 = 2`
* Share `3`: base10 value `"12"` → `y3 = 12`, `x3 = 3`
* Share `4`: base16 value `"213"` → `y4 = 0x213 = 531`, `x4 = 4` *(not needed if k=3)*

Take any `k = 3` points, say `(1,4)`, `(2,7)`, `(3,12)`.

Compute the Lagrange weights at `x=0`:

$$
\begin{aligned}
\ell_1(0) &= \frac{0-2}{1-2} \cdot \frac{0-3}{1-3} = 2 \cdot \tfrac{3}{2} = 3,\\
\ell_2(0) &= \frac{0-1}{2-1} \cdot \frac{0-3}{2-3} = (-1) \cdot 3 = -3,\\
\ell_3(0) &= \frac{0-1}{3-1} \cdot \frac{0-2}{3-2} = \tfrac{-1}{2} \cdot (-2) = 1.
\end{aligned}
$$

Then

$$
P(0) = 4\cdot3 + 7\cdot(-3) + 12\cdot1 = 12 - 21 + 12 = 3.
$$

**Secret `c = 3`.**

> You would get the same `c` using any other set of 3 correct shares (e.g., include share 4 and exclude one of the first three), because the hidden polynomial is unique.

---

## 6) Real‑Life Example: Secure Safe Code Sharing

Imagine a bank vault that opens with a 4‑digit PIN code. To avoid storing this PIN in one place:

1. The bank encodes the PIN (`c`) as the constant term of a random polynomial of degree `k−1`.
2. It distributes different points `(x, y)` as **shares** to 10 board members.
3. Policy: at least 4 members (k=4) must agree to open the vault. Any 4 valid shares reconstruct the polynomial and reveal the PIN, but fewer than 4 reveal nothing.

This ensures **security** (no small group can cheat) and **reliability** (if some members are absent, as long as ≥4 are present, the secret can be recovered).

Our assignment models exactly this: converting shares (possibly written in different bases for variety) into points and using Lagrange interpolation to reveal the hidden constant `c`.

---

## 7) Code Walkthrough

```js
// 1) Convert a string in arbitrary base to decimal
function toDecimal(str, base) {
  return parseInt(str, base);
}

// 2) Evaluate P(0) via Lagrange on any k points
function lagrangeInterpolation(points, k) {
  let secret = 0;
  for (let i = 0; i < k; i++) {
    let xi = points[i][0];
    let yi = points[i][1];
    let li = 1;
    for (let j = 0; j < k; j++) {
      if (i === j) continue;
      let xj = points[j][0];
      li *= (0 - xj) / (xi - xj);
    }
    secret += yi * li;
  }
  return Math.round(secret); // remove small FP noise
}
```

* **`toDecimal`** handles bases up to 36 by relying on `parseInt`.
* **`lagrangeInterpolation`** computes the Lagrange basis weights at `x=0` and returns the rounded sum.

---

## 8) Complexity

* Base conversion for all `n` shares: **O(n)**.
* Lagrange with `k` points: **O(k²)** (nested loop for basis weights).
* Space: **O(n)** for points.

---

## 9) Notes, Edge Cases, and Extensions

1. **Base validity**: Ensure `value` only uses digits allowed by `base`. `parseInt` stops at the first invalid character; validate if needed.
2. **Distinct x’s**: Share indices `1..n` are distinct by design. If two shares had the same `i`, interpolation would fail.
3. **Floating‑point rounding**: Because we do real‑number arithmetic (no modulus given), tiny FP error can appear; `Math.round` fixes it when the true result is an integer.
4. **Any k shares**: Using *any* `k` correct shares gives the same answer. If inconsistent shares exist (corruption), see **Wrong vs Right shares** below.
5. **Very large numbers**: If values are huge, consider a **BigInt rational** or **modular** implementation. Modular variant works over a prime field `𝔽_p` using modular inverses instead of division.

### Detecting **Wrong** vs **Right** Shares (optional enhancement)

If some shares may be invalid:

* Choose many different `k`‑subsets of the `n` shares.
* Reconstruct a candidate secret from each subset.
* The **majority/consistent** value is likely the true secret; subsets containing a bad share will yield different results.
* You can also fit the full polynomial using more than `k` points via **least squares** (over reals) and check residuals to flag outliers.

---

## 10) How to Use With Your Testcases

* Replace the `input` object in `index.js` with the JSON from your assignment (either the sample or the second big testcase).
* Run `node index.js`.
* The script prints the secret `c`.

> For the sample JSON above, the program prints `Secret: 3`.

---

## 11) FAQ

**Q: Why does picking “first k points” work?**
A: Any `k` correct shares uniquely determine the degree `k−1` polynomial; therefore `P(0)` is invariant across all such choices.

**Q: Why not do polynomial solving with linear algebra?**
A: You can set up a `k×k` Vandermonde system and solve for coefficients directly. Lagrange is simpler and numerically stable enough at this scale, and we only need `P(0)`.

**Q: What if numbers are beyond base‑36?**
A: `parseInt` supports bases up to 36 (digits 0–9 and a–z). For larger bases, implement a manual converter that maps custom digit alphabets.

---

## 12) References (conceptual)

* Lagrange Interpolation (classical formula for reconstructing polynomials).
* Shamir’s Secret Sharing (breaking a secret into shares using polynomials).

---

**Outcome:** With the given JSON shares, this script reconstructs the **secret constant term** `c = P(0)` reliably, provided at least `k` valid shares are used.
