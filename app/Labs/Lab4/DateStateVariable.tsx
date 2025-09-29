// app/Labs/Lab4/DateStateVariable.tsx
"use client";

import { useEffect, useState } from "react";
import { Form } from "react-bootstrap";

function toHtmlDate(d: Date) {
    // YYYY-MM-DD for <input type="date">
    return d.toISOString().slice(0, 10);
}

export default function DateStateVariable() {
    const [startDate, setStartDate] = useState<Date | null>(null);

    // Set the date only on the client to avoid SSR/CSR mismatch
    useEffect(() => {
        setStartDate(new Date());
    }, []);

    return (
        <div id="wd-date-state-variables">
            <h2>Date State Variables</h2>

            {startDate && (
                <>
                    {/* suppressHydrationWarning is a belt-and-suspenders in case the string differs slightly */}
                    <h3 suppressHydrationWarning>{JSON.stringify(startDate)}</h3>
                    <h3 suppressHydrationWarning>{toHtmlDate(startDate)}</h3>
                </>
            )}

            <Form.Control
                type="date"
                value={startDate ? toHtmlDate(startDate) : ""}
                onChange={(e) => setStartDate(new Date(e.target.value))}
            />
            <hr />
        </div>
    );
}
