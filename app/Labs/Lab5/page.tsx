// Lab 5. The exercises of Chapter 5, in the order of the book.
import Link from "next/link";
import EnvironmentVariables from "./EnvironmentVariables";
import PathParameters from "./PathParameters";
import QueryParameters from "./QueryParameters";
import WorkingWithObjects from "./WorkingWithObjects";
import WorkingWithArrays from "./WorkingWithArrays";
import HttpClient from "./HttpClient";
import WorkingWithObjectsAsynchronously from "./WorkingWithObjectsAsynchronously";
import WorkingWithArraysAsynchronously from "./WorkingWithArraysAsynchronously";
import { HTTP_SERVER } from "@/app/env";

export default function Lab5() {
  return (
    <div id="wd-lab5" className="container">
      <h2>Lab 5 - Node.js Server and HTTP</h2>

      {/* The first route of the server */}
      <div className="list-group w-50">
        <a href={`${HTTP_SERVER}/lab5/welcome`} className="list-group-item">
          Welcome
        </a>
      </div>
      <hr />

      <EnvironmentVariables />

      <PathParameters />
      <QueryParameters />

      {/* Objects and arrays, with plain links */}
      <WorkingWithObjects />
      <WorkingWithArrays />

      {/* The same work with axios */}
      <HttpClient />
      <WorkingWithObjectsAsynchronously />
      <WorkingWithArraysAsynchronously />

      <div className="my-3">
        <Link href="/Labs">Back to Labs</Link>
      </div>
    </div>
  );
}
