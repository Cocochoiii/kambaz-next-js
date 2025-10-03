import axios from "axios";

const axiosWithCredentials = axios.create({ withCredentials: true });

// ✅ Always relative base via Next proxy
export const USERS_API = `/api/users`;

export const findAllUsers = async () => (await axiosWithCredentials.get(USERS_API)).data;
export const findUsersByRole = async (role: string) =>
    (await axiosWithCredentials.get(`${USERS_API}?role=${role}`)).data;
export const findUsersByPartialName = async (name: string) =>
    (await axiosWithCredentials.get(`${USERS_API}?name=${name}`)).data;
export const findUserById = async (id: string) =>
    (await axiosWithCredentials.get(`${USERS_API}/${id}`)).data;
export const createUser = async (user: any) =>
    (await axiosWithCredentials.post(USERS_API, user)).data;
export const updateUser = async (user: any) =>
    (await axiosWithCredentials.put(`${USERS_API}/${user._id}`, user)).data;
export const deleteUser = async (userId: string) =>
    (await axiosWithCredentials.delete(`${USERS_API}/${userId}`)).data;

export const findCoursesForUser = async (userId: string) =>
    (await axiosWithCredentials.get(`${USERS_API}/${userId}/courses`)).data;
export const enrollIntoCourse = async (userId: string, courseId: string) =>
    (await axiosWithCredentials.post(`${USERS_API}/${userId}/courses/${courseId}`)).data;
export const unenrollFromCourse = async (userId: string, courseId: string) =>
    (await axiosWithCredentials.delete(`${USERS_API}/${userId}/courses/${courseId}`)).data;
