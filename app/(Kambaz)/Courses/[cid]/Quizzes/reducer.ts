import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    quizzes: [] as any[],
};

const slice = createSlice({
    name: "quizzes",
    initialState,
    reducers: {
        setQuizzes: (state, { payload }) => {
            state.quizzes = payload;
        },
        addQuizLocal: (state, { payload }) => {
            state.quizzes.push(payload);
        },
        updateQuizLocal: (state, { payload }) => {
            state.quizzes = state.quizzes.map((q) => (q._id === payload._id ? payload : q));
        },
        deleteQuizLocal: (state, { payload: id }) => {
            state.quizzes = state.quizzes.filter((q) => q._id !== id);
        },
    },
});

export const { setQuizzes, addQuizLocal, updateQuizLocal, deleteQuizLocal } = slice.actions;
export default slice.reducer;