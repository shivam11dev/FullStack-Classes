// Q1
console.log("\n--- Q1 ---");

function showEndMessage() {
  console.log("Welcome to the course!");
}

function greetUser(name, callback) {
  console.log("Hello " + name);
  callback();
}

greetUser("Aarav", showEndMessage);


// Q2
console.log("\n--- Q2 ---");

function applyOperation(numbers, operation) {
  let result = [];
  for (let i = 0; i < numbers.length; i++) {
    result.push(operation(numbers[i]));
  }
  return result;
}

let nums = [1, 2, 3, 4];
console.log("Doubled:", applyOperation(nums, function (n) { return n * 2; }));
console.log("Squared:", applyOperation(nums, (n) => n * n));


// Q3
console.log("\n--- Q3 ---");

const user = {
  name: "John",
  showName: () => {
    console.log("Arrow:", this.name);
  },
};
user.showName();

const user2 = {
  name: "John",
  showName: function () {
    console.log("Normal:", this.name);
  },
};
user2.showName();


// Q4
console.log("\n--- Q4 ---");

function Car(brand, model) {
  this.brand = brand;
  this.model = model;
}

Car.prototype.getDetails = function () {
  console.log("Car: " + this.brand + " " + this.model);
};

let car1 = new Car("Toyota", "Innova");
let car2 = new Car("Honda", "City");
car1.getDetails();
car2.getDetails();
console.log("Same method for both cars:", car1.getDetails === car2.getDetails);


// Q5
console.log("\n--- Q5 ---");

function Person(name) {
  this.name = name;
}

Person.prototype.printName = function () {
  console.log("Name: " + this.name);
};

function Student(name, branch) {
  Person.call(this, name);
  this.branch = branch;
}

Student.prototype = Object.create(Person.prototype);
Student.prototype.constructor = Student;

Student.prototype.printBranch = function () {
  console.log("Branch: " + this.branch);
};

let s1 = new Student("Diya", "Computer Science");
s1.printName();
s1.printBranch();
console.log("s1 instanceof Student:", s1 instanceof Student);
console.log("s1 instanceof Person:", s1 instanceof Person);
console.log("Student.prototype's parent is Person.prototype:",
  Object.getPrototypeOf(Student.prototype) === Person.prototype);


// Q6
console.log("\n--- Q6 ---");

function Human(name) {
  this.name = name;
}

Human.prototype.introduce = function () {
  console.log("Hi, I am " + this.name);
};

function Faculty(name, department) {
  Human.call(this, name);
  this.department = department;
}

Faculty.prototype = Object.create(Human.prototype);
Faculty.prototype.constructor = Faculty;

Faculty.prototype.showDepartment = function () {
  console.log(this.name + " teaches in " + this.department);
};

function Professor(name, department, research) {
  Faculty.call(this, name, department);
  this.research = research;
}

Professor.prototype = Object.create(Faculty.prototype);
Professor.prototype.constructor = Professor;

Professor.prototype.showResearch = function () {
  console.log(this.name + " researches " + this.research);
};

let prof = new Professor("Dr. Rao", "Physics", "Quantum Computing");
prof.introduce();
prof.showDepartment();
prof.showResearch();


// Q7
console.log("\n--- Q7 ---");

function makeMultiplier(multiplier) {
  return function (num) {
    return num * multiplier;
  };
}

const triple = makeMultiplier(3);
const double = makeMultiplier(2);
console.log(triple(5));
console.log(double(5));


// Q8
console.log("\n--- Q8 ---");

Array.prototype.myMap = function (callback) {
  let result = [];
  for (let i = 0; i < this.length; i++) {
    result.push(callback(this[i], i, this));
  }
  return result;
};

console.log([1, 2, 3].myMap((num) => num * 2));
console.log(["a", "b", "c"].myMap((item, index) => item + index));


// Q9
console.log("\n--- Q9 ---");

class PersonClass {
  constructor(name) {
    this.name = name;
  }

  printName() {
    console.log("Name: " + this.name);
  }
}

class StudentClass extends PersonClass {
  constructor(name, branch) {
    super(name);
    this.branch = branch;
  }

  printBranch() {
    console.log("Branch: " + this.branch);
  }
}

let s2 = new StudentClass("Diya", "Computer Science");
console.log("Prototype version:");
s1.printName();
s1.printBranch();
console.log("Class version:");
s2.printName();
s2.printBranch();
console.log("Same properties:", Object.keys(s1), Object.keys(s2));
console.log("s2 instanceof StudentClass:", s2 instanceof StudentClass);
console.log("s2 instanceof PersonClass:", s2 instanceof PersonClass);
