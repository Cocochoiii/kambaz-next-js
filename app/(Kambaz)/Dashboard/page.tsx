import Link from "next/link";
import Image from "next/image";
const courses = [
  { id: "5610", title: "CS5610 Web Development", tag: "Full Stack Web", img: "reactjs.jpg" },
  { id: "5520", title: "CS5520 Mobile Application Development", tag: "Mobile Dev", img: "course1.jpg" },
  { id: "5004", title: "CS5004 Object-Oriented Design", tag: "OOD in Java", img: "course2.jpg" },
  { id: "5200", title: "CS5200 Database Management Systems", tag: "Relational DBMS", img: "course3.jpg" },
  {id: "5800", title: "CS5800 Algorithms", tag: "Algorithm Analysis", img: "course4.jpg" },
  { id: "6620", title: "CS6620 Fundamentals of Cloud Computing", tag: "Cloud Computing", img: "course5.jpg" },
  { id: "6510", title: "CS6510 Advanced Software Dev", tag: "Large-scale projects", img: "course6.jpg" }
];
export default function Dashboard() {
  return (
    <div id="wd-dashboard">
      <h1 id="wd-dashboard-title">Dashboard</h1> <hr />
      <h2 id="wd-dashboard-published">Published Courses ({courses.length})</h2> <hr />
      <div id="wd-dashboard-courses">
        {courses.map(c => (
          <div className="wd-dashboard-course" key={c.id} style={{display:"inline-block", margin: 12}}>
            <Link href={`/Courses/${c.id}`} className="wd-dashboard-course-link">
              <Image src={`/images/${c.img}`} alt={c.title} width={200} height={140} />
              <div>
                  <h5>{c.title}</h5>
                  <p className="wd-dashboard-course-title">{c.tag}</p>
                <button>Go</button>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
