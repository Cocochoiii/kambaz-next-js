import axios from "axios";
import { HTTP_SERVER } from "@/app/env";
const USERS_API = `${HTTP_SERVER}/api/users`;
const MODULES_API = `${HTTP_SERVER}/api/modules`;

export const deleteModule = async (moduleId: string) => {
    const { data } = await axios.delete(`${MODULES_API}/${moduleId}`);
    return data;
};
export const updateModule = async (module: any) => {
    const { data } = await axios.put(`${MODULES_API}/${module._id}`, module);
    return data;
};
