// app/(Kambaz)/Courses/[cid]/Assignments/client.ts
import axios from "axios";
import { HTTP_SERVER } from "@/app/env";

const api = axios.create({
    baseURL: `${HTTP_SERVER}/api`,
    withCredentials: true,
});

const forCourse = (cid: string) => `/courses/${encodeURIComponent(cid)}/assignments`;
const one = (id: string) => `/assignments/${encodeURIComponent(id)}`;

export type Assignment = {
    _id: string;
    course: string;
    title: string;
    description: string;
    points: number;
    dueDate?: string;        // ISO
    availableFrom?: string;  // ISO
    availableUntil?: string; // ISO
    author?: string;
    authorId?: string;
    createdAt?: string;      // ISO
    updatedAt?: string;      // ISO
};

export type NewAssignment = Omit<Assignment, "_id" | "course" | "createdAt" | "updatedAt">;

export async function listAssignments(cid: string): Promise<Assignment[]> {
    const { data } = await api.get(forCourse(cid));
    return data;
}

export async function getAssignment(id: string): Promise<Assignment> {
    const { data } = await api.get(one(id));
    return data;
}

export async function createAssignment(
    cid: string,
    body: NewAssignment
): Promise<Assignment> {
    const { data } = await api.post(forCourse(cid), body);
    return data;
}

export async function updateAssignment(
    id: string,
    patch: Partial<Assignment>
): Promise<Assignment> {
    const { data } = await api.put(one(id), patch);
    return data;
}

export async function deleteAssignment(
    id: string
): Promise<{ acknowledged?: boolean; deletedCount?: number } | { status: string }> {
    const { data } = await api.delete(one(id));
    return data;
}
