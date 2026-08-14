// The axios call of the Calendar. The server does the joining, so one
// request brings every date I care about. It needs the session cookie.
import { axiosWithCredentials } from "../Account/client";
import { HTTP_SERVER } from "@/app/env";

const USERS_API = `${HTTP_SERVER}/api/users`;

export const findMyEvents = async () => {
  const { data } = await axiosWithCredentials.get(
    `${USERS_API}/current/calendar`
  );
  return data;
};
