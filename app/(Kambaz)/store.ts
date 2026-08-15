// The Kambaz store. It holds every slice of the app.
import { configureStore } from "@reduxjs/toolkit";
import coursesReducer from "./Courses/reducer";
import modulesReducer from "./Courses/[cid]/Modules/reducer";
import assignmentsReducer from "./Courses/[cid]/Assignments/reducer";
import announcementsReducer from "./Courses/[cid]/Announcements/reducer";
import quizzesReducer from "./Courses/[cid]/Quizzes/reducer";
import gradesReducer from "./Courses/[cid]/Grades/reducer";
import meetingsReducer from "./Courses/[cid]/Zoom/reducer";
import messagesReducer from "./Inbox/reducer";
import accountReducer from "./Account/reducer";
import enrollmentsReducer from "./Enrollments/reducer";

const store = configureStore({
  reducer: {
    coursesReducer,
    modulesReducer,
    assignmentsReducer,
    announcementsReducer,
    quizzesReducer,
    gradesReducer,
    meetingsReducer,
    messagesReducer,
    accountReducer,
    enrollmentsReducer,
  },
});

export default store;
