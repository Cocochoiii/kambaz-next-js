import { createSlice } from "@reduxjs/toolkit";
import { announcements } from "../../../Database";

const initialState = {
    announcements: announcements,
};

const announcementsSlice = createSlice({
    name: "announcements",
    initialState,
    reducers: {
        setAnnouncements: (state, { payload: announcements }) => {
            state.announcements = announcements;
        },
        addAnnouncement: (state, { payload: announcement }) => {
            state.announcements = [...state.announcements, announcement] as any;
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

export const { setAnnouncements, addAnnouncement, deleteAnnouncement, updateAnnouncement } =
    announcementsSlice.actions;
export default announcementsSlice.reducer;