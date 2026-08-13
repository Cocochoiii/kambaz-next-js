"use client";

// The Kambaz menu on the left side.
// Bootstrap classes keep it black, fixed, full height, and hidden on a
// narrow screen. Dashboard is the selected link, so it is white with red
// text. Only the Account icon is white. The other icons are red.
// I need "use client" because React Bootstrap uses React context.
import { ListGroup } from "react-bootstrap";
import Link from "next/link";
import { AiOutlineDashboard } from "react-icons/ai";
import { IoCalendarOutline } from "react-icons/io5";
import { LiaBookSolid } from "react-icons/lia";
import { FaInbox, FaRegCircleUser, FaBook } from "react-icons/fa6";

export default function KambazNavigation() {
  return (
    <ListGroup
      id="wd-kambaz-navigation"
      style={{ width: 110 }}
      className="rounded-0 position-fixed bottom-0 top-0 d-none d-md-block bg-black z-2"
    >
      <ListGroup.Item
        className="bg-black border-0 text-center"
        as="a"
        target="_blank"
        rel="noreferrer"
        href="https://www.northeastern.edu/"
        id="wd-neu-link"
      >
        <img src="/images/NEU.png" width="75px" alt="Northeastern University" />
      </ListGroup.Item>

      <ListGroup.Item className="border-0 bg-black text-center">
        <Link href="/Account" id="wd-account-link" className="text-white text-decoration-none">
          <FaRegCircleUser className="fs-1 text-white" />
          <br />
          Account
        </Link>
      </ListGroup.Item>

      <ListGroup.Item className="border-0 bg-white text-center">
        <Link href="/Dashboard" id="wd-dashboard-link" className="text-danger text-decoration-none">
          <AiOutlineDashboard className="fs-1 text-danger" />
          <br />
          Dashboard
        </Link>
      </ListGroup.Item>

      <ListGroup.Item className="border-0 bg-black text-center">
        <Link href="/Dashboard" id="wd-course-link" className="text-white text-decoration-none">
          <FaBook className="fs-1 text-danger" />
          <br />
          Courses
        </Link>
      </ListGroup.Item>

      <ListGroup.Item className="border-0 bg-black text-center">
        <Link href="/Calendar" id="wd-calendar-link" className="text-white text-decoration-none">
          <IoCalendarOutline className="fs-1 text-danger" />
          <br />
          Calendar
        </Link>
      </ListGroup.Item>

      <ListGroup.Item className="border-0 bg-black text-center">
        <Link href="/Inbox" id="wd-inbox-link" className="text-white text-decoration-none">
          <FaInbox className="fs-1 text-danger" />
          <br />
          Inbox
        </Link>
      </ListGroup.Item>

      <ListGroup.Item className="border-0 bg-black text-center">
        <Link href="/Labs" id="wd-labs-link" className="text-white text-decoration-none">
          <LiaBookSolid className="fs-1 text-danger" />
          <br />
          Labs
        </Link>
      </ListGroup.Item>
    </ListGroup>
  );
}
