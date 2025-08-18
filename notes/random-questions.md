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