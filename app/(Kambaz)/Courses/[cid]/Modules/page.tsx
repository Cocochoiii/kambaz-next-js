// app/(Kambaz)/Courses/[cid]/Modules/page.tsx
"use client";

import { useState, useMemo } from "react";
import { useParams } from "next/navigation";
import ListGroup from "react-bootstrap/ListGroup";
import { BsGripVertical } from "react-icons/bs";
import { Form } from "react-bootstrap";
import LessonControlButtons from "./LessonControlButtons";
import ModuleControlButtons from "./ModuleControlButtons";
import ModulesControls from "./ModulesControls";
import { useSelector, useDispatch } from "react-redux";
import {
    addModule,
    deleteModule,
    updateModule,
    editModule,
    toggleModulePublished,
    toggleLessonPublished,
    bulkPublishAll,
    bulkPublishModules,
    bulkUnpublishAll,
    bulkUnpublishModules,
} from "./reducer";
import "./modules.css";

export default function ModulesPage() {
    const { cid } = useParams<{ cid: string }>();
    const { modules } = useSelector((state: any) => state.modulesReducer);
    const { currentUser } = useSelector((state: any) => state.accountReducer);
    const dispatch = useDispatch<any>();
    const [moduleName, setModuleName] = useState("");

    const isFaculty =
        (currentUser?.role ?? "").toString().toUpperCase() === "FACULTY";

    const courseModules = useMemo(
        () =>
            (modules || [])
                .filter((m: any) => m.course === cid)
                .filter((m: any) => (isFaculty ? true : !!m.published)),
        [modules, cid, isFaculty]
    );

    const [collapsed, setCollapsed] = useState<boolean[]>(
        () => courseModules.map(() => false)
    );
    const allCollapsed = collapsed.every(Boolean);
    const toggleAll = () =>
        setCollapsed((prev) => prev.map(() => !allCollapsed));
    const toggleOne = (i: number) =>
        setCollapsed((prev) => prev.map((c, idx) => (idx === i ? !c : c)));

    return (
        <div id="wd-courses-modules">
            {isFaculty ? (
                <ModulesControls
                    onToggleAll={toggleAll}
                    allCollapsed={allCollapsed}
                    moduleName={moduleName}
                    setModuleName={setModuleName}
                    addModule={() => {
                        dispatch(addModule({ name: moduleName, course: cid }));
                        setModuleName("");
                    }}
                    onPublishAll={() => { dispatch(bulkPublishAll()); }}
                    onPublishModulesOnly={() => { dispatch(bulkPublishModules()); }}
                    onUnpublishAll={() => { dispatch(bulkUnpublishAll()); }}
                    onUnpublishModulesOnly={() => { dispatch(bulkUnpublishModules()); }}
                />
            ) : (
                <div id="wd-modules-toolbar" className="btn-toolbar gap-2 mb-3">
                    <button
                        id="wd-modules-collapse-all"
                        className="btn btn-secondary"
                        onClick={toggleAll}
                    >
                        {allCollapsed ? "Expand All" : "Collapse All"}
                    </button>
                </div>
            )}

            <ListGroup id="wd-modules" className="rounded-0">
                {courseModules.map((module: any, i: number) => {
                    const visibleLessons = isFaculty
                        ? module.lessons || []
                        : (module.lessons || []).filter((l: any) => l.published);

                    return (
                        <ListGroup.Item
                            key={module._id}
                            className="wd-module p-0 mb-5 fs-5 border-gray"
                        >
                            <button
                                className="w-100 text-start border-0 p-0"
                                onClick={() => toggleOne(i)}
                                aria-expanded={!collapsed[i]}
                                aria-controls={`wd-module-panel-${i}`}
                            >
                                <div className="wd-title p-3 ps-2 bg-secondary">
                                    <BsGripVertical className="me-2 wd-grip" />

                                    {/* Title (read / edit) */}
                                    {!module.editing && module.name}
                                    {module.editing && isFaculty && (
                                        <Form.Control
                                            className="w-50 d-inline-block"
                                            onClick={(e) => e.stopPropagation()}
                                            onChange={(e) =>
                                                dispatch(updateModule({ ...module, name: e.target.value }))
                                            }
                                            onKeyDown={(e) => {
                                                if (e.key === "Enter") {
                                                    dispatch(updateModule({ ...module, editing: false }));
                                                }
                                            }}
                                            defaultValue={module.name}
                                        />
                                    )}

                                    {/* Right-edge actions (pencil, trash, check, plus, kebab) */}
                                    {isFaculty && (
                                        <span
                                            className="float-end d-inline-flex align-items-center"
                                            onClick={(e) => e.stopPropagation()}
                                            onMouseDown={(e) => e.stopPropagation()}
                                        >
                      <ModuleControlButtons
                          moduleId={module._id as string}
                          published={!!module.published}
                          onTogglePublished={() => {
                              dispatch(toggleModulePublished(module._id as string));
                          }}
                          editModule={(moduleId: string) => {
                              dispatch(editModule(moduleId));
                          }}
                          deleteModule={(moduleId: string) => {
                              dispatch(deleteModule(moduleId));
                          }}
                      />
                    </span>
                                    )}
                                </div>
                            </button>

                            {!!visibleLessons.length && (
                                <div id={`wd-module-panel-${i}`} hidden={collapsed[i]}>
                                    <ListGroup className="wd-lessons rounded-0">
                                        <ListGroup.Item className="wd-lesson p-3 ps-1">
                                            <div className="d-flex align-items-center w-100">
                                                <BsGripVertical className="me-2 wd-grip" />
                                                <span className="wd-title ms-2">LEARNING OBJECTIVES</span>
                                            </div>
                                        </ListGroup.Item>

                                        {visibleLessons.map((lesson: any) => (
                                            <ListGroup.Item
                                                key={lesson._id}
                                                className="wd-lesson p-3 ps-1"
                                            >
                                                {/* Make the whole row a flex container: left content + right controls */}
                                                <div className="d-flex align-items-center w-100">
                                                    <div className="d-inline-flex align-items-center">
                                                        <BsGripVertical className="me-2 wd-grip" />
                                                        <span>{lesson.name}</span>
                                                    </div>

                                                    {isFaculty && (
                                                        <div
                                                            className="ms-auto d-inline-flex align-items-center"
                                                            onClick={(e) => e.stopPropagation()}
                                                            onMouseDown={(e) => e.stopPropagation()}
                                                        >
                                                            <LessonControlButtons
                                                                published={!!lesson.published}
                                                                onToggle={() => {
                                                                    dispatch(
                                                                        toggleLessonPublished({
                                                                            moduleId: module._id as string,
                                                                            lessonId: lesson._id as string,
                                                                        })
                                                                    );
                                                                }}
                                                            />
                                                        </div>
                                                    )}
                                                </div>
                                            </ListGroup.Item>
                                        ))}
                                    </ListGroup>
                                </div>
                            )}
                        </ListGroup.Item>
                    );
                })}
            </ListGroup>
        </div>
    );
}
