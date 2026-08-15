// The announcements slice. The list comes from the server, so it starts empty.
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  announcements: [] as any[],
};

const announcementsSlice = createSlice({
  name: "announcements",
  initialState,
  reducers: {
    setAnnouncements: (state, { payload: announcements }) => {
      state.announcements = announcements;
    },
    // The announcement already has an id from the server.
    addAnnouncement: (state, { payload: announcement }) => {
      state.announcements = [announcement, ...state.announcements] as any;
    },
    updateAnnouncement: (state, { payload: announcement }) => {
      state.announcements = state.announcements.map((a: any) =>
        a._id === announcement._id ? announcement : a
      ) as any;
    },
    deleteAnnouncement: (state, { payload: announcementId }) => {
      state.announcements = state.announcements.filter(
        (a: any) => a._id !== announcementId
      );
    },
  },
});

export const {
  setAnnouncements,
  addAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
} = announcementsSlice.actions;
export default announcementsSlice.reducer;
