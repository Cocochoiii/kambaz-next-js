import Link from "next/link";
import Image from "next/image";
const courses = [
  { id: "5610", title: "CS5610 Web Development", tag: "Full Stack Web", img: "course1.jpg" },
  { id: "5520", title: "CS5520 Mobile Application Development", tag: "Mobile Dev", img: "course2.jpg" },
  { id: "5004", title: "CS5004 Object-Oriented Design", tag: "OOD in Java", img: "course3.jpg" },
  { id: "5200", title: "CS5200 Database Management Systems", tag: "Relational DBMS", img: "course4.jpg" },
  {id: "5800", title: "CS5800 Algorithms", tag: "Algorithm Analysis", img: "course5.jpg" },
  { id: "6620", title: "CS6620 Fundamentals of Cloud Computing", tag: "Cloud Computing", img: "course6.jpg" },
  { id: "6510", title: "CS6510 Advanced Software Dev", tag: "Large-scale projects", img: "course7.jpg" }
];
export default function Dashboard(){
    return (
        <div id="wd-dashboard">
            <h1 id="wd-dashboard-title">Dashboard</h1><hr/>
            <h2 id="wd-dashboard-published">Published Courses ({courses.length})</h2><hr/>
            <div id="wd-dashboard-courses">
                <div className="row row-cols-1 row-cols-md-4 g-4">
                    {courses.map(c => (
                        <div className="col" key={c.id}>
                            <div className="card wd-dashboard-course" style={{width:"300px"}}>
                                <Link href={`/Courses/${c.id}/Home`} className="text-decoration-none text-dark wd-dashboard-course-link">
                                    <Image src={`/images/${c.img}`} alt={c.title} width={300} height={160} />
                                    <div className="card-body">
                                        <h5 className="card-title text-nowrap overflow-hidden">{c.title}</h5>
                                        <p className="card-text overflow-hidden" style={{height:"100px"}}>{c.tag}</p>
                                        <button className="btn btn-primary">Go</button>
                                    </div>
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
