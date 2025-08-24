## 1. What is a Synthetic Event?

SyntheticEvent is React’s cross-browser wrapper around the browser’s native events. It:

 - Normalizes event behavior and properties across browsers (e.g., `onChange`, `onInput`, `onClick`, `onKeyDown`).

- Uses React’s event delegation (events are attached at the root and bubble through the React tree, not each DOM node).

- Has a consistent API: `preventDefault()`, `stopPropagation()`, `currentTarget`, `target`, `type`, `timeStamp`, etc.

- React 17+: event pooling was removed, so you can use events asynchronously without calling `event.persist()`.

Common Types (TypeScript)

- `React.MouseEvent<HTMLButtonElement>`

- `React.ChangeEvent<HTMLInputElement>`

- `React.KeyboardEvent<HTMLInputElement>`

- `React.FormEvent<HTMLFormElement>`

`target` vs `currentTarget`

- `event.target`: the origin element of the event (could be a child).

- `event.currentTarget`: the element with the handler attached (often what you want in React).

## 2. How can you optimize the rendering of large lists in React?

This is a very important performance topic in real-world react apps. When rendering large lists (e.g., thousands of items), directly mapping over them can cause performance bottlenecks due to DOM creation and rendering overhead.

Here are the main optimization techniques:

**1. Windowing / Virtualization**

Instead of rendering all items at once, only render the portion visible in the viewport.

📦 Popular libraries:

`react-window` (lightweight)

`react-virtualized` (feature-rich)

Example with `react-window`:

```tsx
import React from "react";
import { FixedSizeList as List } from "react-window";

const items = Array.from({ length: 10000 }, (_, i) => `Item ${i + 1}`);

const VirtualizedList = () => (
  <List
    height={400}        // viewport height
    itemCount={items.length}
    itemSize={35}       // row height
    width={300}
  >
    {({ index, style }) => (
      <div style={style} className="px-2 py-1 border-b">
        {items[index]}
      </div>
    )}
  </List>
);

export default VirtualizedList;
```
*Renders only visible items, drastically reducing DOM nodes.*

**2. Memoization of List Items**

If your list items are complex, use `React.memo` to prevent unnecessary re-renders.

```tsx
import React from "react";

const ListItem = React.memo(({ item }: { item: string }) => {
  console.log("Rendering:", item);
  return <li>{item}</li>;
});

const ItemList = ({ items }: { items: string[] }) => (
  <ul>
    {items.map((item, idx) => (
      <ListItem key={idx} item={item} />
    ))}
  </ul>
);

export default ItemList;
```
*Only re-renders changed items, not the entire list.*

**3. Pagination / Infinite Scroll**

Instead of showing thousands of items at once, fetch and render in chunks.

Example (basic infinite scroll):

```tsx
import React, { useState, useEffect } from "react";

const InfiniteScrollList = () => {
  const [items, setItems] = useState<string[]>([]);
  const [page, setPage] = useState(1);

  useEffect(() => {
    const newItems = Array.from({ length: 20 }, (_, i) => `Item ${(page - 1) * 20 + i + 1}`);
    setItems((prev) => [...prev, ...newItems]);
  }, [page]);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, clientHeight, scrollHeight } = e.currentTarget;
    if (scrollTop + clientHeight >= scrollHeight - 5) {
      setPage((prev) => prev + 1);
    }
  };

  return (
    <div onScroll={handleScroll} className="h-64 overflow-auto border">
      {items.map((item, idx) => (
        <div key={idx} className="p-2 border-b">
          {item}
        </div>
      ))}
    </div>
  );
};

export default InfiniteScrollList;
```
*Only loads new data when scrolling.*

**4. Avoid Inline Functions / Heavy Computations**

- Move callbacks outside render (use `useCallback`).

- Precompute expensive values (`useMemo`).

- Avoid unnecessary re-render triggers.

**5. Use Keys Properly**

Always use stable unique keys (`id`) instead of array indices to prevent re-renders and DOM mismatches.

## 3. How does React Fiber improve performance in React applications?

React Fiber is one of the most important upgrades React ever made (introduced in React 16). It’s not a feature you use directly, but the new reconciliation engine inside React that improves performance, responsiveness, and scheduling.

**Problem Before Fiber (React 15 and below)**

- React used a stack-based recursive reconciliation algorithm.

- When updating the UI, React would re-render the whole tree synchronously (depth-first).

- This caused the browser to "freeze" if the component tree was huge, because React couldn’t pause or prioritize tasks.

- Example: Updating a large list while the user is typing → typing input feels laggy.

What is React Fiber?

React Fiber = completely new reconciliation algorithm (React 16+).
It improves performance by breaking rendering work into small chunks (units of work) that can be paused, resumed, or aborted.

Think of it like multitasking: instead of finishing one big job all at once, React can slice it and check if something more important needs attention.

