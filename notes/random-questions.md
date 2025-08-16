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

