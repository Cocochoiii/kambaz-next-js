// A student joins or leaves a course.
// These calls need the cookie, so they reuse the axios copy.
import { axiosWithCredentials } from "../Account/client";
import { HTTP_SERVER } from "@/app/env";

const USERS_API = `${HTTP_SERVER}/api/users`;

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
