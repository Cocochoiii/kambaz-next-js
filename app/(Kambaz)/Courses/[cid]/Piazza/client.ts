// app/(Kambaz)/Courses/[cid]/Pazza/client.ts
import axios from "axios";

// Match the pattern from your api.ts
const isProd = process.env.NODE_ENV === "production" || process.env.NEXT_PUBLIC_VERCEL === "1";
const BACKEND_URL = "https://kambaz-node-server-app-final2.vercel.app";
const API_BASE = isProd ? BACKEND_URL : "";

const http = axios.create({
    baseURL: `${API_BASE}/api`,
    withCredentials: true,
});

/* ===== Keep all your existing types unchanged ===== */
export type Role = "STUDENT" | "TA" | "FACULTY" | "INSTRUCTOR";

export interface Folder {
    _id: string;
    course?: string;
    name: string;
    isDefault?: boolean;
    order?: number;
}

export interface Post {
    _id: string;
    course?: string;
    type: "question" | "note";
    title?: string;
    summary?: string;
    details: string;
    authorId?: string;
    authorName?: string;
    authorRole?: Role | string;
    folders: string[];
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
    course?: string;
    content: string;
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
    course?: string;
    content: string;
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

/* ===== Keep all your existing functions unchanged ===== */
const cid = (courseId: string) => `/courses/${encodeURIComponent(courseId)}/pazza`;

export const listFolders = async (courseId: string): Promise<Folder[]> => {
    const { data } = await http.get(`${cid(courseId)}/folders`);
    return data;
};

export const addFolder = async (courseId: string, name: string): Promise<Folder> => {
    const { data } = await http.post(`${cid(courseId)}/folders`, { name });
    return data;
};

export const renameFolder = async (courseId: string, folderId: string, name: string): Promise<Folder> => {
    const { data } = await http.put(`${cid(courseId)}/folders/${folderId}`, { name });
    return data;
};

export const removeFolder = async (courseId: string, folderId: string): Promise<void> => {
    await http.delete(`${cid(courseId)}/folders/${folderId}`);
};

export const listPosts = async (courseId: string, opts?: { folder?: string; search?: string }): Promise<Post[]> => {
    const params = new URLSearchParams();
    if (opts?.folder) params.set("folder", opts.folder);
    if (opts?.search) params.set("search", opts.search);
    const { data } = await http.get(`${cid(courseId)}/posts?${params.toString()}`);
    return data;
};

export const createPost = async (courseId: string, post: Partial<Post> & { type: "question" | "note"; details: string; folders: string[]; postTo: "entire_class" | "individual"; visibleTo?: string[]; }): Promise<Post> => {
    const { data } = await http.post(`${cid(courseId)}/posts`, post);
    return data;
};

export const getPostDetails = async (courseId: string, postId: string): Promise<{ post: Post; answers: Answer[]; followups: Followup[] }> => {
    const { data } = await http.get(`${cid(courseId)}/posts/${postId}`);
    return data;
};

export const updatePost = async (courseId: string, postId: string, patch: { title?: string; details: string; }): Promise<Post> => {
    const { data } = await http.put(`${cid(courseId)}/posts/${postId}`, patch);
    return data;
};

export const deletePost = async (courseId: string, postId: string): Promise<void> => {
    await http.delete(`${cid(courseId)}/posts/${postId}`);
};

export const addAnswer = async (courseId: string, postId: string, content: string): Promise<Answer> => {
    const { data } = await http.post(`${cid(courseId)}/posts/${postId}/answers`, { content });
    return data;
};

export const editAnswer = async (courseId: string, answerId: string, content: string): Promise<Answer> => {
    const { data } = await http.put(`${cid(courseId)}/answers/${answerId}`, { content });
    return data;
};

export const deleteAnswer = async (courseId: string, answerId: string): Promise<void> => {
    await http.delete(`${cid(courseId)}/answers/${answerId}`);
};

export const addFollowup = async (courseId: string, postId: string, content: string, parentId?: string): Promise<Followup> => {
    const { data } = await http.post(`${cid(courseId)}/posts/${postId}/followups`, { content, parentId });
    return data;
};

export const toggleFollowupResolved = async (courseId: string, followupId: string): Promise<Followup> => {
    const { data } = await http.put(`${cid(courseId)}/followups/${followupId}/resolve`, {});
    return data;
};

export const getStats = async (courseId: string): Promise<Stats> => {
    const { data } = await http.get(`${cid(courseId)}/stats`);
    return data;
};