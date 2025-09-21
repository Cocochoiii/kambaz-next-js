import Link from "next/link";
import Image from "next/image";
const courses = [
  { id: "1234", code: "CS1234", title: "React JS", img: "reactjs.jpg" },
  { id: "5001", code: "CS5001", title: "Programming", img: "course1.jpg" },
  { id: "5800", code: "CS5800", title: "Algorithms", img: "course2.jpg" },
  { id: "5610", code: "CS5610", title: "Web Development", img: "course3.jpg" },
  { id: "5500", code: "CS5500", title: "Software Engineering", img: "course4.jpg" },
  { id: "6200", code: "CS6200", title: "Information Retrieval", img: "course5.jpg" },
  { id: "6510", code: "CS6510", title: "Advanced Software Dev", img: "course6.jpg" }
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
                <h5>{c.code} {c.title}</h5>
                <p className="wd-dashboard-course-title">Course overview</p>
                <button>Go</button>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
