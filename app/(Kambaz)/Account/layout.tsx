// Layout for the Account screens. The menu is on the left.
// The screens set their own width, because the Users table is wide
// and the Signin form is narrow.
import type { ReactNode } from "react";
import AccountNavigation from "./Navigation";

export default function AccountLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <div id="wd-account-screen">
      <div className="d-flex">
        <div>
          <AccountNavigation />
        </div>
        <div className="flex-fill ms-4" style={{ minWidth: 0 }}>
          {children}
        </div>
      </div>
    </div>
  );
}
