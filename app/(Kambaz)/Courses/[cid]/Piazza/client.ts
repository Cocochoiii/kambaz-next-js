// The axios calls of Pazza. Folders, posts and comments live here.
import axios from "axios";
import { HTTP_SERVER } from "@/app/env";

// The view call needs the session, so it carries the cookie.
const axiosWithCredentials = axios.create({ withCredentials: true });

const COURSES_API = `${HTTP_SERVER}/api/courses`;
const POSTS_API = `${HTTP_SERVER}/api/pazza/posts`;
const FOLDERS_API = `${HTTP_SERVER}/api/pazza/folders`;
const COMMENTS_API = `${HTTP_SERVER}/api/pazza/comments`;

// The folders of one course.
export const findFoldersForCourse = async (courseId: string) => {
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

// The posts of one course. The server sends the newest first.
export const findPostsForCourse = async (courseId: string) => {
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

// One reader counts once. The server keeps the list unique.
export const addViewer = async (postId: string, userId: string) => {
  const { data } = await axiosWithCredentials.post(`${POSTS_API}/${postId}/view`, { userId });
  return data;
};

export const deletePost = async (postId: string) => {
  const { data } = await axios.delete(`${POSTS_API}/${postId}`);
  return data;
};

// The answers, followups and replies of one post.
export const findCommentsForPost = async (postId: string) => {
  const { data } = await axios.get(`${HTTP_SERVER}/api/posts/${postId}/pazza/comments`);
  return data;
};

// Every comment of the course. The glance screen counts them.
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

// The people of the course. I need them for the private post list.
export const findUsersForCourse = async (courseId: string) => {
  const { data } = await axios.get(`${COURSES_API}/${courseId}/users`);
  return data;
};
