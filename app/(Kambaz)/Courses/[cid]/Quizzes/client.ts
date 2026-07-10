import axios from "axios";
import { HTTP_SERVER } from "@/app/env";

const COURSES_API = `${HTTP_SERVER}/api/courses`;
const QUIZZES_API = `${HTTP_SERVER}/api/quizzes`;

export const findQuizzesForCourse = async (courseId: string) => {
    const { data } = await axios.get(`${COURSES_API}/${courseId}/quizzes`);
    return data;
};
export const createQuiz = async (courseId: string, quiz: any) => {
    const { data } = await axios.post(`${COURSES_API}/${courseId}/quizzes`, quiz);
    return data;
};
export const updateQuiz = async (quiz: any) => {
    const { data } = await axios.put(`${QUIZZES_API}/${quiz._id}`, quiz);
    return data;
};
export const deleteQuiz = async (quizId: string) => {
    const { data } = await axios.delete(`${QUIZZES_API}/${quizId}`);
    return data;
};
