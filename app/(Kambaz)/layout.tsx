// Layout for Kambaz. I use a table with one row and two columns.
// The Kambaz menu is on the left. The screen is on the right.
import type { ReactNode } from "react";
import KambazNavigation from "./Navigation";

export default function KambazLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <table>
      <tbody>
        <tr>
          <td valign="top" width="200"><KambazNavigation /></td>
          <td valign="top" width="100%">{children}</td>
        </tr>
      </tbody>
    </table>
  );
}
