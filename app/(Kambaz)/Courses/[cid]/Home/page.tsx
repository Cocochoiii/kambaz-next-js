"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import ListGroup from "react-bootstrap/ListGroup";
import { BsGripVertical } from "react-icons/bs";
import { Form } from "react-bootstrap";
import ModuleControlButtons from "../Modules/ModuleControlButtons";
import PublishAllMenu from "../Modules/PublishAllMenu";
import ModuleEditor from "../Modules/ModuleEditor";
import Status from "./Status";
import { useSelector, useDispatch } from "react-redux";
import { setModules, addModule, deleteModule, updateModule, editModule } from "../Modules/reducer";
import * as coursesClient from "../../client";
import * as modulesClient from "../Modules/client";

export default function HomePage() {
    const { cid } = useParams<{ cid: string }>();
    const dispatch = useDispatch();
    const { modules } = useSelector((state: any) => state.modulesReducer);
    const { currentUser } = useSelector((state: any) => state.accountReducer);
    const { courses } = useSelector((state: any) => state.coursesReducer);

    const course = courses.find((c: any) => c._id === cid);

    const [moduleName, setModuleName] = useState("");
    const [showModuleEditor, setShowModuleEditor] = useState(false);

    // Load this course's modules from the server (same source as the Modules screen).
    const loadModules = async () => {
        const mods = await coursesClient.findModulesForCourse(cid);
        dispatch(setModules(mods));
    };
    useEffect(() => {
        loadModules();
    }, [cid]);

    const displayModules = modules.filter((m: any) => m.course === cid);

    const [collapsed, setCollapsed] = useState<boolean[]>(() => displayModules.map(() => false));
    const allCollapsed = collapsed.every(Boolean);
    const toggleAll = () => setCollapsed(collapsed.map(() => !allCollapsed));
    const toggleOne = (i: number) =>
        setCollapsed((prev) => prev.map((c, idx) => (idx === i ? !c : c)));

    // Module CRUD goes through the server so changes persist on reload.
    const handleAddModule = async () => {
        const newModule = await coursesClient.createModuleForCourse(cid, { name: moduleName, course: cid });
        dispatch(addModule(newModule));
        setModuleName("");
        setShowModuleEditor(false);
    };
    const handleDeleteModule = async (moduleId: string) => {
        await modulesClient.deleteModule(moduleId);
        dispatch(deleteModule(moduleId));
    };
    const handleEditModule = (moduleId: string) => dispatch(editModule(moduleId));
    const saveModule = async (module: any) => {
        await modulesClient.updateModule(module);
        dispatch(updateModule(module));
    };

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

    // Bulk publish/unpublish every module in this course (optionally its lessons too).
    const bulkPublish = async (published: boolean, includeItems: boolean) => {
        const mods = modules.filter((m: any) => m.course === cid);
        for (const m of mods) {
            const lessons = includeItems ? (m.lessons || []).map((l: any) => ({ ...l, published })) : m.lessons;
            await saveModule({ ...m, published, lessons });
        }
    };

    if (!course) return <div>Course not found</div>;

    const role = (currentUser?.role ?? "").toString().toUpperCase();
    const isFaculty = role === "FACULTY";

    return (
        <div id="wd-courses-home">
            <h1 className="text-danger m-0">Course {cid} - {course.name}</h1>
            <p className="text-muted mt-1">{course.description}</p>

            <div className="d-flex gap-4">
                {/* Main column */}
                <div className="flex-fill">
                    <div className="wd-toolbar btn-toolbar gap-2 my-2">
                        <button className="btn btn-secondary" id="wd-home-collapse-all" onClick={toggleAll}>
                            {allCollapsed ? "Expand All" : "Collapse All"}
                        </button>

                        {/* Faculty-only controls */}
                        {isFaculty && (
                            <>
                                <button className="btn btn-secondary" id="wd-home-view-progress">
                                    View Progress
                                </button>
                                <PublishAllMenu idPrefix="wd-home" label="Publish All" onBulkPublish={bulkPublish} />
                                <button
                                    className="btn btn-danger"
                                    id="wd-home-new-module"
                                    onClick={() => setShowModuleEditor(true)}
                                >
                                    + Module
                                </button>
                            </>
                        )}
                    </div>

                    {displayModules.map((module: any, i: number) => (
                        <ListGroup className="rounded-0 mb-4" key={module._id}>
                            <ListGroup.Item className="p-0 border-gray">
                                <button
                                    className="w-100 text-start border-0 p-0"
                                    onClick={() => toggleOne(i)}
                                    aria-expanded={!collapsed[i]}
                                    aria-controls={`wd-home-module-panel-${i}`}
                                >
                                    <div className="p-3 bg-secondary">
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
                                                deleteModule={handleDeleteModule}
                                                editModule={handleEditModule}
                                                togglePublish={(moduleId) => togglePublish(moduleId)}
                                                addLesson={(moduleId) => addLesson(moduleId)}
                                            />
                                        )}
                                    </div>
                                </button>

                                <div id={`wd-home-module-panel-${i}`} hidden={collapsed[i]}>
                                    <ListGroup className="wd-lessons rounded-0">
                                        {/* Learning Objectives summary (lessons are managed on the Modules screen) */}
                                        <ListGroup.Item className="wd-lesson p-3 ps-1">
                                            <div className="d-flex align-items-center">
                                                <BsGripVertical className="me-2 wd-grip" />
                                                <span className="wd-title ms-2">LEARNING OBJECTIVES</span>
                                            </div>
                                            <ul className="mt-2 mb-0">
                                                {module.lessons && module.lessons.map((lesson: any) => (
                                                    <li key={lesson._id}>{lesson.name}</li>
                                                ))}
                                            </ul>
                                        </ListGroup.Item>
                                    </ListGroup>
                                </div>
                            </ListGroup.Item>
                        </ListGroup>
                    ))}
                </div>

                {/* right status column */}
                <div id="wd-course-status-col" className="d-none d-xl-block" style={{ width: 340 }}>
                    <Status />
                </div>
            </div>

            <ModuleEditor
                show={showModuleEditor}
                handleClose={() => setShowModuleEditor(false)}
                dialogTitle="Add Module"
                moduleName={moduleName}
                setModuleName={setModuleName}
                addModule={handleAddModule}
            />
        </div>
    );
}
