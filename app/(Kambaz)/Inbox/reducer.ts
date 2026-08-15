// The messages slice. The list comes from the server, so it starts empty.
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  messages: [] as any[],
};

const messagesSlice = createSlice({
  name: "messages",
  initialState,
  reducers: {
    setMessages: (state, { payload: messages }) => {
      state.messages = messages;
    },
    // A sent message is not in my inbox, so there is no add.
    updateMessage: (state, { payload: message }) => {
      state.messages = state.messages.map((m: any) =>
        m._id === message._id ? message : m
      ) as any;
    },
    deleteMessage: (state, { payload: messageId }) => {
      state.messages = state.messages.filter((m: any) => m._id !== messageId);
    },
  },
});

export const { setMessages, updateMessage, deleteMessage } =
  messagesSlice.actions;
export default messagesSlice.reducer;
