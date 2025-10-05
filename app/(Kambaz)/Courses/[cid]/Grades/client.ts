// app/(Kambaz)/Courses/[cid]/Grades/client.ts
import axios from "axios";
import { HTTP_SERVER } from "@/app/env";

const http = axios.create({ withCredentials: true });

const COURSES_API = `${HTTP_SERVER}/api/courses`;
const GRADES_API  = `${HTTP_SERVER}/api/grades`;
const ASSIGN_API  = `${HTTP_SERVER}/api/assignments`;
const USERS_API   = `${HTTP_SERVER}/api/users`;

export interface Grade {
    _id: string;
    student: string;
    assignment: string;
    course: string;
    score: number | null;
    submitted: string | null; // ISO
    released: boolean;
    type: string;             // "assignment" | "quiz" | "exam" | ...
    comment?: string;
}

export interface UpsertGradePayload {
    student: string;
    assignment: string;
    score?: number | null;
    submitted?: string | null;
    released?: boolean;
    type?: string;
    comment?: string;
}

export type GradeUpdate = Partial<
    Pick<Grade, "score" | "submitted" | "released" | "type" | "comment">
>;

// Reads
export const findGradesForCourse = async (courseId: string): Promise<Grade[]> => {
    const { data } = await http.get(`${COURSES_API}/${courseId}/grades`);
    return data;
};

export const findGradesForAssignment = async (assignmentId: string): Promise<Grade[]> => {
    const { data } = await http.get(`${ASSIGN_API}/${assignmentId}/grades`);
    return data;
};

export const findStudentGradesInCourse = async (
    userId: string, // use "current" for logged-in user
    courseId: string
): Promise<Grade[]> => {
    const { data } = await http.get(`${USERS_API}/${userId}/courses/${courseId}/grades`);
    return data;
};

export const findGradeById = async (gradeId: string): Promise<Grade> => {
    const { data } = await http.get(`${GRADES_API}/${gradeId}`);
    return data;
};

// Writes
export const createGradeForCourse = async (
    courseId: string,
    grade: Omit<Grade, "_id" | "course">
): Promise<Grade> => {
    const { data } = await http.post(`${COURSES_API}/${courseId}/grades`, grade);
    return data;
};

export const upsertGrade = async (
    courseId: string,
    payload: UpsertGradePayload
): Promise<Grade> => {
    const { data } = await http.put(`${COURSES_API}/${courseId}/grades/upsert`, payload);
    return data;
};

export const updateGradeById = async (
    gradeId: string,
    updates: GradeUpdate
): Promise<Grade> => {
    const { data } = await http.put(`${GRADES_API}/${gradeId}`, updates);
    return data;
};

export const deleteGrade = async (gradeId: string) => {
    const { data } = await http.delete(`${GRADES_API}/${gradeId}`);
    return data;
};

export const releaseCourseGrades = async (courseId: string) => {
    const { data } = await http.patch(`${COURSES_API}/${courseId}/grades/release`, {});
    return data;
};

// Helper for your GradeEditor
export const saveGradeFromEditor = async (
    courseId: string,
    studentId: string,
    assignmentId: string,
    score: number
): Promise<Grade> => {
    return upsertGrade(courseId, {
        student: studentId,
        assignment: assignmentId,
        score,
        submitted: new Date().toISOString(),
    });
};
