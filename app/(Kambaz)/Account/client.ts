import axios from "axios";
import { HTTP_SERVER } from "@/app/env";

export const USERS_API = `${HTTP_SERVER}/api/users`;

// If you need cookies/sessions for A5, use axios with credentials:
export const axiosWithCredentials = axios.create({
    baseURL: HTTP_SERVER,
    withCredentials: true,
});

export const signin = async (credentials: any) => {
    const { data } = await axiosWithCredentials.post(`/api/users/signin`, credentials);
    return data;
};
export const signup = async (user: any) => {
    const { data } = await axiosWithCredentials.post(`/api/users/signup`, user);
    return data;
};
export const profile = async () => {
    const { data } = await axiosWithCredentials.post(`/api/users/profile`);
    return data;
};
export const signout = async () => {
    const { data } = await axiosWithCredentials.post(`/api/users/signout`);
    return data;
};
export const updateUser = async (user: any) => {
    const { data } = await axiosWithCredentials.put(`/api/users/${user._id}`, user);
    return data;
};
export const findMyCourses = async () => {
    const { data } = await axiosWithCredentials.get(`/api/users/current/courses`);
    return data;
};
export const createCourseForCurrentUser = async (course: any) => {
    const { data } = await axiosWithCredentials.post(`/api/users/current/courses`, course);
    return data;
};
