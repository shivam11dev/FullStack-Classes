// ============================================================================
// ASSIGNMENT 6 – Asynchronous JavaScript (all questions in one file)
// Run with:  node assignment6.js
//
// Each question lives inside its own function (so names like `stage` or
// `randomDelay` never clash) and returns a Promise that resolves when that
// question's demo has finished. A small runner at the bottom executes
// Q1 → Q10 one after another so the console output stays readable.
// ============================================================================

// ----------------------------------------------------------------------------
// Q1 – The Startup Morning: Async Coffee Maker
// Three async steps chained with .then(); any failure is caught by .catch().
// ----------------------------------------------------------------------------
function q1CoffeeMaker() {
  // Random delay between 1000 and 2000 ms
  const randomDelay = () => 1000 + Math.random() * 1000;

  // Simulate a random failure (20% chance)
  const maybeFail = (stepName) => {
    if (Math.random() < 0.2) throw new Error(`${stepName} failed!`);
  };

  // Generic step factory: resolves after 1–2 s, or rejects on random failure
  const makeStep = (stepName, logMessage, result) => (input) =>
    new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          maybeFail(stepName);
          console.log(logMessage(input));
          resolve(result);
        } catch (err) {
          reject(err);
        }
      }, randomDelay());
    });

  const boilWater = makeStep("Boiling water", () => "Step 1: Water boiled", "hot water");
  const brewCoffee = makeStep("Brewing coffee", (water) => `Step 2: Coffee brewed with ${water}`, "brewed coffee");
  const pourIntoCup = makeStep("Pouring coffee", (coffee) => `Step 3: Poured ${coffee} into a cup`, "cup of coffee");

  console.log("Starting coffee process...");

  // Promise chaining: each .then() receives the previous step's result
  return boilWater()
    .then(brewCoffee)
    .then(pourIntoCup)
    .then(() => console.log("Coffee ready for the team!"))
    .catch((err) => console.error("Error:", err.message)); // handles failure in ANY step
}

// ----------------------------------------------------------------------------
// Q2 – Task Scheduler: Micro vs Macro Challenge
// ----------------------------------------------------------------------------
function q2TaskScheduler() {
  return new Promise((resolve) => {
    console.log("Start");                                   // synchronous

    setTimeout(() => {                                      // macrotask (task queue)
      console.log("setTimeout callback (macrotask)");
      resolve();                                            // demo finished
    }, 0);

    Promise.resolve().then(() => {                          // microtask (microtask queue)
      console.log("Promise.then callback (microtask)");
    });

    console.log("Synchronous log");                         // synchronous

    console.log("End");                                     // synchronous
  });

  /*
   Output order:
     Start → Synchronous log → End → Promise.then callback → setTimeout callback

   WHY microtasks run before macrotasks:
   1. All synchronous code runs first on the call stack.
   2. When the call stack is empty, the event loop FIRST drains the entire
      microtask queue (promise callbacks, queueMicrotask, etc.).
   3. Only after the microtask queue is empty does the event loop pick ONE
      macrotask (setTimeout, setInterval, I/O...) from the task queue.
   So even with a 0 ms delay, setTimeout waits for a later event-loop turn,
   while the resolved promise's callback runs right after the current script.
  */
}

// ----------------------------------------------------------------------------
// Q3 – Bug Tracker: Callback to Promise Migration
// ----------------------------------------------------------------------------
function q3BugTracker() {
  // Original callback-based version (kept for reference)
  function fetchBugs(callback) {
    setTimeout(() => callback(["UI glitch", "API timeout", "Login failure"]), 1000);
  }

  // Boolean that simulates a random API failure (set to true/false manually to test)
  const simulateFailure = Math.random() < 0.3;

  // Promise-based version
  function getBugs() {
    return new Promise((resolve, reject) => {
      fetchBugs((bugs) => {
        if (simulateFailure) {
          reject(new Error("API request failed: could not fetch bugs"));
        } else {
          resolve(bugs);
        }
      });
    });
  }

  console.log("Fetching bugs...");

  return getBugs()
    .then((bugs) => {
      // Convert to objects so console.table shows neat columns
      console.table(bugs.map((title, index) => ({ ID: index + 1, Bug: title })));
    })
    .catch((err) => console.error("Error:", err.message));
}

// ----------------------------------------------------------------------------
// Q4 – DevOps Delay: Async Timeout Race
// ----------------------------------------------------------------------------
function q4DeploymentRace() {
  // Server promise: resolves after `ms`, may fail randomly (20% chance)
  function deployServer(name, ms) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (Math.random() < 0.2) {
          reject(new Error(`${name} failed to deploy`));
        } else {
          resolve(`${name} responded`);
        }
      }, ms);
    });
  }

  const serverA = () => deployServer("Server A", 2000);
  const serverB = () => deployServer("Server B", 3000);

  // Promise.all: waits for BOTH; rejects as soon as one fails
  const allDone = Promise.all([serverA(), serverB()])
    .then((results) => {
      console.log(results);
      console.log("Deployment completed for all servers");
    })
    .catch((err) => console.error("Promise.all error:", err.message));

  // Promise.race: settles with the FIRST promise to settle
  const raceDone = Promise.race([serverA(), serverB()])
    .then((first) => console.log("Fastest response:", first))
    .catch((err) => console.error("Promise.race error:", err.message));

  return Promise.all([allDone, raceDone]); // both chains have .catch, so this never rejects
}

