// app/(Kambaz)/Courses/[cid]/Quizzes/client.ts
import axios from "axios";

// Use production backend when deployed - matching Pazza client structure
const API_BASE = typeof window !== 'undefined' && window.location.hostname !== 'localhost'
    ? "https://kambaz-node-server-app-final2.vercel.app"
    : "http://localhost:4000";

const axiosWithCredentials = axios.create({
    baseURL: `${API_BASE}/api`, // Include /api in baseURL like Pazza
    withCredentials: true,
    headers: { "Content-Type": "application/json" },
});

const cid = (courseId: string) => `/courses/${encodeURIComponent(courseId)}`;

export const listQuizzes = async (courseId: string) => {
    const { data } = await axiosWithCredentials.get(`${cid(courseId)}/quizzes`);
    return data;
};

export const createQuiz = async (courseId: string, quiz: any) => {
    const { data } = await axiosWithCredentials.post(`${cid(courseId)}/quizzes`, quiz);
    return data;
};

export const getQuiz = async (qid: string) => {
    const { data } = await axiosWithCredentials.get(`/quizzes/${qid}`);
    return data;
};

export const updateQuiz = async (quiz: any) => {
    const { data } = await axiosWithCredentials.put(`/quizzes/${quiz._id}`, quiz);
    return data;
};

export const deleteQuiz = async (qid: string) => {
    const { data } = await axiosWithCredentials.delete(`/quizzes/${qid}`);
    return data;
};

export const publishQuiz = async (qid: string, published: boolean) => {
    const { data } = await axiosWithCredentials.put(`/quizzes/${qid}/publish`, { published });
    return data;
};

export const addQuestion = async (qid: string, question: any) => {
    const { data } = await axiosWithCredentials.post(`/quizzes/${qid}/questions`, question);
    return data;
};

export const updateQuestion = async (qid: string, questionId: string, updates: any) => {
    const { data } = await axiosWithCredentials.put(`/quizzes/${qid}/questions/${questionId}`, updates);
    return data;
};

export const deleteQuestion = async (qid: string, questionId: string) => {
    const { data } = await axiosWithCredentials.delete(`/quizzes/${qid}/questions/${questionId}`);
    return data;
};

export const submitAttempt = async (qid: string, answers: any[]) => {
    const { data } = await axiosWithCredentials.post(`/quizzes/${qid}/attempts`, { answers });
    return data;
};

export const lastAttempt = async (qid: string) => {
    const { data } = await axiosWithCredentials.get(`/quizzes/${qid}/attempts/last`);
    return data;
};