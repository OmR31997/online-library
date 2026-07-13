npm install 
1: @prisma/client prisma 
2: pg 
3: zod 
4: react-hook-form 
5: @hookform/resolvers 
6: axios 
7: zustand 
8: @tanstack/react-query 
9: jsonwebtoken 
10: bcryptjs 
11: cookies-next 
12: swagger-jsdoc 
13: swagger-ui-react 
14: lucide-react 
15: sonner 
16: date-fns 
17: @tanstack/react-table

# Installed Packages & Technical Rationale

This document details the packages installed in the **Online Library** application, categorized by their function, along with the rationale/reasons for their inclusion.

---

## 1. Core Framework & Styling

### [Next.js](https://nextjs.org/) (`next`)
* **Category:** Core Framework
* **Type:** Dependency
* **Reason:** Provides the react-based web framework using the App Router. Handles server-side rendering (SSR), static site generation (SSG), file-system routing, API routes, and optimization out-of-the-box.

### [React](https://react.dev/) & [React DOM](https://react.dev/) (`react`, `react-dom`)
* **Category:** Core UI Library
* **Type:** Dependency
* **Reason:** The fundamental libraries for building user interfaces with components, hooks, and virtual DOM management.

### [Tailwind CSS](https://tailwindcss.com/) & [PostCSS Integration](https://github.com/tailwindlabs/tailwindcss-postcss) (`tailwindcss`, `@tailwindcss/postcss`)
* **Category:** Styling
* **Type:** DevDependency
* **Reason:** A utility-first CSS framework for rapid UI styling directly in markup. The PostCSS plugin integrates Tailwind CSS into the build/compilation pipeline.

---

## 2. Database & ORM

### [Prisma Client](https://www.prisma.io/docs/concepts/components/prisma-client) (`@prisma/client`)
* **Category:** Object-Relational Mapping (ORM)
* **Type:** Dependency
* **Reason:** Provides a query builder that is automatically generated and customized based on the Prisma schema. It offers full type safety for database operations and query results.

### [Prisma CLI](https://www.prisma.io/docs/concepts/components/prisma-cli) (`prisma`)
* **Category:** Database Tools
* **Type:** Dependency (usually DevDependency, but here installed as a dependency)
* **Reason:** Used to initialize Prisma, run database migrations, inspect the database schema, and generate the Prisma Client.

### [pg (node-postgres)](https://node-postgres.com/) (`pg`)
* **Category:** Database Client
* **Type:** Dependency
* **Reason:** Non-blocking PostgreSQL client for Node.js. It acts as the driver needed for connecting to and interacting with a PostgreSQL database.

---

## 3. Data Fetching & State Management

### [Axios](https://axios-http.com/) (`axios`)
* **Category:** HTTP Client
* **Type:** Dependency
* **Reason:** A promise-based HTTP client for browser and Node.js. It simplifies handling HTTP requests, response mapping, interceptors (for authentication headers), and error handling compared to the native `fetch` API.

### [Zustand](https://github.com/pmndrs/zustand) (`zustand`)
* **Category:** Client State Management
* **Type:** Dependency
* **Reason:** A lightweight, fast, and hook-based state management library. It is used for managing global client states (like current logged-in user details, shopping/library cart, sidebar state, or theme selections) with minimal boilerplate.

### [TanStack React Query](https://tanstack.com/query/latest) (`@tanstack/react-query`)
* **Category:** Server State Management
* **Type:** Dependency
* **Reason:** Handles caching, synchronization, auto-refetching, and state management for asynchronous server data. It dramatically simplifies data fetching code and prevents redundant network requests.

---

## 4. Form Handling & Schema Validation

### [Zod](https://zod.dev/) (`zod`)
* **Category:** Schema Validation
* **Type:** Dependency
* **Reason:** A TypeScript-first schema declaration and validation library. It is used to validate inputs on both the frontend (forms) and the backend (API requests, environment variables) to ensure structural and type safety.

### [React Hook Form](https://react-hook-form.com/) (`react-hook-form`)
* **Category:** Form State Management
* **Type:** Dependency
* **Reason:** Provides high-performance, flexible, and extensible form validation with minimal rendering overhead. It manages form states, inputs, and validation rules.

