How many ways to use JS?
Ans: 1: Client-Side JS
     1|     Inline JS: <button onclick="alert('Hello!')">Click Me</button>
     2|     Internal JS: 
            <script>
              console.log("Hello from JS!");
            </script>
     3|     External JS: <script src="script.js"></script>
    
     2: Server-Side JS
        Backend development ke liye Node.js ka use.
        const http = require('http');
        http.createServer((req, res) => {
          res.writeHead(200, { 'Content-Type': 'text/plain' });
          res.end('Hello from Node.js!');
        }).listen(3000);

     3: JavaScript Frameworks aur Libraries ke saath (ReactJS(FrontEnd), Angular(FrontEnd), Vue.JS(FrontEnd), Express.JS(BackEnd)).

     4: JS ko Different Environments me Run Karna
        Browser Console (F12 → Console), Node.js REPL (node command), Deno (Node.js alternative), Electron.js (Desktop apps banane ke liye).

     5: JavaScript ke alag-alag Uses
        DOM Manipulation (document.querySelector, innerHTML),
        Event Handling (addEventListener),
        AJAX & Fetch API (fetch(), XMLHttpRequest),
        WebSockets (Real-time communication),
        WebAssembly (WASM) ke saath (High-performance computing),
        Machine Learning (TensorFlow.js),
        Game Development (Phaser.js, Three.js).

How many way to apply Client-Based-JS into the HTML?
Ans: 3(Inline, Internal, External)

Basic for any Programming Laguage
(I(Idendtier)K(Krishna/Keywords)L(Love/Literal)D(Dear/DataType)V(Vrindavan/Variable)P(Prem/ProgramStructure)T(Temple/TypeConversion)O(Oh/Operates on Data
)O(Oh/Operators)C(see/Controlflow Statements))
I_KIRSHANA_LOVE_DEAR_VRINDAWAN_PREM_TEMPLE_OH_OH
Identifier: A set of words reserved by language itself and those words are called keyword.

Variable: A variable is a container that hold data or value.

Data Type: Data Type that determines what value, that variables can hold & what operation can be performed.

Operators: Operators are used to perform some operation on data.
   1 | Arithmatic
   2 | Assignment 
   3 | Comparison
   4 | Logical
   5 | Ternary
   6 | Colease

Conditonal Statement
These statements allow us to branch the code depending on whether certain conditions are 
met or not. JavaScript has 2 constructs for branching code, the “if” statement which allow us to test whether a specific 
condition is met or not, and the switch statement which allows us to compare an expression with a number of 
different values. 

if-else: After If, Block of code to be executed if the condition is true and after else, block of code is executed when condion is false.

switch-case: The switch case statement is a control structure that compares a value with multiple cases and executes the corresponding block of code. It is an alternative to the if-else ladder and improves readability.

Loop: Here, Loop allow us to execute a block of code repeatedly until a 
certain condition is met.
Here 6 different loops
   1 | for: A for loop is  commmonly used when the number of iteration is known and it consists 3 parts(initialization, condition, and final expression).
   2 | while
   3 | do-while: 
   6 | for
   7 | for-in: Iterates over the keys (properties) of an object or the indices of an array.
   8 | for-of: Iterates over the values of iterable objects like arrays, strings, & maps etc.
   9 | forEach: Executes a function once for each element in an array (cannot be used to break the loop).

   10| setInterval(): setInterval() is used to execute a function repeatedly after a given interval of time(in milliseconds).
   11| Stopping clearInterval(): Use clearInterval(intervalId) is used to stop the interval.
   12| setTimeout(): setTimeout() is used to execute a function after a specified delay(in milliseconds), but it only runs onece.
    
Function: A function is a block of code designed to perform a particular task and it is executed when it is invoked or called.
It is a named block of code which performs an action whenever it is called and after completion of that 
action it may or may not return any result of that action, and they are divided into 2 categories:
1. Value returning function
2. Non-value returning function (Sub-Routine)
            
Arrow Function: When the function body has only a single statement, you can ommit the curly braces and the return keyword.
Note: Variable name work as function name and that usually declared with const keyword because function value not change in fucture.

Function Global Scope

Function Local Scope

Function Block Scope

Callback Function: A callback function is function that you pass as an argument to another function. It gets executed after a certain task is completed.

Object's: An object in JS is a collection of key-value pairs. The keys(properties) are strings (or symbols), and the values can be any data type(number, strings, arraym functions, etc).

