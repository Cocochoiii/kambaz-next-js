"use client";

import { useParams } from "next/navigation";
import { BsRocket, BsRocketFill } from "react-icons/bs";
import * as db from "../../../Database";

export default function Quizzes() {
    const { cid } = useParams<{ cid: string }>();
    const quizzes = db.quizzes.filter((quiz: any) => quiz.course === cid);

    return (
        <div id="wd-quizzes">
            <div className="mb-4">
                <input
                    type="text"
                    className="form-control w-50"
                    placeholder="Search for Quiz"
                />
            </div>

            <div className="mb-3">
                <h4>Assignment Quizzes</h4>
            </div>

            <div className="list-group">
                {quizzes.map((quiz: any) => (
                    <div key={quiz._id} className="d-flex align-items-center border-bottom py-3">
                        <div className="me-3">
                            {quiz.status === "Closed" ? (
                                <BsRocket className="text-secondary" size={20} />
                            ) : (
                                <BsRocketFill className="text-success" size={20} />
                            )}
                        </div>
                        <div className="flex-grow-1">
                            <h6 className="mb-1">
                                <a href="#" className="text-dark text-decoration-none">
                                    {quiz.title}
                                </a>
                            </h6>
                            <div className="text-muted small">
                                <span className="me-3">{quiz.status}</span>
                                <span className="me-3">Due {quiz.dueDate}</span>
                                {quiz.questions > 0 && (
                                    <>
                                        <span className="me-3">{quiz.points} pts</span>
                                        <span>{quiz.questions} Questions</span>
                                    </>
                                )}
                                {quiz.questions === 0 && (
                                    <span>{quiz.points} pts</span>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}