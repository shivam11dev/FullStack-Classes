/*
 * ASSIGNMENT 4 - All questions in a single file (core JavaScript ES6+, no frameworks)
 *
 * HOW TO RUN
 *   - Node.js : node assignment4.js
 *               (runs the console-based parts: Q1, Q3, Q6, Q9 and the logic checks)
 *   - Browser : create an empty index.html containing
 *                 <body><script src="assignment4.js"></script></body>
 *               and open it. All forms (Q2, Q4, Q5, Q7, Q8) plus the
 *               library search (Q3) are built dynamically. Open the console (F12)
 *               to see the console output of the other questions.
 */

const IS_BROWSER = typeof document !== "undefined";

/* ======================================================================
 * Shared helpers (used by the form-based questions)
 * ==================================================================== */

// Print a heading in the console so each question's output is easy to find.
function logHeading(text) {
  console.log("\n" + "=".repeat(60));
  console.log(text);
  console.log("=".repeat(60));
}

// Create a titled <section> on the page for a question (browser only).
function createSection(title) {
  const section = document.createElement("section");
  section.style.cssText =
    "max-width:480px;margin:20px auto;padding:16px;border:1px solid #ccc;" +
    "border-radius:8px;font-family:Arial,sans-serif;";
  const h2 = document.createElement("h2");
  h2.textContent = title;
  h2.style.fontSize = "18px";
  section.appendChild(h2);
  document.body.appendChild(section);
  return section;
}

// Create a labelled input with an empty error message line under it.
function createField(labelText, type, name) {
  const wrapper = document.createElement("div");
  wrapper.style.marginBottom = "12px";

  const label = document.createElement("label");
  label.textContent = labelText;
  label.style.display = "block";

  const input = document.createElement("input");
  input.type = type;
  input.name = name;
  input.style.cssText = "width:100%;padding:6px;box-sizing:border-box;border:2px solid #999;";

  const error = document.createElement("small");
  error.style.cssText = "color:red;display:block;min-height:14px;";

  wrapper.append(label, input, error);
  return { wrapper, input, error };
}

// Red border + message when invalid, green border when valid.
function setFieldState(field, isValid, message) {
  field.input.style.borderColor = isValid ? "green" : "red";
  field.error.textContent = isValid ? "" : message;
}

// Create a standard submit button.
function createButton(text) {
  const btn = document.createElement("button");
  btn.type = "submit";
  btn.textContent = text;
  btn.style.cssText = "padding:8px 16px;cursor:pointer;";
  return btn;
}

/* ======================================================================
 * Q1: E-Commerce Product Manager (Classes + Objects)
 * ==================================================================== */

class Product {
  constructor(id, name, price, category) {
    this.id = id;
    this.name = name;
    this.price = price;
    this.category = category;
  }

  // Reduce the price by the given percentage (e.g. 10 => 10% off).
  applyDiscount(percent) {
    this.price = this.price - (this.price * percent) / 100;
    return this.price;
  }

  // Return a nicely formatted description of the product.
  getDetails() {
    return `#${this.id} | ${this.name} | ${this.category} | Rs. ${this.price.toFixed(2)}`;
  }
}

function runQ1() {
  logHeading("Q1: E-Commerce Product Manager");

  const products = [
    new Product(1, "Laptop", 55000, "Electronics"),
    new Product(2, "Mouse", 599, "Accessories"),
    new Product(3, "Headphones", 2499, "Electronics"),
    new Product(4, "Notebook", 120, "Stationery"),
    new Product(5, "Office Chair", 7999, "Furniture"),
    new Product(6, "USB Cable", 299, "Accessories"),
  ];

  console.log("All products:");
  products.forEach((p) => console.log(p.getDetails()));

  // Apply a 10% discount to one product to demonstrate the method.
  products[0].applyDiscount(10);
  console.log("\nAfter 10% discount on Laptop:");
  console.log(products[0].getDetails());

  // Filter products with price > 1000.
  const expensive = products.filter((p) => p.price > 1000);
  console.log("\nProducts with price > 1000:");
  expensive.forEach((p) => console.log(p.getDetails()));
}

/* ======================================================================
 * Q2: Student Form Validator (Forms + RegExp)
 * ==================================================================== */

