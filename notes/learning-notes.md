## 1. What is the Virtual DOM and how does React use it?
- The Virtual DOM (VDOM) is a lightweight in-memory representation of the real DOM.
- React uses the VDOM to improve performance. When your app changes state:
- React creates a new Virtual DOM.
- It compares the new Virtual DOM with the previous one (diffing).
- Then, React applies only the minimal updates to the real DOM (aka reconciliation).
  ### Why it’s important:
    - Real DOM manipulations are slow.
    - VDOM makes UI updates efficient and fast.

## 2. What are the differences between functional and class components?

| Feature           | Class Component                  | Functional Component    |
| ----------------- | -------------------------------- | ----------------------- |
| Syntax            | ES6 class                        | JavaScript function     |
| State             | `this.state` + `this.setState()` | `useState` hook         |
| Lifecycle methods | Yes                              | Via hooks (`useEffect`) |
| `this` context    | Required                         | Not needed              |
| Cleaner code      | ❌ Often more boilerplate        |✅ Concise and readable |

## 3. Explain the Component Lifecycle in React

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

## 4. What is JSX? Can the browser read JSX directly?

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


## 5. Props vs State – Key Differences

| Feature      | Props                  | State                 |
| ------------ | ---------------------- | --------------------- |
| Mutability   | Immutable (read-only)  | Mutable (can change)  |
| Managed by   | Parent component       | The component itself  |
| Use case     | Data passing           | Dynamic data handling |
| Access in TS | Through interface/type | `useState` hook       |

  ### State Updates are Asynchronous

   ```tsx
   setCount(count + 1);
   console.log(count); // Might still show old value!
   ```

  - React batches multiple state updates for performance optimization. 
  - Always use the functional update form if you're updating based on previous state:

   ```tsx
   setCount(prev => prev + 1);
   ```

## 6. 🔁 Mutability vs Immutability
  
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


## 7. What is Code Splitting?
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

## 8. How would you debug unnecessary re-renders?

