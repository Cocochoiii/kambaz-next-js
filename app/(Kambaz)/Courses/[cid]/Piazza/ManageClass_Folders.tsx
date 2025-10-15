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
    Alert,
    Badge,
} from "react-bootstrap";
import { FaEdit, FaTrash, FaCheck, FaTimes, FaFolder } from "react-icons/fa";
import {
    addFolder,
    updateFolder,
    deleteFolder,
    fetchFolders,
} from "./pazzaReducer";

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
            setSuccess("Folder added successfully!");
            setTimeout(() => setSuccess(""), 2500);
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
            setSuccess("Folder updated successfully!");
            setTimeout(() => setSuccess(""), 2500);
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
            setSuccess("Folder deleted successfully!");
            setTimeout(() => setSuccess(""), 2500);
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
            setSuccess("Selected folders deleted successfully!");
            setTimeout(() => setSuccess(""), 2500);
        } catch {
            setError("Failed to delete selected folders.");
        }
    };

    return (
        <div className="pazza-manage-folders-container">
            <Row>
                <Col lg={8}>
                    <Card className="pazza-manage-card">
                        <Card.Header className="pazza-manage-header">
                            <h5 className="pazza-manage-title">Configure Class Folders</h5>
                        </Card.Header>
                        <Card.Body className="pazza-manage-body">
                            {error && (
                                <Alert
                                    variant="danger"
                                    dismissible
                                    onClose={() => setError("")}
                                    className="pazza-alert-danger"
                                    aria-live="polite"
                                >
                                    <span className="pazza-alert-icon">!</span>
                                    {error}
                                </Alert>
                            )}
                            {success && (
                                <Alert
                                    variant="success"
                                    dismissible
                                    onClose={() => setSuccess("")}
                                    className="pazza-alert-success"
                                    aria-live="polite"
                                >
                                    <span className="pazza-alert-icon">✓</span>
                                    {success}
                                </Alert>
                            )}

                            {/* Add new folder section */}
                            <div className="pazza-manage-section">
                                <h6 className="pazza-section-title">Create new folders:</h6>
                                <p className="pazza-section-description">
                                    Add a folder relevant to your class. (Numbered sets & subfolders are not required.)
                                </p>
                                <Form.Group>
                                    <div className="pazza-input-group">
                                        <Form.Control
                                            type="text"
                                            placeholder="Add a folder…"
                                            value={newFolderName}
                                            onChange={(e) => setNewFolderName(e.target.value)}
                                            onKeyDown={(e) => e.key === "Enter" && handleAdd()}
                                            className="pazza-folder-input"
                                        />
                                        <Button
                                            onClick={handleAdd}
                                            className="pazza-btn-primary"
                                        >
                                            Add Folder
                                        </Button>
                                    </div>
                                </Form.Group>
                            </div>

                            {/* Manage folders list */}
                            <div className="pazza-manage-list-section">
                                <h6 className="pazza-section-title">Manage folders:</h6>
                                <p className="pazza-section-description">
                                    Select to delete, or click <strong>Edit</strong> to rename.
                                </p>

                                <div className="pazza-folders-list">
                                    {folders.map((f: any, index: number) => (
                                        <div
                                            key={f._id}
                                            className={`pazza-folder-item ${selected.includes(f._id) ? 'selected' : ''}`}
                                        >
                                            <div className="pazza-folder-left">
                                                <Form.Check
                                                    type="checkbox"
                                                    checked={selected.includes(f._id)}
                                                    disabled={f.isDefault}
                                                    onChange={() => toggleSelected(f._id)}
                                                    className="pazza-folder-checkbox"
                                                />
                                                <FaFolder className="pazza-folder-icon" />
                                                {editingFolder === f._id ? (
                                                    <div className="pazza-folder-edit-group">
                                                        <Form.Control
                                                            type="text"
                                                            value={editingName}
                                                            onChange={(e) => setEditingName(e.target.value)}
                                                            size="sm"
                                                            className="pazza-folder-edit-input"
                                                            onKeyDown={(e) => e.key === "Enter" && saveEdit()}
                                                            autoFocus
                                                        />
                                                        <Button
                                                            size="sm"
                                                            variant="success"
                                                            onClick={saveEdit}
                                                            className="pazza-btn-save"
                                                            title="Save"
                                                        >
                                                            <FaCheck />
                                                        </Button>
                                                        <Button
                                                            size="sm"
                                                            variant="secondary"
                                                            onClick={cancelEdit}
                                                            className="pazza-btn-cancel"
                                                            title="Cancel"
                                                        >
                                                            <FaTimes />
                                                        </Button>
                                                    </div>
                                                ) : (
                                                    <div className="pazza-folder-name-group">
                                                        <span className={`pazza-folder-name ${f.isDefault ? 'default' : ''}`}>
                                                            {f.name}
                                                        </span>
                                                        {f.isDefault && (
                                                            <Badge className="pazza-default-badge">
                                                                Default
                                                            </Badge>
                                                        )}
                                                    </div>
                                                )}
                                            </div>

                                            {editingFolder !== f._id && (
                                                <div className="pazza-folder-actions">
                                                    <Button
                                                        size="sm"
                                                        variant="link"
                                                        onClick={() => startEdit(f)}
                                                        className="pazza-btn-edit"
                                                    >
                                                        <FaEdit className="pazza-action-icon" />
                                                        Edit
                                                    </Button>
                                                    {!f.isDefault && (
                                                        <>
                                                            <span className="pazza-action-separator">|</span>
                                                            <Button
                                                                size="sm"
                                                                variant="link"
                                                                onClick={() => removeOne(f._id)}
                                                                className="pazza-btn-delete"
                                                            >
                                                                Delete
                                                            </Button>
                                                        </>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>

                                {selected.length > 0 && (
                                    <Button
                                        variant="danger"
                                        onClick={removeSelected}
                                        className="pazza-btn-delete-selected"
                                    >
                                        Delete selected folders ({selected.length})
                                    </Button>
                                )}
                            </div>
                        </Card.Body>
                    </Card>
                </Col>

                {/* Right info panel */}
                <Col lg={4}>
                    <Card className="pazza-info-card">
                        <Card.Body className="pazza-info-body">
                            <h6 className="pazza-info-title">
                                Organize your Q&A
                            </h6>
                            <p className="pazza-info-text">
                                Use folders like <em>hw1</em>, <em>exam</em>, or{" "}
                                <em>office_hours</em> to make it easy for students to find the
                                right place to post.
                            </p>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default ManageFoldersScreen;