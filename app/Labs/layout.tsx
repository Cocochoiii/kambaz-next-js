// Layout for the Labs pages. The table of contents is on top.
// 4.5 The Provider sits above every lab, because Lab 3 and Lab 4 read
// the same todo list from the store.
import type { ReactNode } from "react";
import TOC from "./TOC";
import StoreProvider from "./StoreProvider";

export default function LabsLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <StoreProvider>
      <div id="wd-labs-layout" className="px-3 pb-3 pt-5">
        <TOC />
        <div className="mt-3">{children}</div>
      </div>
    </StoreProvider>
  );
}
