"use client";

// 4.3 Sharing state between components - the parent.
// The state lives here, so both titles show the same number.
import { useState } from "react";
import ChildStateComponent from "./ChildStateComponent";

export default function ParentStateComponent() {
  const [counter, setCounter] = useState(123);

  return (
    <div id="wd-parent-state">
      <h2>Parent State Component</h2>
      <h3>Counter {counter}</h3>
      <ChildStateComponent counter={counter} setCounter={setCounter} />
      <hr />
    </div>
  );
}
