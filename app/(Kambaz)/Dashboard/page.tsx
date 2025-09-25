import Link from "next/link";
import Image from "next/image";
import { PiNotePencilLight } from "react-icons/pi";

const courses = [
    { id: "5610", title: "CS5610 Web Development", tag: "Full Stack Web", img: "course1.jpg" },
    { id: "5520", title: "CS5520 Mobile Application Development", tag: "Mobile Dev", img: "course2.jpg" },
    { id: "5004", title: "CS5004 Object-Oriented Design", tag: "OOD in Java", img: "course3.jpg" },
    { id: "5200", title: "CS5200 Database Management Systems", tag: "Relational DBMS", img: "course4.jpg" },
    { id: "5800", title: "CS5800 Algorithms", tag: "Algorithm Analysis", img: "course5.jpg" },
    { id: "6620", title: "CS6620 Fundamentals of Cloud Computing", tag: "Cloud Computing", img: "course6.jpg" },
    { id: "6510", title: "CS6510 Advanced Software Dev", tag: "Large-scale projects", img: "course7.jpg" },
];

export default function Dashboard() {
    return (
        <div id="wd-dashboard" className="container-fluid">
            <div className="d-flex align-items-end justify-content-between mb-2">
                <h1 className="mb-0">Dashboard</h1>
            </div>
            <p className="text-muted mb-4">Published Courses ({courses.length})</p>

            {/* four */}
            <div className="row row-cols-1 row-cols-md-2 row-cols-lg-4 g-4">
                {courses.map((c) => (
                    <div className="col" key={c.id}>
                        <div className="card h-100 shadow-sm border-0 hover-lift position-relative">
                            {/* ratio */}
                            <div className="ratio ratio-16x9">
                                <Image
                                    src={`/images/${c.img}`}
                                    alt={c.title}
                                    fill
                                    sizes="(max-width: 768px) 100vw, 25vw"
                                    style={{ objectFit: "cover" }}
                                />
                            </div>

                            <div className="card-body">
                                {/* Icon */}
                                <span className="canvas-tile-icon text-secondary" title="Course card icon">
                  <PiNotePencilLight />
                </span>

                                <h5 className="course-title line-clamp-2 mt-2 mb-1">{c.title}</h5>
                                <div className="text-muted small line-clamp-2">{c.tag}</div>

                                {/* Click the whole cards */}
                                <Link
                                    href={`/Courses/${c.id}/Home`}
                                    className="stretched-link"
                                    aria-label={`Open ${c.title}`}
                                />
                            </div>

                            {/*Go */}
                            <Link href={`/Courses/${c.id}/Home`} className="btn btn-primary btn-sm btn-go">
                                Go
                            </Link>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
