import { configureStore } from "@reduxjs/toolkit";
import modulesReducer from "./Courses/[cid]/Modules/reducer";
import accountReducer from "./Account/reducer";
import assignmentsReducer from "./Courses/[cid]/Assignments/reducer";
import coursesReducer from "./Courses/reducer";
import enrollmentsReducer from "./Database/reducer";

const store = configureStore({
    reducer: {
        modulesReducer,
        accountReducer,
        assignmentsReducer,
        coursesReducer,
        enrollmentsReducer,
    },
});

export default store;