**Key Improvements with Fiber**

1. Incremental Rendering (Time-Slicing)

- React can split rendering work into small units.

- If something urgent (like user input, animation) happens, React can pause rendering, handle the urgent task, then resume.

2. Prioritization of Updates

- React assigns priority levels to updates:

  - High priority → user input, animations.

  - Low priority → background data fetching, non-visible updates.

- This prevents laggy UIs.

3. Better Error Handling

- With error boundaries, React Fiber can recover gracefully if part of the tree crashes.

4. Support for Concurrent Mode (React 18)

- Fiber is the foundation for features like concurrent rendering, Suspense, useTransition, etc.

- Without Fiber, React 18’s concurrency features wouldn’t exist.

Example: Without vs With Fiber

Before Fiber (Stack Reconciler)

```sql
┌───────────────┐
│ Start Update  │
├───────────────┤
│ Render Child1 │
│ Render Child2 │
│ Render Child3 │  <-- Can’t pause here
│ Render Child4 │
│ Commit        │
└───────────────┘
```
➡ Browser is blocked until React finishes all children.
➡ User typing or animations feel janky.

With Fiber

```sql
┌───────────────┐
│ Start Update  │
├───────────────┤
│ Render Child1 │
│  (pause, check browser work) 
│ Render Child2 │
│  (pause if user types) 
│ Render Child3 │
│ Render Child4 │
│ Commit        │
└───────────────┘
```
➡ React can pause after any unit of work (Fiber node).
➡ High-priority work (typing, animation) is handled first.

Small Code Illustration (React 18+)

```tsx
import React, { useState, useTransition } from "react";

const App = () => {
  const [query, setQuery] = useState("");
  const [list, setList] = useState<string[]>([]);
  const [isPending, startTransition] = useTransition();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);

    // Background update (low priority)
    startTransition(() => {
      const newList = Array.from({ length: 5000 }, (_, i) => `${value} - Item ${i}`);
      setList(newList);
    });
  };

  return (
    <div>
      <input value={query} onChange={handleChange} placeholder="Type here..." />
      {isPending && <p>Loading...</p>}
      <ul>
        {list.map((item, i) => (
          <li key={i}>{item}</li>
        ))}
      </ul>
    </div>
  );
};

export default App;
```
*Thanks to Fiber + Concurrent features, typing stays smooth, even though thousands of items are being updated.*

Summary

- React Fiber = New reconciliation engine introduced in React 16.

- Benefits:
✅ Breaks rendering into small units (time-slicing).
✅ Allows pausing, resuming, and prioritizing work.
✅ Improves responsiveness of UIs (no blocking).
✅ Foundation for Concurrent Mode, Suspense, and modern React features.

## 4. What are the different ways to handle side effects in React using hooks?

In React, side effects are operations that affect something outside the scope of the current function component, such as:

- Fetching data from an API

- Updating the DOM manually

- Setting up subscriptions (WebSocket, event listeners)

- Using `setTimeout` or `setInterval`

- Logging

React provides different hooks and patterns to handle side effects effectively.

1. `useEffect`

The most common hook for handling side effects. It runs after render.

Example: Fetching data

```tsx
import React, { useEffect, useState } from "react";

const Users: React.FC = () => {
  const [users, setUsers] = useState<string[]>([]);

  useEffect(() => {
    fetch("https://jsonplaceholder.typicode.com/users")
      .then((res) => res.json())
      .then((data) => setUsers(data.map((u: any) => u.name)));
  }, []); // empty dependency -> runs once (like componentDidMount)

  return (
    <div>
      <h2>Users</h2>
      <ul>
        {users.map((user, i) => (
          <li key={i}>{user}</li>
        ))}
      </ul>
    </div>
  );
};

export default Users;
```
- `[]` → run once on mount (fetch data, subscriptions).

- `[dependency]` → re-run when dependency changes.

- No array → runs on every render.

2. useLayoutEffect

- Similar to useEffect, but it runs synchronously after all DOM mutations.

- Use when you need to measure the DOM before the browser paints.

Example: Measuring DOM size

```tsx
import React, { useLayoutEffect, useRef, useState } from "react";

const Box: React.FC = () => {
  const boxRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);

  useLayoutEffect(() => {
    if (boxRef.current) {
      setWidth(boxRef.current.offsetWidth);
    }
  }, []);

  return (
    <div>
      <div ref={boxRef} style={{ width: "200px", height: "100px", background: "lightblue" }}>
        Box Content
      </div>
      <p>Width: {width}px</p>
    </div>
  );
};

export default Box;
```
3. useInsertionEffect (React 18+)

- Specialized for CSS-in-JS libraries (like styled-components, Emotion).

- Runs before mutations are made to the DOM, ensuring styles are injected at the right time.

You rarely use it directly unless building a styling library.

4. Custom Hooks for Side Effects

