const axios = require("axios");
const {
  questionAnswerPrompt,
  conceptExplainPrompt,
} = require("../utils/prompts");

/* ===============================
   Swift API client (Axios)
================================ */
const swiftAPI = axios.create({
  baseURL: "https://api.swift-api.com/v1",
  headers: {
    Authorization: `Bearer ${process.env.SWIFT_API_KEY}`,
    "Content-Type": "application/json",
  },
  timeout: 30000,
});

/* ===============================
   Mock data generator
================================ */
const generateMockQuestions = (
  role,
  experience,
  topicsToFocus,
  numberOfQuestions
) => {
  const topic = topicsToFocus.split(",")[0]?.trim() || "JavaScript";

  const questions = [
    {
      question: `Explain closures in ${topic}.`,
      answer:
        "A closure is a function that remembers variables from its outer scope even after the outer function has executed.",
    },
    {
      question: `Difference between var, let and const in ${topic}?`,
      answer:
        "var is function-scoped; let and const are block-scoped. const cannot be reassigned.",
    },
    {
      question: `Explain async/await in ${topic}.`,
      answer:
        "async/await simplifies promise-based code and allows writing asynchronous logic in a synchronous style.",
    },
    {
      question: `What is hoisting in ${topic}?`,
      answer:
        "Hoisting moves declarations to the top of the scope. var is initialized as undefined; let/const are not.",
    },
    {
      question: `How do you handle errors in ${topic}?`,
      answer:
        "Use try/catch for synchronous code and async/await, and .catch() for promises.",
    },
  ];

  return questions.slice(0, Number(numberOfQuestions));
};

/* ===============================
   Generate Interview Questions
================================ */
const generateInterviewQuestions = async (req, res) => {
  try {
    const { role, experience, topicsToFocus, numberOfQuestions } = req.body;

    if (!role || !experience || !topicsToFocus || !numberOfQuestions) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const prompt = questionAnswerPrompt(
      role,
      experience,
      topicsToFocus,
      numberOfQuestions
    );

    let rawText;

    try {
      const response = await swiftAPI.post("/chat/completions", {
        model: "gpt-5-nano",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
        max_tokens: 2000,
      });

      rawText = response.data?.choices?.[0]?.message?.content;
      if (!rawText) throw new Error("Empty response from model");
    } catch (apiError) {
      if (apiError.response?.status === 429) {
        console.log("Quota exceeded → using mock data");
        return res
          .status(200)
          .json(
            generateMockQuestions(
              role,
              experience,
              topicsToFocus,
              numberOfQuestions
            )
          );
      }
      throw apiError;
    }

    // Clean markdown if present
    const cleanedText = rawText
      .replace(/^```json/i, "")
      .replace(/```$/, "")
      .trim();

    let data;
    try {
      data = JSON.parse(cleanedText);
    } catch {
      console.log("Invalid JSON → fallback mock");
      data = generateMockQuestions(
        role,
        experience,
        topicsToFocus,
        numberOfQuestions
      );
    }

    return res.status(200).json(data);
  } catch (error) {
    console.error("AI error:", error.message);
    const {
      role = "developer",
      experience = "2",
      topicsToFocus = "javascript",
      numberOfQuestions = 5,
    } = req.body;

    return res
      .status(200)
      .json(
        generateMockQuestions(
          role,
          experience,
          topicsToFocus,
          numberOfQuestions
        )
      );
  }
};


