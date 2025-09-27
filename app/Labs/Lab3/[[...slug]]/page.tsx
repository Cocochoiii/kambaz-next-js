'use client';
import { useEffect } from "react";
import Link from "next/link";
import Add from "../Add";
import Square from "../Square";
import Highlight from "../Highlight";
import WorkingWithLocation from "../WorkingWithLocation";
import AddPathParameters from "../AddPathParameters";

// Sections
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

type PageProps = { params: { slug?: string[] } };

export default function Lab3Page({ params }: PageProps) {
  useEffect(() => { console.log("Hello World!"); }, []);

  const parts = params.slug || [];
  const isAdd = parts[0] === "add" && parts.length === 3;

  return (
    <div id="wd-lab3" className="container py-3">
      <h3>Lab 3</h3>
      <WorkingWithLocation />

      {isAdd && <AddPathParameters a={parts[1]} b={parts[2]} />}

      {/* Core sections */}
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

      <Add a={3} b={4} />
      <h4>Square of 4</h4>
      <Square>4</Square>
      <hr />
      <Highlight>Lorem ipsum dolor sit amet consectetur adipisicing elit. Suscipit ratione eaque illo minus cum.
      </Highlight>
      <div className="my-3">
        <Link href="/Labs">Back to Labs</Link>
      </div>
    </div>
  );
}
