"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { Button, Nav } from "react-bootstrap";
import * as quizzesClient from "../../client";
import { totalPoints } from "../../helpers";
import DetailsTab from "./DetailsTab";
import QuestionsTab from "./QuestionsTab";

// Quiz Editor: two tabs (Details, Questions). Save keeps changes without
// publishing. Save & Publish publishes. Cancel throws the changes away.
export default function QuizEditor() {
    const { cid, qid } = useParams<{ cid: string; qid: string }>();
    const router = useRouter();
    const [quiz, setQuiz] = useState<any>(null);
    const [tab, setTab] = useState<"details" | "questions">("details");
    const { currentUser, viewAsStudent } = useSelector((s: any) => s.accountReducer);
    const notFaculty = !!currentUser && (String(currentUser.role).toUpperCase() !== "FACULTY" || !!viewAsStudent);

    useEffect(() => {
        (async () => {
            const q = await quizzesClient.getQuiz(qid).catch(() => null);
            setQuiz(q);
        })();
    }, [qid]);

    useEffect(() => {
        // Preview's "Edit Quiz" links here with ?tab=questions.
        const t = new URLSearchParams(window.location.search).get("tab");
        if (t === "questions") setTab("questions");
    }, []);

    useEffect(() => {
        // Students can not edit a quiz.
        if (notFaculty) router.replace(`/Courses/${cid}/Quizzes/${qid}`);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [notFaculty]);

    if (notFaculty) return null;
    if (!quiz) return <div className="p-4 text-muted">Loading…</div>;

    const set = (patch: any) => setQuiz((prev: any) => ({ ...prev, ...patch }));
    const published = quiz.published !== false;

    const save = async (publish?: boolean) => {
        const payload = { ...quiz, points: totalPoints(quiz) };
        if (publish !== undefined) payload.published = publish;
        await quizzesClient.updateQuiz(payload);
        if (publish) router.push(`/Courses/${cid}/Quizzes`);          // Save & Publish -> list
        else router.push(`/Courses/${cid}/Quizzes/${qid}`);           // Save -> details
    };
    const cancel = () => router.push(`/Courses/${cid}/Quizzes`);      // Cancel -> list

    return (
        <div className="p-4">
            <div className="d-flex justify-content-between align-items-center mb-2">
                <div className="text-muted">Points {totalPoints(quiz)}</div>
                {published
                    ? <span className="badge bg-success">Published</span>
                    : <span className="badge bg-secondary">Not Published</span>}
            </div>

            <Nav variant="tabs" activeKey={tab} className="mb-3"
                onSelect={(k) => setTab((k as any) || "details")}>
                <Nav.Item><Nav.Link eventKey="details">Details</Nav.Link></Nav.Item>
                <Nav.Item><Nav.Link eventKey="questions">Questions</Nav.Link></Nav.Item>
            </Nav>

            {tab === "details"
                ? <DetailsTab quiz={quiz} set={set} />
                : <QuestionsTab quiz={quiz} setQuiz={setQuiz} />}

            <hr />
            <div className="d-flex justify-content-center gap-2">
                <Button variant="light" className="border" onClick={cancel}>Cancel</Button>
                <Button variant="secondary" onClick={() => save(false)}>Save</Button>
                <Button variant="dark" onClick={() => save(true)}>Save &amp; Publish</Button>
            </div>
        </div>
    );
}
