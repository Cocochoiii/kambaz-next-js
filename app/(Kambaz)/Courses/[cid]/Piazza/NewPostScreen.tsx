"use client";

import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "next/navigation";
import { Container, Card, Form, Button, Alert } from "react-bootstrap";
import dynamic from "next/dynamic";
import { createPost } from "./pazzaReducer";

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
import "react-quill/dist/quill.snow.css";

interface NewPostScreenProps {
    onSave: () => void;
    onCancel: () => void;
}

const NewPostScreen: React.FC<NewPostScreenProps> = ({ onSave, onCancel }) => {
    const params = useParams();
    const cid = params?.cid as string;
    const dispatch = useDispatch<any>();

    const { folders = [] } = useSelector((state: any) => state.pazza || { folders: [] });
    const enrollments = useSelector((state: any) => state.enrollmentsReducer?.enrollments || []);
    const currentUser = useSelector((state: any) => state.accountReducer?.currentUser);

    const [postType, setPostType] = useState("question");
    const [postTo, setPostTo] = useState("entire_class");
    const [selectedFolders, setSelectedFolders] = useState<string[]>([]);
    const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
    const [summary, setSummary] = useState("");
    const [details, setDetails] = useState("");
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [showIndividualSelect, setShowIndividualSelect] = useState(false);

    const courseEnrollments = enrollments.filter((e: any) => e.course === cid);
    const instructors = courseEnrollments.filter((e: any) =>
        e.user?.role === "FACULTY" || e.user?.role === "TA");
    const students = courseEnrollments.filter((e: any) => e.user?.role === "STUDENT");

    const handlePostToChange = (value: string) => {
        setPostTo(value);
        setShowIndividualSelect(value === "individual");
        if (value === "entire_class") setSelectedUsers([]);
    };

    const handleFolderToggle = (folderName: string) => {
        setSelectedFolders(prev =>
            prev.includes(folderName)
                ? prev.filter(f => f !== folderName)
                : [...prev, folderName]
        );
    };

    const handleUserToggle = (userId: string) => {
        setSelectedUsers(prev =>
            prev.includes(userId)
                ? prev.filter(u => u !== userId)
                : [...prev, userId]
        );
    };

    const validate = () => {
        const newErrors: { [key: string]: string } = {};
        if (!summary.trim()) newErrors.summary = "Summary is required";
        if (summary.length > 100) newErrors.summary = "Summary must be 100 characters or less";
        if (!details.trim() || details === "<p><br></p>") newErrors.details = "Details are required";
        if (selectedFolders.length === 0) newErrors.folders = "Please select at least one folder";
        if (postTo === "individual" && selectedUsers.length === 0)
            newErrors.users = "Please select at least one user";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validate()) return;
        try {
            const postData = {
                type: postType,
                postTo,
                visibleTo: postTo === "individual" ? selectedUsers : [],
                folders: selectedFolders,
                summary,
                title: summary,
                details,
            };
            await dispatch(createPost({ courseId: cid, post: postData }));
            onSave();
        } catch (error) {
            console.error("Error creating post:", error);
            setErrors({ submit: "Failed to create post. Please try again." });
        }
    };

    const modules = {
        toolbar: [
            [{ header: [1, 2, 3, false] }],
            ["bold", "italic", "underline", "strike"],
            [{ list: "ordered" }, { list: "bullet" }],
            [{ indent: "-1" }, { indent: "+1" }],
            ["link", "image", "code-block"],
            ["clean"],
        ],
    };

    const displayFolders = folders.length > 0 ? folders : [
        { name: "hw1" }, { name: "hw2" }, { name: "hw3" },
        { name: "hw4" }, { name: "hw5" }, { name: "hw6" },
        { name: "project" }, { name: "exam" }, { name: "logistics" },
        { name: "other" }, { name: "office_hours" }
    ];

    return (
        <div className="new-post-screen">
            {/* Post Type Selection */}
            <div className="post-type-section">
                <label className="section-label">Post Type*</label>
                <div className="post-type-options">
                    <label className={`post-type-option ${postType === "question" ? "active" : ""}`}>
                        <input
                            type="radio"
                            checked={postType === "question"}
                            onChange={() => setPostType("question")}
                        />
                        <span className="option-title">Question</span>
                        <span className="option-subtitle">if you need an answer</span>
                    </label>
                    <label className={`post-type-option ${postType === "note" ? "active" : ""}`}>
                        <input
                            type="radio"
                            checked={postType === "note"}
                            onChange={() => setPostType("note")}
                        />
                        <span className="option-title">Note</span>
                        <span className="option-subtitle">if you don't need an answer</span>
                    </label>
                    <label className="post-type-option disabled">
                        <input type="radio" disabled />
                        <span className="option-title">Poll/In-Class Response</span>
                        <span className="option-subtitle">if you need a vote</span>
                    </label>
                </div>
            </div>

            {/* Post To Section */}
            <div className="post-to-section">
                <label className="section-label">Post To*</label>
                <div className="post-to-options">
                    <label className={`post-to-option ${postTo === "entire_class" ? "active" : ""}`}>
                        <input
                            type="radio"
                            checked={postTo === "entire_class"}
                            onChange={() => handlePostToChange("entire_class")}
                        />
                        Entire Class
                    </label>
                    <label className={`post-to-option ${postTo === "individual" ? "active" : ""}`}>
                        <input
                            type="radio"
                            checked={postTo === "individual"}
                            onChange={() => handlePostToChange("individual")}
                        />
                        Individual Student(s) / Instructor(s)
                    </label>
                </div>

                {showIndividualSelect && (
                    <div className="user-selection-box">
                        <div className="user-group">
                            <label className="user-group-label">
                                <input
                                    type="checkbox"
                                    onChange={(e) => {
                                        const instructorIds = instructors.map((i: any) => i.user?._id);
                                        if (e.target.checked) {
                                            setSelectedUsers(prev => [...new Set([...prev, ...instructorIds])]);
                                        } else {
                                            setSelectedUsers(prev =>
                                                prev.filter(id => !instructorIds.includes(id)));
                                        }
                                    }}
                                />
                                <strong>Instructors</strong>
                            </label>
                            {instructors.map((enrollment: any) => (
                                <label key={enrollment._id} className="user-option">
                                    <input
                                        type="checkbox"
                                        checked={selectedUsers.includes(enrollment.user?._id)}
                                        onChange={() => handleUserToggle(enrollment.user?._id)}
                                    />
                                    {enrollment.user?.firstName} {enrollment.user?.lastName}
                                </label>
                            ))}
                        </div>
                        {students.length > 0 && (
                            <div className="user-group">
                                <strong>Students</strong>
                                {students.map((enrollment: any) => (
                                    <label key={enrollment._id} className="user-option">
                                        <input
                                            type="checkbox"
                                            checked={selectedUsers.includes(enrollment.user?._id)}
                                            onChange={() => handleUserToggle(enrollment.user?._id)}
                                        />
                                        {enrollment.user?.firstName} {enrollment.user?.lastName}
                                    </label>
                                ))}
                            </div>
                        )}
                    </div>
                )}
                {errors.users && <div className="error-text">{errors.users}</div>}
            </div>

            {/* Folder Selection */}
            <div className="folder-selection-section">
                <label className="section-label">Select Folder(s)*</label>
                <div className="folder-chips">
                    {displayFolders.map((folder: any) => (
                        <button
                            key={folder.name}
                            className={`folder-chip ${
                                selectedFolders.includes(folder.name) ? "selected" : ""
                            }`}
                            onClick={() => handleFolderToggle(folder.name)}
                        >
                            {folder.name}
                        </button>
                    ))}
                </div>
                <a href="#" className="manage-folders-link"
                   onClick={(e) => { e.preventDefault(); }}>
                    Manage and reorder folders
                </a>
                {errors.folders && <div className="error-text">{errors.folders}</div>}
            </div>

            {/* Summary */}
            <div className="summary-section">
                <label className="section-label">Summary*</label>
                <input
                    type="text"
                    className={`summary-input ${errors.summary ? "error" : ""}`}
                    placeholder="Enter a one line summary, 100 characters or less"
                    value={summary}
                    onChange={(e) => setSummary(e.target.value)}
                    maxLength={100}
                />
                <div className="char-counter">{100 - summary.length} characters remaining</div>
                {errors.summary && <div className="error-text">{errors.summary}</div>}
            </div>

            {/* Details */}
            <div className="details-section">
                <label className="section-label">Details*</label>
                <div className="editor-tabs">
                    <button className="editor-tab active">Rich text editor</button>
                    <button className="editor-tab disabled">Plain text editor</button>
                    <button className="editor-tab disabled">Markdown editor</button>
                    <button className="preview-tab disabled">preview</button>
                </div>
                <div className={errors.details ? "quill-error" : ""}>
                    <ReactQuill
                        theme="snow"
                        value={details}
                        onChange={setDetails}
                        modules={modules}
                        placeholder="Type your details here..."
                        style={{ minHeight: "200px" }}
                    />
                </div>
                {errors.details && <div className="error-text">{errors.details}</div>}
            </div>

            {/* Posting Options */}
            <div className="posting-options">
                <label className="section-label">Posting Options</label>
                <label className="option-checkbox">
                    <input type="checkbox" />
                    Send email notifications immediately
                    <span className="option-hint">
                        (bypassing students' email preferences, if necessary)
                    </span>
                </label>
            </div>

            <div className="required-note">* Required Fields</div>

            {/* Action Buttons */}
            <div className="post-actions">
                <button className="btn-post-primary" onClick={handleSubmit}>
                    Post My {postType === "question" ? "Question" : "Note"} to CS {cid}-02!
                </button>
                <button className="btn-save-draft disabled">Save Draft</button>
                <button className="btn-cancel" onClick={onCancel}>Cancel</button>
            </div>

            {errors.submit && (
                <Alert variant="danger" className="mt-3" dismissible
                       onClose={() => setErrors({ ...errors, submit: "" })}>
                    {errors.submit}
                </Alert>
            )}
        </div>
    );
};

export default NewPostScreen;
