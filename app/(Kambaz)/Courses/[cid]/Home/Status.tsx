"use client";

// The Course Status box on the Home screen.
// Publish and Unpublish are real. They change the course.
// The buttons under them only show the Canvas layout.
import { useParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "react-bootstrap";
import { MdDoNotDisturbAlt } from "react-icons/md";
import { FaCheckCircle } from "react-icons/fa";
import { BiImport } from "react-icons/bi";
import { LiaFileImportSolid } from "react-icons/lia";
import { FaHouse, FaBullhorn, FaChartSimple, FaBell } from "react-icons/fa6";
import { updateCourse } from "../../reducer";
import { useIsFaculty } from "../../../Account/roles";
import * as coursesClient from "../../client";

export default function CourseStatus() {
  const params = useParams<{ cid: string }>();
  const cid = params ? params.cid : "";

  const { courses } = useSelector((state: any) => state.coursesReducer);
  const dispatch = useDispatch();
  const isFaculty = useIsFaculty();

  const course = courses.find((one: any) => one._id === cid);
  const published = course ? course.published !== false : true;

  // One PUT, then the store. The Dashboard card follows right away.
  const setPublished = async (next: boolean) => {
    if (!course || next === published) {
      return;
    }
    const updated = { ...course, published: next };
    await coursesClient.updateCourse(updated);
    dispatch(updateCourse(updated));
  };

  return (
    <div id="wd-course-status" style={{ width: "350px" }}>
      <h2>Course Status</h2>

      <div className="d-flex">
        <div className="w-50 pe-1">
          <Button
            id="wd-unpublish-course"
            variant={published ? "secondary" : "dark"}
            size="lg"
            className="w-100 text-nowrap"
            disabled={!isFaculty}
            onClick={() => setPublished(false)}
          >
            <MdDoNotDisturbAlt className="me-2 fs-5" /> Unpublish
          </Button>
        </div>
        <div className="w-50">
          <Button
            id="wd-publish-course"
            variant={published ? "success" : "outline-success"}
            size="lg"
            className="w-100"
            disabled={!isFaculty}
            onClick={() => setPublished(true)}
          >
            <FaCheckCircle className="me-2 fs-5" /> Publish
          </Button>
        </div>
      </div>

      {/* A small line, so I can see which one is on. */}
      <p className="text-muted mt-2 mb-0" id="wd-course-status-text">
        This course is {published ? "published" : "not published"}.
      </p>

      <br />

      <Button variant="secondary" size="lg" className="w-100 mt-1 text-start">
        <BiImport className="me-2 fs-5" /> Import Existing Content
      </Button>
      <Button variant="secondary" size="lg" className="w-100 mt-1 text-start">
        <LiaFileImportSolid className="me-2 fs-5" /> Import from Commons
      </Button>
      <Button variant="secondary" size="lg" className="w-100 mt-1 text-start">
        <FaHouse className="me-2 fs-5" /> Choose Home Page
      </Button>
      <Button variant="secondary" size="lg" className="w-100 mt-1 text-start">
        <FaChartSimple className="me-2 fs-5" /> View Course Stream
      </Button>
      <Button variant="secondary" size="lg" className="w-100 mt-1 text-start">
        <FaBullhorn className="me-2 fs-5" /> New Announcement
      </Button>
      <Button variant="secondary" size="lg" className="w-100 mt-1 text-start">
        <FaChartSimple className="me-2 fs-5" /> New Analytics
      </Button>
      <Button variant="secondary" size="lg" className="w-100 mt-1 text-start">
        <FaBell className="me-2 fs-5" /> View Course Notifications
      </Button>
    </div>
  );
}
