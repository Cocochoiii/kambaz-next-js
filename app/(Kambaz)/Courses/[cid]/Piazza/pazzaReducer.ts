"use client";
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:4000";

/** ===== Types ===== */
export interface Folder {
    _id: string;
    courseId?: string;
    course?: string; // Backend uses 'course' field
    name: string;
    isDefault?: boolean;
    order?: number;
}

export type Role = "STUDENT" | "TA" | "FACULTY" | "INSTRUCTOR";

export interface UserRef {
    _id: string;
    firstName?: string;
    lastName?: string;
    role?: Role;
}

export interface Post {
    _id: string;
    courseId?: string;
    course?: string; // Backend uses 'course' field
    type: "question" | "note";
    summary?: string;
    title?: string;
    details: string;
    author?: UserRef | string;
    authorId?: string;
    authorName?: string;
    authorRole?: Role | string;
    folders: string[]; // Array of folder names, not IDs
    postTo: "entire_class" | "individual";
    visibleTo?: string[];
    views?: number;
    hasInstructorAnswer?: boolean;
    hasStudentAnswer?: boolean;
    isResolved?: boolean;
    isPinned?: boolean;
    isInstructorEndorsed?: boolean;
    createdAt: string;
    updatedAt?: string;
}

export interface Answer {
    _id: string;
    postId: string;
    courseId?: string;
    content: string;
    author?: UserRef | string;
    authorId?: string;
    authorName?: string;
    authorRole?: Role | string;
    isGoodAnswer?: boolean;
    createdAt: string;
    updatedAt?: string;
}

export interface Followup {
    _id: string;
    postId: string;
    courseId?: string;
    content: string;
    author?: UserRef | string;
    authorId?: string;
    authorName?: string;
    authorRole?: Role | string;
    parentId: string | null;
    isResolved?: boolean;
    createdAt: string;
    updatedAt?: string;
}

export interface Stats {
    totalPosts: number;
    unreadPosts: number;
    unansweredQuestions: number;
    unansweredFollowups: number;
    instructorResponses: number;
    studentResponses: number;
    totalContributions: number;
}

/** ===== State ===== */
interface CourseBucket {
    folders: Folder[];
    posts: Post[];
    stats: Stats | null;
    selectedFolder: string | null;
    searchQuery: string;
}

interface PazzaState {
    courseData: Record<string, CourseBucket>;
    currentCourseId: string | null;
    currentPost: Post | null;
    currentAnswers: Answer[];
    currentFollowups: Followup[];
    sidebarVisible: boolean;
    loading: boolean;
    error: string | null;
}

const initialState: PazzaState = {
    courseData: {},
    currentCourseId: null,
    currentPost: null,
    currentAnswers: [],
    currentFollowups: [],
    sidebarVisible: true,
    loading: false,
    error: null
};

const ensureCourseData = (state: PazzaState, courseId: string) => {
    if (!state.courseData[courseId]) {
        state.courseData[courseId] = {
            folders: [],
            posts: [],
            stats: null,
            selectedFolder: null,
            searchQuery: ""
        };
    }
};

/** ===== Thunks ===== */
export const fetchFolders = createAsyncThunk(
    "pazza/folders",
    async (courseId: string) => {
        const { data } = await axios.get(
            `${API_BASE}/api/courses/${courseId}/pazza/folders`,
            { withCredentials: true }
        );
        return { courseId, folders: data as Folder[] };
    }
);

export const addFolder = createAsyncThunk(
    "pazza/folderAdd",
    async ({ courseId, name }: { courseId: string; name: string }) => {
        const { data } = await axios.post(
            `${API_BASE}/api/courses/${courseId}/pazza/folders`,
            { name },
            { withCredentials: true }
        );
        return { courseId, folder: data as Folder };
    }
);

export const updateFolder = createAsyncThunk(
    "pazza/folderUpdate",
    async ({ courseId, folderId, name }: { courseId: string; folderId: string; name: string }) => {
        const { data } = await axios.put(
            `${API_BASE}/api/courses/${courseId}/pazza/folders/${folderId}`,
            { name },
            { withCredentials: true }
        );
        return { courseId, folder: data as Folder };
    }
);

export const deleteFolder = createAsyncThunk(
    "pazza/folderDelete",
    async ({ courseId, folderId }: { courseId: string; folderId: string }) => {
        await axios.delete(
            `${API_BASE}/api/courses/${courseId}/pazza/folders/${folderId}`,
            { withCredentials: true }
        );
        return { courseId, folderId };
    }
);

export const fetchPosts = createAsyncThunk(
    "pazza/posts",
    async ({ courseId, folder, search }: { courseId: string; folder?: string; search?: string }) => {
        const params = new URLSearchParams();
        if (folder) params.append("folder", folder);
        if (search) params.append("search", search);
        const { data } = await axios.get(
            `${API_BASE}/api/courses/${courseId}/pazza/posts?${params}`,
            { withCredentials: true }
        );
        return { courseId, posts: data as Post[] };
    }
);