// ----------------------------------------------------------------------------
// Q5 – Frontend Rush: Avoiding Callback Hell
// Pipeline: design → build → test → deploy → celebrate (1 second each)
// ----------------------------------------------------------------------------
function q5CallbackHell() {
  // ---------- Part 1: nested callbacks (callback hell) ----------
  function stage(name, callback) {
    setTimeout(() => {
      console.log(`Stage done: ${name}`);
      callback();
    }, 1000);
  }

  function runWithCallbacks(done) {
    console.log("--- Callback version ---");
    stage("design", () => {
      stage("build", () => {
        stage("test", () => {
          stage("deploy", () => {
            stage("celebrate", () => {
              done();
            });
          });
        });
      });
    });
  }

  // ---------- Part 2: async/await ----------
  function stagePromise(name) {
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log(`Stage done: ${name}`);
        resolve();
      }, 1000);
    });
  }

  async function runWithAsyncAwait() {
    console.log("--- async/await version ---");
    await stagePromise("design");
    await stagePromise("build");
    await stagePromise("test");
    await stagePromise("deploy");
    await stagePromise("celebrate");
    console.log("Pipeline complete!");
  }

  /*
   Why async/await improves readability:
   - Code reads top to bottom like synchronous code; no pyramid of nesting.
   - Each stage is one flat line, so adding/removing/reordering stages is easy.
   - Errors can be handled with one try/catch instead of checking each callback.
   - Avoids "inversion of control" (handing your continuation to someone else).
  */

  // Run callback version first, then the async/await version
  return new Promise((resolve) => {
    runWithCallbacks(() => {
      console.log("Callback pipeline complete!\n");
      runWithAsyncAwait().then(resolve);
    });
  });
}

// ----------------------------------------------------------------------------
// Q6 – E-Commerce Dashboard: Product Card Fetcher
// Works in Node 18+ (global fetch) and in the browser.
// ----------------------------------------------------------------------------
async function q6ProductFetcher() {
  const API_URL = "https://fakestoreapi.com/products";

  // Bonus: dynamic product cards with document.createElement() (browser only)
  function renderCards(products) {
    const container = document.createElement("div");
    container.style.cssText =
      "display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:16px;padding:16px;";

    products.forEach((p) => {
      const card = document.createElement("div");
      card.style.cssText = "border:1px solid #ddd;border-radius:8px;padding:12px;text-align:center;";

      const img = document.createElement("img");
      img.src = p.image;
      img.alt = p.title;
      img.style.cssText = "height:150px;object-fit:contain;";

      const title = document.createElement("h4");
      title.textContent = p.title;

      const price = document.createElement("p");
      price.textContent = `$${p.price}`;

      card.append(img, title, price);
      container.appendChild(card);
    });

    document.body.appendChild(container);
  }

  try {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const products = await response.json();

    products.forEach((p) => {
      console.log(`Product: ${p.title}`);
      console.log(`Price: $${p.price}`);
      console.log(`Image: ${p.image}\n`);
    });

    if (typeof document !== "undefined") renderCards(products);
  } catch (error) {
    console.error("Failed to load products. Please try again.");
    if (typeof document !== "undefined") {
      const msg = document.createElement("p");
      msg.textContent = "Failed to load products. Please try again.";
      document.body.appendChild(msg);
    }
  }
}

// ----------------------------------------------------------------------------
// Q7 – The Lazy Loader: Promise.allSettled()
// ----------------------------------------------------------------------------
async function q7LazyLoader() {
  function loadProfile() { return new Promise(r => setTimeout(() => r("Profile Loaded"), 2000)); }
  function loadPosts() { return new Promise(r => setTimeout(() => r("Posts Loaded"), 1500)); }
  function loadMessages() { return new Promise(r => setTimeout(() => r("Messages Loaded"), 1000)); }

  // Wrap a loader so it can be made to reject
  const withFailure = (loader, shouldReject, name) =>
    loader().then((value) => {
      if (shouldReject) throw new Error(`${name} failed to load`);
      return value;
    });

  const startTime = Date.now();

  const names = ["Profile", "Posts", "Messages"];
  const loaders = [loadProfile, loadPosts, loadMessages];
  const failIndex = Math.floor(Math.random() * 3); // randomly pick one to reject

  const promises = loaders.map((loader, i) => withFailure(loader, i === failIndex, names[i]));

  // allSettled never rejects; it reports every outcome
  const results = await Promise.allSettled(promises);

  results.forEach((result, i) => {
    if (result.status === "fulfilled") {
      console.log(`✅ ${names[i]} succeeded: ${result.value}`);
    } else {
      console.log(`❌ ${names[i]} failed: ${result.reason.message}`);
    }
  });

  // ~2000 ms (the slowest loader) because all three run in parallel
  console.log(`Total time taken: ${Date.now() - startTime} ms`);
}