1. Use [React DevTools Profiler](https://react.dev/learn/react-developer-tools):
    
   Tool: React Developer Tools Extension (Chrome/Firefox)
   
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

    Common Mistake:
     Passing a new object or array on every render:
     
     ```tsx
      <MyComponent someProp={{ x: 1 }} /> // Always new object → re-renders
     ```

    Fix:
     Use `useMemo` or `useCallback` to memoize:
   
     ```tsx
      const memoizedObj = useMemo(() => ({ x: 1 }), []);
     ```

5. Add `why-did-you-render` Library
   
    Helps highlight unnecessary renders during development
      Setup:
  
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
     Instead:

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
## 9. What are the key differences between SSR and CSR in React ?

The Core Difference

It all comes down to where your React app’s HTML is generated:

| Feature                   | **SSR (Server-Side Rendering)**                         | **CSR (Client-Side Rendering)**                           |
| ------------------------- | ------------------------------------------------------- | --------------------------------------------------------- |
| **HTML generation**       | Happens **on the server** before sending to the browser | Happens **in the browser** after downloading JavaScript   |
| **First content load**    | HTML is ready immediately → faster first paint          | Browser sees almost empty HTML → waits for JS to build UI |
| **SEO**                   | Better for SEO — search engines see full HTML           | Worse for SEO if not handled, as bots may see blank HTML  |
| **Initial load speed**    | Usually faster for content-heavy pages                  | Slower initially (due to JS download & render)            |
| **Subsequent navigation** | May require full or partial server trips                | Instant after initial load (SPA behavior)                 |

How They Work

**CSR Flow (Client-Side Rendering)**

- Browser requests the page → gets a bare HTML file with a `<div id="root"></div>`.

- React JS bundle downloads.

- React runs in the browser and builds the UI inside `<div id="root">`.

- User sees content after JS finishes execution.

Example:

A typical Create React App setup.

**SSR Flow (Server-Side Rendering)**

Browser requests the page → server runs React code and returns full HTML.

User sees content immediately (before JS).

JS bundle downloads → React hydrates the HTML to make it interactive.

Subsequent navigation may behave like a SPA (if using frameworks like Next.js).

Example:

Next.js `getServerSideProps` or frameworks like Remix.

**Pros & Cons**

Client-Side Rendering

✅ Pros:

- Great for dynamic, interactive applications.

- Reduced server load (server mostly just sends static files).

- Fast navigation after first load (SPA experience).

❌ Cons:

- Slower first content paint (bad for low-bandwidth devices).

- Poor SEO unless pre-rendering or SSR is added.

- Users may see a "blank screen" until JS loads.

Server-Side Rendering

✅ Pros:

- Faster first paint (HTML is ready on arrival).

- Great for SEO (HTML has content for crawlers).

-Better for slow devices (less JS to execute initially).

❌ Cons:

- More server load (server generates HTML for every request).

- Complex to set up compared to CSR.

- Navigation between pages might not be as fast without client-side routing.

**When to Use Which?**

| Use SSR When…                                           | Use CSR When…                                            |
| ------------------------------------------------------- | -------------------------------------------------------- |
| SEO is critical (blogs, e-commerce, news sites).        | SEO isn’t critical (internal dashboards, tools).         |
| Users should see content instantly.                     | App is highly interactive and user-driven.               |
| Content is static or semi-static but needs to be fresh. | You want a pure SPA experience with minimal server work. |

Visual Diagram:

```js
--- SSR ---
Browser → Server → [HTML + minimal JS] → Show content → Hydrate → Interactive

--- CSR ---
Browser → Server → [Empty HTML + JS] → Load JS → Render in browser → Interactive
```

## 10. What is cookies and how to implement in reactjs?

1. Cookies

- A cookie is a small piece of data stored in the browser, sent by the server.

- Typically used to store:

  - Session ID (reference to a logged-in user session on the server)

  - Small preferences (language, theme, etc.)

- Cookies can be:

  - HTTP-only: not accessible from JS (more secure, used for authentication).

  - Secure: sent only over HTTPS.

  - SameSite: restricts cross-site requests to prevent CSRF.

👉 Example: After login, backend sets:

```bash

Set-Cookie: sessionId=abcd1234; HttpOnly; Secure; SameSite=Strict

```
2. Session

- A session is a server-side storage mechanism that stores user-specific data.

- Session data is linked to a cookie (usually a `sessionId`).

- Instead of storing sensitive data in the browser, only the session ID is stored in a cookie, and the server holds all actual data (like user ID, roles, cart, etc.).

👉 Flow:

- User logs in → server validates → creates a session in DB/Memory/Redis.

- Server sets cookie (`sessionId=xyz`) in browser.

- On every request, browser automatically sends the cookie.

- Server reads the session ID → fetches data → identifies the user.

3. Implementing in React

Case 1: Using Cookie-based Auth (HTTP-only secure cookie)

Here React doesn’t touch the cookie directly, the browser sends it automatically.

Login Request (React code):

```tsx
// pages/Login.tsx
import React, { useState } from "react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    const res = await fetch("https://api.mybank.com/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include", // <-- Important: include cookies
      body: JSON.stringify({ email, password }),
    });

    if (res.ok) {
      alert("Login successful!");
    } else {
      alert("Invalid credentials");
    }
  };

  return (
    <div>
      <input value={email} onChange={e => setEmail(e.target.value)} />
      <input type="password" value={password} onChange={e => setPassword(e.target.value)} />
      <button onClick={handleLogin}>Login</button>
    </div>
  );
};

export default Login;
```
Here:

- `credentials: "include"` → tells React fetch to include cookies.

- Backend sets `Set-Cookie` header with `HttpOnly; Secure; SameSite=Strict`.

- Browser stores it and automatically attaches it on every request.

Fetching user data after login:

```tsx
const getProfile = async () => {
  const res = await fetch("https://api.mybank.com/profile", {
    method: "GET",
    credentials: "include",
  });
  const data = await res.json();
  console.log(data);
};
```
Case 2: Using Session-like Token (JWT in Cookie or LocalStorage)

Some apps store a JWT (JSON Web Token) instead of server sessions.

- Backend returns `accessToken` after login.

- React stores it either in:

  - HttpOnly cookie (recommended) → browser auto-sends it.

  - `localStorage` or `sessionStorage` (less secure, but easier).

Example (JWT in localStorage):

```tsx
localStorage.setItem("token", token);

// later in requests
fetch("/api/data", {
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`
  }
});
```
4. Which is better?

- For fintech, banking, or secure apps → Use HttpOnly secure cookies + server sessions.
(Frontend can’t read the cookie, attacker scripts can’t steal it → prevents XSS token theft).

- For general apps → JWT in localStorage is common, but needs extra protection against XSS.

Summary:

- Cookies = client-side storage (small, auto-sent by browser).

- Sessions = server-side storage of user data, identified via cookies.

- React implementation = Usually just `fetch` with `credentials: "include"`, backend manages sessions with cookies.

⚡ So how does backend know it’s you?

Because the cookie value (session ID / JWT) is like a "ticket".

- When you first logged in with credentials (email+password), backend issued the ticket (cookie).

- After that, you don’t need to send email/password each time. The browser just replays the ticket.

- Backend validates the ticket against its session store or JWT signature.

👉 Think of it like this analogy:

- At the gate (login), you show ID proof (username/password).

- Security gives you a visitor badge (session cookie).

- Every time you re-enter, you just flash the badge (cookie).

- Security already knows who you are by looking up the badge number (session lookup).

Example request/response flow

Login request (with email/password):

```js
POST /login
Content-Type: application/json

