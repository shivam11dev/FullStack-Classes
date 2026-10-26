"use strict";
/**
 * JavaScript Practice Lab – Q1 to Q10 in a single file
 * Run all:        node js_assignment.js
 * Pyramid size:   node js_assignment.js 4     (Q6 outer-loop limit, default = 5)
 * Debug in VS Code: open file -> F5 (Node.js). Every `debugger;` below is a breakpoint.
 *   Add watch variables in the "Watch" panel and inspect the "Call Stack" panel.
 *
 * NOTE: The file-level "use strict" applies to everything below. Where a question needs
 * SLOPPY (non-strict) behaviour for comparison, code is run through `new Function(...)`,
 * which always creates a function in sloppy mode unless its body has its own "use strict".
 */

const line = (ch = "=", n = 60) => ch.repeat(n);
const section = (title) => console.log(`\n${line()}\n${title}\n${line()}`);

/* ======================================================================
 * Q1 – Dynamic Data Parser
 * ==================================================================== */
function q1() {
  section("Q1 – Dynamic Data Parser");

  const apiData = ["25", "true", "false", "NaN", " ", "100px", "3.14", null, undefined];
  const show = (v) => (v === null ? "null" : v === undefined ? "undefined" : JSON.stringify(v));

  // Decides whether a raw value is a usable number, and why not if invalid
  function checkNumber(v) {
    if (v === null || v === undefined) return { valid: false, reason: "missing value (null/undefined)" };
    if (String(v).trim() === "") return { valid: false, reason: "blank / whitespace string" };
    const n = Number(v);
    if (Number.isNaN(n)) return { valid: false, reason: "not numeric (NaN)" };
    if (!Number.isFinite(n)) return { valid: false, reason: "infinite value" };
    return { valid: true, number: n };
  }

  const validNumbers = [];
  const invalidEntries = [];

  console.log("Conversion table (Number | Boolean | String):");
  for (let i = 0; i < apiData.length; i++) {
    const raw = apiData[i];
    const asNumber = Number(raw);
    const asBoolean = Boolean(raw);
    const asString = String(raw);
    console.log(
      `  [${i}] raw=${show(raw).padEnd(9)} -> Number=${String(asNumber).padEnd(5)} ` +
        `Boolean=${String(asBoolean).padEnd(5)} String=${JSON.stringify(asString)}`
    );

    const result = checkNumber(raw);
    if (result.valid) validNumbers.push({ index: i, raw, value: result.number });
    else invalidEntries.push({ index: i, raw, reason: result.reason });
  }

  console.log("\nDetailed report:");
  for (const item of apiData.keys()) {
    const raw = apiData[item];
    const r = checkNumber(raw);
    const tag = r.valid ? "✔ VALID  " : "✘ INVALID";
    const detail = r.valid ? `number = ${r.number}` : `skipped -> ${r.reason}`;
    console.log(`  ${tag} | index ${item} | ${show(raw).padEnd(9)} | ${detail}`);
  }

  console.log("\nValid numeric array  :", validNumbers.map((x) => x.value));
  console.log("Invalid entries array:");
  for (const bad of invalidEntries) {
    console.log(`  - index ${bad.index}: ${show(bad.raw)} (${bad.reason})`);
  }

  const sum = validNumbers.reduce((acc, x) => acc + x.value, 0);
  console.log(`\nSummary: ${validNumbers.length} valid, ${invalidEntries.length} invalid, sum = ${sum}`);
  console.log("Gotcha: Boolean(\"false\") is true (non-empty string); Number(null) is 0 but we reject null anyway.");
}

/* ======================================================================
 * Q2 – Employee Bonus Calculator ("use strict" is active file-wide)
 * ==================================================================== */
