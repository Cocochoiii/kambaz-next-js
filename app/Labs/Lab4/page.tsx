// Lab 4. The exercises of Chapter 4, in the order of the book.
import ClickEvent from "./ClickEvent";
import PassingDataOnEvent from "./PassingDataOnEvent";
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

      {/* Event handling */}
      <ClickEvent />
      <PassingDataOnEvent />
      <SayHelloButton />
      <EventObject />

      {/* Component state */}
      <Counter />
      <BooleanStateVariables />
      <StringStateVariables />
      <DateStateVariable />
      <ObjectStateVariable />
      <ArrayStateVariable />

      {/* Sharing state between components */}
      <ParentStateComponent />

      {/* Application state with Redux */}
      <ReduxExamples />
    </div>
  );
}
