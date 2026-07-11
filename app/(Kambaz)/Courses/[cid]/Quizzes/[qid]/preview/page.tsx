"use client";

import { useParams, useRouter } from "next/navigation";
import { Button } from "react-bootstrap";

// Placeholder — the full faculty preview (one question at a time, scoring) is
// implemented in the next part.
export default function QuizPreview() {
    const { cid, qid } = useParams<{ cid: string; qid: string }>();
    const router = useRouter();
    return (
        <div className="p-4">
            <h4>Quiz Preview</h4>
            <p className="text-muted">This preview screen is being finalized.</p>
            <Button variant="secondary" onClick={() => router.push(`/Courses/${cid}/Quizzes/${qid}`)}>Back to Details</Button>
        </div>
    );
}
