// app/(Kambaz)/Courses/[cid]/People/client.ts
import axios from "axios";
import { HTTP_SERVER } from "@/app/env";

const http = axios.create({
    baseURL: HTTP_SERVER,
    withCredentials: true, // sessions
});

export interface User {
    _id: string;
    username?: string;
    password?: string; // never sent back by server; included here only for create flows
    firstName?: string;
    lastName?: string;
    role?: string;         // "FACULTY" | "STUDENT" | ...
    loginId?: string;      // shown in your table
    section?: string;      // shown in your table
    lastActivity?: string; // optional, ISO or display
    totalActivity?: string | number;
}

const cidPath = (cid: string) => `/api/courses/${encodeURIComponent(cid)}`;

/** Get roster for a course */
export const listPeopleForCourse = async (cid: string): Promise<User[]> => {
    const { data } = await http.get(`${cidPath(cid)}/people`);
    return data;
};

/** Enroll an existing user by userId */
export const enrollExistingUser = async (cid: string, userId: string): Promise<User[]> => {
    const { data } = await http.post(`${cidPath(cid)}/people`, { userId });
    return data; // refreshed roster
};

/** Create a user and enroll them (faculty only) */
export const createAndEnrollUser = async (cid: string, user: Partial<User>): Promise<User[]> => {
    const { data } = await http.post(`${cidPath(cid)}/people`, { user });
    return data; // refreshed roster
};

/** Unenroll a user from the course (faculty only) */
export const unenrollUser = async (cid: string, userId: string): Promise<void> => {
    await http.delete(`${cidPath(cid)}/people/${encodeURIComponent(userId)}`);
};

/** Quick user edits shown in the People table (faculty only) */
export const updateRosterUser = async (
    cid: string,
    userId: string,
    patch: Partial<Pick<User, "firstName"|"lastName"|"loginId"|"section"|"role">>
): Promise<User> => {
    const { data } = await http.patch(
        `${cidPath(cid)}/people/${encodeURIComponent(userId)}`,
        patch
    );
    return data;
};
