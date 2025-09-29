import { configureStore } from "@reduxjs/toolkit";
import accountReducer from "../(Kambaz)/Account/reducer";
// Add other reducers as you implement them
// import modulesReducer from "../(Kambaz)/Courses/[cid]/Modules/reducer";
// import assignmentsReducer from "../(Kambaz)/Courses/[cid]/Assignments/reducer";

const store = configureStore({
    reducer: {
        accountReducer,
        // Add other reducers here as you implement them
        // modulesReducer,
        // assignmentsReducer,
    },
});

export default store;