export const createPost = createAsyncThunk(
    "pazza/postCreate",
    async ({ courseId, post }: { courseId: string; post: any }) => {
        console.log('Creating post with payload:', { courseId, post });
        const { data } = await axios.post(
            `${API_BASE}/api/courses/${courseId}/pazza/posts`,
            post,
            { withCredentials: true }
        );
        return { courseId, post: data as Post };
    }
);

export const fetchPostDetails = createAsyncThunk(
    "pazza/postDetails",
    async ({ courseId, postId }: { courseId: string; postId: string }) => {
        const { data } = await axios.get(
            `${API_BASE}/api/courses/${courseId}/pazza/posts/${postId}`,
            { withCredentials: true }
        );
        return data as { post: Post; answers: Answer[]; followups: Followup[] };
    }
);

export const updatePost = createAsyncThunk(
    "pazza/postUpdate",
    async ({ courseId, postId, title, details }: { courseId: string; postId: string; title?: string; details: string }) => {
        const { data } = await axios.put(
            `${API_BASE}/api/courses/${courseId}/pazza/posts/${postId}`,
            { title, details },
            { withCredentials: true }
        );
        return { courseId, post: data as Post };
    }
);

export const deletePost = createAsyncThunk(
    "pazza/postDelete",
    async ({ courseId, postId }: { courseId: string; postId: string }) => {
        await axios.delete(
            `${API_BASE}/api/courses/${courseId}/pazza/posts/${postId}`,
            { withCredentials: true }
        );
        return { courseId, postId };
    }
);

export const createAnswer = createAsyncThunk(
    "pazza/answerCreate",
    async ({ courseId, postId, content }: { courseId: string; postId: string; content: string }) => {
        const { data } = await axios.post(
            `${API_BASE}/api/courses/${courseId}/pazza/posts/${postId}/answers`,
            { content },
            { withCredentials: true }
        );
        return data as Answer;
    }
);

export const updateAnswer = createAsyncThunk(
    "pazza/answerUpdate",
    async ({ courseId, answerId, content }: { courseId: string; answerId: string; content: string }) => {
        const { data } = await axios.put(
            `${API_BASE}/api/courses/${courseId}/pazza/answers/${answerId}`,
            { content },
            { withCredentials: true }
        );
        return data as Answer;
    }
);

export const deleteAnswer = createAsyncThunk(
    "pazza/answerDelete",
    async ({ courseId, answerId }: { courseId: string; answerId: string }) => {
        await axios.delete(
            `${API_BASE}/api/courses/${courseId}/pazza/answers/${answerId}`,
            { withCredentials: true }
        );
        return answerId;
    }
);

export const createFollowup = createAsyncThunk(
    "pazza/followupCreate",
    async ({ courseId, postId, content, parentId }: { courseId: string; postId: string; content: string; parentId?: string }) => {
        const { data } = await axios.post(
            `${API_BASE}/api/courses/${courseId}/pazza/posts/${postId}/followups`,
            { content, parentId },
            { withCredentials: true }
        );
        return data as Followup;
    }
);

export const toggleFollowupResolved = createAsyncThunk(
    "pazza/followupToggleResolved",
    async ({ courseId, followupId }: { courseId: string; followupId: string }) => {
        const { data } = await axios.put(
            `${API_BASE}/api/courses/${courseId}/pazza/followups/${followupId}/resolve`,
            {},
            { withCredentials: true }
        );
        return data as Followup;
    }
);

export const fetchStats = createAsyncThunk(
    "pazza/stats",
    async (courseId: string) => {
        const { data } = await axios.get(
            `${API_BASE}/api/courses/${courseId}/pazza/stats`,
            { withCredentials: true }
        );
        return { courseId, stats: data as Stats };
    }
);

