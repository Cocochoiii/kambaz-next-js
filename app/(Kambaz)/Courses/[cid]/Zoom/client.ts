// Delete one meeting. Only the id is needed.
import axios from "axios";
import { HTTP_SERVER } from "@/app/env";

const MEETINGS_API = `${HTTP_SERVER}/api/meetings`;

export const deleteMeeting = async (meetingId: string) => {
  const { data } = await axios.delete(`${MEETINGS_API}/${meetingId}`);
  return data;
};
