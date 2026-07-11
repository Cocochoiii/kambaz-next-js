"use client";

import dynamic from "next/dynamic";
import { useMemo } from "react";

// Rich-text (WYSIWYG) editor backed by react-quill. Loaded client-side only
// (ssr: false) because Quill needs the browser DOM. Emits HTML on change.
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false }) as any;

const MODULES = {
    toolbar: [
        ["bold", "italic", "underline"],
        [{ list: "ordered" }, { list: "bullet" }],
        ["link"],
        ["clean"],
    ],
};

export default function RichText({
    value,
    onChange,
    placeholder,
    minHeight,
}: {
    value: string;
    onChange: (html: string) => void;
    placeholder?: string;
    minHeight?: number;
}) {
    const modules = useMemo(() => MODULES, []);
    // minHeight sets the editing-area height via a CSS variable (see globals.css).
    return (
        <div className="wd-rte" style={{ ["--wd-rte-min" as any]: minHeight ? `${minHeight}px` : "0" }}>
            <ReactQuill
                theme="snow"
                value={value || ""}
                onChange={(html: string) => onChange(html)}
                modules={modules}
                placeholder={placeholder}
            />
        </div>
    );
}
