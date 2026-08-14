// The meetings slice. The book does not ask for it. Canvas has a Zoom tab.
// Faculty schedules a meeting and removes one, so I need two actions.
import { createSlice } from "@reduxjs/toolkit";
import { meetings } from "../../../Database";

const initialState = {
  meetings: meetings as any[],
};

const meetingsSlice = createSlice({
  name: "meetings",
  initialState,
  reducers: {
    addMeeting: (state, { payload: meeting }) => {
      const newMeeting: any = {
        _id: new Date().getTime().toString(),
        course: meeting.course,
        topic: meeting.topic,
        startTime: meeting.startTime,
        duration: meeting.duration,
        meetingId: meeting.meetingId,
        host: meeting.host,
        // A new meeting is always in the Upcoming tab.
        past: false,
      };
      state.meetings = [...state.meetings, newMeeting] as any;
    },
    deleteMeeting: (state, { payload: meetingId }) => {
      state.meetings = state.meetings.filter((m: any) => m._id !== meetingId);
    },
  },
});

export const { addMeeting, deleteMeeting } = meetingsSlice.actions;
export default meetingsSlice.reducer;
