"use client";

import React from "react";
import { Dropdown } from "react-bootstrap";
import { IoEllipsisVertical } from "react-icons/io5";

export type KebabItem = {
    label: string;
    onClick: () => void;
    danger?: boolean;
};

// Toggle that shows only the dots (no default caret). No fixed color so it
// inherits the surrounding text color and stays visible on any background.
const DotsToggle = React.forwardRef<HTMLSpanElement, any>(({ onClick }, ref) => (
    <span
        ref={ref}
        role="button"
        onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onClick(e);
        }}
    >
        <IoEllipsisVertical className="fs-4" />
    </span>
));
DotsToggle.displayName = "DotsToggle";

// Small reusable three-dots menu. Pass the actions you want in the list.
export default function KebabMenu({ items }: { items: KebabItem[] }) {
    return (
        <Dropdown onClick={(e) => e.stopPropagation()}>
            <Dropdown.Toggle as={DotsToggle} />
            <Dropdown.Menu>
                {items.map((item, i) => (
                    <Dropdown.Item
                        key={i}
                        className={item.danger ? "text-danger" : ""}
                        onClick={item.onClick}
                    >
                        {item.label}
                    </Dropdown.Item>
                ))}
            </Dropdown.Menu>
        </Dropdown>
    );
}