Encapsulating side effects into reusable hooks.

Example: `useFetch`

```tsx
import { useEffect, useState } from "react";

function useFetch(url: string) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    fetch(url)
      .then((res) => res.json())
      .then((result) => {
        if (isMounted) {
          setData(result);
          setLoading(false);
        }
      });

    return () => {
      isMounted = false; // cleanup
    };
  }, [url]);

  return { data, loading };
}

export default useFetch;
```
Usage:

```tsx
const App = () => {
  const { data, loading } = useFetch("https://jsonplaceholder.typicode.com/posts");

  return loading ? <p>Loading...</p> : <pre>{JSON.stringify(data, null, 2)}</pre>;
};
```

5. External Libraries (for complex side effects)

When side effects grow, we use state management + effects handling tools:

- Redux-Saga / Redux-Thunk → handle async side effects in Redux.

- React Query (TanStack Query) → handles fetching, caching, background updates.

- RxJS → handles reactive streams (like WebSocket data).

Summary

- useEffect → General-purpose side effects (fetching, timers, subscriptions).

- useLayoutEffect → DOM measurements before paint.

- useInsertionEffect → CSS-in-JS style injection.

- Custom Hooks → Encapsulation of reusable side effect logic.

- Libraries → Advanced side effect management in large apps.

## 5. What are the key considerations when implementing a scalable React application?

When building a scalable React application, you have to think beyond just writing components. You need to consider architecture, performance, maintainability, testing, and developer experience. Let’s break it down:

Key Considerations for a Scalable React Application

1. Project Structure & Modular Architecture

- Organize files by feature/domain, not by type (components, hooks, utils grouped together).

- Example:

```css
src/
  features/
    auth/
      components/
      hooks/
      services/
    dashboard/
  shared/
    components/
    hooks/
    utils/
```
- Helps in scaling when app grows from 10 → 100+ components.

2. State Management Strategy

- Decide carefully between:

  - Local state → `useState`, `useReducer`

  - Global state → Redux Toolkit, Zustand, Jotai, Recoil

  - Server state → React Query, SWR (caching, retries, background refetching)

- Rule:

  - Keep state as close to where it’s used as possible.

  - Lift it only when necessary.

3. Performance Optimization

- Use React.memo, `useCallback`, `useMemo` to prevent unnecessary re-renders.

- Code-splitting with `React.lazy` and `Suspense` to load chunks only when needed.

- Virtualization (e.g., `react-window`, `react-virtualized`) for large lists.

- Optimize images and assets (lazy load images, compress static files).

- Avoid prop drilling → use Context API or state libraries.

4. API Layer & Data Fetching

- Create a service layer for APIs (instead of calling `fetch/axios` everywhere).

```ts
// services/userService.ts
import api from "../utils/api";

export const getUsers = () => api.get("/users");
```
- Standardize error handling, loading states, and retry logic.

- Use tools like React Query for caching + invalidation.

5. Routing & Navigation

- Use React Router v6+ with lazy loading and route guards.

- Keep routes centralized (constants file).

- Example:

```tsx
<Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
```
6. Testing & Quality

- Unit tests: React Testing Library + Jest.

- Integration tests: Cypress / Playwright.

- TypeScript for type safety.

- ESLint + Prettier for consistent formatting.

7. Scalable UI System

- Use a design system (e.g., Material UI, Chakra UI, Tailwind).

- Or build shared UI components (Button, Input, Card).

- Enforce reusability + accessibility (aria-*, keyboard nav, WCAG compliance).

8. Error Handling & Logging

- Global error boundaries:

```tsx
class ErrorBoundary extends React.Component {
  state = { hasError: false };
  static getDerivedStateFromError() { return { hasError: true }; }
  render() {
    return this.state.hasError ? <h2>Something went wrong</h2> : this.props.children;
  }
}
```
- Use tools like Sentry, LogRocket for error reporting.

9. Authentication & Security

- JWT/Session management.

- Secure API calls (tokens in HTTP-only cookies).

- Role-based access (RBAC).

- Input sanitization & XSS protection.

10. Build & Deployment Strategy

- Use CI/CD (GitHub Actions, GitLab CI).

- Optimize bundle size (Webpack/ESBuild/Vite tree-shaking).

- Deploy on scalable infra (Vercel, Netlify, AWS Amplify).

## 6. Describe the concept of reusability, modularity, testablity in React components.

These three concepts — Reusability, Modularity, and Testability — are the pillars of writing clean, scalable React components.

🔄 1. Reusability in React Components

Definition: The ability to use the same component in multiple places without rewriting code.

How to achieve it:

- Break down UI into small, self-contained components (Button, Input, Card).

- Accept props to make components configurable.

- Use children for flexible composition.

*Why important? Saves development time, avoids duplication, and ensures UI consistency.*

🧩 2. Modularity in React Components

