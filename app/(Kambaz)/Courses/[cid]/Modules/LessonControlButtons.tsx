"use client";

import { FaCheckCircle, FaBan } from "react-icons/fa";
import KebabMenu from "@/app/(Kambaz)/KebabMenu";

// Lesson row controls for faculty. Publish toggle + Edit/Delete menu.
export default function LessonControlButtons({
    published,
    onTogglePublish,
    onEdit,
    onDelete,
}: {
    published: boolean;
    onTogglePublish: () => void;
    onEdit: () => void;
    onDelete: () => void;
}) {
    return (
        <div className="d-flex align-items-center ms-auto gap-3">
            {published ? (
                <FaCheckCircle
                    role="button"
                    title="Published (click to unpublish)"
                    className="text-success fs-5"
                    onClick={onTogglePublish}
                />
            ) : (
                <FaBan
                    role="button"
                    title="Unpublished (click to publish)"
                    className="text-secondary fs-5"
                    onClick={onTogglePublish}
                />
            )}
            <KebabMenu
                items={[
                    { label: "Edit", onClick: onEdit },
                    { label: "Delete", onClick: onDelete, danger: true },
                ]}
            />
        </div>
    );
}
