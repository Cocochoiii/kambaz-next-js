// The Dashboard screen. It shows all my courses.
// I write each course by hand because Chapter 1 is only HTML.
// Clicking a course opens that course.
import Link from "next/link";
import Image from "next/image";

export default function Dashboard() {
  return (
    <div id="wd-dashboard">
      <h1 id="wd-dashboard-title">Dashboard</h1> <hr />
      <h2 id="wd-dashboard-published">Published Courses (11)</h2> <hr />
      <div id="wd-dashboard-courses">
        {/* Course 1 */}
        <div className="wd-dashboard-course">
          <Link href="/Courses/5610" className="wd-dashboard-course-link">
            <Image src="/images/course1.jpg" alt="CS5610 Web Development" width={200} height={150} />
            <div>
              <h5> CS5610 Web Development </h5>
              <p className="wd-dashboard-course-title"> Full Stack Web Development </p>
              <button> Go </button>
            </div>
          </Link>
        </div>
        {/* Course 2 */}
        <div className="wd-dashboard-course">
          <Link href="/Courses/5520" className="wd-dashboard-course-link">
            <Image src="/images/course2.jpg" alt="CS5520 Mobile Application Development" width={200} height={150} />
            <div>
              <h5> CS5520 Mobile Application Development </h5>
              <p className="wd-dashboard-course-title"> Mobile Development </p>
              <button> Go </button>
            </div>
          </Link>
        </div>
        {/* Course 3 */}
        <div className="wd-dashboard-course">
          <Link href="/Courses/5004" className="wd-dashboard-course-link">
            <Image src="/images/course3.jpg" alt="CS5004 Object Oriented Design" width={200} height={150} />
            <div>
              <h5> CS5004 Object Oriented Design </h5>
              <p className="wd-dashboard-course-title"> Object Oriented Design in Java </p>
              <button> Go </button>
            </div>
          </Link>
        </div>
        {/* Course 4 */}
        <div className="wd-dashboard-course">
          <Link href="/Courses/5200" className="wd-dashboard-course-link">
            <Image src="/images/course4.jpg" alt="CS5200 Database Management Systems" width={200} height={150} />
            <div>
              <h5> CS5200 Database Management Systems </h5>
              <p className="wd-dashboard-course-title"> Relational Database Systems </p>
              <button> Go </button>
            </div>
          </Link>
        </div>
        {/* Course 5 */}
        <div className="wd-dashboard-course">
          <Link href="/Courses/5800" className="wd-dashboard-course-link">
            <Image src="/images/course5.jpg" alt="CS5800 Algorithms" width={200} height={150} />
            <div>
              <h5> CS5800 Algorithms </h5>
              <p className="wd-dashboard-course-title"> Algorithm Design and Analysis </p>
              <button> Go </button>
            </div>
          </Link>
        </div>
        {/* Course 6 */}
        <div className="wd-dashboard-course">
          <Link href="/Courses/6620" className="wd-dashboard-course-link">
            <Image src="/images/course6.jpg" alt="CS6620 Fundamentals of Cloud Computing" width={200} height={150} />
            <div>
              <h5> CS6620 Fundamentals of Cloud Computing </h5>
              <p className="wd-dashboard-course-title"> Cloud Computing </p>
              <button> Go </button>
            </div>
          </Link>
        </div>
        {/* Course 7 */}
        <div className="wd-dashboard-course">
          <Link href="/Courses/6510" className="wd-dashboard-course-link">
            <Image src="/images/course7.jpg" alt="CS6510 Advanced Software Development" width={200} height={150} />
            <div>
              <h5> CS6510 Advanced Software Development </h5>
              <p className="wd-dashboard-course-title"> Large Scale Software Projects </p>
              <button> Go </button>
            </div>
          </Link>
        </div>
        {/* Course 8 */}
        <div className="wd-dashboard-course">
          <Link href="/Courses/5700" className="wd-dashboard-course-link">
            <Image src="/images/course8.jpg" alt="CS5700 Computer Networks" width={200} height={150} />
            <div>
              <h5> CS5700 Computer Networks </h5>
              <p className="wd-dashboard-course-title"> Internet Protocols </p>
              <button> Go </button>
            </div>
          </Link>
        </div>
        {/* Course 9 */}
        <div className="wd-dashboard-course">
          <Link href="/Courses/6140" className="wd-dashboard-course-link">
            <Image src="/images/course9.jpg" alt="CS6140 Machine Learning" width={200} height={150} />
            <div>
              <h5> CS6140 Machine Learning </h5>
              <p className="wd-dashboard-course-title"> Supervised and Unsupervised Learning </p>
              <button> Go </button>
            </div>
          </Link>
        </div>
        {/* Course 10 */}
        <div className="wd-dashboard-course">
          <Link href="/Courses/5100" className="wd-dashboard-course-link">
            <Image src="/images/course10.jpg" alt="CS5100 Foundations of Artificial Intelligence" width={200} height={150} />
            <div>
              <h5> CS5100 Foundations of Artificial Intelligence </h5>
              <p className="wd-dashboard-course-title"> Search, Logic and Learning </p>
              <button> Go </button>
            </div>
          </Link>
        </div>
        {/* Course 11 */}
        <div className="wd-dashboard-course">
          <Link href="/Courses/6650" className="wd-dashboard-course-link">
            <Image src="/images/course11.jpg" alt="CS6650 Building Scalable Distributed Systems" width={200} height={150} />
            <div>
              <h5> CS6650 Building Scalable Distributed Systems </h5>
              <p className="wd-dashboard-course-title"> Scalable Systems </p>
              <button> Go </button>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
