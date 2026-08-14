"use client";

// Lab 3. All the exercises from Chapter 3, in the order of the book.
// This is a layout, not a page, because Path Parameters needs a nested
// screen. That screen arrives as children.
import type { ReactNode } from "react";
import Link from "next/link";

import VariablesAndConstants from "./VariablesAndConstants";
import VariableTypes from "./VariableTypes";
import BooleanVariables from "./BooleanVariables";
import IfElse from "./IfElse";
import TernaryOperator from "./TernaryOperator";
import ConditionalOutputIfElse from "./ConditionalOutputIfElse";
import ConditionalOutputInline from "./ConditionalOutputInline";
import LegacyFunctions from "./LegacyFunctions";
import ArrowFunctions from "./ArrowFunctions";
import ImpliedReturn from "./ImpliedReturn";
import TemplateLiterals from "./TemplateLiterals";
import SimpleArrays from "./SimpleArrays";
import ArrayIndexAndLength from "./ArrayIndexAndLength";
import AddingAndRemovingToFromArrays from "./AddingAndRemovingToFromArrays";
import ForLoops from "./ForLoops";
import MapFunction from "./MapFunction";
import FindFunction from "./FindFunction";
import FindIndex from "./FindIndex";
import FilterFunction from "./FilterFunction";
import JsonStringify from "./JsonStringify";
import House from "./House";
import TodoList from "./todos/TodoList";
import Spreading from "./Spreading";
import Destructing from "./Destructing";
import FunctionDestructing from "./FunctionDestructing";
import DestructingImports from "./DestructingImports";
import Classes from "./Classes";
import Styles from "./Styles";
import Add from "./Add";
import Square from "./Square";
import Highlight from "./Highlight";
import PathParameters from "./PathParameters";
import TodosFromStore from "./TodosFromStore";

export default function Lab3Layout({ children }: Readonly<{ children: ReactNode }>) {
  // 3.7.1 asks me to write to the browser console.
  console.log("Hello World!");

  return (
    <div id="wd-lab3" className="container">
      <h2>Lab 3 - JavaScript Fundamentals</h2>

      {/* 3.2 Introduction to JavaScript */}
      <VariablesAndConstants />
      <VariableTypes />
      <BooleanVariables />
      <IfElse />
      <TernaryOperator />
      <ConditionalOutputIfElse />
      <ConditionalOutputInline />

      {/* 3.3 JavaScript functions */}
      <LegacyFunctions />
      <ArrowFunctions />
      <ImpliedReturn />
      <TemplateLiterals />

      {/* 3.4 JavaScript data structures */}
      <SimpleArrays />
      <ArrayIndexAndLength />
      <AddingAndRemovingToFromArrays />
      <ForLoops />
      <MapFunction />
      <FindFunction />
      <FindIndex />
      <FilterFunction />
      <JsonStringify />
      <House />
      <TodoList />
      <Spreading />
      <Destructing />
      <FunctionDestructing />
      <DestructingImports />

      {/* 3.5 Dynamic styling */}
      <Classes />
      <Styles />

      {/* 3.6 Parameterizing components */}
      <Add a={1} b={2} />
      <Add a={3} b={4} />

      {/* 3.6.1 Child components. The content goes inside the tag. */}
      <h4>Square of 4</h4>
      <Square>4</Square>
      <hr />
      <Highlight>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Suscipit
        ratione eaque illo minus cum, saepe totam vel nihil repellat nemo.
      </Highlight>
      <hr />

      {/* 3.6.3 Encoding path parameters */}
      <PathParameters>{children}</PathParameters>

      {/* 4.8 The same todos as Lab 4, read from the store */}
      <TodosFromStore />

      <div className="my-3">
        <Link href="/Labs">Back to Labs</Link>
      </div>
    </div>
  );
}
