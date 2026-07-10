"use client";

import { useParams } from "next/navigation";
import { BsRocket, BsRocketFill } from "react-icons/bs";
import { FaPlus, FaTrash } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import { useState, useEffect } from "react";
import { setQuizzes, addQuiz, deleteQuiz, updateQuiz } from "./reducer";
import * as quizzesClient from "./client";
import QuizModal from "./QuizModal";
import KebabMenu from "@/app/(Kambaz)/KebabMenu";

export default function Quizzes() {
    const { cid } = useParams<{ cid: string }>();
    const dispatch = useDispatch();
    const [showModal, setShowModal] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [editingQuiz, setEditingQuiz] = useState<any>(null);
    const [searchTerm, setSearchTerm] = useState("");

    const { quizzes } = useSelector((state: any) => state.quizzesReducer);
    const { currentUser } = useSelector((state: any) => state.accountReducer);

    const loadQuizzes = async () => {
        const list = await quizzesClient.findQuizzesForCourse(cid);
        dispatch(setQuizzes(list));
    };
    useEffect(() => {
        loadQuizzes();
    }, [cid]);

    // Filter quizzes for current course
    const courseQuizzes = quizzes
        .filter((quiz: any) => quiz.course === cid)
        .filter((quiz: any) =>
            quiz.title.toLowerCase().includes(searchTerm.toLowerCase())
        );

    // Check if current user is faculty
    const isFaculty = currentUser?.role === "FACULTY";

    const handleAddClick = () => {
        setEditingQuiz({
            title: "",
            status: "Open",
            dueDate: "",
            points: 0,
            questions: 0,
            timeLimit: 20,
            attempts: 1,
            description: "",
            availableFrom: "",
            availableUntil: "",
        });
        setEditMode(false);
        setShowModal(true);
    };

    const handleEditClick = (quiz: any) => {
        setEditingQuiz(quiz);
        setEditMode(true);
        setShowModal(true);
    };

    const handleDeleteClick = async (quizId: string) => {
        if (window.confirm("Are you sure you want to delete this quiz?")) {
            await quizzesClient.deleteQuiz(quizId);
            dispatch(deleteQuiz(quizId));
        }
    };

    const handleSave = async (quizData: any) => {
        if (editMode) {
            await quizzesClient.updateQuiz(quizData);
            dispatch(updateQuiz(quizData));
        } else {
            const created = await quizzesClient.createQuiz(cid, {
                ...quizData,
                course: cid,
            });
            dispatch(addQuiz(created));
        }
        setShowModal(false);
        setEditingQuiz(null);
    };

    return (
        <div id="wd-quizzes">
            <div className="mb-4">
                <div className="d-flex justify-content-between align-items-center">
                    <input
                        type="text"
                        className="form-control w-50"
                        placeholder="Search for Quiz"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    {isFaculty && (
                        <button
                            className="btn btn-danger"
                            onClick={handleAddClick}
                        >
                            <FaPlus className="me-1" /> Quiz
                        </button>
                    )}
                </div>
            </div>

            <div className="mb-3">
                <h4>Assignment Quizzes</h4>
            </div>

            <div className="list-group">
                {courseQuizzes.length === 0 ? (
                    <div className="alert alert-info">
                        No quizzes found.
                    </div>
                ) : (
                    courseQuizzes.map((quiz: any) => (
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
                            {isFaculty && (
                                <div className="ms-3 d-flex align-items-center gap-2">
                                    <button
                                        className="btn btn-link text-danger p-0"
                                        type="button"
                                        onClick={() => handleDeleteClick(quiz._id)}
                                    >
                                        <FaTrash />
                                    </button>
                                    <KebabMenu items={[{ label: "Edit", onClick: () => handleEditClick(quiz) }]} />
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>

            {showModal && (
                <QuizModal
                    show={showModal}
                    onClose={() => {
                        setShowModal(false);
                        setEditingQuiz(null);
                    }}
                    onSave={handleSave}
                    quiz={editingQuiz}
                    editMode={editMode}
                />
            )}
        </div>
    );
}