// Validation rules: regular expression + error message for each field.
const STUDENT_RULES = {
  name: { regex: /^[A-Za-z]+(?: [A-Za-z]+)*$/, message: "Name must contain only alphabets." },
  email: { regex: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Enter a valid email (example@domain.com)." },
  phone: { regex: /^\d{10}$/, message: "Phone must be exactly 10 digits." },
  // Lookaheads: at least one uppercase, one digit, one special character.
  password: {
    regex: /^(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).+$/,
    message: "Password needs 1 uppercase letter, 1 number and 1 special character.",
  },
};

function buildQ2() {
  const section = createSection("Q2: Student Registration Form");
  const form = document.createElement("form");
  form.noValidate = true;

  const fields = {
    name: createField("Name", "text", "name"),
    email: createField("Email", "text", "email"),
    phone: createField("Phone", "text", "phone"),
    password: createField("Password", "password", "password"),
  };

  // Validate one field against its rule; returns true if valid.
  const validate = (key) => {
    const { regex, message } = STUDENT_RULES[key];
    const ok = regex.test(fields[key].input.value.trim());
    setFieldState(fields[key], ok, message);
    return ok;
  };

  Object.keys(fields).forEach((key) => {
    form.appendChild(fields[key].wrapper);
    fields[key].input.addEventListener("input", () => validate(key)); // live feedback
  });

  const result = document.createElement("p");
  form.appendChild(createButton("Register"));
  form.appendChild(result);

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    // Validate every field (map first so all errors show at once).
    const allValid = Object.keys(fields).map(validate).every(Boolean);
    result.style.color = allValid ? "green" : "red";
    result.textContent = allValid ? "Registration successful!" : "Please fix the errors above.";
  });

  section.appendChild(form);
}

/* ======================================================================
 * Q3: Library Management System (Classes + Objects)
 * ==================================================================== */

class Book {
  constructor(title, author, isbn, isIssued = false) {
    this.title = title;
    this.author = author;
    this.isbn = isbn;
    this.isIssued = isIssued;
  }

  // Returns true if the book was successfully issued.
  issueBook() {
    if (this.isIssued) return false;
    this.isIssued = true;
    return true;
  }

  // Returns true if the book was successfully returned.
  returnBook() {
    if (!this.isIssued) return false;
    this.isIssued = false;
    return true;
  }
}

const library = [
  new Book("Clean Code", "Robert C. Martin", "9780132350884"),
  new Book("You Don't Know JS", "Kyle Simpson", "9781491904244"),
  new Book("Eloquent JavaScript", "Marijn Haverbeke", "9781593279509"),
  new Book("The Pragmatic Programmer", "Andrew Hunt", "9780135957059"),
];

// Return all books that are not currently issued.
function getAvailableBooks(books) {
  return books.filter((b) => !b.isIssued);
}

// Search by ISBN and issue the book; returns a message describing the result.
function issueBookByISBN(books, isbn) {
  const book = books.find((b) => b.isbn === isbn.trim());
  if (!book) return `No book found with ISBN ${isbn}.`;
  return book.issueBook()
    ? `"${book.title}" has been issued.`
    : `"${book.title}" is already issued.`;
}

function runQ3() {
  logHeading("Q3: Library Management System");
  console.log("Available books:");
  getAvailableBooks(library).forEach((b) => console.log(`- ${b.title} by ${b.author} (${b.isbn})`));

  console.log("\n" + issueBookByISBN(library, "9780132350884"));
  console.log(issueBookByISBN(library, "9780132350884")); // already issued
  console.log(issueBookByISBN(library, "0000000000000")); // not found

  console.log("\nAvailable books after issuing:");
  getAvailableBooks(library).forEach((b) => console.log(`- ${b.title}`));
}

function buildQ3() {
  const section = createSection("Q3: Library - Issue a Book by ISBN");
  const list = document.createElement("ul");
  const message = document.createElement("p");

  const input = document.createElement("input");
  input.placeholder = "Enter ISBN";
  input.style.cssText = "padding:6px;margin-right:8px;";
  const button = document.createElement("button");
  button.textContent = "Issue Book";

  // Redraw the list of available books.
  const render = () => {
    list.innerHTML = "";
    getAvailableBooks(library).forEach((b) => {
      const li = document.createElement("li");
      li.textContent = `${b.title} - ${b.author} (ISBN: ${b.isbn})`;
      list.appendChild(li);
    });
  };

  button.addEventListener("click", () => {
    message.textContent = issueBookByISBN(library, input.value);
    input.value = "";
    render();
  });

  const heading = document.createElement("h4");
  heading.textContent = "Available books";
  section.append(heading, list, input, button, message);
  render();
}

