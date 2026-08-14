// Layout for Kambaz. The menu is on the left, the screen on the right.
// Chapter 4 adds the store, so the Provider wraps everything.
import type { ReactNode } from "react";
import KambazNavigation from "./Navigation";
import StoreProvider from "./StoreProvider";
import "./styles.css";

export default function KambazLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <StoreProvider>
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
    </StoreProvider>
  );
}
