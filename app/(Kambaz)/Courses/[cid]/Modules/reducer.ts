import { createSlice } from "@reduxjs/toolkit";
import { modules } from "../../../Database";

const initialState = {
    modules: modules,
};

const modulesSlice = createSlice({
    name: "modules",
    initialState,
    reducers: {
        setModules: (state, { payload: modules }) => {
            state.modules = modules;
        },
        addModule: (state, { payload: module }) => {
            state.modules = [...state.modules, module] as any;
        },
        deleteModule: (state, { payload: moduleId }) => {
            state.modules = state.modules.filter(
                (m: any) => m._id !== moduleId
            );
        },
        updateModule: (state, { payload: module }) => {
            state.modules = state.modules.map((m: any) =>
                m._id === module._id ? module : m
            ) as any;
        },
        editModule: (state, { payload: moduleId }) => {
            state.modules = state.modules.map((m: any) =>
                m._id === moduleId ? { ...m, editing: true } : m
            ) as any;
        },
    },
});

export const { setModules, addModule, deleteModule, updateModule, editModule } = modulesSlice.actions;
export default modulesSlice.reducer;