/** ===== Slice ===== */
const pazzaSlice = createSlice({
    name: "pazza",
    initialState,
    reducers: {
        setCurrentCourse: (state, action: PayloadAction<string>) => {
            state.currentCourseId = action.payload;
            ensureCourseData(state, action.payload);
            state.currentPost = null;
            state.currentAnswers = [];
            state.currentFollowups = [];
        },
        setSelectedFolder: (state, action: PayloadAction<string | null>) => {
            if (!state.currentCourseId) return;
            ensureCourseData(state, state.currentCourseId);
            state.courseData[state.currentCourseId].selectedFolder = action.payload;
        },
        setSearchQuery: (state, action: PayloadAction<string>) => {
            if (!state.currentCourseId) return;
            ensureCourseData(state, state.currentCourseId);
            state.courseData[state.currentCourseId].searchQuery = action.payload;
        },
        toggleSidebar: (state) => {
            state.sidebarVisible = !state.sidebarVisible;
        },
        clearCurrentPost: (state) => {
            state.currentPost = null;
            state.currentAnswers = [];
            state.currentFollowups = [];
        }
    },
    extraReducers: (b) => {
        b.addCase(fetchPosts.pending, (s) => { s.loading = true; s.error = null; })
            .addCase(fetchPosts.rejected, (s, a) => { s.loading = false; s.error = a.error.message || "Failed to fetch posts"; })

            // Folders
            .addCase(fetchFolders.fulfilled, (s, a) => {
                const { courseId, folders } = a.payload;
                ensureCourseData(s, courseId);
                s.courseData[courseId].folders = folders;
            })
            .addCase(addFolder.fulfilled, (s, a) => {
                const { courseId, folder } = a.payload;
                ensureCourseData(s, courseId);
                s.courseData[courseId].folders.push(folder);
            })
            .addCase(updateFolder.fulfilled, (s, a) => {
                const { courseId, folder } = a.payload;
                ensureCourseData(s, courseId);
                const i = s.courseData[courseId].folders.findIndex(f => f._id === folder._id);
                if (i !== -1) s.courseData[courseId].folders[i] = folder;
            })
            .addCase(deleteFolder.fulfilled, (s, a) => {
                const { courseId, folderId } = a.payload;
                ensureCourseData(s, courseId);
                s.courseData[courseId].folders = s.courseData[courseId].folders.filter(f => f._id !== folderId);
            })

            // Posts
            .addCase(fetchPosts.fulfilled, (s, a) => {
                const { courseId, posts } = a.payload;
                ensureCourseData(s, courseId);
                s.courseData[courseId].posts = posts;
                s.loading = false;
            })
            .addCase(createPost.fulfilled, (s, a) => {
                const { courseId, post } = a.payload;
                ensureCourseData(s, courseId);
                s.courseData[courseId].posts.unshift(post);
                s.currentPost = post;
            })
            .addCase(fetchPostDetails.fulfilled, (s, a) => {
                s.currentPost = a.payload.post;
                s.currentAnswers = a.payload.answers || [];
                s.currentFollowups = a.payload.followups || [];
            })
            .addCase(updatePost.fulfilled, (s, a) => {
                const { courseId, post } = a.payload;
                ensureCourseData(s, courseId);
                const i = s.courseData[courseId].posts.findIndex(p => p._id === post._id);
                if (i !== -1) s.courseData[courseId].posts[i] = post;
                if (s.currentPost?._id === post._id) s.currentPost = post;
            })
            .addCase(deletePost.fulfilled, (s, a) => {
                const { courseId, postId } = a.payload;
                ensureCourseData(s, courseId);
                s.courseData[courseId].posts = s.courseData[courseId].posts.filter(p => p._id !== postId);
                if (s.currentPost?._id === postId) {
                    s.currentPost = null;
                    s.currentAnswers = [];
                    s.currentFollowups = [];
                }
            })

            // Answers
            .addCase(createAnswer.fulfilled, (s, a) => {
                s.currentAnswers.push(a.payload);
                if (s.currentPost) {
                    const role = (a.payload.authorRole || (a.payload.author as UserRef)?.role) as Role | string | undefined;
                    if (role === "FACULTY" || role === "TA" || role === "INSTRUCTOR") {
                        s.currentPost.hasInstructorAnswer = true;
                    } else {
                        s.currentPost.hasStudentAnswer = true;
                    }
                }
            })
            .addCase(updateAnswer.fulfilled, (s, a) => {
                const i = s.currentAnswers.findIndex(ans => ans._id === a.payload._id);
                if (i !== -1) s.currentAnswers[i] = a.payload;
            })
            .addCase(deleteAnswer.fulfilled, (s, a) => {
                s.currentAnswers = s.currentAnswers.filter(ans => ans._id !== a.payload);
            })

            // Followups
            .addCase(createFollowup.fulfilled, (s, a) => {
                s.currentFollowups.push(a.payload);
            })
            .addCase(toggleFollowupResolved.fulfilled, (s, a) => {
                const i = s.currentFollowups.findIndex(f => f._id === a.payload._id);
                if (i !== -1) s.currentFollowups[i] = a.payload;
            })

            // Stats
            .addCase(fetchStats.fulfilled, (s, a) => {
                const { courseId, stats } = a.payload;
                ensureCourseData(s, courseId);
                s.courseData[courseId].stats = stats;
            });
    }
});

/** ===== Actions & Selectors ===== */
export const {
    setCurrentCourse,
    setSelectedFolder,
    setSearchQuery,
    toggleSidebar,
    clearCurrentPost
} = pazzaSlice.actions;

export const selectCourseData = (state: any, courseId: string): CourseBucket => {
    return state.pazza?.courseData?.[courseId] || {
        folders: [],
        posts: [],
        stats: null,
        selectedFolder: null,
        searchQuery: ""
    };
};

export const selectCurrentPost = (state: any) => state.pazza?.currentPost as Post | null;
export const selectCurrentAnswers = (state: any) => (state.pazza?.currentAnswers || []) as Answer[];
export const selectCurrentFollowups = (state: any) => (state.pazza?.currentFollowups || []) as Followup[];
export const selectSidebarVisible = (state: any) => Boolean(state.pazza?.sidebarVisible);

export default pazzaSlice.reducer;