function q2() {
  section("Q2 – Employee Bonus Calculator");

  const employees = [
    { name: "Amit", salary: "45000", years: "5" },
    { name: "Sara", salary: "38000", years: "2" },
    { name: "Kiran", salary: "52000", years: "7" },
  ];
  // Extra bad records, only to prove the try...catch works
  const badRecords = [
    { name: "Ravi", salary: "abc", years: "4" }, // conversion error
    { name: "Ghost", salary: "30000" },          // missing property
  ];

  function calculateBonus(emp) {
    for (const prop of ["name", "salary", "years"]) {
      if (!(prop in emp)) throw new Error(`Missing property "${prop}" for ${emp.name ?? "unknown employee"}`);
    }
    const salary = Number(emp.salary);
    const years = Number(emp.years);
    if (Number.isNaN(salary) || Number.isNaN(years)) {
      throw new TypeError(`Cannot convert salary/years to number for ${emp.name}`);
    }
    const bonus = years > 3 ? salary * 0.1 : salary * 0.05;
    return { name: emp.name, salary, years, bonus, total: salary + bonus };
  }

  const fmt = (n) => n.toLocaleString("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 });

  for (const emp of [...employees, ...badRecords]) {
    try {
      const r = calculateBonus(emp);
      console.log(
        `Employee: ${r.name.padEnd(6)} | Salary: ${fmt(r.salary)} | Years: ${r.years} | ` +
          `Bonus: ${fmt(r.bonus)} (${r.years > 3 ? "10%" : "5%"}) | Total: ${fmt(r.total)}`
      );
    } catch (err) {
      console.log(`  ✘ ${err.name}: ${err.message}`);
    }
  }

  // Strict-mode proof: an implicit global is rejected
  try {
    // eslint-disable-next-line no-undef
    new Function('"use strict"; bonusRate = 0.1;')();
  } catch (e) {
    console.log(`Strict mode blocks implicit globals -> ${e.name}: ${e.message}`);
  }
}

/* ======================================================================
 * Q3 – Transaction Validator
 * ==================================================================== */
class TransactionError extends Error {
  constructor(message, category) {
    super(message);
    this.name = new.target.name;
    this.category = category;
  }
}
class NegativeAmountError extends TransactionError {
  constructor(id, amount) { super(`Transaction ${id} has negative amount (${amount})`, "negative"); }
}
class MissingFieldError extends TransactionError {
  constructor(field, tx) { super(`Transaction ${JSON.stringify(tx)} is missing "${field}"`, "missing"); }
}
class NullTransactionError extends TransactionError {
  constructor(index) { super(`Entry at index ${index} is null`, "null"); }
}

function q3() {
  section("Q3 – Transaction Validator");

  const transactions = [{ id: 1, amount: 2000 }, { id: 2, amount: -500 }, { id: 3 }, null];

  function validate(tx, index) {
    if (tx === null || tx === undefined) throw new NullTransactionError(index);
    if (tx.id === undefined) throw new MissingFieldError("id", tx);
    if (tx.amount === undefined) throw new MissingFieldError("amount", tx);
    if (tx.amount < 0) throw new NegativeAmountError(tx.id, tx.amount);
    return tx;
  }

  const valid = [];
  const invalid = [];
  const byType = { negative: [], missing: [], null: [] };

  for (let i = 0; i < transactions.length; i++) {
    const tx = transactions[i];
    // 🔴 BREAKPOINT: watch `i`, `tx`, `valid`, `invalid` here
    debugger;
    try {
      valid.push(validate(tx, i));
    } catch (err) {
      if (err instanceof TransactionError) {
        invalid.push({ index: i, type: err.name, message: err.message });
        byType[err.category].push(err.message);
      } else {
        throw err; // unexpected bug – don't hide it
      }
    }
  }

  console.log("Valid transactions:", valid);
  console.log("Invalid transactions:");
  invalid.forEach((e) => console.log(`  ✘ [${e.index}] ${e.type}: ${e.message}`));
  console.log("\nCategorized errors:", byType);
  console.log(
    `\nFINAL REPORT -> Total: ${transactions.length} | Successful: ${valid.length} | Failed: ${invalid.length}`
  );
}

/* ======================================================================
 * Q4 – Debugging Mystery
 * ==================================================================== */
function q4() {
  section("Q4 – Debugging Mystery");

  // 1. Why does it throw?
  try {
    new Function(`"use strict";
      function showMessage() { greeting = "Welcome"; console.log(greeting); }
      showMessage();`)();
  } catch (e) {
    console.log(`1) Strict mode -> ${e.name}: ${e.message}`);
    console.log("   Assigning to a name that was never declared would silently create a GLOBAL in sloppy");
    console.log("   mode. Strict mode turns that typo-prone behaviour into a ReferenceError.");
  }

  // Sloppy comparison
  new Function(`function showMessage() { greeting = "Welcome"; console.log("   sloppy mode works and leaks global:", greeting); }
                showMessage();`)();
  delete globalThis.greeting; // clean up the accidental global

  // 2. Fix
  function showMessageFixed() {
    let greeting = "Welcome"; // declared -> scoped to this function only
    // 🔴 BREAKPOINT: add `greeting` to WATCH; Call Stack shows: showMessageFixed <- q4 <- (anonymous)
    debugger;
    console.log("2) Fixed:", greeting);
  }
  showMessageFixed();
  console.log("   typeof greeting outside:", typeof globalThis.greeting, "-> no leak, scope is the function.");
}

/* ======================================================================
 * Q5 – Hoisting Lab: The Sequence Trap
 * ==================================================================== */
function q5() {
  section("Q5 – Hoisting Lab");

  // Original code (wrapped so the lab can continue afterwards)
  function original() {
    console.log("score ->", score);   // undefined (var hoisted, value not yet assigned)
    announce();                       // works (function declaration fully hoisted)
    var score = 50;
    function announce() { console.log("Game started"); }
    let status = "ready";
    startGame();                      // works because `status` is initialised BEFORE this call
    function startGame() { console.log("status ->", status); }
  }
  console.log("-- Original (predicted: undefined / Game started / ready) --");
  original();

  console.log(`
1) Memory state of each hoisted element:
   score      (var)       -> allocated, initialised to undefined at scope start
   announce   (function)  -> allocated AND initialised with its full body
   status     (let)       -> allocated but UNINITIALISED = Temporal Dead Zone until its line runs
   startGame  (function)  -> allocated AND initialised with its full body`);

  // The real trap: calling a function that reads a let variable before the let line runs
  function trap() {
    try {
      startGame();                    // ReferenceError: Cannot access 'status' before initialization
    } catch (e) {
      console.log(`   Trap -> ${e.name}: ${e.message}`);
    }
    let status = "ready";
    function startGame() { return status; }
  }
  trap();

  // 2) Fixed order
  function fixed() {
    let status = "ready";
    var score = 50;
    function announce() { console.log("Game started"); }
    function startGame() { console.log("status ->", status); }
    console.log("2) Fixed -> score:", score);
    announce();
    startGame();
  }
  fixed();

  // 3) Arrow functions: they are values stored in variables, so they are NOT hoisted as callable
  console.log("3) Arrow-function comparison:");
  try {
    announceArrowConst();             // const -> TDZ
  } catch (e) { console.log(`   const arrow before definition -> ${e.name}: ${e.message}`); }
  const announceArrowConst = () => console.log("Game started (arrow)");

  try {
    announceArrowVar();               // var -> hoisted as undefined
  } catch (e) { console.log(`   var arrow before definition   -> ${e.name}: ${e.message}`); }
  var announceArrowVar = () => console.log("Game started (arrow)");

  announceArrowConst();
  announceArrowVar();
}

/* ======================================================================
 * Q6 – Pyramid Pattern Generator
 * ==================================================================== */
function q6() {
  section("Q6 – Pyramid Pattern Generator");

  // Outer loop limit from user input: node js_assignment.js 4   (default = 5)
  const parsed = parseInt(process.argv[2], 10);
  const rows = Number.isInteger(parsed) && parsed > 0 ? parsed : 5;
  console.log(`Rows = ${rows} (${Number.isInteger(parsed) && parsed > 0 ? "from user input" : "default"})\n`);

  function pyramidLet(n) {
    for (let i = 1; i <= n; i++) {
      let row = "";
      for (let j = 1; j <= i; j++) row += "* ";
      console.log(row.trimEnd());
    }
  }
  pyramidLet(rows);

  // 1) Replace let with var
  function pyramidVar(n) {
    const closuresVar = [];
    for (var i = 1; i <= n; i++) {
      var row = "";
      for (var j = 1; j <= i; j++) row += "* ";
      closuresVar.push(() => i);       // captures the SAME i
    }
    return { leaked: { i, j, row }, closuresVar };
  }
  const v = pyramidVar(rows);
  console.log("\nWith var -> output is identical, but variables LEAK out of the loops:", v.leaked);
  console.log("var closures all see:", v.closuresVar.map((f) => f()));

  const closuresLet = [];
  for (let i = 1; i <= rows; i++) closuresLet.push(() => i);
  console.log("let closures each see:", closuresLet.map((f) => f()), "(new binding per iteration)");

  // 2) Debugging: step through; watch i, j, row
  function pyramidDebug(n) {
    for (let i = 1; i <= n; i++) {
      let row = "";
      for (let j = 1; j <= i; j++) {
        // 🔴 BREAKPOINT: watch i, j, row -> with `var` they are the same memory slots reused on every pass
        debugger;
        row += "* ";
      }
    }
  }
  void pyramidDebug; // call pyramidDebug(rows) when you want to step through it

  // 4) Strict mode catches an undeclared loop variable
  try {
    new Function('"use strict"; for (k = 0; k < 3; k++) {}')();
  } catch (e) {
    console.log(`\nStrict mode, undeclared loop var -> ${e.name}: ${e.message}`);
  }
  new Function("for (k = 0; k < 3; k++) {} console.log('Sloppy mode silently created global k =', k);")();
  delete globalThis.k;
}

/* ======================================================================
 * Q7 – Smart Calculator
 * ==================================================================== */
class InvalidOperationError extends Error {
  constructor(op) { super(`Invalid operation: "${op}"`); this.name = "InvalidOperationError"; }
}
class DivideByZeroError extends Error {
  constructor() { super("Cannot divide by zero"); this.name = "DivideByZeroError"; }
}
class NegativeRootError extends Error {
  constructor(n) { super(`Cannot take square root of negative number (${n})`); this.name = "NegativeRootError"; }
}

function q7() {
  section("Q7 – Smart Calculator");

  const operations = ["add", "divide", "power", "root", "subtract"];
  const num1 = 25, num2 = 0;

  function calculate(op, a, b) {
    switch (op) {
      case "add":      return a + b;
      case "subtract": return a - b;
      case "power":    return a ** b;
      case "divide":
        if (b === 0) throw new DivideByZeroError();
        return a / b;
      case "root":     // square root of the first operand
        if (a < 0) throw new NegativeRootError(a);
        return Math.sqrt(a);
      default:
        throw new InvalidOperationError(op);
    }
  }

  const runBatch = (label, ops, a, b) => {
    console.log(`\n${label} (num1=${a}, num2=${b})`);
    const results = [];
    for (const op of ops) {
      try {
        results.push({ op, status: "OK", output: calculate(op, a, b) });
      } catch (err) {
        results.push({ op, status: "ERROR", output: `${err.name}: ${err.message}` });
      }
    }
    for (const r of results) {
      console.log(`  ${r.status === "OK" ? "✔" : "✘"} ${r.op.padEnd(9)} -> ${r.output}`);
    }
    const ok = results.filter((r) => r.status === "OK").length;
    console.log(`  Summary: ${ok} succeeded, ${results.length - ok} failed`);
  };

  runBatch("Main run", operations, num1, num2);
  runBatch("Extra: negative root + unknown operation", ["root", "modulo"], -9, 3);
}

/* ======================================================================
 * Q8 – Strict Mode Showdown
 * ==================================================================== */
function q8() {
  section("Q8 – Strict Mode Showdown");

  const tests = {
    "duplicate parameter names  function demo(a, a)": 'function demo(a, a) { return a; } return demo(5, 10);',
    "undeclared assignment      total = 10":           'function demo() { total = 10; return total; } return demo();',
    "delete a variable          delete total":         'var total = 10; function demo() { return delete total; } return demo();',
  };

  for (const [label, body] of Object.entries(tests)) {
    let sloppy, strict;
    try { sloppy = `OK -> ${new Function(body)()}`; } catch (e) { sloppy = `${e.name}: ${e.message}`; }
    delete globalThis.total; // sloppy run leaks a global; remove it so the strict run is a fair test
    try { strict = `OK -> ${new Function('"use strict";' + body)()}`; } catch (e) { strict = `${e.name}: ${e.message}`; }
    console.log(`\n${label}\n  sloppy: ${sloppy}\n  strict: ${strict}`);
  }
  delete globalThis.total;

  console.log(`
3) Why strict mode forbids these:
   - demo(a, a): the second 'a' silently shadows the first, hiding a bug -> SyntaxError.
   - total = 10: a typo'd/undeclared name would create an accidental global -> ReferenceError.
   - delete total: variables/bindings are not deletable; only object properties are -> SyntaxError.`);

  // 4) Correct ES6 version
  function demo(a, b) {
    let total = 10;                        // properly declared, block/function scoped
    const config = { total };              // objects: delete is legal on properties
    delete config.total;
    return a + b + total;
  }
  const demoArrow = (a, b, total = 10) => a + b + total; // default param instead of globals
  console.log("\n4) Correct version -> demo(5, 10):", demo(5, 10), "| arrow:", demoArrow(5, 10));
}

/* ======================================================================
 * Q9 – JSON Audit
 * ==================================================================== */
function q9() {
  section("Q9 – JSON Audit");

  const rawData = [
    '{"user":"Alex","age":25}',
    '{"id":2}',
    '{invalid}',
    '{"user":"Mina","age":"22"}',
  ];
  const bonusExtra = '{"user":"Teen","age":"15"}'; // only to demo the under-18 filter

  const requiredKeys = ["user", "age"];
  const clean = [];
  const errors = [];

  function audit(list) {
    for (let i = 0; i < list.length; i++) {
      const lineNo = i + 1;
      try {
        // 🔴 BREAKPOINT: step over JSON.parse on line 3 and watch control jump to `catch`
        debugger;
        const obj = JSON.parse(list[i]);
        const missing = requiredKeys.filter((k) => !(k in obj));
        if (missing.length) throw new Error(`Missing key(s): ${missing.join(", ")}`);
        clean.push(obj);
      } catch (err) {
        const kind = err instanceof SyntaxError ? "Invalid JSON" : "Validation";
        errors.push({ line: lineNo, kind, message: err.message });
        console.log(`  ✘ Line ${lineNo}: ${kind} -> ${err.message}`);
      } finally {
        // runs after try OR catch – shows the control flow
      }
    }
  }

  audit([...rawData, bonusExtra]);

  console.log("\nClean array:", clean);
  console.log(`Errors logged: ${errors.length}`, errors);

  // Bonus: age -> Number, filter under-18
  const adults = clean
    .map((u) => ({ ...u, age: Number(u.age) }))
    .filter((u) => u.age >= 18);
  console.log("\nBonus – ages converted to Number, under-18 removed:", adults);
}

/* ======================================================================
 * Q10 – Nested Hoisting and Closures
 * ==================================================================== */
function q10() {
  section("Q10 – Nested Hoisting and Closures");

  function outer() {
    console.log("outer count (before assignment):", count); // undefined
    var count = 5;
    function inner() {
      console.log("inner count (before assignment):", count); // undefined – inner has ITS OWN var count
      var count = 10;
    }
    inner();
    console.log("outer count after inner() runs:", count);   // 5 – untouched by inner
  }
  console.log("1) Prediction: undefined, undefined (+ 5 at the end)");
  outer();

  console.log(`
2) Separate memory contexts (each call creates its own execution context):
   outer EC : { count: undefined -> 5, inner: <function> }
   inner EC : { count: undefined -> 10 }   <- shadows outer's count, so the outer 5 is never read
   Because inner declares 'var count', the name is resolved locally (undefined), not through the closure.`);

  // 3) Arrow version
  function outerArrow() {
    console.log("outerArrow count:", count);                 // undefined
    var count = 5;
    const inner = () => {
      console.log("arrow inner count:", count);              // still undefined: var hoisting is the same
      var count = 10;
    };
    inner();                                                  // works – defined before the call

    try {
      later();                                                // const arrow is NOT hoisted callable
    } catch (e) { console.log(`   arrow called early -> ${e.name}: ${e.message}`); }
    const later = () => "ok";
  }
  console.log("\n3) Arrow version:");
  outerArrow();
  console.log("   Differences: same var hoisting INSIDE the body, but the arrow itself is a const value");
  console.log("   (TDZ before its line), unlike a function declaration, which is hoisted with its body.");
  console.log("   Arrows also lack their own `this`/`arguments`.");

  // 4) Debug session
  function outerDebug() {
    var count = 5;
    function inner() {
      // 🔴 BREAKPOINT: Call Stack (top -> bottom): inner <- outerDebug <- q10 <- (main module)
      // Scope panel: "Local" = inner's count (undefined), "Closure (outerDebug)" = count 5 (shadowed)
      debugger;
      var count = 10;
      return count;
    }
    return inner();
  }
  console.log("\n4) Debug call-stack flow: main -> q10() -> outerDebug() -> inner(). Returned:", outerDebug());
}

/* ======================================================================
 * Run everything
 * ==================================================================== */
[q1, q2, q3, q4, q5, q6, q7, q8, q9, q10].forEach((fn) => {
  try {
    fn();
  } catch (err) {
    console.error(`Unexpected failure in ${fn.name}:`, err);
  }
});
console.log(`\n${line()}\nAll sections finished.\n${line()}`);