Spread Operator: It is used to copy value into the variable from objects, arrays, & variables and another word we can say if you create clone of anything then it is usefull.       
      
Array: An array is a data structure that allows you to store multple values in a single variable. Array are used to store list of elements like numbers, string, objects, and even other arrays.
They are zero-indexed, meaning the first element has an index of 0, the second has an index of 1, and so on.
Array-Methods
1 | push(): Adds one or more elements to the end of the array.
2 | pop(): Removes the last element from the array and returns that element.
4 | shift(): Removes the first element from the array and returns it.
5 | unshift(): Adds one or more element to the beginning of the array.
6 | length: Returns the number of elements in the array.
7 | find(): Returns the first element that satisfies the provided testing function.
8 | includes(): Determines whether an array contain a certain value.
9 | concat(): Merges two or more arrays and returns a new array.
10| join(): Join all array elements into a string with an optional separator.
11| slice(): Return a shallow copy of a porion of an array.
12| splice(): Adds or removes elements from the array ., Replace the element.
13| sort(): Sorts the elements of the array (alphabetical by default, can be contomized).
14| findIndex(): Returns the index of the first element that satisfies a test.
15| from(): (Iterable objects ko array me convert karta hai) Create an array from an array -like or interable object and it is just opposit of join.
16| isArray(): Checks if given value is an array.
17| some(): Array ke kisi bhi ek element ko check karta hai agar condition satisfy ho toh true return karega

High-Order Array Method's
1 | map(): Creates and return new array by applying a function to each element of the orginal array.
2 | filter(): Creates and returns a new array with elements that pass a specified test codition.
3 | reduce(): Reduces an array to a single value by applying a function to each element.
              
              Accumulator: In JavaScript, an accumulator is a variable that keeps track of a running total or result as you iterate through a collection, like an array. It is commonly used in methods like reduce() to accumulate or combine values in some way (such as summing numbers, concatenating strings, etc.).

String: Strings are sequence of characters used for represent text.
String-Methods
1 | length: Returns the number of characters in the string.
2 | toUpperCase(): Converts the string to upperCase.
3 | toLowerCase(): Converts the string to lowerCase.
4 | include(): Checks if the string contains a specific substring.
5 | indexOf(): Returns the index of the first occurrence of a substring.
6 | trim(): Removes whitespace from both ends of the string.

7 | substring(start, end): Extract a substring between two specified indices.
8 | slice(start, end): Extracts a portion of the string, supporting negative indices.

9 | replace(old, new): Replaces a specified substring with another substring.
10| split(separator): Splits the string into an array based on a separator.
11| charAt(index): Returs the character at the specified index.
Tip: In JS, string is immutable.

Date-Object
This is pre-defined object built by JavaScript developer.
Date-Methods
1 | getFullYear(): Returns the year like 2025.
2 | getMonth(): Returns the month like 0 upto 11.
3 | getDate(): Returns the day of the month like 1 upto 31.
4 | getHours(): Returns the hour like 0 upto 23.
5 | getMinutes(): Returns the minutes 0 upto 59.
6 | getSeconds(): Returns the seconds 0 upto 59.

Synchronous
In synchrounous execution, code run line by line, and each line must finish executing before the next one start. This can lead to delays if a task takes a long time (e.g., fetching data) and it follows blocking nature.
Executes tasks one at a time, blocking further execution until the current task finishes.

Asynchronous: In asynchronous execution, certain operations can be initiated and will run in the background, allowing the rest of the code to continue executing without waiting for the task to finish.
Allows tasks to run concurrently, enabling other code to execute without waiting for the current task to complete.

Characterstics
: | Non-blocking: Other code can run while waiting for an operation (like a network request) to complete.

