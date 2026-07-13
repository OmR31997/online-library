import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import bcrypt from "bcryptjs";
import fs from "fs";
import path from "path";

// Manually load .env file variables to process.env for standalone seed script execution
try {
  const envPath = path.resolve(process.cwd(), ".env");
  if (fs.existsSync(envPath)) {
    const envFile = fs.readFileSync(envPath, "utf-8");
    envFile.split(/\r?\n/).forEach((line) => {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) return;
      const index = trimmed.indexOf("=");
      if (index === -1) return;
      const key = trimmed.substring(0, index).trim();
      let val = trimmed.substring(index + 1).trim();
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
        val = val.slice(1, -1);
      }
      process.env[key] = val;
    });
  }
} catch {
  // Ignore filesystem reading errors
}

// Reconstruct DATABASE_URL dynamically from split env parameters
const buildDatabaseUrl = (): string => {
  const host = process.env.PG_HOST;
  const port = process.env.PG_PORT;
  const user = process.env.PG_USER;
  const password = process.env.PG_PASSWORD;
  const dbName = process.env.PG_DB_NAME;
  const sslMode = process.env.PG_SSL_MODE || "require";
  const connectionLimit = process.env.PG_CONNECTION_LIMIT || "20";
  const caCert = process.env.PG_CA_CERTIFICATE;

  if (!host || !port || !user || !password || !dbName) {
    throw new Error("Missing PostgreSQL database credentials in environment variables.");
  }

  let url = `postgres://${user}:${password}@${host}:${port}/${dbName}?sslmode=${sslMode}&connection_limit=${connectionLimit}`;
  if (caCert) {
    url += `&sslrootcert=${caCert}`;
  }
  return url;
};

const connectionString = buildDatabaseUrl();

const buildPoolConfig = () => {
  const config: any = { connectionString };
  const caCertPath = process.env.PG_CA_CERTIFICATE;
  if (caCertPath) {
    try {
      const resolvedPath = path.resolve(process.cwd(), caCertPath);
      if (fs.existsSync(resolvedPath)) {
        config.ssl = {
          rejectUnauthorized: true,
          ca: fs.readFileSync(resolvedPath, "utf-8"),
        };
      }
    } catch (e) {
      console.error("Failed to load CA certificate during seeding:", e);
    }
  }
  return config;
};

