"use client";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useParams, useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import * as client from "../../client";

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
    try {
      await client.deleteQuestion(qid!, id);
      setQuestions(questions.filter((q) => q._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const DetailsTab = () => (
      <div className="mb-5">
        <h5 className="mb-3">Quiz Details</h5>

        <div className="mb-3">
          <label className="form-label">Title</label>
          <input className="form-control" value={quiz.title} onChange={(e) => updateField("title", e.target.value)} />
        </div>

        <div className="mb-3">
          <label className="form-label">Description</label>
          <ReactQuill theme="snow" value={quiz.description} onChange={(html: string) => updateField("description", html)} />
        </div>

        <div className="row">
          <div className="col-md-6 mb-3">
            <label className="form-label">Quiz Type</label>
            <select className="form-select" value={quiz.type} onChange={(e) => updateField("type", e.target.value)}>
              <option>Graded Quiz</option><option>Practice Quiz</option>
              <option>Graded Survey</option><option>Ungraded Survey</option>
            </select>
          </div>
          <div className="col-md-6 mb-3">
            <label className="form-label">Assignment Group</label>
            <select className="form-select" value={quiz.assignmentGroup} onChange={(e) => updateField("assignmentGroup", e.target.value)}>
              <option>Quizzes</option><option>Exams</option>
              <option>Assignments</option><option>Project</option>
            </select>
          </div>
        </div>

        <div className="row">
          <div className="col-md-4 mb-3">
            <label className="form-label">Shuffle Answers</label>
            <select className="form-select" value={quiz.shuffleAnswers ? "Yes" : "No"} onChange={(e) => updateField("shuffleAnswers", e.target.value === "Yes")}>
              <option>Yes</option><option>No</option>
            </select>
          </div>
          <div className="col-md-4 mb-3">
            <label className="form-label">Time Limit (minutes)</label>
            <input type="number" className="form-control" min={0} value={quiz.timeLimit ?? ""} onChange={(e) => updateField("timeLimit", Number(e.target.value) || 0)} />
          </div>
          <div className="col-md-4 mb-3">
            <label className="form-label">Multiple Attempts</label>
            <select className="form-select" value={quiz.multipleAttempts ? "Yes" : "No"} onChange={(e) => updateField("multipleAttempts", e.target.value === "Yes")}>
              <option>Yes</option><option>No</option>
            </select>
          </div>
        </div>

        {quiz.multipleAttempts && (
            <div className="row">
              <div className="col-md-4 mb-3">
                <label className="form-label">Allowed Attempts</label>
                <input type="number" min={1} className="form-control" value={quiz.allowedAttempts || 1} onChange={(e) => updateField("allowedAttempts", Number(e.target.value) || 1)} />
              </div>
            </div>
        )}

        <div className="mb-3">
          <label className="form-label">Show Correct Answers</label>
          <select className="form-select" value={quiz.showCorrectAnswers} onChange={(e) => updateField("showCorrectAnswers", e.target.value)}>
            <option>Immediately</option><option>After Last Attempt</option><option>Never</option>
          </select>
        </div>

        <div className="mb-3">
          <label className="form-label">Access Code</label>
          <input className="form-control" value={quiz.accessCode || ""} onChange={(e) => updateField("accessCode", e.target.value)} />
        </div>

        <div className="row">
          <div className="col-md-4 mb-3">
            <label className="form-label">One Question at a Time</label>
            <select className="form-select" value={quiz.oneQuestionAtATime ? "Yes" : "No"} onChange={(e) => updateField("oneQuestionAtATime", e.target.value === "Yes")}>
              <option>Yes</option><option>No</option>
            </select>
          </div>
          <div className="col-md-4 mb-3">
            <label className="form-label">Webcam Required</label>
            <select className="form-select" value={quiz.webcamRequired ? "Yes" : "No"} onChange={(e) => updateField("webcamRequired", e.target.value === "Yes")}>
              <option>Yes</option><option>No</option>
            </select>
          </div>
          <div className="col-md-4 mb-3">
            <label className="form-label">Lock Questions After Answering</label>
            <select className="form-select" value={quiz.lockQuestionsAfterAnswering ? "Yes" : "No"} onChange={(e) => updateField("lockQuestionsAfterAnswering", e.target.value === "Yes")}>
              <option>Yes</option><option>No</option>
            </select>
          </div>
        </div>

        <div className="row">
          <div className="col-md-4 mb-3">
            <label className="form-label">Due Date</label>
            <input type="datetime-local" className="form-control" value={quiz.dueDate ? new Date(quiz.dueDate).toISOString().slice(0, 16) : ""} onChange={(e) => updateField("dueDate", e.target.value ? new Date(e.target.value) : null)} />
          </div>
          <div className="col-md-4 mb-3">
            <label className="form-label">Available From</label>
            <input type="datetime-local" className="form-control" value={quiz.availableDate ? new Date(quiz.availableDate).toISOString().slice(0, 16) : ""} onChange={(e) => updateField("availableDate", e.target.value ? new Date(e.target.value) : null)} />
          </div>
          <div className="col-md-4 mb-3">
            <label className="form-label">Available Until</label>
            <input type="datetime-local" className="form-control" value={quiz.untilDate ? new Date(quiz.untilDate).toISOString().slice(0, 16) : ""} onChange={(e) => updateField("untilDate", e.target.value ? new Date(e.target.value) : null)} />
          </div>
        </div>

        <div className="mt-4">
          <button className="btn btn-secondary me-2" onClick={() => router.push(`/Courses/${cid}/Quizzes`)}>Cancel</button>
          <button className="btn btn-danger me-2" onClick={() => saveDetails(false)}>Save</button>
          <button className="btn btn-success" onClick={() => saveDetails(true)}>Save & Publish</button>
        </div>
      </div>
  );

  const QuestionsTab = () => (
      <div>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5>Questions ({questions.length}) • {totalPoints} pts</h5>
          {!showNewQuestion && !editingQuestion && (
              <button className="btn btn-danger" onClick={() => setShowNewQuestion(true)}>New Question</button>
          )}
        </div>

        {questions.length === 0 && !showNewQuestion && (
            <div className="alert alert-info">No questions yet. Click "New Question" above.</div>
        )}

        <ul className="list-group mb-3">
          {questions.map((q) => (
              <li key={q._id} className="list-group-item d-flex justify-content-between align-items-start">
                <div className="ms-2 me-auto">
                  <div className="fw-bold">{q.title || q.prompt.substring(0, 30)} ({q.type.replace("_", " ")})</div>
                  <small>{q.points} points</small>
                </div>
                <div>
                  <button className="btn btn-sm btn-outline-secondary me-2" onClick={() => setEditingQuestion(q)}>Edit</button>
                  <button className="btn btn-sm btn-outline-danger" onClick={() => deleteQuestion(q._id)}>Delete</button>
                </div>
              </li>
          ))}
        </ul>

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
      <div className="container mt-4">
        <h3 className="mb-4">Edit Quiz: {quiz.title}</h3>
        <ul className="nav nav-tabs mb-4">
          <li className="nav-item"><button className={`nav-link ${active === "DETAILS" ? "active" : ""}`} onClick={() => setActive("DETAILS")}>Details</button></li>
          <li className="nav-item"><button className={`nav-link ${active === "QUESTIONS" ? "active" : ""}`} onClick={() => setActive("QUESTIONS")}>Questions</button></li>
        </ul>
        {active === "DETAILS" ? <DetailsTab /> : <QuestionsTab />}
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

  const addChoice = () => setChoices([...choices, { _id: crypto.randomUUID(), text: "New Choice", correct: false }]);
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
      <div className="card mt-3">
        <div className="card-body">
          <h5 className="card-title">{question ? "Edit Question" : "New Question"}</h5>

          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="form-label">Type</label>
              <select className="form-select" value={type} onChange={(e) => setType(e.target.value)}>
                <option value="MULTIPLE_CHOICE">Multiple Choice</option>
                <option value="TRUE_FALSE">True/False</option>
                <option value="FILL_BLANK">Fill in the Blank</option>
              </select>
            </div>
            <div className="col-md-3 mb-3">
              <label className="form-label">Points</label>
              <input type="number" className="form-control" min={1} value={points} onChange={(e) => setPoints(parseInt(e.target.value) || 1)} />
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label">Title</label>
            <input className="form-control" value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>

          <div className="mb-3">
            <label className="form-label">Question</label>
            <ReactQuill theme="snow" value={prompt} onChange={(html: string) => setPrompt(html)} />
          </div>

          {type === "MULTIPLE_CHOICE" && (
              <div className="mb-3">
                <label className="form-label">Choices</label>
                {choices.map((c) => (
                    <div key={c._id} className="input-group mb-2">
                      <div className="input-group-text">
                        <input type="radio" name="correctChoice" checked={!!c.correct} onChange={() => markChoiceCorrect(c._id)} />
                      </div>
                      <input className="form-control" value={c.text} onChange={(e) => updateChoiceText(c._id, e.target.value)} />
                      <button className="btn btn-outline-danger" type="button" onClick={() => removeChoice(c._id)} disabled={choices.length <= 2}>✕</button>
                    </div>
                ))}
                <button className="btn btn-sm btn-outline-secondary" onClick={addChoice} type="button">Add Choice</button>
              </div>
          )}

          {type === "TRUE_FALSE" && (
              <div className="mb-3">
                <label className="form-label">Correct Answer</label>
                <div>
                  <label className="me-3"><input type="radio" checked={trueFalseAnswer === true} onChange={() => setTrueFalseAnswer(true)} /> True</label>
                  <label><input type="radio" checked={trueFalseAnswer === false} onChange={() => setTrueFalseAnswer(false)} /> False</label>
                </div>
              </div>
          )}

          {type === "FILL_BLANK" && (
              <div className="mb-3">
                <label className="form-label">Possible Correct Answers</label>
                {fillAnswers.map((a, idx) => (
                    <div key={idx} className="input-group mb-2">
                      <input className="form-control" value={a} onChange={(e) => setFill(idx, e.target.value)} />
                      <button className="btn btn-outline-danger" onClick={() => removeFill(idx)} type="button" disabled={fillAnswers.length <= 1}>✕</button>
                    </div>
                ))}
                <button className="btn btn-sm btn-outline-secondary" onClick={addFill} type="button">Add Answer</button>
              </div>
          )}

          <div className="mt-3">
            <button className="btn btn-secondary me-2" onClick={onCancel}>Cancel</button>
            <button className="btn btn-primary" onClick={save}>{question ? "Update Question" : "Save Question"}</button>
          </div>
        </div>
      </div>
  );
}