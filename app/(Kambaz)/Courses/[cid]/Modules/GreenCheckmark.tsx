// app/(Kambaz)/Courses/[cid]/Modules/GreenCheckmark.tsx
"use client";

import { FaCheckCircle } from "react-icons/fa";

export default function GreenCheckmark({
                                           published,
                                           onToggle,
                                           title = published ? "Published" : "Unpublished",
                                       }: {
    published: boolean;
    onToggle?: () => void;
    title?: string;
}) {
    const colorClass = published ? "text-success" : "text-secondary";
    return (
        <button
            type="button"
            title={`${title} — click to toggle`}
            aria-pressed={published}
            onClick={(e) => {
                e.stopPropagation();
                onToggle?.();
            }}
            className="btn btn-link p-0 align-middle me-2"
            style={{ lineHeight: 1 }}
        >
            <FaCheckCircle className={`${colorClass} fs-5`} />
        </button>
    );
}
