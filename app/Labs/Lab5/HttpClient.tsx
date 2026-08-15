"use client";

// axios asks the server and the answer stays on this page.
// One block asks on a click. The other asks on load.
import { useEffect, useState } from "react";
import * as client from "./client";

export default function HttpClient() {
  const [welcomeOnClick, setWelcomeOnClick] = useState("");
  const [welcomeOnLoad, setWelcomeOnLoad] = useState("");

  const fetchWelcomeOnClick = async () => {
    const welcome = await client.fetchWelcomeMessage();
    setWelcomeOnClick(welcome);
  };

  const fetchWelcomeOnLoad = async () => {
    const welcome = await client.fetchWelcomeMessage();
    setWelcomeOnLoad(welcome);
  };

  // The empty array means: only run once.
  useEffect(() => {
    fetchWelcomeOnLoad();
  }, []);

  return (
    <div id="wd-http-client">
      <h3>HTTP Client</h3>

      <h4>Requesting on Click</h4>
      <button
        id="wd-fetch-welcome-btn"
        className="btn btn-primary me-2"
        onClick={fetchWelcomeOnClick}
      >
        Fetch Welcome
      </button>
      <br />
      Response from server:{" "}
      <b id="wd-welcome-on-click">{welcomeOnClick}</b>
      <hr />

      <h4>Requesting on Load</h4>
      Response from server: <b id="wd-welcome-on-load">{welcomeOnLoad}</b>
      <hr />
    </div>
  );
}
