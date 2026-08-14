// The first page of the Labs.
// It shows my name, my section, and the links to each lab.
import Link from "next/link";

export default function Labs() {
  return (
    <div id="wd-labs">
      <h1>Labs</h1>
      <h5>Coco Choi</h5>
      <h5>CS5610 Web Development, Fall 2025, Section 04</h5>
      <ul>
        <li><Link href="/Labs/Lab1" id="wd-lab1-link">Lab 1: HTML Examples</Link></li>
        <li><Link href="/Labs/Lab2" id="wd-lab2-link">Lab 2: CSS and Bootstrap</Link></li>
        <li><Link href="/Labs/Lab3" id="wd-lab3-link">Lab 3: JavaScript Fundamentals</Link></li>
        <li><Link href="/Labs/Lab4" id="wd-lab4-link">Lab 4: State and Redux</Link></li>
        <li><Link href="/" id="wd-kambaz-link">Kambaz</Link></li>
      </ul>
      <p>
        <a id="wd-github" href="https://github.com/Cocochoiii/kambaz-next-js" target="_blank" rel="noreferrer">
          My GitHub repository: Cocochoiii/kambaz-next-js
        </a>
      </p>
    </div>
  );
}
