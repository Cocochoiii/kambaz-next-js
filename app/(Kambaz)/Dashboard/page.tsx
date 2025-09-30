import Link from "next/link";
import Image from "next/image";
import {
    FaBullhorn,
    FaRegEdit,
    FaRegCommentDots,
    FaRegFolder
} from "react-icons/fa";

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
            <h1 id="wd-dashboard-title" className="display-4 mb-0">Dashboard</h1>
            <hr className="mb-4" />
            <h2 id="wd-dashboard-published" className="mb-4">Published Courses ({courses.length})</h2>

            <div id="wd-dashboard-courses" className="row row-cols-1 row-cols-md-2 row-cols-lg-4 g-4">
                {courses.map((c) => (
                    <div className="col wd-dashboard-course" key={c.id} style={{ width: "300px" }}>
                        <div className="card h-100 shadow-sm border-0 d-flex flex-column">
                            <Link href={`/Courses/${c.id}/Home`} className="wd-dashboard-course-link text-decoration-none text-dark flex-grow-1 d-flex flex-column">
                                <div className="ratio ratio-16x9">
                                    <Image
                                        src={`/images/${c.img}`}
                                        alt={c.title}
                                        fill
                                        sizes="(max-width: 768px) 100vw, 25vw"
                                        style={{ objectFit: "cover" }}
                                    />
                                </div>

                                <div className="card-body d-flex flex-column flex-grow-1 position-relative pb-5">
                                    <h5 className="wd-dashboard-course-title course-title line-clamp-2 mt-2 mb-1">
                                        {c.title}
                                    </h5>
                                    <div className="wd-dashboard-course-description text-muted small line-clamp-2">
                                        {c.tag}
                                    </div>

                                    {/* Go button positioned at bottom right */}
                                    <Link
                                        href={`/Courses/${c.id}/Home`}
                                        className="btn btn-primary btn-sm position-absolute"
                                        style={{ bottom: '10px', right: '30px' }}
                                    >
                                        Go
                                    </Link>
                                </div>
                            </Link>

                            {/* Four icon buttons - always at bottom */}
                            <div className="d-flex justify-content-around align-items-center py-2 px-3 border-top mt-auto">
                                <button className="btn p-0 border-0 bg-transparent dashboard-icon-btn">
                                    <FaBullhorn size={18} />
                                </button>
                                <button className="btn p-0 border-0 bg-transparent dashboard-icon-btn">
                                    <FaRegEdit size={18} />
                                </button>
                                <button className="btn p-0 border-0 bg-transparent dashboard-icon-btn">
                                    <FaRegCommentDots size={18} />
                                </button>
                                <button className="btn p-0 border-0 bg-transparent dashboard-icon-btn">
                                    <FaRegFolder size={18} />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}