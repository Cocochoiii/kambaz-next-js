"use client";

// 4.1.1 Passing data when handling events.
// I must wrap add() in a closure. If not, it runs too early.

const add = (a: number, b: number) => {
  alert(`${a} + ${b} = ${a + b}`);
};

export default function PassingDataOnEvent() {
  return (
    <div id="wd-passing-data-on-event">
      <h2>Passing Data on Event</h2>
      <button onClick={() => add(2, 3)} id="wd-pass-data-click" className="btn btn-primary">
        Pass 2 and 3 to add()
      </button>
      <hr />
    </div>
  );
}
