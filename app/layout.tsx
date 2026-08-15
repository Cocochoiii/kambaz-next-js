// Main layout for the whole app.
// I import the Bootstrap style sheet here, so every screen can use it.
// The quill sheet is for the rich text box of the quiz editor.
import type { ReactNode } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-quill-new/dist/quill.snow.css";

export const metadata = {
  title: "Kambaz",
  description: "CS5610 Web Development - Assignment 5 - Coco Choi",
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
