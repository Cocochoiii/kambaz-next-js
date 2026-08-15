"use client";

// Now the numbers go after the question mark.
// One route does all four operations.
import { useState } from "react";
import { FormControl } from "react-bootstrap";
import { HTTP_SERVER } from "@/app/env";

export default function QueryParameters() {
  const [a, setA] = useState("34");
  const [b, setB] = useState("23");
  const CALCULATOR_API = `${HTTP_SERVER}/lab5/calculator`;

  return (
    <div id="wd-query-parameters">
      <h3>Query Parameters</h3>

      <FormControl
        id="wd-query-parameter-a"
        className="mb-2"
        type="number"
        defaultValue={a}
        onChange={(e) => setA(e.target.value)}
      />
      <FormControl
        id="wd-query-parameter-b"
        className="mb-2"
        type="number"
        defaultValue={b}
        onChange={(e) => setB(e.target.value)}
      />

      <a
        id="wd-query-parameter-add"
        className="btn btn-primary me-2"
        href={`${CALCULATOR_API}?operation=add&a=${a}&b=${b}`}
      >
        Add {a} + {b}
      </a>
      <a
        id="wd-query-parameter-subtract"
        className="btn btn-danger me-2"
        href={`${CALCULATOR_API}?operation=subtract&a=${a}&b=${b}`}
      >
        Subtract {a} - {b}
      </a>
      <a
        id="wd-query-parameter-multiply"
        className="btn btn-success me-2"
        href={`${CALCULATOR_API}?operation=multiply&a=${a}&b=${b}`}
      >
        Multiply {a} * {b}
      </a>
      <a
        id="wd-query-parameter-divide"
        className="btn btn-warning"
        href={`${CALCULATOR_API}?operation=divide&a=${a}&b=${b}`}
      >
        Divide {a} / {b}
      </a>
      <hr />
    </div>
  );
}
