// Update and delete one module. Only the module id is needed.
import axios from "axios";
import { HTTP_SERVER } from "@/app/env";

const MODULES_API = `${HTTP_SERVER}/api/modules`;

export const updateModule = async (module: any) => {
  const { data } = await axios.put(`${MODULES_API}/${module._id}`, module);
  return data;
};

export const deleteModule = async (moduleId: string) => {
  const { data } = await axios.delete(`${MODULES_API}/${moduleId}`);
  return data;
};
