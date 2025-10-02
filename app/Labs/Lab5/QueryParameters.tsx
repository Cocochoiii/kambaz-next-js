"use client";
import { useState } from "react";
import { HTTP_SERVER } from "@/app/env";
const USERS_API = `${HTTP_SERVER}/api/users`;

export default function QueryParameters() {
    const [a, setA] = useState("34");
    const [b, setB] = useState("23");
    return (
        <div id="wd-query-parameters">
            <h3>Query Parameters</h3>
            <input id="wd-query-parameter-a" className="form-control mb-2" defaultValue={a} type="number"
                   onChange={(e) => setA(e.target.value)} />
            <input id="wd-query-parameter-b" className="form-control mb-2" defaultValue={b} type="number"
                   onChange={(e) => setB(e.target.value)} />
            <a id="wd-query-parameter-add"
               className="btn btn-primary me-2"
               href={`${HTTP_SERVER}/lab5/calculator?operation=add&a=${a}&b=${b}`}>
                Add {a} + {b}
            </a>
            <a id="wd-query-parameter-subtract"
               className="btn btn-danger me-2"
               href={`${HTTP_SERVER}/lab5/calculator?operation=subtract&a=${a}&b=${b}`}>
                Subtract {a} - {b}
            </a>
            <a className="btn btn-secondary me-2"
               href={`${HTTP_SERVER}/lab5/calculator?operation=multiply&a=${a}&b=${b}`}>
                Multiply
            </a>
            <a className="btn btn-warning"
               href={`${HTTP_SERVER}/lab5/calculator?operation=divide&a=${a}&b=${b}`}>
                Divide
            </a>
            <hr />
        </div>
    );
}
