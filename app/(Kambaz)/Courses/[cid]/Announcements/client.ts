// Change and delete one announcement. Only the id is needed.
import axios from "axios";
import { HTTP_SERVER } from "@/app/env";

const ANNOUNCEMENTS_API = `${HTTP_SERVER}/api/announcements`;

export const updateAnnouncement = async (announcement: any) => {
  const { data } = await axios.put(
    `${ANNOUNCEMENTS_API}/${announcement._id}`,
    announcement
  );
  return data;
};

export const deleteAnnouncement = async (announcementId: string) => {
  const { data } = await axios.delete(`${ANNOUNCEMENTS_API}/${announcementId}`);
  return data;
};
