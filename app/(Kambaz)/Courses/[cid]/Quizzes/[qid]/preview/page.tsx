"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "react-bootstrap";
import * as quizzesClient from "../../client";
import { totalPoints } from "../../helpers";
import QuizRunner from "../../QuizRunner";
import { TopInfoRow, Instructions, AttemptHistory, SubmissionDetails } from "../../QuizChrome";

// Faculty preview: take the quiz and see the score. Nothing is stored.
export default function QuizPreview() {
    const { cid, qid } = useParams<{ cid: string; qid: string }>();
    const router = useRouter();
    const [quiz, setQuiz] = useState<any>(null);
    const [result, setResult] = useState<any>(null);

    useEffect(() => {
        (async () => setQuiz(await quizzesClient.getQuiz(qid).catch(() => null)))();
    }, [qid]);
    if (!quiz) return <div className="p-4 text-muted">Loading…</div>;

    const points = totalPoints(quiz);
    const showCorrect = !!quiz.showCorrectAnswers;

    const onSubmit = async (arr: any[], meta: any, localScore: number) => {
        const answersMap = Object.fromEntries(arr.map((x: any) => [x.questionId, x.answer]));
        setResult({ answersMap, score: localScore, timeTaken: meta?.timeTaken || 0, submittedAt: new Date().toISOString() });
        return { score: localScore };
    };

    const header = (
        <div className="d-flex justify-content-between align-items-center mb-2">
            <h3 className="mb-0">{quiz.title}</h3>
            <Button variant="secondary" onClick={() => router.push(`/Courses/${cid}/Quizzes/${qid}/edit?tab=questions`)}>Edit Quiz</Button>
        </div>
    );

    if (result) {
        const synthetic = [{ _id: "preview", attemptNumber: 1, score: result.score, timeTaken: result.timeTaken, submittedAt: result.submittedAt }];
        return (
            <div className="p-4">
                {header}
                <div className="text-muted small mb-2">Preview — this attempt is not stored.</div>
                <div className="row">
                    <div className="col-lg-8">
                        <TopInfoRow quiz={quiz} />
                        <Instructions quiz={quiz} />
                        <AttemptHistory attempts={synthetic} points={points} />
                        <QuizRunner quiz={quiz} mode="review" initialAnswers={result.answersMap} showCorrect={showCorrect} />
                        <div className="mt-3"><Button variant="dark" onClick={() => setResult(null)}>Retake Preview</Button></div>
                    </div>
                    <div className="col-lg-4">
                        <SubmissionDetails last={synthetic[0]} best={result.score} points={points} />
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="p-4">
            {header}
            <div className="text-muted small mb-2">Preview of the published version — answers are not stored.</div>
            <TopInfoRow quiz={quiz} />
            <Instructions quiz={quiz} />
            <QuizRunner quiz={quiz} mode="preview" onSubmit={onSubmit} showCorrect={showCorrect} />
        </div>
    );
}
