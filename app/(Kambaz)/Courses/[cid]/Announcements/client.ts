import axios from "axios";
import { HTTP_SERVER } from "@/app/env";

const COURSES_API = `${HTTP_SERVER}/api/courses`;
const ANNOUNCEMENTS_API = `${HTTP_SERVER}/api/announcements`;

export const findAnnouncementsForCourse = async (courseId: string) => {
    const { data } = await axios.get(`${COURSES_API}/${courseId}/announcements`);
    return data;
};
export const createAnnouncement = async (courseId: string, announcement: any) => {
    const { data } = await axios.post(`${COURSES_API}/${courseId}/announcements`, announcement);
    return data;
};
export const updateAnnouncement = async (announcement: any) => {
    const { data } = await axios.put(`${ANNOUNCEMENTS_API}/${announcement._id}`, announcement);
    return data;
};
export const deleteAnnouncement = async (announcementId: string) => {
    const { data } = await axios.delete(`${ANNOUNCEMENTS_API}/${announcementId}`);
    return data;
};
