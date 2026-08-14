// Delete one announcement. Only the id is needed.
import axios from "axios";
import { HTTP_SERVER } from "@/app/env";

const ANNOUNCEMENTS_API = `${HTTP_SERVER}/api/announcements`;

export const deleteAnnouncement = async (announcementId: string) => {
  const { data } = await axios.delete(`${ANNOUNCEMENTS_API}/${announcementId}`);
  return data;
};
