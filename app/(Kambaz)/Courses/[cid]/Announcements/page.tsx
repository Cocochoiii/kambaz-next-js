"use client";

// The Announcements screen. Canvas has it, the book does not.
// Faculty can post and remove. The search box filters.
// The list comes from the server, like the modules.
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { FaUserCircle } from "react-icons/fa";
import { FaTrash } from "react-icons/fa6";
import { BsThreeDots, BsSearch } from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";
import AnnouncementEditor from "./AnnouncementEditor";
import { setAnnouncements, addAnnouncement, deleteAnnouncement } from "./reducer";
import * as coursesClient from "../../client";
import * as announcementsClient from "./client";

// I cut the date myself, so the server and the browser agree.
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
                "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function shortDate(date?: string) {
  if (!date) { return ""; }
  const [year, month, day] = date.slice(0, 10).split("-");
  return `${MONTHS[Number(month) - 1]} ${Number(day)}, ${year}`;
}

export default function Announcements() {
  const params = useParams<{ cid: string }>();
  const cid = params ? params.cid : "";

  const [search, setSearch] = useState("");
  const [show, setShow] = useState(false);
  const [announcement, setAnnouncement] = useState({ title: "", content: "" });

  const { announcements } = useSelector((state: any) => state.announcementsReducer);
  const { currentUser } = useSelector((state: any) => state.accountReducer);
  const dispatch = useDispatch();

  const isFaculty = currentUser?.role === "FACULTY";

  // Keep this course, then keep what matches the search.
  const shown = announcements
    .filter((item: any) => item.course === cid)
    .filter((item: any) =>
      item.title.toLowerCase().includes(search.toLowerCase())
    );

  // Read the announcements of this course.
  const fetchAnnouncements = async () => {
    const found = await coursesClient.findAnnouncementsForCourse(cid);
    dispatch(setAnnouncements(found));
  };

  useEffect(() => {
    if (cid) {
      fetchAnnouncements();
    }
  }, [cid]);

  const post = async () => {
    if (!announcement.title) { return; }
    const created = await coursesClient.createAnnouncementForCourse(cid, {
      ...announcement,
      author: currentUser
        ? `${currentUser.firstName} ${currentUser.lastName}`
        : "Instructor",
      section: "All Sections",
      read: false,
    });
    dispatch(addAnnouncement(created));
    setAnnouncement({ title: "", content: "" });
  };

  const remove = async (announcementId: string) => {
    if (window.confirm("Are you sure you want to remove this announcement?")) {
      await announcementsClient.deleteAnnouncement(announcementId);
      dispatch(deleteAnnouncement(announcementId));
    }
  };

  return (
    <div id="wd-announcements">
      {/* The button floats right, so it comes first. */}
      <div className="clearfix mb-4">
        {isFaculty && (
          <button
            id="wd-add-announcement"
            className="btn btn-lg btn-danger float-end"
            onClick={() => setShow(true)}
          >
            + Announcement
          </button>
        )}
        <div className="input-group" style={{ width: "300px" }}>
          <span className="input-group-text bg-white">
            <BsSearch />
          </span>
          <input
            id="wd-search-announcement"
            className="form-control"
            placeholder="Search Announcements"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <AnnouncementEditor
        show={show}
        handleClose={() => setShow(false)}
        dialogTitle="New Announcement"
        announcement={announcement}
        setAnnouncement={setAnnouncement}
        addAnnouncement={post}
      />

      <ul id="wd-announcement-list" className="list-group rounded-0">
        {shown.map((item: any) => (
          <li
            key={item._id}
            className="wd-announcement-list-item list-group-item p-3 d-flex"
          >
            <FaUserCircle className="me-3 fs-1 text-secondary" />
            <div className="flex-fill">
              <h5 className="mb-1">{item.title}</h5>
              <p className="text-muted mb-2">
                {item.author} · {item.section} · {shortDate(item.date)}
              </p>
              <p className="mb-0">{item.content}</p>
            </div>
            <div className="ms-3 d-flex align-items-start">
              {isFaculty && (
                <FaTrash
                  role="button"
                  aria-label="Delete announcement"
                  className="text-danger me-3 mt-1"
                  onClick={() => remove(item._id)}
                />
              )}
              <BsThreeDots className="fs-4" />
            </div>
          </li>
        ))}
      </ul>

      {/* Canvas shows a message when nothing matches. */}
      {shown.length === 0 && (
        <p className="text-muted mt-3">No announcements to show.</p>
      )}
    </div>
  );
}
