"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import ListGroup from "react-bootstrap/ListGroup";
import { BsGripVertical } from "react-icons/bs";
import ModuleControlButtons from "../Modules/ModuleControlButtons";
import LessonControlButtons from "../Modules/LessonControlButtons";
import GreenCheckmark from "../Modules/GreenCheckmark";
import PublishAllMenu from "../Modules/PublishAllMenu";
import Status from "./Status";
import * as db from "../../../Database";

export default function HomePage() {
    const { cid } = useParams<{ cid: string }>();
    const course = db.courses.find((c: any) => c._id === cid);
    // Show every module for this course (same as the Modules screen)
    const modules = db.modules.filter((m: any) => m.course === cid);

    const [collapsed, setCollapsed] = useState<boolean[]>(() => modules.map(() => false));
    const allCollapsed = collapsed.every(Boolean);
    const toggleAll = () => setCollapsed(collapsed.map(() => !allCollapsed));
    const toggleOne = (i: number) =>
        setCollapsed(prev => prev.map((c, idx) => (idx === i ? !c : c)));

    if (!course) {
        return <div>Course not found</div>;
    }

    return (
        <div id="wd-courses-home">
            <h1 className="text-danger m-0">Course {cid} — {course.name}</h1>
            <p className="text-muted mt-1">{course.description}</p>

            <div className="d-flex gap-4">
                {/* Main content column: full module list, rendered like the Modules screen */}
                <div className="flex-fill">
                    <div className="wd-toolbar btn-toolbar gap-2 my-2">
                        <button className="btn btn-secondary" id="wd-home-collapse-all" onClick={toggleAll}>
                            {allCollapsed ? "Expand All" : "Collapse All"}
                        </button>
                        <button className="btn btn-secondary" id="wd-home-view-progress">
                            View Progress
                        </button>
                        <PublishAllMenu idPrefix="wd-home" label="Publish All" />
                        <button className="btn btn-danger" id="wd-home-new-module">
                            + Module
                        </button>
                    </div>

                    <ListGroup id="wd-home-modules" className="rounded-0">
                        {modules.map((module: any, i: number) => (
                            <ListGroup.Item key={module._id} className="wd-module p-0 mb-5 fs-5 border-gray">
                                {/* header toggles the panel */}
                                <button
                                    className="w-100 text-start border-0 p-0"
                                    onClick={() => toggleOne(i)}
                                    aria-expanded={!collapsed[i]}
                                    aria-controls={`wd-home-module-panel-${i}`}
                                >
                                    <div className="wd-title p-3 ps-2 bg-secondary">
                                        <BsGripVertical className="me-2 wd-grip" />
                                        {module.name}
                                        <ModuleControlButtons />
                                    </div>
                                </button>

                                {module.lessons && (
                                    <div id={`wd-home-module-panel-${i}`} hidden={collapsed[i]}>
                                        <ListGroup className="wd-lessons rounded-0">
                                            <ListGroup.Item className="wd-lesson p-3 ps-1">
                                                <BsGripVertical className="me-2 wd-grip" />
                                                <GreenCheckmark />
                                                LEARNING OBJECTIVES
                                                <LessonControlButtons />
                                            </ListGroup.Item>
                                            {module.lessons.map((lesson: any) => (
                                                <ListGroup.Item key={lesson._id} className="wd-lesson p-3 ps-1">
                                                    <BsGripVertical className="me-2 wd-grip" />
                                                    {lesson.name}
                                                    <LessonControlButtons />
                                                </ListGroup.Item>
                                            ))}
                                        </ListGroup>
                                    </div>
                                )}
                            </ListGroup.Item>
                        ))}
                    </ListGroup>
                </div>

                {/* right status column, hidden below xl */}
                <div id="wd-course-status-col" className="d-none d-xl-block" style={{ width: 340 }}>
                    <Status />
                </div>
            </div>
        </div>
    );
}
