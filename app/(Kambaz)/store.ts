import { configureStore } from "@reduxjs/toolkit";
import modulesReducer from "./Courses/[cid]/Modules/reducer";
import coursesReducer from "./Courses/reducer";
import accountReducer from "./Account/reducer";
import enrollmentsReducer from "./Database/reducer";
import assignmentsReducer from "./Courses/[cid]/Assignments/reducer";
import announcementsReducer from "./Courses/[cid]/Announcements/reducer";
import quizzesReducer from "./Courses/[cid]/Quizzes/reducer";
import gradesReducer from "./Courses/[cid]/Grades/reducer";
import zoomReducer from "./Courses/[cid]/Zoom/reducer";

const store = configureStore({
    reducer: {
        modulesReducer,
        coursesReducer,
        accountReducer,
        enrollmentsReducer,
        assignmentsReducer,
        announcementsReducer,
        quizzesReducer,
        gradesReducer,
        zoomReducer,
    },
});

// Export types for TypeScript - CRITICAL for selectors to work
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;