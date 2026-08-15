"use client";

// The form fills itself from the server.
// The button sends the new title back.
import { useEffect, useState } from "react";
import { Button, FormControl, FormSelect } from "react-bootstrap";
import * as client from "./client";

export default function WorkingWithObjectsAsynchronously() {
  const [assignment, setAssignment] = useState<any>({ title: "" });

  const fetchAssignment = async () => {
    const fetched = await client.fetchAssignment();
    setAssignment(fetched);
  };

  const updateTitle = async () => {
    const updated = await client.updateTitle(assignment.title);
    setAssignment(updated);
  };

  useEffect(() => {
    fetchAssignment();
  }, []);

  return (
    <div id="wd-asynchronous-objects">
      <h3>Working with Objects Asynchronously</h3>

      <h4>Modifying Properties</h4>
      <FormControl
        id="wd-async-assignment-title"
        className="mb-2"
        value={assignment.title || ""}
        onChange={(e) => setAssignment({ ...assignment, title: e.target.value })}
      />
      <FormControl
        as="textarea"
        id="wd-async-assignment-description"
        className="mb-2"
        rows={3}
        value={assignment.description || ""}
        onChange={(e) =>
          setAssignment({ ...assignment, description: e.target.value })
        }
      />
      <FormControl
        type="date"
        id="wd-async-assignment-due"
        className="mb-2"
        value={assignment.due || ""}
        onChange={(e) => setAssignment({ ...assignment, due: e.target.value })}
      />
      <FormSelect
        id="wd-async-assignment-completed"
        className="mb-2"
        value={String(assignment.completed ?? false)}
        onChange={(e) =>
          setAssignment({ ...assignment, completed: e.target.value === "true" })
        }
      >
        <option value="true">Completed</option>
        <option value="false">Not completed</option>
      </FormSelect>

      <Button
        id="wd-update-async-assignment-title"
        className="btn btn-primary mb-2"
        onClick={updateTitle}
      >
        Update Title
      </Button>

      {/* The raw answer of the server. */}
      <pre>{JSON.stringify(assignment, null, 2)}</pre>
      <hr />
    </div>
  );
}
