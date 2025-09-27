// app/(Kambaz)/Courses/[cid]/Modules/page.tsx
"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import ListGroup from "react-bootstrap/ListGroup";
import { BsGripVertical } from "react-icons/bs";
import LessonControlButtons from "./LessonControlButtons";
import ModuleControlButtons from "./ModuleControlButtons";
import ModulesControls from "./ModulesControls";
import GreenCheckmark from "./GreenCheckmark";
import * as db from "../../../Database";

export default function ModulesPage() {
    const { cid } = useParams<{ cid: string }>();
    const modules = db.modules.filter((module: any) => module.course === cid);

    const [collapsed, setCollapsed] = useState<boolean[]>(
        () => modules.map(() => false)
    );
    const allCollapsed = collapsed.every(Boolean);

    const toggleAll = () => setCollapsed(collapsed.map(() => !allCollapsed));
    const toggleOne = (i: number) =>
        setCollapsed(prev => prev.map((c, idx) => (idx === i ? !c : c)));

    return (
        <div id="wd-courses-modules">
            <ModulesControls onToggleAll={toggleAll} allCollapsed={allCollapsed} />

            <ListGroup id="wd-modules" className="rounded-0">
                {modules.map((module: any, i: number) => (
                    <ListGroup.Item
                        key={module._id}
                        className="wd-module p-0 mb-5 fs-5 border-gray"
                    >
                        {/* Module Header - Clickable */}
                        <button
                            className="w-100 text-start border-0 p-0"
                            onClick={() => toggleOne(i)}
                            aria-expanded={!collapsed[i]}
                            aria-controls={`wd-module-panel-${i}`}
                        >
                            <div className="wd-title p-3 ps-2 bg-secondary">
                                <BsGripVertical className="me-2 wd-grip" />
                                {module.name}
                                <ModuleControlButtons />
                            </div>
                        </button>

                        {/* Module Lessons - Collapsible */}
                        {module.lessons && (
                            <div id={`wd-module-panel-${i}`} hidden={collapsed[i]}>
                                <ListGroup className="wd-lessons rounded-0">
                                    {/* LEARNING OBJECTIVES item - just a single row */}
                                    <ListGroup.Item className="wd-lesson p-3 ps-1">
                                        <BsGripVertical className="me-2 wd-grip" />
                                        <GreenCheckmark />
                                        LEARNING OBJECTIVES
                                        <LessonControlButtons />
                                    </ListGroup.Item>

                                    {/* Individual Lesson Items */}
                                    {module.lessons.map((lesson: any) => (
                                        <ListGroup.Item
                                            key={lesson._id}
                                            className="wd-lesson p-3 ps-1"
                                        >
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
    );
}