// Six React Icons. I use icons like these in Kambaz.
import { FaCalendar, FaEnvelopeOpenText, FaRegClock } from "react-icons/fa";
import { AiOutlineDashboard } from "react-icons/ai";
import { LiaBookSolid } from "react-icons/lia";
import { FaRegCircleUser } from "react-icons/fa6";

export default function ReactIcons() {
  return (
    <div id="wd-react-icons-sampler">
      <h2>React Icons</h2>
      <FaRegCircleUser className="fs-1 me-3" />
      <AiOutlineDashboard className="fs-1 me-3" />
      <LiaBookSolid className="fs-1 me-3" />
      <FaCalendar className="fs-1 me-3" />
      <FaEnvelopeOpenText className="fs-1 me-3" />
      <FaRegClock className="fs-1 me-3" />
    </div>
  );
}
