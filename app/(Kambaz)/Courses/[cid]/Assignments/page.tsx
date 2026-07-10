"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { assignmentCatalog } from "./catalog";
import { ListGroup, Badge, Button, Form, InputGroup } from "react-bootstrap";
import { FaPlus } from "react-icons/fa6";
import {
    BsGripVertical,
    BsFileEarmarkText,
    BsThreeDotsVertical,
    BsCheckCircleFill,
    BsPlus,
    BsSearch,
} from "react-icons/bs";

export default function Assignments() {
    const { cid } = useParams<{ cid: string }>();
    const items =
        assignmentCatalog[cid] ??
        [{ title: "A1 – Basics", description: "", points: 100 }];

    return (
        <div id="wd-assignments" className="mt-2">
            <div className="d-flex align-items-center gap-2 mb-3">
                {/* Search field with a magnifying glass, justified to the left */}
                <InputGroup style={{ maxWidth: 380 }}>
                    <InputGroup.Text className="bg-white">
                        <BsSearch />
                    </InputGroup.Text>
                    <Form.Control id="wd-search-assignment" placeholder="Search for Assignments" />
                </InputGroup>

                {/* Buttons floated right; same colors as Modules (grey + red) */}
                <Button id="wd-add-assignment-group" variant="secondary" className="ms-auto">
                    <FaPlus className="me-1" /> Group
                </Button>
                <Button id="wd-add-assignment" variant="danger">
                    <FaPlus className="me-1" /> Assignment
                </Button>
            </div>

            <div className="border rounded mb-3">
                <div className="d-flex align-items-center justify-content-between px-3 py-2">
                    <div className="d-flex align-items-center gap-2">
                        <BsGripVertical className="fs-4 text-secondary" />
                        <strong>ASSIGNMENTS</strong>
                    </div>
                    <div className="d-flex align-items-center gap-2">
                        <Badge bg="light" text="dark" className="border">
                            40% of Total
                        </Badge>
                        <Button size="sm" variant="light">
                            <BsPlus />
                        </Button>
                        <Button size="sm" variant="light">
                            <BsThreeDotsVertical />
                        </Button>
                    </div>
                </div>

                <ListGroup variant="flush" id="wd-assignment-list">
                    {items.map((a, idx) => {
                        const aid = 100 + idx;
                        return (
                            <ListGroup.Item
                                key={aid}
                                className="py-3 d-flex align-items-start"
                            >
                                <div className="me-2 pt-1">
                                    <BsGripVertical className="text-secondary" />
                                </div>
                                <div className="me-3 pt-1">
                                    <BsFileEarmarkText className="text-success fs-5" />
                                </div>
                                <div className="flex-grow-1">
                                    <Link
                                        className="wd-assignment-link fw-semibold text-decoration-none"
                                        href={`/Courses/${cid}/Assignments/${aid}`}
                                    >
                                        {a.title}
                                    </Link>
                                    <div className="text-muted small">
                                        Multiple Modules <span className="mx-2">|</span> Not available until May 6 at 12:00am{" "}
                                        <span className="mx-2">|</span> {a.points} pts
                                    </div>
                                </div>
                                <div className="ms-3 d-flex align-items-center gap-2">
                                    <BsCheckCircleFill className="text-success" />
                                    <BsThreeDotsVertical className="text-secondary" />
                                </div>
                            </ListGroup.Item>
                        );
                    })}
                </ListGroup>
            </div>
        </div>
    );
}
