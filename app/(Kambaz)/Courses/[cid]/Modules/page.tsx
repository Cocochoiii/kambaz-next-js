"use client";

// The Modules screen.
// 4.10 The modules come from the store. Faculty can add, delete, rename,
// publish and unpublish. Like Canvas, every module also folds.
import { useState } from "react";
import { useParams } from "next/navigation";
import { ListGroup, Form } from "react-bootstrap";
import { BsGripVertical, BsChevronDown, BsChevronRight } from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";
import ModulesControls from "./ModulesControls";
import ModuleControlButtons from "./ModuleControlButtons";
import LessonControlButtons from "./LessonControlButtons";
import { addModule, deleteModule, updateModule, editModule } from "./reducer";

export default function Modules() {
  // useParams can be empty, so I check it first.
  const params = useParams<{ cid: string }>();
  const cid = params ? params.cid : "";

  const [moduleName, setModuleName] = useState("");
  const [folded, setFolded] = useState<Record<string, boolean>>({});
  const { modules } = useSelector((state: any) => state.modulesReducer);
  const { currentUser } = useSelector((state: any) => state.accountReducer);
  const dispatch = useDispatch();

  const isFaculty = currentUser?.role === "FACULTY";
  const courseModules = modules.filter((module: any) => module.course === cid);

  // I keep the folded modules in one object. No key means open.
  const isFolded = (moduleId: string) => folded[moduleId] === true;
  const foldOne = (moduleId: string) =>
    setFolded({ ...folded, [moduleId]: !isFolded(moduleId) });

  // Collapse All is on when every module is folded.
  const allFolded =
    courseModules.length > 0 && courseModules.every((m: any) => isFolded(m._id));
  const foldAll = () => {
    const next: Record<string, boolean> = { ...folded };
    courseModules.forEach((m: any) => { next[m._id] = !allFolded; });
    setFolded(next);
  };

  // Publish and unpublish only flip a flag, so I reuse updateModule.
  const toggleModule = (module: any) =>
    dispatch(updateModule({ ...module, published: !module.published }));
  const toggleLesson = (module: any, lessonId: string) =>
    dispatch(updateModule({
      ...module,
      lessons: module.lessons.map((lesson: any) =>
        lesson._id === lessonId
          ? { ...lesson, published: !lesson.published }
          : lesson
      ),
    }));

  return (
    <div id="wd-courses-modules">
      <ModulesControls
        isFaculty={isFaculty}
        allCollapsed={allFolded}
        toggleAll={foldAll}
        moduleName={moduleName}
        setModuleName={setModuleName}
        addModule={() => {
          dispatch(addModule({ name: moduleName, course: cid }));
          setModuleName("");
        }}
      />
      <br /><br /><br /><br />

      <ListGroup className="rounded-0" id="wd-modules">
        {courseModules.map((module: any) => (
          <ListGroup.Item key={module._id} className="wd-module p-0 mb-5 fs-5 border-gray">
            <div className="wd-title p-3 ps-2 bg-secondary">
              <BsGripVertical className="me-2 fs-3" />

              {/* The arrow folds the module, the same way Canvas does. */}
              <span
                role="button"
                aria-label={isFolded(module._id) ? "Expand module" : "Collapse module"}
                aria-expanded={!isFolded(module._id)}
                className="me-2"
                onClick={() => foldOne(module._id)}
              >
                {isFolded(module._id) ? <BsChevronRight /> : <BsChevronDown />}
              </span>

              {/* The title is a text field only while I edit it. */}
              {!module.editing && (
                <span role="button" onClick={() => foldOne(module._id)}>
                  {module.name}
                </span>
              )}
              {module.editing && (
                <Form.Control
                  className="w-50 d-inline-block"
                  defaultValue={module.name}
                  onChange={(e) =>
                    dispatch(updateModule({ ...module, name: e.target.value }))
                  }
                  onKeyDown={(e) => {
                    // Enter keeps the new name and closes the field.
                    if (e.key === "Enter") {
                      dispatch(updateModule({ ...module, editing: false }));
                    }
                  }}
                />
              )}

              {isFaculty && (
                <ModuleControlButtons
                  moduleId={module._id}
                  published={module.published !== false}
                  deleteModule={(moduleId) => dispatch(deleteModule(moduleId))}
                  editModule={(moduleId) => dispatch(editModule(moduleId))}
                  togglePublish={() => toggleModule(module)}
                />
              )}
            </div>

            {/* The lessons are hidden while the module is folded. */}
            {!isFolded(module._id) && (
              <ListGroup className="wd-lessons rounded-0">
                <ListGroup.Item className="wd-lesson p-3 ps-1">
                  <BsGripVertical className="me-2 fs-3" />
                  LEARNING OBJECTIVES
                  <LessonControlButtons published={module.published !== false} />
                </ListGroup.Item>
                {module.lessons && module.lessons.map((lesson: any) => (
                  <ListGroup.Item key={lesson._id} className="wd-lesson p-3 ps-1">
                    <BsGripVertical className="me-2 fs-3" />
                    {lesson.name}
                    <LessonControlButtons
                      published={lesson.published !== false}
                      togglePublish={
                        isFaculty ? () => toggleLesson(module, lesson._id) : undefined
                      }
                    />
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
