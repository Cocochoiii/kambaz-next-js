// 4.9 The courses slice.
// The book keeps the courses in the parent component. In Next.js the
// screens are separate routes, so I keep them in the store instead.
import { createSlice } from "@reduxjs/toolkit";
import { courses } from "../Database";

// The empty course. The form starts with it.
const newCourse = {
  _id: "0",
  name: "New Course",
  number: "New Number",
  image: "reactjs.jpg",
  term: "Spring 2025",
  semester: "Full Term",
  startDate: "2025-01-10",
  endDate: "2025-05-15",
  description: "New Description",
};

const initialState = {
  courses: courses as any[],
  // The course in the form right now.
  course: newCourse as any,
};

const coursesSlice = createSlice({
  name: "courses",
  initialState,
  reducers: {
    addCourse: (state) => {
      const created = { ...state.course, _id: new Date().getTime().toString() };
      state.courses = [...state.courses, created] as any;
      state.course = newCourse;
    },
    deleteCourse: (state, { payload: courseId }) => {
      state.courses = state.courses.filter((course: any) => course._id !== courseId);
    },
    updateCourse: (state) => {
      state.courses = state.courses.map((course: any) =>
        course._id === state.course._id ? state.course : course
      ) as any;
      state.course = newCourse;
    },
    // Edit copies a course into the form.
    setCourse: (state, { payload: course }) => {
      state.course = course;
    },
  },
});

export const { addCourse, deleteCourse, updateCourse, setCourse } = coursesSlice.actions;
export default coursesSlice.reducer;
