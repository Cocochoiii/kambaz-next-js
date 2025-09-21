export default function AssignmentEditor() {
  return (
    <div id="wd-assignments-editor">
      <label htmlFor="wd-name">Assignment Name</label>
      <input id="wd-name" defaultValue="A1 - ENV + HTML" /><br /><br />
      <textarea id="wd-description">The assignment is available online. Submit a link to the landing page.</textarea><br />
      <table><tbody>
        <tr><td align="right" valign="top"><label htmlFor="wd-points">Points</label></td><td><input id="wd-points" type="number" defaultValue={100} /></td></tr>
        <tr><td align="right"><label htmlFor="wd-group">Assignment Group</label></td>
          <td><select id="wd-group" defaultValue="ASSIGNMENTS">
            <option>ASSIGNMENTS</option><option>QUIZZES</option><option>EXAMS</option><option>PROJECT</option>
          </select></td></tr>
        <tr><td align="right"><label htmlFor="wd-display-grade-as">Display Grade as</label></td>
          <td><select id="wd-display-grade-as" defaultValue="Percentage">
            <option>Percentage</option><option>Points</option><option>Letter Grade</option>
          </select></td></tr>
        <tr><td align="right"><label htmlFor="wd-submission-type">Submission Type</label></td>
          <td><select id="wd-submission-type" defaultValue="Online">
            <option>Online</option><option>On Paper</option><option>No Submission</option>
          </select>
          <div>
            <label htmlFor="wd-text-entry"><input id="wd-text-entry" type="checkbox" /> Text Entry</label><br/>
            <label htmlFor="wd-website-url"><input id="wd-website-url" type="checkbox" /> Website URL</label><br/>
            <label htmlFor="wd-media-recordings"><input id="wd-media-recordings" type="checkbox" /> Media Recordings</label><br/>
            <label htmlFor="wd-student-annotation"><input id="wd-student-annotation" type="checkbox" /> Student Annotation</label><br/>
            <label htmlFor="wd-file-upload"><input id="wd-file-upload" type="checkbox" /> File Uploads</label>
          </div></td></tr>
        <tr><td align="right" valign="top"><label htmlFor="wd-assign-to">Assign to</label></td><td><input id="wd-assign-to" defaultValue="Everyone" /></td></tr>
        <tr><td align="right"><label htmlFor="wd-due-date">Due</label></td><td><input id="wd-due-date" type="date" defaultValue="2025-09-22" /></td></tr>
        <tr><td align="right"><label htmlFor="wd-available-from">Available from</label></td><td><input id="wd-available-from" type="date" defaultValue="2025-09-01" /></td></tr>
        <tr><td align="right"><label htmlFor="wd-available-until">Until</label></td><td><input id="wd-available-until" type="date" defaultValue="2025-12-31" /></td></tr>
      </tbody></table>
    </div>
  );
}