Definition: Splitting an application into independent, loosely coupled pieces that can work together.

How to achieve it:

- Follow Separation of Concerns (UI, state, and business logic separated).

- Create custom hooks for reusable logic (`useAuth`, `useFetch`, `useForm`).

- Keep components focused on one responsibility.

*Why important? Makes your code easier to extend, maintain, and understand.*

🧪 3. Testability in React Components

Definition: Designing components so they can be easily tested with predictable results.

How to achieve it:

- Write pure components (no hidden side effects).

- Use props to inject dependencies instead of hardcoding them.

- Avoid tightly coupling components with global state.

- Test with tools like React Testing Library or Jest.

*Why important? Ensures reliability, catches bugs early, and gives confidence when refactoring.*

✅ Putting It Together

- Reusability → A button component works in many contexts.

- Modularity → Logic (hooks) and UI (components) are decoupled.

- Testability → Components can be tested in isolation, independent of the whole app.

👉 In short: A good React component is reusable, modular, and testable, which makes the entire application scalable and maintainable.

## 7. What is Hot Module Replacement?

Hot Module Replacement (HMR) in React (and modern frontend development)

Definition

Hot Module Replacement (HMR) is a feature provided by bundlers like Webpack, Vite, or Parcel that allows you to update modules in a running application without a full page reload.

It means when you make changes to your React component (or CSS, etc.), the updated code is injected into the app instantly without losing the application’s current state.

How it works

- You run your app in development mode with HMR enabled.

- The bundler watches files for changes.

- When you save a change:

  - Only the changed module is recompiled.

  - The module is swapped (hot-replaced) in the running app.

  - React Refresh (via react-refresh-webpack-plugin or Vite’s HMR) re-renders the component.

- State is preserved if possible (e.g., form inputs, counters).

Benefits

- 🚀 Faster Development: No need to reload the whole app.

- 🛠️ Preserve State: UI state (like typed text or counter values) doesn’t reset.

- 👀 Instant Feedback: Changes appear immediately in the browser.

📊 Example

Suppose you have a React counter component:

```tsx
import { useState } from "react";

const Counter = () => {
  const [count, setCount] = useState(0);
  return (
    <div>
      <h2>Count: {count}</h2>
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </div>
  );
};

export default Counter;
```
Without HMR: If you change `h2` to `h1`, the app reloads and `count` resets to `0`.
With HMR: The heading updates instantly to `h1` without resetting the counter state.

In React

- React relies on Fast Refresh (a modern implementation of HMR).

- Fast Refresh not only hot-swaps modules but also ensures hooks and component state are preserved during an update, when possible.

## 8. What is the use of Parcel, Vite, Webpack?

Parcel, Vite, Webpack – What & Why?

1. Webpack

- What it is:

Webpack is one of the oldest and most widely used bundlers in the JavaScript ecosystem. It takes your JavaScript, CSS, images, etc., and bundles them into optimized files for production.

- Key Features:

  - Code Splitting (split code into smaller chunks, load on demand).

  - Loaders (convert non-JS files like CSS, TypeScript into JS).

  - Plugins (minify, optimize, etc.).

  - Hot Module Replacement (HMR).
- Pros:

  - Very powerful & flexible.

  - Huge plugin ecosystem.

  - Industry standard for years.

- Cons:

  - Configuration can be complex.

  - Build times can be slow for large projects.

2. Parcel

- What it is:

Parcel is a zero-config bundler. Unlike Webpack, you don’t need a big config file to start—it just works out of the box.

- Key Features:

  - Zero configuration (auto-detects what you need).

  - Built-in support for TypeScript, JSX, CSS, images.

  - Fast bundling with parallel processing.

  - Hot Module Replacement (HMR).

- Pros:

  - Super easy setup.

  - Great for small/medium projects.

  - Optimizations (tree-shaking, minification) come by default.

- Cons:

  - Less flexible than Webpack.

  - Smaller ecosystem of plugins.

3. Vite (modern favorite 🚀)

- What it is:

Vite (means “fast” in French) is a next-gen build tool created by Evan You (creator of Vue.js). It uses ES Modules in the browser for instant dev server and Rollup for production builds.

- Key Features:

  - Lightning-fast startup (no bundling needed in dev, uses native ESM).

  - Hot Module Replacement (HMR) is instant.

  - Rollup-based production build (optimized bundles).

  - First-class support for React, Vue, Svelte, etc.

- Pros:

  - Super fast dev server.

  - Simple configuration.

  - Works great for modern frameworks.

- Cons:

  - Newer tool (but already very popular).

  - Smaller plugin ecosystem compared to Webpack.

Comparison:

