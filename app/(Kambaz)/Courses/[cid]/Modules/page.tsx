"use client";

import { BsGripVertical } from "react-icons/bs";
import ListGroup from "react-bootstrap/ListGroup";
import ModuleControlButtons from "./ModuleControlButtons";
import LessonControlButtons from "./LessonControlButtons";
import GreenCheckmark from "./GreenCheckmark";
import ModulesControls from "./ModulesControls";

import { perCourse } from "../../courseData";

export default function ModulesPage({ params }: { params: { cid: string } }) {
  const { cid } = params; // NOTE: params is sync in App Router

  const modules = perCourse[cid] ?? [
    { title: "Week 1", items: ["Overview"] },
    { title: "Week 2", items: ["Coming soon"] },
  ];

  return (
      <div id="wd-modules">
        <ModulesControls />

        {/* Render course-specific modules */}
        {modules.map((m, idx) => (
            <ListGroup className="rounded-0" key={idx}>
              <ListGroup.Item className="p-0">
                <div className="wd-title p-3 bg-secondary border-gray">
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

                    <ListGroup className="wd-content mt-2">
                      {m.items.map((x, j) => (
                          <ListGroup.Item className="wd-content-item" key={j}>
                            <BsGripVertical className="me-2 fs-3" />
                            <GreenCheckmark />
                            <span className="ms-2">{x}</span>
                            <LessonControlButtons />
                          </ListGroup.Item>
                      ))}
                    </ListGroup>
                  </ListGroup.Item>
                </ListGroup>
              </ListGroup.Item>
            </ListGroup>
        ))}
      </div>
  );
}
