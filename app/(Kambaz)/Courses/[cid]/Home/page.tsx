"use client";

import Status from "./Status";
import { getCourseName, getHomeBlurb, perCourse } from "../../courseData";
import { BsGripVertical } from "react-icons/bs";
import ListGroup from "react-bootstrap/ListGroup";
import ModuleControlButtons from "../Modules/ModuleControlButtons";
import LessonControlButtons from "../Modules/LessonControlButtons";
import GreenCheckmark from "../Modules/GreenCheckmark";

export default function HomePage({ params }: { params: { cid: string } }) {
    const { cid } = params;

    const modules = perCourse[cid] ?? [
        { title: "Week 1", items: ["Overview"] },
        { title: "Week 2", items: ["Coming soon"] },
    ];

    return (
        <div id="wd-courses-home">
            <h2 className="text-danger">Course {cid} – {getCourseName(cid)}</h2>
            <p className="text-muted">{getHomeBlurb(cid)}</p>

            <div className="d-flex gap-4">
                {/* left column: show a trimmed view of upcoming modules */}
                <div className="flex-fill">
                    {modules.slice(0, 2).map((m, i) => (
                        <ListGroup className="rounded-0 mb-4" key={i}>
                            <ListGroup.Item className="p-0">
                                <div className="p-3 bg-secondary border-gray">
                                    <BsGripVertical className="me-2 fs-3" />
                                    {m.title} <ModuleControlButtons />
                                </div>
                                <ListGroup className="wd-lessons">
                                    <ListGroup.Item className="wd-lesson">
                                        <div className="d-flex align-items-center">
                                            <BsGripVertical className="me-2 fs-3" />
                                            <GreenCheckmark />
                                            <span className="wd-title ms-2">LEARNING OBJECTIVES</span>
                                            <LessonControlButtons />
                                        </div>
                                        <ul className="mt-2 mb-0">
                                            {m.items.map((x, j) => (<li key={j}>{x}</li>))}
                                        </ul>
                                    </ListGroup.Item>
                                </ListGroup>
                            </ListGroup.Item>
                        </ListGroup>
                    ))}
                </div>

                {/* right column (matches your A2 “Course Status”) */}
                <div className="d-none d-xl-block" style={{ width: 340 }}>
                    <Status />
                </div>
            </div>
        </div>
    );
}
