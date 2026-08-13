// The Home screen. The Modules are on the left and the Course Status is on
// the right. The Modules screen already reads the modules of the current
// course from the Database, so I just import it again here.
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
