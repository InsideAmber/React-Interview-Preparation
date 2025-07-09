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





