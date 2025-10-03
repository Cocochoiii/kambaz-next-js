import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface Grade {
    _id: string;
    student: string;
    assignment: string;
    course: string;
    score: number | null;
    submitted: string | null;
    released: boolean;
    type: string; // e.g. "assignment" | "quiz" | "exam"
}

export interface GradeCategory {
    name: string;
    weight: number;
    dropLowest: number;
    description: string;
}

export interface CourseGradeConfig {
    course: string;
    courseName: string;
    categories: GradeCategory[];
    gradingScale: Record<string, number>;
}

export interface GradeStatistics {
    course: string;
    courseName: string;
    enrollment: number;
    currentAverage: number;
    projectedFinalGrade: string;
    statistics: {
        mean: number;
        median: number;
        mode: number;
        standardDeviation: number;
        min: number;
        max: number;
        quartiles: { Q1: number; Q2: number; Q3: number };
    };
    gradeDistribution: Record<string, number>;
    categoryAverages: Record<string, number>;
    trends: { improving: number; stable: number; declining: number };
}

type GradesState = {
    grades: Grade[];
    gradeCategories: CourseGradeConfig[];
    gradeStatistics: GradeStatistics[];
};

const initialState: GradesState = {
    grades: [],
    gradeCategories: [],
    gradeStatistics: [],
};

const gradesSlice = createSlice({
    name: "grades",
    initialState,
    reducers: {
        setGrades: (state, action: PayloadAction<Grade[]>) => {
            state.grades = action.payload;
        },

        updateGrade: (
            state,
            action: PayloadAction<{
                studentId: string;
                assignmentId: string;
                courseId: string;
                score: number;
                submitted: string;
            }>
        ) => {
            const { studentId, assignmentId, courseId, score, submitted } = action.payload;
            const idx = state.grades.findIndex(
                (g) =>
                    g.student === studentId && g.assignment === assignmentId && g.course === courseId
            );
            if (idx !== -1) {
                state.grades[idx].score = score;
                state.grades[idx].submitted = submitted;
            } else {
                const newGrade: Grade = {
                    _id: `G${Date.now()}${Math.random().toString(36).slice(2, 8)}`,
                    student: studentId,
                    assignment: assignmentId,
                    course: courseId,
                    score,
                    submitted,
                    released: false,
                    type: "assignment",
                };
                state.grades.push(newGrade);
            }
        },

        releaseGrades: (state, action: PayloadAction<string>) => {
            const courseId = action.payload;
            state.grades = state.grades.map((g) =>
                g.course === courseId ? { ...g, released: true } : g
            );
        },

        toggleGradeRelease: (state, action: PayloadAction<string>) => {
            const idx = state.grades.findIndex((g) => g._id === action.payload);
            if (idx !== -1) state.grades[idx].released = !state.grades[idx].released;
        },

        addGrade: (state, action: PayloadAction<Grade>) => {
            state.grades.push(action.payload);
        },

        deleteGrade: (state, action: PayloadAction<string>) => {
            state.grades = state.grades.filter((g) => g._id !== action.payload);
        },

        updateGradeStatus: (
            state,
            action: PayloadAction<{
                studentId: string;
                assignmentId: string;
                courseId: string;
                submitted: string | null;
            }>
        ) => {
            const { studentId, assignmentId, courseId, submitted } = action.payload;
            const idx = state.grades.findIndex(
                (g) =>
                    g.student === studentId && g.assignment === assignmentId && g.course === courseId
            );
            if (idx !== -1) state.grades[idx].submitted = submitted;
        },

        setGradeCategories: (state, action: PayloadAction<CourseGradeConfig[]>) => {
            state.gradeCategories = action.payload;
        },

        updateCategoryWeights: (
            state,
            action: PayloadAction<{ course: string; categories: GradeCategory[] }>
        ) => {
            const i = state.gradeCategories.findIndex(
                (c) => c.course === action.payload.course
            );
            if (i !== -1) state.gradeCategories[i].categories = action.payload.categories;
        },

        setGradeStatistics: (state, action: PayloadAction<GradeStatistics[]>) => {
            state.gradeStatistics = action.payload;
        },

        updateMultipleGrades: (state, action: PayloadAction<Grade[]>) => {
            action.payload.forEach((u) => {
                const i = state.grades.findIndex((g) => g._id === u._id);
                if (i !== -1) state.grades[i] = u;
            });
        },

        resetGrades: (state) => {
            state.grades = [];
            state.gradeCategories = [];
            state.gradeStatistics = [];
        },
    },
});

export const {
    setGrades,
    updateGrade,
    releaseGrades,
    toggleGradeRelease,
    addGrade,
    deleteGrade,
    updateGradeStatus,
    setGradeCategories,
    updateCategoryWeights,
    setGradeStatistics,
    updateMultipleGrades,
    resetGrades,
} = gradesSlice.actions;

export default gradesSlice.reducer;
