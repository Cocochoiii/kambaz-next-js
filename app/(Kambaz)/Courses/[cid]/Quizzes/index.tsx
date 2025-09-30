"use client";

import { useParams } from "next/navigation";
import { BsRocket, BsRocketFill, BsThreeDots } from "react-icons/bs";
import { FaPlus } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import { useState } from "react";
import { addQuiz, deleteQuiz, updateQuiz } from "./reducer";
import QuizModal from "./QuizModal";

export default function Quizzes() {
    const { cid } = useParams<{ cid: string }>();
    const dispatch = useDispatch();
    const [showModal, setShowModal] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [editingQuiz, setEditingQuiz] = useState<any>(null);
    const [searchTerm, setSearchTerm] = useState("");

    const { quizzes } = useSelector((state: any) => state.quizzesReducer);
    const { currentUser } = useSelector((state: any) => state.accountReducer);

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

    const handleDeleteClick = (quizId: string) => {
        if (window.confirm("Are you sure you want to delete this quiz?")) {
            dispatch(deleteQuiz(quizId));
        }
    };

    const handleSave = (quizData: any) => {
        if (editMode) {
            dispatch(updateQuiz(quizData));
        } else {
            dispatch(addQuiz({
                ...quizData,
                course: cid,
            }));
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
                                <div className="dropdown">
                                    <button
                                        className="btn btn-link text-muted p-0"
                                        type="button"
                                        data-bs-toggle="dropdown"
                                        aria-expanded="false"
                                    >
                                        <BsThreeDots />
                                    </button>
                                    <ul className="dropdown-menu">
                                        <li>
                                            <button
                                                className="dropdown-item"
                                                onClick={() => handleEditClick(quiz)}
                                            >
                                                Edit
                                            </button>
                                        </li>
                                        <li>
                                            <button
                                                className="dropdown-item text-danger"
                                                onClick={() => handleDeleteClick(quiz._id)}
                                            >
                                                Delete
                                            </button>
                                        </li>
                                    </ul>
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