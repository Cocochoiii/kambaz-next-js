"use client";

import { useMemo, useState } from "react";
import ListGroup from "react-bootstrap/ListGroup";
import { BsGripVertical } from "react-icons/bs";
import LessonControlButtons from "./LessonControlButtons";
import ModuleControlButtons from "./ModuleControlButtons";
import ModulesControls from "./ModulesControls";
import { perCourse as courseModules } from "../../courseData";

type ModuleSpec = { title: string; items: string[] };

function ModulesContent({ cid }: { cid: string }) {
    const modules = useMemo<ModuleSpec[]>(
        () =>
            courseModules[cid] ?? [
                { title: "Week 1", items: ["Overview"] },
                { title: "Week 2", items: ["Coming soon"] },
            ],
        [cid]
    );

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

            <ListGroup className="rounded-0" id="wd-modules">
                {modules.map((m, i) => (
                    <ListGroup.Item className="wd-module p-0 mb-5 fs-5 border-gray" key={i}>
                        {/* header (click to collapse/expand) */}
                        <button
                            className="w-100 text-start border-0 p-0"
                            onClick={() => toggleOne(i)}
                            aria-expanded={!collapsed[i]}
                            aria-controls={`wd-module-panel-${i}`}
                        >
                            <div className="wd-title p-3 ps-2 bg-secondary">
                                <BsGripVertical className="me-2 wd-grip" /> {m.title}
                                <ModuleControlButtons />
                            </div>
                        </button>

                        {/* body */}
                        <div id={`wd-module-panel-${i}`} hidden={collapsed[i]}>
                            <ListGroup className="wd-lessons rounded-0">
                                <ListGroup.Item className="wd-lesson p-3 ps-1">
                                    <BsGripVertical className="me-2 wd-grip" />
                                    LEARNING OBJECTIVES
                                    <LessonControlButtons />
                                </ListGroup.Item>

                                {m.items.map((txt, j) => (
                                    <ListGroup.Item className="wd-lesson p-3 ps-1" key={j}>
                                        <BsGripVertical className="me-2 wd-grip" />
                                        {txt}
                                        <LessonControlButtons />
                                    </ListGroup.Item>
                                ))}
                            </ListGroup>
                        </div>
                    </ListGroup.Item>
                ))}
            </ListGroup>
        </div>
    );
}

export default function ModulesPage({ params }: { params: { cid: string } }) {
    const { cid } = params;
    return <ModulesContent cid={cid} />;
}
