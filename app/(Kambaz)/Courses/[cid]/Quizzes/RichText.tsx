"use client";

import dynamic from "next/dynamic";

// react-quill WYSIWYG. minHeight sets a CSS var read by globals.css .wd-rte.
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false }) as any;

export default function RichText({ value, onChange, minHeight = 120 }: any) {
    return (
        <div className="wd-rte" style={{ ["--wd-rte-min" as any]: `${minHeight}px` }}>
            <ReactQuill
                theme="snow"
                value={value || ""}
                onChange={onChange}
                modules={{ toolbar: [["bold", "italic", "underline"], [{ list: "ordered" }, { list: "bullet" }], ["link"], ["clean"]] }}
            />
        </div>
    );
}
