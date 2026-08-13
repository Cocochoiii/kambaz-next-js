// The small menu for the Account screens.
// I style it like the Course menu, so I use the same Bootstrap classes.
import Link from "next/link";

export default function AccountNavigation() {
  return (
    <div id="wd-account-navigation" className="wd list-group fs-5 rounded-0" style={{ width: 150 }}>
      <Link href="/Account/Signin" id="wd-account-signin-link" className="list-group-item active border-0">
        Signin
      </Link>
      <Link href="/Account/Signup" id="wd-account-signup-link" className="list-group-item text-danger border-0">
        Signup
      </Link>
      <Link href="/Account/Profile" id="wd-account-profile-link" className="list-group-item text-danger border-0">
        Profile
      </Link>
    </div>
  );
}
