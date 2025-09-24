
import type { ReactNode } from "react";
import TOC from "./Navigation";
import "./globals.css";
export default function LabsLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <div className="d-flex p-2">
      <div style={{minWidth:220}}><TOC/></div>
      <div className="flex-fill p-2">{children}</div>
    </div>
  );
}
