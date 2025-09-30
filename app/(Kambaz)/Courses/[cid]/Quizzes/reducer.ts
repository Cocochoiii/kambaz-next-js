import { createSlice } from "@reduxjs/toolkit";
import { quizzes } from "../../../Database";
import { v4 as uuidv4 } from "uuid";

const initialState = {
    quizzes: quizzes,
};

const quizzesSlice = createSlice({
    name: "quizzes",
    initialState,
    reducers: {
        addQuiz: (state, { payload: quiz }) => {
            const newQuiz: any = {
                _id: uuidv4(),
                title: quiz.title,
                course: quiz.course,
                status: quiz.status || "Open",
                dueDate: quiz.dueDate,
                points: quiz.points || 0,
                questions: quiz.questions || 0,
                timeLimit: quiz.timeLimit || 20,
                attempts: quiz.attempts || 1,
                description: quiz.description || "",
                availableFrom: quiz.availableFrom,
                availableUntil: quiz.availableUntil,
            };
            state.quizzes = [...state.quizzes, newQuiz] as any;
        },
        deleteQuiz: (state, { payload: quizId }) => {
            state.quizzes = state.quizzes.filter(
                (q: any) => q._id !== quizId
            );
        },
        updateQuiz: (state, { payload: quiz }) => {
            state.quizzes = state.quizzes.map((q: any) =>
                q._id === quiz._id ? quiz : q
            ) as any;
        },
    },
});

export const { addQuiz, deleteQuiz, updateQuiz } = quizzesSlice.actions;
export default quizzesSlice.reducer;