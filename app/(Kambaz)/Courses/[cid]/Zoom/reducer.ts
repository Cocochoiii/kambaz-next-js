// The meetings slice. The list comes from the server, so it starts empty.
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  meetings: [] as any[],
};

const meetingsSlice = createSlice({
  name: "meetings",
  initialState,
  reducers: {
    setMeetings: (state, { payload: meetings }) => {
      state.meetings = meetings;
    },
    // The meeting already has an id from the server.
    addMeeting: (state, { payload: meeting }) => {
      state.meetings = [...state.meetings, meeting] as any;
    },
    deleteMeeting: (state, { payload: meetingId }) => {
      state.meetings = state.meetings.filter((m: any) => m._id !== meetingId);
    },
  },
});

export const { setMeetings, addMeeting, deleteMeeting } = meetingsSlice.actions;
export default meetingsSlice.reducer;
