"use client";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useParams, useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import * as client from "../../client";
import "../../quiz-styles.css";

const ReactQuill: any = dynamic(() => import("react-quill"), { ssr: false });

export default function QuizEditorPage() {
  const { cid, qid } = useParams<{ cid: string; qid: string }>();
  const router = useRouter();
  const { currentUser } = useSelector((s: any) => s.accountReducer);

  const [active, setActive] = useState<"DETAILS" | "QUESTIONS">("DETAILS");
  const [quiz, setQuiz] = useState<any>(null);
  const [questions, setQuestions] = useState<any[]>([]);
  const [editingQuestion, setEditingQuestion] = useState<any>(null);
  const [showNewQuestion, setShowNewQuestion] = useState(false);

  const load = async () => {
    try {
      const data = await client.getQuiz(qid!);
      setQuiz(data.quiz);
      setQuestions(data.questions);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => { load(); }, [qid]);

  if (!quiz) return <div className="container mt-4">Loading…</div>;

  const totalPoints = questions.reduce((sum, q) => sum + (q.points || 0), 0);
  const updateField = (k: string, v: any) => setQuiz({ ...quiz, [k]: v });

  const saveDetails = async (publish = false) => {
    try {
      const payload = { ...quiz, points: totalPoints, ...(publish ? { published: true } : {}) };
      const updated = await client.updateQuiz(payload);
      setQuiz(updated);
      router.push(publish ? `/Courses/${cid}/Quizzes` : `/Courses/${cid}/Quizzes/${qid}`);
    } catch (err) {
      console.error(err);
    }
  };

  const addQuestion = async (q: any) => {
    try {
      const created = await client.addQuestion(qid!, q);
      setQuestions([...questions, created]);
      setShowNewQuestion(false);
    } catch (err) {
      console.error(err);
    }
  };

  const updateQuestion = async (q: any) => {
    try {
      const u = await client.updateQuestion(qid!, q._id, q);
      setQuestions(questions.map((x) => (x._id === u._id ? u : x)));
      setEditingQuestion(null);
    } catch (err) {
      console.error(err);
    }
  };

  const deleteQuestion = async (id: string) => {
    if (!confirm("Are you sure you want to delete this question?")) return;
    try {
      await client.deleteQuestion(qid!, id);
      setQuestions(questions.filter((q) => q._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const DetailsTab = () => (
      <div className="quiz-editor-content">
        <div className="mb-3">
          <label className="form-label">Title</label>
          <input className="form-control canvas-input" value={quiz.title} onChange={(e) => updateField("title", e.target.value)} />
        </div>

        <div className="mb-3">
          <label className="form-label">Quiz Instructions:</label>
          <div className="canvas-rich-editor">
            <ReactQuill theme="snow" value={quiz.description} onChange={(html: string) => updateField("description", html)} />
          </div>
        </div>

        <div className="row">
          <div className="col-md-6 mb-3">
            <label className="form-label">Quiz Type</label>
            <select className="form-select canvas-select" value={quiz.type} onChange={(e) => updateField("type", e.target.value)}>
              <option>Graded Quiz</option><option>Practice Quiz</option>
              <option>Graded Survey</option><option>Ungraded Survey</option>
            </select>
          </div>
          <div className="col-md-6 mb-3">
            <label className="form-label">Assignment Group</label>
            <select className="form-select canvas-select" value={quiz.assignmentGroup} onChange={(e) => updateField("assignmentGroup", e.target.value)}>
              <option>Quizzes</option><option>Exams</option>
              <option>Assignments</option><option>Project</option>
            </select>
          </div>
        </div>

        <h5 className="mt-4 mb-3" style={{ fontSize: '16px', fontWeight: '500' }}>Options</h5>

        <div className="options-container">
          <div className="row">
            <div className="col-md-4 mb-3">
              <div className="form-check">
                <input type="checkbox" className="form-check-input" id="shuffleAnswers"
                       checked={quiz.shuffleAnswers}
                       onChange={(e) => updateField("shuffleAnswers", e.target.checked)} />
                <label className="form-check-label" htmlFor="shuffleAnswers">Shuffle Answers</label>
              </div>
            </div>
            <div className="col-md-4 mb-3">
              <div className="d-flex align-items-center">
                <input type="checkbox" className="form-check-input me-2" id="timeLimit"
                       checked={!!quiz.timeLimit}
                       onChange={(e) => updateField("timeLimit", e.target.checked ? 20 : 0)} />
                <label className="form-check-label me-2" htmlFor="timeLimit">Time Limit</label>
                {quiz.timeLimit > 0 && (
                    <div className="d-flex align-items-center">
                      <input type="number" className="form-control form-control-sm" style={{ width: '70px' }}
                             min={0} value={quiz.timeLimit}
                             onChange={(e) => updateField("timeLimit", Number(e.target.value) || 0)} />
                      <span className="ms-1">Minutes</span>
                    </div>
                )}
              </div>
            </div>
            <div className="col-md-4 mb-3">
              <div className="form-check">
                <input type="checkbox" className="form-check-input" id="multipleAttempts"
                       checked={quiz.multipleAttempts}
                       onChange={(e) => updateField("multipleAttempts", e.target.checked)} />
                <label className="form-check-label" htmlFor="multipleAttempts">Allow Multiple Attempts</label>
              </div>
            </div>
          </div>

          {quiz.multipleAttempts && (
              <div className="row">
                <div className="col-md-4 mb-3">
                  <label className="form-label">How Many Attempts</label>
                  <input type="number" min={1} className="form-control canvas-input"
                         value={quiz.allowedAttempts || 1}
                         onChange={(e) => updateField("allowedAttempts", Number(e.target.value) || 1)} />
                </div>
              </div>
          )}

          <div className="row">
            <div className="col-md-4 mb-3">
              <label className="form-label">Show Correct Answers</label>
              <select className="form-select canvas-select" value={quiz.showCorrectAnswers}
                      onChange={(e) => updateField("showCorrectAnswers", e.target.value)}>
                <option>Immediately</option><option>After Last Attempt</option><option>Never</option>
              </select>
            </div>
            <div className="col-md-4 mb-3">
              <label className="form-label">Access Code</label>
              <input className="form-control canvas-input" placeholder="Leave blank for no access code"
                     value={quiz.accessCode || ""}
                     onChange={(e) => updateField("accessCode", e.target.value)} />
            </div>
            <div className="col-md-4 mb-3">
              <div className="form-check">
                <input type="checkbox" className="form-check-input" id="oneQuestion"
                       checked={quiz.oneQuestionAtATime}
                       onChange={(e) => updateField("oneQuestionAtATime", e.target.checked)} />
                <label className="form-check-label" htmlFor="oneQuestion">One Question at a Time</label>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-md-4 mb-3">
              <div className="form-check">
                <input type="checkbox" className="form-check-input" id="webcam"
                       checked={quiz.webcamRequired}
                       onChange={(e) => updateField("webcamRequired", e.target.checked)} />
                <label className="form-check-label" htmlFor="webcam">Webcam Required</label>
              </div>
            </div>
            <div className="col-md-4 mb-3">
              <div className="form-check">
                <input type="checkbox" className="form-check-input" id="lockQuestions"
                       checked={quiz.lockQuestionsAfterAnswering}
                       onChange={(e) => updateField("lockQuestionsAfterAnswering", e.target.checked)} />
                <label className="form-check-label" htmlFor="lockQuestions">Lock Questions After Answering</label>
              </div>
            </div>
          </div>
        </div>

        <h5 className="mt-4 mb-3" style={{ fontSize: '16px', fontWeight: '500' }}>Assign</h5>

        <div className="assign-container p-3" style={{ backgroundColor: '#f8f9fa', border: '1px solid #dee2e6', borderRadius: '3px' }}>
          <div className="mb-3">
            <label className="form-label">Assign to</label>
            <div className="assign-badge">Everyone</div>
          </div>

          <div className="row">
            <div className="col-md-4 mb-3">
              <label className="form-label">Due</label>
              <input type="datetime-local" className="form-control canvas-input"
                     value={quiz.dueDate ? new Date(quiz.dueDate).toISOString().slice(0, 16) : ""}
                     onChange={(e) => updateField("dueDate", e.target.value ? new Date(e.target.value) : null)} />
            </div>
            <div className="col-md-4 mb-3">
              <label className="form-label">Available from</label>
              <input type="datetime-local" className="form-control canvas-input"
                     value={quiz.availableDate ? new Date(quiz.availableDate).toISOString().slice(0, 16) : ""}
                     onChange={(e) => updateField("availableDate", e.target.value ? new Date(e.target.value) : null)} />
            </div>
            <div className="col-md-4 mb-3">
              <label className="form-label">Until</label>
              <input type="datetime-local" className="form-control canvas-input"
                     value={quiz.untilDate ? new Date(quiz.untilDate).toISOString().slice(0, 16) : ""}
                     onChange={(e) => updateField("untilDate", e.target.value ? new Date(e.target.value) : null)} />
            </div>
          </div>
        </div>

        <div className="mt-4 d-flex gap-2">
          <button className="btn btn-canvas-secondary" onClick={() => router.push(`/Courses/${cid}/Quizzes`)}>Cancel</button>
          <button className="btn btn-canvas-secondary" onClick={() => saveDetails(false)}>Save</button>
          <button className="btn btn-canvas-primary" onClick={() => saveDetails(true)}>Save & Publish</button>
        </div>
      </div>
  );

  const QuestionsTab = () => (
      <div className="quiz-questions-content">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h5 style={{ fontSize: '16px', fontWeight: '500' }}>Questions ({questions.length}) • {totalPoints} pts</h5>
          {!showNewQuestion && !editingQuestion && (
              <button className="btn btn-canvas-primary btn-sm" onClick={() => setShowNewQuestion(true)}>
                + New Question
              </button>
          )}
        </div>

        {questions.length === 0 && !showNewQuestion && (
            <div className="alert alert-light text-center py-4">
              No questions yet. Click "New Question" to add your first question.
            </div>
        )}

        <div className="questions-list">
          {questions.map((q, idx) => (
              <div key={q._id} className="question-list-item">
                <div className="question-number">{idx + 1}</div>
                <div className="question-content">
                  <div className="question-header">
                    <span className="question-title">{q.title || `Question ${idx + 1}`}</span>
                    <span className="question-type-badge">{q.type.replace("_", " ")}</span>
                  </div>
                  <div className="question-preview" dangerouslySetInnerHTML={{
                    __html: q.prompt.length > 100 ? q.prompt.substring(0, 100) + '...' : q.prompt
                  }} />
                  <div className="question-meta">
                    <span className="points-badge">{q.points} pts</span>
                  </div>
                </div>
                <div className="question-actions">
                  <button className="btn btn-link btn-sm" onClick={() => setEditingQuestion(q)}>Edit</button>
                  <button className="btn btn-link btn-sm text-danger" onClick={() => deleteQuestion(q._id)}>Delete</button>
                </div>
              </div>
          ))}
        </div>

        {(showNewQuestion || editingQuestion) && (
            <QuestionEditor
                question={editingQuestion}
                onSave={(q) => (editingQuestion ? updateQuestion(q) : addQuestion(q))}
                onCancel={() => { setEditingQuestion(null); setShowNewQuestion(false); }}
            />
        )}
      </div>
  );

  return (
      <div className="container-fluid px-4" style={{ maxWidth: '1000px' }}>
        <h3 className="mb-4" style={{ fontSize: '1.75rem', fontWeight: '400' }}>Edit Quiz</h3>

        <div className="d-flex justify-content-between align-items-center mb-3">
          <div>
            <span className="text-muted">Points:</span> <strong>{totalPoints}</strong>
            {" • "}
            <span className={quiz.published ? 'text-success' : 'text-muted'}>
              {quiz.published ? '✓ Published' : '○ Not Published'}
            </span>
          </div>
        </div>

        <ul className="nav nav-tabs quiz-editor-tabs">
          <li className="nav-item">
            <button className={`nav-link ${active === "DETAILS" ? "active" : ""}`}
                    onClick={() => setActive("DETAILS")}>
              Details
            </button>
          </li>
          <li className="nav-item">
            <button className={`nav-link ${active === "QUESTIONS" ? "active" : ""}`}
                    onClick={() => setActive("QUESTIONS")}>
              Questions
            </button>
          </li>
        </ul>

        <div className="quiz-editor-body">
          {active === "DETAILS" ? <DetailsTab /> : <QuestionsTab />}
        </div>
      </div>
  );
}

function QuestionEditor({ question, onSave, onCancel }: { question: any; onSave: (q: any) => void; onCancel: () => void }) {
  const ReactQuill: any = dynamic(() => import("react-quill"), { ssr: false });

  const [type, setType] = useState<string>(question?.type || "MULTIPLE_CHOICE");
  const [title, setTitle] = useState<string>(question?.title || "");
  const [points, setPoints] = useState<number>(question?.points || 1);
  const [prompt, setPrompt] = useState<string>(question?.prompt || "");
  const [choices, setChoices] = useState<any[]>(
      question?.type === "MULTIPLE_CHOICE" && question.choices
          ? question.choices.map((c: any) => ({ ...c }))
          : [
            { _id: crypto.randomUUID(), text: "Choice A", correct: true },
            { _id: crypto.randomUUID(), text: "Choice B", correct: false },
          ]
  );
  const [trueFalseAnswer, setTrueFalseAnswer] = useState<boolean>(question?.correctAnswer ?? true);
  const [fillAnswers, setFillAnswers] = useState<string[]>(
      question?.type === "FILL_BLANK" && question.correctAnswers ? question.correctAnswers : [""]
  );

  const addChoice = () => setChoices([...choices, { _id: crypto.randomUUID(), text: "", correct: false }]);
  const updateChoiceText = (id: string, text: string) => setChoices(choices.map((c) => (c._id === id ? { ...c, text } : c)));
  const markChoiceCorrect = (id: string) => setChoices(choices.map((c) => ({ ...c, correct: c._id === id })));
  const removeChoice = (id: string) => setChoices(choices.filter((c) => c._id !== id));

  const addFill = () => setFillAnswers([...fillAnswers, ""]);
  const setFill = (i: number, v: string) => setFillAnswers(fillAnswers.map((a, idx) => (idx === i ? v : a)));
  const removeFill = (i: number) => setFillAnswers(fillAnswers.filter((_, idx) => idx !== i));

  const save = () => {
    const base = { _id: question?._id, title, points: Number(points), prompt, type };
    if (type === "MULTIPLE_CHOICE") onSave({ ...base, choices: choices.map((c) => ({ _id: c._id, text: c.text, correct: c.correct })) });
    if (type === "TRUE_FALSE") onSave({ ...base, correctAnswer: !!trueFalseAnswer });
    if (type === "FILL_BLANK") onSave({ ...base, correctAnswers: fillAnswers.filter((x) => x.trim()) });
  };

  return (
      <div className="question-editor">
        <div className="question-editor-header">
          <input className="form-control question-title-input" placeholder="Question Title"
                 value={title} onChange={(e) => setTitle(e.target.value)} />
          <select className="form-select question-type-select" value={type} onChange={(e) => setType(e.target.value)}>
            <option value="MULTIPLE_CHOICE">Multiple Choice</option>
            <option value="TRUE_FALSE">True/False</option>
            <option value="FILL_BLANK">Fill in the Blank</option>
          </select>
          <div className="points-input-group">
            <span>pts:</span>
            <input type="number" className="form-control points-input" min={1}
                   value={points} onChange={(e) => setPoints(parseInt(e.target.value) || 1)} />
          </div>
        </div>

        <div className="mb-3">
          <label className="form-label">Question:</label>
          <div className="canvas-rich-editor">
            <ReactQuill theme="snow" value={prompt} onChange={(html: string) => setPrompt(html)} />
          </div>
        </div>

        {type === "MULTIPLE_CHOICE" && (
            <div className="mb-3">
              <label className="form-label">Answers:</label>
              {choices.map((c) => (
                  <div key={c._id} className="choice-input-group">
                    <input type="radio" name="correctChoice" checked={!!c.correct}
                           onChange={() => markChoiceCorrect(c._id)} />
                    <span className={c.correct ? "correct-answer-label" : "possible-answer-label"}>
                      {c.correct ? "Correct Answer" : "Possible Answer"}
                    </span>
                    <input className="form-control choice-text-input" placeholder="Enter answer text"
                           value={c.text} onChange={(e) => updateChoiceText(c._id, e.target.value)} />
                    <button className="btn btn-link btn-sm text-muted" onClick={() => removeChoice(c._id)}
                            disabled={choices.length <= 2}>
                      <span style={{ fontSize: '20px' }}>×</span>
                    </button>
                  </div>
              ))}
              <button className="btn btn-link btn-sm add-answer-btn" onClick={addChoice}>
                + Add Another Answer
              </button>
            </div>
        )}

        {type === "TRUE_FALSE" && (
            <div className="mb-3">
              <label className="form-label">Answers:</label>
              <div className="true-false-options">
                <div className={`true-false-option ${trueFalseAnswer === true ? 'correct' : ''}`}>
                  <input type="radio" checked={trueFalseAnswer === true}
                         onChange={() => setTrueFalseAnswer(true)} />
                  <span className="correct-answer-label">True</span>
                </div>
                <div className={`true-false-option ${trueFalseAnswer === false ? 'correct' : ''}`}>
                  <input type="radio" checked={trueFalseAnswer === false}
                         onChange={() => setTrueFalseAnswer(false)} />
                  <span className="correct-answer-label">False</span>
                </div>
              </div>
            </div>
        )}

        {type === "FILL_BLANK" && (
            <div className="mb-3">
              <label className="form-label">Answers:</label>
              {fillAnswers.map((a, idx) => (
                  <div key={idx} className="fill-answer-group">
                    <span className="possible-answer-label">Possible Answer:</span>
                    <input className="form-control fill-answer-input" placeholder="Enter acceptable answer"
                           value={a} onChange={(e) => setFill(idx, e.target.value)} />
                    <button className="btn btn-link btn-sm text-muted" onClick={() => removeFill(idx)}
                            disabled={fillAnswers.length <= 1}>
                      <span style={{ fontSize: '20px' }}>×</span>
                    </button>
                  </div>
              ))}
              <button className="btn btn-link btn-sm add-answer-btn" onClick={addFill}>
                + Add Another Answer
              </button>
            </div>
        )}

        <div className="question-editor-actions">
          <button className="btn btn-canvas-secondary" onClick={onCancel}>Cancel</button>
          <button className="btn btn-canvas-primary" onClick={save}>
            {question ? "Update Question" : "Save"}
          </button>
        </div>
      </div>
  );
}