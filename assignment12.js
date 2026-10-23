// ============================================================
// ASSIGNMENT 2 - All Questions in a Single File
// Run with: node assignment2.js   (or paste into browser console)
// ============================================================

// Helper to print a clear section heading
function heading(title) {
  console.log("\n==================================================");
  console.log(title);
  console.log("==================================================");
}

// ------------------------------------------------------------
// Q1. Scope Conflict Resolver
// ------------------------------------------------------------
// Global variable - visible everywhere in the file
let bonus = 5000;

function calculateSalary(isPermanent) {
  // Local variables - exist only inside this function
  const salary = 40000;
  let totalSalary = salary;

  // Add the global bonus only for permanent employees
  if (isPermanent) {
    totalSalary += bonus;
  }

  console.log(`isPermanent = ${isPermanent} -> Total salary: ${totalSalary}`);
}

function q1() {
  heading("Q1. Scope Conflict Resolver");
  calculateSalary(true);   // salary + global bonus
  calculateSalary(false);  // salary only

  // Changing isPermanent (a local value) never changes the global variable
  console.log(`Global bonus after both calls: ${bonus}`);

  // Local variables are not visible outside the function
  console.log(`Is 'salary' accessible outside? ${typeof salary !== "undefined"}`);
}

// ------------------------------------------------------------
// Q2. String Manipulation Report
// ------------------------------------------------------------
function q2() {
  heading("Q2. String Manipulation Report");

  const productName = "  wireless headphones PRO  ";

  const cleanedTitle = productName
    .trim()                                  // remove extra spaces
    .toLowerCase()                           // convert to lowercase
    .split(" ")                              // break into words
    .map(word => word.charAt(0).toUpperCase() + word.slice(1)) // capitalize each word
    .join(" ")                               // join words back
    .replace("Pro", "Pro Edition");          // replace "pro" with "Pro Edition"

  console.log(`Original : "${productName}"`);
  console.log(`Cleaned  : "${cleanedTitle}"`);
  console.log(`Length   : ${cleanedTitle.length}`);
}

// ------------------------------------------------------------
// Q3. Math Utility Dashboard
// ------------------------------------------------------------
function q3() {
  heading("Q3. Math Utility Dashboard");

  const x = 16.75;
  const rounded = Math.round(x);
  const squareRoot = Math.sqrt(x);
  const power = Math.pow(x, 3);
  const randomNum = Math.floor(Math.random() * 41) + 10; // 10 to 50

  console.log(`
Math Summary for x = ${x}
-------------------------
Rounded value : ${rounded}
Square root   : ${squareRoot.toFixed(4)}
Power (x^3)   : ${power.toFixed(4)}
Random (10-50): ${randomNum}`);
}

// ------------------------------------------------------------
// Q4. Array Performance Analyzer
// ------------------------------------------------------------
function q4() {
  heading("Q4. Array Performance Analyzer");

  // 8 random scores between 30 and 100
  const scores = Array.from({ length: 8 }, () => Math.floor(Math.random() * 71) + 30);

  const highest = Math.max(...scores);
  const lowest = Math.min(...scores);
  const total = scores.reduce((sum, score) => sum + score, 0); // reduce for sum
  const average = total / scores.length;
  const passedStudents = scores.filter(score => score >= 50); // filter for passes
  const grades = scores.map(score => (score >= 50 ? "Pass" : "Fail")); // map for status

  console.log(`
Scores          : ${scores.join(", ")}
Status          : ${grades.join(", ")}
Highest score   : ${highest}
Lowest score    : ${lowest}
Average score   : ${average.toFixed(2)}
Students passed : ${passedStudents.length} out of ${scores.length}`);
}

// ------------------------------------------------------------
// Q5. Boolean Logic Access System
// ------------------------------------------------------------
function checkSecurity(isDoorLocked, isWindowClosed, isAlarmOn, isOwnerInside) {
  // Access granted only when alarm is on, door and window are closed,
  // and the owner is inside.
  // (Door "closed" is represented by isDoorLocked being true.)
  const isSecure = isAlarmOn && isDoorLocked && isWindowClosed && isOwnerInside;

  console.log(
    `Door locked: ${isDoorLocked}, Window closed: ${isWindowClosed}, ` +
    `Alarm on: ${isAlarmOn}, Owner inside: ${isOwnerInside} -> ${isSecure ? "Secure" : "Unsafe"}`
  );
}

function q5() {
  heading("Q5. Boolean Logic Access System");

  //          door   window alarm  owner
  checkSecurity(true,  true,  true,  true);   // all conditions met
  checkSecurity(false, true,  true,  true);   // door unlocked
  checkSecurity(true,  false, true,  true);   // window open
  checkSecurity(true,  true,  false, true);   // alarm off
  checkSecurity(true,  true,  true,  false);  // owner not inside
  checkSecurity(false, false, false, false);  // everything off

  // Example using ! and ||: unsafe if any condition fails
  const door = true, windowClosed = true, alarm = true, owner = false;
  const isUnsafe = !door || !windowClosed || !alarm || !owner;
  console.log(`Using ! and || -> Is unsafe? ${isUnsafe}`);
}

