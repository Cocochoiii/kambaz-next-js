// The axios calls of the Inbox.
// My inbox and sending need the session, so they use the axios copy
// that carries the cookie.
import axios from "axios";
import { axiosWithCredentials } from "../Account/client";
import { HTTP_SERVER } from "@/app/env";

const USERS_API = `${HTTP_SERVER}/api/users`;
const MESSAGES_API = `${HTTP_SERVER}/api/messages`;

export const findMyMessages = async () => {
  const { data } = await axiosWithCredentials.get(
    `${USERS_API}/current/messages`
  );
  return data;
};

// The server reads the sender from the session.
export const sendMessage = async (message: any) => {
  const { data } = await axiosWithCredentials.post(MESSAGES_API, message);
  return data;
};

export const updateMessage = async (message: any) => {
  const { data } = await axios.put(`${MESSAGES_API}/${message._id}`, message);
  return data;
};

export const deleteMessage = async (messageId: string) => {
  const { data } = await axios.delete(`${MESSAGES_API}/${messageId}`);
  return data;
};
