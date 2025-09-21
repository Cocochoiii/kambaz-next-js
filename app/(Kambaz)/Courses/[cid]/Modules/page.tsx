type ModuleSpec = { title: string; items: string[] };

// Week 1–5 module outlines per course, distilled from the descriptions you shared.
const perCourse: Record<string, ModuleSpec[]> = {
  // CS5610 Web Development
  "5610": [
    { title: "Week 1 – HTML/CSS/JS", items: [
        "Environment setup & tooling",
        "HTML semantics, lists, tables, forms",
        "CSS basics & box model",
        "Intro JavaScript & DOM"
      ]},
    { title: "Week 2 – React & Next.js", items: [
        "React components & props/state",
        "Next.js App Router & navigation",
        "Layouts, dynamic routes",
        "Client vs Server components"
      ]},
    { title: "Week 3 – HTTP & Web Interaction", items: [
        "Fetch/AJAX & REST concepts",
        "Forms & validation",
        "Server rendering (SSR) vs SSG",
        "Accessibility & basic SEO"
      ]},
    { title: "Week 4 – Express & APIs", items: [
        "Node/Express fundamentals",
        "Routing & middleware",
        "RESTful design & status codes",
        "Deploying simple APIs"
      ]},
    { title: "Week 5 – Data & Persistence", items: [
        "MongoDB modeling & CRUD",
        "Atlas/connection & drivers",
        "API integration with DB",
        "End-to-end feature demo"
      ]}
  ],

  // CS5520 Mobile Application Development
  "5520": [
    { title: "Week 1 – Mobile UI Foundations", items: [
        "Platform overview & tooling",
        "MVC/MVVM patterns for mobile",
        "Views, navigation, gestures",
        "Resource & lifecycle basics"
      ]},
    { title: "Week 2 – Data & Local Storage", items: [
        "Core Data / SQLite / Room",
        "Working with JSON",
        "Persistence & offline-first",
        "Lists & adapters"
      ]},
    { title: "Week 3 – Networking", items: [
        "URL loading/HTTP clients",
        "Auth & secure storage",
        "Background tasks",
        "Error handling & retries"
      ]},
    { title: "Week 4 – Sensors & Device APIs", items: [
        "GPS & motion sensing",
        "Camera/media basics",
        "Permissions & privacy",
        "Location-based features"
      ]},
    { title: "Week 5 – Project Architecture", items: [
        "App architecture & modules",
        "Testing & CI for mobile",
        "App store guidelines",
        "Project milestone demo"
      ]}
  ],

  // CS5004 Object-Oriented Design
  "5004": [
    { title: "Week 1 – OOP Foundations in Java", items: [
        "Classes/objects/encapsulation",
        "Interfaces & generics",
        "Polymorphism & dynamic dispatch",
        "Unit testing intro"
      ]},
    { title: "Week 2 – UML & Design Principles", items: [
        "UML class/sequence diagrams",
        "SOLID principles",
        "Cohesion & coupling",
        "API design basics"
      ]},
    { title: "Week 3 – Inheritance vs Composition", items: [
        "Subclassing vs subtyping",
        "Delegation & forwarding",
        "Mixins/adapters",
        "Refactoring to composition"
      ]},
    { title: "Week 4 – Design Patterns I", items: [
        "Factory/Builder/Singleton",
        "Strategy/Template Method",
        "Observer/Publisher-Subscriber",
        "Case-study exercise"
      ]},
    { title: "Week 5 – Design Patterns II & Testing", items: [
        "Decorator/Composite",
        "Command/State",
        "Mocking & test doubles",
        "Design critique & review"
      ]}
  ],

  // CS5200 Database Management Systems
  "5200": [
    { title: "Week 1 – Relational Model", items: [
        "ER diagrams & relationships",
        "Relational algebra basics",
        "Mapping ER → relations",
        "Keys & constraints"
      ]},
    { title: "Week 2 – SQL Fundamentals", items: [
        "DDL/DML/queries/joins",
        "Aggregations & subqueries",
        "Views & indexes (intro)",
        "Stored procedures & UDFs"
      ]},
    { title: "Week 3 – Normalization & Schema Design", items: [
        "1NF/2NF/3NF/BCNF",
        "Functional dependencies",
        "Decomposition & anomalies",
        "Design tradeoffs"
      ]},
    { title: "Week 4 – Transactions & Concurrency", items: [
        "ACID properties",
        "Isolation levels & locking",
        "Deadlocks & recovery",
        "Multi-version concurrency"
      ]},
    { title: "Week 5 – Performance & Special Topics", items: [
        "B-trees & indexing",
        "Query plans & optimization",
        "Security & access control",
        "Spatial/text/XML/time-series (overview)"
      ]}
  ],

  // CS5800 Algorithms
  "5800": [
    { title: "Week 1 – Math & Asymptotics", items: [
        "Asymptotic notation",
        "Loop invariants",
        "Proofs by induction",
        "Algorithm correctness"
      ]},
    { title: "Week 2 – Recurrences & Sorting", items: [
        "Solving recurrences",
        "Divide & conquer",
        "Mergesort/Quicksort",
        "Lower bounds (intro)"
      ]},
    { title: "Week 3 – Heaps & Hashing", items: [
        "Priority queues & heaps",
        "Hash functions & tables",
        "Amortized analysis",
        "Applications"
      ]},
    { title: "Week 4 – Greedy & Dynamic Programming", items: [
        "Greedy choice property",
        "Interval scheduling/Huffman",
        "DP formulation & examples",
        "Knapsack/paths"
      ]},
    { title: "Week 5 – Graphs & Complexity", items: [
        "BFS/DFS/topo ordering",
        "Shortest paths/flows (overview)",
        "Reductions & NP-completeness (intro)",
        "Exam prep"
      ]}
  ],

  // CS6510 Advanced Software Development
  "6510": [
    { title: "Week 1 – Project Kickoff & Roles", items: [
        "Team formation & roles",
        "Project charter & goals",
        "Backlog & roadmap",
        "Definition of done"
      ]},
    { title: "Week 2 – Requirements & Planning", items: [
        "Personas & user stories",
        "Non-functionals & constraints",
        "Estimations & milestones",
        "Risk register"
      ]},
    { title: "Week 3 – Architecture & Components", items: [
        "Layered & hexagonal architectures",
        "Interfaces & contracts",
        "Code ownership & review workflow",
        "Dev environment & CI"
      ]},
    { title: "Week 4 – Implementation & Quality", items: [
        "Testing pyramid & coverage",
        "Static analysis & linting",
        "Observability basics",
        "Mid-sprint demo & feedback"
      ]},
    { title: "Week 5 – Iteration & Retrospective", items: [
        "Performance & tuning",
        "Docs & user guidelines",
        "Release plan",
        "Retro & next-steps"
      ]}
  ],

  // CS6620 Fundamentals of Cloud Computing
  "6620": [
    { title: "Week 1 – Virtualization & Containers", items: [
        "VMs vs containers",
        "Images & registries",
        "Orchestration overview",
        "Resource isolation"
      ]},
    { title: "Week 2 – Distributed Storage", items: [
        "Object stores & filesystems",
        "Consistency & replication",
        "Durability & availability",
        "Data lifecycle & cost"
      ]},
    { title: "Week 3 – IaaS & Open Platforms", items: [
        "Compute/network primitives",
        "Provisioning & IaC",
        "Open-source cloud stacks",
        "Security baseline"
      ]},
    { title: "Week 4 – Big Data Platforms", items: [
        "Batch vs stream processing",
        "Data pipelines",
        "Lakehouse basics",
        "Serving/analytics patterns"
      ]},
    { title: "Week 5 – Data Center Scale & Project", items: [
        "Resource scheduling at scale",
        "Multi-tenancy",
        "Cost/perf tradeoffs",
        "Project proposal checkpoint"
      ]}
  ]
};
export function ModulesContent({ cid }: { cid: string }) {
  const modules = perCourse[cid] ?? [
    { title: "Week 1", items: ["Overview"]},
    { title: "Week 2", items: ["Coming soon"]}
  ];
  return (
      <div>
        {/* Toolbar controls */}
        <div id="wd-modules-toolbar">
          <button id="wd-modules-collapse-all">Collapse All</button>
          <button id="wd-modules-view-progress">View Progress</button>
          <select id="wd-modules-publish-all" defaultValue="publishAll">
            <option value="publishAll">Publish All</option>
            <option value="unpublishAll">Unpublish All</option>
          </select>
          <button id="wd-modules-new-module">+ Module</button>
        </div>
        <ul id="wd-modules">
          {modules.map((m, i) => (
              <li className="wd-module" key={i}>
                <div className="wd-title">{m.title}</div>
                <ul className="wd-lessons">
                  <li className="wd-lesson">
                    <span className="wd-title">Learning Objectives</span>
                    <ul className="wd-content">
                      {m.items.map((x, j)=>(<li className="wd-content-item" key={j}>{x}</li>))}
                    </ul>
                  </li>
                </ul>
              </li>
          ))}
        </ul>
      </div>
  );
}

/** Route page: extracts cid from params then renders ModulesContent */
export default async function ModulesPage({ params }:{ params: Promise<{cid:string}> }){
  const { cid } = await params;
  return <ModulesContent cid={cid} />;
}
