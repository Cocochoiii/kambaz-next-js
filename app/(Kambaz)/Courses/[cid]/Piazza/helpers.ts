// Small helpers every Pazza screen shares.

// In Pazza anyone who is not a student counts as an instructor.
// So a TA can answer in the instructor section too.
export function isInstructorRole(role?: string): boolean {
    const name = (role || "").toUpperCase();
    return name !== "" && name !== "STUDENT";
}

// The person at the keyboard. Student View turns a teacher into a student.
export function isPazzaInstructor(currentUser: any, viewAsStudent?: boolean): boolean {
    return isInstructorRole(currentUser?.role) && !viewAsStudent;
}

// The name Pazza prints next to a post.
export function displayName(user: any): string {
    const full = [user?.firstName, user?.lastName].filter(Boolean).join(" ");
    return full || user?.username || user?._id || "User";
}

// The details are HTML, so I cut the tags for the list preview.
export function stripHtml(html?: string): string {
    if (!html) { return ""; }
    if (typeof document === "undefined") {
        return html.replace(/<[^>]+>/g, " ");
    }
    const box = document.createElement("div");
    box.innerHTML = html;
    return box.textContent || "";
}

// One short line of the post body.
export function preview(html?: string, max = 140): string {
    const text = stripHtml(html).replace(/\s+/g, " ").trim();
    return text.length > max ? `${text.slice(0, max)}...` : text;
}

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
                "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

// A short stamp like "Mar 4, 10:15 AM".
export function timeLabel(iso?: string): string {
    if (!iso) { return ""; }
    const date = new Date(iso);
    if (Number.isNaN(date.getTime())) { return ""; }
    const month = MONTHS[date.getMonth()];
    const day = date.getDate();
    let hour = date.getHours();
    const half = hour < 12 ? "AM" : "PM";
    hour = hour % 12;
    if (hour === 0) { hour = 12; }
    const minute = String(date.getMinutes()).padStart(2, "0");
    return `${month} ${day}, ${hour}:${minute} ${half}`;
}

// Midnight of a date. I compare days, not clock times.
function startOfDay(date: Date): Date {
    const copy = new Date(date);
    copy.setHours(0, 0, 0, 0);
    return copy;
}

// The Monday of the week a date falls in.
function startOfWeek(date: Date): Date {
    const copy = startOfDay(date);
    const weekday = (copy.getDay() + 6) % 7;
    copy.setDate(copy.getDate() - weekday);
    return copy;
}

function addDays(date: Date, days: number): Date {
    const copy = new Date(date);
    copy.setDate(copy.getDate() + days);
    return copy;
}

function monthDay(date: Date): string {
    return `${date.getMonth() + 1}/${date.getDate()}`;
}

export type PostGroup = { key: string; label: string; posts: any[] };

// The sidebar shows Today, then Yesterday, then Last Week.
// An older post lands in a group named after its week.
// That name looks like 3/3 - 3/9.
export function groupPosts(posts: any[]): PostGroup[] {
    const groups: PostGroup[] = [];
    const push = (key: string, label: string, post: any) => {
        let group = groups.find((one) => one.key === key);
        if (!group) {
            group = { key, label, posts: [] };
            groups.push(group);
        }
        group.posts.push(post);
    };

    const today = startOfDay(new Date());
    const yesterday = addDays(today, -1);
    const thisWeek = startOfWeek(today);
    const lastWeek = addDays(thisWeek, -7);

    posts.forEach((post) => {
        const made = new Date(post.createdAt);
        const day = startOfDay(made);
        if (day.getTime() === today.getTime()) {
            push("today", "Today", post);
        } else if (day.getTime() === yesterday.getTime()) {
            push("yesterday", "Yesterday", post);
        } else if (day >= lastWeek && day < thisWeek) {
            push("lastweek", "Last Week", post);
        } else {
            const weekStart = startOfWeek(made);
            const weekEnd = addDays(weekStart, 6);
            const key = weekStart.toISOString().slice(0, 10);
            push(key, `${monthDay(weekStart)} - ${monthDay(weekEnd)}`, post);
        }
    });

    return groups;
}
