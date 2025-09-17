## 🏗️ Frontend System Design (React) — Real-time Collaboration

1. State Management Layer

- Use a centralized state store so all components stay in sync.
Options:

  - `Redux Toolkit`

  - `Zustand`

  - `React Context` (for smaller apps)

👉 Example: Store current document, user presence (cursors, typing), and connection status here.

2. Real-time Communication

- Use WebSockets (or WebRTC for peer-to-peer cases).

- Create a `ConnectionManager` to handle:

  - Connect / reconnect logic

  - Heartbeats (to detect disconnects)

  - Listening to server messages (document updates, presence changes)

Sending local changes (edits, cursor moves)

3. Collaboration State

- Incoming updates must not block React rendering.

- Run heavy logic in a Web Worker (background thread). Example:

  - Merging document changes

  - Conflict resolution (CRDT/OT — don’t worry about details now)

👉 React should only deal with final, ready-to-render state, not raw operations.

4. Rendering Strategy (for 60fps)

- Use React 18 features:

  - `useTransition` → keep typing/resizing smooth while syncing in background

  - `useDeferredValue` → delay less important updates

- Optimize UI:

  - `React.memo` to prevent unnecessary re-renders

  - Virtualized lists (`react-window`) if showing lots of cursors/comments

  - Canvas or SVG layer for live cursors instead of DOM elements (faster)

5. Presence & User Indicators

- Separate presence (cursor, typing) from main document updates.

- Update presence less frequently (e.g., every 200–500ms) to reduce load.

- Use a lightweight channel for presence state.

6. Offline & Recovery

- Keep last document state in IndexedDB (local database in browser).

- If user disconnects, let them edit offline → sync when back online.

- Optimistic UI → apply local edits immediately, sync with server later.

7. Error Handling UI

- Top-level ErrorBoundary → show fallback if real-time connection fails.

- Show status indicators:

  - Green dot = connected

  - Yellow = reconnecting

  - Red = offline

Example Frontend Flow (Simplified)

```bash
User types text
   │
   ▼
Update local store immediately (optimistic)
   │
   ├─► Render UI instantly (React state)
   │
   └─► Send update via WebSocket (async)
              │
   Receive updates from others ───► Merge in Worker ───► Update store ───► React re-render
```

Tech to Learn (Frontend Only)

- React 18 features (`useTransition`, `useDeferredValue`)

- State management (Zustand or Redux)

- WebSockets basics

- Web Workers (for background tasks)

- IndexedDB (for offline caching)

- Virtualization (`react-window` for lists, canvas for cursors)

👉 So, the frontend design is basically:

- Keep real-time updates in a store.

- Do heavy merge logic in a Worker.

- Keep React’s UI lean with memo, virtualization, and transitions.

- Show user-friendly connection & presence indicators.

## Security aspects to keep in mind for large React apps

1️⃣ Avoid Cross-Site Scripting (XSS)

What is it?
XSS happens when malicious scripts are injected into your app, often through user inputs.

How to prevent:

- Use React’s automatic escaping when rendering text. Example:

```tsx
<div>{userInput}</div>
```

React escapes it safely.

- Avoid using `dangerouslySetInnerHTML` unless absolutely necessary, and sanitize content before rendering.

- Validate and sanitize user inputs on both frontend and backend.

2️⃣ Authentication & Authorization

Authentication → Verifying the user’s identity
Authorization → Checking if the user has permission to perform an action

Best practices:

- Use secure authentication flows like OAuth, OpenID Connect, or JWT tokens.

- Store tokens securely:

  - Prefer httpOnly cookies to store tokens instead of localStorage or sessionStorage.

- Implement role-based access control (RBAC) to restrict views and actions based on user roles.

- Validate tokens on every request — never trust client-side validation alone.

3️⃣ Secure API Communication

Key principles:

- Use HTTPS for all communication between frontend and backend.

- Include proper authentication headers (like `Authorization: Bearer <token>`).

- Implement rate limiting and throttling on the backend to prevent brute-force attacks.

4️⃣ Prevent Cross-Site Request Forgery (CSRF)

What is it?
An attacker tricks a user into making unwanted requests (like deleting an account).

How to prevent:

- Use `SameSite` cookie attribute (`Lax` or `Strict`).

- Implement anti-CSRF tokens for state-changing requests.

5️⃣ Secure State Management

- Avoid storing sensitive data (passwords, API keys, etc.) in React state, localStorage, or exposed code.

- If needed, encrypt sensitive data before storing.

- Use environment variables and secure build processes (`.env` files, CI/CD pipelines).

6️⃣ Input Validation

- Validate form inputs on the frontend to improve user experience.

- Always validate and sanitize inputs on the backend for security enforcement.

7️⃣ Error Handling and Logging

- Avoid exposing stack traces or sensitive information in error messages.

- Log errors securely and monitor them for unusual activity.

- Use tools like Sentry, LogRocket, or your own monitoring service with proper access controls.

