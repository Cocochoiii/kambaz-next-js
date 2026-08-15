// The first slice. It only holds a message.
// It has no reducer function, because nothing changes it yet.
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  message: "Hello World",
};

const helloSlice = createSlice({
  name: "hello",
  initialState,
  reducers: {},
});

export default helloSlice.reducer;
