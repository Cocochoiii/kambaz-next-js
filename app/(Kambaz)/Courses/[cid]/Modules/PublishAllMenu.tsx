"use client";

import { Dropdown } from "react-bootstrap";

export default function PublishAllMenu({
                                           idPrefix = "wd",
                                           label = "Publish All",
                                           onPublishAll,
                                           onPublishModulesOnly,
                                           onUnpublishAll,
                                           onUnpublishModulesOnly,
                                       }: {
    idPrefix?: string;
    label?: string;
    onPublishAll?: () => void;
    onPublishModulesOnly?: () => void;
    onUnpublishAll?: () => void;
    onUnpublishModulesOnly?: () => void;
}) {
    return (
        <Dropdown>
            <Dropdown.Toggle id={`${idPrefix}-publish-all-btn`} className="btn btn-secondary">
                ✓ {label}
            </Dropdown.Toggle>
            <Dropdown.Menu>
                <Dropdown.Item
                    id={`${idPrefix}-publish-all-modules-and-items`}
                    onClick={() => onPublishAll?.()}
                >
                    ✓ Publish all modules and items
                </Dropdown.Item>
                <Dropdown.Item
                    id={`${idPrefix}-publish-modules-only`}
                    onClick={() => onPublishModulesOnly?.()}
                >
                    ✓ Publish modules only
                </Dropdown.Item>
                <Dropdown.Divider />
                <Dropdown.Item
                    id={`${idPrefix}-unpublish-all-modules-and-items`}
                    onClick={() => onUnpublishAll?.()}
                >
                    ⊘ Unpublish all modules and items
                </Dropdown.Item>
                <Dropdown.Item
                    id={`${idPrefix}-unpublish-modules-only`}
                    onClick={() => onUnpublishModulesOnly?.()}
                >
                    ⊘ Unpublish modules only
                </Dropdown.Item>
            </Dropdown.Menu>
        </Dropdown>
    );
}
