"use client";

// Object state variables.
// I never change the old object. I spread it and override one field.
import { useState } from "react";
import { Form } from "react-bootstrap";

export default function ObjectStateVariable() {
  const [person, setPerson] = useState({ name: "Peter", age: 24 });

  return (
    <div id="wd-object-state-variables">
      <h2>Object State Variables</h2>
      <pre>{JSON.stringify(person, null, 2)}</pre>
      <Form.Control
        id="wd-person-name"
        className="mb-2"
        defaultValue={person.name}
        onChange={(e) => setPerson({ ...person, name: e.target.value })}
      />
      <Form.Control
        id="wd-person-age"
        type="number"
        defaultValue={person.age}
        onChange={(e) => setPerson({ ...person, age: parseInt(e.target.value) })}
      />
      <hr />
    </div>
  );
}
