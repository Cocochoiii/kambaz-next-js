// This is the main layout for the whole app.
// I do not import globals.css on purpose. Chapter 1 says to comment it out
// so I can see the plain browser style. CSS starts in Chapter 2.
import type { ReactNode } from "react";

export const metadata = {
  title: "Kambaz",
  description: "CS5610 Web Development - Assignment 1",
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
