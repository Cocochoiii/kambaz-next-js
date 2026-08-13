// The Modules screen. I use lists inside lists:
// one list for the modules, one for the lessons, one for the content.
// The Home screen imports this file again, so I do not repeat the code.
export default function Modules() {
  return (
    <div>
      <div id="wd-modules-toolbar">
        <button id="wd-modules-collapse-all">Collapse All</button>
        <button id="wd-modules-view-progress">View Progress</button>
        <select id="wd-modules-publish-all" defaultValue="publishAll">
          <option value="publishAll">Publish All</option>
          <option value="unpublishAll">Unpublish All</option>
        </select>
        <button id="wd-modules-new-module">+ Module</button>
      </div>
      <ul id="wd-modules">
        <li className="wd-module">
          <div className="wd-title">Week 1 - HTML/CSS/JS</div>
          <ul className="wd-lessons">
            <li className="wd-lesson">
              <span className="wd-title">LEARNING OBJECTIVES</span>
              <ul className="wd-content">
                <li className="wd-content-item">Introduction to the course</li>
                <li className="wd-content-item">Learn what is Web Development</li>
                <li className="wd-content-item">HTML lists, tables, and forms</li>
              </ul>
            </li>
            <li className="wd-lesson">
              <span className="wd-title">READING</span>
              <ul className="wd-content">
                <li className="wd-content-item">Full Stack Developer - Chapter 1 - Introduction</li>
                <li className="wd-content-item">Full Stack Developer - Chapter 2 - Creating User Interfaces With HTML</li>
              </ul>
            </li>
            <li className="wd-lesson">
              <span className="wd-title">SLIDES</span>
              <ul className="wd-content">
                <li className="wd-content-item">Introduction to Web Development</li>
                <li className="wd-content-item">Creating an HTTP server with Node.js</li>
              </ul>
            </li>
          </ul>
        </li>
        <li className="wd-module">
          <div className="wd-title">Week 2 - CSS and Bootstrap</div>
          <ul className="wd-lessons">
            <li className="wd-lesson">
              <span className="wd-title">LEARNING OBJECTIVES</span>
              <ul className="wd-content">
                <li className="wd-content-item">Learn how to style pages with CSS</li>
                <li className="wd-content-item">Learn the CSS box model</li>
              </ul>
            </li>
            <li className="wd-lesson">
              <span className="wd-title">READING</span>
              <ul className="wd-content">
                <li className="wd-content-item">Full Stack Developer - Chapter 3 - Styling With CSS</li>
                <li className="wd-content-item">Full Stack Developer - Chapter 4 - Bootstrap</li>
              </ul>
            </li>
          </ul>
        </li>
        <li className="wd-module">
          <div className="wd-title">Week 3 - React Components</div>
          <ul className="wd-lessons">
            <li className="wd-lesson">
              <span className="wd-title">LEARNING OBJECTIVES</span>
              <ul className="wd-content">
                <li className="wd-content-item">Learn JavaScript basics</li>
                <li className="wd-content-item">Build reusable React components</li>
              </ul>
            </li>
            <li className="wd-lesson">
              <span className="wd-title">SLIDES</span>
              <ul className="wd-content">
                <li className="wd-content-item">Introduction to JavaScript</li>
                <li className="wd-content-item">Introduction to React</li>
              </ul>
            </li>
          </ul>
        </li>
        <li className="wd-module">
          <div className="wd-title">Week 4 - Node.js and Express</div>
          <ul className="wd-lessons">
            <li className="wd-lesson">
              <span className="wd-title">LEARNING OBJECTIVES</span>
              <ul className="wd-content">
                <li className="wd-content-item">Create an HTTP server with Node.js</li>
                <li className="wd-content-item">Implement RESTful Web APIs</li>
              </ul>
            </li>
            <li className="wd-lesson">
              <span className="wd-title">READING</span>
              <ul className="wd-content">
                <li className="wd-content-item">Full Stack Developer - Chapter 5 - Node.js</li>
                <li className="wd-content-item">Full Stack Developer - Chapter 6 - Express</li>
              </ul>
            </li>
          </ul>
        </li>
        <li className="wd-module">
          <div className="wd-title">Week 5 - MongoDB</div>
          <ul className="wd-lessons">
            <li className="wd-lesson">
              <span className="wd-title">LEARNING OBJECTIVES</span>
              <ul className="wd-content">
                <li className="wd-content-item">Model data with MongoDB</li>
                <li className="wd-content-item">Connect a Web API to a database</li>
              </ul>
            </li>
            <li className="wd-lesson">
              <span className="wd-title">SLIDES</span>
              <ul className="wd-content">
                <li className="wd-content-item">Introduction to MongoDB</li>
                <li className="wd-content-item">Introduction to Mongoose</li>
              </ul>
            </li>
          </ul>
        </li>
      </ul>
    </div>
  );
}
