"use client";

// The event object. React sends it to every handler.
// Two fields point back to the window and to React.
// I remove them first, or JSON.stringify loops forever.
import { useState } from "react";

export default function EventObject() {
  const [event, setEvent] = useState<any>(null);

  const handleClick = (e: any) => {
    e.target = e.target.outerHTML;
    delete e.view;
    delete e.nativeEvent;
    delete e._targetInst;
    setEvent(e);
  };

  return (
    <div id="wd-event-object">
      <h2>Event Object</h2>
      <button
        onClick={(e) => handleClick(e)}
        id="wd-display-event-obj-click"
        className="btn btn-primary"
      >
        Display Event Object
      </button>
      <pre>{JSON.stringify(event, null, 2)}</pre>
      <hr />
    </div>
  );
}
