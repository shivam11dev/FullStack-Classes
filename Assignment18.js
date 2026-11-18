// ============================================================================
// ASSIGNMENT 8 – Array Methods, Classes, Prototypes & Error Handling
// All 9 questions in ONE file.  Run with:  node assignment8.js
//
// Each question lives inside its own function so names never clash. The
// runner at the bottom executes Q1 → Q9 with a heading before each one.
// ============================================================================

// ----------------------------------------------------------------------------
// Q1. Student Result Processing (reduce + Classes)
// ----------------------------------------------------------------------------
function q1StudentResults() {
  class Student {
    constructor(name, marks) {
      this.name = name;
      this.marks = marks;
    }

    // Average of all marks, calculated with reduce()
    calculateAverage() {
      if (this.marks.length === 0) throw new Error(`${this.name} has no marks`);
      const total = this.marks.reduce((sum, mark) => sum + mark, 0);
      return total / this.marks.length;
    }

    // Grade bands: A >= 80, B >= 65, C >= 50, otherwise F
    getGrade() {
      const average = this.calculateAverage();
      if (average >= 80) return "A";
      if (average >= 65) return "B";
      if (average >= 50) return "C";
      return "F";
    }
  }

  const students = [
    new Student("Aarav", [92, 85, 88, 90]),
    new Student("Diya", [70, 62, 68, 71]),
    new Student("Rohan", [35, 48, 42, 40]),
  ];

  students.forEach((student) => {
    console.log(`${student.name}: marks=[${student.marks}] average=${student.calculateAverage().toFixed(2)} grade=${student.getGrade()}`);
  });
}

// ----------------------------------------------------------------------------
// Q2. Online Food Ordering (map + Error Handling)
// ----------------------------------------------------------------------------
function q2FoodOrdering() {
  const menu = [
    { item: "Burger", price: 120 },
    { item: "Pizza", price: 300 },
    { item: "Fries", price: 90 },
    { item: "Coke", price: 60 },
  ];

  function calculateBill(orderItems) {
    // map(): convert each ordered item name into its price (throws if not on the menu)
    const priceList = orderItems.map((orderedName) => {
      const menuEntry = menu.find((entry) => entry.item.toLowerCase() === orderedName.toLowerCase());
      if (!menuEntry) throw new Error(`Invalid item ordered: "${orderedName}" is not on the menu`);
      return menuEntry.price;
    });

    // reduce(): add all prices together
    return priceList.reduce((total, price) => total + price, 0);
  }

  const orders = [
    ["Burger", "Fries", "Coke"],   // valid
    ["Pizza", "Sushi"],            // invalid item
  ];

  orders.forEach((order) => {
    try {
      console.log(`Order [${order.join(", ")}] -> Total bill: ₹${calculateBill(order)}`);
    } catch (error) {
      console.error(`Could not place order [${order.join(", ")}]: ${error.message}`);
    }
  });
}

// ----------------------------------------------------------------------------
// Q3. Product Discount System (constructor function + prototype)
// ----------------------------------------------------------------------------
function q3ProductDiscount() {
  // Constructor function
  function Product(name, price) {
    this.name = name;
    this.price = price;
  }

  // Shared method on the prototype: one copy used by every Product
  Product.prototype.applyDiscount = function (percent) {
    if (percent < 0 || percent > 100) throw new Error("Discount must be between 0 and 100");
    return this.price - (this.price * percent) / 100;
  };

  const products = [
    { product: new Product("Laptop", 60000), discount: 10 },
    { product: new Product("Headphones", 2500), discount: 25 },
    { product: new Product("Keyboard", 1500), discount: 5 },
  ];

  products.forEach(({ product, discount }) => {
    console.log(`${product.name}: ₹${product.price} -> ${discount}% off -> ₹${product.applyDiscount(discount)}`);
  });

  /*
   How abstraction helps:
   The caller only writes product.applyDiscount(10). The formula
   (price - price * percent / 100) and the validation are hidden inside the
   method. If the discount rule changes (e.g. add tax or a cap), only that one
   method changes; every place that uses it keeps working unchanged.
  */
  console.log("(Abstraction: callers just call applyDiscount(); the formula stays hidden in one place.)");
}

// ----------------------------------------------------------------------------
// Q4. Employee Inheritance (runtime polymorphism)
// ----------------------------------------------------------------------------
function q4EmployeeInheritance() {
  class Employee {
    constructor(name, department) {
      this.name = name;
      this.department = department;
    }
    work() {
      return `${this.name} (${this.department}) is doing regular assigned tasks.`;
    }
  }

  class Manager extends Employee {
    // Overrides Employee.work()
    work() {
      return `${this.name} (${this.department}) is managing the team and planning projects.`;
    }
  }

  const staff = [
    new Employee("Asha", "Engineering"),
    new Manager("Vikram", "Engineering"),
    new Employee("Neha", "Design"),
  ];

  // Runtime polymorphism: same call, work(), but the version that runs is chosen
  // at runtime based on the actual object type (Employee vs Manager).
  staff.forEach((person) => console.log(`[${person.constructor.name}] ${person.work()}`));
}

