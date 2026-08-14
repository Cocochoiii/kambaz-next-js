"use client";

// 4.1 Handling click events with onClick.
// I can pass the function itself, or wrap it in a closure to send data
// or to call two functions.

const hello = () => {
  alert("Hello World!");
};

const lifeIs = (good: string) => {
  alert(`Life is ${good}`);
};

export default function ClickEvent() {
  return (
    <div id="wd-click-event">
      <h2>Click Event</h2>
      <button onClick={hello} id="wd-hello-world-click" className="btn btn-primary me-2">
        Hello World!
      </button>
      <button onClick={() => lifeIs("Good!")} id="wd-life-is-good-click" className="btn btn-primary me-2">
        Life is Good!
      </button>
      <button
        onClick={() => {
          hello();
          lifeIs("Great!");
        }}
        id="wd-life-is-great-click"
        className="btn btn-primary"
      >
        Life is Great!
      </button>
      <hr />
    </div>
  );
}