### [@hookform/resolvers](https://github.com/react-hook-form/resolvers) (`@hookform/resolvers`)
* **Category:** Validation Adapter
* **Type:** Dependency
* **Reason:** Integrates validation libraries like Zod, Yup, or Joi with React Hook Form. This enables running Zod validation schemas when forms are submitted.

---

## 5. Security & Authentication

### [jsonwebtoken](https://github.com/auth0/node-jsonwebtoken) (`jsonwebtoken`)
* **Category:** Authentication Tokens
* **Type:** Dependency
* **Reason:** Implements JSON Web Tokens (JWT) for signing and verifying tokens. Used for secure, stateless user session tokens in authorization headers or cookies.

### [bcryptjs](https://github.com/dcodeIO/bcrypt.js) (`bcryptjs`)
* **Category:** Password Hashing
* **Type:** Dependency
* **Reason:** A pure JavaScript implementation of bcrypt. Used for securely hashing user passwords before database storage and verifying password hashes during authentication.

### [cookies-next](https://github.com/thijskoppen/cookies-next) (`cookies-next`)
* **Category:** Cookie Helper
* **Type:** Dependency
* **Reason:** Simplifies reading, setting, and deleting cookies on the client side, server side (Next.js API routes), and in Server Components.

---

## 6. UI Components, Icons, & Utilities

### [Lucide React](https://lucide.dev/) (`lucide-react`)
* **Category:** UI Icons
* **Type:** Dependency
* **Reason:** A clean and consistent icon pack containing thousands of vector icons for building intuitive user interfaces.

### [Sonner](https://sonner.emilkowal.ski/) (`sonner`)
* **Category:** User Feedback (Toasts)
* **Type:** Dependency
* **Reason:** A modern, customizable toast notification component for React, used to provide non-obvious/non-blocking feedback on user actions (e.g., "Book added successfully").

### [Date-fns](https://date-fns.org/) (`date-fns`)
* **Category:** Utility
* **Type:** Dependency
* **Reason:** A modern and lightweight library for formatting, parsing, and manipulating dates (e.g., due dates for book loans, reservation timestamps).

### [TanStack React Table](https://tanstack.com/table/latest) (`@tanstack/react-table`)
* **Category:** UI Components
* **Type:** Dependency
* **Reason:** A headless table library for building highly functional datagrids. It provides features like sorting, pagination, filtering, and row selection (e.g., lists of books, inventory tables).

---

## 7. API Documentation

### [swagger-jsdoc](https://github.com/Surnet/swagger-jsdoc) (`swagger-jsdoc`)
* **Category:** Documentation Generator
* **Type:** Dependency
* **Reason:** Integrates Swagger (OpenAPI) specification generation with codebase comments using JSDoc. Generates a schema from JSDoc tags written directly above API route handlers.

### [swagger-ui-react](https://github.com/swagger-api/swagger-ui/tree/master/flavor/react) (`swagger-ui-react`)
* **Category:** Documentation UI
* **Type:** Dependency
* **Reason:** Renders interactive Swagger API documentation in a React/Next.js page, enabling developers to test API endpoints directly from the browser.

---

## 8. Development & Tooling

### [TypeScript](https://www.typescriptlang.org/) (`typescript`)
* **Category:** Programming Language
* **Type:** DevDependency
* **Reason:** A strongly typed superset of JavaScript that compile to clean JS, helping prevent runtime type errors and enhancing autocompletion.

### [ESLint](https://eslint.org/) & [eslint-config-next](https://nextjs.org/docs/app/api-reference/config/eslint) (`eslint`, `eslint-config-next`)
* **Category:** Code Quality / Linter
* **Type:** DevDependency
* **Reason:** Static analysis tool to find and fix problems in JS/TS/React code, enforcing standard formatting and best practices.

### TypeScript Declarations (`@types/node`, `@types/react`, `@types/react-dom`)
* **Category:** Type Definitions
* **Type:** DevDependency
* **Reason:** Provides TypeScript type definitions for standard Node.js APIs, React core, and React DOM respectively.

# Standard Files Structure 
mkdir prisma,middleware,components,lib,services,actions,types,hooks,utils,constants,schemas

mkdir prisma\migrations

mkdir components\ui,components\forms,components\tables,components\cards,components\navbar,components\sidebar,components\dialogs,components\charts

