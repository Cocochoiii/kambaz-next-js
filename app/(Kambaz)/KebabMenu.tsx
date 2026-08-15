"use client";

// The three dots menu Canvas puts at the end of a row.
// I write it myself with a button and a list.
// I give it a list of items. Each item has its own click.
// A click anywhere else closes it. I catch that click with a clear
// sheet over the whole page, the same way the Courses tray does.
import { useState } from "react";
import { IoEllipsisVertical } from "react-icons/io5";

export default function KebabMenu({
  items,
  variant = "light",
}: {
  items: { label: string; onClick: () => void; danger?: boolean }[];
  variant?: string;
}) {
  const [open, setOpen] = useState(false);

  // The card behind me is a link, so I stop the click here.
  const stop = (event: any) => {
    event.preventDefault();
    event.stopPropagation();
  };

  return (
    <span className="wd-kebab-box" onClick={stop}>
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

      {/* The clear sheet. A click on it only closes the menu. */}
      {open && (
        <div
          className="wd-kebab-sheet"
          onClick={(event) => {
            stop(event);
            setOpen(false);
          }}
        />
      )}

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
