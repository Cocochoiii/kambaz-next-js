// Layout for the three Account screens.
// The Account menu is on the left. The screen is on the right.
import type { ReactNode } from "react";
import AccountNavigation from "./Navigation";

export default function AccountLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <div id="wd-account-screen">
      <div className="d-flex">
        <div>
          <AccountNavigation />
        </div>
        <div className="flex-fill ms-4" style={{ maxWidth: "300px" }}>
          {children}
        </div>
      </div>
    </div>
  );
}