DOM: The DOM is a programming interface for HTML and XML documents. It represents the structure of a webpage as a tree of objects, allowing programming language like JS to access, modify, and manipulate the document, structure and style.
Accessing HTML Element
1 | getElementById('myId');
2 | getElementsByClassName('myClass);
3 | getElementByTagName('h1');
4 | querySelector('div or #myId or .myClass'): This returns first element.
5 | querySelectorAll('div'): This returns NodeList

DOM Element Properties
1 |textContent: Gets/sets the text content (no HTML).
2 |innerHTML: Gets/sets the HTML content (with tags).
3 |innerText: Gets/sets visible text (ignore hidden).
4 |style: Accesss inline styles.
5 |className: Gets/sets class name(s).
6 |tagName: Returns the element's tag name.
7 |src: Gets/sets image source.

DOM Manipulation
When a built element using JS called DOM manipulation.
Createing Elements
: | createElement(tagName): Create a new element(e.g., div).

   DOM Attributes
   1 | setAttribute(attribute, value): Sets an attribute's value.
   2 | getAttribute(attribute): Gets an attribute's value.
   3 | removeAttribute(attribute): Removes an attribute.

   Insert/Delete Elements
   : | node.append(div): Adds at the end of the node(inside).
   : | node.preend(div): Adds at the start of node(Inside).
   : | node.before(div): Adds before the node(outside).
   : | node.after(div): Adds after the node(outside).
   : | node.remove(div): Remove the node.

Event: An event is an action or occurrence that happens in the browser, usually as a result of user interaction or the browser's system process. 
Type of Events
1 | Mouse Events: (click, dbclick, mousehover, mouseout).
2 | Keyboard events: (keypress, keyup, keydown).
3 | Form events: (submit, change, focus).
4 | Window events: (load, resize, scroll).

There have two ways Event Handler
=======================================================================================
1 | HTML Attribute
    <button onclick="handleClick()"></button>

2 | Inline JavaScript 
   document.getElementById('myButton').onclick = handleClick();

Event Listners
=============================
An event listener is a method that listens for a specific event to happen on a particular element.

: | element: The DOM element you want to attach the listner to.
: | event: The type of event (e.g., click. submit, keydown).
: | eventHandler: Function to be executed when the event occure.

Event Object
=============================
When an event occurs, an event object is automatically created and passed to the event handler.
This object contains useful information about the event, such as the type of event, the target element, and the position of the mouse.
e.g.: e.target, e.type, e.clientX, e.clientY

BOM(Browser Object Model)
=============================
The BOM is a collection of objects that allows JavaScript to interact with the browser.
BOM Components
: | Window Object
: | Location Object 
: | Alert, Prompt, Confirm

window Object & Methods
=============================
: | window.open(): Opens a new tab/window.
: | window.close(): Close the current window.
: | window.scrollTo(): Scroll the window to a position.
: | window.setTimeout(): Delays code execution.
: | window.setInterval(): Repeats code at intervals.

Location Object & Methods
=============================
: | location.href: Gets or sets the current URL.
: | location.reload(): Reload the page.
: | location.assign(): Loads a new URL.
: | location.replace(): Replaces the current page.
: | location.pathname: Gets the URL path.


: | alert(): Shows a message box. 
: | prompt(): Asks for user input.
: | confirm(): Asks for confirmation (OK/Cancel).

Promises: An promise in JS is an object representing the eventual result (sucess/failure) of an asynchronous operation.

Startes of a Promise
: | Pending: Initial state, opearation hasn't completed.
: | Fullfilled: Operation succeed, given a resolved value.
: | Rejected: Operation failed, providing a reason error.
Handling Promises
: | then(): Runs if the promise is FullFilled.
: | catch(): Runs if the promise is rejected.

async
Used to define a function that runs asynchronously and automatically returns a promise. Allows the function to use "await" for handling promises more cleanly.

await
Pauses execution inside an async function until a promise resolves, then returns the resolved value. Makes asynchrounous code look synchronous for better readability.

OOPS
==========================================================================================================

Class: A class is set/collection of objects and we can say a class is blueprint of objects.  & Object.

Encapsulation: This is used for hiding the data.

Polymorphism: Poly(Many/Multiple) & morphism(form) an entity can play multiple role based in the situation.

Abstraction: Shows the functionality and hiding the implementation details.

Inheritance: If you want to accquire the property from the parent class then it is useful using "extends" keyword.

constructor(): It is used for resolved for initilazion problem;
---------------------------------------------------------------------------------------
---------------------------------------------------------------------------------------
What is JavaScript?
JavaScript is the programming language of the web and even we can say through JavaScript we can build brain of the Web Page.

It can update and change both HTML and CSS.

It can calculate, manipulate and validate data.

Why Study JavaScript?
JavaScript is one of the 3 languages all web developers must learn:

   1. HTML to define the content of web pages

   2. CSS to specify the layout of web pages

   3. JavaScript to program the behavior of web pages

Char
-----------------------------
To change the content of an element by its class name using JavaScript, you can use methods like document.getElementsByClassName() (for multiple elements) or document.querySelector() (for single elements).

/* 1rem = 16px */
