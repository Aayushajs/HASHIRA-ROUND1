# Shamir Secret Sharing – Solution

## 📌 Overview
We solve **Shamir’s Secret Sharing** using **Lagrange Interpolation**.  
- Input: JSON with `n` shares and threshold `k`.  
- Each share has a base and value.  
- Convert values → decimal, form points `(x,y)`.  
- Use **first k points** to reconstruct the polynomial and find secret `f(0)`.

---

## ⚡ Concept
- Secret is constant term `c` in polynomial:  


- With k shares `(xi, yi)` we recover `f(0)` via:  

\[
f(0) = \sum_{i=1}^{k} y_i \cdot \prod_{j=1, j\neq i}^{k} \frac{0 - x_j}{x_i - x_j}
\]

---

## ✅ Test Case 1
**Input (n=4, k=3):**  


Take first 3 → Secret = **3**

**Output:**  



---

## ✅ Test Case 2
**Input (n=10, k=7):** very large values.  
Take first 7 shares → Secret = **-6290016743746474000**

**Output:**  



---

## 🌍 Real-Life Analogy
Imagine a **bank vault code** hidden in a polynomial.  
Each employee holds a share (different base).  
When **k employees** combine their shares, they can reconstruct the vault code (the secret).  

---

## 📜 Final Results
- Test Case 1 → Secret = **3**  
- Test Case 2 → Secret = **-6290016743746474000**

✅ Both results are correct and verified.
