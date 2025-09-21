// app/(Kambaz)/Courses/[cid]/Assignments/catalog.ts
export type AssignmentSeed = { title: string; description: string; points: number };
export type Catalog = Record<string, AssignmentSeed[]>;

export const assignmentCatalog: Catalog = {
    "5610": [
        { title: "A1 – ENV + HTML",              description: "Submit a link to your deployed app (HTML scaffold).", points: 100 },
        { title: "A2 – CSS + Bootstrap",         description: "Style the UI using CSS and Bootstrap components.",    points: 100 },
        { title: "A3 – React Components & State",description: "Build a SPA using React components and state.",       points: 100 },
        { title: "A4 – Express REST API",        description: "Implement a REST API and consume it from React.",     points: 100 },
        { title: "A5 – MongoDB Integration",     description: "Persist data in MongoDB/Atlas and expose CRUD.",      points: 100 },
        { title: "A6 – Final Full-Stack Deploy", description: "End-to-end app deployed publicly.",                   points: 150 },
    ],
    "5520": [
        { title: "A1 – Hello Mobile UI",         description: "Build a basic mobile UI screen.",                      points: 100 },
        { title: "A2 – Navigation & Gestures",   description: "Implement multi-screen navigation and gestures.",      points: 100 },
        { title: "A3 – Networking & JSON",       description: "Fetch JSON from a public API and display it.",         points: 100 },
        { title: "A4 – Local Persistence",       description: "Store and read data locally (e.g., SQLite/Keychain).", points: 100 },
        { title: "A5 – Sensors & Camera",        description: "Use device sensors/camera and handle permissions.",    points: 100 },
        { title: "A6 – Capstone App Demo",       description: "Demonstrate a polished mobile application.",           points: 150 },
    ],
    "5004": [
        { title: "A1 – UML & OOD",               description: "Produce UML and implement basic OOP in Java.",         points: 100 },
        { title: "A2 – SOLID Refactoring",       description: "Refactor a codebase to follow SOLID principles.",      points: 100 },
        { title: "A3 – Design Patterns I",       description: "Implement Strategy/Decorator/Factory.",                points: 100 },
        { title: "A4 – Design Patterns II",      description: "Implement Singleton/Observer/Adapter.",                points: 100 },
        { title: "A5 – Unit Testing & CI",       description: "Add tests and run them in CI.",                        points: 100 },
        { title: "A6 – Mini Framework",          description: "Combine patterns into a small reusable library.",      points: 150 },
    ],
    "5200": [
        { title: "A1 – SQL & ER",                description: "Design an ER model and write SQL queries.",            points: 100 },
        { title: "A2 – Normal Forms",            description: "Normalize schemas to 3NF/BCNF.",                       points: 100 },
        { title: "A3 – Stored Procedures",       description: "Author functions/procedures with parameters.",         points: 100 },
        { title: "A4 – Indexing & Query Plans",  description: "Compare plans and tune with indexes.",                 points: 100 },
        { title: "A5 – Transactions & Concurrency", description: "Demonstrate isolation levels and locking.",        points: 100 },
        { title: "A6 – DB Security & Backup",    description: "Users/roles/backup/restore checklist.",                points: 100 },
    ],
    "5800": [
        { title: "A1 – Asymptotics & Proofs",    description: "Big-O, proofs by induction and contradiction.",        points: 100 },
        { title: "A2 – Recurrences",             description: "Solve recurrences (Master theorem).",                  points: 100 },
        { title: "A3 – Sorting & Heaps",         description: "Implement/compare sorting and heaps.",                 points: 100 },
        { title: "A4 – Greedy vs DP",            description: "Greedy counterexamples, DP solutions.",                points: 100 },
        { title: "A5 – Graph Algorithms",        description: "BFS/DFS/SSSP/MST practice.",                           points: 100 },
        { title: "A6 – NP-Completeness",         description: "Reductions and hardness arguments.",                   points: 100 },
    ],
    "6510": [
        { title: "A1 – Team Charter",            description: "Team norms, roles, tools, repo, CI.",                   points: 100 },
        { title: "A2 – Requirements & Roadmap",  description: "Backlog, milestones, acceptance criteria.",            points: 100 },
        { title: "A3 – Architecture Doc",        description: "C4 diagrams, risks, trade-offs.",                      points: 100 },
        { title: "A4 – Iteration 1 Feature",     description: "Deliver a vertical slice with tests.",                  points: 100 },
        { title: "A5 – Iteration 2 + Testing",   description: "Expand features; coverage & QA.",                      points: 100 },
        { title: "A6 – Final Report & Demo",     description: "Report, demo, retrospective.",                          points: 150 },
    ],
    "6620": [
        { title: "A1 – VM & Container Lab",      description: "Provision a VM and containerize a service.",            points: 100 },
        { title: "A2 – Object Store & DFS",      description: "Use S3/Blob and a distributed FS.",                     points: 100 },
        { title: "A3 – IaaS Automation (Terraform)", description: "IaC to create and tear down infra.",              points: 100 },
        { title: "A4 – Big Data Pipeline",       description: "Batch/stream pipeline (e.g., Spark).",                  points: 100 },
        { title: "A5 – Scalable Service on Kubernetes", description: "Deploy, auto-scale, and expose a service.",     points: 100 },
        { title: "A6 – Cloud Cost & Observability", description: "Budgeting, metrics, logging, tracing.",             points: 100 },
    ],
};

// Helper
export function getAssignment(cid: string, aid: string): AssignmentSeed {
    const index = Math.max(0, (parseInt(aid, 10) || 100) - 100); // 100→0, 101→1, etc.
    return assignmentCatalog[cid]?.[index] ?? {
        title: "A1 – ENV + HTML",
        description: "Submit a link to your deployed app.",
        points: 100,
    };
}
