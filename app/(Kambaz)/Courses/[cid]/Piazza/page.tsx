"use client";

// The Questions and Answers Screen. This is the home of Pazza.
// The bars at the top stay put. Only the two columns scroll.
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useSelector } from "react-redux";
import { Button, Form, InputGroup } from "react-bootstrap";
import { FaCaretLeft, FaCaretRight, FaPlus, FaRegQuestionCircle } from "react-icons/fa";
import { BsSearch } from "react-icons/bs";
import PazzaNav from "./PazzaNav";
import NewPostScreen from "./NewPostScreen";
import PostView from "./PostView";
import ClassAtGlance from "./ClassAtGlance";
import { groupPosts, isInstructorRole, isPazzaInstructor, preview, timeLabel } from "./helpers";
import * as client from "./client";

const ALL_FOLDERS = "__all__";

export default function Piazza() {
  const params = useParams<{ cid: string }>();
  const cid = params ? params.cid : "";

  const { currentUser, viewAsStudent } = useSelector((state: any) => state.accountReducer);
  const { courses } = useSelector((state: any) => state.coursesReducer);
  const isInstructor = isPazzaInstructor(currentUser, viewAsStudent);

  const course = courses.find((one: any) => one._id === cid);
  const courseName = course ? course.name : `Course ${cid}`;

  const [folders, setFolders] = useState<any[]>([]);
  const [posts, setPosts] = useState<any[]>([]);
  const [comments, setComments] = useState<any[]>([]);
  const [people, setPeople] = useState<any[]>([]);

  const [folderFilter, setFolderFilter] = useState(ALL_FOLDERS);
  const [search, setSearch] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [onlyUnanswered, setOnlyUnanswered] = useState(false);

  // The right column shows one of three things.
  const [mode, setMode] = useState<"glance" | "new" | "view">("glance");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const load = async () => {
    const [folderList, postList, commentList, peopleList] = await Promise.all([
      client.findFoldersForCourse(cid).catch(() => []),
      client.findPostsForCourse(cid).catch(() => []),
      client.findCommentsForCourse(cid).catch(() => []),
      client.findUsersForCourse(cid).catch(() => []),
    ]);
    setFolders(folderList);
    setPosts(postList);
    setComments(commentList);
    setPeople(peopleList);
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cid]);

  // A private post reaches its readers only.
  // An instructor reads everything, and so does the author.
  const canSee = (post: any) => {
    if (isInstructor) { return true; }
    if (post.postTo !== "individual") { return true; }
    if (post.author === currentUser?._id) { return true; }
    return (post.recipients || []).includes(currentUser?._id);
  };

  // A question with at least one answer counts as answered.
  const answered = new Set(
    comments.filter((one) => one.kind === "answer").map((one) => one.post)
  );

  const query = search.trim().toLowerCase();
  const mine = posts
    .filter(canSee)
    .filter((post) => folderFilter === ALL_FOLDERS || (post.folders || []).includes(folderFilter))
    .filter((post) => {
      if (!query) { return true; }
      const inSummary = (post.summary || "").toLowerCase().includes(query);
      const inBody = preview(post.details, 4000).toLowerCase().includes(query);
      return inSummary || inBody;
    })
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  // The glance screen counts the whole list, not the filtered list.
  const listed = onlyUnanswered
    ? mine.filter((post) => post.type === "question" && !answered.has(post._id))
    : mine;

  const pinned = listed.filter((post) => post.pinned);
  const groups = groupPosts(listed.filter((post) => !post.pinned));
  const selectedPost = posts.find((post) => post._id === selectedId);

  const unread = mine.filter((post) => !(post.viewers || []).includes(currentUser?._id)).length;
  const unanswered = mine.filter(
    (post) => post.type === "question" && !answered.has(post._id)
  ).length;
  const instructorResponses = comments.filter((one) => isInstructorRole(one.authorRole)).length;
  const studentResponses = comments.filter((one) => !isInstructorRole(one.authorRole)).length;
  const students = people.filter(
    (person: any) => (person.role || "").toUpperCase() === "STUDENT"
  );

  const openPost = (id: string) => {
    setSelectedId(id);
    setMode("view");
  };

  const backToGlance = async () => {
    setMode("glance");
    setSelectedId(null);
    await load();
  };

  // A new post must show up in the list right away.
  // So I drop the folder filter and the unanswered filter first.
  const afterCreate = async (post: any) => {
    setFolderFilter(ALL_FOLDERS);
    setOnlyUnanswered(false);
    setSearch("");
    await load();
    setSelectedId(post._id);
    setMode("view");
  };

  // One row of the List of Posts.
  const postRow = (post: any) => {
    const open = post._id === selectedId && mode === "view";
    return (
      <div
        key={post._id}
        role="button"
        onClick={() => openPost(post._id)}
        className={`wd-pazza-post-row ${open ? "wd-pazza-post-open" : ""}`}
      >
        {post.type === "note" ? (
          <span className="wd-pazza-note-mark" title="Note" />
        ) : (
          <FaRegQuestionCircle className="wd-pazza-question-mark" title="Question" />
        )}
        <div className="wd-pazza-post-text">
          <div className="d-flex align-items-center gap-1">
            <span
              className={`wd-pazza-badge ${
                isInstructorRole(post.authorRole) ? "wd-pazza-badge-instr" : ""
              }`}
            >
              {isInstructorRole(post.authorRole) ? "Instructor" : "Student"}
            </span>
            <span className="fw-bold text-truncate">{post.summary}</span>
          </div>
          <div className="wd-pazza-post-preview">{preview(post.details, 160)}</div>
        </div>
        <div className="wd-pazza-post-time">{timeLabel(post.createdAt)}</div>
      </div>
    );
  };

  return (
    <div id="wd-piazza" className="wd-pazza">
      <PazzaNav
        cid={cid}
        courseName={courseName}
        currentUser={currentUser}
        isInstructor={isInstructor}
        active="qa"
      />

      {/* The folder filters. One folder at a time, so these are radios. */}
      <div id="wd-pazza-folders" className="wd-pazza-folders">
        <span className="wd-pazza-folders-label">Folders</span>
        <span>
          <input
            type="radio"
            className="btn-check"
            name="wd-pazza-folder-filter"
            id="wd-pazza-folder-all"
            autoComplete="off"
            checked={folderFilter === ALL_FOLDERS}
            onChange={() => setFolderFilter(ALL_FOLDERS)}
          />
          <label className="btn btn-sm wd-pazza-chip" htmlFor="wd-pazza-folder-all">
            all posts
          </label>
        </span>
        {folders.map((folder: any) => (
          <span key={folder._id}>
            <input
              type="radio"
              className="btn-check"
              name="wd-pazza-folder-filter"
              id={`wd-pazza-folder-${folder._id}`}
              autoComplete="off"
              checked={folderFilter === folder.name}
              onChange={() => setFolderFilter(folder.name)}
            />
            <label className="btn btn-sm wd-pazza-chip" htmlFor={`wd-pazza-folder-${folder._id}`}>
              {folder.name}
            </label>
          </span>
        ))}
      </div>

      {/* Two columns. The posts on the left and the reading pane on the right. */}
      <div className="wd-pazza-body">
        {sidebarOpen ? (
          <aside className="wd-pazza-lops">
            <div className="wd-pazza-lopc">
              <FaCaretLeft
                id="wd-pazza-toggle-lops"
                role="button"
                title="Hide the list of posts"
                onClick={() => setSidebarOpen(false)}
              />
              <span className="text-muted small">Unread</span>
              <span className="text-muted small">Updated</span>
              <span className="text-muted small">Unresolved</span>
              <span className="text-muted small">Following</span>
            </div>

            <div className="wd-pazza-lop-tools">
              <Button id="wd-pazza-new-post-btn" size="sm" className="wd-pazza-btn"
                      onClick={() => setMode("new")}>
                <FaPlus className="me-1" />
                New Post
              </Button>
              <InputGroup size="sm">
                <InputGroup.Text><BsSearch /></InputGroup.Text>
                <Form.Control
                  id="wd-pazza-search"
                  type="search"
                  placeholder="Search posts"
                  aria-label="Search posts"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                />
              </InputGroup>
            </div>

            <div className="wd-pazza-lop">
              {onlyUnanswered && (
                <div className="wd-pazza-filter-note">
                  <span>Showing unanswered questions</span>
                  <button type="button" className="btn btn-link btn-sm p-0"
                          onClick={() => setOnlyUnanswered(false)}>
                    Clear
                  </button>
                </div>
              )}

              {listed.length === 0 && <div className="text-muted small p-3">No posts.</div>}

              {pinned.length > 0 && (
                <details open>
                  <summary className="wd-pazza-group">Pinned</summary>
                  {pinned.map(postRow)}
                </details>
              )}

              {groups.map((group) => (
                <details key={group.key} open>
                  <summary className="wd-pazza-group">{group.label}</summary>
                  {group.posts.map(postRow)}
                </details>
              ))}
            </div>
          </aside>
        ) : (
          <div className="wd-pazza-lops-closed">
            <FaCaretRight
              id="wd-pazza-toggle-lops"
              role="button"
              title="Show the list of posts"
              onClick={() => setSidebarOpen(true)}
            />
          </div>
        )}

        <main className="wd-pazza-ps">
          {mode === "new" && (
            <NewPostScreen
              cid={cid}
              currentUser={currentUser}
              folders={folders}
              users={people}
              onCancel={backToGlance}
              onCreated={afterCreate}
            />
          )}

          {mode === "view" && selectedPost && (
            <PostView
              cid={cid}
              post={selectedPost}
              currentUser={currentUser}
              isInstructor={isInstructor}
              onChanged={load}
              onDeleted={backToGlance}
            />
          )}

          {(mode === "glance" || (mode === "view" && !selectedPost)) && (
            <ClassAtGlance
              unread={unread}
              unanswered={unanswered}
              totalPosts={mine.length}
              instructorResponses={instructorResponses}
              studentResponses={studentResponses}
              studentsEnrolled={students.length}
              isInstructor={isInstructor}
              onShowUnanswered={() => setOnlyUnanswered(true)}
            />
          )}
        </main>
      </div>
    </div>
  );
}
