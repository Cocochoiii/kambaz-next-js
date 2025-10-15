// app/(Kambaz)/Courses/[cid]/Quizzes/client.ts
import axios from "axios";

// Match the pattern from your api.ts
const isProd = process.env.NODE_ENV === "production" || process.env.NEXT_PUBLIC_VERCEL === "1";
const BACKEND_URL = "https://kambaz-node-server-app-final2.vercel.app";
const API_BASE = isProd ? BACKEND_URL : "";

const axiosWithCredentials = axios.create({
    baseURL: API_BASE,
    withCredentials: true,
    headers: { "Content-Type": "application/json" },
});

const API = "/api";
const COURSES_API = `${API}/courses`;
const QUIZZES_API = `${API}/quizzes`;

export const listQuizzes = async (courseId: string) =>
    (await axiosWithCredentials.get(`${COURSES_API}/${courseId}/quizzes`)).data;

export const createQuiz = async (courseId: string, quiz: any) =>
    (await axiosWithCredentials.post(`${COURSES_API}/${courseId}/quizzes`, quiz)).data;

export const getQuiz = async (qid: string) =>
    (await axiosWithCredentials.get(`${QUIZZES_API}/${qid}`)).data;

export const updateQuiz = async (quiz: any) =>
    (await axiosWithCredentials.put(`${QUIZZES_API}/${quiz._id}`, quiz)).data;

export const deleteQuiz = async (qid: string) =>
    (await axiosWithCredentials.delete(`${QUIZZES_API}/${qid}`)).data;

export const publishQuiz = async (qid: string, published: boolean) =>
    (await axiosWithCredentials.put(`${QUIZZES_API}/${qid}/publish`, { published })).data;

export const addQuestion = async (qid: string, question: any) =>
    (await axiosWithCredentials.post(`${QUIZZES_API}/${qid}/questions`, question)).data;

export const updateQuestion = async (qid: string, questionId: string, updates: any) =>
    (await axiosWithCredentials.put(`${QUIZZES_API}/${qid}/questions/${questionId}`, updates)).data;

export const deleteQuestion = async (qid: string, questionId: string) =>
    (await axiosWithCredentials.delete(`${QUIZZES_API}/${qid}/questions/${questionId}`)).data;

export const submitAttempt = async (qid: string, answers: any[]) =>
    (await axiosWithCredentials.post(`${QUIZZES_API}/${qid}/attempts`, { answers })).data;

export const lastAttempt = async (qid: string) =>
    (await axiosWithCredentials.get(`${QUIZZES_API}/${qid}/attempts/last`)).data;
