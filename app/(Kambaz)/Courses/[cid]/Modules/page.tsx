"use client";

// The Modules screen.
// The modules come from the server for the course I opened.
// Every change goes to the server first, so a refresh shows the same.
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { ListGroup, Form } from "react-bootstrap";
import { BsGripVertical, BsChevronDown, BsChevronRight } from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";
import ModulesControls from "./ModulesControls";
import LessonEditor from "./LessonEditor";
import ModuleControlButtons from "./ModuleControlButtons";
import LessonControlButtons from "./LessonControlButtons";
import {
  setModules,
  addModule,
  deleteModule,
  updateModule,
  editModule,
} from "./reducer";
import * as coursesClient from "../../client";
import * as modulesClient from "./client";
import { isFacultyNow } from "../../../Account/roles";

export default function Modules() {
  // useParams can be empty, so I check it first.
  const params = useParams<{ cid: string }>();
  const cid = params ? params.cid : "";

  const [moduleName, setModuleName] = useState("");
  const [folded, setFolded] = useState<Record<string, boolean>>({});
  const [showProgress, setShowProgress] = useState(false);
  // One dialog does both jobs. It remembers which module and which lesson.
  const [lessonJob, setLessonJob] = useState<any>(null);
  const [lessonName, setLessonName] = useState("");
  const { modules } = useSelector((state: any) => state.modulesReducer);
  const dispatch = useDispatch();
  const { currentUser, viewAsStudent } = useSelector(
    (state: any) => state.accountReducer
  );
  const isFaculty = isFacultyNow(currentUser, viewAsStudent);

  // A missing published field counts as published. The seed data has no
  // field on some rows, and !undefined is true, so the old toggle did
  // nothing on the first click.
  const isPublished = (item: any) => item.published !== false;

  // A student never sees a module that is not published.
  const courseModules = modules
    .filter((module: any) => module.course === cid)
    .filter((module: any) => isFaculty || isPublished(module));

  // Read the modules of this course.
  const fetchModules = async () => {
    const found = await coursesClient.findModulesForCourse(cid);
    dispatch(setModules(found));
  };

  useEffect(() => {
    if (cid) {
      fetchModules();
    }
  }, [cid]);

  // Create. The server gives the id.
  const createModule = async () => {
    if (!moduleName) {
      return;
    }
    const created = await coursesClient.createModuleForCourse(cid, {
      name: moduleName,
      course: cid,
    });
    dispatch(addModule(created));
    setModuleName("");
  };

  // Delete.
  const removeModule = async (moduleId: string) => {
    await modulesClient.deleteModule(moduleId);
    dispatch(deleteModule(moduleId));
  };

  // Update. Rename and publish both end up here.
  const saveModule = async (module: any) => {
    await modulesClient.updateModule(module);
    dispatch(updateModule(module));
  };

  // Folded modules live in one object. No key means open.
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

  // Publish and unpublish only change one field. So I reuse saveModule.
  const toggleModule = (module: any) =>
    saveModule({ ...module, published: !isPublished(module) });

  const toggleLesson = (module: any, lessonId: string) =>
    saveModule({
      ...module,
      lessons: module.lessons.map((lesson: any) =>
        lesson._id === lessonId
          ? { ...lesson, published: !isPublished(lesson) }
          : lesson
      ),
    });

  // A new id for a lesson. Lessons live inside the module document,
  // so the server never makes an id for them. I make one here.
  const newLessonId = () =>
    `${new Date().getTime()}-${Math.round(Math.random() * 1000)}`;

  // The plus and Rename both open the dialog. Add has no lesson yet.
  const openAddLesson = (module: any) => {
    setLessonJob({ module: module, lesson: null });
    setLessonName("New Lesson");
  };

  const openRenameLesson = (module: any, lesson: any) => {
    setLessonJob({ module: module, lesson: lesson });
    setLessonName(lesson.name);
  };

  // The dialog saves through here. No lesson means add a new one.
  const saveLesson = () => {
    if (!lessonJob || !lessonName) {
      return;
    }
    const module = lessonJob.module;
    const lesson = lessonJob.lesson;
    if (!lesson) {
      const lessons = module.lessons ? module.lessons : [];
      saveModule({
        ...module,
        lessons: [
          ...lessons,
          { _id: newLessonId(), name: lessonName, published: true },
        ],
      });
      return;
    }
    saveModule({
      ...module,
      lessons: module.lessons.map((one: any) =>
        one._id === lesson._id ? { ...one, name: lessonName } : one
      ),
    });
  };

  // The copy goes right under the lesson I copied.
  const duplicateLesson = (module: any, lesson: any) => {
    const lessons = [...module.lessons];
    const at = lessons.findIndex((one: any) => one._id === lesson._id);
    const copy = {
      ...lesson,
      _id: newLessonId(),
      name: `${lesson.name} (copy)`,
    };
    lessons.splice(at + 1, 0, copy);
    saveModule({ ...module, lessons });
  };

  const removeLesson = (module: any, lesson: any) => {
    if (!window.confirm(`Remove the lesson "${lesson.name}"?`)) {
      return;
    }
    saveModule({
      ...module,
      lessons: module.lessons.filter((one: any) => one._id !== lesson._id),
    });
  };

  // Move a lesson up or down. The array order is the screen order,
  // so one PUT of the module keeps the new order.
  const moveLesson = (module: any, lesson: any, step: number) => {
    const lessons = [...module.lessons];
    const at = lessons.findIndex((one: any) => one._id === lesson._id);
    const to = at + step;
    if (to < 0 || to >= lessons.length) {
      return;
    }
    lessons.splice(at, 1);
    lessons.splice(to, 0, lesson);
    saveModule({ ...module, lessons });
  };

  // Copy a whole module. The server gives the copy a new id.
  // Every lesson inside gets a new id too.
  const duplicateModule = async (module: any) => {
    const lessons = module.lessons
      ? module.lessons.map((one: any) => ({ ...one, _id: newLessonId() }))
      : [];
    const created = await coursesClient.createModuleForCourse(cid, {
      name: `${module.name} (copy)`,
      description: module.description,
      published: isPublished(module),
      lessons: lessons,
      course: cid,
    });
    dispatch(addModule(created));
  };

  // View Progress. I count what is published right now.
  const moduleCount = courseModules.length;
  const publishedModules = courseModules.filter(isPublished).length;
  const allLessons = courseModules.reduce(
    (list: any[], module: any) =>
      module.lessons ? [...list, ...module.lessons] : list,
    []
  );
  const publishedLessons = allLessons.filter(isPublished).length;

  // The Publish All menu. withItems true also changes every lesson.
  // One PUT for each module, so the database matches the screen.
  const publishAll = async (published: boolean, withItems: boolean) => {
    for (const module of courseModules) {
      const lessons =
        withItems && module.lessons
          ? module.lessons.map((lesson: any) => ({ ...lesson, published }))
          : module.lessons;
      await saveModule({ ...module, published, lessons });
    }
  };

  return (
    <div id="wd-courses-modules">
      <ModulesControls
        isFaculty={isFaculty}
        allCollapsed={allFolded}
        toggleAll={foldAll}
        moduleName={moduleName}
        setModuleName={setModuleName}
        addModule={createModule}
        publishAll={publishAll}
        toggleProgress={() => setShowProgress(!showProgress)}
      />

      {/* View Progress opens this line. The numbers are real. */}
      {isFaculty && showProgress && (
        <div className="alert alert-info mt-3 mb-0" id="wd-modules-progress">
          Modules published: {publishedModules} of {moduleCount}.{" "}
          Lessons published: {publishedLessons} of {allLessons.length}.
        </div>
      )}
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
              {module.editing && isFaculty && (
                <Form.Control
                  className="w-50 d-inline-block"
                  defaultValue={module.name}
                  onChange={(e) =>
                    dispatch(updateModule({ ...module, name: e.target.value }))
                  }
                  onKeyDown={(e) => {
                    // Enter saves the name and closes the field.
                    if (e.key === "Enter") {
                      saveModule({ ...module, editing: false });
                    }
                  }}
                />
              )}

              {isFaculty && !isPublished(module) && (
                <span className="badge bg-secondary ms-2">Unpublished</span>
              )}

              {isFaculty && (
                <ModuleControlButtons
                  moduleId={module._id}
                  published={isPublished(module)}
                  deleteModule={(moduleId) => removeModule(moduleId)}
                  editModule={(moduleId) => dispatch(editModule(moduleId))}
                  togglePublish={() => toggleModule(module)}
                  addLesson={() => openAddLesson(module)}
                  duplicateModule={() => duplicateModule(module)}
                />
              )}
            </div>

            {/* The lessons are hidden while the module is folded. */}
            {!isFolded(module._id) && (
              <ListGroup className="wd-lessons rounded-0">
                <ListGroup.Item className="wd-lesson p-3 ps-1">
                  <BsGripVertical className="me-2 fs-3" />
                  LEARNING OBJECTIVES
                  <LessonControlButtons published={isPublished(module)} />
                </ListGroup.Item>
                {module.lessons && module.lessons
                  .filter((lesson: any) => isFaculty || isPublished(lesson))
                  .map((lesson: any) => (
                  <ListGroup.Item key={lesson._id} className="wd-lesson p-3 ps-1">
                    <BsGripVertical className="me-2 fs-3" />
                    {lesson.name}
                    <LessonControlButtons
                      published={isPublished(lesson)}
                      togglePublish={
                        isFaculty ? () => toggleLesson(module, lesson._id) : undefined
                      }
                      rename={
                        isFaculty ? () => openRenameLesson(module, lesson) : undefined
                      }
                      duplicate={
                        isFaculty ? () => duplicateLesson(module, lesson) : undefined
                      }
                      remove={isFaculty ? () => removeLesson(module, lesson) : undefined}
                      moveUp={isFaculty ? () => moveLesson(module, lesson, -1) : undefined}
                      moveDown={isFaculty ? () => moveLesson(module, lesson, 1) : undefined}
                    />
                  </ListGroup.Item>
                ))}
              </ListGroup>
            )}
          </ListGroup.Item>
        ))}
      </ListGroup>

      {/* One dialog for adding a lesson and for renaming one. */}
      <LessonEditor
        show={lessonJob !== null}
        handleClose={() => setLessonJob(null)}
        dialogTitle={
          lessonJob && lessonJob.lesson ? "Rename Lesson" : "Add Lesson"
        }
        lessonName={lessonName}
        setLessonName={setLessonName}
        saveLesson={saveLesson}
      />
    </div>
  );
}
