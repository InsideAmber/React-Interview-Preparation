# 1. What is the Virtual DOM and how does React use it?
- The Virtual DOM (VDOM) is a lightweight in-memory representation of the real DOM.
- React uses the VDOM to improve performance. When your app changes state:
- React creates a new Virtual DOM.
- It compares the new Virtual DOM with the previous one (diffing).
- Then, React applies only the minimal updates to the real DOM (aka reconciliation).
  # Why it’s important:
    - Real DOM manipulations are slow.
    - VDOM makes UI updates efficient and fast.

# 2. What are the differences between functional and class components?

| Feature           | Class Component                  | Functional Component    |
| ----------------- | -------------------------------- | ----------------------- |
| Syntax            | ES6 class                        | JavaScript function     |
| State             | `this.state` + `this.setState()` | `useState` hook         |
| Lifecycle methods | Yes                              | Via hooks (`useEffect`) |
| `this` context    | Required                         | Not needed              |
| Cleaner code      | ❌ Often more boilerplate        |✅ Concise and readable |

# 3. Explain the Component Lifecycle in React

✅ Lifecycle Phases (Class Components):

Mounting: Component is added to DOM
- `constructor()`, `render()`, `componentDidMount()`

Updating: Props/state changes
- `shouldComponentUpdate()`, `componentDidUpdate()`

Unmounting: Component is removed
- `componentWillUnmount()`

✅ Diagram:

Mounting ─▶ Updating ─▶ Unmounting
    ↓             ↑
componentDidMount  componentDidUpdate

How do Lifecycle Methods Map to Hooks?

| Class Lifecycle Method | Equivalent Hook                           |
| ---------------------- | ----------------------------------------- |
| `componentDidMount`    | `useEffect(() => {}, [])`                 |
| `componentDidUpdate`   | `useEffect(() => { ... }, [deps])`        |
| `componentWillUnmount` | `useEffect(() => return () => {...}, [])` |

# 4. What is JSX? Can the browser read JSX directly?

✅ Concept:
JSX (JavaScript XML) is a syntax extension that lets you write HTML in JavaScript.

It looks like HTML but is actually syntactic sugar for `React.createElement()`.

❗ Important:
- JSX is not valid JavaScript.
- It must be transpiled (compiled) using Babel or a bundler like Vite, Webpack.

✅ JSX Example:
```jsx
const element = <h1>Hello, Mr. Amber</h1>;
```

Transpiled version:
```js
const element = React.createElement('h1', null, 'Hello, Mr. Amber');
```

✅ Browser:
The browser doesn't understand JSX, but your build tools convert it to plain JavaScript.


# 5. Props vs State – Key Differences

| Feature      | Props                  | State                 |
| ------------ | ---------------------- | --------------------- |
| Mutability   | Immutable (read-only)  | Mutable (can change)  |
| Managed by   | Parent component       | The component itself  |
| Use case     | Data passing           | Dynamic data handling |
| Access in TS | Through interface/type | `useState` hook       |

  # State Updates are Asynchronous

   ```tsx
   setCount(count + 1);
   console.log(count); // Might still show old value!
   ```

  - React batches multiple state updates for performance optimization. 
  - Always use the functional update form if you're updating based on previous state:

   ```tsx
   setCount(prev => prev + 1);
   ```

# 6. 🔁 Mutability vs Immutability
  
|   Concept      | Mutability                        | Immutability                             |
| -------------- | --------------------------------- | ---------------------------------------- |
| **Definition** | Changing the original object/data | Creating a new copy instead of modifying |
| **Example**    | `array.push(4)`                   | `[...array, 4]`                          |
| **Impact**     | React might not detect changes    | React detects new object → re-renders    |

Example 1 — ❌ Mutable Update (Incorrect)

```tsx
const [numbers, setNumbers] = useState([1, 2, 3]);

const addNumber = () => {
  numbers.push(4); // ❌ modifies the original array
  setNumbers(numbers); // React doesn't detect change
};
```
Why this fails:
- numbers is mutated with `.push()`
- You set the same reference back with `setNumbers(numbers)`
- React checks object reference → sees it's the same → no re-render happens

Example 2 — Immutable Update (Correct) :

```tsx
const [numbers, setNumbers] = useState([1, 2, 3]);

const addNumber = () => {
  setNumbers(prev => [...prev, 4]); // ✅ creates a new array
};
```
Why this works:
- `prev` is untouched
- `[...prev, 4]` creates a new array
- New reference triggers React's diffing → triggers re-render

🔍 Visualizing with Object References:

```tsx
const a = [1, 2, 3];
const b = a;        // mutable — same reference
const c = [...a];   // immutable — new reference
```

Mutability means modifying the original data structure, while immutability involves creating a new copy with changes. React’s useState depends on immutability — it only re-renders when state changes via a new reference. Mutating state directly can cause React to skip updates.


# 7. What is Code Splitting?
Code splitting is a technique to break your JavaScript bundle into smaller chunks so that only the code needed for a particular route/component is loaded — not the entire app upfront.

It helps:
- ⏱ Reduce initial load time
- 📶 Improve performance on slow networks
- 📱 Make large apps feel faster and more responsive

How React Supports Code Splitting?

Using:
```tsx
const LazyComponent = React.lazy(() => import("./YourComponent"));
```
This loads the component only when needed. You then wrap it in:

