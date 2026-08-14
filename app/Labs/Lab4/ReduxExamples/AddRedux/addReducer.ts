// 4.7 The add slice. This time the action carries data.
// The two numbers arrive in action.payload.
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  sum: 0,
};

const addSlice = createSlice({
  name: "add",
  initialState,
  reducers: {
    add: (state, action) => {
      state.sum = action.payload.a + action.payload.b;
    },
  },
});

export const { add } = addSlice.actions;
export default addSlice.reducer;
