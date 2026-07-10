"use client";

import { BsPlus } from "react-icons/bs";
import { FaCheckCircle, FaBan } from "react-icons/fa";
import { FaTrash, FaPencil } from "react-icons/fa6";
import KebabMenu from "@/app/(Kambaz)/KebabMenu";

// Module row controls for faculty. Every icon does a real action.
export default function ModuleControlButtons({
    moduleId,
    published,
    deleteModule,
    editModule,
    togglePublish,
    addLesson,
}: {
    moduleId: string;
    published: boolean;
    deleteModule: (moduleId: string) => void;
    editModule: (moduleId: string) => void;
    togglePublish: (moduleId: string) => void;
    addLesson: (moduleId: string) => void;
}) {
    const stop = (e: any) => e.stopPropagation();
    return (
        <div className="float-end d-flex align-items-center gap-3">
            <FaPencil
                role="button"
                title="Edit"
                className="text-primary"
                onClick={(e) => {
                    stop(e);
                    editModule(moduleId);
                }}
            />
            <FaTrash
                role="button"
                title="Delete"
                className="text-danger"
                onClick={(e) => {
                    stop(e);
                    deleteModule(moduleId);
                }}
            />
            {/* Green check when published, click to toggle publish state */}
            {published ? (
                <FaCheckCircle
                    role="button"
                    title="Published (click to unpublish)"
                    className="text-success fs-5"
                    onClick={(e) => {
                        stop(e);
                        togglePublish(moduleId);
                    }}
                />
            ) : (
                <FaBan
                    role="button"
                    title="Unpublished (click to publish)"
                    className="text-secondary fs-5"
                    onClick={(e) => {
                        stop(e);
                        togglePublish(moduleId);
                    }}
                />
            )}
            <BsPlus
                role="button"
                title="Add lesson"
                className="fs-3"
                onClick={(e) => {
                    stop(e);
                    addLesson(moduleId);
                }}
            />
            <KebabMenu
                items={[
                    { label: "Edit", onClick: () => editModule(moduleId) },
                    { label: "Delete", onClick: () => deleteModule(moduleId), danger: true },
                ]}
            />
        </div>
    );
}
