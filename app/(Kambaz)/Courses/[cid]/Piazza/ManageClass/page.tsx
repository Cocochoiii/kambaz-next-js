"use client";

// The Manage Class Screen. Only an instructor may open it.
// The seven tabs are here, and Manage Folders is the one that works.
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { Button, Form } from "react-bootstrap";
import PazzaNav from "../PazzaNav";
import { isPazzaInstructor } from "../helpers";
import * as client from "../client";

// Six of these are not required, so I show them but keep them off.
const TABS = [
  "Manage Folders",
  "Manage Enrollment",
  "Class Settings",
  "Manage Sections",
  "Import and Export",
  "Course Number",
  "Delete Class",
];

export default function ManageClass() {
  const params = useParams<{ cid: string }>();
  const cid = params ? params.cid : "";
  const router = useRouter();

  const { currentUser, viewAsStudent } = useSelector((state: any) => state.accountReducer);
  const { courses } = useSelector((state: any) => state.coursesReducer);
  const isInstructor = isPazzaInstructor(currentUser, viewAsStudent);

  const course = courses.find((one: any) => one._id === cid);
  const courseName = course ? course.name : `Course ${cid}`;

  const [folders, setFolders] = useState<any[]>([]);
  const [newName, setNewName] = useState("");
  const [picked, setPicked] = useState<string[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [error, setError] = useState("");

  // A student may not read this address, so I send them back.
  useEffect(() => {
    if (!isInstructor) {
      router.replace(`/Courses/${cid}/Piazza`);
    }
  }, [isInstructor, cid, router]);

  const load = async () => {
    const list = await client.findFoldersForCourse(cid).catch(() => []);
    setFolders(list);
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cid]);

  const addFolder = async () => {
    const name = newName.trim();
    if (!name) {
      setError("A folder needs a name.");
      return;
    }
    setError("");
    await client.createFolder(cid, name);
    setNewName("");
    await load();
  };

  const togglePick = (folderId: string) => {
    setPicked(
      picked.includes(folderId)
        ? picked.filter((one) => one !== folderId)
        : [...picked, folderId]
    );
  };

  const deletePicked = async () => {
    for (const folderId of picked) {
      await client.deleteFolder(folderId);
    }
    setPicked([]);
    await load();
  };

  const startEdit = (folder: any) => {
    setEditingId(folder._id);
    setEditName(folder.name);
  };

  const saveEdit = async () => {
    const name = editName.trim();
    if (!name || !editingId) {
      return;
    }
    await client.updateFolder(editingId, name);
    setEditingId(null);
    await load();
  };

  if (!isInstructor) {
    return null;
  }

  return (
    <div id="wd-pazza-manage" className="wd-pazza">
      <PazzaNav
        cid={cid}
        courseName={courseName}
        currentUser={currentUser}
        isInstructor={isInstructor}
        active="manage"
      />

      <div className="wd-pazza-body wd-pazza-body-plain">
        <main className="wd-pazza-ps">
          <div className="p-4" style={{ maxWidth: 760 }}>
            {/* The seven tabs of the Manage Class screen. */}
            <div className="wd-pazza-mc-tabs">
              {TABS.map((tab) => (
                <span
                  key={tab}
                  className={`wd-pazza-mc-tab ${
                    tab === "Manage Folders" ? "wd-pazza-mc-active" : "wd-pazza-mc-off"
                  }`}
                >
                  {tab}
                </span>
              ))}
            </div>

            <h4 className="mt-4 mb-3">Configure Class Folders</h4>
            <p className="text-muted small">
              These folders sort every post of the course. Add one, rename one, or
              remove the ones you no longer need.
            </p>

            {/* Add one folder at a time. */}
            <Form.Group className="mb-4">
              <Form.Label htmlFor="wd-pazza-new-folder" className="fw-semibold">
                New folder name
              </Form.Label>
              <div className="d-flex gap-2">
                <Form.Control
                  id="wd-pazza-new-folder"
                  type="text"
                  placeholder="For example hw4"
                  value={newName}
                  style={{ maxWidth: 320 }}
                  onChange={(event) => setNewName(event.target.value)}
                />
                <Button id="wd-pazza-add-folder" className="wd-pazza-btn" onClick={addFolder}>
                  Add Folder
                </Button>
              </div>
              {error && <div className="text-danger small mt-1">{error}</div>}
            </Form.Group>

            {/* The folder list. Tick the ones you want to remove. */}
            {folders.length === 0 && (
              <p className="text-muted">This course has no folders yet.</p>
            )}

            {folders.map((folder: any) => (
              <div key={folder._id} className="wd-pazza-folder-row">
                <input
                  type="checkbox"
                  className="form-check-input mt-0"
                  id={`wd-pazza-select-${folder._id}`}
                  checked={picked.includes(folder._id)}
                  onChange={() => togglePick(folder._id)}
                />
                {editingId === folder._id ? (
                  <>
                    <Form.Label htmlFor={`wd-pazza-rename-${folder._id}`} className="visually-hidden">
                      Folder name
                    </Form.Label>
                    <Form.Control
                      id={`wd-pazza-rename-${folder._id}`}
                      type="text"
                      value={editName}
                      style={{ maxWidth: 300 }}
                      onChange={(event) => setEditName(event.target.value)}
                    />
                    <Button size="sm" className="wd-pazza-btn" onClick={saveEdit}>
                      Save
                    </Button>
                    <Button size="sm" variant="light" onClick={() => setEditingId(null)}>
                      Cancel
                    </Button>
                  </>
                ) : (
                  <>
                    <label
                      className="flex-grow-1 mb-0"
                      htmlFor={`wd-pazza-select-${folder._id}`}
                      style={{ cursor: "pointer" }}
                    >
                      {folder.name}
                    </label>
                    <Button size="sm" variant="outline-secondary" onClick={() => startEdit(folder)}>
                      Edit
                    </Button>
                  </>
                )}
              </div>
            ))}

            <Button
              id="wd-pazza-delete-folders"
              variant="danger"
              className="mt-3"
              disabled={picked.length === 0}
              onClick={deletePicked}
            >
              Delete selected folders
            </Button>
          </div>
        </main>
      </div>
    </div>
  );
}
