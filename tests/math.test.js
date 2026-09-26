function add(a, b) {
  return a + b;
}

const result = add(3, 3);

if (result !== 5) {
  throw new Error("Addition test failed");
}

console.log("Addition test passed");
