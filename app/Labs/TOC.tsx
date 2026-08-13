// The table of contents. It links to every lab and back to Kambaz.
import Link from "next/link";

export default function TOC() {
  return (
    <ul>
      <li><Link href="/Labs" id="wd-labs-home-link">Home</Link></li>
      <li><Link href="/Labs/Lab1" id="wd-toc-lab1-link">Lab 1</Link></li>
      <li><Link href="/Labs/Lab2" id="wd-toc-lab2-link">Lab 2</Link></li>
      <li><Link href="/Labs/Lab3" id="wd-toc-lab3-link">Lab 3</Link></li>
      <li><Link href="/" id="wd-toc-kambaz-link">Kambaz</Link></li>
    </ul>
  );
}
