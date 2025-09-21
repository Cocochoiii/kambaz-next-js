import type { ReactNode } from "react";
import KambazNavigation from "./Navigation";
export default function KambazLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <table><tbody><tr>
      <td valign="top" width="220"><KambazNavigation /></td>
      <td valign="top" width="100%">{children}</td>
    </tr></tbody></table>
  );
}
