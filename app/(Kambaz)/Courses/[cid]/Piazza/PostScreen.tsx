"use client";
import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "next/navigation";
import { Badge, Button, Dropdown } from "react-bootstrap";
import { format } from "date-fns";
import dynamic from "next/dynamic";
import {
    createAnswer,
    createFollowup,
    toggleFollowupResolved,
    updatePost,
    deletePost,
    updateAnswer,
    deleteAnswer,
} from "./pazzaReducer";
import { FaEdit, FaTrash, FaEllipsisV, FaStar, FaLock, FaCheck, FaTimes } from "react-icons/fa";

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
import "react-quill/dist/quill.snow.css";

const PostScreen: React.FC = () => {
    const params = useParams();
    const courseId = params?.cid as string;
    const dispatch = useDispatch<any>();

    const { currentPost, currentAnswers = [], currentFollowups = [] } =
        useSelector((state: any) => state.pazza || {});
    const currentUser = useSelector((state: any) => state.accountReducer?.currentUser);

    const [showAnswerEditor, setShowAnswerEditor] = useState(false);
    const [answerContent, setAnswerContent] = useState("");
    const [followupContent, setFollowupContent] = useState("");
    const [replyContent, setReplyContent] = useState<{ [key: string]: string }>({});
    const [showReplyEditor, setShowReplyEditor] = useState<{ [key: string]: boolean }>({});
    const [editingPost, setEditingPost] = useState(false);
    const [editedContent, setEditedContent] = useState("");
    const [editingAnswerId, setEditingAnswerId] = useState<string | null>(null);
    const [editAnswerContent, setEditAnswerContent] = useState("");

    if (!currentPost) return null;

    const isInstructor = ["FACULTY", "TA", "INSTRUCTOR"].includes(currentUser?.role);
    const isAuthor = currentUser?._id === currentPost.author?._id || currentUser?._id === currentPost.authorId;
    const canEdit = isInstructor || isAuthor;

    const studentAnswers = currentAnswers.filter(
        (a: any) => !["FACULTY", "TA", "INSTRUCTOR"].includes(a.authorRole || a.author?.role)
    );
    const instructorAnswers = currentAnswers.filter((a: any) =>
        ["FACULTY", "TA", "INSTRUCTOR"].includes(a.authorRole || a.author?.role)
    );

    const hasAnswered = currentAnswers.some(
        (a: any) => a.authorId === currentUser?._id || a.author?._id === currentUser?._id
    );

    const rootFollowups = currentFollowups.filter((f: any) => !f.parentId);
    const getReplies = (parentId: string) => currentFollowups.filter((f: any) => f.parentId === parentId);

    const quillModules = {
        toolbar: [
            ["bold", "italic", "underline"],
            [{ list: "ordered" }, { list: "bullet" }],
            ["link", "image"],
            ["clean"],
        ],
    };

    const getAuthorName = (item: any) => {
        if (item.authorName) return item.authorName;
        if (item.author?.firstName && item.author?.lastName) return `${item.author.firstName} ${item.author.lastName}`;
        return "Unknown User";
    };

    return (
        <div className="post-details">
            {/* header bar */}
            <div className="post-header-bar">
                <h1>
                    {currentPost.type === "question" ? "question" : "note"} @{currentPost._id?.substring(0, 3)}
                    {currentPost.hasInstructorAnswer && <FaStar className="starred" />}
                    {currentPost.postTo === "individual" && <FaLock style={{ marginLeft: 6 }} />}
                </h1>
                <span className="view-count">
          {currentPost.views || 1} view{(currentPost.views || 1) !== 1 ? "s" : ""}
        </span>
            </div>

            {/* main post content */}
            <div className="post-content">
                {editingPost ? (
                    <>
                        <input
                            type="text"
                            value={currentPost.summary || currentPost.title}
                            readOnly
                            className="edit-title"
                        />
                        <ReactQuill theme="snow" value={editedContent} onChange={setEditedContent} modules={quillModules} />
                        <div className="edit-actions">
                            <button
                                className="btn-save"
                                onClick={async () => {
                                    await dispatch(
                                        updatePost({
                                            courseId,
                                            postId: currentPost._id,
                                            title: currentPost.summary || currentPost.title,
                                            details: editedContent,
                                        })
                                    );
                                    setEditingPost(false);
                                }}
                            >
                                Save
                            </button>
                            <button className="btn-cancel" onClick={() => setEditingPost(false)}>
                                Cancel
                            </button>
                        </div>
                    </>
                ) : (
                    <>
                        <h2>{currentPost.summary || currentPost.title}</h2>
                        <div className="post-meta">
                            <span className="folder-tag">{(currentPost.folders || []).join(", ")}</span>
                            <span className="author">
                {["FACULTY", "TA", "INSTRUCTOR"].includes(currentPost.author?.role || currentPost.authorRole)
                    ? "Instr"
                    : "Student"}
                                : {getAuthorName(currentPost)}
              </span>
                            <span className="timestamp">{format(new Date(currentPost.createdAt), "MMM d 'at' h:mm a")}</span>

                            {canEdit && (
                                <div className="post-actions">
                                    <button className="btn-edit" onClick={() => { setEditingPost(true); setEditedContent(currentPost.details); }}>
                                        <FaEdit /> Edit
                                    </button>
                                    <div className="dropdown">
                                        <button className="btn-actions">
                                            <FaEllipsisV /> Actions
                                        </button>
                                        <div className="dropdown-content">
                                            <button onClick={() => { setEditingPost(true); setEditedContent(currentPost.details); }}>Edit</button>
                                            <button
                                                onClick={() => {
                                                    if (confirm("Delete this post?")) {
                                                        dispatch(deletePost({ courseId, postId: currentPost._id }));
                                                    }
                                                }}
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="post-body" dangerouslySetInnerHTML={{ __html: currentPost.details }} />
                    </>
                )}
            </div>

            {/* answers */}
            {currentPost.type === "question" && (
                <>
                    {/* Students' Answers */}
                    {(studentAnswers.length > 0 || (!hasAnswered && !isInstructor)) && (
                        <div className="answers-section">
                            <h3>Students' Answer{studentAnswers.length > 1 ? "s" : ""}</h3>

                            {studentAnswers.map((answer: any) => (
                                <div key={answer._id} className="answer">
                                    {editingAnswerId === answer._id ? (
                                        <>
                                            <ReactQuill
                                                theme="snow"
                                                value={editAnswerContent}
                                                onChange={setEditAnswerContent}
                                                modules={quillModules}
                                            />
                                            <div className="edit-actions">
                                                <button
                                                    className="btn-save"
                                                    onClick={async () => {
                                                        await dispatch(updateAnswer({ courseId, answerId: answer._id, content: editAnswerContent }));
                                                        setEditingAnswerId(null);
                                                        setEditAnswerContent("");
                                                    }}
                                                >
                                                    Save
                                                </button>
                                                <button className="btn-cancel" onClick={() => setEditingAnswerId(null)}>
                                                    Cancel
                                                </button>
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <div className="answer-meta">
                                                <span className="author">{getAuthorName(answer)}</span>
                                                <span className="timestamp">{format(new Date(answer.createdAt), "MMM d 'at' h:mm a")}</span>
                                                {(currentUser?._id === answer.authorId || isInstructor) && (
                                                    <div className="answer-actions">
                                                        <button
                                                            onClick={() => {
                                                                setEditingAnswerId(answer._id);
                                                                setEditAnswerContent(answer.content);
                                                            }}
                                                        >
                                                            <FaEdit /> Edit
                                                        </button>
                                                        <button onClick={() => dispatch(deleteAnswer({ courseId, answerId: answer._id }))}>
                                                            <FaTrash /> Delete
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                            <div className="answer-body" dangerouslySetInnerHTML={{ __html: answer.content }} />
                                            {answer.isGoodAnswer && <div className="good-answer">Good answer</div>}
                                        </>
                                    )}
                                </div>
                            ))}

                            {!hasAnswered && !isInstructor && (
                                <div className="new-answer">
                                    <ReactQuill
                                        theme="snow"
                                        value={answerContent}
                                        onChange={setAnswerContent}
                                        modules={quillModules}
                                        placeholder="Type your answer here..."
                                    />
                                    <button
                                        className="btn-submit"
                                        onClick={async () => {
                                            if (!answerContent.trim() || answerContent === "<p><br></p>") return;
                                            await dispatch(createAnswer({ courseId, postId: currentPost._id, content: answerContent }));
                                            setAnswerContent("");
                                        }}
                                    >
                                        Submit Answer
                                    </button>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Instructors' Answers */}
                    {(instructorAnswers.length > 0 || (!hasAnswered && isInstructor)) && (
                        <div className="answers-section">
                            <h3>Instructors' Answer{instructorAnswers.length > 1 ? "s" : ""}</h3>

                            {instructorAnswers.map((answer: any) => (
                                <div key={answer._id} className="answer instructor-answer">
                                    {editingAnswerId === answer._id ? (
                                        <>
                                            <ReactQuill
                                                theme="snow"
                                                value={editAnswerContent}
                                                onChange={setEditAnswerContent}
                                                modules={quillModules}
                                            />
                                            <div className="edit-actions">
                                                <button
                                                    className="btn-save"
                                                    onClick={async () => {
                                                        await dispatch(updateAnswer({ courseId, answerId: answer._id, content: editAnswerContent }));
                                                        setEditingAnswerId(null);
                                                        setEditAnswerContent("");
                                                    }}
                                                >
                                                    Save
                                                </button>
                                                <button className="btn-cancel" onClick={() => setEditingAnswerId(null)}>
                                                    Cancel
                                                </button>
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <div className="answer-meta">
                                                <span className="author instructor">Instr: {getAuthorName(answer)}</span>
                                                <span className="timestamp">{format(new Date(answer.createdAt), "MMM d 'at' h:mm a")}</span>
                                                {isInstructor && (
                                                    <div className="answer-actions">
                                                        <button
                                                            onClick={() => {
                                                                setEditingAnswerId(answer._id);
                                                                setEditAnswerContent(answer.content);
                                                            }}
                                                        >
                                                            <FaEdit /> Edit
                                                        </button>
                                                        <button onClick={() => dispatch(deleteAnswer({ courseId, answerId: answer._id }))}>
                                                            <FaTrash /> Delete
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                            <div className="answer-body" dangerouslySetInnerHTML={{ __html: answer.content }} />
                                            {answer.isGoodAnswer && <div className="good-answer">Good answer</div>}
                                        </>
                                    )}
                                </div>
                            ))}

                            {!hasAnswered && isInstructor && (
                                <div className="new-answer">
                                    <ReactQuill
                                        theme="snow"
                                        value={answerContent}
                                        onChange={setAnswerContent}
                                        modules={quillModules}
                                        placeholder="Type your answer here..."
                                    />
                                    <button
                                        className="btn-submit"
                                        onClick={async () => {
                                            if (!answerContent.trim() || answerContent === "<p><br></p>") return;
                                            await dispatch(createAnswer({ courseId, postId: currentPost._id, content: answerContent }));
                                            setAnswerContent("");
                                        }}
                                    >
                                        Submit Answer
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </>
            )}

            {/* followups */}
            <div className="followup-section">
                <h3>Followup discussions for lingering questions and comments</h3>

                {rootFollowups.map((followup: any) => (
                    <div key={followup._id} className="followup-thread">
                        <div className="followup-header">
                            <button
                                className={`resolved-btn ${followup.isResolved ? "resolved" : ""}`}
                                onClick={() => dispatch(toggleFollowupResolved({ courseId, followupId: followup._id }))}
                            >
                                {followup.isResolved ? "✓ Resolved" : "Unresolved"}
                            </button>
                            <span className="author">
                {["FACULTY", "TA", "INSTRUCTOR"].includes(followup.authorRole) ? "Instr" : "Student"}:{" "}
                                {getAuthorName(followup)}
              </span>
                            <span className="timestamp">
                Updated {format(new Date(followup.updatedAt || followup.createdAt), "MMM d 'at' h:mm a")}
              </span>
                        </div>

                        <div className="followup-content">{followup.content}</div>

                        {/* replies */}
                        {getReplies(followup._id).map((reply: any) => (
                            <div key={reply._id} className="followup-reply">
                <span className="author">
                  {["FACULTY", "TA", "INSTRUCTOR"].includes(reply.authorRole) ? "Instr" : "Student"}:{" "}
                    {getAuthorName(reply)}
                </span>
                                <span className="timestamp">{format(new Date(reply.createdAt), "h:mm a")}</span>
                                <div className="reply-content">{reply.content}</div>
                            </div>
                        ))}

                        {/* reply editor */}
                        {showReplyEditor[followup._id] ? (
                            <div className="reply-input">
                                <input
                                    type="text"
                                    value={replyContent[followup._id] || ""}
                                    onChange={(e) => setReplyContent({ ...replyContent, [followup._id]: e.target.value })}
                                    placeholder="Reply to this followup discussion..."
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter") {
                                            const content = replyContent[followup._id];
                                            if (!content?.trim()) return;
                                            dispatch(createFollowup({ courseId, postId: currentPost._id, content, parentId: followup._id }));
                                            setReplyContent({ ...replyContent, [followup._id]: "" });
                                            setShowReplyEditor({ ...showReplyEditor, [followup._id]: false });
                                        }
                                    }}
                                />
                                <button
                                    onClick={() => {
                                        const content = replyContent[followup._id];
                                        if (!content?.trim()) return;
                                        dispatch(createFollowup({ courseId, postId: currentPost._id, content, parentId: followup._id }));
                                        setReplyContent({ ...replyContent, [followup._id]: "" });
                                        setShowReplyEditor({ ...showReplyEditor, [followup._id]: false });
                                    }}
                                >
                                    Reply
                                </button>
                                <button onClick={() => setShowReplyEditor({ ...showReplyEditor, [followup._id]: false })}>
                                    Cancel
                                </button>
                            </div>
                        ) : (
                            <button className="reply-btn" onClick={() => setShowReplyEditor({ ...showReplyEditor, [followup._id]: true })}>
                                Reply
                            </button>
                        )}
                    </div>
                ))}

                {/* new followup */}
                <div className="new-followup">
                    <input
                        type="text"
                        placeholder="Start a new followup discussion"
                        value={followupContent}
                        onChange={(e) => setFollowupContent(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter" && followupContent.trim()) {
                                dispatch(createFollowup({ courseId, postId: currentPost._id, content: followupContent }));
                                setFollowupContent("");
                            }
                        }}
                    />
                </div>
            </div>
        </div>
    );
};

export default PostScreen;