| Feature       | Webpack 🏗️           | Parcel 📦                         | Vite ⚡                          |
| ------------- | --------------------- | --------------------------------- | -------------------------------- |
| **Config**    | Complex               | Zero-config                       | Minimal                          |
| **Dev Speed** | Slower                | Fast                              | Blazing Fast 🚀                  |
| **Ecosystem** | Huge                  | Medium                            | Growing rapidly                  |
| **Best for**  | Large enterprise apps | Quick projects, small/medium apps | Modern apps, fast dev experience |
| **HMR**       | Yes (good)            | Yes (fast)                        | Yes (instant)                    |

## 9. How does create-react-app work?

What is CRA (create-react-app)?

- It’s a boilerplate tool created by Facebook (Meta) to quickly bootstrap a React project.

- It sets up React + Webpack + Babel + ESLint + Jest for you, so you don’t waste time configuring everything manually.

- You interact with it using the `react-scripts` package, which hides all the heavy configs.

How CRA Works – Under the Hood

Scaffolding the App

```bash
npx create-react-app my-app
cd my-app
npm start
```
- Creates a React project with a standard structure:

```pgsql
my-app/
├── node_modules/
├── public/
│   └── index.html
├── src/
│   ├── index.js   <-- entry point
│   ├── App.js
└── package.json
```
Adds dependencies: `react`, `react-dom`, and `react-scripts`

2. The Hidden Engine: `react-scripts`

- CRA installs a package called `react-scripts` which contains:

  - Webpack (for bundling)

  - Babel (to transpile modern JS/JSX → ES5)

  - ESLint (linting rules)

  - Jest (unit testing setup)

- Instead of giving you messy config files, CRA hides them in react-scripts.

Example from package.json:

```json
"scripts": {
  "start": "react-scripts start",
  "build": "react-scripts build",
  "test": "react-scripts test",
  "eject": "react-scripts eject"
}
```
3. Running `npm start`

- Launches the Webpack Dev Server with:

  - Hot Module Replacement (HMR) → updates code instantly in browser.

  - Proxy support for APIs (optional).

- Webpack serves the `index.html` inside `public/` and injects the bundled JS.

4. Running `npm run build`

- Creates an optimized production build:

  - Bundles JS, CSS, images.

  - Minifies code, does tree-shaking (removes unused code).

  - Generates static assets in `/build`.

- The result is deployable to Netlify, Vercel, S3, etc.

5. Running `npm run test`

- Uses Jest (preconfigured with React Testing Library) to run tests out of the box.


6. Ejecting (npm run eject)

- CRA hides Webpack/Babel configs by default.

- If you want full control, run:

```bash
npm run eject
```
- This copies all configs (Webpack, Babel, ESLint, etc.) into your project so you can edit them.

- Irreversible! Once you eject, you maintain those configs yourself.

Diagram of CRA Flow:

```css
┌───────────────────┐
│  Your React Code  │
│ (src/*.js, .css)  │
└─────────┬─────────┘
          │
          ▼
┌───────────────────┐
│   Babel (JSX → JS)│
└─────────┬─────────┘
          │
          ▼
┌───────────────────┐
│  Webpack Bundler  │
│  (JS, CSS, Assets)│
└─────────┬─────────┘
          │
   ┌──────▼───────┐
   │   Dev Mode   │  → Webpack Dev Server + HMR
   └──────┬───────┘
          │
   ┌──────▼───────┐
   │ Production   │  → Optimized `/build` folder
   └──────────────┘
```
In short

- CRA = "React + Webpack + Babel + Jest + ESLint" preconfigured.

- You use `react-scripts` commands instead of touching config.

- `npm start` = dev mode (HMR).

- `npm build` = optimized production build.

- `npm eject` = reveal configs for customization.

## 10. What is Tree Shaking?

Key Points about Tree Shaking:

1. Static Analysis of ES Modules (ESM):

- Works with `import` and `export` statements (ES6 modules), because they are static and analyzable at build time.

- Doesn’t work as effectively with `require()` (CommonJS).

2. Dead Code Elimination:

- Removes code that is never used (not imported or referenced anywhere).

- Example: If you import only `add` function from `mathUtils`, other functions like `subtract` or `multiply` will be eliminated.

3. Bundle Size Optimization:

- Reduces the bundle size, leading to faster load times and better performance.

4. Supported By Modern Bundlers:

- Webpack (with production mode), Rollup (default), Parcel, and Vite all support tree shaking.

Example of Tree Shaking

mathUtils.js

```js
export function add(a, b) {
  return a + b;
}

export function subtract(a, b) {
  return a - b;
}

export function multiply(a, b) {
  return a * b;
}
```
App.js

```js
import { add } from './mathUtils';

console.log(add(2, 3));
```
Here, only the `add` function is imported and used.
When bundled with tree shaking, `subtract` and `multiply` will be excluded from the final production 
bundle.

Cases Where Tree Shaking Might Fail

- Using CommonJS (`require`) instead of ES Modules (`import/export`).

- Dynamic imports like:

