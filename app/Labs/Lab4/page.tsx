// Lab 4. All the exercises of Chapter 4, in the order of the book:
// events, component state, shared state, and then Redux.
import ClickEvent from "./ClickEvent";
import PassingDataOnEvent from "./PassingDataOnEvent";
import PassingFunctions from "./PassingFunctions";
import EventObject from "./EventObject";
import Counter from "./Counter";
import BooleanStateVariables from "./BooleanStateVariables";
import StringStateVariables from "./StringStateVariables";
import DateStateVariable from "./DateStateVariable";
import ObjectStateVariable from "./ObjectStateVariable";
import ArrayStateVariable from "./ArrayStateVariable";
import ParentStateComponent from "./ParentStateComponent";
import ReduxExamples from "./ReduxExamples";
import SayHelloButton from "./SayHelloButton";

export default function Lab4() {
  return (
    <div id="wd-lab4" className="container">
      <h2>Lab 4 - State and Redux</h2>

      {/* 4.1 Event handling */}
      <ClickEvent />
      <PassingDataOnEvent />
      <SayHelloButton />
      <EventObject />

      {/* 4.2 Component state */}
      <Counter />
      <BooleanStateVariables />
      <StringStateVariables />
      <DateStateVariable />
      <ObjectStateVariable />
      <ArrayStateVariable />

      {/* 4.3 Sharing state between components */}
      <ParentStateComponent />

      {/* 4.4 - 4.8 Application state with Redux */}
      <ReduxExamples />
    </div>
  );
}
