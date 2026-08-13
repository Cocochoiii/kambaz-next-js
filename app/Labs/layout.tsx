// Layout for the Labs pages.
// The table of contents is on top and the lab content is under it.
import type { ReactNode } from "react";
import TOC from "./TOC";

export default function LabsLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <div id="wd-labs-layout" className="px-3 pb-3 pt-5">
      <TOC />
      <div className="mt-3">{children}</div>
    </div>
  );
}
