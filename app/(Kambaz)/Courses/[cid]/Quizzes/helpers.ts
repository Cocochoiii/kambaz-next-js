// Quiz helpers: question totals, availability status, date formatting.

export const questionsOf = (quiz: any): any[] =>
    Array.isArray(quiz?.questions) ? quiz.questions : [];

export const totalPoints = (quiz: any): number => {
    const qs = questionsOf(quiz);
    if (qs.length) return qs.reduce((sum, q) => sum + (Number(q.points) || 0), 0);
    return Number(quiz?.points) || 0;
};

export const questionCount = (quiz: any): number => {
    const qs = questionsOf(quiz);
    if (qs.length) return qs.length;
    return typeof quiz?.questions === "number" ? quiz.questions : 0;
};

export const fmtDate = (d?: string): string => {
    if (!d) return "";
    const dt = new Date(d);
    if (isNaN(dt.getTime())) return d;
    return dt.toLocaleString(undefined, { month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit" });
};

// Tell if the quiz is open now, not open yet, or already closed.
export const availability = (quiz: any): { label: string; state: string } => {
    const now = new Date();
    const from = quiz?.availableDate ? new Date(quiz.availableDate) : null;
    const until = quiz?.untilDate ? new Date(quiz.untilDate) : null;
    if (from && !isNaN(from.getTime()) && now < from) return { label: `Not available until ${fmtDate(quiz.availableDate)}`, state: "notyet" };
    if (until && !isNaN(until.getTime()) && now > until) return { label: "Closed", state: "closed" };
    return { label: "Available", state: "available" };
};
