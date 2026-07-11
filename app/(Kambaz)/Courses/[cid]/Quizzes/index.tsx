"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { FaPlus, FaCheckCircle, FaBan } from "react-icons/fa";
import { BsRocket, BsRocketFill } from "react-icons/bs";
import { setQuizzes, addQuiz, deleteQuiz, updateQuiz } from "./reducer";
import * as quizzesClient from "./client";
import { availability, totalPoints, questionCount, fmtDate } from "./helpers";
import KebabMenu from "@/app/(Kambaz)/KebabMenu";
import { useIsFaculty } from "@/app/(Kambaz)/Account/roles";

// Quiz List screen: list a course's quizzes, add/publish/delete (faculty),
// and show each quiz availability, points, question count, and student score.
export default function Quizzes() {
    const { cid } = useParams<{ cid: string }>();
    const router = useRouter();
    const dispatch = useDispatch();
    const { quizzes } = useSelector((s: any) => s.quizzesReducer);
    const { currentUser } = useSelector((s: any) => s.accountReducer);
    const isFaculty = useIsFaculty();
    const [search, setSearch] = useState("");
    const [scores, setScores] = useState<Record<string, number | null>>({});

    const load = async () => {
        const list = await quizzesClient.findQuizzesForCourse(cid).catch(() => []);
        dispatch(setQuizzes(list));
        // Student: show the score from the last attempt on each published quiz.
        if (!isFaculty && currentUser?._id) {
            const published = list.filter((q: any) => q.published !== false);
            const entries = await Promise.all(
                published.map(async (q: any) => {
                    const a = await quizzesClient.getAttempts(q._id, currentUser._id).catch(() => null);
                    return [q._id, a?.last ? a.last.score : null] as const;
                })
            );
            setScores(Object.fromEntries(entries));
        }
    };
    useEffect(() => {
        load();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [cid, isFaculty, currentUser?._id]);

    const courseQuizzes = quizzes
        .filter((q: any) => q.course === cid)
        .filter((q: any) => (q.title || "").toLowerCase().includes(search.toLowerCase()))
        .filter((q: any) => isFaculty || q.published !== false)
        .slice()
        .sort((a: any, b: any) => new Date(a.availableDate || 0).getTime() - new Date(b.availableDate || 0).getTime());

    const addQuizAndEdit = async () => {
        const created = await quizzesClient.createQuiz(cid, { title: "New Quiz", course: cid });
        dispatch(addQuiz(created));
        router.push(`/Courses/${cid}/Quizzes/${created._id}/edit`);
    };
    const togglePublish = async (quiz: any) => {
        const updated = { ...quiz, published: !(quiz.published !== false) };
        await quizzesClient.updateQuiz(updated);
        dispatch(updateQuiz(updated));
    };
    const removeQuiz = async (quizId: string) => {
        if (!window.confirm("Delete this quiz?")) return;
        await quizzesClient.deleteQuiz(quizId);
        dispatch(deleteQuiz(quizId));
    };

    return (
        <div id="wd-quizzes">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <input className="form-control w-50" placeholder="Search for Quiz"
                    value={search} onChange={(e) => setSearch(e.target.value)} />
                {isFaculty && (
                    <button className="btn btn-danger" onClick={addQuizAndEdit}>
                        <FaPlus className="me-1" /> Quiz
                    </button>
                )}
            </div>

            <h4 className="border-bottom pb-2">Assignment Quizzes</h4>

            {courseQuizzes.length === 0 ? (
                <div className="alert alert-info">
                    No quizzes yet. {isFaculty ? "Click the + Quiz button to add one." : "Check back later."}
                </div>
            ) : (
                <div className="list-group list-group-flush">
                    {courseQuizzes.map((quiz: any) => {
                        const av = availability(quiz);
                        const score = scores[quiz._id];
                        const published = quiz.published !== false;
                        return (
                            <div key={quiz._id} className="d-flex align-items-center border-bottom py-3">
                                {published
                                    ? <BsRocketFill className="text-success me-3" size={22} />
                                    : <BsRocket className="text-secondary me-3" size={22} />}
                                <div className="flex-grow-1" style={{ minWidth: 0 }}>
                                    <div className="fw-bold text-dark" role="button"
                                        onClick={() => router.push(`/Courses/${cid}/Quizzes/${quiz._id}`)}>
                                        {quiz.title}
                                    </div>
                                    <div className="text-muted small">
                                        <span className="fw-semibold">{av.label}</span>
                                        {quiz.dueDate && <span> | Due {fmtDate(quiz.dueDate)}</span>}
                                        <span> | {totalPoints(quiz)} pts</span>
                                        <span> | {questionCount(quiz)} Questions</span>
                                        {!isFaculty && score != null && <span> | Score {score}</span>}
                                    </div>
                                </div>
                                {isFaculty && (
                                    <div className="ms-3 d-flex align-items-center gap-2">
                                        <button className="btn btn-link p-0"
                                            title={published ? "Published — click to unpublish" : "Unpublished — click to publish"}
                                            onClick={() => togglePublish(quiz)}>
                                            {published ? <FaCheckCircle className="text-success" /> : <FaBan className="text-secondary" />}
                                        </button>
                                        <KebabMenu items={[
                                            { label: "Edit", onClick: () => router.push(`/Courses/${cid}/Quizzes/${quiz._id}`) },
                                            { label: published ? "Unpublish" : "Publish", onClick: () => togglePublish(quiz) },
                                            { label: "Delete", danger: true, onClick: () => removeQuiz(quiz._id) },
                                        ]} />
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
