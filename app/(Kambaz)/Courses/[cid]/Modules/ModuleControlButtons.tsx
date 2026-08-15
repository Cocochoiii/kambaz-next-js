"use client";

// The buttons at the right end of a module title.
// Pencil renames. Trash removes. The green check publishes.
// Plus adds a lesson. The three dots hold the same jobs again.
import { BsPlus } from "react-icons/bs";
import { FaTrash } from "react-icons/fa";
import { FaPencil } from "react-icons/fa6";
import PublishToggle from "./PublishToggle";
import KebabMenu from "../../../KebabMenu";

export default function ModuleControlButtons({
  moduleId,
  published,
  deleteModule,
  editModule,
  togglePublish,
  addLesson,
  duplicateModule,
}: {
  moduleId: string;
  published: boolean;
  deleteModule: (moduleId: string) => void;
  editModule: (moduleId: string) => void;
  togglePublish: (moduleId: string) => void;
  addLesson: () => void;
  duplicateModule: () => void;
}) {
  return (
    <div className="float-end d-inline-flex align-items-center">
      <FaPencil
        role="button"
        aria-label="Edit module"
        title="Rename this module"
        className="text-primary me-3"
        onClick={() => editModule(moduleId)}
      />
      <FaTrash
        role="button"
        aria-label="Delete module"
        title="Delete this module"
        className="text-danger me-2 mb-1"
        onClick={() => deleteModule(moduleId)}
      />
      <PublishToggle published={published} onToggle={() => togglePublish(moduleId)} />
      <button
        type="button"
        aria-label="Add lesson"
        title="Add a lesson"
        className="wd-kebab"
        onClick={addLesson}
      >
        <BsPlus className="fs-4" />
      </button>
      <KebabMenu
        variant="dark"
        items={[
          { label: "Rename module", onClick: () => editModule(moduleId) },
          { label: "Add lesson", onClick: addLesson },
          { label: "Duplicate module", onClick: duplicateModule },
          {
            label: published ? "Unpublish module" : "Publish module",
            onClick: () => togglePublish(moduleId),
          },
          { label: "Delete module", danger: true, onClick: () => deleteModule(moduleId) },
        ]}
      />
    </div>
  );
}