// ------------------------------------------------------------
// Q6. Event-Based Counter Simulation
// ------------------------------------------------------------
function q6() {
  heading("Q6. Event-Based Counter Simulation");

  let count = 0;

  function increment() {
    count++;
    console.log(`Increment clicked -> count = ${count}`);
  }

  function decrement() {
    count--;
    console.log(`Decrement clicked -> count = ${count}`);
  }

  // Nested function: it can read and update 'count' from the outer
  // function scope (closure), showing function scope in action.
  function resetAndAdd(amount) {
    function applyChange() {
      count = 0;       // updates the outer 'count'
      count += amount; // still the same outer variable
    }
    applyChange();
    console.log(`Nested function set count = ${count}`);
  }

  // Simulate click events
  increment();
  increment();
  increment();
  decrement();
  resetAndAdd(10);
  decrement();
}

// ------------------------------------------------------------
// Q7. Customer Feedback Processor
// ------------------------------------------------------------
function q7() {
  heading("Q7. Customer Feedback Processor");

  const feedback = "Great product! Fast delivery and amazing sound quality!";

  const wordCount = feedback.split(" ").length;
  const lowerFeedback = feedback.toLowerCase();
  const hasNegativeWords = lowerFeedback.includes("bad") || lowerFeedback.includes("poor");

  console.log(`Feedback   : "${feedback}"`);
  console.log(`Word count : ${wordCount}`);

  if (!hasNegativeWords) {
    console.log("Result     : Positive Feedback");
  } else {
    console.log("Result     : Needs Improvement");
  }
}

// ------------------------------------------------------------
// Q8. Dynamic Discount Evaluator
// ------------------------------------------------------------
function calculateCartTotal(cart) {
  const originalTotal = cart.reduce((sum, product) => sum + product.price, 0);
  const discountedItems = [];

  // Loop through each product and apply its category discount
  for (const product of cart) {
    let discountRate = 0;

    if (product.category === "electronics") {
      discountRate = 0.10;
    } else if (product.category === "fashion") {
      discountRate = 0.05;
    }

    const finalPrice = product.price - product.price * discountRate;
    discountedItems.push({ ...product, discountRate, finalPrice });
    console.log(`${product.item}: ${product.price} - ${discountRate * 100}% = ${finalPrice}`);
  }

  // Sum the discounted prices using reduce()
  let finalTotal = discountedItems.reduce((sum, product) => sum + product.finalPrice, 0);

  // Extra 5% off if the original cart value is above 50000
  if (originalTotal > 50000) {
    finalTotal = finalTotal * 0.95;
    console.log("Cart value > 50000: extra 5% discount applied");
  }

  console.log(`Original total: ${originalTotal}`);
  console.log(`Final total   : ${finalTotal}`);
}

function q8() {
  heading("Q8. Dynamic Discount Evaluator");

  const cart = [
    { item: "Laptop", category: "electronics", price: 45000 },
    { item: "Shoes", category: "fashion", price: 2500 },
    { item: "Book", category: "education", price: 600 }
  ];

  console.log("--- Given cart ---");
  calculateCartTotal(cart);

  // Extra test: a bigger cart to trigger the 5% overall discount
  console.log("\n--- Bigger cart (test extra discount) ---");
  calculateCartTotal([
    ...cart,
    { item: "Phone", category: "electronics", price: 20000 }
  ]);
}

// ------------------------------------------------------------
// Q9. Odd-Even Number Analyzer
// ------------------------------------------------------------
function q9() {
  heading("Q9. Odd-Even Number Analyzer");

  const numbers = [];
  const results = [];

  // Fill the array with numbers 1-30 using a loop
  for (let i = 1; i <= 30; i++) {
    numbers.push(i);
  }

  // Classify each number
  for (const num of numbers) {
    if (num % 3 === 0 && num % 5 === 0) {
      results.push("FizzBuzz");
    } else if (num % 2 === 0) {
      results.push("Even");
    } else {
      results.push("Odd");
    }
  }

  console.log("Results array:", results);
  numbers.forEach((num, index) => console.log(`${num} -> ${results[index]}`));
}

// ------------------------------------------------------------
// Q10. Departmental Employee Evaluator
// ------------------------------------------------------------
function q10() {
  heading("Q10. Departmental Employee Evaluator");

  const departments = [
    ["HR", 72],
    ["Finance", 88],
    ["Tech", 95],
    ["Support", 63]
  ];

  for (let i = 0; i < departments.length; i++) {
    const name = departments[i][0];
    const score = departments[i][1];
    let rating;

    if (score >= 90) {
      rating = "Excellent";
    } else {
      if (score >= 75) {
        rating = "Good";
      } else {
        if (score >= 60) {
          rating = "Average";
        } else {
          rating = "Needs Improvement";
        }
      }
    }

    console.log(`${name} (${score}) -> ${rating}`);
  }
}

// ------------------------------------------------------------
// Run all questions
// ------------------------------------------------------------
q1();
q2();
q3();
q4();
q5();
q6();
q7();
q8();
q9();
q10();
