// app/(Kambaz)/Courses/[cid]/Announcements/client.ts
import axios from "axios";
import { HTTP_SERVER } from "@/app/env";

const api = axios.create({
    baseURL: `${HTTP_SERVER}/api`,
    withCredentials: true,
});

const forCourse = (cid: string) => `/courses/${encodeURIComponent(cid)}/announcements`;
const one = (id: string) => `/announcements/${encodeURIComponent(id)}`;

export type Announcement = {
    _id: string;
    course: string;
    title: string;
    content: string;
    section?: string;
    author?: string;
    authorId?: string;
    date?: string;        // ISO
    updatedAt?: string;   // ISO
    pinned?: boolean;
};

export type NewAnnouncement = Omit<Announcement, "_id" | "course" | "date" | "updatedAt">;

export async function listAnnouncements(cid: string): Promise<Announcement[]> {
    const { data } = await api.get(forCourse(cid));
    return data;
}

export async function getAnnouncement(id: string): Promise<Announcement> {
    const { data } = await api.get(one(id));
    return data;
}

export async function createAnnouncement(
    cid: string,
    body: NewAnnouncement
): Promise<Announcement> {
    const { data } = await api.post(forCourse(cid), body);
    return data;
}

export async function updateAnnouncement(
    id: string,
    patch: Partial<Announcement>
): Promise<Announcement> {
    const { data } = await api.put(one(id), patch);
    return data;
}

export async function deleteAnnouncement(
    id: string
): Promise<{ acknowledged?: boolean; deletedCount?: number } | { status: string }> {
    const { data } = await api.delete(one(id));
    return data;
}
