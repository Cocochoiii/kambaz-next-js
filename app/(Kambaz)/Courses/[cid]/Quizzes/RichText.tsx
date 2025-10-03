"use client";
import dynamic from "next/dynamic";
import { useMemo } from "react";
const Quill = dynamic(() => import("react-quill"), { ssr: false });
import "react-quill/dist/quill.snow.css";

export default function RichText({ value, onChange, placeholder }:
                                 { value: string; onChange: (v: string)=>void; placeholder?: string }) {
    const modules = useMemo(() => ({
        toolbar: [["bold","italic","underline"],[{ list:"ordered"},{ list:"bullet"}],["link","clean"]],
    }), []);
    return <Quill theme="snow" value={value} onChange={onChange} modules={modules} placeholder={placeholder} />;
}