const pool = new Pool(buildPoolConfig());
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Starting database seeding with Angular, SQL, and HTML/CSS/JS/OOPs Tracks...");

  // 1. Clear existing database records
  await prisma.userProgress.deleteMany({});
  await prisma.question.deleteMany({});
  await prisma.quiz.deleteMany({});
  await prisma.tutorial.deleteMany({});
  await prisma.roadmap.deleteMany({});
  await prisma.user.deleteMany({});

  console.log("Cleaned existing records.");

  // 2. Generate secure passwords for accounts
  const adminPasswordHash = await bcrypt.hash("AdminPassword123!", 12);
  const userPasswordHash = await bcrypt.hash("UserPassword123!", 12);

  // 3. Create Admin & Standard Users
  const admin = await prisma.user.create({
    data: {
      name: "Admin User",
      email: "admin@online-library.com",
      password: adminPasswordHash,
      role: "ADMIN",
    },
  });

  const student = await prisma.user.create({
    data: {
      name: "Student User",
      email: "student@online-library.com",
      password: userPasswordHash,
      role: "USER",
    },
  });

  console.log("Created users.");

  // ==========================================
  // ANGULAR DEVELOPER TRACK SEEDING
  // ==========================================
  const angularRoadmap = await prisma.roadmap.create({
    data: {
      title: "Angular Developer Track",
      slug: "angular-developer",
      description: "A comprehensive roadmap from Web Basics and TypeScript to advanced Angular application architecture, routing, RxJS, and Firebase API integrations.",
      published: true,
      nodes: [
        { id: "ang-node-1", label: "JS & TypeScript Basics", position: { x: 150, y: 50 } },
        { id: "ang-node-2", label: "Angular Basics & CLI Scaffolding", position: { x: 150, y: 150 } },
        { id: "ang-node-3", label: "Components & Data Binding", position: { x: 150, y: 250 } },
        { id: "ang-node-4", label: "Directives & Pipes", position: { x: 150, y: 350 } },
        { id: "ang-node-5", label: "Services, Dependency Injection & RxJS", position: { x: 150, y: 450 } },
        { id: "ang-node-6", label: "Routing & Route Guards", position: { x: 150, y: 550 } },
        { id: "ang-node-7", label: "Angular Forms (Template-Driven & Reactive)", position: { x: 150, y: 650 } },
        { id: "ang-node-8", label: "Advanced Integrations & Lifecycle Hooks", position: { x: 150, y: 750 } },
      ],
      edges: [
        { id: "ang-edge-1-2", source: "ang-node-1", target: "ang-node-2" },
        { id: "ang-edge-2-3", source: "ang-node-2", target: "ang-node-3" },
        { id: "ang-edge-3-4", source: "ang-node-3", target: "ang-node-4" },
        { id: "ang-edge-4-5", source: "ang-node-4", target: "ang-node-5" },
        { id: "ang-edge-5-6", source: "ang-node-5", target: "ang-node-6" },
        { id: "ang-edge-6-7", source: "ang-node-6", target: "ang-node-7" },
        { id: "ang-edge-7-8", source: "ang-node-7", target: "ang-node-8" },
      ],
    },
  });

  const angularChapters = [
    {
      title: "Chapter 1: JavaScript & SPA Core Concepts",
      slug: "chapter-1-javascript-spa-core-concepts",
      description: "Understand JavaScript basics, jQuery transition, Single Page Applications, and the differences between React and Angular.",
      content: `## JavaScript Fundamentals
JavaScript in HTML, CSS, and JS is referred to as **Vanilla JavaScript**. It is primarily used to build dynamic web pages, enforce input validations, and construct custom frontend functionalities.

### Single Page Applications (SPA)
*   **Traditional Web Pages**: Loading a new route causes the browser to reload the entire Document Object Model (DOM) content, resulting in screen blinks and slow navigation.
*   **SPA (Single Page Application)**: Loads only the specific parts of the page that have changed. It is highly responsive and preserves state across routing actions.

### jQuery to Modern Frameworks
jQuery was historically utilized to manage DOM parsing and animations. Its popularity diminished as competitors offered modular components. Modern client-side engines are grouped into:
1.  **React JS**: A modular UI library.
2.  **Angular**: A complete developer framework.
3.  **Vue**: A lightweight progressive framework.

---

### React JS vs Angular: Architectural Differences

| Feature | React JS | Angular |
| :--- | :--- | :--- |
| **Architecture** | **Library**: Focuses exclusively on the view layer. Developer chooses router, form handlers, and styles separately. | **Framework**: Full battery-included package. Routing, validations, and modules are provided out-of-the-box. |
| **Data Binding** | One-way data binding (top-down state propagation). | Two-way data binding (automatic synchronizations between template and class). |
| **Language** | JavaScript or TypeScript. | Strictly TypeScript. |
| **Best Used For** | Simple, fast applications or highly custom micro-frontends. | Highly secure enterprise-grade systems (e.g. banking, student management). |
`,
      published: true,
      roadmapId: angularRoadmap.id,
    },
    {
      title: "Chapter 2: Getting Started with TypeScript",
      slug: "chapter-2-getting-started-with-typescript",
      description: "Learn how to install NodeJS, configure npm, and execute the TypeScript compiler (tsc).",
      content: `## Introducing TypeScript
TypeScript adds **static typing** and compiler type safety to JavaScript. Because browsers do not have a native TypeScript engine, TypeScript code is compiled into standard JavaScript code before browser execution.

---

### Step 1: Install NodeJS Runtime Environment
1.  Download Node.js from the official website ([nodejs.org](https://nodejs.org/)).
2.  Follow the package installer steps to complete installation.
3.  Open your terminal/command prompt and verify the installation:
    \`\`\`bash
    node -v
    npm -v
    \`\`\`

---

### Step 2: Install TypeScript Compiler (tsc)
Install the TypeScript compiler globally so you can access the compiler commands:
\`\`\`bash
# Local installation
npm install typescript --save-dev

# Global installation (recommended for CLI usage)
npm install -g typescript
\`\`\`
Verify the TypeScript installation:
\`\`\`bash
tsc -v
\`\`\`

---

### Step 3: Compiling TypeScript to JavaScript
Create a file named \`script.ts\`. Compile it to \`script.js\` using the following command:
\`\`\`bash
# Manual compile
tsc script.ts

# Watch mode (automatically updates JavaScript file on save)
tsc -w
\`\`\`

---

### Step 4: Configuration Files
*   **package.json**: Defines metadata about the project, script shortcuts, and installed packages. Created via:
    \`\`\`bash
    npm init -y
    \`\`\`
*   **tsconfig.json**: Defines the TypeScript compiler configuration settings and strict compiler rules. Created via:
    \`\`\`bash
    tsconfig.json --init
    \`\`\`
`,
      published: true,
      roadmapId: angularRoadmap.id,
    },
    {
      title: "Chapter 3: TypeScript Type System & Data Types",
      slug: "chapter-3-typescript-type-system-data-types",
      description: "Explore type annotations, type inferences, primitives, and non-primitive TypeScript types.",
      content: `## Type Inference vs Annotation
TypeScript understands type declarations in two ways:
1.  **Type Inference**: The compiler automatically guesses the data type based on the initial value assigned.
    \`\`\`typescript
    let age = 25; // Compiler infers type as number
    \`\`\`
2.  **Type Assertion/Annotation**: The programmer explicitly declares the variable's type.
    \`\`\`typescript
    let name: string = "Raj";
    \`\`\`

---

## Primitive Data Types

### 1. \`any\`
Suspends type checking on the variable. Useful for dynamic content or incremental migration:
\`\`\`typescript
let dynamicValue: any = "Hello";
dynamicValue = 42; // Valid
dynamicValue = { name: "Alice" }; // Valid
\`\`\`

### 2. \`number\`, \`string\`, and \`boolean\`
\`\`\`typescript
let score: number = 98.5;
let username: string = "Ajay";
let isActive: boolean = true;
\`\`\`

### 3. \`undefined\` and \`null\`
\`\`\`typescript
let u: undefined = undefined;
let n: null = null;
\`\`\`

### 4. \`union\`
Enables a variable to accept multiple declared types:
\`\`\`typescript
let id: string | number = "ID-1002";
id = 1002; // Valid
\`\`\`

---

## Non-Primitive Data Types

### 1. Objects
\`\`\`typescript
interface RegForm {
  UserName: string;
  Password?: string; // Optional field
  Email: string;
  PhNo: number;
}

let userAccount: RegForm = {
  UserName: "AjayKumar",
  Email: "abc123@gmail.com",
  PhNo: 123456789
};
\`\`\`

### 2. Arrays, Tuples, and Enums
*   **Arrays**:
    \`\`\`typescript
    let scores: number[] = [2, 5, 8, 7];
    \`\`\`
*   **Tuples**: Fixed-length arrays with explicitly defined index types:
    \`\`\`typescript
    let employee: [string, number] = ["Raj", 25];
    \`\`\`
*   **Enums**: Sets of numeric or string constant values:
    \`\`\`typescript
    enum Days {
      Sunday,
      Monday,
      Tuesday,
      Wednesday
    }
    console.log(Days.Sunday); // Logs: 0
    \`\`\`
`,
      published: true,
      roadmapId: angularRoadmap.id,
    },
    {
      title: "Chapter 4: Advanced TS & OOP Principles",
      slug: "chapter-4-advanced-ts-oop-principles",
      description: "Define custom interfaces, functions, the never type, type aliases, and OOP classes.",
      content: `## Functions and Signatures
TypeScript requires parameter and return types for functions:
\`\`\`typescript
function sum(a: number, b: number): number {
  return a + b;
}
\`\`\`

---

## The \`never\` Type
Represents values that will never occur (e.g., functions that throw runtime exceptions or contain infinite loops):
\`\`\`typescript
function raiseError(message: string): never {
  throw new Error(message);
}
\`\`\`

---

## Type Aliases
Provides a custom alias name for existing type definitions:
\`\`\`typescript
type AlphaNumeric = string | number;
let username: AlphaNumeric = "Raj";
let userId: AlphaNumeric = 1204;
\`\`\`

---

## Object-Oriented Programming (OOP)
TypeScript is a fully Object-Oriented programming language supporting the six major OOP tenets:
1.  **Class**: Template blueprints for object generation.
2.  **Object**: Instantiated class representations.
3.  **Inheritance**: Subclassing code reuse.
4.  **Encapsulation**: Private field scoping.
5.  **Abstraction**: Hiding internal implementation logic (using interfaces).
6.  **Polymorphism**: Method overriding and overloading signatures.

---

## Modules (Import and Export)
Code modules enable isolating code across files using ES6 syntax:
\`\`\`typescript
// user.service.ts
export class UserService {
  getUsers() { return ["Alice", "Bob"]; }
}

// app.component.ts
import { UserService } from "./user.service";
\`\`\`
`,
      published: true,
      roadmapId: angularRoadmap.id,
    },
    {
      title: "Chapter 5: Angular Overview & Project Scaffolding",
      slug: "chapter-5-angular-overview-project-scaffolding",
      description: "Understand Angular CLI commands and the standard directory scaffolding configuration.",
      content: `## Angular Architecture
Angular is a component-driven TypeScript framework designed for constructing high-performance Single Page Applications (SPAs) and Progressive Web Applications (PWAs).

---

### Step 1: Install Angular CLI Globally
\`\`\`bash
npm install -g @angular/cli
\`\`\`

### Step 2: Create a New Angular Application
Create a non-standalone module-based project (standard template for Angular 16/17):
\`\`\`bash
ng new my-angular-app --standalone=false
\`\`\`
Select **CSS** as your styling system and select **No** for Server-Side Rendering (SSR) options when prompted.

---

## Understanding Project Scaffolding

- **.vscode/**: Optimizes target settings and tasks for developers using VS Code.
- **tsconfig.json**: Root compiler config.
- **tsconfig.app.json**: Overrides typescript options specifically for the application execution scope.
- **package.json**: Manages project packages and execution scripts.
- **angular.json**: Configuration file for compiler pathways, asset bundles, and dev server options.
- **.gitignore**: Specifies files to prevent committing to Git (like \`node_modules/\`).
- **.editorconfig**: Standardizes indentation rules across different code editors.
- **src/**: The active application source directory containing component code.
- **node_modules/**: External libraries.
- **public/**: Houses global static assets.
`,
      published: true,
      roadmapId: angularRoadmap.id,
    },
    {
      title: "Chapter 6: Understanding Angular Components",
      slug: "chapter-6-understanding-angular-components",
      description: "Anatomy of an Angular component and compiling files via standard commands.",
      content: `## Component Scaffolding
Every Angular component represents a modular UI division. Components always contain four distinct files:
1.  **app.component.ts**: Houses the controller logic and variables.
2.  **app.component.html**: Visual template structure.
3.  **app.component.css**: Scoped styling classes.
4.  **app.component.spec.ts**: Test cases.

---

### Component Declaration Example
\`\`\`typescript
import { Component } from "@angular/core";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"]
})
export class AppComponent {
  title = "online-library-angular";
}
\`\`\`

---

### CLI Command Component Generation
Use the Angular CLI to generate components automatically:
\`\`\`bash
ng generate component component-name
\`\`\`

---

### Running the Application Development Server
Run the local dev server and open the browser automatically:
\`\`\`bash
ng serve -o
\`\`\`
The application will default to running on **http://localhost:4200/**.
`,
      published: true,
      roadmapId: angularRoadmap.id,
    },
    {
      title: "Chapter 7: Angular Data Binding",
      slug: "chapter-7-angular-data-binding",
      description: "Learn about string interpolation, property binding, event binding, and two-way data binding.",
      content: `## One-Way Data Binding

### 1. String Interpolation \`{{ }}\`
Injects TypeScript variables into HTML template views as dynamic strings:
*   **TypeScript Class (\`app.component.ts\`)**:
    \`\`\`typescript
    data = "Angular Data Binding";
    \`\`\`
*   **HTML Template (\`app.component.html\`)**:
    \`\`\`html
    <p>{{ data }}</p>
    \`\`\`

### 2. Property Binding \`[property]\`
Binds dynamic variables directly to DOM properties:
*   **TypeScript Class**:
    \`\`\`typescript
    isBtnDisabled = true;
    \`\`\`
*   **HTML Template**:
    \`\`\`html
    <button [disabled]="isBtnDisabled">Click Me</button>
    \`\`\`

### 3. Event Binding \`(event)\`
Listens for user actions and triggers class functions:
*   **HTML Template**:
    \`\`\`html
    <input type="email" placeholder="Enter email" (change)="onEmailChange($event)">
    \`\`\`
*   **TypeScript Class**:
    \`\`\`typescript
    onEmailChange(event: Event) {
      const input = event.target as HTMLInputElement;
      console.log(input.value);
    }
    \`\`\`

---

## Two-Way Data Binding \`[(ngModel)]\`
Keeps the template values and controller variables synchronized.
1.  Import \`FormsModule\` in **\`app.module.ts\`**:
    \`\`\`typescript
    import { FormsModule } from "@angular/forms";
    
    @NgModule({
      imports: [FormsModule],
      // ...
    })
    \`\`\`
2.  Use the banana-in-a-box syntax:
    *   **HTML**:
        \`\`\`html
        <input type="email" placeholder="Enter email" [(ngModel)]="userEmail">
        \`\`\`
    *   **TypeScript**:
        \`\`\`typescript
        userEmail = "";
        \`\`\`
`,
      published: true,
      roadmapId: angularRoadmap.id,
    },
    {
      title: "Chapter 8: Component Communication & Interactions",
      slug: "chapter-8-component-communication-interactions",
      description: "Pass data between parent and child components using @Input, @Output, and @ViewChild.",
      content: `## 1. Parent to Child: \`@Input()\`
Passes data from a parent component down to a nested child component:
*   **Child Component Class (\`child.component.ts\`)**:
    \`\`\`typescript
    import { Component, Input } from "@angular/core";

    @Component({
      selector: "app-child",
      template: "<p>Child Name: {{ childName }}</p>"
    })
    export class ChildComponent {
      @Input() childName: string = "";
    }
    \`\`\`
*   **Parent Component Template**:
    \`\`\`html
    <app-child [childName]="'Angular Application'"></app-child>
    \`\`\`

---

## 2. Child to Parent: \`@Output()\` & \`EventEmitter\`
Sends events from a child component back up to the parent component:
*   **Child Component Class**:
    \`\`\`typescript
    import { Component, Output, EventEmitter } from "@angular/core";

    export class ChildComponent {
      @Output() notifyParent = new EventEmitter<string>();

      sendNotification() {
        this.notifyParent.emit("Action Completed!");
      }
    }
    \`\`\`
*   **Parent Component Template**:
    \`\`\`html
    <app-child (notifyParent)="onChildNotification($event)"></app-child>
    \`\`\`

---

## 3. Template-Reference Variables \`#Name\`
Assigns a temporary handle to nested elements inside the HTML template:
\`\`\`html
<app-child #childReference></app-child>
<button (click)="childReference.sendNotification()">Trigger Child</button>
\`\`\`

---

## 4. Querying Children: \`@ViewChild()\`
Grants the parent component programmatical access to a child component or DOM element:
\`\`\`typescript
import { Component, ViewChild, AfterViewInit } from "@angular/core";
import { ChildComponent } from "./child.component";

export class ParentComponent implements AfterViewInit {
  @ViewChild(ChildComponent) childComponent!: ChildComponent;

  ngAfterViewInit() {
    this.childComponent.sendNotification(); // Call child method
  }
}
\`\`\`
`,
      published: true,
      roadmapId: angularRoadmap.id,
    },
    {
      title: "Chapter 9: Attribute & Structural Directives",
      slug: "chapter-9-attribute-structural-directives",
      description: "Use ngClass, ngStyle, *ngIf, *ngFor, and ngSwitch directives to manipulate DOM elements.",
      content: `## 1. Property/Attribute Directives
Modify the appearance or behavior of existing DOM elements.

### \`[ngClass]\`
Dynamically appends CSS class tags:
\`\`\`html
<div [ngClass]="{'hidden-class': !isDisplayed}">Content Box</div>
\`\`\`

### \`[ngStyle]\`
Applies custom inline styles:
\`\`\`html
<div [ngStyle]="{'color': isThemeLight ? 'black' : 'white', 'font-size': fontSize + 'px'}">
  Styled Content
</div>
\`\`\`

---

## 2. Structural Directives
Change the structure of the DOM by adding, removing, or re-rendering elements. They are prefixed with an asterisk (\`*\`).

### \`*ngIf\`
Conditionally renders an element based on a boolean value:
\`\`\`html
<div *ngIf="isUserLoggedIn">
  <p>Welcome back, User!</p>
</div>
\`\`\`

### \`[ngSwitch]\`
Displays a specific matching element from multiple options:
\`\`\`html
<div [ngSwitch]="userRole">
  <div *ngSwitchCase="'Admin'">Admin Dashboard View</div>
  <div *ngSwitchCase="'Student'">Student Dashboard View</div>
  <div *ngSwitchDefault>Please Check Your Access Option</div>
</div>
\`\`\`

### \`*ngFor\`
Iterates over arrays and renders template elements:
\`\`\`html
<div class="recipes-list">
  <div class="recipe" *ngFor="let dish of recipes">
    <h2>{{ dish.name }}</h2>
    <p>Ingredients:</p>
    <ul>
      <li *ngFor="let ingredient of dish.ingredients">{{ ingredient }}</li>
    </ul>
  </div>
</div>
\`\`\`
`,
      published: true,
      roadmapId: angularRoadmap.id,
    },
    {
      title: "Chapter 10: Angular Services & API Integrations",
      slug: "chapter-10-angular-services-api-integrations",
      description: "Build common services, implement dependency injections, and consume API routes.",
      content: `## Angular Services
Services organize common data and reuse API logics across multiple components. They are decorated with the \`@Injectable\` decorator.

---

### Step 1: Create a New Service
\`\`\`bash
ng generate service service_name
\`\`\`
This creates \`service_name.service.ts\` and \`service_name.service.spec.ts\`.

---

### Step 2: Implement Dependency Injection
To consume service data, instantiate the service directly inside the component's constructor parameter list:
\`\`\`typescript
import { Component } from "@angular/core";
import { RecipeDataService } from "./recipe-data.service";

export class AppComponent {
  recipes: any[] = [];
  
  constructor(private recipeService: RecipeDataService) {
    this.recipes = this.recipeService.getRecipes();
  }
}
\`\`\`

---

## API Integrations: Fetch vs HttpClient

| Feature | native \`fetch\` | Angular \`HttpClient\` |
| :--- | :--- | :--- |
| **Response Type** | Returns a **Promise** (handles one event trigger). | Returns an **Observable** (handles continuous data streams). |
| **Methods** | Built-in to browsers; requires manual JSON parsing. | Integrated within the framework; parses JSON automatically. |
| **Interceptors** | Requires wrapper methods. | Native support for HTTP interceptors (adding auth headers, logging). |

---

### Consuming APIs via HttpClient
1.  Import \`HttpClientModule\` in **\`app.module.ts\`**:
    \`\`\`typescript
    import { HttpClientModule } from "@angular/common/http";
    
    @NgModule({
      imports: [HttpClientModule],
      // ...
    })
    \`\`\`
2.  Inject \`HttpClient\` in your service and fetch data:
    \`\`\`typescript
    import { Injectable } from "@angular/core";
    import { HttpClient } from "@angular/common/http";
    import { Observable } from "rxjs";

    @Injectable({
      providedIn: "root"
    })
    export class ApiService {
      constructor(private http: HttpClient) {}

      getRecipes(): Observable<any> {
        return this.http.get("https://dummyjson.com/recipes");
      }
    }
    \`\`\`
3.  Subscribe to the observable in your component:
    \`\`\`typescript
    this.apiService.getRecipes().subscribe({
      next: (data) => this.recipes = data.recipes,
      error: (error) => console.error("Error occurred:", error)
    });
    \`\`\`
`,
      published: true,
      roadmapId: angularRoadmap.id,
    },
    {
      title: "Chapter 11: RxJS Observables & Pipeable Operators",
      slug: "chapter-11-rxjs-observables-pipeable-operators",
      description: "Manage async data streams using RxJS, of, from, map, and filter operators.",
      content: `## RxJS (Reactive Extensions for JavaScript)
RxJS handles asynchronous streams of data and events using **Observables**, **Subscriptions**, and **Operators**.

*   **Observable**: A stream of data that can be observed.
*   **Subscription**: Represents the execution of an Observable (can be cancelled using \`.unsubscribe()\`).
*   **Operators**: Functions that transform or filter data streams.

---

## 1. Creational Operators
Used to instantiate new Observables.

### \`of\`
Emits arguments sequentially, then completes:
\`\`\`typescript
import { of } from "rxjs";

const stream = of(3, 6, 7);
stream.subscribe(x => console.log(x)); // Logs: 3, 6, 7
\`\`\`

### \`from\`
Converts arrays, promises, or iterables into Observables:
\`\`\`typescript
import { from } from "rxjs";

const arrayStream = from([10, 20, 30]);
arrayStream.subscribe(val => console.log(val));
\`\`\`

### \`interval\`
Emits sequential numbers at specified time intervals:
\`\`\`typescript
import { interval } from "rxjs";

const ticks = interval(1000); // Emits every second
\`\`\`

---

## 2. Pipeable Operators
Transform streams before the data reaches the subscriber.

### \`map\`
Applies a transformation function to each emitted value:
\`\`\`typescript
import { of, map } from "rxjs";

of(1, 2, 3)
  .pipe(map(v => v * 10))
  .subscribe(x => console.log(x)); // Logs: 10, 20, 30
\`\`\`

### \`filter\`
Selects values that satisfy a boolean condition:
\`\`\`typescript
import { of, filter } from "rxjs";

of(1, 2, 3, 4, 5)
  .pipe(filter(v => v % 2 === 0))
  .subscribe(x => console.log(x)); // Logs: 2, 4
\`\`\`
`,
      published: true,
      roadmapId: angularRoadmap.id,
    },
    {
      title: "Chapter 12: RxJS Subjects & State Management",
      slug: "chapter-12-rxjs-subjects-state-management",
      description: "Differentiate between simple, behavior, replay, and async subjects.",
      content: `## RxJS Subjects
A Subject is a special type of Observable that allows values to be **multicast** to many observers. It acts as both an **Observable** and an **Observer**.

---

## Types of Subjects

### 1. Simple Subject
*   Does not store values.
*   New subscribers do not receive previously emitted values.
\`\`\`typescript
import { Subject } from "rxjs";

const subject = new Subject<number>();
subject.subscribe(val => console.log("Sub A:", val));
subject.next(1); // Emits to Sub A

subject.subscribe(val => console.log("Sub B:", val));
subject.next(2); // Emits to both Sub A and Sub B
\`\`\`

---

### 2. BehaviorSubject
*   Requires an **initial value** at instantiation.
*   Caches the last emitted value.
*   Emits the cached value immediately to new subscribers.
\`\`\`typescript
import { BehaviorSubject } from "rxjs";

const behavior = new BehaviorSubject<number>(0); // Initial value is 0
behavior.subscribe(val => console.log("Subscriber:", val)); // Logs: 0
behavior.next(10); // Logs: 10
\`\`\`

---

### 3. ReplaySubject
*   Records and replays multiple historical values to new subscribers.
*   Accepts a buffer size configuration.
\`\`\`typescript
import { ReplaySubject } from "rxjs";

const replay = new ReplaySubject<number>(2); // Buffer size 2
replay.next(1);
replay.next(2);
replay.next(3);

// Subscriber gets the last 2 values (2 and 3)
replay.subscribe(val => console.log("Replay:", val)); // Logs: 2, 3
\`\`\`

---

### 4. AsyncSubject
*   Emits only the last value, and only after the execution completes.
\`\`\`typescript
import { AsyncSubject } from "rxjs";

const asyncSub = new AsyncSubject<number>();
asyncSub.next(1);
asyncSub.next(2);
asyncSub.complete(); // Emits 2 to subscribers
\`\`\`
`,
      published: true,
      roadmapId: angularRoadmap.id,
    },
    {
      title: "Chapter 13: Angular Routing Essentials",
      slug: "chapter-13-angular-routing-essentials",
      description: "Define route configurations, route outlets, wildcards, and child routes.",
      content: `## Routing Module Configuration
Routing maps browser URL paths to specific Angular components.

---

### Step 1: Create a Routing Module
Create a routing array in **\`app-routing.module.ts\`**:
\`\`\`typescript
import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { HomeComponent } from "./home.component";
import { PageNotFoundComponent } from "./not-found.component";

const routes: Routes = [
  { path: "", redirectTo: "/home", pathMatch: "full" },
  { path: "home", component: HomeComponent },
  // Wildcard route (matches undefined paths)
  { path: "**", component: PageNotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
\`\`\`

---

### Step 2: Render Nested Route Components
Define where the routed components should render in your parent template:
\`\`\`html
<!-- app.component.html -->
<nav>
  <!-- Use routerLink instead of href to avoid reloading the browser -->
  <a routerLink="/home">Home</a>
</nav>

<div className="main-content">
  <router-outlet></router-outlet>
</div>
\`\`\`

---

### Step 3: Children Routing
Nest sub-routes inside parents:
\`\`\`typescript
const routes: Routes = [
  {
    path: "home",
    component: HomeComponent,
    children: [
      { path: "about", component: AboutComponent },
      { path: "contact", component: ContactComponent }
    ]
  }
];
\`\`\`
`,
      published: true,
      roadmapId: angularRoadmap.id,
    },
    {
      title: "Chapter 14: Dynamic Routing & Guards",
      slug: "chapter-14-dynamic-routing-guards",
      description: "Utilize dynamic routes and implement authorization guards.",
      content: `## Dynamic Routing
Binds variable placeholders (route parameters) in path mappings:
\`\`\`typescript
const routes: Routes = [
  { path: "tutorials/:id", component: TutorialDetailComponent }
];
\`\`\`
Inside the component, inject \`ActivatedRoute\` to read the dynamic parameter value:
\`\`\`typescript
import { ActivatedRoute } from "@angular/router";

constructor(private route: ActivatedRoute) {
  const id = this.route.snapshot.paramMap.get("id");
  console.log("Loading tutorial ID:", id);
}
\`\`\`

---

## Route Guards
Guards protect route paths from unauthorized access. The main types of guards are:
1.  **CanActivate**: Validates authorization before loading a route.
2.  **CanDeactivate**: Confirms actions before leaving a route (e.g. warning user of unsaved forms).
3.  **CanChildActivate**: Secures child paths.
4.  **CanMatch**: Restricts bundle loading if route details do not align.

---

### Step 1: Generate a Route Guard
\`\`\`bash
ng generate guard auth
\`\`\`

### Step 2: Implement Guard Security Logic
Define the guard function in **\`auth.guard.ts\`**:
\`\`\`typescript
import { CanActivateFn, Router } from "@angular/router";
import { inject } from "@angular/core";

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const userToken = localStorage.getItem("auth-token");
  
  if (userToken) {
    return true;
  }
  
  router.navigate(["/login"]);
  return false;
};
\`\`\`

### Step 3: Apply the Guard to Protected Routes
\`\`\`typescript
const routes: Routes = [
  { path: "admin", component: AdminComponent, canActivate: [authGuard] }
];
\`\`\`
`,
      published: true,
      roadmapId: angularRoadmap.id,
    },
    {
      title: "Chapter 15: Introduction to Angular Forms",
      slug: "chapter-15-introduction-to-angular-forms",
      description: "Form state validations, ngModel binding structures, and errors mapping.",
      content: `## Template-Driven vs Reactive Forms

*   **Template-Driven Forms**: Directives in the HTML template manage validations and structure. Recommended for simple form requirements.
*   **Reactive Forms**: The form model is defined explicitly in TypeScript classes. Highly robust, customizable, and testable.

---

## Form Control State Flags
Every form input tracks key boolean states:
*   **valid / invalid**: Indicates whether all validation rules have passed.
*   **pristine / dirty**: Shows whether the user has interacted with/modified the input value.
*   **touched / untouched**: Tells you if the input has lost focus (triggering validation display on blur).
*   **enabled / disabled**: Tracks the active input state.

---

## Template Validation Example
Bind your input control to a template reference variable mapping to \`ngModel\` to inspect control validation states:
\`\`\`html
<form #contactForm="ngForm" (submit)="onSubmit(contactForm)">
  <div className="form-group">
    <label>Enter Password:</label>
    <input 
      type="password" 
      name="pwd" 
      ngModel 
      required 
      minlength="8" 
      #pwdInput="ngModel"
    >
    
    <!-- Render validation alerts dynamically -->
    <div *ngIf="pwdInput.touched && pwdInput.invalid" className="text-red">
      <span *ngIf="pwdInput.errors?.['required']">Password input is required.</span>
      <span *ngIf="pwdInput.errors?.['minlength']">Minimum length is 8 characters.</span>
    </div>
  </div>
  
  <button type="submit" [disabled]="contactForm.invalid">Submit</button>
</form>
\`\`\`
`,
      published: true,
      roadmapId: angularRoadmap.id,
    },
    {
      title: "Chapter 16: Building Reactive Forms",
      slug: "chapter-16-building-reactive-forms",
      description: "Implement FormGroup, FormControl, Validators, and regular expressions.",
      content: `## Implementing Reactive Forms

---

### Step 1: Import ReactiveFormsModule
Add the module to your imports array in **\`app.module.ts\`**:
\`\`\`typescript
import { ReactiveFormsModule } from "@angular/forms";

@NgModule({
  imports: [ReactiveFormsModule],
  // ...
})
\`\`\`

---

### Step 2: Initialize FormGroup in Component Class
Defines controls and validation rules in **\`signup.component.ts\`**:
\`\`\`typescript
import { Component } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";

export class SignupComponent {
  signupForm = new FormGroup({
    username: new FormControl("", [Validators.required, Validators.minLength(3)]),
    email: new FormControl("", [
      Validators.required, 
      Validators.pattern("^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$")
    ]),
    password: new FormControl("", [Validators.required, Validators.minLength(6)])
  });

  onSignup() {
    if (this.signupForm.valid) {
      console.log("Payload:", this.signupForm.value);
    }
  }
}
\`\`\`

---

### Step 3: Link HTML Template to FormGroup
Link your HTML form using the \`[formGroup]\` and \`formControlName\` attributes:
\`\`\`html
<form [formGroup]="signupForm" (ngSubmit)="onSignup()">
  <div>
    <label>Username:</label>
    <input type="text" formControlName="username">
  </div>
  
  <div>
    <label>Email Address:</label>
    <input type="email" formControlName="email">
  </div>
  
  <div>
    <label>Password:</label>
    <input type="password" formControlName="password">
  </div>

  <button type="submit" [disabled]="signupForm.invalid">Register</button>
</form>
\`\`\`
`,
      published: true,
      roadmapId: angularRoadmap.id,
    },
    {
      title: "Chapter 17: Firebase Authentication Integration",
      slug: "chapter-17-firebase-authentication-integration",
      description: "Integrate Firebase Authentication for Email/Password and Google sign-in.",
      content: `## Firebase Backend-as-a-Service (BaaS)
Firebase offers authentication and data hosting out-of-the-box.

---

### Step 1: Install Firebase SDK
\`\`\`bash
npm install firebase
\`\`\`

---

### Step 2: Configure Environment Keys
Add your Firebase keys in the environment settings:
\`\`\`typescript
// environment.ts
export const firebaseConfig = {
  apiKey: "AIzaSyCTNpnLg1pHGUmtQPFwcPUNiq7CVMj7TYs",
  authDomain: "ang-ecommerce-62110.firebaseapp.com",
  projectId: "ang-ecommerce-62110",
  storageBucket: "ang-ecommerce-62110.appspot.com",
  messagingSenderId: "322692671092",
  appId: "1:322692671092:web:8bb052ce89a36c312cd321"
};
\`\`\`

---

### Step 3: Initialize Firebase Instance
\`\`\`typescript
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { firebaseConfig } from "./environment";

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
\`\`\`

---

### Step 4: Email & Password Sign Up Logic
\`\`\`typescript
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "./firebase-config";

createUserWithEmailAndPassword(auth, email, password)
  .then((userCredential) => {
    console.log("Account Created:", userCredential.user);
  })
  .catch((error) => {
    console.error("Signup Error:", error.message);
  });
\`\`\`

---

### Step 5: Google Authentication with Popup
\`\`\`typescript
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth } from "./firebase-config";

const provider = new GoogleAuthProvider();

signInWithPopup(auth, provider)
  .then((result) => {
    const user = result.user;
    console.log("Google User Authenticated:", user.displayName);
  })
  .catch((error) => {
    console.error("Google Authentication Failed:", error.message);
  });
\`\`\`
`,
      published: true,
      roadmapId: angularRoadmap.id,
    },
    {
      title: "Chapter 18: Lifecycle Hooks & UI Libraries",
      slug: "chapter-18-lifecycle-hooks-ui-libraries",
      description: "Manage component lifecycles and integrate Bootstrap or Font-Awesome.",
      content: `## Component Lifecycle Hooks
Angular calls specific lifecycle hook methods as it instantiates, updates, and destroys components.

---

### Key Lifecycle Hooks

1.  **ngOnChanges()**: Fires when component input bindings (\`@Input\`) change.
2.  **ngOnInit()**: Runs once during component initialization. Place data-fetching logic here.
3.  **ngDoCheck()**: Executes during custom change detection sweeps.
4.  **ngAfterContentInit()**: Runs once after project content has initialized.
5.  **ngAfterContentChecked()**: Fires after project content updates.
6.  **ngAfterViewInit()**: Fires once after component templates and child views initialize.
7.  **ngAfterViewChecked()**: Runs after template updates have compiled.
8.  **ngOnDestroy()**: Triggered immediately before Angular destroys the component. Use this to cancel active subscriptions and avoid memory leaks.

\`\`\`typescript
import { Component, OnInit, OnDestroy } from "@angular/core";

export class DataComponent implements OnInit, OnDestroy {
  ngOnInit() {
    console.log("Component loaded. Fetching data...");
  }

  ngOnDestroy() {
    console.log("Component destroyed. Releasing memory resources...");
  }
}
\`\`\`

---

## Integrating Styling Libraries

### 1. Font Awesome
Add vector icon support:
\`\`\`bash
npm install @fortawesome/fontawesome-free
\`\`\`
Import the font-awesome css file in your global styles config.

### 2. Bootstrap Style Setup
1.  Install the package:
    \`\`\`bash
    npm install bootstrap
    \`\`\`
2.  Import styles in **\`angular.json\`**:
    \`\`\`json
    "styles": [
      "src/styles.css",
      "node_modules/bootstrap/dist/css/bootstrap.min.css"
    ]
    \`\`\`
3.  Alternatively, import the stylesheet directly in **\`src/styles.css\`**:
    \`\`\`css
    @import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
    \`\`\`
`,
      published: true,
      roadmapId: angularRoadmap.id,
    }
  ];

  for (const ch of angularChapters) {
    await prisma.tutorial.create({
      data: ch,
    });
  }

  console.log("Angular tutorials seeded.");

  // ==========================================
  // SQL & DATABASE TRACK SEEDING
  // ==========================================
  const sqlRoadmap = await prisma.roadmap.create({
    data: {
      title: "SQL & Database Administration",
      slug: "sql-and-database-administration",
      description: "A complete step-by-step path to mastering relational databases, SQL queries, database indexing, T-SQL programming, and security administration.",
      published: true,
      nodes: [
        { id: "sql-node-1", label: "Relational Theory & RDBMS", position: { x: 150, y: 50 } },
        { id: "sql-node-2", label: "SQL Datatypes & Table Design (DDL)", position: { x: 150, y: 150 } },
        { id: "sql-node-3", label: "Integrity Constraints & Keys", position: { x: 150, y: 250 } },
        { id: "sql-node-4", label: "Data Manipulation (DML) & Queries (DQL)", position: { x: 150, y: 350 } },
        { id: "sql-node-5", label: "SQL Functions & String Utilities", position: { x: 150, y: 450 } },
        { id: "sql-node-6", label: "Data Grouping, Rollups & Aggregations", position: { x: 150, y: 550 } },
        { id: "sql-node-7", label: "Table Joins (Inner, Outer, Self, Cross)", position: { x: 150, y: 650 } },
        { id: "sql-node-8", label: "Subqueries, CTEs & Temp Tables", position: { x: 150, y: 750 } },
        { id: "sql-node-9", label: "Indexes & Query Optimization", position: { x: 150, y: 850 } },
        { id: "sql-node-10", label: "Views, Security & Privileges", position: { x: 150, y: 950 } },
        { id: "sql-node-11", label: "T-SQL Programming & Stored Procedures", position: { x: 150, y: 1050 } },
        { id: "sql-node-12", label: "Database Triggers & Audit Logs", position: { x: 150, y: 1150 } },
      ],
      edges: [
        { id: "sql-edge-1-2", source: "sql-node-1", target: "sql-node-2" },
        { id: "sql-edge-2-3", source: "sql-node-2", target: "sql-node-3" },
        { id: "sql-edge-3-4", source: "sql-node-3", target: "sql-node-4" },
        { id: "sql-edge-4-5", source: "sql-node-4", target: "sql-node-5" },
        { id: "sql-edge-5-6", source: "sql-node-5", target: "sql-node-6" },
        { id: "sql-edge-6-7", source: "sql-node-6", target: "sql-node-7" },
        { id: "sql-edge-7-8", source: "sql-node-7", target: "sql-node-8" },
        { id: "sql-edge-8-9", source: "sql-node-8", target: "sql-node-9" },
        { id: "sql-edge-9-10", source: "sql-node-9", target: "sql-node-10" },
        { id: "sql-edge-10-11", source: "sql-node-10", target: "sql-node-11" },
        { id: "sql-edge-11-12", source: "sql-node-11", target: "sql-node-12" },
      ],
    },
  });

  const sqlChapters = [
    {
      title: "Chapter 1: Introduction to Databases & DBMS",
      slug: "chapter-1-introduction-to-databases-dbms",
      description: "Define database concepts, explore OLTP vs OLAP setups, and track the evolution of databases.",
      content: `## What is a Database?
A Database is an organized collection of interrelated data. For example, a University database stores data related to Students, Courses, and Faculty.

---

## Types of Databases

### 1. OLTP DB (Online Transaction Processing)
*   Used by organizations to store day-to-day transactions.
*   Highly optimized for **running the business** (high-frequency inserts, updates, and deletes).

### 2. OLAP DB (Online Analytical Processing)
*   Used to aggregate historical records.
*   Highly optimized for **analyzing the business** and data analysis queries.

---

## Day-to-Day Database Operations
Standard data modifications are grouped as **CRUD** operations:
*   **C**: CREATE (inserting new records).
*   **R**: READ (retrieving information).
*   **U**: UPDATE (modifying existing fields).
*   **D**: DELETE (removing obsolete records).

---

## Database Management Systems (DBMS)
A DBMS is software used to create, organize, and manage databases. It serves as the primary interface between the user/application and the underlying storage system.

---

## Evolution of Databases
*   **1960**: File Management Systems (FMS)
*   **1970**: Hierarchical DBMS (HDBMS) and Network DBMS (NDBMS)
*   **1980**: Relational DBMS (RDBMS)
*   **1990**: Object Relational DBMS (ORDBMS)
`,
      published: true,
      roadmapId: sqlRoadmap.id,
    },
    {
      title: "Chapter 2: Relational Theory & RDBMS Basics",
      slug: "chapter-2-relational-theory-rdbms-basics",
      description: "Master RDBMS structures, E.F. Codd's rules, primary keys, and tables.",
      content: `## Relational DBMS (RDBMS)
Relational databases represent records inside standardized tables containing rows (records/tuples) and columns (fields/attributes). RDBMS concepts were introduced by **E.F. Codd**, who defined **12 rules** that govern RDBMS structures. A database engine that supports all 12 rules is considered a perfect RDBMS.

---

## The Information Rule
According to the Information Rule, all information in a relational database must be organized in tables consisting of rows and columns.

---

## Core Definitions
*   **Database**: A structured collection of tables.
*   **Table**: An entity associated with a set of attributes.
*   **Row (Tuple/Record)**: A collection of field values representing a single entry.
*   **Column (Field/Attribute)**: A collection of values assigned to one attribute across all records.

---

## Primary Keys
Every table must contain a **Primary Key** to uniquely identify each record. A primary key cannot contain duplicate values and cannot contain NULLs.
Examples of primary keys:
*   \`ACCOUNT_NO\`
*   \`EMPLOYEE_ID\`
*   \`AADHAR_NO\`
*   \`PAN_NO\`
`,
      published: true,
      roadmapId: sqlRoadmap.id,
    },
    {
      title: "Chapter 3: SQL Sublanguages & Datatypes",
      slug: "chapter-3-sql-sublanguages-datatypes",
      description: "Learn about DDL, DML, DQL, TCL, and DCL sublanguages and common SQL datatypes.",
      content: `## Structured Query Language (SQL)
SQL is the standard language used to communicate with Relational Databases.

---

## SQL Sublanguages

1.  **DDL (Data Definition Language)**: Defines and modifies database schemas.
    *   Commands: \`CREATE\`, \`ALTER\`, \`DROP\`, \`TRUNCATE\`
2.  **DML (Data Manipulation Language)**: Modifies record data inside tables.
    *   Commands: \`INSERT\`, \`UPDATE\`, \`DELETE\`, \`MERGE\`
3.  **DQL (Data Query Language)**: Retrieves records.
    *   Commands: \`SELECT\`
4.  **TCL (Transaction Control Language)**: Manages transaction boundaries.
    *   Commands: \`COMMIT\`, \`ROLLBACK\`, \`SAVE TRANSACTION\`
5.  **DCL (Data Control Language)**: Manages security and permissions.
    *   Commands: \`GRANT\`, \`REVOKE\`

---

## Common SQL Datatypes

### 1. Character Types
*   **\`CHAR(size)\`**: Fixed-length character columns (up to 8,000 characters). Wastes space if the input is shorter than the declared size, as it pads with spaces. Recommended for fixed-length fields (e.g. \`GENDER CHAR(1)\`).
*   **\`VARCHAR(size)\`**: Variable-length character columns (up to 8,000 characters). Recommended for varying text.
*   **\`VARCHAR(MAX)\`**: Large object text storage up to 2GB.
*   **\`NCHAR\` / \`NVARCHAR\`**: UNICODE variants for multi-language support.

### 2. Numeric & Decimal Types
*   **Integer types**: \`TINYINT\` (1 byte), \`SMALLINT\` (2 bytes), \`INT\` (4 bytes), \`BIGINT\` (8 bytes).
*   **\`NUMERIC(P, S)\` / \`DECIMAL(P, S)\`**: Exact numeric data. \`P\` represents precision (total digits), and \`S\` represents scale (decimal places).

### 3. Currency Types
*   **\`SMALLMONEY\`** (4 bytes) and **\`MONEY\`** (8 bytes).

### 4. Date & Time Types
*   **\`DATE\`** (yyyy-mm-dd), **\`TIME\`** (hh:mm:ss), and **\`DATETIME\`**.
`,
      published: true,
      roadmapId: sqlRoadmap.id,
    },
    {
      title: "Chapter 4: DDL Commands & Schema Modifications",
      slug: "chapter-4-ddl-commands-schema-modifications",
      description: "Learn how to use CREATE, ALTER, DROP, and TRUNCATE to manage table schemas.",
      content: `## 1. Creating Tables (\`CREATE TABLE\`)
Syntax:
\`\`\`sql
CREATE TABLE table_name (
  column_1 datatype constraints,
  column_2 datatype constraints
);
\`\`\`
Rules for Table Names:
1.  Must start with a letter.
2.  Cannot contain spaces or special characters except for \`_\`, \`#\`, or \`$\`.
3.  Length must be up to 128 characters.

---

## 2. Table Inspection (\`SP_HELP\`)
To view the schema and metadata of an existing table:
\`\`\`sql
SP_HELP EMP;
\`\`\`

---

## 3. Modifying Tables (\`ALTER TABLE\`)
*   **Adding Columns**:
    \`\`\`sql
    ALTER TABLE EMP ADD GENDER CHAR(1);
    \`\`\`
*   **Dropping Columns**:
    \`\`\`sql
    ALTER TABLE EMP DROP COLUMN GENDER;
    \`\`\`
*   **Modifying Column Type**:
    \`\`\`sql
    ALTER TABLE EMP ALTER COLUMN ENAME VARCHAR(20);
    \`\`\`

---

## 4. Deleting Tables: \`DROP\` vs \`TRUNCATE\`

| Feature | \`DROP TABLE\` | \`TRUNCATE TABLE\` |
| :--- | :--- | :--- |
| **Category** | DDL | DDL |
| **Action** | Deletes both table structure and data. | Empties all data but keeps the table structure. |
| **Memory** | Releases all allocated memory. | Releases memory. |
| **Speed** | Fast. | Extremely fast. |
| **Conditions** | Cannot be run if referenced by a Foreign Key. | Cannot be run if referenced by a Foreign Key. |
`,
      published: true,
      roadmapId: sqlRoadmap.id,
    },
    {
      title: "Chapter 5: Integrity Constraints & Keys",
      slug: "chapter-5-integrity-constraints-keys",
      description: "Define Primary, Foreign, Unique, Check, and Default constraints.",
      content: `## Integrity Constraints
Integrity constraints enforce rules to maintain data quality and consistency, preventing users from entering invalid data.

---

## Core Constraints

### 1. \`NOT NULL\`
Ensures that a column cannot accept NULL values.

### 2. \`UNIQUE\`
Ensures all values in a column are distinct. Allows a single NULL value.

### 3. \`PRIMARY KEY\`
Uniquely identifies each row. It is equivalent to \`UNIQUE\` + \`NOT NULL\`. Only one primary key is allowed per table.

### 4. \`CHECK\`
Validates that values in a column satisfy a boolean condition:
\`\`\`sql
CREATE TABLE EMP (
  EMPID INT PRIMARY KEY,
  SAL MONEY CHECK (SAL >= 3000),
  GENDER CHAR(1) CHECK (GENDER IN ('M', 'F'))
);
\`\`\`

### 5. \`DEFAULT\`
Provides a default value if no value is specified during insert:
\`\`\`sql
CREATE TABLE EMP (
  EMPNO INT PRIMARY KEY,
  HIREDATE DATE DEFAULT GETDATE()
);
\`\`\`

### 6. \`FOREIGN KEY\`
Establishes a link between tables. Foreign key values must match a primary key value in the parent table, or be NULL.
\`\`\`sql
CREATE TABLE EMP55 (
  EMPNO INT PRIMARY KEY,
  DNO INT REFERENCES DEPT55(DNO) ON DELETE CASCADE
);
\`\`\`

---

## Referential Integrity Delete Rules
1.  **ON DELETE NO ACTION** (Default): Deletion of a parent row is blocked if referenced child rows exist.
2.  **ON DELETE CASCADE**: Deleting a parent row automatically deletes all referencing child rows.
3.  **ON DELETE SET NULL**: Deleting a parent row sets the referencing foreign key fields to NULL.
4.  **ON DELETE SET DEFAULT**: Deleting a parent row sets the referencing foreign key fields to their default value.
`,
      published: true,
      roadmapId: sqlRoadmap.id,
    },
    {
      title: "Chapter 6: Data Manipulation & Queries",
      slug: "chapter-6-data-manipulation-queries",
      description: "Master INSERT, SELECT, UPDATE, DELETE, and WHERE clause conditions.",
      content: `## 1. Inserting Records (\`INSERT\`)
*   **Single Row**:
    \`\`\`sql
    INSERT INTO emp VALUES (100, 'Sachin', 'Clerk', 4000, '2023-09-13', 'M');
    \`\`\`
*   **Multiple Rows**:
    \`\`\`sql
    INSERT INTO emp VALUES 
      (102, 'Kavitha', 'Analyst', 9000, '2020-10-05', 'F'),
      (103, 'Vinod', 'Clerk', 5000, '2019-04-15', 'M');
    \`\`\`

---

## 2. Querying Records (\`SELECT\`)
Retrieve columns and rows:
\`\`\`sql
SELECT ENAME, SAL FROM EMP;
\`\`\`

---

## 3. Filtering Records (\`WHERE\` Clause)
Filter records based on comparison conditions:
\`\`\`sql
SELECT * FROM EMP WHERE SAL >= 5000;
\`\`\`

### The \`LIKE\` Operator
Used for pattern matching with wildcards:
*   \`%\`: Represents zero or more characters.
*   \`_\`: Represents exactly one character.
\`\`\`sql
-- Name starts with 'S'
SELECT * FROM EMP WHERE ENAME LIKE 'S%';

-- Name has 'A' as second character
SELECT * FROM EMP WHERE ENAME LIKE '_A%';
\`\`\`

### \`BETWEEN\` and \`IN\` Operators
*   **Range Query**:
    \`\`\`sql
    SELECT * FROM EMP WHERE SAL BETWEEN 5000 AND 10000;
    \`\`\`
*   **List Check**:
    \`\`\`sql
    SELECT * FROM EMP WHERE JOB IN ('CLERK', 'MANAGER');
    \`\`\`

---

## 4. Formatting & Limits
*   **\`ORDER BY\`**: Sorts results ascending (\`ASC\`, default) or descending (\`DESC\`):
    \`\`\`sql
    SELECT * FROM EMP ORDER BY SAL DESC;
    \`\`\`
*   **\`DISTINCT\`**: Eliminates duplicate rows in the output:
    \`\`\`sql
    SELECT DISTINCT JOB FROM EMP;
    \`\`\`
*   **\`TOP\`**: Limits the number of rows returned:
    \`\`\`sql
    SELECT TOP 3 * FROM EMP ORDER BY SAL DESC;
    \`\`\`
`,
      published: true,
      roadmapId: sqlRoadmap.id,
    },
    {
      title: "Chapter 7: SQL Built-in Functions",
      slug: "chapter-7-sql-built-in-functions",
      description: "Explore string, numeric, date, and data type conversion functions.",
      content: `## 1. String Functions

*   **\`UPPER(str)\` / \`LOWER(str)\`**: Converts casing.
*   **\`LEN(str)\`**: Returns the character length of a string.
*   **\`LEFT(str, count)\` / \`RIGHT(str, count)\`**: Retrieves characters from either side.
*   **\`SUBSTRING(str, start, length)\`**: Extracts a substring from a starting index.
*   **\`REPLACE(str, search, replace)\`**: Replaces occurrences of a substring.
*   **\`TRANSLATE(str, search_chars, replace_chars)\`**: Translates characters one-by-one.

---

## 2. Date Functions

*   **\`GETDATE()\`**: Returns the current system date and time.
*   **\`DATEPART(interval, date)\`**: Extracts a numeric part of a date (e.g. \`YY\` for year, \`MM\` for month).
    \`\`\`sql
    SELECT DATEPART(YY, GETDATE()); // Returns 2026
    \`\`\`
*   **\`DATENAME(interval, date)\`**: Returns a string name representing the date interval (e.g. 'September', 'Friday').
*   **\`DATEADD(interval, value, date)\`**: Adds or subtracts time intervals to/from a date:
    \`\`\`sql
    SELECT DATEADD(DD, -10, GETDATE()); // Subtracts 10 days
    \`\`\`
*   **\`DATEDIFF(interval, start, end)\`**: Calculates the difference between two dates.
*   **\`EOMONTH(date)\`**: Returns the last day of the month for a given date.

---

## 3. Numeric Functions
*   **\`ROUND(value, decimals)\`**: Rounds a number.
*   **\`CEILING(value)\`**: Rounds up to the nearest integer.
*   **\`FLOOR(value)\`**: Rounds down to the nearest integer.

---

## 4. Conversion Functions
*   **\`CAST(value AS type)\`**: Standard SQL conversion helper.
*   **\`CONVERT(type, value, style_id)\`**: SQL Server conversion helper, ideal for custom date formatting:
    \`\`\`sql
    SELECT CONVERT(VARCHAR, GETDATE(), 103); // Returns date in dd/mm/yyyy style
    \`\`\`
`,
      published: true,
      roadmapId: sqlRoadmap.id,
    },
    {
      title: "Chapter 8: Data Aggregation & Grouping",
      slug: "chapter-8-data-aggregation-grouping",
      description: "Learn aggregate functions, GROUP BY, HAVING, and Rollup/Cube options.",
      content: `## Aggregate Functions
Aggregate functions summarize multiple row values into a single result.
*   **\`MAX()\`**: Maximum value.
*   **\`MIN()\`**: Minimum value.
*   **\`SUM()\`**: Total sum of values.
*   **\`AVG()\`**: Average value.
*   **\`COUNT()\`**: Number of non-null values.
*   **\`COUNT(*)\`**: Total row count, including NULL values.

---

## Grouping Records (\`GROUP BY\`)
Groups rows that share the same values in specified columns:
\`\`\`sql
SELECT DEPTNO, SUM(SAL) AS TOTAL_SALARY 
FROM EMP 
GROUP BY DEPTNO;
\`\`\`

---

## Filtering Groups (\`HAVING\`)
The \`WHERE\` clause filters rows *before* grouping. The \`HAVING\` clause filters grouped results *after* grouping is performed.
\`\`\`sql
SELECT DEPTNO, COUNT(*) AS EMP_COUNT 
FROM EMP 
GROUP BY DEPTNO 
HAVING COUNT(*) > 3;
\`\`\`

---

## Order of Clause Execution
1.  \`FROM\`
2.  \`WHERE\`
3.  \`GROUP BY\`
4.  \`HAVING\`
5.  \`SELECT\`
6.  \`ORDER BY\`

---

## ROLLUP and CUBE
*   **\`ROLLUP\`**: Calculates hierarchal subtotals and grand totals:
    \`\`\`sql
    SELECT DEPTNO, JOB, SUM(SAL) 
    FROM EMP 
    GROUP BY ROLLUP(DEPTNO, JOB);
    \`\`\`
*   **\`CUBE\`**: Calculates cross-tabulation subtotals for all permutations of columns, alongside the grand total.
`,
      published: true,
      roadmapId: sqlRoadmap.id,
    },
    {
      title: "Chapter 9: Table Joins",
      slug: "chapter-9-table-joins",
      description: "Learn Inner, Outer, Self, Cross, and Non-Equi Joins.",
      content: `## What is a Join?
A Join is used to query and combine related columns from two or more tables based on common fields.

---

## Types of Joins

### 1. \`INNER JOIN\` (or Equi-Join)
Returns only matching records that exist in both tables:
\`\`\`sql
SELECT E.ENAME, D.DNAME 
FROM EMP E 
INNER JOIN DEPT D ON E.DEPTNO = D.DEPTNO;
\`\`\`

### 2. \`LEFT OUTER JOIN\`
Returns all records from the left table, plus matching records from the right table. Non-matching right columns return NULL:
\`\`\`sql
SELECT E.ENAME, D.DNAME 
FROM EMP E 
LEFT JOIN DEPT D ON E.DEPTNO = D.DEPTNO;
\`\`\`

### 3. \`RIGHT OUTER JOIN\`
Returns all records from the right table, plus matching records from the left table.

### 4. \`FULL OUTER JOIN\`
Returns all records when there is a match in either the left or right table.

### 5. \`SELF JOIN\`
A table joined to itself, useful for querying hierarchical relationships (e.g. linking employees to their managers within the same table):
\`\`\`sql
SELECT E.ENAME AS Employee, M.ENAME AS Manager 
FROM EMP E 
INNER JOIN EMP M ON E.MGR = M.EMPNO;
\`\`\`

### 6. \`CROSS JOIN\`
Returns the Cartesian product of the two tables (combines every row from the first table with every row from the second table).
`,
      published: true,
      roadmapId: sqlRoadmap.id,
    },
    {
      title: "Chapter 10: Subqueries & CTEs",
      slug: "chapter-10-subqueries-ctes",
      description: "Write nested subqueries, co-related subqueries, and Common Table Expressions.",
      content: `## What is a Subquery?
A subquery (or nested query) is a query nested inside another SQL statement. The inner query is executed first and its results are used by the outer query.

---

## Types of Subqueries

### 1. Single-Row Subqueries
Returns a single value. Uses standard comparison operators (\`=\`, \`>\`, \`<\`):
\`\`\`sql
-- Find employees who earn more than BLAKE
SELECT * FROM EMP 
WHERE SAL > (SELECT SAL FROM EMP WHERE ENAME = 'BLAKE');
\`\`\`

### 2. Multi-Row Subqueries
Returns multiple values. Requires operators like \`IN\`, \`ANY\`, or \`ALL\`:
\`\`\`sql
-- Find employees who earn more than all managers
SELECT * FROM EMP 
WHERE SAL > ALL (SELECT SAL FROM EMP WHERE JOB = 'MANAGER');
\`\`\`

### 3. Co-Related Subqueries
An inner query that references columns from the outer query. The inner query executes once for every row processed by the outer query:
\`\`\`sql
-- Find employees earning more than the average salary of their department
SELECT * FROM EMP E 
WHERE SAL > (SELECT AVG(SAL) FROM EMP WHERE DEPTNO = E.DEPTNO);
\`\`\`

---

## Common Table Expressions (CTEs)
A CTE is a temporary, named result set that exists only within the execution scope of a single query. It is defined using the \`WITH\` keyword:
\`\`\`sql
WITH AvgSalaries AS (
  SELECT DEPTNO, AVG(SAL) AS AverageSalary 
  FROM EMP 
  GROUP BY DEPTNO
)
SELECT E.ENAME, E.SAL, A.AverageSalary
FROM EMP E
INNER JOIN AvgSalaries A ON E.DEPTNO = A.DEPTNO
WHERE E.SAL > A.AverageSalary;
\`\`\`
`,
      published: true,
      roadmapId: sqlRoadmap.id,
    },
    {
      title: "Chapter 11: Indexes & Database Optimization",
      slug: "chapter-11-indexes-database-optimization",
      description: "Understand database indexes, clustered vs non-clustered, and scan operations.",
      content: `## What is an Index?
An Index is a database object created on columns to improve query performance and speed up data retrieval.

---

## Index Types

### 1. Clustered Index
*   Determines the physical order in which data is stored in the table.
*   Only **one** clustered index is allowed per table.
*   Automatically created by the database engine on columns defined with a \`PRIMARY KEY\`.

### 2. Non-Clustered Index
*   Maintains a separate structure pointing to the physical data rows.
*   Multiple non-clustered indexes are allowed per table (up to 999 in SQL Server).
*   Can be created manually on frequently queried columns:
    \`\`\`sql
    CREATE INDEX idx_emp_sal ON EMP(SAL);
    \`\`\`
*   **Unique Index**: Enforces uniqueness on the indexed column, preventing duplicate values:
    \`\`\`sql
    CREATE UNIQUE INDEX idx_emp_name ON EMP(ENAME);
    \`\`\`

---

## Index Search Methods

### Table Scan
The database engine scans the entire table row-by-row to locate the matching records. Occurs when query filters do not target indexed columns.

### Index Scan / Seek
The database engine uses the index structure to navigate directly to the matching records. Index seeks are significantly faster than full table scans, especially for large datasets.
`,
      published: true,
      roadmapId: sqlRoadmap.id,
    },
    {
      title: "Chapter 12: Views, Stored Procedures & Triggers",
      slug: "chapter-12-views-stored-procedures-triggers",
      description: "Create views, write T-SQL stored procedures, and configure database triggers.",
      content: `## 1. Views
A View is a virtual table representing the result of a saved query. It does not store physical data.
*   **Simple View**: Query references a single table. Allows DML writes:
    \`\`\`sql
    CREATE VIEW V_Clerks AS 
    SELECT EMPNO, ENAME, JOB FROM EMP WHERE JOB = 'CLERK';
    \`\`\`
*   **Complex View**: Query references multiple tables or aggregates. Read-only.

---

## 2. Stored Procedures
A Stored Procedure is a pre-compiled block of SQL statements saved in the database.
Syntax:
\`\`\`sql
CREATE PROCEDURE RaiseSalary 
  @EmpNo INT, 
  @Amount MONEY
AS
BEGIN
  UPDATE EMP SET SAL = SAL + @Amount WHERE EMPNO = @EmpNo;
END;
\`\`\`
To execute a stored procedure:
\`\`\`sql
EXEC RaiseSalary @EmpNo = 101, @Amount = 500;
\`\`\`

---

## 3. Triggers
A Trigger is a special type of stored procedure that runs automatically in response to database events (like \`INSERT\`, \`UPDATE\`, or \`DELETE\`):
*   **After Trigger**: Executes after the DML action completes.
*   **Instead Of Trigger**: Executes in place of the DML action.

### Magic Tables (\`INSERTED\` and \`DELETED\`)
Triggers utilize two temporary system-managed tables:
*   **\`INSERTED\`**: Caches the newly added or updated rows.
*   **\`DELETED\`**: Caches rows that were deleted or replaced.

Example: Prevent salaries from being decreased:
\`\`\`sql
CREATE TRIGGER TR_PreventSalaryDecrease
ON EMP
AFTER UPDATE
AS
BEGIN
  DECLARE @OldSal MONEY, @NewSal MONEY;
  SELECT @OldSal = SAL FROM DELETED;
  SELECT @NewSal = SAL FROM INSERTED;
  
  IF (@NewSal < @OldSal)
  BEGIN
    ROLLBACK TRANSACTION;
    RAISERROR('Salary cannot be decreased.', 16, 1);
  END
END;
\`\`\`
`,
      published: true,
      roadmapId: sqlRoadmap.id,
    }
  ];

  for (const ch of sqlChapters) {
    await prisma.tutorial.create({
      data: ch,
    });
  }

  console.log("SQL tutorials seeded.");

  // ==========================================
  // HTML, CSS, JS & OOPS TRACK SEEDING
  // ==========================================
  const webRoadmap = await prisma.roadmap.create({
    data: {
      title: "HTML, CSS, JS & OOPs Fundamentals",
      slug: "html-css-js-oops-fundamentals",
      description: "Learn the absolute essentials of web building block layouts (HTML5/CSS3) and client-side scripting (JavaScript), structured using Object-Oriented Programming (OOP) paradigms.",
      published: true,
      nodes: [
        { id: "web-node-1", label: "HTML5 Document Structure", position: { x: 150, y: 50 } },
        { id: "web-node-2", label: "Formatting, Lists & Hyperlinks", position: { x: 150, y: 150 } },
        { id: "web-node-3", label: "Tables, Media & SVG Vector Shapes", position: { x: 150, y: 250 } },
        { id: "web-node-4", label: "Interactive HTML Forms & Validation", position: { x: 150, y: 350 } },
        { id: "web-node-5", label: "CSS Layouts, Selectors & Box Model", position: { x: 150, y: 450 } },
        { id: "web-node-6", label: "JS Basics: Variables & Operators", position: { x: 150, y: 550 } },
        { id: "web-node-7", label: "JS Control Flow & Iteration Loops", position: { x: 150, y: 650 } },
        { id: "web-node-8", label: "Functions, Scopes & Callback timers", position: { x: 150, y: 750 } },
        { id: "web-node-9", label: "Arrays, Strings & Object API Methods", position: { x: 150, y: 850 } },
        { id: "web-node-10", label: "DOM Selection & Event Listeners", position: { x: 150, y: 950 } },
        { id: "web-node-11", label: "BOM (Browser Object Model) & Locations", position: { x: 150, y: 1050 } },
        { id: "web-node-12", label: "Asynchronous JS, Promises & Async/Await", position: { x: 150, y: 1150 } },
        { id: "web-node-13", label: "OOPs: Classes, Inheritance & Encapsulation", position: { x: 150, y: 1250 } },
      ],
      edges: [
        { id: "web-edge-1-2", source: "web-node-1", target: "web-node-2" },
        { id: "web-edge-2-3", source: "web-node-2", target: "web-node-3" },
        { id: "web-edge-3-4", source: "web-node-3", target: "web-node-4" },
        { id: "web-edge-4-5", source: "web-node-4", target: "web-node-5" },
        { id: "web-edge-5-6", source: "web-node-5", target: "web-node-6" },
        { id: "web-edge-6-7", source: "web-node-6", target: "web-node-7" },
        { id: "web-edge-7-8", source: "web-node-7", target: "web-node-8" },
        { id: "web-edge-8-9", source: "web-node-8", target: "web-node-9" },
        { id: "web-edge-9-10", source: "web-node-9", target: "web-node-10" },
        { id: "web-edge-10-11", source: "web-node-10", target: "web-node-11" },
        { id: "web-edge-11-12", source: "web-node-11", target: "web-node-12" },
        { id: "web-edge-12-13", source: "web-node-12", target: "web-node-13" },
      ],
    },
  });

  const webChapters = [
    {
      title: "Chapter 1: HTML Document Structure & Metadata",
      slug: "chapter-1-html-document-structure-metadata",
      description: "Learn HTML tag syntax, viewport configurations, SEO meta setups, and semantic layouts.",
      content: `## What is HTML?
HTML stands for **HyperText Markup Language**. It specifies the structure and layout of a web page using tag hierarchies.

### Structure of an HTML5 Document
\`\`\`html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document Title</title>
</head>
<body>
  <h1>Hello, World!</h1>
</body>
</html>
\`\`\`

---

## The Head Section Metadata
The \`<head>\` houses directives meant for browser memory, styling engines, and search engines.
1.  **\`<meta name="viewport" content="width=device-width, initial-scale=1.0">\`**: Configures responsiveness so layouts adjust dynamically to mobile, tablet, and desktop viewports.
2.  **\`<meta name="description" content="page summary">\`**: Used by search engine web spiders to index summary snippets.
3.  **\`<meta charset="UTF-8">\`**: Defines the encoding (8-Bit Unicode Translation Format) covering Western languages.

---

## Semantic vs Non-Semantic Elements
*   **Semantic Elements**: Explicitly describe their layout role. (e.g. \`<header>\`, \`<footer>\`, \`<main>\`, \`<article>\`, \`<section>\`).
*   **Non-Semantic Elements**: Used strictly as style wrapper bins. (e.g. \`<div>\`, \`<span>\`).
`,
      published: true,
      roadmapId: webRoadmap.id,
    },
    {
      title: "Chapter 2: HTML Text Formatting, Lists & Media",
      slug: "chapter-2-html-text-formatting-lists-media",
      description: "Format text layouts, configure lists, use SVGs, and embed audio/video.",
      content: `## 1. Text Formatting Tags
*   \`<b>\`: Bold text formatting.
*   \`<i>\`: Italic representation.
*   \`<u>\`: Underlines text.
*   \`<pre>\`: Pre-formatted code blocks (retains source spacing and line breaks).
*   \`<sub>\` / \`<sup>\`: Subscript / Superscript formatting (e.g. H<sub>2</sub>O, 3<sup>rd</sup>).

---

## 2. HTML Lists

*   **Ordered List (\`<ol>\`)**: Renders numerical or alphabetical sequences. Supports \`type\` ("1", "a", "A", "i", "I") and \`start\` attributes.
*   **Unordered List (\`<ul>\`)**: Renders bullet items. Supports \`type\` ("disc", "circle", "square").
*   **Description List (\`<dl>\`)**: Maps terms (\`<dt>\`) to their corresponding descriptions (\`<dd>\`).

---

## 3. Embedding Audio & Video
HTML5 native media elements:
\`\`\`html
<video width="400" height="250" controls autoplay loop muted>
  <source src="movie.mp4" type="video/mp4">
  Your browser does not support HTML5 video.
</video>
\`\`\`

---

## 4. Scalable Vector Graphics (SVG)
SVG lets you draw vector shapes inside HTML pages:
\`\`\`html
<svg width="200" height="200">
  <circle cx="100" cy="100" r="50" fill="yellow" stroke="red" stroke-width="4" />
  <rect x="10" y="10" width="180" height="50" fill="blue" />
</svg>
\`\`\`
`,
      published: true,
      roadmapId: webRoadmap.id,
    },
    {
      title: "Chapter 3: Interactive Hyperlinks & Table Design",
      slug: "chapter-3-interactive-hyperlinks-table-design",
      description: "Build page navigation anchor routes and structure data tables.",
      content: `## 1. Anchor Hyperlinks (\`<a>\`)
Binds link paths to text or image elements.
*   **Attributes**:
    *   \`href\`: Universal Resource Identifier location pathway.
    *   \`target="_blank"\`: Opens the linked route in a new tab.
    *   \`target="_self"\`: Default action; opens the link in the current window context.

### Bookmark Hyperlinks
Binds page navigations to internal section selectors on the same page:
\`\`\`html
<a href="#target-id">Jump to Details</a>
<!-- Target tag -->
<h2 id="target-id">Detailed Specification</h2>
\`\`\`

---

## 2. Structured Data Tables
Tables group structured data rows.
*   \`<table>\`: Wrapper table boundaries.
*   \`<thead>\`: Groups table header categories.
*   \`<tbody>\`: Houses data rows.
*   \`<tfoot>\`: Groups footer summaries.
*   \`<tr>\`: Defines a table row.
*   \`<th>\` / \`<td>\`: Defines table headers / standard cells.

### Cell Spanning Attributes
*   **\`colspan\`**: Specifies the number of columns a cell should span.
*   **\`rowspan\`**: Specifies the number of rows a cell should span.
\`\`\`html
<table border="1">
  <tr>
    <td colspan="2" align="center">Full Span Title</td>
  </tr>
  <tr>
    <td>Left Column</td>
    <td>Right Column</td>
  </tr>
</table>
\`\`\`
`,
      published: true,
      roadmapId: webRoadmap.id,
    },
    {
      title: "Chapter 4: HTML Forms & Validations",
      slug: "chapter-4-html-forms-validations",
      description: "Build robust forms using checkbox, radio, select, and validation states.",
      content: `## 1. Form Element Container (\`<form>\`)
Accepts user data inputs and submits them to a server route.
*   **\`action\`**: The target server URL.
*   **\`method\`**: HTTP method for submitting data.
    *   **GET**: Includes request parameters in the URL query string. Limited length, cached, insecure.
    *   **POST**: Sends parameters inside the request body packet. Unlimited length, not cached, secure.

---

## 2. Basic Form Controls
*   **Text & Password Inputs**:
    \`\`\`html
    <input type="text" name="username" placeholder="First Name" required>
    <input type="password" name="password" required>
    \`\`\`
*   **Selection Checkbox & Radio Buttons**:
    \`\`\`html
    <!-- Checkbox allows multiple selections -->
    <input type="checkbox" name="hobbies" value="reading"> Reading
    
    <!-- Radio buttons allow a single selection from a group -->
    <input type="radio" name="gender" value="male"> Male
    <input type="radio" name="gender" value="female"> Female
    \`\`\`
*   **Dropdown Selector**:
    \`\`\`html
    <select name="country">
      <option value="in">India</option>
      <option value="us">United States</option>
    </select>
    \`\`\`

---

## 3. HTML5 Form Validations
*   \`required\`: Enforces input.
*   \`minlength\` / \`maxlength\`: Enforces character length.
*   \`pattern\`: Validates input values using a Regular Expression regex pattern.
`,
      published: true,
      roadmapId: webRoadmap.id,
    },
    {
      title: "Chapter 5: CSS Styling, Box Model & Layouts",
      slug: "chapter-5-css-styling-box-model-layouts",
      description: "Understand stylesheet integrations, selectors, typography, positioning, Flexbox, and Grid.",
      content: `## What is CSS?
CSS stands for **Cascading Style Sheets**. It defines the presentation layer (layout, colors, fonts, and responsiveness) of HTML elements.

---

## 1. How to Apply CSS

### I. Inline CSS
Applied directly to HTML tags using the \`style\` attribute:
\`\`\`html
<h1 style="color: blue; font-size: 24px;">Inline Styled Heading</h1>
\`\`\`

### II. Internal CSS
Defined inside the \`<style>\` block in the HTML \`<head>\` section:
\`\`\`html
<style>
  h1 {
    color: green;
  }
</style>
\`\`\`

### III. External CSS
Defined in a separate \`.css\` file and linked in the HTML \`<head>\`:
\`\`\`html
<link rel="stylesheet" href="styles.css">
\`\`\`

---

## 2. CSS Selectors
Selectors target specific HTML elements for styling.
*   **Universal Selector (\`*\`)**: Targets all elements on the page.
*   **Element Selector (\`element\`)**: Targets elements by tag name (e.g. \`p { color: red; }\`).
*   **Class Selector (\`.class\`)**: Targets elements with a specific class attribute (e.g. \`.btn { border-radius: 4px; }\`).
*   **ID Selector (\`#id\`)**: Targets a single element with a specific ID attribute (e.g. \`#main-header { padding: 20px; }\`).
*   **Grouping Selector**: Combines multiple selectors to share styles (e.g. \`h1, h2, h3 { font-family: sans-serif; }\`).
*   **Descendant Selector (\`parent child\`)**: Targets nested elements (e.g. \`div p { margin-bottom: 10px; }\`).

---

## 3. Pseudo-Classes & Pseudo-Elements
*   **Pseudo-Classes**: Style elements based on states:
    *   \`a:hover\`: Mouse hover.
    *   \`input:focus\`: Input element is selected/focused.
    *   \`li:nth-child(even)\`: Selects even elements in a list.
*   **Pseudo-Elements**: Style specific parts of an element:
    *   \`p::first-letter\`: Styles the first character of text.
    *   \`div::before\` / \`div::after\`: Generates decorative content before or after an element.

---

## 4. The CSS Box Model
Every HTML element is represented as a rectangular box. The Box Model consists of:
1.  **Content**: The actual text or images.
2.  **Padding**: Space between the content and the border.
3.  **Border**: Line surrounding the padding.
4.  **Margin**: Transparent space outside the border separating adjacent elements.

### Box Sizing (\`box-sizing\`)
*   \`content-box\` (Default): Width and height apply only to the content. Adding padding or borders makes the element larger than its declared width.
*   \`border-box\` (Recommended): Width and height apply to content + padding + border. Keeps layout dimensions predictable.
\`\`\`css
* {
  box-sizing: border-box;
}
\`\`\`

---

## 5. CSS Typography
*   \`font-family\`: Configures typeface fonts (e.g. \`sans-serif\`, \`serif\`, \`monospace\`).
*   \`font-size\`: Text sizing in \`px\`, \`em\`, or \`rem\` units.
*   \`font-weight\`: Configures text boldness (e.g. \`bold\`, \`400\`, \`700\`).
*   \`line-height\`: Line heights (spacing between lines).
*   \`text-align\`: Casing alignment (\`left\`, \`right\`, \`center\`, \`justify\`).

---

## 6. CSS Positioning (\`position\`)
Determines the layout positioning algorithm of elements:
*   **\`static\`** (Default): Positioned according to the normal document flow.
*   **\`relative\`**: Positioned relative to its normal position. Offsets (\`top\`, \`left\`) do not affect adjacent elements.
*   **\`absolute\`**: Positioned relative to its closest positioned parent container. Removed from normal document flow.
*   **\`fixed\`**: Positioned relative to the browser viewport window. Remains in place during scrolling.
*   **\`sticky\`**: Alternates between relative and fixed positioning based on the scroll position.

---

## 7. Flexbox Layout System
A one-dimensional layout framework for distributing space across items in a row or column.
*   **Flex Container Properties**:
    *   \`display: flex\`: Enables flex layout.
    *   \`flex-direction\`: Aligns main axis alignment (\`row\`, \`column\`).
    *   \`justify-content\`: Aligns items horizontally on main axis (\`flex-start\`, \`flex-end\`, \`center\`, \`space-between\`, \`space-around\`).
    *   \`align-items\`: Aligns items vertically on cross axis (\`flex-start\`, \`flex-end\`, \`center\`, \`stretch\`).
*   **Flex Item Properties**:
    *   \`flex-grow\`: Determines growth ratio.
    *   \`flex-shrink\`: Shrink index.

---

## 8. CSS Grid Layout System
A two-dimensional grid-based layout framework (columns and rows).
\`\`\`css
.grid-container {
  display: grid;
  grid-template-columns: repeat(3, 1fr); /* 3 equal columns */
  grid-gap: 20px; /* Space between grid items */
}
\`\`\`

---

## 9. Responsive Web Design & Media Queries
Applies CSS styles conditionally based on the user's screen size or device width:
\`\`\`css
/* Styles apply only to screens 768px wide or smaller (Mobile/Tablets) */
@media (max-width: 768px) {
  .grid-container {
    grid-template-columns: 1fr; /* Switch to a single column */
  }
}
\`\`\`
`,
      published: true,
      roadmapId: webRoadmap.id,
    },
    {
      title: "Chapter 6: JavaScript Programming Essentials",
      slug: "chapter-6-javascript-programming-essentials",
      description: "Understand JavaScript runtimes, variables, datatypes, and operators.",
      content: `## JS Execution Environments

1.  **Inline JS**: Attached directly to HTML attributes (e.g. \`onclick="alert()"\`).
2.  **Internal JS**: Embedded inside HTML script elements (\`<script> ... </script>\`).
3.  **External JS**: Imported using script source paths (\`<script src="app.js"></script>\`).
4.  **Server-Side JS**: Executed outside the browser runtime using Node.js.

---

## Variables: \`let\` vs \`const\` vs \`var\`
*   **\`var\`**: Function-scoped. Can be redeclared and updated.
*   **\`let\`**: Block-scoped. Cannot be redeclared, but can be updated.
*   **\`const\`**: Block-scoped. Cannot be redeclared or updated (immutable reference).

---

## Basic JavaScript Datatypes
*   **Primitives**: \`Number\`, \`String\` (immutable sequences), \`Boolean\`, \`Null\`, \`Undefined\`, \`Symbol\`, and \`BigInt\`.
*   **Non-Primitives**: \`Object\` (key-value collections), \`Array\`, \`Function\`.

---

## Core JavaScript Operators
1.  **Arithmetic**: \`+\`, \`-\`, \`*\`, \`/\`, \`%\` (modulus).
2.  **Assignment**: \`=\`, \`+=\`, \`-=\`.
3.  **Comparison**: \`==\` (loose value equal), \`===\` (strict type and value equal), \`!=\`, \`!==\`.
4.  **Logical**: \`&&\` (AND), \`||\` (OR), \`!\` (NOT).
`,
      published: true,
      roadmapId: webRoadmap.id,
    },
    {
      title: "Chapter 7: Control Flows & Iteration Loops",
      slug: "chapter-7-control-flows-iteration-loops",
      description: "Manage branch execution flows and run loops in JS.",
      content: `## 1. Branching Control Flows

### \`if-else\` Construct
Executes code blocks conditionally:
\`\`\`javascript
if (score >= 90) {
  console.log("Grade A");
} else if (score >= 50) {
  console.log("Pass");
} else {
  console.log("Fail");
}
\`\`\`

### \`switch-case\` Construct
Evaluates an expression and executes the matching case:
\`\`\`javascript
switch (deviceType) {
  case "mobile":
    loadMobileView();
    break;
  case "desktop":
    loadDesktopView();
    break;
  default:
    loadDefaultView();
}
\`\`\`

---

## 2. Iteration Loops
Repeats code execution blocks.

### \`for\` and \`while\` Loops
*   **\`for\`**: Ideal when the number of iterations is known:
    \`\`\`javascript
    for (let i = 0; i < 5; i++) {
      console.log(i);
    }
    \`\`\`
*   **\`while\`**: Evaluates the condition before each iteration:
    \`\`\`javascript
    let i = 0;
    while (i < 5) {
      console.log(i);
      i++;
    }
    \`\`\`

### Advanced Loop Forms
*   **\`for-in\`**: Iterates over key properties of objects:
    \`\`\`javascript
    for (let key in user) { console.log(key, user[key]); }
    \`\`\`
*   **\`for-of\`**: Iterates over iterable values (e.g. arrays):
    \`\`\`javascript
    for (let value of scores) { console.log(value); }
    \`\`\`
*   **\`forEach\`**: Runs a callback function for each array element:
    \`\`\`javascript
    scores.forEach((val) => console.log(val));
    \`\`\`
`,
      published: true,
      roadmapId: webRoadmap.id,
    },
    {
      title: "Chapter 8: Functions, Scopes & Timers",
      slug: "chapter-8-functions-scopes-timers",
      description: "Define arrow functions, understand scopes, use callbacks, and set timers.",
      content: `## 1. Defining Functions

### Traditional Functions
\`\`\`javascript
function calculateSum(a, b) {
  return a + b;
}
\`\`\`

### Arrow Functions
Compact syntax. Implicit return if body contains a single statement:
\`\`\`javascript
const add = (a, b) => a + b;
\`\`\`

---

## 2. Variable Scopes
*   **Global Scope**: Declared outside any block or function; accessible globally.
*   **Local / Function Scope**: Declared inside a function; accessible only within that function.
*   **Block Scope**: Declared inside blocks (\`{}\`, e.g. if/for loops) using \`let\` or \`const\`; accessible only within that block.

---

## 3. Callback Functions
A callback is a function passed as an argument to another function, to be executed after an operation completes:
\`\`\`javascript
const fetchData = (callback) => {
  // operation completes...
  callback("Data retrieved!");
};

fetchData((res) => console.log(res));
\`\`\`

---

## 4. JS Scheduler Timers
*   **\`setTimeout(callback, delay)\`**: Runs the callback function once after a delay (in ms).
*   **\`setInterval(callback, delay)\`**: Repeats callback execution at interval delays. Can be stopped using \`clearInterval(timerId)\`.
    \`\`\`javascript
    const intervalId = setInterval(() => console.log("Tick"), 1000);
    clearInterval(intervalId); // Stops execution
    \`\`\`
`,
      published: true,
      roadmapId: webRoadmap.id,
    },
    {
      title: "Chapter 9: Arrays & Strings API Methods",
      slug: "chapter-9-arrays-strings-api-methods",
      description: "Process arrays with map/filter/reduce and apply string modifications.",
      content: `## 1. Array Operations
An Array stores lists of elements.

*   \`push(el)\` / \`pop()\`: Appends/removes elements at the end.
*   \`unshift(el)\` / \`shift()\`: Prepends/removes elements at the start.
*   \`slice(start, end)\`: Extracts a portion without modifying the original array.
*   \`splice(start, count, newEl)\`: Modifies the original array by removing or replacing elements.
*   \`includes(el)\`: Checks if the array contains a value.

---

## 2. Higher-Order Array Methods
These process arrays using callback functions.

### \`map()\`
Applies transformation logic and returns a new array of the same length:
\`\`\`javascript
const doubled = [1, 2, 3].map(x => x * 2); // [2, 4, 6]
\`\`\`

### \`filter()\`
Returns a new filtered array containing elements that pass a test condition:
\`\`\`javascript
const evens = [1, 2, 3, 4].filter(x => x % 2 === 0); // [2, 4]
\`\`\`

### \`reduce()\`
Reduces an array to a single value using an accumulator:
\`\`\`javascript
const sum = [1, 2, 3].reduce((acc, current) => acc + current, 0); // 6
\`\`\`

---

## 3. String Methods
*   \`length\`: Property returning string size.
*   \`toUpperCase()\` / \`toLowerCase()\`: Casing modifiers.
*   \`trim()\`: Removes whitespace from both ends.
*   \`split(separator)\`: Splits a string into an array.
`,
      published: true,
      roadmapId: webRoadmap.id,
    },
    {
      title: "Chapter 10: DOM Element Selections & Operations",
      slug: "chapter-10-dom-element-selections-operations",
      description: "Select nodes, create elements dynamically, and edit DOM trees.",
      content: `## Document Object Model (DOM)
The DOM represents HTML elements as a tree of objects, allowing JavaScript to modify structure and styles.

---

## 1. Accessing HTML Elements
*   \`document.getElementById("id")\`: Selects a single element by its ID.
*   \`document.getElementsByClassName("class")\`: Selects multiple elements by class name.
*   \`document.querySelector("selector")\`: Returns the first element matching a CSS selector:
    \`\`\`javascript
    const firstBtn = document.querySelector(".btn-active");
    \`\`\`
*   \`document.querySelectorAll("selector")\`: Returns a static NodeList of all matching elements.

---

## 2. Modifying Element Properties
*   \`textContent\`: Gets/sets plain text.
*   \`innerHTML\`: Gets/sets HTML tags.
*   \`style\`: Modifies inline styles:
    \`\`\`javascript
    box.style.backgroundColor = "blue";
    \`\`\`
*   \`setAttribute(attr, value)\`: Sets DOM properties.

---

## 3. Creating & Inserting Elements
\`\`\`javascript
// Create a new div element
const newDiv = document.createElement("div");
newDiv.textContent = "New Element Created!";

// Insertions
const container = document.getElementById("wrapper");
container.append(newDiv); // Appends inside container at the end
container.prepend(newDiv); // Prepends inside container at the start
container.before(newDiv); // Inserts before container (sibling)
container.after(newDiv); // Inserts after container (sibling)

// Removal
newDiv.remove(); // Removes the element from the DOM
\`\`\`
`,
      published: true,
      roadmapId: webRoadmap.id,
    },
    {
      title: "Chapter 11: Event Listeners & Browser Object Model",
      slug: "chapter-11-event-listeners-browser-object-model",
      description: "Manage mouse/keyboard event handlers and use BOM APIs.",
      content: `## 1. Event Listeners
Events are user interactions or system actions (e.g. click, keydown, submit). Attach listeners using \`addEventListener()\`:
\`\`\`javascript
const btn = document.getElementById("submit-btn");

btn.addEventListener("click", (event) => {
  console.log("Event Type:", event.type); // click
  console.log("Target Element:", event.target);
});
\`\`\`

---

## 2. Browser Object Model (BOM)
The BOM allows JavaScript to interact with the browser window environment.

### The \`window\` Object
The global namespace object for browser scripting:
*   \`window.open(url)\`: Opens a new browser tab/window.
*   \`window.close()\`: Closes the current tab.
*   \`window.scrollTo(x, y)\`: Scrolls window view coordinates.

### The \`location\` Object
Manages browser URLs and routing:
*   \`location.href\`: Get or set the current page URL path.
*   \`location.reload()\`: Force page reload.
*   \`location.assign(url)\`: Load a new URL.

---

### Browser Dialog Modals
*   \`alert("message")\`: Shows an alert popup.
*   \`prompt("question")\`: Displays a textbox popup for user input.
*   \`confirm("message")\`: Confirmation modal returning true (OK) or false (Cancel).
`,
      published: true,
      roadmapId: webRoadmap.id,
    },
    {
      title: "Chapter 12: Asynchronous JS, Promises & Async/Await",
      slug: "chapter-12-asynchronous-js-promises-async-await",
      description: "Understand synchronous vs asynchronous execution and manage data fetches using async/await.",
      content: `## Sync vs Async Execution
*   **Synchronous**: Code executes line-by-line. Blocks execution of subsequent lines until the current operation finishes.
*   **Asynchronous**: Operations execute in the background. Does not block execution (non-blocking), allowing other tasks to run concurrently.

---

## JavaScript Promises
A Promise represents the eventual completion (fulfillment) or failure (rejection) of an asynchronous operation.

### States of a Promise
1.  **Pending**: Initial state; operation hasn't finished yet.
2.  **Fulfilled**: Operation succeeded; returns a resolved value.
3.  **Rejected**: Operation failed; returns a rejection reason (error).

\`\`\`javascript
const fetchProfile = new Promise((resolve, reject) => {
  const success = true;
  if (success) resolve("Profile Loaded");
  else reject("Network Timeout");
});

// Handling Promise resolution
fetchProfile
  .then(res => console.log(res))
  .catch(err => console.error(err));
\`\`\`

---

## Async / Await Syntax
Simplifies Promise handling, making asynchronous code look synchronous.
*   \`async\`: Placed before a function declaration. Ensures the function returns a Promise.
*   \`await\`: Placed before a Promise call. Pauses function execution until the Promise resolves.

\`\`\`javascript
async function loadUserData() {
  try {
    const response = await fetch("https://dummyjson.com/users/1");
    const data = await response.json();
    console.log("Loaded user:", data.firstName);
  } catch (error) {
    console.error("Loading failed:", error);
  }
}
\`\`\`
`,
      published: true,
      roadmapId: webRoadmap.id,
    },
    {
      title: "Chapter 13: Object-Oriented JS (OOPs)",
      slug: "chapter-13-object-oriented-js-oops",
      description: "Define classes, instantiate objects, implement encapsulation, polymorphism, and inheritance.",
      content: `## OOP Principles
Object-Oriented Programming (OOP) is a programming paradigm that organizes code into reusable **Classes** and **Objects**.

---

## 1. Class & Object Instantiation
A Class is a blueprint for generating Objects. Initialize variables using the \`constructor()\` method:
\`\`\`javascript
class Student {
  constructor(name, rollNo) {
    this.name = name;
    this.rollNo = rollNo;
  }

  study() {
    return \`\${this.name} is studying.\`;
  }
}

// Instantiate an Object
const student1 = new Student("Alice", 101);
console.log(student1.study()); // Alice is studying.
\`\`\`

---

## 2. The Four Pillars of OOP

### I. Inheritance
Enables a class to acquire properties and methods from a parent class using the \`extends\` keyword:
\`\`\`javascript
class GraduateStudent extends Student {
  constructor(name, rollNo, thesisTopic) {
    super(name, rollNo); // Call parent class constructor
    this.thesisTopic = thesisTopic;
  }
}
\`\`\`

### II. Encapsulation
Hides internal object state and restricts direct access. In JavaScript, declare private properties using a hash prefix (\`#\`):
\`\`\`javascript
class BankAccount {
  #balance = 1000; // Private property

  getBalance() { return this.#balance; } // Getter
}
\`\`\`

### III. Polymorphism
Enables a method to exhibit different behaviors based on the class context:
\`\`\`javascript
class Animal {
  makeSound() { return "Some sound"; }
}

class Dog extends Animal {
  makeSound() { return "Bark"; } // Method Overriding
}
\`\`\`

### IV. Abstraction
Hides complex implementation details, exposing only necessary interfaces.
`,
      published: true,
      roadmapId: webRoadmap.id,
    }
  ];

  for (const ch of webChapters) {
    await prisma.tutorial.create({
      data: ch,
    });
  }

  console.log("Web tutorials seeded.");

  // ==========================================
  // QUIZZES AND QUESTIONS SEEDING
  // ==========================================

  // 1. Angular Quiz
  const angularQuiz = await prisma.quiz.create({
    data: {
      title: "Angular Developer Track Assessment",
      description: "Test your understanding of Angular components, routing, RxJS observables, and lifecycle hooks.",
    },
  });

  await prisma.question.createMany({
    data: [
      {
        text: "Which of the following is true regarding React JS vs Angular?",
        options: [
          "React JS is a full developer framework, whereas Angular is a UI library.",
          "Angular is a full developer framework, whereas React JS is a UI library.",
          "Both are libraries that require external routing libraries.",
          "Angular only works with JavaScript, whereas React only works with TypeScript.",
        ],
        correctAnswerIndex: 1,
        quizId: angularQuiz.id,
      },
      {
        text: "Which decorator is used to send data from a parent component down to a nested child component?",
        options: ["@Output()", "@ViewChild()", "@Input()", "@Injectable()"],
        correctAnswerIndex: 2,
        quizId: angularQuiz.id,
      },
      {
        text: "Which RxJS subject requires an initial value and emits the cached current value immediately to new subscribers?",
        options: ["Subject", "BehaviorSubject", "ReplaySubject", "AsyncSubject"],
        correctAnswerIndex: 1,
        quizId: angularQuiz.id,
      },
      {
        text: "Which lifecycle hook is ideal for cleanup, such as unsubscribing from active observables?",
        options: ["ngOnInit", "ngAfterViewInit", "ngOnChanges", "ngOnDestroy"],
        correctAnswerIndex: 3,
        quizId: angularQuiz.id,
      }
    ],
  });

  // 2. SQL Quiz
  const sqlQuiz = await prisma.quiz.create({
    data: {
      title: "SQL & RDBMS Concepts Assessment",
      description: "Test your skills on database query formatting, constraints, table joins, and transactional triggers.",
    },
  });

  await prisma.question.createMany({
    data: [
      {
        text: "Which SQL sublanguage includes commands like COMMIT, ROLLBACK, and SAVE TRANSACTION?",
        options: ["DDL", "DML", "DQL", "TCL"],
        correctAnswerIndex: 3,
        quizId: sqlQuiz.id,
      },
      {
        text: "Which referential integrity delete rule automatically deletes child rows when the parent row is deleted?",
        options: ["ON DELETE NO ACTION", "ON DELETE CASCADE", "ON DELETE SET NULL", "ON DELETE SET DEFAULT"],
        correctAnswerIndex: 1,
        quizId: sqlQuiz.id,
      },
      {
        text: "What is the key difference between RANK() and DENSE_RANK() analytical functions?",
        options: [
          "RANK() sorts ascending, whereas DENSE_RANK() sorts descending.",
          "RANK() does not generate rank gaps, whereas DENSE_RANK() does.",
          "RANK() generates rank gaps for duplicates, whereas DENSE_RANK() does not.",
          "RANK() works on text, whereas DENSE_RANK() only works on numbers.",
        ],
        correctAnswerIndex: 2,
        quizId: sqlQuiz.id,
      },
      {
        text: "Which trigger system-managed magic table stores the pre-update state of rows replaced by an UPDATE command?",
        options: ["INSERTED", "DELETED", "UPDATED", "BACKUP"],
        correctAnswerIndex: 1,
        quizId: sqlQuiz.id,
      }
    ],
  });

  // 3. Web Fundamentals Quiz
  const webQuiz = await prisma.quiz.create({
    data: {
      title: "HTML, CSS, JS & OOPs Assessment",
      description: "Test your grasp on document viewports, GET/POST methods, higher-order functions, Promises, and OOP pillars.",
    },
  });

  await prisma.question.createMany({
    data: [
      {
        text: "Which HTML5 viewport setting is critical to configure responsive layout sizes for mobile and desktop screens?",
        options: [
          "<meta charset='utf-8'>",
          "<meta name='viewport' content='width=device-width, initial-scale=1.0'>",
          "<meta http-equiv='refresh' content='5'>",
          "<meta name='description' content='...'>"
        ],
        correctAnswerIndex: 1,
        quizId: webQuiz.id,
      },
      {
        text: "Which HTTP request method sends input values inside the request body packet and is secure for sensitive parameters?",
        options: ["GET", "POST", "HEAD", "OPTIONS"],
        correctAnswerIndex: 1,
        quizId: webQuiz.id,
      },
      {
        text: "Which JS Higher-Order array method reduces an array to a single cumulative value using an accumulator?",
        options: ["map()", "filter()", "reduce()", "some()"],
        correctAnswerIndex: 2,
        quizId: webQuiz.id,
      },
      {
        text: "In JavaScript OOP, how is class inheritance represented to acquire properties from a parent class?",
        options: ["class Child implements Parent", "class Child extends Parent", "class Child inherits Parent", "class Child prototype Parent"],
        correctAnswerIndex: 1,
        quizId: webQuiz.id,
      }
    ],
  });

  console.log("Quizzes seeded.");
  console.log("Database seeding completed successfully!");
}

main()
  .catch((error) => {
    console.error("Error during database seeding:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    pool.end();
  });