/* ======================================================================
 * Q4: Custom Form Builder (Forms + Classes)
 * ==================================================================== */

class FormBuilder {
  // fields: array like [{ type: 'text', label: 'Username' }, ...]
  constructor(fields, container) {
    this.fields = fields;
    this.container = container;
    this.form = null;
  }

  // Escape text before putting it into innerHTML (prevents broken markup).
  static escape(str) {
    return String(str).replace(/[&<>"']/g, (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c])
    );
  }

  // Turn a label into a key for the data object, e.g. "Full Name" -> "fullName".
  static toKey(label) {
    return label
      .trim()
      .replace(/[^A-Za-z0-9 ]/g, "")
      .split(/\s+/)
      .map((w, i) => (i === 0 ? w.toLowerCase() : w[0].toUpperCase() + w.slice(1).toLowerCase()))
      .join("");
  }

  // Build the whole form with innerHTML and attach it to the container.
  render() {
    const fieldsHtml = this.fields
      .map((f) => {
        const key = FormBuilder.toKey(f.label);
        const label = FormBuilder.escape(f.label);
        let control;
        if (f.type === "select") {
          const opts = (f.options || [])
            .map((o) => `<option value="${FormBuilder.escape(o)}">${FormBuilder.escape(o)}</option>`)
            .join("");
          control = `<select name="${key}">${opts}</select>`;
        } else if (f.type === "textarea") {
          control = `<textarea name="${key}" rows="3" style="width:100%"></textarea>`;
        } else {
          control = `<input type="${FormBuilder.escape(f.type)}" name="${key}" style="width:100%;padding:6px;box-sizing:border-box;">`;
        }
        return `<div style="margin-bottom:12px"><label style="display:block">${label}</label>${control}</div>`;
      })
      .join("");

    this.container.innerHTML = `<form>${fieldsHtml}<button type="submit">Submit</button></form>`;
    this.form = this.container.querySelector("form");
    return this.form;
  }

  // Return every entered value as an object { fieldKey: value }.
  getFormData() {
    const data = {};
    this.fields.forEach((f) => {
      const key = FormBuilder.toKey(f.label);
      const el = this.form.elements[key];
      data[key] = f.type === "checkbox" ? el.checked : el.value;
    });
    return data;
  }
}

function buildQ4() {
  const section = createSection("Q4: Custom Form Builder");
  const formHost = document.createElement("div");
  const output = document.createElement("pre");
  output.style.background = "#f5f5f5";
  output.style.padding = "8px";
  section.append(formHost, output);

  const builder = new FormBuilder(
    [
      { type: "text", label: "Username" },
      { type: "email", label: "Email Address" },
      { type: "number", label: "Age" },
      { type: "select", label: "Country", options: ["India", "USA", "UK"] },
      { type: "textarea", label: "About You" },
      { type: "checkbox", label: "Subscribe" },
    ],
    formHost
  );
  const form = builder.render();

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const data = builder.getFormData();
    console.log("Q4 form data:", data);
    output.textContent = JSON.stringify(data, null, 2);
  });
}

/* ======================================================================
 * Q5: Movie Ticket Booking (Objects + RegExp)
 * ==================================================================== */

const BOOKING_RULES = {
  name: { regex: /^[A-Za-z]+(?: [A-Za-z]+)*$/, message: "Name must contain only alphabets." },
  email: { regex: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Enter a valid email address." },
  seats: { regex: /^(?:[1-9]|10)$/, message: "Seats must be a number from 1 to 10." },
};

function buildQ5() {
  const section = createSection("Q5: Movie Ticket Booking");
  const form = document.createElement("form");
  form.noValidate = true;

  const fields = {
    name: createField("Name", "text", "name"),
    email: createField("Email", "text", "email"),
    seats: createField("Seats (1-10)", "text", "seats"),
  };

  const validate = (key) => {
    const ok = BOOKING_RULES[key].regex.test(fields[key].input.value.trim());
    setFieldState(fields[key], ok, BOOKING_RULES[key].message);
    return ok;
  };

  Object.keys(fields).forEach((key) => {
    form.appendChild(fields[key].wrapper);
    fields[key].input.addEventListener("input", () => validate(key));
  });
  form.appendChild(createButton("Book Ticket"));

  const ticket = document.createElement("pre");
  ticket.style.cssText = "background:#fffbe6;padding:10px;border:1px dashed #aaa;display:none;";

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const allValid = Object.keys(fields).map(validate).every(Boolean);
    if (!allValid) {
      ticket.style.display = "none";
      return;
    }
    // Store booking info in an object and show the ticket.
    const booking = {
      name: fields.name.input.value.trim(),
      email: fields.email.input.value.trim(),
      seats: Number(fields.seats.input.value),
    };
    console.log("Q5 booking:", booking);
    ticket.style.display = "block";
    ticket.textContent =
      "--- MOVIE TICKET ---\n" +
      `Name  : ${booking.name}\n` +
      `Email : ${booking.email}\n` +
      `Seats : ${booking.seats}`;
  });

  section.append(form, ticket);
}

