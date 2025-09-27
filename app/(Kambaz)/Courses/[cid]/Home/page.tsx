// app/(Kambaz)/Courses/[cid]/Home/page.tsx
"use client";

import { useMemo, useState } from "react";
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

    // Get all modules for this course, but only show first 2 on Home
    const allModules = db.modules.filter((m: any) => m.course === cid);
    const modules = allModules.slice(0, 2);

    // Collapse state management
    const [collapsed, setCollapsed] = useState<boolean[]>(
        () => modules.map(() => false)
    );
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
                {/* Main content column */}
                <div className="flex-fill">
                    {/* Toolbar matching Modules */}
                    <div className="wd-toolbar btn-toolbar gap-2 my-2">
                        <button
                            className="btn btn-secondary"
                            id="wd-home-collapse-all"
                            onClick={toggleAll}
                        >
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

                    {/* Modules preview (first 2 modules) */}
                    {modules.map((module: any, i: number) => (
                        <ListGroup className="rounded-0 mb-4" key={module._id}>
                            <ListGroup.Item className="p-0 border-gray">
                                {/* Clickable header */}
                                <button
                                    className="w-100 text-start border-0 p-0"
                                    onClick={() => toggleOne(i)}
                                    aria-expanded={!collapsed[i]}
                                    aria-controls={`wd-home-module-panel-${i}`}
                                >
                                    <div className="p-3 bg-secondary">
                                        <BsGripVertical className="me-2 wd-grip" />
                                        {module.name} <ModuleControlButtons />
                                    </div>
                                </button>

                                {/* Panel */}
                                <div id={`wd-home-module-panel-${i}`} hidden={collapsed[i]}>
                                    <ListGroup className="wd-lessons rounded-0">
                                        <ListGroup.Item className="wd-lesson p-3 ps-1">
                                            <div className="d-flex align-items-center">
                                                <BsGripVertical className="me-2 wd-grip" />
                                                <GreenCheckmark />
                                                <span className="wd-title ms-2">LEARNING OBJECTIVES</span>
                                                <LessonControlButtons />
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

                {/* Right status column - hidden on smaller screens */}
                <div id="wd-course-status-col" className="d-none d-xl-block" style={{ width: 340 }}>
                    <Status />
                </div>
            </div>
        </div>
    );
}