```js
const mathUtils = require('./mathUtils');
mathUtils.add(2, 3); // Prevents tree shaking
```
- Side effects in code (e.g., if a module runs some code just by being imported).

Best Practices for Effective Tree Shaking

- Use ES6 module syntax (`import/export`).

- Avoid writing side effects in modules (code that runs automatically on import).

- Prefer named imports instead of importing everything:

```js
// ❌ Bad
import * as utils from './mathUtils';
utils.add(2, 3);

// ✅ Good
import { add } from './mathUtils';
add(2, 3);
```
- Enable production mode in Webpack or set `optimization.usedExports: true`.

## 11. Difference b/w dependency and devDependency

```sql
┌───────────────────────────┐
│        Development        │
│  (your local machine)     │
├───────────────────────────┤
│ devDependencies:          │
│  - webpack / vite         │
│  - babel / typescript     │
│  - tailwindcss / postcss  │
│  - eslint / prettier      │
│                           │
│ dependencies:             │
│  - react / react-dom      │
│  - axios / redux          │
│  - lodash, etc.           │
└─────────────┬─────────────┘
              │  (npm run build)
              ▼
┌───────────────────────────┐
│        Build Stage        │
│ (CI/CD or local build cmd)│
├───────────────────────────┤
│ devDependencies are USED  │
│ to:                       │
│  - compile TS → JS        │
│  - bundle code (webpack)  │
│  - generate CSS (tailwind)│
│  - tree-shake unused code │
│                           │
│ dependencies are BUNDLED  │
│ into final JS + CSS files │
└─────────────┬─────────────┘
              │  (deploy)
              ▼
┌───────────────────────────┐
│        Production         │
│  (live server / client)   │
├───────────────────────────┤
│ Only final build is used: │
│  - main.js (bundled app)  │
│  - styles.css (from TW)   │
│                           │
│ devDependencies ❌ NOT NEEDED│
│ dependencies ✅ REQUIRED   │
└───────────────────────────┘
```

## 12. difference b/w package.json vs package-lock.json?

| Feature       | **package.json**                       | **package-lock.json**                  |
| ------------- | -------------------------------------- | -------------------------------------- |
| Purpose       | Project manifest, defines dependencies | Lockfile, locks exact versions         |
| Maintained by | Developer                              | npm (auto-generated)                   |
| Versions      | Version ranges (`^`, `~`)              | Exact version numbers                  |
| Editable?     | Yes                                    | No (auto-generated)                    |
| Importance    | Defines what you want                  | Ensures you always get the same result |

In short:

- `package.json` = What dependencies you want.

- `package-lock.json` = The exact versions you actually got.

**Why commit package-lock.json to Git?**

Reason 1 – Consistency across environments

Imagine your `package.json` says:

```json
"react": "^18.2.0"
```
This allows any version between `18.2.0` and `<19.0.0`.

- If you install today, you might get `18.2.0`.

- If your teammate installs next week, they might get `18.3.1` (if released).

- This could introduce unexpected bugs.

👉 `package-lock.json` ensures everyone gets the exact same versions (`18.2.0` in this case).

Reason 2 – Faster installations

- `package-lock.json` includes resolved URLs + integrity hashes.

- So `npm/yarn` doesn’t have to re-resolve versions every time → faster installs.

Reason 3 – Security & reproducibility

- Lockfile includes hashes (`integrity`) → prevents malicious package tampering.

- Guarantees your CI/CD pipeline installs the exact same packages tested locally.

If you delete `package-lock.json`:

- `npm install` will re-resolve versions based on `package.json` ranges.

- You may end up with slightly different package versions → bugs.

- Best practice: Always commit `package-lock.json` (except in libraries where only `package.json` is needed).

**Difference between `^` and `~` in versioning**

In `package.json` dependencies:

Caret (`^`)

- Updates minor & patch versions, but not major.

- Example:

```json
"react": "^18.2.0"
```

- Allowed: `18.2.1`, `18.3.0`, `18.9.5`

- Not allowed: `19.0.0`

Tilde (`~`)

- Updates only patch versions (bug fixes).

- Example:

```json
"axios": "~1.6.2"
```

- Allowed: `1.6.3`, `1.6.5`

- Not allowed: `1.7.0`

Summary:

| Symbol | Updates Allowed | Example with `1.6.2`      |
| ------ | --------------- | ------------------------- |
| `^`    | Minor + Patch   | `1.7.0`, `1.8.5`, `1.9.x` |
| `~`    | Patch only      | `1.6.3`, `1.6.9`          |
| None   | Exact version   | Only `1.6.2`              |

So in real-world projects:

- `^` is most common (flexibility + bug fixes).

- `~` is safer if you want stability but still want bug fixes.

- Exact version (`1.6.2`) used when you want absolute stability.


## 13. Difference between `console.log(<HeaderComponent/>)` and `console.log(HeaderComponent());`

