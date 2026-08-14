// The Home screen. Modules on the left, Course Status on the right.
// The Course Status hides first when the window gets narrow.
import Modules from "../Modules/page";
import CourseStatus from "./Status";

export default function Home() {
  return (
    <div className="d-flex" id="wd-home">
      <div className="flex-fill me-3">
        <Modules />
      </div>
      <div className="d-none d-xl-block">
        <CourseStatus />
      </div>
    </div>
  );
}
