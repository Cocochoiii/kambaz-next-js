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
import {
    addModule,
    deleteModule,
    updateModule,
    editModule,
    toggleLessonPublished,
    toggleModulePublished,
    bulkPublishAll,
    bulkPublishModules,
    bulkUnpublishAll,
    bulkUnpublishModules,
} from "../Modules/reducer";
import "./home.css";
import ViewProgress from "./ViewProgress";

export default function HomePage() {
    const { cid } = useParams<{ cid: string }>();
    const dispatch = useDispatch();
    const { modules } = useSelector((state: any) => state.modulesReducer);
    const { currentUser } = useSelector((state: any) => state.accountReducer);
    const { courses } = useSelector((state: any) => state.coursesReducer);

    const course = courses.find((c: any) => c._id === cid);

    const [moduleName, setModuleName] = useState("");
    const [showModuleEditor, setShowModuleEditor] = useState(false);

    const role = (currentUser?.role ?? "").toString().toUpperCase();
    const isFaculty = role === "FACULTY";

    const allModulesRaw = (modules || []).filter((m: any) => m.course === cid);
    const allModules = isFaculty ? allModulesRaw : allModulesRaw.filter((m: any) => m.published);
    const displayModules = allModules.slice(0, 4);

    const [collapsed, setCollapsed] = useState<boolean[]>(() => displayModules.map(() => false));
    const allCollapsed = collapsed.every(Boolean);
    const toggleAll = () => setCollapsed(collapsed.map(() => !allCollapsed));
    const toggleOne = (i: number) => setCollapsed((prev) => prev.map((c, idx) => (idx === i ? !c : c)));

    const handleAddModule = () => {
        dispatch(addModule({ name: moduleName, course: cid }));
        setModuleName("");
        setShowModuleEditor(false);
    };
    const handleDeleteModule = (moduleId: string) => dispatch(deleteModule(moduleId));
    const handleEditModule = (moduleId: string) => dispatch(editModule(moduleId));
    const handleUpdateModule = (module: any) => dispatch(updateModule(module));

    if (!course) return <div>Course not found</div>;

    const heroSrc = useMemo(() => {
        const map: Record<string, string> = {
            "5610": "/images/courses/5610.svg",
            "5520": "/images/courses/5520.svg",
            "5004": "/images/courses/5004.svg",
            "5200": "/images/courses/5200.svg",
            "5800": "/images/courses/5800.svg",
            "6510": "/images/courses/6510.svg",
            "6620": "/images/courses/6620.svg",
        };
        return map[cid] ?? `/images/courses/${cid}.svg`;
    }, [cid]);

    return (
        <div id="wd-courses-home">
            <h1 className="text-danger m-0">Course {cid} — {course.name}</h1>
            <p className="text-muted mt-1">{course.description}</p>

            <div className="wd-course-hero card shadow-sm mb-3">
                <img src={heroSrc} alt={`Course ${cid} hero`} className="wd-course-hero-img" />
                <span className="wd-course-hero-tag">Course {cid}</span>
            </div>

            <div className="d-flex gap-4">
                <div className="flex-fill">
                    <div className="wd-toolbar btn-toolbar gap-2 my-2">
                        <button className="btn btn-secondary" id="wd-home-collapse-all" onClick={toggleAll}>
                            {allCollapsed ? "Expand All" : "Collapse All"}
                        </button>

                        {isFaculty && (
                            <>
                                <ViewProgress />
                                <PublishAllMenu
                                    idPrefix="wd-home"
                                    label="Publish All"
                                    onPublishAll={() => dispatch(bulkPublishAll())}
                                    onPublishModulesOnly={() => dispatch(bulkPublishModules())}
                                    onUnpublishAll={() => dispatch(bulkUnpublishAll())}
                                    onUnpublishModulesOnly={() => dispatch(bulkUnpublishModules())}
                                />
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

                    {displayModules.map((module: any, i: number) => {
                        const lessons = isFaculty ? module.lessons : (module.lessons || []).filter((l: any) => l.published);
                        return (
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
                                                    published={!!module.published}
                                                    onTogglePublished={() => dispatch(toggleModulePublished(module._id))}
                                                />
                                            )}
                                        </div>
                                    </button>

                                    <div id={`wd-home-module-panel-${i}`} hidden={collapsed[i]}>
                                        <ListGroup className="wd-lessons rounded-0">
                                            <ListGroup.Item className="wd-lesson p-3 ps-1">
                                                <div className="d-flex align-items-center">
                                                    <BsGripVertical className="me-2 wd-grip" />
                                                    <span className="wd-title ms-2">LEARNING OBJECTIVES</span>
                                                </div>
                                            </ListGroup.Item>

                                            {(lessons || []).map((lesson: any) => (
                                                <ListGroup.Item key={lesson._id} className="wd-lesson p-3 ps-1">
                                                    <div className="d-flex align-items-center w-100">
                                                        <BsGripVertical className="me-2 wd-grip" />
                                                        <span>{lesson.name}</span>
                                                        {isFaculty && (
                                                            <div className="ms-auto">
                                                                <LessonControlButtons
                                                                    published={!!lesson.published}
                                                                    onToggle={() =>
                                                                        dispatch(
                                                                            toggleLessonPublished({
                                                                                moduleId: module._id,
                                                                                lessonId: lesson._id,
                                                                            })
                                                                        )
                                                                    }
                                                                />
                                                            </div>
                                                        )}
                                                    </div>
                                                </ListGroup.Item>
                                            ))}
                                        </ListGroup>
                                    </div>
                                </ListGroup.Item>
                            </ListGroup>
                        );
                    })}
                </div>

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
