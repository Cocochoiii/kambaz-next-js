// Update and delete one assignment. Only the assignment id is needed.
import axios from "axios";
import { HTTP_SERVER } from "@/app/env";

const ASSIGNMENTS_API = `${HTTP_SERVER}/api/assignments`;

export const updateAssignment = async (assignment: any) => {
  const { data } = await axios.put(
    `${ASSIGNMENTS_API}/${assignment._id}`,
    assignment
  );
  return data;
};

export const deleteAssignment = async (assignmentId: string) => {
  const { data } = await axios.delete(`${ASSIGNMENTS_API}/${assignmentId}`);
  return data;
};
