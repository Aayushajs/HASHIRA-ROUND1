/**NOTE: This code is designed to run in a Node.js environment. It does not require any external libraries.
 * This code takes numbers written in different bases (like binary, decimal, hexadecimal)
 * and converts them to normal decimal numbers. Then, it uses a math formula called
 * Lagrange interpolation to find a secret value at x=0 using k points from the input.
 * The input is given as a JSON object, and the answer is printed as "Secret".
 */

// Converts a number written as a string in any base (like "111" in base 2) to a normal decimal number.
function toDecimal(str, base) {
  return parseInt(str, base);
}

// Uses Lagrange interpolation formula to find the secret value when x is 0, using the given points.
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
  return Math.round(secret);
}

// This is a sample input showing how the data should look. It has numbers in different bases.
const input = {
  "keys": { "n": 4, "k": 3 },
  "1": { "base": "10", "value": "4" },
  "2": { "base": "2",  "value": "111" },
  "3": { "base": "10", "value": "12" },
  "4": { "base": "16", "value": "213" }
};

const n = input.keys.n;
const k = input.keys.k;

let points = [];
for (let i = 1; i <= n; i++) {
  let base = parseInt(input[i.toString()].base);
  let value = input[i.toString()].value;
  let y = toDecimal(value, base);
  points.push([i, y]);  // Each point is made from the index (x) and the converted decimal value (y).
}

let subset = points.slice(0, k); // Picks the first k points to use for finding the secret.
console.log("Secret:", lagrangeInterpolation(subset, k));
