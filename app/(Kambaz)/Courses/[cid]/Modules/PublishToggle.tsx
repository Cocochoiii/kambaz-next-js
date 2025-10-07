"use client";

import { FaCheckCircle } from "react-icons/fa";
import clsx from "clsx";

export default function PublishToggle({
                                          published,
                                          onToggle,
                                          disabled = false,
                                          title,
                                      }: {
    published: boolean;
    onToggle: () => void;
    disabled?: boolean;
    title?: string;
}) {
    return (
        <button
            type="button"
            className={clsx("wd-pub-toggle", published ? "is-on" : "is-off")}
            aria-pressed={published}
            aria-label={published ? "Published" : "Unpublished"}
            title={title ?? (published ? "Click to unpublish" : "Click to publish")}
            onClick={(e) => {
                e.stopPropagation();
                if (!disabled) onToggle();
            }}
            disabled={disabled}
        >
            <FaCheckCircle />
        </button>
    );
}
