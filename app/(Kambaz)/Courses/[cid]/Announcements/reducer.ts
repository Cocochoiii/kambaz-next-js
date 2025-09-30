import { createSlice } from "@reduxjs/toolkit";
import { announcements } from "../../../Database";
import { v4 as uuidv4 } from "uuid";

const initialState = {
    announcements: announcements,
};

const announcementsSlice = createSlice({
    name: "announcements",
    initialState,
    reducers: {
        addAnnouncement: (state, { payload: announcement }) => {
            const newAnnouncement: any = {
                _id: uuidv4(),
                title: announcement.title,
                content: announcement.content,
                course: announcement.course,
                section: announcement.section || "All Sections",
                author: announcement.author,
                date: new Date().toISOString(),
            };
            state.announcements = [...state.announcements, newAnnouncement] as any;
        },
        deleteAnnouncement: (state, { payload: announcementId }) => {
            state.announcements = state.announcements.filter(
                (a: any) => a._id !== announcementId
            );
        },
        updateAnnouncement: (state, { payload: announcement }) => {
            state.announcements = state.announcements.map((a: any) =>
                a._id === announcement._id ? announcement : a
            ) as any;
        },
    },
});

export const { addAnnouncement, deleteAnnouncement, updateAnnouncement } =
    announcementsSlice.actions;
export default announcementsSlice.reducer;