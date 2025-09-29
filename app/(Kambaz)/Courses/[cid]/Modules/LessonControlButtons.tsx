"use client";

import { IoEllipsisVertical } from "react-icons/io5";
import GreenCheckmark from "./GreenCheckmark";

/**
 * This component is **faculty-only** (parent controls visibility).
 * It keeps your original contents; just render it only for faculty.
 */
export default function LessonControlButtons() {
    return (
        <div className="float-end">
            <GreenCheckmark />
            <IoEllipsisVertical className="fs-4" />
        </div>
    );
}
