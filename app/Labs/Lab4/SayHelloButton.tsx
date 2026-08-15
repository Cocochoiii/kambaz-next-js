"use client";

// The parent side of passing a function.
// A server file cannot send a function, so sayHello lives here.
import PassingFunctions from "./PassingFunctions";

export default function SayHelloButton() {
  function sayHello() {
    alert("Hello");
  }

  return <PassingFunctions theFunction={sayHello} />;
}
