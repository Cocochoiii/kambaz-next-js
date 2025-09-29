// app/(Kambaz)/Enrollments/reducer.ts
import { createSlice } from "@reduxjs/toolkit";
import { enrollments } from "../Database";
import { v4 as uuidv4 } from "uuid";

const initialState = {
    enrollments: enrollments,
};

const enrollmentsSlice = createSlice({
    name: "enrollments",
    initialState,
    reducers: {
        enrollCourse: (state, { payload }) => {
            const newEnrollment = {
                _id: uuidv4(),
                user: payload.user,
                course: payload.course
            };
            state.enrollments = [...state.enrollments, newEnrollment] as any;
        },
        unenrollCourse: (state, { payload }) => {
            state.enrollments = state.enrollments.filter(
                (e: any) => !(e.user === payload.user && e.course === payload.course)
            );
        },
    },
});

export const { enrollCourse, unenrollCourse } = enrollmentsSlice.actions;
export default enrollmentsSlice.reducer;