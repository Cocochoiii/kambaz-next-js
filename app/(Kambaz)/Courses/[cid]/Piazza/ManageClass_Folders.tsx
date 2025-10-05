"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "next/navigation";
import {
    Row,
    Col,
    Card,
    Form,
    Button,
    ListGroup,
    Alert,
    Badge,
} from "react-bootstrap";
import { FaEdit, FaTrash, FaCheck, FaTimes } from "react-icons/fa";
import {
    addFolder,
    updateFolder,
    deleteFolder,
    fetchFolders,
} from "./pazzaReducer";

/**
 * Manage Folders Screen (MFS)
 * - Title: "Configure Class Folders"
 * - Default folders shown/seeded if empty (once per course)
 * - Add one folder at a time
 * - Edit flow: Edit -> (Save | Cancel)
 * - Delete: single + bulk delete selected
 * - Immediate refresh/persist after each operation
 * - No subfolders / no disable / no numbered suffix (not required)
 */
const DEFAULTS = [
    "hw1",
    "hw2",
    "hw3",
    "hw4",
    "hw5",
    "hw6",
    "project",
    "exam",
    "logistics",
    "other",
    "office_hours",
];

const ManageFoldersScreen: React.FC = () => {
    const params = useParams();
    const cid = params?.cid as string;

    const dispatch = useDispatch<any>();
    const courseData = useSelector(
        (s: any) => s.pazza?.courseData?.[cid] || {}
    );
    const folders = courseData.folders || [];
    const [didSeed, setDidSeed] = useState(false);

    const [newFolderName, setNewFolderName] = useState("");
    const [editingFolder, setEditingFolder] = useState<string | null>(null);
    const [editingName, setEditingName] = useState("");
    const [selected, setSelected] = useState<string[]>([]);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    // Load
    useEffect(() => {
        if (cid) dispatch(fetchFolders(cid));
    }, [cid, dispatch]);

    // Seed defaults ONCE if no folders exist for this course
    useEffect(() => {
        if (!cid || didSeed) return;
        if (folders.length === 0) {
            (async () => {
                for (const name of DEFAULTS) {
                    await dispatch(addFolder({ courseId: cid, name }));
                }
                await dispatch(fetchFolders(cid));
                setDidSeed(true);
            })();
        }
    }, [cid, folders.length, didSeed, dispatch]);

    const existingNamesLower = useMemo(
        () => new Set(folders.map((f: any) => (f.name || "").toLowerCase())),
        [folders]
    );

    const handleAdd = async () => {
        const name = newFolderName.trim();
        if (!name) return setError("Folder name cannot be empty.");
        if (existingNamesLower.has(name.toLowerCase())) {
            return setError("A folder with this name already exists.");
        }
        try {
            await dispatch(addFolder({ courseId: cid, name }));
            await dispatch(fetchFolders(cid));
            setNewFolderName("");
            setError("");
            setSuccess("Folder added.");
            setTimeout(() => setSuccess(""), 1500);
        } catch {
            setError("Failed to add folder.");
        }
    };

    const startEdit = (f: any) => {
        setEditingFolder(f._id);
        setEditingName(f.name);
    };

    const saveEdit = async () => {
        const name = editingName.trim();
        if (!editingFolder || !name) return setError("Folder name cannot be empty.");
        try {
            await dispatch(
                updateFolder({ courseId: cid, folderId: editingFolder, name })
            );
            await dispatch(fetchFolders(cid));
            setEditingFolder(null);
            setEditingName("");
            setError("");
            setSuccess("Folder updated.");
            setTimeout(() => setSuccess(""), 1500);
        } catch {
            setError("Failed to update folder.");
        }
    };

    const cancelEdit = () => {
        setEditingFolder(null);
        setEditingName("");
    };

    const toggleSelected = (id: string) =>
        setSelected((prev) =>
            prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
        );

    const removeOne = async (id: string) => {
        const f = folders.find((x: any) => x._id === id);
        if (!f) return;
        if (f.isDefault) return setError("Default folders cannot be deleted.");
        if (!confirm(`Delete folder "${f.name}"?`)) return;
        try {
            await dispatch(deleteFolder({ courseId: cid, folderId: id }));
            await dispatch(fetchFolders(cid));
            setSuccess("Folder deleted.");
            setTimeout(() => setSuccess(""), 1500);
        } catch {
            setError("Failed to delete folder.");
        }
    };

    const removeSelected = async () => {
        if (selected.length === 0)
            return setError("Select folders to delete first.");
        if (!confirm(`Delete ${selected.length} selected folder(s)?`)) return;
        try {
            for (const id of selected) {
                const f = folders.find((x: any) => x._id === id);
                if (f && !f.isDefault) {
                    await dispatch(deleteFolder({ courseId: cid, folderId: id }));
                }
            }
            await dispatch(fetchFolders(cid));
            setSelected([]);
            setSuccess("Selected folders deleted.");
            setTimeout(() => setSuccess(""), 1500);
        } catch {
            setError("Failed to delete selected folders.");
        }
    };

    return (
        <Row>
            <Col md={8}>
                <Card className="shadow-sm">
                    <Card.Header>
                        <h5 className="mb-0">Configure Class Folders</h5>
                    </Card.Header>
                    <Card.Body>
                        {error && (
                            <Alert variant="danger" dismissible onClose={() => setError("")}>
                                {error}
                            </Alert>
                        )}
                        {success && (
                            <Alert
                                variant="success"
                                dismissible
                                onClose={() => setSuccess("")}
                            >
                                {success}
                            </Alert>
                        )}

                        {/* Add new folder */}
                        <div className="mb-3">
                            <h6>Create new folders:</h6>
                            <p className="text-muted small mb-2">
                                Add a folder relevant to your class. (Numbered sets &amp;
                                subfolders are not required.)
                            </p>
                            <Form.Group>
                                <div className="d-flex gap-2">
                                    <Form.Control
                                        type="text"
                                        placeholder="Add a folder…"
                                        value={newFolderName}
                                        onChange={(e) => setNewFolderName(e.target.value)}
                                        onKeyDown={(e) => e.key === "Enter" && handleAdd()}
                                    />
                                    <Button onClick={handleAdd}>Add Folder</Button>
                                </div>
                            </Form.Group>
                        </div>

                        {/* Manage list */}
                        <div className="mb-2">
                            <h6 className="mb-2">Manage folders:</h6>
                            <p className="text-muted small mb-2">
                                Select to delete, or click <strong>Edit</strong> to rename.
                            </p>

                            <ListGroup className="mb-3">
                                {folders.map((f: any) => (
                                    <ListGroup.Item
                                        key={f._id}
                                        className="d-flex justify-content-between align-items-center"
                                    >
                                        <div className="d-flex align-items-center gap-2">
                                            <Form.Check
                                                type="checkbox"
                                                checked={selected.includes(f._id)}
                                                disabled={f.isDefault}
                                                onChange={() => toggleSelected(f._id)}
                                            />
                                            {editingFolder === f._id ? (
                                                <>
                                                    <Form.Control
                                                        type="text"
                                                        value={editingName}
                                                        onChange={(e) => setEditingName(e.target.value)}
                                                        size="sm"
                                                        style={{ width: 240 }}
                                                        onKeyDown={(e) => e.key === "Enter" && saveEdit()}
                                                    />
                                                    <Button
                                                        size="sm"
                                                        variant="success"
                                                        onClick={saveEdit}
                                                        title="Save"
                                                    >
                                                        <FaCheck />
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="secondary"
                                                        onClick={cancelEdit}
                                                        title="Cancel"
                                                    >
                                                        <FaTimes />
                                                    </Button>
                                                </>
                                            ) : (
                                                <>
                                                    <span>{f.name}</span>
                                                    {f.isDefault && <Badge bg="secondary">Default</Badge>}
                                                </>
                                            )}
                                        </div>

                                        {editingFolder !== f._id && (
                                            <div className="d-flex align-items-center">
                                                <Button
                                                    size="sm"
                                                    variant="link"
                                                    onClick={() => startEdit(f)}
                                                >
                                                    <FaEdit /> Edit
                                                </Button>
                                                {!f.isDefault && (
                                                    <Button
                                                        size="sm"
                                                        variant="link"
                                                        className="text-danger"
                                                        onClick={() => removeOne(f._id)}
                                                    >
                                                        <FaTrash /> Delete
                                                    </Button>
                                                )}
                                            </div>
                                        )}
                                    </ListGroup.Item>
                                ))}
                            </ListGroup>

                            {selected.length > 0 && (
                                <Button variant="danger" onClick={removeSelected}>
                                    Delete selected folders ({selected.length})
                                </Button>
                            )}
                        </div>
                    </Card.Body>
                </Card>
            </Col>

            {/* Optional right info card (blue box not required per spec) */}
            <Col md={4}>
                <Card className="shadow-sm">
                    <Card.Body>
                        <h6 className="text-primary">Organize your Q&amp;A</h6>
                        <p className="small text-muted mb-0">
                            Use folders like <em>hw1</em>, <em>exam</em>, or{" "}
                            <em>office_hours</em> to make it easy for students to find the
                            right place to post.
                        </p>
                    </Card.Body>
                </Card>
            </Col>
        </Row>
    );
};

export default ManageFoldersScreen;
