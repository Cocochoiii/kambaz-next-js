import axios from "axios";

const axiosWithCredentials = axios.create({ withCredentials: true });
const API = "/api";

export type InboxMsg = {
    id: string;
    from: string;
    subject: string;
    preview: string;
    time: string;
    unread?: boolean;
    course?: string;
};

/** List messages (optional filters) */
export const listInbox = async (opts?: { q?: string; course?: string }) => {
    const params = new URLSearchParams();
    if (opts?.q) params.set("q", opts.q);
    if (opts?.course) params.set("course", opts.course);
    const path = params.toString() ? `${API}/inbox?${params.toString()}` : `${API}/inbox`;
    const { data } = await axiosWithCredentials.get(path);
    return data as InboxMsg[];
};

/** Send a new message */
export const sendMessage = async (payload: {
    to?: string;
    subject?: string;
    body?: string;
    course?: string;
}) => {
    const { data } = await axiosWithCredentials.post(`${API}/inbox`, payload);
    return data as InboxMsg;
};

/** Mark all as read */
export const markAllRead = async () => {
    const { data } = await axiosWithCredentials.put(`${API}/inbox/readAll`);
    return data;
};

/** Mark a single message as read */
export const markMessageRead = async (messageId: string) => {
    const { data } = await axiosWithCredentials.put(`${API}/inbox/${messageId}/read`);
    return data;
};

/** Delete a message (sender or ADMIN only) */
export const deleteMessage = async (messageId: string) => {
    const { data } = await axiosWithCredentials.delete(`${API}/inbox/${messageId}`);
    return data;
};
