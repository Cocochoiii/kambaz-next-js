"use client";
import { HTTP_SERVER } from "@/app/env";
const USERS_API = `${HTTP_SERVER}/api/users`;

export default function WorkingWithObjects() {
    return (
        <div id="wd-working-with-objects">
            <h3>Working With Objects</h3>
            <h4>Retrieving Objects</h4>
            <a id="wd-retrieve-assignments" className="btn btn-primary"
               href={`${HTTP_SERVER}/lab5/assignment`}>
                Get Assignment
            </a>
            <hr />
            <h4>Retrieving Properties</h4>
            <a id="wd-retrieve-assignment-title" className="btn btn-primary"
               href={`${HTTP_SERVER}/lab5/assignment/title`}>
                Get Title
            </a>
            <hr />
            <h4>Module</h4>
            <a className="btn btn-outline-primary me-2" href={`${HTTP_SERVER}/lab5/module`}>Get Module</a>
            <a className="btn btn-outline-secondary" href={`${HTTP_SERVER}/lab5/module/name`}>Get Module Name</a>
            <hr />
        </div>
    );
}
