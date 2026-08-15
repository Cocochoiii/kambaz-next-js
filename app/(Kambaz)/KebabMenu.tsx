"use client";

// The three dots menu Canvas puts at the end of a row.
// I write it myself with a button and a list, so the click is mine.
// I give it a list of items. Each item has its own click function.
import { useEffect, useRef, useState } from "react";
import { IoEllipsisVertical } from "react-icons/io5";

export default function KebabMenu({
  items,
  variant = "light",
}: {
  items: { label: string; onClick: () => void; danger?: boolean }[];
  variant?: string;
}) {
  const [open, setOpen] = useState(false);
  const boxRef = useRef<HTMLSpanElement>(null);

  // A click anywhere else closes the menu.
  useEffect(() => {
    if (!open) {
      return;
    }
    const closeOnOutside = (event: MouseEvent) => {
      const box = boxRef.current;
      if (box && !box.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", closeOnOutside);
    return () => document.removeEventListener("mousedown", closeOnOutside);
  }, [open]);

  // The card behind me is a link, so I stop the click here.
  const stop = (event: any) => {
    event.preventDefault();
    event.stopPropagation();
  };

  return (
    <span ref={boxRef} className="wd-kebab-box" onClick={stop}>
      <button
        type="button"
        aria-label="More"
        aria-expanded={open}
        className={`wd-kebab ${variant === "light" ? "wd-kebab-light" : ""}`}
        onClick={(event) => {
          stop(event);
          setOpen(!open);
        }}
      >
        <IoEllipsisVertical />
      </button>

      {open && (
        <div className="wd-kebab-menu">
          {items.map((item) => (
            <button
              key={item.label}
              type="button"
              className={item.danger ? "wd-kebab-danger" : ""}
              onClick={(event) => {
                stop(event);
                setOpen(false);
                item.onClick();
              }}
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </span>
  );
}
