"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import Link from "next/link";
import {
    fetchFolders,
    fetchPosts,
    fetchStats,
    setSelectedFolder,
    clearCurrentPost,
    setCurrentCourse,
    selectCourseData,
    selectSidebarVisible,
} from "./pazzaReducer";
import ListOfPostsSidebar from "./ListOfPostsSidebar";
import NewPostScreen from "./NewPostScreen";
import PostScreen from "./PostScreen";
import ClassAtGlance from "./ClassAtGlance";
import ManageClass from "./ManageClass";
import "./pazza.css";

export default function Pazza() {
    const params = useParams();
    const courseId = params?.cid as string;
    const dispatch = useDispatch<any>();

    const courseData = useSelector((state: any) => selectCourseData(state, courseId));
    const { folders = [], posts = [], stats = {}, selectedFolder = null } = courseData;
    const sidebarVisible = useSelector(selectSidebarVisible);
    const currentPost = useSelector((state: any) => state.pazza?.currentPost);
    const currentUser = useSelector((state: any) => state.accountReducer?.currentUser);
    const courses = useSelector((state: any) => state.coursesReducer?.courses || []);
    const course = courses.find((c: any) => c._id === courseId);

    const [showNewPost, setShowNewPost] = useState(false);
    const [activeTab, setActiveTab] = useState("qa");
    const [dataInitialized, setDataInitialized] = useState(false);

    const isInstructor = ["FACULTY", "TA", "INSTRUCTOR"].includes(currentUser?.role);

    // Initialize data on mount
    useEffect(() => {
        if (courseId && !dataInitialized) {
            console.log(`Initializing Pazza for course ${courseId}`);
            dispatch(setCurrentCourse(courseId));

            // Fetch initial data
            Promise.all([
                dispatch(fetchFolders(courseId)),
                dispatch(fetchPosts({ courseId })),
                dispatch(fetchStats(courseId))
            ]).then(() => {
                setDataInitialized(true);
                console.log('Initial data loaded');
            }).catch(error => {
                console.error('Error loading initial data:', error);
            });
        }
    }, [courseId, dispatch, dataInitialized]);

    // Refresh posts when selected folder changes
    useEffect(() => {
        if (courseId && selectedFolder !== null && dataInitialized) {
            console.log(`Fetching posts for folder: ${selectedFolder}`);
            dispatch(fetchPosts({ courseId, folder: selectedFolder }));
        }
    }, [courseId, selectedFolder, dispatch, dataInitialized]);

    const handleNewPost = () => {
        setShowNewPost(true);
        dispatch(clearCurrentPost());
    };

    const handleFolderSelect = (folderName: string) => {
        if (selectedFolder === folderName) {
            // Deselect folder - show all posts
            dispatch(setSelectedFolder(null));
            dispatch(fetchPosts({ courseId }));
        } else {
            // Select folder - filter posts
            dispatch(setSelectedFolder(folderName));
            dispatch(fetchPosts({ courseId, folder: folderName }));
        }
    };

    const handleTabChange = (tab: string) => {
        setActiveTab(tab);
        if (tab === "qa") {
            setShowNewPost(false);
        }
    };

    const handlePostSaved = () => {
        setShowNewPost(false);
        // Refresh posts after creating new one
        dispatch(fetchPosts({ courseId, folder: selectedFolder || undefined }));
    };

    // Use folders from backend or show default folders
    const displayFolders = folders.length > 0
        ? folders
        : [
            { _id: "hw1", name: "hw1", isDefault: true },
            { _id: "hw2", name: "hw2", isDefault: true },
            { _id: "hw3", name: "hw3", isDefault: true },
            { _id: "hw4", name: "hw4", isDefault: true },
            { _id: "hw5", name: "hw5", isDefault: true },
            { _id: "hw6", name: "hw6", isDefault: true },
            { _id: "project", name: "project", isDefault: true },
            { _id: "exam", name: "exam", isDefault: true },
            { _id: "logistics", name: "logistics", isDefault: true },
            { _id: "other", name: "other", isDefault: true },
            { _id: "office_hours", name: "office_hours", isDefault: true },
        ];

    return (
        <div className="pazza-container">
            {/* Pazza Navigation Bar */}
            <div className="pazza-nav">
                <div className="pazza-nav-left">
                    <Link href="/Kambaz" className="pazza-logo">
                        pazza
                    </Link>
                    <div className="course-name">
                        CS {course?.number || courseId.substring(0, 6)}
                    </div>
                </div>
                <div className="pazza-nav-tabs">
                    <button
                        className={`nav-tab ${activeTab === "qa" ? "active" : ""}`}
                        onClick={() => handleTabChange("qa")}
                    >
                        Q & A
                    </button>
                    <button className="nav-tab disabled">Resources</button>
                    <button className="nav-tab disabled">Statistics</button>
                    {isInstructor && (
                        <button
                            className={`nav-tab ${activeTab === "manage" ? "active" : ""}`}
                            onClick={() => handleTabChange("manage")}
                        >
                            Manage Class
                        </button>
                    )}
                </div>
                <div className="pazza-nav-right">
                    <div className="user-avatar">
                        {currentUser?.firstName?.[0] || "U"}
                        {currentUser?.lastName?.[0] || ""}
                    </div>
                    <span className="current-user">
                        {currentUser ? `${currentUser.firstName} ${currentUser.lastName}` : "Guest User"}
                    </span>
                </div>
            </div>

            {/* Main Content */}
            {activeTab === "manage" && isInstructor ? (
                <ManageClass />
            ) : (
                <>
                    {/* Folder Filters */}
                    <div className="folder-filters">
                        <button className="folder-btn disabled">LIVE Q&A</button>
                        <button className="folder-btn disabled">Drafts</button>

                        {displayFolders.map((folder: any) => (
                            <button
                                key={folder._id || folder.name}
                                className={`folder-btn ${selectedFolder === folder.name ? "active" : ""}`}
                                onClick={() => handleFolderSelect(folder.name)}
                            >
                                {folder.name}
                            </button>
                        ))}

                        <button
                            className="folder-btn"
                            onClick={() => {
                                if (isInstructor) {
                                    handleTabChange("manage");
                                }
                            }}
                        >
                            more
                        </button>
                    </div>

                    <div className="pazza-content">
                        {/* List of Posts Sidebar */}
                        <ListOfPostsSidebar onNewPost={handleNewPost} />

                        {/* Post Screen Container */}
                        <div className="post-screen-container">
                            {showNewPost ? (
                                <NewPostScreen
                                    onSave={handlePostSaved}
                                    onCancel={() => setShowNewPost(false)}
                                />
                            ) : currentPost ? (
                                <PostScreen />
                            ) : (
                                <ClassAtGlance courseId={courseId} stats={stats} />
                            )}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}