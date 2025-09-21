// app/(Kambaz)/Courses/[cid]/Assignments/page.tsx
import Link from "next/link";
import { assignmentCatalog } from "./catalog";

export default async function Assignments({
                                              params,
                                          }: {
    params: Promise<{ cid: string }>;
}) {
    const { cid } = await params;
    const items = assignmentCatalog[cid]?.map(a => a.title) ?? ["A1 – Basics", "A2 – Project"];

    return (
        <div id="wd-assignments">
            <input placeholder="Search for Assignments" id="wd-search-assignment" />
            <button id="wd-add-assignment-group">+ Group</button>
            <button id="wd-add-assignment">+ Assignment</button>

            <h3 id="wd-assignments-title">
                ASSIGNMENTS 40% of Total <button>+</button>
            </h3>

            <ul id="wd-assignment-list">
                {items.map((title, idx) => (
                    <li className="wd-assignment-list-item" key={idx}>
                        <Link
                            className="wd-assignment-link"
                            href={`/Courses/${cid}/Assignments/${100 + idx}`}
                        >
                            {title}
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}
