"use client";

// The WYSIWYG box Pazza uses for a post, an answer and a followup.
// Quill only runs in the browser, so I load it with dynamic.
// I use react-quill-new because the old package calls findDOMNode.
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
  placeholder,
  tall,
}: {
  value?: string;
  onChange: (html: string) => void;
  placeholder?: string;
  tall?: boolean;
}) {
  return (
    <div className={`wd-pazza-rte ${tall ? "wd-pazza-rte-tall" : ""}`}>
      <ReactQuill
        theme="snow"
        value={value || ""}
        onChange={onChange}
        modules={{ toolbar: TOOLBAR }}
        placeholder={placeholder}
      />
    </div>
  );
}
