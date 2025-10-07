"use client";

import { BsCheckCircleFill } from "react-icons/bs";

export default function CheckToggle({
                                        active,
                                        onToggle,
                                        title,
                                        size = "sm",
                                    }: {
    active: boolean;
    onToggle: () => void;
    title?: string;
    size?: "sm" | "md";
}) {
    const px = size === "sm" ? 26 : 32;

    return (
        <button
            type="button"
            title={title ?? (active ? "Unpublish" : "Publish")}
            className="wd-checktoggle"
            onClick={(e) => {
                e.stopPropagation();
                onToggle();
            }}
            aria-pressed={active}
            aria-label={active ? "Unpublish" : "Publish"}
            style={{ width: px, height: px }}
        >
            <BsCheckCircleFill className={active ? "text-success" : "text-secondary"} />
            <style jsx>{`
        .wd-checktoggle {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border: 0;
          background: transparent;
          border-radius: 999px;
          padding: 0;
          cursor: pointer;
          line-height: 1;
        }
        .wd-checktoggle :global(svg) {
          font-size: ${size === "sm" ? 20 : 24}px;
          transition: transform 0.08s ease-in-out;
        }
        .wd-checktoggle:hover :global(svg) {
          transform: scale(1.06);
        }
      `}</style>
        </button>
    );
}
