"use client";

// The Grades screen. Canvas shows two screens, so I do too.
// Faculty sees the whole table. A student sees only their own scores.
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Button, Table } from "react-bootstrap";
import { FaEyeSlash } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import GradeEditor from "./GradeEditor";
import { setGrades, saveGrade as saveGradeAction, releaseGrades } from "./reducer";
import { setAssignments } from "../Assignments/reducer";
import * as coursesClient from "../../client";
import { isFacultyNow } from "../../../Account/roles";

// I cut the date myself, so the server and the browser agree.
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
                "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function shortDate(date?: string | null) {
  if (!date) { return "-"; }
  const [, month, day] = date.slice(0, 10).split("-");
  return `${MONTHS[Number(month) - 1]} ${Number(day)}`;
}

// Canvas shows only the part before the colon.
function shortName(title: string) {
  return title.split(":")[0];
}

// The letter for a percentage, the same scale Canvas uses.
function letterGrade(percent: number) {
  if (percent >= 93) { return "A"; }
  if (percent >= 90) { return "A-"; }
  if (percent >= 87) { return "B+"; }
  if (percent >= 83) { return "B"; }
  if (percent >= 80) { return "B-"; }
  if (percent >= 77) { return "C+"; }
  if (percent >= 73) { return "C"; }
  if (percent >= 70) { return "C-"; }
  if (percent >= 60) { return "D"; }
  return "F";
}