{ "email": "amber@test.com", "password": "12345" }
```
Login response (server sets cookie):

```js
HTTP/1.1 200 OK
Set-Cookie: sessionId=xyz987; HttpOnly; Secure; SameSite=Strict
```
Next request from React with `credentials: "include"`:

```js
GET /profile
Cookie: sessionId=xyz987
```
Backend logic (pseudo-code):

```js
app.get("/profile", (req, res) => {
  const sessionId = req.cookies.sessionId;
  const session = db.sessions.find(s => s.id === sessionId);

  if (!session) return res.status(401).json({ error: "Unauthorized" });

  const user = db.users.find(u => u.id === session.userId);
  res.json({ email: user.email, name: user.name });
});
```
Answer in short:

`credentials: "include"` ensures the browser sends cookies with the request. Those cookies contain a session ID (or token) that the backend previously issued at login. The backend uses that session ID to look up the actual user.

```bash
┌─────────────┐          1. Login Request
│   Browser   │  -------------------------------->   ┌─────────────┐
│ (React App) │  { email, password }                 │   Backend   │
└──────┬──────┘                                      └──────┬──────┘
       │                                                    │
       │        2. Backend validates user & issues          │
       │        a session cookie                            │
       │ <-----------------------------------------------   │
       │  Set-Cookie: sessionId=XYZ123; HttpOnly; Secure    │
       │                                                    │
       ▼                                                    ▼

┌─────────────┐          3. Later Request
│   Browser   │  -------------------------------->   ┌─────────────┐
│ (React App) │   (with credentials: "include")      │   Backend   │
│             │   Cookie: sessionId=XYZ123           │             │
└──────┬──────┘                                      └──────┬──────┘
       │                                                    │
       │  4. Backend looks up sessionId in DB/Redis         │
       │  If valid → fetch user info                        │
       │                                                    │
       │ <--------------------------------------------------│
       │        5. Response: { name: "Amber", balance: 500 }   
       │
       ▼
┌─────────────┐
│   Browser   │
│ (React App) │  Shows user dashboard
└─────────────┘
```

 
## 11. What is the current version of react and what is the latest changes?





## Topics Covered: 

- Virtual Dom 
- functional components vs class components
- components lifecycle in reactjs
- JSX working
- Hooks - `useState` `useEffect`
- [`useMemo` and `useCallback`](https://github.com/InsideAmber/React-Interview-Preparation/tree/master/src/components)
- [`useRef`](https://github.com/InsideAmber/React-Interview-Preparation/blob/master/src/components/FocusInputWithUseref.tsx)
- prop drilling vs lifting state up
- context API vs Redux vs Zustand
    - [Redux](https://github.com/InsideAmber/React-Interview-Preparation/blob/master/src/features/users/pages/UsersPage.tsx)
    - [Zustand](https://github.com/InsideAmber/React-Interview-Preparation/blob/master/src/features/users/pages/UsersPageZustand.tsx)
- [Performance Optimization (Lazy loading, code splitting, memoization)](https://github.com/InsideAmber/React-Interview-Preparation/blob/master/src/routes/AppRoutes.tsx)
- [React.memo and Pure components](https://github.com/InsideAmber/React-Interview-Preparation/blob/master/src/components/PureComponent/ChildCounter.tsx)
- How would you debug unnecessary re-renders?
- [Routing and Nested Routes](https://github.com/InsideAmber/React-Interview-Preparation/tree/master/src/features/users/pages/NestedRoutesExample)
- [Error Boundaries](https://github.com/InsideAmber/React-Interview-Preparation/blob/master/src/components/ErrorBoundary/ErrorBoundary.tsx)
- [Custom hook implementation (`useDebounce`, `useLocalStorage`, `useOutsideClick`, `useCopyToClipboard`, `useToggle`)](https://github.com/InsideAmber/React-Interview-Preparation/tree/master/src/hooks)
- [Todo with `useReducer`](https://github.com/InsideAmber/React-Interview-Preparation/blob/master/src/components/todo/TodoPage.tsx)







