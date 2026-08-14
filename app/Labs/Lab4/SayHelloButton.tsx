"use client";

// 4.1.2 The parent side of passing a function.
// The Lab 4 page is a server file, and a server file cannot send a
// function to a client file, so sayHello lives here.
import PassingFunctions from "./PassingFunctions";

export default function SayHelloButton() {
  function sayHello() {
    alert("Hello");
  }

  return <PassingFunctions theFunction={sayHello} />;
}
