// app/(Kambaz)/Account/client.ts
import axios from "axios";

// axios instance that keeps cookies for session-based auth
const axiosWithCredentials = axios.create({ withCredentials: true });

// ✅ Next.js-style env var (set this in .env.local)
const HTTP_SERVER =
    process.env.NEXT_PUBLIC_HTTP_SERVER || "http://localhost:4000";

export const USERS_API = `${HTTP_SERVER}/api/users`;

// Users fetchers
export const findAllUsers = async () => {
    const { data } = await axiosWithCredentials.get(USERS_API);
    return data;
};

export const findUsersByRole = async (role: string) => {
    const { data } = await axiosWithCredentials.get(`${USERS_API}?role=${role}`);
    return data;
};

export const findUsersByPartialName = async (name: string) => {
    const { data } = await axiosWithCredentials.get(`${USERS_API}?name=${name}`);
    return data;
};

export const findUserById = async (id: string) => {
    const { data } = await axiosWithCredentials.get(`${USERS_API}/${id}`);
    return data;
};

export const createUser = async (user: any) => {
    const { data } = await axiosWithCredentials.post(USERS_API, user);
    return data;
};

export const updateUser = async (user: any) => {
    const { data } = await axiosWithCredentials.put(
        `${USERS_API}/${user._id}`,
        user
    );
    return data;
};

export const deleteUser = async (userId: string) => {
    const { data } = await axiosWithCredentials.delete(
        `${USERS_API}/${userId}`
    );
    return data;
};

// Courses for a user + enroll/unenroll
export const findCoursesForUser = async (userId: string) => {
    const { data } = await axiosWithCredentials.get(
        `${USERS_API}/${userId}/courses`
    );
    return data;
};

export const enrollIntoCourse = async (userId: string, courseId: string) => {
    const { data } = await axiosWithCredentials.post(
        `${USERS_API}/${userId}/courses/${courseId}`
    );
    return data;
};

export const unenrollFromCourse = async (userId: string, courseId: string) => {
    const { data } = await axiosWithCredentials.delete(
        `${USERS_API}/${userId}/courses/${courseId}`
    );
    return data;
};
