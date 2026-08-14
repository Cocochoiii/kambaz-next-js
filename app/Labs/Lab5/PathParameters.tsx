"use client";

// The two numbers go in the path, like /lab5/add/34/23.
import { useState } from "react";
import { FormControl } from "react-bootstrap";
import { HTTP_SERVER } from "@/app/env";

export default function PathParameters() {
  const [a, setA] = useState("34");
  const [b, setB] = useState("23");

  return (
    <div id="wd-path-parameters">
      <h3>Path Parameters</h3>

      <FormControl
        id="wd-path-parameter-a"
        className="mb-2"
        type="number"
        defaultValue={a}
        onChange={(e) => setA(e.target.value)}
      />
      <FormControl
        id="wd-path-parameter-b"
        className="mb-2"
        type="number"
        defaultValue={b}
        onChange={(e) => setB(e.target.value)}
      />

      <a
        id="wd-path-parameter-add"
        className="btn btn-primary me-2"
        href={`${HTTP_SERVER}/lab5/add/${a}/${b}`}
      >
        Add {a} + {b}
      </a>
      <a
        id="wd-path-parameter-subtract"
        className="btn btn-danger me-2"
        href={`${HTTP_SERVER}/lab5/subtract/${a}/${b}`}
      >
        Subtract {a} - {b}
      </a>
      <a
        id="wd-path-parameter-multiply"
        className="btn btn-success me-2"
        href={`${HTTP_SERVER}/lab5/multiply/${a}/${b}`}
      >
        Multiply {a} * {b}
      </a>
      <a
        id="wd-path-parameter-divide"
        className="btn btn-warning"
        href={`${HTTP_SERVER}/lab5/divide/${a}/${b}`}
      >
        Divide {a} / {b}
      </a>
      <hr />
    </div>
  );
}