// ----------------------------------------------------------------------------
// Q8 – Order Processing Flow: Async Retry Mechanism
// ----------------------------------------------------------------------------
async function q8OrderRetry() {
  // Fails 50% of the time
  function submitOrder() {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (Math.random() < 0.5) resolve("Order submitted");
        else reject(new Error("Network error"));
      }, 500);
    });
  }

  // Tries up to 3 times using a loop + await
  async function processOrder() {
    const MAX_ATTEMPTS = 3;

    for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
      try {
        await submitOrder();
        console.log(`Attempt ${attempt}: Success`);
        return "Order processed"; // stop retrying on success
      } catch (err) {
        console.log(`Attempt ${attempt}: Failed`);
      }
    }

    throw "Order could not be processed"; // all attempts failed
  }

  // Handle the final failure gracefully
  try {
    console.log(await processOrder());
  } catch (error) {
    console.error(error);
  }
}

// ----------------------------------------------------------------------------
// Q9 – Debugging the Event Loop
// ----------------------------------------------------------------------------
function q9EventLoop() {
  /*
   PREDICTED OUTPUT (written before running):
     1. Script start
     2. Script end
     3. Promise callback
     4. Timeout callback

   ACTUAL OUTPUT: matches the prediction.

   EXPLANATION:
   - Synchronous code ("Script start", "Script end") runs first on the call stack.
   - setTimeout hands its callback to the timer API; when the timer expires
     (0 ms) the callback is queued in the MACROTASK queue.
   - The resolved promise's .then() callback is queued in the MICROTASK queue.
   - When the stack empties, the event loop drains ALL microtasks before taking
     the next macrotask. Hence "Promise callback" prints before
     "Timeout callback", even though the timeout delay is 0.
  */
  return new Promise((resolve) => {
    console.log("Script start");
    setTimeout(() => {
      console.log("Timeout callback");
      resolve(); // demo finished
    }, 0);
    Promise.resolve().then(() => console.log("Promise callback"));
    console.log("Script end");
  });
}

// ----------------------------------------------------------------------------
// Q10 – The Final Delivery: Async Pipeline Debugger
// ----------------------------------------------------------------------------
async function q10DeliveryPipeline() {
  // Each step takes a random 1–2 s and may fail (15% chance)
  function createStep(message, failMessage) {
    return function () {
      return new Promise((resolve, reject) => {
        const delay = 1000 + Math.random() * 1000;
        // setTimeout hands the callback to the timer API; the call stack is
        // free meanwhile, so the event loop can run other code while we "wait".
        setTimeout(() => {
          if (Math.random() < 0.15) reject(new Error(failMessage));
          else resolve(message);
        }, delay);
      });
    };
  }

  const takeOrder = createStep("Step 1: Order taken", "Order could not be taken");
  const prepare = createStep("Step 2: Food prepared", "Kitchen failed to prepare food");
  const pack = createStep("Step 3: Package ready", "Packing failed");
  const dispatch = createStep("Step 4: Out for delivery", "Dispatch failed");
  const deliver = createStep("Delivery completed!", "Delivery failed");

  async function runPipeline() {
    console.log("Start Pipeline");
    try {
      // `await` pauses ONLY this async function. The function returns control
      // to the event loop at each await, so the rest of the program keeps
      // running. When the promise settles, its continuation is queued as a
      // microtask and execution resumes on the next line.
      console.log(await takeOrder());
      console.log(await prepare());
      console.log(await pack());
      console.log(await dispatch());
      console.log(await deliver());
    } catch (error) {
      // A rejection at any await jumps straight here, skipping remaining steps.
      console.log("Pipeline failed!");
      console.error("Reason:", error.message);
    }
  }

  const pipelineDone = runPipeline();
  // Prints immediately: runPipeline() yielded to the event loop at its first await
  console.log("(runPipeline() is waiting asynchronously; this line runs right away)");
  await pipelineDone;
}

// ----------------------------------------------------------------------------
// Runner: executes Q1 → Q10 sequentially with a heading before each
// ----------------------------------------------------------------------------
async function main() {
  const questions = [
    ["Q1 – Async Coffee Maker", q1CoffeeMaker],
    ["Q2 – Micro vs Macro Tasks", q2TaskScheduler],
    ["Q3 – Bug Tracker", q3BugTracker],
    ["Q4 – Promise.all vs Promise.race", q4DeploymentRace],
    ["Q5 – Callback Hell vs async/await", q5CallbackHell],
    ["Q6 – Product Card Fetcher", q6ProductFetcher],
    ["Q7 – Promise.allSettled", q7LazyLoader],
    ["Q8 – Retry Mechanism", q8OrderRetry],
    ["Q9 – Event Loop Order", q9EventLoop],
    ["Q10 – Delivery Pipeline", q10DeliveryPipeline],
  ];

  for (const [title, run] of questions) {
    console.log(`\n==================== ${title} ====================`);
    await run();
  }
}

main();
