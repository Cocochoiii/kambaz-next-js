// The Course Status box on the right side of the Home screen.
// The buttons do nothing yet. They only show the layout.
export default function CourseStatus() {
  return (
    <div id="wd-course-status">
      <h2>Course Status</h2>
      <button>Unpublish</button> <button>Publish</button>
      <p>
        <button>Import Existing Content</button><br />
        <button>Import from Commons</button><br />
        <button>Choose Home Page</button><br />
        <button>View Course Stream</button><br />
        <button>New Announcement</button><br />
        <button>New Analytics</button><br />
        <button>View Course Notifications</button>
      </p>
    </div>
  );
}
