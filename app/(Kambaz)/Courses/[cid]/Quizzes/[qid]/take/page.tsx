"use client";

import { useParams, useRouter } from "next/navigation";
import { Button } from "react-bootstrap";

// Placeholder — the full student take flow (one question at a time, submit,
// scoring, persisted attempts) is implemented in the next part.
export default function QuizTake() {
    const { cid, qid } = useParams<{ cid: string; qid: string }>();
    const router = useRouter();
    return (
        <div className="p-4">
            <h4>Take Quiz</h4>
            <p className="text-muted">This quiz-taking screen is being finalized.</p>
            <Button variant="secondary" onClick={() => router.push(`/Courses/${cid}/Quizzes/${qid}`)}>Back to Details</Button>
        </div>
    );
}
