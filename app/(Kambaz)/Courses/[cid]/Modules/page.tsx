"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import ListGroup from "react-bootstrap/ListGroup";
import { BsGripVertical } from "react-icons/bs";
import { Form } from "react-bootstrap";
import LessonControlButtons from "./LessonControlButtons";
import ModuleControlButtons from "./ModuleControlButtons";
import ModulesControls from "./ModulesControls";
import { useSelector, useDispatch } from "react-redux";
import { setModules, addModule, deleteModule, updateModule, editModule } from "./reducer";
import * as coursesClient from "../../client";
import * as modulesClient from "./client";
import { useIsFaculty } from "../../../Account/roles";

export default function ModulesPage() {
    const { cid } = useParams<{ cid: string }>();
    const { modules } = useSelector((state: any) => state.modulesReducer);
    const isFaculty = useIsFaculty();
    const dispatch = useDispatch();
    const [moduleName, setModuleName] = useState("");
    // Track which lesson is being renamed inline.
    const [editingLessonId, setEditingLessonId] = useState<string | null>(null);
    const [editingLessonName, setEditingLessonName] = useState("");

    // Load this course's modules from the server when the course changes.
    const loadModules = async () => {
        const mods = await coursesClient.findModulesForCourse(cid);
        dispatch(setModules(mods));
    };
    useEffect(() => {
        loadModules();
    }, [cid]);

    const createModule = async () => {
        const newModule = await coursesClient.createModuleForCourse(cid, { name: moduleName, course: cid });
        dispatch(addModule(newModule));
        setModuleName("");
    };
    const removeModule = async (moduleId: string) => {
        await modulesClient.deleteModule(moduleId);
        dispatch(deleteModule(moduleId));
    };
    const saveModule = async (module: any) => {
        await modulesClient.updateModule(module);
        dispatch(updateModule(module));
    };

    // Module publish is the parent switch: toggling it sets every lesson to match.
    const findModule = (moduleId: string) => modules.find((m: any) => m._id === moduleId);
    const togglePublish = (moduleId: string) => {
        const m = findModule(moduleId);
        const next = !(m.published !== false);
        const lessons = (m.lessons || []).map((l: any) => ({ ...l, published: next }));
        saveModule({ ...m, published: next, lessons });
    };
    const addLesson = (moduleId: string) => {
        const m = findModule(moduleId);
        const lesson = { _id: crypto.randomUUID(), name: "New Lesson", published: true };
        saveModule({ ...m, lessons: [...(m.lessons || []), lesson] });
    };
    const toggleLessonPublish = (moduleId: string, lessonId: string) => {
        const m = findModule(moduleId);
        const lessons = m.lessons.map((l: any) =>
            l._id === lessonId ? { ...l, published: !(l.published !== false) } : l
        );
        saveModule({ ...m, lessons });
    };
    const deleteLesson = (moduleId: string, lessonId: string) => {
        const m = findModule(moduleId);
        saveModule({ ...m, lessons: m.lessons.filter((l: any) => l._id !== lessonId) });
    };
    const startEditLesson = (lesson: any) => {
        setEditingLessonId(lesson._id);
        setEditingLessonName(lesson.name);
    };
    const saveEditLesson = (moduleId: string) => {
        const m = findModule(moduleId);
        const lessons = m.lessons.map((l: any) =>
            l._id === editingLessonId ? { ...l, name: editingLessonName } : l
        );
        saveModule({ ...m, lessons });
        setEditingLessonId(null);
    };

    // Bulk publish/unpublish every module in this course (optionally its lessons too).
    const bulkPublish = async (published: boolean, includeItems: boolean) => {
        const mods = modules.filter((m: any) => m.course === cid);
        for (const m of mods) {
            const lessons = includeItems ? (m.lessons || []).map((l: any) => ({ ...l, published })) : m.lessons;
            await saveModule({ ...m, published, lessons });
        }
    };

    const courseModules = modules.filter((m: any) => m.course === cid);
    // Students only see published modules; faculty see everything.
    const visibleModules = isFaculty
        ? courseModules
        : courseModules.filter((m: any) => m.published !== false);
    const [collapsed, setCollapsed] = useState<boolean[]>(() => courseModules.map(() => false));
    const allCollapsed = collapsed.every(Boolean);
    const toggleAll = () => setCollapsed(collapsed.map(() => !allCollapsed));
    const toggleOne = (i: number) => setCollapsed((prev) => prev.map((c, idx) => (idx === i ? !c : c)));

    return (
        <div id="wd-courses-modules">
            {isFaculty ? (
                <ModulesControls
                    onToggleAll={toggleAll}
                    allCollapsed={allCollapsed}
                    moduleName={moduleName}
                    setModuleName={setModuleName}
                    addModule={createModule}
                    bulkPublish={bulkPublish}
                />
            ) : (
                <div id="wd-modules-toolbar" className="btn-toolbar gap-2 mb-3">
                    <button id="wd-modules-collapse-all" className="btn btn-secondary" onClick={toggleAll}>
                        {allCollapsed ? "Expand All" : "Collapse All"}
                    </button>
                </div>
            )}

            <ListGroup id="wd-modules" className="rounded-0">
                {visibleModules.map((module: any, i: number) => (
                    <ListGroup.Item key={module._id} className="wd-module p-0 mb-5 fs-5 border-gray">
                        <button
                            className="w-100 text-start border-0 p-0"
                            onClick={() => toggleOne(i)}
                            aria-expanded={!collapsed[i]}
                            aria-controls={`wd-module-panel-${i}`}
                        >
                            <div className="wd-title p-3 ps-2 bg-secondary">
                                <BsGripVertical className="me-2 wd-grip" />
                                {!module.editing && module.name}
                                {module.editing && isFaculty && (
                                    <Form.Control
                                        className="w-50 d-inline-block"
                                        onClick={(e) => e.stopPropagation()}
                                        onChange={(e) => dispatch(updateModule({ ...module, name: e.target.value }))}
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter") saveModule({ ...module, editing: false });
                                        }}
                                        defaultValue={module.name}
                                    />
                                )}
                                {isFaculty && (
                                    <ModuleControlButtons
                                        moduleId={module._id}
                                        published={module.published !== false}
                                        deleteModule={(moduleId) => removeModule(moduleId)}
                                        editModule={(moduleId) => dispatch(editModule(moduleId))}
                                        togglePublish={(moduleId) => togglePublish(moduleId)}
                                        addLesson={(moduleId) => addLesson(moduleId)}
                                    />
                                )}
                            </div>
                        </button>

                        {module.lessons && (
                            <div id={`wd-module-panel-${i}`} hidden={collapsed[i]}>
                                <ListGroup className="wd-lessons rounded-0">
                                    <ListGroup.Item className="wd-lesson p-3 ps-1 d-flex align-items-center">
                                        <BsGripVertical className="me-2 wd-grip" />
                                        <span className="wd-title ms-2">LEARNING OBJECTIVES</span>
                                    </ListGroup.Item>

                                    {module.lessons
                                        .filter((l: any) => isFaculty || l.published !== false)
                                        .map((lesson: any) => (
                                        <ListGroup.Item key={lesson._id} className="wd-lesson p-3 ps-1 d-flex align-items-center">
                                            <BsGripVertical className="me-2 wd-grip" />
                                            {editingLessonId === lesson._id ? (
                                                <Form.Control
                                                    className="w-50 d-inline-block"
                                                    autoFocus
                                                    value={editingLessonName}
                                                    onChange={(e) => setEditingLessonName(e.target.value)}
                                                    onKeyDown={(e) => {
                                                        if (e.key === "Enter") saveEditLesson(module._id);
                                                    }}
                                                    onBlur={() => saveEditLesson(module._id)}
                                                />
                                            ) : (
                                                lesson.name
                                            )}
                                            {isFaculty && (
                                                <LessonControlButtons
                                                    published={lesson.published !== false}
                                                    onTogglePublish={() => toggleLessonPublish(module._id, lesson._id)}
                                                    onEdit={() => startEditLesson(lesson)}
                                                    onDelete={() => deleteLesson(module._id, lesson._id)}
                                                />
                                            )}
                                        </ListGroup.Item>
                                    ))}
                                </ListGroup>
                            </div>
                        )}
                    </ListGroup.Item>
                ))}
            </ListGroup>
        </div>
    );
}
