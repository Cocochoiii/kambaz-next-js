"use client";

// The Post Screen. It shows one post, its answers and its followups.
// An answer uses the rich text box. A followup uses a plain textarea.
import { useEffect, useState } from "react";
import { Button, Form } from "react-bootstrap";
import KebabMenu from "../../../KebabMenu";
import RichText from "./RichText";
import { displayName, isInstructorRole, stripHtml, timeLabel } from "./helpers";
import * as client from "./client";

export default function PostView({
  cid,
  post,
  currentUser,
  isInstructor,
  onChanged,
  onDeleted,
}: {
  cid: string;
  post: any;
  currentUser: any;
  isInstructor: boolean;
  onChanged: () => void;
  onDeleted: () => void;
}) {
  const [comments, setComments] = useState<any[]>([]);
  const [views, setViews] = useState<number>((post.viewers || []).length);

  const [editingPost, setEditingPost] = useState(false);
  const [draftSummary, setDraftSummary] = useState(post.summary || "");
  const [draftDetails, setDraftDetails] = useState(post.details || "");

  const [studentAnswer, setStudentAnswer] = useState("");
  const [instructorAnswer, setInstructorAnswer] = useState("");
  const [newDiscussion, setNewDiscussion] = useState("");

  // One comment at a time is open for editing.
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState("");
  // Every discussion and every reply keeps its own draft.
  const [replyDrafts, setReplyDrafts] = useState<Record<string, string>>({});

  const reload = async () => {
    const list = await client.findCommentsForPost(post._id).catch(() => []);
    setComments(list);
  };

  // A new post opens, so I reset the screen and count the reader once.
  useEffect(() => {
    setEditingPost(false);
    setDraftSummary(post.summary || "");
    setDraftDetails(post.details || "");
    setEditingId(null);
    setReplyDrafts({});
    setStudentAnswer("");
    setInstructorAnswer("");
    setNewDiscussion("");
    setViews((post.viewers || []).length);
    reload();

    if (currentUser?._id) {
      client
        .addViewer(post._id, currentUser._id)
        .then((updated: any) => setViews((updated?.viewers || []).length))
        .catch(() => undefined);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [post._id]);

  // An instructor may touch anything. An author may touch their own row.
  const canModify = (row: any) => isInstructor || row.author === currentUser?._id;

  const addComment = async (payload: any) => {
    await client.createComment(post._id, {
      ...payload,
      course: cid,
      author: currentUser?._id,
      authorName: displayName(currentUser),
      authorRole: currentUser?.role,
    });
    await reload();
  };

  const startEdit = (row: any, plain: boolean) => {
    setEditingId(row._id);
    setEditText(plain ? stripHtml(row.text) : row.text);
  };

  const saveEdit = async () => {
    const row = comments.find((one) => one._id === editingId);
    if (row) {
      await client.updateComment({ ...row, text: editText });
    }
    setEditingId(null);
    await reload();
  };

  const removeComment = async (commentId: string) => {
    await client.deleteComment(commentId);
    await reload();
  };

  const setDraft = (id: string, text: string) => {
    setReplyDrafts({ ...replyDrafts, [id]: text });
  };

  const sendReply = async (parentId: string) => {
    const text = (replyDrafts[parentId] || "").trim();
    if (!text) {
      return;
    }
    await addComment({ kind: "reply", parent: parentId, text });
    setDraft(parentId, "");
  };

  const toggleResolved = async (row: any) => {
    await client.updateComment({ ...row, resolved: !row.resolved });
    await reload();
  };

  const savePost = async () => {
    if (!draftSummary.trim() || !stripHtml(draftDetails).trim()) {
      return;
    }
    await client.updatePost({ ...post, summary: draftSummary.trim(), details: draftDetails });
    setEditingPost(false);
    onChanged();
  };

  const removePost = async () => {
    if (!window.confirm("Delete this post?")) {
      return;
    }
    await client.deletePost(post._id);
    onDeleted();
  };

  const togglePin = async () => {
    await client.updatePost({ ...post, pinned: !post.pinned });
    onChanged();
  };

  const studentAnswers = comments.filter(
    (row) => row.kind === "answer" && !isInstructorRole(row.authorRole)
  );
  const instructorAnswers = comments.filter(
    (row) => row.kind === "answer" && isInstructorRole(row.authorRole)
  );
  const discussions = comments.filter((row) => row.kind === "discussion");

  // One answer row. It carries an Edit button and an Actions menu.
  const answerRow = (row: any) => (
    <div key={row._id} className="wd-pazza-card">
      <div className="d-flex justify-content-between align-items-start">
        <div className="small text-muted">
          {row.authorName} &middot; {timeLabel(row.createdAt)}
        </div>
        {canModify(row) && (
          <div className="d-flex align-items-center gap-2">
            <Button size="sm" variant="outline-secondary" onClick={() => startEdit(row, false)}>
              Edit
            </Button>
            <KebabMenu
              items={[
                { label: "Edit", onClick: () => startEdit(row, false) },
                { label: "Delete", danger: true, onClick: () => removeComment(row._id) },
              ]}
            />
          </div>
        )}
      </div>
      {editingId === row._id ? (
        <div className="mt-2">
          <RichText value={editText} onChange={setEditText} />
          <div className="mt-2 d-flex gap-2">
            <Button size="sm" className="wd-pazza-btn" onClick={saveEdit}>Save</Button>
            <Button size="sm" variant="light" onClick={() => setEditingId(null)}>Cancel</Button>
          </div>
        </div>
      ) : (
        <div className="wd-pazza-html" dangerouslySetInnerHTML={{ __html: row.text }} />
      )}
    </div>
  );

  // A reply row. It can hold replies of its own, so it calls itself.
  const replyRow = (row: any, depth: number): any => {
    const children = comments.filter((one) => one.kind === "reply" && one.parent === row._id);
    return (
      <div key={row._id} className="wd-pazza-reply">
        <div className="d-flex justify-content-between align-items-start">
          <div className="small text-muted">
            {row.authorName} &middot; {timeLabel(row.createdAt)}
          </div>
          {canModify(row) && (
            <KebabMenu
              items={[
                { label: "Edit", onClick: () => startEdit(row, true) },
                { label: "Delete", danger: true, onClick: () => removeComment(row._id) },
              ]}
            />
          )}
        </div>

        {editingId === row._id ? (
          <div className="mt-1">
            <Form.Control
              as="textarea"
              rows={2}
              value={editText}
              onChange={(event) => setEditText(event.target.value)}
            />
            <div className="mt-2 d-flex gap-2">
              <Button size="sm" className="wd-pazza-btn" onClick={saveEdit}>Save</Button>
              <Button size="sm" variant="light" onClick={() => setEditingId(null)}>Cancel</Button>
            </div>
          </div>
        ) : (
          <div className="wd-pazza-html" dangerouslySetInnerHTML={{ __html: row.text }} />
        )}

        {/* Every reply can be answered again. */}
        {depth < 4 && (
          <div className="wd-pazza-reply-box">
            <Form.Label htmlFor={`wd-pazza-reply-${row._id}`} className="visually-hidden">
              Reply to this comment
            </Form.Label>
            <Form.Control
              as="textarea"
              rows={1}
              id={`wd-pazza-reply-${row._id}`}
              placeholder="Reply"
              value={replyDrafts[row._id] || ""}
              onChange={(event) => setDraft(row._id, event.target.value)}
            />
            <Button size="sm" className="wd-pazza-btn" onClick={() => sendReply(row._id)}>
              Reply
            </Button>
          </div>
        )}

        {children.map((child) => replyRow(child, depth + 1))}
      </div>
    );
  };

  return (
    <div id="wd-pazza-post" className="p-3">
      {/* The head of the post. */}
      <div className="d-flex justify-content-between align-items-start">
        <div className="flex-grow-1">
          {post.pinned && <span className="badge bg-warning text-dark mb-1">Pinned</span>}
          {editingPost ? (
            <Form.Control
              className="fw-bold mb-2"
              type="text"
              maxLength={100}
              value={draftSummary}
              onChange={(event) => setDraftSummary(event.target.value)}
            />
          ) : (
            <h4 className="fw-bold mb-1">{post.summary}</h4>
          )}
          <div className="small text-muted">
            {views} view{views === 1 ? "" : "s"} &middot;{" "}
            {(post.folders || []).join(", ") || "no folder"} &middot; {post.authorName}{" "}
            ({isInstructorRole(post.authorRole) ? "Instructor" : "Student"}) &middot;{" "}
            {timeLabel(post.createdAt)}
            {post.postTo === "individual" && (
              <span className="badge bg-secondary ms-2">Private</span>
            )}
          </div>
        </div>

        {/* Only an instructor or the author may edit or delete. */}
        {canModify(post) && (
          <div className="d-flex align-items-center gap-2">
            <Button
              id="wd-pazza-edit-post"
              size="sm"
              variant="outline-secondary"
              onClick={() => setEditingPost(true)}
            >
              Edit
            </Button>
            <KebabMenu
              items={[
                { label: post.pinned ? "Unpin" : "Pin", onClick: togglePin },
                { label: "Edit", onClick: () => setEditingPost(true) },
                { label: "Delete", danger: true, onClick: removePost },
              ]}
            />
          </div>
        )}
      </div>

      <hr className="mt-2" />

      {/* The body of the post. */}
      {editingPost ? (
        <div>
          <RichText value={draftDetails} onChange={setDraftDetails} tall />
          <div className="mt-2 d-flex gap-2">
            <Button className="wd-pazza-btn" onClick={savePost}>Save</Button>
            <Button variant="light" onClick={() => setEditingPost(false)}>Cancel</Button>
          </div>
        </div>
      ) : (
        <div className="wd-pazza-html" dangerouslySetInnerHTML={{ __html: post.details }} />
      )}

      {/* A note has no answers. Only a question does. */}
      {post.type === "question" && (
        <>
          <h6 className="wd-pazza-section">Student&apos;s Answers</h6>
          {studentAnswers.map(answerRow)}
          {studentAnswers.length === 0 && !isInstructor && (
            <div className="mb-3">
              <RichText
                value={studentAnswer}
                onChange={setStudentAnswer}
                placeholder="Write the collective answer of the students"
              />
              <Button
                className="wd-pazza-btn mt-2"
                disabled={!stripHtml(studentAnswer).trim()}
                onClick={async () => {
                  await addComment({ kind: "answer", text: studentAnswer });
                  setStudentAnswer("");
                }}
              >
                Submit Student Answer
              </Button>
            </div>
          )}
          {studentAnswers.length === 0 && isInstructor && (
            <div className="text-muted small mb-3">No student answer yet.</div>
          )}

          <h6 className="wd-pazza-section">Instructor&apos;s Answers</h6>
          {instructorAnswers.map(answerRow)}
          {instructorAnswers.length === 0 && isInstructor && (
            <div className="mb-3">
              <RichText
                value={instructorAnswer}
                onChange={setInstructorAnswer}
                placeholder="Write the answer of the instructors"
              />
              <Button
                className="wd-pazza-btn mt-2"
                disabled={!stripHtml(instructorAnswer).trim()}
                onClick={async () => {
                  await addComment({ kind: "answer", text: instructorAnswer });
                  setInstructorAnswer("");
                }}
              >
                Submit Instructor Answer
              </Button>
            </div>
          )}
          {instructorAnswers.length === 0 && !isInstructor && (
            <div className="text-muted small mb-3">No instructor answer yet.</div>
          )}
        </>
      )}

      {/* The followup discussions sit under the answers. */}
      <h6 className="wd-pazza-section">Followup Discussions</h6>

      {discussions.map((row) => (
        <div key={row._id} className="wd-pazza-card">
          <div className="d-flex justify-content-between align-items-start">
            <div className="small text-muted">
              {row.authorName} &middot; {timeLabel(row.createdAt)}
            </div>
            <div className="d-flex align-items-center gap-2">
              <Button
                size="sm"
                variant={row.resolved ? "success" : "outline-secondary"}
                onClick={() => toggleResolved(row)}
              >
                {row.resolved ? "Resolved" : "Unresolved"}
              </Button>
              {canModify(row) && (
                <KebabMenu
                  items={[
                    { label: "Edit", onClick: () => startEdit(row, true) },
                    { label: "Delete", danger: true, onClick: () => removeComment(row._id) },
                  ]}
                />
              )}
            </div>
          </div>

          {editingId === row._id ? (
            <div className="mt-1">
              <Form.Control
                as="textarea"
                rows={2}
                value={editText}
                onChange={(event) => setEditText(event.target.value)}
              />
              <div className="mt-2 d-flex gap-2">
                <Button size="sm" className="wd-pazza-btn" onClick={saveEdit}>Save</Button>
                <Button size="sm" variant="light" onClick={() => setEditingId(null)}>Cancel</Button>
              </div>
            </div>
          ) : (
            <div className="wd-pazza-html" dangerouslySetInnerHTML={{ __html: row.text }} />
          )}

          {/* The reply box of the discussion. */}
          <div className="wd-pazza-reply-box">
            <Form.Label htmlFor={`wd-pazza-reply-${row._id}`} className="visually-hidden">
              Reply to this discussion
            </Form.Label>
            <Form.Control
              as="textarea"
              rows={1}
              id={`wd-pazza-reply-${row._id}`}
              placeholder="Reply"
              value={replyDrafts[row._id] || ""}
              onChange={(event) => setDraft(row._id, event.target.value)}
            />
            <Button size="sm" className="wd-pazza-btn" onClick={() => sendReply(row._id)}>
              Reply
            </Button>
          </div>

          {comments
            .filter((one) => one.kind === "reply" && one.parent === row._id)
            .map((child) => replyRow(child, 1))}
        </div>
      ))}

      {/* A brand new followup discussion. */}
      <Form.Group className="mt-3">
        <Form.Label htmlFor="wd-pazza-new-discussion" className="fw-semibold">
          Start a new followup discussion
        </Form.Label>
        <Form.Control
          as="textarea"
          rows={2}
          id="wd-pazza-new-discussion"
          placeholder="Start a new followup discussion"
          value={newDiscussion}
          onChange={(event) => setNewDiscussion(event.target.value)}
        />
        <Button
          className="wd-pazza-btn mt-2"
          disabled={!newDiscussion.trim()}
          onClick={async () => {
            await addComment({ kind: "discussion", text: newDiscussion.trim(), resolved: false });
            setNewDiscussion("");
          }}
        >
          Post Discussion
        </Button>
      </Form.Group>
    </div>
  );
}
