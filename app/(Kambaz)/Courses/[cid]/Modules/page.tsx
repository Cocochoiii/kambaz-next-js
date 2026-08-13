"use client";

// The Modules screen. It reads the modules from the Database.
// I keep only the modules of the course in the URL, so every course shows
// its own modules and lessons.
// I need "use client" because useParams runs in the browser.
import { ListGroup } from "react-bootstrap";
import { useParams } from "next/navigation";
import { BsGripVertical } from "react-icons/bs";
import ModulesControls from "./ModulesControls";
import ModuleControlButtons from "./ModuleControlButtons";
import LessonControlButtons from "./LessonControlButtons";
import * as db from "../../../Database";

export default function Modules() {
  // useParams can be empty, so I check it first.
  const params = useParams<{ cid: string }>();
  const cid = params ? params.cid : "";
  const modules = db.modules.filter((module) => module.course === cid);

  return (
    <div id="wd-courses-modules">
      <ModulesControls /><br /><br /><br /><br />
      <ListGroup className="rounded-0" id="wd-modules">
        {modules.map((module) => (
          <ListGroup.Item key={module._id} className="wd-module p-0 mb-5 fs-5 border-gray">
            <div className="wd-title p-3 ps-2 bg-secondary">
              <BsGripVertical className="me-2 fs-3" />
              {module.name}
              <ModuleControlButtons />
            </div>
            <ListGroup className="wd-lessons rounded-0">
              <ListGroup.Item className="wd-lesson p-3 ps-1">
                <BsGripVertical className="me-2 fs-3" />
                LEARNING OBJECTIVES
                <LessonControlButtons />
              </ListGroup.Item>
              {module.lessons.map((lesson) => (
                <ListGroup.Item key={lesson._id} className="wd-lesson p-3 ps-1">
                  <BsGripVertical className="me-2 fs-3" />
                  {lesson.name}
                  <LessonControlButtons />
                </ListGroup.Item>
              ))}
            </ListGroup>
          </ListGroup.Item>
        ))}
      </ListGroup>
    </div>
  );
}
