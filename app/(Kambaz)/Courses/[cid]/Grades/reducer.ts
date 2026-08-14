// The grades slice. Faculty types a score in a cell, and later releases
// the grades to the students. So I need two actions.
import { createSlice } from "@reduxjs/toolkit";
import { grades } from "../../../Database";

const initialState = {
  grades: grades as any[],
};

const gradesSlice = createSlice({
  name: "grades",
  initialState,
  reducers: {
    // A cell can be empty, so this changes a score or makes a new one.
    updateGrade: (state, { payload }) => {
      const found = state.grades.find(
        (g: any) =>
          g.student === payload.studentId &&
          g.assignment === payload.assignmentId &&
          g.course === payload.courseId
      );
      if (found) {
        found.score = payload.score;
      } else {
        state.grades = [
          ...state.grades,
          {
            _id: new Date().getTime().toString(),
            student: payload.studentId,
            course: payload.courseId,
            assignment: payload.assignmentId,
            score: payload.score,
            submitted: null,
            released: false,
            type: "assignment",
          },
        ] as any;
      }
    },
    // Students only see a score after it is released.
    releaseGrades: (state, { payload: courseId }) => {
      state.grades = state.grades.map((g: any) =>
        g.course === courseId ? { ...g, released: true } : g
      ) as any;
    },
  },
});

export const { updateGrade, releaseGrades } = gradesSlice.actions;
export default gradesSlice.reducer;