// ----------------------------------------------------------------------------
// Q5. Ride-Sharing Application
// ----------------------------------------------------------------------------
function q5RideSharing() {
  class User {
    constructor(name, rating) {
      this.name = name;
      this.rating = rating;
    }
  }

  class Driver extends User {
    constructor(name, rating, vehicle) {
      super(name, rating);
      this.vehicle = vehicle; // e.g. { model, plate }
    }
  }

  class Trip {
    constructor(fromLocation, toLocation, distance) {
      this.fromLocation = fromLocation;
      this.toLocation = toLocation;
      this.distance = distance;
    }

    // Fare = base fare + rate per km. Validates the distance first.
    calculateFare() {
      const BASE_FARE = 50;
      const RATE_PER_KM = 12;
      if (this.distance === undefined || this.distance === null || typeof this.distance !== "number" || Number.isNaN(this.distance)) {
        throw new Error("Distance is required to calculate the fare");
      }
      if (this.distance < 0) throw new Error("Distance cannot be negative");
      return BASE_FARE + this.distance * RATE_PER_KM;
    }
  }

  const rider = new User("Meera", 4.8);
  const driver = new Driver("Raj", 4.9, { model: "Swift Dzire", plate: "UP85 AB 1234" });
  console.log(`Rider: ${rider.name} (${rider.rating}★) | Driver: ${driver.name} (${driver.rating}★) in ${driver.vehicle.model} [${driver.vehicle.plate}]`);

  const trips = [
    new Trip("Mathura", "Vrindavan", 12),   // valid
    new Trip("Mathura", "Agra", -50),       // negative distance
    new Trip("Mathura", "Delhi"),           // distance missing
  ];

  trips.forEach((trip) => {
    try {
      console.log(`${trip.fromLocation} -> ${trip.toLocation}: fare ₹${trip.calculateFare()}`);
    } catch (error) {
      console.error(`${trip.fromLocation} -> ${trip.toLocation}: Error - ${error.message}`);
    }
  });
}

// ----------------------------------------------------------------------------
// Q6. E-Commerce Inventory System (filter, sort, reduce)
// ----------------------------------------------------------------------------
function q6Inventory() {
  const products = [
    { id: 1, name: "Laptop", category: "Electronics", price: 55000, stock: 4 },
    { id: 2, name: "T-Shirt", category: "Clothing", price: 499, stock: 50 },
    { id: 3, name: "Headphones", category: "Electronics", price: 2500, stock: 3 },
    { id: 4, name: "Jeans", category: "Clothing", price: 1499, stock: 8 },
    { id: 5, name: "Novel", category: "Books", price: 350, stock: 2 },
    { id: 6, name: "Notebook", category: "Books", price: 80, stock: 120 },
  ];

  // 1. filter(): products with stock below the threshold
  function getLowStockProducts(items, threshold = 5) {
    return items.filter((product) => product.stock < threshold);
  }

  // 2. sort(): cheapest first (copy the array so the original isn't changed)
  function sortProductsByPrice(items) {
    return [...items].sort((a, b) => a.price - b.price);
  }

  // 3. reduce(): sum of price * stock
  function calculateTotalInventoryValue(items) {
    return items.reduce((total, product) => total + product.price * product.stock, 0);
  }

  // 4. reduce() + object grouping: { category: [products...] }
  function groupByCategory(items) {
    return items.reduce((groups, product) => {
      if (!groups[product.category]) groups[product.category] = [];
      groups[product.category].push(product);
      return groups;
    }, {});
  }

  console.log("Low stock products (stock < 5):");
  console.table(getLowStockProducts(products).map(({ name, stock }) => ({ name, stock })));

  console.log("Sorted by price (low -> high):");
  console.table(sortProductsByPrice(products).map(({ name, price }) => ({ name, price })));

  console.log(`Total inventory value: ₹${calculateTotalInventoryValue(products)}`);

  const grouped = groupByCategory(products);
  console.log("Grouped by category:");
  Object.entries(grouped).forEach(([category, items]) => {
    console.log(`  ${category}: ${items.map((p) => p.name).join(", ")}`);
  });
}

