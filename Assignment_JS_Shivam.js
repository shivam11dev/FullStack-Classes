// JavaScript Assignment - All Solutions (Q1 to Q10)
// Each question sits in its own { } block so variable names do not clash.

console.log('\n========== Q1 ==========');
{
  // Q1. Personalized Login Greeting
  // Greets the user depending on what time of day it is.
  
  const userName = "Aarav";
  
  // getHours() gives the hour in 24-hour format (0 - 23)
  const currentHour = new Date().getHours();
  
  let greeting;
  
  if (currentHour < 12) {
    // Anything before noon counts as morning
    greeting = `Good Morning ${userName}!`;
  } else if (currentHour <= 17) {
    // From 12 noon up to 5 PM
    greeting = `Good Afternoon ${userName}!`;
  } else {
    // Everything after that is evening
    greeting = `Good Evening ${userName}!`;
  }
  
  console.log(greeting);
  console.log(`(Current hour: ${currentHour}:00)`);
}

console.log('\n========== Q2 ==========');
{
  // Q2. Multi-Type Data Summary
  // Creates one variable of each data type and prints a report with console.table().
  
  const userName = "Priya Sharma";                       // string
  const userAge = 24;                                    // number
  const isActive = true;                                 // boolean
  const hobbies = ["reading", "cycling", "coding"];      // array
  const address = { city: "Mathura", state: "UP" };      // object
  const middleName = null;                               // null
  let phoneNumber;                                       // undefined (never assigned)
  
  // typeof says "object" for arrays and null, which is misleading.
  // So this helper handles those two cases before falling back to typeof.
  function getType(value) {
    if (Array.isArray(value)) return "array";
    if (value === null) return "null";
    return typeof value;
  }
  
  // One row for every variable: label, value and its type
  const report = [
    { Label: "userName",    Value: userName,                Type: getType(userName) },
    { Label: "userAge",     Value: userAge,                 Type: getType(userAge) },
    { Label: "isActive",    Value: isActive,                Type: getType(isActive) },
    { Label: "hobbies",     Value: hobbies.join(", "),      Type: getType(hobbies) },
    { Label: "address",     Value: JSON.stringify(address), Type: getType(address) },
    { Label: "middleName",  Value: String(middleName),      Type: getType(middleName) },
    { Label: "phoneNumber", Value: String(phoneNumber),     Type: getType(phoneNumber) },
  ];
  
  // Only one console.table() call, as the question asks
  console.table(report);
}

console.log('\n========== Q3 ==========');
{
  // Q3. Monthly Expense Tracker
  // Adds up this month's expenses, finds the average, and applies 10% tax.
  
  // Expenses for the 5 categories: food, travel, rent, bills, leisure
  const categories = ["Food", "Travel", "Rent", "Bills", "Leisure"];
  const expenses = [4500, 1800, 12000, 2500, 1500];
  
  // Add everything up with a simple loop
  let total = 0;
  for (let i = 0; i < expenses.length; i++) {
    total += expenses[i];
    console.log(`${categories[i]}: ${expenses[i].toFixed(2)}`);
  }
  
  // Average spend per category
  const average = total / expenses.length;
  
  // Add 10% tax on the total (using *= to update the amount)
  let finalAmount = total;
  finalAmount *= 1.10;
  
  console.log("-----------------------------");
  console.log(`Total expenses : ${total.toFixed(2)}`);
  console.log(`Average expense: ${average.toFixed(2)}`);
  console.log(`Final amount (with 10% tax): ${finalAmount.toFixed(2)}`);
}

console.log('\n========== Q4 ==========');
{
  // Q4. Academic Performance Evaluator
  // Decides if a student is promoted or detained based on 5 subject marks.
  
  const marks = [78, 85, 92, 67, 88];   // marks out of 100
  const totalSubjects = marks.length;
  const maxMarksPerSubject = 100;
  
  // Sum of all marks
  let totalMarks = 0;
  for (const mark of marks) {
    totalMarks += mark;
  }
  
  const average = totalMarks / totalSubjects;
  const percentage = (totalMarks / (totalSubjects * maxMarksPerSubject)) * 100;
  
  // Check if the student failed any single subject (below 35)
  let failedASubject = false;
  for (const mark of marks) {
    if (mark < 35) {
      failedASubject = true;
    }
  }
  
  let result;
  
  if (failedASubject) {
    // Rule: any subject below 35 means automatic detention
    result = "Detained";
  } else if (percentage >= 85) {
    result = "Promoted with Distinction";
  } else if (percentage >= 50 && percentage < 85) {
    result = "Promoted";
  } else {
    result = "Detained";
  }
  
  console.log(`Marks      : ${marks.join(", ")}`);
  console.log(`Average    : ${average.toFixed(2)}`);
  console.log(`Percentage : ${percentage.toFixed(2)}%`);
  console.log(`Result     : ${result}`);
}

