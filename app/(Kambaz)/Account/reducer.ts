// The account slice. It remembers who is signed in.
// Sign in puts the user here. Sign out puts null back.
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentUser: null as any,
};

const accountSlice = createSlice({
  name: "account",
  initialState,
  reducers: {
    setCurrentUser: (state, action) => {
      state.currentUser = action.payload;
    },
  },
});

export const { setCurrentUser } = accountSlice.actions;
export default accountSlice.reducer;
