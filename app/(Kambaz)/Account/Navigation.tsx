import Link from "next/link";
export default function AccountNavigation(){
    return (
        <div id="wd-account-navigation">
            <Link href="/Account/Signin"> Signin </Link><br/>
            <Link href="/Account/Signup"> Signup </Link><br/>
            <Link href="/Account/Profile"> Profile </Link><br/>
        </div>
    );
}
