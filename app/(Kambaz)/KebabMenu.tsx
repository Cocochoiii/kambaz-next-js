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
        // align="end" opens the menu leftward; fixed strategy + high z-index keep it
        // floating above every card so a neighboring card can never clip it.
        <Dropdown align="end" onClick={(e) => e.stopPropagation()}>
            <Dropdown.Toggle as={DotsToggle} />
            <Dropdown.Menu renderOnMount popperConfig={{ strategy: "fixed" }} style={{ zIndex: 2000 }}>
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
