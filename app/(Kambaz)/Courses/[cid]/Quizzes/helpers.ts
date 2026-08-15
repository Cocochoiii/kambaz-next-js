// Small helpers the quiz screens share.

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
                "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

// The dates look like 2025-09-15. I cut the text myself, so the
// server and the browser always show the same day.
export function shortDate(date?: string) {
  if (!date) { return "-"; }
  const [, month, day] = date.slice(0, 10).split("-");
  return `${MONTHS[Number(month) - 1]} ${Number(day)}`;
}

export function longDate(date?: string) {
  if (!date) { return "-"; }
  const [year, month, day] = date.slice(0, 10).split("-");
  return `${MONTHS[Number(month) - 1]} ${Number(day)}, ${year}`;
}

// My old seed rows keep a count in questions, not a list.
// So I ask for the list only when it really is a list.
export function questionsOf(quiz: any): any[] {
  return quiz && Array.isArray(quiz.questions) ? quiz.questions : [];
}

export function questionCount(quiz: any): number {
  const questions = questionsOf(quiz);
  if (questions.length > 0) { return questions.length; }
  return typeof quiz?.questions === "number" ? quiz.questions : 0;
}

// The points of a quiz are the points of all its questions.
export function totalPoints(quiz: any): number {
  const questions = questionsOf(quiz);
  if (questions.length > 0) {
    return questions.reduce((sum, q) => sum + (Number(q.points) || 0), 0);
  }
  return Number(quiz?.points) || 0;
}

// A missing field counts as published, the same way Assignments does it.
// A new quiz always arrives with published false.
export function isPublished(quiz: any): boolean {
  return quiz?.published !== false;
}

// Today as 2025-09-15. Two of these strings compare in the right order.
function today() {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${now.getFullYear()}-${month}-${day}`;
}

// Closed, Available, or Not available until a day.
export function availability(quiz: any) {
  const now = today();
  const from = quiz?.availableDate ? quiz.availableDate.slice(0, 10) : "";
  const until = quiz?.untilDate ? quiz.untilDate.slice(0, 10) : "";
  if (from && now < from) {
    return { state: "notyet", label: `Not available until ${shortDate(from)}` };
  }
  if (until && now > until) {
    return { state: "closed", label: "Closed" };
  }
  return { state: "available", label: "Available" };
}

// How many times a student may take this quiz.
export function attemptLimit(quiz: any): number {
  if (!quiz?.multipleAttempts) { return 1; }
  return Number(quiz.howManyAttempts) || 1;
}

// A new id for a question or a choice.
// The book makes an id from the clock.
// The counter keeps two ids of the same millisecond apart.
let counter = 0;
export function newId(): string {
  counter = counter + 1;
  return `${new Date().getTime()}-${counter}`;
}
