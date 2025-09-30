"use client";

import { useParams } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { useState } from "react";
import { releaseGrades, updateGrade } from "./reducer";
import {
    FaPrint,
    FaCheckCircle,
    FaFileExport,
    FaPencilAlt,
    FaEyeSlash
} from "react-icons/fa";
import { BsThreeDots } from "react-icons/bs";
import GradeEditor from "./GradeEditor";
import * as db from "../../../Database";

export default function Grades() {
    const { cid } = useParams<{ cid: string }>();
    const dispatch = useDispatch();

    const { currentUser } = useSelector((state: any) => state.accountReducer);
    const { assignments } = useSelector((state: any) => state.assignmentsReducer);
    const { grades } = useSelector((state: any) => state.gradesReducer);
    const { enrollments } = useSelector((state: any) => state.enrollmentsReducer);
    const { courses } = useSelector((state: any) => state.coursesReducer);

    const users = db.users;
    const currentCourse = courses.find((c: any) => c._id === cid);

    const [selectedCourse, setSelectedCourse] = useState(`${currentCourse?.number} ${currentCourse?.name}`);
    const [arrangeBy, setArrangeBy] = useState("Due Date");
    const [showEditor, setShowEditor] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState<string | null>(null);
    const [selectedAssignment, setSelectedAssignment] = useState<string | null>(null);

    const isFaculty = currentUser?.role === "FACULTY";

    // Get course assignments
    const courseAssignments = assignments.filter((a: any) => a.course === cid);

    // Get enrolled students for faculty view
    const enrolledStudents = isFaculty
        ? users.filter((user: any) =>
            user.role === "STUDENT" &&
            enrollments.some((e: any) => e.user === user._id && e.course === cid)
        )
        : [];

    // Get grades for current user or all grades for faculty
    const relevantGrades = grades.filter((g: any) => {
        if (isFaculty) {
            return g.course === cid;
        } else {
            return g.course === cid && g.student === currentUser._id && g.released;
        }
    });

    // Calculate total grade with proper weighting
    const calculateTotalGrade = (studentId?: string) => {
        const studentGrades = relevantGrades.filter((g: any) =>
            !studentId || g.student === studentId
        );

        if (studentGrades.length === 0) return { percentage: 0, letter: "N/A" };

        let totalEarned = 0;
        let totalPossible = 0;

        studentGrades.forEach((grade: any) => {
            const assignment = courseAssignments.find((a: any) => a._id === grade.assignment);
            if (assignment && grade.score !== null && grade.score !== undefined) {
                totalEarned += Number(grade.score);
                totalPossible += Number(assignment.points || 100);
            }
        });

        const percentage = totalPossible > 0 ? (totalEarned / totalPossible) * 100 : 0;

        let letter = "F";
        if (percentage >= 93) letter = "A";
        else if (percentage >= 90) letter = "A-";
        else if (percentage >= 87) letter = "B+";
        else if (percentage >= 83) letter = "B";
        else if (percentage >= 80) letter = "B-";
        else if (percentage >= 77) letter = "C+";
        else if (percentage >= 73) letter = "C";
        else if (percentage >= 70) letter = "C-";
        else if (percentage >= 67) letter = "D+";
        else if (percentage >= 63) letter = "D";
        else if (percentage >= 60) letter = "D-";

        return { percentage: percentage.toFixed(2), letter };
    };

    const getGradeForAssignment = (assignmentId: string, studentId?: string) => {
        return relevantGrades.find((g: any) =>
            g.assignment === assignmentId &&
            (studentId ? g.student === studentId : g.student === currentUser._id)
        );
    };

    const handleReleaseGrades = () => {
        if (window.confirm("Are you sure you want to release all grades for this course?")) {
            dispatch(releaseGrades(cid));
            alert("Grades have been released successfully!");
        }
    };

    const handleEditGrade = (studentId: string, assignmentId: string) => {
        setSelectedStudent(studentId);
        setSelectedAssignment(assignmentId);
        setShowEditor(true);
    };

    const handleSaveGrade = (score: number) => {
        dispatch(updateGrade({
            studentId: selectedStudent,
            assignmentId: selectedAssignment,
            courseId: cid,
            score: score,
            submitted: new Date().toISOString()
        }));
        setShowEditor(false);
    };

    const { percentage, letter } = calculateTotalGrade(isFaculty ? null : currentUser._id);
    const hasUnreleasedGrades = grades.some((g: any) => g.course === cid && !g.released);

    // Grade weight groups - different for each course
    const getGradeWeights = () => {
        switch(cid) {
            case "CS5610":
                return [
                    { group: "Assignments", weight: "40%" },
                    { group: "Quizzes", weight: "20%" },
                    { group: "Midterm Exam", weight: "20%" },
                    { group: "Final Project", weight: "15%" },
                    { group: "Participation", weight: "5%" }
                ];
            case "CS5800":
                return [
                    { group: "Problem Sets", weight: "35%" },
                    { group: "Quizzes", weight: "15%" },
                    { group: "Midterm Exam", weight: "25%" },
                    { group: "Final Exam", weight: "25%" }
                ];
            case "CS5004":
                return [
                    { group: "Lab Assignments", weight: "30%" },
                    { group: "Projects", weight: "35%" },
                    { group: "Midterm", weight: "15%" },
                    { group: "Final", weight: "20%" }
                ];
            default:
                return [
                    { group: "Assignments", weight: "50%" },
                    { group: "Exams", weight: "40%" },
                    { group: "Participation", weight: "10%" }
                ];
        }
    };

    const gradeWeights = getGradeWeights();

    return (
        <div id="wd-grades">
            {/* Canvas-style Header */}
            <div className="border-bottom pb-3 mb-4">
                <div className="d-flex justify-content-between align-items-start">
                    <div>
                        <h2 className="mb-0" style={{ fontWeight: "300", fontSize: "2rem" }}>
                            {!isFaculty && `Grades for ${currentUser?.firstName} ${currentUser?.lastName}`}
                            {isFaculty && "Student Grades"}
                        </h2>
                    </div>
                    <div className="d-flex gap-2">
                        {!isFaculty && (
                            <button className="btn btn-outline-secondary">
                                <FaPrint className="me-2" />
                                Print Grades
                            </button>
                        )}
                        {isFaculty && (
                            <>
                                <button
                                    className="btn btn-outline-secondary"
                                    onClick={() => alert("Edit grades by clicking on individual scores")}
                                >
                                    <FaPencilAlt className="me-2" />
                                    Edit Grades
                                </button>
                                <button
                                    className={`btn ${hasUnreleasedGrades ? 'btn-danger' : 'btn-success'}`}
                                    onClick={handleReleaseGrades}
                                >
                                    <FaCheckCircle className="me-2" />
                                    {hasUnreleasedGrades ? 'Release Grades' : 'Grades Released'}
                                </button>
                                <button className="btn btn-primary">
                                    <FaFileExport className="me-2" />
                                    Export
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* Canvas Filter Bar */}
            <div className="bg-light p-3 mb-4 border rounded">
                <div className="row align-items-end g-3">
                    <div className="col-md-4">
                        <label className="form-label fw-bold small">Course</label>
                        <select
                            className="form-select"
                            value={selectedCourse}
                            onChange={(e) => setSelectedCourse(e.target.value)}
                        >
                            <option>{currentCourse?.number} {currentCourse?.name}</option>
                        </select>
                    </div>
                    <div className="col-md-4">
                        <label className="form-label fw-bold small">Arrange By</label>
                        <select
                            className="form-select"
                            value={arrangeBy}
                            onChange={(e) => setArrangeBy(e.target.value)}
                        >
                            <option>Due Date</option>
                            <option>Title</option>
                            <option>Points</option>
                            <option>Module</option>
                        </select>
                    </div>
                    <div className="col-md-4">
                        <button className="btn btn-danger w-100">Apply</button>
                    </div>
                </div>
            </div>

            {/* Student View - Canvas Style */}
            {!isFaculty && (
                <div className="row">
                    {/* Assignments Table */}
                    <div className="col-md-8">
                        <div className="bg-white">
                            <table className="table">
                                <thead style={{ backgroundColor: "#f5f5f5" }}>
                                <tr>
                                    <th style={{ width: "35%" }}>Name</th>
                                    <th style={{ width: "20%" }}>Due</th>
                                    <th style={{ width: "20%" }}>Submitted</th>
                                    <th style={{ width: "10%" }}>Status</th>
                                    <th style={{ width: "15%" }}>Score</th>
                                </tr>
                                </thead>
                                <tbody>
                                {courseAssignments.map((assignment: any) => {
                                    const grade = getGradeForAssignment(assignment._id);
                                    const submitted = grade?.submitted;
                                    const score = grade?.score;
                                    const released = grade?.released;

                                    return (
                                        <tr key={assignment._id}>
                                            <td>
                                                <a
                                                    href="#"
                                                    className="text-primary text-decoration-none fw-semibold"
                                                    onClick={(e) => e.preventDefault()}
                                                >
                                                    {assignment.title}
                                                </a>
                                                <div className="text-muted small">
                                                    {assignment.group || "Assignment"}
                                                </div>
                                            </td>
                                            <td className="text-nowrap">
                                                {new Date(assignment.dueDate).toLocaleDateString('en-US', {
                                                    month: 'short',
                                                    day: 'numeric'
                                                })} by 11:59pm
                                            </td>
                                            <td>
                                                {submitted ? (
                                                    <span>
                                                            {new Date(submitted).toLocaleDateString('en-US', {
                                                                month: 'short',
                                                                day: 'numeric'
                                                            })} at<br/>
                                                        {new Date(submitted).toLocaleTimeString('en-US', {
                                                            hour: '2-digit',
                                                            minute: '2-digit'
                                                        })}
                                                        </span>
                                                ) : (
                                                    <span className="text-muted">-</span>
                                                )}
                                            </td>
                                            <td className="text-center">
                                                {submitted ? (
                                                    <div
                                                        className="rounded-circle bg-primary d-inline-block"
                                                        style={{ width: "8px", height: "8px" }}
                                                    />
                                                ) : (
                                                    <span className="text-muted">-</span>
                                                )}
                                            </td>
                                            <td>
                                                {released && score !== undefined && score !== null ? (
                                                    <div className="d-flex align-items-center">
                                                        <div className="flex-grow-1">
                                                            <strong>{score} / {assignment.points}</strong>
                                                            <div
                                                                className="progress mt-1"
                                                                style={{ height: "8px", backgroundColor: "#e9ecef" }}
                                                            >
                                                                <div
                                                                    className="progress-bar"
                                                                    style={{
                                                                        width: `${(score / assignment.points) * 100}%`,
                                                                        backgroundColor: "#0374B5"
                                                                    }}
                                                                />
                                                            </div>
                                                        </div>
                                                        <BsThreeDots className="ms-2 text-muted" />
                                                    </div>
                                                ) : !released && submitted ? (
                                                    <span className="text-muted">
                                                            <FaEyeSlash className="me-1" />
                                                            Muted
                                                        </span>
                                                ) : (
                                                    <span className="text-muted">-</span>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Grade Summary Sidebar */}
                    <div className="col-md-4">
                        <div className="bg-white p-3 border rounded">
                            <div className="text-end mb-3">
                                <h4 className="mb-1">Total: {percentage}% ({letter})</h4>
                            </div>

                            <div className="d-grid gap-2 mb-4">
                                <button className="btn btn-outline-secondary text-start">
                                    📊 Show Saved "What-If" Scores
                                </button>
                                <button className="btn btn-outline-secondary text-start">
                                    Show All Details
                                </button>
                            </div>

                            <h6 className="mb-3">Assignments are weighted by group:</h6>

                            <table className="table table-sm">
                                <thead>
                                <tr>
                                    <th>Group</th>
                                    <th className="text-end">Weight</th>
                                </tr>
                                </thead>
                                <tbody>
                                {gradeWeights.map((weight, index) => (
                                    <tr key={index}>
                                        <td>{weight.group}</td>
                                        <td className="text-end">{weight.weight}</td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}

            {/* Faculty View - Grade Grid */}
            {isFaculty && (
                <div className="bg-white border rounded p-0 overflow-auto">
                    <table className="table table-hover table-bordered mb-0">
                        <thead className="sticky-top bg-light">
                        <tr>
                            <th className="bg-light" style={{ minWidth: "200px" }}>Student</th>
                            {courseAssignments.map((assignment: any) => (
                                <th key={assignment._id} className="text-center" style={{ minWidth: "100px" }}>
                                    <div className="text-truncate" title={assignment.title}>
                                        {assignment.title}
                                    </div>
                                    <small className="text-muted">{assignment.points} pts</small>
                                </th>
                            ))}
                            <th className="text-center bg-light">Total</th>
                        </tr>
                        </thead>
                        <tbody>
                        {enrolledStudents.map((student: any) => {
                            const studentTotal = calculateTotalGrade(student._id);
                            return (
                                <tr key={student._id}>
                                    <td className="bg-light">
                                        <strong>{student.firstName} {student.lastName}</strong>
                                        <div className="text-muted small">{student._id}</div>
                                    </td>
                                    {courseAssignments.map((assignment: any) => {
                                        const grade = getGradeForAssignment(assignment._id, student._id);
                                        return (
                                            <td
                                                key={assignment._id}
                                                className="text-center grade-cell"
                                                style={{ cursor: "pointer" }}
                                                onClick={() => handleEditGrade(student._id, assignment._id)}
                                            >
                                                {grade?.score !== undefined && grade?.score !== null ? (
                                                    <div>
                                                        <span className="fw-bold">{grade.score}</span>
                                                        {!grade.released && (
                                                            <FaEyeSlash className="text-warning ms-1 small" />
                                                        )}
                                                    </div>
                                                ) : (
                                                    <span className="text-muted">-</span>
                                                )}
                                            </td>
                                        );
                                    })}
                                    <td className="text-center bg-light">
                                        <strong>{studentTotal.percentage}%</strong>
                                        <div className="small text-muted">{studentTotal.letter}</div>
                                    </td>
                                </tr>
                            );
                        })}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Grade Editor Modal */}
            {showEditor && (
                <GradeEditor
                    show={showEditor}
                    onClose={() => setShowEditor(false)}
                    onSave={handleSaveGrade}
                    studentId={selectedStudent}
                    assignmentId={selectedAssignment}
                    currentGrade={getGradeForAssignment(selectedAssignment!, selectedStudent!)?.score}
                    maxPoints={courseAssignments.find((a: any) => a._id === selectedAssignment)?.points || 100}
                />
            )}
        </div>
    );
}