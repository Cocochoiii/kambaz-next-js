"use client";

// The buttons at the right end of a lesson.
// A student only sees the icon. Faculty gets the three dots menu.
import { IoEllipsisVertical } from "react-icons/io5";
import PublishToggle from "./PublishToggle";
import KebabMenu from "../../../KebabMenu";

export default function LessonControlButtons({
  published = true,
  togglePublish,
  rename,
  duplicate,
  remove,
  moveUp,
  moveDown,
}: {
  published?: boolean;
  togglePublish?: () => void;
  rename?: () => void;
  duplicate?: () => void;
  remove?: () => void;
  moveUp?: () => void;
  moveDown?: () => void;
}) {
  return (
    <div className="float-end d-inline-flex align-items-center">
      <PublishToggle published={published} onToggle={togglePublish} />
      {/* A student has no handlers, so the dots stay quiet. */}
      {rename ? (
        <KebabMenu
          variant="dark"
          items={[
            { label: "Rename", onClick: rename },
            { label: "Move up", onClick: moveUp ? moveUp : rename },
            { label: "Move down", onClick: moveDown ? moveDown : rename },
            { label: "Duplicate", onClick: duplicate ? duplicate : rename },
            {
              label: published ? "Unpublish" : "Publish",
              onClick: togglePublish ? togglePublish : rename,
            },
            { label: "Delete", danger: true, onClick: remove ? remove : rename },
          ]}
        />
      ) : (
        <IoEllipsisVertical className="fs-4" />
      )}
    </div>
  );
}
