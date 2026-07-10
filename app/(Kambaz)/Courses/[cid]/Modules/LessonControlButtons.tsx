"use client";

import { IoEllipsisVertical } from "react-icons/io5";
import GreenCheckmark from "./GreenCheckmark";

// Faculty-only control; the parent decides visibility.
export default function LessonControlButtons() {
    return (
        <div className="d-flex align-items-center ms-auto">
            <GreenCheckmark />
            <IoEllipsisVertical className="fs-4" />
        </div>
    );
}
