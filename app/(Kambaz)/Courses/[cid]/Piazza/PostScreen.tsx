"use client";

import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "next/navigation";
import { Container, Badge, Button, Dropdown, Form } from "react-bootstrap";
import {
    FaEye, FaEdit, FaTrash, FaEllipsisV, FaStar,
    FaCheck, FaTimes, FaLock
} from "react-icons/fa";
import dynamic from "next/dynamic";
import { format } from "date-fns";
import {
    createAnswer,
    createFollowup,
    toggleFollowupResolved,
    updatePost,
    deletePost,
    updateAnswer,
    deleteAnswer,
} from "./pazzaReducer";

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
    const [showFollowupEditor, setShowFollowupEditor] = useState(false);
    const [followupContent, setFollowupContent] = useState("");
    const [replyContent, setReplyContent] = useState<{ [key: string]: string }>({});
    const [showReplyEditor, setShowReplyEditor] = useState<{ [key: string]: boolean }>({});
    const [editingPost, setEditingPost] = useState(false);
    const [editedContent, setEditedContent] = useState("");
    const [editingAnswerId, setEditingAnswerId] = useState<string | null>(null);
    const [editAnswerContent, setEditAnswerContent] = useState("");

    if (!currentPost) return null;

    const isInstructor = ["FACULTY", "TA"].includes(currentUser?.role);
    const isAuthor = currentUser?._id === currentPost.author?._id;
    const canEdit = isInstructor || isAuthor;

    const studentAnswers = currentAnswers.filter((a: any) =>
        !["FACULTY", "TA"].includes(a.authorRole || a.author?.role)
    );
    const instructorAnswers = currentAnswers.filter((a: any) =>
        ["FACULTY", "TA"].includes(a.authorRole || a.author?.role)
    );

    const hasAnswered = currentAnswers.some((a: any) =>
        a.authorId === currentUser?._id || a.author?._id === currentUser?._id
    );

    const rootFollowups = currentFollowups.filter((f: any) => !f.parentId);
    const getReplies = (parentId: string) =>
        currentFollowups.filter((f: any) => f.parentId === parentId);

    const handleSubmitAnswer = async () => {
        if (!answerContent.trim() || answerContent === "<p><br></p>") return;
        try {
            await dispatch(createAnswer({
                courseId,
                postId: currentPost._id,
                content: answerContent
            }));
            setAnswerContent("");
            setShowAnswerEditor(false);
        } catch (e) {
            console.error("Error adding answer:", e);
        }
    };

    const handleSubmitFollowup = async () => {
        if (!followupContent.trim()) return;
        try {
            await dispatch(createFollowup({
                courseId,
                postId: currentPost._id,
                content: followupContent
            }));
            setFollowupContent("");
            setShowFollowupEditor(false);
        } catch (e) {
            console.error("Error adding followup:", e);
        }
    };

    const handleSubmitReply = async (followupId: string) => {
        const content = replyContent[followupId];
        if (!content?.trim()) return;
        try {
            await dispatch(createFollowup({
                courseId,
                postId: currentPost._id,
                content,
                parentId: followupId
            }));
            setReplyContent({ ...replyContent, [followupId]: "" });
            setShowReplyEditor({ ...showReplyEditor, [followupId]: false });
        } catch (e) {
            console.error("Error adding reply:", e);
        }
    };

    const handleToggleResolved = async (followupId: string) => {
        try {
            await dispatch(toggleFollowupResolved({ courseId, followupId }));
        } catch (e) {
            console.error("Error updating followup status:", e);
        }
    };

    const quillModules = {
        toolbar: [
            ["bold", "italic", "underline"],
            [{ list: "ordered" }, { list: "bullet" }],
            ["link", "image"],
            ["clean"]
        ]
    };

    const getAuthorName = (item: any) => {
        if (item.authorName) return item.authorName;
        if (item.author?.firstName && item.author?.lastName) {
            return `${item.author.firstName} ${item.author.lastName}`;
        }
        return "Unknown User";
    };

    return (
        <div className="post-view-container">
            {/* Post Header Bar */}
            <div className="post-view-header">
                <div className="post-header-left">
                    <span className="post-type-badge">
                        {currentPost.type === "question" ? "question" : "note"}
                    </span>
                    <span className="post-id">@{currentPost._id.substring(0, 3)}</span>
                    {currentPost.hasInstructorAnswer && <FaStar className="starred" />}
                    {currentPost.postTo === "individual" && <FaLock className="private" />}
                </div>
                <div className="post-header-right">
                    <span className="view-count">
                        {currentPost.views || 1} view{currentPost.views !== 1 ? "s" : ""}
                    </span>
                    {canEdit && (
                        <Dropdown align="end">
                            <Dropdown.Toggle variant="link" size="sm" className="actions-btn">
                                Actions
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                                <Dropdown.Item onClick={() => {
                                    setEditingPost(true);
                                    setEditedContent(currentPost.details);
                                }}>
                                    <FaEdit /> Edit
                                </Dropdown.Item>
                                <Dropdown.Item
                                    onClick={() => {
                                        if (confirm("Delete this post?")) {
                                            dispatch(deletePost({ courseId, postId: currentPost._id }));
                                        }
                                    }}
                                    className="text-danger"
                                >
                                    <FaTrash /> Delete
                                </Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                    )}
                </div>
            </div>

            {/* Post Content */}
            <div className="post-content-area">
                <h2 className="post-title">{currentPost.summary || currentPost.title}</h2>

                <div className="post-metadata">
                    <span className="post-author">
                        {currentPost.author?.role === "FACULTY" || currentPost.author?.role === "TA" ?
                            <Badge bg="warning" text="dark">Instr</Badge> :
                            <Badge bg="info">Student</Badge>
                        }
                        {" "}{getAuthorName(currentPost)}
                    </span>
                    <span className="post-timestamp">
                        {format(new Date(currentPost.createdAt), "MMM d 'at' h:mm a")}
                    </span>
                </div>

                {editingPost ? (
                    <div className="edit-post-area">
                        <ReactQuill
                            theme="snow"
                            value={editedContent}
                            onChange={setEditedContent}
                            modules={quillModules}
                            style={{ minHeight: "150px" }}
                        />
                        <div className="edit-actions">
                            <Button
                                size="sm"
                                onClick={async () => {
                                    await dispatch(updatePost({
                                        courseId,
                                        postId: currentPost._id,
                                        title: currentPost.summary,
                                        details: editedContent
                                    }));
                                    setEditingPost(false);
                                }}>
                                Save
                            </Button>
                            <Button
                                size="sm"
                                variant="secondary"
                                onClick={() => setEditingPost(false)}>
                                Cancel
                            </Button>
                        </div>
                    </div>
                ) : (
                    <div className="post-details"
                         dangerouslySetInnerHTML={{ __html: currentPost.details }} />
                )}

                {canEdit && !editingPost && (
                    <button className="inline-edit-btn" onClick={() => {
                        setEditingPost(true);
                        setEditedContent(currentPost.details);
                    }}>
                        Edit
                    </button>
                )}
            </div>

            {/* Student Answers */}
            {currentPost.type === "question" && (
                <>
                    {/* Students' Answer Section */}
                    {(studentAnswers.length > 0 || (!hasAnswered && !isInstructor)) && (
                        <div className="answer-section student-answers">
                            <h3>the students' answer</h3>
                            {studentAnswers.map((answer: any) => (
                                <div key={answer._id} className="answer-content">
                                    <div className="answer-header">
                                        <span className="answer-author">
                                            {getAuthorName(answer)}
                                        </span>
                                        <span className="answer-time">
                                            {format(new Date(answer.createdAt || answer.timestamp),
                                                "MMM d 'at' h:mm a")}
                                        </span>
                                    </div>
                                    <div className="answer-body"
                                         dangerouslySetInnerHTML={{ __html: answer.content }} />
                                    {answer.isGoodAnswer && (
                                        <span className="good-answer-badge">good answer</span>
                                    )}
                                </div>
                            ))}

                            {!hasAnswered && !isInstructor && (
                                showAnswerEditor ? (
                                    <div className="answer-editor">
                                        <ReactQuill
                                            theme="snow"
                                            value={answerContent}
                                            onChange={setAnswerContent}
                                            placeholder="Type your answer here..."
                                            modules={quillModules}
                                            style={{ minHeight: "150px" }}
                                        />
                                        <div className="editor-actions">
                                            <Button onClick={handleSubmitAnswer}>
                                                Submit
                                            </Button>
                                            <Button
                                                variant="secondary"
                                                onClick={() => {
                                                    setShowAnswerEditor(false);
                                                    setAnswerContent("");
                                                }}>
                                                Cancel
                                            </Button>
                                        </div>
                                    </div>
                                ) : (
                                    <button
                                        className="add-answer-btn"
                                        onClick={() => setShowAnswerEditor(true)}>
                                        good answer 0
                                    </button>
                                )
                            )}
                        </div>
                    )}

                    {/* Instructors' Answer Section */}
                    {(instructorAnswers.length > 0 || (!hasAnswered && isInstructor)) && (
                        <div className="answer-section instructor-answers">
                            <h3>the instructors' answer</h3>
                            {instructorAnswers.map((answer: any) => (
                                <div key={answer._id} className="answer-content">
                                    <div className="answer-header">
                                        <Badge bg="warning" text="dark">Instr</Badge>
                                        {" "}
                                        <span className="answer-author">
                                            {getAuthorName(answer)}
                                        </span>
                                        <span className="answer-time">
                                            {format(new Date(answer.createdAt || answer.timestamp),
                                                "MMM d 'at' h:mm a")}
                                        </span>
                                    </div>
                                    <div className="answer-body"
                                         dangerouslySetInnerHTML={{ __html: answer.content }} />
                                    {answer.isGoodAnswer && (
                                        <span className="good-answer-badge">good answer</span>
                                    )}
                                </div>
                            ))}

                            {!hasAnswered && isInstructor && (
                                showAnswerEditor ? (
                                    <div className="answer-editor">
                                        <ReactQuill
                                            theme="snow"
                                            value={answerContent}
                                            onChange={setAnswerContent}
                                            placeholder="Type your answer here..."
                                            modules={quillModules}
                                            style={{ minHeight: "150px" }}
                                        />
                                        <div className="editor-actions">
                                            <Button variant="warning" onClick={handleSubmitAnswer}>
                                                Submit
                                            </Button>
                                            <Button
                                                variant="secondary"
                                                onClick={() => {
                                                    setShowAnswerEditor(false);
                                                    setAnswerContent("");
                                                }}>
                                                Cancel
                                            </Button>
                                        </div>
                                    </div>
                                ) : (
                                    <button
                                        className="add-answer-btn"
                                        onClick={() => setShowAnswerEditor(true)}>
                                        good answer 0
                                    </button>
                                )
                            )}
                        </div>
                    )}
                </>
            )}

            {/* Followup Discussions */}
            <div className="followup-section">
                <h3>followup discussions for lingering questions and comments</h3>

                {rootFollowups.map((followup: any) => (
                    <div key={followup._id} className="followup-thread">
                        <div className="followup-header">
                            <button
                                className={`resolved-status ${followup.isResolved ? "resolved" : ""}`}
                                onClick={() => handleToggleResolved(followup._id)}
                            >
                                {followup.isResolved ?
                                    <><FaCheck /> Resolved</> :
                                    <><FaTimes /> Unresolved</>
                                }
                            </button>
                            <span className="followup-author">
                                {getAuthorName(followup)}
                            </span>
                            <span className="followup-time">
                                Updated {format(new Date(followup.updatedAt || followup.createdAt),
                                "MMM d 'at' h:mm a")}
                            </span>
                        </div>
                        <div className="followup-content">{followup.content}</div>

                        {/* Replies */}
                        {getReplies(followup._id).map((reply: any) => (
                            <div key={reply._id} className="followup-reply">
                                <span className="reply-author">{getAuthorName(reply)}</span>
                                <span className="reply-time">
                                    {format(new Date(reply.createdAt), "h:mm a")}
                                </span>
                                <div className="reply-content">{reply.content}</div>
                            </div>
                        ))}

                        {/* Reply input */}
                        {showReplyEditor[followup._id] ? (
                            <div className="reply-input">
                                <input
                                    type="text"
                                    value={replyContent[followup._id] || ""}
                                    onChange={(e) => setReplyContent({
                                        ...replyContent,
                                        [followup._id]: e.target.value
                                    })}
                                    placeholder="Reply to this discussion..."
                                />
                                <button onClick={() => handleSubmitReply(followup._id)}>
                                    Reply
                                </button>
                                <button onClick={() => setShowReplyEditor({
                                    ...showReplyEditor,
                                    [followup._id]: false
                                })}>
                                    Cancel
                                </button>
                            </div>
                        ) : (
                            <button
                                className="reply-btn"
                                onClick={() => setShowReplyEditor({
                                    ...showReplyEditor,
                                    [followup._id]: true
                                })}>
                                helpful 0
                            </button>
                        )}
                    </div>
                ))}

                {/* New followup input */}
                <div className="new-followup">
                    <input
                        type="text"
                        placeholder="Start a new followup discussion"
                        value={followupContent}
                        onChange={(e) => setFollowupContent(e.target.value)}
                        onKeyPress={(e) => {
                            if (e.key === "Enter") handleSubmitFollowup();
                        }}
                    />
                </div>
            </div>
        </div>
    );
};

export default PostScreen;