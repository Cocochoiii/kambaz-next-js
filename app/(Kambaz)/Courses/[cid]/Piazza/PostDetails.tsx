"use client";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { format } from "date-fns";
import dynamic from "next/dynamic";
import {
    updatePost,
    deletePost,
    createAnswer,
    updateAnswer,
    deleteAnswer,
    createFollowup,
    toggleFollowupResolved
} from "./pazzaReducer";
import { FaEdit, FaTrash, FaEllipsisV, FaStar, FaLock } from "react-icons/fa";

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
import "react-quill/dist/quill.snow.css";

interface PostDetailsProps {
    courseId: string;
    post: any;
}

export default function PostDetails({ courseId, post }: PostDetailsProps) {
    const dispatch = useDispatch();
    const currentUser = useSelector((state: any) => state.accountReducer?.currentUser);  // FIXED: was state.auth
    const { currentAnswers, currentFollowups } = useSelector((state: any) => state.pazza);  // This is correct after store fix

    const [isEditingPost, setIsEditingPost] = useState(false);
    const [editTitle, setEditTitle] = useState(post.title);
    const [editDetails, setEditDetails] = useState(post.details);

    const [newAnswer, setNewAnswer] = useState("");
    const [editingAnswerId, setEditingAnswerId] = useState<string | null>(null);
    const [editAnswerContent, setEditAnswerContent] = useState("");

    const [newFollowup, setNewFollowup] = useState("");
    const [replyingToFollowup, setReplyingToFollowup] = useState<string | null>(null);
    const [replyContent, setReplyContent] = useState("");

    const canEditPost = currentUser?._id === post.authorId || currentUser?.role === "INSTRUCTOR";
    const canAnswer = post.type === "question" &&
        (!post.hasInstructorAnswer || currentUser?.role !== "INSTRUCTOR") &&
        (!post.hasStudentAnswer || currentUser?.role !== "STUDENT");

    const handleUpdatePost = async () => {
        await dispatch(updatePost({ courseId, postId: post._id, title: editTitle, details: editDetails }) as any);
        setIsEditingPost(false);
    };

    const handleDeletePost = async () => {
        if (confirm("Are you sure you want to delete this post?")) {
            await dispatch(deletePost({ courseId, postId: post._id }) as any);
        }
    };

    const handleCreateAnswer = async () => {
        if (newAnswer.trim() && newAnswer !== "<p><br></p>") {
            await dispatch(createAnswer({ courseId, postId: post._id, content: newAnswer }) as any);
            setNewAnswer("");
        }
    };

    const handleUpdateAnswer = async (answerId: string) => {
        await dispatch(updateAnswer({ courseId, answerId, content: editAnswerContent }) as any);
        setEditingAnswerId(null);
        setEditAnswerContent("");
    };

    const handleDeleteAnswer = async (answerId: string) => {
        if (confirm("Are you sure you want to delete this answer?")) {
            await dispatch(deleteAnswer({ courseId, answerId }) as any);
        }
    };

    const handleCreateFollowup = async (parentId?: string) => {
        const content = parentId ? replyContent : newFollowup;
        if (content.trim()) {
            await dispatch(createFollowup({ courseId, postId: post._id, content, parentId }) as any);
            if (parentId) {
                setReplyingToFollowup(null);
                setReplyContent("");
            } else {
                setNewFollowup("");
            }
        }
    };

    const handleToggleResolved = async (followupId: string) => {
        await dispatch(toggleFollowupResolved({ courseId, followupId }) as any);
    };

    const modules = {
        toolbar: [
            ["bold", "italic", "underline"],
            [{ list: "ordered" }, { list: "bullet" }],
            ["link", "image"],
            ["clean"]
        ]
    };

    // Separate student and instructor answers
    const studentAnswers = currentAnswers.filter((a: any) => a.authorRole === "STUDENT");
    const instructorAnswers = currentAnswers.filter((a: any) => a.authorRole === "INSTRUCTOR");

    // Build followup tree
    const rootFollowups = currentFollowups.filter((f: any) => !f.parentId);
    const getReplies = (parentId: string) => currentFollowups.filter((f: any) => f.parentId === parentId);

    return (
        <div className="post-details">
            <div className="post-header-bar">
                <h1>
                    {post.type === "question" ? "question" : "note"} @{post._id.substring(0, 3)}
                    <FaStar className={post.hasInstructorAnswer ? "starred" : ""} />
                    {post.postTo === "individual" && <FaLock />}
                </h1>
                <span className="view-count">{post.views} views</span>
            </div>

            <div className="post-content">
                {isEditingPost ? (
                    <>
                        <input
                            type="text"
                            value={editTitle}
                            onChange={(e) => setEditTitle(e.target.value)}
                            className="edit-title"
                        />
                        <ReactQuill
                            theme="snow"
                            value={editDetails}
                            onChange={setEditDetails}
                            modules={modules}
                        />
                        <div className="edit-actions">
                            <button className="btn-save" onClick={handleUpdatePost}>Save</button>
                            <button className="btn-cancel" onClick={() => setIsEditingPost(false)}>Cancel</button>
                        </div>
                    </>
                ) : (
                    <>
                        <h2>{post.title}</h2>
                        <div className="post-meta">
                            <span className="folder-tag">{post.folders.join(", ")}</span>
                            <span className="author">
                {post.authorRole === "INSTRUCTOR" ? "Instr" : "Student"}: {post.authorName}
              </span>
                            <span className="timestamp">
                {format(new Date(post.createdAt), "MMM d 'at' h:mm a")}
              </span>
                            {canEditPost && (
                                <div className="post-actions">
                                    <button className="btn-edit" onClick={() => setIsEditingPost(true)}>
                                        <FaEdit /> Edit
                                    </button>
                                    <div className="dropdown">
                                        <button className="btn-actions">
                                            <FaEllipsisV /> Actions
                                        </button>
                                        <div className="dropdown-content">
                                            <button onClick={() => setIsEditingPost(true)}>Edit</button>
                                            <button onClick={handleDeletePost}>Delete</button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className="post-body" dangerouslySetInnerHTML={{ __html: post.details }} />
                    </>
                )}
            </div>

            {post.type === "question" && (
                <>
                    {/* Student Answers */}
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
                                            modules={modules}
                                        />
                                        <div className="edit-actions">
                                            <button className="btn-save" onClick={() => handleUpdateAnswer(answer._id)}>Save</button>
                                            <button className="btn-cancel" onClick={() => setEditingAnswerId(null)}>Cancel</button>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div className="answer-meta">
                                            <span className="author">{answer.authorName}</span>
                                            <span className="timestamp">
                        {format(new Date(answer.createdAt), "MMM d 'at' h:mm a")}
                      </span>
                                            {(currentUser?._id === answer.authorId || currentUser?.role === "INSTRUCTOR") && (
                                                <div className="answer-actions">
                                                    <button onClick={() => {
                                                        setEditingAnswerId(answer._id);
                                                        setEditAnswerContent(answer.content);
                                                    }}>
                                                        <FaEdit /> Edit
                                                    </button>
                                                    <button onClick={() => handleDeleteAnswer(answer._id)}>
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

                        {canAnswer && currentUser?.role === "STUDENT" && !post.hasStudentAnswer && (
                            <div className="new-answer">
                                <ReactQuill
                                    theme="snow"
                                    value={newAnswer}
                                    onChange={setNewAnswer}
                                    modules={modules}
                                    placeholder="Type your answer here..."
                                />
                                <button className="btn-submit" onClick={handleCreateAnswer}>Submit Answer</button>
                            </div>
                        )}
                    </div>

                    {/* Instructor Answers */}
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
                                            modules={modules}
                                        />
                                        <div className="edit-actions">
                                            <button className="btn-save" onClick={() => handleUpdateAnswer(answer._id)}>Save</button>
                                            <button className="btn-cancel" onClick={() => setEditingAnswerId(null)}>Cancel</button>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div className="answer-meta">
                                            <span className="author instructor">Instr: {answer.authorName}</span>
                                            <span className="timestamp">
                        {format(new Date(answer.createdAt), "MMM d 'at' h:mm a")}
                      </span>
                                            {currentUser?.role === "INSTRUCTOR" && (
                                                <div className="answer-actions">
                                                    <button onClick={() => {
                                                        setEditingAnswerId(answer._id);
                                                        setEditAnswerContent(answer.content);
                                                    }}>
                                                        <FaEdit /> Edit
                                                    </button>
                                                    <button onClick={() => handleDeleteAnswer(answer._id)}>
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

                        {canAnswer && currentUser?.role === "INSTRUCTOR" && !post.hasInstructorAnswer && (
                            <div className="new-answer">
                                <ReactQuill
                                    theme="snow"
                                    value={newAnswer}
                                    onChange={setNewAnswer}
                                    modules={modules}
                                    placeholder="Type your answer here..."
                                />
                                <button className="btn-submit" onClick={handleCreateAnswer}>Submit Answer</button>
                            </div>
                        )}
                    </div>
                </>
            )}

            {/* Follow-up Discussions */}
            <div className="followup-section">
                <h3>Followup discussions for lingering questions and comments</h3>

                {rootFollowups.map((followup: any) => (
                    <div key={followup._id} className="followup-thread">
                        <div className="followup-header">
                            <button
                                className={`resolved-btn ${followup.isResolved ? "resolved" : ""}`}
                                onClick={() => handleToggleResolved(followup._id)}
                            >
                                {followup.isResolved ? "✓ Resolved" : "Unresolved"}
                            </button>
                            <span className="author">
                {followup.authorRole === "INSTRUCTOR" ? "Instr" : "Student"}: {followup.authorName}
              </span>
                            <span className="timestamp">
                Updated {format(new Date(followup.updatedAt), "MMM d 'at' h:mm a")}
              </span>
                        </div>
                        <div className="followup-content">{followup.content}</div>

                        {/* Replies */}
                        {getReplies(followup._id).map((reply: any) => (
                            <div key={reply._id} className="followup-reply">
                <span className="author">
                  {reply.authorRole === "INSTRUCTOR" ? "Instr" : "Student"}: {reply.authorName}
                </span>
                                <span className="timestamp">
                  {format(new Date(reply.createdAt), "h:mm a")}
                </span>
                                <div className="reply-content">{reply.content}</div>
                            </div>
                        ))}

                        {/* Reply input */}
                        {replyingToFollowup === followup._id ? (
                            <div className="reply-input">
                                <input
                                    type="text"
                                    value={replyContent}
                                    onChange={(e) => setReplyContent(e.target.value)}
                                    placeholder="Reply to this followup discussion..."
                                    onKeyPress={(e) => {
                                        if (e.key === "Enter") {
                                            handleCreateFollowup(followup._id);
                                        }
                                    }}
                                />
                                <button onClick={() => handleCreateFollowup(followup._id)}>Reply</button>
                                <button onClick={() => setReplyingToFollowup(null)}>Cancel</button>
                            </div>
                        ) : (
                            <button
                                className="reply-btn"
                                onClick={() => setReplyingToFollowup(followup._id)}
                            >
                                Reply
                            </button>
                        )}
                    </div>
                ))}

                {/* New followup input */}
                <div className="new-followup">
                    <input
                        type="text"
                        value={newFollowup}
                        onChange={(e) => setNewFollowup(e.target.value)}
                        placeholder="Start a new followup discussion"
                        onKeyPress={(e) => {
                            if (e.key === "Enter") {
                                handleCreateFollowup();
                            }
                        }}
                    />
                </div>
            </div>
        </div>
    );
}