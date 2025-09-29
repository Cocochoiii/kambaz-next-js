import { createSlice } from "@reduxjs/toolkit";
import { enrollments } from "./index";
import { v4 as uuidv4 } from "uuid";

const initialState = {
    enrollments: enrollments,
};

const enrollmentsSlice = createSlice({
    name: "enrollments",
    initialState,
    reducers: {
        enrollUser: (state, action) => {
            const newEnrollment = {
                _id: uuidv4(),
                user: action.payload.userId,
                course: action.payload.courseId
            };
            state.enrollments = [...state.enrollments, newEnrollment] as any;
        },
        unenrollUser: (state, action) => {
            state.enrollments = state.enrollments.filter(
                (e: any) => !(e.user === action.payload.userId && e.course === action.payload.courseId)
            );
        },
    },
});

export const { enrollUser, unenrollUser } = enrollmentsSlice.actions;
export default enrollmentsSlice.reducer;