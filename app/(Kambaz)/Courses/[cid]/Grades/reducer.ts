// app/(Kambaz)/Courses/[cid]/Grades/reducer.ts

import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Define interfaces
export interface Grade {
    _id: string;
    student: string;
    assignment: string;
    course: string;
    score: number | null;
    submitted: string | null;
    released: boolean;
    type: string;
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
        quartiles: {
            Q1: number;
            Q2: number;
            Q3: number;
        };
    };
    gradeDistribution: Record<string, number>;
    categoryAverages: Record<string, number>;
    trends: {
        improving: number;
        stable: number;
        declining: number;
    };
}

interface GradesState {
    grades: Grade[];
    gradeCategories: CourseGradeConfig[];
    gradeStatistics: GradeStatistics[];
}

// Import data - use dynamic imports to avoid circular dependencies
const getInitialData = () => {
    try {
        const db = require("@/app/Database");
        return {
            grades: db.grades || [],
            gradeCategories: db.gradeCategories || [],
            gradeStatistics: db.gradeStatistics || []
        };
    } catch {
        return {
            grades: [],
            gradeCategories: [],
            gradeStatistics: []
        };
    }
};

const initialData = getInitialData();

const initialState: GradesState = {
    grades: initialData.grades as Grade[],
    gradeCategories: initialData.gradeCategories as CourseGradeConfig[],
    gradeStatistics: initialData.gradeStatistics as GradeStatistics[]
};

const gradesSlice = createSlice({
    name: "grades",
    initialState,
    reducers: {
        // Set initial grades data
        setGrades: (state, action: PayloadAction<Grade[]>) => {
            state.grades = action.payload;
        },

        // Update a single grade score
        updateGrade: (state, action: PayloadAction<{
            studentId: string;
            assignmentId: string;
            courseId: string;
            score: number;
            submitted: string;
        }>) => {
            const { studentId, assignmentId, courseId, score, submitted } = action.payload;

            const existingGradeIndex = state.grades.findIndex(g =>
                g.student === studentId &&
                g.assignment === assignmentId &&
                g.course === courseId
            );

            if (existingGradeIndex !== -1) {
                state.grades[existingGradeIndex].score = score;
                state.grades[existingGradeIndex].submitted = submitted;
            } else {
                const newGrade: Grade = {
                    _id: `G${Date.now()}`,
                    student: studentId,
                    assignment: assignmentId,
                    course: courseId,
                    score: score,
                    submitted: submitted,
                    released: false,
                    type: "assignment"
                };
                state.grades.push(newGrade);
            }
        },

        // Release all grades for a course
        releaseGrades: (state, action: PayloadAction<string>) => {
            const courseId = action.payload;
            state.grades = state.grades.map(grade => {
                if (grade.course === courseId) {
                    return { ...grade, released: true };
                }
                return grade;
            });
        },

        // Toggle grade release status for a single grade
        toggleGradeRelease: (state, action: PayloadAction<string>) => {
            const gradeIndex = state.grades.findIndex(g => g._id === action.payload);
            if (gradeIndex !== -1) {
                state.grades[gradeIndex].released = !state.grades[gradeIndex].released;
            }
        },

        // Add a new grade
        addGrade: (state, action: PayloadAction<Grade>) => {
            state.grades.push(action.payload);
        },

        // Delete a grade
        deleteGrade: (state, action: PayloadAction<string>) => {
            state.grades = state.grades.filter(g => g._id !== action.payload);
        },

        // Update grade submission status
        updateGradeStatus: (state, action: PayloadAction<{
            studentId: string;
            assignmentId: string;
            courseId: string;
            submitted: string | null;
        }>) => {
            const { studentId, assignmentId, courseId, submitted } = action.payload;
            const gradeIndex = state.grades.findIndex(g =>
                g.student === studentId &&
                g.assignment === assignmentId &&
                g.course === courseId
            );

            if (gradeIndex !== -1) {
                state.grades[gradeIndex].submitted = submitted;
            }
        },

        // Set grade categories
        setGradeCategories: (state, action: PayloadAction<CourseGradeConfig[]>) => {
            state.gradeCategories = action.payload;
        },

        // Update category weights for a course
        updateCategoryWeights: (
            state,
            action: PayloadAction<{ course: string; categories: GradeCategory[] }>
        ) => {
            const configIndex = state.gradeCategories.findIndex(
                config => config.course === action.payload.course
            );
            if (configIndex !== -1) {
                state.gradeCategories[configIndex].categories = action.payload.categories;
            }
        },

        // Set grade statistics
        setGradeStatistics: (state, action: PayloadAction<GradeStatistics[]>) => {
            state.gradeStatistics = action.payload;
        },

        // Batch update multiple grades
        updateMultipleGrades: (state, action: PayloadAction<Grade[]>) => {
            action.payload.forEach(updatedGrade => {
                const index = state.grades.findIndex(g => g._id === updatedGrade._id);
                if (index !== -1) {
                    state.grades[index] = updatedGrade;
                }
            });
        },

        // Reset grades to initial state
        resetGrades: (state) => {
            const data = getInitialData();
            state.grades = data.grades as Grade[];
            state.gradeCategories = data.gradeCategories as CourseGradeConfig[];
            state.gradeStatistics = data.gradeStatistics as GradeStatistics[];
        }
    }
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
    resetGrades
} = gradesSlice.actions;

export default gradesSlice.reducer;