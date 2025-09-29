import { createSlice } from "@reduxjs/toolkit";
import { courses } from "../Database";
import { v4 as uuidv4 } from "uuid";

const initialState = {
    courses: courses,
    course: {
        _id: "0",
        name: "New Course",
        number: "New Number",
        startDate: "2025-01-10",
        endDate: "2025-05-15",
        image: "/images/course1.jpg",
        description: "New Description"
    }
};

const coursesSlice = createSlice({
    name: "courses",
    initialState,
    reducers: {
        addCourse: (state) => {
            const newCourse = { ...state.course, _id: uuidv4() };
            state.courses = [...state.courses, newCourse] as any;
        },
        deleteCourse: (state, { payload: courseId }) => {
            state.courses = state.courses.filter((c: any) => c._id !== courseId);
        },
        updateCourse: (state) => {
            state.courses = state.courses.map((c: any) =>
                c._id === state.course._id ? state.course : c
            ) as any;
        },
        setCourse: (state, { payload: course }) => {
            state.course = course;
        },
    },
});

export const { addCourse, deleteCourse, updateCourse, setCourse } = coursesSlice.actions;
export default coursesSlice.reducer;