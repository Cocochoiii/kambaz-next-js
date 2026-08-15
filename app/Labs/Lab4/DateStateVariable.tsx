"use client";

// Date state variables.
// An <input type="date"> only reads the text YYYY-MM-DD, so I turn the Date
// into that text. Next.js draws this twice, so the two clocks can differ.
import { useState } from "react";
import { Form } from "react-bootstrap";

const dateObjectToHtmlDateString = (date: Date) => {
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return `${date.getFullYear()}-${month < 10 ? "0" : ""}${month}-${day < 10 ? "0" : ""}${day}`;
};

export default function DateStateVariable() {
  const [startDate, setStartDate] = useState(new Date());

  return (
    <div id="wd-date-state-variables">
      <h2>Date State Variables</h2>
      <h3 suppressHydrationWarning>{JSON.stringify(startDate)}</h3>
      <h3 suppressHydrationWarning>{dateObjectToHtmlDateString(startDate)}</h3>
      <Form.Control
        id="wd-start-date"
        type="date"
        suppressHydrationWarning
        value={dateObjectToHtmlDateString(startDate)}
        onChange={(e) => setStartDate(new Date(e.target.value))}
      />
      <hr />
    </div>
  );
}
