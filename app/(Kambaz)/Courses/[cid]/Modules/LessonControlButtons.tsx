"use client";

import { IoEllipsisVertical } from "react-icons/io5";
import CheckToggle from "./CheckToggle";

/**
 * Faculty-only action cluster shown on lesson rows.
 * Spacing matches the module header actions.
 */
export default function LessonControlButtons() {
    return (
        <div className="wd-actions float-end">
            <CheckToggle
                active={true}
                title="Published"
                onClick={(e) => e.stopPropagation()}
                size={22}
            />
            <IoEllipsisVertical className="fs-4" />
        </div>
    );
}
