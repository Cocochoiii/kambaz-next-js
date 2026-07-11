import { isToday, isYesterday, startOfWeek, endOfWeek, format, subWeeks, isWithinInterval } from "date-fns";

// A Pazza "instructor" is any non-student role.
export const isInstructorRole = (role?: string) => (role || "").toUpperCase() !== "STUDENT";

// Strip HTML tags down to plain text (used for list previews).
export const stripHtml = (html: string) => {
    if (typeof document === "undefined") return (html || "").replace(/<[^>]+>/g, " ");
    const d = document.createElement("div");
    d.innerHTML = html || "";
    return d.textContent || d.innerText || "";
};

// A short one-line preview of a post's details.
export const preview = (html: string, max = 160) => {
    const t = stripHtml(html).replace(/\s+/g, " ").trim();
    return t.length > max ? t.slice(0, max) + "…" : t;
};

// A compact date/time label for posts and comments.
export const timeLabel = (iso?: string) => {
    if (!iso) return "";
    return new Date(iso).toLocaleString(undefined, {
        month: "short", day: "numeric", hour: "2-digit", minute: "2-digit",
    });
};

export type PostGroup = { key: string; label: string; posts: any[] };

// Group posts (reverse chronological) into Today / Yesterday / Last Week / weekly ranges.
export const groupPosts = (posts: any[]): PostGroup[] => {
    const groups: PostGroup[] = [];
    const push = (key: string, label: string, p: any) => {
        let g = groups.find((x) => x.key === key);
        if (!g) { g = { key, label, posts: [] }; groups.push(g); }
        g.posts.push(p);
    };
    const now = new Date();
    const lwStart = startOfWeek(subWeeks(now, 1), { weekStartsOn: 1 });
    const lwEnd = endOfWeek(subWeeks(now, 1), { weekStartsOn: 1 });
    posts.forEach((p) => {
        const d = new Date(p.createdAt);
        if (isToday(d)) return push("today", "Today", p);
        if (isYesterday(d)) return push("yesterday", "Yesterday", p);
        if (isWithinInterval(d, { start: lwStart, end: lwEnd })) return push("lastweek", "Last Week", p);
        const ws = startOfWeek(d, { weekStartsOn: 1 });
        const we = endOfWeek(d, { weekStartsOn: 1 });
        push(format(ws, "yyyy-MM-dd"), `${format(ws, "M/d")} - ${format(we, "M/d")}`, p);
    });
    return groups;
};
