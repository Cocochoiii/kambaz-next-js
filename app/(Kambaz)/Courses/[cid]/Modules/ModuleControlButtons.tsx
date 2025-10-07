"use client";

import { IoEllipsisVertical } from "react-icons/io5";
import { BsPlus } from "react-icons/bs";
import { FaTrash, FaPencil } from "react-icons/fa6";
import CheckToggle from "./CheckToggle";

export default function ModuleControlButtons({
                                                 moduleId,
                                                 deleteModule,
                                                 editModule,
                                             }: {
    moduleId: string;
    deleteModule: (moduleId: string) => void;
    editModule: (moduleId: string) => void;
}) {
    return (
        <div className="wd-actions float-end">
            <FaPencil
                onClick={(e) => {
                    e.stopPropagation();
                    editModule(moduleId);
                }}
                className="text-primary"
                aria-label="Edit module"
                role="button"
            />

            <FaTrash
                className="text-danger"
                onClick={(e) => {
                    e.stopPropagation();
                    deleteModule(moduleId);
                }}
                aria-label="Delete module"
                role="button"
            />

            {/* Small Canvas-style publish toggle (no behavior change here) */}
            <CheckToggle
                active={true}
                title="Published"
                onClick={(e) => e.stopPropagation()}
                size={22}
            />

            {/* Keep your other controls; spacing is handled by .wd-actions */}
            <BsPlus className="fs-5" />
            <IoEllipsisVertical className="fs-4" />
        </div>
    );
}
