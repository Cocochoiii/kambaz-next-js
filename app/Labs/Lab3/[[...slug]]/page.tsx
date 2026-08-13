"use client";

// Lab 3. All the JavaScript and React exercises from Chapter 3 are here.
// The folder is [[...slug]] so this one screen also answers the nested
// routes such as /Labs/Lab3/add/1/2. I read the extra parts of the path
// with useParams and pass them to the AddPathParameters component.
// I need "use client" because useParams, React Bootstrap, and the
// console.log below all run in the browser.
import Link from "next/link";
import { useParams } from "next/navigation";

import WorkingWithLocation from "../WorkingWithLocation";
import AddPathParameters from "../AddPathParameters";
import VariablesAndConstants from "../VariablesAndConstants";
import VariableTypes from "../VariableTypes";
import BooleanVariables from "../BooleanVariables";
import IfElse from "../IfElse";
import TernaryOperator from "../TernaryOperator";
import ConditionalOutputIfElse from "../ConditionalOutputIfElse";
import ConditionalOutputInline from "../ConditionalOutputInline";
import LegacyFunctions from "../LegacyFunctions";
import ArrowFunctions from "../ArrowFunctions";
import ImpliedReturn from "../ImpliedReturn";
import TemplateLiterals from "../TemplateLiterals";
import SimpleArrays from "../SimpleArrays";
import ArrayIndexAndLength from "../ArrayIndexAndLength";
import AddingAndRemovingToFromArrays from "../AddingAndRemovingToFromArrays";
import ForLoops from "../ForLoops";
import MapFunction from "../MapFunction";
import FindFunction from "../FindFunction";
import FindIndex from "../FindIndex";
import FilterFunction from "../FilterFunction";
import JsonStringify from "../JsonStringify";
import House from "../House";
import TodoList from "../todos/TodoList";
import Spreading from "../Spreading";
import Destructing from "../Destructing";
import FunctionDestructing from "../FunctionDestructing";
import DestructingImports from "../DestructingImports";
import Classes from "../Classes";
import Styles from "../Styles";
import Add from "../Add";
import Square from "../Square";
import Highlight from "../Highlight";

export default function Lab3() {
  // Chapter 3.7.1 asks me to write to the browser console.
  console.log("Hello World!");

  // For /Labs/Lab3/add/1/2 the slug is ["add", "1", "2"].
  const params = useParams();
  const slug = params?.slug;
  const parts = Array.isArray(slug) ? slug : [];
  const isAdd = parts[0] === "add" && parts.length === 3;

  return (
    <div id="wd-lab3" className="container py-3">
      <h2>Lab 3 - JavaScript Fundamentals</h2>

      {/* Working with location and the path parameter links */}
      <WorkingWithLocation />
      {isAdd && <AddPathParameters a={parts[1]} b={parts[2]} />}

      <VariablesAndConstants />
      <VariableTypes />
      <BooleanVariables />
      <IfElse />
      <TernaryOperator />
      <ConditionalOutputIfElse />
      <ConditionalOutputInline />
      <LegacyFunctions />
      <ArrowFunctions />
      <ImpliedReturn />
      <TemplateLiterals />
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
      <Classes />
      <Styles />

      {/* Parameterizing components with attributes */}
      <Add a={1} b={2} />
      <Add a={3} b={4} />

      {/* Child components: the content goes in the body of the tag */}
      <h4>Square of 4</h4>
      <Square>4</Square>
      <hr />
      <Highlight>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Suscipit
        ratione eaque illo minus cum, saepe totam vel nihil repellat nemo.
      </Highlight>

      <div className="my-3">
        <Link href="/Labs">Back to Labs</Link>
      </div>
    </div>
  );
}
