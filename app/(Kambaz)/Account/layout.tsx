// Layout for the Account screens. The menu is on the left.
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
