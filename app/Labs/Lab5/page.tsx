import EnvironmentVariables from "./EnvironmentVariables";
import PathParameters from "./PathParameters";
import QueryParameters from "./QueryParameters";
import WorkingWithObjects from "./WorkingWithObjects";
import HttpClient from "./HttpClient";
import WorkingWithObjectsAsynchronously from "./WorkingWithObjectsAsynchronously";
import WorkingWithArraysAsynchronously from "./WorkingWithArraysAsynchronously";

import { HTTP_SERVER } from "@/app/env";
const USERS_API = `${HTTP_SERVER}/api/users`;

export default function Lab5() {
    return (
        <div id="wd-lab5">
            <h2>Lab 5</h2>
            <div className="list-group">
                <a href={`${HTTP_SERVER}/lab5/welcome`} className="list-group-item">Welcome</a>
            </div>
            <hr/>
            <EnvironmentVariables />
            <PathParameters />
            <QueryParameters />
            <WorkingWithObjects />
            <HttpClient />
            <WorkingWithObjectsAsynchronously />
            <WorkingWithArraysAsynchronously />
        </div>
    );
}
