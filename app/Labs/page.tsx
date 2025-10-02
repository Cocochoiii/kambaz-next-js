// app/Labs/page.tsx
import Link from "next/link";

export default function Labs() {
    return (
        <div id="wd-labs">
            <h1>Labs</h1>
            <p>Name: Coco Cai</p>
            <p>Section: Fall2025 Section 03</p>

            <ul>
                <li><Link id="wd-lab1-link" href="/Labs/Lab1">Lab 1: HTML</Link></li>
                <li><Link id="wd-lab2-link" href="/Labs/Lab2">Lab 2: CSS &amp; Bootstrap</Link></li>
                <li><Link id="wd-lab3-link" href="/Labs/Lab3">Lab 3: JavaScript</Link></li>
                <li><Link id="wd-lab4-link" href="/Labs/Lab4">Lab 4: State &amp; Redux</Link></li>
                <li><Link id="wd-lab5-link" href="/Labs/Lab5">Lab 5: HTTP Server &amp; REST APIs</Link></li>
            </ul>

            <p><Link id="wd-kambaz-home" href="/">Back to Kambaz</Link></p>
        </div>
    );
}