1️⃣ `console.log(<HeaderComponent />)`

- `<HeaderComponent />` is JSX.

- After compilation (by Babel), it becomes a React element object:

```js
{
  type: HeaderComponent,
  props: { ... },
  key: null,
  ref: null,
  ...
}
```
- when you `console.log(<HeaderComponent />)`, you’re logging the virtual representation (React.createElement output), not the actual rendered HTML.

👉 It’s just a description of what React should render.

2️⃣ `console.log(HeaderComponent());`

- Here you’re invoking the function directly.

- A React functional component is just a function → calling it runs its body.

Example:

```tsx
function HeaderComponent() {
  return <h1>Hello</h1>;
}
```
- If you run `HeaderComponent()`, it will return:

```js
{
  type: 'h1',
  props: { children: 'Hello' },
  ...
}
```
- i.e., you’ll get the React element that the component returns (not the wrapper that describes `<HeaderComponent />`).

Key Difference

| Code                               | What You Get                                                                                             | Analogy                                         |
| ---------------------------------- | -------------------------------------------------------------------------------------------------------- | ----------------------------------------------- |
| `console.log(<HeaderComponent />)` | A **React element object** describing `<HeaderComponent />`. (like React.createElement(HeaderComponent)) | A **blueprint** saying “Render HeaderComponent” |
| `console.log(HeaderComponent())`   | The **React element returned** from inside the component. (like React.createElement('h1', …))            | The **result** after executing the blueprint    |


Extra Note:

- In real React rendering, React calls `HeaderComponent()` internally when it processes `<HeaderComponent />`.

- But as a developer, you should almost never call `HeaderComponent()` directly → React needs to manage lifecycle, hooks, reconciliation, etc.

## 14. What is the difference b/w client-side routing and server-side routing?

🌍 Server-Side Routing (SSR Routing)

📌 How it works:

- Every time the user clicks a link, a new HTTP request is sent to the server.

- The server looks at the URL, fetches the correct HTML page, and sends it back.

- The entire page reloads each time.

✅ Pros:

- Better for SEO (search engines get full HTML).

- Initial load might be faster because the server sends the whole page.

- Works without JavaScript enabled.

❌ Cons:

- Slower navigation because each click reloads the page.

- Higher server load (every request handled on server).

- Not as “app-like”.

Example (traditional server routing):

```bash
/home  → server returns home.html
/about → server returns about.html
```

⚛ Client-Side Routing (CSR Routing)

📌 How it works in React (e.g., React Router):

- The app loads only one HTML file (`index.html`) initially.

- When you click a link, React intercepts the navigation.

- It doesn’t make a full page reload — instead, it updates the view by rendering the right component.

- Browser history (`pushState`, `popState`) is updated so URL looks normal.

✅ Pros:

- Super fast navigation (no full reloads).

- Feels like a native app.

- Reduces server load (server mostly serves static assets once).

❌ Cons:

- Initial load can be heavier (JS bundle).

- Needs extra setup for SEO (since HTML isn’t pre-rendered).

- If JS fails, routing breaks.

Example (React Router client-side):

```bash
/home  → shows <Home />
/about → shows <About />
```
👉 Both are rendered inside <App /> without new requests to server (except API calls).

Comparison Table

| Feature         | Server-Side Routing        | Client-Side Routing               |
| --------------- | -------------------------- | --------------------------------- |
| Page Load       | Full reload on each route  | Single page, no reload            |
| Speed           | Slower navigation          | Faster navigation                 |
| SEO             | Better by default          | Needs SSR/Pre-rendering           |
| Server Load     | High (renders per request) | Low (server mostly serves assets) |
| User Experience | Feels like websites        | Feels like web apps               |


Example in React Router (Client-Side)

```tsx
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";

function Home() {
  return <h1>Home Page</h1>;
}

function About() {
  return <h1>About Page</h1>;
}

function App() {
  return (
    <BrowserRouter>
      <nav>
        <Link to="/home">Home</Link> | 
        <Link to="/about">About</Link>
      </nav>
      <Routes>
        <Route path="/home" element={<Home />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
```
👉 Clicking links won’t reload the page — React handles everything client-side.

## 15. What are the best security practice for scalable applications in React?

1. Protect Sensitive Data in Frontend

- Never store API keys, secrets, tokens, or banking details in the frontend code or `localStorage`.

- Use environment variables (`.env`) but remember: anything bundled is still public. Only keep non-sensitive config here.

- For session tokens:

  - Prefer HttpOnly Secure Cookies (set by backend).

  - If you must store in `localStorage/sessionStorage`, encrypt and apply strict expiry checks.

2. Prevent XSS (Cross-Site Scripting)

React is generally safe because it escapes HTML by default:

