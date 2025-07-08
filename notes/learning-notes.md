# 1. What is the Virtual DOM and how does React use it?
- The Virtual DOM (VDOM) is a lightweight in-memory representation of the real DOM.
- React uses the VDOM to improve performance. When your app changes state:
- React creates a new Virtual DOM.
- It compares the new Virtual DOM with the previous one (diffing).
- Then, React applies only the minimal updates to the real DOM (aka reconciliation).
  # Why it’s important:
    - Real DOM manipulations are slow.
    - VDOM makes UI updates efficient and fast.

