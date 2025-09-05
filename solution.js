/**NOTE: This code is designed to run in a Node.js environment. It does not require any external libraries.|
 * This code takes numbers written in different bases (like binary, decimal, hexadecimal)                  |
 * and converts them to normal decimal numbers. Then, it uses a math formula called                        |
 * Lagrange interpolation to find a secret value at x=0 using k points from the input.                     |
 * The input is given as a JSON object, and the answer is printed as "Secret".                             |
 **********************************************************************************************************/

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


// Test case 1
const input1 = {
  "keys": { "n": 4, "k": 3 },
  "1": { "base": "10", "value": "4" },
  "2": { "base": "2",  "value": "111" },
  "3": { "base": "10", "value": "12" },
  "4": { "base": "16", "value": "213" }
};

let n1 = input1.keys.n;
let k1 = input1.keys.k;
let points1 = [];
for (let i = 1; i <= n1; i++) {
  let base = parseInt(input1[i.toString()].base);
  let value = input1[i.toString()].value;
  let y = toDecimal(value, base);
  points1.push([i, y]);
}
let subset1 = points1.slice(0, k1);
console.log("Secret for Test Case 1:", lagrangeInterpolation(subset1, k1));

// Test case 2
const input2 = {
  "keys": {
      "n": 10,
      "k": 7
    },
    "1": {
      "base": "6",
      "value": "13444211440455345511"
    },
    "2": {
      "base": "15",
      "value": "aed7015a346d635"
    },
    "3": {
      "base": "15",
      "value": "6aeeb69631c227c"
    },
    "4": {
      "base": "16",
      "value": "e1b5e05623d881f"
    },
    "5": {
      "base": "8",
      "value": "316034514573652620673"
    },
    "6": {
      "base": "3",
      "value": "2122212201122002221120200210011020220200"
    },
    "7": {
      "base": "3",
      "value": "20120221122211000100210021102001201112121"
    },
    "8": {
      "base": "6",
      "value": "20220554335330240002224253"
    },
    "9": {
      "base": "12",
      "value": "45153788322a1255483"
    },
    "10": {
      "base": "7",
      "value": "1101613130313526312514143"
    }
};

let n2 = input2.keys.n;
let k2 = input2.keys.k;
let points2 = [];
for (let i = 1; i <= n2; i++) {
  let base = parseInt(input2[i.toString()].base);
  let value = input2[i.toString()].value;
  let y = toDecimal(value, base);
  points2.push([i, y]);
}
let subset2 = points2.slice(0, k2);
console.log("Secret for Test Case 2:", lagrangeInterpolation(subset2, k2));
