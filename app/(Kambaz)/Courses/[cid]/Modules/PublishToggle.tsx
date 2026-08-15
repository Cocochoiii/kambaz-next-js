"use client";

// Faculty can publish and unpublish an item, the same way Canvas does.
// Published shows a green check. Not published shows a gray no entry sign.
import { FaBan } from "react-icons/fa";
import GreenCheckmark from "./GreenCheckmark";

export default function PublishToggle({
  published,
  onToggle,
}: {
  published: boolean;
  onToggle?: () => void;
}) {
  const icon = published ? (
    <GreenCheckmark />
  ) : (
    <FaBan className="text-secondary me-1 fs-5" />
  );

  if (!onToggle) {
    return <span className="wd-publish-icon">{icon}</span>;
  }

  return (
    <span
      role="button"
      aria-label={published ? "Unpublish" : "Publish"}
      title={published ? "Published. Click to unpublish." : "Not published. Click to publish."}
      className="wd-publish-icon"
      onClick={onToggle}
    >
      {icon}
    </span>
  );
}
