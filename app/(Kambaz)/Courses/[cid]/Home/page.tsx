"use client";

import { useMemo, useState } from "react";
import { useParams } from "next/navigation";
import ListGroup from "react-bootstrap/ListGroup";
import { BsGripVertical } from "react-icons/bs";
import { Form } from "react-bootstrap";
import ModuleControlButtons from "../Modules/ModuleControlButtons";
import LessonControlButtons from "../Modules/LessonControlButtons";
import PublishAllMenu from "../Modules/PublishAllMenu";
import ModuleEditor from "../Modules/ModuleEditor";
import Status from "./Status";
import { useSelector, useDispatch } from "react-redux";
import { addModule, deleteModule, updateModule, editModule } from "../Modules/reducer";

export default function HomePage() {
    const { cid } = useParams<{ cid: string }>();
    const dispatch = useDispatch();
    const { modules } = useSelector((state: any) => state.modulesReducer);
    const { currentUser } = useSelector((state: any) => state.accountReducer);
    const { courses } = useSelector((state: any) => state.coursesReducer);

    const course = courses.find((c: any) => c._id === cid);

    const [moduleName, setModuleName] = useState("");
    const [showModuleEditor, setShowModuleEditor] = useState(false);

    const allModules = modules.filter((m: any) => m.course === cid);
    const displayModules = allModules.slice(0, 2);

    const [collapsed, setCollapsed] = useState<boolean[]>(() => displayModules.map(() => false));
    const allCollapsed = collapsed.every(Boolean);
    const toggleAll = () => setCollapsed(collapsed.map(() => !allCollapsed));
    const toggleOne = (i: number) =>
        setCollapsed((prev) => prev.map((c, idx) => (idx === i ? !c : c)));

    const handleAddModule = () => {
        dispatch(addModule({ name: moduleName, course: cid }));
        setModuleName("");
        setShowModuleEditor(false);
    };
    const handleDeleteModule = (moduleId: string) => dispatch(deleteModule(moduleId));
    const handleEditModule   = (moduleId: string) => dispatch(editModule(moduleId));
    const handleUpdateModule = (module: any)    => dispatch(updateModule(module));

    if (!course) return <div>Course not found</div>;

    const role = (currentUser?.role ?? "").toString().toUpperCase();
    const isFaculty = role === "FACULTY";

    return (
        <div id="wd-courses-home">
            <h1 className="text-danger m-0">Course {cid} — {course.name}</h1>
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
                                <PublishAllMenu idPrefix="wd-home" label="Publish All" />
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
                                                onChange={(e) => handleUpdateModule({ ...module, name: e.target.value })}
                                                onKeyDown={(e) => {
                                                    if (e.key === "Enter") handleUpdateModule({ ...module, editing: false });
                                                }}
                                                defaultValue={module.name}
                                            />
                                        )}
                                        {isFaculty && (
                                            <ModuleControlButtons
                                                moduleId={module._id}
                                                deleteModule={handleDeleteModule}
                                                editModule={handleEditModule}
                                            />
                                        )}
                                    </div>
                                </button>

                                <div id={`wd-home-module-panel-${i}`} hidden={collapsed[i]}>
                                    <ListGroup className="wd-lessons rounded-0">
                                        {/* Learning Objectives row */}
                                        <ListGroup.Item className="wd-lesson p-3 ps-1">
                                            <div className="d-flex align-items-center">
                                                <BsGripVertical className="me-2 wd-grip" />
                                                <span className="wd-title ms-2">LEARNING OBJECTIVES</span>
                                                {/* Faculty-only lesson controls (with checkmark inside) */}
                                                {isFaculty && <LessonControlButtons />}
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

                {/* Right status column — FACULTY ONLY */}
                {isFaculty && (
                    <div id="wd-course-status-col" className="d-none d-xl-block" style={{ width: 340 }}>
                        <Status />
                    </div>
                )}
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
