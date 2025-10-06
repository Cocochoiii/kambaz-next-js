import axios from "axios";

export type Settings = {
    _id: string;           // equals user _id
    user: string;
    displayName: string;
    email: string;
    darkMode: boolean;
    emailAlerts: boolean;
    pushAlerts: boolean;
    updatedAt: string;
};

const axiosWithCredentials = axios.create({ withCredentials: true });
const API = "/api";

/** Fetch current user's settings (auto-creates defaults if missing) */
export const getSettings = async (): Promise<Settings> => {
    const { data } = await axiosWithCredentials.get(`${API}/settings`);
    return data as Settings;
};

/** Save partial or full settings */
export const saveSettings = async (
    payload: Partial<Pick<Settings, "displayName" | "email" | "darkMode" | "emailAlerts" | "pushAlerts">>
): Promise<Settings> => {
    const { data } = await axiosWithCredentials.put(`${API}/settings`, payload);
    return data as Settings;
};

/** Reset to defaults derived from current user profile */
export const resetSettings = async (): Promise<Settings> => {
    const { data } = await axiosWithCredentials.post(`${API}/settings/reset`);
    return data as Settings;
};
