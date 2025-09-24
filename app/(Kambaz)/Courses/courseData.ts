export type ModuleSpec = { title: string; items: string[] };

export const courseNames: Record<string, string> = {
    "5610": "CS5610 Web Development",
    "5520": "CS5520 Mobile Application Development",
    "5004": "CS5004 Object-Oriented Design",
    "5200": "CS5200 Database Management Systems",
    "5800": "CS5800 Algorithms",
    "6510": "CS6510 Advanced Software Development",
    "6620": "CS6620 Fundamentals of Cloud Computing",
};

export const homeBlurb: Record<string, string> = {
    "5610": "Hands-on full-stack web with HTML/CSS/JS, React/Next.js, Node/Express, and MongoDB.",
    "5520": "Design and build mobile apps with modern UI patterns, data, networking, and device APIs.",
    "5004": "Deep dive into OOP design in Java: principles, patterns, and rigorous testing.",
    "5200": "Relational modeling, SQL, transactions, and performance tuning for real systems.",
    "5800": "Core algorithms, complexity, and problem solving with proofs and analysis.",
    "6510": "Team-based product development: planning, architecture, quality, and delivery.",
    "6620": "Cloud foundations: virtualization, distributed storage, platforms, and data systems.",
};

export const perCourse: Record<string, ModuleSpec[]> = {
    "5610": [
        { title: "Week 1 – HTML/CSS/JS", items: [
                "Environment setup & tooling",
                "HTML semantics, lists, tables, forms",
                "CSS basics & box model",
                "Intro JavaScript & DOM",
            ]},
        { title: "Week 2 – React & Next.js", items: [
                "React components & props/state",
                "Next.js App Router & navigation",
                "Layouts, dynamic routes",
                "Client vs Server components",
            ]},
        { title: "Week 3 – HTTP & Web Interaction", items: [
                "Fetch/AJAX & REST concepts",
                "Forms & validation",
                "Server rendering (SSR) vs SSG",
                "Accessibility & basic SEO",
            ]},
        { title: "Week 4 – Express & APIs", items: [
                "Node/Express fundamentals",
                "Routing & middleware",
                "RESTful design & status codes",
                "Deploying simple APIs",
            ]},
        { title: "Week 5 – Data & Persistence", items: [
                "MongoDB modeling & CRUD",
                "Atlas/connection & drivers",
                "API integration with DB",
                "End-to-end feature demo",
            ]},
    ],
    "5520": [
        { title: "Week 1 – Mobile UI Foundations", items: [
                "Platform overview & tooling",
                "MVC/MVVM patterns for mobile",
                "Views, navigation, gestures",
                "Resource & lifecycle basics",
            ]},
        { title: "Week 2 – Data & Local Storage", items: [
                "Core Data / SQLite / Room",
                "Working with JSON",
                "Persistence & offline-first",
                "Lists & adapters",
            ]},
        { title: "Week 3 – Networking", items: [
                "URL loading/HTTP clients",
                "Auth & secure storage",
                "Background tasks",
                "Error handling & retries",
            ]},
        { title: "Week 4 – Sensors & Device APIs", items: [
                "GPS & motion sensing",
                "Camera/media basics",
                "Permissions & privacy",
                "Location-based features",
            ]},
        { title: "Week 5 – Project Architecture", items: [
                "App architecture & modules",
                "Testing & CI for mobile",
                "App store guidelines",
                "Project milestone demo",
            ]},
    ],
    "5004": [
        { title: "Week 1 – OOP Foundations in Java", items: [
                "Classes/objects/encapsulation",
                "Interfaces & generics",
                "Polymorphism & dynamic dispatch",
                "Unit testing intro",
            ]},
        { title: "Week 2 – UML & Design Principles", items: [
                "UML class/sequence diagrams",
                "SOLID principles",
                "Cohesion & coupling",
                "API design basics",
            ]},
        { title: "Week 3 – Inheritance vs Composition", items: [
                "Subclassing vs subtyping",
                "Delegation & forwarding",
                "Mixins/adapters",
                "Refactoring to composition",
            ]},
        { title: "Week 4 – Design Patterns I", items: [
                "Factory/Builder/Singleton",
                "Strategy/Template Method",
                "Observer/Publisher-Subscriber",
                "Case-study exercise",
            ]},
        { title: "Week 5 – Design Patterns II & Testing", items: [
                "Decorator/Composite",
                "Command/State",
                "Mocking & test doubles",
                "Design critique & review",
            ]},
    ],
    "5200": [
        { title: "Week 1 – Relational Model", items: [
                "ER diagrams & relationships",
                "Relational algebra basics",
                "Mapping ER → relations",
                "Keys & constraints",
            ]},
        { title: "Week 2 – SQL Fundamentals", items: [
                "DDL/DML/queries/joins",
                "Aggregations & subqueries",
                "Views & indexes (intro)",
                "Stored procedures & UDFs",
            ]},
        { title: "Week 3 – Normalization & Schema Design", items: [
                "1NF/2NF/3NF/BCNF",
                "Functional dependencies",
                "Decomposition & anomalies",
                "Design tradeoffs",
            ]},
        { title: "Week 4 – Transactions & Concurrency", items: [
                "ACID properties",
                "Isolation levels & locking",
                "Deadlocks & recovery",
                "Multi-version concurrency",
            ]},
        { title: "Week 5 – Performance & Special Topics", items: [
                "B-trees & indexing",
                "Query plans & optimization",
                "Security & access control",
                "Spatial/text/XML/time-series (overview)",
            ]},
    ],
    "5800": [
        { title: "Week 1 – Math & Asymptotics", items: [
                "Asymptotic notation",
                "Loop invariants",
                "Proofs by induction",
                "Algorithm correctness",
            ]},
        { title: "Week 2 – Recurrences & Sorting", items: [
                "Solving recurrences",
                "Divide & conquer",
                "Mergesort/Quicksort",
                "Lower bounds (intro)",
            ]},
        { title: "Week 3 – Heaps & Hashing", items: [
                "Priority queues & heaps",
                "Hash functions & tables",
                "Amortized analysis",
                "Applications",
            ]},
        { title: "Week 4 – Greedy & Dynamic Programming", items: [
                "Greedy choice property",
                "Interval scheduling/Huffman",
                "DP formulation & examples",
                "Knapsack/paths",
            ]},
        { title: "Week 5 – Graphs & Complexity", items: [
                "BFS/DFS/topo ordering",
                "Shortest paths/flows (overview)",
                "Reductions & NP-completeness (intro)",
                "Exam prep",
            ]},
    ],
    "6510": [
        { title: "Week 1 – Project Kickoff & Roles", items: [
                "Team formation & roles",
                "Project charter & goals",
                "Backlog & roadmap",
                "Definition of done",
            ]},
        { title: "Week 2 – Requirements & Planning", items: [
                "Personas & user stories",
                "Non-functionals & constraints",
                "Estimations & milestones",
                "Risk register",
            ]},
        { title: "Week 3 – Architecture & Components", items: [
                "Layered & hexagonal architectures",
                "Interfaces & contracts",
                "Code ownership & review workflow",
                "Dev environment & CI",
            ]},
        { title: "Week 4 – Implementation & Quality", items: [
                "Testing pyramid & coverage",
                "Static analysis & linting",
                "Observability basics",
                "Mid-sprint demo & feedback",
            ]},
        { title: "Week 5 – Iteration & Retrospective", items: [
                "Performance & tuning",
                "Docs & user guidelines",
                "Release plan",
                "Retro & next-steps",
            ]},
    ],
    "6620": [
        { title: "Week 1 – Virtualization & Containers", items: [
                "VMs vs containers",
                "Images & registries",
                "Orchestration overview",
                "Resource isolation",
            ]},
        { title: "Week 2 – Distributed Storage", items: [
                "Object stores & filesystems",
                "Consistency & replication",
                "Durability & availability",
                "Data lifecycle & cost",
            ]},
        { title: "Week 3 – IaaS & Open Platforms", items: [
                "Compute/network primitives",
                "Provisioning & IaC",
                "Open-source cloud stacks",
                "Security baseline",
            ]},
        { title: "Week 4 – Big Data Platforms", items: [
                "Batch vs stream processing",
                "Data pipelines",
                "Lakehouse basics",
                "Serving/analytics patterns",
            ]},
        { title: "Week 5 – Data Center Scale & Project", items: [
                "Resource scheduling at scale",
                "Multi-tenancy",
                "Cost/perf tradeoffs",
                "Project proposal checkpoint",
            ]},
    ],
};

// helpers
export const getCourseName = (cid: string) => courseNames[cid] ?? `Course ${cid}`;
export const getHomeBlurb = (cid: string) => homeBlurb[cid] ?? "Welcome to the course!";
