"use client";

import { Dropdown } from "react-bootstrap";

export default function PublishAllMenu({
                                           idPrefix = "wd",
                                           label = "Publish All",
                                       }: {
    idPrefix?: string;
    label?: string;
}) {
    return (
        <Dropdown>
            <Dropdown.Toggle
                id={`${idPrefix}-publish-all-btn`}
                className="btn btn-secondary"
            >
                ✓ {label}
            </Dropdown.Toggle>
            <Dropdown.Menu>
                <Dropdown.Item id={`${idPrefix}-publish-all-modules-and-items`}>
                    ✓ Publish all modules and items
                </Dropdown.Item>
                <Dropdown.Item id={`${idPrefix}-publish-modules-only`}>
                    ✓ Publish modules only
                </Dropdown.Item>
                <Dropdown.Divider />
                <Dropdown.Item id={`${idPrefix}-unpublish-all-modules-and-items`}>
                    ⊘ Unpublish all modules and items
                </Dropdown.Item>
                <Dropdown.Item id={`${idPrefix}-unpublish-modules-only`}>
                    ⊘ Unpublish modules only
                </Dropdown.Item>
            </Dropdown.Menu>
        </Dropdown>
    );
}
