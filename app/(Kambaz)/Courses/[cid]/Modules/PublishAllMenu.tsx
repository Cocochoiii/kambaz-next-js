"use client";

import { Dropdown } from "react-bootstrap";
import { FaCheckCircle, FaBan } from "react-icons/fa";

export default function PublishAllMenu({
                                           idPrefix = "wd",
                                           label = "Publish All",
                                       }: {
    idPrefix?: string;
    label?: string;
}) {
    return (
        <Dropdown>
            <Dropdown.Toggle id={`${idPrefix}-publish-all-btn`} className="btn btn-secondary">
                <FaCheckCircle className="text-success me-1" /> {label}
            </Dropdown.Toggle>
            <Dropdown.Menu>
                <Dropdown.Item id={`${idPrefix}-publish-all-modules-and-items`}>
                    <FaCheckCircle className="text-success me-2" /> Publish all modules and items
                </Dropdown.Item>
                <Dropdown.Item id={`${idPrefix}-publish-modules-only`}>
                    <FaCheckCircle className="text-success me-2" /> Publish modules only
                </Dropdown.Item>
                <Dropdown.Divider />
                <Dropdown.Item id={`${idPrefix}-unpublish-all-modules-and-items`}>
                    <FaBan className="text-danger me-2" /> Unpublish all modules and items
                </Dropdown.Item>
                <Dropdown.Item id={`${idPrefix}-unpublish-modules-only`}>
                    <FaBan className="text-danger me-2" /> Unpublish modules only
                </Dropdown.Item>
            </Dropdown.Menu>
        </Dropdown>
    );
}
