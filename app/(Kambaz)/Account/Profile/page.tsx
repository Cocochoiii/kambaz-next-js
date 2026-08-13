// The Profile screen. It shows my information.
// Each input uses a different type: text, password, date, and email.
// "Sign out" goes back to the Sign in screen.
import Link from "next/link";

export default function Profile() {
  return (
    <div id="wd-profile-screen">
      <h3>Profile</h3>
      <input type="text" defaultValue="coco" placeholder="username" className="wd-username" /><br />
      <input type="password" defaultValue="123" placeholder="password" className="wd-password" /><br />
      <input type="text" defaultValue="Coco" placeholder="First Name" id="wd-firstname" /><br />
      <input type="text" defaultValue="Choi" placeholder="Last Name" id="wd-lastname" /><br />
      <input type="date" defaultValue="2000-03-28" id="wd-dob" /><br />
      <input type="email" defaultValue="coco@example.com" id="wd-email" /><br />
      <select defaultValue="STUDENT" id="wd-role">
        <option value="USER">User</option>
        <option value="ADMIN">Admin</option>
        <option value="FACULTY">Faculty</option>
        <option value="STUDENT">Student</option>
      </select><br />
      <Link href="/Account/Signin"> Sign out </Link>
    </div>
  );
}
