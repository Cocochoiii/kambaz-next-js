"use client";

import React, { useState, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "next/navigation";
import { Button, Form } from "react-bootstrap";
import {
    FaQuestion,
    FaStickyNote,
    FaThumbtack,
    FaPlus,
    FaChevronLeft,
    FaChevronRight,
    FaSearch,
    FaLock,
    FaStar
} from "react-icons/fa";
import { format, isToday, isYesterday, startOfWeek, endOfWeek, isSameWeek, isWithinInterval, subWeeks } from "date-fns";
import {
    fetchPostDetails,
    setSearchQuery,
    fetchPosts,
    toggleSidebar,
    // ✅ add selectors from the same path
    selectCourseData,
    selectCurrentPost,
    selectSidebarVisible,
} from "./pazzaReducer";

interface PostListItemProps {
    post: any;
    onSelect: () => void;
    isSelected: boolean;
}

const PostListItem: React.FC<PostListItemProps> = ({ post, onSelect, isSelected }) => {
    const getPostIcon = () => {
        if (post.isPinned) return <FaThumbtack className="post-icon pinned" />;
        return post.type === "note" ?
            <FaStickyNote className="post-icon note" /> :
            <FaQuestion className="post-icon question" />;
    };

    const getAuthorLabel = () => {
        const role = post.author?.role || post.authorRole;
        if (role === "FACULTY" || role === "TA") {
            return <span className="author-role instructor">Instr</span>;
        }
        return <span className="author-role student">Student</span>;
    };

    const getPreviewText = () => {
        const div = document.createElement("div");
        div.innerHTML = post.details;
        const text = div.textContent || div.innerText || "";
        return text.substring(0, 100) + (text.length > 100 ? "..." : "");
    };

    const getAuthorName = () => {
        if (post.authorName) return post.authorName;
        if (post.author?.firstName && post.author?.lastName) {
            return `${post.author.firstName} ${post.author.lastName}`;
        }
        return "Anonymous";
    };

    return (
        <div
            className={`post-item ${isSelected ? 'active' : ''}`}
            onClick={onSelect}
        >
            <div className="post-header">
                {getPostIcon()}
                <div className="post-title">{post.summary || post.title}</div>
                <div className="post-badge">
                    {post.postTo === "individual" && <FaLock className="private-icon" />}
                    {post.hasInstructorAnswer && <FaStar className="starred-icon" />}
                </div>
            </div>
            <div className="post-meta">
                {getAuthorLabel()}
                <span className="post-preview">{getPreviewText()}</span>
                <span className="post-time">
                    {format(new Date(post.createdAt), "h:mm a")}
                </span>
                {post.isInstructorEndorsed && (
                    <span className="good-indicator">
                        Good {post.type === "question" ? "question" : "note"}
                    </span>
                )}
            </div>
        </div>
    );
};

interface GroupedPosts {
    pinned: any[];
    today: any[];
    yesterday: any[];
    lastWeek: any[];
    older: { [key: string]: any[] };
}

const ListOfPostsSidebar: React.FC<{ onNewPost: () => void }> = ({ onNewPost }) => {
    const params = useParams();
    const cid = params?.cid as string;
    const dispatch = useDispatch<any>();

    const [localSearch, setLocalSearch] = useState("");
    const [expandedSections, setExpandedSections] = useState<string[]>([
        "pinned", "today", "yesterday", "lastWeek"
    ]);

    // ✅ Pull course-scoped data from the slice
    const courseData = useSelector((state: any) => selectCourseData(state, cid));
    const posts = courseData?.posts || [];

    // ✅ Keep the same variable names but source from selectors
    const currentPost = useSelector(selectCurrentPost);
    const sidebarVisible = useSelector(selectSidebarVisible);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        dispatch(setSearchQuery(localSearch));
        dispatch(fetchPosts({
            courseId: cid,
            search: localSearch || undefined
        }));
    };

    const handleSelectPost = (postId: string) => {
        dispatch(fetchPostDetails({ courseId: cid, postId }));
    };

    const toggleSection = (section: string) => {
        setExpandedSections(prev =>
            prev.includes(section)
                ? prev.filter(s => s !== section)
                : [...prev, section]
        );
    };

    const groupedPosts = useMemo<GroupedPosts>(() => {
        const groups: GroupedPosts = {
            pinned: [],
            today: [],
            yesterday: [],
            lastWeek: [],
            older: {}
        };

        if (!Array.isArray(posts)) return groups;

        const now = new Date();
        const lastWeekStart = startOfWeek(subWeeks(now, 1), { weekStartsOn: 1 });
        const lastWeekEnd = endOfWeek(subWeeks(now, 1), { weekStartsOn: 1 });

        posts.forEach((post: any) => {
            const postDate = new Date(post.createdAt);

            if (post.isPinned) {
                groups.pinned.push(post);
            } else if (isToday(postDate)) {
                groups.today.push(post);
            } else if (isYesterday(postDate)) {
                groups.yesterday.push(post);
            } else if (isWithinInterval(postDate, { start: lastWeekStart, end: lastWeekEnd })) {
                groups.lastWeek.push(post);
            } else {
                const weekStart = startOfWeek(postDate, { weekStartsOn: 1 });
                const weekEnd = endOfWeek(postDate, { weekStartsOn: 1 });
                const weekKey = `${format(weekStart, "M/d")} - ${format(weekEnd, "M/d")}`;
                if (!groups.older[weekKey]) {
                    groups.older[weekKey] = [];
                }
                groups.older[weekKey].push(post);
            }
        });

        return groups;
    }, [posts]);

    if (!sidebarVisible) {
        return (
            <div className="posts-sidebar collapsed">
                <div className="sidebar-controls">
                    <button
                        className="toggle-sidebar"
                        onClick={() => dispatch(toggleSidebar())}
                    >
                        <FaChevronRight />
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="posts-sidebar">
            <div className="sidebar-controls">
                <button
                    className="toggle-sidebar"
                    onClick={() => dispatch(toggleSidebar())}
                >
                    <FaChevronLeft />
                </button>
                <span>Unread</span>
                <span>Updated</span>
                <span>Unresolved</span>
                <span>Following</span>
            </div>

            <div className="sidebar-actions">
                <Button className="new-post-btn" onClick={onNewPost}>
                    <FaPlus /> New Post
                </Button>

                <Form onSubmit={handleSearch}>
                    <div className="search-box">
                        <FaSearch />
                        <input
                            type="text"
                            placeholder="Search or add a post..."
                            value={localSearch}
                            onChange={(e) => setLocalSearch(e.target.value)}
                        />
                    </div>
                </Form>
            </div>

            <div className="posts-list">
                {/* Pinned Posts */}
                {groupedPosts.pinned.length > 0 && (
                    <div className="post-group">
                        <div
                            className="group-header"
                            onClick={() => toggleSection("pinned")}
                        >
                            <span className="group-title">
                                <FaThumbtack style={{ marginRight: 6, fontSize: 11 }} />
                                PINNED
                            </span>
                            <span className="group-count">
                                {groupedPosts.pinned.length}
                            </span>
                        </div>
                        {expandedSections.includes("pinned") &&
                            groupedPosts.pinned.map((post: any) => (
                                <PostListItem
                                    key={post._id}
                                    post={post}
                                    onSelect={() => handleSelectPost(post._id)}
                                    isSelected={currentPost?._id === post._id}
                                />
                            ))
                        }
                    </div>
                )}

                {/* Today's Posts */}
                {groupedPosts.today.length > 0 && (
                    <div className="post-group">
                        <div
                            className="group-header"
                            onClick={() => toggleSection("today")}
                        >
                            <span className="group-title">TODAY</span>
                            <span className="group-count">
                                {groupedPosts.today.length}
                            </span>
                        </div>
                        {expandedSections.includes("today") &&
                            groupedPosts.today.map((post: any) => (
                                <PostListItem
                                    key={post._id}
                                    post={post}
                                    onSelect={() => handleSelectPost(post._id)}
                                    isSelected={currentPost?._id === post._id}
                                />
                            ))
                        }
                    </div>
                )}

                {/* Yesterday's Posts */}
                {groupedPosts.yesterday.length > 0 && (
                    <div className="post-group">
                        <div
                            className="group-header"
                            onClick={() => toggleSection("yesterday")}
                        >
                            <span className="group-title">YESTERDAY</span>
                            <span className="group-count">
                                {groupedPosts.yesterday.length}
                            </span>
                        </div>
                        {expandedSections.includes("yesterday") &&
                            groupedPosts.yesterday.map((post: any) => (
                                <PostListItem
                                    key={post._id}
                                    post={post}
                                    onSelect={() => handleSelectPost(post._id)}
                                    isSelected={currentPost?._id === post._id}
                                />
                            ))
                        }
                    </div>
                )}

                {/* Last Week's Posts */}
                {groupedPosts.lastWeek.length > 0 && (
                    <div className="post-group">
                        <div
                            className="group-header"
                            onClick={() => toggleSection("lastWeek")}
                        >
                            <span className="group-title">LAST WEEK</span>
                            <span className="group-count">
                                {groupedPosts.lastWeek.length}
                            </span>
                        </div>
                        {expandedSections.includes("lastWeek") &&
                            groupedPosts.lastWeek.map((post: any) => (
                                <PostListItem
                                    key={post._id}
                                    post={post}
                                    onSelect={() => handleSelectPost(post._id)}
                                    isSelected={currentPost?._id === post._id}
                                />
                            ))
                        }
                    </div>
                )}

                {/* Older Posts grouped by week */}
                {Object.entries(groupedPosts.older).map(([weekKey, weekPosts]) => (
                    <div key={weekKey} className="post-group">
                        <div
                            className="group-header"
                            onClick={() => toggleSection(weekKey)}
                        >
                            <span className="group-title">{weekKey}</span>
                            <span className="group-count">
                                {(weekPosts as any[]).length}
                            </span>
                        </div>
                        {expandedSections.includes(weekKey) &&
                            (weekPosts as any[]).map((post: any) => (
                                <PostListItem
                                    key={post._id}
                                    post={post}
                                    onSelect={() => handleSelectPost(post._id)}
                                    isSelected={currentPost?._id === post._id}
                                />
                            ))
                        }
                    </div>
                ))}

                {/* Empty State */}
                {posts.length === 0 && (
                    <div className="empty-state">
                        <div className="empty-state-icon">
                            <FaQuestion />
                        </div>
                        <div className="empty-state-title">No posts yet</div>
                        <div className="empty-state-message">
                            Be the first to ask a question or share a note!
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ListOfPostsSidebar;
