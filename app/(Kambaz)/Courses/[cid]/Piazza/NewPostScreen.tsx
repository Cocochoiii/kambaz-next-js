"use client";

import { useState } from "react";
import Link from "next/link";
import { Form, Button } from "react-bootstrap";
import { FaArrowLeft, FaPlus } from "react-icons/fa";
import RichText from "./RichText";
import { stripHtml } from "./helpers";
import * as client from "./client";

// The New Post Screen (NPS): choose type, audience, folders, summary and details.
export default function NewPostScreen({ cid, currentUser, folders, users, onCancel, onCreated }: any) {
    const [type, setType] = useState("question");
    const [postTo, setPostTo] = useState("all");
    const [recipients, setRecipients] = useState<string[]>([]);
    const [selFolders, setSelFolders] = useState<string[]>([]);
    const [summary, setSummary] = useState("");
    const [details, setDetails] = useState("");
    const [errors, setErrors] = useState<any>({});

    const toggle = (arr: string[], v: string, set: (x: string[]) => void) =>
        set(arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v]);

    const submit = async () => {
        const e: any = {};
        if (!summary.trim()) e.summary = "Summary is required.";
        else if (summary.length > 100) e.summary = "Summary must be 100 characters or fewer.";
        if (!stripHtml(details).trim()) e.details = "Details are required.";
        if (selFolders.length === 0) e.folders = "Select at least one folder.";
        if (postTo === "individual" && recipients.length === 0) e.recipients = "Select at least one recipient.";
        setErrors(e);
        if (Object.keys(e).length) return;

        const post = await client.createPost(cid, {
            type,
            postTo,
            recipients: postTo === "individual" ? recipients : [],
            folders: selFolders,
            summary: summary.trim(),
            details,
            author: currentUser?._id,
            authorName:
                [currentUser?.firstName, currentUser?.lastName].filter(Boolean).join(" ") ||
                currentUser?.username || currentUser?._id,
            authorRole: currentUser?.role,
        });
        onCreated(post);
    };

    const tabStyle = (active: boolean) => ({
        cursor: "pointer",
        fontWeight: active ? 700 : 400,
        color: active ? "#2563b8" : "#555",
        borderBottom: active ? "3px solid #2563b8" : "3px solid transparent",
    });
    const req = <span className="text-danger">*</span>;

    return (
        <div className="p-3">
            {/* Header */}
            <div className="d-flex align-items-center gap-2 mb-3">
                <FaArrowLeft role="button" title="Back" onClick={onCancel} />
                <FaPlus />
                <h5 className="mb-0">New Post</h5>
            </div>

            {/* Post Type Tabs */}
            <Form.Label className="fw-semibold">Post Type {req}</Form.Label>
            <div className="d-flex gap-4 border-bottom mb-3 pb-1">
                <span style={tabStyle(type === "question")} onClick={() => setType("question")} className="pb-1">Question</span>
                <span style={tabStyle(type === "note")} onClick={() => setType("note")} className="pb-1">Note</span>
                <span className="pb-1 text-muted" style={{ cursor: "not-allowed" }}>Poll/In-Class Response</span>
            </div>

            {/* Post To */}
            <Form.Group className="mb-3">
                <Form.Label className="fw-semibold">Post to {req}</Form.Label>
                <div>
                    <Form.Check inline type="radio" name="wd-post-to" id="wd-post-all" label="Entire Class"
                        checked={postTo === "all"} onChange={() => setPostTo("all")} />
                    <Form.Check inline type="radio" name="wd-post-to" id="wd-post-individual" label="Individual Students/Instructors"
                        checked={postTo === "individual"} onChange={() => setPostTo("individual")} />
                </div>
                {postTo === "individual" && (
                    <div className="border rounded p-2 mt-2" style={{ maxHeight: 160, overflow: "auto" }}>
                        <Form.Check type="checkbox" id="wd-recip-instructors" label="Instructors"
                            checked={recipients.includes("INSTRUCTORS")}
                            onChange={() => toggle(recipients, "INSTRUCTORS", setRecipients)} />
                        {users.map((u: any) => (
                            <Form.Check key={u._id} type="checkbox" id={`wd-recip-${u._id}`}
                                label={`${u.firstName} ${u.lastName} (${u.role})`}
                                checked={recipients.includes(u._id)}
                                onChange={() => toggle(recipients, u._id, setRecipients)} />
                        ))}
                    </div>
                )}
                {errors.recipients && <div className="text-danger small mt-1">{errors.recipients}</div>}
            </Form.Group>

            {/* Select Folders (clickable pills, multi-select) */}
            <Form.Group className="mb-3">
                <div className="d-flex justify-content-between align-items-center">
                    <Form.Label className="fw-semibold mb-0">Select Folder(s) {req}</Form.Label>
                    <Link href={`/Courses/${cid}/Piazza/ManageClass`} className="small text-decoration-none">
                        Manage and reorder folders
                    </Link>
                </div>
                <div className="d-flex flex-wrap gap-2 mt-2">
                    {folders.map((f: any) => {
                        const on = selFolders.includes(f.name);
                        return (
                            <span key={f._id} role="button" id={`wd-folder-${f._id}`}
                                onClick={() => toggle(selFolders, f.name, setSelFolders)}
                                className="px-3 py-1 rounded-pill"
                                style={{
                                    cursor: "pointer",
                                    background: on ? "#2563b8" : "#eaf1fb",
                                    color: on ? "#fff" : "#2563b8",
                                    border: `1px solid ${on ? "#2563b8" : "#cdddf5"}`,
                                    fontWeight: on ? 600 : 400,
                                }}>
                                {f.name}
                            </span>
                        );
                    })}
                </div>
                {errors.folders && <div className="text-danger small mt-1">{errors.folders}</div>}
            </Form.Group>

            {/* Summary */}
            <Form.Group className="mb-3">
                <Form.Label className="fw-semibold">Summary {req}</Form.Label>
                <Form.Control
                    id="wd-post-summary"
                    maxLength={100}
                    placeholder="Enter a one line summary, 100 characters or less"
                    value={summary}
                    onChange={(e) => setSummary(e.target.value)}
                />
                <div className="text-muted small text-end">{summary.length}/100</div>
                {errors.summary && <div className="text-danger small">{errors.summary}</div>}
            </Form.Group>

            {/* Details (rich text) */}
            <Form.Group className="mb-3">
                <Form.Label className="fw-semibold">Details {req}</Form.Label>
                <RichText value={details} onChange={setDetails} placeholder="Enter the details of your post here" minHeight={220} />
                {errors.details && <div className="text-danger small mt-1">{errors.details}</div>}
            </Form.Group>

            <div className="d-flex gap-2">
                <Button style={{ backgroundColor: "#2563b8", border: "none" }} onClick={submit}>
                    {type === "note" ? "Post My Note" : "Post My Question"}
                </Button>
                <Button variant="light" onClick={onCancel}>Cancel</Button>
            </div>
        </div>
    );
}