export default function Grades() {
  const params = useParams<{ cid: string }>();
  const cid = params ? params.cid : "";

  const { grades } = useSelector((state: any) => state.gradesReducer);
  const { assignments } = useSelector((state: any) => state.assignmentsReducer);
  const { currentUser, viewAsStudent } = useSelector(
    (state: any) => state.accountReducer
  );
  const dispatch = useDispatch();

  const isFaculty = isFacultyNow(currentUser, viewAsStudent);

  // The cell I am editing, and its score.
  const [cell, setCell] = useState<any>(null);
  const [score, setScore] = useState("");

  // The roster and the weights are read only, so useState is enough.
  const [students, setStudents] = useState<any[]>([]);
  const [weights, setWeights] = useState<any>(null);

  // Everything on this screen comes from the server now.
  const fetchGradeBook = async () => {
    const foundAssignments = await coursesClient.findAssignmentsForCourse(cid);
    dispatch(setAssignments(foundAssignments));

    const foundGrades = await coursesClient.findGradesForCourse(cid);
    dispatch(setGrades(foundGrades));

    // A TA has no grades, so I keep the students only.
    const people = await coursesClient.findUsersForCourse(cid);
    setStudents(people.filter((user: any) => user.role === "STUDENT"));

    const foundWeights = await coursesClient.findGradeCategoriesForCourse(cid);
    setWeights(foundWeights);
  };

  useEffect(() => {
    if (cid) {
      fetchGradeBook();
    }
  }, [cid]);

  const courseAssignments = assignments.filter((a: any) => a.course === cid);

  // Faculty sees every score. A student only sees released ones.
  const visibleGrades = grades.filter((g: any) =>
    isFaculty
      ? g.course === cid
      : g.course === cid && g.student === currentUser?._id && g.released
  );

  const gradeFor = (assignmentId: string, studentId: string) =>
    visibleGrades.find(
      (g: any) => g.assignment === assignmentId && g.student === studentId
    );

  // The total only counts the assignments that have a score.
  const total = (studentId: string) => {
    const scored = visibleGrades.filter(
      (g: any) => g.student === studentId && g.score !== null
    );
    const earned = scored.reduce((sum: number, g: any) => sum + Number(g.score), 0);
    const possible = scored.reduce((sum: number, g: any) => {
      const assignment = courseAssignments.find((a: any) => a._id === g.assignment);
      return sum + Number(assignment ? assignment.points : 0);
    }, 0);
    if (possible === 0) { return { percent: "0.0", letter: "N/A" }; }
    const percent = (earned / possible) * 100;
    return { percent: percent.toFixed(1), letter: letterGrade(percent) };
  };

  const openCell = (student: any, assignment: any) => {
    const grade = gradeFor(assignment._id, student._id);
    setCell({
      studentId: student._id,
      studentName: `${student.firstName} ${student.lastName}`,
      assignmentId: assignment._id,
      assignmentTitle: assignment.title,
      maxPoints: assignment.points,
    });
    setScore(grade && grade.score !== null ? String(grade.score) : "");
  };

  const saveGrade = async () => {
    // The server changes the grade, or adds it when the cell was empty.
    const saved = await coursesClient.saveGradeForCourse(cid, {
      student: cell.studentId,
      assignment: cell.assignmentId,
      score: parseFloat(score),
      submitted: new Date().toISOString().slice(0, 10),
    });
    dispatch(saveGradeAction(saved));
    setCell(null);
  };

  const release = async () => {
    if (window.confirm("Release every grade of this course to the students?")) {
      await coursesClient.releaseGradesForCourse(cid);
      dispatch(releaseGrades(cid));
    }
  };

  const unreleased = grades.some((g: any) => g.course === cid && !g.released);

  // Faculty: one row per student, one column per assignment.
  if (isFaculty) {
    return (
      <div id="wd-grades">
        <div className="clearfix mb-4">
          <Button
            id="wd-release-grades-btn"
            variant={unreleased ? "danger" : "success"}
            className="float-end"
            onClick={release}
          >
            {unreleased ? "Release Grades" : "Grades Released"}
          </Button>
          <h2 className="mb-0">Student Grades</h2>
        </div>

        {/* responsive adds a scrollbar for a wide table */}
        <Table responsive className="mb-0">
          <thead className="bg-light">
            <tr>
              <th style={{ minWidth: "150px" }}>Student</th>
              {courseAssignments.map((assignment: any) => (
                <th key={assignment._id} className="text-center"
                    style={{ minWidth: "64px" }} title={assignment.title}>
                  {shortName(assignment.title)}
                  <div className="text-muted fw-normal">{assignment.points} pts</div>
                </th>
              ))}
              <th className="text-center">Total</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student: any) => {
              const studentTotal = total(student._id);
              return (
                <tr key={student._id}>
                  <td className="bg-light">
                    <b>{student.firstName} {student.lastName}</b>
                    <div className="text-muted small">{student.username}</div>
                  </td>
                  {courseAssignments.map((assignment: any) => {
                    const grade = gradeFor(assignment._id, student._id);
                    return (
                      <td
                        key={assignment._id}
                        role="button"
                        title="Click to change this score"
                        className="text-center"
                        onClick={() => openCell(student, assignment)}
                      >
                        {grade && grade.score !== null ? (
                          <>
                            <b>{grade.score}</b>
                            {/* A score the students cannot see yet */}
                            {!grade.released && (
                              <FaEyeSlash className="text-warning ms-1" />
                            )}
                          </>
                        ) : (
                          <span className="text-muted">-</span>
                        )}
                      </td>
                    );
                  })}
                  <td className="text-center bg-light">
                    <b>{studentTotal.percent}%</b>
                    <div className="text-muted small">{studentTotal.letter}</div>
                  </td>
                </tr>
              );
            })}
        </tbody>
        </Table>

        {students.length === 0 && (
          <p className="text-muted mt-3">No students are enrolled in this course.</p>
        )}

        <GradeEditor
          show={cell !== null}
          handleClose={() => setCell(null)}
          studentName={cell ? cell.studentName : ""}
          assignmentTitle={cell ? cell.assignmentTitle : ""}
          maxPoints={cell ? cell.maxPoints : 100}
          score={score}
          setScore={setScore}
          saveGrade={saveGrade}
        />
      </div>
    );
  }

  // Student: my own scores, and the weights on the right.
  const myTotal = total(currentUser?._id);

  return (
    <div id="wd-grades">
      <h2 className="mb-4">
        Grades for {currentUser?.firstName} {currentUser?.lastName}
      </h2>

      <div className="d-flex">
        <div className="flex-fill me-4">
          <Table className="mb-0">
            <thead className="bg-light">
              <tr>
                <th>Name</th>
                <th>Due</th>
                <th>Submitted</th>
                <th className="text-center">Status</th>
                <th style={{ width: "180px" }}>Score</th>
              </tr>
            </thead>
            <tbody>
              {courseAssignments.map((assignment: any) => {
                const grade = gradeFor(assignment._id, currentUser?._id);
                const hasScore = grade && grade.score !== null;
                const percent = hasScore
                  ? (Number(grade.score) / Number(assignment.points)) * 100
                  : 0;
                return (
                  <tr key={assignment._id}>
                    <td>
                      <b>{assignment.title}</b>
                      <div className="text-muted small">Assignment</div>
                    </td>
                    <td className="text-nowrap">
                      {shortDate(assignment.dueDate)} by 11:59pm
                    </td>
                    <td className="text-nowrap">
                      {hasScore ? shortDate(grade.submitted) : <span className="text-muted">-</span>}
                    </td>
                    <td className="text-center">
                      {hasScore ? (
                        <div
                          className="d-inline-block"
                          style={{
                            width: "8px",
                            height: "8px",
                            borderRadius: "4px",
                            backgroundColor: "#0374b5",
                          }}
                        />
                      ) : (
                        <span className="text-muted">-</span>
                      )}
                    </td>
                    <td>
                      {hasScore ? (
                        <>
                          <b>{grade.score} / {assignment.points}</b>
                          {/* A bar made with a width and a color */}
                          <div
                            className="mt-1"
                            style={{ height: "8px", backgroundColor: "#e9ecef" }}
                          >
                            <div
                              style={{
                                height: "8px",
                                width: `${percent}%`,
                                backgroundColor: "#0374b5",
                              }}
                            />
                          </div>
                        </>
                      ) : (
                        <span className="text-muted">
                          <FaEyeSlash className="me-1" /> Not released
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </div>

        <div className="d-none d-lg-block" style={{ width: "300px" }}>
          <div className="border rounded p-3">
            <h4 className="text-end">
              Total: {myTotal.percent}% ({myTotal.letter})
            </h4>
            <hr />
            <h6>Assignments are weighted by group:</h6>
            <Table className="mb-0">
              <thead>
                <tr>
                  <th>Group</th>
                  <th className="text-end">Weight</th>
                </tr>
              </thead>
              <tbody>
                {weights && weights.categories.map((category: any) => (
                  <tr key={category.name}>
                    <td>{category.name}</td>
                    <td className="text-end">{category.weight}%</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </div>
      </div>
    </div>
  );
}
