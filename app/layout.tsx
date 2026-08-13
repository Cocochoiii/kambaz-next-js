// This is the main layout for the whole app.
// Chapter 2 says to import the Bootstrap style sheet here, so every
// screen can use Bootstrap classes.
import type { ReactNode } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

export const metadata = {
  title: "Kambaz",
  description: "CS5610 Web Development - Assignment 2",
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
