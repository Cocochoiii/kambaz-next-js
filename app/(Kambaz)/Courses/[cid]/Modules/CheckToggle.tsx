"use client";

import { FaCheck } from "react-icons/fa6";

export default function CheckToggle({
                                        onClick,
                                        active,
                                        title,
                                        size = 20,
                                    }: {
    onClick: (e: React.MouseEvent) => void;
    active: boolean;
    title?: string;
    size?: number;
}) {
    const bg = active ? "#22a652" : "#6c7a86";      // green / distinct gray
    const fg = "#ffffff";
    const circle = {
        width: size,
        height: size,
        borderRadius: "999px",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        background: bg,
        cursor: "pointer",
    } as const;

    return (
        <span title={title} onClick={onClick} style={circle} className="me-2 align-middle">
      <FaCheck color={fg} />
    </span>
    );
}
