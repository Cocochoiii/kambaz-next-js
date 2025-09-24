'use client';

import { AiOutlineDashboard } from "react-icons/ai";
import { IoCalendarOutline } from "react-icons/io5";
import { LiaBookSolid, LiaCogSolid } from "react-icons/lia";
import { FaInbox, FaRegCircleUser } from "react-icons/fa6";
import Link from "next/link";

export default function KambazNavigation() {
    return (
        <ul
            id="wd-kambaz-navigation"
            className="wd-slim-nav list-group rounded-0 position-fixed bottom-0 top-0 d-none d-md-block bg-black z-2 text-center"
        >
            <li className="list-group-item bg-black border-0 text-center py-3" id="wd-neu-link">
                <a href="https://www.northeastern.edu/" target="_blank" rel="noreferrer">
                    <img src="/images/NEU.png" width={60} alt="Northeastern University" />
                </a>
            </li>

            <li className="list-group-item border-0 bg-black text-center py-3">
                <Link href="/Account" id="wd-account-link" className="text-white text-decoration-none d-block">
                    <FaRegCircleUser className="fs-3" />
                    <div className="nav-label">Account</div>
                </Link>
            </li>

            <li className="list-group-item border-0 bg-white text-center py-3">
                <Link href="/Dashboard" id="wd-dashboard-link" className="text-danger text-decoration-none d-block">
                    <AiOutlineDashboard className="fs-3 text-danger" />
                    <div className="nav-label text-danger">Dashboard</div>
                </Link>
            </li>

            <li className="list-group-item border-0 bg-black text-center py-3">
                <Link href="/Calendar" className="text-white text-decoration-none d-block">
                    <IoCalendarOutline className="fs-3 text-danger" />
                    <div className="nav-label">Calendar</div>
                </Link>
            </li>

            <li className="list-group-item border-0 bg-black text-center py-3">
                <Link href="/Inbox" className="text-white text-decoration-none d-block">
                    <FaInbox className="fs-3 text-danger" />
                    <div className="nav-label">Inbox</div>
                </Link>
            </li>

            <li className="list-group-item border-0 bg-black text-center py-3">
                <Link href="/Labs" className="text-white text-decoration-none d-block" id="wd-labs-link">
                    <LiaBookSolid className="fs-3 text-danger" />
                    <div className="nav-label">Labs</div>
                </Link>
            </li>

            <li className="list-group-item border-0 bg-black text-center py-3">
                <Link href="/Settings" className="text-white text-decoration-none d-block">
                    <LiaCogSolid className="fs-3 text-danger" />
                    <div className="nav-label">Settings</div>
                </Link>
            </li>
        </ul>
    );
}
