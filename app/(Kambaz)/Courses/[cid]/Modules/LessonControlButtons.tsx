"use client";

// The buttons at the right end of a lesson.
// Faculty can publish and unpublish the lesson. A student only sees the icon.
import { IoEllipsisVertical } from "react-icons/io5";
import PublishToggle from "./PublishToggle";

export default function LessonControlButtons({
  published = true,
  togglePublish,
}: {
  published?: boolean;
  togglePublish?: () => void;
}) {
  return (
    <div className="float-end">
      <PublishToggle published={published} onToggle={togglePublish} />
      <IoEllipsisVertical className="fs-4" />
    </div>
  );
}
