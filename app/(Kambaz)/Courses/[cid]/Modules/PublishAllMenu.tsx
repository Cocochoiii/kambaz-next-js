"use client";

import { Dropdown } from "react-bootstrap";
import { FaCheckCircle, FaBan } from "react-icons/fa";

export default function PublishAllMenu({
    idPrefix = "wd",
    label = "Publish All",
    onBulkPublish,
}: {
    idPrefix?: string;
    label?: string;
    onBulkPublish?: (published: boolean, includeItems: boolean) => void;
}) {
    const run = (published: boolean, includeItems: boolean) => {
        if (onBulkPublish) onBulkPublish(published, includeItems);
    };
    return (
        <Dropdown>
            <Dropdown.Toggle id={`${idPrefix}-publish-all-btn`} className="btn btn-secondary">
                <FaCheckCircle className="me-1 text-success" /> {label}
            </Dropdown.Toggle>
            <Dropdown.Menu>
                <Dropdown.Item
                    id={`${idPrefix}-publish-all-modules-and-items`}
                    onClick={() => run(true, true)}
                >
                    <FaCheckCircle className="me-2 text-success" /> Publish all modules and items
                </Dropdown.Item>
                <Dropdown.Item
                    id={`${idPrefix}-publish-modules-only`}
                    onClick={() => run(true, false)}
                >
                    <FaCheckCircle className="me-2 text-success" /> Publish modules only
                </Dropdown.Item>
                <Dropdown.Divider />
                <Dropdown.Item
                    id={`${idPrefix}-unpublish-all-modules-and-items`}
                    onClick={() => run(false, true)}
                >
                    <FaBan className="me-2" /> Unpublish all modules and items
                </Dropdown.Item>
                <Dropdown.Item
                    id={`${idPrefix}-unpublish-modules-only`}
                    onClick={() => run(false, false)}
                >
                    <FaBan className="me-2" /> Unpublish modules only
                </Dropdown.Item>
            </Dropdown.Menu>
        </Dropdown>
    );
}
