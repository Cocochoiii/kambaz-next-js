// The courses slice.
// The server makes the ids now. This slice only copies the answer.
import { createSlice } from "@reduxjs/toolkit";

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
  // Empty at first. Session fills it.
  courses: [] as any[],
  // The course in the form right now.
  course: newCourse as any,
};

const coursesSlice = createSlice({
  name: "courses",
  initialState,
  reducers: {
    // The whole list from the server.
    setCourses: (state, { payload: courses }) => {
      state.courses = courses;
    },
    // The course already has an id.
    addCourse: (state, { payload: course }) => {
      state.courses = [...state.courses, course] as any;
      state.course = newCourse;
    },
    deleteCourse: (state, { payload: courseId }) => {
      state.courses = state.courses.filter((course: any) => course._id !== courseId);
    },
    updateCourse: (state, { payload: course }) => {
      state.courses = state.courses.map((c: any) =>
        c._id === course._id ? course : c
      ) as any;
      state.course = newCourse;
    },
    // Edit copies a course into the form.
    setCourse: (state, { payload: course }) => {
      state.course = course;
    },
  },
});

export const { setCourses, addCourse, deleteCourse, updateCourse, setCourse } =
  coursesSlice.actions;
export default coursesSlice.reducer;
