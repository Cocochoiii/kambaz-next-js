import { axiosWithCredentials } from "../Account/client";
import { HTTP_SERVER } from "@/app/env";

// Enrollment endpoints on the Node server.
export const enrollIntoCourse = async (userId: string, courseId: string) => {
    const { data } = await axiosWithCredentials.post(
        `${HTTP_SERVER}/api/users/${userId}/courses/${courseId}`
    );
    return data;
};
export const unenrollFromCourse = async (userId: string, courseId: string) => {
    const { data } = await axiosWithCredentials.delete(
        `${HTTP_SERVER}/api/users/${userId}/courses/${courseId}`
    );
    return data;
};
export const findCoursesForUser = async (userId: string) => {
    const { data } = await axiosWithCredentials.get(
        `${HTTP_SERVER}/api/users/${userId}/courses`
    );
    return data;
};
