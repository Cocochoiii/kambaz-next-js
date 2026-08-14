// Layout for Kambaz. The menu is on the left.
// Session keeps me signed in after a reload.
import type { ReactNode } from "react";
import KambazNavigation from "./Navigation";
import StoreProvider from "./StoreProvider";
import Session from "./Account/Session";
import "./styles.css";

export default function KambazLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <StoreProvider>
      <Session>
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
      </Session>
    </StoreProvider>
  );
}
