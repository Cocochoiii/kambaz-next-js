"use client";

// The buttons at the right end of a module title.
// 4.10 Pencil renames. Trash removes. The green check publishes.
import { IoEllipsisVertical } from "react-icons/io5";
import { BsPlus } from "react-icons/bs";
import { FaTrash } from "react-icons/fa";
import { FaPencil } from "react-icons/fa6";
import PublishToggle from "./PublishToggle";

export default function ModuleControlButtons({
  moduleId,
  published,
  deleteModule,
  editModule,
  togglePublish,
}: {
  moduleId: string;
  published: boolean;
  deleteModule: (moduleId: string) => void;
  editModule: (moduleId: string) => void;
  togglePublish: (moduleId: string) => void;
}) {
  return (
    <div className="float-end">
      <FaPencil
        role="button"
        aria-label="Edit module"
        className="text-primary me-3"
        onClick={() => editModule(moduleId)}
      />
      <FaTrash
        role="button"
        aria-label="Delete module"
        className="text-danger me-2 mb-1"
        onClick={() => deleteModule(moduleId)}
      />
      <PublishToggle published={published} onToggle={() => togglePublish(moduleId)} />
      <BsPlus className="fs-4" />
      <IoEllipsisVertical className="fs-4" />
    </div>
  );
}
