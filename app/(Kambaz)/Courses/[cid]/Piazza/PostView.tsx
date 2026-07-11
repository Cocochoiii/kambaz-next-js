"use client";

import { useEffect, useRef, useState } from "react";
import { Button, Form } from "react-bootstrap";
import KebabMenu from "@/app/(Kambaz)/KebabMenu";
import RichText from "./RichText";
import { isInstructorRole, timeLabel } from "./helpers";
import * as client from "./client";

const displayName = (u: any) =>
    [u?.firstName, u?.lastName].filter(Boolean).join(" ") || u?.username || u?._id || "User";

// Recursively render the replies under a discussion or another reply.
function ReplyList({ parentId, ctx }: any) {
    const replies = ctx.comments.filter((c: any) => c.kind === "reply" && c.parent === parentId);
    if (replies.length === 0 && ctx.replyingTo !== parentId) return null;
    return (
        <div className="ms-4 mt-2 border-start ps-3">
            {replies.map((r: any) => (
                <div key={r._id} className="mb-2">
                    <div className="d-flex justify-content-between">
                        <div className="small text-muted">
                            {r.authorName} · {timeLabel(r.createdAt)}
                        </div>
                        {ctx.canModify(r) && (
                            <KebabMenu items={[
                                { label: "Edit", onClick: () => ctx.startEdit(r) },
                                { label: "Delete", danger: true, onClick: () => ctx.del(r._id) },
                            ]} />
                        )}
                    </div>
                    {ctx.editingId === r._id ? (
                        <div className="mt-1">
                            <RichText value={ctx.editText} onChange={ctx.setEditText} />
                            <div className="mt-1 d-flex gap-2">
                                <Button size="sm" style={{ backgroundColor: "#2563b8", border: "none" }} onClick={ctx.saveEdit}>Save</Button>
                                <Button size="sm" variant="light" onClick={() => ctx.setEditingId(null)}>Cancel</Button>
                            </div>
                        </div>
                    ) : (
                        <div dangerouslySetInnerHTML={{ __html: r.text }} />
                    )}
                    <button className="btn btn-link btn-sm p-0 text-decoration-none" onClick={() => ctx.openReply(r._id)}>Reply</button>
                    {ctx.replyingTo === r._id && <ReplyBox ctx={ctx} parentId={r._id} />}
                    <ReplyList parentId={r._id} ctx={ctx} />
                </div>
            ))}
            {ctx.replyingTo === parentId && replies.length === 0 && <ReplyBox ctx={ctx} parentId={parentId} />}
        </div>
    );
}

// A single reply input box.
function ReplyBox({ ctx, parentId }: any) {
    return (
        <div className="my-2">
            <Form.Control as="textarea" rows={2} placeholder="Write a reply"
                value={ctx.replyText} onChange={(e: any) => ctx.setReplyText(e.target.value)} />
            <div className="mt-1 d-flex gap-2">
                <Button size="sm" style={{ backgroundColor: "#2563b8", border: "none" }}
                    onClick={() => ctx.submitReply(parentId)}>Reply</Button>
                <Button size="sm" variant="light" onClick={() => ctx.setReplyingTo(null)}>Cancel</Button>
            </div>
        </div>
    );
}

