// The header that A5 asks for on the landing page of the labs.
// My name, my section, every lab, Kambaz, and both repositories.
// Lab 1 and the Labs page both use it, so they always match.
import Link from "next/link";
import { HTTP_SERVER } from "@/app/env";

export default function LabsHeader() {
  return (
    <div id="wd-labs-header">
      <h5>Coco Choi</h5>
      <h5>CS5610 Web Development, Fall 2025, Section 04</h5>

      <ul>
        <li><Link href="/Labs/Lab1" id="wd-lab1-link">Lab 1: HTML Examples</Link></li>
        <li><Link href="/Labs/Lab2" id="wd-lab2-link">Lab 2: CSS and Bootstrap</Link></li>
        <li><Link href="/Labs/Lab3" id="wd-lab3-link">Lab 3: JavaScript Fundamentals</Link></li>
        <li><Link href="/Labs/Lab4" id="wd-lab4-link">Lab 4: State and Redux</Link></li>
        <li><Link href="/Labs/Lab5" id="wd-lab5-link">Lab 5: Node.js Server and HTTP</Link></li>
        <li><Link href="/" id="wd-kambaz-link">Kambaz</Link></li>
      </ul>

      <h5>Source code repositories</h5>
      <ul>
        <li>
          <a id="wd-github-client"
             href="https://github.com/Cocochoiii/kambaz-next-js"
             target="_blank" rel="noreferrer">
            React client: Cocochoiii/kambaz-next-js
          </a>
        </li>
        <li>
          <a id="wd-github-server"
             href="https://github.com/Cocochoiii/kambaz-node-server-app"
             target="_blank" rel="noreferrer">
            Node server: Cocochoiii/kambaz-node-server-app
          </a>
        </li>
      </ul>

      {/* Which server this copy talks to. */}
      <p className="text-muted small" id="wd-server-in-use">
        Server in use: {HTTP_SERVER}
      </p>
    </div>
  );
}
