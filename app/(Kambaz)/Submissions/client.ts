import axios from "axios";
import { HTTP_SERVER } from "@/app/env";

const ASSIGNMENTS_API = `${HTTP_SERVER}/api/assignments`;
const USERS_API = `${HTTP_SERVER}/api/users`;
const SUBMISSIONS_API = `${HTTP_SERVER}/api/submissions`;

// Student submits (or overwrites) their work for an assignment.
export const submitAssignment = async (assignmentId: string, submission: any) => {
    const { data } = await axios.post(`${ASSIGNMENTS_API}/${assignmentId}/submissions`, submission);
    return data;
};
export const findSubmissionsForAssignment = async (assignmentId: string) => {
    const { data } = await axios.get(`${ASSIGNMENTS_API}/${assignmentId}/submissions`);
    return data;
};
export const findSubmissionsForUser = async (userId: string) => {
    const { data } = await axios.get(`${USERS_API}/${userId}/submissions`);
    return data;
};
export const findAllSubmissions = async () => {
    const { data } = await axios.get(SUBMISSIONS_API);
    return data;
};
// Faculty grades a submission.
export const gradeSubmission = async (submissionId: string, updates: any) => {
    const { data } = await axios.put(`${SUBMISSIONS_API}/${submissionId}`, updates);
    return data;
};
