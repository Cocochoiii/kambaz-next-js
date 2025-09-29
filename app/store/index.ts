// app/store/index.ts
import { configureStore } from "@reduxjs/toolkit";

// import all your reducers here
import accountReducer from "../(Kambaz)/Account/reducer";
import modulesReducer from "../(Kambaz)/Courses/[cid]/Modules/reducer";
import assignmentsReducer from "../(Kambaz)/Courses/[cid]/Assignments/reducer";

// Lab 4 reducers
import helloReducer from "../Labs/Lab4/ReduxExamples/HelloRedux/helloReducer";
import counterReducer from "../Labs/Lab4/ReduxExamples/CounterRedux/counterReducer";
import addReducer from "../Labs/Lab4/ReduxExamples/AddRedux/addReducer";
import todosReducer from "../Labs/Lab4/ReduxExamples/todos/todosReducer";

const store = configureStore({
    reducer: {
        accountReducer,
        modulesReducer,
        assignmentsReducer,
        // labs
        helloReducer,
        counterReducer,
        addReducer,
        todosReducer,
    },
});

export default store;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
