// Main layout for the whole app.
// I import the Bootstrap style sheet here, so every screen can use it.
import type { ReactNode } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

export const metadata = {
  title: "Kambaz",
  description: "CS5610 Web Development - Assignment 4",
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
