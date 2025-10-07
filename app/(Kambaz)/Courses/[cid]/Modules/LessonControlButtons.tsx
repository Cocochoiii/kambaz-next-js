"use client";

import { IoEllipsisVertical } from "react-icons/io5";
import CheckToggle from "./CheckToggle";

export default function LessonControlButtons({
                                                 published,
                                                 onToggle,
                                             }: {
    published: boolean;
    onToggle: () => void;
}) {
    return (
        <div className="d-inline-flex align-items-center">
            <CheckToggle active={published} onToggle={onToggle} size="sm" />
            <IoEllipsisVertical className="fs-4 ms-3" />
        </div>
    );
}
