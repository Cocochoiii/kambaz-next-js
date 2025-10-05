"use client";

import React, { useState } from "react";
import { Container, Nav, Tab } from "react-bootstrap";
import ManageFoldersScreen from "./ManageClass_Folders";  // Using your existing component

const ManageClass: React.FC = () => {
    const [activeKey, setActiveKey] = useState("manage-folders");

    return (
        <Container fluid className="p-3">
            <Tab.Container activeKey={activeKey} onSelect={(k) => setActiveKey(k || "manage-folders")}>
                <Nav variant="tabs" className="mb-3">
                    <Nav.Item>
                        <Nav.Link eventKey="general" disabled>
                            General Settings
                        </Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link eventKey="customize-qa" disabled>
                            Customize Q&amp;A
                        </Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link eventKey="manage-folders">
                            Manage Folders
                        </Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link eventKey="manage-enrollment" disabled>
                            Manage Enrollment
                        </Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link eventKey="manage-groups" disabled>
                            Manage Groups
                        </Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link eventKey="create-groups" disabled>
                            Create Groups
                        </Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link eventKey="customize-page" disabled>
                            Customize Course Page
                        </Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link eventKey="pazza-network" disabled>
                            Pazza Network Settings
                        </Nav.Link>
                    </Nav.Item>
                </Nav>
                <Tab.Content>
                    <Tab.Pane eventKey="manage-folders">
                        <ManageFoldersScreen />
                    </Tab.Pane>
                </Tab.Content>
            </Tab.Container>
        </Container>
    );
};

export default ManageClass;