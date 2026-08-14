"use client";

// The Announcements screen. The book does not ask for it. Canvas has it.
// Faculty can post one and remove one. The search box filters the list.
import { useState } from "react";
import { useParams } from "next/navigation";
import { FaUserCircle } from "react-icons/fa";
import { FaTrash } from "react-icons/fa6";
import { BsThreeDots, BsSearch } from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";
import AnnouncementEditor from "./AnnouncementEditor";
import { addAnnouncement, deleteAnnouncement } from "./reducer";

// I only need the day part of the date. I build the text myself, so the
// server and the browser print the same thing.
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

  // Keep this course, then keep what matches the search box.
  const shown = announcements
    .filter((item: any) => item.course === cid)
    .filter((item: any) =>
      item.title.toLowerCase().includes(search.toLowerCase())
    );

  const post = () => {
    if (!announcement.title) { return; }
    dispatch(addAnnouncement({
      ...announcement,
      course: cid,
      author: currentUser
        ? `${currentUser.firstName} ${currentUser.lastName}`
        : "Instructor",
    }));
    setAnnouncement({ title: "", content: "" });
  };

  const remove = (announcementId: string) => {
    if (window.confirm("Are you sure you want to remove this announcement?")) {
      dispatch(deleteAnnouncement(announcementId));
    }
  };

  return (
    <div id="wd-announcements">
      {/* The button floats right, so I write it first. */}
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

      {/* Canvas shows a short message when nothing matches. */}
      {shown.length === 0 && (
        <p className="text-muted mt-3">No announcements to show.</p>
      )}
    </div>
  );
}