```tsx
<p>{userInput}</p> // Safe
<p dangerouslySetInnerHTML={{ __html: userInput }} /> // ❌ Unsafe
```
- Avoid `dangerouslySetInnerHTML`. If unavoidable, sanitize input using libraries like DOMPurify.

- Validate all user inputs on frontend before sending them.

3. Prevent Clickjacking & UI Redress Attacks

Wrap your app with a frameguard check:

```tsx
if (window.top !== window.self) {
  window.top.location = window.self.location;
}
```
- Although backend usually adds `X-Frame-Options`, frontend can also detect & prevent rendering inside iframes.

4. Strict Content Security Policy (CSP)

- Configure CSP headers via backend (but React app should not rely on inline scripts).

- Avoid inline `<script>` tags in React. Always use imports.

5. Authentication & Authorization UI

- Ensure role-based UI: Don’t show buttons or UI elements that user shouldn’t access.

- Example: A normal user shouldn’t even see “Admin Dashboard” links.

6. Secure Dependency Management

- Always update React, React Router, and third-party libraries to latest versions.

- Use tools like:

  - npm audit

  - snyk

- Avoid untrusted libraries.

7. Safe Handling of Forms

- Add client-side validation (required fields, proper formats, regex for PAN/Aadhaar/IBAN, etc.).

- Prevent duplicate submissions with disabled states during API calls.

- Mask sensitive input fields (e.g., passwords, CVV, PIN).

8. Secure API Calls

- Always use HTTPS (TLS).

- Add frontend rate limiting controls like disabling multiple OTP requests too quickly.

- Use CSRF tokens for requests if needed (though mostly backend-managed).

9. Avoid Exposing Internal Errors

- Don’t show stack traces or raw API errors in UI.

- Show user-friendly messages:

```ts
setError("Something went wrong. Please try again later.");
```

10. Frontend Monitoring & Logging

- Add error boundaries in React to catch runtime errors.

- Track suspicious activity like multiple failed login attempts (frontend logs can help detect anomalies early).

**In summary for frontend (fintech context):**

- No secrets in frontend.

- Avoid dangerouslySetInnerHTML.

- Secure forms, inputs, and API handling.

- Hide unauthorized UI.

- Keep dependencies updated.

- Use HTTPS + safe error messages.

- Add monitoring + strict CSP.

# 16. What is CSRF? How to Prevent CSRF?

What is CSRF?

CSRF attack happens when:

- A user is already authenticated (e.g., logged into their bank app).

- The browser stores their session cookie (HttpOnly cookie).

- An attacker tricks the user into visiting a malicious site that secretly sends a request to your app’s backend (e.g., transfer money).

- Since cookies are automatically sent by browsers with every request to that domain, the backend thinks the request is valid, even though it came from attacker’s site.

👉 Example:

- You’re logged into your fintech app (finapp.com).

- You open a malicious site.

- That site runs:

```html
<img src="https://finapp.com/api/transfer?amount=10000&to=attacker" />
```
- Your browser auto-attaches the auth cookie → money transferred 😱.

🛡️ How to Prevent CSRF (Frontend Side)

Since backend must enforce strong protection, on the frontend you can support by:

✅ 1. Use CSRF Tokens (Anti-CSRF Tokens)

- Backend generates a random token (CSRF token) and sends it to the frontend (e.g., in a response or meta tag).

- Frontend includes it in every state-changing request (POST, PUT, DELETE).

- Attacker’s malicious site won’t know the token → request fails.

Example (React fetch call with CSRF token):

```tsx
const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');

fetch("/api/transfer", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "X-CSRF-Token": csrfToken || "",
  },
  body: JSON.stringify({ amount: 10000, to: "attacker" }),
});
```
✅ 2. Use SameSite Cookies

- Backend should set cookies with `SameSite=strict` or `lax`.

- Then cookies won’t be sent automatically when request comes from another domain.

- Frontend devs should ensure they don’t rely on unsafe cross-site requests.

✅ 3. Use Double Submit Cookie

- Backend sends a CSRF token both in a cookie & response body.

- Frontend must send it back in a custom header with requests.

- Attacker cannot read cookies → can’t guess the value.

✅ 4. Avoid GET for State-Changing Requests

- Only use `GET` for fetching data.

- Use `POST`, `PUT`, `DELETE` for actions like transfer, update, etc.

- This makes it harder for attackers to abuse `<img>` or `<a>` tags.

✅ 5. Add UI-Based Safeguards

- Confirmation dialogs for critical actions (like money transfer).

- Re-authentication / OTP for sensitive actions.
Example: Even if CSRF bypassed, attacker can’t succeed without OTP.

**Summary for React Frontend**

- Always include CSRF tokens in API calls (if backend provides them).

- Never rely only on cookies for authentication (use headers like `Authorization: Bearer <token>` when possible).

- Use `SameSite` cookies (frontend config with backend).

- Add user confirmations for sensitive actions.