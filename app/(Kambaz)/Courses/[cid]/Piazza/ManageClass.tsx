"use client";

import React, { useEffect, useState } from "react";
import { Container, Nav, Tab } from "react-bootstrap";
import { useSelector } from "react-redux";
import { useParams, useRouter } from "next/navigation";
import ManageFoldersScreen from "./ManageClass_Folders";

/**
 * Manage Class Screen (MCS)
 * - Only visible & reachable to instructors (FACULTY | TA | INSTRUCTOR)
 * - Shows the 7 tabs, with only "Manage Folders" enabled/implemented
 * - Matches Piazza-like top tabs styling via your existing pazza.css
 */
const ManageClass: React.FC = () => {
    const [activeKey, setActiveKey] = useState("manage-folders");
    const params = useParams();
    const router = useRouter();

    const currentUser = useSelector((s: any) => s.accountReducer?.currentUser);
    const isInstructor = ["FACULTY", "TA", "INSTRUCTOR"].includes(
        currentUser?.role
    );
    const cid = params?.cid as string;

    // Guard: block non-instructors from navigating directly via URL/hash
    useEffect(() => {
        if (currentUser && !isInstructor) {
            // simple client-side protection; your API/SSR can also protect
            router.replace(`/Courses/${cid}/Pazza`); // back to Q&A home
        }
    }, [currentUser, isInstructor, router, cid]);

    if (!isInstructor) {
        // brief friendly fallback if the redirect hasn’t fired yet
        return (
            <Container fluid className="p-4">
                <div className="alert alert-warning mb-0">
                    You don’t have permission to manage this class.
                </div>
            </Container>
        );
    }

    return (
        <Container fluid className="p-0 pazza-manage-wrap">
            {/* Top tab bar */}
            <div className="pazza-manage-tabs">
                <div className="inner">
                    <button className="tab disabled">General Settings</button>
                    <button className="tab disabled">Customize Q&amp;A</button>
                    <button className="tab active">Manage Folders</button>
                    <button className="tab disabled">Manage Enrollment</button>
                    <button className="tab disabled">Create Groups</button>
                    <button className="tab disabled">Customize Course Page</button>
                    <button className="tab disabled">Pazza Network Settings</button>
                </div>
            </div>

            {/* Content area – we still keep react-bootstrap Tab.Container so structure stays intact */}
            <div className="p-3">
                <Tab.Container
                    activeKey={activeKey}
                    onSelect={(k) => setActiveKey(k || "manage-folders")}
                >
                    <Nav className="d-none" />
                    <Tab.Content>
                        <Tab.Pane eventKey="manage-folders">
                            <ManageFoldersScreen />
                        </Tab.Pane>
                    </Tab.Content>
                </Tab.Container>
            </div>
        </Container>
    );
};

export default ManageClass;
