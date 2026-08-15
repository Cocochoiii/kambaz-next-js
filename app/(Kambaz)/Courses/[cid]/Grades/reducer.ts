// The grades slice. The list comes from the server, so it starts empty.
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  grades: [] as any[],
};

const gradesSlice = createSlice({
  name: "grades",
  initialState,
  reducers: {
    setGrades: (state, { payload: grades }) => {
      state.grades = grades;
    },
    // A cell can be empty, so this changes or adds.
    // The server sends the saved grade back.
    saveGrade: (state, { payload: grade }) => {
      const found = state.grades.find((g: any) => g._id === grade._id);
      if (found) {
        state.grades = state.grades.map((g: any) =>
          g._id === grade._id ? grade : g
        ) as any;
      } else {
        state.grades = [...state.grades, grade] as any;
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

export const { setGrades, saveGrade, releaseGrades } = gradesSlice.actions;
export default gradesSlice.reducer;
