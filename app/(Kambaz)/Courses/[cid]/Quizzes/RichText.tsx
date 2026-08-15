"use client";

// The WYSIWYG box for a description and for a question.
// Quill only runs in the browser, so I load it with dynamic.
// I use react-quill-new. The old react-quill calls findDOMNode.
// React 19 dropped that call, and Next 15 runs React 19.
import dynamic from "next/dynamic";

const ReactQuill = dynamic(() => import("react-quill-new"), {
  ssr: false,
}) as any;

const TOOLBAR = [
  ["bold", "italic", "underline"],
  [{ list: "ordered" }, { list: "bullet" }],
  ["link"],
  ["clean"],
];

export default function RichText({
  value,
  onChange,
}: {
  value?: string;
  onChange: (html: string) => void;
}) {
  return (
    <div className="wd-rich-text">
      <ReactQuill
        theme="snow"
        value={value || ""}
        onChange={onChange}
        modules={{ toolbar: TOOLBAR }}
      />
    </div>
  );
}
