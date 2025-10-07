import axios from "axios";
import { HTTP_SERVER } from "@/app/env";

const http = axios.create({
    baseURL: HTTP_SERVER,
    withCredentials: true,
});

export type HomePage = "modules" | "stream" | "assignments" | "syllabus";

export interface CourseHomeInfo {
    _id: string;
    name: string;
    number?: string;
    description?: string;
    isPublished: boolean;
    homePage: HomePage;
}

export interface Announcement {
    _id: string;
    course: string;
    title: string;
    content: string;
    section?: string;
    authorId?: string;
    author?: string;
    date: string; // ISO
    updatedAt?: string; // ISO
    pinned?: boolean;
}

export interface HomeSummary {
    course: CourseHomeInfo;
    counts: {
        modules: number;
        assignments: number;
        announcements: number;
    };
    latestAnnouncements: Announcement[];
}

const cidPath = (cid: string) => `/api/courses/${encodeURIComponent(cid)}`;

// Summary for right-side “Status” panel
export const fetchHomeSummary = async (cid: string): Promise<HomeSummary> => {
    const { data } = await http.get(`${cidPath(cid)}/home`);
    return data;
};

// Publish / Unpublish
export const setCoursePublished = async (cid: string, isPublished: boolean) => {
    const { data } = await http.patch(`${cidPath(cid)}/publish`, { isPublished });
    return data;
};

// Change course home page
export const setCourseHomePage = async (cid: string, homePage: HomePage) => {
    const { data } = await http.patch(`${cidPath(cid)}/homepage`, { homePage });
    return data;
};

// Import content (modules / assignments) from another course
export const importCourseContent = async (
    targetCid: string,
    fromCourseId: string,
    include?: { modules?: boolean; assignments?: boolean }
): Promise<{ ok: boolean; modules?: { created: number }; assignments?: { created: number } }> => {
    const { data } = await http.post(`${cidPath(targetCid)}/import`, {
        fromCourseId,
        include,
    });
    return data;
};

/* ─────────────────────────────────────────────────────────
   Course progress (student): module & assignment completion
   GET /api/courses/:cid/progress?studentId=optional
   Response shape below is what the modal expects.
   ───────────────────────────────────────────────────────── */
export interface CourseProgress {
    overallPercent: number; // 0–100
    modules: Array<{
        _id: string;
        title: string;
        completed: number;
        total: number;
        percent: number; // 0–100
        updatedAt?: string;
    }>;
}

export const fetchCourseProgress = async (
    cid: string,
    studentId?: string
): Promise<CourseProgress> => {
    const { data } = await http.get(`${cidPath(cid)}/progress`, {
        params: studentId ? { studentId } : undefined,
    });
    return data;
};
