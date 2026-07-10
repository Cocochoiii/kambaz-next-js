"use client";

import { useParams } from "next/navigation";
import { useSelector } from "react-redux";
import { useState, useEffect } from "react";
import { Table, Button } from "react-bootstrap";
import { FaFileExport } from "react-icons/fa";
import * as assignmentsClient from "../Assignments/client";
import * as submissionsClient from "../../../Submissions/client";
import * as accountClient from "../../../Account/client";
import { useIsFaculty } from "../../../Account/roles";

// Escape one CSV cell.
const csvCell = (value: any) => {
    const s = String(value ?? "");
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
};
// Trigger a client-side CSV download.
const downloadCsv = (text: string, filename: string) => {
    const blob = new Blob([text], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
};

export default function Grades() {
    const { cid } = useParams<{ cid: string }>();
    const { currentUser } = useSelector((state: any) => state.accountReducer);
    const isFaculty = useIsFaculty();

    const [assignments, setAssignments] = useState<any[]>([]);
    const [submissions, setSubmissions] = useState<any[]>([]);
    const [students, setStudents] = useState<any[]>([]);

    // Load the course assignments, its submissions, and (for faculty) students.
    useEffect(() => {
        const load = async () => {
            const [a, s] = await Promise.all([
                assignmentsClient.findAssignmentsForCourse(cid).catch(() => []),
                submissionsClient.findSubmissionsForCourse(cid).catch(() => []),
            ]);
            setAssignments(a);
            setSubmissions(s);
            if (isFaculty) {
                const people = await accountClient.findUsersForCourse(cid).catch(() => []);
                setStudents(people.filter((u: any) => (u.role || "").toUpperCase() === "STUDENT"));
            }
        };
        load();
    }, [cid, isFaculty]);

    // A graded submission for one (student, assignment) pair, if any.
    const gradedSub = (userId: string, assignmentId: string) =>
        submissions.find(
            (s: any) => s.user === userId && s.assignment === assignmentId && s.status === "graded"
        );

    // Total percent for a student across graded assignments only.
    const totalFor = (userId?: string) => {
        let earned = 0;
        let possible = 0;
        assignments.forEach((a: any) => {
            const sub = gradedSub(userId || "", a._id);
            if (sub) {
                earned += Number(sub.grade) || 0;
                possible += Number(a.points) || 0;
            }
        });
        const pct = possible ? (earned / possible) * 100 : 0;
        return pct.toFixed(1);
    };

    // Faculty gradebook export.
    const handleExport = () => {
        const header = ["Student", "ID", ...assignments.map((a: any) => a.title), "Total %"];
        const rows = students.map((st: any) => {
            const cells = assignments.map((a: any) => {
                const sub = gradedSub(st._id, a._id);
                return sub ? sub.grade : "";
            });
            return [`${st.firstName} ${st.lastName}`, st._id, ...cells, totalFor(st._id)];
        });
        const csv = [header, ...rows].map((r) => r.map(csvCell).join(",")).join("\n");
        downloadCsv(csv, `${cid}-grades.csv`);
    };

    // Student view: their own grades and total.
    if (!isFaculty) {
        const myGraded = (assignmentId: string) =>
            submissions.find(
                (s: any) => s.user === currentUser?._id && s.assignment === assignmentId && s.status === "graded"
            );
        return (
            <div id="wd-grades">
                <h2 className="mb-3" style={{ fontWeight: 300 }}>
                    Grades for {currentUser?.firstName} {currentUser?.lastName}
                </h2>
                <hr />
                <Table hover>
                    <thead>
                        <tr>
                            <th>Assignment</th>
                            <th>Due</th>
                            <th className="text-end">Score</th>
                        </tr>
                    </thead>
                    <tbody>
                        {assignments.map((a: any) => {
                            const sub = myGraded(a._id);
                            return (
                                <tr key={a._id}>
                                    <td>{a.title}</td>
                                    <td className="text-nowrap">
                                        {a.dueDate ? new Date(a.dueDate).toLocaleDateString() : "-"}
                                    </td>
                                    <td className="text-end">
                                        {sub ? (
                                            <strong>{sub.grade} / {a.points}</strong>
                                        ) : (
                                            <span className="text-muted">-</span>
                                        )}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </Table>
                <h4 className="text-end">Total: {totalFor(currentUser?._id)}%</h4>
            </div>
        );
    }

    // Faculty view: student × assignment matrix. Student column and header stay
    // pinned while scrolling; assignment columns show the short code + points.
    return (
        <div id="wd-grades">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h2 className="mb-0" style={{ fontWeight: 300 }}>Student Grades</h2>
                <Button variant="primary" onClick={handleExport}>
                    <FaFileExport className="me-2" /> Export
                </Button>
            </div>
            <hr />
            <div className="border rounded" style={{ overflow: "auto", maxHeight: "70vh" }}>
                <Table hover striped className="align-middle mb-0">
                    <thead>
                        <tr>
                            <th className="bg-light text-nowrap" style={{ position: "sticky", left: 0, top: 0, zIndex: 3, minWidth: 180 }}>
                                Student
                            </th>
                            {assignments.map((a: any) => (
                                <th key={a._id} className="text-center bg-light" style={{ position: "sticky", top: 0, zIndex: 1, minWidth: 64 }} title={a.title}>
                                    <div className="fw-semibold">{a.title.split(":")[0].trim()}</div>
                                    <small className="text-muted">{a.points}</small>
                                </th>
                            ))}
                            <th className="text-center bg-light" style={{ position: "sticky", top: 0, zIndex: 1, minWidth: 90 }}>Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        {students.length === 0 ? (
                            <tr>
                                <td colSpan={assignments.length + 2} className="text-muted p-3">No students enrolled.</td>
                            </tr>
                        ) : (
                            students.map((st: any) => (
                                <tr key={st._id}>
                                    <td className="bg-white text-nowrap" style={{ position: "sticky", left: 0, zIndex: 2 }}>
                                        <strong>{st.firstName} {st.lastName}</strong>
                                    </td>
                                    {assignments.map((a: any) => {
                                        const sub = gradedSub(st._id, a._id);
                                        return (
                                            <td key={a._id} className="text-center">
                                                {sub ? (
                                                    <span className="fw-bold">{sub.grade}</span>
                                                ) : (
                                                    <span className="text-muted">-</span>
                                                )}
                                            </td>
                                        );
                                    })}
                                    <td className="text-center bg-light fw-bold">{totalFor(st._id)}%</td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </Table>
            </div>
        </div>
    );
}
