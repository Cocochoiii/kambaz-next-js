import { createSlice } from "@reduxjs/toolkit";
import { modules } from "../../../Database";
import { v4 as uuidv4 } from "uuid";

export type Lesson = { _id: string; name: string; published?: boolean };
export type Mod = {
    _id: string;
    name: string;
    course: string;
    lessons: Lesson[];
    editing?: boolean;
    published?: boolean; // NEW
};

const seedNormalize = (list: any[]): Mod[] =>
    (list || []).map((m: any) => ({
        _id: m._id,
        name: m.name,
        course: m.course,
        editing: !!m.editing,
        published: m.published ?? true,                 // default published
        lessons: (m.lessons || []).map((l: any) => ({
            _id: l._id,
            name: l.name,
            published: l.published ?? true,               // default published
        })),
    }));

const initialState = {
    modules: seedNormalize(modules),
};

const modulesSlice = createSlice({
    name: "modules",
    initialState,
    reducers: {
        addModule: (state, { payload }) => {
            const newModule: Mod = {
                _id: uuidv4(),
                lessons: [],
                name: payload.name,
                course: payload.course,
                published: true,
            };
            (state.modules as Mod[]).push(newModule);
        },
        deleteModule: (state, { payload: moduleId }) => {
            state.modules = state.modules.filter((m: Mod) => m._id !== moduleId) as any;
        },
        updateModule: (state, { payload: module }) => {
            state.modules = state.modules.map((m: Mod) => (m._id === module._id ? module : m)) as any;
        },
        editModule: (state, { payload: moduleId }) => {
            state.modules = state.modules.map((m: Mod) => (m._id === moduleId ? { ...m, editing: true } : m)) as any;
        },

        // ─── NEW: publish controls ──────────────────────────────────────────────
        toggleModulePublished: (state, { payload: moduleId }) => {
            state.modules = state.modules.map((m: Mod) =>
                m._id === moduleId ? { ...m, published: !m.published } : m
            ) as any;
        },
        toggleLessonPublished: (state, { payload }: { payload: { moduleId: string; lessonId: string } }) => {
            const { moduleId, lessonId } = payload;
            state.modules = state.modules.map((m: Mod) => {
                if (m._id !== moduleId) return m as any;
                return {
                    ...m,
                    lessons: m.lessons.map((l) => (l._id === lessonId ? { ...l, published: !l.published } : l)),
                };
            }) as any;
        },
        bulkPublishModules: (state) => {
            state.modules = state.modules.map((m: Mod) => ({ ...m, published: true })) as any;
        },
        bulkUnpublishModules: (state) => {
            state.modules = state.modules.map((m: Mod) => ({ ...m, published: false })) as any;
        },
        bulkPublishAll: (state) => {
            state.modules = state.modules.map((m: Mod) => ({
                ...m,
                published: true,
                lessons: m.lessons.map((l) => ({ ...l, published: true })),
            })) as any;
        },
        bulkUnpublishAll: (state) => {
            state.modules = state.modules.map((m: Mod) => ({
                ...m,
                published: false,
                lessons: m.lessons.map((l) => ({ ...l, published: false })),
            })) as any;
        },
    },
});

export const {
    addModule,
    deleteModule,
    updateModule,
    editModule,
    toggleModulePublished,
    toggleLessonPublished,
    bulkPublishModules,
    bulkUnpublishModules,
    bulkPublishAll,
    bulkUnpublishAll,
} = modulesSlice.actions;

export default modulesSlice.reducer;
