import { createSlice } from "@reduxjs/toolkit";

// Holds the list of users shown on the People screen.
const initialState = {
    users: [] as any[],
};

const usersSlice = createSlice({
    name: "users",
    initialState,
    reducers: {
        setUsers: (state, { payload }) => {
            state.users = payload;
        },
        addUser: (state, { payload }) => {
            state.users = [payload, ...state.users];
        },
        updateUser: (state, { payload }) => {
            state.users = state.users.map((u: any) =>
                u._id === payload._id ? payload : u
            );
        },
        deleteUser: (state, { payload }) => {
            state.users = state.users.filter((u: any) => u._id !== payload);
        },
    },
});

export const { setUsers, addUser, updateUser, deleteUser } = usersSlice.actions;
export default usersSlice.reducer;
