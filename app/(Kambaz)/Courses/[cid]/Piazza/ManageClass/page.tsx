"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { Button, Form } from "react-bootstrap";
import { FaUserCircle } from "react-icons/fa";
import { useIsFaculty } from "../../../../Account/roles";
import * as client from "../client";

// Manage Class Screen (MCS) -> Manage Folders. Instructors only; the route is
// protected so students are redirected back to the Q&A screen.
export default function ManageClass() {
    const { cid } = useParams<{ cid: string }>();
    const router = useRouter();
    const isInstructor = useIsFaculty();
    const { currentUser } = useSelector((s: any) => s.accountReducer);
    const { courses, course } = useSelector((s: any) => s.coursesReducer);
    const courseName = courses.find((c: any) => c._id === cid)?.name || course?.name || cid;

    const [folders, setFolders] = useState<any[]>([]);
    const [newName, setNewName] = useState("");
    const [selected, setSelected] = useState<string[]>([]);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editName, setEditName] = useState("");

    useEffect(() => {
        if (!isInstructor) router.push(`/Courses/${cid}/Piazza`);
    }, [isInstructor, cid, router]);

    const load = async () => setFolders(await client.findFolders(cid).catch(() => []));
    useEffect(() => {
        load();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [cid]);

    const add = async () => {
        if (!newName.trim()) return;
        await client.createFolder(cid, newName.trim());
        setNewName("");
        await load();
    };
    const toggleSelect = (id: string) =>
        setSelected(selected.includes(id) ? selected.filter((x) => x !== id) : [...selected, id]);
    const deleteSelected = async () => {
        for (const id of selected) await client.deleteFolder(id);
        setSelected([]);
        await load();
    };
    const startEdit = (f: any) => { setEditingId(f._id); setEditName(f.name); };
    const saveEdit = async () => {
        await client.updateFolder(editingId as string, editName.trim());
        setEditingId(null);
        await load();
    };

    if (!isInstructor) return null;

    return (
        <div id="wd-pazza-manage">
            {/* Pazza Navigation Bar */}
            <div className="d-flex align-items-center gap-4 px-3 py-2"
                style={{ position: "sticky", top: 0, zIndex: 20, background: "#2563b8" }}>
                <span className="fw-bold fs-4" style={{ color: "#fff", letterSpacing: 0.5 }}>piazza</span>
                <span style={{ color: "#fff" }}>{courseName}</span>
                <Link href={`/Courses/${cid}/Piazza`} className="text-decoration-none" style={{ color: "rgba(255,255,255,0.85)", fontWeight: 500 }}>
                    Q&amp;A
                </Link>
                <span style={{ fontWeight: 700, color: "#fff", borderBottom: "3px solid #fff", paddingBottom: 6 }}>
                    Manage Class
                </span>
                <span className="ms-auto d-flex align-items-center gap-2" style={{ color: "#fff" }}>
                    <FaUserCircle size={22} />
                    {[currentUser?.firstName, currentUser?.lastName].filter(Boolean).join(" ") || currentUser?.username}
                </span>
            </div>

            <div className="p-4" style={{ maxWidth: 720 }}>
                {/* Manage Folders tab */}
                <div className="border-bottom mb-3">
                    <span style={{ fontWeight: 700, color: "#2563b8", borderBottom: "3px solid #2563b8", paddingBottom: 6 }}>
                        Manage Folders
                    </span>
                </div>

                <h4 className="mb-3">Configure Class Folders</h4>

                {/* Add a folder */}
                <div className="d-flex gap-2 mb-4">
                    <Form.Control placeholder="New folder name" value={newName}
                        onChange={(e) => setNewName(e.target.value)} style={{ maxWidth: 320 }} />
                    <Button style={{ backgroundColor: "#2563b8", border: "none" }} onClick={add}>Add Folder</Button>
                </div>

                {/* Folder list */}
                {folders.map((f: any) => (
                    <div key={f._id} className="d-flex align-items-center gap-2 border rounded px-3 py-2 mb-2">
                        <Form.Check type="checkbox" checked={selected.includes(f._id)} onChange={() => toggleSelect(f._id)} />
                        {editingId === f._id ? (
                            <>
                                <Form.Control value={editName} onChange={(e) => setEditName(e.target.value)} style={{ maxWidth: 320 }} />
                                <Button size="sm" style={{ backgroundColor: "#2563b8", border: "none" }} onClick={saveEdit}>Save</Button>
                                <Button size="sm" variant="light" onClick={() => setEditingId(null)}>Cancel</Button>
                            </>
                        ) : (
                            <>
                                <span className="flex-grow-1">{f.name}</span>
                                <Button size="sm" variant="outline-secondary" onClick={() => startEdit(f)}>Edit</Button>
                            </>
                        )}
                    </div>
                ))}

                <Button variant="danger" className="mt-2" disabled={selected.length === 0} onClick={deleteSelected}>
                    Delete selected folders
                </Button>
            </div>
        </div>
    );
}
