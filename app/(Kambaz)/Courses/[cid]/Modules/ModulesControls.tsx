"use client";

import { FaPlus } from "react-icons/fa6";
import PublishAllMenu from "./PublishAllMenu";

export default function ModulesControls({
                                            onToggleAll,
                                            allCollapsed,
                                        }: {
    onToggleAll: () => void;
    allCollapsed: boolean;
}) {
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

            {/* Same dropdown component used everywhere */}
            <PublishAllMenu idPrefix="wd" label="Publish All" />

            <button id="wd-modules-new-module" className="btn btn-danger">
                <FaPlus className="me-2" /> Module
            </button>
        </div>
    );
}
