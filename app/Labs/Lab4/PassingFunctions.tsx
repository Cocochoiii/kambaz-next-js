"use client";

// Passing functions as attributes.
// The parent sends a function in. This component only calls it.
export default function PassingFunctions(
  { theFunction }: { theFunction: () => void }
) {
  return (
    <div id="wd-passing-functions">
      <h2>Passing Functions</h2>
      <button onClick={theFunction} id="wd-invoke-function-click" className="btn btn-primary">
        Invoke the Function
      </button>
      <hr />
    </div>
  );
}
