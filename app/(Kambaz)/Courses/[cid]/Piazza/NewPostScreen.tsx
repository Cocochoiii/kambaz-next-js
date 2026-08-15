"use client";

// The New Post Screen. Here an author writes a question or a note.
// Every required field says so, and it complains right under itself.
import { useState } from "react";
import Link from "next/link";
import { Button, Form } from "react-bootstrap";
import { FaPlus } from "react-icons/fa";
import RichText from "./RichText";
import { displayName, stripHtml } from "./helpers";
import * as client from "./client";

export default function NewPostScreen({
  cid,
  currentUser,
  folders,
  users,
  isInstructor,
  onCancel,
  onCreated,
}: {
  cid: string;
  currentUser: any;
  folders: any[];
  users: any[];
  isInstructor: boolean;
  onCancel: () => void;
  onCreated: (post: any) => void;
}) {
  const [type, setType] = useState("question");
  const [postTo, setPostTo] = useState("all");
  const [recipients, setRecipients] = useState<string[]>([]);
  const [chosenFolders, setChosenFolders] = useState<string[]>([]);
  const [summary, setSummary] = useState("");
  const [details, setDetails] = useState("");
  const [errors, setErrors] = useState<any>({});
  const [saving, setSaving] = useState(false);

  // One toggle for both checkbox lists.
  const toggle = (list: string[], value: string, set: (next: string[]) => void) => {
    set(list.includes(value) ? list.filter((one) => one !== value) : [...list, value]);
  };

  const submit = async () => {
    const found: any = {};
    if (!summary.trim()) {
      found.summary = "A summary is required.";
    } else if (summary.length > 100) {
      found.summary = "A summary is 100 characters or less.";
    }
    if (!stripHtml(details).trim()) {
      found.details = "Details are required.";
    }
    if (chosenFolders.length === 0) {
      found.folders = "Pick at least one folder.";
    }
    if (postTo === "individual" && recipients.length === 0) {
      found.recipients = "Pick at least one reader.";
    }
    setErrors(found);
    if (Object.keys(found).length > 0) {
      return;
    }

    setSaving(true);
    try {
      const post = await client.createPost(cid, {
        type,
        postTo,
        recipients: postTo === "individual" ? recipients : [],
        folders: chosenFolders,
        summary: summary.trim(),
        details,
        author: currentUser?._id,
        authorName: displayName(currentUser),
        authorRole: currentUser?.role,
      });
      onCreated(post);
    } finally {
      setSaving(false);
    }
  };

  const required = <span className="text-danger">*</span>;

  return (
    <div id="wd-pazza-new-post" className="p-3">
      <h5 className="mb-3">
        <FaPlus className="me-2" />
        New Post
      </h5>

      {/* The three post type tabs. Question is the one that starts open. */}
      <div className="mb-1 fw-semibold">Post Type {required}</div>
      <div className="wd-pazza-pt-tabs mb-3">
        <button
          type="button"
          id="wd-pazza-type-question"
          className={`wd-pazza-pt-tab ${type === "question" ? "wd-pazza-pt-active" : ""}`}
          onClick={() => setType("question")}
        >
          Question
        </button>
        <button
          type="button"
          id="wd-pazza-type-note"
          className={`wd-pazza-pt-tab ${type === "note" ? "wd-pazza-pt-active" : ""}`}
          onClick={() => setType("note")}
        >
          Note
        </button>
        <span className="wd-pazza-pt-tab wd-pazza-pt-off">Poll / In-Class Response</span>
      </div>

      {/* Who may read the post. One choice only, so these are radios. */}
      <Form.Group className="mb-3">
        <Form.Label className="fw-semibold">Post to {required}</Form.Label>
        <div>
          <Form.Check
            inline
            type="radio"
            name="wd-pazza-post-to"
            id="wd-pazza-post-to-all"
            label="Entire Class"
            checked={postTo === "all"}
            onChange={() => setPostTo("all")}
          />
          <Form.Check
            inline
            type="radio"
            name="wd-pazza-post-to"
            id="wd-pazza-post-to-individual"
            label="Individual Students / Instructors"
            checked={postTo === "individual"}
            onChange={() => setPostTo("individual")}
          />
        </div>

        {postTo === "individual" && (
          <div className="wd-pazza-recipients mt-2">
            <Form.Check
              type="checkbox"
              id="wd-pazza-recipient-instructors"
              label="Instructors"
              checked={recipients.includes("INSTRUCTORS")}
              onChange={() => toggle(recipients, "INSTRUCTORS", setRecipients)}
            />
            {users.map((user: any) => (
              <Form.Check
                key={user._id}
                type="checkbox"
                id={`wd-pazza-recipient-${user._id}`}
                label={`${displayName(user)} (${user.role})`}
                checked={recipients.includes(user._id)}
                onChange={() => toggle(recipients, user._id, setRecipients)}
              />
            ))}
          </div>
        )}
        {errors.recipients && <div className="text-danger small mt-1">{errors.recipients}</div>}
      </Form.Group>

      {/* The folders. A post may sit in many, so these are check boxes. */}
      <Form.Group className="mb-3">
        <div className="d-flex justify-content-between align-items-center">
          <Form.Label className="fw-semibold mb-0">Select Folder(s) {required}</Form.Label>
          {isInstructor && (
            <Link href={`/Courses/${cid}/Piazza/ManageClass`} className="small">
              Manage and reorder folders
            </Link>
          )}
        </div>
        <div className="wd-pazza-folder-picker mt-2">
          {folders.map((folder: any) => (
            <span key={folder._id}>
              <input
                type="checkbox"
                className="btn-check"
                id={`wd-pazza-pick-${folder._id}`}
                autoComplete="off"
                checked={chosenFolders.includes(folder.name)}
                onChange={() => toggle(chosenFolders, folder.name, setChosenFolders)}
              />
              <label className="btn btn-sm wd-pazza-chip" htmlFor={`wd-pazza-pick-${folder._id}`}>
                {folder.name}
              </label>
            </span>
          ))}
          {folders.length === 0 && (
            <span className="text-muted small">This course has no folders yet.</span>
          )}
        </div>
        {errors.folders && <div className="text-danger small mt-1">{errors.folders}</div>}
      </Form.Group>

      {/* The summary is the title of the post. */}
      <Form.Group className="mb-3">
        <Form.Label htmlFor="wd-pazza-summary" className="fw-semibold">
          Summary {required}
        </Form.Label>
        <Form.Control
          id="wd-pazza-summary"
          type="text"
          maxLength={100}
          placeholder="Enter a one line summary, 100 characters or less"
          value={summary}
          onChange={(event) => setSummary(event.target.value)}
        />
        <div className="text-muted small text-end">{summary.length} / 100</div>
        {errors.summary && <div className="text-danger small">{errors.summary}</div>}
      </Form.Group>

      {/* The body of the post. Rich text only. */}
      <Form.Group className="mb-3">
        <Form.Label className="fw-semibold">Details {required}</Form.Label>
        <RichText
          value={details}
          onChange={setDetails}
          placeholder="Enter the details of your post here"
          tall
        />
        {errors.details && <div className="text-danger small mt-1">{errors.details}</div>}
      </Form.Group>

      <div className="d-flex gap-2">
        <Button id="wd-pazza-post-btn" className="wd-pazza-btn" onClick={submit} disabled={saving}>
          {type === "note" ? "Post My Note" : "Post My Question"}
        </Button>
        <Button id="wd-pazza-cancel-btn" variant="light" onClick={onCancel} disabled={saving}>
          Cancel
        </Button>
      </div>
    </div>
  );
}