console.log('\n========== Q5 ==========');
{
  // Q5. Weather Activity Planner
  // Suggests an activity based on the weather conditions.
  
  const temperature = 12;    // in degrees Celsius
  const isRaining = false;
  const windSpeed = 25;      // in km/h
  
  let advice;
  
  if (isRaining) {
    // Rain beats everything else
    advice = "Stay indoors with hot coffee.";
  } else if (temperature > 35) {
    advice = "Go swimming.";
  } else if (temperature < 15 && windSpeed > 20) {
    // Needs BOTH conditions: cold AND windy
    advice = "Too cold and windy - stay home.";
  } else {
    advice = "Perfect day for a walk.";
  }
  
  console.log(`Temperature: ${temperature}°C | Raining: ${isRaining} | Wind: ${windSpeed} km/h`);
  console.log(advice);
}

console.log('\n========== Q6 ==========');
{
  // Q6. Progressive Discount System
  // The more you spend, the bigger the discount.
  
  const totalAmount = 6200;   // purchase total
  
  let discountPercent;
  
  if (totalAmount >= 10000) {
    discountPercent = 25;
  } else if (totalAmount >= 5000) {
    discountPercent = 15;
  } else if (totalAmount >= 2000) {
    discountPercent = 5;
  } else {
    discountPercent = 0;   // too small for any discount
  }
  
  // Work out how much money is knocked off, then the final price
  const discountAmount = (totalAmount * discountPercent) / 100;
  const finalPrice = Math.round(totalAmount - discountAmount);
  
  console.log(`Original total      : ₹${totalAmount}`);
  console.log(`Discount percentage : ${discountPercent}%`);
  console.log(`Final price         : ₹${finalPrice}`);
}

console.log('\n========== Q7 ==========');
{
  // Q7. Smart Guessing Game
  // The computer picks a number from 1 to 50 and we check the guess.
  
  // Random whole number between 1 and 50
  const secretNumber = Math.floor(Math.random() * 50) + 1;
  
  // Test value for the guess (change it to try different cases)
  const userGuess = 25;
  
  console.log(`Your guess: ${userGuess}`);
  console.log(`Secret number (shown for testing): ${secretNumber}`);
  
  if (userGuess === secretNumber) {
    console.log("Correct guess!");
  } else {
    // Not exact, so see how far off the guess is
    const difference = Math.abs(userGuess - secretNumber);
  
    if (difference <= 3) {
      // Within +/- 3 of the secret
      console.log("Very close!");
    } else if (userGuess > secretNumber) {
      console.log("Too high");
    } else {
      console.log("Too low");
    }
  }
}

console.log('\n========== Q8 ==========');
{
  // Q8. Employee Salary Projection
  // Shows how a salary grows over 5 years with a yearly increment.
  
  const currentSalary = 500000;   // starting yearly salary
  const incrementRate = 8;        // yearly increment in percent
  
  let salary = currentSalary;
  const projection = [];
  
  for (let year = 1; year <= 5; year++) {
    // Add the increment on top of last year's salary
    salary += salary * (incrementRate / 100);
  
    projection.push({
      Year: year,
      "Salary": Math.round(salary),
    });
  }
  
  console.log(`Starting salary: ${currentSalary} | Increment: ${incrementRate}% per year`);
  console.table(projection);
}

console.log('\n========== Q9 ==========');
{
  // Q9. Random Math Quiz Generator
  // Makes a random arithmetic question and works out the answer.
  
  // Random whole number between 1 and 20
  function randomNumber() {
    return Math.floor(Math.random() * 20) + 1;
  }
  
  const num1 = randomNumber();
  const num2 = randomNumber();
  
  const operators = ["+", "-", "*", "/"];
  const operator = operators[Math.floor(Math.random() * operators.length)];
  
  let answer;
  
  // switch picks the right calculation for the chosen operator
  switch (operator) {
    case "+":
      answer = num1 + num2;
      break;
    case "-":
      answer = num1 - num2;
      break;
    case "*":
      answer = num1 * num2;
      break;
    case "/":
      // Division can give long decimals, so round to 2 places
      answer = (num1 / num2).toFixed(2);
      break;
    default:
      answer = "Invalid operator";
  }
  
  console.log(`Question: ${num1} ${operator} ${num2} = ?`);
  console.log(`Correct answer: ${answer}`);
}

console.log('\n========== Q10 ==========');
{
  // Q10. Citizen Eligibility Validator
  // Checks which services a person can use based on age and citizenship.
  //
  // Note: the question's first two rules overlap (a citizen aged 18-20 also
  // satisfies "citizen and age >= 18"). To keep them separate I treat
  // "all services" as citizen AND age 21 or above, and 18-20 as "vote only".
  
  const age = 19;
  const isCitizen = true;
  
  console.log(`Age: ${age} | Citizen: ${isCitizen}`);
  
  if (isCitizen) {
    if (age >= 21) {
      console.log("Eligible for all services.");
    } else if (age >= 18) {
      console.log("Eligible to vote only.");
    } else {
      console.log("Not eligible yet.");
    }
  } else {
    if (age >= 18) {
      console.log("Only age criteria met.");
    } else {
      console.log("Not eligible yet.");
    }
  }
}

