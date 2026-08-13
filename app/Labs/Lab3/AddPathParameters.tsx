"use client";

// The URL /Labs/Lab3/add/1/2 keeps the two numbers in the path.
// The folders [a] and [b] name them, and useParams reads them back.
// I need "use client" because useParams runs in the browser.
import { useParams } from "next/navigation";

export default function AddPathParameters() {
  const params = useParams<{ a: string; b: string }>();
  // The parameters arrive as strings, so I turn them into numbers to add them.
  const a = params ? params.a : "0";
  const b = params ? params.b : "0";

  return (
    <div id="wd-add-path-parameters">
      <h4>Add Path Parameters</h4>
      {a} + {b} = {parseInt(a) + parseInt(b)}
    </div>
  );
}
