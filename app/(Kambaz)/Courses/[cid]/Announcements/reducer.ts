// The announcements slice. Canvas lets Faculty post and remove
// announcements, so I need add and delete, like the modules slice.
import { createSlice } from "@reduxjs/toolkit";
import { announcements } from "../../../Database";

const initialState = {
  announcements: announcements as any[],
};

const announcementsSlice = createSlice({
  name: "announcements",
  initialState,
  reducers: {
    addAnnouncement: (state, { payload: announcement }) => {
      const newAnnouncement: any = {
        _id: new Date().getTime().toString(),
        course: announcement.course,
        title: announcement.title,
        content: announcement.content,
        author: announcement.author,
        section: "All Sections",
        date: new Date().toISOString(),
        read: false,
      };
      state.announcements = [newAnnouncement, ...state.announcements] as any;
    },
    deleteAnnouncement: (state, { payload: announcementId }) => {
      state.announcements = state.announcements.filter(
        (a: any) => a._id !== announcementId
      );
    },
  },
});

export const { addAnnouncement, deleteAnnouncement } = announcementsSlice.actions;
export default announcementsSlice.reducer;
