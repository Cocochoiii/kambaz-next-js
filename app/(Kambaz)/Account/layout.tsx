import type { ReactNode } from "react";
import AccountNavigation from "./Navigation";

export const metadata = {
    title: "Kambaz · Account",
    description: "Account pages",
};

export default function AccountLayout({ children }: { children: ReactNode }) {
    return (
        <div id="wd-account" className="container-fluid py-3">
            {/* smaller gutter than the default */}
            <div className="row align-items-start" style={{ ["--bs-gutter-x" as any]: "0.5rem" }}>
                <aside className="col-8 col-md-2 pe-md-2">
                    <AccountNavigation />
                </aside>

                <main className="col-8 col-md-4 col-xl-2">
                    {children}
                </main>
            </div>
        </div>
    );
}