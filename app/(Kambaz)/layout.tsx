// Layout for Kambaz. In A1 this was a table. Now I use Bootstrap flex.
// The Kambaz menu is on the left. The screen is on the right.
import type { ReactNode } from "react";
import KambazNavigation from "./Navigation";
import "./styles.css";

export default function KambazLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <div id="wd-kambaz">
      <div className="d-flex">
        <div>
          <KambazNavigation />
        </div>
        <div className="wd-main-content-offset p-3 flex-fill">
          {children}
        </div>
      </div>
    </div>
  );
}
