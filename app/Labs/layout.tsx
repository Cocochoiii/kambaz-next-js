// Layout for the Labs pages. The table of contents is on the left
// and the lab content is on the right.
import type { ReactNode } from "react";
import TOC from "./TOC";

export default function LabsLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <table>
      <tbody>
        <tr>
          <td valign="top" width="100"><TOC /></td>
          <td valign="top">{children}</td>
        </tr>
      </tbody>
    </table>
  );
}
