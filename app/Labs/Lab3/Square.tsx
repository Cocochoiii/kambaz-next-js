// The number in the body arrives as children. I square it.
import { ReactNode } from "react";
export default function Square({ children }: { children: ReactNode }) {
  const num = Number(children);
  return <span id="wd-square">{num * num}</span>;
}
