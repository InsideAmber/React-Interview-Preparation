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