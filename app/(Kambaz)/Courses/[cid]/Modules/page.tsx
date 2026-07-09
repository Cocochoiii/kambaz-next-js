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
  ],

  // CS5700 Computer Networks
  "5700": [
    { title: "Week 1 – Internet Architecture", items: [
        "Client-server model & packet switching",
        "Protocol layering (TCP/IP stack)",
        "Network programming with sockets",
        "Delay, loss, and throughput"
      ]},
    { title: "Week 2 – Transport Layer", items: [
        "UDP and TCP basics",
        "Reliable data transfer",
        "Flow control & sliding window",
        "TCP congestion control (Tahoe/Reno)"
      ]},
    { title: "Week 3 – Network Layer & Routing", items: [
        "IP addressing & forwarding",
        "Link-state routing (Dijkstra)",
        "Distance-vector routing",
        "Inter-domain routing (BGP) & NAT"
      ]},
    { title: "Week 4 – Applications & Naming", items: [
        "HTTP and the Web",
        "DNS naming",
        "Email (SMTP)",
        "Peer-to-peer & content delivery (CDN)"
      ]},
    { title: "Week 5 – Network Security", items: [
        "Confidentiality & authentication",
        "TLS and secure channels",
        "Common network attacks",
        "Wireless & mobility"
      ]}
  ],

  // CS6140 Machine Learning
  "6140": [
    { title: "Week 1 – ML Foundations", items: [
        "Probability & linear algebra review",
        "Supervised vs unsupervised learning",
        "Train / validation / test splits",
        "Overfitting & the bias-variance tradeoff"
      ]},
    { title: "Week 2 – Regression", items: [
        "Linear regression",
        "Logistic regression",
        "Generalized linear models",
        "Gradient descent"
      ]},
    { title: "Week 3 – Classification", items: [
        "Naive Bayes",
        "Decision & regression trees",
        "k-Nearest Neighbors",
        "Maximum likelihood & Bayesian inference"
      ]},
    { title: "Week 4 – Kernels & Dimensionality Reduction", items: [
        "Support Vector Machines",
        "Kernel methods",
        "Principal Component Analysis (PCA)",
        "Linear Discriminant Analysis (LDA)"
      ]},
    { title: "Week 5 – Unsupervised & Deep Learning", items: [
        "K-means & EM clustering",
        "Mixture models",
        "Neural networks (feedforward, CNN)",
        "Ensembles & boosting"
      ]}
  ],

  // CS5100 Foundations of Artificial Intelligence
  "5100": [
    { title: "Week 1 – Agents & Uninformed Search", items: [
        "Intelligent agents & environments",
        "Problem formulation",
        "BFS, DFS, IDS",
        "Uniform-cost search"
      ]},
    { title: "Week 2 – Informed & Adversarial Search", items: [
        "Greedy & A* search",
        "Heuristics & admissibility",
        "Minimax & alpha-beta pruning",
        "Expectimax"
      ]},
    { title: "Week 3 – Constraint Satisfaction", items: [
        "CSP formulation",
        "Backtracking search",
        "Forward checking",
        "Arc consistency"
      ]},
    { title: "Week 4 – Decision Making Under Uncertainty", items: [
        "Probability & utility",
        "Markov Decision Processes (MDPs)",
        "Value & policy iteration",
        "Reinforcement learning"
      ]},
    { title: "Week 5 – Logic & Learning", items: [
        "Propositional logic",
        "First-order logic",
        "Knowledge representation",
        "Introduction to machine learning"
      ]}
  ],

  // CS6650 Building Scalable Distributed Systems
  "6650": [
    { title: "Week 1 – Intro to Scalable Systems", items: [
        "Internet-scale systems",
        "Scalability & performance concerns",
        "Engineering trade-offs",
        "Quality attributes"
      ]},
    { title: "Week 2 – Concurrency", items: [
        "Multi-threaded programming",
        "Threads, locks, and synchronization",
        "Java concurrency in practice",
        "Thread safety"
      ]},
    { title: "Week 3 – Distributed Communication", items: [
        "Client-server model",
        "Sockets (TCP/UDP)",
        "Remote Procedure Calls (RPC)",
        "Logical clocks"
      ]},
    { title: "Week 4 – Async Systems & Microservices", items: [
        "Message queues (RabbitMQ)",
        "Messaging patterns",
        "Monoliths to microservices",
        "Resilience & fault tolerance"
      ]},
    { title: "Week 5 – Data & Cloud Scalability", items: [
        "Caching strategies",
        "Distributed data & replication",
        "Load balancing",
        "Serverless & cloud deployment"
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
                  <li className="wd-lesson">
                    <span className="wd-title">Reading &amp; Slides</span>
                    <ul className="wd-content">
                      <li className="wd-content-item">Lecture slides</li>
                      <li className="wd-content-item">Assigned reading</li>
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
