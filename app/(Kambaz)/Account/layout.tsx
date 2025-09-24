// app/(Kambaz)/Account/layout.tsx
import React from "react";

export const metadata = {
    title: "Kambaz · Account",
    description: "Account pages",
};

export default function AccountLayout({
                                          children,
                                      }: {
    children: React.ReactNode;
}) {
    return <div>{children}</div>;
}
