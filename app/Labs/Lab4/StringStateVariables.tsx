// app/Labs/Lab4/StringStateVariables.tsx
"use client";

import { useState } from "react";
import { Form } from "react-bootstrap";

export default function StringStateVariables() {
    const [firstName, setFirstName] = useState("John");

    return (
        <div>
            <h2>String State Variables</h2>
            <p>{firstName}</p>
            <Form.Control
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
            />
            <hr />
        </div>
    );
}