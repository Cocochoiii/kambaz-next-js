import { createSlice } from "@reduxjs/toolkit";
import { courses } from "../Database";

export type Course = {
    _id: string;
    name: string;
    number: string;        // e.g., CS5610
    semester?: string;     // e.g., Spring 2025
    term?: string;         // e.g., Full Term
    startDate?: string;    // ISO yyyy-mm-dd
    endDate?: string;      // ISO yyyy-mm-dd
    image?: string;        // filename OR /images/filename
    description?: string;
};

const initialState = {
    courses: courses as any[],
    // working draft used by the top form (also used by Edit on a tile)
    course: {
        _id: "0",
        name: "New Course",
        number: "New Number",
        semester: "Spring 2025",
        term: "Full Term",
        startDate: "2025-01-10",
        endDate: "2025-05-15",
        image: "course1.jpg",          // store a filename by default
        description: "New Description",
    } as Course,
};

const coursesSlice = createSlice({
    name: "courses",
    initialState,
    reducers: {
        setCourses: (state, { payload: courses }) => {
            state.courses = courses as any;
        },
        addCourse: (state, { payload: course }) => {
            state.courses = [...state.courses, course] as any;
        },
        deleteCourse: (state, { payload: courseId }) => {
            state.courses = state.courses.filter((c: any) => c._id !== courseId);
        },
        updateCourse: (state, { payload: course }) => {
            state.courses = state.courses.map((c: any) =>
                c._id === course._id ? course : c
            ) as any;
        },
        // Called by the Edit button to load that course into the form
        setCourse: (state, { payload: course }) => {
            state.course = course;
        },
    },
});

export const { setCourses, addCourse, deleteCourse, updateCourse, setCourse } = coursesSlice.actions;
export default coursesSlice.reducer;