/* ======================================================================
 * Q6: Employee Management System (Classes + Object Methods)
 * ==================================================================== */

class Employee {
  constructor(id, name, department, salary) {
    this.id = id;
    this.name = name;
    this.department = department;
    this.salary = salary; // monthly salary
  }

  // Annual salary = monthly salary x 12.
  getAnnualSalary() {
    return this.salary * 12;
  }

  // Increase the monthly salary by the given percentage.
  applyBonus(percent) {
    this.salary += (this.salary * percent) / 100;
    return this.salary;
  }
}

function runQ6() {
  logHeading("Q6: Employee Management System");

  const employees = [
    new Employee(101, "Aarav", "Engineering", 60000),
    new Employee(102, "Diya", "Marketing", 45000),
    new Employee(103, "Kabir", "Finance", 52000),
    new Employee(104, "Meera", "HR", 40000),
    new Employee(105, "Rohan", "Engineering", 70000),
  ];

  console.log("Annual salaries:");
  employees.forEach((e) => console.log(`${e.name} (${e.department}): ${e.getAnnualSalary()}`));

  // Demonstrate applyBonus on one employee.
  employees[0].applyBonus(10);
  console.log(`\nAfter 10% bonus, ${employees[0].name}'s annual salary: ${employees[0].getAnnualSalary()}`);

  // reduce() to sum up the company's total annual payout.
  const totalPayout = employees.reduce((sum, e) => sum + e.getAnnualSalary(), 0);
  console.log(`Total annual payout of the company: ${totalPayout}`);
}

/* ======================================================================
 * Q7: Login Form Validation using RegExp
 * ==================================================================== */

// Returns an array of specific error messages (empty array = valid).
function validateLogin(username, password) {
  const errors = [];

  if (!/^.{5,}$/.test(username)) errors.push("Username must be at least 5 characters.");

  if (!/^.{8,}$/.test(password)) errors.push("Password must be at least 8 characters.");
  if (!/\d/.test(password)) errors.push("Password must include a number.");
  if (!/[A-Z]/.test(password)) errors.push("Password must include an uppercase letter.");
  if (!/[a-z]/.test(password)) errors.push("Password must include a lowercase letter.");
  if (!/[^A-Za-z0-9]/.test(password)) errors.push("Password must include a special character.");

  return errors;
}

function buildQ7() {
  const section = createSection("Q7: Login Form");
  const form = document.createElement("form");
  form.noValidate = true;

  const username = createField("Username", "text", "username");
  const password = createField("Password", "password", "password");
  const message = document.createElement("div");
  message.style.marginTop = "10px";

  form.append(username.wrapper, password.wrapper, createButton("Login"), message);

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const errors = validateLogin(username.input.value, password.input.value);
    message.innerHTML = "";

    if (errors.length === 0) {
      username.input.style.borderColor = password.input.style.borderColor = "green";
      message.style.color = "green";
      message.textContent = "Login successful!";
    } else {
      username.input.style.borderColor = errors.some((m) => m.startsWith("Username")) ? "red" : "green";
      password.input.style.borderColor = errors.some((m) => m.startsWith("Password")) ? "red" : "green";
      message.style.color = "red";
      errors.forEach((m) => {
        const p = document.createElement("div");
        p.textContent = "• " + m;
        message.appendChild(p);
      });
    }
  });

  section.appendChild(form);
}

/* ======================================================================
 * Q8: Dynamic Object Updater
 * ==================================================================== */

const user = { name: "John", email: "john@mail.com", age: 21 };

