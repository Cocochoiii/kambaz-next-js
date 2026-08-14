// The axios calls of the user screens.
// The session lives in a cookie, so these calls need withCredentials.
import axios from "axios";
import { HTTP_SERVER } from "@/app/env";

export const axiosWithCredentials = axios.create({ withCredentials: true });

const USERS_API = `${HTTP_SERVER}/api/users`;

export const signin = async (credentials: {
  username: string;
  password: string;
}) => {
  const { data } = await axiosWithCredentials.post(
    `${USERS_API}/signin`,
    credentials
  );
  return data;
};

export const signup = async (user: any) => {
  const { data } = await axiosWithCredentials.post(`${USERS_API}/signup`, user);
  return data;
};

// The server answers with the user in the session.
export const profile = async () => {
  const { data } = await axiosWithCredentials.post(`${USERS_API}/profile`);
  return data;
};

export const signout = async () => {
  const { data } = await axiosWithCredentials.post(`${USERS_API}/signout`);
  return data;
};

export const updateUser = async (user: any) => {
  const { data } = await axiosWithCredentials.put(
    `${USERS_API}/${user._id}`,
    user
  );
  return data;
};

// The courses of the user who is signed in.
export const findMyCourses = async () => {
  const { data } = await axiosWithCredentials.get(`${USERS_API}/current/courses`);
  return data;
};

// The server also enrolls the Faculty who made the course.
export const createCourse = async (course: any) => {
  const { data } = await axiosWithCredentials.post(
    `${USERS_API}/current/courses`,
    course
  );
  return data;
};
