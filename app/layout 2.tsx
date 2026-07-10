import type { Metadata } from "next";
import "bootstrap/dist/css/bootstrap.min.css";
import "./globals.css";
export const metadata: Metadata = {
    title: "Kambaz / Labs - Coco Choi",
    description: "A4 - State and Redux"
};
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    return (
        <html lang="en">
        <body>{children}</body>
        </html>
    );
}