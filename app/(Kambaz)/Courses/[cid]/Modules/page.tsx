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

export default function ModulesPage() {
    const { cid } = useParams<{ cid: string }>();
    const { modules } = useSelector((state: any) => state.modulesReducer);
    const { currentUser } = useSelector((state: any) => state.accountReducer);
    const dispatch = useDispatch();
    const [moduleName, setModuleName] = useState("");

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

    const courseModules = modules.filter((m: any) => m.course === cid);
    const [collapsed, setCollapsed] = useState<boolean[]>(() => courseModules.map(() => false));
    const allCollapsed = collapsed.every(Boolean);
    const toggleAll = () => setCollapsed(collapsed.map(() => !allCollapsed));
    const toggleOne = (i: number) => setCollapsed((prev) => prev.map((c, idx) => (idx === i ? !c : c)));

    const isFaculty = (currentUser?.role ?? "").toString().toUpperCase() === "FACULTY";

    return (
        <div id="wd-courses-modules">
            {isFaculty ? (
                <ModulesControls
                    onToggleAll={toggleAll}
                    allCollapsed={allCollapsed}
                    moduleName={moduleName}
                    setModuleName={setModuleName}
                    addModule={createModule}
                />
            ) : (
                <div id="wd-modules-toolbar" className="btn-toolbar gap-2 mb-3">
                    <button id="wd-modules-collapse-all" className="btn btn-secondary" onClick={toggleAll}>
                        {allCollapsed ? "Expand All" : "Collapse All"}
                    </button>
                </div>
            )}

            <ListGroup id="wd-modules" className="rounded-0">
                {courseModules.map((module: any, i: number) => (
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
                                        deleteModule={(moduleId) => removeModule(moduleId)}
                                        editModule={(moduleId) => dispatch(editModule(moduleId))}
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
                                        {isFaculty && <LessonControlButtons />}
                                    </ListGroup.Item>

                                    {module.lessons.map((lesson: any) => (
                                        <ListGroup.Item key={lesson._id} className="wd-lesson p-3 ps-1 d-flex align-items-center">
                                            <BsGripVertical className="me-2 wd-grip" />
                                            {lesson.name}
                                            {isFaculty && <LessonControlButtons />}
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
