"use client";

import Link from "next/link";
import { useState } from "react";
import { Card, Button, Form, InputGroup, ListGroup, Badge } from "react-bootstrap";
import { BsInbox, BsSearch } from "react-icons/bs";

type Msg = {
    id: string;
    from: string;
    subject: string;
    preview: string;
    time: string;
    unread?: boolean;
    course?: string;
};

const MOCK: Msg[] = [
    {
        id: "1",
        from: "Course Bot",
        subject: "Welcome to your Inbox",
        preview: "This is a placeholder. Wire it to your API when ready.",
        time: "now",
        unread: true,
    },
    {
        id: "2",
        from: "CS5610 Staff",
        subject: "Project 1 released",
        preview: "Spec and starter code are available on Modules.",
        time: "2h",
        course: "5610",
    },
    {
        id: "3",
        from: "CS5200 TA",
        subject: "Lab moved to Thursday",
        preview: "Please check Zoom link in the course page.",
        time: "yesterday",
        course: "5200",
    },
];

export default function InboxPage() {
    const [q, setQ] = useState("");

    const filtered = MOCK.filter(
        m =>
            m.subject.toLowerCase().includes(q.toLowerCase()) ||
            m.from.toLowerCase().includes(q.toLowerCase()) ||
            m.preview.toLowerCase().includes(q.toLowerCase())
    );

    return (
        <div id="wd-inbox" className="container-fluid py-4">
            <div className="d-flex align-items-center mb-3 gap-2">
                <BsInbox className="fs-3" />
                <h2 className="m-0">Inbox</h2>
                <span className="text-muted"> · placeholder</span>
                <div className="ms-auto">
                    <Link href="/Dashboard" className="btn btn-outline-secondary btn-sm">
                        Back to Dashboard
                    </Link>
                </div>
            </div>

            <Card className="shadow-sm">
                <Card.Header className="bg-white">
                    <div className="d-flex gap-2 align-items-center">
                        <InputGroup style={{ maxWidth: 420 }}>
                            <InputGroup.Text>
                                <BsSearch />
                            </InputGroup.Text>
                            <Form.Control
                                placeholder="Search messages…"
                                value={q}
                                onChange={(e) => setQ(e.target.value)}
                            />
                        </InputGroup>
                        <Form.Select style={{ maxWidth: 200 }} defaultValue="">
                            <option value="">All courses</option>
                            <option value="5610">CS5610</option>
                            <option value="5520">CS5520</option>
                            <option value="5200">CS5200</option>
                            <option value="5004">CS5004</option>
                            <option value="5800">CS5800</option>
                            <option value="6510">CS6510</option>
                            <option value="6620">CS6620</option>
                        </Form.Select>
                        <div className="ms-auto d-flex gap-2">
                            <Button variant="primary">New Message</Button>
                            <Button variant="outline-secondary">Mark all read</Button>
                        </div>
                    </div>
                </Card.Header>

                <ListGroup variant="flush">
                    {filtered.length === 0 && (
                        <ListGroup.Item className="py-5 text-center text-muted">
                            No messages yet. This is a stub UI—hook it up to your data source when ready.
                        </ListGroup.Item>
                    )}

                    {filtered.map((m) => (
                        <ListGroup.Item
                            key={m.id}
                            action
                            className="d-flex flex-column gap-1"
                        >
                            <div className="d-flex align-items-center">
                                <strong className="me-2">{m.subject}</strong>
                                {m.unread && <Badge bg="danger" pill>new</Badge>}
                                <span className="ms-auto text-muted small">{m.time}</span>
                            </div>
                            <div className="text-muted small">
                                From: {m.from}
                                {m.course && <Badge bg="secondary" className="ms-2">Course {m.course}</Badge>}
                            </div>
                            <div className="text-body">{m.preview}</div>
                        </ListGroup.Item>
                    ))}
                </ListGroup>
            </Card>
        </div>
    );
}
