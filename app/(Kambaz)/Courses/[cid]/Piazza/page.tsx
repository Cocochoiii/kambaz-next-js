"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useSelector } from "react-redux";
import { Button, Form, InputGroup } from "react-bootstrap";
import { FaCaretLeft, FaCaretRight, FaPlus, FaRegQuestionCircle, FaUserCircle } from "react-icons/fa";
import { BsSearch } from "react-icons/bs";
import { useIsFaculty } from "../../../Account/roles";
import * as accountClient from "../../../Account/client";
import * as client from "./client";
import { groupPosts, preview, timeLabel, isInstructorRole } from "./helpers";
import NewPostScreen from "./NewPostScreen";
import PostView from "./PostView";
import ClassAtGlance from "./ClassAtGlance";

export default function Piazza() {
    const { cid } = useParams<{ cid: string }>();
    const { currentUser } = useSelector((s: any) => s.accountReducer);
    const { courses, course } = useSelector((s: any) => s.coursesReducer);
    const isInstructor = useIsFaculty();

    const courseName = courses.find((c: any) => c._id === cid)?.name || course?.name || cid;

    const [folders, setFolders] = useState<any[]>([]);
    const [posts, setPosts] = useState<any[]>([]);
    const [comments, setComments] = useState<any[]>([]);
    const [students, setStudents] = useState<any[]>([]);
    const [users, setUsers] = useState<any[]>([]);
    const [selectedFolder, setSelectedFolder] = useState<string | null>(null);
    const [search, setSearch] = useState("");
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [mode, setMode] = useState<"glance" | "new" | "view">("glance");
    const [selectedId, setSelectedId] = useState<string | null>(null);

    const refresh = async () => {
        const [f, p, c] = await Promise.all([
            client.findFolders(cid).catch(() => []),
            client.findPosts(cid).catch(() => []),
            client.findCommentsForCourse(cid).catch(() => []),
        ]);
        setFolders(f);
        setPosts(p);
        setComments(c);
        const people = await accountClient.findUsersForCourse(cid).catch(() => []);
        setUsers(people);
        setStudents(people.filter((u: any) => (u.role || "").toUpperCase() === "STUDENT"));
    };
    useEffect(() => {
        refresh();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [cid]);

    // Posts visible to the current user.
    const canSee = (p: any) => {
        if (isInstructor) return true;
        if (p.postTo === "all") return true;
        if (p.author === currentUser?._id) return true;
        return (p.recipients || []).includes(currentUser?._id);
    };
    const visible = posts
        .filter(canSee)
        .filter((p: any) => !selectedFolder || (p.folders || []).includes(selectedFolder))
        .filter((p: any) => {
            const q = search.trim().toLowerCase();
            if (!q) return true;
            return (p.summary || "").toLowerCase().includes(q) || preview(p.details, 9999).toLowerCase().includes(q);
        })
        .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    const groups = groupPosts(visible);
    const selectedPost = posts.find((p: any) => p._id === selectedId);

    const openPost = (id: string) => { setSelectedId(id); setMode("view"); };
    const backToGlance = async () => { setMode("glance"); setSelectedId(null); await refresh(); };
    const onCreated = async (post: any) => { await refresh(); setSelectedId(post._id); setMode("view"); };

    // Class at a Glance metrics.
    const answeredIds = new Set(comments.filter((c) => c.kind === "answer").map((c) => c.post));
    const unread = visible.filter((p) => !(p.viewers || []).includes(currentUser?._id)).length;
    const unanswered = visible.filter((p) => p.type === "question" && !answeredIds.has(p._id)).length;
    const instructorResponses = comments.filter((c) => isInstructorRole(c.authorRole)).length;
    const studentResponses = comments.filter((c) => !isInstructorRole(c.authorRole)).length;
    const unansweredFollowups = comments.filter((c) => c.kind === "discussion" && !c.resolved).length;
    const totalContributions = visible.length + comments.length;

    const tabStyle = (active: boolean) => ({
        cursor: "pointer",
        color: "#fff",
        fontWeight: active ? 700 : 500,
        borderBottom: active ? "3px solid #fff" : "3px solid transparent",
        paddingBottom: 6,
        opacity: active ? 1 : 0.85,
    });

    return (
        <div id="wd-piazza">
            {/* Pazza Navigation Bar (fixed at the top of Pazza) */}
            <div className="d-flex align-items-center gap-4 px-3 py-2"
                style={{ position: "sticky", top: 0, zIndex: 20, background: "#2563b8" }}>
                <span className="fw-bold fs-4" style={{ color: "#fff", letterSpacing: 0.5 }}>piazza</span>
                <span className="d-flex align-items-center gap-2" style={{ color: "#fff" }}>
                    {courseName}
                    {unread > 0 && (
                        <span className="badge rounded-pill" style={{ background: "#d32f2f" }}>{unread}</span>
                    )}
                </span>
                <span style={tabStyle(true)}>Q&amp;A</span>
                <span style={{ color: "rgba(255,255,255,0.7)", cursor: "not-allowed", paddingBottom: 6 }}>Resources</span>
                <span style={{ color: "rgba(255,255,255,0.7)", cursor: "not-allowed", paddingBottom: 6 }}>Statistics</span>
                {isInstructor && (
                    <Link href={`/Courses/${cid}/Piazza/ManageClass`} className="text-decoration-none" style={{ color: "#fff", fontWeight: 500 }}>
                        Manage Class
                    </Link>
                )}
                <span className="ms-auto d-flex align-items-center gap-2" style={{ color: "#fff" }}>
                    <FaUserCircle size={22} />
                    {[currentUser?.firstName, currentUser?.lastName].filter(Boolean).join(" ") || currentUser?.username}
                </span>
            </div>

            {/* Folder Filters (fixed below the nav bar) */}
            <div className="d-flex flex-wrap align-items-center gap-2 px-3 py-2 border-bottom bg-light"
                style={{ position: "sticky", top: 49, zIndex: 19 }}>
                {folders.map((f: any) => {
                    const active = selectedFolder === f.name;
                    return (
                        <span key={f._id}
                            onClick={() => setSelectedFolder(active ? null : f.name)}
                            className="px-2 py-1 rounded"
                            style={{
                                cursor: "pointer",
                                fontWeight: active ? 700 : 400,
                                background: active ? "#2563b8" : "#fff",
                                color: active ? "#fff" : "#333",
                                border: "1px solid #ccc",
                            }}>
                            {f.name}
                        </span>
                    );
                })}
            </div>

            {/* Two columns: List of Posts Sidebar + Post Screen */}
            <div className="d-flex" style={{ minHeight: "70vh" }}>
                {sidebarOpen ? (
                    <div style={{ width: 340, flexShrink: 0 }} className="border-end">
                        <div className="d-flex align-items-center gap-2 p-2 border-bottom">
                            <FaCaretLeft role="button" title="Hide posts" onClick={() => setSidebarOpen(false)} />
                            <span className="text-muted small">Unread</span>
                            <span className="text-muted small">Updated</span>
                            <span className="text-muted small">Unresolved</span>
                            <span className="text-muted small">Following</span>
                        </div>
                        <div className="d-flex align-items-center gap-2 p-2 border-bottom">
                            <Button size="sm" style={{ backgroundColor: "#2563b8", border: "none" }}
                                onClick={() => setMode("new")}>
                                <FaPlus className="me-1" /> New Post
                            </Button>
                            <InputGroup size="sm">
                                <InputGroup.Text><BsSearch /></InputGroup.Text>
                                <Form.Control placeholder="Search posts" value={search}
                                    onChange={(e) => setSearch(e.target.value)} />
                            </InputGroup>
                        </div>

                        <div style={{ overflowY: "auto", maxHeight: "62vh" }}>
                            {visible.length === 0 && <div className="text-muted small p-3">No posts.</div>}
                            {groups.map((g) => (
                                <details key={g.key} open>
                                    <summary className="px-3 py-1 bg-light fw-semibold small" style={{ cursor: "pointer" }}>
                                        {g.label}
                                    </summary>
                                    {g.posts.map((p: any) => {
                                        const active = p._id === selectedId;
                                        return (
                                            <div key={p._id} onClick={() => openPost(p._id)}
                                                className="px-3 py-2 border-bottom"
                                                style={{
                                                    cursor: "pointer",
                                                    background: active ? "#e7eefb" : "#fff",
                                                    borderLeft: active ? "4px solid #2563b8" : "4px solid transparent",
                                                }}>
                                                <div className="d-flex gap-2">
                                                    {p.type === "note" ? (
                                                        <span title="Note" style={{ width: 14, height: 14, background: "#e0a100", borderRadius: 3, display: "inline-block", marginTop: 4, flexShrink: 0 }} />
                                                    ) : (
                                                        <FaRegQuestionCircle title="Question" style={{ color: "#2563b8", marginTop: 3, flexShrink: 0 }} />
                                                    )}
                                                    <div className="flex-grow-1" style={{ minWidth: 0 }}>
                                                        <div className="d-flex align-items-center gap-1">
                                                            <span className="badge" style={{ background: isInstructorRole(p.authorRole) ? "#e07b39" : "#6c757d", fontSize: 10 }}>
                                                                {isInstructorRole(p.authorRole) ? "Instr" : "Student"}
                                                            </span>
                                                            <span className="fw-bold text-truncate">{p.summary}</span>
                                                        </div>
                                                        <div className="small text-muted" style={{
                                                            display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden",
                                                        }}>
                                                            {preview(p.details, 120)}
                                                        </div>
                                                    </div>
                                                    <div className="small text-muted flex-shrink-0" style={{ whiteSpace: "nowrap" }}>{timeLabel(p.createdAt)}</div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </details>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="border-end p-2" style={{ flexShrink: 0 }}>
                        <FaCaretRight role="button" title="Show posts" onClick={() => setSidebarOpen(true)} />
                    </div>
                )}

                {/* Post Screen */}
                <div className="flex-grow-1" style={{ minWidth: 0 }}>
                    {mode === "new" && (
                        <NewPostScreen cid={cid} currentUser={currentUser} folders={folders} users={users}
                            onCancel={backToGlance} onCreated={onCreated} />
                    )}
                    {mode === "view" && selectedPost && (
                        <PostView cid={cid} post={selectedPost} currentUser={currentUser} isInstructor={isInstructor}
                            onChanged={refresh} onDeleted={backToGlance} />
                    )}
                    {(mode === "glance" || (mode === "view" && !selectedPost)) && (
                        <ClassAtGlance
                            isInstructor={isInstructor}
                            unread={unread}
                            unanswered={unanswered}
                            unansweredFollowups={unansweredFollowups}
                            totalPosts={visible.length}
                            totalContributions={totalContributions}
                            instructorResponses={instructorResponses}
                            studentResponses={studentResponses}
                            studentsEnrolled={students.length}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}