export default function PostView({ cid, post, currentUser, isInstructor, onChanged, onDeleted }: any) {
    const [comments, setComments] = useState<any[]>([]);
    const [viewCount, setViewCount] = useState<number>((post.viewers || []).length);
    const [editingPost, setEditingPost] = useState(false);
    const [editSummary, setEditSummary] = useState(post.summary);
    const [editDetails, setEditDetails] = useState(post.details);
    const [studentAnswer, setStudentAnswer] = useState("");
    const [instructorAnswer, setInstructorAnswer] = useState("");
    const [newDiscussion, setNewDiscussion] = useState("");
    // shared edit/reply state for comments
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editText, setEditText] = useState("");
    const [replyingTo, setReplyingTo] = useState<string | null>(null);
    const [replyText, setReplyText] = useState("");
    const viewedRef = useRef<string | null>(null);

    const reload = async () => setComments(await client.findCommentsForPost(post._id));

    useEffect(() => {
        setEditSummary(post.summary);
        setEditDetails(post.details);
        setEditingPost(false);
        setViewCount((post.viewers || []).length);
        reload();
        // mark viewed once per post
        if (viewedRef.current !== post._id && currentUser && !(post.viewers || []).includes(currentUser._id)) {
            viewedRef.current = post._id;
            setViewCount((post.viewers || []).length + 1);
            client.updatePost({ ...post, viewers: [...(post.viewers || []), currentUser._id] });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [post._id]);

    const canModify = (c: any) => isInstructor || c.author === currentUser?._id;

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
    const startEdit = (c: any) => { setEditingId(c._id); setEditText(c.text); };
    const saveEdit = async () => {
        const c = comments.find((x) => x._id === editingId);
        await client.updateComment({ ...c, text: editText });
        setEditingId(null);
        await reload();
    };
    const del = async (id: string) => { await client.deleteComment(id); await reload(); };
    const openReply = (id: string) => { setReplyingTo(id); setReplyText(""); };
    const submitReply = async (parentId: string) => {
        if (!replyText.trim()) return;
        await addComment({ kind: "reply", parent: parentId, text: replyText });
        setReplyingTo(null); setReplyText("");
    };
    const toggleResolved = async (d: any) => { await client.updateComment({ ...d, resolved: !d.resolved }); await reload(); };

    const savePost = async () => {
        await client.updatePost({ ...post, summary: editSummary, details: editDetails });
        setEditingPost(false);
        onChanged();
    };
    const deletePost = async () => {
        if (!window.confirm("Delete this post?")) return;
        await client.deletePost(post._id);
        onDeleted();
    };
    const togglePin = async () => { await client.updatePost({ ...post, pinned: !post.pinned }); onChanged(); };
    const toggleEndorse = async (a: any) => { await client.updateComment({ ...a, endorsed: !a.endorsed }); await reload(); };

    const ctx = { comments, canModify, editingId, editText, setEditingId, setEditText, startEdit, saveEdit, del, replyingTo, setReplyingTo, replyText, setReplyText, openReply, submitReply };

    const studentAnswers = comments.filter((c) => c.kind === "answer" && !isInstructorRole(c.authorRole));
    const instructorAnswers = comments.filter((c) => c.kind === "answer" && isInstructorRole(c.authorRole));
    const discussions = comments.filter((c) => c.kind === "discussion");
    const isStudent = !isInstructor;

    // One answer block (with edit/delete).
    const answerBlock = (a: any) => (
        <div key={a._id} className="border rounded p-2 mb-2">
            <div className="d-flex justify-content-between align-items-start">
                <div className="small text-muted">
                    {a.authorName} · {timeLabel(a.createdAt)}
                    {a.endorsed && <span className="badge bg-success ms-2">✔ Instructor endorsed</span>}
                </div>
                {canModify(a) && (
                    <div className="d-flex align-items-center gap-2">
                        {isInstructor && !isInstructorRole(a.authorRole) && (
                            <Button size="sm" variant={a.endorsed ? "success" : "outline-success"} onClick={() => toggleEndorse(a)}>
                                {a.endorsed ? "Endorsed" : "Endorse"}
                            </Button>
                        )}
                        <Button size="sm" variant="outline-secondary" onClick={() => startEdit(a)}>Edit</Button>
                        <KebabMenu items={[
                            { label: "Edit", onClick: () => startEdit(a) },
                            { label: "Delete", danger: true, onClick: () => del(a._id) },
                        ]} />
                    </div>
                )}
            </div>
            {editingId === a._id ? (
                <div className="mt-1">
                    <RichText value={editText} onChange={setEditText} />
                    <div className="mt-1 d-flex gap-2">
                        <Button size="sm" style={{ backgroundColor: "#2563b8", border: "none" }} onClick={saveEdit}>Save</Button>
                        <Button size="sm" variant="light" onClick={() => setEditingId(null)}>Cancel</Button>
                    </div>
                </div>
            ) : (
                <div dangerouslySetInnerHTML={{ __html: a.text }} />
            )}
        </div>
    );

    return (
        <div className="p-3">
            {/* Post header */}
            <div className="d-flex justify-content-between align-items-start">
                <div className="flex-grow-1">
                    {post.pinned && <div><span className="badge bg-warning text-dark mb-1">Pinned</span></div>}
                    {editingPost ? (
                        <Form.Control className="mb-2 fw-bold" value={editSummary} maxLength={100}
                            onChange={(e) => setEditSummary(e.target.value)} />
                    ) : (
                        <h4 className="fw-bold mb-1">{post.summary}</h4>
                    )}
                    <div className="small text-muted">
                        {viewCount} view{viewCount === 1 ? "" : "s"} ·{" "}
                        {(post.folders || []).join(", ") || "no folder"} ·{" "}
                        {post.authorName} ({isInstructorRole(post.authorRole) ? "Instructor" : "Student"})
                    </div>
                </div>
                {canModify(post) && (
                    <div className="d-flex align-items-center gap-2">
                        <Button size="sm" variant="outline-secondary" onClick={() => setEditingPost(true)}>Edit</Button>
                        <KebabMenu items={[
                            { label: post.pinned ? "Unpin" : "Pin", onClick: togglePin },
                            { label: "Edit", onClick: () => setEditingPost(true) },
                            { label: "Delete", danger: true, onClick: deletePost },
                        ]} />
                    </div>
                )}
            </div>

            <hr />

            {/* Post body */}
            {editingPost ? (
                <div>
                    <RichText value={editDetails} onChange={setEditDetails} />
                    <div className="mt-2 d-flex gap-2">
                        <Button style={{ backgroundColor: "#2563b8", border: "none" }} onClick={savePost}>Save</Button>
                        <Button variant="light" onClick={() => setEditingPost(false)}>Cancel</Button>
                    </div>
                </div>
            ) : (
                <div dangerouslySetInnerHTML={{ __html: post.details }} />
            )}

            {/* Answers (questions only) */}
            {post.type === "question" && (
                <>
                    <h6 className="text-muted mt-4">Student's Answers</h6>
                    <hr className="mt-1" />
                    {studentAnswers.map(answerBlock)}
                    {studentAnswers.length === 0 && isStudent && (
                        <div className="mb-2">
                            <RichText value={studentAnswer} onChange={setStudentAnswer} placeholder="Write the students' collective answer" />
                            <Button className="mt-2" style={{ backgroundColor: "#2563b8", border: "none" }}
                                onClick={async () => { await addComment({ kind: "answer", text: studentAnswer }); setStudentAnswer(""); }}>
                                Submit Answer
                            </Button>
                        </div>
                    )}
                    {studentAnswers.length === 0 && !isStudent && <div className="text-muted small mb-2">No student answer yet.</div>}

                    <h6 className="text-muted mt-4">Instructor's Answers</h6>
                    <hr className="mt-1" />
                    {instructorAnswers.map(answerBlock)}
                    {instructorAnswers.length === 0 && isInstructor && (
                        <div className="mb-2">
                            <RichText value={instructorAnswer} onChange={setInstructorAnswer} placeholder="Write the instructors' answer" />
                            <Button className="mt-2" style={{ backgroundColor: "#2563b8", border: "none" }}
                                onClick={async () => { await addComment({ kind: "answer", text: instructorAnswer }); setInstructorAnswer(""); }}>
                                Submit Answer
                            </Button>
                        </div>
                    )}
                    {instructorAnswers.length === 0 && !isInstructor && <div className="text-muted small mb-2">No instructor answer yet.</div>}
                </>
            )}

            {/* Follow-up discussions */}
            <h6 className="text-muted mt-4">Followup Discussions</h6>
            <hr className="mt-1" />
            {discussions.map((d) => (
                <div key={d._id} className="border rounded p-2 mb-3">
                    <div className="d-flex justify-content-between align-items-start">
                        <div className="small text-muted">{d.authorName} · {timeLabel(d.createdAt)}</div>
                        <div className="d-flex align-items-center gap-2">
                            <Button size="sm" variant={d.resolved ? "success" : "outline-secondary"} onClick={() => toggleResolved(d)}>
                                {d.resolved ? "Resolved" : "Unresolved"}
                            </Button>
                            {canModify(d) && (
                                <KebabMenu items={[
                                    { label: "Edit", onClick: () => startEdit(d) },
                                    { label: "Delete", danger: true, onClick: () => del(d._id) },
                                ]} />
                            )}
                        </div>
                    </div>
                    {editingId === d._id ? (
                        <div className="mt-1">
                            <RichText value={editText} onChange={setEditText} />
                            <div className="mt-1 d-flex gap-2">
                                <Button size="sm" style={{ backgroundColor: "#2563b8", border: "none" }} onClick={saveEdit}>Save</Button>
                                <Button size="sm" variant="light" onClick={() => setEditingId(null)}>Cancel</Button>
                            </div>
                        </div>
                    ) : (
                        <div dangerouslySetInnerHTML={{ __html: d.text }} />
                    )}
                    <button className="btn btn-link btn-sm p-0 text-decoration-none" onClick={() => openReply(d._id)}>Reply</button>
                    {replyingTo === d._id && <ReplyBox ctx={ctx} parentId={d._id} />}
                    <ReplyList parentId={d._id} ctx={ctx} />
                </div>
            ))}

            {/* Start a new followup discussion */}
            <Form.Control as="textarea" rows={2} className="mt-2" placeholder="Start a new followup discussion"
                value={newDiscussion} onChange={(e) => setNewDiscussion(e.target.value)} />
            <Button className="mt-2" style={{ backgroundColor: "#2563b8", border: "none" }}
                onClick={async () => { if (!newDiscussion.trim()) return; await addComment({ kind: "discussion", text: newDiscussion, resolved: false }); setNewDiscussion(""); }}>
                Post Discussion
            </Button>
        </div>
    );
}
