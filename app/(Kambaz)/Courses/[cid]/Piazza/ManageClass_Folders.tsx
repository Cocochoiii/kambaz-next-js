"use client";

import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "next/navigation";
import { Row, Col, Card, Form, Button, ListGroup, Alert, Badge } from "react-bootstrap";
import { FaEdit, FaTrash, FaCheck, FaTimes } from "react-icons/fa";
import { addFolder, updateFolder, deleteFolder } from "./pazzaReducer";

const ManageFoldersScreen: React.FC = () => {
    const params = useParams();
    const cid = params?.cid as string;
    const dispatch = useDispatch<any>();
    const courseData = useSelector((state: any) => state.pazza?.courseData?.[cid] || {});
    const folders = courseData.folders || [];

    const [newFolderName, setNewFolderName] = useState("");
    const [editingFolder, setEditingFolder] = useState<string | null>(null);
    const [editingName, setEditingName] = useState("");
    const [selectedFolders, setSelectedFolders] = useState<string[]>([]);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleAddFolder = async () => {
        if (!newFolderName.trim()) return setError("Folder name cannot be empty");
        if (folders.some((f: any) => f.name.toLowerCase() === newFolderName.toLowerCase())) {
            return setError("A folder with this name already exists");
        }
        try {
            await dispatch(addFolder({ courseId: cid, name: newFolderName }));
            setNewFolderName("");
            setSuccess("Folder added successfully!");
            setError("");
            setTimeout(() => setSuccess(""), 3000);
        } catch {
            setError("Failed to add folder. Please try again.");
        }
    };

    const handleEditStart = (folder: any) => {
        setEditingFolder(folder._id);
        setEditingName(folder.name);
    };

    const handleEditSave = async () => {
        if (!editingFolder || !editingName.trim()) return setError("Folder name cannot be empty");
        try {
            await dispatch(updateFolder({ courseId: cid, folderId: editingFolder, name: editingName }));
            setEditingFolder(null);
            setEditingName("");
            setSuccess("Folder updated successfully!");
            setError("");
            setTimeout(() => setSuccess(""), 3000);
        } catch {
            setError("Failed to update folder. Please try again.");
        }
    };

    const handleEditCancel = () => {
        setEditingFolder(null);
        setEditingName("");
    };

    const handleDeleteFolder = async (folderId: string) => {
        if (!confirm("Are you sure you want to delete this folder?")) return;
        try {
            await dispatch(deleteFolder({ courseId: cid, folderId }));
            setSuccess("Folder deleted successfully!");
            setError("");
            setTimeout(() => setSuccess(""), 3000);
        } catch {
            setError("Failed to delete folder. Please try again.");
        }
    };

    const handleDeleteSelectedFolders = async () => {
        if (selectedFolders.length === 0) return setError("Please select folders to delete");
        if (!confirm(`Are you sure you want to delete ${selectedFolders.length} folder(s)?`)) return;
        try {
            await Promise.all(selectedFolders.map((id) => dispatch(deleteFolder({ courseId: cid, folderId: id }))));
            setSelectedFolders([]);
            setSuccess("Folders deleted successfully!");
            setError("");
            setTimeout(() => setSuccess(""), 3000);
        } catch {
            setError("Failed to delete folders. Please try again.");
        }
    };

    const handleFolderSelect = (folderId: string) => {
        setSelectedFolders((prev) => (prev.includes(folderId) ? prev.filter((id) => id !== folderId) : [...prev, folderId]));
    };

    return (
        <Row>
            <Col md={8}>
                <Card>
                    <Card.Header><h5 className="mb-0">Configure Class Folders</h5></Card.Header>
                    <Card.Body>
                        <Alert variant="info" className="small">
                            Folders help you keep your class organized. When someone adds a new post, they’ll be required to choose one or more folders.
                        </Alert>

                        {error && <Alert variant="danger" dismissible onClose={() => setError("")}>{error}</Alert>}
                        {success && <Alert variant="success" dismissible onClose={() => setSuccess("")}>{success}</Alert>}

                        <div className="mb-3">
                            <h6>Create new folders:</h6>
                            <p className="text-muted small">Add folders relevant to your class. “numbered” creates hw1–hw# (disabled here).</p>
                            <Form.Group>
                                <div className="d-flex gap-2">
                                    <Form.Control
                                        type="text"
                                        placeholder="Add a folder..."
                                        value={newFolderName}
                                        onChange={(e) => setNewFolderName(e.target.value)}
                                    />
                                    <Button onClick={handleAddFolder}>Add Folder</Button>
                                </div>
                            </Form.Group>
                        </div>

                        <div>
                            <h6>Manage folders:</h6>
                            <p className="text-muted small">
                                Reorder, delete, edit names, or create subfolders (max two levels).
                            </p>

                            <ListGroup className="mb-3">
                                {folders.map((folder: any) => (
                                    <ListGroup.Item key={folder._id} className="d-flex justify-content-between align-items-center">
                                        <div className="d-flex align-items-center gap-2">
                                            <Form.Check
                                                type="checkbox"
                                                checked={selectedFolders.includes(folder._id)}
                                                onChange={() => handleFolderSelect(folder._id)}
                                            />
                                            {editingFolder === folder._id ? (
                                                <>
                                                    <Form.Control
                                                        type="text"
                                                        value={editingName}
                                                        onChange={(e) => setEditingName(e.target.value)}
                                                        size="sm"
                                                        style={{ width: 220 }}
                                                    />
                                                    <Button size="sm" variant="success" onClick={handleEditSave}><FaCheck /></Button>
                                                    <Button size="sm" variant="secondary" onClick={handleEditCancel}><FaTimes /></Button>
                                                </>
                                            ) : (
                                                <>
                                                    <span>{folder.name}</span>
                                                    {folder.isDefault && <Badge bg="secondary">Default</Badge>}
                                                </>
                                            )}
                                        </div>

                                        {editingFolder !== folder._id && (
                                            <div>
                                                <Button size="sm" variant="link" onClick={() => handleEditStart(folder)}>
                                                    <FaEdit /> Edit
                                                </Button>
                                                {!folder.isDefault && (
                                                    <Button size="sm" variant="link" className="text-danger" onClick={() => handleDeleteFolder(folder._id)}>
                                                        <FaTrash /> Delete
                                                    </Button>
                                                )}
                                            </div>
                                        )}
                                    </ListGroup.Item>
                                ))}
                            </ListGroup>

                            {selectedFolders.length > 0 && (
                                <Button variant="danger" onClick={handleDeleteSelectedFolders}>
                                    Delete Selected Folders ({selectedFolders.length})
                                </Button>
                            )}
                        </div>
                    </Card.Body>
                </Card>
            </Col>

            <Col md={4}>
                <Card>
                    <Card.Body>
                        <h6 className="text-primary">Create folders to keep your class organized.</h6>
                        <p className="small text-muted mb-0">Use folders to organize discussions by assignment, topic, logistics, and more.</p>
                    </Card.Body>
                </Card>
            </Col>
        </Row>
    );
};

export default ManageFoldersScreen;
