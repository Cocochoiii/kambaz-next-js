"use client";

import { useMemo, useState } from "react";
import ListGroup from "react-bootstrap/ListGroup";
import { BsGripVertical } from "react-icons/bs";
import ModuleControlButtons from "../Modules/ModuleControlButtons";
import LessonControlButtons from "../Modules/LessonControlButtons";
import GreenCheckmark from "../Modules/GreenCheckmark";
import PublishAllMenu from "../Modules/PublishAllMenu";
import Status from "./Status";
import { getCourseName, getHomeBlurb, perCourse } from "../../courseData";

type ModuleSpec = { title: string; items: string[] };

export default function HomePage({ params }: { params: { cid: string } }) {
    const { cid } = params;

    // keep per-course data
    const allModules = useMemo<ModuleSpec[]>(
        () => perCourse[cid] ?? [{ title: "Week 1", items: ["Overview"] }],
        [cid]
    );

    // Home shows a preview (first 2 modules)
    const modules = allModules.slice(0, 2);

    // --- collapse state like Modules ---
    const [collapsed, setCollapsed] = useState<boolean[]>(
        () => modules.map(() => false)
    );
    const allCollapsed = collapsed.every(Boolean);
    const toggleAll = () => setCollapsed(collapsed.map(() => !allCollapsed));
    const toggleOne = (i: number) =>
        setCollapsed(prev => prev.map((c, idx) => (idx === i ? !c : c)));

    return (
        <div id="wd-courses-home">
            <h1 className="text-danger m-0">Course {cid} — {getCourseName(cid)}</h1>
            <p className="text-muted mt-1">{getHomeBlurb(cid)}</p>

            <div className="d-flex gap-4">
                {/* center column */}
                <div className="flex-fill">
                    {/* toolbar (identical look & feel to Modules) */}
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

                    {/* modules preview with per-module toggle just like Modules */}
                    {modules.map((m, i) => (
                        <ListGroup className="rounded-0 mb-4" key={i}>
                            <ListGroup.Item className="p-0 border-gray">
                                {/* clickable header to collapse/expand */}
                                <button
                                    className="w-100 text-start border-0 p-0"
                                    onClick={() => toggleOne(i)}
                                    aria-expanded={!collapsed[i]}
                                    aria-controls={`wd-home-module-panel-${i}`}
                                >
                                    <div className="p-3 bg-secondary">
                                        <BsGripVertical className="me-2 wd-grip" />
                                        {m.title} <ModuleControlButtons />
                                    </div>
                                </button>

                                {/* panel */}
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
                                                {m.items.map((x, j) => <li key={j}>{x}</li>)}
                                            </ul>
                                        </ListGroup.Item>
                                    </ListGroup>
                                </div>
                            </ListGroup.Item>
                        </ListGroup>
                    ))}
                </div>

                {/* right status column – stays hidden under xl via your CSS */}
                <div id="wd-course-status-col" className="d-none d-xl-block" style={{ width: 340 }}>
                    <Status />
                </div>
            </div>
        </div>
    );
}
