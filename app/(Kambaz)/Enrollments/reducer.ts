// The enrollments slice. The server owns the list now.
// The shape stays { user, course }, so other screens still work.
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  enrollments: [] as any[],
};

const enrollmentsSlice = createSlice({
  name: "enrollments",
  initialState,
  reducers: {
    // Built from the courses the server sent.
    setEnrollments: (state, { payload: enrollments }) => {
      state.enrollments = enrollments;
    },
    enrollUser: (state, { payload }) => {
      const newEnrollment = {
        _id: `${payload.userId}-${payload.courseId}`,
        user: payload.userId,
        course: payload.courseId,
      };
      state.enrollments = [...state.enrollments, newEnrollment] as any;
    },
    unenrollUser: (state, { payload }) => {
      state.enrollments = state.enrollments.filter(
        (e: any) => !(e.user === payload.userId && e.course === payload.courseId)
      );
    },
  },
});

export const { setEnrollments, enrollUser, unenrollUser } =
  enrollmentsSlice.actions;
export default enrollmentsSlice.reducer;
