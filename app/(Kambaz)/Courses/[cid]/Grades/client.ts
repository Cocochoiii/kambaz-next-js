import axios from "axios";
import { HTTP_SERVER } from "@/app/env";

const COURSES_API = `${HTTP_SERVER}/api/courses`;

export const findGradesForCourse = async (courseId: string) => {
    const { data } = await axios.get(`${COURSES_API}/${courseId}/grades`);
    return data;
};
export const saveGrade = async (courseId: string, grade: any) => {
    const { data } = await axios.post(`${COURSES_API}/${courseId}/grades`, grade);
    return data;
};
export const releaseGrades = async (courseId: string) => {
    const { data } = await axios.put(`${COURSES_API}/${courseId}/grades/release`);
    return data;
};
