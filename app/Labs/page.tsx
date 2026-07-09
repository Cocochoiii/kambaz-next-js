import Link from "next/link";

export default function Labs() {
  return (
    <div id="wd-labs">
      <h1>Labs</h1>
      <p>Name: Coco Choi</p>
      <p>Section: Fall 2025 Section 04</p>
      <ul>
        <li><Link href="/Labs/Lab1">Lab 1: HTML Examples</Link></li>
        <li><Link href="/Labs/Lab2">Lab 2: CSS Basics</Link></li>
        <li><Link href="/Labs/Lab3">Lab 3: JavaScript Fundamentals</Link></li>
      </ul>
      <p>
        <a id="wd-github" href="https://github.com/Cocochoiii/kambaz-next-js" target="_blank" rel="noreferrer">
          GitHub Repository
        </a>
      </p>
      <p><a href="/" id="wd-kambaz-home">Back to Kambaz</a></p>
    </div>
  );
}
