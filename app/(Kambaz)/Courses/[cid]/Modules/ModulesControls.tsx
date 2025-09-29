// app/(Kambaz)/Courses/[cid]/Modules/ModulesControls.tsx
"use client";

import { useState } from "react";
import { FaPlus } from "react-icons/fa6";
import { Button } from "react-bootstrap";
import ModuleEditor from "./ModuleEditor";
import PublishAllMenu from "./PublishAllMenu";

export default function ModulesControls({
                                            onToggleAll,
                                            allCollapsed,
                                            moduleName,
                                            setModuleName,
                                            addModule
                                        }: {
    onToggleAll: () => void;
    allCollapsed: boolean;
    moduleName: string;
    setModuleName: (title: string) => void;
    addModule: () => void;
}) {
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    return (
        <div id="wd-modules-toolbar" className="btn-toolbar gap-2 mb-3">
            <button
                id="wd-modules-collapse-all"
                className="btn btn-secondary"
                onClick={onToggleAll}
            >
                {allCollapsed ? "Expand All" : "Collapse All"}
            </button>

            <button id="wd-modules-view-progress" className="btn btn-secondary">
                View Progress
            </button>

            <PublishAllMenu idPrefix="wd" label="Publish All" />

            <button
                id="wd-modules-new-module"
                className="btn btn-danger"
                onClick={handleShow}
            >
                <FaPlus className="me-2" /> Module
            </button>

            <ModuleEditor
                show={show}
                handleClose={handleClose}
                dialogTitle="Add Module"
                moduleName={moduleName}
                setModuleName={setModuleName}
                addModule={addModule}
            />
        </div>
    );
}