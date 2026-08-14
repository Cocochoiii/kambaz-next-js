"use client";

// Array state variables.
// Add spreads the old array. Delete filters out one position.
// I never use push or splice, because those change the old array.
import { useState } from "react";

export default function ArrayStateVariable() {
  const [array, setArray] = useState([1, 2, 3, 4, 5]);

  const addElement = () => {
    setArray([...array, Math.floor(Math.random() * 100)]);
  };

  const deleteElement = (index: number) => {
    setArray(array.filter((item, i) => i !== index));
  };

  return (
    <div id="wd-array-state-variables">
      <h2>Array State Variable</h2>
      <button onClick={addElement} id="wd-add-element-click" className="btn btn-success">
        Add Element
      </button>
      <ul>
        {array.map((item, index) => (
          <li key={index}>
            {item}
            <button
              onClick={() => deleteElement(index)}
              className="btn btn-danger btn-sm ms-2"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
      <hr />
    </div>
  );
}
