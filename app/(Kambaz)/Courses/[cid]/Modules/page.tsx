"use client";

// The Modules screen. It reads the modules from the Database and shows only
// the modules of the course in the URL. Every module and lesson is a
// Bootstrap ListGroupItem. The module title is gray. Every lesson has a
// green bar on the left.
// I need "use client" because useParams and React Bootstrap run on the client.
import { ListGroup } from "react-bootstrap";
import { useParams } from "next/navigation";
import { BsGripVertical } from "react-icons/bs";
import ModulesControls from "./ModulesControls";
import ModuleControlButtons from "./ModuleControlButtons";
import LessonControlButtons from "./LessonControlButtons";
import GreenCheckmark from "./GreenCheckmark";
import * as db from "../../../Database";

export default function Modules() {
  // The course id comes from the path, for example /Courses/5610/Modules
  const { cid } = useParams<{ cid: string }>();
  const modules = db.modules.filter((module: any) => module.course === cid);

  return (
    <div id="wd-courses-modules">
      <ModulesControls /><br /><br /><br /><br />
      <ListGroup className="rounded-0" id="wd-modules">
        {modules.map((module: any) => (
          <ListGroup.Item
            key={module._id}
            className="wd-module p-0 mb-5 fs-5 border-gray"
          >
            <div className="wd-title p-3 ps-2 bg-secondary">
              <BsGripVertical className="me-2 fs-3" />
              {module.name}
              <ModuleControlButtons />
            </div>
            {module.lessons && (
              <ListGroup className="wd-lessons rounded-0">
                <ListGroup.Item className="wd-lesson p-3 ps-1">
                  <BsGripVertical className="me-2 fs-3" />
                  <GreenCheckmark />
                  LEARNING OBJECTIVES
                  <LessonControlButtons />
                </ListGroup.Item>
                {module.lessons.map((lesson: any) => (
                  <ListGroup.Item key={lesson._id} className="wd-lesson p-3 ps-1">
                    <BsGripVertical className="me-2 fs-3" />
                    {lesson.name}
                    <LessonControlButtons />
                  </ListGroup.Item>
                ))}
              </ListGroup>
            )}
          </ListGroup.Item>
        ))}
      </ListGroup>
    </div>
  );
}
