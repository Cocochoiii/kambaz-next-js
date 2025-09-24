'use client';
import { AiOutlineDashboard } from "react-icons/ai";
import { IoCalendarOutline } from "react-icons/io5";
import { LiaBookSolid, LiaCogSolid } from "react-icons/lia";
import { FaInbox, FaRegCircleUser } from "react-icons/fa6";
import Link from "next/link";

export default function KambazNavigation(){
    return (
        <ul
            id="wd-kambaz-navigation"
            className="list-group rounded-0 position-fixed bottom-0 top-0 d-none d-md-block bg-black z-2 text-center"
            style={{ width: 120 }}
        >
            <li className="list-group-item bg-black border-0 text-center" id="wd-neu-link">
                <a href="https://www.northeastern.edu/" target="_blank" rel="noreferrer">
                    <img src="/images/NEU.png" width={75} alt="Northeastern University" />
                </a>
            </li><br/>

            <li className="list-group-item border-0 bg-black text-center">
                <Link href="/Account" id="wd-account-link" className="text-white text-decoration-none">
                    <FaRegCircleUser className="fs-1 text-white" /><br/>Account
                </Link>
            </li><br/>

            <li className="list-group-item border-0 bg-white text-center">
                <Link href="/Dashboard" id="wd-dashboard-link" className="text-danger text-decoration-none">
                    <AiOutlineDashboard className="fs-1 text-danger" /><br/>Dashboard
                </Link>
            </li><br/>

            {/* ✅ turn these into real links */}
            <li className="list-group-item border-0 bg-black text-center">
                <Link href="/Calendar" className="text-white text-decoration-none">
                    <IoCalendarOutline className="fs-1 text-danger" /><br/>Calendar
                </Link>
            </li><br/>

            <li className="list-group-item border-0 bg-black text-center">
                <Link href="/Inbox" className="text-white text-decoration-none">
                    <FaInbox className="fs-1 text-danger" /><br/>Inbox
                </Link>
            </li><br/>

            <li className="list-group-item border-0 bg-black text-center">
                <Link href="/Labs" className="text-white text-decoration-none" id="wd-labs-link">
                    <LiaBookSolid className="fs-1 text-danger" /><br/>Labs
                </Link>
            </li><br/>

            <li className="list-group-item border-0 bg-black text-center">
                <Link href="/Settings" className="text-white text-decoration-none">
                    <LiaCogSolid className="fs-1 text-danger" /><br/>Settings
                </Link>
            </li>
        </ul>
    );
}
