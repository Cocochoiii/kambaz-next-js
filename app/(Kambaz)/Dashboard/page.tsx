"use client";

// The Dashboard screen. It shows all my courses.
// Now each course is a Bootstrap Card inside a Col.
// The cards wrap to the next line when the window gets narrow.
// I need "use client" because React Bootstrap uses React context.
import Link from "next/link";
import { Row, Col, Card, Button } from "react-bootstrap";

export default function Dashboard() {
  return (
    <div id="wd-dashboard">
      <h1 id="wd-dashboard-title">Dashboard</h1> <hr />
      <h2 id="wd-dashboard-published">Published Courses (11)</h2> <hr />
      <div id="wd-dashboard-courses">
        <Row xs={1} md={5} className="g-4">
          {/* Course 1 */}
          <Col className="wd-dashboard-course" style={{ width: "300px" }}>
            <Card>
              <Link href="/Courses/5610/Home" className="wd-dashboard-course-link text-decoration-none text-dark">
                <Card.Img variant="top" src="/images/course1.jpg" width="100%" height={160} alt="CS5610 Web Development" />
                <Card.Body>
                  <Card.Title className="wd-dashboard-course-title text-nowrap overflow-hidden">
                    CS5610 Web Development
                  </Card.Title>
                  <Card.Text className="wd-dashboard-course-description overflow-hidden" style={{ height: "70px" }}>
                    Full Stack Web Development
                  </Card.Text>
                  <Button variant="primary"> Go </Button>
                </Card.Body>
              </Link>
            </Card>
          </Col>
          {/* Course 2 */}
          <Col className="wd-dashboard-course" style={{ width: "300px" }}>
            <Card>
              <Link href="/Courses/5520/Home" className="wd-dashboard-course-link text-decoration-none text-dark">
                <Card.Img variant="top" src="/images/course2.jpg" width="100%" height={160} alt="CS5520 Mobile Application Development" />
                <Card.Body>
                  <Card.Title className="wd-dashboard-course-title text-nowrap overflow-hidden">
                    CS5520 Mobile Application Development
                  </Card.Title>
                  <Card.Text className="wd-dashboard-course-description overflow-hidden" style={{ height: "70px" }}>
                    Mobile Development
                  </Card.Text>
                  <Button variant="primary"> Go </Button>
                </Card.Body>
              </Link>
            </Card>
          </Col>
          {/* Course 3 */}
          <Col className="wd-dashboard-course" style={{ width: "300px" }}>
            <Card>
              <Link href="/Courses/5004/Home" className="wd-dashboard-course-link text-decoration-none text-dark">
                <Card.Img variant="top" src="/images/course3.jpg" width="100%" height={160} alt="CS5004 Object Oriented Design" />
                <Card.Body>
                  <Card.Title className="wd-dashboard-course-title text-nowrap overflow-hidden">
                    CS5004 Object Oriented Design
                  </Card.Title>
                  <Card.Text className="wd-dashboard-course-description overflow-hidden" style={{ height: "70px" }}>
                    Object Oriented Design in Java
                  </Card.Text>
                  <Button variant="primary"> Go </Button>
                </Card.Body>
              </Link>
            </Card>
          </Col>
          {/* Course 4 */}
          <Col className="wd-dashboard-course" style={{ width: "300px" }}>
            <Card>
              <Link href="/Courses/5200/Home" className="wd-dashboard-course-link text-decoration-none text-dark">
                <Card.Img variant="top" src="/images/course4.jpg" width="100%" height={160} alt="CS5200 Database Management Systems" />
                <Card.Body>
                  <Card.Title className="wd-dashboard-course-title text-nowrap overflow-hidden">
                    CS5200 Database Management Systems
                  </Card.Title>
                  <Card.Text className="wd-dashboard-course-description overflow-hidden" style={{ height: "70px" }}>
                    Relational Database Systems
                  </Card.Text>
                  <Button variant="primary"> Go </Button>
                </Card.Body>
              </Link>
            </Card>
          </Col>
          {/* Course 5 */}
          <Col className="wd-dashboard-course" style={{ width: "300px" }}>
            <Card>
              <Link href="/Courses/5800/Home" className="wd-dashboard-course-link text-decoration-none text-dark">
                <Card.Img variant="top" src="/images/course5.jpg" width="100%" height={160} alt="CS5800 Algorithms" />
                <Card.Body>
                  <Card.Title className="wd-dashboard-course-title text-nowrap overflow-hidden">
                    CS5800 Algorithms
                  </Card.Title>
                  <Card.Text className="wd-dashboard-course-description overflow-hidden" style={{ height: "70px" }}>
                    Algorithm Design and Analysis
                  </Card.Text>
                  <Button variant="primary"> Go </Button>
                </Card.Body>
              </Link>
            </Card>
          </Col>
          {/* Course 6 */}
          <Col className="wd-dashboard-course" style={{ width: "300px" }}>
            <Card>
              <Link href="/Courses/6620/Home" className="wd-dashboard-course-link text-decoration-none text-dark">
                <Card.Img variant="top" src="/images/course6.jpg" width="100%" height={160} alt="CS6620 Fundamentals of Cloud Computing" />
                <Card.Body>
                  <Card.Title className="wd-dashboard-course-title text-nowrap overflow-hidden">
                    CS6620 Fundamentals of Cloud Computing
                  </Card.Title>
                  <Card.Text className="wd-dashboard-course-description overflow-hidden" style={{ height: "70px" }}>
                    Cloud Computing
                  </Card.Text>
                  <Button variant="primary"> Go </Button>
                </Card.Body>
              </Link>
            </Card>
          </Col>
          {/* Course 7 */}
          <Col className="wd-dashboard-course" style={{ width: "300px" }}>
            <Card>
              <Link href="/Courses/6510/Home" className="wd-dashboard-course-link text-decoration-none text-dark">
                <Card.Img variant="top" src="/images/course7.jpg" width="100%" height={160} alt="CS6510 Advanced Software Development" />
                <Card.Body>
                  <Card.Title className="wd-dashboard-course-title text-nowrap overflow-hidden">
                    CS6510 Advanced Software Development
                  </Card.Title>
                  <Card.Text className="wd-dashboard-course-description overflow-hidden" style={{ height: "70px" }}>
                    Large Scale Software Projects
                  </Card.Text>
                  <Button variant="primary"> Go </Button>
                </Card.Body>
              </Link>
            </Card>
          </Col>
          {/* Course 8 */}
          <Col className="wd-dashboard-course" style={{ width: "300px" }}>
            <Card>
              <Link href="/Courses/5700/Home" className="wd-dashboard-course-link text-decoration-none text-dark">
                <Card.Img variant="top" src="/images/course8.jpg" width="100%" height={160} alt="CS5700 Computer Networks" />
                <Card.Body>
                  <Card.Title className="wd-dashboard-course-title text-nowrap overflow-hidden">
                    CS5700 Computer Networks
                  </Card.Title>
                  <Card.Text className="wd-dashboard-course-description overflow-hidden" style={{ height: "70px" }}>
                    Internet Protocols
                  </Card.Text>
                  <Button variant="primary"> Go </Button>
                </Card.Body>
              </Link>
            </Card>
          </Col>
          {/* Course 9 */}
          <Col className="wd-dashboard-course" style={{ width: "300px" }}>
            <Card>
              <Link href="/Courses/6140/Home" className="wd-dashboard-course-link text-decoration-none text-dark">
                <Card.Img variant="top" src="/images/course9.jpg" width="100%" height={160} alt="CS6140 Machine Learning" />
                <Card.Body>
                  <Card.Title className="wd-dashboard-course-title text-nowrap overflow-hidden">
                    CS6140 Machine Learning
                  </Card.Title>
                  <Card.Text className="wd-dashboard-course-description overflow-hidden" style={{ height: "70px" }}>
                    Supervised and Unsupervised Learning
                  </Card.Text>
                  <Button variant="primary"> Go </Button>
                </Card.Body>
              </Link>
            </Card>
          </Col>
          {/* Course 10 */}
          <Col className="wd-dashboard-course" style={{ width: "300px" }}>
            <Card>
              <Link href="/Courses/5100/Home" className="wd-dashboard-course-link text-decoration-none text-dark">
                <Card.Img variant="top" src="/images/course10.jpg" width="100%" height={160} alt="CS5100 Foundations of Artificial Intelligence" />
                <Card.Body>
                  <Card.Title className="wd-dashboard-course-title text-nowrap overflow-hidden">
                    CS5100 Foundations of Artificial Intelligence
                  </Card.Title>
                  <Card.Text className="wd-dashboard-course-description overflow-hidden" style={{ height: "70px" }}>
                    Search, Logic and Learning
                  </Card.Text>
                  <Button variant="primary"> Go </Button>
                </Card.Body>
              </Link>
            </Card>
          </Col>
          {/* Course 11 */}
          <Col className="wd-dashboard-course" style={{ width: "300px" }}>
            <Card>
              <Link href="/Courses/6650/Home" className="wd-dashboard-course-link text-decoration-none text-dark">
                <Card.Img variant="top" src="/images/course11.jpg" width="100%" height={160} alt="CS6650 Building Scalable Distributed Systems" />
                <Card.Body>
                  <Card.Title className="wd-dashboard-course-title text-nowrap overflow-hidden">
                    CS6650 Building Scalable Distributed Systems
                  </Card.Title>
                  <Card.Text className="wd-dashboard-course-description overflow-hidden" style={{ height: "70px" }}>
                    Scalable Systems
                  </Card.Text>
                  <Button variant="primary"> Go </Button>
                </Card.Body>
              </Link>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
}
