# 1. What is the Virtual DOM and how does React use it?
- The Virtual DOM (VDOM) is a lightweight in-memory representation of the real DOM.
- React uses the VDOM to improve performance. When your app changes state:
- React creates a new Virtual DOM.
- It compares the new Virtual DOM with the previous one (diffing).
- Then, React applies only the minimal updates to the real DOM (aka reconciliation).
  # Why it’s important:
    - Real DOM manipulations are slow.
    - VDOM makes UI updates efficient and fast.

# 2. Props vs State – Key Differences

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

# 3. 🔁 Mutability vs Immutability
  
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


# 4. What is Code Splitting?
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




