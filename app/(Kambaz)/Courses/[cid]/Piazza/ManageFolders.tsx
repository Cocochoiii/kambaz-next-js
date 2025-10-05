"use client";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addFolder, updateFolder, deleteFolder } from "./pazzaReducer";
import { FaEdit, FaTrash, FaCheck, FaTimes } from "react-icons/fa";

interface ManageFoldersProps {
    courseId: string;
    onClose: () => void;
}

export default function ManageFolders({ courseId, onClose }: ManageFoldersProps) {
    const dispatch = useDispatch<any>();
    const courseData = useSelector((state: any) => state.pazza?.courseData?.[courseId] || {});
    const folders = courseData.folders || [];

    const [newFolderName, setNewFolderName] = useState("");
    const [editingFolderId, setEditingFolderId] = useState<string | null>(null);
    const [editFolderName, setEditFolderName] = useState("");
    const [selectedFolders, setSelectedFolders] = useState<string[]>([]);

    const handleAddFolder = async () => {
        if (newFolderName.trim()) {
            await dispatch(addFolder({ courseId, name: newFolderName }));
            setNewFolderName("");
        }
    };

    const handleStartEdit = (folder: any) => {
        setEditingFolderId(folder._id);
        setEditFolderName(folder.name);
    };

    const handleSaveEdit = async (folderId: string) => {
        if (editFolderName.trim()) {
            await dispatch(updateFolder({ courseId, folderId, name: editFolderName }));
            setEditingFolderId(null);
            setEditFolderName("");
        }
    };

    const handleCancelEdit = () => {
        setEditingFolderId(null);
        setEditFolderName("");
    };

    const handleSelectFolder = (folderId: string) => {
        setSelectedFolders((prev) => (prev.includes(folderId) ? prev.filter((id) => id !== folderId) : [...prev, folderId]));
    };

    const handleDeleteSelected = async () => {
        if (selectedFolders.length > 0 && confirm(`Delete ${selectedFolders.length} selected folder(s)?`)) {
            for (const folderId of selectedFolders) {
                const folder = folders.find((f: any) => f._id === folderId);
                if (!folder?.isDefault) {
                    await dispatch(deleteFolder({ courseId, folderId }));
                }
            }
            setSelectedFolders([]);
        }
    };

    return (
        <div className="manage-folders-container">
            <div className="manage-header">
                <div className="manage-tabs">
                    <button className="manage-tab">General Settings</button>
                    <button className="manage-tab">Customize Q&amp;A</button>
                    <button className="manage-tab active">Manage Folders</button>
                    <button className="manage-tab">Manage Enrollment</button>
                    <button className="manage-tab">Manage Groups</button>
                    <button className="manage-tab">Create Groups</button>
                    <button className="manage-tab">Customize Course Page</button>
                    <button className="manage-tab">Piazza Network Settings</button>
                </div>
            </div>

            <div className="manage-content">
                <div className="content-wrapper">
                    <div className="left-panel">
                        <h2>Configure Class Folders</h2>
                        <p className="description">
                            Folders allow you to keep class content organized. When students and instructors add a new post,
                            they will be required to specify at least one folder for their post.
                        </p>

                        <div className="add-folder-section">
                            <label>Add folders that are relevant for your class. Select 'numbered' to create numbered folders (hw1-hw#)</label>
                            <div className="add-folder-input">
                                <input
                                    type="text"
                                    placeholder="Add a folder(s)"
                                    value={newFolderName}
                                    onChange={(e) => setNewFolderName(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter") handleAddFolder();
                                    }}
                                />
                                <span className="numbered-option">
                  <input type="checkbox" id="numbered" disabled />
                  <label htmlFor="numbered">numbered: suffix #</label>
                </span>
                                <button className="btn-add-folder" onClick={handleAddFolder}>Add folder</button>
                            </div>
                        </div>

                        <div className="manage-folders-section">
                            <h3>Manage folders:</h3>
                            <p>
                                Reorder, delete, edit folder names, or create subfolders. You can create up to 2 levels of nesting
                                ("subfolders" and "subfolders to subfolders"). Manually sort folders and subfolders using burger icon ☰.
                                Click folder icon 📁 to show and hide subfolders.
                            </p>

                            {selectedFolders.length > 0 && (
                                <div className="bulk-actions">
                                    <button className="btn-delete-selected" onClick={handleDeleteSelected}>
                                        Delete selected folders
                                    </button>
                                </div>
                            )}

                            <div className="folders-list">
                                {folders.map((folder: any) => (
                                    <div key={folder._id} className="folder-item">
                                        <div className="folder-controls">
                                            <input
                                                type="checkbox"
                                                checked={selectedFolders.includes(folder._id)}
                                                onChange={() => handleSelectFolder(folder._id)}
                                                disabled={folder.isDefault}
                                            />
                                            <span className="folder-icon">📁</span>
                                            {editingFolderId === folder._id ? (
                                                <>
                                                    <input
                                                        type="text"
                                                        value={editFolderName}
                                                        onChange={(e) => setEditFolderName(e.target.value)}
                                                        className="edit-folder-input"
                                                        onKeyDown={(e) => e.key === "Enter" && handleSaveEdit(folder._id)}
                                                    />
                                                    <button className="btn-save-edit" onClick={() => handleSaveEdit(folder._id)}>
                                                        <FaCheck /> Save
                                                    </button>
                                                    <button className="btn-cancel-edit" onClick={handleCancelEdit}>
                                                        <FaTimes /> Cancel
                                                    </button>
                                                </>
                                            ) : (
                                                <>
                                                    <span className="folder-name">{folder.name}</span>
                                                    <button className="btn-edit-folder" onClick={() => handleStartEdit(folder)}>
                                                        <FaEdit /> Edit
                                                    </button>
                                                    {!folder.isDefault && (
                                                        <button className="btn-create-subfolder" disabled>
                                                            + Create subfolders
                                                        </button>
                                                    )}
                                                </>
                                            )}
                                        </div>
                                        <div className="folder-options">
                                            <label>
                                                <input type="checkbox" disabled />
                                                Disable folders
                                            </label>
                                            <label>
                                                <input type="checkbox" disabled />
                                                Hide all subfolders
                                            </label>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="actions">
                            <button className="btn-close" onClick={onClose}>Close</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
