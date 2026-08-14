"use client";

// Sharing state between components - the child.
// The child has no state. The parent sends the value and the setter.
export default function ChildStateComponent(
  { counter, setCounter }: { counter: number; setCounter: (counter: number) => void }
) {
  return (
    <div id="wd-child-state">
      <h3>Counter {counter}</h3>
      <button
        onClick={() => setCounter(counter + 1)}
        id="wd-increment-child-state-click"
        className="btn btn-primary me-2"
      >
        Increment
      </button>
      <button
        onClick={() => setCounter(counter - 1)}
        id="wd-decrement-child-state-click"
        className="btn btn-primary"
      >
        Decrement
      </button>
      <hr />
    </div>
  );
}
