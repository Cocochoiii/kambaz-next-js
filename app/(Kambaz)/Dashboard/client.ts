import axios from "axios";

const axiosWithCredentials = axios.create({ withCredentials: true });
const API = "/api";

/* ========= Courses (CRUD) ========= */

export const fetchAllCourses = async () => {
    const { data } = await axiosWithCredentials.get(`${API}/courses`);
    return data as any[];
};

export const findCourseById = async (courseId: string) => {
    const { data } = await axiosWithCredentials.get(`${API}/courses/${courseId}`);
    return data;
};

export const createCourse = async (course: {
    name: string;
    number?: string;
    credits?: number;
    description?: string;
    image?: string;
    semester?: string;
    term?: string;
    startDate?: string;
    endDate?: string;
}) => {
    const { data } = await axiosWithCredentials.post(`${API}/courses`, course);
    return data;
};

export const updateCourse = async (courseId: string, updates: any) => {
    const { data } = await axiosWithCredentials.put(`${API}/courses/${courseId}`, updates);
    return data;
};

export const deleteCourse = async (courseId: string) => {
    const { data } = await axiosWithCredentials.delete(`${API}/courses/${courseId}`);
    return data;
};

/* ========= Enrollments (session required) ========= */
/** Use "current" for the signed-in user (server resolves from session). */
export const listMyCourses = async () => {
    const { data } = await axiosWithCredentials.get(`${API}/users/current/courses`);
    return data as any[];
};

export const enrollIntoCourse = async (courseId: string, userId: string | "current" = "current") => {
    const { data } = await axiosWithCredentials.post(`${API}/users/${userId}/courses/${courseId}`);
    return data;
};

export const unenrollFromCourse = async (courseId: string, userId: string | "current" = "current") => {
    const { data } = await axiosWithCredentials.delete(`${API}/users/${userId}/courses/${courseId}`);
    return data;
};
