import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    currentUser: null,
    // Faculty can preview the course as a student without logging out.
    viewAsStudent: false,
};

const accountSlice = createSlice({
    name: "account",
    initialState,
    reducers: {
        setCurrentUser: (state, action) => {
            state.currentUser = action.payload;
            // Reset the preview whenever the signed-in user changes.
            state.viewAsStudent = false;
        },
        setViewAsStudent: (state, action) => {
            state.viewAsStudent = action.payload;
        },
    },
});

export const { setCurrentUser, setViewAsStudent } = accountSlice.actions;
export default accountSlice.reducer;
