"use client";

// String state variables.
// Every letter I type goes into the state.
import { useState } from "react";
import { Form } from "react-bootstrap";

export default function StringStateVariables() {
  const [firstName, setFirstName] = useState("John");

  return (
    <div id="wd-string-state-variables">
      <h2>String State Variables</h2>
      <p>{firstName}</p>
      <Form.Control
        id="wd-first-name"
        defaultValue={firstName}
        onChange={(e) => setFirstName(e.target.value)}
      />
      <hr />
    </div>
  );
}
