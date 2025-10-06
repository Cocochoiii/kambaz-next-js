import axios from "axios";

const axiosWithCredentials = axios.create({ withCredentials: true });
const API = "/api";

// ----- Meetings -----
export const listMeetingsForCourse = async (courseId: string) => {
    const { data } = await axiosWithCredentials.get(`${API}/courses/${courseId}/zoom/meetings`);
    return data;
};

export const listMyMeetings = async () => {
    const { data } = await axiosWithCredentials.get(`${API}/zoom/meetings`);
    return data;
};

export const scheduleMeeting = async (courseId: string, payload: {
    topic: string;
    courseName?: string;
    section?: string;
    startTime: string;
    duration: number;
    passcode?: string;
    timezone?: string;
}) => {
    const { data } = await axiosWithCredentials.post(`${API}/courses/${courseId}/zoom/meetings`, payload);
    return data;
};

export const deleteMeeting = async (meetingId: string) => {
    const { data } = await axiosWithCredentials.delete(`${API}/zoom/meetings/${meetingId}`);
    return data;
};

export const updateMeetingStatus = async (meetingId: string, status: "upcoming" | "past" | "recurring") => {
    const { data } = await axiosWithCredentials.put(`${API}/zoom/meetings/${meetingId}/status`, { status });
    return data;
};

// ----- Personal meeting room -----
export const getPersonalMeetingRoom = async () => {
    const { data } = await axiosWithCredentials.get(`${API}/zoom/personal-room`);
    return data;
};

// ----- Recordings -----
export const listCloudRecordings = async (courseId?: string) => {
    const { data } = await axiosWithCredentials.get(`${API}/zoom/recordings`, {
        params: courseId ? { courseId } : {},
    });
    return data;
};

export const addCloudRecording = async (payload: {
    meetingId: string;
    topic: string;
    courseId?: string;
    date: string;     // e.g. "Oct 5, 2025"
    duration: string; // e.g. "1h 00m"
    url: string;
}) => {
    const { data } = await axiosWithCredentials.post(`${API}/zoom/recordings`, payload);
    return data;
};