// ----------------------------------------------------------------------------
// Q7. Banking Application (private fields)
// ----------------------------------------------------------------------------
function q7Banking() {
  class BankAccount {
    #balance; // private: cannot be read or changed from outside the class

    constructor(openingBalance = 0) {
      this.#balance = openingBalance;
    }

    deposit(amount) {
      if (typeof amount !== "number" || amount <= 0) throw new Error("Deposit amount must be a positive number");
      this.#balance += amount;
      return this.#balance;
    }

    withdraw(amount) {
      if (typeof amount !== "number" || amount <= 0) throw new Error("Withdrawal amount must be a positive number");
      if (amount > this.#balance) throw new Error(`Insufficient balance: tried to withdraw ₹${amount}, available ₹${this.#balance}`);
      this.#balance -= amount;
      return this.#balance;
    }

    getBalance() {
      return this.#balance;
    }
  }

  const account = new BankAccount(1000);
  console.log(`Opening balance: ₹${account.getBalance()}`);

  // Valid deposits
  console.log(`Deposit ₹500 -> balance ₹${account.deposit(500)}`);
  console.log(`Deposit ₹250 -> balance ₹${account.deposit(250)}`);

  // Valid withdrawal
  console.log(`Withdraw ₹300 -> balance ₹${account.withdraw(300)}`);

  // Invalid operations, handled with try/catch
  [
    () => account.withdraw(10000),  // insufficient balance
    () => account.deposit(-100),    // negative deposit
  ].forEach((operation) => {
    try {
      operation();
    } catch (error) {
      console.error(`Error: ${error.message}`);
    }
  });

  console.log(`Final balance: ₹${account.getBalance()}`);
  console.log(`Direct access to private field: ${account.balance} (undefined; #balance is hidden)`);
}

// ----------------------------------------------------------------------------
// Q8. Movie Ticket Booking System (inheritance + prototype chain)
// ----------------------------------------------------------------------------
function q8MovieTickets() {
  class MovieTicket {
    constructor(movieName, seatNo, price) {
      this.movieName = movieName;
      this.seatNo = seatNo;
      this.price = price;
    }
  }

  class OnlineTicket extends MovieTicket {
    constructor(movieName, seatNo, price, convenienceFee) {
      super(movieName, seatNo, price);
      this.convenienceFee = convenienceFee;
    }

    getTotalAmount() {
      return this.price + this.convenienceFee;
    }
  }

  // Added AFTER the classes are defined: every MovieTicket, and every
  // OnlineTicket through the prototype chain, can now use it.
  MovieTicket.prototype.printTicket = function () {
    console.log(`🎟  Movie: ${this.movieName} | Seat: ${this.seatNo} | Price: ₹${this.price}`);
  };

  const tickets = [
    new OnlineTicket("Inception", "A5", 250, 30),
    new OnlineTicket("Interstellar", "C12", 300, 40),
  ];

  tickets.forEach((ticket) => {
    ticket.printTicket(); // found by walking up the prototype chain
    console.log(`   Total amount (with convenience fee): ₹${ticket.getTotalAmount()}`);
  });

  // Prove the prototype chain: OnlineTicket.prototype -> MovieTicket.prototype -> Object.prototype
  const first = tickets[0];
  console.log("printTicket is an own property of the object?", Object.hasOwn(first, "printTicket"));
  console.log("printTicket lives on MovieTicket.prototype?", Object.hasOwn(MovieTicket.prototype, "printTicket"));
  console.log("OnlineTicket.prototype's parent is MovieTicket.prototype?",
    Object.getPrototypeOf(OnlineTicket.prototype) === MovieTicket.prototype);
}

// ----------------------------------------------------------------------------
// Q9. Fitness App Analytics
// ----------------------------------------------------------------------------
function q9FitnessAnalytics() {
  class FitnessAnalytics {
    constructor(data) {
      if (!Array.isArray(data) || data.length === 0) throw new Error("Dataset is empty");
      this.data = data;
    }

    // filter(): users with more than 7000 steps
    getActiveUsers() {
      return this.data.filter((entry) => entry.steps > 7000);
    }

    // reduce(): total calories / number of users
    getAverageCalories() {
      const totalCalories = this.data.reduce((sum, entry) => sum + entry.calories, 0);
      return totalCalories / this.data.length;
    }

    // map(): turn each record into a readable message
    getUserSummary() {
      return this.data.map((entry) => `User ${entry.user}: ${entry.steps} steps, ${entry.calories} calories burned`);
    }
  }

  const workoutData = [
    { user: "A", steps: 8000, calories: 300 },
    { user: "B", steps: 12000, calories: 500 },
    { user: "C", steps: 4000, calories: 200 },
  ];

  const analytics = new FitnessAnalytics(workoutData);

  console.log("Active users (steps > 7000):", analytics.getActiveUsers().map((entry) => entry.user).join(", "));
  console.log("Average calories:", analytics.getAverageCalories().toFixed(2));
  console.log("User summary:");
  analytics.getUserSummary().forEach((message) => console.log("  " + message));

  // Empty dataset must throw
  try {
    new FitnessAnalytics([]);
  } catch (error) {
    console.error("Error:", error.message);
  }
}

// ----------------------------------------------------------------------------
// Runner: Q1 → Q9, each with a heading
// ----------------------------------------------------------------------------
const questions = [
  ["Q1 – Student Result Processing", q1StudentResults],
  ["Q2 – Online Food Ordering", q2FoodOrdering],
  ["Q3 – Product Discount System", q3ProductDiscount],
  ["Q4 – Employee Inheritance", q4EmployeeInheritance],
  ["Q5 – Ride-Sharing Application", q5RideSharing],
  ["Q6 – E-Commerce Inventory", q6Inventory],
  ["Q7 – Banking Application", q7Banking],
  ["Q8 – Movie Ticket Booking", q8MovieTickets],
  ["Q9 – Fitness App Analytics", q9FitnessAnalytics],
];

questions.forEach(([title, run]) => {
  console.log(`\n==================== ${title} ====================`);
  run();
});