/* ===============================
   Local Explanation Generator
================================ */
const generateLocalExplanation = (question) => {
  const questionLower = question.toLowerCase();
  
  // Common patterns for explanations
  if (questionLower.includes('closure') || questionLower.includes('closures')) {
    return {
      title: "Understanding Closures",
      explanation: `A closure is a fundamental concept in JavaScript that allows a function to access variables from its outer (enclosing) scope even after that outer function has returned. 

**How it works:**
- When a function is created, it gets a reference to all variables in its scope
- This reference (the closure) persists even after the outer function completes
- Inner functions can access these variables as if they were their own

**Example:**
\`\`\`javascript
function outerFunction(x) {
  // This creates a closure
  return function innerFunction(y) {
    return x + y; // x is accessible here
  }
}

const addFive = outerFunction(5);
console.log(addFive(3)); // 8
\`\`\`

**Why it matters:**
- Data privacy (simulating private variables)
- Function factories
- Event handlers and callbacks
- Maintaining state without global variables`
    };
  }
  
  if (questionLower.includes('var') || questionLower.includes('let') || questionLower.includes('const')) {
    return {
      title: "Variable Declarations: var vs let vs const",
      explanation: `Understanding the differences between var, let, and const is crucial for writing predictable JavaScript code.

**var:**
- Function-scoped (or globally scoped if not in a function)
- Hoisted and initialized with undefined
- Can be redeclared
- Avoid in modern JavaScript

**let:**
- Block-scoped
- Hoisted but not initialized (temporal dead zone)
- Cannot be redeclared in same scope
- Can be reassigned

**const:**
- Block-scoped
- Hoisted but not initialized (temporal dead zone)
- Cannot be redeclared or reassigned
- Must be initialized when declared

**Best Practice:** Use const by default, let when you need to reassign, avoid var.`
    };
  }
  
  if (questionLower.includes('async') || questionLower.includes('await') || questionLower.includes('promise')) {
    return {
      title: "Async/Await and Promises",
      explanation: `Async/await provides a cleaner way to work with asynchronous operations in JavaScript.

**Promises:**
- Objects representing the eventual completion/failure of async operations
- Three states: pending, fulfilled, rejected
- Chaining with .then() and .catch()

**Async/Await:**
- Built on top of promises
- Makes async code look synchronous
- try/catch for error handling
- Better readability and debugging

**Example:**
\`\`\`javascript
// With promises
fetch('/api/data')
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error(error));

// With async/await
async function getData() {
  try {
    const response = await fetch('/api/data');
    const data = await response.json();
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}
\`\`\``
    };
  }
  
  if (questionLower.includes('hoist') || questionLower.includes('hoisting')) {
    return {
      title: "Hoisting in JavaScript",
      explanation: `Hoisting is JavaScript's behavior of moving declarations to the top of the current scope during compilation.

**Variable Hoisting:**
- var declarations are hoisted and initialized with undefined
- let/const declarations are hoisted but not initialized (Temporal Dead Zone)
- Function declarations are fully hoisted

**Example:**
\`\`\`javascript
console.log(x); // undefined (not ReferenceError)
var x = 5;

console.log(y); // ReferenceError
let y = 10;
\`\`\`

**Function Hoisting:**
\`\`\`
// This works because function declarations are fully hoisted
sayHello(); // "Hello!"

function sayHello() {
  console.log("Hello!");
}
\`\`\`

**Best Practice:**
- Declare variables at the top of their scope
- Use let/const to avoid confusion
- Declare functions before using them`
    };
  }
  
  if (questionLower.includes('error') || questionLower.includes('exception') || questionLower.includes('try') || questionLower.includes('catch')) {
    return {
      title: "Error Handling in JavaScript",
      explanation: `Proper error handling is essential for building robust applications.

**try/catch Statement:**
- Wraps code that might throw an error
- catch block handles the error
- finally block always executes

**Example:**
\`\`\`javascript
try {
  // Code that might throw an error
  let result = riskyOperation();
  console.log(result);
} catch (error) {
  // Handle the error
  console.error('An error occurred:', error.message);
} finally {
  // Always executes
  console.log('Cleanup code');
}
\`\`\`

**Error Types:**
- ReferenceError: Variable doesn't exist
- TypeError: Wrong data type
- SyntaxError: Invalid code syntax
- Custom errors: throw new Error('Custom message')

**Best Practices:**
- Handle specific errors when possible
- Don't swallow errors silently
- Use finally for cleanup
- Log errors for debugging`
    };
  }
  
  if (questionLower.includes('mern') || questionLower.includes('express') || questionLower.includes('node')) {
    return {
      title: "MERN Stack Error Handling",
      explanation: `The MERN stack (MongoDB, Express, React, Node.js) requires comprehensive error handling strategies.

**Frontend (React):**
- Use try/catch in async functions
- Implement error boundaries for component crashes
- Handle API errors gracefully
- Show user-friendly error messages

**Backend (Node.js/Express):**
\`\`\`javascript
// Express error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Async error wrapper
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};
\`\`\`

**Database (MongoDB):**
- Handle connection errors
- Validate data before saving
- Use proper indexing for performance

**Network Issues:**
- Implement retry logic
- Use timeouts
- Handle offline scenarios`
    };
  }
  
  // Default explanation for unrecognized questions
  return {
    title: "Technical Interview Concept",
    explanation: `This appears to be a technical interview question that requires a detailed explanation of programming concepts.

**General Approach:**
1. Break down the concept into smaller parts
2. Provide practical examples
3. Explain real-world applications
4. Discuss best practices
5. Mention common pitfalls

**Study Tips:**
- Practice explaining concepts out loud
- Write code examples
- Research related topics
- Understand the "why" behind the "what"

**Additional Resources:**
- MDN Web Docs
- JavaScript.info
- FreeCodeCamp
- Official documentation

For a specific explanation of this concept, consider researching it further or asking a mentor for detailed guidance.`
  };
};

/* ===============================
   Generate Concept Explanation
================================ */
const generateConceptExplanation = async (req, res) => {
  try {
    const { question } = req.body;
    if (!question)
      return res.status(400).json({ message: "Question is required" });

    const prompt = conceptExplainPrompt(question);

    let explanation;

    try {
      const response = await swiftAPI.post("/chat/completions", {
        model: "gpt-5-nano",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
        max_tokens: 1500,
      });

      explanation = response.data?.choices?.[0]?.message?.content;
      if (!explanation) throw new Error("Empty response");
    } catch (apiError) {
      console.log("API unavailable, using local explanation generator");
      // Use local explanation generator instead of showing error
      const localExplanation = generateLocalExplanation(question);
      return res.status(200).json(localExplanation);
    }

    return res.status(200).json({ explanation });
  } catch (error) {
    console.error("Concept error:", error.message);
    // Use local explanation generator as fallback instead of error message
    const localExplanation = generateLocalExplanation(req.body.question);
    return res.status(200).json(localExplanation);
  }
};

module.exports = {
  generateInterviewQuestions,
  generateConceptExplanation,
};
