// The Assignments screen, now styled with Bootstrap and React Icons.
// The search field is on the left. The two buttons float to the right.
// Every line item has a green bar on the left.
import Link from "next/link";
import { BsGripVertical, BsPlus, BsThreeDotsVertical, BsSearch } from "react-icons/bs";
import { FaPlus } from "react-icons/fa6";
import { LiaFileAltSolid } from "react-icons/lia";
import GreenCheckmark from "../Modules/GreenCheckmark";

export default async function Assignments({
  params,
}: {
  params: Promise<{ cid: string }>;
}) {
  const { cid } = await params;
  return (
    <div id="wd-assignments">
      {/* The buttons float to the right, so I write the right one first. */}
      <div className="clearfix mb-4">
        <button id="wd-add-assignment" className="btn btn-lg btn-danger float-end">
          <FaPlus className="position-relative me-2" style={{ bottom: "1px" }} />
          Assignment
        </button>
        <button id="wd-add-assignment-group" className="btn btn-lg btn-secondary me-2 float-end">
          <FaPlus className="position-relative me-2" style={{ bottom: "1px" }} />
          Group
        </button>
        <div className="input-group" style={{ width: "300px" }}>
          <span className="input-group-text bg-white">
            <BsSearch />
          </span>
          <input
            id="wd-search-assignment"
            className="form-control"
            placeholder="Search for Assignments"
          />
        </div>
      </div>

      {/* The ASSIGNMENTS group title */}
      <div className="p-3 bg-secondary border border-secondary clearfix">
        <BsGripVertical className="me-2 fs-3" />
        <span id="wd-assignments-title" className="fw-bold">ASSIGNMENTS</span>
        <div className="float-end">
          <span className="border border-dark rounded-pill px-2 py-1 me-2">40% of Total</span>
          <BsPlus className="fs-4" />
          <BsThreeDotsVertical className="fs-4" />
        </div>
      </div>

      <ul id="wd-assignment-list" className="list-group rounded-0">
        <li className="wd-assignment-list-item list-group-item p-3 ps-1 d-flex align-items-center">
          <BsGripVertical className="me-2 fs-3" />
          <LiaFileAltSolid className="me-3 fs-3 text-success" />
          <div className="flex-fill">
            <Link href={`/Courses/${cid}/Assignments/101`} className="wd-assignment-link fw-bold text-dark text-decoration-none">
              A1 - ENV + HTML
            </Link>
            <p className="mb-0">
              <span className="text-danger">Multiple Modules</span>
              {" | "}<b>Not available until</b> May 6 at 12:00am
              {" | "}<b>Due</b> May 13 at 11:59pm
              {" | "}100 pts
            </p>
          </div>
          <div className="ms-3">
            <GreenCheckmark />
            <BsThreeDotsVertical className="fs-4" />
          </div>
        </li>
        <li className="wd-assignment-list-item list-group-item p-3 ps-1 d-flex align-items-center">
          <BsGripVertical className="me-2 fs-3" />
          <LiaFileAltSolid className="me-3 fs-3 text-success" />
          <div className="flex-fill">
            <Link href={`/Courses/${cid}/Assignments/102`} className="wd-assignment-link fw-bold text-dark text-decoration-none">
              A2 - CSS + BOOTSTRAP
            </Link>
            <p className="mb-0">
              <span className="text-danger">Multiple Modules</span>
              {" | "}<b>Not available until</b> May 13 at 12:00am
              {" | "}<b>Due</b> May 20 at 11:59pm
              {" | "}100 pts
            </p>
          </div>
          <div className="ms-3">
            <GreenCheckmark />
            <BsThreeDotsVertical className="fs-4" />
          </div>
        </li>
        <li className="wd-assignment-list-item list-group-item p-3 ps-1 d-flex align-items-center">
          <BsGripVertical className="me-2 fs-3" />
          <LiaFileAltSolid className="me-3 fs-3 text-success" />
          <div className="flex-fill">
            <Link href={`/Courses/${cid}/Assignments/103`} className="wd-assignment-link fw-bold text-dark text-decoration-none">
              A3 - JAVASCRIPT + REACT
            </Link>
            <p className="mb-0">
              <span className="text-danger">Multiple Modules</span>
              {" | "}<b>Not available until</b> May 20 at 12:00am
              {" | "}<b>Due</b> May 27 at 11:59pm
              {" | "}100 pts
            </p>
          </div>
          <div className="ms-3">
            <GreenCheckmark />
            <BsThreeDotsVertical className="fs-4" />
          </div>
        </li>
        <li className="wd-assignment-list-item list-group-item p-3 ps-1 d-flex align-items-center">
          <BsGripVertical className="me-2 fs-3" />
          <LiaFileAltSolid className="me-3 fs-3 text-success" />
          <div className="flex-fill">
            <Link href={`/Courses/${cid}/Assignments/104`} className="wd-assignment-link fw-bold text-dark text-decoration-none">
              A4 - STATE + REDUX
            </Link>
            <p className="mb-0">
              <span className="text-danger">Multiple Modules</span>
              {" | "}<b>Not available until</b> May 27 at 12:00am
              {" | "}<b>Due</b> Jun 3 at 11:59pm
              {" | "}100 pts
            </p>
          </div>
          <div className="ms-3">
            <GreenCheckmark />
            <BsThreeDotsVertical className="fs-4" />
          </div>
        </li>
        <li className="wd-assignment-list-item list-group-item p-3 ps-1 d-flex align-items-center">
          <BsGripVertical className="me-2 fs-3" />
          <LiaFileAltSolid className="me-3 fs-3 text-success" />
          <div className="flex-fill">
            <Link href={`/Courses/${cid}/Assignments/105`} className="wd-assignment-link fw-bold text-dark text-decoration-none">
              A5 - NODE + EXPRESS
            </Link>
            <p className="mb-0">
              <span className="text-danger">Multiple Modules</span>
              {" | "}<b>Not available until</b> Jun 3 at 12:00am
              {" | "}<b>Due</b> Jun 10 at 11:59pm
              {" | "}100 pts
            </p>
          </div>
          <div className="ms-3">
            <GreenCheckmark />
            <BsThreeDotsVertical className="fs-4" />
          </div>
        </li>
        <li className="wd-assignment-list-item list-group-item p-3 ps-1 d-flex align-items-center">
          <BsGripVertical className="me-2 fs-3" />
          <LiaFileAltSolid className="me-3 fs-3 text-success" />
          <div className="flex-fill">
            <Link href={`/Courses/${cid}/Assignments/106`} className="wd-assignment-link fw-bold text-dark text-decoration-none">
              A6 - MONGO + DEPLOY
            </Link>
            <p className="mb-0">
              <span className="text-danger">Multiple Modules</span>
              {" | "}<b>Not available until</b> Jun 10 at 12:00am
              {" | "}<b>Due</b> Jun 17 at 11:59pm
              {" | "}100 pts
            </p>
          </div>
          <div className="ms-3">
            <GreenCheckmark />
            <BsThreeDotsVertical className="fs-4" />
          </div>
        </li>
      </ul>
    </div>
  );
}
