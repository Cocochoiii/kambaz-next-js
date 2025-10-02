"use client";
import { useEffect, useState } from "react";
import * as client from "./client";

export default function WorkingWithObjectsAsynchronously() {
    const [assignment, setAssignment] = useState<any>({});

    const load = async () => {
        const a = await client.fetchAssignment();
        setAssignment(a);
    };
    const updateTitle = async (title: string) => {
        const updated = await client.updateTitle(title);
        setAssignment(updated);
    };

    useEffect(() => { load(); }, []);

    return (
        <div id="wd-asynchronous-objects">
            <h3>Working with Objects Asynchronously</h3>
            <h4>Assignment</h4>
            <input className="form-control mb-2"
                   value={assignment.title || ""} onChange={(e) => setAssignment({ ...assignment, title: e.target.value })} />
            <textarea className="form-control mb-2"
                      value={assignment.description || ""}
                      onChange={(e) => setAssignment({ ...assignment, description: e.target.value })}/>
            <input className="form-control mb-2" type="date"
                   value={assignment.due || ""}
                   onChange={(e) => setAssignment({ ...assignment, due: e.target.value })}/>
            <div className="form-check form-switch">
                <input className="form-check-input" type="checkbox" id="wd-completed"
                       checked={!!assignment.completed}
                       onChange={(e) => setAssignment({ ...assignment, completed: e.target.checked })}/>
                <label className="form-check-label" htmlFor="wd-completed">Completed</label>
            </div>
            <button className="btn btn-primary me-2" onClick={() => updateTitle(assignment.title)}>Update Title</button>
            <pre>{JSON.stringify(assignment, null, 2)}</pre>
            <hr />
        </div>
    );
}
