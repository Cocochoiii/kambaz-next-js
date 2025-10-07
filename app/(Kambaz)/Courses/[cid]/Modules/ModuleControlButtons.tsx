"use client";

import { IoEllipsisVertical } from "react-icons/io5";
import { BsPlus } from "react-icons/bs";
import { FaTrash, FaPencil } from "react-icons/fa6";
import CheckToggle from "./CheckToggle";

export default function ModuleControlButtons({
                                                 moduleId,
                                                 deleteModule,
                                                 editModule,
                                                 published,
                                                 onTogglePublished,
                                             }: {
    moduleId: string;
    deleteModule: (moduleId: string) => void;
    editModule: (moduleId: string) => void;
    published: boolean;
    onTogglePublished: () => void;
}) {
    return (
        <div className="float-end d-inline-flex align-items-center">
            <FaPencil
                onClick={(e) => {
                    e.stopPropagation();
                    editModule(moduleId);
                }}
                className="text-primary me-3"
            />
            <FaTrash
                className="text-danger me-3"
                onClick={(e) => {
                    e.stopPropagation();
                    deleteModule(moduleId);
                }}
            />
            <CheckToggle active={published} onToggle={onTogglePublished} size="sm" />
            <BsPlus className="fs-1 ms-3 me-3" />
            <IoEllipsisVertical className="fs-4" />
        </div>
    );
}
