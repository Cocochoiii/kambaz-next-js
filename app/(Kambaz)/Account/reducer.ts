// The account slice. It remembers who is signed in.
// Sign in puts the user here. Sign out puts null back.
// viewAsStudent lets a Faculty preview a course as a student.
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentUser: null as any,
  viewAsStudent: false,
};

const accountSlice = createSlice({
  name: "account",
  initialState,
  reducers: {
    setCurrentUser: (state, action) => {
      state.currentUser = action.payload;
      // A new user always starts outside the preview.
      state.viewAsStudent = false;
    },
    setViewAsStudent: (state, action) => {
      state.viewAsStudent = action.payload;
    },
  },
});

export const { setCurrentUser, setViewAsStudent } = accountSlice.actions;
export default accountSlice.reducer;
