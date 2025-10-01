import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { v4 as uuidv4 } from "uuid";

export interface ZoomMeeting {
    _id: string;
    topic: string;
    courseId: string;
    courseName: string;
    section: string;
    meetingId: string;
    passcode: string;
    startTime: string;
    duration: number;
    timezone: string;
    joinUrl: string;
    status: "upcoming" | "past" | "recurring";
    hostId: string;
    recordingUrl?: string;
    createdAt: string;
}

interface ZoomState {
    meetings: ZoomMeeting[];
    personalMeetingRoom: {
        meetingId: string;
        passcode: string;
        joinUrl: string;
    } | null;
    cloudRecordings: any[];
}

// Initial mock data for Zoom meetings
const initialMeetings: ZoomMeeting[] = [
    {
        _id: "zm1",
        topic: "CS5610 Web Development - Lecture",
        courseId: "CS5610",
        courseName: "Web Development",
        section: "01",
        meetingId: "123-4567-8901",
        passcode: "web123",
        startTime: "2025-10-03T14:00:00",
        duration: 90,
        timezone: "America/New_York",
        joinUrl: "https://zoom.us/j/12345678901",
        status: "upcoming",
        hostId: "123",
        createdAt: "2025-09-01T00:00:00"
    },
    {
        _id: "zm2",
        topic: "CS5610 Web Development - Office Hours",
        courseId: "CS5610",
        courseName: "Web Development",
        section: "01",
        meetingId: "234-5678-9012",
        passcode: "office456",
        startTime: "2025-10-04T15:00:00",
        duration: 60,
        timezone: "America/New_York",
        joinUrl: "https://zoom.us/j/23456789012",
        status: "upcoming",
        hostId: "123",
        createdAt: "2025-09-01T00:00:00"
    },
    {
        _id: "zm3",
        topic: "CS5010 Mobile App Development - Lecture",
        courseId: "CS5010",
        courseName: "Mobile App Development",
        section: "02",
        meetingId: "345-6789-0123",
        passcode: "mobile789",
        startTime: "2025-10-05T10:00:00",
        duration: 120,
        timezone: "America/New_York",
        joinUrl: "https://zoom.us/j/34567890123",
        status: "upcoming",
        hostId: "123",
        createdAt: "2025-09-01T00:00:00"
    },
    {
        _id: "zm4",
        topic: "CS4530 Object-Oriented Design - Workshop",
        courseId: "CS4530",
        courseName: "Object-Oriented Design",
        section: "01",
        meetingId: "456-7890-1234",
        passcode: "ood321",
        startTime: "2025-09-28T14:00:00",
        duration: 90,
        timezone: "America/New_York",
        joinUrl: "https://zoom.us/j/45678901234",
        status: "past",
        hostId: "123",
        recordingUrl: "https://zoom.us/rec/share/recording123",
        createdAt: "2025-09-01T00:00:00"
    },
    {
        _id: "zm5",
        topic: "CS5800 Algorithms - Review Session",
        courseId: "CS5800",
        courseName: "Algorithms",
        section: "03",
        meetingId: "567-8901-2345",
        passcode: "algo555",
        startTime: "2025-10-06T16:00:00",
        duration: 120,
        timezone: "America/New_York",
        joinUrl: "https://zoom.us/j/56789012345",
        status: "upcoming",
        hostId: "234",
        createdAt: "2025-09-01T00:00:00"
    }
];

const initialState: ZoomState = {
    meetings: initialMeetings,
    personalMeetingRoom: {
        meetingId: "999-8888-7777",
        passcode: "personal123",
        joinUrl: "https://zoom.us/j/99988887777"
    },
    cloudRecordings: []
};

const zoomSlice = createSlice({
    name: "zoom",
    initialState,
    reducers: {
        addMeeting: (state, action: PayloadAction<Omit<ZoomMeeting, "_id" | "createdAt">>) => {
            const newMeeting: ZoomMeeting = {
                ...action.payload,
                _id: uuidv4(),
                createdAt: new Date().toISOString()
            };
            state.meetings.push(newMeeting);
        },
        updateMeeting: (state, action: PayloadAction<ZoomMeeting>) => {
            const index = state.meetings.findIndex(m => m._id === action.payload._id);
            if (index !== -1) {
                state.meetings[index] = action.payload;
            }
        },
        deleteMeeting: (state, action: PayloadAction<string>) => {
            state.meetings = state.meetings.filter(m => m._id !== action.payload);
        },
        updateMeetingStatus: (state, action: PayloadAction<{ meetingId: string; status: "upcoming" | "past" | "recurring" }>) => {
            const meeting = state.meetings.find(m => m._id === action.payload.meetingId);
            if (meeting) {
                meeting.status = action.payload.status;
            }
        },
        setPersonalMeetingRoom: (state, action: PayloadAction<ZoomState["personalMeetingRoom"]>) => {
            state.personalMeetingRoom = action.payload;
        },
        addCloudRecording: (state, action: PayloadAction<any>) => {
            state.cloudRecordings.push(action.payload);
        }
    }
});

export const {
    addMeeting,
    updateMeeting,
    deleteMeeting,
    updateMeetingStatus,
    setPersonalMeetingRoom,
    addCloudRecording
} = zoomSlice.actions;

export default zoomSlice.reducer;