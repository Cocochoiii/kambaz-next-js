// The Announcements screen. It is not in the textbook, I added it because
// Canvas has it. It reads the announcements of this course from the Database.
import { FaUserCircle } from "react-icons/fa";
import { BsThreeDots } from "react-icons/bs";
import * as db from "../../../Database";

export default async function Announcements({
  params,
}: {
  params: Promise<{ cid: string }>;
}) {
  const { cid } = await params;
  const announcements = db.announcements.filter((item) => item.course === cid);

  return (
    <div id="wd-announcements">
      {/* The button floats to the right, so I write it first. */}
      <div className="clearfix mb-4">
        <button id="wd-add-announcement" className="btn btn-lg btn-danger float-end">
          + Announcement
        </button>
        <div className="input-group" style={{ width: "300px" }}>
          <input
            id="wd-search-announcement"
            className="form-control"
            placeholder="Search Announcements"
          />
        </div>
      </div>

      <ul id="wd-announcement-list" className="list-group rounded-0">
        {announcements.map((announcement) => (
          <li
            key={announcement._id}
            className="wd-announcement-list-item list-group-item p-3 d-flex"
          >
            <FaUserCircle className="me-3 fs-1 text-secondary" />
            <div className="flex-fill">
              <h5 className="mb-1">{announcement.title}</h5>
              <p className="text-muted mb-2">
                {announcement.author} · {announcement.section}
              </p>
              <p className="mb-0">{announcement.content}</p>
            </div>
            <div className="ms-3">
              <BsThreeDots className="fs-4" />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