function buildQ8() {
  const section = createSection("Q8: Dynamic Object Updater");
  const form = document.createElement("form");
  form.noValidate = true;

  const fields = {
    name: createField("Name", "text", "name"),
    email: createField("Email", "text", "email"),
    age: createField("Age", "number", "age"),
  };

  const display = document.createElement("pre");
  display.style.cssText = "background:#f5f5f5;padding:10px;";

  // Show the current state of the user object on the page.
  const render = () => {
    display.textContent = "user = " + JSON.stringify(user, null, 2);
  };

  // Pre-fill the form with the current values.
  Object.keys(fields).forEach((key) => {
    fields[key].input.value = user[key];
    form.appendChild(fields[key].wrapper);
  });

  // Copy the form values into the user object.
  const updateUser = () => {
    user.name = fields.name.input.value;
    user.email = fields.email.input.value;
    user.age = Number(fields.age.input.value);
    render();
  };

  // Update in real time while typing, and again on submit.
  Object.values(fields).forEach((f) => f.input.addEventListener("input", updateUser));
  form.appendChild(createButton("Update"));
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    updateUser();
    console.log("Q8 updated user:", user);
  });

  section.append(form, display);
  render();
}

/* ======================================================================
 * Q9: Shopping Cart Total (Classes + RegExp for Coupon)
 * ==================================================================== */

class Cart {
  constructor() {
    this.items = [];
    this.discountPercent = 0;
  }

  addItem(name, price, quantity) {
    this.items.push({ name, price, quantity });
  }

  // Sum of price x quantity for all items (before any discount).
  getTotal() {
    return this.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }

  // Coupon must look like SAVE20 or DISC10 (SAVE/DISC + 2-digit percentage).
  applyCoupon(code) {
    const match = /^(SAVE|DISC)(\d{2})$/.exec(code.trim().toUpperCase());
    if (!match) {
      this.discountPercent = 0;
      return { valid: false, message: `Invalid coupon "${code}".` };
    }
    this.discountPercent = Number(match[2]);
    return { valid: true, message: `Coupon applied: ${this.discountPercent}% off.` };
  }

  // Total after the coupon discount.
  getFinalTotal() {
    const total = this.getTotal();
    return total - (total * this.discountPercent) / 100;
  }
}

function runQ9() {
  logHeading("Q9: Shopping Cart");

  const cart = new Cart();
  cart.addItem("Keyboard", 1500, 1);
  cart.addItem("Mouse", 600, 2);
  cart.addItem("USB Cable", 250, 3);

  console.log("Cart total:", cart.getTotal());

  ["HELLO", "SAVE5", "save20"].forEach((code) => {
    const res = cart.applyCoupon(code);
    console.log(`Coupon ${code}: ${res.message}`);
  });
  // Last coupon (save20) was valid, so the final total is discounted.
  console.log("Final total after coupon:", cart.getFinalTotal());

  const cart2 = new Cart();
  cart2.addItem("Book", 500, 2);
  console.log(cart2.applyCoupon("DISC10").message, "-> Final total:", (cart2.applyCoupon("DISC10"), cart2.getFinalTotal()));
}

/* ======================================================================
 * Run everything
 * ==================================================================== */

runQ1();
runQ3();
runQ6();
runQ9();

if (IS_BROWSER) {
  // Build the interactive parts once the page is ready.
  const start = () => {
    buildQ2();
    buildQ3();
    buildQ4();
    buildQ5();
    buildQ7();
    buildQ8();
  };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start);
  else start();
} else {
  // Node.js: quick checks of the form-validation logic (no DOM available).
  logHeading("Validation logic checks (Node)");
  console.log("Q2 name 'Riya'      ->", STUDENT_RULES.name.regex.test("Riya"));
  console.log("Q2 name 'Riya123'   ->", STUDENT_RULES.name.regex.test("Riya123"));
  console.log("Q2 phone '9876543210' ->", STUDENT_RULES.phone.regex.test("9876543210"));
  console.log("Q2 password 'Abcd@123' ->", STUDENT_RULES.password.regex.test("Abcd@123"));
  console.log("Q5 seats '10' / '11' ->", BOOKING_RULES.seats.regex.test("10"), BOOKING_RULES.seats.regex.test("11"));
  console.log("Q7 login ok   ->", validateLogin("johnny", "Passw0rd!"));
  console.log("Q7 login bad  ->", validateLogin("jo", "abc"));
}