8️⃣ Third-Party Dependencies

- Audit npm packages regularly for vulnerabilities (use tools like `npm audit` or Snyk).

- Avoid unnecessary or outdated dependencies.

- Lock versions in `package.json` to avoid supply chain attacks.

9️⃣ Protect Against Clickjacking

What is it?
An attacker embeds your site in a hidden iframe and tricks users into interacting.

Prevention:

- Set the `X-Frame-Options: DENY` or `SAMEORIGIN` header on the backend.

🔟 Secure File Uploads

- Restrict file types and sizes.

- Scan uploads for malware.

- Use signed URLs if storing in cloud services like AWS S3.

1️⃣1️⃣ Content Security Policy (CSP)

- Implement CSP headers to restrict sources for scripts, styles, and media.

- Prevent inline scripts and unauthorized external resources.

1️⃣2️⃣ Protect Environment Variables

- Only expose safe variables at build time.

- Never embed secrets (API keys, DB credentials) into the frontend code.

**Extra considerations for large apps**

- Enforce strong password policies and multi-factor authentication (MFA)

- Implement session expiration and token revocation

- Use secure coding standards and code reviews

- Regularly perform penetration testing and vulnerability scanning

- Educate developers about security best practices and common pitfalls

**Summary – Security checklist for large React apps**

| Security Area         | What to do                                       |
| --------------------- | ------------------------------------------------ |
| XSS                   | Sanitize inputs, avoid `dangerouslySetInnerHTML` |
| Authentication        | Use OAuth/JWT, httpOnly cookies                  |
| Authorization         | Implement RBAC, enforce permissions              |
| API Communication     | Use HTTPS, secure headers, rate limiting         |
| CSRF                  | SameSite cookies, anti-CSRF tokens               |
| State Management      | Avoid storing sensitive data, encrypt if needed  |
| Input Validation      | Validate and sanitize inputs frontend & backend  |
| Error Handling        | Avoid leaking info, log securely                 |
| Dependencies          | Audit and lock versions                          |
| Clickjacking          | Use `X-Frame-Options` headers                    |
| File Uploads          | Restrict types, scan uploads                     |
| CSP                   | Use strict content policies                      |
| Environment Variables | Keep secrets out of the frontend                 |


## How do you sync state across components in real time

What is “syncing state across components in real time”?

- State sharing → Multiple components need access to the same data.

- Real-time updates → When one component changes the data, all others update immediately.

- Example use cases:

  - A chat app where messages appear instantly across users.

  - A dashboard where multiple widgets reflect the same underlying data.

  - A collaborative document editor like Google Docs.

Ways to sync state across components in React

1️⃣ Lifting State Up

- Pass state from a parent component to its children via props.

- Update state in the parent and pass the updated state down.

Good for:

- Simple apps with a few components.

2️⃣ React Context API

- Allows sharing state across any level of the component tree without prop drilling.

Good for:

- Medium complexity apps where state is needed by many components.

3️⃣ State Management Libraries (Redux, Zustand, Jotai, Recoil)

- Centralize state in a store or global object.

- Components subscribe to updates and re-render when state changes.

Good for:

- Large apps, complex data flows, or when you need predictability and debugging tools.

4️⃣ Custom Hooks

- Encapsulate state logic inside a reusable hook.

- Useful when multiple components need the same logic.

Good for:

- Sharing stateful behavior without exposing a store.

5️⃣ Real-time Backend Sync (WebSocket, Firebase, Supabase, etc.)

- Use services that push updates to all clients when data changes.

- Useful for multi-user collaboration or real-time apps.

Good for:

- Chat apps, collaborative editing, live notifications.

Choosing the right approach

| Scenario                            | Best solution               |
| ----------------------------------- | --------------------------- |
| Few components need shared state    | Lift state up               |
| Many components at different levels | Context API                 |
| Large, complex state management     | Redux/Zustand/Recoil        |
| Custom logic reuse                  | Custom hooks                |
| Multi-user real-time sync           | WebSocket/Firebase/Supabase |


## Legitimate ways to force re-renders

When does React re-render?

- State updates → `useState`, `useReducer`

- Props changes → Parent passes new props

- Context updates → Values provided by `useContext` change

- Key changes → Changing the `key` prop forces React to unmount and remount

legitimate methods:

| Method                     | Description                              | When to use                              |
| -------------------------- | ---------------------------------------- | ---------------------------------------- |
| `useState`                 | Update state to trigger re-render        | Simple state changes                     |
| `useReducer`               | Force render without meaningful state    | Cleaner updates or resets                |
| Change props/context       | Controlled re-render via parent/provider | Inter-component communication            |
| Change `key`               | Reset/remount component                  | When you need a fresh component instance |
| Combine `useRef` and state | Track changes and trigger render         | Advanced cases where state isn't needed  |
| External state libraries   | Shared global state                      | Complex apps needing subscriptions       |
| `root.render()`            | Manual render                            | Special cases or legacy systems          |
