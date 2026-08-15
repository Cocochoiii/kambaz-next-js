"use client";

// The footer of the landing page.
// The project asks for two links and my name with my section.
// The Sign in screen is my landing page, so the footer sits there.

const CLIENT_REPO = "https://github.com/Cocochoiii/kambaz-next-js";
const SERVER_REPO = "https://github.com/Cocochoiii/kambaz-node-server-app";

export default function ProjectFooter() {
  return (
    <div id="wd-project-footer" className="border-top mt-5 pt-3 text-muted">
      <p className="mb-1">
        <b>Kambaz Quizzes</b> - CS5610 Web Development, Section 04
      </p>
      <p className="mb-1">Coco Choi</p>
      <p className="mb-0">
        <a id="wd-client-repo-link" href={CLIENT_REPO} target="_blank" rel="noreferrer">
          Front end repository
        </a>
        {" | "}
        <a id="wd-server-repo-link" href={SERVER_REPO} target="_blank" rel="noreferrer">
          Server repository
        </a>
      </p>
    </div>
  );
}
