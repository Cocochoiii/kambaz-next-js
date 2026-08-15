"use client";

// The Questions tab of the Quiz Editor.
// A new question lands at the bottom of the list in preview mode.
// Edit opens one question. The list is saved with the quiz.
import { useState } from "react";
import { Button } from "react-bootstrap";
import { FaPlus, FaTrash } from "react-icons/fa6";
import QuestionEditor from "./QuestionEditor";
import { newId, questionsOf, totalPoints } from "../../helpers";

// The name of a type, for the preview card.
function typeName(type: string) {
  if (type === "TRUE_FALSE") { return "True/False"; }
  if (type === "FILL_BLANK") { return "Fill in the Blank"; }
  return "Multiple Choice";
}

// A brand new question. Multiple choice is the default type.
function blankQuestion() {
  return {
    _id: newId(),
    type: "MULTIPLE_CHOICE",
    title: "New Question",
    points: 1,
    question: "",
    choices: [
      { _id: newId(), text: "", correct: true },
      { _id: newId(), text: "", correct: false },
    ],
    correctAnswer: true,
    answers: [""],
  };
}

export default function QuestionsTab({
  quiz,
  setQuiz,
}: {
  quiz: any;
  setQuiz: (quiz: any) => void;
}) {
  const questions = questionsOf(quiz);
  // Only one question is open at a time. Null means none is open.
  const [editingId, setEditingId] = useState<string | null>(null);

  // The points of the quiz follow the points of the questions.
  const setQuestions = (list: any[]) => {
    const points = list.reduce((sum, q) => sum + (Number(q.points) || 0), 0);
    setQuiz({ ...quiz, questions: list, points });
  };

  const addQuestion = () => {
    setQuestions([...questions, blankQuestion()]);
  };

  const saveQuestion = (question: any) => {
    setQuestions(questions.map((q: any) => (q._id === question._id ? question : q)));
    setEditingId(null);
  };

  const removeQuestion = (questionId: string) => {
    if (window.confirm("Are you sure you want to remove this question?")) {
      setQuestions(questions.filter((q: any) => q._id !== questionId));
    }
  };

  return (
    <div id="wd-quiz-questions">
      <p className="fw-bold">Points {totalPoints(quiz)}</p>

      {questions.length === 0 && (
        <p className="text-muted">
          There are no questions yet. Click + New Question to add one.
        </p>
      )}

      {questions.map((question: any) => (
        <div key={question._id} className="border mb-3">
          {editingId === question._id ? (
            <QuestionEditor
              question={question}
              onSave={saveQuestion}
              onCancel={() => setEditingId(null)}
            />
          ) : (
            <>
              {/* The preview card a new question shows first. */}
              <div className="bg-secondary p-2 d-flex align-items-center">
                <b className="flex-fill">
                  {question.title} <span className="fw-normal">
                    ({typeName(question.type)})
                  </span>
                </b>
                <span className="me-3">{Number(question.points) || 0} pts</span>
                <Button
                  size="sm"
                  variant="secondary"
                  className="me-2"
                  onClick={() => setEditingId(question._id)}
                >
                  Edit
                </Button>
                <FaTrash
                  role="button"
                  aria-label="Delete question"
                  className="text-danger"
                  onClick={() => removeQuestion(question._id)}
                />
              </div>
              <div className="p-3">
                <div
                  dangerouslySetInnerHTML={{ __html: question.question || "" }}
                />
              </div>
            </>
          )}
        </div>
      ))}

      <div className="text-center">
        <Button id="wd-new-question-btn" variant="secondary" onClick={addQuestion}>
          <FaPlus className="me-2" />
          New Question
        </Button>
      </div>
    </div>
  );
}
