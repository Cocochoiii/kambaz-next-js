"use client";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import dynamic from "next/dynamic";
import { createPost } from "./pazzaReducer";

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
import "react-quill/dist/quill.snow.css";

interface NewPostProps {
    courseId: string;
    folders: any[];
    onCancel: () => void;
    onSuccess: () => void;
}

export default function NewPost({ courseId, folders = [], onCancel, onSuccess }: NewPostProps) {
    const dispatch = useDispatch();
    const currentUser = useSelector((state: any) => state.auth?.currentUser);
    const enrollments = useSelector((state: any) => state.enrollments?.enrollments || []);

    const [postType, setPostType] = useState<"question" | "note">("question");
    const [postTo, setPostTo] = useState("entire_class");
    const [selectedFolders, setSelectedFolders] = useState<string[]>([]);
    const [visibleTo, setVisibleTo] = useState<string[]>([]);
    const [summary, setSummary] = useState("");
    const [details, setDetails] = useState("");
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    // Get course enrollments for individual posting
    const courseEnrollments = enrollments.filter((e: any) => e.course === courseId);

    const handleFolderToggle = (folderName: string) => {
        if (selectedFolders.includes(folderName)) {
            setSelectedFolders(selectedFolders.filter(f => f !== folderName));
        } else {
            setSelectedFolders([...selectedFolders, folderName]);
        }
    };

    const handleUserToggle = (userId: string) => {
        if (visibleTo.includes(userId)) {
            setVisibleTo(visibleTo.filter(u => u !== userId));
        } else {
            setVisibleTo([...visibleTo, userId]);
        }
    };

    const handleSubmit = async () => {
        const newErrors: { [key: string]: string } = {};

        // Validate required fields
        if (!summary.trim()) {
            newErrors.summary = "Summary is required";
        }
        if (summary.length > 100) {
            newErrors.summary = "Summary must be 100 characters or less";
        }
        if (!details.trim() || details === "<p><br></p>") {
            newErrors.details = "Details are required";
        }
        if (selectedFolders.length === 0) {
            newErrors.folders = "At least one folder must be selected";
        }
        if (postTo === "individual" && visibleTo.length === 0) {
            newErrors.visibleTo = "At least one recipient must be selected";
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        const postData = {
            type: postType,
            title: summary,
            details,
            folders: selectedFolders,
            postTo,
            visibleTo: postTo === "individual" ? visibleTo : []
        };

        try {
            await dispatch(createPost({ courseId, post: postData }) as any);
            onSuccess();
        } catch (error) {
            console.error("Error creating post:", error);
        }
    };

    const modules = {
        toolbar: [
            ["bold", "italic", "underline", "strike"],
            [{ list: "ordered" }, { list: "bullet" }],
            [{ indent: "-1" }, { indent: "+1" }],
            [{ header: [1, 2, 3, false] }],
            ["link", "image", "video"],
            ["clean"]
        ]
    };

    // Ensure folders is an array
    const foldersArray = Array.isArray(folders) ? folders : [];

    return (
        <div className="new-post-container">
            <div className="post-type-tabs">
                <button
                    className={`type-tab ${postType === "question" ? "active" : ""}`}
                    onClick={() => setPostType("question")}
                >
                    <input type="radio" checked={postType === "question"} readOnly />
                    Question
                    <span className="subtitle">if you need an answer</span>
                </button>
                <button
                    className={`type-tab ${postType === "note" ? "active" : ""}`}
                    onClick={() => setPostType("note")}
                >
                    <input type="radio" checked={postType === "note"} readOnly />
                    Note
                    <span className="subtitle">if you don't need an answer</span>
                </button>
                <button className="type-tab disabled">
                    <input type="radio" disabled />
                    Poll/In-Class Response
                    <span className="subtitle">if you need a vote</span>
                </button>
            </div>

            <div className="post-to-section">
                <label>Post To*</label>
                <div className="post-to-options">
                    <button
                        className={`post-to-option ${postTo === "entire_class" ? "active" : ""}`}
                        onClick={() => setPostTo("entire_class")}
                    >
                        <input type="radio" checked={postTo === "entire_class"} readOnly />
                        Entire Class
                    </button>
                    <button
                        className={`post-to-option ${postTo === "individual" ? "active" : ""}`}
                        onClick={() => setPostTo("individual")}
                    >
                        <input type="radio" checked={postTo === "individual"} readOnly />
                        Individual Student(s) / Instructor(s)
                    </button>
                </div>

                {postTo === "individual" && courseEnrollments.length > 0 && (
                    <div className="user-selection">
                        <div className="user-checkbox">
                            <input
                                type="checkbox"
                                id="instructors"
                                onChange={(e) => {
                                    const instructors = courseEnrollments
                                        .filter((e: any) => e.role === "INSTRUCTOR")
                                        .map((e: any) => e.user);
                                    if (e.target.checked) {
                                        setVisibleTo([...new Set([...visibleTo, ...instructors])]);
                                    } else {
                                        setVisibleTo(visibleTo.filter(u => !instructors.includes(u)));
                                    }
                                }}
                            />
                            <label htmlFor="instructors">Instructors</label>
                        </div>
                        {courseEnrollments.map((enrollment: any) => (
                            <div key={enrollment._id} className="user-checkbox">
                                <input
                                    type="checkbox"
                                    id={enrollment.user}
                                    checked={visibleTo.includes(enrollment.user)}
                                    onChange={() => handleUserToggle(enrollment.user)}
                                />
                                <label htmlFor={enrollment.user}>
                                    {enrollment.user} ({enrollment.role})
                                </label>
                            </div>
                        ))}
                        {errors.visibleTo && (
                            <div className="error-message">{errors.visibleTo}</div>
                        )}
                    </div>
                )}
            </div>

            <div className="folder-selection">
                <label>Select Folder(s)*</label>
                <div className="folder-checkboxes">
                    {foldersArray.length === 0 ? (
                        <div className="no-folders-message">
                            No folders available. Please wait while folders are being initialized...
                        </div>
                    ) : (
                        foldersArray.map((folder: any) => (
                            <button
                                key={folder._id || folder.name}
                                className={`folder-chip ${selectedFolders.includes(folder.name) ? "selected" : ""}`}
                                onClick={() => handleFolderToggle(folder.name)}
                            >
                                {folder.name}
                            </button>
                        ))
                    )}
                </div>
                <a href="#" onClick={(e) => { e.preventDefault(); }}>
                    Manage and reorder folders
                </a>
                {errors.folders && (
                    <div className="error-message">{errors.folders}</div>
                )}
            </div>

            <div className="summary-section">
                <label>Summary*</label>
                <input
                    type="text"
                    placeholder="Enter a one line summary, 100 characters or less"
                    value={summary}
                    onChange={(e) => {
                        setSummary(e.target.value);
                        setErrors({ ...errors, summary: "" });
                    }}
                    maxLength={100}
                    className={errors.summary ? "error" : ""}
                />
                <span className="char-count">{summary.length}/100</span>
                {errors.summary && (
                    <div className="error-message">{errors.summary}</div>
                )}
            </div>

            <div className="details-section">
                <label>Details*</label>
                <div className="editor-tabs">
                    <button className="editor-tab active">Rich text editor</button>
                    <button className="editor-tab disabled">Plain text editor</button>
                    <button className="editor-tab disabled">Markdown editor</button>
                    <button className="preview-tab disabled">preview</button>
                </div>
                <ReactQuill
                    theme="snow"
                    value={details}
                    onChange={(value) => {
                        setDetails(value);
                        setErrors({ ...errors, details: "" });
                    }}
                    modules={modules}
                    placeholder="Enter your question or note details here..."
                    className={errors.details ? "error" : ""}
                />
                {errors.details && (
                    <div className="error-message">{errors.details}</div>
                )}
            </div>

            <div className="post-options">
                <label>Posting Options</label>
                <div className="option-checkboxes">
                    <label>
                        <input type="checkbox" />
                        Send email notifications immediately
                        <span className="option-hint">(bypassing students' email preferences, if necessary)</span>
                    </label>
                </div>
                <div className="required-note">* Required fields</div>
            </div>

            <div className="post-actions">
                <button className="btn-primary" onClick={handleSubmit}>
                    Post My {postType === "question" ? "Question" : "Note"} to CS {courseId}!
                </button>
                <button className="btn-draft disabled">Save Draft</button>
                <button className="btn-cancel" onClick={onCancel}>Cancel</button>
            </div>
        </div>
    );
}