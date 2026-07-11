import axios from "axios";
import { HTTP_SERVER } from "@/app/env";

const COURSES_API = `${HTTP_SERVER}/api/courses`;
const POSTS_API = `${HTTP_SERVER}/api/pazza/posts`;
const FOLDERS_API = `${HTTP_SERVER}/api/pazza/folders`;
const COMMENTS_API = `${HTTP_SERVER}/api/pazza/comments`;

// ---- Folders ----
export const findFolders = async (courseId: string) => {
    const { data } = await axios.get(`${COURSES_API}/${courseId}/pazza/folders`);
    return data;
};
export const createFolder = async (courseId: string, name: string) => {
    const { data } = await axios.post(`${COURSES_API}/${courseId}/pazza/folders`, { name });
    return data;
};
export const updateFolder = async (folderId: string, name: string) => {
    const { data } = await axios.put(`${FOLDERS_API}/${folderId}`, { name });
    return data;
};
export const deleteFolder = async (folderId: string) => {
    const { data } = await axios.delete(`${FOLDERS_API}/${folderId}`);
    return data;
};

// ---- Posts ----
export const findPosts = async (courseId: string) => {
    const { data } = await axios.get(`${COURSES_API}/${courseId}/pazza/posts`);
    return data;
};
export const createPost = async (courseId: string, post: any) => {
    const { data } = await axios.post(`${COURSES_API}/${courseId}/pazza/posts`, post);
    return data;
};
export const updatePost = async (post: any) => {
    const { data } = await axios.put(`${POSTS_API}/${post._id}`, post);
    return data;
};
export const deletePost = async (postId: string) => {
    const { data } = await axios.delete(`${POSTS_API}/${postId}`);
    return data;
};

// ---- Comments (answers, discussions, replies) ----
export const findCommentsForPost = async (postId: string) => {
    const { data } = await axios.get(`${HTTP_SERVER}/api/posts/${postId}/pazza/comments`);
    return data;
};
export const findCommentsForCourse = async (courseId: string) => {
    const { data } = await axios.get(`${COURSES_API}/${courseId}/pazza/comments`);
    return data;
};
export const createComment = async (postId: string, comment: any) => {
    const { data } = await axios.post(`${HTTP_SERVER}/api/posts/${postId}/pazza/comments`, comment);
    return data;
};
export const updateComment = async (comment: any) => {
    const { data } = await axios.put(`${COMMENTS_API}/${comment._id}`, comment);
    return data;
};
export const deleteComment = async (commentId: string) => {
    const { data } = await axios.delete(`${COMMENTS_API}/${commentId}`);
    return data;
};
