"use client";

import { useState } from "react";
import { FaPlus } from "react-icons/fa6";
import ModuleEditor from "./ModuleEditor";
import PublishAllMenu from "./PublishAllMenu";

export default function ModulesControls({
                                            onToggleAll,
                                            allCollapsed,
                                            moduleName,
                                            setModuleName,
                                            addModule,
                                            onPublishAll,
                                            onPublishModulesOnly,
                                            onUnpublishAll,
                                            onUnpublishModulesOnly,
                                        }: {
    onToggleAll: () => void;
    allCollapsed: boolean;
    moduleName: string;
    setModuleName: (title: string) => void;
    addModule: () => void;
    onPublishAll: () => void;
    onPublishModulesOnly: () => void;
    onUnpublishAll: () => void;
    onUnpublishModulesOnly: () => void;
}) {
    const [show, setShow] = useState(false);
    return (
        <div id="wd-modules-toolbar" className="btn-toolbar gap-2 mb-3">
            <button id="wd-modules-collapse-all" className="btn btn-secondary" onClick={onToggleAll}>
                {allCollapsed ? "Expand All" : "Collapse All"}
            </button>

            <button id="wd-modules-view-progress" className="btn btn-secondary">
                View Progress
            </button>

            <PublishAllMenu
                idPrefix="wd"
                label="Publish All"
                onPublishAll={onPublishAll}
                onPublishModulesOnly={onPublishModulesOnly}
                onUnpublishAll={onUnpublishAll}
                onUnpublishModulesOnly={onUnpublishModulesOnly}
            />

            <button id="wd-modules-new-module" className="btn btn-danger" onClick={() => setShow(true)}>
                <FaPlus className="me-2" /> Module
            </button>

            <ModuleEditor
                show={show}
                handleClose={() => setShow(false)}
                dialogTitle="Add Module"
                moduleName={moduleName}
                setModuleName={setModuleName}
                addModule={addModule}
            />
        </div>
    );
}
