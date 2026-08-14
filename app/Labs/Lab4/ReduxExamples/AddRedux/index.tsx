"use client";

// Add Redux. This screen uses both kinds of state:
// a and b are local state, and the sum is store state.
import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Button, Form } from "react-bootstrap";
import { add } from "./addReducer";

export default function AddRedux() {
  // parseInt gives NaN on an empty field, so I fall back to 0.
  const [a, setA] = useState(12);
  const [b, setB] = useState(23);
  const { sum } = useSelector((state: any) => state.addReducer);
  const dispatch = useDispatch();

  return (
    <div className="w-25" id="wd-add-redux">
      <h2>Add Redux</h2>
      <h3>{a} + {b} = {sum}</h3>
      <Form.Control
        id="wd-add-redux-a"
        className="mb-2"
        type="number"
        value={a}
        onChange={(e) => setA(parseInt(e.target.value) || 0)}
      />
      <Form.Control
        id="wd-add-redux-b"
        className="mb-2"
        type="number"
        value={b}
        onChange={(e) => setB(parseInt(e.target.value) || 0)}
      />
      <Button id="wd-add-redux-click" onClick={() => dispatch(add({ a, b }))}>
        Add Redux
      </Button>
      <hr />
    </div>
  );
}
