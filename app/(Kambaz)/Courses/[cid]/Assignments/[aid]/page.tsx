import { getAssignment } from "../catalog";

export default async function AssignmentEditor({
                                                 params,
                                               }: {
  params: Promise<{ cid: string; aid: string }>;
}) {
  const { cid, aid } = await params;
  const seed = getAssignment(cid, aid);

  return (
      <div id="wd-assignments-editor">
        <label htmlFor="wd-name">Assignment Name</label>
        <input id="wd-name" defaultValue={seed.title} />
        <br /><br />
        {/* FIX: textarea must use defaultValue/value, not children */}
        <textarea id="wd-description" defaultValue={seed.description} />
        <br />

        <table>
          <tbody>
          <tr>
            <td align="right" valign="top">
              <label htmlFor="wd-points">Points</label>
            </td>
            <td>
              <input id="wd-points" type="number" defaultValue={seed.points} />
            </td>
          </tr>
          <tr>
            <td align="right">
              <label htmlFor="wd-group">Assignment Group</label>
            </td>
            <td>
              <select id="wd-group">
                <option>ASSIGNMENTS</option>
                <option>QUIZZES</option>
                <option>EXAMS</option>
                <option>PROJECT</option>
              </select>
            </td>
          </tr>
          <tr>
            <td align="right">
              <label htmlFor="wd-display-grade-as">Display Grade as</label>
            </td>
            <td>
              <select id="wd-display-grade-as">
                <option>Percentage</option>
                <option>Points</option>
              </select>
            </td>
          </tr>
          <tr>
            <td align="right">
              <label htmlFor="wd-submission-type">Submission Type</label>
            </td>
            <td>
              <select id="wd-submission-type">
                <option>Online</option>
                <option>On Paper</option>
              </select>
              <div>
                <label>
                  <input id="wd-text-entry" type="checkbox" defaultChecked /> Text
                  Entry
                </label>
                <br />
                <label>
                  <input id="wd-website-url" type="checkbox" defaultChecked /> Website
                  URL
                </label>
                <br />
                <label>
                  <input id="wd-media-recordings" type="checkbox" /> Media Recordings
                </label>
                <br />
                <label>
                  <input id="wd-student-annotation" type="checkbox" /> Student
                  Annotation
                </label>
                <br />
                <label>
                  <input id="wd-file-upload" type="checkbox" /> File Uploads
                </label>
              </div>
            </td>
          </tr>
          <tr>
            <td align="right">
              <label htmlFor="wd-assign-to">Assign to</label>
            </td>
            <td>
              <input id="wd-assign-to" defaultValue="Everyone" />
            </td>
          </tr>
          <tr>
            <td align="right">
              <label htmlFor="wd-due-date">Due</label>
            </td>
            <td>
              <input id="wd-due-date" type="date" defaultValue="2025-09-22" />
            </td>
          </tr>
          <tr>
            <td align="right">
              <label htmlFor="wd-available-from">Available from</label>
            </td>
            <td>
              <input id="wd-available-from" type="date" defaultValue="2025-09-01" />
            </td>
          </tr>
          <tr>
            <td align="right">
              <label htmlFor="wd-available-until">Available until</label>
            </td>
            <td>
              <input id="wd-available-until" type="date" defaultValue="2025-12-31" />
            </td>
          </tr>
          </tbody>
        </table>
      </div>
  );
}