```tsx
<Suspense fallback={<Loader />}>
  <LazyComponent />
</Suspense>
```
| Feature          | Benefit                                |
| ---------------- | -------------------------------------- |
| `React.lazy()`   | Lazily loads components                |
| `Suspense`       | Displays fallback UI while loading     |
| Split by route   | Loads only what’s needed when needed   |
| Production build | Uses `vite` to split into actual files |

My observation -
- When you refresh the page, only the main bundle is loaded.
- When you visit a lazy-loaded route, a new JS file (chunk) is loaded in the Network tab.

That’s exactly what’s supposed to happen with lazy loading + code splitting!

Initial Load:
- React loads only what's immediately needed (e.g. Home.tsx, layout, nav).
- It doesn’t include DashboardPage.tsx or any other lazy-loaded components.
- So your initial bundle is smaller and loads faster.

When Route is Visited:
- When user navigates to /dashboard, React:
  - Fetches DashboardPage.tsx on demand
  - Shows <Loader /> fallback during fetch
  - Then renders the component

# 8. How would you debug unnecessary re-renders?

   1. Use [React DevTools Profiler](https://react.dev/learn/react-developer-tools):
    
   🔧 Tool: React Developer Tools Extension (Chrome/Firefox)
     
     - Go to Profiler tab
     - Click “Record” 🟥
     - Interact with your UI
     - Stop recording 🟦

    What it shows:
     - Which components rendered
     - How long they took
     - Why they re-rendered (e.g. props changed or not)

    Use it to spot:
     - Components re-rendering without props/state change
     - Frequent re-renders in lists

  2. Add `console.log()` Inside Components
   
   ```tsx
   console.log("🔁 Re-rendering MyComponent");
   ```
   - Simple but effective
   - Helps pinpoint if child components re-render unnecessarily

  3. Use `React.memo`/`PureComponent` with Logs

  ```tsx
  const MyComponent = React.memo((props) => {
  console.log("🔁 Memoized Component rendered");
  return <div>{props.value}</div>;
  });
  ```

  - If logs appear despite no prop change, there's a problem

  4. Track Object/Array Identity

  🛑 Common Mistake:
   Passing a new object or array on every render:
   
   ```tsx
   <MyComponent someProp={{ x: 1 }} /> // Always new object → re-renders
   ```

  ✅ Fix:
   Use `useMemo` or `useCallback` to memoize:
   ```tsx
   const memoizedObj = useMemo(() => ({ x: 1 }), []);
   ```

  5. Add `why-did-you-render` Library
   
  Helps highlight unnecessary renders during development
  🧪 Setup:
  ```tsx
  npm install @welldone-software/why-did-you-render
  ```

  ```tsx
  import React from "react";
  if (process.env.NODE_ENV === "development") {
  // @ts-ignore
  import("why-did-you-render").then((whyDidYouRender) => {
    whyDidYouRender.default(React, {
      trackAllPureComponents: true,
    });
  });
  }
  ```
  Now if a React.memo component re-renders without prop change, it logs a warning.

  6. Avoid Inline Functions in JSX (if passed to child)

  ```tsx
  <MyComponent onClick={() => doSomething()} /> // Triggers re-render every time
  ```
  ✅ Instead:

  ```tsx
  const onClick = useCallback(() => doSomething(), []);
  <MyComponent onClick={onClick} />
  ```

  7. Break Down Big Components:

  If a component has:
   - Many props
   - Deep conditional logic
   - Lists or DOM manipulations

  Split it into smaller components and use React.memo to isolate re-renders.

  Summary Table

  | Tool / Strategy                | Purpose                                |
  | ------------------------------ | -------------------------------------- |
  | **React Profiler**             | Visualize rendering frequency/time     |
  | **Console logs**               | Simple tracking of renders             |
  | **React.memo / PureComponent** | Prevents re-renders on unchanged props |
  | **useMemo / useCallback**      | Avoids prop identity changes           |
  | **why-did-you-render**         | Warns about avoidable re-renders       |
  | **Component breakdown**        | Limits re-render scope                 |

  You Can also Create a `useRenderCount()` Hook

  To track how often a component renders:
  ```tsx
  import { useRef } from "react";

  export function useRenderCount(name: string) {
  const renderCount = useRef(1);
  console.log(`🔁 ${name} rendered ${renderCount.current++} times`);
  }
  ```
  usage:
  ```tsx
  useRenderCount("MyComponent");
  ```


# Topics Covered: 

- Virtual Dom 
- functional components vs class components
- components lifecycle in reactjs
- JSX working
- Hooks - `useState` `useEffect`
- [`useMemo` and `useCallback`](https://github.com/InsideAmber/React-Interview-Preparation/tree/master/src/components)
- [`useRef`]()
- prop drilling vs lifting state up
- [context API vs Redux vs Zustand]()
- Performance Optimization (Lazy loading, code splitting, memoization)
- [React.memo and Pure components]()
- How would you debug unnecessary re-renders?
- [Routing and Nested Routes]()
- [Error Boundaries]()
- [Custom hook implementation (`useDebounce`, `useLocalStorage`, `useOutsideClick`, `useCopyToClipboard`, `useToggle`)]()
- [Todo with `useReducer`]()







