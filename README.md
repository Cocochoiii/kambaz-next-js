# Kambaz - Next.js (A3)

CS5610 Web Development, Fall 2025, Section 04. Coco Choi.

This branch is the A3 work, that is Chapter 3 of *Developing Full Stack MERN
Web Applications*. Lab 3 practices JavaScript and React, and the Kambaz screens
are now data driven: they read their content from the JSON files in
`app/(Kambaz)/Database`.

## Run it

```bash
npm install
npm run dev
```

Then open http://localhost:3000. The landing page is Kambaz. The menu on the
left has a Labs link, and `/Labs` lists Lab 1, Lab 2, and Lab 3.

## Folders

- `app/(Kambaz)` - the Kambaz application (Account, Dashboard, Courses, ...)
- `app/(Kambaz)/Database` - courses, modules, assignments, users, enrollments,
  announcements, and quizzes as JSON
- `app/Labs` - the lab exercises for chapters 1 to 3
