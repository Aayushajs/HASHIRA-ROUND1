function toDecimal(str, base) {
  return parseInt(str, base);
}

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

// Suppose the input JSON is given as a string (from file or API)
const jsonString = `{
  "keys": { "n": 4, "k": 3 },
  "1": { "base": "10", "value": "4" },
  "2": { "base": "2",  "value": "111" },
  "3": { "base": "10", "value": "12" },
  "4": { "base": "16", "value": "213" }
}`;

const input = JSON.parse(jsonString);

const n = input.keys.n;
const k = input.keys.k;

let points = [];
for (let i = 1; i <= n; i++) {
  let base = parseInt(input[i.toString()].base);
  let value = input[i.toString()].value;
  let y = toDecimal(value, base);
  points.push([i, y]);
}

let subset = points.slice(0, k);
console.log("Secret:", lagrangeInterpolation(subset, k));
